export const profileErrors = (name, value) => {
  switch (name) {
    case 'fullname':
      return value.trim().length < 3
        ? 'El nombre debe tener al menos 3 caracteres'
        : ''
    case 'username':
      return value.trim().length < 3
        ? 'El nombre de usuario debe tener al menos 3 caracteres'
        : ''
    default:
      return ''
  }
}
