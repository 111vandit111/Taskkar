"use client";

import { useSelectionBounds } from "@/hooks/use-selection-hook";
import { useSelf, useStorage } from "@/liveblocks.config";
import { LayerType, Side, XYWH } from "@/types/canvas";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 5;

export const SelectionBox = ({
  onResizeHandlePointerDown,
}: SelectionBoxProps) => {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );
  const isShowingHandless = useStorage(
    (root) =>
      soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
  );
  const bounds = useSelectionBounds();

  if (!bounds) return null;

  return (
    <>
      <rect
        className="fill-transparent stroke-1 stroke-orange-400"
        style={{
          transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />
      {isShowingHandless && (
        <>
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                  bounds.y - HANDLE_WIDTH / 2
                }px)`,
              }}
              onPointerDown={() => {}}
            />
          </>

          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
                }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={() => {}}
            />
          </>

          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x - HANDLE_WIDTH / 2 + bounds.width
                }px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={() => {}}
            />
          </>
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x - HANDLE_WIDTH / 2 + bounds.width
                }px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH}px)`,
              }}
              onPointerDown={() => {}}
            />
          </>
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x - HANDLE_WIDTH / 2 + bounds.width
                }px, ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={() => {}}
            />
          </>
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2
                }px,  ${bounds.y + bounds.height - HANDLE_WIDTH / 2}px)`,
              }}
              onPointerDown={() => {}}
            />
          </>
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${
                  bounds.y - HANDLE_WIDTH / 2 + bounds.height
                }px)`,
              }}
              onPointerDown={() => {}}
            />
          </>
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-400 rounded-full"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x - HANDLE_WIDTH / 2
                }px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH}px)`,
              }}
              onPointerDown={() => {}}
            />
          </>
        </>
      )}
    </>
  );
};
