import React from 'react'

export const UseForm = (initialValues, validateErrors) => {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState({})

  const validateErrorSubmit = () => {
    //transformar el objeto values en un array
    let errorObj = {}
    const valuesArray = Object.keys(values).map((key) => {
      return {
        key,
        value: values[key],
      }
    })
    //si hay errores se guardan en el objeto errorObj y se setea en el state
    valuesArray.map((value) => {
      const error = validateErrors(value.key, value.value)

      if (!error) {
        errorObj[value.key] = ''
      } else {
        errorObj[value.key] = error
      }
      setErrors(errorObj)
    })

    //verificar si hay errores
    const hasErrors = Object.values(errorObj).some((error) => error !== '')
    //si hay errores se retorna para que no se envie el formulario, de lo contrario se envía
    return hasErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    const hasError = validateErrors(name, value)
    if (hasError) {
      setErrors({ ...errors, [name]: hasError })
    } else {
      setErrors({ ...errors, [name]: '' })
    }
  }

  return [values, handleChange, validateErrorSubmit, errors]
}
