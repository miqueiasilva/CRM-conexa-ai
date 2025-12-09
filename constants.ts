import { LeadStatus } from './types';

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
