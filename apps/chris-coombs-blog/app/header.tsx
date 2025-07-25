'use client'
import { Magnetic } from '@/components/ui/magnetic'
import { TextEffect } from '@/components/ui/text-effect'
import { Mail } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SOCIAL_LINKS } from './data'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = resolvedTheme === 'dark'

  return (
    <header className="mb-8 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image
          src={mounted && isDark ? '/ccoombs.png' : '/ccoombs.png'}
          width={70}
          height={70}
          alt="icon"
          className="mr-2"
          loading="eager"
          priority={true}
        />
        <div>
          <p className="text-base font-light text-black sm:text-xl dark:text-white">
            Chris Coombs
          </p>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-sm text-zinc-600 sm:text-base dark:text-zinc-500"
            delay={0.5}
          >
            Emerging Writer
          </TextEffect>
        </div>
      </Link>
      <div className="flex h-full">
        {SOCIAL_LINKS.length
          ? SOCIAL_LINKS.map((item) => {
              return (
                <a
                  key={item.link}
                  href={item.link}
                  className="h-full p-2 opacity-85 hover:opacity-65"
                >
                  <Magnetic>
                    <Mail size={20} className="" />
                  </Magnetic>
                </a>
              )
            })
          : ''}
      </div>
    </header>
  )
}
