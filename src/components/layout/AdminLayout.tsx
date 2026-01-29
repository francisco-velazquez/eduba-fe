import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks";
import { APP_CONFIG, ROLE_LABELS } from "@/config";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <div className="md:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-8">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
                <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Search - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block relative w-full max-w-sm md:max-w-md lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios, grados, asignaturas..."
              className="pl-10 bg-background border-border text-sm"
            />
          </div>

          {/* Mobile Title */}
          <h1 className="sm:hidden text-base font-semibold text-foreground">{APP_CONFIG.name}</h1>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Icon */}
            <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9">
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>

            <div className="hidden md:flex items-center gap-3">
              <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">{initials}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-foreground">{ROLE_LABELS.admin}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
