export const completeProfileErrors = (name, value) => {
  switch (name) {
    case 'fullname':
      return value.length < 3
        ? 'El nombre debe tener al menos 3 caracteres'
        : ''
    case 'username':
      return value.length < 3
        ? 'El nombre de usuario debe tener al menos 3 caracteres'
        : ''
    case 'birthday':
      const validAge = /^\d{4}-\d{2}-\d{2}$/.test(value)
      if (validAge) {
        const today = new Date()
        const birthday = new Date(value)
        let age = today.getFullYear() - birthday.getFullYear()
        const m = today.getMonth() - birthday.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
          age = age - 1
        }
        if (age < 18) {
          return 'Debes ser mayor de edad'
        } else {
          return ''
        }
      } else {
        return 'La fecha de nacimiento no es valida'
      }

    default:
      return ''
  }
}
