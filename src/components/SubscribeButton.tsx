'use client'
import { api } from '@/services/api'
import { getStripeClient } from '@/services/stripe-client'
import { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { ThreeDots } from 'react-loader-spinner'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()

  async function handleSubscribe() {
    if (session.status !== 'authenticated') {
      return toast.warn('You need to login to subscribe', {
        theme: 'colored',
      })
    }

    try {
      setIsLoading(true)
      const response = await api.post('/api/subscribe')

      const stripeClient = await getStripeClient()

      await stripeClient?.redirectToCheckout({
        sessionId: response.data.sessionId,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message, {
          theme: 'colored',
        })
      }

      return toast.error('Failed to redirect to checkout', {
        theme: 'colored',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      className="mt-10 flex h-14 w-64 items-center justify-center rounded-lg bg-yellow-500 py-8 font-bold text-gray-background transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-yellow-400 disabled:opacity-90"
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? (
        <ThreeDots
          height="54"
          width="54"
          color="#FBA94C"
          wrapperStyle={{
            justifyContent: 'center',
          }}
          visible={true}
        />
      ) : (
        'Subscribe now'
      )}
    </button>
  )
}
