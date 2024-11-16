"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LogOut} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { logout } from "@/app/actions/auth"

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    router.push('/login')
    await logout()
  }

  return (
    <div className="flex flex-col h-screen w-48 lg:w-64 bg-background border-r hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-center">Dashboard</h1>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
