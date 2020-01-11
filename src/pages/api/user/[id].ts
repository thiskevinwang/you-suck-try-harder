import gql from "graphql-tag"
import { NextApiRequest, NextApiResponse } from "next"
import { client } from "../../../apolloClient"

const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      created
      updated
      avatar_url
    }
  }
`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  try {
    const foo = await client.query({
      query: GET_USER_BY_ID_QUERY,
      variables: { id },
    })
    res.status(200).json(foo)
  } catch (error) {
    res.status(500).send(error)
  }
}
