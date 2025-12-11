import { GoogleGenAI, FunctionDeclaration, Type, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getApiKey = (): string | undefined => {
    // Tenta pegar a chave do ambiente Vite (Padrão para Vercel/Localhost moderno)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
        // @ts-ignore
        return import.meta.env.VITE_API_KEY;
    }
    return undefined;
};

const getAi = () => {
    if (!ai) {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.warn("Aviso: API Key do Google Gemini não encontrada. O chat pode não funcionar.");
            return null;
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

const functionDeclarations: FunctionDeclaration[] = [
    {
        name: 'criar_lead',
        description: 'Cadastra um novo contato (lead) no sistema de CRM.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                nome: { type: Type.STRING, description: 'Nome completo do cliente.' },
                whatsapp: { type: Type.STRING, description: 'Número do WhatsApp do cliente com código do país e DDD.' },
                origem: { type: Type.STRING, description: 'Canal de onde o lead veio (ex: WhatsApp, Instagram).' },
            },
            required: ['nome', 'whatsapp', 'origem'],
        },
    },
    {
        name: 'criar_agendamento',
        description: 'Agenda um novo serviço para um cliente.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                nome_do_cliente: { type: Type.STRING, description: 'Nome completo do cliente para quem o agendamento será feito.' },
                servico: { type: Type.STRING, description: 'Nome do serviço desejado (ex: Micropigmentação, Limpeza de Pele).' },
                profissional: { type: Type.STRING, description: 'Nome do profissional que realizará o serviço.' },
                data: { type: Type.STRING, description: 'Data do agendamento no formato AAAA-MM-DD.' },
                hora: { type: Type.STRING, description: 'Hora do agendamento no formato HH:MM.' },
            },
            required: ['nome_do_cliente', 'servico', 'profissional', 'data', 'hora'],
        },
    },
    {
        name: 'buscar_preco',
        description: 'Consulta o valor de um serviço específico.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                servico: { type: Type.STRING, description: 'Nome do serviço a ser consultado.' },
            },
            required: ['servico'],
        },
    },
    {
        name: 'handover_humano',
        description: 'Transfere a conversa para um atendente humano quando a IA não consegue resolver a solicitação ou quando o cliente pede para falar com uma pessoa.',
        parameters: { type: Type.OBJECT, properties: {} },
    },
];

export async function startChat() {
    const genAI = getAi();
    if (!genAI) return;

    chat = genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `Você é Jaci.AI, assistente virtual do Studio Jacilene Félix. Seu objetivo é ajudar clientes a conhecer os serviços, verificar preços e agendar horários.
          Serviços disponíveis: Micropigmentação (R$ 500), Design de Sobrancelhas (R$ 80), Micropigmentação Labial (R$ 450), Limpeza de Pele (R$ 150).
          Para agendar, você precisa do nome do cliente, serviço, data e hora. Sempre confirme o agendamento pedindo um sinal de R$100 via PIX (use um link fictício).
          Seja sempre empática, clara e acolhedora. Se a dúvida for muito técnica ou o cliente pedir, transfira para um humano usando a função 'handover_humano'.`,
          tools: [{ functionDeclarations }],
        },
    });
}

export async function runChat(prompt: string) {
    if (!chat) {
        await startChat();
    }
    
    if (!chat) {
      throw new Error("Chat could not be initialized (Check API Key)");
    }

    const result = await chat.sendMessage({ message: prompt });
    return result;
}

export async function sendFunctionResponse(functionResponse: any) {
    if (!chat) {
        throw new Error("Chat not initialized");
    }

    const functionResponseParts = functionResponse.functionResponses.map((fr: { name: string; response: object; }) => ({
        functionResponse: {
            name: fr.name,
            response: fr.response,
        },
    }));

    const result = await chat.sendMessage({ message: functionResponseParts });
    return result;
}