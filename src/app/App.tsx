import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { PageFrame } from "@/components/page-frame";
import { StudioShell } from "@/components/studio";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/query-client";
import { DashboardPage } from "@/pages/dashboard-page";
import { DocumentEditorPage } from "@/pages/document-editor-page";
import { PlaceholderPage } from "@/pages/placeholder-page";

function NotFoundPage() {
  return (
    <PageFrame eyebrow="404" title="页面不存在" description="这个路由还没有加入工作台。" actions={<Button variant="outline" onClick={() => window.history.back()}>返回上一页</Button>}>
      <div className="border-border-strong bg-card p-12 text-center text-sm text-muted-foreground">请从左侧导航选择一个模块。</div>
    </PageFrame>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudioShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/workflows" element={<PlaceholderPage eyebrow="Automation" title="工作流" description="编排触发器、动作和运行策略，让重复工作自动完成。" entity="工作流" detail="工作流列表会使用 TanStack Table；编辑器会在下一步接入节点画布与 Zod 表单校验。" />} />
          <Route path="/tasks" element={<PlaceholderPage eyebrow="Operations" title="任务" description="跟踪每次运行拆解出的任务、负责人和执行结果。" entity="任务" />} />
          <Route path="/events" element={<PlaceholderPage eyebrow="Observability" title="事件" description="集中查看触发事件、回调和实时运行日志。" entity="事件" detail="超长事件流会使用 TanStack Virtual，PocketBase Realtime 将负责推送更新。" />} />
          <Route path="/acts" element={<PlaceholderPage eyebrow="Actions" title="Act" description="管理可以被工作流调用的动作与外部服务连接。" entity="Act" />} />
          <Route path="/documents" element={<PlaceholderPage eyebrow="Knowledge" title="富文本文件" description="把运行手册、流程说明和团队知识放在工作流旁边。" entity="文件" />} />
          <Route path="/documents/:documentId" element={<DocumentEditorPage />} />
          <Route path="/settings" element={<PlaceholderPage eyebrow="Workspace" title="设置" description="管理 PocketBase、成员权限和工作台偏好。" entity="设置" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </StudioShell>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
