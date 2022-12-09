import usePost from 'contexts/posts/usePost'
import useUser from 'contexts/useUser'
import { uploadImageToCloudinary } from 'helpers/cloudinary/uploadImageToCloudinary'
import { postErrors } from 'helpers/errors/postErrors'
import { UseForm } from 'hooks/useForm'
import useWindowDimensions from 'hooks/useWindowDimensions'
import Image from 'next/image'

import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'

import { useDropzone } from 'react-dropzone'
import CloseButton from './CloseButton'
import Modal from './Modal'

const CreatePostModal = () => {
  const { userF420 } = useUser()
  const {
    setOpenCreatePost,
    openCreatePost,
    loading,
    setLoading,
    feedPosts,
    setFeedPosts,
  } = usePost()

  const { height } = useWindowDimensions()

  const [postValues, handleChange, validateErrorSubmit, errors] = UseForm(
    {
      postText: '',
    },
    postErrors
  )

  const [imageDropped, setImageDropped] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [imagesUrls, setImagesUrls] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    console.log('feedPost wasa')
    let imageUrl = []
    acceptedFiles.map((file) => {
      imageUrl.push(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      console.log(imageUrl)
    })
    setImageDropped(imageUrl.map((img) => img.preview))
    setImageFile(imageUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/svg': [],
    },
    onDrop,
  })

  const populate = async ({ feedPostData }) => {
    try {
      const resp = await fetch(`/api/populate?id=${feedPostData._id}`)
      const data = await resp.json()
      console.log('data', data)
      return data
    } catch (error) {
      console.log('error al populate', error)
    }
  }

  const uploadFeedPost = async () => {
    try {
      if (!postValues.postText) {
        return
      }
      setLoading(true)
      setOpenCreatePost(false)
      if (imageFile?.length) {
        let imageUrlsArray = []
        const promiseUrls = await imageFile.map(async (imgFile) => {
          let cloudinaryImageUrl

          //convert image to formData
          const formData = new FormData()
          formData.append('file', imgFile)
          formData.append('upload_preset', 'p6nlpprc')
          formData.append('folder', 'feedPosts')

          cloudinaryImageUrl = await uploadImageToCloudinary(
            formData,
            userF420._id,
            { verify: false }
          )
          return cloudinaryImageUrl
        })

        await Promise.all(promiseUrls).then(
          (allData) => (imageUrlsArray = allData)
        )
        console.log('imageUrlsArray', imageUrlsArray)
        const resp = await fetch('/api/feedPosts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: postValues.postText,
            image: imageUrlsArray,
            postedBy: userF420._id,
            type: '6381240ed80b69b2610d8cc7',
          }),
        })

        const data = await resp.json()

        const dataPopulated = populate({
          feedPostData: data.newFeedPost,
        })

        await dataPopulated.then((data) => {
          console.log('kesesto', data)
          setFeedPosts(() => [data, ...feedPosts])
        })

        setLoading(false)
      } else {
        const resp = await fetch('/api/feedPosts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: postValues.postText,
            postedBy: userF420._id,
            type: '6381240ed80b69b2610d8cc7',
          }),
        })

        const data = await resp.json()

        const dataPopulated = populate({
          feedPostData: data.newFeedPost,
        })

        await dataPopulated
          .then((data) => {
            console.log('kesesto', data)
            setFeedPosts(() => [data, ...feedPosts])
          })
          .catch((err) => {
            console.log('err', err)
          })

        setLoading(false)
      }
    } catch (error) {
      // setNotify('Algo salio mal')
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className='fixed top-0 left-0 w-full h-screen bg-zinc-100  z-20 bg-opacity-80 flex items-center justify-center overflow-y-scroll'
        onClick={() => {
          setOpenCreatePost(!openCreatePost)
        }}
      >
        <section
          onClick={(e) => {
            e.stopPropagation()
          }}
          className={`w-11/12 bg-white shadow-md opacity-100 max-w-2xl rounded-2xl ${
            height <= 470 ? 'mt-40' : ''
          }`}
        >
          <header className=''>
            <section className='flex items-center justify-between border-b'>
              <div className='w-full flex items-center justify-center'>
                <p>Crear publicación</p>
              </div>
              <div className='p-4'>
                <CloseButton
                  onClick={() => {
                    setOpenCreatePost(!openCreatePost)
                  }}
                />
              </div>
            </section>
            {/* Profile section */}
            <section>
              <div className='p-5 flex'>
                <Image
                  className='rounded-full object-cover'
                  width={40}
                  height={40}
                  src={userF420.image}
                  alt='user'
                />
                <h4 className='font-semibold text-xl'>{userF420.username}</h4>
              </div>
            </section>
          </header>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <textarea
              type={'text'}
              name='postText'
              autoFocus
              placeholder='¿En que estas pensando?'
              className='placeholder:text-zinc-400 text-zinc-700 font-medium  w-11/12 h-36 mx-auto text-3xl outline-none mb-3 pl-5 resize-none'
              value={postValues.postText}
              onChange={handleChange}
            ></textarea>
            {imageDropped.length ? (
              <section className='grid grid-cols-2 grid-rows-2 gap-1 mt-5'>
                {imageDropped.slice(0, 3).map((img) => (
                  <Image
                    width={100}
                    height={100}
                    key={img}
                    src={img}
                    alt='post'
                    className='object-cover rounded-md'
                  />
                ))}
                {imageDropped.length > 3 ? (
                  <div className='w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-md cursor-pointer'>
                    <p className='px-5 text-center text-2xl text-gray-500 font-semibold'>
                      ver todas las fotos
                    </p>
                  </div>
                ) : (
                  ''
                )}
              </section>
            ) : (
              ''
            )}
            <div className='flex items-center p-2 shadow-sm m-5 border rounded-xl border-zinc-100'>
              <p className='text-zinc-700 font-semibold text-xl mr-5'>
                Añade a tu publicación
              </p>
              <i
                className='ri-image-add-fill ml-2 text-4xl text-emerald-500 cursor-pointer'
                {...getRootProps()}
              ></i>
              <input {...getInputProps()} />
            </div>
            <div className='w-full flex items-center justify-center'>
              <button
                onClick={uploadFeedPost}
                className='bg-emerald-400 text-zinc-50 font-semibold text-3xl w-11/12 rounded-2xl shadow-sm p-2 m-5'
              >
                Publicar
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

export default CreatePostModal
