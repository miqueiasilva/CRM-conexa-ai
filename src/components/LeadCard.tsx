
import React from 'react';
import { Lead } from '../types';
import { Clock, DollarSign } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onLeadClick: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onLeadClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('leadId', lead.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    // Improved visual feedback: reduce opacity and scale down slightly
    e.currentTarget.style.opacity = '0.5';
    e.currentTarget.style.transform = 'scale(0.95)';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'scale(1)';
  };

  // Format currency properly
  const formattedValue = lead.value 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)
    : 'R$ 0,00';

  return (
    <div 
      onClick={() => onLeadClick(lead)}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-card p-3 rounded-md shadow-sm mb-3 cursor-pointer border border-border hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all group active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">{lead.name}</h4>
      </div>
      <p className="text-xs text-text-secondary">{lead.whatsapp}</p>
       <p className="text-xs text-text-secondary mt-1">Origem: <span className="font-medium">{lead.origin}</span></p>
       
       <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-100">
          <div className="flex items-center text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
            <DollarSign size={10} className="mr-0.5" />
            {formattedValue}
          </div>
          {lead.lastContact && (
            <div className="flex items-center text-xs text-text-secondary" title="Último contato">
              <Clock size={10} className="mr-1" />
              {lead.lastContact}
            </div>
          )}
       </div>
    </div>
  );
};

export default LeadCard;
