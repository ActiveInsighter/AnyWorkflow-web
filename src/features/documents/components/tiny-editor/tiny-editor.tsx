import { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

import "./tinymce";
import "./tiny-editor.css";
import { createTinyEditorContentStyle, syncTinyEditorTheme } from "./tiny-editor-theme";

const EDITOR_PLUGINS = [
  "autolink",
  "autoresize",
  "code",
  "codesample",
  "directionality",
  "fullscreen",
  "image",
  "link",
  "lists",
  "media",
  "table",
  "wordcount",
];

const EDITOR_TOOLBAR =
  "styles | alignleft aligncenter alignright | bold italic forecolor backcolor | " +
  "bullist numlist | link image media table codesample direction | code fullscreen";

const CODE_SAMPLE_LANGUAGES = [
  { text: "HTML/XML", value: "markup" },
  { text: "CSS", value: "css" },
  { text: "SQL", value: "sql" },
  { text: "JavaScript", value: "javascript" },
  { text: "TypeScript", value: "typescript" },
  { text: "Go", value: "go" },
  { text: "Rust", value: "rust" },
  { text: "Python", value: "python" },
  { text: "Java", value: "java" },
  { text: "C", value: "c" },
  { text: "C#", value: "csharp" },
  { text: "C++", value: "cpp" },
  { text: "Markdown", value: "markdown" },
];

const ALLOWED_PASTE_NODES = new Set([
  "DIV",
  "P",
  "A",
  "EM",
  "B",
  "STRONG",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "TABLE",
  "TR",
  "TD",
  "TH",
  "TBODY",
  "THEAD",
  "TFOOT",
  "BR",
  "HR",
  "Q",
  "BLOCKQUOTE",
  "PRE",
  "SUP",
  "SUB",
  "DEL",
  "IMG",
  "OL",
  "UL",
  "LI",
  "CODE",
]);

const DIRECTION_STORAGE_KEY = "anyworkflow-tinymce-direction";

interface TinyEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSaveShortcut?: () => void;
  disabled?: boolean;
}

function cleanupPastedNode(node: Element | null) {
  if (!node) return;

  Array.from(node.children).forEach((child) => cleanupPastedNode(child));

  if (!ALLOWED_PASTE_NODES.has(node.tagName)) {
    const parent = node.parentNode;
    if (!parent) return;

    while (node.firstChild) parent.insertBefore(node.firstChild, node);
    parent.removeChild(node);
    return;
  }

  Array.from(node.attributes).forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    if (name === "style" || name === "class" || name.startsWith("on")) {
      node.removeAttribute(attribute.name);
    }
  });
}

function registerDirectionButton(editor: TinyMCEEditor) {
  editor.on("init", () => {
    const lastDirection = window.localStorage.getItem(DIRECTION_STORAGE_KEY);
    if (!editor.isDirty() && editor.getContent() === "" && lastDirection === "rtl") {
      editor.execCommand("mceDirectionRTL");
    }
  });

  editor.ui.registry.addMenuButton("direction", {
    icon: "visualchars",
    tooltip: "文字方向",
    fetch: (callback) => {
      callback([
        {
          type: "menuitem",
          text: "从左到右",
          icon: "ltr",
          onAction: () => {
            window.localStorage.setItem(DIRECTION_STORAGE_KEY, "ltr");
            editor.execCommand("mceDirectionLTR");
          },
        },
        {
          type: "menuitem",
          text: "从右到左",
          icon: "rtl",
          onAction: () => {
            window.localStorage.setItem(DIRECTION_STORAGE_KEY, "rtl");
            editor.execCommand("mceDirectionRTL");
          },
        },
      ]);
    },
  });
}

function openInlineImagePicker(
  editor: TinyMCEEditor,
  callback: (url: string, meta?: { title?: string; alt?: string }) => void,
) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.addEventListener(
    "change",
    () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          if (typeof reader.result !== "string") return;

          const base64 = reader.result.split(",")[1];
          if (!base64) return;

          const id = `blobid-${Date.now()}`;
          const blobCache = editor.editorUpload.blobCache;
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          callback(blobInfo.blobUri(), { title: file.name, alt: file.name });
        },
        { once: true },
      );
      reader.readAsDataURL(file);
    },
    { once: true },
  );

  input.click();
}

export function TinyEditor({ value, onChange, onSaveShortcut, disabled = false }: TinyEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const saveShortcutRef = useRef(onSaveShortcut);
  saveShortcutRef.current = onSaveShortcut;

  useEffect(() => {
    const syncTheme = () => {
      const editor = editorRef.current;
      if (editor) syncTinyEditorTheme(editor, containerRef.current ?? undefined);
    };

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-color-scheme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="anyworkflow-tiny-editor">
      <label className="sr-only" htmlFor="document-body-editor">
        文档内容
      </label>
      <Editor
        id="document-body-editor"
        licenseKey="gpl"
        value={value}
        onEditorChange={onChange}
        rollback={false}
        disabled={disabled}
        init={{
          min_height: 265,
          height: 320,
          max_height: 720,
          menubar: false,
          resize: false,
          ui_mode: "split",
          plugins: EDITOR_PLUGINS,
          toolbar: EDITOR_TOOLBAR,
          branding: false,
          promotion: false,
          statusbar: true,
          elementpath: false,
          skin: "oxide",
          content_css: "default",
          content_style: createTinyEditorContentStyle(containerRef.current ?? undefined),
          autoresize_bottom_margin: 24,
          sandbox_iframes: true,
          convert_unsafe_embeds: true,
          convert_urls: false,
          relative_urls: false,
          media_poster: false,
          media_alt_source: false,
          codesample_languages: CODE_SAMPLE_LANGUAGES,
          file_picker_types: "image",
          file_picker_callback: (callback) => {
            const editor = editorRef.current;
            if (editor) openInlineImagePicker(editor, callback);
          },
          paste_postprocess: (_editor, args) => cleanupPastedNode(args.node),
          setup: (editor) => {
            editorRef.current = editor;
            registerDirectionButton(editor);

            editor.on("init", () => {
              syncTinyEditorTheme(editor, containerRef.current ?? undefined);
            });

            editor.on("keydown", (event) => {
              if ((event.ctrlKey || event.metaKey) && event.code === "KeyS") {
                event.preventDefault();
                event.stopPropagation();
                saveShortcutRef.current?.();
              }
            });
          },
        }}
      />
    </div>
  );
}
