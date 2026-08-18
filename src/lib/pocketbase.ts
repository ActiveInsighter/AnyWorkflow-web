import PocketBase from "pocketbase";

export const pocketbase = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL ?? "http://127.0.0.1:8090",
);
