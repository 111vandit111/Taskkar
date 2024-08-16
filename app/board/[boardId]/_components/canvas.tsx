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
  colorToCss,
  connectionToColor,
  findIntersectingLayerWithRectangle,
  penPointsToPathLayer,
  pointerEventToCamera,
  resizeBounds,
} from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layerPreview";
import { SelectionBox } from "./selectionBox";
import SelectionTools from "@/app/(dashboard)/_components/SelectionTools";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Path } from "./Path";
import useDisableScrollBounce from "@/hooks/use-disable-scroll-bounce";

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

  useDisableScrollBounce();

  const history = useHistory();

  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

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

  // const insertLayer = useMutation(
  //   (
  //     { storage, setMyPresence },
  //     layertype:
  //       | LayerType.Ellipse
  //       | LayerType.Rectangle
  //       | LayerType.Text
  //       | LayerType.Note,
  //     position: Point
  //   ) => {
  //     const liveLayers = storage.get("layers");
  //     if (liveLayers.size > MAX_LAYERS) return;
  //     const liveLayerIds = storage.get("layerIds");
  //     const layerId = nanoid();
  //     const newLayer = new LiveObject({
  //       type: layertype,
  //       x: position.x,
  //       y: position.y,
  //       height: 100,
  //       width: 100,
  //       fill: lastColor,
  //     });

  //     liveLayerIds.push(layerId);
  //     liveLayers.set(layerId, newLayer);
  //     setMyPresence({ selection: [layerId] }, { addToHistory: true });
  //     setCanvasState({ mode: CanvasMode.None });
  //   },
  //   [lastColor]
  // );

  // const updateSelectionNet = useMutation(
  //   ({ storage, setMyPresence }, current: Point, origin: Point) => {
  //     const layers = storage.get("layers").toImmutable();

  //     setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });

  //     const ids = findIntersectingLayerWithRectangle(
  //       layerIds,
  //       layers,
  //       origin,
  //       current
  //     );

  //     setMyPresence({ selection: ids });
  //   },
  //   [layerIds]
  // );

  // const startMultiSelection = useCallback((current: Point, origin: Point) => {
  //   if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
  //     setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
  //   }
  // }, []);

  // const resizeSelectedLayer = useMutation(
  //   ({ storage, self }, point: Point) => {
  //     if (canvasState.mode !== CanvasMode.Resizing) return;

  //     const bounds = resizeBounds(
  //       canvasState.initialBounds,
  //       canvasState.corners,
  //       point
  //     );

  //     const liveLayer = storage.get("layers");
  //     const layer = liveLayer.get(self.presence.selection[0]);

  //     if (layer) {
  //       layer.update(bounds);
  //     }
  //   },
  //   [canvasState]
  // );

  // const translateSelectedLayers = useMutation(
  //   ({ storage, self }, point: Point) => {
  //     if (canvasState.mode !== CanvasMode.Translating) {
  //       return;
  //     }

  //     const offset = {
  //       x: point.x - canvasState.current.x,
  //       y: point.y - canvasState.current.y,
  //     };

  //     const liveLayers = storage.get("layers");
  //     for (const id of self.presence.selection) {
  //       const layer = liveLayers.get(id);
  //       if (layer) {
  //         layer.update({
  //           x: layer.get("x") + offset.x,
  //           y: layer.get("y") + offset.y,
  //         });
  //       }
  //     }

  //     setCanvasState({ mode: CanvasMode.Translating, current: point });
  //   },
  //   [canvasState]
  // );

  // const unselectLayers = useMutation(({ self, setMyPresence }) => {
  //   if (self.presence.selection.length > 0) {
  //     setMyPresence({ selection: [] }, { addToHistory: true });
  //   }
  // }, []);

  // const onWheel: any = useCallback((e: React.WheelEvent) => {
  //   setCamera((camera) => ({
  //     x: camera.x - e.deltaX,
  //     y: camera.y - e.deltaY,
  //   }));
  // }, []);

  // const onPointerMove = useMutation(
  //   ({ setMyPresence }, e: React.PointerEvent) => {
  //     e.preventDefault();
  //     const current = pointerEventToCamera(e, camera);
  //     if (canvasState.mode === CanvasMode.Pressing) {
  //       startMultiSelection(current, canvasState.origin);
  //     } else if (canvasState.mode === CanvasMode.SelectionNet) {
  //       updateSelectionNet(current, canvasState.origin);
  //     } else if (canvasState.mode === CanvasMode.Translating) {
  //       translateSelectedLayers(current);
  //     } else if (canvasState.mode === CanvasMode.Resizing) {
  //       resizeSelectedLayer(current);
  //     }

  //     setMyPresence({ cursor: current });
  //   },
  //   [
  //     canvasState,
  //     camera,
  //     resizeSelectedLayer,
  //     translateSelectedLayers,
  //   ]
  // );

  // const onResizeHandlePointerDown = useCallback(
  //   (corner: Side, initialBounds: XYWH) => {
  //     history.pause();
  //     setCanvasState({
  //       mode: CanvasMode.Resizing,
  //       initialBounds,
  //       corners: corner,
  //     });
  //   },
  //   [history]
  // );

  // const onPointerLeave = useMutation(({ setMyPresence }) => {
  //   setMyPresence({ cursor: null });
  // }, []);

  // const onPointerDown = useCallback(
  //   (e: React.PointerEvent) => {
  //     const point = pointerEventToCamera(e, camera);

  //     if (canvasState.mode === CanvasMode.Inserting) {
  //       return;
  //     }

  //     setCanvasState({
  //       origin: point,
  //       mode: CanvasMode.Pressing,
  //     });
  //   },
  //   [camera, canvasState.mode , setCanvasState]
  // );

  // const onPointerUp = useMutation(
  //   ({}, e) => {
  //     const current = pointerEventToCamera(e, camera);

  //     if (
  //       canvasState.mode === CanvasMode.Pressing ||
  //       canvasState.mode === CanvasMode.None
  //     ) {
  //       unselectLayers();
  //       setCanvasState({
  //         mode: CanvasMode.None,
  //       });
  //     } else if (canvasState.mode === CanvasMode.Inserting) {
  //       insertLayer(canvasState.layerType, current);
  //     } else {
  //       setCanvasState({
  //         mode: CanvasMode.None,
  //       });
  //     }

  //     history.resume();
  //   },
  //   [camera, canvasState, history]
  // );

  // const selections = useOthersMapped((user) => user.presence.selection);

  // const onLayerPointerDown = useMutation(
  //   ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
  //     if (
  //       canvasState.mode === CanvasMode.Pencil ||
  //       canvasState.mode === CanvasMode.Inserting
  //     ) {
  //       return;
  //     }

  //     history.pause();
  //     e.stopPropagation();

  //     const point = pointerEventToCamera(e, camera);

  //     if (!self.presence.selection.includes(layerId)) {
  //       setMyPresence({ selection: [layerId] }, { addToHistory: true });
  //     }
  //     setCanvasState({ mode: CanvasMode.Translating, current: point });
  //   },
  //   [canvasState.mode, camera, history, setCanvasState]
  // );

  // const layerIdsToColorSelection = useMemo(() => {
  //   const layerIdsToColorSelection: Record<string, string> = {};
  //   for (const user of selections) {
  //     const [connectionId, selection] = user;

  //     for (const layerId of selection) {
  //       layerIdsToColorSelection[layerId] = connectionToColor(connectionId);
  //     }
  //   }

  //   return layerIdsToColorSelection;
  // }, [selections]);

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Delete": {
          if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text) break;
          deleteLayers();
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  /**
   * Select the layer if not already selected and start translating the selection
   */
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
    [setCanvasState, camera, history, canvasState.mode]
  );

  /**
   * Start resizing the layer
   */
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

  /**
   * Insert an ellipse or a rectangle at the given position and select it
   */
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
            | LayerType.Ellipse
            | LayerType.Rectangle
            | LayerType.Text
            | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastColor,
      });
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastColor]
  );

  /**
   * Move selected layers on the canvas
   */
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
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

  const startDrawing = useMutation(({
    setMyPresence
  } , point: Point , pressure: number)=>{

    setMyPresence({ pencilDraft : [[point.x , point.y , pressure]] , penColor : lastColor }, { addToHistory: true });

  },[lastColor])

  /**
   * Resize selected layer. Only resizing a single layer is allowed.
   */
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corners,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);
      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  /**
   * Start multiselection with the selection net if the pointer move enough since pressed
   */
  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    // If the distance between the pointer position and the pointer position when it was pressed
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      // Start multi selection
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  /**
   * Update the position of the selection net and select the layers accordingly
   */
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin: origin,
        current,
      });
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

  const selections = useOthersMapped((other) => other.presence.selection);

  /**
   * Create a map layerId to color based on the selection of all the users in the room
   */
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

  const onWheel = useCallback((e: React.WheelEvent) => {
    // Pan the camera based on the wheel delta
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCamera(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point , e.pressure);
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setCanvasState , startDrawing]
  );

  const continueDrawing = useMutation(
    ({ self ,setMyPresence },point : Point , e: React.PointerEvent) => {
      const {pencilDraft} = self.presence;
      if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || !pencilDraft) { return }
   
      setMyPresence({ cursor: point , pencilDraft : pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y ?  pencilDraft : [...pencilDraft , [point.x , point.y , e.pressure]] }, { addToHistory: true });
    }
  ,[canvasState.mode]);

  const insertPath = useMutation(
    ({ storage, self , setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if(
        pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS
      ){
        setMyPresence({ pencilDraft : null });
        return;
      }

      const id  = nanoid();

      liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft , lastColor)));

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft : null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },[lastColor]
  )

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCamera(e, camera);
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }
      setMyPresence({ cursor: current });
    },
    [
      camera,
      canvasState,
      resizeSelectedLayer,
      startMultiSelection,
      translateSelectedLayers,
      updateSelectionNet,
      continueDrawing
    ]
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => setMyPresence({ cursor: null }),
    []
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCamera(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } 
      else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [camera, canvasState, history, insertLayer, setCanvasState, unselectLayers ,insertPath]
  );

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
          {
            pencilDraft != null && pencilDraft.length > 0 && <Path 
              points={pencilDraft}
              fill={colorToCss(lastColor || "#000000")}
              x={0}
              y={0}
            />
          }
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
