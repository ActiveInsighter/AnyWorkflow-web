import {
  Activity,
  FileText,
  LayoutDashboard,
  ListTodo,
  Settings2,
  Workflow,
  Zap,
} from "lucide-react";

import { paths } from "@/config/paths";
import type { NavigationGroup } from "@/types/navigation";

export const studioNavigation: NavigationGroup[] = [
  {
    id: "workspace",
    items: [
      { id: "overview", title: "总览", href: paths.dashboard, icon: LayoutDashboard },
      { id: "workflows", title: "工作流", href: paths.workflows, icon: Workflow, badge: "12" },
      { id: "tasks", title: "任务", href: paths.tasks, icon: ListTodo },
      { id: "events", title: "事件", href: paths.events, icon: Activity },
      { id: "acts", title: "Act", href: paths.acts, icon: Zap },
    ],
  },
  {
    id: "resources",
    title: "资源",
    items: [
      { id: "documents", title: "富文本文件", href: paths.documents.root, icon: FileText },
      { id: "settings", title: "设置", href: paths.settings, icon: Settings2 },
    ],
  },
];
