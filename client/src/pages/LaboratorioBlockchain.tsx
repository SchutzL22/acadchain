import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileDown,
  Bug,
} from 'lucide-react';
import {
  fetchBlockchainStatus,
  fetchCredenciais,
  fetchEstudantes,
  emitirCredencial,
  verificarCredencial,
  revogarCredencial,
  getPdfDownloadUrl,
  getPdfAdulteradoUrl,
  verificarPdf,
} from '../services/api';
import { BlockchainStatus, DocumentoResumo, Estudante, VerificacaoPdfResult } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const LaboratorioBlockchain: React.FC = () => {
  const [cenarioAtivo, setCenarioAtivo] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');
  const [statusRede, setStatusRede] = useState<BlockchainStatus | null>(null);
  const [credenciais, setCredenciais] = useState<DocumentoResumo[]>([]);
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados dos Cenários
  // Cenário A (Emissão)
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<number>(1);
  const [estudanteSelecionado, setEstudanteSelecionado] = useState<number>(1);
  const [tipoDoc, setTipoDoc] = useState<'DIPLOMA' | 'CERTIFICADO' | 'CARTEIRINHA'>('DIPLOMA');
  const [tituloDoc, setTituloDoc] = useState('Diploma de Graduação em Engenharia');
  const [emitindo, setEmitindo] = useState(false);
  const [resultadoEmissao, setResultadoEmissao] = useState<any>(null);

  // Cenário B (Verificação)
  const [credIdVerificar, setCredIdVerificar] = useState<string>('');
  const [verificando, setVerificando] = useState(false);
  const [resultadoVerificacao, setResultadoVerificacao] = useState<any>(null);
  const [mostrarDetalhesTecnicos, setMostrarDetalhesTecnicos] = useState(false);

  // Cenário C (Adulteração)
  const [credAdulterar, setCredAdulterar] = useState<DocumentoResumo | null>(null);
  const [cursoOriginal, setCursoOriginal] = useState('');
  const [cursoAdulterado, setCursoAdulterado] = useState('');
  const [resultadoAdulteracao, setResultadoAdulteracao] = useState<any>(null);

  // Cenário D (Revogação)
  const [credRevogar, setCredRevogar] = useState<string>('');
  const [motivoRevogacao, setMotivoRevogacao] = useState('Anulação por decisão do Conselho Acadêmico');
  const [revogando, setRevogando] = useState(false);
  const [resultadoRevogacao, setResultadoRevogacao] = useState<any>(null);

  // Cenário E (Não Autorizado)
  const [testandoNaoAutorizado, setTestandoNaoAutorizado] = useState(false);
  const [resultadoNaoAutorizado, setResultadoNaoAutorizado] = useState<any>(null);

  // Cenário F (Ataque de 1 Byte no PDF)
  const [docPdfSelecionado, setDocPdfSelecionado] = useState<string>('');
  const [arquivoPdfTeste, setArquivoPdfTeste] = useState<File | null>(null);
  const [analisandoPdf, setAnalisandoPdf] = useState(false);
  const [resultadoAnalisePdf, setResultadoAnalisePdf] = useState<VerificacaoPdfResult | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      const [status, creds, ests] = await Promise.all([
        fetchBlockchainStatus(),
        fetchCredenciais(),
        fetchEstudantes(),
      ]);
      setStatusRede(status);
      setCredenciais(creds);
      setEstudantes(ests);

      if (creds.length > 0) {
        setCredIdVerificar(creds[0].uuid_publico);
        setCredAdulterar(creds[0]);
        setCursoOriginal(creds[0].curso || 'Curso de Graduação');
        setCursoAdulterado(creds[0].curso || 'Curso de Graduação');
        setCredRevogar(creds[0].uuid_publico);
        setDocPdfSelecionado(creds[0].uuid_publico);
      }
    } catch (err: any) {
      setErro(err.message || 'Falha ao conectar com o backend e a blockchain');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Handler Cenário A
  const handleEmitir = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEmitindo(true);
      setResultadoEmissao(null);

      const estudante = estudantes.find((e) => e.id === estudanteSelecionado);
      const matricula = estudante?.matriculas?.[0];

      if (!matricula) {
        alert('O estudante selecionado não possui matrículas ativas.');
        return;
      }

      const res = await emitirCredencial({
        matriculaId: matricula.id,
        tipo: tipoDoc,
        titulo: tituloDoc,
        dataEmissao: new Date().toISOString().split('T')[0],
        instituicaoId: instituicaoSelecionada,
      });

      setResultadoEmissao(res.dados);
      await carregarDados();
    } catch (err: any) {
      alert(`Erro na emissão: ${err.message}`);
    } finally {
      setEmitindo(false);
    }
  };

  // Handler Cenário B
  const handleVerificar = async () => {
    if (!credIdVerificar) return;
    try {
      setVerificando(true);
      setResultadoVerificacao(null);
      const res = await verificarCredencial(credIdVerificar);
      setResultadoVerificacao(res);
    } catch (err: any) {
      alert(`Erro na verificação: ${err.message}`);
    } finally {
      setVerificando(false);
    }
  };

  // Handler Cenário C
  const handleTestarAdulteracao = async () => {
    if (!credAdulterar) return;
    try {
      // Simula hash adulterado
      const hashAdulteradoFake = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
      const res = await verificarCredencial(credAdulterar.uuid_publico, hashAdulteradoFake);
      setResultadoAdulteracao(res);
    } catch (err: any) {
      alert(`Erro ao testar adulteração: ${err.message}`);
    }
  };

  const handleRestaurarAdulteracao = () => {
    if (credAdulterar) {
      setCursoAdulterado(cursoOriginal);
      setResultadoAdulteracao(null);
    }
  };

  // Handler Cenário D
  const handleRevogar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credRevogar) return;
    try {
      setRevogando(true);
      setResultadoRevogacao(null);
      const cred = credenciais.find((c) => c.uuid_publico === credRevogar);
      const res = await revogarCredencial(credRevogar, motivoRevogacao, cred?.instituicao_id);
      setResultadoRevogacao(res.dados);
      await carregarDados();
    } catch (err: any) {
      alert(`Erro na revogação: ${err.message}`);
    } finally {
      setRevogando(false);
    }
  };

  // Handler Cenário E
  const handleTestarNaoAutorizado = async () => {
    try {
      setTestandoNaoAutorizado(true);
      setResultadoNaoAutorizado(null);

      // Tenta emitir usando a conta 999 (hacker / não autorizada)
      const res = await emitirCredencial({
        matriculaId: 1,
        tipo: 'DIPLOMA',
        titulo: 'Tentativa Ilegal de Emissão',
        dataEmissao: '2026-11-22',
        instituicaoId: 999,
      });

      setResultadoNaoAutorizado({ bloqueado: false, dados: res });
    } catch (err: any) {
      setResultadoNaoAutorizado({
        bloqueado: true,
        mensagemErro: err.message,
        motivoSolidity: 'OnlyAuthorizedIssuerAllowed()',
      });
    } finally {
      setTestandoNaoAutorizado(false);
    }
  };

  if (loading) return <LoadingSpinner mensagem="Conectando ao nó Ethereum Hardhat e SQLite..." />;
  if (erro) return <ErrorMessage mensagem={erro} onTentarNovamente={carregarDados} />;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header do Laboratório */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-900 text-white rounded-lg">
              <FlaskConical className="w-5 h-5 text-accent-500" />
            </span>
            <h1 className="text-2xl font-black text-slate-900">Laboratório Blockchain</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-brand-800 border border-blue-200">
              Etapa 2: Hardhat Local
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ambiente interativo para demonstração prática dos cenários científicos de emissão, verificação, adulteração e controle de acesso on-chain.
          </p>
        </div>

        {/* Status da Rede */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  statusRede?.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              ></span>
              <span className="font-bold text-slate-900">
                {statusRede?.online ? 'Nó Ethereum Ativo' : 'Nó Desconectado'}
              </span>
            </div>
            <div className="text-slate-500">
              Bloco Atual: <strong className="text-slate-700">#{statusRede?.blocoAtual ?? 0}</strong> • Chain ID: {statusRede?.chainId ?? 31337}
            </div>
          </div>
          <button
            onClick={carregarDados}
            title="Atualizar estado"
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerta de Contrato não implantado ou rede reiniciada */}
      {statusRede?.redeReiniciada && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Aviso de Rede Reiniciada:</strong> O nó Hardhat foi reiniciado e perdeu o contrato anterior. Execute o comando de deploy para restabelecer o contrato e sincronizar os registros.
          </div>
        </div>
      )}

      {/* Seletor de Cenários Didáticos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { id: 'A', label: 'Cenário A: Emissão', desc: 'Transação real on-chain' },
          { id: 'B', label: 'Cenário B: Verificação', desc: 'Validar prova matemática' },
          { id: 'C', label: 'Cenário C: Adulteração', desc: 'Detecção em metadados' },
          { id: 'D', label: 'Cenário D: Revogação', desc: 'Invalidar credencial' },
          { id: 'E', label: 'Cenário E: Não Autorizado', desc: 'Bloqueio de invasor' },
          { id: 'F', label: 'Cenário F: Ataque PDF', desc: 'Corrupção de 1 byte' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setCenarioAtivo(c.id as any)}
            className={`p-3 rounded-xl border text-left transition-all ${
              cenarioAtivo === c.id
                ? 'bg-brand-900 text-white border-brand-900 shadow-md ring-2 ring-brand-500/30'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="block text-xs font-bold">{c.label}</span>
            <span
              className={`block text-[10px] mt-0.5 ${
                cenarioAtivo === c.id ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {c.desc}
            </span>
          </button>
        ))}
      </div>

      {/* =============================================================== */}
      {/* CENÁRIO A: EMISSÃO REAL ON-CHAIN */}
      {/* =============================================================== */}
      {cenarioAtivo === 'A' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-brand-700" />
              Cenário A: Emissão com Transação Real na Blockchain Ethereum
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Demonstra o envio de uma transação assinada pela instituição credenciada para o contrato <code>AcademicCredentialRegistry</code>, gravando o hash SHA-256 no bloco.
            </p>
          </div>

          <form onSubmit={handleEmitir} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instituição Emissora</label>
              <select
                value={instituicaoSelecionada}
                onChange={(e) => setInstituicaoSelecionada(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white"
              >
                <option value={1}>Universidade Federal do Saber (UFS) — Conta 1</option>
                <option value={2}>Instituto Tecnológico do Brasil (ITB) — Conta 2</option>
                <option value={3}>Pontifícia Universidade Integrada (PUI) — Conta 3</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estudante Destinatário</label>
              <select
                value={estudanteSelecionado}
                onChange={(e) => setEstudanteSelecionado(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white"
              >
                {estudantes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome_completo} (CPF: {e.cpf_ficticio})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Documento</label>
              <select
                value={tipoDoc}
                onChange={(e) => setTipoDoc(e.target.value as any)}
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white"
              >
                <option value="DIPLOMA">Diploma de Conclusão</option>
                <option value="CERTIFICADO">Certificado de Especialização</option>
                <option value="CARTEIRINHA">Carteirinha de Estudante Digital</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Título do Documento</label>
              <input
                type="text"
                value={tituloDoc}
                onChange={(e) => setTituloDoc(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={emitindo}
                className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-xl transition flex items-center gap-2"
              >
                {emitindo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Minerando Bloco e Confirmando Transação...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Emitir Credencial e Gravar na Blockchain
                  </>
                )}
              </button>
            </div>
          </form>

          {resultadoEmissao && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Transação Confirmada com Sucesso no Hardhat Local!
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-mono">
                <div>
                  <span className="text-slate-500 block">UUID Público:</span>
                  <strong>{resultadoEmissao.uuid}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Bloco Confirmado:</span>
                  <strong>#{resultadoEmissao.bloco}</strong>
                </div>
                <div className="sm:col-span-2 break-all">
                  <span className="text-slate-500 block">Hash da Transação (txHash):</span>
                  <strong>{resultadoEmissao.txHash}</strong>
                </div>
                <div className="sm:col-span-2 break-all">
                  <span className="text-slate-500 block">Hash Canônico SHA-256 Gravado:</span>
                  <strong>{resultadoEmissao.hashSha256}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Emissor (Carteira):</span>
                  <strong>{resultadoEmissao.emissor}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Gas Consumido:</span>
                  <strong>{resultadoEmissao.gasUsado} unidades</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================== */}
      {/* CENÁRIO B: VERIFICAÇÃO CONTRA O SMART CONTRACT */}
      {/* =============================================================== */}
      {cenarioAtivo === 'B' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-brand-700" />
              Cenário B: Verificação Matemática e Consulta ao Smart Contract
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Recalcula os dados canônicos em memória, gera o hash SHA-256 e invoca a função <code>verifyCredential</code> do contrato para conferir o status on-chain.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Selecione a Credencial a Verificar:
              </label>
              <select
                value={credIdVerificar}
                onChange={(e) => {
                  setCredIdVerificar(e.target.value);
                  setResultadoVerificacao(null);
                }}
                className="w-full p-2.5 border rounded-lg bg-slate-50"
              >
                {credenciais.map((c) => (
                  <option key={c.uuid_publico} value={c.uuid_publico}>
                    [{c.tipo}] {c.titulo} — {c.estudante_nome} ({c.instituicao_sigla})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleVerificar}
              disabled={verificando}
              className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-xl transition flex items-center gap-2"
            >
              {verificando ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Consultar Smart Contract On-Chain
            </button>
          </div>

          {resultadoVerificacao && (
            <div
              className={`rounded-xl border p-5 space-y-4 text-xs animate-in fade-in ${
                resultadoVerificacao.valido
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {resultadoVerificacao.valido ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-black">
                    {resultadoVerificacao.valido
                      ? 'CREDENCIAL AUTÊNTICA, VÁLIDA E CONFIRMADA NA BLOCKCHAIN'
                      : 'CREDENCIAL INVÁLIDA OU COM RESTRIÇÕES'}
                  </h3>
                  <p className="text-xs mt-0.5">{resultadoVerificacao.motivo}</p>
                </div>
              </div>

              {/* Botão de Expansão de Detalhes Técnicos */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => setMostrarDetalhesTecnicos(!mostrarDetalhesTecnicos)}
                  className="flex items-center gap-1 font-bold text-slate-700 hover:underline"
                >
                  {mostrarDetalhesTecnicos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {mostrarDetalhesTecnicos ? 'Ocultar Detalhes Técnicos Criptográficos' : 'Expandir Detalhes Técnicos Criptográficos'}
                </button>

                {mostrarDetalhesTecnicos && (
                  <div className="mt-3 bg-white/90 p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Hash SHA-256 Recalculado (Off-Chain):</span>
                      <strong>{resultadoVerificacao.comparativo?.hashCalculado}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hash Registrado no Banco SQLite:</span>
                      <strong>{resultadoVerificacao.comparativo?.hashRegistradoNoBanco}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Coincidência Estrita:</span>
                      <strong>{resultadoVerificacao.comparativo?.coincidem ? 'SIM (100% dos bits idênticos)' : 'NÃO (Divergência detectada)'}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================== */}
      {/* CENÁRIO C: LABORATÓRIO CONTROLADO DE ADULTERAÇÃO */}
      {/* =============================================================== */}
      {cenarioAtivo === 'C' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Cenário C: Detecção em Tempo Real de Tentativa de Adulteração
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Simulação científica controlada: altera temporariamente um dado da credencial apresentada para comprovar que o recálculo do SHA-256 falha contra a prova imutável da blockchain.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Credencial de Teste (Original):
              </label>
              <select
                value={credAdulterar?.uuid_publico || ''}
                onChange={(e) => {
                  const c = credenciais.find((x) => x.uuid_publico === e.target.value);
                  setCredAdulterar(c || null);
                  setCursoOriginal(c?.curso || '');
                  setCursoAdulterado(c?.curso || '');
                  setResultadoAdulteracao(null);
                }}
                className="w-full p-2.5 border rounded-lg bg-slate-50"
              >
                {credenciais.map((c) => (
                  <option key={c.uuid_publico} value={c.uuid_publico}>
                    [{c.tipo}] {c.titulo} — {c.estudante_nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border rounded-xl space-y-1">
                <span className="text-slate-500 block font-bold">Curso Legítimo Registrado:</span>
                <span className="font-bold text-slate-800">{cursoOriginal}</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <label className="text-amber-900 block font-bold">
                  Simular Alteração no Documento Apresentado:
                </label>
                <input
                  type="text"
                  value={cursoAdulterado}
                  onChange={(e) => setCursoAdulterado(e.target.value)}
                  placeholder="Ex: Medicina (Adulterado)"
                  className="w-full p-2 border border-amber-300 rounded bg-white text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleTestarAdulteracao}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Submeter Cópia Modificada para Verificação
              </button>
              <button
                onClick={handleRestaurarAdulteracao}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Restaurar Cópia Original
              </button>
            </div>
          </div>

          {resultadoAdulteracao && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-5 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-rose-950">
                    ADULTERAÇÃO DETECTADA PELO SMART CONTRACT!
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5">{resultadoAdulteracao.motivo}</p>
                </div>
              </div>

              <div className="p-3 bg-white/90 rounded-lg border border-rose-200 space-y-2 font-mono text-[11px] text-slate-700">
                <div>
                  <span className="text-slate-400 block">Hash da Prova On-Chain (Blockchain):</span>
                  <span className="text-emerald-700 font-bold">{resultadoAdulteracao.comparativo?.hashRegistradoNoBanco}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Hash da Cópia Apresentada (Recalculado):</span>
                  <span className="text-rose-700 font-bold">{resultadoAdulteracao.comparativo?.hashReivindicado}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600">
                Devido ao <strong>Efeito Avalanche do SHA-256</strong>, a modificação do curso resultou em um hash 100% discrepante, impedindo que qualquer documento adulterado seja validado como autêntico.
              </div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================== */}
      {/* CENÁRIO D: REVOGAÇÃO COM TRANSAÇÃO REAL */}
      {/* =============================================================== */}
      {cenarioAtivo === 'D' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              Cenário D: Revogação Formal de Credencial na Blockchain
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Demonstra que a revogação gera uma nova transação imutável na rede, mantendo o histórico auditável e marcando o estado on-chain como <code>REVOKED</code>.
            </p>
          </div>

          <form onSubmit={handleRevogar} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Credencial a ser Revogada:
              </label>
              <select
                value={credRevogar}
                onChange={(e) => setCredRevogar(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-slate-50"
              >
                {credenciais.map((c) => (
                  <option key={c.uuid_publico} value={c.uuid_publico}>
                    [{c.status}] [{c.tipo}] {c.titulo} — {c.estudante_nome} ({c.instituicao_sigla})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Motivo Auditável da Revogação:
              </label>
              <input
                type="text"
                value={motivoRevogacao}
                onChange={(e) => setMotivoRevogacao(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={revogando}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition flex items-center gap-2"
            >
              {revogando ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Revogar Credencial na Blockchain
            </button>
          </form>

          {resultadoRevogacao && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-amber-700" />
                Revogação Confirmada na Blockchain!
              </div>
              <div className="font-mono text-slate-700 space-y-1">
                <div>Hash da Transação: {resultadoRevogacao.txHash}</div>
                <div>Bloco: #{resultadoRevogacao.bloco}</div>
                <div>Revogado por: {resultadoRevogacao.revogadoPor}</div>
                <div>Motivo Registrado: {resultadoRevogacao.motivo}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================== */}
      {/* CENÁRIO E: REJEIÇÃO DE CONTA NÃO AUTORIZADA */}
      {/* =============================================================== */}
      {cenarioAtivo === 'E' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-600" />
              Cenário E: Bloqueio Rigoroso de Emissor Não Autorizado
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Demonstra que uma carteira Ethereum arbitrária não credenciada no consórcio é sumariamente impedida pelo Smart Contract de registrar credenciais.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700">
              <span className="font-bold block text-slate-900">Conta Invasora Simulada:</span>
              <p className="font-mono text-[11px]">0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (Conta 9 do Hardhat)</p>
              <p className="text-slate-500 text-[11px]">Esta conta não consta no mapeamento <code>issuers[msg.sender].isAuthorized</code> do contrato.</p>
            </div>

            <button
              onClick={handleTestarNaoAutorizado}
              disabled={testandoNaoAutorizado}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center gap-2"
            >
              {testandoNaoAutorizado ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Tentar Emitir com Conta Não Credenciada
            </button>
          </div>

          {resultadoNaoAutorizado && (
            <div
              className={`rounded-xl border p-5 space-y-3 text-xs animate-in fade-in ${
                resultadoNaoAutorizado.bloqueado
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Operação Rejeitada com Sucesso pela Máquina Virtual Ethereum!
              </div>
              <p className="text-xs">
                O contrato inteligente reverteu a transação imediatamente com o erro{' '}
                <strong className="font-mono bg-white px-2 py-0.5 rounded border">
                  {resultadoNaoAutorizado.motivoSolidity}
                </strong>.
              </p>
              <div className="p-3 bg-white/90 rounded border border-emerald-200 font-mono text-[11px] text-slate-700 break-all">
                Mensagem do nó: {resultadoNaoAutorizado.mensagemErro}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================== */}
      {/* CENÁRIO F: ATAQUE DE 1 BYTE NO PDF (DUPLA PROVA ON-CHAIN) */}
      {/* =============================================================== */}
      {cenarioAtivo === 'F' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bug className="w-5 h-5 text-amber-600" />
              Cenário F: Ataque de Adulteração de 1 Byte em Arquivo PDF
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Demonstra que qualquer alteração física de bytes no PDF renderizado invalida a prova registrada na blockchain (<code>AcademicCredentialRegistry.verifyCredentialFull</code>), mesmo que o layout visual aparente legitimidade.
            </p>
          </div>

          {/* Seleção do Documento */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selecione o Documento para o Teste:</label>
              <select
                value={docPdfSelecionado}
                onChange={(e) => {
                  setDocPdfSelecionado(e.target.value);
                  setResultadoAnalisePdf(null);
                  setArquivoPdfTeste(null);
                }}
                className="w-full p-2.5 border rounded-lg bg-slate-50 focus:bg-white text-xs"
              >
                {credenciais.map((c) => (
                  <option key={c.uuid_publico} value={c.uuid_publico}>
                    [{c.tipo}] {c.titulo} — {c.estudante_nome} ({c.instituicao_sigla})
                  </option>
                ))}
              </select>
            </div>

            {/* Ações de Download para Comparação */}
            {docPdfSelecionado && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Arquivo Original Íntegro</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    PDF oficial gerado com QR Code canônico. Seus bytes conferem exatamente com a prova on-chain.
                  </p>
                  <a
                    href={getPdfDownloadUrl(docPdfSelecionado, true)}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Baixar PDF Original</span>
                  </a>
                </div>

                <div className="space-y-2 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200 pt-3 sm:pt-0">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 text-xs">
                    <Bug className="w-4 h-4 text-amber-600" />
                    <span>Arquivo com Ataque de 1 Byte</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    O endpoint de laboratório inverteu 1 único byte binário (bit flip) no corpo do PDF.
                  </p>
                  <a
                    href={getPdfAdulteradoUrl(docPdfSelecionado)}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    <Bug className="w-4 h-4" />
                    <span>Baixar PDF Adulterado</span>
                  </a>
                </div>
              </div>
            )}

            {/* Mini Verificador Integrado */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-xs text-slate-800 block">
                Audite Qualquer um dos Arquivos Acima:
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setArquivoPdfTeste(e.target.files[0]);
                      setResultadoAnalisePdf(null);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-900 file:text-white hover:file:bg-brand-950 cursor-pointer"
                />

                <button
                  type="button"
                  disabled={!arquivoPdfTeste || analisandoPdf}
                  onClick={async () => {
                    if (!arquivoPdfTeste) return;
                    try {
                      setAnalisandoPdf(true);
                      const res = await verificarPdf(arquivoPdfTeste);
                      setResultadoAnalisePdf(res);
                    } catch (err: any) {
                      alert(`Falha na verificação: ${err.message}`);
                    } finally {
                      setAnalisandoPdf(false);
                    }
                  }}
                  className="w-full sm:w-auto shrink-0 px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {analisandoPdf ? 'Calculando SHA-256...' : 'Testar na Blockchain'}
                </button>
              </div>

              {/* Resultado do Teste no Mini Verificador */}
              {resultadoAnalisePdf && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 mt-3 animate-in fade-in ${
                    resultadoAnalisePdf.autentico
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {resultadoAnalisePdf.autentico ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Arquivo Original Confirmado: 100% Autêntico e Íntegro!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Adulteração Detectada: Prova Física Rejeitada pelo Smart Contract!</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed">
                    {resultadoAnalisePdf.motivo}
                  </p>

                  <div className="p-2 bg-white/90 rounded border font-mono text-[10px] break-all">
                    Hash SHA-256 Calculado: {resultadoAnalisePdf.hashCalculado || resultadoAnalisePdf.hashArquivoSha256}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
