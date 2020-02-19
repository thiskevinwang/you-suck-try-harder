import React, { useState, useEffect } from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"
import _ from "lodash"
import { animated } from "react-spring"
import styled from "styled-components"
import { useMutation, gql, ApolloError } from "@apollo/client"
import jwt from "jsonwebtoken"

import { Layout } from "components/Layout"
import { LoadingIndicator } from "components/Loaders"
import { Field, SubmitButton } from "components/Form"

import { Strings } from "consts/Strings"

const Error = styled(animated.div)`
  border: 3px solid #ff7979;
  border-radius: 0.25rem;
  color: #ffaaaa;
  background: #f00;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        username
        password
        last_name
        first_name
      }
      token
    }
  }
`

type Values = {
  email: string
  password: string
}
const AuthLogin = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const token =
    typeof window !== "undefined" && localStorage.getItem(Strings.token)
  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded: any) => {
      const userId = decoded?.userId
      if (userId) {
        router.replace("/")
      }
    })
  }, [])

  const [login, { data, loading }] = useMutation(LOGIN, {
    onCompleted: data => {
      const { token } = data.login
      localStorage.setItem(Strings.token, data.login.token)

      jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded: any) => {
        /**
         * @TODO Set an error, if the JWT isn't decoded correctly
         * - ex. app secret is incorrect, or something
         *
         */
        const userId = decoded?.userId
        if (userId) {
          router.replace("/")
        }
      })
    },
    onError: (error: ApolloError) => {
      setErrorMessage(error.message)
    },
  })

  return (
    <Layout>
      <h1>Login</h1>
      <Formik<Values>
        initialValues={{ email: "", password: "" }}
        validateOnMount={false}
        validate={values => {
          const errors: FormikErrors<Values> = {}
          if (!values.email) {
            errors.email = "Required"
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address"
          }
          if (!values.password) {
            errors.password = "Required"
          }
          return errors
        }}
        onSubmit={async (values, actions) => {
          login({ variables: values })
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
              id="email"
              name="email"
              type="email"
              label="email"
              placeholder="email"
            />
            <Field
              id="password"
              name="password"
              type="password"
              label="password"
              placeholder="password"
            />
            <SubmitButton
              type="submit"
              disabled={!props.isValid || props.isSubmitting}
            >
              {loading ? <LoadingIndicator /> : "Login"}
            </SubmitButton>
            {errorMessage && <Error>{errorMessage}</Error>}
          </form>
        )}
      </Formik>
      <small>
        <Link href="/auth/signup">
          <a>Sign up</a>
        </Link>
        &nbsp;|&nbsp;
        <Link href="/auth/forgot">
          <a>Forgot your password?</a>
        </Link>
      </small>
    </Layout>
  )
}

export default AuthLogin
