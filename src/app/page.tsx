import { SubscribeButton } from '@/components/SubscribeButton'
import GirlCoding from '../assets/Mulher.svg'
import Image from 'next/image'
import { stripe } from '@/services/stripe'
import { formatPrice } from '@/utils/format-price'

export const metadata = {
  title: 'Home | Ig-news',
  description: 'News about the React world',
}

export default async function Home() {
  const response = await stripe.prices.retrieve(
    'price_1LwYRNDT1EvXemSOD558wlqH',
  )

  const product = {
    priceId: response.id,
    amount: formatPrice().format(response.unit_amount! / 100),
  }

  return (
    <main className="container mx-auto flex h-[calc(100vh-5rem)] items-center justify-between px-8">
      <section className="max-w-2xl">
        <span className="text-2xl font-bold text-gray-title">
          👋 Hey, welcome
        </span>
        <h1 className="mt-8 text-7xl font-black text-gray-title">
          News about the <span className="text-blue-500">React</span> world
        </h1>
        <p className="mt-6 text-2xl text-gray-title">
          Get access to all the publications <br />
          <span className="font-bold text-blue-500">
            for {product.amount} month
          </span>
        </p>

        <SubscribeButton priceId={product.priceId} />
      </section>

      <Image
        src={GirlCoding}
        alt=""
        width={334}
        height={520}
        priority
        quality={100}
        className="pr-12"
      />
    </main>
  )
}
