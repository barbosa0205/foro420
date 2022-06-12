export const handler = async (req, res) => {
  try {
    const { method, body, query } = req

    switch (method) {
      case 'GET':
        try {
          const post = await PostSchema.findOne({ _id: query.id })
          return res.status(200).json({ success: true, post: post })
        } catch (error) {
          return res.status(404).json({ success: false, error: error })
        }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
