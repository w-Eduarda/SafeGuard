// ============================================================
// SafeGuard OSINT — Reports Page
// Relatórios com timeline, gráficos e histórico de riscos
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { mockReportData } from "@/lib/mock-data";
import { toast } from "sonner";

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
  info: "#3b82f6",
};

const severityLabels: Record<string, string> = {
  critical: "Crítico",
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
  info: "Info",
};

interface ReportsPageProps {
  onCommandOpen?: () => void;
}

export default function ReportsPage({ onCommandOpen }: ReportsPageProps) {
  const handleExport = (format: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Gerando relatório ${format}...`,
        success: `Relatório ${format} exportado com sucesso!`,
        error: "Erro ao exportar relatório",
      }
    );
  };

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Análise histórica da sua exposição digital
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => handleExport("PDF")}
            >
              <FileText className="w-3.5 h-3.5" />
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => handleExport("CSV")}
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Melhora no Score", value: "-26 pts", icon: TrendingDown, color: "text-green-500", bg: "bg-green-500/10", sub: "nos últimos 6 meses" },
            { label: "Total de Eventos", value: "8", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", sub: "registrados" },
            { label: "Eventos Críticos", value: "2", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", sub: "requerem ação" },
            { label: "Resolvidos", value: "3", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", sub: "este período" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", card.bg)}>
                  <Icon className={cn("w-4 h-4", card.color)} />
                </div>
                <p className={cn("text-2xl font-bold", card.color)}>{card.value}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="score">
          <TabsList className="h-9">
            <TabsTrigger value="score" className="text-xs">Evolução do Score</TabsTrigger>
            <TabsTrigger value="leaks" className="text-xs">Vazamentos</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
          </TabsList>

          {/* Score evolution */}
          <TabsContent value="score" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Evolução do Exposure Score</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Janeiro a Junho de 2026</p>
                </div>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0 text-xs">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Tendência positiva
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockReportData.scoreHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradReport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3E476F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3E476F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3E476F"
                    strokeWidth={2.5}
                    fill="url(#scoreGradReport)"
                    dot={{ fill: "#3E476F", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          {/* Leaks chart */}
          <TabsContent value="leaks" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="mb-6">
                <h3 className="font-semibold text-foreground">Histórico de Vazamentos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Quantidade de vazamentos por mês</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockReportData.scoreHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="leaks" fill="#3E476F" radius={[4, 4, 0, 0]} name="Vazamentos" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="mb-6">
                <h3 className="font-semibold text-foreground">Timeline de Eventos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Histórico cronológico de ocorrências</p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-4">
                  {mockReportData.timeline.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-4 pl-10 relative"
                    >
                      {/* Dot */}
                      <div
                        className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-background"
                        style={{ backgroundColor: severityColors[event.severity] }}
                      />

                      <div className="flex-1 flex items-start justify-between gap-4 pb-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{event.event}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.date}</p>
                        </div>
                        <Badge
                          className="text-xs border-0 flex-shrink-0"
                          style={{
                            backgroundColor: `${severityColors[event.severity]}20`,
                            color: severityColors[event.severity],
                          }}
                        >
                          {severityLabels[event.severity]}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
