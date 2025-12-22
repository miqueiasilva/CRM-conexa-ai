
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Lead, Appointment } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { APP_NAME } from '../constants';

interface ChatInterfaceProps {
    addLead: (lead: Omit<Lead, 'id' | 'status'>) => void;
    addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ addLead, addAppointment }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        setMessages([
            { id: '1', sender: 'ai', text: `Olá! Sou Jaci.AI, sua assistente da ${APP_NAME}. Como posso ajudar seu negócio hoje? Posso cadastrar leads, verificar serviços ou agendar horários.` }
        ]);
    }, []);

    const processAIResponse = async (userPrompt: string) => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userPrompt,
                config: {
                    systemInstruction: `Você é Jaci.AI, assistente virtual da ${APP_NAME}. 
                    Seu objetivo é ser útil, empática e eficiente.
                    Capacidades: 
                    1. Criar Leads: Se o usuário der nome e contato, diga que anotou.
                    2. Agendar: Se o usuário pedir horário, sugira disponibilidade fictícia.
                    3. Conhecimento: Você conhece micropigmentação, design de sobrancelhas e limpeza de pele.
                    Mantenha o tom profissional mas acolhedor.`,
                }
            });

            const text = response.text || 'Desculpe, não consegui processar isso agora.';
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: 'error', sender: 'ai', text: 'Tive um problema na conexão. Pode repetir?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        processAIResponse(currentInput);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                        <Bot className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tighter">Simulador Jaci.AI</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">IA Ativa e Conectada</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <Sparkles size={14} className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-700">Gemini 3 Pro</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/30">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm text-sm font-medium ${
                            msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-3 shadow-sm">
                            <Loader2 size={16} className="animate-spin text-blue-600" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Jaci está digitando...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-slate-100 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-3 max-w-5xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Converse com sua IA SDR agora..."
                        className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50">
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
