
import "./NetworkMonitor.css";
import { NetworkInfo } from "../SystemInfo/SystemInfo";
import NetworkActivity from "../Network/Network";
import EventSource from "eventsource";
export const dynamic = 'force-dynamic'

interface NetworkFlow_Extended {
	iface?: string,
	total_download?: number,
	total_upload?: number,
	up: number,
	down: number
}
const NetworkMonitor = ({ network_info }: { network_info: NetworkInfo[] }) => {
	return (
		<div className='dashboard-net'>
			<h2>Network</h2>
			<div className='net-data'>
				{
					network_info.map((_entry: NetworkInfo) => {
						if (_entry.primary) {
							return (
								<>
									<h3>{_entry.iface}</h3>
									<NetworkActivity netinfo={_entry} period={45} />
								</>
							)
						}

					})
				}
			</div>
		</div>
	)
}

export default NetworkMonitor;
