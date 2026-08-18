import { useNavigate } from "react-router-dom";

import { PageFrame } from "@/components/page-frame";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageFrame
      eyebrow="404"
      title="页面不存在"
      description="这个路由还没有加入工作台。"
      actions={
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      }
    >
      <div className="border-border-strong bg-card p-12 text-center text-sm text-muted-foreground">
        请从左侧导航选择一个模块。
      </div>
    </PageFrame>
  );
}
