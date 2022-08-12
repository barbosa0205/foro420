import UserSchema from 'models/F420User'
import cloudinary from 'cloudinary'
export default async function handelr(req, res) {
  const { method, query } = req

  const cloudinaryv2 = cloudinary.v2
  cloudinaryv2.config({
    cloud_name: 'foro420-media',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  switch (method) {
    case 'GET':
      try {
        let cloudinary = ''
        const user = await UserSchema.findOne({
          _id: query.uid,
        })
        if (user?.cloudinary) {
          cloudinary = user.cloudinary
        }
        res.status(200).json({
          success: true,
          cloudinary: cloudinary,
        })
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        })
      }
      break
    case 'PUT':
      try {
        console.log('uid: ' + query.uid)
        console.log('cloudinary_profile: ' + query.image_id)
        const user = await UserSchema.updateOne(
          {
            _id: query.uid,
          },
          {
            cloudinary: query.image_id,
          }
        )

        res.status(200).json({
          success: true,
          message: 'cloudinary profile updated successfully',
        })
      } catch (err) {
        res
          .status(500)
          .json({ message: 'Error al obtener cloudinary profile', err })
      }
      break
    case 'DELETE':
      try {
        const deleteCloudinaryImage = cloudinaryv2.uploader.destroy(
          query.cloudinary
        )
        res.status(200).json({
          success: true,
          message: 'cloudinary image delete correctly',
        })
      } catch (err) {
        res.status(500).json({
          success: false,
          message: 'Cloudinary image can not be deleted successfully',
        })
      }
  }
}
