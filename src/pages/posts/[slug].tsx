import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { createClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
  console.log(post)
  return (
    <>
      <Head>
        <title>{post.title} | IgNews </title>
      </Head>

      <main>
        <article>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div>{post.content}</div>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })
  const { slug }: any = params
  // if (!session) {
  // }

  const prismic = createClient(req)

  const response = await prismic.getByUID('post', slug)

  console.log(response.data)

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
