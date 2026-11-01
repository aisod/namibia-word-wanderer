import { AppShell } from "./components/AppShell";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { PageTransition } from "./components/PageTransition";
const Index = lazy(() => import("./pages/Index"));
const LanguageIntro = lazy(() => import("./pages/LanguageIntro"));
const GameSelection = lazy(() => import("./pages/GameSelection"));
const Community = lazy(() => import("./pages/Community"));
const WordLibrary = lazy(() => import("./pages/WordLibrary"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminAccessDenied = lazy(() => import("./pages/AdminAccessDenied"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AppShell>
        <PageTransition>
          <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center">Loading page…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/language/:languageId" element={<LanguageIntro />} />
            <Route path="/games/:languageId" element={<GameSelection />} />
            <Route path="/words/:languageId" element={<WordLibrary />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/access-denied" element={<AdminAccessDenied />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </PageTransition>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

