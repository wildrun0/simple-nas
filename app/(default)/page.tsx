import './page.css';

import SystemInfo from '../components/SystemInfo/SystemInfo';
import CpuLoadInfo from '../components/CpuLoadInfo/CpuLoadInfo';
import NetworkMonitor from '../components/NetworkMonitor/NetworkMonitor';
import VolumeUsagePie from '../components/VolumeUsagePie/VolumeUsagePie';
import VolumeUsedSpace from '../components/VolumeUsedSpace/VolumeUsedSpace';

// const renderActiveShape = (props: any) => {
// 	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
// 	return (
// 		<g>
// 			<text x={cx} y={cy} dy={28} textAnchor="middle" fill={fill}>
// 				{payload.name === "RAM_TOTAL" && "TOTAL RAM" || "USED RAM"}
// 			</text>
// 			<text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill}>
// 				{payload.value} MiB
// 			</text>
// 			<Sector
// 				cx={cx}
// 				cy={cy}
// 				innerRadius={innerRadius}
// 				outerRadius={outerRadius}
// 				startAngle={startAngle}
// 				endAngle={endAngle}
// 				fill={fill}
// 			/>
// 			<Sector
// 				cx={cx}
// 				cy={cy}
// 				startAngle={startAngle}
// 				endAngle={endAngle}
// 				innerRadius={outerRadius + 6}
// 				outerRadius={outerRadius + 10}
// 				fill={fill}
// 			/>
// 		</g>
// 	);
// };
export default async function Home() {
	// const [activeIndex, setActiveIndex] = useState(0);
	// const data = [
	// 	{ name: 'RAM_USED', value: 1536 },
	// 	{ name: 'RAM_TOTAL', value: 4096 },
	// ];
	// const onPieEnter = (_: any, index: number) => {
	// 	setActiveIndex(index);
	// }
	const pc_data = await fetch("http://localhost:3333/api/sysinfo", { cache: "no-store" }).then((res) => res.json());
	const cpu_data = await fetch("http://localhost:3333/api/cpudata", { cache: "no-store" }).then((res) => res.json());
	const volume_data = await fetch("http://localhost:3333/api/disksinfo", { cache: "no-store" }).then((res) => res.json());
	const network_info = await fetch("http://localhost:3333/api/network", { cache: "no-store" }).then((res) => res.json());
	console.log("RENDER")
	return (
		<div className='dashboard-main'>
			<SystemInfo pc_data={pc_data} network_info={network_info} />
			<div className='dashboard-pc'>
				<CpuLoadInfo cpu_data={cpu_data} />
				<div className='dashboard-ram'>
					{/* <ResponsiveContainer width="100%" height="100%">
						<PieChart width={400} height={400}>
							<Pie
								activeIndex={activeIndex}
								activeShape={renderActiveShape}
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
								onMouseEnter={onPieEnter}
							/>
						</PieChart>
					</ResponsiveContainer> */}
				</div>
				<NetworkMonitor network_info={network_info} />
			</div>
			<div className='dashboard-disks'>
				<VolumeUsagePie volume_data={volume_data} />
				<VolumeUsedSpace volume_data={volume_data} />
			</div>
		</div>
	)
}
