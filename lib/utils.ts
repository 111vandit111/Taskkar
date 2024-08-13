import { Camera, Color, Point, Side, XYWH } from "@/types/canvas"
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

export function colorToCss(color:Color){
  return `#${color.r.toString(16).padStart(2,'0')}${color.g.toString(16).padStart(2,'0')}${color.b.toString(16).padStart(2,'0')}${Math.round(color.a * 255).toString(16).padStart(2, '0')}`
}

export function resizeBounds(bounds : XYWH , corner : Side , point : Point):XYWH{ 
const result = {
  x : bounds.x,
  y : bounds.y,
  width : bounds.width,
  height : bounds.height
};

if((corner & Side.Left) === Side.Left){
  result.x = Math.min(bounds.x + bounds.width, point.x);
  result.width = Math.abs(bounds.x + bounds.width - point.x);
}

if((corner & Side.Right) === Side.Right){
  result.x = Math.min(point.x, bounds.x);
  result.width = Math.abs(bounds.x - point.x);
}

if((corner & Side.Top) === Side.Top){
  result.y = Math.min(bounds.y + bounds.height, point.y);
  result.height = Math.abs(bounds.y + bounds.height - point.y);
}

if((corner & Side.Bottom) === Side.Bottom){
  result.y = Math.min(point.y, bounds.y);
  result.height = Math.abs(bounds.y - point.y);
}

return result;
}