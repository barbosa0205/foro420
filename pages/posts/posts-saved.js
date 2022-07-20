import React, { useState, useEffect } from 'react'
import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
import CategorySchema from 'models/Category'
import TypeSchema from 'models/Type'
import { getSession } from 'next-auth/react'
import NoPostsSAvedImage from 'assets/SVG/no_posts_saved.svg'
import loadingaesthetic from 'assets/loadingaesthetic.gif'
import Post from 'components/Post'
import Container from 'components/Container'
import useUser from 'contexts/useUser'
import Image from 'next/image'

const PostsSaved = () => {
  const { userF420 } = useUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const getPostsSaved = async ({ id, PostsSaved }) => {
    try {
      if (PostsSaved.length > 0) {
        const resp = await fetch(
          `/api/posts-saved?uid=${id}&posts=${PostsSaved}`
        )
        const data = await resp.json()
        if (data.success) {
          if (data.postsSaved.length) {
            setPosts(data.postsSaved)
            setLoading(false)
          }
        } else {
          if (resp.status === 404) {
            setLoading(false)
          }
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (!userF420._id) {
      return
    }

    getPostsSaved({ id: userF420._id, PostsSaved: userF420.postsSaved })
  }, [userF420])

  return (
    <main className='w-full flex flex-col items-center  min-h-screen pt-10'>
      <Container>
        <div className='w-full flex items-center justify-center'>
          <h1 className='w-fit font-bold text-6xl text-center text-emerald-600 px-3 py-1 sm:rounded-lg sm:text-6xl'>
            PUBLICACIONES GUARDADAS
          </h1>
        </div>
        <section className='w-full h-screen flex flex-col items-center'>
          {!posts.length && !loading ? (
            <>
              <NoPostsSAvedImage className='max-w-2xl mx-auto my-5 mt-20' />
              <p className='text-5xl md:text-6xl font-semibold text-zinc-400'>
                No tienes publicaciones guardadas
              </p>
            </>
          ) : (
            posts.map((post) => <Post key={post._id} data={post} />)
          )}
          {loading && (
            <Image
              src={loadingaesthetic}
              width='300'
              height='300'
              alt='loading'
            />
          )}
        </section>
      </Container>
    </main>
  )
}

export default PostsSaved

// export const getServerSideProps = async (context) => {
//   try {
//     await dbConnect()

//     let posts

//     const session = await getSession(context)

//     const user = await UserSchema.findOne({
//       email: session?.user?.email,
//     })

//     if (user) {
//       const postsSavedId = user.postsSaved

//       posts = await PostSchema.find({
//         _id: {
//           $in: postsSavedId,
//         },
//       })

//       posts = await Promise.all(
//         posts.map(async (post) => {
//           const category = await CategorySchema.findById(post.category)
//           const type = await TypeSchema.findById(post.type)
//           const postedBy = await UserSchema.findById(post.postedBy)

//           post.category = category
//           post.type = type
//           post.postedBy = postedBy
//           return post
//         })
//       )

//       posts = JSON.parse(JSON.stringify(posts))
//     }

//     return {
//       props: { posts },
//     }
//   } catch (error) {
//     return {
//       props: {},
//     }
//   }
// }
