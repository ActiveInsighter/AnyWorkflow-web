import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { StudioShell } from "@/components/studio/studio-shell";
import { paths } from "@/config/paths";
import { DashboardPage } from "@/pages/dashboard-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { PlaceholderPage } from "@/pages/placeholder-page";

const DocumentEditorPage = lazy(async () => {
  const module = await import("@/pages/document-editor-page");
  return { default: module.DocumentEditorPage };
});

function RouteLoading() {
  return (
    <div
      role="status"
      aria-label="正在加载页面"
      className="flex min-h-48 items-center justify-center text-sm text-muted-foreground"
    >
      正在加载…
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<StudioShell />}>
        <Route path={paths.dashboard} element={<DashboardPage />} />
        <Route
          path={paths.workflows}
          element={
            <PlaceholderPage
              eyebrow="Automation"
              title="工作流"
              description="编排触发器、动作和运行策略，让重复工作自动完成。"
              entity="工作流"
              detail="工作流列表会使用 TanStack Table；编辑器会在下一步接入节点画布与 Zod 表单校验。"
            />
          }
        />
        <Route
          path={paths.tasks}
          element={
            <PlaceholderPage
              eyebrow="Operations"
              title="任务"
              description="跟踪每次运行拆解出的任务、负责人和执行结果。"
              entity="任务"
            />
          }
        />
        <Route
          path={paths.events}
          element={
            <PlaceholderPage
              eyebrow="Observability"
              title="事件"
              description="集中查看触发事件、回调和实时运行日志。"
              entity="事件"
              detail="超长事件流会使用 TanStack Virtual，PocketBase Realtime 将负责推送更新。"
            />
          }
        />
        <Route
          path={paths.acts}
          element={
            <PlaceholderPage
              eyebrow="Actions"
              title="Act"
              description="管理可以被工作流调用的动作与外部服务连接。"
              entity="Act"
            />
          }
        />
        <Route
          path={paths.documents.root}
          element={
            <PlaceholderPage
              eyebrow="Knowledge"
              title="富文本文件"
              description="把运行手册、流程说明和团队知识放在工作流旁边。"
              entity="文件"
            />
          }
        />
        <Route
          path={paths.documents.detail}
          element={
            <Suspense fallback={<RouteLoading />}>
              <DocumentEditorPage />
            </Suspense>
          }
        />
        <Route
          path={paths.settings}
          element={
            <PlaceholderPage
              eyebrow="Workspace"
              title="设置"
              description="管理 PocketBase、成员权限和工作台偏好。"
              entity="设置"
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
