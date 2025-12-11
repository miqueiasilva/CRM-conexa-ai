
import React, { useState } from 'react';
import { Home, LayoutGrid, MessageSquare, Bot, LogOut, ChevronDown, ChevronUp, BarChart3, Target, HelpCircle, Zap, FileText, MessageCircle } from 'lucide-react';

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
    className={`w-full flex items-center text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isSubItem ? 'pl-12' : 'pl-4'
    } ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-text-secondary hover:bg-light hover:text-text-primary'
    }`}
  >
    {icon}
    {label}
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
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 flex flex-col">
      <div className="px-6 py-4 flex items-center">
        <Zap className="text-primary" size={28}/>
        <h1 className="text-2xl font-bold ml-2 text-text-primary">Conexa.AI</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <NavItem icon={<Home size={18} className="mr-3" />} label="Início" isActive={activePage === 'Início'} onClick={() => setPage('Início')} />
        <NavItem icon={<MessageCircle size={18} className="mr-3" />} label="WhatsApp" isActive={activePage === 'WhatsApp'} onClick={() => setPage('WhatsApp')} />

        <div>
          <button onClick={() => setCrmOpen(!crmOpen)} className="w-full flex justify-between items-center text-left px-4 py-2.5 text-sm font-medium text-text-secondary">
            <div className="flex items-center">
              <BarChart3 size={18} className="mr-3" />
              Nextrack CRM
            </div>
            {crmOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {crmOpen && (
            <div className="space-y-1 mt-1">
              <NavItem icon={<LayoutGrid size={18} className="mr-3" />} label="Dashboard" isActive={activePage === 'DashboardCRM'} onClick={() => setPage('DashboardCRM')} isSubItem />
              <NavItem icon={<LayoutGrid size={18} className="mr-3" />} label="Quadro" isActive={activePage === 'Quadro'} onClick={() => setPage('Quadro')} isSubItem />
              <NavItem icon={<Target size={18} className="mr-3" />} label="Disparo" isActive={activePage === 'Disparo'} onClick={() => setPage('Disparo')} isSubItem />
              <NavItem icon={<MessageSquare size={18} className="mr-3" />} label="Mensagem" isActive={activePage === 'Mensagem'} onClick={() => setPage('Mensagem')} isSubItem />
            </div>
          )}
        </div>
        
        <div>
          <button onClick={() => setConexaAIOpen(!conexaAIOpen)} className="w-full flex justify-between items-center text-left px-4 py-2.5 text-sm font-medium text-text-secondary">
            <div className="flex items-center">
              <Bot size={18} className="mr-3" />
              NextlA
            </div>
            {conexaAIOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {conexaAIOpen && (
            <div className="space-y-1 mt-1">
              <NavItem icon={<Zap size={18} className="mr-3" />} label="Criação de Agente" isActive={activePage === 'Criação de Agente'} onClick={() => setPage('Criação de Agente')} isSubItem />
              <NavItem icon={<FileText size={18} className="mr-3" />} label="Info do Agente" isActive={activePage === 'Info do Agente'} onClick={() => setPage('Info do Agente')} isSubItem />
              <NavItem icon={<Bot size={18} className="mr-3" />} label="Simulador" isActive={activePage === 'Simulador'} onClick={() => setPage('Simulador')} isSubItem />
            </div>
          )}
        </div>
        
        <NavItem icon={<HelpCircle size={18} className="mr-3" />} label="Ajuda" isActive={activePage === 'Ajuda'} onClick={() => setPage('Ajuda')} />

      </nav>

      <div className="p-4 border-t border-border space-y-2">
         <NavItem icon={<LogOut size={18} className="mr-3" />} label="Sair" isActive={false} onClick={onLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;
