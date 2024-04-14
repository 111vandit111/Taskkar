"use client";
import React, { useCallback, useState } from 'react'
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { useCanRedo, useCanUndo, useHistory, useSelf , useMutation} from '@/liveblocks.config';
import { Camera, CanvasMode, CanvasState } from '@/types/canvas';
import CursorPointers from './cursorPointers';
import { pointerEventToCamera } from '@/lib/utils';

interface Props {
  boardId: string;
}
const Canvas = ({boardId}: Props) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode : CanvasMode.None,
  });
 const [camera, setCamera] = useState<Camera>({x:0,y:0});

 const history = useHistory();
 const canUndo = useCanUndo();
 const canRedo = useCanRedo();

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
      canUndo
      canRedo
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorPointers />
        </g>
      </svg>
    </main>
  )
}

export default Canvas