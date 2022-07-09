const like = async (
  data,
  user,
  userF420,
  setLikes,
  setPostLiked,
  router,
  likes
) => {
  try {
    if (user.email && userF420?._id) {
      const resp = await fetch(
        `/api/posts/likes?id=${data._id}&uid=${userF420._id}&likes=${likes}`,
        {
          method: 'PUT',
        }
      )
      const dta = await resp.json()

      if (dta.success) {
        setLikes(Number(dta.newLikes))
        setPostLiked(dta.isLiked)
      }
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error(error)
  }
}

export default like
