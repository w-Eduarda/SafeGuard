// ============================================================
// SafeGuard OSINT — Command Menu (Ctrl+K)
// ============================================================

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Search,
  Monitor,
  Bell,
  Shield,
  BarChart3,
  Settings,
  Moon,
  Sun,
  LogOut,
  AlertTriangle,
  User,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const safeToggle = toggleTheme ?? (() => {});

  const runCommand = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  const pages = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Central de Descobertas", icon: Search, path: "/discoveries" },
    { label: "Monitoramento", icon: Monitor, path: "/monitoring" },
    { label: "Alertas", icon: Bell, path: "/alerts" },
    { label: "Guia de Mitigação", icon: Shield, path: "/mitigation" },
    { label: "Relatórios", icon: BarChart3, path: "/reports" },
    { label: "Configurações", icon: Settings, path: "/settings" },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar páginas, ações..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Navegação">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <CommandItem
                key={page.path}
                onSelect={() => runCommand(() => navigate(page.path))}
              >
                <Icon className="mr-2 h-4 w-4" />
                {page.label}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações">
          <CommandItem           onSelect={() => runCommand(safeToggle)}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            {theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/login"))}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
