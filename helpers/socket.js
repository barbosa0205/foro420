export const saveSocket = async (socketId, uid) => {
  try {
    const resp = await fetch(`/api/socket?socketId=${socketId}&uid=${uid}`, {
      method: 'PUT',
      'content-Type': 'application/json',
    })
    const data = await resp.json()
    return data
  } catch (error) {
    console.log('error', error)
  }
}
