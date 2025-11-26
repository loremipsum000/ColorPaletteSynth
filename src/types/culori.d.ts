declare module 'culori' {
  export function parse(color: string): any;
  export function converter(format: string): ((color: any) => any) | null;
  export function formatHex(color: any): string;
  export function random(): any;
}

