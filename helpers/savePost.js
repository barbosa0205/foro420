const savePost = async (data, user, userF420, router) => {
  try {
    if (user.email && userF420?._id) {
      const resp = await fetch(
        `/api/posts/save?id=${data._id}&uid=${userF420._id}`,
        {
          method: 'PUT',
        }
      )
      const dta = await resp.json()
      return dta
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error(error)
  }
}

export default savePost
