import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";

export const Empty = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image
                src="/emptyScreen.svg"
                alt="Add Projects"
                width={200}
                height={200}
                className="object-cover"
            />

            <div className="text text-center mt-5 text-[#1e1a44]">
                <h1 className="text-3xl font-bold">No projects yet</h1>
                <p className="text-md mt-1 text-muted-foreground">Add your first project</p>
            </div>


            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-[#083344] mt-5" variant={"default"}>
                        <Plus className="h-4 w-4 mr-1" /> Add project
                    </Button>
                </DialogTrigger>

                <DialogContent className="p-0 bg-transparent border-none">
                    <CreateOrganization />
                </DialogContent>
            </Dialog>
        </div>
    );
}