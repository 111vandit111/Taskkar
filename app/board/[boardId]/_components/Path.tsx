import { getSvgFromStrokes } from "@/lib/utils";
import getStroke from "perfect-freehand";

interface Props {
    x : number;
    y : number;
    points : number[][];
    fill : string;
    onPointerDown?: (e: React.PointerEvent) => void;
    selectionColor?: string;
}

export const Path = (props: Props) => {
    const { x, y, points, fill, onPointerDown, selectionColor } = props;
    return <path 
    onPointerDown={onPointerDown}
    d={getSvgFromStrokes(
        getStroke( points , {
            size : 16, thinning : 0.5, smoothing : 0.5, streamline : 0.5
        })
    )}
    style={{ transform: `translate(${x}px, ${y}px)` }}
    x = {0}
    y = {0}
    fill = {fill}
    stroke = {selectionColor || "#889900"}
    strokeWidth = {1}
    />
}