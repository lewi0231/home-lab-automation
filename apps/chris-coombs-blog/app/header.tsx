'use client'

import { Magnetic } from '@/components/ui/magnetic'
import { TextEffect } from '@/components/ui/text-effect'
import Image from 'next/image'
import Link from 'next/link'
import { SOCIAL_MEDIA } from './data'

export function Header() {
  const { facebook, instagram, youtube } = SOCIAL_MEDIA

  return (
    <header className="mb-8 flex items-center justify-between sm:px-6">
      <Link href="/" className="flex items-center">
        <Image
          src="/ccoombs.png"
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
        <a
          key={instagram.link}
          href={instagram.link}
          className="h-full p-2 opacity-85 hover:opacity-65"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Magnetic>
            <Image
              src={instagram.iconPath ?? ''}
              width={12}
              height={12}
              alt="social icon"
              className="h-5 w-5"
            />
          </Magnetic>
        </a>
        <a
          key={facebook.link}
          href={facebook.link}
          className="h-full p-2 opacity-85 hover:opacity-65"
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
          className="h-full p-2 opacity-85 hover:opacity-65"
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
