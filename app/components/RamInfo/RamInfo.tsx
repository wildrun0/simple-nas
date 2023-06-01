"use client";
import "./RamInfo.css";
import { useEffect, useState } from "react";
import { PieChart, Pie, Sector } from "recharts";
import { formatBytes } from "../VolumeUsagePie/VolumeUsagePie";

// const renderActiveShape = (props: any) => {
// 	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
// 	return (
// 		<g>
// 			<text x={cx} y={cy} dy={28} textAnchor="middle" fill={fill}>
// 				{payload.name === "RAM_TOTAL" && "TOTAL" || "USED"}
// 			</text>
// 			<text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill}>
// 				{formatBytes(payload.value)}
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

interface ram_usage {
	name: string,
	value: number
}


const RamInfo = () => {
	// const [activeIndex, setActiveIndex] = useState(0);
	const data: ram_usage[] = [
		{ name: 'RAM_USED', value: 1536 },
		{ name: 'RAM_TOTAL', value: 4096 },
	];
	// const onPieEnter = (_: any, index: number) => {
	// 	setActiveIndex(index);
	// }

	return (
		<div className="ram-usage">
			<h2>Memory Usage</h2>
			<div className="ram-usage-info">
				<PieChart width={200} height={200}>
					<Pie
						// activeIndex={activeIndex}
						// activeShape={renderActiveShape}
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
						// onMouseEnter={onPieEnter}
					/>
				</PieChart>
				{/* <div>
					<p> TOTAL RAM: {formatBytes(data[1].value)}</p>
					<p> USED RAM: {formatBytes(data[0].value)}</p>
				</div> */}
			</div>
		</div>
	)
}
export default RamInfo;
