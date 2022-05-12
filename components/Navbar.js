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

import { Transition } from '@headlessui/react'

const Navbar = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { height, width } = useWindowDimensions()

  const [showSide, setShowSide] = React.useState(false)

  return (
    <>
      <aside
        className={`w-1/3 min-w-fit h-screen fixed bg-white p-2 z-10 ease-in-out duration-300 ${
          showSide ? 'visible' : 'hidden'
        } `}
      >
        {/* Close Container */}
        <div className='flex w-full justify-end items-center'>
          <Icon
            icon='ri-close-line text-gray-800 cursor-pointer p-2 font-bold'
            onClick={() => setShowSide(false)}
          />
        </div>
      </aside>
      <nav className='relative flex items-center justify-between sm:justify-around  w-full min-w-fit h-24 sm:h-32 bg-gradient-to-tl from-green-600 to-green-500'>
        <div className='flex items-center justify-evenly w-fit'>
          <Icon
            icon='ri-menu-fill sm:absolute sm:left-0 cursor-pointer'
            onClick={() => setShowSide(true)}
          />

          <Link href='/'>
            {/* TODO:Replace with logo-movil and logo-desk */}
            <a className='text-gray-100 pl-4 font-mono font-thin text-4xl sm:text-5xl cursor-pointer'>
              {width < 400 ? 'F420' : 'Foro 420'}
            </a>
          </Link>
        </div>
        <div className=' h-full flex items-center justify-around'>
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
        {status === 'authenticated' ? (
          <>
            <User>
              <Image
                src={session.user.image}
                width={50}
                height={50}
                alt='User'
                className='rounded-xl cursor-pointer'
                onClick={() => router.push('/profile')}
              />
            </User>
          </>
        ) : (
          <>
            <ButtonPrimary
              text={'Entra'}
              onClick={() => router.push('/login')}
            />
          </>
        )}
      </nav>
    </>
  )
}

export default Navbar
