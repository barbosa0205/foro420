import React, { useEffect, useState, useRef } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react'

import Listbox from 'components/ui/ListBox'
import ListItem from 'components/ListItem'

import { useSelect } from 'hooks/useSelect'
import TypeSchema from 'models/Type'
import CategorySchema from 'models/Category'

import Image from 'next/image'
import coverImage2 from 'assets/default-cover-posts/cover2.avif'
import coverImage3 from 'assets/default-cover-posts/cover3.avif'
import coverImage4 from 'assets/default-cover-posts/cover4.avif'
import coverImage5 from 'assets/default-cover-posts/cover5.avif'
import coverImage6 from 'assets/default-cover-posts/cover6.avif'
import coverImage7 from 'assets/default-cover-posts/cover7.avif'
import coverImage8 from 'assets/default-cover-posts/cover8.avif'

import loadingImg from 'assets/loader.gif'

import useUser from 'contexts/useUser'

import { createPostErrors } from 'helpers/createPostErrors'
import ButtonPrimary from 'components/ButtonPrimary'
import Icon from 'components/Icons/Icon'
import ImageModal from 'components/ImageModal'
import { dbConnect } from 'utils/mongoose'
import Notification from 'components/Notification'

const CreatePost = ({ categories, types }) => {
  const editorRef = useRef(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(coverImage2)

  const [imagesModal, setImagesModal] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [value, setValue] = useState('')

  const [subcategories, setSubcategories] = useState([])

  //useSelect
  const [categorySelect, categoryChange] = useSelect({
    options: categories && categories,
    optionSelected: categories && categories[0],
    setSubcategories,
  })
  const [subSelect, subChange] = useSelect({
    options: subcategories,
    optionSelected: subcategories[0],
    setSubcategories,
    subcategories,
  })
  const [typeSelect, typeChange] = useSelect({
    options: types && types,
    optionSelected: types && types[0],
  })

  const [errors, setErrors] = useState([])
  const { userF420, setUserF420, notify, setNotify } = useUser()

  useEffect(() => {
    if (
      status === 'unauthenticated' ||
      (status === 'authenticated' && !userF420._id)
    ) {
      router.replace('/login')
    }
  }, [])

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * (8 - 2 + 1) + 2)
    switch (randomNumber) {
      case 2:
        setCoverImage(coverImage2)
        break
      case 3:
        setCoverImage(coverImage3)
        break
      case 4:
        setCoverImage(coverImage4)
        break
      case 5:
        setCoverImage(coverImage5)
        break
      case 6:
        setCoverImage(coverImage6)
        break
      case 7:
        setCoverImage(coverImage7)
        break
      case 8:
        setCoverImage(coverImage8)
        break
    }
  }, [])

  useEffect(() => {
    if (notify) {
      setTimeout(() => {
        setNotify('')
      }, 2500)
    }
  }, [notify])

  const uploadPost = async () => {
    try {
      setLoading(true)
      const postData = {
        title,
        content,
        image: coverImage.src,
        postedBy: userF420._id,
        category: categorySelect._id,
        subcategory: subSelect.name,
        type: typeSelect._id,
      }
      console.log('postData', postData)
      const postErrors = createPostErrors(postData)
      if (postErrors.length > 0) {
        setErrors(postErrors)
        return
      }
      const post = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //SEND DATA IN JSON FORMAT
        body: JSON.stringify(postData),
      })
      const postDta = await post.json()
      setNotify('Post creado correctamente')
      router.replace(`/posts/${postDta.newPost._id}`)
      setLoading(false)
    } catch (error) {
      setNotify('Algo salio mal: ' + error.message)
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <main className='w-full min-w-fit min-h-screen flex flex-col items-center max-w-screen-2xl bg-white mx-auto'>
      <section className='relative coverimage w-full overflow-hidden'>
        <div
          onClick={() => setImagesModal(true)}
          className='flex justify-center items-center w-fit absolute  z-10 top-0 right-0 m-3 px-7 py-1 bg-gray-800 bg-opacity-80 cursor-pointer '
        >
          <Icon className='ri-image-add-line text-5xl  text-gray-200 text-opacity-80 ' />{' '}
          <span className='text-3xl ml-2 text-gray-200 text-opacity-80 font-semibold '>
            Edit
          </span>
        </div>
        <div className='coverImage w-full py-2'>
          <Image src={coverImage} alt='cover' layout='fill' objectFit='cover' />
        </div>
        {imagesModal && (
          <ImageModal
            imagesModal={imagesModal}
            setCoverImage={setCoverImage}
            setImagesModal={setImagesModal}
          />
        )}
      </section>
      <div className='relative w-full flex flex-wrap max-w-7xl mt-10 '>
        {typeSelect.name === 'preguntas' && (
          <p className='text-6xl absolute -top-2 font-semibold left-2 text-zinc-700 '>
            ¿
          </p>
        )}
        <textarea
          type={'text'}
          placeholder='TU TITULO AQUI 👽'
          className='placeholder:text-zinc-700 font-semibold  w-11/12 mx-auto text-5xl outline-none mb-3 pl-5 resize-none'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />{' '}
        {typeSelect.name === 'preguntas' && (
          <p className='text-6xl absolute -top-2 font-semibold right-2 text-zinc-700 '>
            ?
          </p>
        )}
        {errors.length > 0 &&
          errors.map((error, index) => (
            <p
              key={index}
              className='text-primary text-center my-2 text-red-500 '
            >
              {error.title}
            </p>
          ))}
        <Editor
          id='editor'
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={value}
          onEditorChange={(newValue, editor) => {
            setValue(newValue)
            setContent(editor.getContent({ format: 'raw' }))
          }}
          init={{
            resize: true,
            resize_img_proportional: false,
            mobile: {
              resize: true,
            },
            height: '40rem',
            width: '100%',
            selector: '#editor',
            menubar: false,
            plugins: [
              'link',
              'emoticons',
              'image',
              'lists',
              'paste',
              'table',
              'autosave',
              'fullscreen',
            ],
            toolbar:
              'undo redo | styles | bold italic | link | emoticons | image | numlist bullist | paste | table | fullscreen',
            min_width: 320,
          }}
          onInit={(event, editor) => (editorRef.current = editor)}
        />
        {errors.length > 0 &&
          errors.map((error, index) => (
            <p
              key={index}
              className='text-primary text-center my-2 text-red-500 '
            >
              {error.content}
            </p>
          ))}
      </div>
      <section className='w-full flex flex-col items-center md:flex-row md:justify-evenly md:mt-10'>
        <div className='w-fit flex justify-between shadow-sm items-center my-5 px-3 rounded-2xl bg-zinc-100'>
          <p className=' p-3 rounded-l-2xl bg-emerald-500 text-zinc-50 md:text-3xl'>
            Categorias{' '}
          </p>
          <Listbox
            handleChange={categoryChange}
            otherStyles='bg-gray-100 border-r-2 p-3 text-3xl '
          >
            {categories &&
              categories.map((category) => (
                <ListItem key={category._id} text={category.name} />
              ))}
          </Listbox>

          {subcategories.length > 0 && (
            <>
              <Listbox
                handleChange={subChange}
                otherStyles='bg-gray-100 mx-2 p-2 text-3xl '
              >
                {subcategories.map((sub, index) => (
                  <ListItem key={index} text={sub.name} />
                ))}
              </Listbox>
            </>
          )}
        </div>
        <div className='w-fit flex justify-between items-center my-5 bg-zinc-100 rounded-2xl'>
          <p className=' p-3 rounded-l-2xl bg-emerald-500 text-zinc-50 md:text-3xl'>
            Tipo{' '}
          </p>
          <Listbox
            handleChange={(evnt) => {
              typeChange(evnt)
            }}
            otherStyles='bg-gray-100 mx-2 p-2 text-3xl md:text-4xl'
          >
            {types &&
              types.map((type) => (
                <ListItem
                  onClick={() => {
                    window.scrollTo(0, 0)
                  }}
                  key={type._id}
                  text={type.name}
                />
              ))}
          </Listbox>
        </div>
      </section>
      <ButtonPrimary
        text={'PUBLICAR POST'}
        bgColor='bg-emerald-500'
        color='text-gray-50'
        otherStyle={'my-10'}
        onClick={uploadPost}
      />
      {notify && <Notification text={notify} />}
      {loading && (
        <Image width={100} height={100} src={loadingImg} alt='loading' />
      )}
    </main>
  )
}
export const getServerSideProps = async (ctx) => {
  try {
    await dbConnect()
    //get all categories

    let categories = await CategorySchema.find({})

    let types = await TypeSchema.find({})

    categories = JSON.parse(JSON.stringify(categories))
    types = JSON.parse(JSON.stringify(types))

    return {
      props: {
        categories,
        types,
      },
    }
  } catch (error) {
    console.log('error QP2', error)
    return {
      props: {},
    }
  }
}

export default CreatePost
