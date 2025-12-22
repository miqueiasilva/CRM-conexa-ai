
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Lead, Appointment, FunctionCall } from '../types';
import { runChat, sendFunctionResponse, startChat } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
    addLead: (lead: Omit<Lead, 'id' | 'status'>) => void;
    addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ addLead, addAppointment }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            await startChat();
            setMessages([
                { id: '1', sender: 'ai', text: 'Olá! Sou Jaci.AI, sua assistente da Convexa.AI. Como posso ajudar seu negócio hoje?' }
            ]);
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFunctionCall = async (fc: FunctionCall) => {
        let response = { success: true };
        
        if (fc.name === 'criar_lead') {
            addLead({
                name: fc.args.nome,
                whatsapp: fc.args.whatsapp,
                origin: fc.args.origem || 'Simulador',
                value: 0,
                lastContact: 'Agora'
            });
        } else if (fc.name === 'criar_agendamento') {
            addAppointment({
                leadName: fc.args.nome_do_cliente,
                service: fc.args.servico,
                professional: fc.args.profissional || 'Padrão',
                dateTime: new Date(`${fc.args.data}T${fc.args.hora}`)
            });
        }

        const result = await sendFunctionResponse({
            functionResponses: [{ name: fc.name, response }]
        });
        
        if (result.text) {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: result.text! }]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await runChat(input);
            if (result.candidates?.[0]?.content?.parts) {
                for (const part of result.candidates[0].content.parts) {
                    if (part.text) {
                        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: part.text! }]);
                    }
                    if (result.functionCalls) {
                        for (const fc of result.functionCalls) {
                            await handleFunctionCall(fc);
                        }
                    }
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: 'Desculpe, tive um problema técnico. Pode repetir?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tighter">Simulador Jaci.AI</h2>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">IA Conectada & Ativa</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm text-sm font-medium ${
                            msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-blue-600" />
                            <span className="text-xs font-bold text-slate-400">Jaci está pensando...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Envie uma mensagem para a Jaci..."
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
