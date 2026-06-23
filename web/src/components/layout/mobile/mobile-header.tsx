import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <span className="text-base font-semibold">CRM Wika</span>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
