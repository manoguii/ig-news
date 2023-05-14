import { prisma } from '@/services/prisma'
import { stripe } from '@/services/stripe'

type OperationData = 'create' | 'update' | 'delete'

export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  operation: OperationData,
) {
  const user = await prisma.user.findUnique({
    where: {
      stripe_customer_id: customerId,
    },
  })

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  if (operation === 'create') {
    return await prisma.subscription.create({
      data: {
        price_id: subscription.items.data[0].price.id,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        user_id: user?.id!,
      },
    })
  }

  if (operation === 'update') {
    return await prisma.subscription.update({
      where: {
        stripe_subscription_id: subscriptionId,
      },
      data: {
        price_id: subscription.items.data[0].price.id,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        user_id: user?.id!,
      },
    })
  }

  if (operation === 'delete') {
    return await prisma.subscription.delete({
      where: {
        stripe_subscription_id: subscriptionId,
      },
    })
  }
}
