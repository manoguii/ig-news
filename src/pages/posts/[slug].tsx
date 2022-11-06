import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { createClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'
import styles from './post.module.scss'
import { Session } from 'next-auth'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

interface SessionProps extends Session {
  activeSubscription: string
  session: Session | null
}

export default function Post({ post }: PostProps) {
  console.log(post)
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session: SessionProps | any = await getSession({ req })
  const { slug }: any = params
  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const prismic = createClient(req)

  const response = await prismic.getByUID('post', slug)

  console.log(session)

  const post = {
    slug,
    title: response.data.title[0].text,
    content: RichText.asHtml(response.data.main),
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
  }
}
