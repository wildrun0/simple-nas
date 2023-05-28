import "./layout.css"

export const metadata = {
	title: 'Authentication',
	description: 'Auth page',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className="auth-bd">
				{children}
			</body>
		</html>
	)
}
