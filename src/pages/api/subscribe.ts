import { stripe } from '@/services/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { prisma } from '@/services/prisma'
import { authOptions } from './auth/[...nextauth]'

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(404).send({ message: 'You need to register an email !' })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  let stripeCustomerId = user?.stripe_customer_id

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      name: session?.user?.name!,
    })

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        stripe_customer_id: stripeCustomer.id,
      },
    })

    stripeCustomerId = stripeCustomer.id
  }

  const subscription = await stripe.subscriptions.list({
    status: 'active',
    customer: stripeCustomerId,
  })

  if (subscription.data.length > 0) {
    return res.status(400).json({
      message: 'There is already an active subscription for this user !',
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
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
  })

  return res.status(200).json({ sessionId: checkoutSession.id })
}
