import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createClient } from '../../../services/prismic'
import { RichText } from 'prismic-dom'
import styles from '../post.module.scss'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Preview({ post }: PostPreviewProps) {
  const { data: session }: any = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [post.slug, router, session])

  return (
    <>
      <Head>
        <title>{post.title} | IgNews </title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 😉</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug }: any = params

  const prismic = createClient()

  const response = await prismic.getByUID('post', slug)

  const post = {
    slug,
    title: response.data.title[0].text,
    content: RichText.asHtml(response.data.main.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30,
  }
}
