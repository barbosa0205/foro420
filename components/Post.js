import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icons/Icon'
import useUser from 'contexts/useUser'

const Post = ({ data }) => {
  const router = useRouter()
  const { userF420 } = useUser()
  const [likes, setLikes] = React.useState(data.likes)

  const like = async () => {
    try {
      const resp = await fetch(
        `/api/posts/likes?id=${data._id}&uid=${userF420._id}&likes=${likes}`,
        {
          method: 'PUT',
        }
      )
      const dta = await resp.json()
      console.log('dta', dta)
      if (dta.success) {
        console.log(dta.newLikes)
        setLikes(Number(dta.newLikes))
      }
    } catch (error) {
      console.error(error)
    }
  }

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
            className='postArticle flex items-center w-full min-h-min max-h-44 p-2 rounded-xl bg-gray-50 overflow-hidden hover:bg-stone-100'
          >
            <div className='flex justify-center items-center max-w-xs min-w-fit'>
              <Image
                src={data.image}
                alt={data.title}
                width={100}
                height={100}
                className='rounded-lg cursor-pointer object-cover'
                style={{
                  maxWidth: '10rem',
                }}
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
              <footer className='w-fit flex justify-evenly items-center'>
                <button
                  onClick={like}
                  className='flex items-center justify-center mx-1 px-2 bg-white shadow-sm shadow-gray-200 rounded-md'
                >
                  <Icon icon={'ri-thumb-up-line'} color='text-emerald-600' />
                  <p className='px-2 text-emerald-700'>{likes}</p>
                </button>

                <Icon
                  icon='ri-share-box-fill'
                  color='text-gray-600 text-3xl cursor-pointer'
                />
                <Icon
                  icon='ri-bookmark-line'
                  color='text-gray-600 text-3xl cursor-pointer'
                />
                <Icon
                  icon='ri-star-line'
                  color='text-gray-600 text-3xl cursor-pointer'
                />
              </footer>
            </div>
          </motion.article>
        </AnimatePresence>
      )}
      <hr />
    </>
  )
}

export default Post
