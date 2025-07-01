'use client'
import { TextEffect } from '@/components/ui/text-effect'
import { Github, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EMAIL, SOCIAL_LINKS } from './data'

const GITHUB_LINK = SOCIAL_LINKS[0].link

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/flowerhead-dark.png"
          width={70}
          height={70}
          alt="icon"
          className="mr-4"
        />
        <div>
          <Link
            href="/"
            className="text-xl font-light text-black dark:text-white"
          >
            Paul Richard Lewis
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Technology Enthusiast, Tinkerer, Web Developer
          </TextEffect>
        </div>
      </div>
      <div className="flex h-full">
        <a
          href={GITHUB_LINK}
          className="h-full p-2 opacity-75 transition duration-200 hover:-translate-y-2 hover:opacity-50"
        >
          <Github size={20} className="" />
        </a>

        <a
          className="h-full p-2 opacity-75 transition duration-200 hover:-translate-y-2 hover:opacity-50"
          href={`mailto:${EMAIL}`}
        >
          <Mail size={20} />
        </a>
      </div>
    </header>
  )
}
