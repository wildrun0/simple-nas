import { NextResponse } from 'next/server';

export interface NetworkInfo {
	iface: string,
	ip: string,
	primary: boolean,
	up_status: string
}
export async function GET(req: Request) {
	const res = await fetch(`http://localhost:3333/api/network`, {
		cache: "no-store",
	})
	const network_info: NetworkInfo = await res.json();
	return NextResponse.json(network_info);
}
