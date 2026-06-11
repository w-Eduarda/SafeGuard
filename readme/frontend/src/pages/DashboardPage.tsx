// ============================================================
// SafeGuard OSINT — Dashboard Page
// Score circular animado, gráficos, alertas, resumo
// ============================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingDown,
  Shield,
  Eye,
  Clock,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import {
  mockStats,
  mockExposureTrend,
  mockRiskDistribution,
  mockAlerts,
  mockFindings,
} from "@/lib/mock-data";

interface DashboardPageProps {
  onCommandOpen?: () => void;
}

// Animated circular score
function ExposureScore({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const timer = setTimeout(() => {
      let current = 0;
      interval = setInterval(() => {
        current += 1;
        setAnimatedScore(current);
        if (current >= score) {
          if (interval) clearInterval(interval);
        }
      }, 18);
    }, 400);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 70) return { stroke: "#ef4444", text: "text-red-500", label: "Alto Risco", bg: "bg-red-500/10" };
    if (s >= 40) return { stroke: "#f97316", text: "text-orange-500", label: "Risco Médio", bg: "bg-orange-500/10" };
    return { stroke: "#22c55e", text: "text-green-500", label: "Baixo Risco", bg: "bg-green-500/10" };
  };

  const colors = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Track */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/40"
          />
          {/* Progress */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold tabular-nums", colors.text)}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">/ 100</span>
        </div>
      </div>
      <div className={cn("mt-3 px-3 py-1 rounded-full text-xs font-semibold", colors.bg, colors.text)}>
        {colors.label}
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">Exposure Score</p>
    </div>
  );
}

const statCards = [
  {
    label: "Vazamentos",
    value: mockStats.leaksFound,
    icon: AlertTriangle,
    trend: -2,
    trendLabel: "vs. mês anterior",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    label: "Dados Monitorados",
    value: mockStats.monitoredItems,
    icon: Eye,
    trend: +3,
    trendLabel: "novos este mês",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Resolvidos",
    value: mockStats.resolvedIssues,
    icon: CheckCircle2,
    trend: +3,
    trendLabel: "vs. mês anterior",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Alertas Críticos",
    value: mockStats.criticalAlerts,
    icon: Shield,
    trend: 0,
    trendLabel: "sem alteração",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function DashboardPage({ onCommandOpen }: DashboardPageProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const recentAlerts = mockAlerts.filter((a) => !a.read).slice(0, 3);
  const recentFindings = mockFindings.slice(0, 4);

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Visão geral da sua exposição digital
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar
          </Button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-xl p-6 h-full flex flex-col items-center justify-center gap-4 card-hover"
            >
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="w-44 h-44 rounded-full" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>
              ) : (
                <>
                  <ExposureScore score={mockStats.exposureScore} />
                  <div className="w-full space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Última verificação
                      </span>
                      <span className="font-medium text-foreground">2h atrás</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Activity className="w-3 h-3" />
                        Tendência
                      </span>
                      <span className="font-medium text-green-500 flex items-center gap-1">
                        <ArrowDownRight className="w-3 h-3" />
                        -9 pts este mês
                      </span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 card-hover"
                >
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-16 h-8" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  ) : (
                    <>
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", card.bg)}>
                        <Icon className={cn("w-4.5 h-4.5", card.color)} style={{ width: 18, height: 18 }} />
                      </div>
                      <p className="text-2xl font-bold text-foreground tabular-nums">{card.value}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {card.trend > 0 ? (
                          <ArrowUpRight className="w-3 h-3 text-green-500" />
                        ) : card.trend < 0 ? (
                          <ArrowDownRight className="w-3 h-3 text-red-500" />
                        ) : null}
                        <span className={cn(
                          "text-xs",
                          card.trend > 0 ? "text-green-500" : card.trend < 0 ? "text-red-500" : "text-muted-foreground"
                        )}>
                          {card.trend > 0 ? `+${card.trend}` : card.trend} {card.trendLabel}
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exposure trend chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Tendência de Exposição</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Score ao longo dos últimos 6 meses</p>
              </div>
              <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                <TrendingDown className="w-3 h-3 mr-1" />
                -26 pts
              </Badge>
            </div>
            {loading ? (
              <Skeleton className="w-full h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={mockExposureTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3E476F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3E476F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
                    itemStyle={{ color: "var(--color-muted-foreground)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3E476F"
                    strokeWidth={2.5}
                    fill="url(#scoreGrad)"
                    dot={{ fill: "#3E476F", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Risk distribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-foreground">Distribuição de Risco</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Por nível de criticidade</p>
            </div>
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="space-y-2 w-full">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="w-full h-4" />)}
                </div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={mockRiskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {mockRiskDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {mockRiskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-semibold text-foreground tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent alerts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Alertas Recentes</h3>
              <Link href="/alerts">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-primary">
                  Ver todos <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="w-3/4 h-4" />
                        <Skeleton className="w-1/2 h-3" />
                      </div>
                    </div>
                  ))
                : recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        alert.severity === "critical" ? "bg-red-500/10" :
                        alert.severity === "high" ? "bg-orange-500/10" : "bg-yellow-500/10"
                      )}>
                        <AlertTriangle className={cn(
                          "w-4 h-4",
                          alert.severity === "critical" ? "text-red-500" :
                          alert.severity === "high" ? "text-orange-500" : "text-yellow-500"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alert.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </motion.div>

          {/* Recent findings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Descobertas Recentes</h3>
              <Link href="/discoveries">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-primary">
                  Ver todas <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {loading
                ? [1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="w-16 h-5 rounded" />
                      <Skeleton className="flex-1 h-4" />
                      <Skeleton className="w-12 h-5 rounded-full" />
                    </div>
                  ))
                : recentFindings.map((finding) => (
                    <div key={finding.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <Badge variant="outline" className="text-xs font-medium flex-shrink-0 min-w-[60px] justify-center">
                        {finding.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex-1 truncate">{finding.source}</span>
                      <Badge
                        className={cn(
                          "text-xs border-0 flex-shrink-0",
                          finding.risk === "critical" ? "risk-critical" :
                          finding.risk === "high" ? "risk-high" :
                          finding.risk === "medium" ? "risk-medium" : "risk-low"
                        )}
                      >
                        {finding.risk === "critical" ? "Crítico" :
                         finding.risk === "high" ? "Alto" :
                         finding.risk === "medium" ? "Médio" : "Baixo"}
                      </Badge>
                    </div>
                  ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
