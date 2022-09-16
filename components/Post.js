import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icons/Icon'
import useUser from 'contexts/useUser'
import like from 'helpers/likePost'
import savePost from 'helpers/savePost'
import Notification from './Notification'
const Post = ({ data }) => {
  const router = useRouter()
  const { userF420, user, notify, setNotify } = useUser()
  const [error, setError] = React.useState('')
  const [likes, setLikes] = React.useState(data.likes)
  const [postLiked, setPostLiked] = React.useState(false)
  const [postSaved, setPostSaved] = React.useState(false)
  const [noMore, setNoMore] = React.useState(false)

  const verifyLikeAndSave = async () => {
    try {
      const resp = await fetch(
        `/api/posts/post-liked-or-saved?uid=${userF420._id}&id=${data._id}`
      )
      const { success, likedPost, savedPost } = await resp.json()
      if (success) {
        setPostLiked(likedPost)
        setPostSaved(savedPost)
      }
    } catch (error) {
      setE
    }
  }

  useEffect(() => {
    if (userF420?._id && !noMore) {
      verifyLikeAndSave()
      setNoMore(true)
    }
  }, [userF420])

  useEffect(() => {
    if (notify) {
      setTimeout(() => {
        setNotify('')
      }, 2500)
    }
  }, [notify])

  return (
    <>
      {data._id && (
        <AnimatePresence>
          <motion.article
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: 'just',
            }}
            className='postArticle flex items-center w-full min-h-fit p-2 rounded-xl bg-white overflow-hidden hover:bg-gray-50'
          >
            <div className='flex justify-center items-center max-w-xs min-w-min'>
              <Image
                src={data.image}
                alt={data.title}
                width={100}
                height={100}
                className='rounded-lg cursor-pointer object-cover'
                priority={true}
                onClick={() => {
                  router.push(`/posts/${data._id}`)
                }}
              />
            </div>

            {/* post container */}
            <div className='w-full flex flex-col p-1 overflow-hidden'>
              {/* post title */}
              {data.title.length > 65 ? (
                <h2
                  onClick={() => {
                    router.push(`/posts/${data._id}`)
                  }}
                  className='suspenseDotStyle max-w-5xl font-semibold text-3xl ml-3 md:text-3xl xl:text-4xl cursor-pointer'
                >
                  {data.title.slice(0, 70) + ' '}...
                </h2>
              ) : (
                <h2
                  onClick={() => {
                    router.push(`/posts/${data._id}`)
                  }}
                  className='suspenseDotStyle max-w-5xl font-semibold text-3xl ml-3 md:text-3xl xl:text-4xl cursor-pointer'
                >
                  {data.title}
                </h2>
              )}
              {/* post category-user container */}
              <div className='w-fit flex justify-evenly items-center'>
                <Link href={`/categories/${data.category.name}`}>
                  <a className='text-emerald-600'>{data.category.name}</a>
                </Link>
                <p className='px-2'>por </p>
                <Link
                  href={`/profile/${data.postedBy.username}?id=${data.postedBy._id}`}
                >
                  <a className='text-emerald-600'>{data.postedBy.username}</a>
                </Link>
              </div>
              {/*footer container*/}
              <footer className='w-fit flex justify-evenly items-center pb-2'>
                <button
                  onClick={() =>
                    like(
                      data,
                      user,
                      userF420,
                      setLikes,
                      setPostLiked,
                      router,
                      likes
                    )
                  }
                  className='flex items-center justify-center mx-1 px-2 bg-white shadow-sm shadow-gray-200 rounded-md'
                >
                  <Icon
                    icon={`${
                      postLiked ? 'ri-thumb-up-fill' : 'ri-thumb-up-line'
                    }`}
                    color='text-emerald-600'
                  />
                  <p className='px-2 text-emerald-700'>{likes}</p>
                </button>

                {/* <Icon
                  icon='ri-share-box-fill'
                  color='text-gray-600 text-3xl cursor-pointer'
                /> */}
                <Icon
                  onClick={async () => {
                    const dta = await savePost(data, user, userF420, router)
                    if (dta === undefined) {
                      return
                    } else {
                      if (dta.success) {
                        if (dta.postUnsaved) {
                          setPostSaved(false)
                          setNotify(
                            'Post removido de tus guardados correctamente'
                          )
                        } else {
                          setPostSaved(true)
                          setNotify('Post guardado correctamente')
                        }
                      }
                    }
                  }}
                  icon={`${
                    postSaved ? 'ri-bookmark-fill' : 'ri-bookmark-line'
                  }`}
                  color='text-gray-600 text-3xl cursor-pointer'
                />
              </footer>
            </div>
          </motion.article>
        </AnimatePresence>
      )}
      <hr />

      {notify && <Notification text={notify} />}
      {error && <Notification type='error' text={error} />}
    </>
  )
}

export default React.memo(Post)
