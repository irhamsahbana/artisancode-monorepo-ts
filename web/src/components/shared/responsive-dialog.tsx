import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ResponsiveDialogContextValue {
  isMobile: boolean;
}

const ResponsiveDialogContext =
  React.createContext<ResponsiveDialogContextValue>({
    isMobile: false,
  });

export function useResponsiveDialog() {
  return React.useContext(ResponsiveDialogContext);
}

export function ResponsiveDialog({
  children,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Dialog>) {
  const isMobile = useIsMobile();

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Sheet open={open} onOpenChange={onOpenChange} {...props}>
          {children}
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange} {...props}>
          {children}
        </Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

export function ResponsiveDialogContent({
  className,
  children,
  mobileClassName,
  ...props
}: React.ComponentProps<typeof DialogContent> & {
  mobileClassName?: string;
}) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <SheetContent
        side="bottom"
        className={cn(
          "flex max-h-[92dvh] flex-col gap-0 overflow-hidden rounded-t-2xl p-4",
          mobileClassName,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        {children}
      </SheetContent>
    );
  }

  return (
    <DialogContent
      className={cn(
        "flex max-h-[92dvh] flex-col overflow-hidden p-4 sm:p-6 sm:max-w-lg",
        className,
      )}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

export function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <SheetHeader className={cn("p-0 pb-3 text-left", className)} {...props} />
    );
  }

  return <DialogHeader className={className} {...props} />;
}

export function ResponsiveDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return <SheetTitle className={className} {...props} />;
  }

  return <DialogTitle className={className} {...props} />;
}

export function ResponsiveDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return <SheetDescription className={className} {...props} />;
  }

  return <DialogDescription className={className} {...props} />;
}

export function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return (
      <SheetFooter
        className={cn(
          "flex flex-row justify-end gap-2 border-t p-0 pt-3 mt-auto",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <DialogFooter
      className={cn(
        "flex flex-row justify-end gap-2 border-t pt-3 mt-auto",
        className,
      )}
      {...props}
    />
  );
}

export function ResponsiveDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return <SheetTrigger {...props} />;
  }

  return <DialogTrigger {...props} />;
}

export function ResponsiveDialogClose({
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return <SheetClose {...props} />;
  }

  return <DialogClose {...props} />;
}

export function ResponsiveDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto min-h-0 py-2 pr-1", className)}
      {...props}
    />
  );
}
