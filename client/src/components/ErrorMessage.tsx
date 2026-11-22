import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  mensagem: string;
  onTentarNovamente?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ mensagem, onTentarNovamente }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 my-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800">Falha na Comunicação com a API</h3>
          <p className="text-sm text-red-700 mt-1">{mensagem}</p>
          {onTentarNovamente && (
            <button
              onClick={onTentarNovamente}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-md text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
