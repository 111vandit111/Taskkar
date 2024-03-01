"use client";

import Image from "next/image";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import ToolTip from "@/components/tooltip";

interface ItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;
    setActive({ organization: id });
  };
  return (
    <ToolTip content={name} position={"right"}
    sideOffset={4}>
    <div className="aspect-square my-2 relative">
      <Image
        fill
        className={cn(
          "object-cover rounded-md  cursor-pointer opacity-75 hover:opacity-100 transition",
          isActive && "opacity-100"
        )}
        src={imageUrl}
        onClick={() => {
          onClick();
        }}
        alt={name}
      />
    </div>
    </ToolTip>
  );
};
