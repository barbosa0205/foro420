export default async function handler(req, res) {
  const { method, query } = req

  switch (meth) {
    case 'GET':
      try {
      } catch (error) {
        res.status(500).json({
          success: false,
          error,
        })
      }
      break

    default:
      break
  }
}
