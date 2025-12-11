
import React, { useState } from 'react';
import { AgentData } from '../types';
import { Bot, User, Building, ListChecks, BrainCircuit, Plus, Trash2 } from 'lucide-react';

interface AgentEditPageProps {
    agentToEdit: AgentData;
    onSave: (data: AgentData) => void;
    onCancel: () => void;
}

const AgentEditPage: React.FC<AgentEditPageProps> = ({ agentToEdit, onSave, onCancel }) => {
    const [agentData, setAgentData] = useState<AgentData>(agentToEdit);

    const handleInputChange = (field: keyof AgentData, value: any) => {
        setAgentData(prev => ({ ...prev, [field]: value }));
    };

    const handleWorkingHoursChange = (day: string) => {
        setAgentData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: !prev.workingHours[day],
            }
        }));
    };
    
    const handleFlowStepChange = (index: number, instruction: string) => {
        const newFlowSteps = [...agentData.flowSteps];
        newFlowSteps[index].instruction = instruction;
        setAgentData(prev => ({ ...prev, flowSteps: newFlowSteps }));
    };

    const handleKnowledgeBaseChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newKnowledgeBase = [...agentData.knowledgeBase];
        newKnowledgeBase[index][field] = value;
        setAgentData(prev => ({ ...prev, knowledgeBase: newKnowledgeBase }));
    };

    const addKnowledgeBaseItem = () => {
        setAgentData(prev => ({
            ...prev,
            knowledgeBase: [...prev.knowledgeBase, { question: '', answer: '' }]
        }));
    };

    const removeKnowledgeBaseItem = (index: number) => {
        const newKnowledgeBase = [...agentData.knowledgeBase].filter((_, i) => i !== index);
        setAgentData(prev => ({ ...prev, knowledgeBase: newKnowledgeBase }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(agentData);
    };

    return (
        <div className="bg-card p-8 rounded-lg shadow-sm w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Editar Agente</h1>
            <p className="text-text-secondary mb-8">Ajuste as configurações do seu assistente de IA.</p>
            
            <form onSubmit={handleSubmit} className="space-y-10">
                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center"><Bot className="mr-3 text-primary" /> Tipo de IA</h2>
                    <div className="bg-light p-4 rounded-lg border border-border">
                        <p className="font-semibold text-lg text-text-primary">{agentData.type}</p>
                        <p className="text-text-secondary text-sm">O tipo de IA não pode ser alterado após a criação.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center"><User className="mr-3 text-primary" /> Perfil da IA</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">Nome do seu Agente <span className="text-red-500">*</span></label>
                            <input type="text" value={agentData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" placeholder="Ex: Jaci.AI" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-text-primary mb-1">Número de WhatsApp <span className="text-red-500">*</span></label>
                             <select value={agentData.whatsappNumber} onChange={e => handleInputChange('whatsappNumber', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary">
                                <option value="">Selecione uma instância</option>
                                <option value="+5511987654321">+55 11 98765-4321 (Principal)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">Tamanho médio da resposta</label>
                            <select value={agentData.responseLength} onChange={e => handleInputChange('responseLength', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary">
                                <option>Curta</option>
                                <option>Média</option>
                                <option>Longa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">Idioma de Fala da IA</label>
                            <select value={agentData.language} onChange={e => handleInputChange('language', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary">
                                 <option>Português (Brasil)</option>
                                 <option>Inglês (USA)</option>
                                 <option>Espanhol (Espanha)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">Comunicação</label>
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => handleInputChange('communicationStyle', 'Formal')} className={`flex-1 p-2 rounded-lg border ${agentData.communicationStyle === 'Formal' ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Formal</button>
                                <button type="button" onClick={() => handleInputChange('communicationStyle', 'Casual')} className={`flex-1 p-2 rounded-lg border ${agentData.communicationStyle === 'Casual' ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Casual</button>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-primary mb-1">Você deseja que a sua IA utilize emojis na resposta?</label>
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => handleInputChange('useEmojis', true)} className={`flex-1 p-2 rounded-lg border ${agentData.useEmojis ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Sim</button>
                                <button type="button" onClick={() => handleInputChange('useEmojis', false)} className={`flex-1 p-2 rounded-lg border ${!agentData.useEmojis ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Não</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center"><Building className="mr-3 text-primary" /> Perfil da empresa</h2>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                           <div>
                               <label className="block text-sm font-medium text-text-primary mb-1">Nome da Empresa <span className="text-red-500">*</span></label>
                               <input type="text" value={agentData.companyName} onChange={e => handleInputChange('companyName', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" placeholder="Ex: Studio Jacilene Félix" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-text-primary mb-1">Setor ou Segmento de Atuação <span className="text-red-500">*</span></label>
                               <select value={agentData.industry} onChange={e => handleInputChange('industry', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary">
                                   <option value="">Selecione uma opção</option>
                                   <option>Saúde e Beleza</option>
                                   <option>Varejo</option>
                                   <option>Serviços</option>
                                   <option>Educação</option>
                                   <option>Tecnologia</option>
                                   <option>Imobiliário</option>
                                   <option>Alimentação</option>
                                   <option>E-commerce</option>
                                   <option>Outro</option>
                               </select>
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">Descrição da empresa</label>
                           <textarea rows={4} value={agentData.companyDescription} onChange={e => handleInputChange('companyDescription', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" placeholder="Descreva detalhes sobre a empresa, como história, missão, valores, etc..."></textarea>
                       </div>
                        <div>
                           <label className="block text-sm font-medium text-text-primary mb-1">Endereço da empresa (Opcional)</label>
                           <input type="text" value={agentData.companyAddress} onChange={e => handleInputChange('companyAddress', e.target.value)} className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" placeholder="Ex: Rua Exemplo, 123 - Bairro - Cidade/UF - CEP: 00000-000" />
                       </div>
                       <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Horário de funcionamento</h3>
                            <p className="text-sm text-text-secondary mb-4">A IA irá atuar 24h por dia, não somente nesses horários.</p>
                            <div className="space-y-2">
                               {Object.entries(agentData.workingHours).map(([day, isOpen]) => (
                                   <div key={day} className="flex justify-between items-center p-2 bg-light rounded-lg">
                                       <span>{day}</span>
                                       <label className="relative inline-flex items-center cursor-pointer">
                                           <input type="checkbox" checked={isOpen} onChange={() => handleWorkingHoursChange(day)} className="sr-only peer" />
                                           <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                       </label>
                                   </div>
                               ))}
                            </div>
                       </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center"><ListChecks className="mr-3 text-primary" /> Etapas da IA</h2>
                     <div className="space-y-4">
                        {agentData.flowSteps.map((step, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-text-primary mb-1">{step.name} <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={step.instruction}
                                    onChange={e => handleFlowStepChange(index, e.target.value)}
                                    className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" 
                                    placeholder={`Instrução para a etapa de ${step.name.toLowerCase()}`} 
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center"><BrainCircuit className="mr-3 text-primary" /> Treinamento e Base de Conhecimento</h2>
                    <p className="text-text-secondary mb-6 -mt-4">Forneça informações adicionais para a IA responder perguntas frequentes.</p>
                    <div className="space-y-4">
                        {agentData.knowledgeBase.map((item, index) => (
                            <div key={index} className="bg-light p-4 rounded-lg border border-border relative">
                                 <button 
                                    type="button"
                                    onClick={() => removeKnowledgeBaseItem(index)}
                                    className="absolute top-3 right-3 text-text-secondary hover:text-red-500 p-1"
                                    aria-label="Remover pergunta"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="space-y-4 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-1">Pergunta</label>
                                        <input 
                                            type="text"
                                            value={item.question}
                                            onChange={(e) => handleKnowledgeBaseChange(index, 'question', e.target.value)}
                                            className="w-full bg-white border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                                            placeholder="Ex: Quais as formas de pagamento?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-1">Resposta</label>
                                        <textarea
                                            rows={3}
                                            value={item.answer}
                                            onChange={(e) => handleKnowledgeBaseChange(index, 'answer', e.target.value)}
                                            className="w-full bg-white border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                                            placeholder="Ex: Aceitamos Pix, cartão de crédito e débito."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addKnowledgeBaseItem}
                            className="flex items-center bg-primary/10 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                            <Plus size={16} className="mr-2"/>
                            Adicionar Pergunta
                        </button>
                    </div>
                </section>
                
                <div className="flex justify-end items-center mt-12 border-t border-border pt-6 space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-light text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-border"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentEditPage;
