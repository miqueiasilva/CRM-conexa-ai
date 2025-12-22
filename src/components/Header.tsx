
import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuOpen?: () => void;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuOpen,
  title = "Visão Geral", 
  subtitle = "Bem-vindo ao centro de comando Convexa." 
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in-up">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {onMenuOpen && (
          <button 
            onClick={onMenuOpen}
            className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all active:scale-95 flex items-center justify-center"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-slate-500 font-medium text-sm md:text-base truncate">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-end">
        <div className="hidden lg:flex relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar em tudo..." 
            className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none w-48 xl:w-64 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
            <button className="hidden sm:flex p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all relative shadow-sm">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-none">Admin Convexa</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gerente Geral</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 cursor-pointer hover:scale-105 transition-transform">
                    <User size={20} />
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
