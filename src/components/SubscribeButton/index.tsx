import { ISubscribeResponse } from '@/pages/api/subscribe'
import { api } from '@/services/api'
import { getStripeJs } from '@/services/stripe-js'
import { signIn, useSession } from 'next-auth/react'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status } = useSession()

  async function handleSubscribe() {
    if (status === 'unauthenticated') {
      return signIn('github')
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data as ISubscribeResponse

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({
        sessionId,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
