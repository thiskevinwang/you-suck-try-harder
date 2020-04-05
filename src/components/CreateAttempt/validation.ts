import * as Yup from "yup"

export const ValidationSchema = Yup.object().shape({
  /**
   * formik.errors.attempts will either be an array []
   * or a string
   */
  attempts: Yup.array()
    .of(
      Yup.object().shape({
        grade: Yup.number()
          /** https://github.com/jquense/yup/issues/211 */
          .typeError("you must specify a number")
          .required("Grade is required"),
        send: Yup.boolean().required(),
        flash: Yup.boolean().required(),
        date: Yup.date()
          .required("Date is required")
          .max(new Date(), "cannot enter a date in the future!"),
      })
    )
    .min(1, "Please log at least one")
    .max(5, "For now, just submit 5 at a time please"),
})
