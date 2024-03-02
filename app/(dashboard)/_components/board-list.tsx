"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import EmptyBoard from "./empty-boards";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import BoardCard from "./board-card";
import { NewProjectBoard } from "./newProjectBoard";

interface BoardListProps{
    orgId: string;
    query? : {
        Search?: string;
        favourites?: string;
    }
}

export const BoardList = ({orgId, query}: BoardListProps) => {
    const data : any = useQuery(api.board.get , {orgId});

    if(data === undefined) {
        return (
            <div>
            <h1 className="text-3xl font-bold">
                {query?.favourites ? "Favourite Boards" : "Team Projects"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6 pb-10">
                <NewProjectBoard orgId={orgId} disabled={true}/>
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />
           </div>
           </div>
        )
    }

    if(!data.length && query?.Search) {
        return(
            <div className="h-full w-full flex justify-center items-center flex-col">
                <Image 
                src={'/notFound.svg'}
                height={350}
                width={350}
                alt="Add Projects"
                />
                <p className="font-semibold text-lg text-muted-foreground mt-2"> You and I we dont have it here yet. </p>
            </div>
        )
    }

    if(!data.length && query?.favourites) {
        return(
            <div className="h-full w-full flex justify-center items-center flex-col">
                <Image 
                src={'/noFavourites.svg'}
                height={350}
                width={350}
                alt="Add Projects"
                />
                <p className="font-semibold text-lg text-muted-foreground mt-2"> Looks like you dont like anything. </p>
            </div>
        )
    }

    if(!data.length) {
        return <EmptyBoard />
    }
    return (
        <div>
            <h1 className="text-3xl font-bold">
                {query?.favourites ? "Favourite Boards" : "Team Projects"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6 pb-10">
                <NewProjectBoard orgId={orgId}/>
                {
                    data.map((board: any) => (
                        <BoardCard 
                        key={board._id}
                        id={board._id}
                        title={board.title}
                        imageUrl={board.imageUrl}
                        authorName={board.authorName}
                        authorId={board.authorId}
                        createdAt={board._creationTime}
                        orgId={board.orgId}
                        favourite = {false}
                        />

                    ))
                }
            </div>
        </div>
    )
}