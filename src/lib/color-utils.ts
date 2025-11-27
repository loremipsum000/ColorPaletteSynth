import * as culori from 'culori';

export const safeConvert = (c: any, format: string) => {
  try {
    if (!c) return null;
    const converter = culori.converter(format);
    return converter ? converter(c) : null;
  } catch (e) {
    return null;
  }
};

export const formatCMYK = (c: any) => {
  // Manual calculation from RGB to ensure accurate CMYK values
  // culori's cmyk converter might return 0 0 0 1 for some colors if profile is missing
  const rgb = safeConvert(c, 'rgb');
  if (!rgb) return "0 0 0 1";

  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  const k = 1 - Math.max(r, g, b);
  
  if (k === 1) {
    return "0 0 0 100";
  }

  const cyan = (1 - r - k) / (1 - k);
  const magenta = (1 - g - k) / (1 - k);
  const yellow = (1 - b - k) / (1 - k);

  return `${Math.round(cyan * 100)} ${Math.round(magenta * 100)} ${Math.round(yellow * 100)} ${Math.round(k * 100)}`;
};

export const generateGrid = (colors: string[]) => {
  return colors.map(base => {
    const converter = culori.converter('oklch');
    if (!converter) return [];
    const c = converter(base);
    if (!c) return [];
    const steps = [];
    for (let i = 0; i < 9; i++) {
      const l = Math.max(0.02, Math.min(0.98, (c.l || 0.5) + (4 - i) * 0.11));
      steps.push(culori.formatHex({ ...c, l }));
    }
    return steps;
  });
};
