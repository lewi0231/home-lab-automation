'use client'
import { Magnetic } from '@/components/ui/magnetic'
import { TextEffect } from '@/components/ui/text-effect'
import { Github, Mail } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { EMAIL, SOCIAL_LINKS } from './data'

const GITHUB_LINK = SOCIAL_LINKS[0].link

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
          src={
            mounted && isDark ? '/flowerhead-dark.png' : '/flowerhead-light.png'
          }
          width={70}
          height={70}
          alt="icon"
          className="mr-2"
          loading="eager"
          priority={true}
        />
        <div>
          <p className="text-base font-light text-black sm:text-xl dark:text-white">
            Paul Richard Lewis
          </p>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-sm text-zinc-600 sm:text-base dark:text-zinc-500"
            delay={0.5}
          >
            Technology Enthusiast, Web Developer, Creator
          </TextEffect>
        </div>
      </Link>
      <div className="flex h-full">
        <a
          href={GITHUB_LINK}
          className="h-full p-2 opacity-85 hover:opacity-65"
        >
          <Magnetic>
            <Github size={20} className="" />
          </Magnetic>
        </a>

        <a
          className="h-full p-2 opacity-85 hover:opacity-65"
          href={`mailto:${EMAIL}`}
        >
          <Magnetic>
            <Mail size={20} />
          </Magnetic>
        </a>
      </div>
    </header>
  )
}
