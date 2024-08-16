import { Camera, Color, Layer, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canvas"
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

export function connectionToColor(connection: number): string {
  return COLORS[connection % COLORS.length]
}

export function pointerEventToCamera(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y
  }
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}${Math.round(color.a * 255).toString(16).padStart(2, '0')}`
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(bounds.x + bounds.width, point.x);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(bounds.x - point.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(bounds.y + bounds.height, point.y);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(bounds.y - point.y);
  }

  return result;
}

export function findIntersectingLayerWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y)
  }

  const ids = []

  for (const id of layerIds) {
    const layer = layers.get(id)

    if (layer == null) continue;

    const { x, y, width, height } = layer;

    if (
      x < rect.x + rect.width &&
      x + width > rect.x &&
      y < rect.y + rect.height &&
      y + height > rect.y
    ) {
      ids.push(id)
    }
  }

  return ids;
}

export function getContrastColor(color: Color) {
  const lunminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;

  return lunminance > 128 ? "black" : "white";
}

export function penPointsToPathLayer(
  points: number[][],
  color: Color
): PathLayer {
  if (points.length < 2) {
    throw new Error("Must have at least two points")
  }

  let left = Number.POSITIVE_INFINITY
  let right = Number.NEGATIVE_INFINITY
  let top = Number.POSITIVE_INFINITY
  let bottom = Number.NEGATIVE_INFINITY

  for (const point of points) {
    const [x, y] = point;
    left = Math.min(left, x)
    right = Math.max(right, x)
    top = Math.min(top, y)
    bottom = Math.max(bottom, y)
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
    type: LayerType.Path
  }
}

export function getSvgFromStrokes(strokes: number[][]) : string | undefined {
  if (!strokes.length) return "";

  const d = strokes.reduce((acc, [x0, y0], i, arr) => {
    const [x1, y1] = arr[(i + 1) % arr.length];
    acc.push(x0, y0, (x1 + x0) / 2, (y1 + y0) / 2);
    return acc;
  },
    [
      "M", ...strokes[0], "Q"
    ])

  d.push("Z");

  return d.join(" ");
}