/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { createClient } from '../../../../prismicio'
import { authOptions } from '../../api/auth/[...nextauth]'
import * as prismicH from '@prismicio/helpers'
import styles from './styles.module.scss'
import Head from 'next/head'

interface PostProps {
  post: {
    slug: string
    title: string
    updatedAt: string
    content: string
    imageUrl: string
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{`${post.slug}`} | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.capa}>
          <img src={`${post.imageUrl}`} alt="Imagem de capa" />
        </div>

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

  const response = await prismic.getByUID('posthard', slug)

  const lastPublicationDateFormated = new Date(
    response.last_publication_date,
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const titleFormated = prismicH.asText(response.data.title)

  const contentFormated = prismicH.asHTML(response.data.main)

  const imageFormated = prismicH.asImageSrc(response.data.capa)

  const post = {
    slug,
    title: titleFormated,
    content: contentFormated,
    imageUrl: imageFormated,
    updatedAt: lastPublicationDateFormated,
  }

  return {
    props: {
      post,
    },
  }
}
