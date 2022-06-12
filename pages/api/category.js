import CategorySchema from 'models/Category'

export const handler = async (req, res) => {
  try {
    const { method, query } = req
    switch (method) {
      case 'GET':
        const category = await CategorySchema.findById(query.id)
        res.status(200).json({
          success: true,
          data: category,
        })
    }
  } catch (error) {
    console.log(error)
  }
}
