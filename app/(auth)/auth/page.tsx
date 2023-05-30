"use client"
import "./auth.css"
import logo from "../../logo.svg"
import Image from "next/image";

import { Poppins } from 'next/font/google'
import { useRouter } from 'next/navigation';
import { FaUserAlt } from "react-icons/fa";
import { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

const poppins = Poppins({ subsets: ['latin'], weight: ["400", "500", "600", "700", "800", "900"] });

const submitAuth = async (event: any, router: AppRouterInstance, setErr: any) => {
	event.preventDefault();

	const name = event.target.username.value;
	const password = event.target.password.value;

	const res = await fetch('/api/auth', {
		body: JSON.stringify({
			name: name,
			password: password
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	const result = await res.json();
	if (result.auth) {
		router.back();
	} else {
		setErr(true);
	}
};

export default function Auth() {
	const router = useRouter();
	const [err, setErr] = useState(false);
	return (
		<div className={poppins.className}>
			<div className="auth">
				<Image src={logo} alt='logo' />
				<div className="auth-main">
					<div className="auth-text">
						<h3><span>Welcome Back</span></h3>
						<p>Enter your credentials to access your account.</p>
					</div>
					<div style={{height: "30px"}}>
						{err &&
							<p className="auth-err">Username or password is incorrect.</p>
						}
					</div>
					<form className="auth-form" onSubmit={(e) => submitAuth(e, router, setErr)}>
						<div className="auth-nickname">
							<FaUserAlt />
							<input placeholder="Enter your username" name="username" required />
						</div>
						<div className="auth-password">
							<RiLockPasswordFill />
							<input type="password" placeholder="Enter your password" name="password" required />
						</div>
						<button type='submit' className="auth-sign">Sign In</button>
					</form>
				</div>
			</div>
		</div>
	)
}
