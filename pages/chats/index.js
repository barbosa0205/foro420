import Container from 'components/Container'
import React from 'react'
import { useEffect } from 'react'

const Chats = () => {
  const getUserChats = async () => {
    try {
      const resp = await fetch('/api/chats')
    } catch (error) {
      console.log('error al obtener chats: ', error)
    }
  }

  useEffect(() => {
    getUserChats()
  }, [])

  return (
    <Container styles={'mx-auto'}>
      <h2 className='text-5xl font-semibold text-center text-gray-600 border-b border-gray-300 py-5'>
        CHATS
      </h2>
    </Container>
  )
}

export default Chats
