import useSocket from 'contexts/socket/useSocket'
import { sendNotification } from 'helpers/notifications'
import Image from 'next/image'
import React from 'react'

const CreateComment = ({ user, postId, setComments, comments = [], type }) => {
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
          type,
        }),
      })
      if (resp.status === 200) {
        const data = await resp.json()
        if (comments.length > 0) {
          const newComments = [data, ...comments]
          if (comments.length) {
            setComments([...newComments])
            setComment('')
          }
        } else {
          console.log('no hay comentarios antes', data)

          setComments([data])
          setComment('')
        }

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
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className='flex items-center w-full'
        >
          <Image
            src={user.image}
            alt='user'
            width={50}
            height={50}
            className='rounded-full'
            objectFit={'cover'}
          />
          <textarea
            onKeyUp={({ key }) => {
              if (key === 'Enter') {
                publishComment()
              }
            }}
            className='w-full h-fit ml-2 outline-none px-5 text-xl resize-none bg-zinc-100 rounded-full'
            placeholder='Escribe un comentario público...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </form>
      </div>
    </>
  )
}

export default CreateComment
