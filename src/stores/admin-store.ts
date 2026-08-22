import { create } from "zustand";
import type { SiteData } from "@/types/cms";

interface AdminStore {
  data: SiteData | null;
  setData: (data: SiteData) => void;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  toast: { message: string; type: "success" | "error" } | null;
  showToast: (message: string, type?: "success" | "error") => void;
  clearToast: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  isSaving: false,
  setIsSaving: (isSaving) => set({ isSaving }),
  toast: null,
  showToast: (message, type = "success") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
