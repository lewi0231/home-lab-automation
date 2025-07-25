'use client'

import { BlogPost } from '@/lib/blog'
import { CldImage } from 'next-cloudinary'
import { ContentBlock } from '../content-renderer'

type BlockProps = {
  block: Extract<ContentBlock, { type: 'image' }>
  post?: never
}

type PostProps = {
  post: BlogPost
  block?: never
}

type Props = BlockProps | PostProps

export default function CloudinaryImage({ block, post }: Props) {
  const src = block ? block.src : post.coverImage
  const alt = block ? block.alt : post.title

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
