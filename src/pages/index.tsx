import { SubscribeButton } from '@/components/SubscribeButton'
import { stripe } from '@/services/stripe'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Avatar from '../assets/avatar.svg'
import styles from '../styles/home.module.scss'

interface HomeProps {
  product: {
    priceId: string
    amount: string
  }
}

export default function Home({ product }: HomeProps) {
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
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
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

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LwYRNDT1EvXemSOD558wlqH', {
    expand: ['product'],
  })

  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price.unit_amount ? price.unit_amount / 100 : 0)

  const product = {
    priceId: price.id,
    amount,
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
