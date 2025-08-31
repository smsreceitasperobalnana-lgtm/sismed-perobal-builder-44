import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Pill, FileText, Settings, FileCheck, ClipboardCheck } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [professional, setProfessional] = useState<any>(null);
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Carregar dados do profissional da sessão
    const professionalData = sessionStorage.getItem('sismed-current-professional');
    if (professionalData) {
      setProfessional(JSON.parse(professionalData));
    }
  }, []);

  useEffect(() => {
    // Somente desktop: exibir overlay se a largura for menor que 1024px
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    updateIsDesktop();
    window.addEventListener('resize', updateIsDesktop);
    return () => window.removeEventListener('resize', updateIsDesktop);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('sismed-current-professional');
    navigate('/identificacao');
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/', 
      color: 'text-blue-600'
    },
    { 
      icon: Users, 
      label: 'Pacientes', 
      path: '/pacientes', 
      color: 'text-green-600'
    },
    { 
      icon: Pill, 
      label: 'Medicamentos', 
      path: '/medicamentos', 
      color: 'text-purple-600'
    },
    { 
      icon: FileText, 
      label: 'Receituários', 
      path: '/receitas', 
      color: 'text-orange-600'
    },
    { 
      icon: FileCheck, 
      label: 'Atestados', 
      path: '/atestados', 
      color: 'text-red-600'
    },
    { 
      icon: ClipboardCheck, 
      label: 'Comparecimentos', 
      path: '/comparecimentos', 
      color: 'text-cyan-600'
    },
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/configuracoes', 
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay para bloquear uso em telas pequenas (somente desktop) */}
      {!isDesktop && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold text-gray-900">
              Sistema otimizado para Desktop (Windows)
            </div>
            <p className="text-gray-600">
              Aumente a janela ou utilize uma resolução maior para continuar.
            </p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 flex-none bg-gray-800 text-white flex flex-col">
        {/* Header with Professional Info */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" alt={professional?.name} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {professional?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">
                {professional?.name || 'Usuário'}
              </div>
              <div className="text-sm text-gray-300 truncate">
                {professional?.registry || 'CRM/CRF'}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-blue-400">SISMED</div>
            <div className="text-xs text-gray-400">Sistema Médico v4.0</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
            >
              <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full text-left flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300 truncate">Online</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sessão</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema Médico Perobal
              </h1>
              <p className="text-sm text-gray-500">
                Bem-vindo, {professional?.name || 'Usuário'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
