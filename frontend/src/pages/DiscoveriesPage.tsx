// ============================================================
// SafeGuard OSINT — Discoveries Page
// Tabela moderna com filtros, busca em tempo real, status
// ============================================================

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  ChevronDown,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { mockFindings } from "@/lib/mock-data";
import { toast } from "sonner";

type RiskFilter = "all" | "critical" | "high" | "medium" | "low" | "resolved";

const riskLabels: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

const statusLabels: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  resolved: "Resolvido",
};

interface DiscoveriesPageProps {
  onCommandOpen?: () => void;
}

export default function DiscoveriesPage({ onCommandOpen }: DiscoveriesPageProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<RiskFilter>("all");

  const filtered = useMemo(() => {
    return mockFindings.filter((f) => {
      const matchSearch =
        search === "" ||
        f.type.toLowerCase().includes(search.toLowerCase()) ||
        f.source.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "resolved" ? f.status === "resolved" : f.risk === activeFilter);

      return matchSearch && matchFilter;
    });
  }, [search, activeFilter]);

  const filterButtons: { key: RiskFilter; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: mockFindings.length },
    { key: "critical", label: "Crítico", count: mockFindings.filter((f) => f.risk === "critical").length },
    { key: "high", label: "Alto", count: mockFindings.filter((f) => f.risk === "high").length },
    { key: "medium", label: "Médio", count: mockFindings.filter((f) => f.risk === "medium").length },
    { key: "low", label: "Baixo", count: mockFindings.filter((f) => f.risk === "low").length },
    { key: "resolved", label: "Resolvidos", count: mockFindings.filter((f) => f.status === "resolved").length },
  ];

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Central de Descobertas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockFindings.length} itens encontrados · {mockFindings.filter(f => f.status === "open").length} abertos
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={() => toast.success("Relatório exportado com sucesso!")}
          >
            <Download className="w-3.5 h-3.5" />
            Exportar
          </Button>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tipo, fonte ou descrição..."
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setActiveFilter(btn.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                  activeFilter === btn.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {btn.label}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  activeFilter === btn.key ? "bg-white/20" : "bg-background"
                )}>
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">Nenhum resultado encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tente ajustar os filtros ou o termo de busca
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => { setSearch(""); setActiveFilter("all"); }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide">Tipo</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide">Fonte</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide hidden md:table-cell">Descrição</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide hidden sm:table-cell">Data</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide">Risco</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide">Status</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((finding, i) => (
                    <motion.tr
                      key={finding.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="text-xs font-medium">
                          {finding.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-foreground">{finding.source}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{finding.description}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">{finding.date}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge className={cn(
                          "text-xs border-0 font-medium",
                          finding.risk === "critical" ? "risk-critical" :
                          finding.risk === "high" ? "risk-high" :
                          finding.risk === "medium" ? "risk-medium" : "risk-low"
                        )}>
                          {riskLabels[finding.risk]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {finding.status === "resolved" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          ) : finding.status === "in_progress" ? (
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {statusLabels[finding.status]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => toast.info(`Detalhes: ${finding.description}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Exibindo {filtered.length} de {mockFindings.length} descobertas
          </p>
        )}
      </div>
    </AppLayout>
  );
}
