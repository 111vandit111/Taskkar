"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOthers, useSelf } from "@/liveblocks.config";
import { UserAvatar } from "./userAvatar";
import { use } from "react";
import { connectionToColor } from "@/lib/utils";

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  return (
    <div className="absolute h-10 w-fit top-4 right-4 bg-white flex items-center shadow-lg px-3 rounded-lg">
      <div className="flex">

{
    currentUser && 
    <UserAvatar
      src={currentUser.info?.avatar}
      name={currentUser.info?.name}
      fallback={currentUser.info?.name?.[0] || "A"}
      borderColor={connectionToColor(currentUser.connectionId)}
    />
}

        {users.slice(0, 3).map((user) => (
            <div className="ml-[-10px]" key={user.connectionId}>
              <UserAvatar
                key={user.connectionId}
                src={user.info?.avatar}
                name={user.info?.name}
                fallback={user.info?.name?.[0] || "A"}
                borderColor={connectionToColor(user.connectionId)}
              />
            </div>
        ))}


        {
            hasMoreUsers &&
            <div className="ml-[-10px]">
              <UserAvatar
                name="..."
                fallback="..."
                borderColor="transparent"
              />
            </div>
        }
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-10 top-4 right-4 bg-white flex items-center shadow-lg rounded-lg">
      <Skeleton className="h-full bg-gray-300 w-[50px]" />
    </div>
  );
};
