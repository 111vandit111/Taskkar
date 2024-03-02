"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Children } from "react";
import { Link2, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  id,
  title,
  side,
  sideOffset,
  children,
}: ActionProps) => {
  const { mutate, pending } = useApiMutation(api.boards.remove);
  const { setOpen } = useRenameModal();
  const onClickDelete = () => {
    mutate({
      id,
    })
      .then(() => toast.success("Deleted " + title))
      .catch(() => toast.error("Failed to delete " + title));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem
          className="p-3 cursor-pointer text-ellipsis"
          onClick={(e) => {
            navigator.clipboard
              .writeText(window.location.origin + `/board/${id}`)
              .then(() => toast.success("Link copied to clipboard"))
              .catch(() => toast.error("Failed to copy link"));
          }}
        >
          <Link2 className="h-4 w-4 mr-5" /> Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem
          className="p-3 cursor-pointer text-ellipsis"
          onClick={(e) => setOpen(id, title)}
        >
          <Pencil className="h-4 w-4 mr-5" /> Rename
        </DropdownMenuItem>
        <ConfirmModal header="Delete Work?" onConfirm={onClickDelete} disabled={pending} desc="Are you sure you want to delete this work?">
          <Button
            variant={"ghost"}
            className="p-3 cursor-pointer text-ellipsis font-normal w-full justify-start "
          >
            <Trash2 className="h-4 w-4 mr-5" /> Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
