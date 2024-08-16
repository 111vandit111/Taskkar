"use client";
import { RgbaColorPicker } from "react-colorful";
import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";
import React, { useState } from "react";
import { useSelf, useStorage } from "@/liveblocks.config";
import { shallow } from "@liveblocks/client";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

const colors = [
  { r: 243, g: 22, b: 246, a: 1 },
  { r: 128, g: 200, b: 72, a: 1 },
  { r: 255, g: 85, b: 34, a: 1 },
  { r: 75, g: 180, b: 255, a: 1 },
  { r: 190, g: 60, b: 150, a: 1 },
  { r: 240, g: 220, b: 40, a: 1 },
  { r: 0, g: 0, b: 0, a: 1 },
  { r: 255, g: 255, b: 255, a: 1 },
];

const ColorPicker = ({ onChange }: ColorPickerProps) => {
  const selection = useSelf((me) => me.presence.selection);

  var fill: Color | null = null;

  useStorage((root) => {
    const selectedLayers = selection
      .map((id) => root.layers.get(id)!)
      .filter(Boolean);

    fill = selectedLayers[0]?.fill || null;

    return;
  }, shallow);

  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[160px] pr-3 mr-2 border-r border-neutral-200">
      {colors.map((color) => (
        <ColorPickerButton
          key={colorToCss(color)}
          color={color}
          onChange={onChange}
        />
      ))}

      <RgbaColorPicker
        about="Pick a Custom Color"
        color={fill || { r: 255, g: 0, b: 0, a: 1 }}
        onChange={(value) => onChange(value)}
        className="h-9 w-9 rounded-md border-none"
        style={{ background: colorToCss({ r: 255, g: 0, b: 0, a: 1 }) }}
      />
    </div>
  );
};

interface ColorPickerButtonProps {
  onChange: (color: Color) => void;
  color: Color;
}

const ColorPickerButton = ({ onChange, color }: ColorPickerButtonProps) => {
  return (
    <button
      onClick={() => onChange(color)}
      className="w-9 h-9 items-center flex justify-center hover:opacity-70 trnasition"
    >
      <div
        className="h-9 w-9 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      ></div>
    </button>
  );
};

export default ColorPicker;
