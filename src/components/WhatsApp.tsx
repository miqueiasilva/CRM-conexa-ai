
import React, { useState, useEffect } from 'react';
import { X, QrCode, Loader2, RefreshCw, Plus, Info } from 'lucide-react';
import QRCode from 'qrcode';

interface Connection {
    id: number;
    number: string;
    sessionName: string;
    status: 'disconnected' | 'connected' | 'pending';
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

const WhatsApp: React.FC = () => {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<'form' | 'qrcode'>('form');
    
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [sessionName, setSessionName] = useState('');
    
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

    useEffect(() => {
        if (isModalOpen && modalStep === 'qrcode' && selectedConnection) {
            generateQrCode(selectedConnection.number);
        }
    }, [isModalOpen, modalStep, selectedConnection]);
    
    useEffect(() => {
        if (modalStep === 'qrcode' && qrCodeDataUrl && selectedConnection) {
            const timer = setTimeout(() => {
                handleConnect(selectedConnection.id);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [qrCodeDataUrl, selectedConnection]);

    const handleConnect = (connectionId: number) => {
        handleCloseModal();
        setConnections(prev => prev.map(c => c.id === connectionId ? {...c, status: 'pending'} : c));
        
        setTimeout(() => {
             setConnections(prev => prev.map(c => c.id === connectionId ? {...c, status: 'connected'} : c));
        }, 4000);
    };
    
    const handleDisconnect = (connectionId: number) => {
        setConnections(prev => prev.map(c => c.id === connectionId ? {...c, status: 'disconnected'} : c));
    };

    const generateQrCode = async (numberToConnect: string) => {
        setIsGenerating(true);
        setQrCodeDataUrl(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const connectionString = `CONEXA.AI_SESSION_${Date.now()}_${numberToConnect}`;
            const dataUrl = await QRCode.toDataURL(connectionString, {
                width: 256,
                margin: 2,
                color: { dark: '#1F2937', light: '#FFFFFF' }
            });
            setQrCodeDataUrl(dataUrl);
        } catch (err) {
            console.error('Falha ao gerar o QR code', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOpenFormModal = () => {
        setModalStep('form');
        setIsModalOpen(true);
    };

    const handleOpenQrModal = (connection: Connection) => {
        setSelectedConnection(connection);
        setModalStep('qrcode');
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setQrCodeDataUrl(null);
            setModalStep('form');
            setWhatsappNumber('');
            setSessionName('');
            setSelectedConnection(null);
        }, 300);
    }
    
    const handleAddWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (whatsappNumber.trim() === '') {
            alert('Por favor, insira o número do WhatsApp.');
            return;
        }
        const newConnection: Connection = {
            id: Date.now(),
            number: whatsappNumber,
            sessionName: sessionName || 'Padrão',
            status: 'disconnected'
        };
        setConnections(prev => [...prev, newConnection]);
        handleCloseModal();
    };
    
    const renderFormModal = () => (
        <>
            <h2 className="text-xl font-bold text-text-primary mb-4">Adicionar WhatsApp</h2>
            <form onSubmit={handleAddWhatsApp} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Selecionar plataforma</label>
                    <select disabled className="w-full bg-light border border-border rounded-lg p-2 focus:ring-primary focus:border-primary cursor-not-allowed">
                        <option>Whatsapp</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Número do WhatsApp</label>
                    <input type="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full bg-light border border-border rounded-lg p-2" placeholder="Ex: 5511999998888" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Nome da sessão (opcional)</label>
                    <input type="text" value={sessionName} onChange={(e) => setSessionName(e.target.value)} className="w-full bg-light border border-border rounded-lg p-2" placeholder="Ex: Atendimento, Vendas, etc." />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-secondary transition-colors">
                    Adicionar
                </button>
            </form>
        </>
    );

    const renderQrCodeModal = () => (
        <>
            <h2 className="text-xl font-bold text-text-primary mb-4">Conectar ao WhatsApp</h2>
            <p className="text-sm text-text-secondary mb-4">Conectando número: <span className="font-semibold text-text-primary">{selectedConnection?.number}</span></p>
            <div className="bg-light p-4 rounded-lg flex flex-col items-center justify-center">
                <div className="w-64 h-64 bg-white flex items-center justify-center rounded-md border border-border">
                    {isGenerating && <Loader2 size={48} className="text-primary animate-spin" />}
                    {qrCodeDataUrl && !isGenerating && <img src={qrCodeDataUrl} alt="QR Code de conexão do WhatsApp" />}
                    {!qrCodeDataUrl && !isGenerating && <QrCode size={128} className="text-gray-400" />}
                </div>
                <p className="text-text-secondary mt-4 text-sm text-center">
                    1. Abra o WhatsApp no seu telefone. <br/>
                    2. Toque em Configurações &gt; Aparelhos conectados. <br/>
                    3. Aponte seu telefone para capturar o código.
                </p>
            </div>
        </>
    );

    const renderMainContent = () => {
        if (connections.length === 0) {
            return (
                <div className="bg-card p-8 rounded-lg shadow-sm text-center border border-border">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Logo" className="w-24 h-24 mx-auto mb-4"/>
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">Nenhuma conta conectada</h2>
                    <p className="text-text-secondary mb-6">Adicione uma conta do WhatsApp para iniciar a integração.</p>
                    <button onClick={handleOpenFormModal} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center mx-auto">
                        <Plus size={18} className="mr-2"/> Adicionar WhatsApp
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="grid grid-cols-12 gap-4 text-sm font-bold text-text-secondary border-b border-border pb-2 mb-4 px-4">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2">Produtos</div>
                    <div className="col-span-4">Número</div>
                    <div className="col-span-5 text-right">Ações</div>
                </div>
                <div className="space-y-2">
                    {connections.map(conn => (
                        <div key={conn.id} className="grid grid-cols-12 gap-4 items-center px-4 py-2 rounded-md hover:bg-light">
                            <div className="col-span-1 flex items-center">
                               {conn.status === 'connected' && <span className="w-3 h-3 bg-green-500 rounded-full" title="Conectado"></span>}
                               {conn.status === 'disconnected' && <span className="w-3 h-3 bg-red-500 rounded-full" title="Desconectado"></span>}
                               {conn.status === 'pending' && <span title="Conectando..."><Loader2 size={16} className="text-yellow-500 animate-spin" /></span>}
                            </div>
                            <div className="col-span-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png" alt="WhatsApp" className="w-6 h-6" />
                            </div>
                            <div className="col-span-4 text-text-primary font-medium">{conn.number}</div>
                            <div className="col-span-5 flex justify-end">
                                {conn.status === 'disconnected' && (
                                     <button onClick={() => handleOpenQrModal(conn)} className="bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center hover:bg-green-700 transition-colors">
                                        <QrCode size={16} className="mr-2" /> CONECTAR WHATSAPP
                                    </button>
                                )}
                                {conn.status === 'pending' && (
                                    <button disabled className="bg-yellow-500 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center cursor-not-allowed">
                                        <Loader2 size={16} className="mr-2 animate-spin" /> CONECTANDO...
                                    </button>
                                )}
                                {conn.status === 'connected' && (
                                     <button onClick={() => handleDisconnect(conn.id)} className="bg-red-600 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center hover:bg-red-700 transition-colors">
                                        <X size={16} className="mr-2" /> DESCONECTAR
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mt-6 text-sm flex items-start">
                    <Info size={20} className="mr-3 flex-shrink-0 mt-0.5" />
                    <div>Clique no ícone de <strong>QrCode</strong> para conectar a IA ao seu WhatsApp.</div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={handleOpenFormModal} className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center">
                        <Plus size={16} className="mr-2" /> Adicionar WhatsApp
                    </button>
                    <button className="bg-light text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-border transition-colors flex items-center">
                        <RefreshCw size={16} className="mr-2" /> Atualizar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Integrações</h1>
                    <p className="text-text-secondary">Integrações &gt; <span className="text-primary font-medium">WhatsApp</span></p>
                </div>
                 <p className="text-sm text-text-secondary">Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {renderMainContent()}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {modalStep === 'form' ? renderFormModal() : renderQrCodeModal()}
            </Modal>
        </div>
    );
};

export default WhatsApp;
