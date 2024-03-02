import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FooterProps{
    title:string;
    authorLabel:string;
    createdAtLabel:string;
    favourite:boolean;
    onClick: () => void;
    disabled: boolean;
}

export const Footer = ({ title, authorLabel, createdAtLabel, favourite, onClick, disabled }: FooterProps) => {
    
    const handleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
    }

    return (
    <div className="relative bg-white p-3 ">
        <p className="text-[13px] text-ellipsis max-w-[calc(100%-40px)] ">{title}</p>

        <p className="md:opacity-0 group-hover:opacity-100 transition text-[11px] text-muted-foreground ">
            {authorLabel} {createdAtLabel}
        </p>

        <Button
        disabled={disabled}
        onClick={handleFavourite}
        variant={"link"}
        size={"lg"}
        className="absolute top-0 right-[12px] p-0"
        >
          <Star 
          className={cn("h-4 w-4", favourite && "text-yellow-500 fill-yellow-500")}
          />
        </Button>
    </div>)

}