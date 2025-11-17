import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SiterSyn - AI Site Generator',
  description: 'Мгновенная генерация профессиональных сайтов с помощью AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
