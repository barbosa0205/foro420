import Image from 'next/image'
import React, { useState, useCallback } from 'react'
import { completeProfileErrors } from 'helpers/completeProfileErrors'
import { UseForm } from 'hooks/useForm'
import { useDropzone } from 'react-dropzone'

import Head from 'next/head'

import { useRouter } from 'next/router'
import useUser from 'contexts/useUser'
const Welcome = () => {
  const router = useRouter()
  const { user, userF420, setUserF420 } = useUser()
  const [formValues, handleFormValuesChange, validateErrorSubmit, errors] =
    UseForm(
      {
        fullname: user.name,
        username: '',
        birthday: '',
      },
      completeProfileErrors
    )

  const [dataError, setDataError] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const hasError = validateErrorSubmit()
    if (hasError) {
      console.log('wrong')
      return
    }
    const { fullname, username, birthday } = formValues
    const user420 = {
      fullname,
      username,
      birthday,
      email: user.email,
      image: user.image,
    }

    try {
      const resp = await fetch('/api/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user420),
      })
      const data = await resp.json()
      console.log(data)
      if (data.success) {
        setDataError([])
        setUserF420(data.user)
        router.push('/')
      } else {
        if (data.error.keyValue?.username) {
          setDataError([
            ...dataError,
            `El usuario ${data.error.keyValue.username} ya existe`,
          ])
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    if (userF420) {
      router.push('/')
    }
  }, [])

  return (
    <>
      <Head>
        <title>Bienvenido | Foro 420</title>
      </Head>

      <main className='w-full min-h-screen bg-gray-50 flex flex-col items-center'>
        <h1 className='title-primary text-emerald-600 my-5  '>
          Completa tu perfil 🚀
        </h1>
        {dataError &&
          dataError.map((error, index) => (
            <p
              className='text-primary p-2 bg-red-500 border-2 border-red-700 rounded-md text-gray-50'
              key={index}
            >
              {error}
            </p>
          ))}
        <form
          onSubmit={handleSubmit}
          className='w-full flex flex-col items-center justify-center'
        >
          <label
            className='text-secondary mt-5 mb-2 text-gray-600'
            htmlFor='fullname'
          >
            Nombre Completo
          </label>
          <input
            className='input-primary'
            id='fullname'
            name='fullname'
            type='text'
            onChange={handleFormValuesChange}
            value={formValues.fullname}
          />
          {errors.fullname && (
            <p className='text-primary text-red-700 italic'>
              {errors.fullname}
            </p>
          )}
          <label
            className='text-secondary mt-5 mb-2 text-gray-600'
            htmlFor='username'
          >
            Nombre de usuario
          </label>
          <input
            className='input-primary'
            id='username'
            name='username'
            type='text'
            onChange={handleFormValuesChange}
            value={formValues.username}
          />
          {errors.username && (
            <p className='text-primary text-red-700 italic'>
              {errors.username}
            </p>
          )}

          <label
            className='text-secondary mt-5 mb-2 text-gray-600'
            htmlFor='birthday'
          >
            Fecha de nacimiento
          </label>
          <input
            className='input-primary'
            id='birthday'
            name='birthday'
            type='date'
            onChange={handleFormValuesChange}
            value={formValues.birthday}
          />
          {errors.birthday && (
            <p className='text-primary text-red-700 italic'>
              {errors.birthday}
            </p>
          )}
          <button className='btn-primary mt-5' type='submit'>
            Todo listo
          </button>
        </form>
      </main>
    </>
  )
}

export default Welcome
