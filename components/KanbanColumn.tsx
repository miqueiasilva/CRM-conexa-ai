
import React from 'react';
import { Lead, LeadStatus } from '../types';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
  title: LeadStatus;
  leads: Lead[];
  onLeadDrop: (leadId: number, newStatus: LeadStatus) => void;
  onLeadClick: (lead: Lead) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, leads, onLeadDrop, onLeadClick }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const leadId = parseInt(e.dataTransfer.getData('leadId'), 10);
    onLeadDrop(leadId, title);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="bg-slate-100/50 rounded-[2.5rem] p-6 flex flex-col h-full min-w-[320px] border-2 border-transparent hover:border-blue-100 transition-colors"
    >
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h3>
        <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-blue-600 shadow-sm border border-slate-100">
          {leads.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />
        ))}
        {leads.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-xs font-bold text-slate-300">
            Arraste leads aqui
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
