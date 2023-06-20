'use client'
import { DotOutline, GithubLogo, X } from '@phosphor-icons/react'
import { signIn, signOut, useSession } from 'next-auth/react'

export function SignInButton() {
  const session = useSession()

  async function handleSignIn() {
    await signIn('github')
  }

  async function handleSignOut() {
    await signOut()
  }

  return session.status === 'authenticated' ? (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-lg border border-green-500 bg-transparent px-4 py-2 font-bold text-green-500 transition-colors hover:bg-green-500/[.08] disabled:cursor-not-allowed"
      onClick={handleSignOut}
    >
      <GithubLogo size={24} weight="fill" color="#04d361" />
      <span className="text-sm">{session.data.user?.name}</span>
      <X size={16} color="#737380" />
    </button>
  ) : (
    <button
      type="button"
      className="relative flex items-center justify-center gap-2 rounded-lg border border-yellow-500 bg-transparent px-4 py-2 font-bold text-yellow-500 transition-colors hover:bg-yellow-500/[.07] disabled:cursor-not-allowed"
      onClick={handleSignIn}
      disabled={session.status === 'loading'}
    >
      {session.status === 'loading' && (
        <DotOutline
          size={48}
          weight="duotone"
          color="#FBA94C"
          className="absolute -left-6 -top-6 animate-ping"
        />
      )}
      <GithubLogo size={24} weight="fill" color="#FBA94C" />
      <span>Sing in with Github</span>
    </button>
  )
}
