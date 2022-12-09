import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Post from 'components/Post'
import Container from '../components/Container'
import ButtonBorder from 'components/ButtonBorder'
import PostSchema from 'models/Post'
import FeedPostSchema from 'models/FeedPost'
import TypeSchema from 'models/Type'
import CategorySchema from 'models/Category'
import UserSchema from 'models/F420User'
import CreatePostButton from 'components/CreatePostButton'
import AlienBagEmpty from 'assets/SVG/alien-bag-empty.svg'
import { dbConnect } from 'utils/mongoose'
import CreatePostModal from 'components/CreatePostModal'
import usePost from 'contexts/posts/usePost'
import FeedLayout from 'components/layouts/FeedLayout'

function Home({ postsToShow, contributesToShow, questionsPosts }) {
  //useSelect hook
  const [postAnswerToggle, setPostAnswerToggle] = useState('POSTS')
  const { openCreatePost, feedPosts, setFeedPosts } = usePost()

  useEffect(() => {
    setFeedPosts(postsToShow)
  }, [postsToShow])

  return (
    <>
      <Head>
        <title>Foro 420 | Home</title>
        <meta name='description' content='Pagina principal de Foro 420' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='w-full min-h-screen flex flex-col items-center'>
        <Container styles={'max-w-7xl'}>
          <header className='px-2 w-full py-2 flex justify-between  bg-gray-50 border-b-2 border-b-gray-100'>
            <div className='w-full flex justify-around flex-wrap'>
              <p
                className={`text-md px-2 font-bold cursor-pointer hover:text-emerald-600  ${
                  postAnswerToggle === 'POSTS'
                    ? 'text-emerald-500'
                    : 'text-zinc-700'
                } `}
                onClick={() => setPostAnswerToggle('POSTS')}
              >
                POSTS
              </p>
              <p
                className={`text-md px-2 font-bold cursor-pointer hover:text-emerald-600 text-zinc-700  ${
                  postAnswerToggle === 'APORTES'
                    ? 'text-emerald-500'
                    : 'text-zinc-700'
                }`}
                onClick={() => setPostAnswerToggle('APORTES')}
              >
                APOTES
              </p>
              <p
                className={`text-md px-2 font-bold cursor-pointer hover:text-emerald-600 text-zinc-700 $ ${
                  postAnswerToggle === 'PREGUNTAS'
                    ? 'text-emerald-500'
                    : 'text-zinc-700'
                }`}
                onClick={() => setPostAnswerToggle('PREGUNTAS')}
              >
                PREGUNTAS
              </p>
            </div>
          </header>
          {postAnswerToggle === 'POSTS' ? (
            <>
              {/* Posts contaienr */}
              <FeedLayout postsToShow={feedPosts} />
            </>
          ) : postAnswerToggle === 'APORTES' ? (
            <>
              {/* Contributs contaienr */}
              {contributesToShow && contributesToShow.length ? (
                contributesToShow.map((post) => (
                  <Post key={post._id} data={post} />
                ))
              ) : (
                <div className='relative mx-auto  w-full flex flex-col items-center'>
                  <AlienBagEmpty className='w-fit max-w-7xl' />
                  <p className='text-center text-zinc-400 text-6xl font-bold'>
                    No hay aportes para mostrar :(
                  </p>
                </div>
              )}
            </>
          ) : postAnswerToggle === 'PREGUNTAS' ? (
            <>
              {questionsPosts && questionsPosts.length > 0 ? (
                questionsPosts.map((post) => (
                  <Post key={post._id} data={post} />
                ))
              ) : (
                <div className='relative mx-auto  w-full flex flex-col items-center'>
                  <AlienBagEmpty className='w-fit max-w-7xl mt-20' />
                  <p className='text-center text-zinc-400 text-6xl font-bold'>
                    No hay preguntas para mostrar :(
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className='relative mx-auto  w-full flex flex-col items-center'>
              <AlienBagEmpty className='w-fit max-w-7xl mt-20' />
              <p className='text-center absolute text-emerald-600 -bottom-36 text-6xl font-bold'>
                No hay preguntas para mostrar
              </p>
            </div>
          )}
        </Container>
      </main>
      {openCreatePost ? <CreatePostModal /> : ''}
    </>
  )
}
export default Home
export const getServerSideProps = async (context) => {
  try {
    await dbConnect()
    let contributesToShow = await PostSchema.find({
      type: {
        $eq: '6299b5c4086e49fa5c27f860',
      },
    })

      .sort({
        createdAt: -1,
      })
      .limit(30)
      .populate(['category', 'postedBy'])

    //TODO: Refact with populate!!!!

    //get mos recent posts by CreatedAt with type aportes

    let postsToShow = await FeedPostSchema.find({
      type: {
        $eq: '6381240ed80b69b2610d8cc7',
      },
    })

      .sort({
        createdAt: -1,
      })
      .limit(30)
      .populate(['postedBy'])

    //TODO: Refact with populate!!!!

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
      .populate(['category', 'postedBy'])

    contributesToShow = JSON.parse(JSON.stringify(contributesToShow))

    postsToShow = JSON.parse(JSON.stringify(postsToShow))

    console.log('postsToShow', postsToShow)

    questionsPosts = JSON.parse(JSON.stringify(questionsPosts))

    return {
      props: {
        contributesToShow,
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
