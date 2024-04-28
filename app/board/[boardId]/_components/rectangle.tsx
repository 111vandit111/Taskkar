import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
   id:string;
   layer: RectangleLayer;
   onPointerDown: (e: React.PointerEvent, id: string) => void;
   selectionColor?: string;
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  
  console.log(colorToCss(layer.fill))

  return (
    <rect
     className="drop-shadow-md"
      style={{
        transform: `translate(${layer.x}px, ${layer.y}px)`,
      }}
      x={0}
      y={0}
      width={layer.width}
      height={layer.height}
      fill={colorToCss(layer.fill)}
      stroke={selectionColor || "transparent"}
      strokeWidth={1}
      onPointerDown={(e) => onPointerDown(e, id)}
    />
  );
}