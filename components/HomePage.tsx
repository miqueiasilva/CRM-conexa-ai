
import React from 'react';
import { ArrowRight, Bot, MessageSquare, Radio, Users, Zap } from 'lucide-react';
import { APP_NAME } from '../constants';

interface HomePageProps {
    setPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
    const missions = [
        {
            icon: <Users size={24} />,
            title: `Comunidade ${APP_NAME}`,
            description: "Acesse nosso grupo exclusivo de empresários e SDRs.",
            buttonText: "Entrar no grupo",
            action: () => window.open('https://chat.whatsapp.com/', '_blank'),
            color: 'bg-indigo-600',
        },
        {
            icon: <Radio size={24} />,
            title: "Instância WhatsApp",
            description: "Integre seu número oficial para atendimento automático.",
            buttonText: "Integrar Agora",
            action: () => setPage('WhatsApp'),
            color: 'bg-green-600',
        },
        {
            icon: <MessageSquare size={24} />,
            title: "Novos Leads",
            description: "Verifique oportunidades capturadas pela IA nas últimas 24h.",
            buttonText: "Ver Leads",
            action: () => setPage('Quadro'),
            color: 'bg-blue-600',
        },
        {
            icon: <Bot size={24} />,
            title: "Cérebro da IA",
            description: "Configure o tom de voz e as etapas de venda do seu agente.",
            buttonText: "Configurar IA",
            action: () => setPage('Criação de Agente'),
            color: 'bg-purple-600',
        },
    ];

    return (
        <div className="max-w-6xl mx-auto py-4 animate-fade-in-up">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                        <Zap className="text-white fill-white" size={20}/>
                    </div>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Onboarding {APP_NAME}</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Complete suas missões</h1>
                <p className="text-slate-500 font-medium text-lg">Siga os passos abaixo para tornar sua empresa 100% autônoma com a inteligência do {APP_NAME}.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {missions.map((mission, index) => (
                    <div key={index} className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between">
                        <div>
                            <div className={`${mission.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:scale-110 transition-transform`}>
                                {mission.icon}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">{mission.title}</h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">{mission.description}</p>
                        </div>
                        <button 
                            onClick={mission.action}
                            className={`${mission.color} text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-lg`}
                        >
                            {mission.buttonText}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-600/30 flex items-center justify-center relative">
                        <span className="text-xl font-black">0%</span>
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-600" strokeDasharray="238" strokeDashoffset="238" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-1">Seu Progresso Atual</h3>
                        <p className="text-slate-400 font-medium">Complete as missões para liberar o Dashboard PRO.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-slate-400 font-bold self-center">0/4 Missões</span>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
