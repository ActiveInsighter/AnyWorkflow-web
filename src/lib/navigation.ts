import type { NavigationItem } from "@/types/navigation";

export function matchesNavigationItem(item: NavigationItem, pathname: string): boolean {
  const href = item.href;
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
