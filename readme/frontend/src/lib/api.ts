/**
 * API Client para SafeGuard OSINT
 * Gerencia todas as requisições ao backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          error: error.detail || `Erro ${response.status}`,
          status: response.status,
        };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Erro desconhecido",
        status: 0,
      };
    }
  }

  // ============ MONITORED ITEMS ============

  async getMonitoredItems(userId: number) {
    return this.request(`/users/${userId}/monitored_items/`);
  }

  async createMonitoredItem(userId: number, itemType: string, value: string) {
    return this.request(`/users/${userId}/monitored_items/`, {
      method: "POST",
      body: JSON.stringify({ item_type: itemType, value }),
    });
  }

  // ============ DISCOVERIES ============

  async getDiscoveries(userId: number, skip = 0, limit = 100) {
    return this.request(
      `/users/${userId}/discoveries/?skip=${skip}&limit=${limit}`
    );
  }

  async createDiscovery(userId: number, discovery: any) {
    return this.request(`/users/${userId}/discoveries/`, {
      method: "POST",
      body: JSON.stringify(discovery),
    });
  }

  // ============ ALERTS ============

  async getAlerts(userId: number, skip = 0, limit = 100) {
    return this.request(`/users/${userId}/alerts/?skip=${skip}&limit=${limit}`);
  }

  async createAlert(userId: number, alert: any) {
    return this.request(`/users/${userId}/alerts/`, {
      method: "POST",
      body: JSON.stringify(alert),
    });
  }

  // ============ OSINT SCANS ============

  async triggerScan(userId: number, itemId: number) {
    return this.request(`/users/${userId}/scan/${itemId}`, {
      method: "POST",
    });
  }

  // ============ AGENTS ============

  async triggerAutoScan(userId: number) {
    return this.request(`/agents/scan-all/${userId}`, {
      method: "POST",
    });
  }

  async getRiskAnalysis(userId: number) {
    return this.request(`/agents/risk-analysis/${userId}`);
  }

  async getRecommendations(userId: number) {
    return this.request(`/agents/recommendations/${userId}`);
  }

  async getPriorityActions(userId: number) {
    return this.request(`/agents/priority-actions/${userId}`);
  }

  async shouldScan(userId: number, hours = 24) {
    return this.request(`/agents/should-scan/${userId}?hours=${hours}`);
  }

  // ============ AUTH ============

  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, fullName: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  }

  async logout() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
