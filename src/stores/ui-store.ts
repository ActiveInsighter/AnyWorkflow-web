import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SidebarBehavior = "expanded" | "collapsed" | "expand-on-hover";

interface UiState {
  sidebarBehavior: SidebarBehavior;
  mobileNavigationOpen: boolean;
  workspaceName: string;
  setSidebarBehavior: (behavior: SidebarBehavior) => void;
  setMobileNavigationOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarBehavior: "expand-on-hover",
      mobileNavigationOpen: false,
      workspaceName: "My Workflow",
      setSidebarBehavior: (sidebarBehavior) => set({ sidebarBehavior }),
      setMobileNavigationOpen: (mobileNavigationOpen) => set({ mobileNavigationOpen }),
      toggleSidebar: () =>
        set((state) => ({
          sidebarBehavior: state.sidebarBehavior === "collapsed" ? "expanded" : "collapsed",
        })),
    }),
    {
      name: "anyworkflow-ui",
      version: 1,
      migrate: (persistedState) => {
        const previousState = persistedState as Partial<
          Pick<UiState, "sidebarBehavior" | "workspaceName">
        >;

        return {
          sidebarBehavior: "expand-on-hover" as SidebarBehavior,
          workspaceName: previousState.workspaceName ?? "My Workflow",
        };
      },
      partialize: (state) => ({ sidebarBehavior: state.sidebarBehavior, workspaceName: state.workspaceName }),
    },
  ),
);
