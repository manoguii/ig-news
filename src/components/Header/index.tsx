import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Logo from '../../assets/logo.svg'
import { SignButton } from '../SignButton'
import styles from './styles.module.scss'

export function Header() {
  const { asPath } = useRouter()

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src={Logo}
          width={108}
          height={30}
          alt="Imagem do logo da aplicação"
        />

        <nav>
          <Link href="/" className={asPath === '/' ? styles.active : undefined}>
            Home
          </Link>

          <Link
            href="/posts"
            className={asPath === '/posts' ? styles.active : undefined}
            prefetch
          >
            Posts
          </Link>
        </nav>

        <SignButton />
      </div>
    </header>
  )
}
