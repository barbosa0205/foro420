import React from 'react'
import { motion } from 'framer-motion'

export const MenuPopup = ({ top, right, left, bottom, children }) => {
  return (
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
        duration: 0.1,
      }}
      className={` absolute ${top} ${right} ${bottom} ${left} w-fit bg-stone-100 shadow-md`}
    >
      {children}
    </motion.div>
  )
}
