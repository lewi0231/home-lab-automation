import { CldImage } from 'next-cloudinary'
import { ContentBlock } from '../content-renderer'

type Props = {
  block: Extract<ContentBlock, { type: 'image' }>
}
export default function CloudinaryImage({ block }: Props) {
  return (
    <figure className="mb-4">
      <CldImage
        src={block.src}
        alt={block.alt}
        className="w-full rounded-lg"
        width={800}
        height={400}
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}
