
import React from 'react';
import { Appointment } from '../types';

interface AppointmentsListProps {
  appointments: Appointment[];
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm h-full">
      <h2 className="text-lg font-bold mb-4 text-text-primary">Agendamentos Ativos</h2>
      <ul className="space-y-3 h-64 overflow-y-auto pr-2">
        {appointments.map(app => (
          <li key={app.id} className="bg-light p-3 rounded-md border border-border">
            <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-text-primary text-sm">{app.leadName}</p>
                  <p className="text-xs text-primary font-medium">{app.service}</p>
                </div>
                <span className="text-xs text-text-secondary text-right">
                    {app.dateTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    <br/>
                    {app.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsList;
