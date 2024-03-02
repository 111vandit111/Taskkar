"use client";

import { useRenameModal } from "@/store/use-rename-modal";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const RenameModal = () => {
  const { mutate , pending} = useApiMutation(api.boards.update);
  const { open, values, setValues } = useRenameModal();
  const [title, setTitle] = useState(values.title);

  useEffect(() => {
    setTitle(values.title);
  }, [values.title]);

  const onSubmit:FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate({ id: values.id, title: title }).then(() => {
        toast.success("File renamed");
        setValues();
    }).catch((error) => {
        toast.error("Failed to rename file");
    })
  };
  return (
    <Dialog open={open} onOpenChange={setValues}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new name for the file</DialogDescription>
        <form onSubmit={onSubmit}>
          <Input
            disabled={pending}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new Title"
            maxLength={45}
            required
          />
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
