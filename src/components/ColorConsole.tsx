'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import * as culori from 'culori';
import { safeConvert } from '@/lib/color-utils';
import { PALETTE_TYPES } from '@/lib/constants';
import { Screw } from './ui/Screw';
import { Knob } from './ui/Knob';
import { PushButton } from './ui/PushButton';
import { Fader } from './ui/Fader';
import { DataScreen } from './color/DataScreen';
import { GridVisualizer } from './color/GridVisualizer';
import { HarmonyWheel } from './color/HarmonyWheel';
import { RefreshCw, Download, ImageIcon, FileJson } from './ui/icons';

export const ColorConsole = () => {
  // High precision state: holds the actual object (oklch, rgb, etc.)
  const [colorState, setColorState] = useState(() => {
    const c = culori.parse("#3c98f6");
    const converter = culori.converter('oklch');
    if (!converter) return { l: 0.5, c: 0.2, h: 240 };
    const converted = converter(c);
    return converted || { l: 0.5, c: 0.2, h: 240 };
  });
  const [paletteType, setPaletteType] = useState<'analogous' | 'monochromatic' | 'triad' | 'tetrad' | 'complementary' | 'split'>('analogous');
  const [editMode, setEditMode] = useState<'oklch' | 'rgb' | 'hsl'>('oklch');
  const [effects, setEffects] = useState({ shadow: 10, glow: 5, grain: 20, vignette: 30 });
  const [hexInput, setHexInput] = useState('');
  const [hexError, setHexError] = useState(false);
  const isHexInputFocusedRef = useRef(false);
  const lastSyncedHexRef = useRef('');

  // Derive the Hex string for display/Input
  const baseColorHex = useMemo(() => culori.formatHex(colorState), [colorState]);

  // Initialize hex input on mount only
  useEffect(() => {
    const initialHex = baseColorHex.toUpperCase();
    setHexInput(initialHex);
    lastSyncedHexRef.current = initialHex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync hex input when color changes externally (but not when user is typing)
  useEffect(() => {
    // Only sync if the user is not currently editing the hex input
    // and the color actually changed from an external source
    if (!isHexInputFocusedRef.current && baseColorHex.toUpperCase() !== lastSyncedHexRef.current) {
      setHexInput(baseColorHex.toUpperCase());
      setHexError(false);
      lastSyncedHexRef.current = baseColorHex.toUpperCase();
    }
  }, [baseColorHex]);

  const palette = useMemo(() => {
    const converter = culori.converter('oklch');
    if (!converter) return [];
    const base = converter(colorState);
    if (!base) return [];
    let colors: string[] = [];

    const getHues = () => {
      if (paletteType === 'analogous') return [-30, -15, 0, 15, 30];
      if (paletteType === 'triad') return [0, 120, 240, 120, 240];
      if (paletteType === 'tetrad') return [0, 90, 180, 270, 0];
      if (paletteType === 'complementary') return [0, 180, 0, 180, 0];
      if (paletteType === 'split') return [0, 150, 210, 150, 210];
      if (paletteType === 'monochromatic') return [0, 0, 0, 0, 0];
      return [0, 0, 0, 0, 0];
    };

    const hues = getHues();

    colors = hues.map((hOffset, i) => {
      let c = { ...base, h: ((base.h || 0) + hOffset) % 360 };
      if (paletteType === 'monochromatic') {
        c.l = Math.max(0.1, Math.min(0.95, 0.2 + (i * 0.15)));
      } else if (paletteType === 'complementary' && i > 1) {
        c.l = i % 2 === 0 ? (base.l || 0.5) + 0.2 : (base.l || 0.5) - 0.2;
      }
      return culori.formatHex(c);
    });

    return colors;
  }, [colorState, paletteType]);

  const handleSliderChange = useCallback((channel: string, val: number) => {
    // Get color in current edit mode (ensure we work on the mode the slider represents)
    let current = safeConvert(colorState, editMode);
    if (!current) return;

    // Create a NEW object with the updated channel value
    // This ensures React detects the state change (new object reference)
    const updated = { ...current, [channel]: val };

    // Set state with the NEW object reference
    // We do NOT convert back to hex or oklch immediately to avoid precision loss.
    // We trust culori's converters to handle the object in the next render.
    setColorState(updated);
  }, [colorState, editMode]);

  const handleHueChange = (newHue: number) => {
    let current = safeConvert(colorState, 'oklch');
    if (!current) return;
    
    // Create a NEW object with the updated hue
    // This ensures React detects the state change (new object reference)
    const updated = { ...current, h: newHue };
    
    // Set state with the NEW object reference
    setColorState(updated);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const upperVal = val.toUpperCase();
    setHexInput(upperVal);

    // Allow partial hex input - only validate format, not completeness
    const hexPattern = /^#?[0-9A-Fa-f]{0,6}$/;
    
    // Clear error if format is valid (even if incomplete)
    if (hexPattern.test(upperVal)) {
      setHexError(false);
      
      // Only update color if we have a complete, valid hex (3 or 6 digits after #)
      const cleanHex = upperVal.replace('#', '');
      if (cleanHex.length === 3 || cleanHex.length === 6) {
        const hexWithHash = upperVal.startsWith('#') ? upperVal : `#${upperVal}`;
        const c = culori.parse(hexWithHash);
        if (c) {
          const converter = culori.converter('oklch');
          if (converter) {
            const converted = converter(c);
            if (converted) {
              setColorState(converted);
              lastSyncedHexRef.current = hexWithHash.toUpperCase();
            }
          }
        }
      }
    } else {
      // Show error only if format is invalid (contains non-hex characters)
      setHexError(true);
    }
  };

  const handleHexFocus = () => {
    isHexInputFocusedRef.current = true;
  };

  const handleHexBlur = () => {
    isHexInputFocusedRef.current = false;
    
    // On blur, try to parse and update if valid, or show error
    const cleanHex = hexInput.replace('#', '');
    if (cleanHex.length === 3 || cleanHex.length === 6) {
      const hexWithHash = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
      const c = culori.parse(hexWithHash);
      if (c) {
        setHexError(false);
        const converter = culori.converter('oklch');
        if (converter) {
          const converted = converter(c);
          if (converted) {
            setColorState(converted);
            lastSyncedHexRef.current = hexWithHash.toUpperCase();
          }
        }
      } else {
        setHexError(true);
      }
    } else if (hexInput && hexInput.trim() !== '') {
      // If there's input but it's incomplete, show error
      setHexError(true);
    } else {
      // Empty input is fine
      setHexError(false);
    }
  };

  const getRandomColor = () => {
    const rand = culori.random();
    const converter = culori.converter('oklch');
    if (converter) {
      const converted = converter(rand);
      if (converted) setColorState(converted);
    }
  };

  // Store handleSliderChange in a ref so it's always current
  const handleSliderChangeRef = useRef(handleSliderChange);
  useEffect(() => {
    handleSliderChangeRef.current = handleSliderChange;
  }, [handleSliderChange]);

  // Calculate slider values from the current HIGH PRECISION state, converted to edit mode on the fly
  const sliderConfig = useMemo(() => {
    const c = safeConvert(colorState, editMode) || {};

    if (editMode === 'rgb') return [
      { id: 'r', label: 'RED', max: 1, val: (c as any).r || 0, color: '#ff4444' },
      { id: 'g', label: 'GRN', max: 1, val: (c as any).g || 0, color: '#44ff44' },
      { id: 'b', label: 'BLU', max: 1, val: (c as any).b || 0, color: '#4444ff' }
    ];
    if (editMode === 'oklch') return [
      { id: 'l', label: 'LUM', max: 1, val: (c as any).l || 0, color: '#ffffff' },
      { id: 'c', label: 'CHR', max: 0.4, val: (c as any).c || 0, color: '#F5A623' },
      { id: 'h', label: 'HUE', max: 360, val: (c as any).h || 0, color: culori.formatHex({ ...(c as any), c: 0.2, l: 0.8 }) || '#ffffff' }
    ];
    if (editMode === 'hsl') return [
      { id: 'h', label: 'HUE', max: 360, val: (c as any).h || 0, color: '#fff' },
      { id: 's', label: 'SAT', max: 1, val: (c as any).s || 0, color: '#ccc' },
      { id: 'l', label: 'LGT', max: 1, val: (c as any).l || 0, color: '#888' }
    ];
    return [];
  }, [colorState, editMode]);

  // Create stable onChange handlers that never change
  const sliderHandlers = useMemo(() => {
    const handlers: Record<string, (v: number) => void> = {};
    sliderConfig.forEach(s => {
      // Create a stable handler that reads from the ref
      handlers[s.id] = (v: number) => handleSliderChangeRef.current(s.id, v);
    });
    return handlers;
  }, [sliderConfig]);

  // --- EXPORT FUNCTIONS ---
  const exportJSON = () => {
    const data = JSON.stringify({ base: baseColorHex, palette, type: paletteType }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'braun-palette.json';
    a.click();
  };

  const exportSVG = () => {
    const rects = palette.map((color, i) =>
      `<rect x="${i * 100}" y="0" width="100" height="200" fill="${color}" />`
    ).join('');

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${palette.length * 100}" height="200">
    ${rects}
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'braun-palette.svg';
    a.click();
  };

  const exportPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = palette.length * 100;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    palette.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(i * 100, 0, 100, 200);
    });

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'braun-palette.png';
    a.click();
  };

  return (
    <div className="w-full max-w-[1200px] bg-console-chassis rounded-lg shadow-chassis flex flex-col overflow-hidden border border-[#222] relative">
      {/* Chassis Screws */}
      <div className="absolute top-2 left-2"><Screw /></div>
      <div className="absolute top-2 right-2"><Screw /></div>
      <div className="absolute bottom-2 left-2"><Screw /></div>
      <div className="absolute bottom-2 right-2"><Screw /></div>

      {/* Branding Bar */}
      <div className="h-14 bg-[#141414] border-b border-[#2a2a2a] flex items-center px-8 justify-between select-none relative z-10">
        {/* Texture overlay for panel */}
        <div className="absolute inset-0 bg-metal opacity-20 pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-4 h-4 bg-console-text rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
          <span className="text-sm font-bold tracking-[0.2em] text-console-text">COLOR<span className="text-console-accent">CONSOLE</span> <span className="font-light opacity-50">3000 PRO</span></span>
        </div>
        <div className="text-[9px] font-mono text-console-subtext flex gap-6 relative z-10">
          <span>PHASE: SYNC</span>
          <span>OUT: 16-BIT</span>
          <span className="text-console-accent flex items-center gap-1"><span className="w-1.5 h-1.5 bg-console-accent rounded-full animate-pulse"></span> ONLINE</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[720px] relative z-0">

        {/* LEFT RACK: MONITORS */}
        <div className="w-full md:w-[340px] bg-[#111] border-r border-[#222] p-6 flex flex-col gap-6 relative">
          <div className="absolute inset-0 bg-metal opacity-10 pointer-events-none"></div>

          {/* Monitor Module */}
          <div className="flex-1 min-h-[280px]">
            <DataScreen color={baseColorHex} />
          </div>

          {/* Phase Module */}
          <div className="h-[280px] bg-[#0a0a0a] rounded border border-[#222] shadow-slot relative p-4 flex flex-col items-center">
            <div className="w-full flex justify-between mb-4 border-b border-[#222] pb-1">
              <span className="text-[9px] font-bold text-console-subtext tracking-widest">HARMONIC PHASE</span>
            </div>
            <div className="w-48 h-48 relative">
              <HarmonyWheel baseColor={baseColorHex} type={paletteType} onHueChange={handleHueChange} />
              <div className="absolute -bottom-6 w-full text-center text-[9px] text-console-subtext font-mono">INTERACTIVE</div>
            </div>
          </div>
        </div>

        {/* CENTER RACK: MAIN GRID */}
        <div className="flex-1 bg-[#0e0e0e] p-6 flex flex-col relative border-r border-[#1a1a1a]">
          <GridVisualizer colors={palette} effects={effects} />
        </div>

        {/* RIGHT RACK: CONTROL DECK */}
        <div className="w-full md:w-[420px] bg-[#131313] p-6 flex flex-col gap-8 relative">
          <div className="absolute inset-0 bg-metal opacity-20 pointer-events-none"></div>

          {/* Color Input & Sliders */}
          <div className="bg-[#1a1a1a] rounded border border-black shadow-panel p-5 relative">
            <div className="absolute top-2 left-2"><Screw /></div><div className="absolute top-2 right-2"><Screw /></div>
            <div className="absolute bottom-2 left-2"><Screw /></div><div className="absolute bottom-2 right-2"><Screw /></div>

            <div className="flex gap-2 mb-6">
              <div className="w-12 h-12 rounded border border-[#333] shadow-slot relative">
                <div className="absolute inset-0" style={{ backgroundColor: baseColorHex }}></div>
                <div className="glass-overlay absolute inset-0"></div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex gap-1 h-6">
                  {(['oklch', 'rgb', 'hsl'] as const).map(mode => (
                    <button key={mode} onClick={() => setEditMode(mode)} className={`flex-1 text-[8px] font-bold uppercase tracking-wider rounded-sm ${editMode === mode ? 'bg-[#333] text-white' : 'bg-[#111] text-console-subtext'}`}>{mode}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexInput}
                    onFocus={handleHexFocus}
                    onBlur={handleHexBlur}
                    placeholder="#000000"
                    className={`flex-1 h-8 bg-[#080808] border rounded px-2 font-mono text-sm focus:outline-none transition-colors ${
                      hexError
                        ? 'border-red-500 text-red-400 focus:border-red-400'
                        : 'border-[#222] text-console-text focus:border-console-accent'
                      }`}
                  />
                  <button onClick={getRandomColor} className="w-8 h-8 bg-[#222] rounded border border-[#333] flex items-center justify-center text-console-subtext hover:text-white"><RefreshCw size={14} /></button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {sliderConfig.map(s => (
                <Fader 
                  key={s.id} 
                  {...s} 
                  onChange={sliderHandlers[s.id]} 
                />
              ))}
            </div>
          </div>

          {/* Mode Selectors */}
          <div className="grid grid-cols-3 gap-3">
            {PALETTE_TYPES.map(t => (
              <PushButton key={t.id} active={paletteType === t.id} onClick={() => setPaletteType(t.id as typeof paletteType)} icon={t.icon}>{t.label}</PushButton>
            ))}
          </div>

          {/* FX Knobs */}
          <div className="bg-[#1a1a1a] rounded border border-black shadow-panel p-5 mt-auto relative">
            <div className="absolute top-2 left-2"><Screw /></div><div className="absolute top-2 right-2"><Screw /></div>
            <div className="absolute bottom-2 left-2"><Screw /></div><div className="absolute bottom-2 right-2"><Screw /></div>

            <div className="text-[9px] font-bold text-console-subtext tracking-widest text-center mb-4">EFFECTS PROCESSOR</div>
            <div className="grid grid-cols-4 gap-2">
              <Knob label="SHADOW" value={effects.shadow} onChange={v => setEffects({ ...effects, shadow: v })} />
              <Knob label="GLOW" value={effects.glow} onChange={v => setEffects({ ...effects, glow: v })} />
              <Knob label="GRAIN" value={effects.grain} onChange={v => setEffects({ ...effects, grain: v })} />
              <Knob label="VIGNETTE" value={effects.vignette} onChange={v => setEffects({ ...effects, vignette: v })} />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button onClick={exportJSON} className="flex-1 h-8 bg-[#222] rounded border border-[#333] flex items-center justify-center gap-2 text-[10px] font-bold text-console-subtext hover:text-white hover:bg-[#2a2a2a]"><FileJson size={12} /> JSON</button>
            <button onClick={exportPNG} className="flex-1 h-8 bg-[#222] rounded border border-[#333] flex items-center justify-center gap-2 text-[10px] font-bold text-console-subtext hover:text-white hover:bg-[#2a2a2a]"><ImageIcon size={12} /> PNG</button>
            <button onClick={exportSVG} className="flex-1 h-8 bg-[#222] rounded border border-[#333] flex items-center justify-center gap-2 text-[10px] font-bold text-console-subtext hover:text-white hover:bg-[#2a2a2a]"><Download size={12} /> SVG</button>
          </div>

        </div>
      </div>
    </div>
  );
};

