import NavBar from '../components/NavBar'
import { Poppins } from 'next/font/google'
import '../globals.css'

export const metadata = {
	title: 'S-NAS home',
	description: 'Simple NAS main page',
}

const poppins = Poppins({ subsets: ['latin'], weight: ["400"] });

export default function RootLayout({children, }: {children: React.ReactNode}) {
  return (
		<html lang="en">
			<body className={poppins.className} id="main-layout">
				<NavBar/>
				{children}
			</body>
		</html>
	)
}
