import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mood Meter — Emotional Intelligence',
  description: 'Track and understand your emotions with the Yale Mood Meter model',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
