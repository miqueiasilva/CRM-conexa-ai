import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';

// Mock data
const chatListData = [
    { id: 1, name: 'Ana Silva', lastMessage: 'Olá! Tenho interesse no serviço...', time: '10:42', unread: 2, avatar: 'AS' },
    { id: 3, name: 'Carla Dias', lastMessage: 'Confirmado! Te vejo amanhã.', time: 'Ontem', unread: 0, avatar: 'CD' },
    { id: 5, name: 'Eduarda Lima', lastMessage: 'Qual o valor da limpeza de pele?', time: 'Sexta', unread: 0, avatar: 'EL' },
    { id: 2, name: 'Bruno Costa', lastMessage: 'Obrigado!', time: 'Sexta', unread: 0, avatar: 'BC' },
    { id: 4, name: 'Daniel Alves', lastMessage: 'Você: O agendamento foi confirmado.', time: 'Quinta', unread: 0, avatar: 'DA' },
];

const messagesData: { [key: number]: { id: number, text: string, sender: 'me' | 'other', time: string }[] } = {
    1: [
        { id: 1, text: 'Olá! Tenho interesse no serviço de micropigmentação.', sender: 'other', time: '10:40' },
        { id: 2, text: 'Olá, Ana! Claro. A micropigmentação custa R$ 500. Gostaria de agendar?', sender: 'me', time: '10:41' },
        { id: 3, text: 'Sim, por favor. Qual o próximo horário disponível?', sender: 'other', time: '10:42' },
    ],
    3: [
        { id: 1, text: 'Oi, Carla! Só para confirmar nosso agendamento amanhã às 14h.', sender: 'me', time: 'Ontem' },
        { id: 2, text: 'Confirmado! Te vejo amanhã.', sender: 'other', time: 'Ontem' },
    ],
    5: [
         { id: 1, text: 'Qual o valor da limpeza de pele?', sender: 'other', time: 'Sexta' }
    ],
    2: [
        { id: 1, text: 'Obrigado!', sender: 'other', time: 'Sexta'}
    ],
    4: [
        { id: 1, text: 'O agendamento foi confirmado.', sender: 'me', time: 'Quinta'}
    ]
};

const ChatListPage: React.FC = () => {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(1);
    const [messages, setMessages] = useState(messagesData[1] || []);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectChat = (id: number) => {
        setSelectedChatId(id);
        setMessages(messagesData[id] || []);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedChatId) return;

        const newMsg = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'me' as const,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };

    const selectedChat = chatListData.find(c => c.id === selectedChatId);

    return (
        <div className="flex h-[calc(100vh-90px)] bg-card rounded-lg shadow-sm border border-border">
            {/* Chat List Panel */}
            <div className="w-1/3 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border flex-shrink-0">
                    <h2 className="text-xl font-bold text-text-primary">Mensagens</h2>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input type="text" placeholder="Pesquisar..." className="w-full bg-light border-border rounded-lg py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {chatListData.map(chat => (
                        <div key={chat.id} onClick={() => handleSelectChat(chat.id)} className={`flex items-start p-4 cursor-pointer hover:bg-light border-l-4 ${selectedChatId === chat.id ? 'bg-primary/5 border-primary' : 'border-transparent'}`}>
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-md flex-shrink-0 mr-3">
                                {chat.avatar}
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-text-primary truncate">{chat.name}</h3>
                                    <span className="text-xs text-text-secondary flex-shrink-0 ml-2">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-text-secondary truncate">{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View Panel */}
            <div className="w-2/3 flex flex-col bg-light">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-border bg-card flex-shrink-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-md flex-shrink-0 mr-3">
                                    {selectedChat.avatar}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">{selectedChat.name}</h3>
                                    <p className="text-xs text-green-500">Online</p>
                                </div>
                            </div>
                            <button className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-light">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-grow p-6 overflow-y-auto">
                             <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md px-4 py-2 rounded-xl shadow-sm ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-white text-text-primary border border-border'}`}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-text-secondary'} text-right`}>{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-card border-t border-border flex-shrink-0">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <button type="button" className="text-text-secondary hover:text-primary p-2 rounded-full hover:bg-light"><Paperclip size={20} /></button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite uma mensagem..."
                                    className="flex-grow bg-light border border-border rounded-lg py-2 px-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button type="submit" className="bg-primary text-white font-bold p-3 rounded-lg hover:bg-secondary disabled:bg-gray-400 flex items-center justify-center">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        <p>Selecione uma conversa para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatListPage;