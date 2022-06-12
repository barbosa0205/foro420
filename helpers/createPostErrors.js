export const createPostErrors = ({
  title,
  content,
  image,
  postedBy,
  category,
  type,
}) => {
  let errors = []
  if (!title) {
    errors.push({
      title: 'El titulo es requerido',
    })
  } else if (title.length < 5 || title.length > 50) {
    errors.push({
      title: 'El titulo debe contener  de 5 a 50 caracteres',
    })
  }
  if (!content) {
    errors.push({
      content: 'El contenido es requerido',
    })
  } else if (content.length < 10) {
    errors.push({
      content: 'El contenido debe contener  de 10 a más caracteres',
    })
  }
  if (!image) {
    errors.push({
      image: 'La imagen es requerida',
    })
  }
  if (!category) {
    errors.push({
      category: 'La categoria es requerida',
    })
  }
  if (!type) {
    errors.push({
      type: 'El tipo es requerido',
    })
  }
  return errors
}
