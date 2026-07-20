import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatThousands(value: string) {
  return value ? Number(value).toLocaleString("id-ID") : "";
}
