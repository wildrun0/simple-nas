import { NextResponse } from 'next/server';

interface cpu_data {
	time: string;
	temp: number;
	load: number;
}

export async function GET(req: Request) {
	const res = await fetch(`http://localhost:3333/api/cpudata`, {
		cache: "no-store",
	})
	const cpu_data: cpu_data = await res.json()
	return NextResponse.json(cpu_data);
}
