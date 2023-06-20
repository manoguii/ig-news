import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import Link from 'next/link'

export default function Posts() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return (
    <div className="mx-auto max-w-xl py-8">
      {posts.map((post, idx) => (
        <h2
          key={post._id}
          className="text-2xl text-blue-600 transition-colors hover:text-blue-700"
        >
          <Link href={post.url}>{post.title}</Link>
        </h2>
      ))}
    </div>
  )
}
