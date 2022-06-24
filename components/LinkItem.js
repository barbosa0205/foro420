import Link from 'next/link'

import React from 'react'
import Icon from './Icons/Icon'

const LinkItem = ({ icon, to, text, ...rest }) => {
  return (
    <div
      {...rest}
      className='w-full flex justify-center items-center hover:bg-gray-100 p-2 border-b-2 border-gray-100 cursor-pointer'
    >
      <Link href={to}>
        <a className=' w-full block text-center  text-3xl'>{text}</a>
      </Link>
      <span className='flex items-center justify-center'>
        <Icon className={icon + ' text-4xl ml-2 text-emerald-600'} />
      </span>
    </div>
  )
}

export default LinkItem
