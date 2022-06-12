import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Icon from './Icons/Icon'

const Post = ({ data }) => {
  const router = useRouter()

  return (
    <>
      {data._id && (
        <article className='postArticle flex items-center w-full min-h-min max-h-44 p-2 rounded-xl bg-gray-50 overflow-hidden'>
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
                <a className='text-green-600'>{data.category.name}</a>
              </Link>
              <p className='px-2'>por </p>
              <Link
                href={`/profile/${data.postedBy.username}?id=${data.postedBy._id}`}
              >
                <a className='text-green-600'>{data.postedBy.username}</a>
              </Link>
            </div>
            {/*footer container*/}
            <footer className='w-fit flex justify-evenly items-center'>
              <button className='flex items-center justify-center mx-1 px-2 bg-white shadow-sm shadow-gray-200 rounded-md'>
                <Icon icon={'ri-arrow-up-line'} color='text-green-600' />
                <p className='text-green-700'>{data.likes}</p>
              </button>
              <button className='flex items-center justify-center mx-1 px-2 bg-white shadow-sm shadow-gray-200 rounded-md'>
                <Icon icon={'ri-arrow-down-line'} color='text-red-600' />
                <p className='text-red-700'>{data.dislikes}</p>
              </button>

              <Icon
                icon='ri-chat-4-line'
                color='text-gray-600 text-3xl cursor-pointer'
              />
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
        </article>
      )}
      <hr />
    </>
  )
}

export default Post
