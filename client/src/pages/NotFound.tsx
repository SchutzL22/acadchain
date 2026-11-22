import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="text-center py-20 space-y-4">
      <AlertCircle className="w-16 h-16 text-slate-400 mx-auto" />
      <h1 className="text-3xl font-bold text-slate-900">Página Não Encontrada</h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto">
        A rota solicitada não existe no protótipo AcadChain.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-900 text-white rounded-lg text-sm font-semibold hover:bg-brand-950 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a página inicial
      </Link>
    </div>
  );
};
