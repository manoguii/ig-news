import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'
import sm from '../../sm.json'

/**
 * The project's Prismic repository name.
 */
export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint)

// Update the routes array to match your project's route structure
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

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config {prismicNext.CreateClientConfig} - Configuration for the Prismic client.
 */
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