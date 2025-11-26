'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface FaderProps {
  value?: number;
  val?: number;
  min?: number;
  max?: number;
  label: string;
  color?: string;
  onChange: (value: number) => void;
}

export const Fader = ({ value, val, min = 0, max = 100, label, color, onChange }: FaderProps) => {
  const actualValue = value !== undefined ? value : val;
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startVal = useRef(0);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);
  const actualValueRef = useRef(actualValue);

  useEffect(() => {
    minRef.current = min;
    maxRef.current = max;
    onChangeRef.current = onChange;
    actualValueRef.current = actualValue;
  }, [min, max, onChange, actualValue]);

  // Create stable handlers ONCE that read from refs
  const handleMouseMove = useRef((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - startX.current;
    const range = maxRef.current - minRef.current;
    const width = rect.width;
    const sensitivity = range / width;
    let newVal = startVal.current + (deltaX * sensitivity);
    newVal = Math.max(minRef.current, Math.min(maxRef.current, newVal));
    onChangeRef.current(newVal);
  }).current;

  const handleMouseUp = useRef(() => {
    setDragging(false);
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }).current;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const thumb = thumbRef.current;
    const isThumb = thumb && (target === thumb || thumb.contains(target));
    
    if (isThumb) {
      // Dragging the thumb
      e.stopPropagation();
      e.preventDefault();
      setDragging(true);
      startX.current = e.clientX;
      startVal.current = actualValueRef.current || 0;
      document.body.style.cursor = 'ew-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      // Clicking the track - jump to position
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, clickX / rect.width));
      const newVal = minRef.current + (percent * (maxRef.current - minRef.current));
      onChangeRef.current(newVal);
    }
  }, [handleMouseMove, handleMouseUp]);

  const percent = Math.min(100, Math.max(0, ((actualValue || 0) - min) / (max - min) * 100));

  return (
    <div className="flex items-center gap-3 w-full relative">
      <span className="w-8 text-[9px] font-bold text-console-subtext tracking-wider uppercase text-right">{label}</span>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="flex-1 relative h-6 flex items-center group cursor-pointer select-none"
      >
        <div className="absolute w-full h-[2px] bg-[#000] shadow-[0_1px_0_rgba(255,255,255,0.08)]"></div>
        <div
          className="absolute h-[2px] opacity-80"
          style={{
            width: `${percent}%`,
            backgroundColor: color || '#F5A623',
            boxShadow: `0 0 8px ${color || '#F5A623'}`
          }}
        ></div>

        <div
          ref={thumbRef}
          data-fader-thumb
          className={`absolute h-5 w-3 bg-[#2a2a2a] border border-[#000] rounded shadow-lg flex items-center justify-center z-30 cursor-ew-resize transition-none user-select-none ${dragging ? 'scale-110 bg-[#333] border-console-accent/50' : 'hover:scale-105'}`}
          style={{ left: `calc(${percent}% - 6px)`, touchAction: 'none', pointerEvents: 'auto' }}
        >
          <div className="w-full h-[1px] bg-white/30 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
