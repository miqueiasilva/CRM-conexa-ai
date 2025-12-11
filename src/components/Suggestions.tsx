
import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface SuggestionsProps {
  onClose: () => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ onClose }) => {
  const suggestionsList = [
    'Automatizar follow-ups',
    'Personalizar o fluxo do chat',
    'Adicionar relatórios de desempenho',
    'Notificações de novos leads',
    'Gerenciar tags de leads',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    // Em um aplicativo real, isso poderia acionar um fluxo para implementar o recurso
    // ou enviar dados de análise. Por enquanto, um alerta é suficiente.
    alert(`Sugestão clicada: "${suggestion}". Nossa equipe irá analisar esta funcionalidade!`);
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm bg-card rounded-lg shadow-xl border border-border z-50">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <Lightbulb size={20} className="text-primary mr-2" />
          <h3 className="font-bold text-text-primary">Sugestões</h3>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-light"
          aria-label="Fechar sugestões"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-sm text-text-secondary mb-4">Aqui estão algumas ideias para aprimorar as capacidades do seu agente:</p>
        <div className="flex flex-wrap gap-2">
          {suggestionsList.map((text, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(text)}
              className="bg-light text-text-primary text-sm px-4 py-1.5 rounded-full border border-transparent hover:border-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;