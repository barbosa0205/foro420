import useUser from 'contexts/useUser'
import Image from 'next/image'
import React from 'react'
import CommentResp from './CommentResp'
import CreateResp from './CreateResp'
import { MenuPopup } from './MenuPopup'

const Comment = ({
  postId,
  userImage,
  username,
  comment,
  likes,
  responses,
  commentId,
  postedbyId,
}) => {
  const { userF420 } = useUser()
  const [openCreateresp, setOpenCreateResp] = React.useState(false)
  const [responsesPublished, setResponsesPublished] = React.useState([])
  const [responsesLength, setResponsesLength] = React.useState(responses.length)
  const [responsesToShow, setResponsesToShow] = React.useState([])
  const [openCommentOptions, setOpenCommentOptions] = React.useState(false)
  const [commentContent, setCommentContent] = React.useState(comment)
  const [contentEditable, setContentEditable] = React.useState('')
  const [editComment, setEditComment] = React.useState(false)

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
        console.log('sipaso')
        setCommentContent(contentEditable)
        setContentEditable('')
        setEditComment(false)
      }
    }
  }

  return (
    <>
      {postId && (
        <>
          <article className='width-full pt-2 pb-4 mr-5'>
            <div className='relative w-full px-2 pb-5 flex items-center'>
              <Image
                src={userImage}
                alt='user'
                width={50}
                height={50}
                className='rounded-full mx-auto'
              />
              <div className='relative w-fit bg-stone-200 ml-2 py-2 px-4 rounded-3xl'>
                <h2 className='ml-2 text-2xl font-semibold'>{username}</h2>
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
                        <MenuPopup>
                          <p
                            onClick={() => {
                              setContentEditable(commentContent)
                              setOpenCommentOptions(false)
                              setEditComment(true)
                            }}
                            className='text-2xl my-1 cursor-pointer'
                          >
                            Editar
                          </p>
                          <hr />
                          <p
                            onClick={() => deleteComment}
                            className='text-2xl my-1 cursor-pointer'
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
          </article>
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
            responsesPublished.map((response) => (
              <>
                <CommentResp
                  key={response._id}
                  userImage={response.postedBy.image}
                  username={response.postedBy.username}
                  comment={response.content}
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
            responsesToShow.map((response) => (
              <CommentResp
                key={response._id}
                userImage={response.postedBy.image}
                username={response.postedBy.username}
                comment={response.content}
              />
            ))}
        </>
      )}
      <hr />
    </>
  )
}

export default Comment
