import { Magnetic } from '@/components/ui/magnetic'
import { TextEffect } from '@/components/ui/text-effect'
import { Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { SOCIAL_LINKS } from './data'

export function Header() {
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
