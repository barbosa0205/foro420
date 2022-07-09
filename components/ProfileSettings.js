import useUser from 'contexts/useUser'
import { profileErrors } from 'helpers/errors/profileErrors'
import { UseForm } from 'hooks/useForm'
import Image from 'next/image'
import React, { useState, useCallback, useEffect } from 'react'
import userImageDefault from 'assets/default_user.jpg'
import { useDropzone } from 'react-dropzone'
import { Input } from './Input'

const ProfileSettings = () => {
  const { userF420 } = useUser()
  const [profileValues, handleChange, validateErrorSubmit, errors] = UseForm(
    {
      fullname: userF420?.fullname,
      email: userF420?.email,
    },
    profileErrors
  )

  const [imageDropped, setImageDropped] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    let imageUrl
    acceptedFiles.map((file) => {
      imageUrl = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    })
    console.log(imageUrl)
    setImageDropped(imageUrl.preview)
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

  useEffect(() => {
    if (userF420.id) {
      setImageDropped(userF420.image)
    }
  }, [userF420])

  return (
    <>
      {userF420 && (
        <section className='w-full p-2 bg- shadow-md'>
          <div className='w-full flex justify-center items-center flex-wrap mt-2'>
            <div
              className='flex flex-col items-center justify-center cursor-pointer'
              {...getRootProps()}
            >
              <Image
                className='relative rounded-md'
                src={imageDropped || userImageDefault}
                alt='usuario'
                width={80}
                height={80}
              />
              <p className='text-2xl font-bold text-emerald-600'>
                Cambiar imagen
              </p>
              <input {...getInputProps()} />
            </div>
            <section className='w-flex flex-col'>
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
        </section>
      )}
    </>
  )
}

export default ProfileSettings
