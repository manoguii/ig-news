import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import '../../styles/globals.scss'
import { Session } from 'next-auth'

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session
}>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
