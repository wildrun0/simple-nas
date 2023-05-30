"use client"
import "./CpuLoadInfo.css";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface cpu_data {
	time: string;
	temp: number;
	load: number;
}
const CpuLoadInfo = ({ cpu_data }: { cpu_data: cpu_data[] }) => {
	return (
		<div className='dashboard-cpu'>
			<h2>CPU</h2>
			<div className='dashboard-cpu-info'>
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
			</div>
		</div>
	)
}

export default CpuLoadInfo;
