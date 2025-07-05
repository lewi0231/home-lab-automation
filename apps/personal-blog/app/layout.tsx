import { AppSidebar } from '@/components/ui/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider } from '@/components/ui/sidebar'
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
  return (
    <html lang="en" suppressHydrationWarning>
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
            <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
              <div className="mx-auto w-full max-w-screen-lg flex-1 px-4 pt-10">
                <Header />
                <Separator className="mb-8" />
                <div
                  className={cn(
                    'flex flex-col items-center sm:flex-row sm:items-start',
                  )}
                >
                  <AppSidebar />
                  <main className="m-auto max-w-screen-sm">{children}</main>
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
