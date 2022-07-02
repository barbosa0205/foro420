import Image from 'next/image'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const Notification = ({ text }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          y: -100,
          opacity: 0,
        }}
        className='w-full fixed top-0 left-0 flex items-center justify-center mt-5 rounded-lg shadow-sm shadow-gray-300 '
      >
        <h2 className='font-semibold text-4xl'>{text}</h2>
      </motion.div>
    </AnimatePresence>
  )
}

export default Notification
