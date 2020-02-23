import { useState, useEffect, useDebugValue } from "react"
import jwt from "jsonwebtoken"

import { Strings } from "consts/Strings"

/**
 * - Checks local storage for `token`
 * - Adds `onstorage` event listener to update state accordingly
 *
 * @returns {object} `{ currentUserId: string }`
 */
export function useAuthentication(): { currentUserId: string } {
  const token =
    typeof window !== "undefined" && localStorage.getItem(Strings.token)
  const [currentUserId, setCurrentUserId] = useState<string | null>()
  useDebugValue(currentUserId)

  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded: any) => {
      const userId = decoded?.userId
      if (err) {
        setCurrentUserId(null)
      } else if (userId) {
        setCurrentUserId(`${userId}`)
      }
    })

    if (typeof window !== "undefined") {
      window.onstorage = () => {
        const _token = window.localStorage.getItem(Strings.token)
        if (!_token) {
          setCurrentUserId(null)
        }
      }
    }
  }, [])

  return { currentUserId }
}
