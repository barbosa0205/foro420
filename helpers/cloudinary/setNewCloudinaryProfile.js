export const setNewCloudinaryProfile = async (imageId, uid) => {
  try {
    const resp = await fetch(`api/cloudinary?uid=${uid}&image_id=${imageId}`, {
      method: 'PUT',
      'content-Type': 'application/json',
    })
    const data = await resp.json()
  } catch (error) {
    console.log(error)
  }
}
