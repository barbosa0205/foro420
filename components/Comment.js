import useUser from 'contexts/useUser'
import Image from 'next/image'
import React from 'react'
import CommentResp from './CommentResp'
import CreateResp from './CreateResp'
import { MenuPopup } from './MenuPopup'
import Modal from './Modal'
import { motion, AnimatePresence } from 'framer-motion'
import { Alert } from './Alert'
import { useRouter } from 'next/router'
const Comment = ({
  postId,
  userImage,
  username,
  comment,
  likes,
  responses,
  commentId,
  postedbyId,
  comments,
  setComments,
  userId,
}) => {
  const router = useRouter()
  const { userF420, setNotify } = useUser()
  const [openCreateresp, setOpenCreateResp] = React.useState(false)
  const [responsesPublished, setResponsesPublished] = React.useState([])
  const [responsesLength, setResponsesLength] = React.useState(responses.length)
  const [responsesToShow, setResponsesToShow] = React.useState([])
  const [openCommentOptions, setOpenCommentOptions] = React.useState(false)
  const [commentContent, setCommentContent] = React.useState(comment)
  const [contentEditable, setContentEditable] = React.useState('')
  const [editComment, setEditComment] = React.useState(false)
  const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false)

  const showResponses = async ({ qty, limit }) => {
    if (qty <= limit) {
      const res = await fetch(
        `/api/resp?commentId=${commentId}&task=getallresponses`
      )
      const data = await res.json()
      setResponsesToShow(data.responses)
      const newLength = data.responses.length - responsesLength
      setResponsesLength(newLength)
    }
  }

  const editAComment = async (comment) => {
    if (comment.trim().length > 0) {
      const resp = await fetch('/api/comment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: commentId,
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
        postId,
        id: commentId,
        responses,
      }),
    })
    const data = await resp.json()

    if (data.success) {
      setNotify(data.message)
      setComments(data.newComments)
      setOpenDeleteQuestion(false)
    } else {
      setNotify('No se pudo borrar el comentario')
      setOpenDeleteQuestion(false)
    }
  }

  React.useEffect(() => {
    return () => {
      setContentEditable(false)
    }
  }, [])

  const goProfile = (username, uid) => {
    router.push(`/profile/${username}?id=${uid}`)
  }

  return (
    <>
      {postId && (
        <>
          <AnimatePresence>
            <motion.article
              initial={{
                opacity: 0,
                x: '-100vw',
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                x: '100vw',
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className='width-full pt-2 pb-4 mr-5'
            >
              <div className='relative w-full px-2 pb-5 flex items-center'>
                <Image
                  src={userImage}
                  alt='user'
                  width={50}
                  height={50}
                  className='rounded-full mx-auto cursor-pointer'
                  objectFit={'cover'}
                  onClick={() => goProfile(username, userId)}
                />
                <div className='relative w-fit bg-stone-200 ml-2 py-2 px-4 rounded-3xl'>
                  <h2
                    className='text-2xl font-semibold m-0 p-0 cursor-pointer'
                    onClick={() => goProfile(username, userId)}
                  >
                    {username}
                  </h2>
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
                      {contentEditable.length > 0 &&
                        contentEditable !== comment && (
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
                    <p
                      onClick={() => setOpenCreateResp(true)}
                      className='text-xl mx-2 hover:text-gray-600 hover:font-semibold cursor-pointer'
                    >
                      Responder
                    </p>
                  </div>
                  {/* optionComments */}
                  <>
                    {postedbyId === userF420._id && (
                      <>
                        <i
                          onClick={() =>
                            setOpenCommentOptions(!openCommentOptions)
                          }
                          className='ri-more-2-fill text-stone-400 absolute -right-6 top-1 cursor-pointer'
                        ></i>
                        {openCommentOptions && (
                          <MenuPopup top='top-10' right='-right-32'>
                            <p
                              onClick={() => {
                                setContentEditable(commentContent)
                                setOpenCommentOptions(false)
                                setEditComment(true)
                              }}
                              className='text-2xl my-1 px-8 cursor-pointer'
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
                  </>
                  {/* end optionComments*/}
                </div>
              </div>
            </motion.article>
            {responsesLength > 0 && !responsesPublished.length && (
              <p
                onClick={() =>
                  showResponses({
                    qty: responsesLength,
                    limit: 10,
                  })
                }
                className='text-center cursor-pointer my-2'
              >
                Ver {responsesLength <= 99 ? responsesLength : '99+'} respuestas
              </p>
            )}
            {responsesPublished &&
              responsesPublished.map((response, index) => (
                <>
                  <CommentResp
                    key={index}
                    userImage={response.postedBy.image}
                    username={response.postedBy.username}
                    comment={response.content}
                    postedbyId={response.postedBy._id}
                    respId={response._id}
                    setResponsesToShow={setResponsesToShow}
                    commentId={commentId}
                    setNotify={setNotify}
                  />
                </>
              ))}

            {openCreateresp && (
              <CreateResp
                postId={postId}
                parentComment={commentId}
                setOpenCreateResp={setOpenCreateResp}
                setResponsesPublished={setResponsesPublished}
              />
            )}
            {responsesToShow.length > 0 &&
              responsesToShow.map((response, index) => (
                <CommentResp
                  key={index}
                  userImage={response.postedBy.image}
                  username={response.postedBy.username}
                  comment={response.content}
                  postedbyId={response.postedBy._id}
                  respId={response._id}
                  setResponsesToShow={setResponsesToShow}
                  commentId={commentId}
                  setNotify={setNotify}
                />
              ))}
          </AnimatePresence>
        </>
      )}

      <hr />
      {openDeleteQuestion && (
        <Modal position='fixed'>
          <Alert
            type={'yesno'}
            message={'Seguro que quieres eliminar este comentario?'}
            actionNo={() => setOpenDeleteQuestion(false)}
            actionYes={deleteComment}
          />
        </Modal>
      )}
    </>
  )
}

export default Comment
