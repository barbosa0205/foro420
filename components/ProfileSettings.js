import useUser from 'contexts/useUser'
import { profileErrors } from 'helpers/errors/profileErrors'
import { UseForm } from 'hooks/useForm'
import Image from 'next/image'
import React, { useState, useCallback, useEffect } from 'react'
import userImageDefault from 'assets/default_user.jpg'
import { useDropzone } from 'react-dropzone'
import { Input } from './Input'
import ButtonPrimary from './ButtonPrimary'
import Notification from './Notification'
import axios from 'axios'
import loadingImg from 'assets/loader.gif'
const ProfileSettings = () => {
  const { userF420, setUserF420, notify, setNotify } = useUser()
  const [profileValues, handleChange, validateErrorSubmit, errors] = UseForm(
    {
      fullname: userF420?.fullname || '',
      // email: userF420?.email || '',
      username: userF420?.username || '',
    },
    profileErrors
  )

  const [imageDropped, setImageDropped] = useState(userF420?.image)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const onDrop = useCallback((acceptedFiles) => {
    let imageUrl
    acceptedFiles.map((file) => {
      imageUrl = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    })
    setImageDropped(imageUrl.preview)
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

  const uploadImageToCloudinary = async (formData) => {
    try {
      const respImageUploaded = axios.post(
        `https://api.cloudinary.com/v1_1/foro420-media/image/upload?api_key=$828592597243784`,
        formData
      )
      const dataImageUpload = await respImageUploaded

      const imageId = dataImageUpload.data.public_id

      //verify if cloudinary id already exists and delete the image from cloudinary
      const resp = await fetch(`api/cloudinary?uid=${userF420._id}`, {
        method: 'GET',
        'content-type': 'application/json',
      })
      const data = await resp.json()

      if (data.cloudinary) {
        const resp = await fetch(
          '/api/cloudinary?cloudinary=' + data.cloudinary,
          {
            method: 'DELETE',
          }
        )
        setNewCloudinaryProfile(imageId, userF420._id)
        return (
          'https://res.cloudinary.com/foro420-media/image/upload/v1660276446/' +
          imageId
        )
      } else {
        setNewCloudinaryProfile(imageId, userF420._id)
        return (
          'https://res.cloudinary.com/foro420-media/image/upload/v1660276446/' +
          imageId
        )
      }
    } catch (e) {
      console.log(e)
    }
  }

  const setNewCloudinaryProfile = async (imageId, uid) => {
    try {
      const resp = await fetch(
        `api/cloudinary?uid=${uid}&image_id=${imageId}`,
        {
          method: 'PUT',
          'content-Type': 'application/json',
        }
      )
      const data = await resp.json()
    } catch (error) {
      console.log(error)
    }
  }

  const applyProfileChanges = async () => {
    try {
      if (
        (imageDropped === userF420.image &&
          profileValues.fullname === userF420.fullname &&
          // profileValues.email === userF420.email &&
          profileValues.username === userF420.username) ||
        (!imageDropped &&
          !profileValues.fullname &&
          // !profileValues.email &&
          !profileValues.username)
      ) {
        return
      }
      setLoading(true)

      //convert image to formData
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', 'p6nlpprc')

      //TODO:

      const cloudinaryImageUrl = await uploadImageToCloudinary(formData)

      const resp = await fetch(
        `api/profile/profile-settings?uid=${userF420._id}`,
        {
          method: 'PUT',
          'content-Type': 'application/json',
          body: JSON.stringify({
            image: cloudinaryImageUrl,
            fullname: profileValues.fullname,
            // email: profileValues.email,
            username: profileValues.username,
          }),
        }
      )

      if (resp.status === 413) {
        setNotify('La imagen no debe ser mayor a 1mb')
        return
      }

      const data = await resp.json()
      if (data.success) {
        setUserF420({
          ...userF420,
          image: data.data.image || userF420.image,
          fullname: data.data.fullname,
          // email: data.data.email,
          username: data.data.username,
        })
        setNotify(data.message)
        setLoading(false)
      }
    } catch (error) {
      setNotify('Algo salio mal')
      setLoading(false)
    }
  }

  useEffect(() => {}, [imageDropped])

  useEffect(() => {
    if (userF420.id) {
      setImageDropped(userF420.image)
      profileValues.fullname = userF420.fullname
      // profileValues.email = userF420.email
      profileValues.username = userF420.username
    }
  }, [userF420])

  useEffect(() => {
    setTimeout(() => {
      if (notify) {
        setNotify('')
      }
    }, 2000)
  }, [notify])

  return (
    <>
      {userF420 && (
        <section className='flex flex-col items-center w-full p-2 bg- shadow-md'>
          <div className='w-full flex justify-center items-center flex-wrap mt-2'>
            <div
              className='flex flex-col items-center justify-center cursor-pointer'
              {...getRootProps()}
            >
              <Image
                className='relative rounded-md'
                src={imageDropped || userImageDefault}
                alt='profile preview'
                width={80}
                height={80}
                objectFit={'cover'}
              />
              <p className='text-2xl font-bold text-emerald-600'>
                Cambiar imagen
              </p>
              <input {...getInputProps()} />
            </div>
            <section className='w-flex flex-col'>
              <Input
                type={'text'}
                name='username'
                value={profileValues.username}
                onChange={handleChange}
                placeholder='Tu usuario'
              />
              <Input
                type={'text'}
                name='fullname'
                value={profileValues.fullname}
                onChange={handleChange}
                placeholder='Tu nombre'
              />
              {/* <Input
                type={'text'}
                name='email'
                value={profileValues.email}
                onChange={handleChange}
                placeholder='Tu correo'
              /> */}
            </section>
          </div>
          <ButtonPrimary
            text={'Aplicar cambios'}
            color='text-gray-50'
            bgColor='bg-emerald-600'
            otherStyle={'mb-3 mt-7'}
            onClick={applyProfileChanges}
          />
          {loading && (
            <Image width={100} height={100} src={loadingImg} alt='loading' />
          )}
        </section>
      )}
      {notify && <Notification text={notify} />}
    </>
  )
}

export default ProfileSettings
