"use client";
import React, { useState } from 'react'
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { useCanRedo, useCanUndo, useHistory, useSelf } from '@/liveblocks.config';
import { CanvasMode, CanvasState } from '@/types/canvas';

interface Props {
  boardId: string;
}
const Canvas = ({boardId}: Props) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode : CanvasMode.None,
  });
 const history = useHistory();
 const canUndo = useCanUndo();
 const canRedo = useCanRedo();

  const info = useSelf((me) => me.info);

  console.log("from info ",info)
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
    </main>
  )
}

export default Canvas