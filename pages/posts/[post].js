import React, { useEffect, useState } from 'react'
import { dbConnect } from 'utils/mongoose'
import PostSchema from 'models/Post'
import UserSchema from 'models/F420User'
import TypeSchema from 'models/Type'
import CategorySchema from 'models/Category'
import CommentSchema from 'models/Comment'
import { getSession } from 'next-auth/react'
import useUser from 'contexts/useUser'
import Image from 'next/image'
import Link from 'next/link'
import Comment from 'components/Comment'
import CreateComment from 'components/CreateComment'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import Icon from 'components/Icons/Icon'
import { MenuPopup } from 'components/MenuPopup'
import { Alert } from 'components/Alert'
import Modal from 'components/Modal'
const PostPage = ({ post, user: userConnected }) => {
  const router = useRouter()
  const { user, userF420, setUserF420 } = useUser()
  const [comments, setComments] = useState([])
  const [notify, setNotify] = React.useState('')
  const [openSettings, setOpenSettings] = React.useState(false)
  const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState()

  const deletePost = async () => {
    //TODO: do the delete post logic after come back from smoke weed 🥦
    const resp = await fetch('/api/posts/post?id=' + post._id, {
      method: 'DELETE',
    })
  }

  useEffect(() => {
    if (!userConnected.user) {
      router.push('/login')
    }
  }, []) |
    useEffect(() => {
      if (post) {
        setComments(post.comments)
      }
    }, [])

  useEffect(() => {
    if (notify) {
      setTimeout(() => {
        setNotify('')
      }, 2500)
    }
  }, [notify])

  return (
    <>
      {userF420._id && (
        <main className='w-full md:w-11/12 max-w-screen-xl min-h-screen mx-auto'>
          <header className='coverImage w-full relative flex flex-col justify-center items-start px-2 rounded-lg shadow-sm'>
            <Image
              src={post.image}
              alt={'portada'}
              layout='fill'
              objectFit='cover'
            />

            <div className='z-10 absolute right-0 bottom-0 w-fit bg-black rounded-sm bg-opacity-40'>
              <h1 className=' text-right font-semibold text-3xl px-2 pt-5 text-gray-50 text-opacity-100'>
                {post.title}
              </h1>
            </div>
          </header>
          <div className='relative w-full flex items-center justify-end px-3 py-2'>
            <Icon
              icon={'ri-settings-4-fill cursor-pointer'}
              color='text-stone-400'
              onClick={() => setOpenSettings(!openSettings)}
            />
            <AnimatePresence>
              {openSettings && (
                <MenuPopup right='right-16' top={'top-5'}>
                  <p className='text-2xl cursor-pointer px-5 hover:bg-gray-200'>
                    Editar publicación
                  </p>
                  <p
                    onClick={() => {
                      setOpenDeleteQuestion(true)
                      setOpenSettings(false)
                    }}
                    className='text-2xl cursor-pointer px-5 hover:bg-gray-200'
                  >
                    Eliminar publicación
                  </p>
                </MenuPopup>
              )}
            </AnimatePresence>
          </div>
          <div className='flex items-center bg-white shadow-sm max-w-fit px-5 py-1 rounded-md mt-6 ml-1'>
            <Image
              className='w-40 h-40 rounded-full mx-auto'
              width={60}
              height={60}
              src={post.postedBy.image}
              alt='user'
            />
            <Link
              href={`/profile/${post.postedBy.username}?id=${post.postedBy._id}`}
            >
              <a className='ml-2 text-2xl text-green-600 font-medium'>
                {post.postedBy.username}
              </a>
            </Link>
          </div>

          <section className='w-full bg-white px-2 pb-5 rounded-lg mt-5'>
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </section>
          <hr />
          <section className='w-full pt-2 mt-14 bg-white'>
            <h2 className='text-center font-medium text-3xl mb-5'>
              Comentarios
            </h2>
            <CreateComment
              user={userF420}
              postId={post._id}
              setComments={setComments}
            />
            {comments.length ? (
              comments.map((comment, index) => (
                <Comment
                  key={index}
                  commentId={comment._id}
                  userImage={comment.postedBy.image}
                  username={comment.postedBy.username}
                  comment={comment.content}
                  postId={post._id}
                  responses={comment.responses}
                  postedbyId={comment.postedBy._id}
                  setNotify={setNotify}
                  setComments={setComments}
                />
              ))
            ) : (
              <p className='text-center my-10'>
                Se el primero en comentar esta publicación
              </p>
            )}
          </section>
        </main>
      )}

      {openDeleteQuestion && (
        <Modal position='fixed'>
          <Alert
            message={'Seguro que quieres eliminar la publicación?'}
            type={'yesno'}
            actionYes={deletePost}
            actionNo={() => setOpenDeleteQuestion(false)}
          />
        </Modal>
      )}

      {notify && (
        <div className='fixed z-10 top-10 w-full flex items-center justify-center'>
          <span className='p-7 bg-emerald-600 shadow-md rounded-md'>
            <h3 className='text-2xl font-bold text-stone-50'>{notify}</h3>
          </span>
        </div>
      )}
    </>
  )
}

export default React.memo(PostPage)

export const getServerSideProps = async (context) => {
  try {
    await dbConnect()

    const user = await getSession(context)

    const urlId = context.query.post
    const post = JSON.parse(JSON.stringify(await PostSchema.findById(urlId)))

    if (!post) {
      return {
        redirect: {
          destination: '/',
        },
      }
    }
    const postedBy = JSON.parse(
      JSON.stringify(await UserSchema.findById(post.postedBy))
    )
    const category = JSON.parse(
      JSON.stringify(await CategorySchema.findById(post.category))
    )
    const type = JSON.parse(
      JSON.stringify(await TypeSchema.findById(post.type))
    )

    const commentsPromise = post.comments.map(async (comment) => {
      let newComment = await CommentSchema.findOne({
        _id: comment,
      })
        .where('commentType')
        .equals('comment')

      if (newComment) {
        const postedBy = await UserSchema.findOne({
          _id: newComment.postedBy,
        })

        newComment.postedBy = postedBy

        return newComment
      }
    })

    const comments = await Promise.all(commentsPromise)

    const commentsFilter = comments.filter((comment) => comment)

    console.log(commentsFilter)

    post.postedBy = postedBy
    post.category = category
    post.type = type
    post.comments = JSON.parse(JSON.stringify(commentsFilter))
    return {
      props: {
        post,
        user,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {},
    }
  }
}
