export const postErrors = (name, value) => {
  switch (name) {
    case 'postText': {
      return value.trim().length < 1
        ? 'El post nececita almenos 1 caracter'
        : ''
    }
    default:
      return ''
  }
}
