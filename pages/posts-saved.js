import React from 'react'
import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
import { getSession } from 'next-auth/react'
import NoPostsSAvedImage from 'assets/SVG/no_posts_saved.svg'
import Post from 'components/Post'
import Container from 'components/Container'
import { dbConnect } from 'utils/mongoose'
const PostsSaved = ({ posts }) => {
  return (
    <main className='w-full flex flex-col items-center  min-h-screen pt-10'>
      <Container>
        <div className='w-full flex items-center justify-center'>
          <h1 className='w-fit font-bold text-6xl text-center text-emerald-600 px-3 py-1 sm:rounded-lg sm:text-6xl'>
            PUBLICACIONES GUARDADAS
          </h1>
        </div>
        <section className='w-full h-screen flex flex-col items-center'>
          {posts?.length > 0 ? (
            posts.map((post) => <Post key={post._id} data={post} />)
          ) : (
            <>
              <NoPostsSAvedImage className='max-w-2xl mx-auto my-5 mt-20' />
              <p className='text-5xl md:text-6xl font-semibold text-zinc-400'>
                No tienes publicaciones guardadas
              </p>
            </>
          )}
        </section>
      </Container>
    </main>
  )
}

export default PostsSaved

export const getServerSideProps = async (context) => {
  try {
    await dbConnect()
    let posts = []

    const session = await getSession(context)

    const user = await UserSchema.findOne({
      email: session?.user?.email,
    })

    if (user) {
      const postsSavedId = user.postsSaved

      posts = await PostSchema.find({
        _id: {
          $in: postsSavedId,
        },
      })

      posts = JSON.parse(JSON.stringify(posts))
    }

    return {
      props: { posts },
    }
  } catch (error) {
    console.log('error al obtener los posts guardados', error)
    return {
      props: {},
    }
  }
}
