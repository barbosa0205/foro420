import useUser from 'contexts/useUser'
import Image from 'next/image'
import React, { useEffect } from 'react'

import coverImageProfile from 'assets/default_userprofile_cover.jpg'

import Link from 'next/link'
import Post from './Post'
import PrimaryBoxContainer from './ui/PrimaryBoxContainer'
import { useRouter } from 'next/router'

const UserF420Profile = ({ postLiked, postSaved }) => {
  const router = useRouter()
  const { setUserF420, userF420 } = useUser()
  const [friends, setFriends] = React.useState([])
  const [posts, setPosts] = React.useState([])
  const [questions, setQuestions] = React.useState([])
  const [memes, setMemes] = React.useState([])

  const getFriend = async (friend) => {
    try {
      const resp = await fetch(`/api/friend?id=${friend}`)
      const data = await resp.json()
      const friendData = data.friend
      return friendData
    } catch (error) {
      console.log(error)
    }
  }

  const getFriends = async () => {
    const friendsData = userF420.friends.map(async (friend) => {
      const friendData = await getFriend(friend)
      return friendData
    })
    Promise.all(friendsData).then((frnds) => {
      setFriends(frnds)
    })
  }

  const getRecentPosts = async () => {
    try {
      const resp = await fetch(`/api/posts?id=${userF420._id}&limit=3`)
      const data = await resp.json()

      const posts = data.posts
      setPosts(posts)
    } catch (error) {
      console.log('foro420 | ERROR', error)
    }
  }

  const getRecentQuestions = async () => {
    try {
      const resp = await fetch(
        `/api/posts?id=${userF420._id}&limit=3&type=question`
      )
      const data = await resp.json()

      const questions = data.question

      setQuestions(questions)
    } catch (error) {
      console.log('foro420 | ERROR', error)
    }
  }

  useEffect(() => {
    if (userF420?._id && !friends.length) {
      getFriends()
    }
  }, [userF420])

  useEffect(() => {
    if (userF420?._id) {
      getRecentPosts()
    }
  }, [userF420])

  useEffect(() => {
    if (userF420?._id) {
      getRecentQuestions()
    }
  }, [userF420])

  return (
    <div className='w-full mx-auto'>
      {userF420._id && (
        <>
          {/* cover image container */}
          <div className='relative w-full h-72 md:h-96 flex flex-col items-center mx-auto'>
            {/* cover image */}
            <Image
              className='w-full h-full object-cover'
              src={userF420.cover || coverImageProfile}
              alt='cover'
              width={1920}
              height={1080}
            />
            <div className='absolute -bottom-16 p-2 rounded-full bg-gray-100'>
              <Image
                className='rounded-full'
                src={userF420.image}
                alt='profile'
                width={128}
                height={128}
                priority={true}
                objectFit={'cover'}
              />
            </div>
          </div>
          <div className='flex justify-center items-center mt-2'>
            <h2 className='text-5xl mt-16 font-semibold'>
              {userF420.fullname}
            </h2>
          </div>
          {userF420.friends.length > 0 && (
            <>
              <section className=' flex flex-col items-center min-h-fit mx-auto rounded-md mt-5'>
                <h3 className='text-3xl font-semibold mb-2 text-gray-700'>
                  {userF420.friends.length} Amigo
                  {userF420.friends.length === 1 ? '' : 's'}
                </h3>

                <div className='w-full flex flex-wrap justify-center'>
                  {friends.slice(0, 3).map((friend, index) => (
                    <Image
                      onClick={() => {
                        router.push(
                          `/profile/${friend.username}?id=${friend._id}`
                        )
                      }}
                      className='rounded-full cursor-pointer'
                      key={friend._id || index}
                      src={friend.image || 'https://picsum.photos/200'}
                      alt={`Friend ${friend.username}`}
                      width={40}
                      height={40}
                      priority={true}
                    />
                  ))}
                  {friends.length >= 3 && (
                    <Link>
                      <a>Ver todos</a>
                    </Link>
                  )}
                </div>
              </section>
            </>
          )}
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

export default UserF420Profile
