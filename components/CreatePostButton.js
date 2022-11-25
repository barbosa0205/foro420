import React from 'react'
import { useSession } from 'next-auth/react'
import usePost from 'contexts/posts/usePost'
import { useRouter } from 'next/router'
import { MenuPopup } from './MenuPopup'
import ListItem from './ListItem'
import Link from 'next/link'
const CreatePostButton = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { openCreatePost, setOpenCreatePost } = usePost()
  const [openOptions, setOpenOptions] = React.useState(false)
  return (
    <div className='fixed bottom-0 right-0 m-10 z-10'>
      <button
        className='relative bg-emerald-500 bg-opacity-90 text-zinc-50 text-opacity-80 text-5xl rounded-full w-24 h-24 shadow-lg'
        onClick={() => {
          // router.push('/create-post')
          setOpenOptions(!openOptions)
        }}
      >
        +
      </button>
      {openOptions && (
        <MenuPopup top={'-top-32 py-2 rounded-md'} right={'right-5 w-52'}>
          <p
            className='w-full text-center cursor-pointer'
            onClick={() => {
              setOpenCreatePost(!openCreatePost)
              setOpenOptions(!openOptions)
            }}
          >
            Crear publicación
          </p>
          <p className='w-full text-center'>
            <Link href='/create-post'>Crear aporte</Link>
          </p>
        </MenuPopup>
      )}
    </div>
  )
}

export default CreatePostButton
