
import { GoogleGenAI, FunctionDeclaration, Type, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getApiKey = (): string | undefined => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
        // @ts-ignore
        return import.meta.env.VITE_API_KEY;
    }
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
        return process.env.API_KEY;
    }
    return undefined;
};

const getAi = () => {
    if (!ai) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error("API_KEY environment variable not set");
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
        description: 'Transfere a conversa para um atendente humano.',
        parameters: { type: Type.OBJECT, properties: {} },
    },
];

export async function startChat() {
    const genAI = getAi();
    chat = genAI.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Você é Jaci.AI, assistente virtual integrada à plataforma Convexa.AI. Seu objetivo é ajudar clientes do Studio Jacilene Félix a conhecer serviços, verificar preços e agendar horários.
          Serviços: Micropigmentação (R$ 500), Design de Sobrancelhas (R$ 80), Micropigmentação Labial (R$ 450), Limpeza de Pele (R$ 150).
          Para agendar: peça nome, serviço, data e hora. Confirme pedindo sinal de R$100 via PIX fictício.
          Seja empática e use o tom da Convexa.AI: moderno, eficiente e conectado.`,
          tools: [{ functionDeclarations }],
        },
    });
}

export async function runChat(prompt: string) {
    if (!chat) {
        await startChat();
    }
    if (!chat) {
      throw new Error("Chat not initialized");
    }
    const result = await chat.sendMessage({ message: prompt });
    return result;
}

export async function sendFunctionResponse(functionResponse: { functionResponses: { name: string; response: object }[] }) {
    if (!chat) {
        throw new Error("Chat not initialized");
    }
    const functionResponseParts = functionResponse.functionResponses.map((fr) => ({
        functionResponse: {
            name: fr.name,
            response: fr.response,
        },
    }));
    const result = await chat.sendMessage({ message: functionResponseParts });
    return result;
}
