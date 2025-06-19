"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AuthGuard from "@/components/AuthGuard"
import {
  BarChart3,
  FileText,
  Home,
  Package,
  Receipt,
  Settings,
  Users,
  Wallet,
  Repeat,
  Upload,
  ShoppingCart,
  CreditCard,
  BookText,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Define types for menu items
interface MenuItem {
  title: string
  icon: React.ElementType
  href: string
  children?: MenuItem[]
}

// Define the menu items with hierarchical structure
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Document Upload",
    icon: Upload,
    href: "/dashboard/document-extraction",
  },
  {
    title: "Sales",
    icon: Receipt,
    href: "#",
    children: [
      {
        title: "Generate Invoice",
        icon: FileText,
        href: "/dashboard/invoice-generation?type=sales",
      },
      {
        title: "Quotation",
        icon: FileText,
        href: "/dashboard/performa-invoices?type=sales",
      },
      {
        title: "Tax Invoice",
        icon: Receipt,
        href: "/dashboard/tax-invoices?type=sales",
      },
    ],
  },
  {
    title: "Purchase",
    icon: ShoppingCart,
    href: "#",
    children: [
      {
        title: "Purchase Entry",
        icon: FileText,
        href: "/dashboard/invoice-generation?type=purchase",
      },
      {
        title: "Quotation",
        icon: FileText,
        href: "/dashboard/performa-invoices?type=purchase",
      },
      {
        title: "Purchases",
        icon: Receipt,
        href: "/dashboard/tax-invoices?type=purchase",
      },
    ],
  },
  {
    title: "Expenses",
    icon: Wallet,
    href: "/dashboard/expenses",
  },
  {
    title: "Bank & Cash",
    icon: CreditCard,
    href: "/dashboard/bank-cash",
  },
  {
    title: "Journal Entry",
    icon: BookText,
    href: "/dashboard/journal-entry",
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
  },
  {
    title: "Reconciliation",
    icon: Repeat,
    href: "/dashboard/reconciliation",
  },
  {
    title: "Customer Management",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Sales: true,
    Purchase: true,
  })

  // Function to toggle expanded state of parent items
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Check if a parent item should be considered active based on child routes
  const isParentActive = (item: MenuItem) => {
    if (!item.children) return false
    return item.children.some((child) => pathname.startsWith(child.href.split('?')[0]))
  }

  // Render menu items recursively
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      // Check if this is a parent item with children
      const hasChildren = item.children && item.children.length > 0
      const isActive = pathname === item.href || isParentActive(item)
      const isExpanded = expandedItems[item.title] || false

      if (hasChildren) {
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={() => toggleExpanded(item.title)}
              className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {isExpanded ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </SidebarMenuButton>
            {isExpanded && (
              <SidebarMenuSub>
                {item.children!.map((child) => (
                  <SidebarMenuSubItem key={`${item.title}-${child.title}`}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === child.href || pathname.startsWith(child.href.split('?')[0])}
                    >
                      <Link href={child.href}>
                        <child.icon className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        )
      }

      // Regular menu item without children
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link
              href={item.href}
              className={pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })
  }

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar collapsible="none" className="shrink-0">
            <SidebarHeader className="flex h-16 items-center border-b px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                <Home className="h-5 w-5" />
                <span>FinBuddy</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {renderMenuItems(menuItems)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
