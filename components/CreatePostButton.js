import React from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
const CreatePostButton = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [openOptions, setOpenOptions] = React.useState(false)
  return (
    <div className='fixed bottom-0 right-0 m-10 z-10'>
      <button
        className='relative bg-green-600 bg-opacity-80 text-gray-100 text-opacity-80 text-5xl rounded-full w-28 h-28 shadow-lg'
        onClick={() => router.push('/create-post')}
      >
        +
      </button>
    </div>
  )
}

export default CreatePostButton
