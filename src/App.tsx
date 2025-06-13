import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import AgentCall from "./pages/AgentCall";
import AgenticManager from "./pages/AgenticManager";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import BrandProfile from "./pages/BrandProfile";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignCreatorMappingDetails from "./pages/CampaignCreatorMappingDetails";
import CampaignDetails from "./pages/CampaignDetails";
import CampaignList from "./pages/CampaignList";
import ContractDetails from "./pages/ContractDetails";
import CreatorDiscovery from "./pages/CreatorDiscovery";
import CreatorProfile from "./pages/CreatorProfile";
import Dashboard from "./pages/Dashboard";
import Negotiation from "./pages/Negotiation";
import NotFound from "./pages/NotFound";
import Outreach from "./pages/Outreach";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";

// Creator Details Tab Components
import AnalyticsTab from "./components/creator-details/AnalyticsTab";
import ContentManagementTab from "./components/creator-details/ContentManagementTab";
import CreatorManagementTab from "./components/creator-details/CreatorManagementTab";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/agent-call" element={<AgentCall />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="brand-profile" element={<BrandProfile />} />
              <Route path="creators" element={<CreatorDiscovery />} />
              <Route path="creators/:id" element={<CreatorProfile />} />
              <Route path="campaigns" element={<CampaignList />} />
              <Route path="campaigns/create" element={<CampaignCreate />} />
              <Route path="campaigns/:id" element={<CampaignDetails />}>
                <Route path="overview" element={<CampaignDetails />} />
                <Route path="creators" element={<CampaignDetails />} />
                <Route path="content" element={<CampaignDetails />} />
                <Route path="analytics" element={<CampaignDetails />} />
              </Route>
              <Route
                path="campaigns/:campaignId/creators/:creatorId/mapping/:mappingId"
                element={<CampaignCreatorMappingDetails />}
              >
                <Route
                  path="creator-management"
                  element={<CreatorManagementTab />}
                />
                <Route
                  path="content-management"
                  element={<ContentManagementTab />}
                />
                <Route path="analytics" element={<AnalyticsTab />} />
              </Route>
              <Route path="outreach" element={<Outreach />} />
              <Route path="negotiation" element={<Negotiation />} />
              <Route path="contracts/:id" element={<ContractDetails />} />
              <Route path="payments" element={<Payments />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="agentic-manager" element={<AgenticManager />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
