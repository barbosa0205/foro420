import useSocket from 'contexts/socket/useSocket'
import { sendNotification } from 'helpers/notifications'
import Image from 'next/image'
import React from 'react'

const CreateComment = ({ user, postId, setComments, comments }) => {
  const { socket } = useSocket()
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
        const newComments = [data, ...comments]

        setComments([...newComments])
        setComment('')

        //sending notification

        const notificationSended = await sendNotification('comment', {
          user: user._id,
          postId,
        })

        if (notificationSended.success) {
          socket.emit('notificationAlert', {
            socketEmisor: user.socket,
            socketReceptor: notificationSended.socket,
            data: notificationSended.data,
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <hr />
      <div className='flex items-center w-full py-2 px-5 flex-wrap'>
        <div className='flex items-center w-full'>
          <Image
            src={user.image}
            alt='user'
            width={50}
            height={50}
            className='rounded-full'
            objectFit={'cover'}
          />
          <textarea
            className='w-full ml-2 outline-none p-1 text-2xl resize-none'
            placeholder='Escribe un comentario público...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className='w-full flex justify-end p-5'>
          <button
            onClick={publishComment}
            className='p-2 rounded-md text-gray-50 bg-emerald-600'
          >
            Comentar
          </button>
        </div>
      </div>
      <hr />
    </>
  )
}

export default CreateComment
