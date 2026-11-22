import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status.toUpperCase()) {
    case 'ATIVA':
    case 'REGULAR':
    case 'EMITIDO':
    case 'CONCLUIDO':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'SUSPENSA':
    case 'TRANCADO':
    case 'EXPIRADO':
      colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'INATIVA':
    case 'REVOGADO':
    case 'CANCELADO':
      colorStyles = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyles}`}>
      {status}
    </span>
  );
};
