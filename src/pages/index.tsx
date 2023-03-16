import { SubscribeButton } from '@/components/SubscribeButton'
import Head from 'next/head'
import Image from 'next/image'
import Avatar from '../assets/avatar.svg'
import styles from '../styles/home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋🏾 Hey, welcome</span>

          <h1>
            News about the <span>React</span> world
          </h1>

          <p>
            Get acess to all the publications <br />
            <span>for $9.90 month</span>
          </p>

          <SubscribeButton />
        </section>

        <Image
          src={Avatar}
          alt="Mulher usando computador com café e livros em cima da mesa"
          width={320}
          height={520}
        />
      </main>
    </>
  )
}
