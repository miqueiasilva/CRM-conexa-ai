import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LEAD_SOURCES_DATA } from '../constants';

const COLORS = ['#2563EB', '#10B981', '#F97316', '#8B5CF6'];

const LeadSourceChart: React.FC = () => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm h-full">
      <h2 className="text-lg font-bold mb-4 text-text-primary">Origem dos Leads</h2>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={LEAD_SOURCES_DATA}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={85}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {LEAD_SOURCES_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                color: '#1F2937'
              }}
            />
            <Legend iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadSourceChart;