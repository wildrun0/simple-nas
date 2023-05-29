import time
from aiohttp_sse import sse_response
import aiohttp_cors
import psutil as ps
import asyncio
import platform
import jwt
import json
import sqlite3
import string
import secrets


from aiohttp import web

os_type = platform.system()
trusted_keys = []

con = sqlite3.connect("users.db")
cur = con.cursor()
if (cur.execute("SELECT name FROM sqlite_master WHERE name='users'")).fetchone() is None:
    cur.execute("CREATE TABLE users(name, password)")
    cur.execute("""
        INSERT INTO users VALUES
            ('admin', 'admin')
    """)
    con.commit()
    print("users.db not found. Creating new database...")


def gen_secure_key(N: int = 10):
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(N))

async def run(cmd: str) -> str:
    proc = await asyncio.create_subprocess_shell(
        cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate()

    if stdout:
        return stdout.decode()
    if stderr:
        return stderr.decode()


async def parse_proc(cmd: str, divider: str = ":") -> dict:
    proc = await run(f"cat {cmd}")
    proc_lines = proc.split("\n")
    dict_proc = {}
    for i in proc_lines:
        if i:
            key, value = i.split(divider)
            dict_proc[key.replace("\t", "")] = value.strip()
    return dict_proc


async def sysinfo(req):
    if os_type != "Windows":
        cpu = await parse_proc("/proc/cpuinfo")
        ram = await parse_proc("/proc/meminfo")
        hostname = await run("cat /etc/hostname")
        kernel_ver = await run("cat /proc/version")
        os_name = await parse_proc("/etc/os-release", "=")
        if "model name" in cpu:
            cpu_name = cpu["model name"]
        else:
            cpu_name = cpu["Model"]
    else:
        cpu_name = "Ryzen 666"
        ram = {"MemTotal": "3884372 kB"}
        hostname = "bebra"
        kernel_ver = " bebbf bsfsdf sdfsfds sdfsdf"
        os_name = {"PRETTY_NAME": '"WINDOWS 12"'}
    return web.json_response({
        "cpu": cpu_name,
        "ram": f'{int(ram["MemTotal"].replace(" kB", ""))/(1024 * 1024):.2f} GiB',
        "hostname": hostname.strip(),
        "os_sub": " ".join(kernel_ver.split(" ")[:3]),
        "os": os_name["PRETTY_NAME"].replace('"', '')
    })


async def network(req):
    if os_type != "Windows":
        ipaddr = await run("ip -br -4 a sh")
        interfaces_splitted = [s for s in ipaddr.split("\n") if not s == ""]
        ip_addresses = []
        primary_ip = (await run("hostname -I")).split(" ")[0]
        for iface_line in interfaces_splitted:
            iface_data = [s for s in iface_line.split(" ") if not s == ""]
            adapter, is_up, ip = iface_data
            ip = ip.split("/")[0]
            ip_addresses.append({
                "iface": adapter,
                "ip": ip,
                "primary": True if primary_ip == ip else False,
                "up_status": is_up
            })
    else:
        ip_addresses = [{"iface": "Ethernet", "ip": "192.168.1.102", "primary": True, "up_status": "UP"}, {
            "iface": "wlan0", "ip": "192.168.0.102", "primary": False, "up_status": "DOWN"}]
    return web.json_response(ip_addresses)


async def disks(req):
    drives_usage = []
    if os_type != "Windows":
        drives = [i for i in ps.disk_partitions(
        ) if "/boot" not in i.mountpoint and i.mountpoint != '/' and i.fstype != "udf"]
        for i in drives:
            drive_info = ps.disk_usage(i.mountpoint)
            drives_usage.append({"name": i.device, "size": drive_info.total,
                                "used": drive_info.used, "use": drive_info.percent})
    else:
        drives_usage.append(
            {"name": "/dev/sdd", "size": 11101010101, "used": 111017010, "use": 53.5})
        drives_usage.append(
            {"name": "/dev/sdb", "size": 11101010101, "used": 999017010, "use": 53.5})
    return web.json_response(drives_usage)


async def cpu_data(req):
    # data = [{ "time": string, "temp": number, "load": number }];
    data = []
    import random
    from datetime import datetime, timedelta
    naive_dt = datetime.now()
    for i in range(0, 30):
        data.append({"time": naive_dt.strftime("%H:%M"), "temp": random.randint(
            50, 99), "load": random.randint(0, 100)})
        new_dt = timedelta(minutes=30)
        naive_dt = naive_dt + new_dt
    return web.json_response(data)


async def auth(req):
    data: dict[str, str] = await req.json()
    for username, password in cur.execute("SELECT name, password FROM users"):
        if list(data.values()) == [username, password]:
            jwt_key = gen_secure_key()
            trusted_keys.append(jwt_key)
            return web.json_response({"auth": True, "jwt": jwt_key})
    return web.json_response({"auth": False})


async def net_usage(request):
    io = ps.net_io_counters(pernic=True)
    async with sse_response(request) as resp:
        while True:
            await asyncio.sleep(1)
            io_2 = ps.net_io_counters(pernic=True)
            data = []
            for iface, iface_io in io.items():
                upload_speed, download_speed = io_2[iface].bytes_sent - \
                    iface_io.bytes_sent, io_2[iface].bytes_recv - \
                    iface_io.bytes_recv
                data.append({
                    "iface": iface,
                    "total_download": io_2[iface].bytes_recv,
                    "total_upload": io_2[iface].bytes_sent,
                    "up": upload_speed / 1,
                    "down": download_speed / 1,
                })
            io = io_2
            await resp.send(json.dumps(data))
    return resp


app = web.Application()
app.add_routes([
    web.get('/api/sysinfo', sysinfo),
    web.get('/api/network', network),
    web.get("/api/disksinfo", disks),
    web.get("/api/cpudata", cpu_data),
    web.post("/api/auth", auth),
    web.get("/api/netusage", net_usage)
])

cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*"
    )
})

for route in list(app.router.routes()):
    cors.add(route)

if __name__ == '__main__':
    web.run_app(app, host='localhost', port=3333)
