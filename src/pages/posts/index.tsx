import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createClient } from '../../../prismicio'
import styles from './styles.module.scss'
import * as prismicH from '@prismicio/helpers'
import Link from 'next/link'

interface Post {
  slug: string
  title: string
  updatedAt: string
  summary: {
    text: string
  }
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ig-News</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => {
            return (
              <Link href={`/posts/preview/${post.slug}`} key={post.slug}>
                <time> {post.updatedAt} </time>
                <strong>{post.title}</strong>
                <p>{post.summary.text}</p>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = createClient()

  const response = await prismic.getAllByType('post')

  const posts = response.map((post) => {
    const lastPublicationDateFormated = new Date(
      post.last_publication_date,
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const titleFormated = prismicH.asText(post.data.title)

    const firstParagraph = post.data.main.find((content: any) => {
      return content.type === 'paragraph' ?? ''
    })

    return {
      slug: post.uid,
      title: titleFormated,
      updatedAt: lastPublicationDateFormated,
      summary: firstParagraph,
    }
  })

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
