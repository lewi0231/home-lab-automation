import React from 'react'

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="prose prose-gray prose-h4:prose-base dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-xl prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium dark:prose-li:text-gray-300 dark:prose-headings:text-gray-100 dark:prose-strong:text-gray-200 dark:prose-p:text-gray-300 prose-li:text-gray-800 prose-em:italic prose-code:before:content-none prose-code:after:content-none prose-strong:text-gray-800 dark:prose-pre:text-gray-200 prose-pre:dark:bg-gray-800 prose-string:text-gray-800 prose-p:text-base dark:prose-li:marker:text-gray-100 prose-li:marker:text-gray-800 prose-code:tracking-normal prose-code:leading-6 dark:prose-a:text-gray-100 dark:prose-li:text-base prose-li:text-base dark:prose-code:text-gray-200 dark:prose-code:bg-gray-800 dark:prose-code:py-0.5 dark:prose-code:px-1 mt-2 min-w-full pb-20">
      {/* Common header, nav, etc */}
      {children}
      {/* Common footer, etc */}
    </div>
  )
}
