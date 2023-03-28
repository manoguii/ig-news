import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { createClient } from '../../../../prismicio'
import { authOptions } from '../../api/auth/[...nextauth]'
import styles from './styles.module.scss'
import Head from 'next/head'
import { SliceZone } from '@prismicio/react'
import { components } from '../../../slices'
import type { Content } from '@prismicio/client'

interface PostProps {
  post: Content.AllDocumentTypes
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{`${post.uid}`} | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <SliceZone slices={post.data.slices} components={components} />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  previewData,
}) => {
  const session = await getServerSession(req, res, authOptions)

  const slug = params?.slug as string

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const prismic = createClient({
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    previewData,
  })

  const post = await prismic.getByUID('posts', slug)

  return {
    props: {
      post,
    },
  }
}
