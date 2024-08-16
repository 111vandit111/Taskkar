"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useSelf,
  useMutation,
  useStorage,
  useOthersMapped,
} from "@/liveblocks.config";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import CursorPointers from "./cursorPointers";
import {
  connectionToColor,
  findIntersectingLayerWithRectangle,
  pointerEventToCamera,
  resizeBounds,
} from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layerPreview";
import { SelectionBox } from "./selectionBox";
import SelectionTools from "@/app/(dashboard)/_components/SelectionTools";

const MAX_LAYERS = 100;
interface Props {
  boardId: string;
}
const Canvas = ({ boardId }: Props) => {
  const layerIds = useStorage((root) => root.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastColor, setLastColor] = useState<Color>({
    r: 125,
    g: 122,
    b: 125,
    a: 1,
  });

  const history = useHistory();

  useEffect(() => {
    const handleGlobalWheel = (e: any) => {
      if (e.deltaX !== 0) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel);
    };
  }, []);

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layertype:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size > MAX_LAYERS) return;
      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const newLayer = new LiveObject({
        type: layertype,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, newLayer);
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastColor]
  );

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();

      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });

      const ids = findIntersectingLayerWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => { 
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corners,
        point
      );

      const liveLayer = storage.get("layers");
      const layer = liveLayer.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      
      if (canvasState.mode !== CanvasMode.Translating) return;

      const liveLayer = storage.get("layers");
      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y ,
      };

      for (const id of self.presence.selection) {
        const layer = liveLayer.get(id);

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const onWheel: any = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCamera(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      camera,
      resizeSelectedLayer,
      translateSelectedLayer,
    ]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corners: corner,
      });
    },
    [history]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCamera(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      setCanvasState({
        origin: point,
        mode: CanvasMode.Pressing,
      });
    },
    [camera, canvasState.mode , setCanvasState]
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const current = pointerEventToCamera(e, camera);

      if (
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.None
      ) {
        unselectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, current);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [camera, canvasState, history]
  );

  const selections = useOthersMapped((user) => user.presence.selection);

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCamera(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState.mode, camera, history, setCanvasState]
  );

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};
    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const info = useSelf((me) => me.info);
  return (
    <main className="h-full w-full relative bg-neutral-200 touch-none min-h-[100vh]">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={!history.canUndo()}
        canRedo={!history.canRedo()}
      />
      <SelectionTools camera={camera} setLastColor={setLastColor} />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              layerId={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-400/10 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.current.x - canvasState.origin.x)}
                height={Math.abs(canvasState.current.y - canvasState.origin.y)}
              />
            )}
          <CursorPointers />
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
