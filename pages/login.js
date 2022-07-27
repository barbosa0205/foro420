import { useSession, getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import ButtonPrimary from 'components/ButtonPrimary'
import LeafImage from 'assets/SVG/leafThug.svg'
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
      <header className='w-full flex justify-center'>
        <h2
          onClick={() => router.push('/')}
          className='shadowLogo font-bold mt- mx-1 text-8xl sm:text-9xl cursor-pointer font-Type2 text-emerald-600'
        >
          FORO
          <span className='shadowLogo mx-8'>420</span>
        </h2>
      </header>
      <div className='min-h-screen pt-14'>
        <main className='w-ful md:flex flex-row md:justify-between'>
          <section className='w-full flex items-center justify-center'>
            <LeafImage className='max-w-4xl ml-5' />
          </section>
          <section className='w-full max-w-screen-md flex items-center justify-center mt-10 mx-auto'>
            {/* <ButtonPrimary
            text='Facebook'
            color='text-gray-50 sm:text-4xl py-5'
            bgColor='bg-blue-600'
            onClick={() => signIn('facebook')}
          /> */}
            <div className='py-10 px-24 flex flex-col items-center justify-center border-2'>
              <p className='text-emerald-600 text-4xl mb-10'>Inicia sesión</p>
              <ButtonPrimary
                text='Google'
                color='text-gray-50 sm:text-4xl py-5 md:text-5xl'
                bgColor='bg-red-600'
                onClick={() => signIn('google')}
              />
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Login
