import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { createClient } from '../../../../prismicio'
import { authOptions } from '../../api/auth/[...nextauth]'
import * as prismicH from '@prismicio/helpers'
import styles from './styles.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    updatedAt: string
    content: string
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <main className={styles.container}>
        <article className={styles.post}>
          <time>{post.updatedAt}</time>
          <h1>{post.title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
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

  const prismic = createClient()

  const response = await prismic.getByUID('post', slug)

  const lastPublicationDateFormated = new Date(
    response.last_publication_date,
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const titleFormated = prismicH.asText(response.data.title)

  const contentFormated = prismicH.asHTML(response.data.main)

  const post = {
    slug,
    title: titleFormated,
    content: contentFormated,
    updatedAt: lastPublicationDateFormated,
  }

  return {
    props: {
      post,
    },
  }
}
