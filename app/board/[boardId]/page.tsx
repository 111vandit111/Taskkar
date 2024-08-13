import React from 'react'
import Canvas from './_components/canvas';
import { Room } from '@/components/room';
import { Loading } from './_components/loader';

interface Props {
  params: {
    boardId: string;
  }
}

const BoardIdPage = ({params}:Props) => {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
    <div>
        <Canvas boardId={params.boardId}/>
    </div>
    </Room>
  )
}

export default BoardIdPage;