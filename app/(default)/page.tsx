import './page.css';

import SystemInfo from '../components/SystemInfo/SystemInfo';
import CpuLoadInfo from '../components/CpuLoadInfo/CpuLoadInfo';
import NetworkMonitor from '../components/NetworkMonitor/NetworkMonitor';
import VolumeUsagePie from '../components/VolumeUsagePie/VolumeUsagePie';
import VolumeUsedSpace from '../components/VolumeUsedSpace/VolumeUsedSpace';
import RamInfo from '../components/RamInfo/RamInfo';


export default async function Home() {
	const pc_data = await fetch("http://localhost:3333/api/sysinfo").then((res) => res.json());
	const cpu_data = await fetch("http://localhost:3333/api/cpudata", { cache: "no-store" }).then((res) => res.json());
	const volume_data = await fetch("http://localhost:3333/api/disksinfo", { cache: "no-store" }).then((res) => res.json());
	const network_info = await fetch("http://localhost:3333/api/network", { cache: "no-store" }).then((res) => res.json());
	console.log("RENDER")
	return (
		<div className='dashboard-main'>
			<div className='pcdata-ram'>
				<SystemInfo pc_data={pc_data} network_info={network_info} />
				{/* <RamInfo /> */}
			</div>
			<div className='dashboard-pc'>
				<CpuLoadInfo />
				<NetworkMonitor network_info={network_info} period={45} />
			</div>
			<div className='dashboard-disks'>
				<VolumeUsagePie volume_data={volume_data} />
				<VolumeUsedSpace volume_data={volume_data} />
			</div>
		</div>
	)
}
