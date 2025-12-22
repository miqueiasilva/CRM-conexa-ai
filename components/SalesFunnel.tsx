import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { FUNNEL_STAGES } from '../constants';
import KanbanColumn from './KanbanColumn';
import { Plus, Download, Search, X } from 'lucide-react';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name: '', whatsapp: '', origin: 'Manual' });

  const handleCloseModal = () => setSelectedLead(null);

  const handleSubmitNewLead = (e: React.FormEvent) => {
      e.preventDefault();
      if (newLeadForm.name.trim()) {
          addLead({
              name: newLeadForm.name.trim(),
              whatsapp: newLeadForm.whatsapp.trim(),
              origin: newLeadForm.origin,
              value: 0,
              lastContact: "Agora"
          });
          setIsAddModalOpen(false);
          setNewLeadForm({ name: '', whatsapp: '', origin: 'Manual' });
      }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.whatsapp.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quadro CRM</h1>
                <p className="text-slate-500 font-medium">Gestão inteligente de oportunidades.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar leads..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-72 bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-sm font-medium"
                    />
                    {searchTerm && <X size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" onClick={() => setSearchTerm('')} />}
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 font-bold flex items-center justify-center gap-2"
                    >
                        <Plus size={20}/> Novo Lead
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"><Download size={20} /></button>
                </div>
            </div>
        </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 overflow-x-auto pb-4">
        {FUNNEL_STAGES.map((status: LeadStatus) => (
          <KanbanColumn 
            key={status}
            title={status} 
            leads={filteredLeads.filter(lead => lead.status === status)}
            onLeadDrop={onLeadDrop}
            onLeadClick={setSelectedLead}
          />
        ))}
      </div>

       <LeadDetailModal lead={selectedLead} onClose={handleCloseModal} onDelete={onDeleteLead} onUpdate={onUpdateLead} />

       {isAddModalOpen && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setIsAddModalOpen(false)}>
               <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 animate-fade-in-up border border-slate-100" onClick={e => e.stopPropagation()}>
                   <div className="mb-8">
                       <h2 className="text-3xl font-black text-slate-900 mb-2">Novo Lead</h2>
                       <p className="text-slate-500 font-medium text-sm">Insira os dados manualmente no CRM.</p>
                   </div>
                   <form onSubmit={handleSubmitNewLead} className="space-y-6">
                       <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 ml-1">Nome Completo</label>
                           <input type="text" required value={newLeadForm.name} onChange={e => setNewLeadForm({...newLeadForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 outline-none" placeholder="Ex: João Silva" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 ml-1">WhatsApp</label>
                           <input type="tel" value={newLeadForm.whatsapp} onChange={e => setNewLeadForm({...newLeadForm, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 outline-none" placeholder="5511..." />
                       </div>
                       <div className="flex gap-4 pt-4">
                           <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700">Cancelar</button>
                           <button type="submit" className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Salvar Lead</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

export default SalesFunnel;