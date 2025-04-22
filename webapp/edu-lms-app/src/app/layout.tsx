import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sf-pro',
})

export const metadata: Metadata = {
  title: 'EduNova | Modern Higher Education Platform',
  description: 'Discover innovative courses designed for the modern learner. Advance your career with our cutting-edge higher education platform.',
  keywords: 'education, online courses, higher education, learning platform, LMS',
  authors: [{ name: 'EduNova Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A84FF',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
