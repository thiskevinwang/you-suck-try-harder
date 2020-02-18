import styled from "styled-components"

import { UserDetailsLoader } from "components/Loaders/UserDetailsLoader"
import { Colors } from "consts/Colors"

interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  created: string
  updated: string
  avatar_url: string
}

export const UserDetails: React.FC<{ user: User }> = ({ user }) => {
  if (!user) return <UserDetailsLoader />
  return (
    <StyledUserDetails>
      <img src={user.avatar_url} />

      <div>
        <h3>
          <code>{user.username}</code>
        </h3>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
    </StyledUserDetails>
  )
}

const StyledUserDetails = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  img {
    margin-left: 1rem;
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  div > h3 {
    margin: 0px;
  }
  div > p {
    color: ${p => (p.theme.isDarkMode ? Colors.greyLight : Colors.greyDark)};
    margin: 0px;
  }
`
