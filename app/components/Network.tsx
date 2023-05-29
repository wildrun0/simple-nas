import "./Network.css"
import EventSource from 'eventsource';

import { useEffect, useState } from "react";
import {
	AiOutlineArrowDown,
	AiOutlineArrowUp,
	AiFillCheckCircle,
	AiFillCloseCircle,
	AiOutlineCloudDownload,
	AiOutlineCloudUpload
} from 'react-icons/ai';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { NetworkInfo } from "../api/network/route";


interface NetworkFlow_Extended {
	iface?: string,
	total_download?: number,
	total_upload?: number,
	up: number,
	down: number
}

interface NA_props {
	netinfo: NetworkInfo,
	period: number
}

const formatBytes = (bytes: number, decimals: number = 2, bits: boolean = false) => {
	if (!+bytes) return bits ? '0 Bits' : '0 Bytes';

	const k: number = bits ? 1000 : 1024;
	const dm: number = decimals < 0 ? 0 : decimals;

	const sizes: {}[] = bits ? [
		'Bits', 'KBps', 'MBps',
		'GBps', 'TBps', 'PBps',
		'EBps', 'ZBps', 'YBps'
	] : [
		'Bytes', 'KiB', 'MiB',
		'GiB', 'TiB', 'PiB',
		'EiB', 'ZiB', 'YiB'
	];

	const i: number = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
const NetworkActivity = ({ netinfo, period }: NA_props) => {
	const [net_stat, add_net_stat] = useState<NetworkFlow_Extended[]>([]);
	const [total_downloaded, set_down] = useState<number | undefined>(undefined);
	const [total_sent, set_sent] = useState<number | undefined>(undefined);

	useEffect(() => {
		const resp = new EventSource("http://localhost:3000/api/netusage");
		resp.onmessage = (e) => {
			let data = JSON.parse(e.data)
			data.map((_entry: NetworkFlow_Extended) => {
				if (_entry.iface === netinfo.iface) {
					set_down(_entry.total_download);
					set_sent(_entry.total_upload);
					add_net_stat(result => [...result.slice(-period), {
						up: _entry.up,
						down: _entry.down
					}]);
				}
			})
		}
		resp.onerror = () => { resp.close() }
		return () => {
			resp.close();
		}
	}, [netinfo, period])
	return (
		<>
			<div className="network">
				<div className="network-total">
					<p className='link-state'>
						{netinfo.up_status == "UP" && <AiFillCheckCircle color="lightgreen" /> || <AiFillCloseCircle color="red" />}
						LINK STATE {netinfo.up_status}
					</p>
					<div className='network-stat'>
						<AiOutlineArrowUp color='lightgreen' />
						{net_stat.length > 0 && <p>{formatBytes(net_stat[net_stat.length - 1].up * 8, 2, true)}</p>}
					</div>
					<div className='network-stat'>
						<AiOutlineArrowDown color='red' />
						{net_stat.length > 0 && <p>{formatBytes(net_stat[net_stat.length - 1].down * 8, 2, true)}</p>}
					</div>
				</div>
				<div>
					<p>IP: {netinfo.ip}</p>
					{total_downloaded && total_sent && (
						<>
							<div className='network-stat'>
								<AiOutlineCloudUpload />
								<p>{formatBytes(total_sent)}</p>
							</div>
							<div className='network-stat'>
								<AiOutlineCloudDownload />
								<p>{formatBytes(total_downloaded)}</p>
							</div>
						</>
					)}
				</div>
			</div>
			{net_stat && (
				<LineChart width={600} height={250} data={net_stat} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
					<Line dot={false} isAnimationActive={false} type="monotone" dataKey="up" stroke="lightgreen" />
					<Line dot={false} isAnimationActive={false} type="monotone" dataKey="down" stroke="red" />
					<CartesianGrid stroke="#ccc" strokeDasharray="3 3" opacity={0.35} vertical={false} />
					<XAxis dataKey="timestamp" />
					<Tooltip contentStyle={{ backgroundColor: "#1c2137", border: "none" }} formatter={(e: string) => `${formatBytes(Number(e) * 8, 2, true)}`} />
					<YAxis
						tick={{ fontSize: "14px" }}
						tickMargin={5}
						width={75}
						tickFormatter={(e: string) => `${formatBytes(Number(e) * 8, 2, true)}`}
					/>
				</LineChart>
			)}
		</>
	)
}
export default NetworkActivity;
