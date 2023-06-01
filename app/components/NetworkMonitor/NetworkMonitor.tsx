
import "./NetworkMonitor.css";
import NetworkActivity from "../Network/Network";
import { NetworkInfo } from "../SystemInfo/SystemInfo";


const NetworkMonitor = ({ network_info, period }: { network_info: NetworkInfo[], period: number }) => {
	let primary_conn: NetworkInfo[] = network_info.filter((entry) => entry.primary === true)
	return (
		<div className='dashboard-net'>
			<h2>Network</h2>
			<div className='net-data'>
				<h3>{primary_conn[0].iface}</h3>
				<NetworkActivity netinfo={primary_conn[0]} period={period} />
			</div>
		</div>
	)
}

export default NetworkMonitor;
