'use client';

import { useMemo } from 'react';
import * as culori from 'culori';
import { safeConvert, formatCMYK } from '@/lib/color-utils';
import { DataRow } from './DataRow';

interface DataScreenProps {
  color: string;
}

export const DataScreen = ({ color }: DataScreenProps) => {
  const data = useMemo(() => {
    if (!color) return {};
    const c = culori.parse(color);
    return {
      oklch: safeConvert(c, 'oklch'),
      rgb: safeConvert(c, 'rgb'),
      hsl: safeConvert(c, 'hsl'),
      hsv: safeConvert(c, 'hsv'),
      cmyk: formatCMYK(c),
      p3: safeConvert(c, 'p3')
    };
  }, [color]);

  return (
    <div className="bg-[#050505] border border-[#222] rounded overflow-hidden shadow-screen h-full flex flex-col relative group">
      {/* Bezel */}
      <div className="absolute inset-0 border-[2px] border-[#111] rounded pointer-events-none z-20"></div>
      <div className="glass-overlay absolute inset-0 z-10"></div>
      <div className="scanlines absolute inset-0 pointer-events-none opacity-10 z-10"></div>

      {/* Header */}
      <div className="bg-[#0a0a0a] px-3 py-2 flex justify-between items-center border-b border-[#1a1a1a]">
        <span className="text-[9px] font-bold text-console-subtext tracking-widest">SIGNAL ANALYSIS</span>
        <div className="w-1.5 h-1.5 rounded-full bg-console-led shadow-[0_0_6px_#4DFF91] animate-pulse"></div>
      </div>

      <div className="p-4 grid grid-cols-1 gap-y-2 relative z-0 overflow-hidden">
        <DataRow label="HEX" value={culori.formatHex(color).toUpperCase()} />
        <DataRow label="RGB" value={`${Math.round((data.rgb?.r || 0) * 255)} ${Math.round((data.rgb?.g || 0) * 255)} ${Math.round((data.rgb?.b || 0) * 255)}`} />
        <DataRow label="OKLCH" value={`${Math.round((data.oklch?.l || 0) * 100)}% ${data.oklch?.c?.toFixed(3) || '0'} ${Math.round(data.oklch?.h || 0)}°`} highlight />
        <DataRow label="HSL" value={`${Math.round(data.hsl?.h || 0)}° ${Math.round((data.hsl?.s || 0) * 100)}% ${Math.round((data.hsl?.l || 0) * 100)}%`} />
        <DataRow label="HSV" value={`${Math.round(data.hsv?.h || 0)}° ${Math.round((data.hsv?.s || 0) * 100)}% ${Math.round((data.hsv?.v || 0) * 100)}%`} />
        <DataRow label="CMYK" value={data.cmyk || '0 0 0 1'} />
        <DataRow label="P3" value={`${data.p3?.r?.toFixed(2) || '0'} ${data.p3?.g?.toFixed(2) || '0'} ${data.p3?.b?.toFixed(2) || '0'}`} />
      </div>
    </div>
  );
};

