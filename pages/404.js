import Image from 'next/image'
import React from 'react'
import AlienImage from 'assets/SVG/alien-bag-empty.svg'
import Icon from 'components/Icons/Icon'
import { useRouter } from 'next/router'
const Custom404 = () => {
  const router = useRouter()
  return (
    <main className='w-full flex flex-col items-center my-5 min-h-screen'>
      <AlienImage className='max-w-5xl mt-16' />
      <h1 className=' my-2 text-emerald-600 font-bold text-9xl font-mono'>
        404
      </h1>
      <h2 className='text-semibold text-5xl'>Página no encontrada</h2>
      <Icon
        onClick={() => {
          router.replace('/')
        }}
        className='ri-home-2-line bg-emerald-600 text-gray-50 font-semibold text-6xl px-3 py-1 rounded-sm shadow-sm mt-10 cursor-pointer'
      />
    </main>
  )
}

export default Custom404
