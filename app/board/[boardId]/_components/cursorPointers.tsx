"use client";
import React, { memo } from 'react'
import { useOthersConnectionIds } from '@/liveblocks.config';
import Cursor from './cursor';

const Cursors = () => {
    const ids = useOthersConnectionIds();
    return (
        <>
        {ids.map((connecyionIds) => (
            <Cursor key={connecyionIds} connectionId={connecyionIds}/>
        ))}
        </>
    )
}

const CursorPointers = memo(() => {
  return (
    <>
     <Cursors />
    </>
  )
})

CursorPointers.displayName = "CursorPointers"

export default CursorPointers