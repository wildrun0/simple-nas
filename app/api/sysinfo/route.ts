import { NextResponse } from 'next/server';

interface pc_data {
	os: string;
	os_sub: string;
	cpu: string;
	ram: string;
	hostname: string;
}

export async function GET(req: Request) {
	const res = await fetch(`http://localhost:3333/api/sysinfo`, {
		cache: "no-store",
	})
	const sysinfo: pc_data = await res.json()
	return NextResponse.json(sysinfo);
}
