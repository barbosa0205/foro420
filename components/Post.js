import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Icon from './Icons/Icon'

const Post = ({ data }) => {
  return (
    <>
      <article className='flex w-full min-h-min p-2 rounded-xl bg-gray-50'>
        <Image
          src={data.img}
          alt={data.title}
          width={100}
          height={100}
          className='rounded-lg'
          priority={true}
        />
        {/* post container */}
        <div className='w-full flex flex-col p-1'>
          {/* post title */}
          <h2 className='font-bold text-xl text-center'>{data.title}</h2>
          {/* post category-user container */}
          <div className='w-fit flex justify-evenly items-center'>
            <Link href={`/categories/${data.category}`}>
              <a className='text-green-600'>{data.category}</a>
            </Link>
            <p className='px-2'>por </p>
            <Link href={`/profile/${data.user}`}>
              <a className='text-green-600'>{data.user}</a>
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
      <hr />
    </>
  )
}

export default Post
