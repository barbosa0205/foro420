import FeedPostSchema from 'models/FeedPost'

const handler = async (req, res) => {
  const { method, query, body } = req
  switch (method) {
    case 'POST':
      try {
        const { content, image, postedBy, type } = body
        const feedPost = await new FeedPostSchema({
          content,
          image,
          postedBy,
          type,
        })
        const newFeedPost = await feedPost.save()
        return res.status(200).json({
          success: true,
          newFeedPost,
        })
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al publicar' })
      }
  }
}

export default handler
