import FeedPostSchema from 'models/FeedPost'
import CommentSchema from 'models/Comment'
import cloudinary from 'cloudinary'
const handler = async (req, res) => {
  const { method, query, body } = req

  const cloudinaryv2 = cloudinary.v2
  cloudinaryv2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  switch (method) {
    case 'DELETE':
      try {
        const { data } = JSON.parse(body)

        const images = data.image

        // si hay imagenes se borraran de cloudinary

        if (images.length) {
          images.map(async (img) => {
            const imgId = img.split('/').pop()
            console.log(imgId)
            const deleteCloudinaryImage = await cloudinaryv2.uploader.destroy(
              `feedPosts/${imgId}`
            )
          })
        }

        // si hay comentarios tambien borrarlos

        const feedPost = await FeedPostSchema.findOne({
          _id: data._id,
        })

        let comments = feedPost.comments
        console.log('comments', comments)
        comments.forEach(async (comment) => {
          let commentContent = await CommentSchema.findOne({
            _id: comment,
          })

          if (commentContent.responses.length) {
            commentContent.responses.forEach(async (response) => {
              await CommentSchema.deleteOne({
                _id: response,
              })
            })
          }
          const commentDeleted = await CommentSchema.deleteOne({
            _id: commentContent._id,
          })
          console.log('commentDeleted', commentDeleted)
        })

        // borrar feedPost

        const feedPostDeleted = await FeedPostSchema.deleteOne({
          _id: data._id,
        })
        res.status(200).json({
          feedPostDeleted,
        })
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar post' })
      }
  }
}

export default handler
