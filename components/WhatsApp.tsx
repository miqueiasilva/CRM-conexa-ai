import React, { useState, useEffect } from 'react';
import { 
  X, QrCode, Loader2, RefreshCw, Plus, Info, Check, Copy, 
  ExternalLink, Shield, Settings, AlertCircle, HelpCircle, Phone, Sparkles 
} from 'lucide-react';
import QRCode from 'qrcode';

// Connection interface to manage multiple WhatsApp Web accounts
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const WhatsApp: React.FC = () => {
  // Tab control: 'cloud' for official Meta Cloud API, 'qrcode' for WhatsApp Web
  const [activeTab, setActiveTab] = useState<'cloud' | 'qrcode'>('cloud');

  // WhatsApp Web State
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('convexa_wa_connections');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'form' | 'qrcode'>('form');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  // WhatsApp Cloud API State
  const [phoneId, setPhoneId] = useState(() => localStorage.getItem('convexa_cloud_phone_id') || '');
  const [businessId, setBusinessId] = useState(() => localStorage.getItem('convexa_cloud_business_id') || '');
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('convexa_cloud_access_token') || '');
  const [cloudStatus, setCloudStatus] = useState<'disconnected' | 'testing' | 'connected'>(() => {
    return (localStorage.getItem('convexa_cloud_status') as any) || 'disconnected';
  });

  // Webhook event checkboxes state (purely interactive simulation)
  const [subscribedEvents, setSubscribedEvents] = useState({
    messages: true,
    message_deliveries: true,
    message_template_status_update: true,
    message_reads: true
  });

  // Unique Credentials derived from App ID
  const appSuffix = "ddef2443";
  const callbackUrl = `https://api.convexa.ai/v1/webhooks/whatsapp/${appSuffix}`;
  const verifyToken = `convexa_verify_token_${appSuffix}_sec`;

  // Toast feedback states
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Save QR Code connections
  useEffect(() => {
    localStorage.setItem('convexa_wa_connections', JSON.stringify(connections));
  }, [connections]);

  // Save Cloud API Credentials
  useEffect(() => {
    localStorage.setItem('convexa_cloud_phone_id', phoneId);
    localStorage.setItem('convexa_cloud_business_id', businessId);
    localStorage.setItem('convexa_cloud_access_token', accessToken);
    localStorage.setItem('convexa_cloud_status', cloudStatus);
  }, [phoneId, businessId, accessToken, cloudStatus]);

  // Effect to generate QR code when modal opens for connection
  useEffect(() => {
    if (isModalOpen && modalStep === 'qrcode' && selectedConnection) {
      generateQrCode(selectedConnection.number);
    }
  }, [isModalOpen, modalStep, selectedConnection]);
  
  // Effect to simulate connection after QR code is shown
  useEffect(() => {
    if (modalStep === 'qrcode' && qrCodeDataUrl && selectedConnection) {
      const timer = setTimeout(() => {
        handleConnect(selectedConnection.id);
      }, 3000); // Simulate scanning QR for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [qrCodeDataUrl, selectedConnection]);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConnect = (connectionId: number) => {
    handleCloseModal();
    setConnections(prev => prev.map(c => c.id === connectionId ? {...c, status: 'pending'} : c));
    
    setTimeout(() => {
      setConnections(prev => prev.map(c => c.id === connectionId ? {...c, status: 'connected'} : c));
      triggerNotification("WhatsApp Web conectado com sucesso!");
    }, 4000); // Simulate connection handshake
  };
  
  const handleDisconnect = (connectionId: number) => {
    setConnections(prev => prev.map(c => c.id === connectionId ? {...c, status: 'disconnected'} : c));
    triggerNotification("WhatsApp Web desconectado.");
  };

  const generateQrCode = async (numberToConnect: string) => {
    setIsGenerating(true);
    setQrCodeDataUrl(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const connectionString = `CONEXA.AI_SESSION_${Date.now()}_${numberToConnect}`;
      const dataUrl = await QRCode.toDataURL(connectionString, {
        width: 256,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('Falha ao gerar o QR code', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenFormModal = () => {
    setModalStep('form');
    setIsModalOpen(true);
  };

  const handleOpenQrModal = (connection: Connection) => {
    setSelectedConnection(connection);
    setModalStep('qrcode');
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setQrCodeDataUrl(null);
      setModalStep('form');
      setWhatsappNumber('');
      setSessionName('');
      setSelectedConnection(null);
    }, 300);
  };
  
  const handleAddWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsappNumber.trim() === '') {
      alert('Por favor, insira o número do WhatsApp.');
      return;
    }
    const newConnection: Connection = {
      id: Date.now(),
      number: whatsappNumber,
      sessionName: sessionName || 'Atendimento Padrão',
      status: 'disconnected'
    };
    setConnections(prev => [...prev, newConnection]);
    handleCloseModal();
  };

  // Simulates testing and saving the Cloud API Configuration
  const handleTestCloudConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneId || !businessId || !accessToken) {
      alert('Preencha todas as credenciais da Meta antes de validar.');
      return;
    }
    
    setCloudStatus('testing');
    
    setTimeout(() => {
      setCloudStatus('connected');
      triggerNotification("WhatsApp Cloud API conectada e ativada com sucesso!");
    }, 2500);
  };

  const handleDisconnectCloud = () => {
    setCloudStatus('disconnected');
    triggerNotification("Conexão com a Cloud API removida.");
  };

  const renderFormModal = () => (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Adicionar Conta</h2>
      <p className="text-xs text-slate-500 mb-4">Adicione uma sessão local secundária via QR Code (WhatsApp Web).</p>
      <form onSubmit={handleAddWhatsApp} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Selecionar plataforma</label>
          <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm cursor-not-allowed">
            <option>WhatsApp Web (Conexão QR)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Número do WhatsApp</label>
          <input 
            type="tel" 
            value={whatsappNumber} 
            onChange={(e) => setWhatsappNumber(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono" 
            placeholder="Ex: 5511999998888" 
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nome da sessão (opcional)</label>
          <input 
            type="text" 
            value={sessionName} 
            onChange={(e) => setSessionName(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
            placeholder="Ex: Suporte, Vendas" 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-sm">
          Registrar e Prosseguir
        </button>
      </form>
    </>
  );

  const renderQrCodeModal = () => (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Conectar Aparelho</h2>
      <p className="text-xs text-slate-500 mb-4">Número: <span className="font-bold text-slate-700 font-mono">{selectedConnection?.number}</span></p>
      <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
        <div className="w-56 h-56 bg-white flex items-center justify-center rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2">
          {isGenerating && <Loader2 size={36} className="text-blue-600 animate-spin" />}
          {qrCodeDataUrl && !isGenerating && <img src={qrCodeDataUrl} alt="QR Code de conexão do WhatsApp" className="w-full h-full object-contain" />}
          {!qrCodeDataUrl && !isGenerating && <QrCode size={96} className="text-slate-300" />}
        </div>
        
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-slate-600 font-medium">
            1. Abra o WhatsApp no seu telefone celular<br/>
            2. Acesse <strong className="text-slate-800">Aparelhos Conectados</strong><br/>
            3. Toque em <strong className="text-slate-800 font-black">Conectar um aparelho</strong> e aponte a câmera
          </p>
          <div className="inline-flex items-center text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse-soft mt-3">
            <Sparkles size={10} className="mr-1" /> Aguardando leitura do QR code...
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Canais de Conexão</h1>
          <p className="text-slate-500 text-sm">Gerencie o canal de integração do WhatsApp com a inteligência do Convexa.AI.</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          Última verificação: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMessage && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
          <Check size={20} className="text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="bg-white p-1 rounded-2xl inline-flex w-full md:w-auto border border-slate-100 shadow-sm">
        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'cloud'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Shield size={16} />
          WhatsApp Cloud API
          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
            Oficial
          </span>
        </button>
        <button
          onClick={() => setActiveTab('qrcode')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'qrcode'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <QrCode size={16} />
          WhatsApp Web
          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
            QR Code
          </span>
        </button>
      </div>

      {activeTab === 'cloud' ? (
        /* ==================== TAB: CLOUD API ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1 & 2: Instalação e Callback */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status do Canal Cloud */}
            <div className={`p-6 rounded-[2rem] border transition-all shadow-sm ${
              cloudStatus === 'connected' 
                ? 'bg-white border-emerald-100' 
                : cloudStatus === 'testing'
                ? 'bg-white border-yellow-200'
                : 'bg-white border-slate-100'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${
                    cloudStatus === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Shield size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Estado do Hook Oficial Meta</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Sua integração direta através do servidor cloud oficial da Meta.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cloudStatus === 'connected' ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider rounded-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        Conectado
                      </span>
                      <button 
                        onClick={handleDisconnectCloud}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Desconectar API"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : cloudStatus === 'testing' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-black uppercase tracking-wider rounded-full">
                      <Loader2 size={12} className="animate-spin" />
                      Validando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider rounded-full">
                      Não Configurado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Credenciais para Colar no Painel do Desenvolvedor da Meta */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg text-xs font-bold">Passo 1</span>
                  <h2 className="text-lg font-black text-slate-950">Dados para o Painel da Meta Developer</h2>
                </div>
                <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                  No painel de desenvolvedores da Meta, na seção de configuração de <strong className="text-slate-800">WhatsApp Webhook</strong>, insira os valores abaixo que identificam sua instância exclusiva no Convexa.AI.
                </p>
              </div>

              <div className="space-y-4">
                {/* Callback URL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">URL de Callback (Callback URL)</label>
                    {copiedField === 'url' && <span className="text-[11px] text-blue-600 font-bold animate-pulse-soft">Copiado!</span>}
                  </div>
                  <div className="flex bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all">
                    <input 
                      type="text" 
                      readOnly 
                      value={callbackUrl} 
                      className="flex-1 bg-transparent px-3 py-3 text-sm font-mono text-slate-700 outline-none select-all" 
                    />
                    <button 
                      onClick={() => handleCopy(callbackUrl, 'url')}
                      className="px-4 text-slate-400 hover:text-slate-700 border-l border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center"
                      title="Copiar URL"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Verify Token */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Verificar Token (Verify Token)</label>
                    {copiedField === 'token' && <span className="text-[11px] text-blue-600 font-bold animate-pulse-soft">Copiado!</span>}
                  </div>
                  <div className="flex bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all">
                    <input 
                      type="text" 
                      readOnly 
                      value={verifyToken} 
                      className="flex-1 bg-transparent px-3 py-3 text-sm font-mono text-slate-700 outline-none select-all" 
                    />
                    <button 
                      onClick={() => handleCopy(verifyToken, 'token')}
                      className="px-4 text-slate-400 hover:text-slate-700 border-l border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center"
                      title="Copiar Token"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Subscriptions Checklist (Simulado) */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Assinar Eventos (Webhook Fields)</h4>
                    <p className="text-xs text-slate-400">Na Meta, marque e assine estes exatos 4 campos de webhook:</p>
                  </div>
                  <div className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    Requerido pelo Convexa
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {Object.keys(subscribedEvents).map((event) => (
                    <label key={event} className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={(subscribedEvents as any)[event]} 
                        onChange={(e) => setSubscribedEvents(prev => ({...prev, [event]: e.target.checked}))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                      />
                      <span className="text-xs text-slate-600 font-mono tracking-tight font-medium">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Credenciais para Retornar & Configurar no Convexa */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg text-xs font-bold">Passo 2</span>
                  <h2 className="text-lg font-black text-slate-950 font-sans">Cadastrar Credenciais Meta no Convexa</h2>
                </div>
                <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                  Após configurar as credenciais no painel da Meta, informe os códigos de sua conta de desenvolvedor abaixo para habilitar o envio e comunicação dos agentes de inteligência.
                </p>
              </div>

              <form onSubmit={handleTestCloudConnection} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">ID do Número de Telefone (Phone Number ID)</label>
                    <input 
                      type="text"
                      required
                      value={phoneId}
                      onChange={(e) => setPhoneId(e.target.value)}
                      placeholder="Ex: 104839281093129"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">ID da Conta de Negócio (WABA ID)</label>
                    <input 
                      type="text"
                      required
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                      placeholder="Ex: 928472910482012"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Token de Acesso Permanente de Desenvolvedor</label>
                  <input 
                    type="password"
                    required
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="EAAL..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-sky-600 font-semibold bg-sky-50 px-3 py-1.5 rounded-lg">
                    <Info size={14} /> Certifique-se de usar um Token Permanente para a produção.
                  </div>
                  <button 
                    type="submit" 
                    disabled={cloudStatus === 'testing'}
                    className="bg-blue-600 text-white text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    {cloudStatus === 'testing' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Validando Conexão...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        Validar e Conectar Canal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Coluna 3: Documentação de Apoio / Ajuda da Meta */}
          <div className="space-y-6">
            
            {/* Box explicativo "Número de Produção vs Número de Teste" */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-[2.25rem] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-amber-600" size={24} />
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Números de Produção x Teste</h3>
              </div>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                Na Meta, sua conta recém-criada inicia com <strong className="text-amber-950">1 Número de Teste</strong> e <strong className="text-amber-950">0 de Produção</strong> por padrão.
              </p>
              <div className="space-y-2 text-[11px] text-amber-800 leading-normal">
                <p>⚠️ <strong>Número de Teste (Sandbox):</strong> O WhatsApp limita o disparo apenas para números autorizados manualmente no painel de teste. Ideal para validar esta integração do Convexa!</p>
                <p>🚀 <strong>Ir para Produção (Oficial):</strong> Para receber e responder clientes reais sem limitações, é necessário cadastrar um telefone comercial real próprio.</p>
              </div>
              <div className="pt-2">
                <a 
                  href="https://developers.facebook.com/apps" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full bg-amber-600/10 hover:bg-amber-600/15 text-amber-900 text-[11px] font-black uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  Ir para Painel Developers Meta <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Como adicionar o número oficial / Passo a Passo */}
            <div className="bg-white p-6 rounded-[2.25rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="text-blue-500" size={18} />
                <h3 className="font-black text-slate-950 text-sm">Gerenciar Telefones Oficial</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Para passar o <strong>Studio Jacilene Félix</strong> de Teste para o WhatsApp oficial de produção:
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pl-4 list-decimal">
                <li>No painel da Meta, clique na aba <strong className="text-slate-800">Primeiros Passos / Setup</strong></li>
                <li>Role até o Passo 5 e clique em <strong className="text-slate-800">Gerenciar telefones</strong></li>
                <li>Clique em <strong className="text-blue-600">Adicionar número de telefone</strong></li>
                <li>Preencha as informações do Studio (Nome de exibição, fuso horário, categoria e descrição)</li>
                <li>Insira o número de WhatsApp comercial real do Studio e valide por SMS ou Ligação.</li>
                <li>Copie o novo <strong className="text-slate-800">ID do Número de Telefone</strong> gerado na produção e atualize aqui no Convexa!</li>
              </ul>
            </div>

            {/* Suporte FAQ */}
            <div className="bg-white p-6 rounded-[2.25rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-indigo-500" size={18} />
                <h3 className="font-black text-slate-950 text-sm tracking-tight">Utiliza Cloud API ou Embedded?</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>O Convexa.AI utiliza a Cloud API oficial direta da Meta.</strong> Isto garante maior velocidade de entrega de mensagens, zero custos adicionais por intermediação de provedores, estabilidade avançada e o selo oficial de verificação verde da Meta direto na conta do Studio.
              </p>
            </div>

          </div>
        </div>
      ) : (
        /* ==================== TAB: LEGACY WEB QR CODE ==================== */
        <div className="bg-white p-6 md:p-8 rounded-[2.25rem] shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Conexões WhatsApp Web (Legado)</h2>
              <p className="text-xs text-slate-500 mt-1">Conecte seus números via QR-Code espelhado. Recomendado apenas para números de teste ou fluxos secundários.</p>
            </div>
            <button 
              onClick={handleOpenFormModal} 
              className="bg-blue-600 text-white text-xs font-black uppercase tracking-wider py-3 px-5 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/10 ml-auto sm:ml-0"
            >
              <Plus size={16} /> Adicionar Nova Sessão
            </button>
          </div>

          {connections.length === 0 ? (
            <div className="p-12 text-center max-w-sm mx-auto space-y-4">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                <QrCode size={36} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-950">Nenhuma conta secundária adicionada</h3>
                <p className="text-xs text-slate-500 mt-1">Você não possui nenhuma conta de escaneamento de QR Code registrada neste ambiente.</p>
              </div>
            </div>
          ) : (
            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50">
              <div className="grid grid-cols-12 gap-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/70 p-4">
                <div className="col-span-1">Status</div>
                <div className="col-span-3">Nome da Sessão</div>
                <div className="col-span-4">Número Cadastrado</div>
                <div className="col-span-4 text-right">Ações de Controle</div>
              </div>

              <div className="divide-y divide-slate-100">
                {connections.map(conn => (
                  <div key={conn.id} className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="col-span-1 flex items-center">
                      {conn.status === 'connected' && (
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </span>
                      )}
                      {conn.status === 'disconnected' && (
                        <span className="w-2.5 h-2.5 bg-rose-400 rounded-full"></span>
                      )}
                      {conn.status === 'pending' && (
                        <Loader2 size={16} className="text-amber-500 animate-spin" />
                      )}
                    </div>
                    
                    <div className="col-span-3 font-semibold text-slate-800 text-sm">
                      {conn.sessionName}
                    </div>

                    <div className="col-span-4 font-mono text-slate-600 text-sm">
                      {conn.number}
                    </div>

                    <div className="col-span-4 flex justify-end gap-2">
                      {conn.status === 'disconnected' && (
                        <button 
                          onClick={() => handleOpenQrModal(conn)} 
                          className="bg-emerald-600 text-white text-xs font-black py-2 px-4 rounded-xl flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/10"
                        >
                          <QrCode size={14} /> SCAN QR CODE
                        </button>
                      )}
                      
                      {conn.status === 'pending' && (
                        <button disabled className="bg-amber-500 text-white text-xs font-black py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-not-allowed">
                          <Loader2 size={14} className="animate-spin" /> CONECTANDO...
                        </button>
                      )}

                      {conn.status === 'connected' && (
                        <button 
                          onClick={() => handleDisconnect(conn.id)} 
                          className="bg-rose-50 text-rose-600 text-xs font-black py-2 px-4 rounded-xl flex items-center gap-1.5 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                        >
                          <X size={14} /> DESCONECTAR
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50/50 border border-blue-200 text-blue-900 p-4 rounded-2xl text-xs leading-relaxed flex items-start gap-3">
            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Atenção:</strong> Conexões via QR Code (WhatsApp Web alternativo) operam de forma paralela aos agentes oficiais e requerem que o celular permaneça conectado continuamente à internet para evitar quedas.
            </div>
          </div>
        </div>
      )}

      {/* Modal Container */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalStep === 'form' ? renderFormModal() : renderQrCodeModal()}
      </Modal>
    </div>
  );
};

export default WhatsApp;
