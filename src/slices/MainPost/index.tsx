import React from 'react'
import { PrismicRichText, SliceComponentProps } from '@prismicio/react'
import styles from './styles.module.scss'

const MainPost = ({ slice }: SliceComponentProps) => {
  return (
    <section className={styles.container}>
      <article className={styles.postContent}>
        <PrismicRichText field={slice.primary.main} />
      </article>
    </section>
  )
}

export default MainPost
