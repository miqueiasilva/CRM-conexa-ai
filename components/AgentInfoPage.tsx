
import React from 'react';
import { Bot, Edit2, CheckCircle, Globe, MessageCircle, Clock } from 'lucide-react';
import { AgentData } from '../types';

interface AgentInfoPageProps {
    agent: AgentData | null;
    onEdit: () => void;
}

const AgentInfoPage: React.FC<AgentInfoPageProps> = ({ agent, onEdit }) => {
  if (!agent) {
    return (
        <div className="bg-card p-12 rounded-[2rem] shadow-sm max-w-4xl mx-auto text-center border border-slate-100">
             <Bot size={64} className="text-slate-200 mx-auto mb-6" />
             <h1 className="text-2xl font-black text-slate-900">Nenhum agente configurado</h1>
             <p className="text-slate-500 mt-2 font-medium">Crie um agente para começar a automatizar seu atendimento.</p>
        </div>
    );
  }
    
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
                <div className="p-5 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-200">
                    <Bot size={40} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{agent.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-black text-green-600 uppercase tracking-widest">IA SDR Ativa</p>
                    </div>
                </div>
            </div>
            <button 
                onClick={onEdit}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
                <Edit2 size={18} /> Editar
            </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Configuração de Voz</h3>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-sm">Estilo:</span>
                        <span className="text-slate-900 font-black text-sm">{agent.communicationStyle}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-sm">Respostas:</span>
                        <span className="text-slate-900 font-black text-sm">{agent.responseLength}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-sm">Emojis:</span>
                        <span className="text-slate-900 font-black text-sm">{agent.useEmojis ? 'Sim' : 'Não'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-sm">Idioma:</span>
                        <span className="text-slate-900 font-black text-sm">{agent.language}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Perfil da Empresa</h3>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-sm">Empresa:</span>
                        <span className="text-slate-900 font-black text-sm">{agent.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-sm">Setor:</span>
                        <span className="text-slate-900 font-black text-sm">{agent.industry}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-slate-500 font-bold text-sm flex-shrink-0">Instância:</span>
                        <span className="text-slate-900 font-black text-sm truncate">{agent.whatsappNumber}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-6">Etapas do Fluxo de Atendimento</h3>
        <div className="space-y-4">
            {agent.flowSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-black flex-shrink-0">
                        {index + 1}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-sm mb-1">{step.name}</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.instruction}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900">Base de Conhecimento</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">
                {agent.knowledgeBase.length} Perguntas
            </span>
        </div>
        <div className="space-y-3">
            {agent.knowledgeBase.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-900 mb-1">P: {item.question}</p>
                    <p className="text-xs text-slate-500 font-medium italic">R: {item.answer}</p>
                </div>
            ))}
            {agent.knowledgeBase.length === 0 && (
                <p className="text-sm text-slate-400 font-bold text-center py-4">Nenhuma pergunta treinada ainda.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AgentInfoPage;
