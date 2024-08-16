"use client";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import Ellipse from "./Ellipse";
import { TextBox } from "./textBox";
import { Notes } from "./Notes";
import { Path } from "./Path";
import { colorToCss } from "@/lib/utils";
interface LayerPreviewProps {
  layerId: string;
  onLayerPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}
export const LayerPreview = memo(
  ({ layerId, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(layerId));

    if (!layer) return null;

    switch (layer.type) {
      case LayerType.Note:
        return (
          <Notes
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        )
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
        case LayerType.Ellipse:
          return (
            <Ellipse 
              id={layerId}
              layer={layer}
              onPointerDown={onLayerPointerDown}
              selectionColor={selectionColor}
            />
          )
          case LayerType.Text:
            return (
              <TextBox
                id={layerId}
                layer={layer}
                onPointerDown={onLayerPointerDown}
                selectionColor={selectionColor}
              />)

          case LayerType.Path:
            return (
              <Path key={layerId} points={layer.points} x={layer.x} y={layer.y} fill={layer.fill ? colorToCss(layer.fill) : "#000"} onPointerDown={(e) => onLayerPointerDown(e, layerId)} selectionColor={selectionColor} />
            )

      default: null
    }
  }
);

LayerPreview.displayName = "LayerPreview";
