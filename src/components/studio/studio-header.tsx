import { ChevronDown, GitBranch, Menu, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";

const pageNames: Record<string, string> = {
  "/": "总览",
  "/workflows": "工作流",
  "/tasks": "任务",
  "/events": "事件",
  "/acts": "Act",
  "/documents": "富文本文件",
  "/settings": "设置",
};

export function StudioHeader() {
  const location = useLocation();
  const setMobileNavigationOpen = useUiStore((state) => state.setMobileNavigationOpen);
  const currentPage = pageNames[location.pathname] ?? (location.pathname.startsWith("/documents/") ? "文档编辑" : "工作台");

  return (
    <header className="flex h-header shrink-0 items-center border-b border-border bg-card px-0">
      <Button
        variant="ghost"
        size="icon"
        aria-label="打开导航"
        className="mr-1 md:hidden"
        onClick={() => setMobileNavigationOpen(true)}
      >
        <Menu className="size-[18px]" />
      </Button>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 items-center gap-1">
          <button type="button" aria-label="返回工作区首页" className="flex size-8 shrink-0 items-center justify-center rounded-control text-primary hover:bg-surface-hover">
            <Sparkles className="size-[18px]" strokeWidth={2.3} />
          </button>
          <button type="button" className="hidden h-control-sm min-w-0 items-center gap-2 rounded-control px-2 text-left text-sm hover:bg-surface-hover md:flex">
            <span className="truncate text-muted-foreground">我的工作区</span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
          <span className="px-1 text-muted-foreground">/</span>
          <button type="button" className="flex h-control-sm min-w-0 items-center gap-2 rounded-control px-2 text-left text-sm hover:bg-surface-hover">
            <span className="truncate font-medium text-foreground">My Workflow</span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
          <button type="button" className="hidden h-control-sm items-center gap-2 rounded-control border border-border px-2 text-xs text-muted-foreground hover:bg-surface-hover sm:flex">
            <GitBranch className="size-3.5" />
            <span className="text-foreground">main</span>
            <span className="rounded bg-surface-active px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">开发</span>
          </button>
          <div className="hidden min-w-0 items-center gap-1 text-sm text-muted-foreground lg:flex">
            <span className="text-border-strong">/</span>
            <span className="truncate font-medium text-foreground">{currentPage}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="hidden text-xs text-muted-foreground sm:inline">PocketBase 未连接</span>
          <span className="size-2 rounded-full bg-amber-400" aria-label="PocketBase 未连接" />
        </div>
      </div>
    </header>
  );
}
