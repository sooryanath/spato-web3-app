
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
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
import VendorDashboard from "./pages/VendorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/login" element={<Login />} />
            
            {/* Bank Dashboard Routes */}
            <Route 
              path="/bank-dashboard" 
              element={
                <AuthGuard requiredRole="bank">
                  <BankDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bank-dashboard/cat-issued" 
              element={
                <AuthGuard requiredRole="bank">
                  <CatIssuedDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bank-dashboard/active-requests" 
              element={
                <AuthGuard requiredRole="bank">
                  <ActiveRequestsDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bank-dashboard/total-companies" 
              element={
                <AuthGuard requiredRole="bank">
                  <TotalCompaniesDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bank-dashboard/active-loans" 
              element={
                <AuthGuard requiredRole="bank">
                  <ActiveLoansExplorer />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bank-dashboard/disputed-loans" 
              element={
                <AuthGuard requiredRole="bank">
                  <DisputedLoansExplorer />
                </AuthGuard>
              } 
            />
            
            {/* Company Dashboard Routes */}
            <Route 
              path="/company-dashboard" 
              element={
                <AuthGuard requiredRole="company">
                  <CompanyDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/vendor-management" 
              element={
                <AuthGuard requiredRole="company">
                  <VendorManagement />
                </AuthGuard>
              } 
            />
            
            {/* Vendor Dashboard Routes */}
            <Route 
              path="/vendor-dashboard" 
              element={
                <AuthGuard requiredRole="vendor">
                  <VendorDashboard />
                </AuthGuard>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
