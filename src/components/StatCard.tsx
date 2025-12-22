
import React from 'react';
import * as Icons from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  // @ts-ignore
  const IconComponent = Icons[icon] || Icons.Activity;

  return (
    <div className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 md:gap-5 group hover:shadow-md transition-all">
      <div 
        className="p-3.5 md:p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 flex items-center justify-center flex-shrink-0" 
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <IconComponent size={22} className="md:w-6 md:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{title}</p>
        <p className="text-xl md:text-2xl font-black text-slate-900 leading-none truncate">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
