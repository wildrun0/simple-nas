"use client"
import './page.css'
import { NetworkInfo } from '../api/network/route';
import { RiHardDrive2Fill } from "react-icons/ri";
import { AiFillCheckCircle } from 'react-icons/ai';
import { Sector, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, ResponsiveContainer, LabelList, Cell, Legend } from "recharts";

import useSWR from 'swr';
import chroma from "chroma-js";
import ProgressBar from '../components/ProgressBar';
import NetworkActivity from '../components/Network';
import { volumes } from '../api/disksinfo/route';

const volume_scale = chroma.scale(['#5b69ab', '#2f3b72']);

const renderActiveShape = (props: any) => {
	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
	return (
		<g>
			<text x={cx} y={cy} dy={28} textAnchor="middle" fill={fill}>
				{payload.name === "RAM_TOTAL" && "TOTAL RAM" || "USED RAM"}
			</text>
			<text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill}>
				{payload.value} MiB
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
		</g>
	);
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const formatBytes = (a: number,b=2) => {if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

export default function Home() {
	const { data: pc_data } = useSWR("/api/sysinfo", fetcher)
	const { data: volume_data } = useSWR("/api/disksinfo", fetcher)
	const { data: network_info } = useSWR("/api/network", fetcher)
	const { data: cpu_data } = useSWR("/api/cpudata", fetcher)
	// const [activeIndex, setActiveIndex] = useState(0);
	// const data = [
	// 	{ name: 'RAM_USED', value: 1536 },
	// 	{ name: 'RAM_TOTAL', value: 4096 },
	// ];
	// const onPieEnter = (_: any, index: number) => {
	// 	setActiveIndex(index);
	// }

	return (
		<div className='dashboard-main'>
			<div className='dashboard-system'>
				<h2>SYSTEM INFORMATION</h2>
				{pc_data && (<ul className='system-info-label'>
					<li key={1}>
						<h5>Operating System</h5>
						<p>{pc_data.os}</p>
						<h6>{pc_data.os_sub}</h6>
					</li>
					<li key={2}>
						<h5>Hardware (SoC or CPU)</h5>
						<p>{pc_data.cpu}</p>
					</li>
					<li key={3}>
						<h5>Memory</h5>
						<p>{pc_data.ram}</p>
					</li>
					<li key={4}>
						<h5>Hostname</h5>
						<p>{pc_data.hostname}</p>
					</li>
					<li key={5}>
						<h5>IP address</h5>
						{network_info && network_info.map((_entry: NetworkInfo, _index: number) => (
							<div key={_index}>
								<p>{_entry["iface"]}: {_entry["ip"]} {_entry.primary && (
									<>
										<AiFillCheckCircle color='#358fff' className='primary-conn' />
										<div className='tooltip'>
											This is your primary IP address.
										</div>
									</>
								)}</p>
							</div>
						))}
					</li>
				</ul>)}
			</div>
			<div className='dashboard-pc'>
				<div className='dashboard-cpu'>
					<h2>CPU</h2>
					{cpu_data && (<div className='dashboard-cpu-info'>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={cpu_data}>
								<Line dot={false} type="monotone" dataKey="temp" stroke="#FF3131" />
								<Line dot={false} type="monotone" dataKey="load" stroke="#50C878" />
								<XAxis dataKey="time" padding={{ right: 10 }} />
								<YAxis type="number" domain={[0, 100]} interval={0} padding={{ top: 10 }} />
								<Tooltip contentStyle={{ backgroundColor: "#1c2137", border: "none" }} />
								<Legend align='right' layout='vertical' verticalAlign='top' />
							</LineChart>
						</ResponsiveContainer>
						<p className="cpu-since">Since {cpu_data[0].time}</p>
					</div>) || <p className="no-data">No data</p>}
				</div>
				{/* <div className='dashboard-ram'>
					<ResponsiveContainer width="100%" height="100%">
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
					</ResponsiveContainer>
				</div> */}
				<div className='dashboard-net'>
					<h2>Network</h2>
					<div className='net-data'>
						{network_info && (
							network_info.map((_entry: NetworkInfo) => {
								if (_entry.primary) {
									return (
										<>
											<h3>{_entry.iface}</h3>
											<NetworkActivity netinfo={_entry} period={40} />
										</>
									)
								}

							})
						)}
					</div>
				</div>
			</div>
			<div className='dashboard-disks'>
				<div className='dashboard-disks-pie'>
					<h2>TOTAL VOLUME USAGE</h2>
					<PieChart width={450} height={400}>
						<Pie
							dataKey="used"
							isAnimationActive={false}
							data={volume_data}
							outerRadius={120}
							stroke='white'
							fill="#08B8A1"
							label={(entry) => entry.name}
						>
							<LabelList
								dataKey="used"
								position="right"
								stroke='none'
								style={{ fill: "white" }}
								formatter={(prop: number) => `${formatBytes(prop)}`}
							/>
							{volume_data && volume_data.map((_entry: volumes, index: number) => (
								<Cell key={`cell-${index}`} fill={volume_scale(Math.round(_entry.use) / 100).hex()} />
							))}
						</Pie>
					</PieChart>
				</div>
				<div className='dashboard-disks-usage'>
					{volume_data && volume_data.map((disk: volumes, index: number) => (
						<div key={index} className='disk-info'>
							<div>
								<RiHardDrive2Fill size={35} />
								<p>{disk.name}</p>
							</div>
							<ProgressBar key={index} bgcolor={disk.used / disk.size > 0.7 ? "red" : "#00c700"} completed={(disk.used / disk.size) * 100} />
							<p className='disk-usage'>{formatBytes(disk.used)} / {formatBytes(disk.size)} used</p>
						</div>
					))
						|| <p className="no-data">No data</p>}
				</div>
			</div>
		</div>
	)
}
