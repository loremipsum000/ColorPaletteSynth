'use client';

import { useState, useRef, useEffect } from 'react';

interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  onChange: (value: number) => void;
  theme?: 'light' | 'dark';
}

export const Knob = ({ value, min = 0, max = 100, label, onChange, theme = 'dark' }: KnobProps) => {
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startVal = useRef(0);
  const onChangeRef = useRef(onChange);
  const minRef = useRef(min);
  const maxRef = useRef(max);

  useEffect(() => {
    onChangeRef.current = onChange;
    minRef.current = min;
    maxRef.current = max;
  }, [onChange, min, max]);

  // Create stable handlers ONCE that read from refs
  const handleMouseMove = useRef((e: MouseEvent) => {
    const delta = startY.current - e.clientY;
    const range = maxRef.current - minRef.current;
    const sensitivity = 0.5;
    let newVal = startVal.current + (delta * sensitivity * (range / 100));
    newVal = Math.max(minRef.current, Math.min(maxRef.current, newVal));
    onChangeRef.current(newVal);
  }).current;

  const handleMouseUp = useRef(() => {
    setDragging(false);
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }).current;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startY.current = e.clientY;
    startVal.current = value;
    document.body.style.cursor = 'ns-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const percent = (value - min) / (max - min);
  const rotation = -135 + (percent * 270);

  const isLight = theme === 'light';

  return (
    <div className="flex flex-col items-center gap-3 select-none group">
      <div
        onMouseDown={handleMouseDown}
        className={`relative w-14 h-14 rounded-full border flex items-center justify-center cursor-ns-resize active:scale-95 transition-transform ${
          isLight 
            ? 'bg-[#f0e6d2] shadow-[0_4px_10px_rgba(69,54,36,0.2),_inset_0_1px_0_rgba(255,255,255,0.5)] border-[#d8cbb5]' 
            : 'bg-console-surface shadow-knob border-[#000]'
        }`}
        style={{ 
          background: isLight 
            ? 'conic-gradient(from 180deg, #e6dcc8 0%, #f5ebd7 50%, #e6dcc8 100%)' 
            : 'conic-gradient(from 180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)' 
        }}
      >
        <div className="absolute w-full h-full rounded-full" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-3.5 bg-console-accent rounded-sm shadow-[0_0_8px_rgba(245,166,35,0.4)]"></div>
        </div>
        <div className={`w-9 h-9 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,1)] border flex items-center justify-center ${
          isLight ? 'bg-[#e8dec9] border-[#d6c8b1]' : 'bg-[#111] border-[#222]'
        }`}></div>
      </div>
      <div className="text-center">
        <div className={`text-[9px] font-bold tracking-widest uppercase mb-1 ${
          isLight ? 'text-[#7a7363]' : 'text-console-subtext'
        }`}>{label}</div>
        <div className={`text-[10px] font-mono px-1 rounded border ${
          dragging ? 'text-console-accent border-console-accent/30' : ''
        } ${
          isLight 
            ? 'bg-[#fbf4e6] text-[#1f1b16] border-[#dcd0bc]' 
            : 'bg-[#050505] text-console-text border-[#222]'
        }`}>
          {Math.round(value)}
        </div>
      </div>
    </div>
  );
};
