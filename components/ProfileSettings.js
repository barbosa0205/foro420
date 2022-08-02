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

const ProfileSettings = () => {
  const { userF420, setUserF420, notify, setNotify } = useUser()
  const [profileValues, handleChange, validateErrorSubmit, errors] = UseForm(
    {
      fullname: userF420?.fullname || '',
      email: userF420?.email || '',
      username: userF420?.username || '',
    },
    profileErrors
  )

  const [imageDropped, setImageDropped] = useState(userF420?.image)

  const onDrop = useCallback((acceptedFiles) => {
    let imageUrl
    acceptedFiles.map((file) => {
      imageUrl = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    })
    const reader = new FileReader()
    reader.readAsDataURL(imageUrl)
    reader.onloadend = () => {
      setImageDropped(reader.result)
    }
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

  const applyProfileChanges = async () => {
    try {
      if (
        (imageDropped === userF420.image &&
          profileValues.fullname === userF420.fullname &&
          profileValues.email === userF420.email &&
          profileValues.username === userF420.username) ||
        (!imageDropped &&
          !profileValues.fullname &&
          !profileValues.email &&
          !profileValues.username)
      ) {
        return
      }

      const resp = await fetch(
        `api/profile/profile-settings?uid=${userF420._id}`,
        {
          method: 'PUT',
          'content-Type': 'application/json',
          body: JSON.stringify({
            image: imageDropped,
            fullname: profileValues.fullname,
            email: profileValues.email,
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
          image: data.data.image,
          fullname: data.data.fullname,
          email: data.data.email,
          username: data.data.username,
        })
        setNotify(data.message)
      }
    } catch (error) {
      setNotify('Algo salio mal')
    }
  }

  useEffect(() => {
    console.log(imageDropped)
  }, [imageDropped])

  useEffect(() => {
    if (userF420.id) {
      setImageDropped(userF420.image)
      profileValues.fullname = userF420.fullname
      profileValues.email = userF420.email
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
              <Input
                type={'text'}
                name='email'
                value={profileValues.email}
                onChange={handleChange}
                placeholder='Tu correo'
              />
            </section>
          </div>
          <ButtonPrimary
            text={'Aplicar cambios'}
            color='text-gray-50'
            bgColor='bg-emerald-600'
            otherStyle={'mb-3 mt-7'}
            onClick={applyProfileChanges}
          />
        </section>
      )}
      {notify && <Notification text={notify} />}
    </>
  )
}

export default ProfileSettings
