import { stripe } from '@/services/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { saveSubscription } from '../../utils/save-subscription'

type StripeHeaderType = string | Buffer | string[]
type RelevantEventType = 'checkout.session.completed'

async function buffer(readable: Readable) {
  const chunks: any = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvent = new Set(['checkout.session.completed'])

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('🌈🌈🌈 EVENTO RECEBIDO !!!')

  if (req.method === 'POST') {
    const buf = await buffer(req)

    const secret = req.headers['stripe-signature'] as StripeHeaderType

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      )
    } catch (err) {
      return res.status(400).send(`Webhook error 🥶🥶🥶: ${err}`)
    }

    const type = event.type as RelevantEventType

    if (relevantEvent.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':
            // eslint-disable-next-line no-case-declarations
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            if (
              !checkoutSession.subscription ||
              typeof checkoutSession.subscription !== 'string'
            ) {
              throw new Error('CheckoutSession.subscription not valid ! 🌶️')
            }

            if (
              !checkoutSession.customer ||
              typeof checkoutSession.customer !== 'string'
            ) {
              throw new Error('CheckoutSession.customer not valid ! 🌶️')
            }

            await saveSubscription(
              checkoutSession.subscription,
              checkoutSession.customer,
            )
            break
          default:
            throw new Error('Unhandle event. 🥵')
        }
      } catch (error) {
        return res.json({ error: 'Webhook handler filed !' })
      }
    }

    return res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
