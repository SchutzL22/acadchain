import React, { useEffect, useState } from 'react';
import {
  Layers,
  Cpu,
  RefreshCw,
  Building2,
  FileCheck2,
  Lock,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { fetchBlockchainStatus, fetchBlockchainTransacoes } from '../services/api';
import { BlockchainStatus, TransacaoBlockchain } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { MetricCard } from '../components/MetricCard';

export const ExploradorBlockchain: React.FC = () => {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [transacoes, setTransacoes] = useState<TransacaoBlockchain[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    try {
      setLoading(true);
      setErro(null);
      const [st, txs] = await Promise.all([
        fetchBlockchainStatus(),
        fetchBlockchainTransacoes(15),
      ]);
      setStatus(st);
      setTransacoes(txs);
    } catch (err: any) {
      setErro(err.message || 'Falha ao consultar nó blockchain');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  if (loading) return <LoadingSpinner mensagem="Consultando nós e blocos da rede Ethereum local..." />;
  if (erro) return <ErrorMessage mensagem={erro} onTentarNovamente={carregar} />;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-900 text-white rounded-lg">
              <Layers className="w-5 h-5 text-accent-500" />
            </span>
            <h1 className="text-2xl font-black text-slate-900">Explorador AcadChain</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Rede Local (Chain ID: {status?.chainId ?? 31337})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Visualizador educacional em tempo real da atividade de blocos, contratos e transações do consórcio acadêmico.
          </p>
        </div>

        <button
          onClick={carregar}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar Dados da Rede
        </button>
      </div>

      {/* Métricas Reais On-Chain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Bloco Mais Recente"
          value={`#${status?.blocoAtual ?? 0}`}
          description="Altura atual da cadeia Hardhat"
          icon={<Cpu className="w-5 h-5 text-brand-700" />}
        />
        <MetricCard
          title="Credenciais Emitidas"
          value={status?.contrato?.totalEmitidas ?? 0}
          description="Gravadas no Smart Contract"
          icon={<FileCheck2 className="w-5 h-5 text-emerald-600" />}
        />
        <MetricCard
          title="Credenciais Revogadas"
          value={status?.contrato?.totalRevogadas ?? 0}
          description="Marcadas com status REVOKED"
          icon={<Lock className="w-5 h-5 text-amber-600" />}
        />
        <MetricCard
          title="Instituições Federadas"
          value={status?.instituicoesAutorizadas?.length ?? 0}
          description="Emissores com ROLE ativa"
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Dados do Smart Contract */}
      {status?.contrato && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent-500" />
            Contrato Inteligente Implantado: AcademicCredentialRegistry.sol
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block">Endereço do Contrato:</span>
              <strong className="text-emerald-400 break-all">{status.contrato.endereco}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Deployer (Administrador):</span>
              <strong className="text-blue-300 break-all">{status.contrato.deployer}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Bloco de Implantação:</span>
              <span>#{status.contrato.blocoDeploy}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Data do Deploy:</span>
              <span>{status.contrato.dataDeploy}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instituições Autorizadas no Consórcio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-700" />
          Instituições Credenciadas no Smart Contract
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {status?.instituicoesAutorizadas?.map((inst) => (
            <div key={inst.id} className="p-3 bg-slate-50 border rounded-xl space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{inst.nome}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800">
                  {inst.sigla}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 break-all pt-1">
                {inst.address}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico Recente de Transações */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-700" />
            Transações Recentes da Rede Local
          </h2>
          <span className="text-xs text-slate-500">{transacoes.length} transações registradas</span>
        </div>

        {transacoes.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Nenhuma transação recente no histórico. Emita uma credencial no Laboratório para ver as transações aqui!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2 font-bold">Tipo</th>
                  <th className="pb-2 font-bold">Bloco</th>
                  <th className="pb-2 font-bold">Hash da Transação</th>
                  <th className="pb-2 font-bold">Origem (Emissor)</th>
                  <th className="pb-2 font-bold">Status</th>
                  <th className="pb-2 font-bold">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transacoes.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-sans font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          tx.tipo_operacao === 'EMISSAO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.tipo_operacao === 'REVOGACAO'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tx.tipo_operacao}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold">#{tx.bloco}</td>
                    <td className="py-2.5 text-brand-700 truncate max-w-xs">{tx.tx_hash}</td>
                    <td className="py-2.5 text-slate-500 truncate max-w-xs">{tx.de_endereco}</td>
                    <td className="py-2.5 font-sans">
                      <span className="text-emerald-700 font-bold text-[11px]">{tx.status}</span>
                    </td>
                    <td className="py-2.5 font-sans text-slate-400 text-[11px]">{tx.criado_em}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Seção Didática e Educacional */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-700" />
          Conceitos Fundamentais da Blockchain AcadChain
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-white rounded-xl border space-y-1">
            <strong className="text-slate-900 block flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              O que é um Bloco?
            </strong>
            <p>
              Um bloco é uma unidade de armazenamento encadeada criptograficamente. No AcadChain, cada bloco contém transações confirmadas que atestam a emissão ou revogação de certificados.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border space-y-1">
            <strong className="text-slate-900 block flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              O que é um Smart Contract?
            </strong>
            <p>
              É um programa determinístico publicado na Ethereum Virtual Machine (EVM). Uma vez implantado, suas regras de negócio são imutáveis e aplicadas rigorosamente sem intervenção humana.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border space-y-1">
            <strong className="text-slate-900 block flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              Por que impede emissões não autorizadas?
            </strong>
            <p>
              O contrato valida na instrução <code>onlyAuthorizedIssuer</code> se o remetente (<code>msg.sender</code>) possui credenciamento concedido pelo consórcio. Se não possuir, a transação reverte e nada é gravado.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border space-y-1">
            <strong className="text-slate-900 block flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              Qual a diferença entre SQLite e Blockchain?
            </strong>
            <p>
              O SQLite armazena os dados cadastrais ricos e mutáveis localmente (LGPD). A blockchain guarda unicamente a prova criptográfica (SHA-256) com imutabilidade e garantia de não-repúdio entre instituições.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
