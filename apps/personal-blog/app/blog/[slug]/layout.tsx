'use client'
import { ScrollProgress } from '@/components/ui/scroll-progress'

// Date Display Component
export function BlogDate({ date }: { date: string }) {
  return (
    <time className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
      {new Date(date).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  )
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600"
        springOptions={{
          bounce: 0,
        }}
      />

      {/* <div className="absolute top-24 right-4">
        <CopyButton />
      </div> */}
      <div className="prose prose-gray prose-h4:prose-base dark:prose-invert prose-h1:text-2xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-xl prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium mt-2 pb-20">
        {children}
      </div>
    </>
  )
}
