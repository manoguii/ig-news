import { Client } from 'faunadb'

const FAUNA = process.env.FAUNNA_DB_KEY as string

export const fauna = new Client({
  secret: FAUNA,
})
