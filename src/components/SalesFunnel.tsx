import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '@/types';
import { FUNNEL_STAGES } from '@/constants';
import KanbanColumn from './KanbanColumn';
import { Plus, MessageSquare, Download, Search, X, Loader2 } from 'lucide-react';
import LeadDetailModal from './LeadDetailModal';

interface SalesFunnelProps {
  leads: Lead[];
  onLeadDrop: (leadId: number, newStatus: LeadStatus) => void;
  addLead: (lead: Omit<Lead, 'id' | 'status'>) => Promise<void> | void;
  onDeleteLead: (leadId: number) => void;
  onUpdateLead: (lead: Lead) => Promise<void> | void;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ leads, onLeadDrop, addLead, onDeleteLead, onUpdateLead }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Add Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadWhatsapp, setNewLeadWhatsapp] = useState('');
  const [newLeadOrigin, setNewLeadOrigin] = useState('Manual');

  // Atualiza o lead selecionado se a lista de leads mudar (ex: após edição)
  useEffect(() => {
    if (selectedLead) {
        const updatedLead = leads.find(l => l.id === selectedLead.id);
        // Se encontrou uma versão mais nova do lead, atualiza o modal
        if (updatedLead && updatedLead !== selectedLead) {
            setSelectedLead(updatedLead);
        }
    }
  }, [leads, selectedLead]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  const handleOpenAddModal = () => {
      setNewLeadName('');
      setNewLeadWhatsapp('');
      setNewLeadOrigin('Manual');
      setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
      if (!isSubmitting) {
        setIsAddModalOpen(false);
      }
  };

  const handleSubmitNewLead = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newLeadName.trim()) {
          setIsSubmitting(true);
          try {
            await addLead({
                name: newLeadName.trim(),
                whatsapp: newLeadWhatsapp.trim(),
                origin: newLeadOrigin,
                value: 0,
                lastContact: "Agora"
            });
            handleCloseAddModal();
          } catch (error) {
            console.error("Erro ao adicionar lead", error);
            alert("Erro ao salvar lead. Tente novamente.");
          } finally {
            setIsSubmitting(false);
          }
      }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.whatsapp.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col relative">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Quadro CRM</h1>
                <p className="text-text-secondary text-sm">Gerencie seus leads e oportunidades.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
                {/* Search Input with Clear Button */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar leads..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-card border border-border rounded-lg py-2 pl-10 pr-8 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-gray-100"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex space-x-2">
                    {/* Quick Action Button */}
                    <button 
                        type="button"
                        onClick={handleOpenAddModal}
                        className="relative z-20 flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-all hover:scale-105 active:scale-95 font-medium cursor-pointer"
                    >
                        <Plus size={18} className="mr-2"/>
                        Novo Lead
                    </button>
                    
                    <button className="flex items-center bg-white text-text-primary border border-border px-3 py-2 rounded-lg shadow-sm hover:bg-light transition-colors" title="Mensagem em massa">
                        <MessageSquare size={18} />
                    </button>
                    <button className="flex items-center bg-white text-text-primary border border-border px-3 py-2 rounded-lg shadow-sm hover:bg-light transition-colors" title="Exportar CSV">
                        <Download size={18} />
                    </button>
                </div>
            </div>
        </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {FUNNEL_STAGES.map((status: LeadStatus) => (
          <KanbanColumn 
            key={status}
            title={status} 
            leads={filteredLeads.filter(lead => lead.status === status)}
            onLeadDrop={onLeadDrop}
            onLeadClick={handleLeadClick}
          />
        ))}
      </div>

       {/* Detail Modal - Renderizado condicionalmente para garantir atualização */}
       {selectedLead && (
           <LeadDetailModal 
                lead={selectedLead} 
                onClose={handleCloseModal} 
                onDelete={onDeleteLead}
                onUpdate={onUpdateLead}
           />
       )}

       {/* Add Lead Modal Overlay */}
       {isAddModalOpen && (
           <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4" 
                style={{ zIndex: 9999 }}
                onClick={handleCloseAddModal}
            >
               <div className="bg-card rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 relative" onClick={e => e.stopPropagation()}>
                   <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                       <h2 className="text-xl font-bold text-text-primary">Cadastrar Novo Lead</h2>
                       <button onClick={handleCloseAddModal} className="text-text-secondary hover:text-text-primary hover:bg-light p-1 rounded-full transition-colors" disabled={isSubmitting}>
                           <X size={24} />
                       </button>
                   </div>
                   <form onSubmit={handleSubmitNewLead} className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">Nome do Cliente <span className="text-red-500">*</span></label>
                           <input 
                               type="text" 
                               required
                               value={newLeadName}
                               onChange={e => setNewLeadName(e.target.value)}
                               className="w-full bg-light border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                               placeholder="Ex: Maria Silva"
                               disabled={isSubmitting}
                               autoFocus
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">WhatsApp</label>
                           <input 
                               type="tel" 
                               value={newLeadWhatsapp}
                               onChange={e => setNewLeadWhatsapp(e.target.value)}
                               className="w-full bg-light border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                               placeholder="Ex: 11999998888"
                               disabled={isSubmitting}
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">Origem</label>
                           <select 
                                value={newLeadOrigin}
                                onChange={e => setNewLeadOrigin(e.target.value)}
                                className="w-full bg-light border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                disabled={isSubmitting}
                           >
                               <option value="Manual">Manual</option>
                               <option value="Instagram">Instagram</option>
                               <option value="WhatsApp">WhatsApp</option>
                               <option value="Facebook">Facebook</option>
                               <option value="Indicação">Indicação</option>
                           </select>
                       </div>
                       <div className="flex justify-end space-x-3 pt-6">
                           <button 
                                type="button" 
                                onClick={handleCloseAddModal} 
                                className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-light font-medium transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancelar
                           </button>
                           <button 
                                type="submit" 
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary font-medium shadow-md hover:shadow-lg transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Lead'
                                )}
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

export default SalesFunnel;