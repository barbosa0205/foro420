import useUser from 'contexts/useUser'
import React, { useState } from 'react'
import Icon from './Icons/Icon'
import { MenuPopup } from './MenuPopup'
import PushAlerts from './PushAlerts'
import { motion, AnimatePresence } from 'framer-motion'

const Notify = ({ styles }) => {
  const {
    pendientNotifications,
    showNotificationsSide,
    setShowNotificationsSide,
  } = useUser()

  return (
    <>
      <div
        className={`${styles} relative`}
        onClick={() => setShowNotificationsSide(!showNotificationsSide)}
      >
        <Icon icon='ri-notification-2-line cursor-pointer'></Icon>
        {pendientNotifications?.length ? (
          // a red circle to indicate that user has pendient notifications
          <div className='absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 cursor-pointer'></div>
        ) : (
          ''
        )}
      </div>
      <PushAlerts />
      {/* Notification Slide*/}
      {}
    </>
  )
}

export default Notify
