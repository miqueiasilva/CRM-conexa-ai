
export enum LeadStatus {
  CAPTURADOS = 'Capturados',
  ATENDIDOS = 'Atendidos',
  VENDAS_REALIZADAS = 'Vendas Realizadas',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Stat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  origin: string;
  status: LeadStatus;
  value: number;
  lastContact: string;
}

export interface Appointment {
  id: number;
  leadName: string;
  service: string;
  professional: string;
  dateTime: Date;
}

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'me' | 'other';
  text: string;
  time?: string;
  functionCall?: FunctionCall;
}

export interface FlowStep {
  name: string;
  instruction: string;
}

export interface KnowledgeBaseItem {
  question: string;
  answer: string;
}

export interface AgentData {
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
  flowSteps: FlowStep[];
  knowledgeBase: KnowledgeBaseItem[];
}
