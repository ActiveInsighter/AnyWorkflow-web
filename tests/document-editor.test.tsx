import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/editor/tinymce", () => ({}));

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
      plugins?: unknown;
      skin?: string;
    };
    licenseKey?: string;
    onEditorChange?: (value: string, editor: never) => void;
    value?: string;
  }) => (
    <div
      data-content-style={init?.content_style}
      data-content-css={init?.content_css}
      data-license-key={licenseKey}
      data-plugins={String(init?.plugins)}
      data-skin={init?.skin}
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
  it("renders the bundled TinyMCE editor for a document route", () => {
    render(
      <MemoryRouter initialEntries={["/documents/brief"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "文档编辑器" })).toBeInTheDocument();
    expect(screen.getByTestId("tinymce-editor")).toHaveAttribute("data-license-key", "gpl");
    expect(screen.getByTestId("tinymce-editor")).toHaveAttribute("data-plugins", expect.stringContaining("lists"));
    expect(document.querySelector(".anyworkflow-tiny-editor")).toBeInTheDocument();
    expect(screen.getByTestId("tinymce-editor")).toHaveAttribute(
      "data-content-style",
      expect.stringContaining("var(--foreground)"),
    );
    expect(screen.queryByText("内容区域占位")).not.toBeInTheDocument();
  });

  it("keeps editor content in page state and saves the draft", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DocumentEditorPage />
      </MemoryRouter>,
    );

    const editor = screen.getByRole("textbox", { name: "文档内容" });
    expect((editor as HTMLTextAreaElement).value).toContain("开始记录这个工作流");

    await user.clear(editor);
    await user.type(editor, "新的工作流说明");

    expect(screen.getByText("有未保存修改")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "保存草稿" }));

    expect(screen.getByText("草稿已保存")).toBeInTheDocument();
  });

  it("uses the dark skin and serializes system tokens into the editor iframe", () => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.setProperty("--background", "rgb(18, 20, 19)");

    render(
      <MemoryRouter>
        <DocumentEditorPage />
      </MemoryRouter>,
    );

    const editor = screen.getByTestId("tinymce-editor");

    expect(editor).toHaveAttribute("data-skin", "oxide-dark");
    expect(editor).toHaveAttribute("data-content-css", "dark");
    expect(editor).toHaveAttribute(
      "data-content-style",
      expect.stringContaining("--background: rgb(18, 20, 19)"),
    );
  });
});
