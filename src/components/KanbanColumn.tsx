import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
  title: LeadStatus;
  leads: Lead[];
  onLeadDrop: (leadId: number, newStatus: LeadStatus) => void;
  onLeadClick: (lead: Lead) => void;
}

// Improved color scheme for better semantic meaning: yellow for new, blue for in-progress, green for success.
const statusColors: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  [LeadStatus.CAPTURADOS]: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  [LeadStatus.ATENDIDOS]: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  [LeadStatus.VENDAS_REALIZADAS]: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
};


const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, leads, onLeadDrop, onLeadClick }) => {
  const [isOver, setIsOver] = useState(false);
  const colors = statusColors[title] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessário para permitir o drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const leadId = parseInt(e.dataTransfer.getData('leadId'), 10);
    if (!isNaN(leadId)) {
        onLeadDrop(leadId, title);
    }
    setIsOver(false);
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };


  return (
    <div 
      className={`rounded-lg flex flex-col h-full transition-all duration-200 border-2 ${
        isOver 
            ? `bg-primary/5 border-primary border-dashed scale-[1.01]` 
            : `bg-light border-transparent`
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className={`p-3 rounded-t-lg border-b ${colors.bg} ${colors.border}`}>
        <div className="flex justify-between items-center">
             <h3 className={`font-bold text-sm uppercase ${colors.text}`}>{title}</h3>
             <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/50 ${colors.text}`}>{leads.length}</span>
        </div>
      </div>
      <div className="p-2 flex-grow h-0 overflow-y-auto">
        {leads.length > 0 ? leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />
        )) : (
            <div className={`h-full flex items-center justify-center text-sm text-text-secondary opacity-50 border-2 border-dashed border-gray-200 rounded-md m-2 ${isOver ? 'hidden' : ''}`}>
                Arraste leads aqui
            </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;