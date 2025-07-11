'use client'

import { BlogPost } from '@/lib/blog'
import {
  NUMBER_OF_POSTS,
  TRANSITION_SECTION,
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Link from 'next/link'
import { AnimatedBackground } from './animated-background'
import { BlogDate } from './blog-date'

type Props = {
  latestOnly?: boolean
  posts: BlogPost[]
  title: string
  wrapWithMain?: boolean
  displayDate?: boolean
  subtitle?: string
  borderBottom?: boolean
  postTitleSize?: string
  isBlogPage?: boolean
}

export default function AnimatedPosts({
  latestOnly = false,
  posts,
  title,
  wrapWithMain = false,
  subtitle,
  isBlogPage = false,
}: Props) {
  const postsToDisplay = latestOnly ? posts.slice(0, NUMBER_OF_POSTS) : posts

  function PostSection() {
    return (
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        id="posts"
      >
        <div className={cn(isBlogPage ? 'mb-10' : 'mb-5')}>
          <h2
            className={cn(
              'mt-4 mb-3 font-light tracking-wide sm:mt-2',
              isBlogPage ? 'text-3xl' : 'text-2xl',
            )}
          >
            {title}
          </h2>
          {subtitle ? (
            <h3 className="block text-gray-500 dark:text-gray-400">
              {subtitle}
            </h3>
          ) : (
            ''
          )}
        </div>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {postsToDisplay.map((post) => (
              <Link
                key={post.slug}
                className={cn(
                  'border-gray- -mx-3 rounded-xl px-3 py-3',
                  isBlogPage ? 'border-b-1' : '',
                )}
                href={`/blog/${post.slug}`}
                data-id={post.slug}
              >
                <div
                  className={cn(
                    'flex flex-col space-y-1',
                    isBlogPage ? 'gap-1' : '',
                  )}
                >
                  {isBlogPage ? (
                    <BlogDate date={post.publishedAt || post.createdAt} />
                  ) : (
                    ''
                  )}
                  <h4
                    className={cn(
                      'font-normal tracking-tight dark:text-zinc-100',
                      isBlogPage ? 'text-xl' : 'text-lg',
                    )}
                  >
                    {post.title}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>
    )
  }

  return (
    <>
      {wrapWithMain ? (
        <motion.main
          className="space-y-24"
          variants={VARIANTS_CONTAINER}
          initial="hidden"
          animate="visible"
        >
          <PostSection />
        </motion.main>
      ) : (
        <PostSection />
      )}
    </>
  )
}
