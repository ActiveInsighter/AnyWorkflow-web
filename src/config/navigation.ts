import {
  Activity,
  FileText,
  LayoutDashboard,
  ListTodo,
  Settings2,
  Workflow,
  Zap,
} from "lucide-react";

import type { NavigationGroup } from "@/types/navigation";

export const studioNavigation: NavigationGroup[] = [
  {
    id: "workspace",
    items: [
      { id: "overview", title: "总览", href: "/", icon: LayoutDashboard },
      { id: "workflows", title: "工作流", href: "/workflows", icon: Workflow, badge: "12" },
      { id: "tasks", title: "任务", href: "/tasks", icon: ListTodo },
      { id: "events", title: "事件", href: "/events", icon: Activity },
      { id: "acts", title: "Act", href: "/acts", icon: Zap },
    ],
  },
  {
    id: "resources",
    title: "资源",
    items: [
      { id: "documents", title: "富文本文件", href: "/documents", icon: FileText },
      { id: "settings", title: "设置", href: "/settings", icon: Settings2 },
    ],
  },
];
