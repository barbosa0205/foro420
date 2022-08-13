import useUser from 'contexts/useUser'
import React from 'react'
import Icon from './Icons/Icon'
import PushAlerts from './PushAlerts'

const Notify = ({ styles }) => {
  const { pendientNotifications } = useUser()

  return (
    <>
      <div className={`${styles} relative`}>
        <Icon icon='ri-notification-2-line cursor-pointer'></Icon>
        {pendientNotifications?.length ? (
          // a red circle to indicate that user has pendient notifications
          <div className='absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 cursor-pointer'></div>
        ) : (
          ''
        )}
      </div>
      <PushAlerts />
    </>
  )
}

export default Notify
