import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Post from 'components/Post'
import Container from '../components/Container'
import ButtonBorder from 'components/ButtonBorder'
import { dbConnect } from '../utils/mongoose'
import PostSchema from 'models/Post'
import TypeSchema from 'models/Type'
import CategorySchema from 'models/Category'
import UserSchema from 'models/F420User'
import useUser from 'contexts/useUser'
import { useRouter } from 'next/router'
import CreatePostButton from 'components/CreatePostButton'
import AlienBagEmpty from 'assets/SVG/alien-bag-empty.svg'

//posts hardcoded for now

function Home({ postsToShow, questionsPosts }) {
  const router = useRouter()
  const { user, setUserData, setUserF420 } = useUser()

  //useSelect hook
  const [postAnswerToggle, setPostAnswerToggle] = useState('APORTES')

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
                borderColor={
                  postAnswerToggle === 'APORTES'
                    ? 'border-emerald-600'
                    : 'border-gray-400'
                }
                text='APORTES'
                colorText={
                  postAnswerToggle === 'APORTES'
                    ? 'text-gray-50'
                    : 'text-gray-400'
                }
                otherStyles={
                  postAnswerToggle === 'APORTES' ? 'bg-emerald-600' : ''
                }
                onClick={() => setPostAnswerToggle('APORTES')}
              />
              <ButtonBorder
                text='PREGUNTAS'
                borderColor={
                  postAnswerToggle === 'PREGUNTAS'
                    ? 'border-emerald-600'
                    : 'border-gray-400'
                }
                colorText={
                  postAnswerToggle === 'PREGUNTAS'
                    ? 'text-gray-50'
                    : 'text-gray-400'
                }
                otherStyles={
                  postAnswerToggle === 'PREGUNTAS' ? 'bg-emerald-600' : ''
                }
                onClick={() => setPostAnswerToggle('PREGUNTAS')}
              />
            </div>
          </header>
          {postAnswerToggle === 'APORTES' ? (
            <>
              {/* Posts contaienr */}
              {postsToShow.length > 0 ? (
                postsToShow.map((post) => <Post key={post._id} data={post} />)
              ) : (
                <div className='relative mx-auto  w-full flex flex-col items-center'>
                  <AlienBagEmpty className='w-fit max-w-7xl' />
                  <p className='text-center absolute text-emerald-600 -bottom-28 text-6xl font-bold'>
                    No hay posts para mostrar
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/*answers container */}
              {questionsPosts.length > 0 ? (
                questionsPosts.map((post) => (
                  <Post key={post._id} data={post} />
                ))
              ) : (
                <div className='relative mx-auto  w-full flex flex-col items-center'>
                  <AlienBagEmpty className='w-fit max-w-7xl' />
                  <p className='text-center absolute text-emerald-600 -bottom-36 text-6xl font-bold'>
                    No hay preguntas para mostrar
                  </p>
                </div>
              )}
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
    const { req, res } = context

    let postsToShow = await PostSchema.find({
      type: {
        $eq: '6299b5c4086e49fa5c27f860',
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(30)

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

    //get mos recent posts by CreatedAt with type aportes

    //get most recent quesitonsPosts by CreatedAt with type preguntas
    let questionsPosts = await PostSchema.find({
      type: {
        $eq: '6299b5e9086e49fa5c27f861',
      },
    })
      .sort({
        CreatedAt: -1,
      })
      .limit(30)

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
