import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "next-themes"
import SessionWrapper from "../components/SessionWrapper"
import { SessionProvider } from "next-auth/react"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sf-pro',
})

export const metadata: Metadata = {
  title: 'EduNova | Modern Higher Education Platform',
  description: 'Discover innovative courses designed for the modern learner. Advance your career with our cutting-edge higher education platform.',
  keywords: 'education, online courses, higher education, learning platform, LMS',
  authors: [{ name: 'EduNova Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A84FF',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            {children}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
