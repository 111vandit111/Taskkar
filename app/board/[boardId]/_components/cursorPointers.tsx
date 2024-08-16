"use client";
import React, { memo } from 'react'
import { useOthersConnectionIds, useOthersMapped } from '@/liveblocks.config';
import Cursor from './cursor';
import { shallow } from '@liveblocks/client';
import { Path } from './Path';
import { colorToCss } from '@/lib/utils';

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

const Drafts = () => {
  const others = useOthersMapped((
    other
  ) => ({
    pencilDraft: other.presence.pencilDraft,
    penColor : other.presence.penColor
  }), shallow);

  return (
    <>
      {others.map(([key,other]) => {
        if(other.pencilDraft){
          return (
            <Path 
             key={key}
             x={0}
             y={0}
             points={other.pencilDraft}
             fill={other.penColor ? colorToCss(other.penColor) : "#000"}
            />
          )
        }

        return null
      })}
    </>
  )
}


const CursorPointers = memo(() => {
  return (
    <>
    <Drafts />
     <Cursors />
    </>
  )
})

CursorPointers.displayName = "CursorPointers"

export default CursorPointers