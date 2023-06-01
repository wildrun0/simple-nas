/** @type {import('next').NextConfig} */
const nextConfig = {
	publicRuntimeConfig: {
		NEXT_PUBLIC_NET_API: process.env.NEXT_PUBLIC_NET_API
	},
	experimental: {
		serverActions: true
	}
}

module.exports = nextConfig
