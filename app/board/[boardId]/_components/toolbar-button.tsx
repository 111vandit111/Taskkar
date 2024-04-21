"use client";

import { LucideIcon } from "lucide-react";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";

interface ToolbarButtonProps {
    icon: LucideIcon;
    onClick: () => void;
    label: string;
    isActive?: boolean;
    isDisabled?: boolean;
} 

export const ToolbarButton = ({ icon: Icon, onClick, label, isActive, isDisabled }: ToolbarButtonProps) => {
    return (
        <Tooltip content={label} sideOffset={18} position="top">
            <Button
                variant={isActive ? "activeButton" : "outline"}
                size="icon"
                onClick={onClick}
                disabled={isDisabled}
            >
                <Icon size={18} />
            </Button>
        </Tooltip>
    )
}    