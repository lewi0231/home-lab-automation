'use client'

import { cn } from '@/lib/utils'
import { motion, SpringOptions, useScroll, useSpring } from 'motion/react'
import { RefObject, useEffect, useState } from 'react'

export type ScrollProgressProps = {
  className?: string
  springOptions?: SpringOptions
  containerRef?: RefObject<HTMLDivElement>
}

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
}

export function ScrollProgress({
  className,
  springOptions,
  containerRef,
}: ScrollProgressProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    container: containerRef,
    layoutEffect: Boolean(containerRef?.current),
  })

  const scaleX = useSpring(scrollYProgress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...(springOptions ?? {}),
  })

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <motion.div
      className={cn('inset-x-0 top-0 h-1 origin-left', className)}
      style={{
        scaleX,
      }}
    />
  )
}
