import { memo, useEffect, useState } from "react"
import styled, { BaseProps } from "styled-components"
import { useApolloClient, gql, ApolloQueryResult } from "@apollo/client"

import { useAuthentication } from "hooks/useAuthentication"
import { getContrast } from "utils"
import { Colors } from "consts/Colors"

const Aside = styled.aside`
  background-color: ${(p: BaseProps) =>
    p.theme.isDarkMode ? Colors.geistPurple : Colors.geistCyan};
  filter: saturate(50%);
  :hover {
    filter: saturate(100%);
  }
  transition: background-color 200ms ease-in-out, filter 200ms ease-in-out;
  height: 2.5rem;
  position: fixed;
  width: 100%;
  z-index: 10;
  span {
    color: ${(p) =>
      p.theme.isDarkMode
        ? getContrast(Colors.geistPurple)
        : getContrast(Colors.geistCyan)};
  }
`
const AsideInner = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  font-weight: 100;
  @media (max-width: 575.98px) {
    /* display: none; */
  }
`

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user: getUserById(id: $id) {
      id
      username
      first_name
      last_name
      avatar_url
    }
  }
`

export default memo(() => {
  const { currentUserId } = useAuthentication()
  const client = useApolloClient()

  const [res, setRes] = useState<any>({})
  useEffect(() => {
    const readQuery = (id) => {
      const res = client.readQuery({
        query: GET_USER_BY_ID,
        variables: { id },
      })
      console.log(res)

      setRes(res)
    }
    if (currentUserId) readQuery(currentUserId)
  }, [currentUserId, client])

  return (
    <Aside>
      <AsideInner>{res && `👋 ${res?.user?.first_name ?? ""}`}</AsideInner>
    </Aside>
  )
})
