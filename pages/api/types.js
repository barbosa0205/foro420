import TypeSchema from 'models/Type'

export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const types = await TypeSchema.find({})
        res.status(200).json({
          success: true,
          data: types,
        })
      } catch (error) {
        console.error(error)
      }
      break
  }
}
