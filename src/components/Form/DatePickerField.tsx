import * as React from "react"
import { useField } from "formik"
import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"
import theme from "styled-theming"
import DatePicker from "react-datepicker"

import { Spacer } from "components/Spacer"

const background = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.background,
  dark: (props: BaseProps) => props.theme.formInput.background,
})
const borderColorBase = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.borderColorBase,
  dark: (props: BaseProps) => props.theme.formInput.borderColorBase,
})
const borderColorFocus = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.borderColorFocus,
  dark: (props: BaseProps) => props.theme.formInput.borderColorFocus,
})
const color = theme("mode", {
  light: (props: BaseProps) => props.theme.formInput.color,
  dark: (props: BaseProps) => props.theme.formInput.color,
})

interface FieldRendererProps {
  hasError: boolean
}
const FieldRenderer = styled(animated.div)<FieldRendererProps>`
  --geist-cyan: #79ffe1;
  --geist-purple: #f81ce5;

  display: flex;
  flex-direction: column;
  max-width: 15rem;
  position: relative;

  input {
    ::selection {
      background: ${theme("mode", {
        light: "var(--geist-cyan)",
        dark: "var(--geist-purple)",
      })}; /* WebKit/Blink Browsers */
    }
    ::-moz-selection {
      background: ${theme("mode", {
        light: "var(--geist-cyan)",
        dark: "var(--geist-purple)",
      })}; /* Gecko Browsers */
    }
    caret-color: ${theme("mode", {
      light: "var(--geist-cyan)",
      dark: "var(--geist-purple)",
    })};

    height: 2rem;
    background: ${background};
    border-color: ${theme("mode", {
      light: (props) => (props.hasError ? "red" : borderColorBase),
      dark: (props) => (props.hasError ? "darkred" : borderColorBase),
    })};
    border-width: 1px;
    border-style: solid;
    border-radius: 0.25rem;
    color: ${color};
    transition: border-color 150ms ease-in-out, background 150ms ease-in-out;
    will-change: border-color, background;
    padding-left: 0.4rem;
    outline: none;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: ${color};
    -webkit-box-shadow: 0 0 0px 1000px ${background} inset;
    box-shadow: 0 0 0px 1000px ${background} inset;
  }

  input:focus {
    border-color: ${theme("mode", {
      light: (props) => (props.hasError ? "red" : borderColorFocus),
      dark: (props) => (props.hasError ? "darkred" : borderColorFocus),
    })};
  }

  input::placeholder {
    text-transform: uppercase;
    font-size: 0.8rem;

    transition: opacity 200ms ease-in-out;
    will-change: opacity;
  }
  input:focus::placeholder {
    opacity: 0;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label {
    transform: translateY(-1.1rem);
    opacity: 1;
  }

  label {
    border-radius: 0.25rem;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 150ms ease-in-out, transform 150ms ease-in-out,
      background 150ms ease-in-out;
    will-change: opacity transform background;
    position: absolute;
    left: 0.4rem;
    text-transform: uppercase;

    color: ${theme("mode", {
      light: (props) => (props.hasError ? "red" : color),
      dark: (props) => (props.hasError ? "darkred" : color),
    })};
  }
`

const FieldError = styled(animated.div)`
  font-size: 0.7rem;
  right: 0.3rem;
  position: absolute;
  color: ${theme("mode", {
    light: "red",
    dark: "darkred",
  })};
  transform: translateY(2.4rem);
`

interface DatePickerFieldProps {
  id?: string
  name: string
  type: string
  label: string
  placeholder: string
  dateFormat?: string
}

export const DatePickerField = ({
  label,
  dateFormat = "MM/dd/yyyy",
  ...props
}: DatePickerFieldProps) => {
  /**
   * ⚠️if field.value is `undefined` (ex. after Formik's `resetForm({})`),
   * it will no longer 'control' the associated input field.
   *
   * This can be fixed with the null-check below:
   * value={field.value ?? ""}
   *
   */
  const [field, meta, helpers] = useField(props)

  return (
    <FieldRenderer
      hasError={((meta.touched && meta.error) as unknown) as boolean}
    >
      <DatePicker
        name={field.name}
        autoComplete={"off"}
        placeholderText={"MM/DD/YYYY"}
        selected={field.value}
        onChange={helpers.setValue}
        onSelect={helpers.setValue}
        onBlur={field.onBlur}
        maxDate={new Date()}
        // customInput={
        //   <>
        //     <input {...field} {...props} value={field.value ?? ""} />
        //     <label htmlFor={props.id ?? props.name}>{label}</label>
        //   </>
        // }
        dateFormat={dateFormat}
        wrapperClassName={"react-datepicker-input"}
      />

      {meta.touched && meta.error ? (
        <FieldError>{meta.error}</FieldError>
      ) : null}
      <Spacer y={17} />
    </FieldRenderer>
  )
}
