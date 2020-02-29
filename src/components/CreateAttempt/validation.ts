import * as Yup from "yup"

export const ValidationSchema = Yup.object().shape({
  attempts: Yup.array().of(
    Yup.object().shape({
      grade: Yup.number().required("required"),
      send: Yup.boolean(),
      flash: Yup.boolean(),
    })
  ),
})
