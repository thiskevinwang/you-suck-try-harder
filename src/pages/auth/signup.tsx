import React, { useState, useEffect } from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"
import _ from "lodash"
import { animated } from "react-spring"
import styled from "styled-components"
import { gql, ApolloError, useMutation } from "@apollo/client"
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

const SIGN_UP = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $username: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(
      email: $email
      password: $password
      username: $username
      firstName: $firstName
      lastName: $lastName
    ) {
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
  username: string
  firstName: string
  lastName: string
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

  const [signup, { data, loading }] = useMutation(SIGN_UP, {
    onCompleted: data => {
      const { token } = data.signup
      localStorage.setItem(Strings.token, data.signup.token)

      jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded: any) => {
        /**
         * @TODO Set an error, if the JWT isn't decoded correctly
         * - ex. app secret is incorrect, or something
         *
         */
        const userId = decoded?.userId
        if (userId) {
          router.replace("/auth/login/")
        }
      })
    },
    onError: (error: ApolloError) => {
      setErrorMessage(error.message)
    },
  })

  return (
    <Layout>
      <h1>Sign up</h1>
      <Formik<Values>
        initialValues={{
          email: "",
          password: "",
          username: "",
          firstName: "",
          lastName: "",
        }}
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
          } else if (values.password.length < 8) {
            errors.password = "Must be 8 or more characters"
          }

          if (!values.username) {
            errors.username = "Required"
          } else if (!/^[a-z]/i.test(values.username)) {
            errors.username = "Must begin with a letter"
          } else if (/\s/.test(values.username)) {
            errors.username = "No whitespaces allowed"
          } else if (!/^[a-z][a-z0-9_-]*$/i.test(values.username)) {
            errors.username = "No special characters, except: _ -"
          }

          if (!values.firstName) errors.firstName = "Required"
          if (!values.lastName) errors.lastName = "Required"

          return errors
        }}
        onSubmit={async (values, actions) => {
          signup({ variables: values })
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
            <Field
              id="username"
              name="username"
              type="text"
              label="username"
              placeholder="username"
            />
            <Field
              id="firstName"
              name="firstName"
              type="text"
              label="first name"
              placeholder="first name"
            />
            <Field
              id="lastName"
              name="lastName"
              type="text"
              label="last name"
              placeholder="last name"
            />
            <SubmitButton
              type="submit"
              disabled={!props.isValid || props.isSubmitting}
            >
              {loading ? <LoadingIndicator /> : "Submit"}
            </SubmitButton>
            {errorMessage && <Error>{errorMessage}</Error>}
          </form>
        )}
      </Formik>
      <small>
        <Link href="/auth/login">
          <a>Login</a>
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
