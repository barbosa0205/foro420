import React, { useEffect, useState, useRef } from 'react'

import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react'

import Listbox from 'components/ui/ListBox'
import ListItem from 'components/ListItem'

import { useSelect } from 'hooks/useSelect'
import TypeSchema from 'models/Type'
import CategorySchema from 'models/Category'
import UserSchema from 'models/F420User'
import Image from 'next/image'
import coverImage2 from 'assets/default-cover-posts/cover2.avif'
import coverImage3 from 'assets/default-cover-posts/cover3.avif'
import coverImage4 from 'assets/default-cover-posts/cover4.avif'
import coverImage5 from 'assets/default-cover-posts/cover5.avif'
import coverImage6 from 'assets/default-cover-posts/cover6.avif'
import coverImage7 from 'assets/default-cover-posts/cover7.avif'
import coverImage8 from 'assets/default-cover-posts/cover8.avif'
import useUser from 'contexts/useUser'
import { filterOptions } from 'helpers/options'
import { createPostErrors } from 'helpers/createPostErrors'
import ButtonPrimary from 'components/ButtonPrimary'
import Icon from 'components/Icons/Icon'
import ImageModal from 'components/ImageModal'
import { dbConnect } from 'utils/mongoose'
import { privateRoutes } from 'helpers/privateRoutes'
const CreatePost = ({ categories, types }) => {
  const editorRef = useRef(null)
  const router = useRouter()
  const { data: session, status } = useSession()

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
  const { userF420, setUserF420 } = useUser()

  useEffect(() => {
    if (status === 'authenticated' && !userF420._id) {
      router.replace('/login')
    }
  }, [])

  useEffect(() => {
    console.log('subSelect', subSelect)
  }, [subSelect])

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

  const uploadPost = async () => {
    try {
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
      console.log('post', post)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className='w-full min-w-fit min-h-screen flex flex-col items-center'>
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
      <div className='w-full flex flex-wrap max-w-7xl mt-10 '>
        <textarea
          type={'text'}
          placeholder='TU TITULO AQUI 👽'
          className='w-full bg-transparent text-5xl outline-none mb-3 pl-5 resize-none'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
            height: '60rem',
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
        <div className='w-fit flex justify-between items-center my-5'>
          <p className='text-green-600 text-4xl md:text-5xl'>Categorias: </p>
          <Listbox
            handleChange={categoryChange}
            otherStyles='bg-white mx-2 text-3xl md:text-4xl'
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
                otherStyles='bg-white mx-2 text-3xl md:text-4xl'
              >
                {subcategories.map((sub, index) => (
                  <ListItem key={index} text={sub.name} />
                ))}
              </Listbox>
            </>
          )}
        </div>
        <div className='w-fit flex justify-between items-center my-5'>
          <p className='text-green-600 text-4xl md:text-5xl'>Tipo: </p>
          <Listbox
            handleChange={typeChange}
            otherStyles='bg-white mx-2 text-3xl md:text-4xl '
          >
            {types &&
              types.map((type) => <ListItem key={type._id} text={type.name} />)}
          </Listbox>
        </div>
      </section>
      <ButtonPrimary
        text={'PUBLICAR POST'}
        bgColor='bg-green-600'
        color='text-gray-50'
        otherStyle={'mt-10'}
        onClick={uploadPost}
      />
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
