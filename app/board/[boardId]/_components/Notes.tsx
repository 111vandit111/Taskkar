import { cn, colorToCss, getContrastColor } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";
import { NoteLayer, TextLayer } from "@/types/canvas";
import { Raleway } from "next/font/google";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable"

const raleway = Raleway({ weight: "500", subsets: ["latin"] });

interface NotesProps {
   id : string
   layer: NoteLayer
   onPointerDown: (e: React.PointerEvent, id: string) => void
   selectionColor?: string
}

const calculateFontSize = (width : number , height : number) => {
    const maxFontSize = 96;
    const scaleFactor = 0.15;
    const fontOnHeight = height*scaleFactor;
    const fontOnWidth = width*scaleFactor;
    return Math.min(maxFontSize, fontOnHeight, fontOnWidth);
}

export const Notes = (props: NotesProps) => {
   const { layer, id, onPointerDown, selectionColor } = props;

   const { fill, value, x, y, width, height } = layer;

   const updateValue = useMutation(({storage}, newValue : string) => {
      const textLayer = storage.get("layers");
      textLayer.get(id)?.set("value", newValue); 
   },[]);


   const handleContentChange = (e : ContentEditableEvent) => {
      const newValue = e.target.value;
      updateValue(newValue);
   }

   return (
    <foreignObject
    x={x}
    y={y}
    width={width}
    height={height}
    onPointerDown={(e) => onPointerDown(e, id)}
    style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#abbccd",
    }}
    className="drop-shadow-xl shadow-md rounded-xl"
    >
        <ContentEditable html={value || "Write Note"} onChange={handleContentChange} 
            style={{
                color: fill ? getContrastColor(fill) : "#000",
                fontSize : calculateFontSize(width, height),
            }}
            className={
                cn(
                    "h-full w-full items-center justify-center text-center drop-shadow-md outline-none", raleway.className
                )
            }/>
    </foreignObject>
   )

}