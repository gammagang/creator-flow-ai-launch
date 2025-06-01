
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import BrandProfile from "./pages/BrandProfile";
import CreatorDiscovery from "./pages/CreatorDiscovery";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorDetails from "./pages/CreatorDetails";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignList from "./pages/CampaignList";
import CampaignDetails from "./pages/CampaignDetails";
import CreatorManagement from "./pages/CreatorManagement";
import Outreach from "./pages/Outreach";
import Negotiation from "./pages/Negotiation";
import Contracts from "./pages/Contracts";
import ContractDetails from "./pages/ContractDetails";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AgentCall from "./pages/AgentCall";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/agent-call"
              element={
                <ProtectedRoute>
                  <AgentCall />
                </ProtectedRoute>
              }
            />
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
              <Route path="campaigns/:id" element={<CampaignDetails />} />
              <Route path="campaigns/:campaignId/creator-management" element={<CreatorManagement />} />
              <Route
                path="campaigns/:campaignId/creators/:id"
                element={<CreatorDetails />}
              />
              <Route path="outreach" element={<Outreach />} />
              <Route path="negotiation" element={<Negotiation />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="contracts/:id" element={<ContractDetails />} />
              <Route path="payments" element={<Payments />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
