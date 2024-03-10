
import { Skeleton } from "@/components/ui/skeleton";
import { Circle, ClipboardX, Eclipse, Pencil, Redo, Square, Undo } from "lucide-react";

export const Toolbar = () => {
    const icon = "cursor-pointer";
    return (
        <div className="absolute py-3 px-4 w-fit bottom-5 right-[50%] transform translate-x-[50%] bg-white shadow-lg rounded-lg flex gap-3">
            <div className={icon}>
                <Pencil />
            </div>
            <div className={icon}>
                <Square />
            </div>
            <div className={icon}>
                <Circle />
            </div>
            <div className={icon}>
               <Eclipse />
            </div>
            <div className={icon}>
                <Undo />
            </div>
            <div className={icon}>
                <Redo />
            </div>
        </div>
    )
    
}

export const ToolbarSkeleton=()=>{
    return (
        <div className="absolute py-1 px-2 bottom-5 right-[50%] transform translate-x-[50%] bg-white shadow-lg rounded-lg flex gap-3">
            <Skeleton className="w-9 h-9 bg-slate-300" />
            <Skeleton className="w-9 h-9 bg-slate-300" />
            <Skeleton className="w-9 h-9 bg-slate-300" />
            <Skeleton className="w-9 h-9 bg-slate-300" />
            <Skeleton className="w-9 h-9 bg-slate-300" />
            <Skeleton className="w-9 h-9 bg-slate-300" />
        </div>
    )
}