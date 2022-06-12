import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Post from '../components/post'
import Container from '../components/Container'
import ButtonBorder from '../components/ButtonBorder'
import { dbConnect } from '../utils/mongoose'
import PostSchema from '../models/Post'
import TypeSchema from '../models/Type'
import CategorySchema from 'models/Category'
import UserSchema from 'models/F420User'
import { getSession, useSession } from 'next-auth/react'
import useUser from '../contexts/useUser'
import { useRouter } from 'next/router'
import CreatePostButton from '../components/CreatePostButton'

//posts hardcoded for now

function Home({ userAuth, hasRole, f420User, postsToShow, questionsPosts }) {
  const router = useRouter()
  const { user, setUserData, setUserF420 } = useUser()

  const { data: session, status } = useSession()

  //useSelect hook
  const [postAnswerToggle, setPostAnswerToggle] = useState('APORTES')

  useEffect(() => {
    setUserData(userAuth)
  }, [userAuth, setUserData])

  useEffect(() => {
    const verifyIfIsANewUser = async () => {
      if (status === 'loading') return
      if (status === 'authenticated') {
        if (hasRole) {
          setUserF420(f420User)

          return
        } else {
          router.push('/welcome')
        }
      }
    }

    verifyIfIsANewUser()
  }, [hasRole, router, status])

  useEffect(() => {
    console.log(postsToShow)
  }, [postsToShow])
  return (
    <>
      <Head>
        <title>Foro 420 | Home</title>
        <meta name='description' content='Pagina principal de Foro 420' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='w-full min-h-screen flex flex-col items-center'>
        <Container>
          <header className='px-2 w-full py-2 flex justify-between flex-wrap bg-gray-50 border-b-2 border-b-gray-100'>
            <div className='w-fit flex py-1'>
              <ButtonBorder
                text='APORTES'
                colorText={
                  postAnswerToggle === 'APORTES'
                    ? 'text-gray-50'
                    : 'text-green-600'
                }
                otherStyles={
                  postAnswerToggle === 'APORTES' ? 'bg-green-600' : ''
                }
                onClick={() => setPostAnswerToggle('APORTES')}
              />
              <ButtonBorder
                text='PREGUNTAS'
                colorText={
                  postAnswerToggle === 'PREGUNTAS'
                    ? 'text-gray-50'
                    : 'text-green-600'
                }
                otherStyles={
                  postAnswerToggle === 'PREGUNTAS' ? 'bg-green-600' : ''
                }
                onClick={() => setPostAnswerToggle('PREGUNTAS')}
              />
            </div>
          </header>
          {postAnswerToggle === 'APORTES' ? (
            <>
              {/* Posts contaienr */}
              {postsToShow &&
                postsToShow.map((post) => <Post key={post._id} data={post} />)}
            </>
          ) : (
            <>
              {/*answers container */}
              {questionsPosts &&
                questionsPosts.map((post) => (
                  <Post key={post._id} data={post} />
                ))}
            </>
          )}
        </Container>
      </main>
      <CreatePostButton />
    </>
  )
}
export default Home
export const getServerSideProps = async (context) => {
  try {
    await dbConnect()
    const { req, res } = context

    let postsToShow = await PostSchema.find({
      CreatedAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
      type: {
        $eq: '6299b5c4086e49fa5c27f860',
      },
    }).limit(30)

    //get category, type and postedBy for each post
    postsToShow = await Promise.all(
      postsToShow.map(async (post) => {
        const category = await CategorySchema.findById(post.category)
        const type = await TypeSchema.findById(post.type)
        const postedBy = await UserSchema.findById(post.postedBy)

        post.category = category
        post.type = type
        post.postedBy = postedBy
        return post
      })
    )
    const userSession = await getSession(context)
    const userAuth = userSession?.user || null
    console.log('session', userSession)

    //verificando si el usuario es nuevo
    let hasRole = false
    let f420User
    let isANewUser
    if (userSession?.user) {
      const { email } = userSession?.user
      if (email) {
        isANewUser = await UserSchema.findOne({ email })
      } else {
        isANewUser = undefined
      }

      f420User = JSON.parse(JSON.stringify(isANewUser))
      console.log('isANewUser', isANewUser)
      if (!isANewUser?.role) {
        hasRole = false
      } else {
        hasRole = true
      }
      console.log('hasRole', hasRole)
    } else {
      f420User = null
    }

    //get mos recent posts by CreatedAt with type aportes

    //get most recent quesitonsPosts by CreatedAt with type preguntas
    let questionsPosts = await PostSchema.find({
      CreatedAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
      type: {
        $eq: '6299b5e9086e49fa5c27f861',
      },
    }).limit(30)

    //get category, type and postedBy for each questionPost
    questionsPosts = await Promise.all(
      questionsPosts.map(async (post) => {
        const category = await CategorySchema.findById(post.category)
        const type = await TypeSchema.findById(post.type)
        const postedBy = await UserSchema.findById(post.postedBy)

        post.category = category
        post.type = type
        post.postedBy = postedBy
        return post
      })
    )

    postsToShow = JSON.parse(JSON.stringify(postsToShow))
    console.log('postsToShow', postsToShow)

    questionsPosts = JSON.parse(JSON.stringify(questionsPosts))
    console.log('questionsPosts', questionsPosts)

    return {
      props: {
        userAuth,
        hasRole,
        f420User,
        postsToShow,
        questionsPosts,
      },
    }
  } catch (error) {
    console.log('error QP2', error)
    return {
      props: {},
    }
  }
}
