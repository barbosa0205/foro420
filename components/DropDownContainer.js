import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import Icon from './Icons/Icon'

const DropDownContainer = ({ text, children }) => {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className=' w-1/2 max-w-screen-sm'>
      <div
        onClick={() => setShowContent(!showContent)}
        className='w-full flex bg-emerald-600 items-center justify-between p-2 sm:shadow-sm sm:rounded-lg cursor-pointer z-10'
      >
        <p className='text-white font-semibold text-4xl pl-5'>{text}</p>
        <Icon
          icon={
            showContent ? 'ri-arrow-drop-up-fill' : 'ri-arrow-drop-down-fill'
          }
          color='text-white'
          size='text-6xl'
        />
      </div>
      {
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                type: 'tween',
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      }
    </div>
  )
}

export default DropDownContainer
