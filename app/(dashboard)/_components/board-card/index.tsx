"use client";

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
  id: string;
  title: string;
  imageUrl: string;
  orgId: string;
  authorId: string;
  authorName: string;
  favourite: boolean;
  createdAt: number;
}

const BoardCard = ({
  id,
  title,
  imageUrl,
  orgId,
  authorId,
  authorName,
  favourite,
  createdAt,
}: BoardCardProps) => {
  const { userId } = useAuth();
  const { mutate : onFavourite , pending: favouritePending } = useApiMutation(api.boards.favourite);
  const { mutate : onUnFavourite , pending: unfavouritePending } = useApiMutation(api.boards.unFavourite);
  const handleFavourite = useMutation(api.boards.favourite); 

  const toggleFavourite = () => {
    if (favourite) {
      onUnFavourite({id})
      .catch(() => toast.error("Failed to unfavourite"));
    } else {
      handleFavourite({id: id as Id<"boards">, orgId: orgId})
      .catch(() => toast.error("Failed to favourite"));
    }
  }

  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });
  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden bg-slate-300 ">
        <div className="relative flex-1">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-fit transition duration-400"
          />
          <Overlay />
          <Actions id={id} title={title} side="right">
            <Button size={"sm"} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-transparent p-0 hover:bg-transparent">
                <MoreVertical className="h-6 w-6 font-extrabold text-white" />
            </Button>
          </Actions>
        </div>

        <Footer
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          favourite={favourite}
          title={title}
          onClick={toggleFavourite}
          disabled={favouritePending || unfavouritePending}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full bg-[#fc757553]" />
    </div>
  );
};

export default BoardCard;
