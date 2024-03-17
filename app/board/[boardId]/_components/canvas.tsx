"use client";
import React from 'react'
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { useSelf } from '@/liveblocks.config';

interface Props {
  boardId: string;
}
const Canvas = ({boardId}: Props) => {

  const info = useSelf((me) => me.info);

  console.log("from info ",info)
  return (
    <main className='h-full w-full relative bg-neutral-200 touch-none min-h-[100vh]'>
      <Info boardId={boardId}/>
      <Participants />
      <Toolbar />
    </main>
  )
}

export default Canvas