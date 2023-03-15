import Image from 'next/image'
import Logo from '../../assets/logo.svg'
import { SignButton } from '../SignButton'
import styles from './styles.module.scss'

export function Header() {
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
          <a className={styles.active} href="#">
            Home
          </a>
          <a href="#">Posts</a>
        </nav>

        <SignButton />
      </div>
    </header>
  )
}
