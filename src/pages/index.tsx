import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.scss'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News About the <span>React</span> Wolrd.
          </h1>
          <p>
            Get acess to all the publications
            <br />
            <span>{`for ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(product.amount / 100)} month`}</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={334}
          height={520}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1LwYRNDT1EvXemSOD558wlqH')

  const product = {
    priceId: price.id,
    amount: price.unit_amount,
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hrs
  }
}
