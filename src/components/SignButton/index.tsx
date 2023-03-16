import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'
import { signIn, signOut, useSession } from 'next-auth/react'

export function SignButton() {
  const { data, status } = useSession()

  console.log(status, data)

  switch (status) {
    case 'authenticated':
      return (
        <button
          type="button"
          className={styles.signButton}
          onClick={() => {
            signOut()
          }}
        >
          <FaGithub color="#04D361" />

          {data.user?.name}

          <FiX color="#737380" className={styles.closeIcon} />
        </button>
      )
    case 'unauthenticated':
      return (
        <button
          type="button"
          className={styles.signButton}
          onClick={() => {
            signIn('github')
          }}
        >
          <FaGithub color="#EBA417" />
          Sing in with GitHub
        </button>
      )
    default:
      break
  }
}
