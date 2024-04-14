"use client"
import React, { memo } from 'react'
import { connectionToColor } from '@/lib/utils'
import { useOther } from '@/liveblocks.config';
import { MousePointer2Icon } from 'lucide-react';


interface CursorProps {
    connectionId:  number;
}
const Cursor = memo((
    { connectionId }: CursorProps
) => { 
  const info = useOther(connectionId, (me) => me?.info);
  const cursor = useOther(connectionId, (me) => me?.presence.cursor);

  const name = info?.name || "Anonymous";
  const color = connectionToColor(connectionId);

  if(!cursor) {
    return null
  }

  const { x, y } = cursor;
  return (
    <foreignObject
    style={{
      transform: `translate(${x}px, ${y}px)`,
    }}
    height={50}
    width={name.length * 10 + 30}
    className='relative border-none bg-transparent'
    >
        <MousePointer2Icon className="w-5 h-5" color={color} fill={color}/>
        <p className="absolute text-xs rounded-md font-semibold text-white p-1 mt-1"
        style={{ backgroundColor: color }}>{name}</p>
    </foreignObject>
  )
})

Cursor.displayName = "Cursor"

export default Cursor