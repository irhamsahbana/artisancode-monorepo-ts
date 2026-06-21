import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function DesktopHeader() {
  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex-1" />
      <ThemeToggle />
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">AD</AvatarFallback>
      </Avatar>
    </header>
  )
}
