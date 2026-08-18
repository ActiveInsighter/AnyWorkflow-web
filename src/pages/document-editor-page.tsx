import { FileText, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/page-frame";

export function DocumentEditorPage() {
  return (
    <PageFrame
      eyebrow="Rich text file"
      title="文档编辑器"
      description="TinyMCE 8 接入位已预留，后续可将内容存入 PocketBase 文件与集合。"
      actions={<Button><Save data-icon="inline-start" />保存草稿</Button>}
    >
      <section className="overflow-hidden border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <FileText className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Untitled workflow brief</span>
          <span className="ml-auto text-xs text-muted-foreground">自动保存已开启</span>
        </div>
        <div className="min-h-[360px] p-5 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-1 border-b border-border pb-3">
              {['B', 'I', 'U', 'H1', '•', '↗'].map((item) => <button key={item} type="button" className="flex size-8 items-center justify-center rounded text-xs font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground">{item}</button>)}
            </div>
            <h2 className="mt-8 text-xl font-semibold text-foreground">开始记录这个工作流</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">这是一个轻量的富文本编辑器占位。完成 TinyMCE 8 初始化后，可以在这里编写说明、运行手册和团队协作记录。</p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">先把骨架搭好，再逐步接入文档块、附件和版本历史。</p>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
