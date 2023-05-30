import "./VolumeUsedSpace.css"
import ProgressBar from "../ProgressBar/ProgressBar"
import { volumes } from "../VolumeUsagePie/VolumeUsagePie"
import { RiHardDrive2Fill } from "react-icons/ri";
const formatBytes = (a: number, b = 2) => { if (!+a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"][d]}` }

const VolumeUsedSpace = ({volume_data}: {volume_data: volumes[]}) => {
	return (
		<div className='dashboard-disks-usage'>
			{
				volume_data.map((disk: volumes, index: number) => (
					<div key={index} className='disk-info'>
						<div>
							<RiHardDrive2Fill size={35} />
							<p>{disk.name}</p>
						</div>
						<ProgressBar key={index} bgcolor={disk.used / disk.size > 0.7 ? "red" : "#00c700"} completed={(disk.used / disk.size) * 100} />
						<p className='disk-usage'>{formatBytes(disk.used)} / {formatBytes(disk.size)} used</p>
					</div>
				))
			}
		</div>
	)
}

export default VolumeUsedSpace;
