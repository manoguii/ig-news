import { query as q } from 'faunadb'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../../services/fauna'

const clientId = process.env.GITHUB_ID as string
const clientSecret = process.env.GITHUB_SECRET as string

export default NextAuth({
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope: 'public_repo',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      const emailUser = session.user?.email as string
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(q.Index('user_by_email'), q.Casefold(emailUser)),
                  ),
                ),
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ]),
          ),
        )
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user, account, profile, credentials }) {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email as string),
                ),
              ),
            ),
            q.Create(q.Collection('users'), {
              data: { email: user.email, name: user.name },
            }),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email as string),
              ),
            ),
          ),
        )
        return true
      } catch {
        return false
      }
    },
  },
})
