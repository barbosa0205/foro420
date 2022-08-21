import useUser from 'contexts/useUser'
import Image from 'next/image'
import React from 'react'
import { Alert } from './Alert'
import { MenuPopup } from './MenuPopup'
import Modal from './Modal'

const CommentResp = ({
  userImage,
  username,
  comment,
  likes,
  postedbyId,
  respId,
  setResponsesToShow,
  commentId,
  setNotify,
}) => {
  const { userF420 } = useUser()
  const [openCommentOptions, setOpenCommentOptions] = React.useState(false)
  const [commentContent, setCommentContent] = React.useState(comment)
  const [contentEditable, setContentEditable] = React.useState('')
  const [editComment, setEditComment] = React.useState(false)
  const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false)

  const editAComment = async (comment) => {
    if (comment.trim().length > 0) {
      const resp = await fetch('/api/comment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: respId,
          content: contentEditable,
        }),
      })
      const data = await resp.json()
      if (data.success) {
        setCommentContent(contentEditable)
        setContentEditable('')
        setEditComment(false)
      }
    }
  }

  const deleteComment = async () => {
    const resp = await fetch('/api/comment', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: respId,
        commentId,
      }),
    })
    const data = await resp.json()

    if (data.success) {
      setNotify(data.message)
      setResponsesToShow((resp) => {
        const newArray = resp.filter((r) => r._id !== respId)
        return newArray
      })
      setOpenDeleteQuestion(false)
    } else {
      console.log(data)
      setNotify('No se pudo borrar la respuesta')
      setOpenDeleteQuestion(false)
    }
  }

  React.useEffect(() => {
    return () => {
      setContentEditable(false)
    }
  }, [])

  return (
    <>
      <div className='w-full px-2 pb-6 my-3 pl-16 flex items-center'>
        <Image
          src={userImage}
          alt='user'
          width={50}
          height={50}
          className='rounded-full mx-auto'
          objectFit={'cover'}
        />
        <div className='relative w-fit bg-stone-200 ml-2 pb-2 px-4 rounded-3xl'>
          <div className='pt-2 border-l-2 border-stone-200'></div>
          <h2 className='ml-2 p-0 text-2xl font-semibold'>{username}</h2>
          {!editComment ? (
            <p>{commentContent}</p>
          ) : (
            <textarea
              value={contentEditable}
              onChange={(e) => {
                setContentEditable(e.target.value)
              }}
              placeholder='Escribe un comentario...'
              className='w-full ml-2 outline-none px-2 text-2xl resize-none bg-transparent'
            ></textarea>
          )}
          {editComment && (
            <div className='w-full flex justify-end items-center'>
              <button
                onClick={() => {
                  setContentEditable('')
                  setEditComment(false)
                }}
                className='relative text-stone-500 font-semibold mb-2 px-2'
              >
                Cancelar
              </button>
              {contentEditable.length > 0 && contentEditable !== comment && (
                <button
                  onClick={() => editAComment(contentEditable)}
                  className='relative text-emerald-600 font-semibold mb-2 px-2'
                >
                  Aplicar
                </button>
              )}
            </div>
          )}
          <div className='w-full flex items-center absolute -bottom-9'>
            <i className='ri-heart-line mr-2 cursor-pointer'></i>
          </div>
          {postedbyId === userF420._id && (
            <>
              <i
                onClick={() => setOpenCommentOptions(!openCommentOptions)}
                className='ri-more-2-fill text-stone-400 absolute -right-6 top-1 cursor-pointer'
              ></i>
              {openCommentOptions && (
                <MenuPopup top={'top-2'} right={'right-0'}>
                  <p
                    onClick={() => {
                      setContentEditable(commentContent)
                      setOpenCommentOptions(false)
                      setEditComment(true)
                    }}
                    className='text-2xl px-8 my-1 cursor-pointer'
                  >
                    Editar
                  </p>
                  <hr />
                  <p
                    onClick={() => {
                      setOpenDeleteQuestion(true)
                      setOpenCommentOptions(false)
                    }}
                    className='text-2xl my-1 px-8 cursor-pointer'
                  >
                    Borrar
                  </p>
                </MenuPopup>
              )}
            </>
          )}
        </div>
      </div>
      {openDeleteQuestion && (
        <Modal position='fixed'>
          <Alert
            message={'Seguro que quieres eliminar esta Respuesta?'}
            type='yesno'
            actionNo={() => setOpenDeleteQuestion(false)}
            actionYes={deleteComment}
          />
        </Modal>
      )}
    </>
  )
}

export default CommentResp
