import { GetStaticPaths, GetStaticProps } from 'next'
import { createClient } from '../../../../prismicio'
import * as prismicH from '@prismicio/helpers'
import styles from './styles.module.scss'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { RTNode } from '@prismicio/types'
import {
  HeaderPostSliceDefaultPrimary,
  MainPostSliceDefaultPrimary,
} from '../../../../.slicemachine/prismicio'

interface PreviewProps {
  post: {
    slug: string
    title: string
    updatedAt: string
    content: string
  }
}

export default function Preview({ post }: PreviewProps) {
  const session = useSession()

  const router = useRouter()

  useEffect(() => {
    if (session.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>Preview | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <time>{post.updatedAt}</time>
          <h1>{post.title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />

          <div className={styles.continueReading}>
            Wanna continue reading ?<Link href={'/'}>Subscribe now ! 🤗</Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}) => {
  const slug = params?.slug as string

  const prismic = createClient({
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    previewData,
  })

  const page = await prismic.getByUID('posts', slug)

  const lastPublicationDateFormatted = new Date(
    page.last_publication_date,
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const headerPostSlice = page.data.slices.find((slice) => {
    return slice.slice_type === 'header_post'
  })?.primary as HeaderPostSliceDefaultPrimary

  const titleFormatted = prismicH.asText(headerPostSlice.title)

  const mainPostSlice = page.data.slices.find((slice) => {
    return slice.slice_type === 'main_post'
  })?.primary as MainPostSliceDefaultPrimary

  const smallPartsOfContentFormatted = mainPostSlice.main.splice(0, 4) as [
    RTNode,
    ...RTNode[],
  ]

  const contentFormatted = prismicH.asHTML(smallPartsOfContentFormatted)

  const post = {
    slug,
    title: titleFormatted,
    content: contentFormatted,
    updatedAt: lastPublicationDateFormatted,
  }

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
