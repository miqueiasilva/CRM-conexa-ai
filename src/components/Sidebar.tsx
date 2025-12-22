
import React from 'react';
import { Home, LayoutGrid, MessageSquare, Bot, LogOut, ChevronDown, ChevronUp, ChevronLeft, Zap, FileText, MessageCircle } from 'lucide-react';
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
    className={`w-full flex items-center text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
      isSubItem ? 'pl-12' : 'pl-4'
    } ${
      isActive
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
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
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, onLogout, isOpen, onClose }) => {
  const [crmOpen, setCrmOpen] = React.useState(true);
  const [conexaAIOpen, setConexaAIOpen] = React.useState(true);

  const handlePageSelect = (page: string) => {
    setPage(page);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - Transparente Escuro */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Drawer Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col shadow-2xl lg:shadow-none
        transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
              <Zap className="text-white fill-white" size={22}/>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">{APP_NAME}</h1>
          </div>
          
          {/* Close Button Mobile (Seta para Esquerda) */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
            aria-label="Fechar menu"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pb-6">
          <NavItem icon={<Home size={20} />} label="Início" isActive={activePage === 'Início'} onClick={() => handlePageSelect('Início')} />
          <NavItem icon={<MessageCircle size={20} />} label="WhatsApp" isActive={activePage === 'WhatsApp'} onClick={() => handlePageSelect('WhatsApp')} />

          <div className="pt-4">
            <button onClick={() => setCrmOpen(!crmOpen)} className="w-full flex justify-between items-center px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
              Gestão CRM
              {crmOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            {crmOpen && (
              <div className="space-y-1">
                <NavItem icon={<LayoutGrid size={18} />} label="Dashboard" isActive={activePage === 'DashboardCRM'} onClick={() => handlePageSelect('DashboardCRM')} isSubItem />
                <NavItem icon={<FileText size={18} />} label="Quadro" isActive={activePage === 'Quadro'} onClick={() => handlePageSelect('Quadro')} isSubItem />
                <NavItem icon={<FileText size={18} />} label="Disparo" isActive={activePage === 'Disparo'} onClick={() => handlePageSelect('Disparo')} isSubItem />
                <NavItem icon={<MessageSquare size={18} />} label="Mensagem" isActive={activePage === 'Mensagem'} onClick={() => handlePageSelect('Mensagem')} isSubItem />
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button onClick={() => setConexaAIOpen(!conexaAIOpen)} className="w-full flex justify-between items-center px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
              Assistente IA
              {conexaAIOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            {conexaAIOpen && (
              <div className="space-y-1">
                <NavItem icon={<Zap size={18} />} label="Configurar Agente" isActive={activePage === 'Criação de Agente'} onClick={() => handlePageSelect('Criação de Agente')} isSubItem />
                <NavItem icon={<Bot size={18} />} label="Simulador Jaci" isActive={activePage === 'Simulador'} onClick={() => handlePageSelect('Simulador')} isSubItem />
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50 bg-slate-50/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={20} className="mr-3" />
            Sair da Conta
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
