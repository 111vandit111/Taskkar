import { Loader } from "lucide-react";
import { Info, InfoSkeleton } from "./info";
import { ToolbarSkeleton } from "./toolbar";
import { ParticipantsSkeleton } from "./participants";

export const Loading = () => {
    return (
        <div className="relative w-full h-full flex justify-center items-center bg-netural-100 touch-none">
            <InfoSkeleton />
            <Loader className="w-10 h-10 animate-spin text-muted-foreground" />
            <ToolbarSkeleton />
            <ParticipantsSkeleton />
        </div>
    );
}