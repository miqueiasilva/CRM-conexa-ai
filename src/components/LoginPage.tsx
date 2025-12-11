
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
  onLogin: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.823 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const slogans = [
  "Centralize 100% do seu atendimento no WhatsApp.",
  "Qualifique leads e agende serviços no automático.",
  "Junte-se a mais de 500 empresas que já convertem mais.",
  "Transforme conversas em clientes com nossa IA."
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Rotating Slogans Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex(prevIndex => (prevIndex + 1) % slogans.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Canvas Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles: { x: number, y: number, size: number, speedX: number, speedY: number }[] = [];
    const particleCount = 70;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.4 - 0.2,
        });
    }

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
            if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMessage(null);

    try {
        if (isRegistering) {
            // Lógica de Cadastro
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta (se necessário) ou faça login.");
            setIsRegistering(false); // Volta para a tela de login
        } else {
            // Lógica de Login
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            // O App.tsx vai detectar a mudança de sessão automaticamente
        }
    } catch (error: any) {
        setErrorMessage(error.message || "Ocorreu um erro. Tente novamente.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      try {
          const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin
              }
          });
          if (error) throw error;
      } catch (error: any) {
          setErrorMessage(error.message || "Erro ao conectar com Google.");
      }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Cover Section */}
      <div className="hidden md:flex w-1/2 bg-primary text-white flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        <div className="relative z-10">
            <Zap size={80} className="mb-6 mx-auto" />
            <h1 className="text-5xl font-bold">Conexa.AI</h1>
            <p className="mt-4 text-lg opacity-80">
              Inteligência Artificial para conversas que convertem.
            </p>
            <div className="h-8 mt-4">
              <p key={sloganIndex} className="text-md opacity-70 animate-[fadeIn_1s_ease-in-out]">
                {slogans[sloganIndex]}
              </p>
            </div>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 0.7; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {isRegistering ? "Crie sua conta" : "Bem-vindo de volta!"}
          </h2>
          <p className="text-text-secondary mb-8">
            {isRegistering ? "Preencha os dados abaixo para começar." : "Faça login para acessar seu painel."}
          </p>

          {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-start text-sm border border-red-200">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0"/>
                  {errorMessage}
              </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-light border border-border rounded-lg p-3 focus:ring-primary focus:border-primary"
                placeholder="seu@email.com"
              />
            </div>
            <div className="relative">
              <label htmlFor="password"className="block text-sm font-medium text-text-primary mb-1">
                Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-light border border-border rounded-lg p-3 focus:ring-primary focus:border-primary"
                placeholder="******"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-secondary hover:text-text-primary"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {!isRegistering && (
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-border rounded" />
                        <label htmlFor="remember-me" className="ml-2 block text-text-secondary">
                            Lembrar-me
                        </label>
                    </div>
                    <a href="#" className="font-medium text-primary hover:text-secondary">
                        Esqueceu a senha?
                    </a>
                </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center disabled:bg-primary/70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (isRegistering ? 'Cadastrar' : 'Entrar')}
            </button>
          </form>

          <div className="my-6 flex items-center">
              <div className="flex-grow bg-border h-px"></div>
              <span className="flex-shrink text-sm text-text-secondary px-4">Ou {isRegistering ? 'cadastre-se' : 'entre'} com</span>
              <div className="flex-grow bg-border h-px"></div>
          </div>

          <div className="space-y-3">
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center bg-white border border-border text-text-primary font-medium py-3 px-4 rounded-lg hover:bg-light transition-colors"
            >
                <GoogleIcon />
                {isRegistering ? 'Cadastrar com Google' : 'Entrar com Google'}
            </button>
          </div>
          
          <p className="mt-8 text-center text-sm text-text-secondary">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button 
                type="button"
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrorMessage(null);
                }} 
                className="font-medium text-primary hover:text-secondary focus:outline-none"
            >
              {isRegistering ? 'Faça Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;