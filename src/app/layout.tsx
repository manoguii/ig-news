import './globals.css'
import { ReactNode } from 'react'
import { Roboto } from 'next/font/google'
import { Header } from '@/components/Header'
import { Providers } from './providers'
import { Toast } from '@/components/Toast'

const roboto = Roboto({ weight: ['400', '700', '900'], subsets: ['latin'] })

export const metadata = {
  title: 'Ig-news',
  description: 'News about the React world',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className={roboto.className}>
          <Header />
          {children}
          <Toast />
        </body>
      </Providers>
    </html>
  )
}
