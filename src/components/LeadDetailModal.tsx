
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { X, Phone, MapPin, Tag, Trash2, AlertTriangle, Calendar, DollarSign, Save, Edit2, Loader2 } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onUpdate?: (lead: Lead) => Promise<void> | void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for editing fields
  const [editedName, setEditedName] = useState('');
  const [editedWhatsapp, setEditedWhatsapp] = useState('');
  const [editedOrigin, setEditedOrigin] = useState('');
  const [editedValue, setEditedValue] = useState<number>(0);

  // Sync state when lead opens or changes
  useEffect(() => {
    setIsDeleting(false);
    setIsEditing(false);
    setIsSaving(false);
    if (lead) {
        setEditedName(lead.name);
        setEditedWhatsapp(lead.whatsapp);
        setEditedOrigin(lead.origin);
        setEditedValue(lead.value || 0);
    }
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

  const handleSaveClick = async () => {
      if (onUpdate) {
          setIsSaving(true);
          try {
              await onUpdate({
                  ...lead,
                  name: editedName,
                  whatsapp: editedWhatsapp,
                  origin: editedOrigin,
                  value: editedValue
              });
              setIsEditing(false);
          } catch (error) {
              console.error("Erro ao atualizar lead", error);
              alert("Erro ao salvar alterações.");
          } finally {
              setIsSaving(false);
          }
      } else {
          setIsEditing(false);
      }
  };

  const handleWhatsAppClick = () => {
      if (!lead.whatsapp) {
          alert("Este lead não possui número de WhatsApp cadastrado.");
          return;
      }
      // Remove non-numeric characters
      const cleanNumber = lead.whatsapp.replace(/\D/g, '');
      if (cleanNumber) {
          window.open(`https://wa.me/${cleanNumber}`, '_blank');
      } else {
          alert("Número de WhatsApp inválido.");
      }
  };

  const formattedValue = lead.value 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.value)
    : 'R$ 0,00';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh] transition-all transform scale-100" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-primary/5 p-6 border-b border-border flex justify-between items-start">
             <div className="flex items-center w-full">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center font-bold text-2xl flex-shrink-0 mr-4 shadow-sm">
                    {lead.name.charAt(0)}
                </div>
                <div className="flex-grow">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="text-xl font-bold text-text-primary bg-white border-2 border-primary/20 rounded p-1.5 w-full focus:border-primary outline-none"
                            placeholder="Nome do Lead"
                            autoFocus
                        />
                    ) : (
                        <h2 className="text-2xl font-bold text-text-primary leading-tight">{lead.name}</h2>
                    )}
                    <p className="text-text-secondary text-sm">Lead ID: #{lead.id}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-black/5 transition-colors ml-2">
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
                        {isEditing ? (
                             <input 
                                type="number" 
                                value={editedValue}
                                onChange={(e) => setEditedValue(Number(e.target.value))}
                                className="bg-white border border-border rounded p-1 w-full text-sm focus:border-primary outline-none"
                            />
                        ) : (
                            formattedValue
                        )}
                    </div>
                 </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-text-primary border-b border-border pb-2">Informações de Contato</h3>
                
                <div className="flex items-center text-text-primary p-2 hover:bg-light rounded-md transition-colors">
                    <Phone size={20} className="mr-3 text-text-secondary"/>
                    {isEditing ? (
                        <input 
                            type="tel" 
                            value={editedWhatsapp}
                            onChange={(e) => setEditedWhatsapp(e.target.value)}
                            className="bg-white border border-border rounded p-1 w-full focus:border-primary outline-none"
                            placeholder="WhatsApp"
                        />
                    ) : (
                        <span className="flex-1">{lead.whatsapp || "Não informado"}</span>
                    )}
                </div>

                <div className="flex items-center text-text-primary p-2 hover:bg-light rounded-md transition-colors">
                    <MapPin size={20} className="mr-3 text-text-secondary"/>
                    {isEditing ? (
                        <div className="flex-1 flex items-center">
                            <span className="mr-2 text-sm whitespace-nowrap">Origem:</span>
                            <select 
                                value={editedOrigin}
                                onChange={(e) => setEditedOrigin(e.target.value)}
                                className="bg-white border border-border rounded p-1 flex-1 focus:border-primary outline-none"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Instagram">Instagram</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Indicação">Indicação</option>
                            </select>
                        </div>
                    ) : (
                        <span className="flex-1">Origem: {lead.origin}</span>
                    )}
                </div>

                 <div className="flex items-center text-text-primary p-2 hover:bg-light rounded-md transition-colors">
                    <Calendar size={20} className="mr-3 text-text-secondary"/>
                    <span className="flex-1">Último contato: {lead.lastContact || "Nunca"}</span>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold text-text-primary mb-2">Ações Rápidas</h3>
                <div className="flex space-x-2">
                    <button 
                        onClick={handleWhatsAppClick}
                        className="flex-1 bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center shadow-sm"
                        disabled={isEditing}
                    >
                        <Phone size={18} className="mr-2" />
                        Chamar
                    </button>
                    {isEditing ? (
                         <button 
                            onClick={handleSaveClick}
                            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors flex items-center justify-center shadow-sm disabled:opacity-70"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="mr-2 animate-spin" />
                            ) : (
                                <Save size={18} className="mr-2" />
                            )}
                            Salvar
                        </button>
                    ) : (
                         <button 
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-white text-text-primary border border-border py-2.5 rounded-lg font-medium hover:bg-light transition-colors flex items-center justify-center shadow-sm"
                        >
                            <Edit2 size={18} className="mr-2" />
                            Editar
                        </button>
                    )}
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
                disabled={isEditing}
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
