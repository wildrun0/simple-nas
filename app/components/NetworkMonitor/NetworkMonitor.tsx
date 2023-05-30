
import "./NetworkMonitor.css";
import NetworkActivity from "../Network/Network";
import { NetworkInfo } from "../SystemInfo/SystemInfo";


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
