import axios from 'axios'

import { setNewCloudinaryProfile } from './setNewCloudinaryProfile'

export const uploadImageToCloudinary = async (
  formData,
  uid,
  { verify = false }
) => {
  try {
    const respImageUploaded = axios.post(
      `https://api.cloudinary.com/v1_1/foro420-media/image/upload?api_key=$828592597243784`,
      formData
    )
    const dataImageUpload = await respImageUploaded

    const imageId = dataImageUpload.data.public_id

    if (verify) {
      //verify if cloudinary id already exists and delete the image from cloudinary
      const resp = await fetch(`api/cloudinary?uid=${uid}`, {
        method: 'GET',
        'content-type': 'application/json',
      })
      const data = await resp.json()

      if (data.cloudinary) {
        const resp = await fetch(
          '/api/cloudinary?cloudinary=' + data.cloudinary,
          {
            method: 'DELETE',
          }
        )
        setNewCloudinaryProfile(imageId, uid, folder)
        return (
          'https://res.cloudinary.com/foro420-media/image/upload/v1660276446/' +
          imageId
        )
      }
    } else {
      setNewCloudinaryProfile(imageId, uid)
      return (
        'https://res.cloudinary.com/foro420-media/image/upload/v1660276446/' +
        imageId
      )
    }
  } catch (e) {
    console.log(e)
  }
}
