import FeedPostSchema from 'models/FeedPost'
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
