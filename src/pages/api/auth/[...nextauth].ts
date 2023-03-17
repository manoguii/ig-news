import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { query as q } from 'faunadb'
import { fauna } from '@/services/fauna'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email!

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email))),
            ),
            q.Create(q.Collection('users'), {
              data: {
                email: user.email,
              },
            }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email))),
          ),
        )

        return true
      } catch (error) {
        return false
      }
    },

    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email as string),
                    ),
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
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
  },
}

export default NextAuth(authOptions)
