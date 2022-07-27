import CategorySchema from 'models/Category'
import { dbConnect } from 'utils/mongoose'
const handler = async (req, res) => {
  try {
    await dbConnect()
    const { method, query } = req
    switch (method) {
      case 'GET':
        const category = await CategorySchema.findOne({
          name: query.category,
        })
        console.log('category', category)
        res.status(200).json({
          success: true,
          data: category,
        })
    }
  } catch (error) {
    console.log(error)
  }
}

export default handler
