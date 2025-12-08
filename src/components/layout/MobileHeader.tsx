import { useState } from "react";
import { Menu, X, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  searchPlaceholder?: string;
  notificationColor?: string;
  children: React.ReactNode;
  userInitials?: string;
  userEmail?: string;
  userRole?: string;
}

export function MobileHeader({
  title,
  searchPlaceholder = "Buscar...",
  notificationColor = "bg-primary",
  children,
  userInitials = "US",
  userEmail,
  userRole,
}: MobileHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-8 md:hidden">
      {/* Mobile Menu Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
          {children}
        </SheetContent>
      </Sheet>

      {/* Title */}
      <h1 className="text-base font-semibold text-foreground">{title}</h1>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className={`absolute top-1 right-1 h-2 w-2 rounded-full ${notificationColor}`} />
        </button>
      </div>
    </header>
  );
}
