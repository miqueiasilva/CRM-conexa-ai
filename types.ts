
// FIX: Removed self-import of `LeadStatus` which was causing a conflict with its own declaration.
export enum LeadStatus {
  CAPTURADOS = 'Capturados',
  ATENDIDOS = 'Atendidos',
  VENDAS_REALIZADAS = 'Vendas Realizadas',
}

export interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  origin: string;
  status: LeadStatus;
  value?: number; // New field for deal value
  lastContact?: string; // New field for last contact date
}

export interface Appointment {
  id: number;
  leadName: string;
  service: string;
  professional: string;
  dateTime: Date;
}

// Added a specific type for function calls to improve type safety.
export interface FunctionCall {
    name: string;
    args: { [key: string]: any };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  functionCall?: FunctionCall; // Using the new FunctionCall type.
}

export type AgentData = {
    type: string;
    name: string;
    responseLength: string;
    communicationStyle: string;
    useEmojis: boolean;
    language: string;
    whatsappNumber: string;
    companyName: string;
    industry: string;
    companyDescription: string;
    companyAddress: string;
    workingHours: Record<string, boolean>;
    flowSteps: { name: string; instruction: string }[];
    knowledgeBase: { question: string; answer: string }[];
};
