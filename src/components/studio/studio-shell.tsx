import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUiStore } from "@/stores/ui-store";

import { StudioSidebar } from "./studio-sidebar";

export function StudioShell({ children }: { children: ReactNode }) {
  const mobileNavigationOpen = useUiStore((state) => state.mobileNavigationOpen);
  const setMobileNavigationOpen = useUiStore((state) => state.setMobileNavigationOpen);

  return (
    <div
      className="studio-shell flex h-svh w-full overflow-hidden"
    >
      <a href="#main" className="sr-only z-[100] rounded-md bg-card px-3 py-2 text-sm text-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:ring-2 focus:ring-ring">
        跳转到主要内容
      </a>
      <div className="hidden min-h-0 md:flex">
        <StudioSidebar />
      </div>
      <main id="main" className="studio-flow-canvas relative min-w-0 flex-1 overflow-y-auto">
        <Button
          variant="outline"
          size="icon"
          aria-label="打开导航"
          className="absolute left-3 top-3 z-20 md:hidden"
          onClick={() => setMobileNavigationOpen(true)}
        >
          <Menu className="size-[18px]" />
        </Button>
        {children}
      </main>

      <Sheet open={mobileNavigationOpen} onOpenChange={setMobileNavigationOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(92vw,23rem)] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>导航</SheetTitle>
            <SheetDescription>主导航菜单。</SheetDescription>
          </SheetHeader>
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-sidebar-border px-3">
              <span className="text-sm font-medium text-sidebar-foreground">导航</span>
              <SheetClose
                render={
                  <button
                    type="button"
                    aria-label="关闭导航"
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  />
                }
              >
                <X className="size-[18px]" />
              </SheetClose>
            </div>
            <StudioSidebar
              mobile
              forceExpanded
              onNavigate={() => setMobileNavigationOpen(false)}
              className="min-h-0 flex-1"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
