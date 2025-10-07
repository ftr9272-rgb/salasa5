import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import SupplierDashboard from "./pages/supplier/Dashboard";

// Create a query client for testing
const queryClient = new QueryClient();

export default function CompleteSupplierTest() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <SupplierDashboard />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}