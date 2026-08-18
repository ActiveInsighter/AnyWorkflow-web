import type { Editor as TinyMCEEditor } from "tinymce";

export type TinyEditorTheme = "dark" | "light";

const EDITOR_TOKEN_NAMES = [
  "--background",
  "--foreground",
  "--card",
  "--border",
  "--primary",
  "--muted-foreground",
  "--surface-hover",
  "--ring",
  "--font-family-sans",
  "--font-family-mono",
  "--font-size-body-sm",
  "--font-line-height-body",
  "--component-radius-card",
  "--component-radius-control",
  "--primitive-space-1",
  "--primitive-space-3",
  "--primitive-space-4",
  "--primitive-space-6",
];

const EDITOR_CONTENT_RULES = `
  html {
    background: var(--background);
  }

  body {
    min-height: calc(100% - 3rem);
    margin: var(--primitive-space-6);
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-body-sm);
    line-height: var(--font-line-height-body);
  }

  a {
    color: var(--primary);
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--foreground);
    font-weight: 600;
    line-height: 1.25;
  }

  blockquote {
    border-inline-start: 2px solid var(--primary);
    margin-inline: 0;
    padding-inline-start: var(--primitive-space-4);
    color: var(--muted-foreground);
  }

  code, pre {
    font-family: var(--font-family-mono);
  }

  code {
    border-radius: var(--component-radius-control);
    background: var(--surface-hover);
    padding: 0.1em 0.3em;
  }
`;

function getTokenSource(source?: Element) {
  if (source) {
    return source;
  }

  return typeof document === "undefined" ? null : document.documentElement;
}

export function resolveTinyEditorTheme(source?: Element): TinyEditorTheme {
  const tokenSource = getTokenSource(source);

  if (!tokenSource) {
    return "light";
  }

  const colorScheme = getComputedStyle(tokenSource).colorScheme;
  return tokenSource.closest(".dark") || colorScheme.includes("dark") ? "dark" : "light";
}

export function createTinyEditorContentStyle(source?: Element) {
  const tokenSource = getTokenSource(source);

  if (!tokenSource) {
    return EDITOR_CONTENT_RULES;
  }

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

export function syncTinyEditorTokens(editor: TinyMCEEditor, source?: Element) {
  const tokenSource = getTokenSource(source);

  if (!tokenSource) {
    return;
  }

  const sourceStyles = getComputedStyle(tokenSource);
  const contentRoot = editor.getDoc().documentElement;

  EDITOR_TOKEN_NAMES.forEach((tokenName) => {
    const value = sourceStyles.getPropertyValue(tokenName).trim();

    if (value) {
      contentRoot.style.setProperty(tokenName, value);
    }
  });

  contentRoot.style.colorScheme = sourceStyles.colorScheme;
}
