import * as Yup from "yup"

export const ValidationSchema = Yup.object().shape({
  attempts: Yup.array()
    .of(
      Yup.object().shape({
        grade: Yup.number()
          /** https://github.com/jquense/yup/issues/211 */
          .typeError("you must specify a number")
          .required("required"),
        send: Yup.boolean().required(),
        flash: Yup.boolean().required(),
      })
    )
    // don't know where these validation errors show up yet
    .min(1, "Please log at least one")
    .max(5, "For now, just submit 5 at a time please"),
})
