import PocketBase from "pocketbase";

import { env } from "@/config/env";

export const pocketbase = new PocketBase(env.pocketbaseUrl);
