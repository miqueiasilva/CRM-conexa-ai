import React, { useState, useRef, useEffect } from 'react';
import { GenerateContentResponse } from '@google/genai';
import { ChatMessage, Lead, Appointment, FunctionCall } from '../types';
import { runChat, sendFunctionResponse, startChat } from '../services/geminiService';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
    addLead: (lead: Omit<Lead, 'id' | 'status'>) => void;
    addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const CHAT_HISTORY_KEY = 'conexa_ai_chat_history';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ addLead, addAppointment }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedMessagesRaw = localStorage.getItem(CHAT_HISTORY_KEY);
        if (savedMessagesRaw) {
            const savedMessages = JSON.parse(savedMessagesRaw);
            if (savedMessages && savedMessages.length > 0) {
                setMessages(savedMessages);
                startChat(); // Re-initialize chat session for new messages
                return;
            }
        }
        
        const init = async () => {
            setIsLoading(true);
            await startChat();
            setMessages([{ id: 'init', sender: 'ai', text: 'Olá! 👋 Sou a Jaci.AI, assistente virtual do Studio Jacilene Félix. Como posso te ajudar hoje?' }]);
            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (messages.length > 0) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    const handleFunctionCall = async (functionCall: FunctionCall) => {
        let functionResponse;
        let userFriendlyMessage = '';

        const args = functionCall.args;

        switch (functionCall.name) {
            case 'criar_lead':
                addLead({ name: args.nome, whatsapp: args.whatsapp, origin: args.origem });
                userFriendlyMessage = `Lead para ${args.nome} criado com sucesso!`;
                functionResponse = { result: "LEAD_CRIADO_COM_SUCESSO" };
                break;
            case 'criar_agendamento':
                const [year, month, day] = args.data.split('-').map(Number);
                const [hour, minute] = args.hora.split(':').map(Number);
                const appointmentDate = new Date(year, month - 1, day, hour, minute);
                
                addAppointment({ leadName: args.nome_do_cliente, service: args.servico, professional: args.profissional, dateTime: appointmentDate });
                userFriendlyMessage = `Agendamento para ${args.nome_do_cliente} (${args.servico}) em ${appointmentDate.toLocaleString('pt-BR')} confirmado!`;
                functionResponse = { result: `AGENDAMENTO_CONFIRMADO_PARA_${args.data}` };
                break;
            case 'buscar_preco':
                const precos: { [key: string]: number } = {
                    'micropigmentação': 500,
                    'design de sobrancelhas': 80,
                    'micropigmentação labial': 450,
                    'limpeza de pele': 150,
                };
                const preco = precos[args.servico.toLowerCase()] || 'não encontrado';
                userFriendlyMessage = `O preço para ${args.servico} é R$ ${preco}.`;
                functionResponse = { result: `PRECO_DO_SERVICO_${args.servico.toUpperCase()}_EH_${preco}` };
                break;
            case 'handover_humano':
                userFriendlyMessage = `Entendido. Estou transferindo você para um de nossos atendentes. Por favor, aguarde um momento.`;
                functionResponse = { result: "TRANSFERENCIA_INICIADA" };
                break;
            default:
                userFriendlyMessage = `Função desconhecida: ${functionCall.name}`;
                functionResponse = { result: "FUNCAO_DESCONHECIDA" };
        }

        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: userFriendlyMessage, functionCall }]);
        
        const response = await sendFunctionResponse({ functionResponses: [{ name: functionCall.name, response: functionResponse }] });
        processResponse(response);
    };

    const processResponse = (response: GenerateContentResponse) => {
        if (response.functionCalls && response.functionCalls.length > 0) {
            handleFunctionCall(response.functionCalls[0]);
        } else {
            const text = response.text;
            if (text) {
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text }]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await runChat(input);
            processResponse(result);
        } catch (error) {
            console.error('Error with Gemini API:', error);
            setMessages(prev => [...prev, { id: 'error', sender: 'ai', text: 'Desculpe, estou com um problema no momento. Tente novamente mais tarde.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm flex flex-col h-[85vh] max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Simulador Jaci.AI</h1>
            <div className="flex-grow bg-light rounded-md p-4 overflow-y-auto mb-4 space-y-4 border border-border">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-text-primary border border-border'}`}>
                           <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">AI</div>
                        <div className="bg-white text-text-primary border border-border px-4 py-2 rounded-xl">
                            <span className="animate-pulse">Digitando...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Converse com Jaci.AI..."
                    className="flex-grow bg-white border border-border rounded-lg py-2 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                />
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary disabled:bg-gray-400 flex items-center justify-center" disabled={isLoading}>
                    <Send size={18}/>
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;