'use client'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export function AuthorSidebar() {
  return (
    <div className="hidden w-80 flex-shrink-0 lg:block">
      <Card className="sticky top-8 bg-zinc-950">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              <Image
                src="/thegraduate.jpeg"
                alt="Chris Coombs"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Chris Coombs
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Gday, I&apos;m Chris. I&apos;m an emerging writer from Adelaide,
                S.A. with a love for SF, fantasy, horror, and some magic
                realism. I&apos;m hoping to build a readership and community
                here because I think storytelling is always a conversation and I
                want us to develop ideas which can challenge and inspire. We
                each have stories to share, please feel welcome to share
                something about yourself.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
