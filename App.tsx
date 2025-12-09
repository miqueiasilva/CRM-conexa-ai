
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import SalesFunnel from './components/SalesFunnel';
import AppointmentsList from './components/AppointmentsList';
import LeadSourceChart from './components/LeadSourceChart';
import ChatInterface from './components/ChatInterface';
import { Lead, Appointment, LeadStatus, AgentData } from './types';
import { BarChart, Users, DollarSign, MessageCircle } from 'lucide-react';
import AgentCreator from './components/AgentCreator';
import AgentInfoPage from './components/AgentInfoPage';
import WhatsApp from './components/WhatsApp';
import MessagePage from './components/MessagePage';
import Suggestions from './components/Suggestions';
import ChatListPage from './components/ChatListPage';
import HomePage from './components/HomePage';
import AgentEditPage from './components/AgentEditPage';
import LoginPage from './components/LoginPage'; // Import the new LoginPage
import HelpPage from './components/HelpPage';
import { FUNNEL_STAGES } from './constants';

const initialLeads: Lead[] = [
  { id: 1, name: 'Ana Silva', whatsapp: '+5511987654321', origin: 'Instagram', status: LeadStatus.CAPTURADOS, value: 500, lastContact: 'Hoje' },
  { id: 2, name: 'Bruno Costa', whatsapp: '+5521912345678', origin: 'WhatsApp', status: LeadStatus.CAPTURADOS, value: 150, lastContact: 'Ontem' },
  { id: 3, name: 'Carla Dias', whatsapp: '+5531988887777', origin: 'Facebook', status: LeadStatus.ATENDIDOS, value: 80, lastContact: '2 dias atrás' },
  { id: 4, name: 'Daniel Alves', whatsapp: '+5551999991111', origin: 'Indicação', status: LeadStatus.VENDAS_REALIZADAS, value: 450, lastContact: 'Semana passada' },
  { id: 5, name: 'Eduarda Lima', whatsapp: '+5541977773333', origin: 'WhatsApp', status: LeadStatus.ATENDIDOS, value: 300, lastContact: 'Hoje' },
];

