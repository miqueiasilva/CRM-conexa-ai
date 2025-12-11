
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
import { 
  getLeads, 
  createLead, 
  updateLeadStatus, 
  updateLead,
  deleteLeadFromDB, 
  getAppointments, 
  createAppointment 
} from './services/crmService';
import { supabase } from './services/supabaseClient';

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
  // Authentication state managed by Supabase
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('conexa_active_page') || 'Início';
  });
  
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [savedAgent, setSavedAgent] = useState<AgentData | null>(initialAgent);
  const [isEditingAgent, setIsEditingAgent] = useState(false);

  // Check Supabase Auth State on Mount
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save active page to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
        localStorage.setItem('conexa_active_page', activePage);
    }
  }, [activePage, isAuthenticated]);

  // Fetch initial data from Supabase
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const fetchedLeads = await getLeads();
      const fetchedAppointments = await getAppointments();
      setLeads(fetchedLeads);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (activePage !== 'Info do Agente') {
      setIsEditingAgent(false);
    }
  }, [activePage]);

  // This function is passed to LoginPage but Supabase handles the state change automatically via useEffect
  const handleLogin = () => {
      // No manual state update needed, subscription handles it
  };

  const handleAddLead = async (leadData: Omit<Lead, 'id' | 'status'>) => {
    const newLead = await createLead({
      ...leadData,
      status: LeadStatus.CAPTURADOS,
      value: 0,
      lastContact: 'Agora'
    });

    if (newLead) {
      setLeads(prevLeads => [newLead, ...prevLeads]);
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    const success = await updateLead(updatedLead);
    if (success) {
      setLeads(prevLeads => prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      ));
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    const success = await deleteLeadFromDB(leadId);
    if (success) {
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    }
  };

  const handleAddAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    const newApp = await createAppointment(appointmentData);
    if (newApp) {
      setAppointments(prevAppointments => [...prevAppointments, newApp]);
    }
  };

  const handleLeadDrop = async (leadId: number, newStatus: LeadStatus) => {
    setLeads(prevLeads => prevLeads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));

    const success = await updateLeadStatus(leadId, newStatus);
    if (!success) {
      console.error("Falha ao atualizar status no banco");
    }
  };
  
  const handleSaveAgent = (agentData: AgentData) => {
    setSavedAgent(agentData);
    setIsEditingAgent(false);
    setActivePage('Info do Agente');
  };

  const handleCancelEdit = () => {
    setIsEditingAgent(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('conexa_active_page');
    setActivePage('Início');
    // State updates automatically via subscription
  };

  // Show nothing or a loader while checking auth status
  if (isAuthenticated === null) {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 size={48} className="animate-spin text-primary" />
        </div>
      );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Loading Screen while fetching initial data
  if (isLoadingData && activePage === 'DashboardCRM') {
    return (
       <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Carregando seu CRM...</p>
          </div>
       </div>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'Início':
        return <HomePage setPage={setActivePage} />;
      case 'DashboardCRM':
        return <Dashboard leads={leads} appointments={appointments} />;
      case 'Quadro':
        return <SalesFunnel 
          leads={leads} 
          onLeadDrop={handleLeadDrop} 
          addLead={handleAddLead} 
          onUpdateLead={handleUpdateLead} 
          onDeleteLead={handleDeleteLead} 
        />;
      case 'Simulador':
        return <ChatInterface addLead={handleAddLead} addAppointment={handleAddAppointment} />;
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

    const funnelCounts = FUNNEL_STAGES.reduce((acc: Record<LeadStatus, number>, stage) => {
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