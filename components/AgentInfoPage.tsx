import React from 'react';
import { Bot, CheckCircle } from 'lucide-react';
import { AgentData } from '../types';

interface AgentInfoPageProps {
    agent: AgentData | null;
    onEdit: () => void;
}

const AgentInfoPage: React.FC<AgentInfoPageProps> = ({ agent, onEdit }) => {
  if (!agent) {
    return (
        <div className="bg-card p-8 rounded-lg shadow-sm max-w-4xl mx-auto text-center">
             <Bot size={40} className="text-primary mx-auto mb-4" />
             <h1 className="text-2xl font-bold text-text-primary">Nenhum agente configurado</h1>
             <p className="text-text-secondary mt-2">Crie um agente para começar.</p>
        </div>
    );
  }
    
  return (
    <div className="bg-card p-8 rounded-lg shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Bot size={40} className="text-primary" />
        <div className="ml-4">
            <h1 className="text-3xl font-bold text-text-primary">Informações do Agente</h1>
            <p className="text-text-secondary">Detalhes e configurações do seu assistente de IA ativo.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">{agent.name}</h2>
            <div className="text-text-secondary bg-light p-4 rounded-lg border border-border space-y-2 text-sm">
              <p><strong className="text-text-primary">Tipo:</strong> {agent.type}</p>
              <p><strong className="text-text-primary">Empresa:</strong> {agent.companyName} ({agent.industry})</p>
              <p><strong className="text-text-primary">Descrição:</strong> {agent.companyDescription}</p>
              <p><strong className="text-text-primary">Estilo:</strong> {agent.communicationStyle}, Respostas: {agent.responseLength}, Emojis: {agent.useEmojis ? 'Sim' : 'Não'}</p>
              <p><strong className="text-text-primary">Idioma:</strong> {agent.language}</p>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Base de Conhecimento</h3>
            <p className="text-sm text-text-secondary mb-3">O agente foi treinado com <span className="font-bold text-text-primary">{agent.knowledgeBase.length}</span> perguntas e respostas.</p>
            {agent.knowledgeBase.length > 0 && (
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {agent.knowledgeBase.map((item, index) => (
                        <div key={index} className="text-xs bg-light p-2 rounded-md border border-border">
                            <p className="font-semibold text-text-primary">P: {item.question}</p>
                            <p>R: {item.answer}</p>
                        </div>
                    ))}
                 </div>
            )}
        </div>

        <div className="border-t border-border pt-6 flex justify-end">
            <button 
                onClick={onEdit}
                className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary transition-colors"
            >
                Editar Agente
            </button>
        </div>
      </div>
    </div>
  );
};

export default AgentInfoPage;