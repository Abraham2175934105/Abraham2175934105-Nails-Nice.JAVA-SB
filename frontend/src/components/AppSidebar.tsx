import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  Archive, Receipt, Megaphone, TicketPercent, HeadphonesIcon, Sparkles
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuSections = [
  {
    title: "USUARIOS",
    url: "/usuarios",
    icon: Users,
  },
  {
    title: "PRODUCTOS",
    url: "/productos-admin",
    icon: Package,
  },
  {
    title: "INVENTARIO",
    url: "/inventario",
    icon: Archive,
  },
  {
    title: "VENTAS",
    url: "/ventas",
    icon: Receipt,
  },
  {
    title: "PEDIDOS",
    url: "/pedidos",
    icon: ShoppingCart,
  },
  {
    title: "SERVICIOS",
    url: "/servicios",
    icon: Megaphone,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r bg-gradient-to-b from-card to-card/95">
      <SidebarContent className="overflow-y-auto pt-4">
        {/* Dashboard Link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <NavLink 
                    to="/dashboard" 
                    end
                    className="flex items-center gap-3 hover:bg-primary/10 hover:shadow-soft transition-all duration-300 rounded-lg py-3 px-2 group"
                    activeClassName="bg-gradient-to-r from-primary/20 to-primary/10 text-foreground font-bold border-l-4 border-primary shadow-medium"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all">
                      <LayoutDashboard className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    {!isCollapsed && <span className="font-semibold">Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Menu Sections */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuSections.map((section) => {
                const Icon = section.icon;
                return (
                  <SidebarMenuItem key={section.title}>
                    <SidebarMenuButton asChild tooltip={section.title}>
                      <NavLink 
                        to={section.url} 
                        end
                        className="flex items-center gap-3 hover:bg-primary/10 hover:shadow-soft transition-all duration-300 rounded-lg py-3 px-2 group"
                        activeClassName="bg-gradient-to-r from-primary/20 to-primary/10 text-foreground font-bold border-l-4 border-primary shadow-medium"
                      >
                        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 transition-all">
                          <Icon className="h-5 w-5 text-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                        </div>
                        {!isCollapsed && <span className="font-semibold">{section.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
