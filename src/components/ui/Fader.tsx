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
  theme?: 'light' | 'dark';
}

export const Fader = ({ value, val, min = 0, max = 100, label, color, onChange, theme = 'dark' }: FaderProps) => {
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

  const isLight = theme === 'light';

  useEffect(() => {
    minRef.current = min;
    maxRef.current = max;
    onChangeRef.current = onChange;
    actualValueRef.current = actualValue;
  }, [min, max, onChange, actualValue]);

  // Create stable handlers ONCE that read from refs
  const handleMove = useRef((e: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = clientX - startX.current;
    const range = maxRef.current - minRef.current;
    const width = rect.width;
    const sensitivity = range / width;
    let newVal = startVal.current + (deltaX * sensitivity);
    newVal = Math.max(minRef.current, Math.min(maxRef.current, newVal));
    onChangeRef.current(newVal);
  }).current;

  const handleEnd = useRef(() => {
    setDragging(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
    document.body.style.touchAction = '';
    
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleEnd);
  }).current;

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to stop scrolling/selection on touch devices
    // but only if it's the thumb being dragged
    const target = e.target as HTMLElement;
    const thumb = thumbRef.current;
    const isThumb = thumb && (target === thumb || thumb.contains(target));
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

    if (isThumb) {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault(); // Prevent scrolling
      
      setDragging(true);
      startX.current = clientX;
      startVal.current = actualValueRef.current || 0;
      
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';
      
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      // Clicking the track - jump to position
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const percent = Math.max(0, Math.min(1, clickX / rect.width));
      const newVal = minRef.current + (percent * (maxRef.current - minRef.current));
      onChangeRef.current(newVal);
    }
  }, [handleMove, handleEnd]);

  const percent = Math.min(100, Math.max(0, ((actualValue || 0) - min) / (max - min) * 100));

  return (
    <div className="flex items-center gap-3 w-full relative">
      <span className={`w-8 text-[9px] font-bold tracking-wider uppercase text-right ${
        isLight ? 'text-[#7a7363]' : 'text-console-subtext'
      }`}>{label}</span>
      <div
        ref={containerRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className="flex-1 relative h-6 flex items-center group cursor-pointer select-none touch-none"
      >
        <div className={`absolute w-full h-[2px] shadow-[0_1px_0_rgba(255,255,255,0.08)] ${
          isLight ? 'bg-[#d6c8b0]' : 'bg-[#000]'
        }`}></div>
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
          className={`absolute h-5 w-3 border rounded shadow-lg flex items-center justify-center z-30 cursor-ew-resize transition-none user-select-none ${
            dragging 
              ? `scale-110 border-console-accent/50 ${isLight ? 'bg-[#f8f0e0]' : 'bg-[#333]'}` 
              : 'hover:scale-105'
          } ${
            isLight 
              ? 'bg-[#f0e6d3] border-[#d6c8b1] shadow-[0_2px_4px_rgba(0,0,0,0.1)]' 
              : 'bg-[#2a2a2a] border-[#000] shadow-lg'
          }`}
          style={{ left: `calc(${percent}% - 6px)`, touchAction: 'none', pointerEvents: 'auto' }}
        >
          <div className={`w-full h-[1px] pointer-events-none ${
            isLight ? 'bg-black/10' : 'bg-white/30'
          }`}></div>
        </div>
      </div>
    </div>
  );
};
