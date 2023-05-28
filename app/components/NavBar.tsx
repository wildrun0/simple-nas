"use client";

import Link from "next/link";
import { HiUsers, HiInformationCircle } from "react-icons/hi";
import { ImDrive, ImBlocked } from "react-icons/im";
import { TbHeartRateMonitor } from "react-icons/tb";
import { AiFillFileText, AiFillDashboard } from "react-icons/ai";
import "./NavBar.css";
import logo from "../logo.svg"
import Image from "next/image";


const NavBar = () => {
	return (
		<nav className="navbar">
			<div className="navbar-logo">
				<Image src={logo} alt='logo' />
				<h2>Simple<span style={{ color: "red" }}>NAS</span></h2>
			</div>
			<ul className="navbar-list">
				<h3>MAIN</h3>
				<li>
					<Link href='/'>
						<AiFillDashboard />
						Dashboard
					</Link>
				</li>
				<li>
					<Link href='/users'>
						<HiUsers />
						Users
					</Link>
				</li>
				<li>
					<Link href='/disks'>
						<ImDrive />
						Disks
					</Link>
				</li>
				<li>
					<Link href='/monitor'>
						<TbHeartRateMonitor />
						Resource Monitor
					</Link>
				</li>
				<li>
					<Link href='/sysinfo'>
						<HiInformationCircle />
						System Info
					</Link>
				</li>
				<li>
					<Link href='/blocklist'>
						<ImBlocked />
						Blocking
					</Link>
				</li>
				<li>
					<Link href='/logs'>
						<AiFillFileText />
						Log
					</Link>
				</li>
			</ul>
		</nav>
	)
}

export default NavBar
