import { NextResponse } from 'next/server';

interface AuthData {
	auth: boolean,
	// приходит только если авторизация успешна
	jwt?: string
}

export async function POST(req: Request) {
	const { name, password } = await req.json();
	const res = await fetch("http://localhost:3333/api/auth", {
		method: "POST",
		cache: "no-store",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ "username": name, "password": password })
	});
	const isAuth: AuthData = await res.json();
	const resp = NextResponse.json(isAuth);
	if (isAuth.auth === true && isAuth.jwt) {
		resp.cookies.set("jwt", isAuth.jwt, { maxAge: 21600, sameSite: "none", secure: true });
	}
	return resp
}
