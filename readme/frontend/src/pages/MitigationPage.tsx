// ============================================================
// SafeGuard OSINT — Mitigation Guide Page
// Biblioteca de mitigação com passo a passo e status
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  CheckCheck,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { mockMitigationGuides } from "@/lib/mock-data";
import { toast } from "sonner";

type GuideStatus = "pending" | "in_progress" | "completed";

const statusConfig: Record<GuideStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: "Pendente", icon: Circle, color: "text-muted-foreground", bg: "bg-muted/50" },
  in_progress: { label: "Em andamento", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  completed: { label: "Concluído", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
};

const riskConfig = {
  critical: { label: "Crítico", class: "risk-critical" },
  high: { label: "Alto", class: "risk-high" },
  medium: { label: "Médio", class: "risk-medium" },
  low: { label: "Baixo", class: "risk-low" },
};

interface MitigationPageProps {
  onCommandOpen?: () => void;
}

export default function MitigationPage({ onCommandOpen }: MitigationPageProps) {
  type GuideItem = Omit<typeof mockMitigationGuides[0], 'status'> & { status: GuideStatus };
  const [guides, setGuides] = useState<GuideItem[]>(mockMitigationGuides as GuideItem[]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | GuideStatus>("all");

  const filtered = guides.filter((g) => {
    const matchSearch = search === "" ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: GuideStatus) => {
    setGuides((prev) => prev.map((g) => g.id === id ? { ...g, status } : g));
    const labels: Record<GuideStatus, string> = {
      pending: "marcado como pendente",
      in_progress: "marcado como em andamento",
      completed: "marcado como concluído",
    };
    toast.success(`Guia ${labels[status]}`);
  };

  const completedCount = guides.filter((g) => g.status === "completed").length;
  const progress = Math.round((completedCount / guides.length) * 100);

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Guia de Mitigação</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {completedCount} de {guides.length} ações concluídas
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Progresso de Proteção</span>
            </div>
            <span className="text-sm font-bold text-foreground">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <div className="flex gap-4 mt-3">
            {[
              { label: "Pendentes", count: guides.filter(g => g.status === "pending").length, color: "text-muted-foreground" },
              { label: "Em andamento", count: guides.filter(g => g.status === "in_progress").length, color: "text-blue-500" },
              { label: "Concluídos", count: guides.filter(g => g.status === "completed").length, color: "text-green-500" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className={cn("text-sm font-semibold", stat.color)}>{stat.count}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar guias..."
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {[
              { key: "all" as const, label: "Todos" },
              { key: "pending" as const, label: "Pendentes" },
              { key: "in_progress" as const, label: "Em andamento" },
              { key: "completed" as const, label: "Concluídos" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilterStatus(btn.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                  filterStatus === btn.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guide list */}
        <div className="space-y-3">
          {filtered.map((guide, i) => {
            const isExpanded = expanded === guide.id;
            const statusCfg = statusConfig[guide.status as GuideStatus];
            const StatusIcon = statusCfg.icon;
            const riskCfg = riskConfig[guide.risk as keyof typeof riskConfig];

            return (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
                className={cn(
                  "bg-card border rounded-xl overflow-hidden transition-all duration-200",
                  guide.status === "completed" ? "border-green-500/20 opacity-80" : "border-border"
                )}
              >
                {/* Guide header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : guide.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    statusCfg.bg
                  )}>
                    <StatusIcon className={cn("w-4 h-4", statusCfg.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-sm font-semibold",
                        guide.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {guide.title}
                      </span>
                      <Badge variant="outline" className="text-xs">{guide.category}</Badge>
                      <Badge className={cn("text-xs border-0", riskCfg.class)}>
                        {riskCfg.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{guide.description}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">{guide.estimatedTime}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground">{guide.description}</p>

                        {/* Steps */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Passo a passo
                          </h4>
                          <ol className="space-y-2">
                            {guide.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-sm text-foreground">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Links */}
                        {guide.links.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                              Links úteis
                            </h4>
                            <div className="flex gap-2 flex-wrap">
                              {guide.links.map((link) => (
                                <a
                                  key={link.label}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground mr-1">Status:</span>
                          {(["pending", "in_progress", "completed"] as GuideStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(guide.id, s)}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                                guide.status === s
                                  ? s === "completed" ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                    : s === "in_progress" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                    : "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted"
                              )}
                            >
                              {statusConfig[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
