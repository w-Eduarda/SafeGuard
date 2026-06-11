// ============================================================
// SafeGuard OSINT — AppLayout
// Design: Swiss Modernism + SaaS Premium
// Sidebar colapsável, header com busca global e toggle de tema
// ============================================================

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Monitor,
  Bell,
  Shield,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Command,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { path: "/discoveries", label: "Descobertas", icon: Search, badge: 5 },
  { path: "/monitoring", label: "Monitoramento", icon: Monitor, badge: null },
  { path: "/alerts", label: "Alertas", icon: Bell, badge: 3 },
  { path: "/mitigation", label: "Mitigação", icon: Shield, badge: null },
  { path: "/reports", label: "Relatórios", icon: BarChart3, badge: null },
  { path: "/settings", label: "Configurações", icon: Settings, badge: null },
];

interface AppLayoutProps {
  children: React.ReactNode;
  onCommandOpen?: () => void;
}

export default function AppLayout({ children, onCommandOpen }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const displayName = user?.full_name || user?.email || "Usuário";
  const avatarFallback = user?.full_name ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "US";

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full",
      isMobile ? "w-64" : collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border",
        collapsed && !isMobile && "justify-center px-0"
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-4 h-4 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-sidebar-foreground leading-tight">SafeGuard</span>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">OSINT</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.path || (location === "/" && item.path === "/dashboard");
          const Icon = item.icon;

          const linkContent = (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                "group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                collapsed && !isMobile && "justify-center px-0 py-2.5"
              )}
            >
              <Icon className={cn(
                "flex-shrink-0 transition-colors",
                collapsed && !isMobile ? "w-5 h-5" : "w-4 h-4",
                isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
              )} />
              {(!collapsed || isMobile) && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5 bg-primary/10 text-primary border-0">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-sidebar-accent"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                />
              )}
            </Link>
          );

          if (collapsed && !isMobile) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs h-4 px-1 bg-primary/10 text-primary border-0">
                      {item.badge}
                    </Badge>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Bottom section */}
      <div className={cn(
        "px-2 py-3 border-t border-sidebar-border space-y-1",
        collapsed && !isMobile && "px-0"
      )}>
        {/* User profile */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg",
          collapsed && !isMobile && "justify-center px-0"
        )}>
          <Avatar className="w-7 h-7 flex-shrink-0">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{mockUser.plan}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        {(!collapsed || isMobile) ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive text-xs h-8"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </Button>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-full h-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border relative flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-[72px] z-10",
            "w-6 h-6 rounded-full bg-background border border-border",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "transition-colors shadow-sm"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border lg:hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex-shrink-0 h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 gap-3 z-30">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>

          {/* Search / Command */}
          <button
            onClick={onCommandOpen}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "bg-muted/60 hover:bg-muted text-muted-foreground",
              "text-sm transition-colors border border-border/50",
              "w-full max-w-xs"
            )}
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left text-xs">Buscar...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-xs bg-background border border-border rounded px-1.5 py-0.5 font-mono">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          <div className="flex-1" />

          {/* Alert indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/alerts">
                <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>3 alertas não lidos</TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Modo claro" : "Modo escuro"}
            </TooltipContent>
          </Tooltip>

          {/* User avatar */}
          <Avatar className="w-7 h-7 cursor-pointer">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
