import { ISubscribeResponse } from '@/pages/api/subscribe'
import { api } from '@/services/api'
import { getStripeJs } from '@/services/stripe-js'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status, data } = useSession()

  const router = useRouter()

  async function handleSubscribe() {
    if (status === 'unauthenticated') {
      return signIn('github')
    }

    if (data?.activeSubscription) {
      return await router.push('/posts')
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
