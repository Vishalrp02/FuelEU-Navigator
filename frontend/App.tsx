import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { DashboardNav } from "./adapters/ui/components/DashboardNav";
import { Routes as RoutesPage } from "./adapters/ui/pages/Routes";
import { Compare } from "./adapters/ui/pages/Compare";
import { Banking } from "./adapters/ui/pages/Banking";
import { Pooling } from "./adapters/ui/pages/Pooling";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardNav />
        <Routes>
          <Route path="/" element={<Navigate to="/routes" replace />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/banking" element={<Banking />} />
          <Route path="/pooling" element={<Pooling />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
