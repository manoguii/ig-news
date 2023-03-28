import React from 'react'
import { PrismicRichText, SliceComponentProps } from '@prismicio/react'
import styles from './styles.module.scss'

const HeaderPost = ({ slice }: SliceComponentProps) => {
  return (
    <header className={styles.header}>
      <PrismicRichText field={slice.primary.title} />

      <PrismicRichText field={slice.primary.sub_title} />

      <PrismicRichText field={slice.primary.author} />

      <time></time>
    </header>
  )
}

export default HeaderPost
