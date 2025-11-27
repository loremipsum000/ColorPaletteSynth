'use client';

import React from 'react';

interface PushButtonProps {
  children?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  theme?: 'light' | 'dark';
}

export const PushButton = ({ children, active, onClick, className = "", icon: Icon, theme = 'dark' }: PushButtonProps) => {
  const isLight = theme === 'light';
  
  return (
    <button
      onClick={onClick}
      className={`
        relative h-12 rounded flex flex-col items-center justify-center gap-1 px-3
        transition-all duration-75 active:translate-y-[1px]
        ${isLight 
          ? `border shadow-[0_3px_6px_rgba(69,54,36,0.15),_inset_0_1px_0_rgba(255,255,255,0.8),_inset_0_0_0_1px_rgba(160,140,110,0.1)]
             bg-gradient-to-b from-[#fffcf5] to-[#f2e5cd]
             ${active ? 'from-[#f2e5cd] to-[#e8dab8] border-[#d6c6ab] shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]' : 'hover:from-[#fffefb] hover:to-[#f8ebd5] border-[#d6c6ab]'}`
          : `bg-gradient-to-b from-[#252525] to-[#1a1a1a] border border-black shadow-btn
             ${active ? 'from-[#1a1a1a] to-[#151515] shadow-btn-active border-console-accent/20' : 'hover:from-[#2a2a2a] hover:to-[#202020]'}`
        }
        ${className}
      `}
    >
      {Icon && <Icon size={16} strokeWidth={2} className={active ? 'text-console-accent' : (isLight ? 'text-[#8a7f6b]' : 'text-console-subtext')} />}
      {children && <span className={`text-[9px] font-bold tracking-wider uppercase ${active ? 'text-console-accent' : (isLight ? 'text-[#8a7f6b]' : 'text-console-subtext')}`}>{children}</span>}
      {active && <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-console-accent shadow-[0_0_6px_#F5A623]"></div>}
    </button>
  );
};
