import React, { useState, useEffect } from 'react';
import { User, Building2, Phone, Mail, MapPin, Tag, LogOut, Wallet, ShieldCheck, Smartphone, Download } from 'lucide-react';
import { ClientProfile } from '../types';
import { clientService } from '../services/clientService';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ProfilePageProps {
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    clientService.getMyProfile().then((p) => {
      setProfile(p);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Chargement de vos informations...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 pb-20 md:pb-6">
      {/* Carte Solde Client */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <Wallet className="h-4 w-4" />
            Solde Client Silwane
          </div>
          <span className="rounded-full bg-blue-700/60 px-3 py-1 font-mono text-xs font-bold text-white backdrop-blur-xs">
            {profile.code}
          </span>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-black sm:text-4xl">
            {(profile.solde ?? 0).toFixed(2)} €
          </div>
          <p className="mt-1 text-xs text-blue-200">
            {(profile.solde ?? 0) > 0
              ? 'Encours comptable en attente de règlement'
              : 'Compte client à jour'}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-blue-700/50 pt-3 text-xs text-blue-200">
          <ShieldCheck className="h-4 w-4 text-teal-300" />
          <span>Synchronisé avec l'ERP IntelliX Silwane</span>
        </div>
      </div>

      {/* Informations Entreprise */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">Coordonnées du compte</h3>

        <div className="mt-4 divide-y divide-slate-100 text-xs">
          <div className="flex items-center gap-3 py-3">
            <Building2 className="h-4 w-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-slate-400 text-[11px]">Raison sociale</div>
              <div className="font-bold text-slate-800 text-sm">{profile.nom}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3">
            <Tag className="h-4 w-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-slate-400 text-[11px]">Niveau de tarification</div>
              <div className="font-semibold text-blue-600">
                {profile.niveauPrix || 'Standard'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3">
            <MapPin className="h-4 w-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-slate-400 text-[11px]">Adresse de facturation / livraison</div>
              <div className="font-medium text-slate-800">{profile.adresse}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-slate-400 text-[11px]">Téléphone</div>
              <div className="font-medium text-slate-800">{profile.tel}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3">
            <Mail className="h-4 w-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-slate-400 text-[11px]">Email</div>
              <div className="font-medium text-slate-800">{profile.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Application Mobile PWA */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Application Mobile Installable</h3>
            <p className="text-xs text-slate-500">
              Installez l'application sur votre smartphone (Android / iOS)
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white p-4 text-xs text-slate-600">
          <p className="font-medium text-slate-800">
            Avantages sur votre téléphone :
          </p>
          <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-600">
            <li>Lancement en plein écran sans barre d'adresse navigateur</li>
            <li>Accès direct depuis votre écran d'accueil comme une application native</li>
            <li>Fonctionne hors-ligne pour la tournée Androway et la caisse POS</li>
            <li>Pas besoin de passer par le Play Store ou l'App Store</li>
          </ul>
        </div>
      </div>

      {/* Bouton Déconnexion */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter de cette session
        </button>
      </div>
    </div>
  );
};
