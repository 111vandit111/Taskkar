"use client";

import { CreateOrganization, useOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "./organisationList";
import ToolTip from "@/components/tooltip";

const CreateNewOrganization = () => {
  return (
    <Dialog>
      <List />
      <DialogTrigger>
        <div className="">
          <ToolTip content="add organization" position={"right"} sideOffset={4}>
          <Button
            size={"sm"}
            className="bg-gray-500 opacity-50 hover:opacity-100 hover:bg-gray-500 transition"
          >
            <Plus className="text-white" />
          </Button>
          </ToolTip>
        </div>
      </DialogTrigger>

      <DialogContent className="w-max p-0 bg-transparent border-none">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewOrganization;
