"use client";

import { cn } from '@/lib/utils';

const paletteColors = [
  '#F7B2AD', // Pink
  '#9AB7D3', // Sky Blue
  '#A2D5C6', // Seafoam Green
  '#F9E498', // Sunny Yellow
  '#C6B7D3', // Soft Lavender
  '#C0C0C0', // Cool Grey
  '#00A99D', // Bright Teal
  '#F47A60', // Vivid Orange
  '#A7D780', // Fresh Lime
];

type ColorPaletteProps = {
  selectedColor: string;
  onColorSelect: (color: string) => void;
};

export function ColorPalette({ selectedColor, onColorSelect }: ColorPaletteProps) {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg">
      {paletteColors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={cn(
            'w-6 h-6 rounded-full border-2 transition-transform transform hover:scale-110 focus:outline-none',
            {
              'border-white ring-2 ring-offset-2 ring-offset-background': selectedColor === color,
              'border-transparent': selectedColor !== color,
            }
          )}
          style={{ 
            backgroundColor: color,
            ringColor: color
          }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
