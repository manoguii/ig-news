import Stripe from 'stripe'
import { version } from '../../package.json'

const KEY = process.env.STRIPE_SECRET_KEY as string

export const stripe = new Stripe(KEY, {
  apiVersion: '2022-08-01',
  appInfo: {
    name: 'IgNews',
    version,
  },
})
