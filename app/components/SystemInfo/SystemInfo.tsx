import "./SystemInfo.css";
import { AiFillCheckCircle } from 'react-icons/ai';

interface pc_info {
	os: string;
	os_sub: string;
	cpu: string;
	ram: string;
	hostname: string;
}

export interface NetworkInfo {
	iface: string,
	ip: string,
	primary: boolean,
	up_status: string
}

const SystemInfo = ({ pc_data, network_info }: { pc_data: pc_info, network_info: NetworkInfo[] }) => {
	return (
		<div className='system-info'>
			<h2>SYSTEM INFORMATION</h2>
			<ul className='system-info-label'>
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
					{network_info.map((_entry: NetworkInfo, _index: number) => (
						<div key={_index}>
							<p {..._entry.primary && { className: "primary-conn" }}>{_entry["iface"]}: {_entry["ip"]} {_entry.primary && <AiFillCheckCircle color='#358fff' />}</p>
							<div className='tooltip'>
								This is your primary IP address.
							</div>
						</div>
					))}
				</li>
			</ul>
		</div>
	)
}

export default SystemInfo;
