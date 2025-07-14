import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProfileCreate from "./pages/ProfileCreate";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import ProfileEdit from "./pages/ProfileEdit";
import Partners from "./pages/Partners";
import Trainers from "./pages/Trainers";
import Match from "./pages/Match";
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function isIos() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}
function isInStandaloneMode() {
  // @ts-ignore
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}

export default function App() {
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  // Para swipe
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (isIos() && !isInStandaloneMode() && !sessionStorage.getItem('hideIosInstallBanner')) {
      setShowInstallGuide(true);
    }
  }, []);

  const closeBanner = () => {
    setShowInstallGuide(false);
    sessionStorage.setItem('hideIosInstallBanner', '1');
  };

  // Função para swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX !== null) {
      const diff = e.touches[0].clientX - touchStartX;
      if (Math.abs(diff) > 60) {
        closeBanner();
      }
    }
  };
  const handleTouchEnd = () => setTouchStartX(null);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="auth" element={<Auth />} />
                <Route path="profile/create" element={<ProfileCreate />} />
                <Route path="profile/edit" element={<ProfileEdit />} />
                <Route path="dashboard" element={<Chat />} />
                <Route path="partners" element={<Partners />} />
                <Route path="trainers" element={<Trainers />} />
                <Route path="match" element={<Match />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        {showInstallGuide && (
          <div
            style={{position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0A1A2F', color: '#fff', padding: 16, zIndex: 9999, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span style={{flex: 1}}>
              Para instalar o app no iOS, toque em <span style={{fontWeight: 'bold'}}>[Compartilhar]</span> e depois em <span style={{fontWeight: 'bold'}}>[Adicionar à Tela de Início]</span>.
            </span>
            <button
              onClick={closeBanner}
              style={{marginLeft: 16, background: 'transparent', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer'}}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        )}
      </QueryClientProvider>
    </>
  );
}
