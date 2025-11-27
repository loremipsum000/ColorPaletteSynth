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
import { RefreshCw, Download, ImageIcon, FileJson, ChevronDown, Copy, Check } from './ui/icons';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [donationMode, setDonationMode] = useState<'crypto' | 'fiat'>('crypto');
  const [isDonationsExpanded, setIsDonationsExpanded] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
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

  // Handle document theme classes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const themeIsLight = theme === 'light';
  const subTextColor = themeIsLight ? 'text-[#7a7363]' : 'text-console-subtext';
  const panelTextColor = themeIsLight ? 'text-[#1c1c1c]' : 'text-console-text';
  const rackBackground = themeIsLight ? 'bg-[#f9f4e8] border-[#dfd3c1]' : 'bg-[#111] border-[#222]';
  const gridBackground = themeIsLight ? 'bg-[#faf5eb] border-[#e5d8c5]' : 'bg-[#0e0e0e] border-[#1a1a1a]';
  const controlDeckBackground = themeIsLight ? 'bg-[#fff8ed] border-[#e2d6c3]' : 'bg-[#131313] border-[#090909]';
  const panelSurface = themeIsLight ? 'bg-[#fff7ec] border-[#decfb9]' : 'bg-[#1a1a1a] border-black';
  const knobSurface = themeIsLight ? 'bg-[#fff6e6] border-[#e0cfb4]' : 'bg-[#1a1a1a] border-black';
  const inputBgClass = themeIsLight ? 'bg-[#fbf4e6] border-[#dcd0bc] text-[#1f1b16]' : 'bg-[#080808] border-[#222] text-console-text';
  const randomButtonClass = themeIsLight
    ? 'w-8 h-8 bg-[#f0e3cc] rounded border border-[#d7c7ac] flex items-center justify-center text-[#5f4f36] hover:bg-[#e7dac1]'
    : 'w-8 h-8 bg-[#222] rounded border border-[#333] flex items-center justify-center text-console-subtext hover:text-white';
  const modeActiveClass = themeIsLight ? 'bg-[#201b16] text-[#fefaf1]' : 'bg-[#333] text-white';
  const modeIdleClass = themeIsLight ? 'bg-[#f0e6d3] text-[#5f523f]' : 'bg-[#111] text-console-subtext';
  const donationTabBase = 'px-3 py-1 rounded-full border text-[10px] font-semibold transition-colors';
  const donationTabActive = themeIsLight ? 'bg-[#201b16] text-[#fffaf2] border-[#201b16]' : 'bg-[#2d2d2d] text-white border-[#444]';
  const donationTabIdle = themeIsLight ? 'bg-[#f1e5cf] text-[#5d4c33] border-[#dac9ae]' : 'bg-[#111] text-console-subtext border-[#333]';
  const donationCardClass = themeIsLight ? 'bg-white border-[#e6dac5] text-[#1f1b16]' : 'bg-[#0d0d0d] border-[#222] text-console-text';

  const cryptoWallets = [
    { label: 'EVM', tag: 'Ethereum / EVM', address: '0x9B7bb0cB4A82aEFb722073eb397c5d59417BD381' },
    { label: 'Sol', tag: 'Solana', address: 'G22c41qKv6AURViwHst8wUxoJnkExeknsLRVd5Yatzxv' },
    { label: 'BTC', tag: 'Taproot', address: 'bc1pr6nex2teuxsfl40k9j6lu99glqp0swagq85dwhawp8879hdxs9ksxxq0lq' },
  ];

  const fiatOptions = [
    { label: 'Revolut', value: '@loremipsum00', description: 'revtag' },
  ];

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const shortenAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mt-6 sm:mt-12 mb-6 sm:mb-12">
      <div className={`w-full rounded-lg flex flex-col overflow-hidden border relative transition-colors duration-300 ${
        themeIsLight
          ? 'bg-[#f4f1eb] text-[#1f1b16] border-[#dcd2c2] shadow-[0_30px_60px_rgba(69,54,36,0.18)]'
          : 'bg-[#161616] text-console-text border-[#222] shadow-chassis'
      }`}>
        {/* Chassis Screws */}
        <div className="absolute top-2 left-2"><Screw /></div>
        <div className="absolute top-2 right-2"><Screw /></div>
        <div className="absolute bottom-2 left-2"><Screw /></div>
        <div className="absolute bottom-2 right-2"><Screw /></div>

        {/* Branding Bar */}
        <div className={`min-h-[3.5rem] flex flex-col md:flex-row items-center px-4 py-2 md:py-0 justify-between select-none relative z-10 border-b transition-colors duration-300 gap-2 md:gap-0 ${
          themeIsLight ? 'bg-[#fff8ec] border-[#e2d6c4]' : 'bg-[#141414] border-[#2a2a2a]'
        }`}>
          {/* Texture overlay for panel */}
          <div className="absolute inset-0 bg-metal opacity-15 pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-4 h-4 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.2)] ${themeIsLight ? 'bg-[#1f1b16]' : 'bg-console-text'}`}></div>
            <span className={`text-sm font-bold tracking-[0.2em] ${panelTextColor}`}>
              COLOR<span className="text-console-accent">SYNTH</span> <span className="font-light opacity-60">3000</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 relative z-10 flex-wrap justify-center">
            <div className={`text-[9px] font-mono flex gap-4 ${subTextColor}`}>
              <span>PHASE: SYNC</span>
              <span className="hidden sm:inline">OUT: 16-BIT</span>
              <span className="text-console-accent flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-console-accent rounded-full animate-pulse"></span> ONLINE
              </span>
            </div>
            <PushButton 
              active={false} 
              onClick={toggleTheme} 
              theme={theme} 
              className="h-8 px-4 !flex-row"
            >
              {themeIsLight ? 'Dark Mode' : 'Light Mode'}
            </PushButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row lg:h-[720px] relative z-0">

          {/* LEFT RACK: MONITORS */}
          <div className={`w-full md:w-[340px] p-6 flex flex-col gap-6 relative border-r transition-colors duration-300 order-2 md:order-1 ${rackBackground}`}>
            <div className="absolute inset-0 bg-metal opacity-10 pointer-events-none"></div>

            {/* Monitor Module */}
            <div className="flex-1 min-h-[280px]">
              <DataScreen color={baseColorHex} />
            </div>

            {/* Phase Module */}
            <div className={`h-[280px] rounded border shadow-slot relative p-4 flex flex-col items-center transition-colors duration-300 ${themeIsLight ? 'bg-[#fff1dc] border-[#e0ceb3]' : 'bg-[#0a0a0a] border-[#222]'}`}>
              <div className={`w-full flex justify-between mb-4 border-b pb-1 ${themeIsLight ? 'border-[#e3d1bb]' : 'border-[#222]'}`}>
                <span className={`text-[9px] font-bold tracking-widest ${subTextColor}`}>HARMONIC PHASE</span>
              </div>
              <div className="w-48 h-48 relative">
                <HarmonyWheel baseColor={baseColorHex} type={paletteType} onHueChange={handleHueChange} theme={theme} />
                <div className={`absolute -bottom-6 w-full text-center text-[9px] font-mono ${subTextColor}`}>INTERACTIVE</div>
              </div>
            </div>
          </div>

          {/* CENTER RACK: MAIN GRID */}
          <div className={`flex-1 p-6 h-[280px] md:h-auto min-h-[300px] flex flex-col relative border-r transition-colors duration-300 order-3 md:order-2 ${gridBackground}`}>
            <GridVisualizer colors={palette} effects={effects} />
          </div>

          {/* RIGHT RACK: CONTROL DECK */}
          <div className={`w-full md:w-[420px] p-6 flex flex-col gap-8 relative border-l transition-colors duration-300 order-1 md:order-3 ${controlDeckBackground}`}>
            <div className="absolute inset-0 bg-metal opacity-20 pointer-events-none"></div>

            {/* Color Input & Sliders */}
            <div className={`rounded border shadow-panel p-5 relative transition-colors duration-300 ${panelSurface}`}>
              <div className="absolute top-2 left-2"><Screw /></div><div className="absolute top-2 right-2"><Screw /></div>
              <div className="absolute bottom-2 left-2"><Screw /></div><div className="absolute bottom-2 right-2"><Screw /></div>

              <div className="flex gap-2 mb-6">
                <div className={`w-12 h-12 rounded border shadow-slot relative transition-colors duration-300 ${themeIsLight ? 'border-[#d6c8b1]' : 'border-[#333]'}`}>
                  <div className="absolute inset-0" style={{ backgroundColor: baseColorHex }}></div>
                  <div className="glass-overlay absolute inset-0"></div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex gap-1 h-6">
                    {(['oklch', 'rgb', 'hsl'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setEditMode(mode)}
                        className={`flex-1 text-[8px] font-bold uppercase tracking-wider rounded-sm transition-colors duration-200 ${editMode === mode ? modeActiveClass : modeIdleClass}`}
                      >
                        {mode}
                      </button>
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
                      className={`flex-1 h-8 rounded px-2 font-mono text-sm focus:outline-none transition-colors ${inputBgClass} ${
                        hexError
                          ? 'border-red-500 text-red-500 focus:border-red-500'
                          : 'focus:border-console-accent'
                        }`}
                    />
                    <button onClick={getRandomColor} className={randomButtonClass}><RefreshCw size={14} /></button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {sliderConfig.map(s => (
                  <Fader 
                    key={s.id} 
                    {...s} 
                    onChange={sliderHandlers[s.id]} 
                    theme={theme}
                  />
                ))}
              </div>
            </div>

            {/* Mode Selectors */}
            <div className="grid grid-cols-3 gap-3">
              {PALETTE_TYPES.map(t => (
                <PushButton key={t.id} active={paletteType === t.id} onClick={() => setPaletteType(t.id as typeof paletteType)} icon={t.icon} theme={theme}>{t.label}</PushButton>
              ))}
            </div>

            {/* FX Knobs */}
            <div className={`rounded border shadow-panel p-5 mt-auto relative transition-colors duration-300 ${knobSurface}`}>
              <div className="absolute top-2 left-2"><Screw /></div><div className="absolute top-2 right-2"><Screw /></div>
              <div className="absolute bottom-2 left-2"><Screw /></div><div className="absolute bottom-2 right-2"><Screw /></div>

              <div className={`text-[9px] font-bold tracking-widest text-center mb-4 ${subTextColor}`}>EFFECTS PROCESSOR</div>
              <div className="grid grid-cols-4 gap-2">
                <Knob label="SHADOW" value={effects.shadow} onChange={v => setEffects({ ...effects, shadow: v })} theme={theme} />
                <Knob label="GLOW" value={effects.glow} onChange={v => setEffects({ ...effects, glow: v })} theme={theme} />
                <Knob label="GRAIN" value={effects.grain} onChange={v => setEffects({ ...effects, grain: v })} theme={theme} />
                <Knob label="VIGNETTE" value={effects.vignette} onChange={v => setEffects({ ...effects, vignette: v })} theme={theme} />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <PushButton active={false} onClick={exportJSON} icon={FileJson} theme={theme} className="h-10">JSON</PushButton>
              <PushButton active={false} onClick={exportPNG} icon={ImageIcon} theme={theme} className="h-10">PNG</PushButton>
              <PushButton active={false} onClick={exportSVG} icon={Download} theme={theme} className="h-10">SVG</PushButton>
            </div>

          </div>
        </div>
      </div>

      <footer className="px-4 sm:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-start transition-colors duration-300">
        <div className="flex flex-col gap-1">
          <a
            href="https://x.com/Lorem_Ipsum95"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-semibold underline decoration-dotted underline-offset-4 ${panelTextColor}`}
          >
            Developed by Dardan Berisha
          </a>
          <span className={`text-[10px] uppercase tracking-widest opacity-60 font-medium ${panelTextColor}`}>Inspired by Dieter Rams</span>
        </div>

        <div className="flex-1 flex flex-col gap-3 lg:ml-auto lg:max-w-xl">
          <div className="flex flex-wrap items-center gap-3 cursor-pointer select-none" onClick={() => setIsDonationsExpanded(!isDonationsExpanded)}>
            <span className={`text-xs font-semibold ${panelTextColor}`}>Support the console</span>
            <div className={`transition-transform duration-200 ${isDonationsExpanded ? 'rotate-180' : ''}`}>
               <ChevronDown size={16} className={panelTextColor} />
            </div>
          </div>

          {isDonationsExpanded && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex gap-2 mb-3">
                <PushButton
                  active={donationMode === 'crypto'}
                  onClick={() => setDonationMode('crypto')}
                  theme={theme}
                  className="h-8 px-4 !flex-row"
                >
                  Crypto
                </PushButton>
                <PushButton
                  active={donationMode === 'fiat'}
                  onClick={() => setDonationMode('fiat')}
                  theme={theme}
                  className="h-8 px-4 !flex-row"
                >
                  Fiat
                </PushButton>
              </div>

              <div className="min-h-[160px] transition-all duration-300">
                {donationMode === 'crypto' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {cryptoWallets.map(wallet => (
                      <div key={wallet.label} className={`rounded border px-3 py-2 flex flex-col gap-2 ${donationCardClass} min-w-0`}>
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="whitespace-nowrap">{wallet.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] truncate ${themeIsLight ? 'bg-[#f1e3ca] text-[#604d34]' : 'bg-[#1e1e1e] text-console-text'}`}>
                              {wallet.tag}
                            </span>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(wallet.address)}
                            className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors shrink-0 ${themeIsLight ? 'text-[#5f4f36]' : 'text-console-subtext'}`}
                            title="Copy Address"
                          >
                            {copiedAddress === wallet.address ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="font-mono text-xs opacity-80 leading-relaxed" title={wallet.address}>{shortenAddress(wallet.address)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`rounded border px-3 py-3 flex flex-col gap-3 ${donationCardClass} h-full`}>
                    {fiatOptions.map(option => (
                      <div key={option.label} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <span>{option.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide ${themeIsLight ? 'bg-[#f1e4cd] text-[#5f4d33]' : 'bg-[#1f1f1f] text-console-text'}`}>
                              {option.description}
                            </span>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(option.value)}
                            className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${themeIsLight ? 'text-[#5f4f36]' : 'text-console-subtext'}`}
                            title="Copy Tag"
                          >
                             {copiedAddress === option.value ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="font-mono text-sm opacity-80">{option.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
