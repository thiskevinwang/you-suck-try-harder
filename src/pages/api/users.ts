import gql from "graphql-tag"
import { NextApiRequest, NextApiResponse } from "next"
import { client } from "../../apolloClient"

const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    users: getAllUsers {
      id
      username
      avatar_url
    }
  }
`
interface Users {
  users: {
    id: string
    username: string
  }[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await client.query<Users>({ query: GET_ALL_USERS_QUERY })
    res.status(200).json(data)
  } catch (error) {
    res.status(500).send(error)
  }
}
