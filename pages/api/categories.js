import CategorySchema from 'models/Category'

export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const categories = await CategorySchema.find({})
        res.status(200).json({
          success: true,
          data: categories,
        })
      } catch (error) {
        console.error(error)
      }
      break
  }
}
