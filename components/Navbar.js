import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icons/Icon'

import Notify from './Notify'

import Image from 'next/image'
import userImageDefault from 'assets/default_user.jpg'

import useUser from 'contexts/useUser'
import LinkItem from './LinkItem'
import { NotificationsAside } from './NotificationsAside'
import { notificationIcons } from 'helpers/icons'
import loadingImage from 'assets/loader.gif'
import { Message } from './Message'
const Navbar = () => {
  const {
    user,
    userF420,
    notify,
    setNotify,
    showNotificationsSide,
    setShowNotificationsSide,
    setNewNotificationAlert,
    newNotificationAlert,
  } = useUser()
  const router = useRouter()

  const { height, width } = useWindowDimensions()
  const [showNavbar, setShowNavbar] = React.useState(true)

  const [showSide, setShowSide] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [lastScrollY, setLastScrollY] = React.useState(0)

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      // if (window.scrollY <= 5) {
      //   setPosition('relative')
      // } else {
      //   setPosition('fixed')
      // }
      // if (window.scrollY > lastScrollY) {
      //   // if scroll down hide the navbar
      //   setShowNavbar(false)
      // } else {
      //   // if scroll up show the navbar
      //   setShowNavbar(true)
      // }

      // remember current page location to use in the next move
      setLastScrollY(window.scrollY)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])

  useEffect(() => {
    if (newNotificationAlert) {
      setTimeout(() => {
        setNewNotificationAlert(false)
      }, [10000])
    }
  }, [newNotificationAlert])

  return (
    <>
      {/* NAVBAR */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{
              y: -100,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.2,
              type: 'just',
            }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            className={`flex z-30 min-h-fit ${
              width <= 290 ? 'flex-col' : 'items-center justify-between'
            } lg:justify-around px-5  w-full py-2 sm:h-32 bg-gradient-to-tl from-emerald-400 to-emerald-500`}
          >
            {/* Logo */}

            <div className='flex items-center justify-evenly w-fit'>
              <Icon
                icon='ri-menu-fill cursor-pointer md:hidden'
                onClick={() => setShowSide(!showSide)}
              />

              <Link href='/'>
                {/* TODO:Replace with logo-movil and logo-desk */}
                <a className='text-gray-100 pl-4 font-mono font-thin text-4xl sm:text-5xl cursor-pointer'>
                  {width < 400 ? (
                    <h2
                      onClick={() => router.push('/')}
                      className='font-bold mt- mx-1 text-6xl sm:text-7xl cursor-pointer font-Type2 text-gray-200'
                    >
                      F<span className='mx-1'>420</span>
                    </h2>
                  ) : (
                    <h2
                      onClick={() => router.push('/')}
                      className='font-bold mt- mx-1 text-6xl sm:text-7xl cursor-pointer font-Type2 text-gray-200'
                    >
                      FORO
                      <span className='mx-4'>420</span>
                    </h2>
                  )}
                </a>
              </Link>
            </div>
            <div className='w-fit h-full flex items-center justify-evenly'>
              {/* <Search /> */}
            </div>
            <div className='w-fit h-full flex items-center'>
              {!userF420?._id ? (
                <h3
                  className=' md:flex md:items-center md:justify-center text-gray-50 text-semibold text-3xl cursor-pointer'
                  onClick={() => {
                    router.push('/login')
                  }}
                >
                  Iniciar sesión
                </h3>
              ) : (
                <section
                  className='relative px-3 mx-2 mr-7 hidden md:flex cursor-pointer'
                  onClick={() => {
                    setShowSide(!showSide)
                  }}
                >
                  <Image
                    className='rounded-full'
                    src={userF420?.image || userImageDefault}
                    alt='user'
                    width={55}
                    height={55}
                    objectFit={'cover'}
                  />
                  <Icon
                    icon={'absolute -right-5 top-1 ri-arrow-drop-down-line'}
                  />
                </section>
              )}
              {userF420?._id && (
                <>
                  <Message styles={'mr-5'} />
                  <Notify styles={'mr-5'} />
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* MENU */}
      <AnimatePresence>
        {showSide && (
          <motion.div
            initial={{
              x: width >= 768 ? '0' : '-50%',
              y: width >= 768 ? '-10' : '0',
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.1,
              type: 'just',
            }}
            exit={{
              x: width >= 768 ? '0' : '-50%',
              y: width >= 768 ? '-10' : '0',
              opacity: 0,
            }}
            className={`w-full h-screen fixed ${
              showNavbar ? 'top-28' : 'top-0'
            } z-20`}
            onClick={() => setShowSide(false)}
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              className={`w-1/2 min-w-fit max-w-md h-screen bg-white ${
                showSide ? ' visible' : 'hidden'
              } md:absolute md:h-fit md:right-7 md:top-0 md:w-fit lg:right-24 xl:right-36 2xl:right-96`}
            >
              {/* user info */}
              <section>
                <div className='flex flex-col items-center justify-center pb-3 pt-5 border-b-2 border-gray-300 md:hidden'>
                  <Image
                    src={userF420?.image || user?.image || userImageDefault}
                    alt='profile'
                    width={100}
                    height={100}
                    className='rounded-full'
                    objectFit={'cover'}
                  />
                  <h3 className='font-semibold'>
                    {userF420 && userF420?.username}
                  </h3>
                </div>
                <section>
                  {(!loading && userF420?._id) || user.image ? (
                    <>
                      <LinkItem
                        icon='ri-home-2-line'
                        text='Inicio'
                        to={`/`}
                        onClick={() => {
                          setShowSide(false)
                          router.push('/')
                        }}
                      />
                      <LinkItem
                        icon='ri-add-box-line'
                        text='Crear una Publicación'
                        to={`/create-post`}
                        onClick={() => {
                          setShowSide(false)
                          router.push('/create-post')
                        }}
                      />
                      <LinkItem
                        icon='ri-user-smile-line'
                        text='Perfil'
                        to={
                          userF420?._id
                            ? `/profile/${userF420?.username}?id=${userF420?._id}`
                            : '/welcome'
                        }
                        onClick={() => {
                          setShowSide(false)
                          if (userF420?._id) {
                            router.push(
                              `/profile/${userF420?.username}?id=${userF420?._id}`
                            )
                          } else {
                            router.push(`/welcome`)
                          }
                        }}
                      />
                      <LinkItem
                        icon='ri-bookmark-line'
                        text='Guardados'
                        to='/posts/posts-saved'
                        onClick={() => {
                          setShowSide(false)
                          router.push('/posts/posts-saved')
                        }}
                      />
                      <LinkItem
                        icon='ri-settings-4-line'
                        text='Configuración'
                        to='/settings'
                        onClick={() => {
                          setShowSide(false)
                          router.push('/settings')
                        }}
                      />
                      <LinkItem
                        icon='ri-logout-box-line'
                        text='Cerrar sesión'
                        to='/api/auth/signout'
                        onClick={() => {
                          setShowSide(false)
                          router.push('/api/auth/signout')
                        }}
                      />
                    </>
                  ) : !loading ? (
                    <div>
                      <LinkItem
                        icon='ri-login-box-line'
                        text='Iniciar sesión'
                        to='/login'
                        onClick={() => {
                          setShowSide(false)
                          router.push('/login')
                        }}
                      />
                    </div>
                  ) : (
                    <Image
                      src={loadingImage}
                      width={100}
                      height={100}
                      alt='loading'
                    />
                  )}
                </section>
              </section>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS */}
      <AnimatePresence>
        {showNotificationsSide && (
          <motion.div
            initial={{
              x: '50%',
              y: '0',
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.1,
              type: 'just',
            }}
            exit={{
              x: '50%',
              y: '0',
              opacity: 0,
            }}
            className='min-w-full h-screen fixed z-20 flex flex-row-reverse top-0'
            onClick={() => setShowNotificationsSide(false)}
          >
            <NotificationsAside />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW NOTIFICATION ALERT */}
      <AnimatePresence>
        {newNotificationAlert && (
          <motion.article
            initial={{
              x: '-50%',
              y: '0',
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.2,
              type: 'just',
            }}
            exit={{
              x: '-50%',
              y: '0',
              opacity: 0,
            }}
            className='pb-2 bg-gradient-to-r bg-gray-50 shadow-md shadow-gray-400 border-2 border-gray-200 fixed bottom-16 left-5 z-20 rounded-xl cursor-pointer'
          >
            <div className='w-full flex justify-end items-center'>
              <Icon
                icon={'ri-close-line'}
                color='text-gray-700'
                onClick={() => setNewNotificationAlert(false)}
              />
            </div>
            {/* TODO: close the notify */}
            <header className='flex items-center'>
              <Image
                className='rounded-full'
                width={65}
                height={65}
                src={newNotificationAlert.emisor.image}
                alt={'user'}
              />
              <p className='mx-3 font-semibold text-3xl text-emerald-600'>
                {newNotificationAlert.emisor.username}
              </p>
            </header>
            <main className='flex items-center'>
              <div className='w-min h-min flex items-center justify-center ml-2 bg-emerald-500 py-1 px-3 rounded-md mx-2'>
                <Icon icon={notificationIcons.comment} />
              </div>
              <p className='text-2xl font-semibold text-right px-3 text-gray-700'>
                {newNotificationAlert.notification}
              </p>
            </main>
          </motion.article>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
