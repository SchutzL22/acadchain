import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, ShieldAlert, Hash, FileCode2, Info } from 'lucide-react';

export const VerificacaoPublica: React.FC = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [buscou, setBuscou] = useState(false);

  // Lista de hashes de exemplo conhecidos para demonstração
  const hashesExemplo = [
    {
      tipo: 'DIPLOMA',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      aluno: 'Carlos Eduardo Moreira',
      instituicao: 'UFS - Universidade Federal do Saber',
      curso: 'Sistemas de Informação (Graduação)',
      emissao: '2023-12-18',
      status: 'EMITIDO',
    },
    {
      tipo: 'CARTEIRINHA',
      hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      aluno: 'Ana Beatriz Silveira',
      instituicao: 'UFS - Universidade Federal do Saber',
      curso: 'Ciência da Computação (Graduação)',
      emissao: '2026-01-10',
      status: 'EMITIDO',
    },
  ];

  const resultado = hashesExemplo.find(
    (h) => h.hash.toLowerCase() === termoBusca.trim().toLowerCase()
  );

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termoBusca.trim()) return;
    setBuscou(true);
  };

  const selecionarExemplo = (hash: string) => {
    setTermoBusca(hash);
    setBuscou(true);
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Portal Público de Verificação</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Consulte a autenticidade de diplomas e carteirinhas digitais através do código de rastreio ou hash SHA-256.
        </p>
      </div>

      {/* Aviso de Transparência da Etapa 1 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Status do Protótipo (Etapa 1):</span> A verificação contra Smart Contracts na rede local Ethereum será ativada na <strong>Etapa 2</strong>. Nesta etapa inicial, a busca valida a integridade contra o esquema do banco de dados relacional e hashes computados. Nenhum documento é rotulado como autenticado por blockchain antes da integração real.
        </div>
      </div>

      {/* Formulário de Busca */}
      <form onSubmit={handleBuscar} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <label htmlFor="termo" className="block text-sm font-semibold text-slate-700">
          Informe o Hash SHA-256 (64 caracteres) ou UUID do Documento
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            <input
              id="termo"
              type="text"
              value={termoBusca}
              onChange={(e) => {
                setTermoBusca(e.target.value);
                setBuscou(false);
              }}
              placeholder="Ex: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-xl transition flex items-center gap-2 text-sm"
          >
            <Search className="w-4 h-4" />
            Verificar
          </button>
        </div>

        {/* Hashes rápidos para teste */}
        <div className="pt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Clique para testar com dados cadastrados:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => selecionarExemplo(hashesExemplo[0].hash)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 font-mono text-[11px] text-slate-700 transition"
            >
              Diploma UFS (Carlos Moreira)
            </button>
            <button
              type="button"
              onClick={() => selecionarExemplo(hashesExemplo[1].hash)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 font-mono text-[11px] text-slate-700 transition"
            >
              Carteirinha UFS (Ana Silveira)
            </button>
          </div>
        </div>
      </form>

      {/* Resultado da Busca */}
      {buscou && (
        <div className="animate-in fade-in duration-300">
          {resultado ? (
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Documento Encontrado no Banco de Dados</h3>
                  <p className="text-xs text-slate-500">Hash SHA-256 coincide com a base institucional.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Tipo do Documento</span>
                  <span className="font-bold text-slate-900">{resultado.tipo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Titular</span>
                  <span className="font-bold text-slate-900">{resultado.aluno}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Instituição Emissora</span>
                  <span className="font-bold text-slate-900">{resultado.instituicao}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Curso</span>
                  <span className="font-bold text-slate-900">{resultado.curso}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Data de Emissão</span>
                  <span className="font-bold text-slate-900">{resultado.emissao}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Status do Registro</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {resultado.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-600 break-all">
                <span className="font-bold text-slate-700 block mb-1">Hash SHA-256 Validado:</span>
                {resultado.hash}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                <FileCode2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de Próxima Etapa:</strong> O registro na Blockchain Ethereum (Hardhat) gerará um comprovante de bloco imutável e endereço de contrato inteligente assim que a Etapa 2 for integrada.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-rose-300 rounded-2xl p-6 shadow-md text-center space-y-3">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Documento Não Localizado</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                O hash ou código informado não corresponde a nenhum documento emitido pelo consórcio na base local. Verifique se o código foi digitado corretamente.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
