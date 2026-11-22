import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, Users, Search, Database, ArrowRight, Award, FileCheck2, Cpu } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { checkBackendHealth, fetchInstituicoes, fetchEstudantes } from '../services/api';

export const Home: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const [totalInst, setTotalInst] = useState<number>(0);
  const [totalEst, setTotalEst] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        await checkBackendHealth();
        setApiStatus('online');
        const [instituicoes, estudantes] = await Promise.all([
          fetchInstituicoes(),
          fetchEstudantes(),
        ]);
        setTotalInst(instituicoes.length);
        setTotalEst(estudantes.length);
      } catch (err) {
        setApiStatus('offline');
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-900 via-brand-900 to-brand-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-brand-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-emerald-400 rounded-full text-xs font-semibold backdrop-blur border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Protótipo Científico de Pesquisa — Etapa 1
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Autenticação Acadêmica com Integridade Criptográfica
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Uma proposta descentralizada para registro e validação de diplomas, certificados e carteirinhas estudantis digitais, investigando a interoperabilidade entre bancos de dados locais e a blockchain Ethereum.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/verificar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold shadow-lg transition"
            >
              <Search className="w-5 h-5 text-slate-950" />
              Portal de Verificação Pública
            </Link>
            <Link
              to="/como-funciona"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition"
            >
              Entenda a Tecnologia
              <ArrowRight className="w-4 h-4" />
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
          icon={<Cpu className="w-6 h-6" />}
        />
        <MetricCard
          title="Banco de Dados"
          value="SQLite Nativo"
          description="node:sqlite com integridade referencial ativa"
          icon={<Database className="w-6 h-6" />}
        />
        <MetricCard
          title="Instituições de Exemplo"
          value={totalInst}
          description="IES cadastradas para demonstração"
          icon={<Building2 className="w-6 h-6" />}
        />
        <MetricCard
          title="Estudantes de Teste"
          value={totalEst}
          description="Registros com matrículas e documentos"
          icon={<Users className="w-6 h-6" />}
        />
      </section>

      {/* Funcionalidades da Etapa 1 */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Módulos do Sistema</h2>
          <p className="text-sm text-slate-600">Acesse as áreas de demonstração com dados reais providos pela API.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/instituicoes"
            className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
              Painel das Instituições
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Consulte as 3 universidades fictícias cadastradas no consórcio com seus respectivos códigos e tipos de credenciamento acadêmico.
            </p>
            <div className="text-sm font-semibold text-brand-700 flex items-center gap-1">
              Ver instituições cadastradas <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/estudantes"
            className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Painel Discente & Documentos
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visualize discentes com matrículas ativas, diplomas de graduação, certificados e carteirinhas digitais com hashes SHA-256 já estruturados.
            </p>
            <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
              Explorar discentes fictícios <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/verificar"
            className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Validação Pública
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Interface pública destinada a empresas empregadoras e verificadores externos para conferência rápida de autenticidade documental.
            </p>
            <div className="text-sm font-semibold text-indigo-700 flex items-center gap-1">
              Acessar ferramenta de busca <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
