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
  },
}

export default NextAuth(authOptions)