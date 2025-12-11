
import React, { useState } from 'react';
import { Search, ChevronDown, BookOpen, Bot, LayoutGrid, Mail, MessageSquare, ChevronUp } from 'lucide-react';

interface HelpPageProps {
    setPage: (page: string) => void;
}

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-light rounded-md"
            >
                <span className="font-semibold text-text-primary">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-text-secondary" />}
            </button>
            {isOpen && <div className="p-4 pt-0 text-text-secondary">{children}</div>}
        </div>
    );
};

const HelpPage: React.FC<HelpPageProps> = ({ setPage }) => {
    return (
        <div className="bg-card p-8 rounded-lg shadow-sm max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-text-primary">Central de Ajuda</h1>
                <p className="text-lg text-text-secondary mt-2">Como podemos te ajudar hoje?</p>
                <div className="relative mt-6 max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Pesquisar por tópicos..."
                        className="w-full bg-light border border-border rounded-full py-3 pl-12 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Primeiros Passos</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div onClick={() => setPage('WhatsApp')} className="bg-light p-6 rounded-lg border border-border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                        <BookOpen size={28} className="text-primary mb-4" />
                        <h3 className="font-bold text-lg text-text-primary mb-2">Conectando seu WhatsApp</h3>
                        <p className="text-sm text-text-secondary">Aprenda a integrar sua conta do WhatsApp para começar a automatizar.</p>
                    </div>
                     <div onClick={() => setPage('Criação de Agente')} className="bg-light p-6 rounded-lg border border-border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                        <Bot size={28} className="text-primary mb-4" />
                        <h3 className="font-bold text-lg text-text-primary mb-2">Criando seu Agente de IA</h3>
                        <p className="text-sm text-text-secondary">Siga o passo a passo para configurar seu primeiro assistente virtual.</p>
                    </div>
                    <div onClick={() => setPage('Quadro')} className="bg-light p-6 rounded-lg border border-border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                        <LayoutGrid size={28} className="text-primary mb-4" />
                        <h3 className="font-bold text-lg text-text-primary mb-2">Entendendo o Quadro CRM</h3>
                        <p className="text-sm text-text-secondary">Descubra como gerenciar seus leads e visualizar seu funil de vendas.</p>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Perguntas Frequentes (FAQ)</h2>
                <div>
                    <FaqItem question="Como a IA sabe o que responder?">
                        <p>A IA é treinada com base nas informações que você fornece durante a criação do agente, incluindo o perfil da sua empresa, as etapas do fluxo de conversa e a base de conhecimento (perguntas e respostas). Ela utiliza essas informações para entender o contexto e formular respostas precisas e personalizadas.</p>
                    </FaqItem>
                    <FaqItem question="Posso ter mais de um número de WhatsApp conectado?">
                        <p>Sim! Nossa plataforma permite que você conecte e gerencie múltiplas instâncias do WhatsApp. Você pode adicionar novas contas na página de "Integrações &gt; WhatsApp" e atribuir agentes de IA específicos para cada número, se desejar.</p>
                    </FaqItem>
                    <FaqItem question="Meus dados e conversas estão seguros?">
                        <p>Absolutamente. A segurança é nossa prioridade máxima. Todas as conversas são criptografadas e seus dados são armazenados em servidores seguros, seguindo as melhores práticas de proteção de dados do mercado. Não compartilhamos suas informações com terceiros.</p>
                    </FaqItem>
                    <FaqItem question="O que acontece se a IA não souber responder uma pergunta?">
                        <p>O agente de IA é projetado para lidar com uma vasta gama de perguntas com base no seu treinamento. No entanto, se encontrar uma pergunta que não consegue responder, o sistema pode ser configurado para transferir a conversa para um atendente humano (função "handover") ou responder com uma mensagem padrão, pedindo para o cliente reformular a pergunta.</p>
                    </FaqItem>
                </div>
            </section>

             <section>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Ainda precisa de ajuda?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 flex items-start">
                         <Mail size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-lg text-text-primary mb-1">Suporte via E-mail</h3>
                            <p className="text-sm text-text-secondary mb-3">Envie sua dúvida para nossa equipe de especialistas. Respondemos em até 24h.</p>
                            <a href="mailto:suporte@conexa.ai" className="font-semibold text-primary hover:underline">suporte@conexa.ai</a>
                        </div>
                    </div>
                    <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 flex items-start">
                         <MessageSquare size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-lg text-text-primary mb-1">Comunidade no WhatsApp</h3>
                            <p className="text-sm text-text-secondary mb-3">Participe do nosso grupo exclusivo para tirar dúvidas e trocar experiências com outros usuários.</p>
                            <a href="#" className="font-semibold text-primary hover:underline">Entrar na comunidade</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpPage;