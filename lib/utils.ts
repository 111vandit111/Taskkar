import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = [
  "#845EC2",
  "#D65DB1",
  "#FF6F91",
  "#FF9671",
  "#FFC75F",
  "#F9F871",
  "#E0C640",
  "#FFC4AB",
  "#FFC4AB",
  "#FB8D76",
  "#BE5845",
  "#E0C640",
  "#FFD8A9",
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionToColor(connection: number) : string {
  return COLORS[connection % COLORS.length]
}
