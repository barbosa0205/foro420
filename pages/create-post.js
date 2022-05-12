import React, { useEffect, useState, useRef } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react'
import ButtonRounded from '../components/ButtonRounded'
import ButtonBorder from '../components/ButtonBorder'
const CreatePost = () => {
  const editorRef = useRef(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  const [value, setValue] = useState('')

  useEffect(() => {
    ;(async () => {
      if (status === 'unauthenticated') {
        router.push('/login')
      }
    })()
  })

  const savePost = () => {
    console.log(editorRef.current.getContent())
  }

  return (
    <main className='w-full flex flex-col items-center'>
      <div className='w-full max-w-7xl mt-10'>
        <Editor
          id='editor'
          apiKey='k0ph0d66lca74s12vjwp7xq46fuqr54or68gicdskk2oy27w'
          value={value}
          onEditorChange={(newValue, editor) => setValue(newValue)}
          init={{
            menubar: false,
            plugins: ['link', 'emoticons', 'image', 'lists', 'paste'],
            toolbar:
              'undo redo | styles | bold italic | link | emoticons | image | numlist bullist | paste',
            resize: false,
            width: '100%',
          }}
          onInit={(event, editor) => (editorRef.current = editor)}
        />
      </div>
      <ButtonBorder text={'Guardar'} onClick={savePost} otherStyles='mt-5' />
    </main>
  )
}

export default CreatePost
