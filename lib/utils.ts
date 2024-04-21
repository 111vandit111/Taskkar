import { Camera } from "@/types/canvas"
import { type ClassValue, clsx } from "clsx"
import React from "react"
import { twMerge } from "tailwind-merge"

const COLORS = [
  "#7755ad",
  "#D65DB1",
  "#FF6F91",
  "#ff7a4a",
  "#5cbd1f",
  "#a75a13",
  "#e04083",
  "#6418b0",
  "#781111",
  "#FB8D76",
  "#BE5845",
  "#E0C640",
  "#179683",
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionToColor(connection: number) : string {
  return COLORS[connection % COLORS.length]
}

export function pointerEventToCamera(e:React.PointerEvent , camera:Camera){
  return {
    x : Math.round(e.clientX) - camera.x,
    y : Math.round(e.clientY) - camera.y
  }
}

