import * as React from "react";
import { PanelLeftDashed } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarBehavior } from "@/stores/ui-store";

interface StudioSidebarFooterProps {
  behavior: SidebarBehavior;
  isExpanded: boolean;
  setBehavior: (behavior: SidebarBehavior) => void;
}

const sidebarBehaviorOptions: Array<{ label: string; value: SidebarBehavior }> = [
  { label: "展开", value: "expanded" },
  { label: "收起", value: "collapsed" },
  { label: "悬停展开", value: "expand-on-hover" },
];

export function StudioSidebarFooter({ behavior, isExpanded, setBehavior }: StudioSidebarFooterProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="relative flex min-w-0 flex-col">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger
          type="button"
          aria-label="侧栏设置"
          title={!isExpanded ? "侧栏设置" : undefined}
          className="mx-0.5 flex h-[26px] w-[29px] shrink-0 items-center justify-center rounded-control p-0 text-muted-foreground transition-colors duration-100 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
        >
          <PanelLeftDashed className="size-[18px]" strokeWidth={1.5} />
          <span className="sr-only">侧栏设置</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={4}
          className="w-[180px] rounded-popover border border-border-strong bg-popover p-1 text-popover-foreground shadow-md"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
              侧栏设置
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1 bg-border" />
          <DropdownMenuRadioGroup
            value={behavior}
            onValueChange={(value) => {
              if (value === "expanded" || value === "collapsed" || value === "expand-on-hover") {
                setBehavior(value);
                setIsMenuOpen(false);
              }
            }}
          >
            {sidebarBehaviorOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="relative h-control-sm rounded-control py-1 pl-7 pr-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus:outline-none data-checked:before:absolute data-checked:before:left-2 data-checked:before:top-1/2 data-checked:before:size-2 data-checked:before:-translate-y-1/2 data-checked:before:rounded-full data-checked:before:bg-sidebar-foreground [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden"
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
