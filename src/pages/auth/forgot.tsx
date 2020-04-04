import React, { useState } from "react"
import Link from "next/link"
import { Formik, FormikProps, FormikErrors } from "formik"
import _ from "lodash"
import { animated } from "react-spring"
import styled from "styled-components"
import { useMutation, ApolloError, gql } from "@apollo/client"

import { Layout } from "components/Layout"
import { StyledCircularProgress } from "components/Loaders/StyledCircularProgress"
import { Spacer } from "components/Spacer"
import { SubmitButton, Field } from "components/Form"

const Error = styled(animated.div)`
  border: 3px solid #ff7979;
  border-radius: 0.25rem;
  color: #ffaaaa;
  background: #f00;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`
const Success = styled(animated.div)`
  border: 3px solid #bfb;
  border-radius: 0.25rem;
  color: #bfb;
  background: #292;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`

const REQUEST_PASSWORD_RESET_LINK = gql`
  mutation RequestPasswordResetLink($email: String!) {
    requestPasswordResetLink(email: $email) {
      message
    }
  }
`

type Values = {
  email: string
}

const AuthForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [requestPasswordResetLink, { data, loading }] = useMutation(
    REQUEST_PASSWORD_RESET_LINK,
    {
      onCompleted: data => {
        const { message } = data.requestPasswordResetLink
        setSuccessMessage(message)
      },
      onError: (error: ApolloError) => {
        setErrorMessage(error.message)
      },
    }
  )

  return (
    <Layout>
      <h1>Forgot Password</h1>
      <Formik<Values>
        initialValues={{ email: "" }}
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

          return errors
        }}
        onSubmit={async (values, actions) => {
          requestPasswordResetLink({ variables: values })
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
            <Spacer y={25} />
            {successMessage ? (
              <Success>{successMessage}</Success>
            ) : (
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
            )}

            {errorMessage && <Error>{errorMessage}</Error>}
          </form>
        )}
      </Formik>
      <small>
        <Link href="/auth/login">
          <a>Login</a>
        </Link>
      </small>
    </Layout>
  )
}

export default AuthForgotPassword
