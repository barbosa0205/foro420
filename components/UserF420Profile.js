import useUser from 'contexts/useUser'
import Image from 'next/image'
import React, { useCallback, useEffect } from 'react'

import coverImageProfile from 'assets/default_userprofile_cover.jpg'

import Link from 'next/link'
import Post from './Post'
import PrimaryBoxContainer from './ui/PrimaryBoxContainer'
import { useRouter } from 'next/router'
import Icon from './Icons/Icon'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { useDropzone } from 'react-dropzone'
import ButtonBorder from './ButtonBorder'
import { MenuPopup } from './MenuPopup'
import Container from './Container'
import { set } from 'mongoose'
const UserF420Profile = ({ postLiked, postSaved, user }) => {
  const { width } = useWindowDimensions()
  const router = useRouter()
  const { setUserF420, userF420 } = useUser()
  const [following, setFollowing] = React.useState(false)
  const [friends, setFriends] = React.useState([])
  const [posts, setPosts] = React.useState([])
  const [questions, setQuestions] = React.useState([])
  const [memes, setMemes] = React.useState([])
  const [openCoverOptions, setOpenCoverOptions] = React.useState(false)
  const [showCoverImage, setShowCoverImage] = React.useState(false)
  const getFriends = async () => {
    try {
      const resp = await fetch(`/api/friend?uid=${user._id}`)
      const data = await resp.json()
      const friendData = data.friends
      return friendData
    } catch (error) {
      console.log(error)
    }
  }

  const getRecentPosts = async () => {
    try {
      const resp = await fetch(`/api/posts?id=${user._id}&limit=3`)
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
        `/api/posts?id=${user._id}&limit=3&type=question`
      )
      const data = await resp.json()

      const questions = data.question

      setQuestions(questions)
    } catch (error) {
      console.log('foro420 | ERROR', error)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    let imageUrl
    acceptedFiles.map((file) => {
      imageUrl = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    })
    setImageDropped(imageUrl.preview)
    setImageFile(imageUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/svg': [],
    },
    onDrop,
  })

  const followUser = async () => {
    try {
      if (!userF420._id) {
        router.push('/login')
      }
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

  useEffect(() => {
    ;(async () => {
      if (user?._id) {
        getRecentPosts()
        getRecentQuestions()
      }
    })()
  }, [user])

  useEffect(() => {
    ;(async () => {
      if (user?._id) {
        const friends = await getFriends()
        setFriends(friends)
      }
    })()
  }, [user])

  useEffect(() => {
    ;(async () => {
      if (userF420?._id && user?._id) {
        if (user._id !== userF420._id) {
          await verifyIfFollowing()
        }
      }
    })()
  }, [user, userF420])

  return (
    <>
      <Container styles={'mx-auto'}>
        {user && (
          <>
            {/* cover image container */}
            <div
              {...getRootProps()}
              className='coverimage relative w-full flex flex-col items-center mx-auto'
            >
              {userF420._id === user._id && <input {...getInputProps()} />}
              {/* cover image */}
              <Image
                className='w-full h-full object-cover'
                src={user.cover || coverImageProfile}
                alt='cover'
                width={1920}
                height={1080}
                priority={true}
              />
              {userF420._id === user._id && (
                <>
                  {/* more options icon */}

                  <div
                    className='flex items-center justify-end absolute top-5 right-5 p-2  rounded-full cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenCoverOptions(!openCoverOptions)
                    }}
                  >
                    <Icon
                      icon={'ri-more-2-fill'}
                      color={'text-gray-100'}
                      size='text-5xl'
                    />
                  </div>

                  {openCoverOptions && (
                    <MenuPopup
                      right={'right-16'}
                      top={'top-12'}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p
                        className='text-xl cursor-pointer'
                        onClick={() => {
                          setShowCoverImage(true)
                          setOpenCoverOptions(false)
                        }}
                      >
                        Ver foto de portada
                      </p>
                      <hr />
                      <p className='text-xl cursor-pointer'>
                        eliminar foto de portada
                      </p>
                    </MenuPopup>
                  )}

                  {/* change cover image icon */}

                  <div className='flex items-center justify-end absolute bottom-5 right-5 p-2 bg-gray-200 rounded-full bg-opacity-60 cursor-pointer'>
                    <Icon icon={'ri-camera-fill'} color={'text-gray-100'} />
                  </div>
                </>
              )}
              <div
                className='profileImageSize absolute -bottom-16 rounded-full bg-gray-100 z-10'
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Image
                  className='rounded-full'
                  src={user.image}
                  alt='profile'
                  priority={true}
                  objectFit={'cover'}
                  layout='fill'
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
              </div>
              <div className='profileImageSize absolute -bottom-16 rounded-full border-4 border-gray-50'></div>
            </div>
            <div className='flex justify-center items-center mt-2'>
              <h2 className='text-5xl mt-16 font-semibold'>{user.fullname}</h2>
            </div>
            <div className='w-full flex items-center justify-center mt-5'>
              {userF420._id !== user._id && (
                <>
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
                </>
              )}
            </div>
            {user?.friends?.length > 0 && (
              <>
                <section className='w-1/2 flex flex-col items-center min-h-fit rounded-md mt-5 border mx-auto'>
                  <h2 className='text-4xl font-semibold mb-5 text-gray-700'>
                    Amigos
                  </h2>
                  <div className='w-full flex flex-wrap justify-center'>
                    {friends.slice(0, 3).map((friend) => (
                      <Image
                        onClick={() => {
                          router.push(
                            `/profile/${friend.username}?id=${friend._id}`
                          )
                        }}
                        className='rounded-full cursor-pointer'
                        key={friend._id}
                        src={friend.image || 'https://picsum.photos/200'}
                        alt={`Friend ${friend.username}`}
                        width={40}
                        height={40}
                        priority={true}
                        objectFit={'cover'}
                      />
                    ))}
                    {friends.length >= 3 && (
                      <Link>
                        <a>Ver todos</a>
                      </Link>
                    )}
                  </div>
                  <h3 className='text-3xl font-semibold mb-2 text-gray-700'>
                    {user.friends.length} Amigo
                    {user.friends.length === 1 ? '' : 's'}
                  </h3>
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
      </Container>
      {showCoverImage && (
        <div className='w-full h-screen flex items-center fixed top-0 left-0 bg-gray-800 bg-opacity-70 z-40'>
          <div className='showCoverImage w-full m-3 mx-auto'>
            <div className='w-full flex justify-end py-2 px-1'>
              <Icon
                icon={'ri-close-line cursor-pointer'}
                size={'text-6xl'}
                onClick={() => setShowCoverImage(false)}
              />
            </div>
            <Image
              src={user.cover || coverImageProfile}
              alt={'cover'}
              width={1920}
              height={1080}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default UserF420Profile
