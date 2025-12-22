
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import SalesFunnel from './components/SalesFunnel';
import AppointmentsList from './components/AppointmentsList';
import LeadSourceChart from './components/LeadSourceChart';
import ChatInterface from './components/ChatInterface';
import { Lead, Appointment, LeadStatus, AgentData } from './types';
import { BarChart, Users, DollarSign, MessageCircle, Menu } from 'lucide-react';
import AgentCreator from './components/AgentCreator';
import AgentInfoPage from './components/AgentInfoPage';
import WhatsApp from './components/WhatsApp';
import MessagePage from './components/MessagePage';
import Suggestions from './components/Suggestions';
import ChatListPage from './components/ChatListPage';
import HomePage from './components/HomePage';
import AgentEditPage from './components/AgentEditPage';
import LoginPage from './components/LoginPage';
import HelpPage from './components/HelpPage';
import { FUNNEL_STAGES } from './constants';

const initialLeadsData: Lead[] = [
  { id: 1, name: 'Ana Silva', whatsapp: '+5511987654321', origin: 'Instagram', status: LeadStatus.CAPTURADOS, value: 500, lastContact: 'Hoje' },
  { id: 2, name: 'Bruno Costa', whatsapp: '+5521912345678', origin: 'WhatsApp', status: LeadStatus.CAPTURADOS, value: 150, lastContact: 'Ontem' },
  { id: 3, name: 'Carla Dias', whatsapp: '+5531988887777', origin: 'Facebook', status: LeadStatus.ATENDIDOS, value: 80, lastContact: '2 dias atrás' },
];

const initialAgent: AgentData = {
    type: 'IA de SDR',
    name: 'Jaci.AI',
    responseLength: 'Média',
    communicationStyle: 'Casual',
    useEmojis: true,
    language: 'Português (Brasil)',
    whatsappNumber: '+5511987654321',
    companyName: 'Studio Jacilene Félix',
    industry: 'Saúde e Beleza',
    companyDescription: 'Studio especializado em micropigmentação e design de sobrancelhas.',
    companyAddress: 'Rua da Beleza, 123 - São Paulo, SP',
    workingHours: { 'Segunda-feira': true, 'Terça-feira': true, 'Quarta-feira': true, 'Quinta-feira': true, 'Sexta-feira': true, 'Sábado': false, 'Domingo': false },
    flowSteps: [],
    knowledgeBase: []
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('Início');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [savedAgent, setSavedAgent] = useState<AgentData | null>(initialAgent);
  const [isEditingAgent, setIsEditingAgent] = useState(false);

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now(),
      status: LeadStatus.CAPTURADOS,
      value: leadData.value || 0,
      lastContact: 'Agora'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  };

  const handleDeleteLead = (leadId: number) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const handleLeadDrop = (leadId: number, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
  };

  const handleLogout = () => setIsAuthenticated(false);

  const renderContent = () => {
    if (isEditingAgent && savedAgent) {
        return <AgentEditPage agentToEdit={savedAgent} onSave={(data) => { setSavedAgent(data); setIsEditingAgent(false); }} onCancel={() => setIsEditingAgent(false)} />;
    }

    switch (activePage) {
      case 'Início': return <HomePage setPage={setActivePage} />;
      case 'DashboardCRM': return <Dashboard leads={leads} appointments={appointments} onMenuOpen={() => setIsSidebarOpen(true)} />;
      case 'Quadro': return <SalesFunnel leads={leads} onLeadDrop={handleLeadDrop} addLead={handleAddLead} onDeleteLead={handleDeleteLead} onUpdateLead={handleUpdateLead} />;
      case 'Simulador': return <ChatInterface addLead={handleAddLead} addAppointment={(app) => setAppointments(prev => [...prev, { ...app, id: Date.now() }])} />;
      case 'Criação de Agente': return <AgentCreator onSave={(data) => { setSavedAgent(data); setActivePage('Info do Agente'); }} />;
      case 'Info do Agente': return <AgentInfoPage agent={savedAgent} onEdit={() => setIsEditingAgent(true)} />;
      case 'WhatsApp': return <WhatsApp />;
      case 'Disparo': return <MessagePage />;
      case 'Mensagem': return <ChatListPage />;
      case 'Ajuda': return <HelpPage setPage={setActivePage} />;
      default: return <HomePage setPage={setActivePage} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
        activePage={activePage} 
        setPage={(page) => {
          setActivePage(page);
          setIsSidebarOpen(false); // Fecha ao navegar no mobile
        }} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Trigger for pages without internal dashboard headers */}
        {activePage !== 'DashboardCRM' && (
          <div className="lg:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-black text-slate-900">{activePage}</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ leads: Lead[], appointments: Appointment[], onMenuOpen: () => void }> = ({ leads, appointments, onMenuOpen }) => {
    const [showSuggestions, setShowSuggestions] = useState(true);
    const totalLeads = leads.length;
    const answeredLeads = leads.filter(l => l.status !== LeadStatus.CAPTURADOS).length;
    const conversionRate = totalLeads > 0 ? ((leads.filter(l => l.status === LeadStatus.VENDAS_REALIZADAS).length / totalLeads) * 100).toFixed(1) : "0.0";

    return (
        <div className="animate-fade-in-up">
            <Header onMenuOpen={onMenuOpen} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <StatCard title="Total de Leads" value={totalLeads} icon="Users" color="#3B82F6" />
                <StatCard title="Atendimentos" value={answeredLeads} icon="MessageCircle" color="#10B981" />
                <StatCard title="Conversão" value={`${conversionRate}%`} icon="BarChart" color="#F59E0B" />
                <StatCard title="Agendamentos" value={appointments.length} icon="DollarSign" color="#EF4444" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm h-full border border-slate-100">
                       <h2 className="text-xl font-black mb-6 text-slate-900">Funil de Vendas</h2>
                       <div className="space-y-6">
                           {FUNNEL_STAGES.map((stage, index) => {
                               const count = leads.filter(l => l.status === stage).length;
                               const perc = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                               return (
                               <div key={stage}>
                                   <div className="flex justify-between items-center mb-2">
                                       <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stage}</span>
                                       <span className="text-sm font-black text-slate-900">{count}</span>
                                   </div>
                                   <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                       <div className={`${['bg-yellow-400', 'bg-blue-500', 'bg-green-500'][index % 3]} h-full rounded-full transition-all duration-1000`} style={{ width: `${perc}%` }}></div>
                                   </div>
                               </div>
                           )})}
                       </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <AppointmentsList appointments={appointments} />
                    <LeadSourceChart />
                </div>
            </div>
            {showSuggestions && <Suggestions onClose={() => setShowSuggestions(false)} />}
        </div>
    );
};

export default App;
