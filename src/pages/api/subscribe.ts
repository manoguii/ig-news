import { stripe } from '@/services/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { query as q } from 'faunadb'
import { fauna } from '@/services/fauna'

export interface ISubscribeResponse {
  sessionId: string
}

interface User {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISubscribeResponse>,
) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session?.user?.email as string),
        ),
      ),
    )

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email!,
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        }),
      )

      customerId = stripeCustomer.id
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      line_items: [
        {
          price: 'price_1LwYRNDT1EvXemSOD558wlqH',
          quantity: 1,
        },
      ],
      customer: customerId,
    })

    return res.status(200).json({
      sessionId: checkoutSession.id,
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
