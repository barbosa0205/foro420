export default function handler(req, res) {
  const { method, query, body } = req
  switch (method) {
    case 'GET':
      try {
      } catch (error) {
        console.log('ERROR AL OBTENER POST', error)
        return res.status(500).json({ message: 'Error al obtener el post' })
      }
  }
}
