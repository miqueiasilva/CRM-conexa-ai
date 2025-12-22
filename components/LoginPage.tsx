
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Eye, EyeOff, Loader2, Mail, Lock, ChevronRight } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LoginPageProps {
  onLogin: () => void;
}

const slogans = [
  "Inteligência artificial para escalar seu atendimento.",
  "Qualificação de leads em tempo real via WhatsApp.",
  "SDR autônomo focado em conversão e agendamento.",
  "Convexa.AI: O futuro do CRM conversacional está aqui."
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const particleCount = 40;

    const init = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => window.removeEventListener('resize', init);
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-x-hidden">
      {/* Lado Esquerdo / Topo - Branding */}
      <div className="w-full lg:w-1/2 bg-blue-600 relative flex items-center justify-center p-8 lg:p-16 min-h-[30vh] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 opacity-90" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        <div className="relative z-10 text-white text-center max-w-lg space-y-4 lg:space-y-8">
          <div className="inline-flex p-3 lg:p-5 bg-white/10 rounded-2xl lg:rounded-[2.5rem] backdrop-blur-md border border-white/20 shadow-2xl animate-pulse-soft">
            <Zap size={48} className="text-white fill-white lg:w-[72px] lg:h-[72px]" />
          </div>
          <div className="space-y-2 lg:space-y-4">
            <h1 className="text-4xl lg:text-7xl font-black tracking-tighter">{APP_NAME}</h1>
            <div className="hidden lg:flex h-20 items-center justify-center">
              <p key={sloganIndex} className="text-2xl font-medium text-blue-50 leading-relaxed animate-fade-in-up">
                {slogans[sloganIndex]}
              </p>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
            <div className="text-left">
              <span className="block text-3xl font-bold">15k+</span>
              <span className="text-blue-200 text-sm">Empresas Conectadas</span>
            </div>
            <div className="text-left">
              <span className="block text-3xl font-bold">99.99%</span>
              <span className="text-blue-200 text-sm">Uptime Convexa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito / Baixo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative z-10 -mt-10 lg:mt-0">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 lg:p-12 border border-slate-100 relative">
            <div className="mb-8 lg:mb-10 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">Bem-vindo</h2>
              <p className="text-slate-500 font-medium text-sm lg:text-base">Faça login para gerenciar seus agentes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              <div className="space-y-1.5 lg:space-y-2">
                <label className="text-xs lg:text-sm font-bold text-slate-700 ml-1">E-mail corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required 
                    className="w-full h-12 lg:h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm lg:text-base"
                    placeholder="exemplo@convexa.ai"
                    defaultValue="admin@convexa.ai"
                  />
                </div>
              </div>

              <div className="space-y-1.5 lg:space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs lg:text-sm font-bold text-slate-700">Senha de acesso</label>
                  <a href="#" className="text-[10px] lg:text-xs font-bold text-blue-600 hover:text-blue-700">Recuperar</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full h-12 lg:h-14 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm lg:text-base"
                    placeholder="••••••••"
                    defaultValue="123456"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 lg:h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl lg:rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 group text-base lg:text-lg"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Acessar Dashboard
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8 lg:my-10 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 lg:px-6 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest">ou continuar com</span>
            </div>

            <button
              type="button"
              className="w-full h-12 lg:h-14 border-2 border-slate-100 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98] text-sm lg:text-base"
            >
              <GoogleIcon />
              Google Business
            </button>
          </div>
          <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Convexa AI Ecosystem © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
