import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Search,
  HelpCircle,
  LayoutDashboard,
  FlaskConical,
  Layers,
  FileText,
  FileCheck2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-brand-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-brand-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-brand-900">AcadChain</span>
              <span className="hidden md:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                Etapa 3: Documentos & PDFs
              </span>
            </div>
          </NavLink>

          {/* Navegação Desktop */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Início</span>
            </NavLink>
            <NavLink to="/documentos" className={navLinkClass}>
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Documentos</span>
            </NavLink>
            <NavLink to="/verificar-pdf" className={navLinkClass}>
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Validar PDF</span>
            </NavLink>
            <NavLink to="/laboratorio" className={navLinkClass}>
              <FlaskConical className="w-4 h-4 text-accent-500" />
              <span>Laboratório</span>
            </NavLink>
            <NavLink to="/explorador" className={navLinkClass}>
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Explorador</span>
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
