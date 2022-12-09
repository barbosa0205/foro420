import React from 'react'
import Footer from '../Footer'
import Navbar from '../Navbar'
import { useRouter } from 'next/router'
const Layout = (props) => {
  const router = useRouter()

  return (
    <div className='mx-auto min-w-fit w-full  min-h-screen '>
      {router.pathname !== '/login' && <Navbar />}
      {props.children}
      {router.pathname !== '/login' && <Footer />}
    </div>
  )
}

export default React.memo(Layout)
