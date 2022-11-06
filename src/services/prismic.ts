import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'
import sm from '../../sm.json'

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint)

/** @type {prismic.ClientConfig['routes']} **/
const routes = [
  {
    type: 'post',
    path: '/',
  },
  {
    type: 'post',
    path: '/:uid',
  },
]

export const createClient = (config = {}) => {
  const client = prismic.createClient(sm.apiEndpoint, {
    routes,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  })

  prismicNext.enableAutoPreviews({
    client,
  })

  return client
}
