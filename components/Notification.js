import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
const Notification = ({ text }) => {
  return (
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
      }}
      className='w-fit fixed top-0 left-0 right-0 mx-auto flex items-center justify-center mt-5'
    >
      <h2 className='px-5 py-2 bg-white text-emerald-600 rounded-lg shadow-sm font-semibold text-4xl'>
        {text}
      </h2>
    </motion.div>
  )
}

export default Notification
