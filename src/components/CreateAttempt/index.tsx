import styled, { BaseProps } from "styled-components"
import { Formik, Form, FieldArray, useField } from "formik"
import { gql, useMutation, DataProxy, FetchResult } from "@apollo/client"

import { SubmitButton, Field } from "components/Form"
import { StyledCircularProgress } from "components/Loaders/StyledCircularProgress"
import { GET_ATTEMPTS_BY_USER_ID } from "hooks/useQueryHeatmap"

import { ValidationSchema } from "./validation"

import { MinusSquare } from "icons/minus-square"
import { CheckInCircle } from "icons/check-in-circle"
import { CheckInCircleFill } from "icons/check-in-circle-fill"
import { XCircle } from "icons/x-circle"
import { XCircleFill } from "icons/x-circle-fill"

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

const YesNoSelect = ({ name, label = "Label", ...props }) => {
  const [field, meta, { setValue }] = useField({ name })
  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: "2.5rem",
        marginLeft: "1rem",
      }}
    >
      {label}
      <div>
        <Button {...field} type="button" onClick={setTrue}>
          {field.value ? <CheckInCircleFill /> : <CheckInCircle />}
        </Button>
        <Button {...field} type="button" onClick={setFalse}>
          {!field.value ? <XCircleFill /> : <XCircle />}
        </Button>
      </div>
    </div>
  )
}

const DEFAULT_VALUES = {
  grade: undefined,
  send: false,
  flash: false,
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
        attempts: [DEFAULT_VALUES],
      }}
      onSubmit={async ({ attempts }, { resetForm, setStatus }) => {
        try {
          await Promise.all([
            attempts.map(async ({ grade, send, flash }) => {
              const created = await createAttempt({
                variables: {
                  userId: currentUserId,
                  grade: parseInt(grade),
                  send,
                  flash,
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
      {({ values: { attempts }, isValid, isSubmitting }) => (
        <Form>
          <FieldArray
            name="attempts"
            render={arrayHelpers => (
              <>
                {attempts.map((attempt, index) => {
                  const handleRemove = () => arrayHelpers.remove(index)
                  return (
                    <div style={{ display: "flex" }} key={index}>
                      <div
                        style={{
                          marginBottom: `2.5rem`,
                          marginRight: `1rem`,
                          alignSelf: "center",
                        }}
                      >
                        <Button type="button" onClick={handleRemove}>
                          <MinusSquare />
                        </Button>
                      </div>

                      <Field
                        type={"text"}
                        name={`attempts[${index}].grade`}
                        id={`attempts[${index}].grade`}
                        label={`V Grade`}
                        placeholder={`V Grade`}
                      />

                      <YesNoSelect
                        name={`attempts[${index}].send`}
                        label={"Send"}
                      />
                      <YesNoSelect
                        name={`attempts[${index}].flash`}
                        label={"Flash"}
                      />
                    </div>
                  )
                })}

                <div>
                  <AddAnother onClick={() => arrayHelpers.push(DEFAULT_VALUES)}>
                    Add another attempt
                  </AddAnother>
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

  color: ${(p: BaseProps) => p.theme.colors.borderColor};
  border-bottom: 1px solid ${(p: BaseProps) => p.theme.colors.borderColor};
  :hover {
    color: ${(p: BaseProps) => p.theme.colors.main};
    border-bottom: 1px solid ${(p: BaseProps) => p.theme.colors.main};
  }

  transition: color 200ms ease-in-out, border-bottom 200ms ease-in-out;
`

const Button = styled.button`
  svg:not(.filled) {
    stroke: ${(p: BaseProps) => p.theme.colors.borderColor};
  }
  :hover,
  :focus {
    svg:not(.filled) {
      stroke: ${(p: BaseProps) => p.theme.colors.main};
    }
  }
  /* disable focus border */
  outline: none;
  display: inline-block;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
`
