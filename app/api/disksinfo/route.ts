import { NextResponse } from 'next/server';

export interface volumes {
	name: string;
	size: number;
	used: number;
	use: number;
}

export async function GET(req: Request) {
	const res = await fetch(`http://localhost:3333/api/disksinfo`, {
		cache: "no-store",
	})
	const disksinfo: volumes = await res.json()
	return NextResponse.json(disksinfo);
}
