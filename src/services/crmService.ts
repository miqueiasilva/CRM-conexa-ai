import { supabase } from './supabaseClient';
import { Lead, Appointment, LeadStatus } from '../types';

// --- LEADS ---

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar leads:', error);
    return [];
  }

  // Mapear snake_case do banco para camelCase do TypeScript se necessário
  return data.map((lead: any) => ({
    id: lead.id,
    name: lead.name,
    whatsapp: lead.whatsapp,
    origin: lead.origin,
    status: lead.status as LeadStatus,
    value: lead.value,
    lastContact: lead.last_contact
  }));
}

export async function createLead(lead: Omit<Lead, 'id'>): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: lead.name,
      whatsapp: lead.whatsapp,
      origin: lead.origin,
      status: lead.status,
      value: lead.value || 0,
      last_contact: lead.lastContact || new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar lead:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    whatsapp: data.whatsapp,
    origin: data.origin,
    status: data.status,
    value: data.value,
    lastContact: data.last_contact
  };
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .update({ status: status })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
  return true;
}

export async function updateLead(lead: Lead): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .update({
      name: lead.name,
      whatsapp: lead.whatsapp,
      origin: lead.origin,
      value: lead.value,
      last_contact: lead.lastContact
    })
    .eq('id', lead.id);

  if (error) {
    console.error('Erro ao atualizar lead:', error);
    return false;
  }
  return true;
}

export async function deleteLeadFromDB(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar lead:', error);
    return false;
  }
  return true;
}

// --- APPOINTMENTS ---

export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date_time', { ascending: true });

  if (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return [];
  }

  return data.map((app: any) => ({
    id: app.id,
    leadName: app.lead_name,
    service: app.service,
    professional: app.professional,
    dateTime: new Date(app.date_time)
  }));
}

export async function createAppointment(app: Omit<Appointment, 'id'>): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      lead_name: app.leadName,
      service: app.service,
      professional: app.professional,
      date_time: app.dateTime.toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar agendamento:', error);
    return null;
  }

  return {
    id: data.id,
    leadName: data.lead_name,
    service: data.service,
    professional: data.professional,
    dateTime: new Date(data.date_time)
  };
}