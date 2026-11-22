import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <ShieldCheck className="w-5 h-5 text-accent-500" />
              AcadChain
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Rede descentralizada e protótipo científico para autenticação e integridade de diplomas e carteirinhas digitais no Brasil.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Aviso Ético & Científico</h4>
            <div className="flex items-start gap-2 text-xs bg-slate-800/80 p-3 rounded border border-slate-700 text-slate-300">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Este sistema é um protótipo estritamente acadêmico e experimental. Não possui credenciamento oficial, validade jurídica estatal nem conexão com o MEC. Todos os dados são fictícios.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Stack Tecnológica</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Frontend React + Vite • Backend Express TypeScript • Banco SQLite Local (node:sqlite) • Hardhat & Solidity (planejado para a Etapa 2).
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 AcadChain — Protótipo de Pesquisa Científica em Blockchain e Criptografia.
        </div>
      </div>
    </footer>
  );
};
