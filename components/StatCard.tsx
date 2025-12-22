
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
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-md transition-all">
      <div 
        className="p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 flex items-center justify-center" 
        style={{ backgroundColor: `${color}10`, color: color }}
      >
        <IconComponent size={24} />
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
