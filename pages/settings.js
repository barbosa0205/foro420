import Container from 'components/Container'
import DropDownContainer from 'components/DropDownContainer'
import ProfileSettings from 'components/ProfileSettings'
import React from 'react'

const settings = () => {
  return (
    <main className='w-full min-h-screen flex justify-center'>
      <Container>
        <h1 className='w-full text-center text-5xl font-semibold text-emerald-600 mt-2 mb-10'>
          Configuración
        </h1>
        <DropDownContainer text='Perfil'>
          <ProfileSettings />
        </DropDownContainer>
      </Container>
    </main>
  )
}

export default settings
