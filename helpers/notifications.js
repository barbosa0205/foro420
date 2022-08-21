export const getAllNotifications = async (uid) => {
  try {
    const resp = await fetch(
      `/api/notifications?uid=${uid}&getnotifications=all`
    )
    const data = await resp.json()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

export const getPendientNotifications = async ({ uid }) => {
  try {
    const resp = await fetch(
      `/api/notifications?uid=${uid}&getnotifications=pendients`
    )
    const data = await resp.json()

    return data
  } catch (error) {
    console.log('error', error)
  }
}
export const sendNotification = async (type, { user, postId }) => {
  try {
    const resp = await fetch(
      `/api/notifications?emisor=${user}&post=${postId}&type=${type}`,
      {
        method: 'PUT',
        'content-type': 'application/json',
      }
    )
    const data = await resp.json()
    return data
  } catch (error) {
    console.log('error', error)
  }
}
