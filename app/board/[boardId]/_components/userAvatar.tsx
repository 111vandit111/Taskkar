import ToolTip from "@/components/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string;
  src?: string;
  fallback?: string;
  borderColor?: string;
}

export const UserAvatar = ({
  name,
  src,
  fallback,
  borderColor,
}: UserAvatarProps) => {
  return (
    <ToolTip
      content={name || "Anonymous"}
      sideOffset={18}
      position="bottom"
    >
        <Avatar 
        className="h-8 w-8 border-2"
        
        style={{ borderColor }}
        >
           <AvatarImage src={src} />
           <AvatarFallback className="text-xs font-bold">{fallback}</AvatarFallback> 
        </Avatar>

    </ToolTip>
  );
};
