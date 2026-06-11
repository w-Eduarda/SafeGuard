// ============================================================
// SafeGuard OSINT — App.tsx
// Routes, ThemeProvider, CommandMenu, ToastProvider
// ============================================================

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import CommandMenu from "./components/CommandMenu";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DiscoveriesPage from "./pages/DiscoveriesPage";
import MonitoringPage from "./pages/MonitoringPage";
import AlertsPage from "./pages/AlertsPage";
import MitigationPage from "./pages/MitigationPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

function AppContent() {
  const [commandOpen, setCommandOpen] = useState(false);

  // Global keyboard shortcut for command menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard">
          {() => <DashboardPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route path="/discoveries">
          {() => <DiscoveriesPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route path="/monitoring">
          {() => <MonitoringPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route path="/alerts">
          {() => <AlertsPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route path="/mitigation">
          {() => <MitigationPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route path="/reports">
          {() => <ReportsPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route path="/settings">
          {() => <SettingsPage onCommandOpen={() => setCommandOpen(true)} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" switchable>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
