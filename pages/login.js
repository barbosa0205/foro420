import { useSession, getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import ButtonPrimary from '../components/ButtonPrimary'
import leafImage from '../assets/leaf.png'
import Head from 'next/head'
const Login = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  })

  return (
    <>
      <Head>
        <title>Login | Foro 420</title>
      </Head>
      <header className='w-full  flex justify-center'>
        <div
          onClick={() => router.push('/')}
          className=' w-fit flex justify-center items-center py-5 cursor-pointer'
        >
          <Image src={leafImage} alt='logo' width={80} height={70} />
          <h2 className='font-bold mt-5 mx-1 text-5xl text-green-600 '>
            Foro 420
          </h2>
        </div>
      </header>
      <main>
        <ButtonPrimary
          text='Facebook'
          color='text-gray-50'
          bgColor='bg-blue-600'
          onClick={() => signIn('facebook')}
        />
        <ButtonPrimary
          text='Google'
          color='text-gray-50'
          bgColor='bg-red-600'
          onClick={() => signIn('google')}
        />
      </main>
    </>
  )
}

export default Login
