import React from 'react';

interface LoadingSpinnerProps {
  mensagem?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ mensagem = 'Carregando dados...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium">{mensagem}</p>
    </div>
  );
};
