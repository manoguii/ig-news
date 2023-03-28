import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createClient } from '../../../prismicio'
import styles from './styles.module.scss'
import * as prismicH from '@prismicio/helpers'
import Link from 'next/link'
import {
  HeaderPostSliceDefaultPrimary,
  MainPostSliceDefaultPrimary,
} from '../../../.slicemachine/prismicio'

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

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = createClient({
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    previewData,
  })

  const response = await prismic.getAllByType('posts')

  const posts = response.map((post) => {
    const lastPublicationDateFormatted = new Date(
      post.last_publication_date,
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const headerPostSlice = post.data.slices.find((slice) => {
      return slice.slice_type === 'header_post'
    })?.primary as HeaderPostSliceDefaultPrimary

    const titleFormatted = prismicH.asText(headerPostSlice.title)

    const mainPostSlice = post.data.slices.find((slice) => {
      return slice.slice_type === 'main_post'
    })?.primary as MainPostSliceDefaultPrimary

    const firstParagraph = mainPostSlice.main.find((content) => {
      return content.type === 'paragraph' ?? ''
    })

    return {
      slug: post.uid,
      title: titleFormatted,
      updatedAt: lastPublicationDateFormatted,
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
