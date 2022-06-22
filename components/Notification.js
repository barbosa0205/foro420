import Image from 'next/image'
import React from 'react'

const Notification = ({ data }) => {
  const { user, text } = data
  return (
    <>
      <div className='w-fit max-w-xl fixed bottom-0 left-0 flex items-center ml-5 mb-5 rounded-lg shadow-sm shadow-gray-300 '>
        <Image
          src={user.image}
          alt={`user${user.username}`}
          width={150}
          height={150}
        />
        <h2 className='font-semibold text-4xl'>{text}</h2>
      </div>
    </>
  )
}

export default Notification
