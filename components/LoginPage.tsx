
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Eye, EyeOff, Loader2, Mail, Lock, ChevronRight } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LoginPageProps {
  onLogin: () => void;
}

const slogans = [
  "A inteligência que escala seu atendimento.",
  "Qualificação de leads via WhatsApp em segundos.",
  "SDR Autônomo focado em conversão real.",
  "Conexa.AI: O futuro do CRM conversacional."
];

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.823 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex(prev => (prev + 1) % slogans.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Lado Esquerdo - Branding Imersivo */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 relative items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 opacity-95" />
        
        {/* Elementos Decorativos de IA */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 text-white text-center max-w-lg space-y-10">
          <div className="inline-flex p-6 bg-white/10 rounded-[3rem] backdrop-blur-xl border border-white/20 shadow-2xl">
            <Zap size={80} className="text-white fill-white animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-8xl font-black tracking-tighter drop-shadow-lg">{APP_NAME}</h1>
            <div className="h-24 flex items-center justify-center">
              <p key={sloganIndex} className="text-3xl font-medium text-blue-50 leading-tight animate-fade-in-up">
                {slogans[sloganIndex]}
              </p>
            </div>
          </div>

          <div className="pt-16 grid grid-cols-2 gap-12 border-t border-white/10">
            <div className="text-left">
              <span className="block text-4xl font-black">20k+</span>
              <span className="text-blue-200 text-sm font-bold uppercase tracking-widest">Leads Qualificados</span>
            </div>
            <div className="text-left">
              <span className="block text-4xl font-black">99.9%</span>
              <span className="text-blue-200 text-sm font-bold uppercase tracking-widest">Taxa de Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário Clean */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-24 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="md:hidden flex flex-col items-center mb-12">
            <div className="p-4 bg-blue-600 rounded-3xl mb-4 shadow-xl shadow-blue-200">
              <Zap size={40} className="text-white fill-white" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{APP_NAME}</h2>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-12 md:p-14 border border-slate-100 relative">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Bem-vindo.</h2>
              <p className="text-slate-500 font-bold">Faça login para gerenciar sua inteligência.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-mail corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required 
                    className="w-full h-16 pl-14 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="exemplo@conexa.ai"
                    defaultValue="admin@conexa.ai"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha secreta</label>
                  <a href="#" className="text-xs font-black text-blue-600 hover:text-blue-700">Recuperar</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full h-16 pl-14 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    defaultValue="123456"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-18 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-70 group text-lg"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <>
                    Acessar Painel
                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-12 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-6 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Ou Conectar com</span>
            </div>

            <button
              type="button"
              className="w-full h-16 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.97]"
            >
              <GoogleIcon />
              Google Workspace
            </button>
          </div>
          <p className="mt-10 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
            Conexa AI Ecosystem © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
