import styled from "styled-components"

import { Formik } from "formik"

import { Field } from "components/Form/Field"

export const CreateAttempt = () => {
  return (
    <Formik initialValues={{ email: "", password: "" }} onSubmit={() => {}}>
      <Field
        id={"email"}
        name={"email"}
        type={"text"}
        label={"email"}
        placeholder={"email"}
      />
    </Formik>
  )
}
