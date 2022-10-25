import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const clientId = process.env.GITHUB_ID as string
const clientSecret = process.env.GITHUB_SECRET as string

export default NextAuth({
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
    }),
  ],
})
