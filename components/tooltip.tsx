import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}

const ToolTip = ({
  children,
  content,
  position,
  sideOffset,
  className,
  align,
  alignOffset,
}: TooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>

        <TooltipContent
          className={cn(
            "text-white bg-black border-black rounded-sm font-semibold capitalize",
            className
          )}
          side={position}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTip;
