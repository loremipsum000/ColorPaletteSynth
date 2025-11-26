'use client';

import React from 'react';

interface PushButtonProps {
  children?: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

export const PushButton = ({ children, active, onClick, className = "", icon: Icon }: PushButtonProps) => (
  <button
    onClick={onClick}
    className={`
      relative h-12 rounded bg-gradient-to-b from-[#252525] to-[#1a1a1a] border border-black shadow-btn flex flex-col items-center justify-center gap-1 px-3
      transition-all duration-75 active:shadow-btn-active active:translate-y-[1px]
      ${active ? 'from-[#1a1a1a] to-[#151515] shadow-btn-active border-console-accent/20' : 'hover:from-[#2a2a2a] hover:to-[#202020]'}
      ${className}
    `}
  >
    {Icon && <Icon size={16} strokeWidth={2} className={active ? 'text-console-accent' : 'text-console-subtext'} />}
    {children && <span className={`text-[9px] font-bold tracking-wider uppercase ${active ? 'text-console-accent' : 'text-console-subtext'}`}>{children}</span>}
    {active && <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-console-accent shadow-[0_0_6px_#F5A623]"></div>}
  </button>
);

