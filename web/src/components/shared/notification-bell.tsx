import { Bell, FileText, Gift, Megaphone, Flag } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useNotifications,
  type AppNotification,
} from "@/hooks/use-notifications";

const ICON_MAP = {
  quotation: <FileText className="h-4 w-4 text-blue-500" />,
  project: <Megaphone className="h-4 w-4 text-orange-500" />,
  birthday: <Gift className="h-4 w-4 text-pink-500" />,
  holiday: <Flag className="h-4 w-4 text-green-500" />,
};

export function NotificationBell() {
  const { data: notifications } = useNotifications();
  const count = notifications.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
            >
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifikasi</h3>
        </div>
        {count === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Tidak ada notifikasi baru.
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ notification }: { notification: AppNotification }) {
  return (
    <Link
      to={notification.href}
      className="flex items-start gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50 last:border-0"
    >
      <div className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5">
        {ICON_MAP[notification.type]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-none">{notification.title}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {notification.description}
        </p>
      </div>
    </Link>
  );
}
