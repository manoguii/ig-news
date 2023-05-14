import { stripe } from '@/services/stripe'
import { manageSubscription } from '@/utils/manage-subscription'
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'

type StripeHeaderType = string | Buffer | string[]

type RelevantEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.deleted'
  | 'customer.subscription.updated'

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

const relevantEvent = new Set([
  'checkout.session.completed',
  'customer.subscription.deleted',
  'customer.subscription.updated',
])

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const buf = await buffer(req)

  const secret = req.headers['stripe-signature'] as StripeHeaderType

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secret,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    return res.status(404).json(`Webhook error 🥶🥶🥶: ${err}`)
  }

  const type = event.type as RelevantEventType

  if (relevantEvent.has(type)) {
    try {
      switch (type) {
        case 'customer.subscription.deleted':
          const stripeSubscription = event.data.object as Stripe.Subscription

          if (
            !stripeSubscription.customer ||
            typeof stripeSubscription.customer !== 'string'
          ) {
            throw new Error('Subscription.customer not valid !')
          }

          await manageSubscription(
            stripeSubscription.id,
            stripeSubscription.customer,
            'delete',
          )

          break
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription

          if (
            !subscription.customer ||
            typeof subscription.customer !== 'string'
          ) {
            throw new Error('Subscription.customer not valid !')
          }

          await manageSubscription(
            subscription.id,
            subscription.customer,
            'update',
          )

          break
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session

          if (
            !checkoutSession.subscription ||
            typeof checkoutSession.subscription !== 'string'
          ) {
            throw new Error('CheckoutSession.subscription not valid !')
          }

          if (
            !checkoutSession.customer ||
            typeof checkoutSession.customer !== 'string'
          ) {
            throw new Error('CheckoutSession.customer not valid !')
          }

          await manageSubscription(
            checkoutSession.subscription,
            checkoutSession.customer,
            'create',
          )

          break
        default:
          throw new Error('Unhandled event. 💥💥💥')
      }
    } catch (error) {
      return res.status(400).json({ error: 'Webhook handler filed 💥💥💥!' })
    }
  }

  return res.status(200).json({ received: true })
}
