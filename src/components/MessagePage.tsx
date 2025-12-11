import React from 'react';
import { Send, FileText, Smile } from 'lucide-react';

const MessagePage: React.FC = () => {
    return (
        <div className="bg-card p-8 rounded-lg shadow-sm max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Disparo em Massa</h1>
            <p className="text-text-secondary mb-8">Envie mensagens para múltiplos contatos do seu CRM.</p>

            <form className="space-y-6">
                <div>
                    <label htmlFor="recipientList" className="block text-sm font-medium text-text-primary mb-1">
                        Selecione a Lista de Destinatários
                    </label>
                    <select
                        id="recipientList"
                        className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                    >
                        <option>Todos os Leads Capturados</option>
                        <option>Clientes com Venda Realizada</option>
                        <option>Leads do Instagram</option>
                        <option>Aniversariantes do Mês</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="messageContent" className="block text-sm font-medium text-text-primary mb-1">
                        Conteúdo da Mensagem
                    </label>
                    <div className="relative">
                        <textarea
                            id="messageContent"
                            rows={8}
                            className="w-full bg-light border border-border rounded-lg p-2 pr-10 focus:ring-primary focus:border-primary"
                            placeholder="Digite sua mensagem aqui... Use {nome} para personalizar."
                        ></textarea>
                        <div className="absolute top-2 right-2 flex flex-col space-y-2">
                             <button type="button" className="text-text-secondary hover:text-primary"><FileText size={18} /></button>
                             <button type="button" className="text-text-secondary hover:text-primary"><Smile size={18} /></button>
                        </div>
                    </div>
                     <p className="text-xs text-text-secondary mt-1">
                        Variáveis disponíveis: <code className="bg-light px-1 rounded">{`{nome}`}</code>, <code className="bg-light px-1 rounded">{`{servico}`}</code>
                    </p>
                </div>
                
                <div className="flex items-center justify-between">
                     <p className="text-sm text-text-secondary">
                        Mensagem será enviada para <span className="font-bold">42 contatos</span>.
                    </p>
                    <button
                        type="submit"
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary transition-colors flex items-center"
                    >
                        <Send size={16} className="mr-2" />
                        Enviar Disparo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessagePage;