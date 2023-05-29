import EventSource from "eventsource";
export const dynamic = 'force-dynamic';

export async function GET() {
	let responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const resp = new EventSource("http://localhost:3333/api/netusage")
	resp.onmessage = async (e) => {
		await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`));
	}

	resp.onerror = () => {
		writer.close();
	}

	return new Response(responseStream.readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			"Connection": 'keep-alive',
			'Cache-Control': 'no-cache, no-transform',
		},
	});
}
