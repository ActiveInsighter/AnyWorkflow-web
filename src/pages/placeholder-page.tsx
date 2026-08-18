import { PanelTopDashed } from "lucide-react";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  entity: string;
  detail?: string;
}

export function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-full w-full p-4 sm:p-6">
      <section className="studio-flow-grid flex min-h-[420px] flex-1 items-center justify-center border border-dashed border-border-strong bg-canvas p-8 text-center">
        <div className="max-w-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
            <PanelTopDashed className="size-4" />
          </div>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-2 text-lg font-medium text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-5 text-xs text-muted-foreground">内容区域占位</p>
        </div>
      </section>
    </div>
  );
}
