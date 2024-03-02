"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { UserPlus2 } from "lucide-react";

export const InviteUsers = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <UserPlus2 className="h-4 w-4 mr-2" /> Invite
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[900px]">
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
