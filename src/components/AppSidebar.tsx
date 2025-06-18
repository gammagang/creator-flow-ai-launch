import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  Zap,
  Mail,
  Handshake,
  CreditCard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Agentic Manager",
    url: "/dashboard/agentic-manager",
    icon: Zap,
    group: "main",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    group: "main",
  },
  {
    title: "Brand Profile",
    url: "/dashboard/brand-profile",
    icon: Building,
    group: "main",
  },
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: Megaphone,
    group: "main",
  },
  {
    title: "Creator Discovery",
    url: "/dashboard/creators",
    icon: Users,
    group: "main",
  },
  // {
  //   title: "Outreach",
  //   url: "/dashboard/outreach",
  //   icon: Mail,
  //   group: "campaign-tools",
  // },
  // {
  //   title: "Negotiation",
  //   url: "/dashboard/negotiation",
  //   icon: Handshake,
  //   group: "campaign-tools",
  // },
  // {
  //   title: "Payments",
  //   url: "/dashboard/payments",
  //   icon: CreditCard,
  //   group: "campaign-tools",
  // },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
    group: "insights",
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    group: "account",
  },
];

const groupLabels = {
  main: "Main",
  "campaign-tools": "Campaign Tools",
  campaigns: "Campaigns",
  insights: "Insights",
  account: "Account",
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return (
        currentPath === "/dashboard" ||
        (currentPath === "/" && path === "/dashboard")
      );
    }
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
      : "text-gray-700 hover:bg-gray-100";

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar className="w-64 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 border-r border-orange-100 rounded-2xl">
      <SidebarHeader className="px-6 py-3 border-b border-orange-200 bg-white/60 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center justify-center py-[7px]">
          <img
            src="/logos/logo.svg"
            alt="Flow AI Logo"
            className="h-6 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        {/* Grouped Navigation Items */}
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey} className="mb-6">
            <SidebarGroupLabel className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3 pl-2">
              {groupLabels[groupKey as keyof typeof groupLabels]}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-colors duration-150 border focus:outline-none focus:ring-2 focus:ring-orange-200 ${
                          isActive(item.url)
                            ? "bg-orange-100 text-orange-700 border-orange-300"
                            : "bg-transparent text-gray-700 border-transparent hover:bg-orange-50 hover:text-orange-700"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive(item.url)
                              ? "text-orange-600"
                              : "text-orange-400"
                          }`}
                        />
                        <span className="font-medium text-base tracking-wide">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
