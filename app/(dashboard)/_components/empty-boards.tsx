"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
const EmptyBoard = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.boards.create);

  const onClick = () => {
    if (!organization) return;
    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
    .then((id) => {
        toast.success("Project created");
    })
    .catch((error) => {
        toast.error("Failed to create project");
    });
  };

  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-3">
      <Image src={"/noData.svg"} height={350} width={350} alt="Add Projects" />
      <p className="font-bold text-lg text-[#1e1a44]">
        {" "}
        Let&apos;s get started.{" "}
      </p>
      <p className="text-sm text-muted-foreground">
        {" "}
        Create your first project
      </p>

      <Button disabled={pending} onClick={onClick} className="bg-[#083344]">
        Create Something
      </Button>
    </div>
  );
};

export default EmptyBoard;
