
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { APP_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-10 px-2 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral</h1>
        <p className="text-slate-500 font-medium">Bem-vindo ao centro de comando {APP_NAME}.</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar em tudo..." 
            className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none w-64"
          />
        </div>
        
        <div className="flex items-center gap-3">
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-none">Admin {APP_NAME}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gerente Geral</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 cursor-pointer hover:scale-105 transition-transform">
                    <User size={20} />
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
