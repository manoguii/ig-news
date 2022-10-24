import type { AppProps } from 'next/app'
import '../../styles/globals.scss'
import { Header } from '../Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
