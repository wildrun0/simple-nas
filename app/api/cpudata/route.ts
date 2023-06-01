import { NextResponse } from 'next/server';

export interface cpu_data {
	time: string;
	temp: number;
	usage: number;
}

export async function GET(req: Request) {
	const res = await fetch("http://localhost:3333/api/cpudata", { cache: "no-store" });
	const data: cpu_data = await res.json();
	return NextResponse.json(data);
}
