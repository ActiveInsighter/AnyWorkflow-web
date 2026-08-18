import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import "./tinymce";
import "./tiny-editor.css";
import {
  createTinyEditorContentStyle,
  resolveTinyEditorTheme,
  syncTinyEditorTokens,
} from "./tiny-editor-theme";

const EDITOR_PLUGINS = [
  "advlist",
  "anchor",
  "autolink",
  "charmap",
  "code",
  "fullscreen",
  "help",
  "image",
  "insertdatetime",
  "link",
  "lists",
  "media",
  "preview",
  "searchreplace",
  "table",
  "visualblocks",
  "wordcount",
];

const EDITOR_TOOLBAR =
  "undo redo | blocks | bold italic underline | " +
  "alignleft aligncenter alignright | bullist numlist | " +
  "link image table | code fullscreen";

interface TinyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TinyEditor({ value, onChange }: TinyEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorTheme, setEditorTheme] = useState(() => resolveTinyEditorTheme());

  useEffect(() => {
    const updateTheme = () => {
      setEditorTheme(resolveTinyEditorTheme(containerRef.current ?? undefined));
    };

    updateTheme();

    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => themeObserver.disconnect();
  }, []);

  const handleEditorChange = (nextValue: string) => {
    onChange(nextValue);
  };

  return (
    <div ref={containerRef} className="anyworkflow-tiny-editor">
      <label className="sr-only" htmlFor="document-body-editor">
        文档内容
      </label>
      <Editor
        key={editorTheme}
        id="document-body-editor"
        licenseKey="gpl"
        value={value}
        onEditorChange={handleEditorChange}
        rollback={false}
        init={{
          height: 600,
          menubar: true,
          plugins: EDITOR_PLUGINS,
          toolbar: EDITOR_TOOLBAR,
          branding: false,
          promotion: false,
          statusbar: true,
          elementpath: false,
          skin: editorTheme === "dark" ? "oxide-dark" : "oxide",
          content_css: editorTheme === "dark" ? "dark" : "default",
          content_style: createTinyEditorContentStyle(containerRef.current ?? undefined),
          setup: (editor) => {
            editor.on("init", () => {
              syncTinyEditorTokens(editor, containerRef.current ?? undefined);
            });
          },
        }}
      />
    </div>
  );
}
