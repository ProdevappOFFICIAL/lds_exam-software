import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './(dashboard)/_component/theme-provider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LearningDeck | JAMB SOFTWARE',
  description: 'JAMB, WAEC , NECO , POSTUTME EXAM SOFTWARE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>   <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >{children}</ThemeProvider></body>
    </html>
  )
}
