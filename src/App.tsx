import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { CartItem, ProduitCatalogue, CommandeOut } from './types';
import { Header } from './components/Header';
import { NavigationRail } from './components/NavigationRail';
import { BottomNavBar } from './components/BottomNavBar';
import { LoginPage } from './views/LoginPage';
import { CataloguePage } from './views/CataloguePage';
import { CommandesPage } from './views/CommandesPage';
import { CartPage } from './views/CartPage';
import { AndrowayTourneePage } from './views/AndrowayTourneePage';
import { PosCaissePage } from './views/PosCaissePage';
import { FinancesPage } from './views/FinancesPage';
import { ProfilePage } from './views/ProfilePage';

const CART_STORAGE_KEY = 'portail_client_cart';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return authService.isAuthenticated();
  });

  const [currentTab, setCurrentTab] = useState<number>(0);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return [];
  });

  // Sauvegarde panier dans localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Écoute de l'événement d'expiration de session (401)
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleAddToCart = (produit: ProduitCatalogue, quantite: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.produit.id === produit.id);
      if (existingIndex !== -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          quantite: next[existingIndex].quantite + quantite,
        };
        return next;
      }
      return [...prevCart, { produit, quantite }];
    });
  };

  const handleUpdateQuantity = (produitId: number, quantite: number) => {
    if (quantite <= 0) {
      handleRemoveFromCart(produitId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.produit.id === produitId ? { ...item, quantite } : item
      )
    );
  };

  const handleRemoveFromCart = (produitId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.produit.id !== produitId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentTab(0);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const tabTitles = [
    'Catalogue Produits',
    'Historique Commandes',
    'Mon Panier',
    'Silwane Androway',
    'Caisse Comptoir POS',
    'Finances & Règlements',
    'Mon Compte Client',
  ];

  const tabSubtitles = [
    'Consultez les prix et disponibilités en temps réel',
    'Suivi de vos commandes passées',
    'Validation et devis de commande',
    'Gestion de tournée commerciale et pointage terrain',
    'Encaissement rapide et impression thermique 80mm',
    'Consultation de vos factures et règlements',
    'Détails de tarification et solde comptable',
  ];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
      {/* Navigation latérale Desktop */}
      <NavigationRail
        currentIndex={currentTab}
        onSelectIndex={setCurrentTab}
        cartCount={totalCartCount}
      />

      {/* Zone de contenu principale */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={tabTitles[currentTab]}
          subtitle={tabSubtitles[currentTab]}
          onLogout={handleLogout}
          showSyncBadge={currentTab === 3 || currentTab === 4}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 0 && <CataloguePage onAddToCart={handleAddToCart} />}
          {currentTab === 1 && <CommandesPage />}
          {currentTab === 2 && (
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onOrderCompleted={(_cmd: CommandeOut) => {
                setCurrentTab(1); // Redirection vers l'historique des commandes
              }}
              onGoToCatalogue={() => setCurrentTab(0)}
            />
          )}
          {currentTab === 3 && <AndrowayTourneePage />}
          {currentTab === 4 && <PosCaissePage />}
          {currentTab === 5 && <FinancesPage />}
          {currentTab === 6 && <ProfilePage onLogout={handleLogout} />}
        </main>
      </div>

      {/* Navigation inférieure Mobile */}
      <BottomNavBar
        currentIndex={currentTab}
        onSelectIndex={setCurrentTab}
        cartCount={totalCartCount}
      />
    </div>
  );
};

export default App;
