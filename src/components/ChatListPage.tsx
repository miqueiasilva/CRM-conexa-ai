import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';

const chatListData = [
    { id: 1, name: 'Ana Silva', lastMessage: 'Olá! Tenho interesse no serviço...', time: '10:42', unread: 2, avatar: 'AS' },
    { id: 3, name: 'Carla Dias', lastMessage: 'Confirmado! Te vejo amanhã.', time: 'Ontem', unread: 0, avatar: 'CD' },
    { id: 5, name: 'Eduarda Lima', lastMessage: 'Qual o valor da limpeza de pele?', time: 'Sexta', unread: 0, avatar: 'EL' },
];

const initialMessages: { [key: number]: any[] } = {
    1: [{ id: 1, text: 'Olá! Tenho interesse no serviço de micropigmentação.', sender: 'other', time: '10:40' }],
    3: [{ id: 1, text: 'Confirmado! Te vejo amanhã.', sender: 'other', time: 'Ontem' }],
    5: [{ id: 1, text: 'Qual o valor da limpeza de pele?', sender: 'other', time: 'Sexta' }],
};

const ChatListPage: React.FC = () => {
    // LOGIC: Estado de mensagens por ID de chat
    const [selectedChatId, setSelectedChatId] = useState<number>(1);
    const [allMessages, setAllMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeMessages = allMessages[selectedChatId] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        setAllMessages(prev => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), msg]
        }));
        setNewMessage('');
    };

    const selectedChat = chatListData.find(c => c.id === selectedChatId);

    return (
        <div className="flex h-[calc(100vh-120px)] bg-card rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
            {/* Sidebar de Chats */}
            <div className="w-1/3 border-r border-slate-100 flex flex-col bg-white">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Conversas</h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Buscar cliente..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {chatListData.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setSelectedChatId(chat.id)} 
                            className={`flex items-center p-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedChatId === chat.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mr-4 shadow-lg shadow-blue-200">
                                {chat.avatar}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-slate-900 truncate">{chat.name}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Area de Mensagens */}
            <div className="flex-1 flex flex-col bg-slate-50/50">
                {selectedChat ? (
                    <>
                        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mr-3 shadow-md shadow-blue-100">
                                    {selectedChat.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{selectedChat.name}</h3>
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Online via WhatsApp</span>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-2"><MoreVertical size={20} /></button>
                        </div>
                        
                        <div className="flex-grow p-6 overflow-y-auto space-y-4">
                            {activeMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm text-sm font-medium ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <button type="button" className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors"><Paperclip size={20} /></button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua resposta..."
                                    className="flex-grow bg-slate-100 border-none rounded-2xl py-3 px-6 text-sm focus:ring-2 focus:ring-blue-600 transition-all"
                                />
                                <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 font-bold">Selecione um chat para começar</div>
                )}
            </div>
        </div>
    );
};

export default ChatListPage;