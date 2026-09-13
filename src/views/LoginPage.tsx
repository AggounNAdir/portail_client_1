import React, { useState } from 'react';
import { Package, Lock, User, Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [codeClient, setCodeClient] = useState('CLT-0001');
  const [password, setPassword] = useState('secret123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeClient.trim()) {
      setErrorMessage('Veuillez saisir votre code client');
      return;
    }
    if (!password) {
      setErrorMessage('Veuillez saisir votre mot de passe');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authService.login(codeClient, password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10 relative">
        <div className="absolute top-4 right-4">
          <PWAInstallButton />
        </div>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Package className="h-9 w-9" />
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Portail Client
          </h1>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Connectez-vous pour consulter vos tarifs et commander
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Code Client
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={codeClient}
                onChange={(e) => setCodeClient(e.target.value)}
                placeholder="Ex: CLT-0001"
                required
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm transition-colors focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-10 text-sm transition-colors focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-4 text-center">
          <p className="text-[11px] text-slate-400">
            Identifiants démo : <span className="font-mono font-bold text-slate-600">CLT-0001</span> /{' '}
            <span className="font-mono font-bold text-slate-600">secret123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
