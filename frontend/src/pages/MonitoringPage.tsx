// ============================================================
// SafeGuard OSINT — Monitoring Page
// Cards de monitoramento ativos + formulário de cadastro
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Globe,
  CreditCard,
  AtSign,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Bell,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { mockMonitoredItems } from "@/lib/mock-data";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = {
  email: Mail,
  cpf: CreditCard,
  phone: Phone,
  username: AtSign,
  domain: Globe,
  name: User,
};

const typeLabels: Record<string, string> = {
  email: "E-mail",
  cpf: "CPF",
  phone: "Telefone",
  username: "Username",
  domain: "Domínio",
  name: "Nome",
};

interface MonitoringPageProps {
  onCommandOpen?: () => void;
}

export default function MonitoringPage({ onCommandOpen }: MonitoringPageProps) {
  const [items, setItems] = useState(mockMonitoredItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newType, setNewType] = useState("email");
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    if (!newValue.trim()) {
      toast.error("Informe um valor para monitorar");
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      type: newType,
      label: newLabel || typeLabels[newType],
      value: newValue,
      status: "active",
      alerts: 0,
      lastCheck: "Agora",
    };
    setItems((prev) => [...prev, newItem]);
    setDialogOpen(false);
    setNewValue("");
    setNewLabel("");
    toast.success(`${typeLabels[newType]} adicionado ao monitoramento!`);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removido do monitoramento");
  };

  const handleScan = (id: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Verificando...",
        success: "Verificação concluída! Nenhum novo vazamento encontrado.",
        error: "Erro ao verificar",
      }
    );
  };

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoramento</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {items.length} itens monitorados ativamente
            </p>
          </div>
          <Button
            size="sm"
            className="gap-2 text-sm"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total monitorado", value: items.length, icon: Shield, color: "text-primary", bg: "bg-primary/10" },
            { label: "Com alertas", value: items.filter(i => i.alerts > 0).length, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Sem alertas", value: items.filter(i => i.alerts === 0).length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Total alertas", value: items.reduce((acc, i) => acc + i.alerts, 0), icon: Bell, color: "text-red-500", bg: "bg-red-500/10" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", stat.bg)}>
                  <Icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Monitored items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item, i) => {
              const Icon = typeIcons[item.type] || User;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="bg-card border border-border rounded-xl p-5 card-hover group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        item.alerts > 0 ? "bg-orange-500/10" : "bg-primary/10"
                      )}>
                        <Icon className={cn(
                          "w-4 h-4",
                          item.alerts > 0 ? "text-orange-500" : "text-primary"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{typeLabels[item.type]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-muted/50 rounded-lg">
                      <p className="text-xs font-mono text-foreground truncate">{item.value}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          item.status === "active" ? "bg-green-500" : "bg-muted-foreground"
                        )} />
                        <span className="text-muted-foreground">
                          {item.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        Verificado: {item.lastCheck}
                      </span>
                    </div>

                    {item.alerts > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500/10 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          {item.alerts} alerta{item.alerts > 1 ? "s" : ""} ativo{item.alerts > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 h-8 text-xs gap-1.5"
                    onClick={() => handleScan(item.id)}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Verificar agora
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add new card */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: items.length * 0.05 }}
            onClick={() => setDialogOpen(true)}
            className={cn(
              "border-2 border-dashed border-border rounded-xl p-5",
              "flex flex-col items-center justify-center gap-3 min-h-[180px]",
              "text-muted-foreground hover:text-foreground hover:border-primary/50",
              "transition-all duration-200 group"
            )}
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:border-primary/50 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Adicionar item</p>
              <p className="text-xs mt-0.5">Monitorar novo dado</p>
            </div>
          </motion.button>
        </div>

        {/* Add Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar ao Monitoramento</DialogTitle>
              <DialogDescription>
                Cadastre um dado pessoal para monitoramento contínuo de exposição.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Tipo de dado</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="username">Username</SelectItem>
                    <SelectItem value="domain">Domínio</SelectItem>
                    <SelectItem value="name">Nome completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Valor</Label>
                <Input
                  placeholder={
                    newType === "email" ? "exemplo@email.com" :
                    newType === "cpf" ? "000.000.000-00" :
                    newType === "phone" ? "+55 11 90000-0000" :
                    newType === "username" ? "@username" :
                    newType === "domain" ? "seudominio.com" :
                    "Nome Completo"
                  }
                  className="h-9"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Rótulo <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  placeholder="Ex: E-mail do trabalho"
                  className="h-9"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
