import { useState } from "react";
import { FileText, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TinyEditor } from "@/components/editor/tiny-editor";
import { PageFrame } from "@/components/page-frame";

const DEFAULT_DOCUMENT = `
  <h2>开始记录这个工作流</h2>
  <p>这是一个轻量的富文本编辑器。你可以在这里编写说明、运行手册和团队协作记录。</p>
  <p>先把骨架搭好，再逐步接入文档块、附件和版本历史。</p>
`;

export function DocumentEditorPage() {
  const [draft, setDraft] = useState(DEFAULT_DOCUMENT);
  const [savedDraft, setSavedDraft] = useState(DEFAULT_DOCUMENT);
  const isDirty = draft !== savedDraft;

  const saveDraft = () => {
    setSavedDraft(draft);
  };

  return (
    <PageFrame
      eyebrow="Rich text file"
      title="文档编辑器"
      description="使用 TinyMCE 8 编写运行手册、流程说明和团队协作记录。"
      actions={
        <Button onClick={saveDraft}>
          <Save data-icon="inline-start" />
          保存草稿
        </Button>
      }
    >
      <section aria-label="文档编辑器" className="overflow-hidden border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <FileText className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Untitled workflow brief</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {isDirty ? "有未保存修改" : "草稿已保存"}
          </span>
        </div>
        <div className="min-h-[360px] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <TinyEditor value={draft} onChange={setDraft} />
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
