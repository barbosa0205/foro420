import { useSession, getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import ButtonPrimary from '../components/ButtonPrimary'
import LeafImage from 'assets/SVG/Mesa de trabajo 1.svg'
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
    <div className='pt-14'>
      <Head>
        <title>Login | Foro 420</title>
      </Head>
      <header className='w-full  flex justify-center'>
        <h2
          onClick={() => router.push('/')}
          className='shadowLogo font-bold mt- mx-1 text-9xl cursor-pointer font-Type2 text-emerald-600'
        >
          FORO
          <span className='shadowLogo mx-4'>420</span>
        </h2>
      </header>
      <main>
        <section>
          <LeafImage />
        </section>
        <section className='w-full max-w-screen-md flex items-center justify-center mt-10'>
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
        </section>
      </main>
    </div>
  )
}

export default Login
