import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);
const prefixes = {
  key: "key",
  api: "api",
  policy: "pol",
  request: "req",
  workspace: "ws",
  keyAuth: "key_auth", // <-- this is internal and does not need to be short or pretty
  vercelBinding: "vb",
  test: "test", // <-- for tests only
} as const;

export function generateId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid(16)].join("_");
}
