'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import * as culori from 'culori';

interface HarmonyWheelProps {
  baseColor: string;
  type: string;
  onHueChange: (hue: number) => void;
}

export const HarmonyWheel = ({ baseColor, type, onHueChange }: HarmonyWheelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onHueChangeRef = useRef(onHueChange);

  useEffect(() => {
    onHueChangeRef.current = onHueChange;
  }, [onHueChange]);

  // Create stable handlers ONCE that read from refs
  const handleInteraction = useRef((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current || !onHueChangeRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    let angleDeg = (angleRad * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;

    onHueChangeRef.current(angleDeg);
  }).current;

  const handleMouseUp = useRef(() => {
    window.removeEventListener('mousemove', handleInteraction);
    window.removeEventListener('mouseup', handleMouseUp);
  }).current;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleInteraction(e.nativeEvent);
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleInteraction, handleMouseUp]);

  const dots = useMemo(() => {
    const converter = culori.converter('oklch');
    if (!converter) return [];
    const base = converter(baseColor);
    if (!base) return [];
    let hues: number[] = [base.h || 0];
    if (type === 'complementary') hues.push((base.h || 0) + 180);
    if (type === 'triad') hues = [base.h || 0, (base.h || 0) + 120, (base.h || 0) + 240];
    if (type === 'tetrad') hues = [base.h || 0, (base.h || 0) + 90, (base.h || 0) + 180, (base.h || 0) + 270];
    if (type === 'analogous') hues = [(base.h || 0) - 30, base.h || 0, (base.h || 0) + 30];
    if (type === 'split') hues = [base.h || 0, (base.h || 0) + 150, (base.h || 0) + 210];

    return hues.map((h, i) => ({ h: h % 360, color: i === 0 ? '#fff' : culori.formatHex({ ...base, h }) }));
  }, [baseColor, type]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="w-full aspect-square bg-[#111] rounded-full border-[2px] border-[#222] shadow-slot relative flex items-center justify-center cursor-crosshair overflow-hidden"
      style={{ background: 'radial-gradient(circle, #1a1a1a 0%, #050505 100%)' }}
    >
      <div className="absolute inset-0 rounded-full border border-[#333] m-1 opacity-50"></div>
      <div className="absolute inset-0 rounded-full border border-[#333] m-4 opacity-30"></div>
      <div className="absolute inset-0 rounded-full border border-[#333] m-8 opacity-20"></div>

      {/* Axis Lines */}
      <div className="absolute w-full h-[1px] bg-[#222]"></div>
      <div className="absolute h-full w-[1px] bg-[#222]"></div>

      {dots.map((d, i) => {
        const angleRad = (d.h - 90) * (Math.PI / 180);
        const r = 38;
        // Round to 2 decimal places to ensure consistent hydration between server and client
        const x = Math.round((50 + r * Math.cos(angleRad)) * 100) / 100;
        const y = Math.round((50 + r * Math.sin(angleRad)) * 100) / 100;
        return (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full border border-black shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-100 pointer-events-none`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: d.color,
              transform: 'translate(-50%, -50%)',
              zIndex: i === 0 ? 20 : 10,
              boxShadow: i === 0 ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
            }}
          ></div>
        );
      })}
    </div>
  );
};
