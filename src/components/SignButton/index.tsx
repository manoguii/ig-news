import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'

export function SignButton() {
  const isUserLogged = false

  return isUserLogged ? (
    <button type="button" className={styles.signButton}>
      <FaGithub color="#04D361" />
      Guilherme David
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signButton}>
      <FaGithub color="#EBA417" />
      Sing in with GitHub
    </button>
  )
}
