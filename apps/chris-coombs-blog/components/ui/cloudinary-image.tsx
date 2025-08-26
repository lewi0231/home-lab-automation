'use client'

import { BlogPost } from '@/lib/blog'
import { CldImage } from 'next-cloudinary'
import { ContentBlock } from '../content-renderer'

type Props = {
  block?: Extract<ContentBlock, { type: 'image' }>
  coverImage?: BlogPost['coverImage']
  title?: BlogPost['title']
}

export default function CloudinaryImage({ block, coverImage, title }: Props) {
  const src = block ? block.src : coverImage
  const alt = block ? block.alt : title

  return (
    <figure className="mb-4">
      <CldImage
        src={src ?? ''}
        alt={alt ?? ''}
        className="w-full rounded-lg"
        width={800}
        height={400}
      />
      {/* Don't plan on using captions */}
      {block?.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}
