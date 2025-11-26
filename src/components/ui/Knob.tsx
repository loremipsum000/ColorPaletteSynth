'use client';

import { useState, useRef, useEffect } from 'react';

interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  onChange: (value: number) => void;
}

export const Knob = ({ value, min = 0, max = 100, label, onChange }: KnobProps) => {
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

  return (
    <div className="flex flex-col items-center gap-3 select-none group">
      <div
        onMouseDown={handleMouseDown}
        className="relative w-14 h-14 rounded-full bg-console-surface shadow-knob border border-[#000] flex items-center justify-center cursor-ns-resize active:scale-95 transition-transform"
        style={{ background: 'conic-gradient(from 180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)' }}
      >
        <div className="absolute w-full h-full rounded-full" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-3.5 bg-console-accent rounded-sm shadow-[0_0_8px_rgba(245,166,35,0.4)]"></div>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#111] shadow-[inset_0_1px_2px_rgba(0,0,0,1)] border border-[#222] flex items-center justify-center"></div>
      </div>
      <div className="text-center">
        <div className="text-[9px] font-bold text-console-subtext tracking-widest uppercase mb-1">{label}</div>
        <div className={`text-[10px] font-mono bg-[#050505] px-1 rounded text-console-text border border-[#222] ${dragging ? 'text-console-accent border-console-accent/30' : ''}`}>
          {Math.round(value)}
        </div>
      </div>
    </div>
  );
};
