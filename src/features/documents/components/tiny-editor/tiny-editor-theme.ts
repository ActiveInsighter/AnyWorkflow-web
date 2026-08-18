import type { Editor as TinyMCEEditor } from "tinymce";

export type TinyEditorTheme = "dark" | "light";

const EDITOR_TOKEN_NAMES = [
  "--background",
  "--foreground",
  "--card",
  "--border",
  "--border-strong",
  "--primary",
  "--muted-foreground",
  "--surface-hover",
  "--surface-active",
  "--ring",
  "--font-family-sans",
  "--font-family-mono",
  "--font-size-body-sm",
  "--font-line-height-body",
  "--component-radius-control",
  "--primitive-space-2",
  "--primitive-space-3",
  "--primitive-space-4",
  "--primitive-space-5",
  "--primitive-space-6",
] as const;

const EDITOR_CONTENT_RULES = `
  html {
    min-height: 100%;
    background: var(--card);
  }

  body {
    min-height: 15rem;
    margin: 0;
    padding: var(--primitive-space-5) var(--primitive-space-6) calc(var(--primitive-space-6) * 1.5);
    background: var(--card);
    color: var(--foreground);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-body-sm);
    line-height: var(--font-line-height-body);
    overflow-wrap: break-word;
  }

  body[data-color-scheme="dark"] {
    color-scheme: dark;
  }

  body[data-color-scheme="light"] {
    color-scheme: light;
  }

  ::selection {
    background: var(--surface-active);
  }

  p {
    margin: 0 0 0.9em;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1.35em 0 0.55em;
    color: var(--foreground);
    font-weight: 600;
    line-height: 1.3;
  }

  h1:first-child, h2:first-child, h3:first-child {
    margin-top: 0;
  }

  a {
    color: var(--primary);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.15em;
  }

  blockquote {
    margin: var(--primitive-space-4) 0;
    border-inline-start: 2px solid var(--border-strong);
    padding-inline-start: var(--primitive-space-4);
    color: var(--muted-foreground);
  }

  ul, ol {
    padding-inline-start: 1.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid var(--border);
    padding: var(--primitive-space-2) var(--primitive-space-3);
    text-align: start;
  }

  th {
    background: var(--surface-hover);
    font-weight: 600;
  }

  img, video {
    max-width: 100%;
    height: auto;
  }

  code, pre {
    font-family: var(--font-family-mono);
  }

  code:not(pre code) {
    border-radius: var(--component-radius-control);
    background: var(--surface-hover);
    padding: 0.12em 0.32em;
  }

  pre {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: var(--component-radius-control);
    background: var(--background);
    padding: var(--primitive-space-4);
  }
`;

function getTokenSource(source?: Element) {
  if (source) return source;
  return typeof document === "undefined" ? null : document.documentElement;
}

export function resolveTinyEditorTheme(source?: Element): TinyEditorTheme {
  const tokenSource = getTokenSource(source);

  if (!tokenSource) return "light";

  const colorScheme = getComputedStyle(tokenSource).colorScheme;
  return tokenSource.closest(".dark") || colorScheme.includes("dark") ? "dark" : "light";
}

export function createTinyEditorContentStyle(source?: Element) {
  const tokenSource = getTokenSource(source);

  if (!tokenSource) return EDITOR_CONTENT_RULES;

  const sourceStyles = getComputedStyle(tokenSource);
  const tokenDeclarations = EDITOR_TOKEN_NAMES.flatMap((tokenName) => {
    const value = sourceStyles.getPropertyValue(tokenName).trim();
    return value ? [`    ${tokenName}: ${value};`] : [];
  }).join("\n");

  return `
  :root {
${tokenDeclarations}
  }
${EDITOR_CONTENT_RULES}`;
}

export function syncTinyEditorTheme(editor: TinyMCEEditor, source?: Element) {
  const tokenSource = getTokenSource(source);

  if (!tokenSource) return;

  const sourceStyles = getComputedStyle(tokenSource);
  const contentRoot = editor.getDoc().documentElement;
  const contentBody = editor.getBody();
  const theme = resolveTinyEditorTheme(tokenSource);

  EDITOR_TOKEN_NAMES.forEach((tokenName) => {
    const value = sourceStyles.getPropertyValue(tokenName).trim();
    if (value) contentRoot.style.setProperty(tokenName, value);
  });

  contentRoot.style.colorScheme = theme;
  contentBody?.setAttribute("data-color-scheme", theme);
}
