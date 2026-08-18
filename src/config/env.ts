import { z } from "zod";

const LOCAL_POCKETBASE_URL = "http://127.0.0.1:8090";

const envSchema = z.object({
  VITE_POCKETBASE_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse({
  VITE_POCKETBASE_URL: import.meta.env.VITE_POCKETBASE_URL?.trim() || undefined,
});

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid application environment: ${issues}`);
}

const pocketbaseUrl =
  parsedEnv.data.VITE_POCKETBASE_URL ?? (import.meta.env.DEV ? LOCAL_POCKETBASE_URL : undefined);

if (!pocketbaseUrl) {
  throw new Error("VITE_POCKETBASE_URL is required in production builds.");
}

export const env = {
  pocketbaseUrl,
} as const;
