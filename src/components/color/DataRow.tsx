'use client';

interface DataRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export const DataRow = ({ label, value, highlight }: DataRowProps) => (
  <div className="flex justify-between items-baseline border-b border-[#222] pb-1 min-w-0">
    <span className="text-[10px] text-console-subtext tracking-wider shrink-0 mr-4">{label}</span>
    <span className={`font-mono text-[11px] whitespace-nowrap overflow-hidden text-ellipsis ${highlight ? 'text-console-blue' : 'text-console-text opacity-90'}`}>
      {value}
    </span>
  </div>
);

