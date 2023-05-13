import Image from 'next/image'
import Logo from '../assets/ig.news.svg'
import { LinkHeader } from './LinkHeader'
import { SignInButton } from './SignInButton'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-shape px-8">
      <div className="flex items-center gap-20">
        <Image src={Logo} alt="" width={108} height={30} />

        <nav className="space-x-4">
          <LinkHeader path="/">Home</LinkHeader>
          <LinkHeader path="/posts">Posts</LinkHeader>
        </nav>
      </div>

      <SignInButton />
    </header>
  )
}
