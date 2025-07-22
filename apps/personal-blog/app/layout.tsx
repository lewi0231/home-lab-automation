import { AppSidebar } from '@/components/ui/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider } from '@/components/ui/sidebar'
import { performance } from '@/lib/performance'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import { Footer } from './footer'
import './globals.css'
import { Header } from './header'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'Paul Richard Lewis - Personal Blog',
  description: 'A record of my tinkering for myself and others.',
  keywords: [
    'software engineer',
    'web development',
    'blog',
    'portfolio',
    'homelab',
  ],
  authors: [{ name: 'Paul Richard Lewis' }],
  openGraph: {
    title: 'Paul Richard Lewis - Personal Blog',
    description: 'A record of my tinkering for myself and others.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paul Richard Lewis - Personal Blog',
    description: 'A record of my tinkering for myself and others.',
  },
  robots: 'index, follow',
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Initialize performance monitoring
  if (typeof window !== 'undefined') {
    performance.measurePageLoad()
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <SidebarProvider className="">
            <div className="flex min-h-screen w-full flex-1 flex-col font-[family-name:var(--font-inter-tight)]">
              <div className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col px-4 pt-10">
                <Header />
                <Separator className="" />
                <div
                  className={cn(
                    'flex flex-1 flex-col justify-start pt-8 sm:flex-row',
                  )}
                >
                  <AppSidebar />
                  <main className="mx-0 flex w-full max-w-screen justify-center sm:mx-10 sm:w-9/13">
                    {children}
                  </main>
                </div>
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
