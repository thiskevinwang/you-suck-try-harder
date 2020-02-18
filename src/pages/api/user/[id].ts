import gql from "graphql-tag"
import { NextApiRequest, NextApiResponse } from "next"
import { client } from "../../../apolloClient"

const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: ID!) {
    user: getUserById(id: $id) {
      id
      username
      first_name
      last_name
      created
      updated
      avatar_url
    }
  }
`

export default async function GetUserById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  try {
    const response = await client.query({
      query: GET_USER_BY_ID_QUERY,
      variables: { id },
    })
    res.status(200).json(response)
  } catch (error) {
    res.status(500).send(error)
  }
}
