import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Building2, Users, Search, HelpCircle, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-brand-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-accent-500" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-brand-900">AcadChain</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-brand-700 rounded-full">
                Etapa 1
              </span>
            </div>
          </NavLink>

          {/* Navegação Desktop */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Início</span>
            </NavLink>
            <NavLink to="/instituicoes" className={navLinkClass}>
              <Building2 className="w-4 h-4" />
              <span>Instituições</span>
            </NavLink>
            <NavLink to="/estudantes" className={navLinkClass}>
              <Users className="w-4 h-4" />
              <span>Estudantes</span>
            </NavLink>
            <NavLink to="/verificar" className={navLinkClass}>
              <Search className="w-4 h-4" />
              <span>Verificação</span>
            </NavLink>
            <NavLink to="/como-funciona" className={navLinkClass}>
              <HelpCircle className="w-4 h-4" />
              <span>Como Funciona</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
