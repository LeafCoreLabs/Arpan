import { create } from 'zustand'

/**
 * Global UI/session bits only. Prefer feature-local state for domain data.
 */
export const useAppStore = create((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: typeof open === 'function' ? open : Boolean(open) }),
  emergencyMode: false,
  setEmergencyMode: (v) =>
    set((s) => ({
      emergencyMode: typeof v === 'function' ? v(s.emergencyMode) : Boolean(v),
    })),
}))
