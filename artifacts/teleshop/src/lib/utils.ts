import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: string | number | null | undefined): string {
  if (value == null) return "0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num % 1 === 0 ? num.toFixed(2) : parseFloat(num.toFixed(6)).toString();
}
