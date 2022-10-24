import { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <h1 className={styles.title}>Hello wolrd</h1>
    </>
  )
}

export default Home
