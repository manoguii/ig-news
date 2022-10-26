import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { stripe } from '../../services/stripe'

const SUCCESS_URL = process.env.STRIPE_SUCCESS_URL as string
const CANCEL_URL = process.env.STRIPE_CANCEL_URL as string

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    const stripeCustomer = await stripe.customers.create({
      email: session?.user?.email as string,
    })

    const stripeCheckoutSessions = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1LwYRNDT1EvXemSOD558wlqH',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSessions.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('method not allowed')
  }
}
