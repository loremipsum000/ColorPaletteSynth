'use client';

import { useMemo } from 'react';
import { generateGrid } from '@/lib/color-utils';

interface GridVisualizerProps {
  colors: string[];
  effects: {
    shadow: number;
    glow: number;
    grain: number;
    vignette: number;
  };
}

export const GridVisualizer = ({ colors, effects }: GridVisualizerProps) => {
  const gridData = useMemo(() => generateGrid(colors), [colors]);

  return (
    <div className="h-full flex flex-col relative">
      <div className="h-6 bg-[#111] border-b border-[#222] flex items-center px-2 mb-1 rounded-t">
        <span className="text-[9px] font-bold text-console-subtext tracking-widest">SPECTRAL MATRIX</span>
      </div>
      <div className="flex-1 bg-black border border-[#222] rounded-b shadow-slot relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-10"
          style={{ boxShadow: `inset 0 0 ${effects.vignette}px rgba(0,0,0,1)` }}></div>
        <div className="glass-overlay absolute inset-0 z-20 pointer-events-none opacity-50"></div>

        <div className="flex gap-[1px] w-full h-full relative z-0">
          {gridData.map((col, x) => (
            <div key={x} className="flex-1 flex flex-col gap-[1px]">
              {col.map((hex, y) => (
                <div
                  key={y}
                  className="flex-1 transition-colors duration-200 relative group"
                  style={{
                    backgroundColor: hex,
                    boxShadow: effects.glow > 0 ? `0 0 ${effects.glow / 6}px ${hex}` : 'none',
                    filter: `contrast(${100 + effects.shadow}%)`
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none bg-noise mix-blend-overlay opacity-30" style={{ opacity: effects.grain / 100 * 0.5 }}></div>
      </div>
    </div>
  );
};

