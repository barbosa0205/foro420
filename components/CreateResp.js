import useUser from 'contexts/useUser'
import Image from 'next/image'
import React, { useEffect } from 'react'

const CreateResp = ({
  postId,
  parentComment,
  setOpenCreateResp,
  setResponsesPublished,
}) => {
  const [resp, setResp] = React.useState('')
  const { userF420 } = useUser()

  useEffect(() => {
    console.log('parentComment', parentComment)
  }, [])

  const publicResponse = async () => {
    const response = await fetch('/api/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postedBy: userF420._id,
        content: resp,
        type: 'response',
        postId,
        parentComment,
      }),
    })
    const data = await response.json()
    console.log('data', data)
    setOpenCreateResp(false)
    setResponsesPublished((prev) => [
      ...prev,
      {
        ...data,
      },
    ])
  }

  return (
    <div className=' mt-2 ml-16 px-2 flex items-center'>
      <Image
        src={userF420.image}
        alt='user'
        width={50}
        height={50}
        className='rounded-full mx-auto'
      />
      <div className='relative w-full max mr-2 bg-stone-200 ml-2 px-4 rounded-3xl'>
        <h2 className='ml-2 text-2xl font-semibold'>{userF420.username}</h2>
        <textarea
          value={resp}
          onChange={(e) => {
            setResp(e.target.value)
          }}
          placeholder='Escribe una respuesta...'
          className='w-full ml-2 outline-none p-2  text-2xl resize-none bg-transparent'
        ></textarea>
        {resp.length > 0 && (
          <div className='w-full flex justify-end items-center'>
            <button
              onClick={publicResponse}
              className='relative text-emerald-600 font-semibold mb-2 px-2'
            >
              {' '}
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateResp
