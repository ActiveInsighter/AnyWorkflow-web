import { useState } from "react";
import { FileText, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/page-frame";
import { TinyEditor } from "@/features/documents/components/tiny-editor/tiny-editor";

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
        <Button onClick={saveDraft} disabled={!isDirty}>
          <Save data-icon="inline-start" />
          保存草稿
        </Button>
      }
    >
      <section aria-label="文档编辑器" className="mx-auto w-full max-w-4xl">
        <div className="mb-3 flex min-h-control-sm flex-wrap items-center gap-2 border-b border-border pb-3">
          <FileText className="size-icon-sm text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Untitled workflow brief</span>
          <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">
            {isDirty ? "有未保存修改" : "草稿已保存"}
          </span>
        </div>

        <TinyEditor value={draft} onChange={setDraft} onSaveShortcut={saveDraft} />

        <p className="mt-2 text-xs text-muted-foreground">
          支持 Ctrl/⌘ + S 保存；后续接入 PocketBase 后可将这里的草稿状态替换为真实持久化状态。
        </p>
      </section>
    </PageFrame>
  );
}
