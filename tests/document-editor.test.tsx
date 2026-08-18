import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/documents/components/tiny-editor/tinymce", () => ({}));

vi.mock("@tinymce/tinymce-react", () => ({
  Editor: ({
    init,
    licenseKey,
    onEditorChange,
    value,
  }: {
    init?: {
      content_css?: string;
      content_style?: string;
      menubar?: boolean;
      min_height?: number;
      plugins?: unknown;
      skin?: string;
      toolbar?: string;
      ui_mode?: string;
    };
    licenseKey?: string;
    onEditorChange?: (value: string, editor: never) => void;
    value?: string;
  }) => (
    <div
      data-content-style={init?.content_style}
      data-content-css={init?.content_css}
      data-license-key={licenseKey}
      data-menubar={String(init?.menubar)}
      data-min-height={String(init?.min_height)}
      data-plugins={String(init?.plugins)}
      data-skin={init?.skin}
      data-toolbar={init?.toolbar}
      data-ui-mode={init?.ui_mode}
      data-testid="tinymce-editor"
    >
      <textarea
        aria-label="文档内容"
        value={value}
        onChange={(event) => onEditorChange?.(event.target.value, {} as never)}
      />
    </div>
  ),
}));

import { App } from "@/app/App";
import { DocumentEditorPage } from "@/pages/document-editor-page";

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove("dark");
  document.documentElement.style.removeProperty("--background");
});

describe("DocumentEditorPage", () => {
  it("lazy-loads the feature-scoped TinyMCE editor for a document route", async () => {
    render(
      <MemoryRouter initialEntries={["/documents/brief"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "文档编辑器" })).toBeInTheDocument();

    const editor = screen.getByTestId("tinymce-editor");
    expect(editor).toHaveAttribute("data-license-key", "gpl");
    expect(editor).toHaveAttribute("data-menubar", "false");
    expect(editor).toHaveAttribute("data-ui-mode", "split");
    expect(editor).toHaveAttribute("data-min-height", "265");
    expect(editor).toHaveAttribute("data-plugins", expect.stringContaining("autoresize"));
    expect(editor).toHaveAttribute("data-plugins", expect.stringContaining("codesample"));
    expect(editor).toHaveAttribute("data-toolbar", expect.stringContaining("direction"));
    expect(document.querySelector(".anyworkflow-tiny-editor")).toBeInTheDocument();
    expect(editor).toHaveAttribute("data-content-style", expect.stringContaining("var(--foreground)"));
    expect(screen.queryByText("内容区域占位")).not.toBeInTheDocument();
  });

  it("keeps editor content in page-local state and saves the draft", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DocumentEditorPage />
      </MemoryRouter>,
    );

    const editor = screen.getByRole("textbox", { name: "文档内容" });
    expect((editor as HTMLTextAreaElement).value).toContain("开始记录这个工作流");
    expect(screen.getByRole("button", { name: "保存草稿" })).toBeDisabled();

    await user.clear(editor);
    await user.type(editor, "新的工作流说明");

    expect(screen.getByText("有未保存修改")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存草稿" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "保存草稿" }));

    expect(screen.getByText("草稿已保存")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存草稿" })).toBeDisabled();
  });

  it("uses one oxide skin while serializing the active app theme into the editor iframe", () => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.setProperty("--background", "rgb(18, 20, 19)");

    render(
      <MemoryRouter>
        <DocumentEditorPage />
      </MemoryRouter>,
    );

    const editor = screen.getByTestId("tinymce-editor");

    expect(editor).toHaveAttribute("data-skin", "oxide");
    expect(editor).toHaveAttribute("data-content-css", "default");
    expect(editor).toHaveAttribute(
      "data-content-style",
      expect.stringContaining("--background: rgb(18, 20, 19)"),
    );
  });
});