const initialAppointments: Appointment[] = [
  { id: 1, leadName: 'Carla Dias', service: 'Micropigmentação', professional: 'Jacilene Félix', dateTime: new Date(new Date().setDate(new Date().getDate() + 1)) },
  { id: 2, leadName: 'Eduarda Lima', service: 'Limpeza de Pele', professional: 'Ana', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)) },
  { id: 3, leadName: 'Daniel Alves', service: 'Design de Sobrancelhas', professional: 'Jacilene Félix', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)) },
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
    companyDescription: 'Studio especializado em micropigmentação e design de sobrancelhas, liderado por Jacilene Félix. Nosso objetivo é realçar a beleza natural com técnicas modernas e seguras.',
    companyAddress: 'Rua da Beleza, 123 - São Paulo, SP',
    workingHours: {
        'Segunda-feira': true, 'Terça-feira': true, 'Quarta-feira': true,
        'Quinta-feira': true, 'Sexta-feira': true, 'Sábado': false, 'Domingo': false,
    },
    flowSteps: [
        { name: 'Saudação', instruction: 'Dê as boas-vindas ao cliente e se apresente como Jaci.AI.' },
        { name: 'Qualificação', instruction: 'Pergunte qual serviço o cliente tem interesse.' },
        { name: 'Apresentação', instruction: 'Apresente o serviço solicitado e seu preço.' },
        { name: 'Agendamento', instruction: 'Pergunte a melhor data e hora para o cliente.' },
        { name: 'Confirmação', instruction: 'Confirme o agendamento e solicite o sinal via PIX.' },
    ],
    knowledgeBase: [
        { question: 'Quanto custa a Micropigmentação?', answer: 'Custa R$ 500.' },
        { question: 'Qual o preço do Design de Sobrancelhas?', answer: 'Custa R$ 80.' },
        { question: 'Qual o valor da Micropigmentação Labial?', answer: 'Custa R$ 450.' },
        { question: 'Quanto é a Limpeza de Pele?', answer: 'Custa R$ 150.' },
    ]
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [activePage, setActivePage] = useState('Início');
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [savedAgent, setSavedAgent] = useState<AgentData | null>(initialAgent);
  const [isEditingAgent, setIsEditingAgent] = useState(false);

  useEffect(() => {
    if (activePage !== 'Info do Agente') {
      setIsEditingAgent(false);
    }
  }, [activePage]);

  const addLead = (leadData: Omit<Lead, 'id' | 'status'>) => {
    setLeads(prevLeads => [
      ...prevLeads,
      { ...leadData, id: prevLeads.length + 1, status: LeadStatus.CAPTURADOS, value: 0, lastContact: 'Agora' }
    ]);
  };

  const deleteLead = (leadId: number) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    setAppointments(prevAppointments => [
      ...prevAppointments,
      { ...appointmentData, id: prevAppointments.length + 1 }
    ]);
  };

  const handleLeadDrop = (leadId: number, newStatus: LeadStatus) => {
    setLeads(prevLeads => prevLeads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };
  
  const handleSaveAgent = (agentData: AgentData) => {
    setSavedAgent(agentData);
    setIsEditingAgent(false);
    setActivePage('Info do Agente');
  };

  const handleCancelEdit = () => {
    setIsEditingAgent(false);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Render login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'Início':
        return <HomePage setPage={setActivePage} />;
      case 'DashboardCRM':
        return <Dashboard leads={leads} appointments={appointments} />;
      case 'Quadro':
        return <SalesFunnel leads={leads} onLeadDrop={handleLeadDrop} addLead={addLead} onDeleteLead={deleteLead} />;
      case 'Simulador':
        return <ChatInterface addLead={addLead} addAppointment={addAppointment} />;
      case 'Criação de Agente':
        return <AgentCreator onSave={handleSaveAgent} />;
      case 'Info do Agente':
        if (isEditingAgent && savedAgent) {
          return <AgentEditPage agentToEdit={savedAgent} onSave={handleSaveAgent} onCancel={handleCancelEdit} />;
        }
        return <AgentInfoPage agent={savedAgent} onEdit={() => setIsEditingAgent(true)} />;
      case 'WhatsApp':
        return <WhatsApp />;
      case 'Disparo':
        return <MessagePage />;
      case 'Mensagem':
        return <ChatListPage />;
      case 'Ajuda':
        return <HelpPage setPage={setActivePage} />;
      default:
        return <HomePage setPage={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text">
      <Sidebar activePage={activePage} setPage={setActivePage} onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

interface DashboardProps {
    leads: Lead[];
    appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads, appointments }) => {
    const [showSuggestions, setShowSuggestions] = useState(true);
    const totalLeads = leads.length;
    const answeredLeads = leads.filter(l => l.status !== LeadStatus.CAPTURADOS).length;
    const conversionRate = totalLeads > 0 ? ((leads.filter(l => l.status === LeadStatus.VENDAS_REALIZADAS).length / totalLeads) * 100).toFixed(1) : "0.0";
    const activeAppointments = appointments.length;

    const funnelCounts = FUNNEL_STAGES.reduce((acc, stage) => {
        acc[stage] = leads.filter(lead => lead.status === stage).length;
        return acc;
    }, {} as Record<LeadStatus, number>);

    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total de Leads" value={totalLeads} icon={<Users size={24} className="text-blue-500" />} color="#3B82F6" />
                <StatCard title="Atendimentos" value={answeredLeads} icon={<MessageCircle size={24} className="text-green-500" />} color="#22C55E" />
                <StatCard title="Conversão" value={`${conversionRate}%`} icon={<BarChart size={24} className="text-yellow-500" />} color="#F59E0B" />
                <StatCard title="Agendamentos" value={activeAppointments} icon={<DollarSign size={24} className="text-red-500" />} color="#EF4444" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-card p-4 rounded-lg shadow-sm h-full">
                       <h2 className="text-xl font-bold mb-4 text-text-primary">Funil de Vendas Resumido</h2>
                       <div className="space-y-3">
                           {FUNNEL_STAGES.map((stage, index) => (
                               <div key={stage}>
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="text-sm font-medium text-text-secondary">{stage}</span>
                                       <span className="text-sm font-bold text-text-primary">{funnelCounts[stage]} leads</span>
                                   </div>
                                   <div className="w-full bg-light rounded-full h-2.5">
                                       <div
                                        className={`${['bg-yellow-400', 'bg-blue-400', 'bg-green-400'][index] || 'bg-gray-400'} h-2.5 rounded-full`}
                                        style={{ width: `${totalLeads > 0 ? (funnelCounts[stage] / totalLeads) * 100 : 0}%` }}
                                       ></div>
                                   </div>
                               </div>
                           ))}
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
