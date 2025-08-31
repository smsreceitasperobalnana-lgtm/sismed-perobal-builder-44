
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import Identificacao from '@/pages/Identificacao';
import Pacientes from '@/pages/Pacientes';
import Medicamentos from '@/pages/Medicamentos';
import Receitas from '@/pages/Receitas';
import Configuracoes from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';
import { Toaster } from 'sonner';
import Atestados from '@/pages/Atestados';
import Comparecimentos from '@/pages/Comparecimentos';

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar se o profissional está logado (pode usar sessionStorage ou localStorage)
    const loggedIn = sessionStorage.getItem('sismed-current-professional');

    if (!loggedIn && location.pathname !== '/identificacao') {
      navigate('/identificacao');
    } else if (loggedIn && location.pathname === '/identificacao') {
      navigate('/');
    }

    setIsLoading(false);
  }, [navigate, location]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/identificacao" element={<Identificacao />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/atestados" element={<Atestados />} />
        <Route path="/comparecimentos" element={<Comparecimentos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default AppRoutes;

