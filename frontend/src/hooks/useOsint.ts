/**
 * Hook customizado para operações OSINT
 */

import { useState } from "react";
import { apiClient } from "@/lib/api";

export function useOsint(userId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanItem = async (itemId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.triggerScan(userId, itemId);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const autoScanAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.triggerAutoScan(userId);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRiskAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getRiskAnalysis(userId);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getRecommendations(userId);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPriorityActions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPriorityActions(userId);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    scanItem,
    autoScanAll,
    getRiskAnalysis,
    getRecommendations,
    getPriorityActions,
  };
}
