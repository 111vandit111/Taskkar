"use client";

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export const Info = () => {
    return (
        <Button className="absolute top-4 left-4 bg-slate-50 shadow-lg z-10" variant="outline">
            Info
        </Button>
    )
}

export const InfoSkeleton = () => {
    return (
        <Button className="absolute top-4 left-4 bg-slate-50 shadow-sm z-10 w-[100px] p-0" variant="outline">
            <Skeleton className="h-full w-full bg-gray-300" />
        </Button>
    )
}