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
      fill={selectionColor}
      stroke={selectionColor}
      strokeWidth={1}
      onPointerDown={(e) => onPointerDown(e, id)}
    />
  );
}