import * as Yup from "yup"

export const ValidationSchema = Yup.object().shape({
  attempts: Yup.array().of(
    Yup.object().shape({
      grade: Yup.number()
        /** https://github.com/jquense/yup/issues/211 */
        .typeError("you must specify a number")
        .required("required"),
      send: Yup.boolean(),
      flash: Yup.boolean(),
    })
  ),
})
