'use client'
import { api } from '@/services/api'
import { getStripeClient } from '@/services/stripe-client'
import { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const session = useSession()

  async function handleSubscribe() {
    if (session.status !== 'authenticated') {
      toast.warn('You need to login to subscribe', {
        theme: 'colored',
      })
    }

    try {
      const response = await api.post('/api/subscribe')

      const stripeClient = await getStripeClient()

      await stripeClient?.redirectToCheckout({
        sessionId: response.data.sessionId,
      })
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message, {
          theme: 'colored',
        })
      }

      return toast.error('Failed to redirect to checkout', {
        theme: 'colored',
      })
    }
  }

  return (
    <button
      type="button"
      className="mt-10 flex h-14 items-center justify-between rounded-lg bg-yellow-500 px-16 py-8 font-bold text-gray-background transition-colors hover:bg-yellow-400"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
