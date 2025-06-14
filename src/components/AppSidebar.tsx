import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  Zap,
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
    url: "/agentic-manager",
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
    url: "/brand-profile",
    icon: Building,
    group: "main",
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Megaphone,
    group: "main",
  },
  {
    title: "Creator Discovery",
    url: "/creators",
    icon: Users,
    group: "main",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    group: "insights",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    group: "account",
  },
];

const groupLabels = {
  main: "Main",
  campaigns: "Campaigns",
  insights: "Insights",
  account: "Account",
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard" && currentPath === "/") return true;
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

  // Extract Agentic Manager and the rest
  const agenticManager = navigationItems.find(
    (item) => item.title === "Agentic Manager"
  );
  const otherItems = navigationItems.filter(
    (item) => item.title !== "Agentic Manager"
  );
  const groupedOtherItems = otherItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">InfluencerFlow</h2>
            <p className="text-xs text-gray-500">AI Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Highlighted Agentic Manager Button */}
        {agenticManager && (
          <div className="mb-4">
            <NavLink
              to={agenticManager.url}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-blue-700/80 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold shadow transition-all duration-150 hover:shadow-lg hover:translate-y-[-2px] active:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 relative ${
                isActive(agenticManager.url) ? "ring-2 ring-blue-400" : ""
              }`}
              style={{ boxShadow: "0 2px 8px 0 rgba(80, 72, 229, 0.13)" }}
            >
              <agenticManager.icon
                className="w-5 h-5 flex-shrink-0"
                style={{ filter: "drop-shadow(0 0 4px #a78bfa)" }}
              />
              <span className="font-semibold text-sm">
                {agenticManager.title}
              </span>
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-white/10 border border-white/20 text-white font-normal">
                Featured
              </span>
            </NavLink>
          </div>
        )}
        {/* Grouped Navigation Items */}
        {Object.entries(groupedOtherItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey} className="mb-4">
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {groupLabels[groupKey as keyof typeof groupLabels]}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavClass(
                          item.url
                        )}`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.title}</span>
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
