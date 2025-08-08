import { Upload } from 'lucide-react'
import {
  CldUploadButton,
  CldUploadButtonProps,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary'
import Image from 'next/image'
import { SetStateAction } from 'react'

type Props = {
  post: {
    title: string
    slug: string
    content: string
    excerpt: string
    coverImage: string
  }
  setNewPost: (
    value: SetStateAction<{
      title: string
      slug: string
      content: string
      excerpt: string
      coverImage: string
    }>,
  ) => void
}

export default function ImageUpload({ post, setNewPost }: Props) {
  const handleUploadSuccess: CldUploadButtonProps['onSuccess'] = (
    result: CloudinaryUploadWidgetResults,
  ) => {
    console.debug('Cloudinary Upload Result:', result)
    // The result contains the uploaded image URL
    if (typeof result?.info === 'string') return
    if (result?.info?.secure_url) {
      const imageUrl = result.info.secure_url
      setNewPost((prevPost) => ({ ...prevPost, coverImage: imageUrl }))
    }
  }

  return (
    <div className="space-y-4">
      {/* <div>
        <label className="mb-2 block text-sm font-medium">Cover Image</label>
        <Input
          value={post.coverImage}
          onChange={(e) => setNewPost({ ...post, coverImage: e.target.value })}
          placeholder="cover-image.jpg"
        />
      </div> */}

      <div>
        {/* <label className="my-2 block text-sm font-medium">Upload Image</label> */}
        <CldUploadButton
          uploadPreset="personal-blog"
          onSuccess={handleUploadSuccess}
          options={{
            maxFiles: 1,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxFileSize: 10000000, // 10MB
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 mb-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Cover Image <Upload className="ml-2" />
        </CldUploadButton>
      </div>

      {post.coverImage && (
        <div>
          <label className="mb-2 block text-sm font-medium">Preview</label>
          <Image
            src={post.coverImage}
            alt="Cover preview"
            width={400}
            height={200}
            className="h-32 w-auto rounded-md border object-cover"
          />
        </div>
      )}
    </div>
  )
}
