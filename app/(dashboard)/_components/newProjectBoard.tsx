"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Ban, LoaderIcon, Plus } from "lucide-react";
import { toast } from "sonner";

interface NewProjectBoardProps {
  orgId: string;
  disabled?: boolean;
}
export const NewProjectBoard = ({ orgId, disabled  }: NewProjectBoardProps) => {

    const { mutate , pending} = useApiMutation(api.boards.create);
    const onClick = () => {
        mutate({
            orgId,
            title:"Untitled"
        }).then((id)=>{
            toast.success("Project created");
        }).catch((error)=>{
            toast.error("Something went wrong")
        })
    }
  return (
    <Button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] border rounded-lg flex flex-col justify-center items-center overflow-hidden bg-slate-600 py-6 w-full h-full"
      )}
    >
       {pending ? <LoaderIcon className="h-12 w-12" />: <Plus className="h-12 w-12" /> } 
       {pending || disabled ? <p className="text-md mt-1 "> Please Wait </p>: <p className="text-md "> Add an new Project </p> }
    </Button>
  );
};
