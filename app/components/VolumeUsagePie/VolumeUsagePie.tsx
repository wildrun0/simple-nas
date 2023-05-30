"use client";
import "./VolumeUsagePie.css";
import { PieChart, Pie, LabelList, Cell } from "recharts";
import chroma from "chroma-js";

const formatBytes = (a: number, b = 2) => { if (!+a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]}` }
const volume_scale = chroma.scale(['#5b69ab', '#2f3b72']);

export interface volumes {
	name: string;
	size: number;
	used: number;
	use: number;
}

const VolumeUsagePie = ({volume_data}: {volume_data: volumes[] }) => {
	return (
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
	)
}

export default VolumeUsagePie;
