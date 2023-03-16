import { fauna } from '@/services/fauna'
import { stripe } from '@/services/stripe'
import { query as q } from 'faunadb'

type OperationData = 'create' | 'update'

export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  operation: OperationData,
) {
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId)),
    ),
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  }

  if (operation === 'create') {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), {
        data: subscriptionData,
      }),
    )
  }

  if (operation === 'update') {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId)),
        ),
        {
          data: {
            subscriptionData,
          },
        },
      ),
    )
  }
}
