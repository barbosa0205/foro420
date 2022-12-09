import Post from 'components/Post'
import React from 'react'
import AlienBagEmpty from 'assets/SVG/alien-bag-empty.svg'
import useUser from 'contexts/useUser'
import Image from 'next/image'
import usePost from 'contexts/posts/usePost'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'
import FeedPost from 'components/FeedPost'

const FeedLayout = ({ postsToShow }) => {
  const { userF420 } = useUser()
  const { setOpenCreatePost, openCreatePost, loading } = usePost()

  const [comments, setComments] = useState([])

  const router = useRouter()

  useEffect(() => {
    console.log('postsToShow', postsToShow)
  }, [postsToShow])

  return (
    <>
      {userF420._id && (
        <section>
          <div className='flex items-center p-5 my-5 bg-white shadow-sm rounded-xl'>
            <Image
              onClick={() => {
                router.push(
                  `/profile/${userF420?.username}?id=${userF420?._id}`
                )
              }}
              src={userF420.image}
              alt={'profile'}
              width={50}
              height={50}
              className='object-cover rounded-full cursor-pointer'
            />
            <div
              onClick={() => setOpenCreatePost(true)}
              className='flex items-center px-3 py-2 mx-3 rounded-full w-full bg-gray-200 cursor-pointer hover:bg-zinc-300'
            >
              <p className='text-2xl'>¿En que estas pensando?</p>
            </div>
          </div>
          {loading ? (
            <div className='w-full'>
              <p className='max-w-xl mx-auto text-center font-bold py-2 rounded-xl bg-emerald-500 text-white'>
                Subiendo tu publicación...
              </p>
            </div>
          ) : (
            ''
          )}
        </section>
      )}
      {postsToShow && postsToShow.length ? (
        <>
          {postsToShow.map((post) => {
            return <FeedPost key={post._id} postData={post} />
          })}
        </>
      ) : (
        <div className='relative mx-auto  w-full flex flex-col items-center mt-20'>
          <AlienBagEmpty className='w-fit max-w-7xl' />
          <p className='text-center text-zinc-400 text-6xl font-bold'>
            No hay Publicaciones para mostrar :(
          </p>
        </div>
      )}
    </>
  )
}

export default FeedLayout
