'use client'

import InstagramIcon from '@/components/icons'
import { Magnetic } from '@/components/ui/magnetic'
import { TextEffect } from '@/components/ui/text-effect'
import { Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EMAIL, SOCIAL_MEDIA } from './data'

export function Header() {
  const { facebook, instagram, youtube } = SOCIAL_MEDIA

  return (
    <header className="mb-8 flex items-center justify-between sm:px-6">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
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
      <div className="flex h-full items-center">
        <a
          key={EMAIL}
          href={`mailto:${EMAIL}?subject=Hello%20Chris!`}
          className="flex h-full items-center p-2 opacity-85 hover:opacity-65"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Magnetic>
            <Mail size={20} />
          </Magnetic>
        </a>
        <a
          key={instagram.link}
          href={instagram.link}
          className="flex h-full items-center p-2 opacity-85 hover:opacity-65"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Magnetic>
            <InstagramIcon />
          </Magnetic>
        </a>
        <a
          key={facebook.link}
          href={facebook.link}
          className="flex h-full items-center p-2 opacity-85 hover:opacity-65"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Magnetic>
            <Image
              src={facebook.iconPath ?? ''}
              width={12}
              height={12}
              alt="social icon"
              className="h-5 w-5"
            />
          </Magnetic>
        </a>
        <a
          key={youtube.link}
          href={youtube.link}
          className="flex h-full items-center p-2 opacity-85 hover:opacity-65"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Magnetic>
            <Image
              src={youtube.iconPath ?? ''}
              width={16}
              height={16}
              alt="social icon"
              className="h-5 w-5"
            />
          </Magnetic>
        </a>
      </div>
    </header>
  )
}
