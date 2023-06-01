"use client"
import "./CpuLoadInfo.css";
import { cpu_data } from "@/app/api/cpudata/route";
import { useEffect, useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";


const CpuLoadInfo = () => {
	const [cpu_info, add_cpu_data] = useState<cpu_data[]>();
	useEffect(() => {
		async function get_load(url: string) {
			const resp = await fetch(url, { cache: "no-store" });
			let data: cpu_data[] = await resp.json();
			data.map((_entry: cpu_data)=>{
				let date = new Date(_entry.time);
				let hoursAndMinutes = date.getHours() + ':' + date.getMinutes();
				_entry.time = hoursAndMinutes;
			})
			add_cpu_data(data);
			console.log(cpu_info)
		}
		get_load("/api/cpudata");
		let interval = setInterval(() => get_load("/api/cpudata"), 200000);
		return () => {
			clearInterval(interval);
		}
	}, [add_cpu_data])
	return (
		<div className='dashboard-cpu'>
			<h2>CPU</h2>
			{cpu_info && (<div className='dashboard-cpu-info'>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={cpu_info}>
						<Line dot={false} type="monotone" dataKey="temp" stroke="#FF3131" />
						<Line dot={false} type="monotone" dataKey="usage" stroke="#50C878" />
						<XAxis dataKey="time" padding={{ right: 10 }}/>
						<YAxis type="number" domain={[0, 100]} interval={0} padding={{ top: 10 }} />
						<Tooltip contentStyle={{ backgroundColor: "#1c2137", border: "none" }} />
						<Legend align='right' layout='vertical' verticalAlign='top' />
					</LineChart>
				</ResponsiveContainer>
				<p className="cpu-since">Since {cpu_info[0].time}</p>
			</div>)}
		</div>
	)
}

export default CpuLoadInfo;
