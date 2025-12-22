
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LEAD_SOURCES_DATA } from '../constants';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#6366F1'];

const LeadSourceChart: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full">
      <h2 className="text-lg font-black text-slate-900 mb-6">Origem dos Leads</h2>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={LEAD_SOURCES_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
            >
              {LEAD_SOURCES_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadSourceChart;
