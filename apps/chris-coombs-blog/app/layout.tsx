import { AppSidebar } from '@/components/ui/app-sidebar'
import { AuthorSidebar } from '@/components/ui/author-sidebar'
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
  title: 'Chris Coombs',
  description: 'Thoughts: Profound and otherwise',
  keywords: ['author', 'writer'],
  authors: [{ name: 'Chris Coombs' }],
  openGraph: {
    title: 'Chris Coombs',
    description: 'An aspiring writers journey',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Coombs',
    description: 'An aspiring writers ponderings.',
  },
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
              <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-4 pt-10">
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
                  <AuthorSidebar />
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
