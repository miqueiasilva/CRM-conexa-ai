
import React from 'react';
import { Appointment } from '../types';
import { Calendar } from 'lucide-react';

interface AppointmentsListProps {
  appointments: Appointment[];
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full">
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={20} className="text-blue-600" />
        <h2 className="text-lg font-black text-slate-900">Agendamentos</h2>
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {appointments.length > 0 ? (
          appointments.map(app => (
            <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{app.leadName}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">{app.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">
                    {app.dateTime.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    {app.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Calendar size={32} className="mb-2 opacity-20" />
            <p className="text-sm font-bold">Nenhum agendamento ativo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
