
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { X, User, Phone, MapPin, Tag, Trash2, AlertTriangle, Calendar, DollarSign } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onDelete?: (id: number) => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset deleting state when modal opens/closes
  useEffect(() => {
    setIsDeleting(false);
  }, [lead]);

  if (!lead) return null;

  const handleDeleteClick = () => {
    if (isDeleting) {
        if (onDelete) {
            onDelete(lead.id);
            onClose();
        }
    } else {
        setIsDeleting(true);
    }
  };

  const formattedValue = lead.value 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)
    : '-';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-primary/5 p-6 border-b border-border flex justify-between items-start">
             <div className="flex items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center font-bold text-2xl flex-shrink-0 mr-4 shadow-sm">
                    {lead.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-text-primary leading-tight">{lead.name}</h2>
                    <p className="text-text-secondary text-sm">Lead ID: #{lead.id}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-black/5 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-light p-3 rounded-lg border border-border">
                    <p className="text-xs text-text-secondary mb-1">Status</p>
                    <div className="flex items-center font-semibold text-primary">
                        <Tag size={16} className="mr-2"/>
                        {lead.status}
                    </div>
                 </div>
                 <div className="bg-light p-3 rounded-lg border border-border">
                    <p className="text-xs text-text-secondary mb-1">Potencial</p>
                    <div className="flex items-center font-semibold text-green-600">
                        <DollarSign size={16} className="mr-2"/>
                        {formattedValue}
                    </div>
                 </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-text-primary border-b border-border pb-2">Informações de Contato</h3>
                <div className="flex items-center text-text-primary p-2 hover:bg-light rounded-md transition-colors">
                    <Phone size={20} className="mr-3 text-text-secondary"/>
                    <span className="flex-1">{lead.whatsapp || "Não informado"}</span>
                </div>
                <div className="flex items-center text-text-primary p-2 hover:bg-light rounded-md transition-colors">
                    <MapPin size={20} className="mr-3 text-text-secondary"/>
                    <span className="flex-1">Origem: {lead.origin}</span>
                </div>
                 <div className="flex items-center text-text-primary p-2 hover:bg-light rounded-md transition-colors">
                    <Calendar size={20} className="mr-3 text-text-secondary"/>
                    <span className="flex-1">Último contato: {lead.lastContact || "Nunca"}</span>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold text-text-primary mb-2">Ações Rápidas</h3>
                <div className="flex space-x-2">
                    <button className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                        Chamar no WhatsApp
                    </button>
                     <button className="flex-1 bg-light text-text-primary border border-border py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Editar
                    </button>
                </div>
            </div>
        </div>

        {/* Footer with Delete Action */}
        <div className="p-4 border-t border-border bg-gray-50 flex justify-between items-center rounded-b-xl">
             <button 
                onClick={handleDeleteClick}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDeleting 
                    ? 'bg-red-600 text-white hover:bg-red-700 w-full justify-center shadow-md' 
                    : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                }`}
            >
                {isDeleting ? (
                    <>
                        <AlertTriangle size={18} className="mr-2" />
                        Confirmar Exclusão?
                    </>
                ) : (
                    <>
                        <Trash2 size={18} className="mr-2" />
                        Excluir Lead
                    </>
                )}
            </button>
            
            {isDeleting && (
                 <button 
                    onClick={() => setIsDeleting(false)}
                    className="ml-2 text-text-secondary hover:text-text-primary px-4 py-2 font-medium"
                >
                    Cancelar
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default LeadDetailModal;
