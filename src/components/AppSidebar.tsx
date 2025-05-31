
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  Megaphone,
  Mail,
  MessageSquare,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Zap
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
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
    group: "main"
  },
  {
    title: "Brand Profile",
    url: "/app/brand-profile", 
    icon: Building,
    group: "main"
  },
  {
    title: "Creator Discovery",
    url: "/app/creators",
    icon: Users,
    group: "creators"
  },
  {
    title: "Campaigns",
    url: "/app/campaigns",
    icon: Megaphone,
    group: "campaigns"
  },
  {
    title: "Outreach",
    url: "/app/outreach",
    icon: Mail,
    group: "outreach"
  },
  {
    title: "Negotiation",
    url: "/app/negotiation",
    icon: MessageSquare,
    group: "outreach"
  },
  {
    title: "Contracts",
    url: "/app/contracts",
    icon: FileText,
    group: "deals"
  },
  {
    title: "Payments",
    url: "/app/payments",
    icon: CreditCard,
    group: "deals"
  },
  {
    title: "Analytics",
    url: "/app/analytics",
    icon: BarChart3,
    group: "insights"
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
    group: "account"
  }
];

const groupLabels = {
  main: "Main",
  creators: "Creator Management", 
  campaigns: "Campaign Management",
  outreach: "Outreach & Communication",
  deals: "Deals & Payments",
  insights: "Insights",
  account: "Account"
};

export function AppSidebar() {
  const { state } = useSidebar();
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

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">InfluencerFlow</h2>
              <p className="text-xs text-gray-500">AI Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey} className="mb-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {groupLabels[groupKey as keyof typeof groupLabels]}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavClass(item.url)}`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
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
