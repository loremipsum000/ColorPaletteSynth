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
  const cmyk = safeConvert(c, 'cmyk');
  if (!cmyk) return "0 0 0 1";
  return `${Math.round(cmyk.c * 100)} ${Math.round(cmyk.m * 100)} ${Math.round(cmyk.y * 100)} ${Math.round(cmyk.k * 100)}`;
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

