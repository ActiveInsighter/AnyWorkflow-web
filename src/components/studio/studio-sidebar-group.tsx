import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { matchesNavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { NavigationGroup } from "@/types/navigation";

import { StudioSidebarItem } from "./studio-sidebar-item";

interface StudioSidebarGroupProps {
  group: NavigationGroup;
  pathname: string;
  onNavigate?: () => void;
}

export function StudioSidebarGroup({ group, pathname, onNavigate }: StudioSidebarGroupProps) {
  return (
    <SidebarGroup className={cn("gap-0.5 px-2 py-[9px]", group.title && "py-2")}>
      {group.title ? (
        <SidebarGroupLabel className="mb-0 truncate px-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {group.title}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {group.items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <StudioSidebarItem
                item={item}
                isActive={matchesNavigationItem(item, pathname)}
                onNavigate={onNavigate}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
