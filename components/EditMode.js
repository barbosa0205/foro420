import { Editor } from '@tinymce/tinymce-react'
import { useSelect } from 'hooks/useSelect'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ButtonPrimary from './ButtonPrimary'
import Listbox from './ui/ListBox'
import ListItem from './ListItem'
import Icon from './Icons/Icon'
import ImageModal from './ImageModal'
import useUser from 'contexts/useUser'
import { createPostErrors } from 'helpers/createPostErrors'
import Post from 'pages/posts/[post]'

export const EditMode = ({ post }) => {
  const { userF420 } = useUser()
  const editorRef = useRef(null)
  const [content, setContent] = useState('')
  const [value, setValue] = useState(post.content)
  const [title, setTitle] = useState(post.title)
  const [categories, setCategories] = useState(null)
  const [types, setTypes] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [imagesModal, setImagesModal] = useState(false)
  const [coverImage, setCoverImage] = useState({
    src: post.image,
  })
  const [categorySelect, categoryChange] = useSelect({
    options: categories,
    optionSelected: post.category,
    setSubcategories,
  })
  const [subSelect, subChange] = useSelect({
    options: subcategories,
    optionSelected: subcategories[0],
    setSubcategories,
    subcategories,
  })
  const [typeSelect, typeChange] = useSelect({
    options: types,
    optionSelected: post.type,
  })

  const [errors, setErrors] = useState([])

  useEffect(() => {
    getTypesAndCategories()
  }, [])

  const getTypesAndCategories = async () => {
    const respCategories = await fetch('/api/categories')
    const respTypes = await fetch('/api/types')
    const categories = await respCategories.json()
    const types = await respTypes.json()
    setCategories(categories.data)
    setTypes(types.data)
  }

  const editPost = async () => {
    try {
      const postData = {
        id: post._id,
        title,
        content: value,
        image: coverImage.src,
        postedBy: userF420._id,
        category: categorySelect._id,
        subcategory: subSelect.name,
        type: typeSelect._id,
      }

      if (
        value === post.content &&
        title === post.title &&
        postData.image === post.image &&
        postData.category === post.category._id &&
        postData.type === post.type._id &&
        subSelect.name === post.subcategory
      ) {
        return
      }
      const postErrors = createPostErrors(postData)
      if (postErrors.length > 0) {
        setErrors(postErrors)
        return
      } else {
        setErrors([])
      }
      const resp = await fetch('/api/posts/post', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: postData,
        }),
      })
      const data = await resp.json()
      console.log('data', data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='w-full min-w-fit min-h-screen flex flex-col items-center'>
      <header className='coverImage w-full relative flex flex-col justify-center items-start px-2 rounded-lg shadow-sm'>
        <div
          onClick={() => setImagesModal(true)}
          className='flex justify-center items-center w-fit absolute  z-10 top-0 right-0 m-3 px-7 py-1 bg-gray-800 bg-opacity-80 cursor-pointer '
        >
          <Icon className='ri-image-add-line text-5xl  text-gray-200 text-opacity-80 ' />{' '}
          <span className='text-3xl ml-2 text-gray-200 text-opacity-80 font-semibold '>
            Edit
          </span>
        </div>
        <Image
          src={coverImage}
          alt={'portada'}
          layout='fill'
          objectFit='cover'
        />
      </header>
      {imagesModal && (
        <ImageModal
          imagesModal={imagesModal}
          setCoverImage={setCoverImage}
          setImagesModal={setImagesModal}
        />
      )}
      <div className='w-full max-w-7xl mt-10 '>
        <input
          type={'text'}
          placeholder='TU TITULO AQUI 👽'
          className='w-full bg-transparent text-5xl outline-none mb-3 pl-5'
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
          {errors.length > 0 &&
            errors.map((error, index) => (
              <p
                key={index}
                className='text-primary text-center my-2 text-red-500 '
              >
                {error.category}
              </p>
            ))}
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
          {errors.length > 0 &&
            errors.map((error, index) => (
              <p
                key={index}
                className='text-primary text-center my-2 text-red-500 '
              >
                {error.type}
              </p>
            ))}
        </div>
      </section>
      <div className='w-full flex items-center justify-center'>
        <ButtonPrimary
          text={'EDITAR POST'}
          bgColor='bg-green-600'
          color='text-gray-50'
          otherStyle={'mt-10'}
          onClick={editPost}
        />
      </div>
    </div>
  )
}
