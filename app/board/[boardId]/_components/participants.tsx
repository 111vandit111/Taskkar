import { Skeleton } from "@/components/ui/skeleton";

export const Participants = () => {
    return (
        <div className="absolute h-10 w-fit top-4 right-4 bg-white flex items-center shadow-lg px-3 rounded-lg">
            Here are the users
        </div>
    );
}

export const ParticipantsSkeleton=()=>{
    return (
        <div className="absolute h-10 top-4 right-4 bg-white flex items-center shadow-lg rounded-lg">
            <Skeleton className="h-full bg-gray-300 w-[50px]" />
        </div>
    );
}