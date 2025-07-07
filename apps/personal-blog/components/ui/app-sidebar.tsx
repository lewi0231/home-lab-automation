'use client'
import { Calendar, Home, Inbox } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Posts',
    url: '/#posts',
    icon: Calendar,
  },
  {
    title: 'Projects',
    url: '/#projects',
    icon: Calendar,
  },
  {
    title: 'Connect',
    url: '/#connect',
    icon: Calendar,
  },
  {
    title: 'Blog',
    url: '/blog',
    icon: Inbox,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      className="relative mb-8 w-full border-b-1 sm:w-44 sm:border-b-0"
      collapsible="none"
    >
      <SidebarContent className="bg-white dark:bg-zinc-950">
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-2xl"></SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="mb-8">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        'flex justify-center py-8 opacity-80 sm:mb-0 sm:justify-end sm:py-2 sm:pr-6',
                        pathname === item.url ||
                          (item.url !== '/' && pathname.startsWith(item.url))
                          ? 'underline opacity-90'
                          : '',
                      )}
                    >
                      <span className="text-lg tracking-normal">
                        {item.title}
                      </span>
                      {/* <item.icon /> */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
