from aiohttp import web
from aiohttp.web import BaseRequest
from aiohttp.web_app import Application
from aiohttp_sse import sse_response
from loguru import logger
from _getip import get_local_ip

import time
import aiohttp_cors
import psutil as ps
import asyncio
import platform
import jwt
import json
import sqlite3
import string
import secrets

loop = asyncio.get_event_loop()
os_type = platform.system()
trusted_keys = []
runners: list[Application] = []

con = sqlite3.connect("users.db")
cur = con.cursor()
if (cur.execute("SELECT name FROM sqlite_master WHERE name='users'")).fetchone() is None:
    cur.execute("CREATE TABLE users(name, password)")
    cur.execute("""
        INSERT INTO users VALUES
            ('admin', 'admin')
    """)
    con.commit()
    logger.info("users.db not found. Creating new database...")


async def start_site(app: Application, host: str = 'localhost', port: int = 8080):
    runner = web.AppRunner(app)
    runners.append(runner)
    await runner.setup()
    site = web.TCPSite(runner, host, port)
    await site.start()


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


async def sysinfo(req: BaseRequest):
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
    logger.debug("sysinfo sent")
    return web.json_response({
        "cpu": cpu_name,
        "ram": f'{int(ram["MemTotal"].replace(" kB", ""))/(1024 * 1024):.2f} GiB',
        "hostname": hostname.strip(),
        "os_sub": " ".join(kernel_ver.split(" ")[:3]),
        "os": os_name["PRETTY_NAME"].replace('"', '')
    })


async def network(req: BaseRequest):
    if os_type != "Windows":
        ipaddr = await run("ip -br -4 a sh")
        interfaces_splitted = [s for s in ipaddr.split("\n") if not s == ""]
        ip_addresses = []
        primary_ip = (await run("hostname -I")).split(" ")[0]
        for iface_line in interfaces_splitted:
            iface_data = [s for s in iface_line.split(" ") if not s == ""]
            adapter, is_up, ip = iface_data
            if adapter == 'lo':
                continue
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
    logger.debug("network info sent")
    return web.json_response(ip_addresses)


async def disks(req: BaseRequest):
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
    logger.debug("disks info sent")
    return web.json_response(drives_usage)


async def scan_cpu_load():
    while 1:
        cpu_usage = await run("echo \"$[100-$(vmstat 1 2|tail -1|awk '{print $15}')]\"")
        cpu_temp = int(await run("cat /sys/class/thermal/thermal_zone0/temp"))/1000
        data = {
            "time": round(time.time()),
            "temp": cpu_temp,
            "usage": cpu_usage
        }
        with open("cpu_stat.txt", "a") as f:
            f.write(json.dumps(data))
        asyncio.sleep(600)


async def cpu_data(req: BaseRequest):
    if os_type != "Windows":
        cpu_usage = await run(""" echo "$[100-$(vmstat 1 2|tail -1|awk '{print $15}')]" """)
        cpu_temp = int(await run("cat /sys/class/thermal/thermal_zone0/temp"))/1000
    else:
        cpu_usage = 47
        cpu_temp = 55
    return web.json_response({"temp": cpu_temp, "usage": cpu_usage})


async def auth(req: BaseRequest):
    data: dict[str, str] = await req.json()
    logger.debug("Perfoming authentication")
    for username, password in cur.execute("SELECT name, password FROM users"):
        if list(data.values()) == [username, password]:
            jwt_key = gen_secure_key()
            trusted_keys.append(jwt_key)
            logger.debug(f"Auth successful for '{username}'")
            return web.json_response({"auth": True, "jwt": jwt_key})
    logger.debug("Attempt to auth failed")
    return web.json_response({"auth": False})


async def net_usage(req: BaseRequest):
    io = ps.net_io_counters(pernic=True)
    try:
        async with sse_response(req) as resp:
            logger.debug("SSE started")
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
                        "up": upload_speed,
                        "down": download_speed,
                    })
                io = io_2
                await resp.send(json.dumps(data))
    except:
        logger.info(f"{req.remote} disconnected from SSE")
    return resp


app = web.Application()
app.add_routes([
    web.post("/api/auth", auth),
    web.get('/api/sysinfo', sysinfo),
    web.get('/api/network', network),
    web.get("/api/disksinfo", disks),
    web.get("/api/cpudata", cpu_data)
])

net_api = web.Application()
net_api.add_routes([
    web.get("/api/netusage", net_usage)
])

cors = aiohttp_cors.setup(net_api, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*"
    )
})

for route in list(net_api.router.routes()):
    cors.add(route)

loop.create_task(start_site(app, port=3333))
loop.create_task(start_site(net_api, host=get_local_ip(), port=2222))
loop.create_task(scan_cpu_load())

if __name__ == '__main__':
    logger.info(f"Starting runners")
    try:
        loop.run_forever()
    except:
        pass
    finally:
        for runner in runners:
            loop.run_until_complete(runner.cleanup())
