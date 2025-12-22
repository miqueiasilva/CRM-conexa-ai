
import { LeadStatus, Lead, Appointment, ChatMessage, Stat } from './types';

export const APP_NAME = "Convexa.AI";

export const FUNNEL_STAGES: LeadStatus[] = [
  LeadStatus.CAPTURADOS,
  LeadStatus.ATENDIDOS,
  LeadStatus.VENDAS_REALIZADAS,
];

export const LEAD_SOURCES_DATA = [
  { name: 'WhatsApp', value: 400 },
  { name: 'Instagram', value: 300 },
  { name: 'Facebook', value: 200 },
  { name: 'Indicação', value: 100 },
];

export const MOCK_LEADS: Lead[] = [
  { id: 1, name: 'Ana Silva', whatsapp: '+5511987654321', origin: 'Instagram', status: LeadStatus.CAPTURADOS, value: 500, lastContact: 'Hoje' },
  { id: 2, name: 'Bruno Costa', whatsapp: '+5521912345678', origin: 'WhatsApp', status: LeadStatus.CAPTURADOS, value: 150, lastContact: 'Ontem' },
  { id: 3, name: 'Carla Dias', whatsapp: '+5531988887777', origin: 'Facebook', status: LeadStatus.ATENDIDOS, value: 80, lastContact: '2 dias atrás' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 1, leadName: 'Ana Silva', service: 'Micropigmentação', professional: 'Jacilene', dateTime: new Date(Date.now() + 86400000) },
  { id: 2, leadName: 'Bruno Costa', service: 'Limpeza de Pele', professional: 'Ana Kelly', dateTime: new Date(Date.now() + 172800000) },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'other', text: 'Olá, gostaria de saber os preços.', time: '10:00' },
  { id: '2', sender: 'me', text: 'Olá! Nossos serviços começam em R$ 80.', time: '10:01' },
];

export const MOCK_STATS: Stat[] = [
  { title: 'Total de Leads', value: 1240, icon: 'Users', color: '#3B82F6' },
  { title: 'Atendimentos', value: 850, icon: 'MessageCircle', color: '#10B981' },
  { title: 'Conversão', value: '12.5%', icon: 'BarChart', color: '#F59E0B' },
  { title: 'Agendamentos', value: 45, icon: 'DollarSign', color: '#EF4444' },
];
