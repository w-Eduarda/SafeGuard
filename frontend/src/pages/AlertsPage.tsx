// ============================================================
// SafeGuard OSINT — Alerts Page
// Central de notificações estilo Linear
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  Search,
  Lightbulb,
  RefreshCw,
  CheckCheck,
  Filter,
  ChevronRight,
  Zap,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { mockAlerts } from "@/lib/mock-data";
import { toast } from "sonner";

type AlertCategory = "all" | "leak" | "discovery" | "recommendation" | "update";

const categoryConfig = {
  leak: { label: "Vazamentos", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  discovery: { label: "Descobertas", icon: Search, color: "text-orange-500", bg: "bg-orange-500/10" },
  recommendation: { label: "Recomendações", icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-500/10" },
  update: { label: "Atualizações", icon: RefreshCw, color: "text-green-500", bg: "bg-green-500/10" },
};

const severityConfig = {
  critical: { label: "Crítico", class: "risk-critical" },
  high: { label: "Alto", class: "risk-high" },
  medium: { label: "Médio", class: "risk-medium" },
  low: { label: "Baixo", class: "risk-low" },
};

interface AlertsPageProps {
  onCommandOpen?: () => void;
}

export default function AlertsPage({ onCommandOpen }: AlertsPageProps) {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [activeTab, setActiveTab] = useState<AlertCategory>("all");

  const filtered = activeTab === "all"
    ? alerts
    : alerts.filter((a) => a.category === activeTab);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    toast.success("Todos os alertas marcados como lidos");
  };

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  };

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {unreadCount > 0 ? `${unreadCount} não lidos` : "Tudo em dia"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground border-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={markAllRead}>
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar todos como lidos
            </Button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all" as AlertCategory, label: "Todos", count: alerts.length },
            ...Object.entries(categoryConfig).map(([key, cfg]) => ({
              key: key as AlertCategory,
              label: cfg.label,
              count: alerts.filter((a) => a.category === key).length,
            })),
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                activeTab === tab.key ? "bg-white/20" : "bg-background"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">Nenhum alerta nesta categoria</p>
                <p className="text-sm text-muted-foreground mt-1">Você está protegido!</p>
              </motion.div>
            ) : (
              filtered.map((alert, i) => {
                const catCfg = categoryConfig[alert.category];
                const Icon = catCfg.icon;
                const sevCfg = severityConfig[alert.severity];

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    onClick={() => markRead(alert.id)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 cursor-pointer",
                      alert.read
                        ? "bg-card border-border hover:bg-muted/30"
                        : "bg-card border-primary/20 hover:bg-accent/30 shadow-sm"
                    )}
                  >
                    {/* Unread indicator */}
                    <div className="flex-shrink-0 mt-1">
                      {!alert.read && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                      {alert.read && (
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      catCfg.bg
                    )}>
                      <Icon className={cn("w-4 h-4", catCfg.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm leading-snug",
                          alert.read ? "font-medium text-foreground" : "font-semibold text-foreground"
                        )}>
                          {alert.title}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={cn("text-xs border-0", sevCfg.class)}>
                            {sevCfg.label}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground/70">{alert.time}</span>
                        <span className="text-xs text-muted-foreground/40">·</span>
                        <span className="text-xs text-muted-foreground">{catCfg.label}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-2.5" />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
