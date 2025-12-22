import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import SalesFunnel from './components/SalesFunnel';
import AppointmentsList from './components/AppointmentsList';
import LeadSourceChart from './components/LeadSourceChart';
import ChatInterface from './components/ChatInterface';
import { Lead, Appointment, LeadStatus, AgentData } from './types';
import { BarChart, Users, DollarSign, MessageCircle, Loader2 } from 'lucide-react';
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

// Dados iniciais para demonstração
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
  
  // LOGIC: Estado centralizado de Leads e Agendamentos
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [savedAgent, setSavedAgent] = useState<AgentData | null>(initialAgent);
  const [isEditingAgent, setIsEditingAgent] = useState(false);

  // LOGIC: Handlers de manipulação de dados
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

  // LOGIC: Renderização condicional baseada no estado activePage
  const renderContent = () => {
    switch (activePage) {
      case 'Início': return <HomePage setPage={setActivePage} />;
      case 'DashboardCRM': return <Dashboard leads={leads} appointments={appointments} />;
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
    <div className="flex h-screen bg-background text-text">
      <Sidebar activePage={activePage} setPage={setActivePage} onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

// Sub-componente Dashboard com lógica de estatísticas reais
const Dashboard: React.FC<{ leads: Lead[], appointments: Appointment[] }> = ({ leads, appointments }) => {
    const [showSuggestions, setShowSuggestions] = useState(true);
    const totalLeads = leads.length;
    const answeredLeads = leads.filter(l => l.status !== LeadStatus.CAPTURADOS).length;
    const conversionRate = totalLeads > 0 ? ((leads.filter(l => l.status === LeadStatus.VENDAS_REALIZADAS).length / totalLeads) * 100).toFixed(1) : "0.0";

    return (
        <div className="animate-fade-in-up">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total de Leads" value={totalLeads} icon={<Users size={24} className="text-blue-500" />} color="#3B82F6" />
                <StatCard title="Atendimentos" value={answeredLeads} icon={<MessageCircle size={24} className="text-green-500" />} color="#22C55E" />
                <StatCard title="Conversão" value={`${conversionRate}%`} icon={<BarChart size={24} className="text-yellow-500" />} color="#F59E0B" />
                <StatCard title="Agendamentos" value={appointments.length} icon={<DollarSign size={24} className="text-red-500" />} color="#EF4444" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-card p-6 rounded-lg shadow-sm h-full border border-border">
                       <h2 className="text-xl font-bold mb-6 text-text-primary">Funil de Vendas</h2>
                       <div className="space-y-6">
                           {FUNNEL_STAGES.map((stage, index) => {
                               const count = leads.filter(l => l.status === stage).length;
                               const perc = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                               return (
                               <div key={stage}>
                                   <div className="flex justify-between items-center mb-2">
                                       <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">{stage}</span>
                                       <span className="text-sm font-black text-text-primary">{count}</span>
                                   </div>
                                   <div className="w-full bg-slate-100 rounded-full h-3">
                                       <div className={`${['bg-yellow-400', 'bg-blue-500', 'bg-green-500'][index]} h-3 rounded-full transition-all duration-1000`} style={{ width: `${perc}%` }}></div>
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