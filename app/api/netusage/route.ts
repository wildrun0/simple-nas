import EventSource from "eventsource";
import { NextRequest } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	let responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();
	const resp = new EventSource("http://localhost:3333/api/netusage")

	resp.onmessage = async (e) => {
		console.debug("SSE onmessage")
		await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`));
	}

	resp.onerror = async () => {
		resp.close()
		await writer.close();
	}

	return new Response(responseStream.readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			'X-Accel-Buffering': 'no'
		},
	});
}
