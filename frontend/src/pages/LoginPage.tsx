// ============================================================
// SafeGuard OSINT — Login Page
// Design: Split layout - dark hero left, clean form right
// ============================================================

import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Github,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";

type AuthMode = "login" | "register" | "forgot";

const features = [
  "Monitoramento contínuo de vazamentos",
  "Score de exposição em tempo real",
  "Guia de mitigação personalizado",
  "Alertas instantâneos de risco",
];

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
        const response = await axios.post(`${API_URL}/auth/token`, formData);
        login(response.data);
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else if (mode === "register") {
        await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          full_name: name
        });
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        setMode("login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      // Simulação de login social validado pelo backend
      const socialData = {
        email: email || `${provider}_user@example.com`,
        full_name: name || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider,
        provider_id: Math.random().toString(36).substring(7)
      };
      const response = await axios.post(`${API_URL}/auth/social-login`, socialData);
      login(response.data);
      toast.success(`Login com ${provider} realizado com sucesso!`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Erro no login social.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { level: 1, label: "Fraca", color: "bg-red-500" };
    if (password.length < 10) return { level: 2, label: "Média", color: "bg-yellow-500" };
    if (password.length < 14) return { level: 3, label: "Boa", color: "bg-blue-500" };
    return { level: 4, label: "Forte", color: "bg-green-500" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Hero */}
      <div
        className="hidden lg:flex flex-col w-[52%] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 50%, #1e2444 100%)",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663721705682/azLME4NiJBZbADCS3aJFLB/hero-bg-GWeevunYQmy4WL5XuSGZDb.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1f3a]/80" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-lg leading-none">SafeGuard</span>
              <span className="block text-xs text-white/60 font-medium tracking-widest uppercase">OSINT</span>
            </div>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Proteja sua
                <br />
                <span className="text-blue-300">identidade digital</span>
              </h1>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">
                Monitore sua exposição na internet com inteligência de código aberto.
                Detecte vazamentos antes que causem danos.
              </p>

              <div className="space-y-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-400/20 border border-blue-400/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-blue-300" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom stats */}
          <div className="flex gap-8">
            {[
              { value: "50K+", label: "Usuários protegidos" },
              { value: "2M+", label: "Vazamentos detectados" },
              { value: "99.9%", label: "Uptime garantido" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">SafeGuard OSINT</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {mode === "login" && "Bem-vindo de volta"}
                  {mode === "register" && "Criar conta"}
                  {mode === "forgot" && "Recuperar senha"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {mode === "login" && "Entre na sua conta para continuar"}
                  {mode === "register" && "Comece a proteger seus dados hoje"}
                  {mode === "forgot" && "Enviaremos um link de recuperação"}
                </p>
              </div>

              {/* Social login */}
              {mode !== "forgot" && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button
                      variant="outline"
                      className="h-10 gap-2 text-sm font-medium"
                      onClick={() => handleSocialLogin("google")}
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 gap-2 text-sm font-medium"
                      onClick={() => handleSocialLogin("github")}
                      disabled={loading}
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                      ou continue com e-mail
                    </span>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-9 h-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-9 h-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-xs text-primary hover:underline"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-9 h-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {mode === "register" && strength && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "h-1 flex-1 rounded-full transition-all duration-300",
                                level <= strength.level ? strength.color : "bg-muted"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Força da senha: <span className="font-medium text-foreground">{strength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 font-semibold gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" && "Entrar"}
                      {mode === "register" && "Criar conta"}
                      {mode === "forgot" && "Enviar link de recuperação"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Mode switcher */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" && (
                  <>
                    Não tem uma conta?{" "}
                    <button
                      onClick={() => setMode("register")}
                      className="text-primary font-medium hover:underline"
                    >
                      Criar conta grátis
                    </button>
                  </>
                )}
                {mode === "register" && (
                  <>
                    Já tem uma conta?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="text-primary font-medium hover:underline"
                    >
                      Entrar
                    </button>
                  </>
                )}
                {mode === "forgot" && (
                  <button
                    onClick={() => setMode("login")}
                    className="text-primary font-medium hover:underline"
                  >
                    ← Voltar ao login
                  </button>
                )}
              </div>

              {/* Security note */}
              <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Seus dados são protegidos com criptografia AES-256 e nunca são compartilhados com terceiros.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
