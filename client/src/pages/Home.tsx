import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Search,
  Database,
  ArrowRight,
  Cpu,
  FlaskConical,
  Layers,
  Lock,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import {
  checkBackendHealth,
  fetchInstituicoes,
  fetchEstudantes,
  fetchBlockchainStatus,
} from '../services/api';

export const Home: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const [totalInst, setTotalInst] = useState<number>(0);
  const [totalEst, setTotalEst] = useState<number>(0);
  const [blocoAtual, setBlocoAtual] = useState<number>(0);
  const [totalEmitidasOnChain, setTotalEmitidasOnChain] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        await checkBackendHealth();
        setApiStatus('online');
        const [instituicoes, estudantes, bcStatus] = await Promise.all([
          fetchInstituicoes(),
          fetchEstudantes(),
          fetchBlockchainStatus().catch(() => null),
        ]);
        setTotalInst(instituicoes.length);
        setTotalEst(estudantes.length);
        if (bcStatus && bcStatus.online) {
          setBlocoAtual(bcStatus.blocoAtual || 0);
          setTotalEmitidasOnChain(bcStatus.contrato?.totalEmitidas || 0);
        }
      } catch {
        setApiStatus('offline');
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-900 via-brand-900 to-brand-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-brand-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-400 rounded-full text-xs font-semibold backdrop-blur border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Protótipo Científico de Pesquisa — Etapa 2: Blockchain Ativa
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Autenticação Acadêmica Nacional em Blockchain Ethereum
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Rede descentralizada e auditável para emissão, validação matemática e revogação de diplomas e carteirinhas digitais, integrando SQLite e Smart Contracts no Hardhat.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/laboratorio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold shadow-lg transition"
            >
              <FlaskConical className="w-5 h-5 text-slate-950" />
              Abrir Laboratório Blockchain
            </Link>
            <Link
              to="/explorador"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Explorador de Blocos
            </Link>
            <Link
              to="/verificar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium border border-white/10 transition"
            >
              <Search className="w-4 h-4" />
              Verificação Pública
            </Link>
          </div>
        </div>
      </section>

      {/* Métricas do Protótipo em Execução */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Status da API REST"
          value={apiStatus === 'online' ? 'Online' : apiStatus === 'loading' ? 'Conectando...' : 'Offline'}
          description="Backend Express TypeScript (Porta 3001)"
          icon={<Cpu className="w-6 h-6 text-brand-700" />}
        />
        <MetricCard
          title="Nó Hardhat Local"
          value={blocoAtual > 0 ? `Bloco #${blocoAtual}` : 'Localhost:8545'}
          description="Rede Ethereum EVM local ativa"
          icon={<Database className="w-6 h-6 text-emerald-600" />}
        />
        <MetricCard
          title="Credenciais On-Chain"
          value={totalEmitidasOnChain}
          description="Registradas no Smart Contract"
          icon={<Lock className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard
          title="Discentes na Base"
          value={totalEst}
          description="Estudantes cadastrados para testes"
          icon={<Users className="w-6 h-6 text-indigo-600" />}
        />
        <MetricCard
          title="Instituições Federadas"
          value={totalInst}
          description="IES autorizadas no consórcio"
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
        />
      </section>

      {/* Módulos em Destaque */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Módulos Científicos do Protótipo</h2>
          <p className="text-sm text-slate-600">Explore os recursos implementados e interaja com os contratos inteligentes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/laboratorio"
            className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-accent-500 hover:shadow-lg transition space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Laboratório Blockchain (5 Cenários)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Experimente a emissão real de credenciais, verificação, adulteração de notas/cursos para teste, revogação on-chain e bloqueio de invasores.
            </p>
            <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
              Acessar experimentos práticos <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/explorador"
            className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
              Explorador de Blocos e Contratos
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Acompanhe a altura dos blocos, histórico de transações reais, emissões de diplomas e explicações conceituais didáticas sobre a rede.
            </p>
            <div className="text-sm font-semibold text-brand-700 flex items-center gap-1">
              Abrir explorador de blocos <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/verificar"
            className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Portal Público de Verificação
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Consulte a autenticidade de diplomas e certificados por hash SHA-256 ou código UUID em tempo real contra o banco e o smart contract.
            </p>
            <div className="text-sm font-semibold text-indigo-700 flex items-center gap-1">
              Testar busca pública <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
