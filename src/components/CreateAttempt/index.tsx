import * as React from "react"
import styled, { BaseProps } from "styled-components"
import { Formik, Form, FieldArray, useField } from "formik"
import { gql, useMutation, DataProxy, FetchResult } from "@apollo/client"
import { Grid } from "@material-ui/core"

import { Spacer } from "components/Spacer"
import {
  CheckboxField,
  SubmitButton,
  Field,
  DatePickerField,
} from "components/Form"
import { StyledCircularProgress } from "components/Loaders/StyledCircularProgress"
import { GET_ATTEMPTS_BY_USER_ID } from "hooks/useQueryHeatmap"

import { ValidationSchema } from "./validation"

import { MinusSquare } from "icons/minus-square"

const CREATE_ATTEMPT_MUTATION = gql`
  mutation CreateAttempt(
    $userId: ID!
    $grade: Int!
    $send: Boolean!
    $date: Date
  ) {
    createAttempt(userId: $userId, grade: $grade, send: $send, date: $date) {
      id
      date
      grade
      send
      user {
        id
      }
    }
  }
`

const CheckboxComponent = ({ name, label = "Label", ...props }) => {
  const [field, meta, { setValue }] = useField({ name, type: "checkbox" })

  return (
    <Grid container>
      <Grid item xs={"auto"}>
        <span
          style={{
            textTransform: "uppercase",
            fontSize: "0.9rem",
            letterSpacing: "2px",
          }}
        >
          {label}
        </span>
      </Grid>
      <Grid item xs={"auto"}>
        <CheckboxField
          {...field}
          id={field.name}
          checked={field.checked ?? field.value}
        />
      </Grid>
    </Grid>
  )
}

const DEFAULT_ATTEMPT = {
  grade: undefined,
  send: false,
  flash: false,
  date: undefined,
}
export const CreateAttempt = ({ currentUserId }) => {
  const [createAttempt, { data, loading }] = useMutation(
    CREATE_ATTEMPT_MUTATION,
    {
      update: (
        cache: DataProxy,
        mutationResult: FetchResult<{
          createAttempt: {
            id: string
            date: Date | string
            grade: number
            send: boolean
          }
        }>
      ) => {
        const queryAndVariables = {
          query: GET_ATTEMPTS_BY_USER_ID,
          variables: { userId: currentUserId },
        }
        const cacheData: { getAttemptsByUserId: any[] } = cache.readQuery({
          ...queryAndVariables,
        })
        console.group("update")
        console.log(cache)
        console.log(cacheData)
        console.log(mutationResult)
        console.groupEnd()

        cache.writeQuery({
          ...queryAndVariables,
          data: {
            getAttemptsByUserId: [
              ...cacheData.getAttemptsByUserId,
              mutationResult.data.createAttempt,
            ],
          },
        })
      },
    }
  )
  return (
    <Formik
      validationSchema={ValidationSchema}
      initialValues={{
        attempts: [DEFAULT_ATTEMPT],
      }}
      onSubmit={async ({ attempts }, { resetForm, setStatus }) => {
        try {
          await Promise.all([
            attempts.map(async ({ grade, send, flash, date }) => {
              const created = await createAttempt({
                variables: {
                  userId: currentUserId,
                  grade: parseInt(grade),
                  send,
                  flash,
                  date,
                },
              })
            }),
          ])
          resetForm({})
        } catch (err) {
          console.error(err)
        }
      }}
    >
      {({ values: { attempts }, isValid, isSubmitting, setFieldValue }) => (
        <Form>
          <FieldArray
            name="attempts"
            render={(arrayHelpers) => (
              <>
                {attempts.map((attempt, index) => {
                  const handleRemove = () => arrayHelpers.remove(index)
                  return (
                    <React.Fragment key={index}>
                      <Grid container alignItems={"center"}>
                        {/** 1 */}
                        <Grid item xs={2} sm={2} md={1} direction={"column"}>
                          <Button type="button" onClick={handleRemove}>
                            <MinusSquare />
                          </Button>
                          <Spacer y={17} />
                        </Grid>

                        {/** 2 */}
                        <Grid item xs={8} sm={8} md={10}>
                          <Grid container>
                            <Grid item xs={12} sm={5} md={4} lg={4}>
                              <Field
                                type={"text"}
                                name={`attempts[${index}].grade`}
                                id={`attempts[${index}].grade`}
                                label={`V Grade`}
                                placeholder={`V Grade`}
                              />
                            </Grid>

                            <Grid item xs={12} sm={5} md={4} lg={4}>
                              <DatePickerField
                                type={"text"}
                                name={`attempts[${index}].date`}
                                label={"Date"}
                                placeholder={"MM/DD/YYYY"}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/** 3 */}
                        <Grid item xs={2} sm={2} md={1}>
                          <Grid container direction={"column"}>
                            <CheckboxComponent
                              name={`attempts[${index}].send`}
                              label={"Send"}
                            />
                            <CheckboxComponent
                              name={`attempts[${index}].flash`}
                              label={"Flash"}
                            />
                            <Spacer y={17} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )
                })}
                <div>
                  {attempts.length < 5 ? (
                    <AddAnother
                      onClick={() => arrayHelpers.push(DEFAULT_ATTEMPT)}
                    >
                      Add another attempt
                    </AddAnother>
                  ) : (
                    <AddAnother className="disabled">
                      Maximum of 5 for now
                    </AddAnother>
                  )}
                </div>
                <SubmitButton
                  type="submit"
                  disabled={!isValid || isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <StyledCircularProgress size={"1.2rem"} />
                  ) : (
                    "Submit"
                  )}
                </SubmitButton>
              </>
            )}
          />
        </Form>
      )}
    </Formik>
  )
}

const AddAnother = styled.small`
  display: inline-block;
  padding-top: 1rem;
  padding-bottom: 2px;
  margin-bottom: 1rem;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed !important;
  }

  color: ${(p: BaseProps) => p.theme.colors.borderColor};
  border-bottom: 1px solid ${(p: BaseProps) => p.theme.colors.borderColor};
  :hover:not(.disabled) {
    color: ${(p: BaseProps) => p.theme.colors.main};
    border-bottom: 1px solid ${(p: BaseProps) => p.theme.colors.main};
  }

  transition: color 200ms ease-in-out, border-bottom 200ms ease-in-out;
`

interface ButtonProps {
  hasError?: boolean
}
const Button = styled.button<ButtonProps>`
  svg:not(.filled) {
    stroke: ${(p: BaseProps & ButtonProps) =>
      p.hasError ? p.theme.colors.error : p.theme.colors.borderColor};
  }
  :hover,
  :focus {
    svg:not(.filled) {
      stroke: ${(p: BaseProps) => p.theme.colors.main};
    }
  }
  padding-left: 0px;
  padding-right: 0px;
  /* disable focus border */
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
`
