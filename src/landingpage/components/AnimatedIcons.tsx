"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { cn } from "../../lib/utils"

interface AnimatedIconProps {
  icon: React.ReactNode
  className?: string
  delay?: number
  animationType?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom"
  hoverEffect?: boolean
  repeat?: boolean
}

export function AnimatedIcon({
  icon,
  className,
  delay = 0,
  animationType = "fade-up",
  hoverEffect = false,
  repeat = false,
}: AnimatedIconProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const directionVariants: Record<string, any> = {
    "fade-up": { y: 20, opacity: 0 },
    "fade-down": { y: -20, opacity: 0 },
    "fade-left": { x: 20, opacity: 0 },
    "fade-right": { x: -20, opacity: 0 },
    zoom: { scale: 0.8, opacity: 0 },
  }

  const motionProps = {
    initial: directionVariants[animationType] ?? { y: 20, opacity: 0 },
    animate: isVisible ? { x: 0, y: 0, scale: 1, opacity: 1 } : {},
    transition: {
      duration: 0.8,
      delay: delay / 1000,
      ease: [0.22, 1, 0.36, 1],
    },
    whileHover: hoverEffect ? { scale: 1.1, rotate: 5 } : {},
    whileTap: hoverEffect ? { scale: 0.95, rotate: -5 } : {},
    exit: repeat ? { opacity: 0, scale: 0.8 } : {},
  }

  // Ensure icons use a grey color tone (can adjust shade as needed)
  const baseClassName = "text-gray-500"

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className={cn(baseClassName, className)} {...motionProps}>
          {icon}
        </motion.div>
      )}
    </AnimatePresence>
  )
}


// "use client"

// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import type React from "react"
// import { cn } from "../../lib/utils"

// interface AnimatedIconProps {
//   icon: React.ReactNode
//   className?: string
//   delay?: number
//   animationType?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom"
//   hoverEffect?: boolean
//   repeat?: boolean
// }

// export function AnimatedIcon({
//   icon,
//   className,
//   delay = 0,
//   animationType = "fade-up",
//   hoverEffect = false,
//   repeat = false,
// }: AnimatedIconProps) {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true)
//     }, delay)
//     return () => clearTimeout(timer)
//   }, [delay])

//   const directionVariants: Record<string, any> = {
//     "fade-up": { y: 20, opacity: 0 },
//     "fade-down": { y: -20, opacity: 0 },
//     "fade-left": { x: 20, opacity: 0 },
//     "fade-right": { x: -20, opacity: 0 },
//     zoom: { scale: 0.8, opacity: 0 },
//   }

//   const motionProps = {
//     initial: directionVariants[animationType] ?? { y: 20, opacity: 0 },
//     animate: isVisible ? { x: 0, y: 0, scale: 1, opacity: 1 } : {},
//     transition: {
//       duration: 0.8,
//       delay: delay / 1000,
//       ease: [0.22, 1, 0.36, 1],
//     },
//     whileHover: hoverEffect ? { scale: 1.1, rotate: 5 } : {},
//     whileTap: hoverEffect ? { scale: 0.95, rotate: -5 } : {},
//     exit: repeat ? { opacity: 0, scale: 0.8 } : {},
//   }

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div className={cn(className)} {...motionProps}>
//           {icon}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }





// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { cn } from "../../lib/utils"

// interface AnimatedIconProps {
//   icon: React.ReactNode
//   className?: string
//   delay?: number
//   animationType?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom"
// }

// export function AnimatedIcon({
//   icon,
//   className,
//   delay = 0,
//   animationType = "fade-up",
// }: AnimatedIconProps) {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true)
//     }, delay)

//     return () => clearTimeout(timer)
//   }, [delay])

//   const animationMap: Record<string, string> = {
//     "fade-up": "translate-y-4",
//     "fade-down": "-translate-y-4",
//     "fade-left": "translate-x-4",
//     "fade-right": "-translate-x-4",
//     zoom: "scale-90",
//   }

//   const enterAnimation = isVisible ? "opacity-100 translate-none scale-100" : `opacity-0 ${animationMap[animationType] ?? "translate-y-4"}`

//   return (
//     <div
//       className={cn(
//         "transition-all duration-1000 ease-out",
//         enterAnimation,
//         className,
//       )}
//     >
//       {icon}
//     </div>
//   )
// }
