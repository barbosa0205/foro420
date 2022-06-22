import Image from 'next/image'
import React from 'react'

const CommentResp = ({ userImage, username, comment, likes }) => {
  return (
    <div className='w-full px-2 pb-6 my-3 pl-10 flex items-center'>
      <Image
        src={userImage}
        alt='user'
        width={50}
        height={50}
        className='rounded-full mx-auto'
      />
      <div className='relative w-fit bg-stone-200 ml-2 pb-2 px-4 rounded-3xl'>
        <div className='pt-2 border-l-2 border-stone-200'></div>
        <h2 className='ml-2 text-2xl font-semibold'>{username}</h2>
        <p>{comment}</p>
        <div className='w-full flex items-center absolute -bottom-9'>
          <i className='ri-heart-line mr-2 cursor-pointer'></i>
        </div>
      </div>
    </div>
  )
}

export default CommentResp
