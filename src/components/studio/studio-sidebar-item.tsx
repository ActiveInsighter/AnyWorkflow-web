import { Link } from "react-router-dom";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

interface StudioSidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
  onNavigate?: () => void;
}

export function StudioSidebarItem({ item, isActive, onNavigate }: StudioSidebarItemProps) {
  const Icon = item.icon;

  const contents = (
    <>
      <span
        data-testid="sidebar-icon-slot"
        className="flex size-5 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {Icon ? (
          <Icon className="size-[17px]" strokeWidth={1.5} />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </span>
      <span className="min-w-0 max-w-[14rem] truncate whitespace-nowrap text-[14.625px] leading-[20.9px] transition-[max-width,opacity] duration-100 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
        {item.title}
      </span>
      {item.badge !== undefined ? (
        <span className="ml-auto shrink-0 rounded bg-surface-active px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary transition-opacity duration-100 group-data-[collapsible=icon]:opacity-0">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  const target = !item.disabled ? (
    <Link
      to={item.href}
      aria-label={item.title}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      {contents}
    </Link>
  ) : (
    <button type="button" disabled aria-current={isActive ? "page" : undefined}>
      {contents}
    </button>
  );

  return (
    <SidebarMenuButton
      render={target}
      isActive={isActive}
      disabled={item.disabled}
      tooltip={item.title}
      className={cn(
        "h-control-sm rounded-control px-1.5 py-2 text-[14.625px] leading-[20.9px] text-muted-foreground",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "data-active:!bg-surface-active data-active:!font-normal data-active:!text-sidebar-foreground",
        "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!",
        item.disabled && "opacity-45",
      )}
    />
  );
}
