import React from 'react'
import { PrismicRichText, SliceComponentProps } from '@prismicio/react'
import styles from './styles.module.scss'

const AdditionalContent = ({ slice }: SliceComponentProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.capa}>
        <img src={slice.primary.image.url} alt={slice.primary.image.alt} />
      </div>

      <PrismicRichText field={slice.primary.description} />
    </div>
  )
}

export default AdditionalContent
