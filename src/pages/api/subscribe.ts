import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/fauna'
import { stripe } from '../../services/stripe'
import { query as q } from 'faunadb'

const SUCCESS_URL = process.env.STRIPE_SUCCESS_URL as string
const CANCEL_URL = process.env.STRIPE_CANCEL_URL as string

interface UserType {
  user: {
    name?: string
    email?: string
    image?: string
  }
}

interface User {
  ref: {
    id?: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = (await getSession({ req })) as UserType

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email as string),
        ),
      ),
    )

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email as string,
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: { stripe_customer_id: stripeCustomer.id },
        }),
      )

      customerId = stripeCustomer.id
    }

    const stripeCheckoutSessions = await stripe.checkout.sessions.create({
      customer: customerId,
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
