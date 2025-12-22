import React, { useState } from 'react';
import { Search, ChevronDown, BookOpen, Bot, LayoutGrid, Mail, MessageSquare, ChevronUp, LifeBuoy } from 'lucide-react';

interface HelpPageProps {
    setPage: (page: string) => void;
}

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-3 transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5 px-6 hover:bg-slate-50 transition-colors"
            >
                <span className="font-bold text-slate-900">{question}</span>
                <div className={`p-1.5 rounded-full ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'} transition-all`}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed animate-fade-in-up">
                    {children}
                </div>
            )}
        </div>
    );
};

const HelpPage: React.FC<HelpPageProps> = ({ setPage }) => {
    return (
        <div className="max-w-5xl mx-auto py-8 animate-fade-in-up">
            <div className="text-center mb-16">
                <div className="inline-flex p-4 bg-blue-100 rounded-3xl text-blue-600 mb-6 shadow-sm">
                    <LifeBuoy size={32} />
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Central de Ajuda</h1>
                <p className="text-xl text-slate-500 font-medium">Tudo o que você precisa saber para escalar com IA.</p>
                <div className="relative mt-10 max-w-xl mx-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Como podemos te ajudar hoje?"
                        className="w-full bg-white border border-slate-200 rounded-[2rem] py-5 pl-16 pr-8 text-slate-900 font-medium shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-20">
                <div onClick={() => setPage('WhatsApp')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen size={28} />
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-2">WhatsApp</h3>
                    <p className="text-sm text-slate-500 font-medium">Configuração de instâncias e conexão estável.</p>
                </div>
                <div onClick={() => setPage('Criação de Agente')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Bot size={28} />
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-2">Agente IA</h3>
                    <p className="text-sm text-slate-500 font-medium">Treinamento de base de conhecimento e tom de voz.</p>
                </div>
                <div onClick={() => setPage('Quadro')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <LayoutGrid size={28} />
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-2">CRM Quadro</h3>
                    <p className="text-sm text-slate-500 font-medium">Gestão de leads e automação de vendas.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">Dúvidas Frequentes</h2>
                    <div className="space-y-4">
                        <FaqItem question="Como a Jaci.AI qualifica meus leads?">
                            <p>A Jaci.AI utiliza processamento de linguagem natural (LLM) para analisar as mensagens recebidas. Ela segue as instruções de fluxo que você define no Criador de Agente para extrair informações críticas como serviço desejado, urgência e orçamento.</p>
                        </FaqItem>
                        <FaqItem question="Quantos números posso conectar?">
                            <p>No plano Convexa Base você pode conectar até 2 números. Para contas Enterprise o limite é customizado de acordo com sua operação de SDR.</p>
                        </FaqItem>
                        <FaqItem question="O sistema agenda direto no Google Calendar?">
                            <p>Sim! Através da integração na página de Perfil da Empresa, você pode conectar sua agenda e a IA só oferecerá horários realmente disponíveis.</p>
                        </FaqItem>
                    </div>
                </div>
                
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center">
                    <div className="p-4 bg-white/10 rounded-2xl w-fit mb-6">
                        <MessageSquare size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Ainda com dúvidas?</h3>
                    <p className="text-slate-400 font-medium mb-8">Nossa equipe de suporte técnico está pronta para te atender agora.</p>
                    <a href="mailto:suporte@convexa.ai" className="bg-blue-600 text-white font-black py-4 px-6 rounded-2xl text-center shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Falar com Suporte</a>
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
                        </div>
                        <span className="text-xs text-slate-400 font-bold">12 Especialistas Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;