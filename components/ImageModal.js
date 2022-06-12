import React, { useEffect, useState } from 'react'
import Icon from './Icons/Icon'
import axios from 'axios'
import Image from 'next/image'
import loadingGif from 'assets/loader.gif'
const ImageModal = ({ imagesModal, setCoverImage, setImagesModal }) => {
  const [imageQuery, setImageQuery] = useState('weed')
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [nextPage, setNextPage] = useState('')

  const fetchConverImages = async ({
    query,
    url = `https://api.pexels.com/v1/search?query=${imageQuery}`,
    newTopic = false,
  }) => {
    try {
      if (!imageQuery) {
        setError('El campo no puede estar vacio')
        return
      }

      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization:
            '563492ad6f91700001000001f414afa5ca804f32978e07041980e3cf',
          'Content-Type': 'application/json',
        },
      })
      const data = await resp.json()
      console.log(data)
      if (data.next_page) {
        setNextPage(data.next_page)
      } else {
        setNextPage('')
      }
      if (newTopic) {
        setImages(data.photos)
      } else {
        setImages([...images, ...data.photos])
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchConverImages({
      query: imageQuery,
    })
    return () => {
      setImages([])
    }
  }, [])

  return (
    <aside
      className='fixed top-0 left-0 py-5 w-full h-screen flex justify-center
    items-start z-20'
    >
      <main className='relative coverContainer flex flex-col overflow-y-scroll min-h-fit h-4/5 px-5 mt-40 bg-gray-200 shadow-md shadow-gray-800 '>
        <div className='sticky bg-gray-200 top-0 left-0 w-full flex flex-col items-center p-2 z-10'>
          <div className='w-full flex justify-end items-center'>
            <Icon
              className='ri-close-line text-5xl text-gray-800 cursor-pointer'
              onClick={() => setImagesModal(false)}
            />
          </div>
          <input
            className='w-full p-2 my-5'
            type='text'
            placeholder='Search'
            value={imageQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setImages([])
                fetchConverImages({
                  query: imageQuery,
                  newTopic: true,
                })
              }
            }}
            onChange={(e) => {
              setImageQuery(e.target.value)
            }}
          />
        </div>
        <section className='imagesCoverContainer w-full gap-2'>
          {images.map((image) => {
            return (
              <Image
                key={image.id}
                src={image.src.original}
                alt={image.alt}
                width={150}
                height={150}
                className='bg-gray-300 rounded-lg cursor-pointer'
                onClick={() => {
                  setCoverImage(loadingGif)

                  setTimeout(() => {
                    setCoverImage({
                      src: image.src.original,
                      width: image.width,
                      height: image.height,
                    })
                  }, 100)
                }}
              />
            )
          })}
        </section>
        <div className='w-full flex justify-center items-center py-3'>
          {nextPage && (
            <p
              onClick={() =>
                fetchConverImages({
                  url: nextPage,
                })
              }
              className='font-mono font-semibold text-3xl rounded-md border-2 border-gray-800 px-5 py-1 cursor-pointer'
            >
              Cargar más
            </p>
          )}
        </div>
      </main>
    </aside>
  )
}

export default ImageModal
