"use client";
import React, { useCallback, useState } from 'react'
import { nanoid } from "nanoid";
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { useCanRedo, useCanUndo, useHistory, useSelf , useMutation, useStorage} from '@/liveblocks.config';
import { Camera, CanvasMode, CanvasState, Color, LayerType,Point } from '@/types/canvas';
import CursorPointers from './cursorPointers';
import { pointerEventToCamera } from '@/lib/utils';
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layerPreview';

const MAX_LAYERS = 100;
interface Props {
  boardId: string;
}
const Canvas = ({boardId}: Props) => {
  const layerIds = useStorage((root)=>root.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode : CanvasMode.None,
  });
 const [camera, setCamera] = useState<Camera>({x:0,y:0});
 const [lastColor , setLastColor] = useState<Color>({
  r : 0,
  g : 0,
  b : 0,
  a : 1
 });

 const history = useHistory();
 const canUndo = useCanUndo();
 const canRedo = useCanRedo();

 const insertLayer = useMutation(({storage , setMyPresence},layertype:LayerType.Ellipse|LayerType.Rectangle|LayerType.Text|LayerType.Note, position:Point) => {
   const liveLayers = storage.get('layers');
   if(liveLayers.size > MAX_LAYERS) return;

   const liveLayerIds = storage.get('layerIds');
   const layerId = nanoid();
   const newLayer = new LiveObject({
    type:layertype,
    x:position.x,
    y:position.y,
    height:100,
    width:100,
    fill:lastColor,
   })

   liveLayerIds.push(layerId);
   liveLayers.set(layerId,newLayer);
   setMyPresence({selection:[layerId]},{addToHistory:true});
   setCanvasState({mode:CanvasMode.None});
 },[lastColor]);

 const onWheel : any = useCallback((e: React.WheelEvent) => {
   setCamera((camera)=>({
       x: camera.x + e.deltaX,
       y: camera.y + e.deltaY
   }))
  },[]);

 const onPointerMove = useMutation(({setMyPresence} , e: React.PointerEvent) => {
    e.preventDefault();
    const current = pointerEventToCamera(e,camera);
    setMyPresence({cursor: current});
  },[])

 const onPointerLeave = useMutation(({setMyPresence}) => {
  setMyPresence({cursor: null});
 },[])

 const onPointerUp = useMutation((
  {},
  e
 ) => {
  const current = pointerEventToCamera(e,camera);
  if(canvasState.mode === CanvasMode.Inserting){
    insertLayer(canvasState.layerType, current);
  }else{
    setCanvasState({
      mode:CanvasMode.None,
    })
  }

  history.resume();
 },[
  camera , canvasState , history
 ])

  const info = useSelf((me) => me.info);
  return (
    <main className='h-full w-full relative bg-neutral-200 touch-none min-h-[100vh]'>
      <Info boardId={boardId}/>
      <Participants />
      <Toolbar 
      canvasState={canvasState}
      setCanvasState={setCanvasState}
      onUndo={history.undo}
      onRedo={history.redo}
      canUndo = {!history.canUndo()}
      canRedo = {!history.canRedo()}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g
         style={{
          transform:`translate(${camera.x}px, ${camera.y}px)`,
         }}>
          {
            layerIds.map((layerId) => (
              <LayerPreview
                key={layerId}
                layerId={layerId}
                onLayerPointerDown={()=>{}}
                selectionColor = {"#000"}
              />
            ))
          }
          <CursorPointers />
        </g>
      </svg>
    </main>
  )
}

export default Canvas