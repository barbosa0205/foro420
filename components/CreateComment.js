import Image from 'next/image'
import React from 'react'

const CreateComment = ({ user, postId, setComments }) => {
  const [comment, setComment] = React.useState('')

  const publishComment = async () => {
    if (comment.trim() === '') {
      return
    }
    try {
      const resp = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: comment,
          postedBy: user._id,
          type: 'comment',
        }),
      })
      if (resp.status === 200) {
        const data = await resp.json()
        setComments((prev) => [...prev, data])
        setComment('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <hr />
      <div className='flex items-center w-full py-2 px-5 '>
        <Image
          src={user.image}
          alt='user'
          width={50}
          height={50}
          className='rounded-full'
        />
        <textarea
          className='w-full ml-2 outline-none p-1 text-2xl resize-none'
          placeholder='Escribe un comentario público...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          onClick={publishComment}
          className='p-2 rounded-md text-gray-50 bg-emerald-600'
        >
          Comentar
        </button>
      </div>
      <hr />
    </>
  )
}

export default CreateComment
