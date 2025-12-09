import React, { useState } from 'react';
import { AgentData } from '../types';
import { Check, Bot, User, Building, ListChecks, BrainCircuit, Zap, Filter, LineChart, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

const initialAgentData: AgentData = {
    type: '',
    name: '',
    responseLength: 'Curta',
    communicationStyle: 'Casual',
    useEmojis: true,
    language: 'Português (Brasil)',
    whatsappNumber: '',
    companyName: '',
    industry: '',
    companyDescription: '',
    companyAddress: '',
    workingHours: {
        'Segunda-feira': true,
        'Terça-feira': true,
        'Quarta-feira': true,
        'Quinta-feira': true,
        'Sexta-feira': true,
        'Sábado': false,
        'Domingo': false,
    },
    flowSteps: [
        { name: 'Saudação', instruction: 'Dê as boas-vindas ao cliente de forma amigável.' },
        { name: 'Qualificação', instruction: 'Entenda a necessidade inicial do cliente.' },
        { name: 'Apresentação', instruction: 'Apresente os serviços relevantes.' },
        { name: 'Agendamento', instruction: 'Colete os dados para o agendamento.' },
        { name: 'Confirmação', instruction: 'Confirme o agendamento e os próximos passos.' },
    ],
    knowledgeBase: []
};


const STEPS = [
  { name: 'Tipo de IA', icon: Bot },
  { name: 'Perfil da IA', icon: User },
  { name: 'Perfil da empresa', icon: Building },
  { name: 'Etapas da IA', icon: ListChecks },
  { name: 'Treinamento', icon: BrainCircuit },
];

interface AgentCreatorProps {
    agentToEdit?: AgentData | null;
    onSave: (data: AgentData) => void;
}

const AgentCreator: React.FC<AgentCreatorProps> = ({ agentToEdit, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [agentData, setAgentData] = useState<AgentData>(agentToEdit || initialAgentData);

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


    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };
    
    const isStepComplete = () => {
        switch (currentStep) {
            case 1:
                return agentData.type !== '';
            case 2:
                return agentData.name.trim() !== '' && agentData.whatsappNumber !== '';
            case 3:
                return agentData.companyName.trim() !== '' && agentData.industry !== '';
            case 4:
                 return agentData.flowSteps.every(step => step.instruction.trim() !== '');
            case 5:
                return true; // Treinamento é opcional para finalizar
            default:
                return false;
        }
    };
    
    const handleFinish = () => {
        onSave(agentData);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <Step1 agentData={agentData} setAgentData={setAgentData} nextStep={nextStep} />;
            case 2:
                return <Step2 agentData={agentData} handleInputChange={handleInputChange} />;
            case 3:
                return <Step3 agentData={agentData} handleInputChange={handleInputChange} handleWorkingHoursChange={handleWorkingHoursChange} />;
            case 4:
                return <Step4 agentData={agentData} handleFlowStepChange={handleFlowStepChange} />;
            case 5:
                return <Step5 
                            agentData={agentData} 
                            handleKnowledgeBaseChange={handleKnowledgeBaseChange}
                            addKnowledgeBaseItem={addKnowledgeBaseItem}
                            removeKnowledgeBaseItem={removeKnowledgeBaseItem} 
                        />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-card p-8 rounded-lg shadow-sm w-full">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Criação de Agente</h1>
            <p className="text-text-secondary mb-8">Siga os passos para configurar seu assistente de IA.</p>
            
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12">
                {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'border-primary' : isCompleted ? 'border-green-500' : 'border-border'}`}>
                                    {isCompleted && !isActive ? <Check className="text-green-500" /> : <step.icon className={isActive ? 'text-primary' : 'text-text-secondary'} />}
                                </div>
                                <p className={`mt-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-text-secondary'}`}>{step.name}</p>
                            </div>
                            {stepNumber < STEPS.length && <div className={`flex-1 h-0.5 mx-4 transition-colors ${isCompleted ? 'bg-green-500' : 'bg-border'}`}></div>}
                        </React.Fragment>
                    );
                })}
            </div>
            
            {/* Step Content */}
            <div>{renderStepContent()}</div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 border-t border-border pt-6">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="bg-light text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    <ChevronLeft size={18} className="mr-1" />
                    Voltar
                </button>
                {currentStep < STEPS.length ? (
                    <button
                        onClick={nextStep}
                        disabled={!isStepComplete()}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Continuar
                        <ChevronRight size={18} className="ml-1" />
                    </button>
                ) : (
                     <button
                        onClick={handleFinish}
                        disabled={!isStepComplete()}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Finalizar Criação
                    </button>
                )}
            </div>
        </div>
    );
};

