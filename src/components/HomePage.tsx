
import React from 'react';
import { ArrowRight, Bot, MessageSquare, Radio, Users } from 'lucide-react';

interface HomePageProps {
    setPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
    const missions = [
        {
            icon: <Users size={24} className="text-white" />,
            title: "Entre no Grupo do WhatsApp",
            description: "Você ficará por dentro de tudo que a Nexttrack tem para oferecer para você e suas empresas!",
            buttonText: "Entrar no grupo",
            action: () => window.open('https://chat.whatsapp.com/your-group-invite-link', '_blank'),
        },
        {
            icon: <Radio size={24} className="text-white" />,
            title: "Cadastrar WhatsApp",
            description: "Faça a integração do seu WhatsApp através do QR CODE",
            buttonText: "Integrar Agora",
            action: () => setPage('WhatsApp'),
        },
        {
            icon: <MessageSquare size={24} className="text-white" />,
            title: "Verifique Suas Novas Mensagens",
            description: "Novos leads que são cadastrados dentro do CRM",
            buttonText: "Mensagens",
            action: () => setPage('Mensagem'),
        },
        {
            icon: <Bot size={24} className="text-white" />,
            title: "Crie seu Agente de IA",
            description: "Crie seu primeiro e único agente de IA que poderá responder a todas as suas mensagens!",
            buttonText: "Criar Agente",
            action: () => setPage('Criação de Agente'),
        },
    ];

    const completedMissions = 0;
    const totalMissions = missions.length;
    const progressPercentage = (completedMissions / totalMissions) * 100;

    return (
        <div className="bg-card p-8 rounded-lg shadow-sm">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Complete suas missões</h1>
                <p className="text-text-secondary">Nexttrack &gt; Início</p>
            </div>

            <div className="space-y-4 mb-8">
                {missions.map((mission, index) => (
                    <div key={index} className="bg-primary hover:bg-secondary transition-colors text-white p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 bg-white/20 rounded-full mr-4">
                                {mission.icon}
                            </div>
                            <div>
                                <h2 className="font-bold">{mission.title}</h2>
                                <p className="text-sm opacity-90">{mission.description}</p>
                            </div>
                        </div>
                        <button 
                            onClick={mission.action}
                            className="bg-white text-primary font-semibold px-4 py-2 rounded-md flex items-center text-sm hover:bg-light"
                        >
                            {mission.buttonText}
                            <ArrowRight size={16} className="ml-2" />
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-text-primary">Progresso</p>
                    <p className="text-sm text-text-secondary">{completedMissions}/{totalMissions} Completo</p>
                </div>
                <div className="w-full bg-light rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;