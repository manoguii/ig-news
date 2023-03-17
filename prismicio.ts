import * as prismic from '@prismicio/client'

const apiEndpoint = process.env.NEXT_PUBLIC_PRISMIC_API_ENDPOINT as string

export const repositoryName = prismic.getRepositoryName(apiEndpoint)

export const createClient = () => {
  const client = prismic.createClient(apiEndpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  })

  return client
}
