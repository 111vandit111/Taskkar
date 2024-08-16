import { Skeleton } from "@/components/ui/skeleton";
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo,
  Square,
  Sticker,
  Type,
  Undo,
} from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
export const Toolbar = ({
  canvasState,
  setCanvasState,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  const icon = "cursor-pointer";
  const isMobile = useMediaQuery("(max-width: 500px)");
  return (
    <div className={cn("absolute py-3 px-4 w-fit bottom-5 right-[50%] transform translate-x-[50%] bg-white shadow-lg rounded-lg flex gap-3 items-center" , isMobile && "flex-col bottom-2 translate-x-0 right-[100%] left-3")}>
      <ToolbarButton
        icon={Pencil}
        onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
        label="Edit"
        isActive={canvasState.mode === CanvasMode.Pencil}
      />

      <ToolbarButton
        icon={MousePointer2}
        onClick={() => setCanvasState({ mode: CanvasMode.None })}
        label="Select"
        isActive={
          canvasState.mode === CanvasMode.None ||
          canvasState.mode === CanvasMode.Translating ||
          canvasState.mode === CanvasMode.SelectionNet ||
          canvasState.mode === CanvasMode.Pressing ||
          canvasState.mode === CanvasMode.Resizing
        }
      />

      <ToolbarButton
        icon={Type}
        onClick={() => setCanvasState({ mode: CanvasMode.Inserting , layerType:LayerType.Text})}
        label="Text"
        isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
      />

      <ToolbarButton
        icon={Sticker}
        onClick={() => setCanvasState({ mode: CanvasMode.Inserting , layerType:LayerType.Note})}
        label="Sticky Note"
        isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
      />

      <ToolbarButton
        icon={Square}
        onClick={() => setCanvasState({ mode: CanvasMode.Inserting , layerType:LayerType.Rectangle})}
        label="Rectangle"
        isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle}
      />

      <ToolbarButton
        icon={Circle}
        onClick={() => setCanvasState({ mode: CanvasMode.Inserting , layerType:LayerType.Ellipse})}
        label="Circle"
        isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
      />

      <ToolbarButton
        icon={Undo}
        onClick={onUndo}
        label="Undo"
        isActive={false}
        isDisabled={canUndo}
      />

      <ToolbarButton
        icon={Redo}
        onClick={onRedo}
        label="Redo"
        isActive={false}
        isDisabled={canRedo}
      />
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute py-1 px-2 bottom-5 right-[50%] transform translate-x-[50%] bg-white shadow-lg rounded-lg flex gap-3">
      <Skeleton className="w-9 h-9 bg-slate-300" />
      <Skeleton className="w-9 h-9 bg-slate-300" />
      <Skeleton className="w-9 h-9 bg-slate-300" />
      <Skeleton className="w-9 h-9 bg-slate-300" />
      <Skeleton className="w-9 h-9 bg-slate-300" />
      <Skeleton className="w-9 h-9 bg-slate-300" />
    </div>
  );
};
