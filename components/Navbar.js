import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ButtonPrimary from './ButtonPrimary'
import Icon from './Icons/Icon'
import Links from './Links'
import Notify from './Notify'
import Search from './Search'
import User from './User'
import Image from 'next/image'
import userImageDefault from 'assets/default_user.jpg'

import { Transition } from '@headlessui/react'
import useUser from 'contexts/useUser'
import LinkItem from './LinkItem'

const Navbar = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { height, width } = useWindowDimensions()

  const [showSide, setShowSide] = React.useState(false)

  const { user, userF420 } = useUser()

  return (
    <>
      {showSide && (
        <div
          className=' w-full h-screen fixed z-20'
          onClick={() => setShowSide(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className={`w-1/2 min-w-fit max-w-md h-screen bg-white ${
              showSide ? ' visible' : 'hidden'
            } md:absolute md:h-fit md:right-7 md:top-32 md:w-fit lg:right-24 xl:right-36 2xl:right-96`}
          >
            {/* Close Container
            <div className='flex w-full justify-end items-center border-b-2 border-gray-300'>
              <Icon
                icon='ri-close-line text-gray-800 cursor-pointer p-2 font-bold md:text-4xl'
                onClick={() => setShowSide(false)}
              />
            </div> */}
            {/* user info */}
            <section>
              <div className='flex flex-col items-center justify-center pb-3 pt-5 border-b-2 border-gray-300 md:hidden'>
                <Image
                  src={userF420?.image || user?.image || userImageDefault}
                  alt='profile'
                  width={100}
                  height={100}
                  className='rounded-full'
                />
                <h3 className='font-semibold'>
                  {userF420 && userF420?.username}
                </h3>
              </div>
              <section>
                {userF420?._id ? (
                  <>
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
                      to={`/profile/${userF420?.username}?user_id=${userF420?._id}`}
                      onClick={() => {
                        setShowSide(false)
                        router.push(`/profile/${userF420.username}`)
                      }}
                    />
                    <LinkItem
                      icon='ri-bookmark-line'
                      text='Guardados'
                      to='/posts-saved'
                      onClick={() => {
                        setShowSide(false)
                        router.push('/posts-saved')
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
                ) : (
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
                )}
              </section>
            </section>
          </aside>
        </div>
      )}
      <nav className='relative flex items-center justify-between px-5 sm:justify-around  w-full min-w-fit h-24 sm:h-32 bg-gradient-to-tl from-green-600 to-green-500'>
        <div className='flex items-center justify-evenly w-fit'>
          <Icon
            icon='ri-menu-fill sm:absolute sm:left-0 cursor-pointer md:hidden'
            onClick={() => setShowSide(true)}
          />

          <Link href='/'>
            {/* TODO:Replace with logo-movil and logo-desk */}
            <a className='text-gray-100 pl-4 font-mono font-thin text-4xl sm:text-5xl cursor-pointer'>
              {width < 400 ? 'F420' : 'Foro 420'}
            </a>
          </Link>
        </div>
        <div className='w-fit h-full flex items-center justify-evenly'>
          <Links>
            <Link href='/'>
              <a>
                <Icon icon='ri-home-7-line' />
              </a>
            </Link>
            <Link href='/'>
              <a>
                <Icon icon='ri-store-2-line' />
              </a>
            </Link>
          </Links>
          <Search />
          <Notify />
        </div>
        <section
          onClick={() => {
            setShowSide(!showSide)
          }}
          className='relative flex-col h-full items-center justify-center mt-2 border-gray-300 hidden md:flex cursor-pointer'
        >
          <Image
            src={userF420?.image || user?.image || userImageDefault}
            alt='profile'
            width={50}
            height={50}
            className='rounded-full border-8'
          />
          <i className='ri-arrow-drop-down-line absolute -right-4 bottom-16 text-5xl'></i>
          <h3 className='font-semibold text-gray-50'>
            {userF420 && userF420?.username}
          </h3>
        </section>
      </nav>
    </>
  )
}

export default Navbar
