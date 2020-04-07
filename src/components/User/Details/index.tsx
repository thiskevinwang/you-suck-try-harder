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

interface Props {
  user: User
  isActive?: boolean
}

export const UserDetails: React.FC<Props> = ({ user, isActive }) => {
  if (!user) return <UserDetailsLoader />
  return (
    <StyledUserDetails isActive={isActive}>
      <img src={user.avatar_url} />

      <div>
        <h3>{user.username}</h3>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
    </StyledUserDetails>
  )
}

const StyledUserDetails = styled.div<Pick<Props, "isActive">>`
  padding-top: 1rem;
  padding-bottom: 1rem;
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
    color: ${(p) =>
      p.isActive
        ? p.theme.isDarkMode
          ? Colors.geistPurple
          : Colors.geistCyan
        : "inherit"};
  }
  div > p {
    color: ${(p) => (p.theme.isDarkMode ? Colors.greyLight : Colors.greyDark)};
    margin: 0px;
  }
`
