
import React, { useState } from 'react';
import { Home, LayoutGrid, MessageSquare, Bot, LogOut, ChevronDown, ChevronUp, Target, Zap, FileText, MessageCircle } from 'lucide-react';
import { APP_NAME } from '../constants';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isSubItem?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isSubItem = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
      isSubItem ? 'pl-12' : 'pl-4'
    } ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className="ml-3">{label}</span>
  </button>
);

interface SidebarProps {
  activePage: string;
  setPage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, onLogout }) => {
  const [crmOpen, setCrmOpen] = useState(true);
  const [conexaAIOpen, setConexaAIOpen] = useState(true);

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex-shrink-0 flex flex-col shadow-sm">
      <div className="px-8 py-8 flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg shadow-md">
          <Zap className="text-white fill-white" size={24}/>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">{APP_NAME}</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <NavItem icon={<Home size={20} />} label="Início" isActive={activePage === 'Início'} onClick={() => setPage('Início')} />
        <NavItem icon={<MessageCircle size={20} />} label="WhatsApp" isActive={activePage === 'WhatsApp'} onClick={() => setPage('WhatsApp')} />

        <div className="pt-4">
          <button onClick={() => setCrmOpen(!crmOpen)} className="w-full flex justify-between items-center px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            CRM Dashboard
            {crmOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          {crmOpen && (
            <div className="space-y-1">
              <NavItem icon={<LayoutGrid size={18} />} label="Dashboard" isActive={activePage === 'DashboardCRM'} onClick={() => setPage('DashboardCRM')} isSubItem />
              <NavItem icon={<Target size={18} />} label="Quadro" isActive={activePage === 'Quadro'} onClick={() => setPage('Quadro')} isSubItem />
              <NavItem icon={<FileText size={18} />} label="Disparo" isActive={activePage === 'Disparo'} onClick={() => setPage('Disparo')} isSubItem />
              <NavItem icon={<MessageSquare size={18} />} label="Mensagem" isActive={activePage === 'Mensagem'} onClick={() => setPage('Mensagem')} isSubItem />
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <button onClick={() => setConexaAIOpen(!conexaAIOpen)} className="w-full flex justify-between items-center px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            SDR Inteligente
            {conexaAIOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          {conexaAIOpen && (
            <div className="space-y-1">
              <NavItem icon={<Zap size={18} />} label="Criação de Agente" isActive={activePage === 'Criação de Agente'} onClick={() => setPage('Criação de Agente')} isSubItem />
              <NavItem icon={<Bot size={18} />} label="Simulador" isActive={activePage === 'Simulador'} onClick={() => setPage('Simulador')} isSubItem />
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
