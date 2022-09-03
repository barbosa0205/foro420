import { useRouter } from 'next/router'
import React from 'react'
import Icon from './Icons/Icon'

export const Message = ({ styles }) => {
  const router = useRouter()
  return (
    <>
      <div
        className={`${styles} relative`}
        onClick={() => router.push('/messages')}
      >
        <Icon icon='ri-chat-3-line cursor-pointer' />
        {/* {pendientNotifications?.length ? (
          // a red circle to indicate that user has pendient notifications
          <div className='absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 cursor-pointer'></div>
        ) : (
          ''
        )} */}
      </div>
    </>
  )
}
