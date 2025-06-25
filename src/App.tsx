
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Documentation from "./pages/Documentation";
import Login from "./pages/Login";
import BankDashboard from "./pages/BankDashboard";
import CatIssuedDashboard from "./pages/CatIssuedDashboard";
import ActiveRequestsDashboard from "./pages/ActiveRequestsDashboard";
import TotalCompaniesDashboard from "./pages/TotalCompaniesDashboard";
import ActiveLoansExplorer from "./pages/ActiveLoansExplorer";
import DisputedLoansExplorer from "./pages/DisputedLoansExplorer";
import CompanyDashboard from "./pages/CompanyDashboard";
import VendorManagement from "./pages/VendorManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bank-dashboard" element={<BankDashboard />} />
          <Route path="/bank-dashboard/cat-issued" element={<CatIssuedDashboard />} />
          <Route path="/bank-dashboard/active-requests" element={<ActiveRequestsDashboard />} />
          <Route path="/bank-dashboard/total-companies" element={<TotalCompaniesDashboard />} />
          <Route path="/bank-dashboard/active-loans" element={<ActiveLoansExplorer />} />
          <Route path="/bank-dashboard/disputed-loans" element={<DisputedLoansExplorer />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/vendor-management" element={<VendorManagement />} />
          <Route path="/vendor-dashboard" element={<BankDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
