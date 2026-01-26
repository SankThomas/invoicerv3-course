"use client";

import { FileText } from "lucide-react";
import { LayoutDashboard, Plus, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut } from "lucide-react";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "New Invoice",
      href: "/invoice/new",
      icon: Plus,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="bg-background flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-card fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <FileText className="text-primary size-8" />
            <span className="text-xl font-bold">Invoicer</span>

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                className="h-11 w-full justify-start gap-3"
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="size-5" />
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-11 w-full justify-start gap-3 px-3"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user?.picture} alt={user?.given_name} />
                    <AvatarFallback className="text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user?.name || "User"}</span>
                    <span className="text-muted-foreground text-xs">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 size-4" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 size-4" />
                      Dark mode
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <LogoutLink>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </LogoutLink>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mx-auto flex-1 lg:ml-64 lg:max-w-7xl">
        <div className="bg-background sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <div className="flex items-center gap-2">
            <FileText className="text-primary size-6" />
            <span className="font-semibold">Invoicer</span>
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
