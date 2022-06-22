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
const PostPage = ({ user, post }) => {
  const { userF420, setUserF420 } = useUser()
  const [comments, setComments] = useState([])
  useEffect(() => {
    if (user) {
      setUserF420(user)
    }
    if (post) {
      setComments(post.comments)
    }
  }, [])

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
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  commentId={comment._id}
                  userImage={comment.postedBy.image}
                  username={comment.postedBy.username}
                  comment={comment.content}
                  postId={post._id}
                  responses={comment.responses}
                  postedbyId={comment.postedBy._id}
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
    </>
  )
}

export default React.memo(PostPage)

export const getServerSideProps = async (context) => {
  try {
    await dbConnect()

    //get user from db
    const session = await getSession(context)
    const userSession = session.user
    const user = await JSON.parse(
      JSON.stringify(
        await UserSchema.findOne({
          email: userSession.email,
        })
      )
    )

    const urlId = context.query.post
    const post = JSON.parse(JSON.stringify(await PostSchema.findById(urlId)))
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
        user,
        post,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {},
    }
  }
}
