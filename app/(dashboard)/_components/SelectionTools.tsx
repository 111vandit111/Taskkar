"use client";

import { useSelectionBounds } from "@/hooks/use-selection-hook";
import { useMutation, useSelf, useStorage } from "@/liveblocks.config";
import { Camera, Color } from "@/types/canvas";
import React, { memo } from "react";
import ColorPicker from "./ColorPicker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import ToolTip from "@/components/tooltip";
import { BringToFrontIcon, SendToBackIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionToolsProps {
  camera: Camera;
  setLastColor: any;
}

const SelectionTools = memo(({ camera, setLastColor }: SelectionToolsProps) => {
  const selection = useSelf((me) => me.presence.selection);

  const selectionBounds = useSelectionBounds();

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get("layers");

      setLastColor(fill);

      selection.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selection, setLastColor]
  );

  const moveToBack = useMutation(
    ({ storage }) => {
      const liveLayers = storage.get("layerIds");
      const indices : number[] = [];

      const arr = liveLayers.toImmutable();

      for(let i = 0; i < arr.length; i++) {
        if(selection.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayers.move(indices[i], i);
      }
    },
    [selection] 
  );

  const moveToFront = useMutation(
    ({ storage }) => {
      const liveLayers = storage.get("layerIds");
      const indices : number[] = [];

      const arr = liveLayers.toImmutable();

      for(let i = 0; i < arr.length; i++) {
        if(!selection.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayers.move(indices[i], i);
      }
    },
    [selection]
  );


  const deleteLayers = useDeleteLayers();

  if (!selectionBounds) {
    return null;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute top-0 p-3 rounded-xl bg-white shadow-sm flex select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
    >
      <ColorPicker onChange={setFill} />

      <div className="flex flex-col gap-2 px-2 pr-3 mr-2 border-r h-fit border-neutral-300">
        <ToolTip content="Bring To Front">
          <BringToFrontIcon onClick={moveToFront} />
        </ToolTip>
        <ToolTip content="Send To Back">
            <SendToBackIcon onClick={moveToBack}/>
        </ToolTip>
      </div>

      <ToolTip
        content="Delete Selected Layers"
        className="ml-2 pl-2"
      >
        <Trash2Icon
          className="w-5 h-5 text-red-500 cursor-pointer"
          onClick={() => deleteLayers()}
        />
      </ToolTip>
    </div>
  );
});

SelectionTools.displayName = "SelectionTools";

export default SelectionTools;
