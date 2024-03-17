"use client";

import { Actions } from "@/components/actions";
import ToolTip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface InfoProps {
  boardId: string;
}

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

export const TabSepreator = () => {
  return <div className="h-full text-slate-400 mx-2">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
  const navigate = useRouter();

  const { setOpen } = useRenameModal();

  const data = useQuery(api.boards.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <InfoSkeleton />;
  return (
    <Button
      className="absolute top-4 left-4 bg-slate-50 shadow-lg z-10 h-fit"
      variant="outline"
    >
      <ToolTip content="Home" sideOffset={10}>
        <Image
          src={"/taskkar.png"}
          width={30}
          height={30}
          alt="Home"
          onClick={() => {
            navigate.push("/");
          }}
        />
      </ToolTip>

      <TabSepreator />
      <ToolTip content="Rename" sideOffset={10}>
        <p onClick={() => setOpen(data._id, data.title)}>{data.title}</p>
      </ToolTip>
      <TabSepreator />
      <ToolTip content="Menu" sideOffset={10}>
        <p>
          <Actions
            id={data._id}
            title={data.title}
            side="bottom"
            sideOffset={10}
          >
            <MenuIcon />
          </Actions>
        </p>
      </ToolTip>
    </Button>
  );
};

export const InfoSkeleton = () => {
  return (
    <Button
      className="absolute top-4 left-4 bg-slate-50 shadow-sm z-10 w-[100px] p-0"
      variant="outline"
    >
      <Skeleton className="h-full w-full bg-gray-300" />
    </Button>
  );
};
