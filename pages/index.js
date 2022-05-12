import React, { useState } from 'react'
import Head from 'next/head'
import Post from '../components/post'
import Container from '../components/Container'
import ListBox from '../components/ui/ListBox'
import useSelect from '../hooks/useSelect'
import ButtonBorder from '../components/ButtonBorder'
import ButtonRounded from '../components/ButtonRounded'
import ListItem from '../components/ListItem'
import Modal from '../components/Modal'
import dayjs from 'dayjs'
import dbConnect from '../utils/mongoose'
import PostSchema from '../models/Post'
import { getSession, useSession } from 'next-auth/react'
import useUser from '../contexts/useUser'
import { useRouter } from 'next/router'
import CreatePostButton from '../components/CreatePostButton'

//posts hardcoded for now

const postsfake = [
  {
    id: 1,
    title: 'Titulo del post 1',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget con',
    img: 'https://source.unsplash.com/random/400x400',
    date: JSON.stringify(dayjs().format('DD/MM/YYYY')),
    likes: 0,
    dislikes: 0,
    category: 'cultivo',
    user: 'user1',
    comments: [
      {
        id: 2,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor',
        user: 'user2',
        likes: 0,
        dislikes: 0,
        date: new Date(),
        resp: [
          {
            id: 1,
            content:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc',
            user: 'user3',
            likes: 0,
            dislikes: 0,
            date: new Date(),
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Titulo del post 2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget con',
    img: 'https://source.unsplash.com/random/400x400',
    date: new Date(),
    likes: 0,
    dislikes: 0,
    category: 'cultivo',
    user: 'user1',
    comments: [
      {
        id: 1,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor, nisl nunc ultrices eros, eu porttitor nisl nunc euismod nunc. Donec euismod, nisl eget consectetur tempor',
        user: 'user2',
        likes: 0,
        dislikes: 0,
        date: new Date(),
        resp: [
          {
            id: 1,
            content:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc',
            user: 'user3',
            likes: 0,
            dislikes: 0,
            date: new Date(),
          },
        ],
      },
    ],
  },
]

//optionPosts
const optionPosts = [
  {
    id: 1,
    value: 'Recientes',
  },
  {
    id: 2,
    value: 'Populares',
  },
]
function Home({ posts, userSession }) {
  const router = useRouter()
  const { user, setUserData } = useUser()

  //useSelect hook
  const [selected, handleChange] = useSelect({
    values: optionPosts,
    selected: optionPosts[0],
  })

  const [postAnswerToggle, setPostAnswerToggle] = useState('APORTES')

  React.useEffect(() => {
    if (userSession) {
      setUserData(userSession)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Foro 420 | Home</title>
        <meta name='description' content='Pagina principal de Foro 420' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='w-full h-full flex flex-col items-center'>
        <Container>
          <header className='px-2 w-full py-2 flex justify-between flex-wrap bg-gray-50 border-b-2 border-b-gray-100'>
            <div className='py-1'>
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

            <ButtonRounded child={true}>
              <ListBox selected={selected.selected} handleChange={handleChange}>
                {optionPosts.map((option) => (
                  <ListItem key={option.id}>{option.value}</ListItem>
                ))}
              </ListBox>
            </ButtonRounded>
          </header>
          {postAnswerToggle === 'APORTES' ? (
            <>
              {/* Posts contaienr */}
              {postsfake.map((post) => (
                <Post key={post.id} data={post} />
              ))}
            </>
          ) : (
            <>
              {/*answers container */}
              {posts.map((post) => (
                <h1 key={post.id}>HOLA PREGUNTAS</h1>
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
    const userSession = await getSession(context)
    console.log('session', userSession)
    await dbConnect()
    const resp = await PostSchema.find({})

    const posts = resp.map((doc) => {
      const post = JSON.parse(JSON.stringify(doc))
      post.id = `${doc._id}`
      return post
    })
    console.log(resp)

    return {
      props: {
        userSession,
        posts,
      },
    }
  } catch (error) {
    console.log(error)
  }
}
