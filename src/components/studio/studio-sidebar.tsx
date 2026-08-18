import * as React from "react";
import { useLocation } from "react-router-dom";

import {
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { studioNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

import { StudioSidebarFooter } from "./studio-sidebar-footer";
import { StudioSidebarGroup } from "./studio-sidebar-group";

interface StudioSidebarProps {
  mobile?: boolean;
  forceExpanded?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function StudioSidebar({
  mobile = false,
  forceExpanded = false,
  onNavigate,
  className,
}: StudioSidebarProps) {
  const { pathname } = useLocation();
  const behavior = useUiStore((state) => state.sidebarBehavior);
  const setBehavior = useUiStore((state) => state.setSidebarBehavior);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    if (behavior !== "expand-on-hover") setIsHovering(false);
  }, [behavior]);

  const expanded =
    mobile ||
    forceExpanded ||
    behavior === "expanded" ||
    (behavior === "expand-on-hover" && isHovering);
  const reservedWidth = mobile
    ? "100%"
    : behavior === "expand-on-hover"
      ? "var(--layout-sidebar-width-collapsed)"
      : expanded
        ? "var(--layout-sidebar-width)"
        : "var(--layout-sidebar-width-collapsed)";

  return (
    <TooltipProvider delay={expanded ? 700 : 0}>
      <div
        data-sidebar-reserved-width={mobile ? "expanded" : behavior}
        className={cn("relative h-full shrink-0", mobile && "w-full", !mobile && "z-30", className)}
        style={{ width: reservedWidth }}
      >
        <SidebarProvider
          open={expanded}
          onOpenChange={(open) => {
            if (mobile || forceExpanded) return;
            setBehavior(open ? "expanded" : "collapsed");
          }}
          className="h-full min-h-0 w-full"
          style={
            {
              "--sidebar-width": "var(--layout-sidebar-width)",
              "--sidebar-width-icon": "var(--layout-sidebar-width-collapsed)",
              height: "100%",
              minHeight: 0,
            } as React.CSSProperties
          }
        >
          <aside
            aria-label="Studio sidebar"
            data-behavior={mobile ? "expanded" : behavior}
            data-state={expanded ? "expanded" : "collapsed"}
            data-collapsible={expanded ? undefined : "icon"}
            data-variant="sidebar"
            data-side="left"
            className={cn(
              "group relative flex h-full flex-col overflow-visible border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,box-shadow] duration-100 ease-linear",
              mobile ? "w-full" : "absolute inset-y-0 left-0",
              !mobile &&
                expanded &&
                behavior === "expand-on-hover" &&
                "shadow-md",
            )}
            style={{
              width: mobile
                ? "100%"
                : expanded
                  ? "var(--layout-sidebar-width)"
                  : "var(--layout-sidebar-width-collapsed)",
            }}
            onPointerEnter={() => {
              if (!mobile && behavior === "expand-on-hover") setIsHovering(true);
            }}
            onPointerLeave={() => {
              if (!mobile && behavior === "expand-on-hover") setIsHovering(false);
            }}
          >
            <SidebarContent
              role="navigation"
              aria-label="Primary navigation"
              className="gap-0 overflow-y-auto overflow-x-hidden py-0"
            >
              {studioNavigation.map((group, index) => (
                <React.Fragment key={group.id}>
                  {index > 0 ? (
                    <div
                      className="mx-2 h-px shrink-0 bg-sidebar-border"
                      aria-hidden="true"
                    />
                  ) : null}
                  <StudioSidebarGroup group={group} pathname={pathname} onNavigate={onNavigate} />
                </React.Fragment>
              ))}
            </SidebarContent>

            {!mobile ? (
              <SidebarFooter className="shrink-0 gap-0 p-2">
                <StudioSidebarFooter
                  behavior={behavior}
                  isExpanded={expanded}
                  setBehavior={setBehavior}
                />
              </SidebarFooter>
            ) : null}
          </aside>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