const Step1 = ({ agentData, setAgentData, nextStep }: { agentData: AgentData, setAgentData: React.Dispatch<React.SetStateAction<AgentData>>, nextStep: () => void }) => {
    
    const handleSelectType = (type: string) => {
        setAgentData(prev => ({...prev, type}));
        setTimeout(nextStep, 300); // Avança para o próximo passo após uma pequena pausa
    };

    const agentTypes = [
        {
            icon: LineChart,
            title: "IA de SDR",
            subtitle: "Agendamentos inteligentes com triagem automática.",
            description: "Ideal para serviços e produtos que exigem agendar um horário ou visita. Quem vende serviços mais caros, acima de R$1.000. A IA recebe o cliente, entende o caso, qualifica e direciona para você finalizar agendamento de um horário para reunião, ligação, consulta, avaliação, visita técnica.",
            idealFor: ["Não passa preço direto no WhatsApp", "Precisa entender o cliente antes da consulta", "Faz atendimentos presenciais ou por chamada"],
            examples: "Dentistas, médicos, harmonizadores, consultores, nutricionistas, psicólogos."
        },
        {
            icon: Filter,
            title: "IA de Qualificação",
            subtitle: "Filtre clientes prontos para avançar.",
            description: "A IA conversa com o lead, faz perguntas estratégicas e só te chama quando o cliente estiver qualificado.",
            idealFor: ["Faz orçamento sob medida", "Precisa entender o projeto antes de vender", "Quer evitar perder tempo com curiosos"],
            examples: "Arquitetos, tatuadores, marcenarias, serviços personalizados."
        },
        {
            icon: Zap,
            title: "IA de Vendas",
            subtitle: "Venda no automático com atendimento direto.",
            description: "Perfeita para quem já tem preços definidos. A IA responde dúvidas, envia tabela ou catálogo e direciona para o pagamento.",
            idealFor: ["Já tem link ou tabela de preços", "Quer vender sem precisar conversar", "Atende muitos pedidos parecidos todos os dias"],
            examples: "Manicure, loja online, esteticista, serviços até R$1.000."
        }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-text-primary mb-2">Qual o tipo de IA ideal para você?</h2>
            <p className="text-center text-text-secondary mb-8">Selecione o tipo de IA que melhor se adapta às suas necessidades.</p>
            <div className="grid md:grid-cols-3 gap-6">
                {agentTypes.map(type => (
                    <div 
                        key={type.title}
                        onClick={() => handleSelectType(type.title)}
                        className={`border-2 rounded-lg p-6 cursor-pointer hover:border-primary transition-all flex flex-col ${agentData.type === type.title ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                        <type.icon size={24} className="text-primary mb-4" />
                        <h3 className="text-lg font-bold text-text-primary">{type.title}</h3>
                        <p className="font-semibold text-primary mb-3 text-sm">{type.subtitle}</p>
                        <p className="text-sm text-text-secondary mb-4">{type.description}</p>
                        
                        <div className="mt-auto pt-4">
                            <h4 className="font-bold text-text-primary mb-2 text-sm">Ideal para quem:</h4>
                            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 mb-4">
                               {type.idealFor.map(item => <li key={item}>{item}</li>)}
                            </ul>
                             <h4 className="font-bold text-text-primary mb-2 text-sm">Exemplos:</h4>
                             <p className="text-sm text-text-secondary">{type.examples}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const Step2 = ({ agentData, handleInputChange }: { agentData: AgentData, handleInputChange: (field: keyof AgentData, value: any) => void }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Perfil da IA</h2>
            <p className="text-text-secondary mb-8">Configure a identidade e o comportamento do seu agente.</p>
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
                        <button onClick={() => handleInputChange('communicationStyle', 'Formal')} className={`flex-1 p-2 rounded-lg border ${agentData.communicationStyle === 'Formal' ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Formal</button>
                        <button onClick={() => handleInputChange('communicationStyle', 'Casual')} className={`flex-1 p-2 rounded-lg border ${agentData.communicationStyle === 'Casual' ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Casual</button>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Você deseja que a sua IA utilize emojis na resposta?</label>
                    <div className="flex space-x-2">
                        <button onClick={() => handleInputChange('useEmojis', true)} className={`flex-1 p-2 rounded-lg border ${agentData.useEmojis ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Sim</button>
                        <button onClick={() => handleInputChange('useEmojis', false)} className={`flex-1 p-2 rounded-lg border ${!agentData.useEmojis ? 'bg-primary text-white border-primary' : 'bg-light border-border'}`}>Não</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Step3 = ({ agentData, handleInputChange, handleWorkingHoursChange }: { agentData: AgentData, handleInputChange: (field: keyof AgentData, value: any) => void, handleWorkingHoursChange: (day: string) => void }) => {
    return (
        <div>
             <h2 className="text-2xl font-bold text-text-primary mb-2">Perfil da empresa</h2>
            <p className="text-text-secondary mb-8">Preencha as informações sobre a empresa para que a IA possa fornecer um atendimento personalizado.</p>
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
        </div>
    );
};

const Step4 = ({ agentData, handleFlowStepChange }: { agentData: AgentData, handleFlowStepChange: (index: number, value: string) => void }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Etapas da IA</h2>
            <p className="text-text-secondary mb-8">Defina as instruções para cada etapa do fluxo de conversa.</p>
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
        </div>
    );
};


const Step5 = ({ agentData, handleKnowledgeBaseChange, addKnowledgeBaseItem, removeKnowledgeBaseItem }: {
    agentData: AgentData;
    handleKnowledgeBaseChange: (index: number, field: 'question' | 'answer', value: string) => void;
    addKnowledgeBaseItem: () => void;
    removeKnowledgeBaseItem: (index: number) => void;
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Treinamento e Base de Conhecimento</h2>
            <p className="text-text-secondary mb-8">Forneça informações adicionais para a IA responder perguntas frequentes.</p>
            <div className="space-y-4">
                {agentData.knowledgeBase.map((item, index) => (
                    <div key={index} className="bg-light p-4 rounded-lg border border-border relative">
                         <button 
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
                    onClick={addKnowledgeBaseItem}
                    className="flex items-center bg-primary/10 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors"
                >
                    <Plus size={16} className="mr-2"/>
                    Adicionar Pergunta
                </button>
            </div>
        </div>
    );
};


export default AgentCreator;