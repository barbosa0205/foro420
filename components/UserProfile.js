import useUser from 'contexts/useUser'
import Image from 'next/image'
import React, { useEffect } from 'react'
import coverImageProfile from 'assets/default_userprofile_cover.jpg'
import Link from 'next/link'
import PrimaryBoxContainer from './ui/PrimaryBoxContainer'
import Post from './Post'
import { useRouter } from 'next/router'
import ButtonPrimary from './ButtonPrimary'
import ButtonBorder from './ButtonBorder'

const UserProfile = () => {
  const { userF420, notify, setNotify, notifies, setNotifies } = useUser()
  const router = useRouter()
  const [user, setUser] = React.useState(null)
  const [posts, setPosts] = React.useState([])
  const [questions, setQuestions] = React.useState([])
  const [following, setFollowing] = React.useState(false)
  const [alertError, setAlertError] = React.useState('')

  const getFriend = async () => {
    try {
      const id = router.query.id
      const resp = await fetch(`/api/friend?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await resp.json()
      const userData = data.friend
      setUser(userData)
    } catch (error) {
      console.log('Error al obtener el usuario', error)
    }
  }

  const getRecentPosts = async () => {
    try {
      const resp = await fetch(`/api/posts?id=${user._id}&limit=3`)
      const data = await resp.json()
      console.log('data', data)
      const posts = data.posts
      setPosts(posts)
    } catch (error) {
      console.log('foro420 | ERROR', error)
    }
  }

  const getRecentQuestions = async () => {
    try {
      const resp = await fetch(
        `/api/posts?id=${user._id}&limit=3&type=question`
      )
      const data = await resp.json()

      const questions = data.question

      setQuestions(questions)
    } catch (error) {
      console.log('foro420 | ERROR', error)
    }
  }

  const verifyIfFollowing = async () => {
    try {
      const resp = await fetch(
        `/api/profile/follow/following?f420_id=${userF420._id}&user_id=${user._id}`
      )
      const data = await resp.json()
      setFollowing(data.following)
    } catch (error) {
      console.log('Error al verificar si seguimos al usuario', error)
    }
  }

  const followUser = async () => {
    try {
      const resp = await fetch(`/api/profile/follow/?id=${userF420._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          following: user._id,
          user: user,
        }),
      })
      const data = await resp.json()
      setFollowing(data.following)
      // socket.emit('followNotify', {
      //   user: userF420,
      //   following: user,
      // })
    } catch (error) {
      setAlertError(true)
      console.log('Error al seguir usuario', error)
    }
  }

  useEffect(() => {
    getFriend()
  }, [])

  useEffect(() => {
    if (user?._id) {
      verifyIfFollowing()
    }
  }, [user])
  useEffect(() => {
    if (user?._id) {
      getRecentPosts()
      getRecentQuestions()
    }
    return () => {
      setPosts([])
      setQuestions([])
    }
  }, [user])

  return (
    <div className='w-full mx-auto'>
      {user && user._id && (
        <>
          {/* cover image container */}
          <div className='relative w-full h-72 md:h-96 flex flex-col items-center mx-auto'>
            {/* cover image */}
            <Image
              className='w-full h-full object-cover'
              src={user.cover || coverImageProfile}
              alt='cover'
              width={1920}
              height={1080}
            />
            <div className='absolute -bottom-16 p-2 rounded-full bg-gray-100'>
              <Image
                className='rounded-full'
                src={user.image}
                alt='profile'
                width={128}
                height={128}
                priority={true}
                objectFit={'cover'}
              />
            </div>
          </div>
          <div className='flex flex-col justify-center items-center mt-2'>
            <h2 className='text-5xl mt-16 mb-5 font-semibold'>
              {user.fullname}
            </h2>
            {!following ? (
              <ButtonBorder
                text='Seguir'
                borderColor='border-emerald-600'
                colorText='text-emerald-600'
                otherStyles='w-52 text-2xl'
                icon='ri-add-fill'
                onClick={() => {
                  followUser()
                }}
              />
            ) : (
              <ButtonBorder
                text='Siguiendo'
                borderColor='border-gray-600'
                colorText='text-gray-600'
                otherStyles='w-52 text-2xl'
                icon='ri-arrow-drop-down-line'
              />
            )}
          </div>

          {/* Aportes recientes */}
          <PrimaryBoxContainer title={'Tus aportes más recientes'}>
            {posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <Post key={post._id} data={post} />
                ))}
              </>
            ) : (
              <p className='text-center my-5 text-3xl max-w-sm mx-auto'>
                No tienes aportes recientes para mostrar
              </p>
            )}
          </PrimaryBoxContainer>

          {/* Preguntas recientes */}
          <PrimaryBoxContainer title={'Tus preguntas más recientes'}>
            {questions.length > 0 ? (
              <>
                {questions.map((post) => (
                  <Post key={post._id} data={post} />
                ))}
              </>
            ) : (
              <p className='text-center my-5 text-3xl max-w-sm mx-auto'>
                No tienes preguntas recientes para mostrar
              </p>
            )}
          </PrimaryBoxContainer>
        </>
      )}
    </div>
  )
}

export default UserProfile
