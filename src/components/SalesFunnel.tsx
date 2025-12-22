import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { FUNNEL_STAGES } from '../constants';
import KanbanColumn from './KanbanColumn';
import { Plus, MessageSquare, Download, Search, X } from 'lucide-react';
import LeadDetailModal from './LeadDetailModal';

interface SalesFunnelProps {
  leads: Lead[];
  onLeadDrop: (leadId: number, newStatus: LeadStatus) => void;
  addLead: (lead: Omit<Lead, 'id' | 'status'>) => void;
  onDeleteLead: (leadId: number) => void;
  onUpdateLead: (lead: Lead) => void;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ leads, onLeadDrop, addLead, onDeleteLead, onUpdateLead }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Add Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadWhatsapp, setNewLeadWhatsapp] = useState('');
  const [newLeadOrigin, setNewLeadOrigin] = useState('Manual');

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
      setIsAddModalOpen(false);
  };

  const handleSubmitNewLead = (e: React.FormEvent) => {
      e.preventDefault();
      if (newLeadName.trim()) {
          addLead({
              name: newLeadName.trim(),
              whatsapp: newLeadWhatsapp.trim(),
              origin: newLeadOrigin,
              value: 0,
              lastContact: "Agora"
          });
          handleCloseAddModal();
      }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.whatsapp.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Quadro CRM</h1>
                <p className="text-text-secondary text-sm">Gerencie seus leads e oportunidades.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
                        onClick={handleOpenAddModal}
                        className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-all hover:scale-105 active:scale-95 font-medium"
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
        {FUNNEL_STAGES.map(status => (
          <KanbanColumn 
            key={status}
            title={status} 
            leads={filteredLeads.filter(lead => lead.status === status)}
            onLeadDrop={onLeadDrop}
            onLeadClick={handleLeadClick}
          />
        ))}
      </div>

       {/* Detail Modal */}
       <LeadDetailModal 
            lead={selectedLead} 
            onClose={handleCloseModal} 
            onDelete={onDeleteLead}
            onUpdate={onUpdateLead}
       />

       {/* Add Lead Modal Overlay */}
       {isAddModalOpen && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={handleCloseAddModal}>
               <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                   <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-bold text-text-primary">Cadastrar Novo Lead</h2>
                       <button onClick={handleCloseAddModal} className="text-text-secondary hover:text-text-primary">
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
                               className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                               placeholder="Ex: Maria Silva"
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">WhatsApp</label>
                           <input 
                               type="tel" 
                               value={newLeadWhatsapp}
                               onChange={e => setNewLeadWhatsapp(e.target.value)}
                               className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                               placeholder="Ex: 11999998888"
                           />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">Origem</label>
                           <select 
                                value={newLeadOrigin}
                                onChange={e => setNewLeadOrigin(e.target.value)}
                                className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                           >
                               <option value="Manual">Manual</option>
                               <option value="Instagram">Instagram</option>
                               <option value="WhatsApp">WhatsApp</option>
                               <option value="Facebook">Facebook</option>
                               <option value="Indicação">Indicação</option>
                           </select>
                       </div>
                       <div className="flex justify-end space-x-2 pt-4">
                           <button type="button" onClick={handleCloseAddModal} className="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-light">Cancelar</button>
                           <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">Salvar Lead</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

export default SalesFunnel;