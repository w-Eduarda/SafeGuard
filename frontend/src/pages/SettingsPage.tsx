// ============================================================
// SafeGuard OSINT — Settings Page
// Perfil, Segurança, API Keys, Notificações, Integrações
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Key,
  Bell,
  Plug,
  Camera,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Shield,
  Smartphone,
  Mail,
  Globe,
  Github,
  Slack,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface SettingsPageProps {
  onCommandOpen?: () => void;
}

const apiKeys = [
  { id: "1", name: "Produção", key: "sg_live_••••••••••••••••••••••••••••••••", created: "01/01/2026", lastUsed: "Hoje" },
  { id: "2", name: "Desenvolvimento", key: "sg_test_••••••••••••••••••••••••••••••••", created: "15/03/2026", lastUsed: "Ontem" },
];

const integrations = [
  { id: "slack", name: "Slack", description: "Receba alertas no Slack", icon: Slack, connected: true, color: "text-purple-500" },
  { id: "github", name: "GitHub", description: "Monitore repositórios", icon: Github, connected: false, color: "text-foreground" },
  { id: "webhook", name: "Webhook", description: "Integração customizada via HTTP", icon: Webhook, connected: false, color: "text-blue-500" },
  { id: "email", name: "E-mail SMTP", description: "Notificações por e-mail customizado", icon: Mail, connected: true, color: "text-green-500" },
];

export default function SettingsPage({ onCommandOpen }: SettingsPageProps) {
  const { user, updateUser } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    critical: true,
    weekly: true,
    marketing: false,
  });

  const [showKey, setShowKey] = useState<string | null>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileName, setProfileName] = useState(user?.full_name || "");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as preferências de notificação no backend.
    // Por enquanto, apenas exibiremos uma mensagem de sucesso e logaremos o estado.
    console.log("Preferências de notificação salvas:", notifications);
    toast.success("Preferências de notificação salvas com sucesso!");
  };

  const handleSaveProfile = () => {
    updateUser({ full_name: profileName });
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("As novas senhas não coincidem!");
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/change-password/${user?.id}`, {
        old_password: oldPassword,
        new_password: newPassword
      });
      toast.success("Senha atualizada com sucesso!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao atualizar senha.");
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Chave copiada para a área de transferência");
  };

  const toggleIntegration = (id: string) => {
    toast.success(`Integração ${id} atualizada`);
  };

  return (
    <AppLayout onCommandOpen={onCommandOpen}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie sua conta e preferências</p>
        </div>

        <Tabs defaultValue="profile" orientation="vertical" className="flex gap-6">
          <TabsList className="flex flex-col h-auto w-44 flex-shrink-0 bg-transparent p-0 gap-0.5">
            {[
              { value: "profile", label: "Perfil", icon: User },
              { value: "security", label: "Segurança", icon: Lock },
              { value: "apikeys", label: "API Keys", icon: Key },
              { value: "notifications", label: "Notificações", icon: Bell },
              { value: "integrations", label: "Integrações", icon: Plug },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="justify-start gap-2.5 px-3 py-2 h-9 text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1 min-w-0">
            {/* Profile */}
            <TabsContent value="profile" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 space-y-6"
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Informações do Perfil</h3>
                  <p className="text-sm text-muted-foreground">Atualize suas informações pessoais</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {user?.full_name ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                      <Camera className="w-3.5 h-3.5" />
                      Alterar foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG ou GIF. Máx 2MB.</p>
                  </div>
                </div>

                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Nome completo</Label>
                    <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">E-mail</Label>
                    <Input value={user?.email || ""} disabled className="h-9 opacity-70" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Empresa</Label>
                    <Input placeholder="Sua empresa" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Cargo</Label>
                    <Input placeholder="Seu cargo" className="h-9" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" className="gap-2" onClick={handleSaveProfile}>
                    <Check className="w-3.5 h-3.5" />
                    Salvar alterações
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Alterar Senha</h3>
                    <p className="text-sm text-muted-foreground">Use uma senha forte com pelo menos 12 caracteres</p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Senha atual</Label>
                      <Input type="password" placeholder="••••••••" className="h-9" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Nova senha</Label>
                      <Input type="password" placeholder="••••••••" className="h-9" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Confirmar nova senha</Label>
                      <Input type="password" placeholder="••••••••" className="h-9" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <Button size="sm" onClick={handleChangePassword}>Atualizar senha</Button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Autenticação de Dois Fatores</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch
                      checked={twoFAEnabled}
                      onCheckedChange={(v) => {
                        setTwoFAEnabled(v);
                        toast.success(v ? "2FA ativado com sucesso!" : "2FA desativado");
                      }}
                    />
                  </div>
                  {twoFAEnabled && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        2FA ativo — sua conta está protegida
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* API Keys */}
            <TabsContent value="apikeys" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">API Keys</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Gerencie suas chaves de acesso à API</p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => toast.success("Nova API key gerada!")}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Gerar nova key
                  </Button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{apiKey.name}</span>
                          <Badge variant="outline" className="text-xs">Ativa</Badge>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground truncate">
                          {showKey === apiKey.id ? apiKey.key.replace(/•/g, "x") : apiKey.key}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criada em {apiKey.created} · Último uso: {apiKey.lastUsed}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                        >
                          {showKey === apiKey.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopyKey(apiKey.key)}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => toast.success("API key revogada")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 space-y-5"
              >
                <div>
                  <h3 className="font-semibold text-foreground">Preferências de Notificação</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Escolha como deseja ser notificado</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Canais</p>
                    {[
                      { key: "email" as const, label: "E-mail", desc: "Notificações por e-mail", icon: Mail },
                      { key: "push" as const, label: "Push", desc: "Notificações no navegador", icon: Bell },
                      { key: "sms" as const, label: "SMS", desc: "Mensagens de texto", icon: Smartphone },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications[item.key]}
                            onCheckedChange={(v) => setNotifications(prev => ({ ...prev, [item.key]: v }))}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tipos de alerta</p>
                    {[
                      { key: "critical" as const, label: "Alertas críticos", desc: "Vazamentos e riscos urgentes" },
                      { key: "weekly" as const, label: "Resumo semanal", desc: "Relatório de atividade semanal" },
                      { key: "marketing" as const, label: "Novidades e dicas", desc: "Atualizações do produto" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key]}
                          onCheckedChange={(v) => setNotifications(prev => ({ ...prev, [item.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="sm" onClick={handleSave}>Salvar preferências</Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Integrations */}
            <TabsContent value="integrations" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 space-y-4"
              >
                <div>
                  <h3 className="font-semibold text-foreground">Integrações</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Conecte com suas ferramentas favoritas</p>
                </div>

                <div className="space-y-3">
                  {integrations.map((integration) => {
                    const Icon = integration.icon;
                    return (
                      <div key={integration.id} className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className={cn("w-5 h-5", integration.color)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                            {integration.connected && (
                              <Badge className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                                Conectado
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                        </div>
                        <Button
                          variant={integration.connected ? "outline" : "default"}
                          size="sm"
                          className="text-xs"
                          onClick={() => toggleIntegration(integration.id)}
                        >
                          {integration.connected ? "Desconectar" : "Conectar"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
