import React, { useState, useEffect } from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { useRouter } from "next/router"
import Link from "next/link"
import qs from "query-string"
import _ from "lodash"
import { animated } from "react-spring"
import styled from "styled-components"
import { useMutation, gql, ApolloError } from "@apollo/client"
import jwt from "jsonwebtoken"

import { Layout } from "components/Layout"
import { Field, SubmitButton } from "components/Form"
import { StyledCircularProgress } from "components/Loaders/StyledCircularProgress"
import { Spacer } from "components/Spacer"

const Error = styled(animated.div)`
  border: 3px solid #ff7979;
  border-radius: 0.25rem;
  color: #ffaaaa;
  background: #f00;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`

const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!) {
    resetPassword(password: $password) {
      id
    }
  }
`

type Values = {
  password: string
}

function usePasswordResetLink(location): { token?: string; error?: Error } {
  const { token } = qs.parse(location.search)
  const [error, setError] = useState<Error>(null)
  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded: any) => {
      if (err) {
        console.error(err)
        setError(err)
      }
    })
  }, [])

  return { token, error }
}

const AuthResetPassword = () => {
  const router = useRouter()
  const { token, error } = usePasswordResetLink(
    typeof window !== "undefined" ? window.location : {}
  )
  console.log({ token, error })

  const [errorMessage, setErrorMessage] = useState("")

  const [resetPassword, { data, loading }] = useMutation(RESET_PASSWORD, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    onCompleted: data => {
      const { id } = data.resetPassword

      if (id) {
        router.replace("/auth/login/")
      }
    },
    onError: (error: ApolloError) => {
      setErrorMessage(error.message)
    },
  })

  return (
    <Layout>
      <h1>Reset Password</h1>
      {error?.name === "TokenExpiredError" ? (
        <>
          <p>
            Your link has expired. Click{" "}
            <Link href={"/auth/forgot"}>
              <a>here</a>
            </Link>{" "}
            to request a new one.
          </p>
        </>
      ) : (
        <Formik<Values>
          initialValues={{ password: "" }}
          validateOnMount={false}
          validate={values => {
            const errors: FormikErrors<Values> = {}
            if (!values.password) {
              errors.password = "Required"
            }
            return errors
          }}
          onSubmit={async (values, actions) => {
            resetPassword({ variables: values })
          }}
        >
          {(props: FormikProps<Values>) => (
            <form
              onSubmit={e => {
                e.preventDefault()
                props.handleSubmit(e)
              }}
            >
              <Field
                id="password"
                name="password"
                type="password"
                label="password"
                placeholder="password"
              />
              <Spacer y={25} />
              <SubmitButton
                type="submit"
                disabled={!props.isValid || props.isSubmitting || loading}
              >
                {props.isSubmitting || loading ? (
                  <StyledCircularProgress size={"1.2rem"} />
                ) : (
                  "Submit"
                )}
              </SubmitButton>
              {errorMessage && <Error>{errorMessage}</Error>}
            </form>
          )}
        </Formik>
      )}
    </Layout>
  )
}

export default AuthResetPassword
