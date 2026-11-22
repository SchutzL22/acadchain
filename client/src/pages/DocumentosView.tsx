import React, { useState, useEffect } from 'react';
import {
  FileText,
  CreditCard,
  Award,
  Download,
  Search,
  ShieldCheck,
  Eye,
  X,
  Bug,
} from 'lucide-react';
import { fetchCredenciais, getPdfDownloadUrl, getPdfAdulteradoUrl, fetchCarteirinhaData } from '../services/api';
import { DocumentoResumo, CarteirinhaData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CarteirinhaDigital } from '../components/CarteirinhaDigital';

export const DocumentosView: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');

  // Estado para Modal de Carteirinha
  const [carteirinhaModal, setCarteirinhaModal] = useState<CarteirinhaData | null>(null);

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    try {
      setLoading(true);
      setErro(null);
      const docs = await fetchCredenciais();
      setDocumentos(docs);
    } catch (err: any) {
      setErro(err.message || 'Falha ao carregar documentos acadêmicos');
    } finally {
      setLoading(false);
    }
  };

  const abrirCarteirinha = async (uuid: string) => {
    try {
      const dados = await fetchCarteirinhaData(uuid);
      setCarteirinhaModal(dados);
    } catch (err: any) {
      alert(`Não foi possível carregar os detalhes da carteirinha: ${err.message}`);
    }
  };

  const docsFiltrados = documentos.filter((doc) => {
    const matchTipo = filtroTipo === 'TODOS' || doc.tipo === filtroTipo;
    const matchBusca =
      !busca ||
      doc.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      doc.estudante_nome?.toLowerCase().includes(busca.toLowerCase()) ||
      doc.curso?.toLowerCase().includes(busca.toLowerCase()) ||
      doc.instituicao_sigla?.toLowerCase().includes(busca.toLowerCase()) ||
      doc.uuid_publico.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-900 font-bold text-xs uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-500" />
            Etapa 3: Emissão e Download de Documentos Digitais
          </div>
          <h1 className="text-2xl font-black text-brand-900 tracking-tight">
            Documentos & Carteirinhas Digitais
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consulte diplomas, certificados e carteirinhas com provas duplas registradas em Smart Contract.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/verificar-pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Validar Arquivo PDF</span>
          </a>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Abas de Filtro */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['TODOS', 'DIPLOMA', 'CARTEIRINHA', 'CERTIFICADO'] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filtroTipo === tipo
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tipo === 'TODOS' ? 'Todos os Documentos' : tipo === 'CARTEIRINHA' ? 'Carteirinhas' : `${tipo}s`}
            </button>
          ))}
        </div>

        {/* Input de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por estudante, curso ou UUID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conteúdo Principal */}
      {loading ? (
        <LoadingSpinner mensagem="Carregando documentos acadêmicos do consórcio..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} onTentarNovamente={carregarDocumentos} />
      ) : docsFiltrados.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Nenhum documento encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Não há documentos correspondentes aos filtros selecionados. Emita uma nova credencial no Laboratório.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {docsFiltrados.map((doc) => {
            const isCarteirinha = doc.tipo === 'CARTEIRINHA';
            const isRevogado = doc.status === 'REVOGADO';
            const downloadUrl = getPdfDownloadUrl(doc.uuid_publico, true);
            const adulteradoUrl = getPdfAdulteradoUrl(doc.uuid_publico);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                {/* Cabeçalho do Card */}
                <div className="p-5 border-b border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isCarteirinha
                            ? 'bg-blue-100 text-blue-800'
                            : doc.tipo === 'DIPLOMA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {isCarteirinha ? (
                          <CreditCard className="w-5 h-5" />
                        ) : doc.tipo === 'DIPLOMA' ? (
                          <Award className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {doc.tipo}
                        </span>
                        <span className="text-xs font-bold text-brand-900 block">
                          {doc.instituicao_sigla} - {doc.instituicao_nome}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isRevogado
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isRevogado ? 'Revogado' : 'Emitido / Ativo'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={doc.titulo}>
                      {doc.titulo}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Estudante: <strong className="text-slate-800">{doc.estudante_nome}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Curso: {doc.curso} (Matrícula: {doc.numero_matricula})
                    </p>
                  </div>
                </div>

                {/* Metadados Criptográficos */}
                <div className="p-4 bg-slate-50/70 text-[11px] space-y-1.5 border-b border-slate-100">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Emissão:</span>
                    <span className="font-semibold text-slate-700">{doc.data_emissao}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Registro Blockchain:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {doc.status_sincronizacao || 'CONFIRMADO_ONCHAIN'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Hash SHA-256 Metadados:</span>
                    <span className="font-mono text-[9px] text-slate-600 block truncate" title={doc.hash_sha256_conteudo}>
                      {doc.hash_sha256_conteudo}
                    </span>
                  </div>
                </div>

                {/* Ações do Card */}
                <div className="p-3 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={downloadUrl}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-accent-400" />
                      <span>Baixar PDF</span>
                    </a>

                    {isCarteirinha && (
                      <button
                        type="button"
                        onClick={() => abrirCarteirinha(doc.uuid_publico)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver Carteirinha</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
                    <a
                      href={`/verificar?id=${encodeURIComponent(doc.uuid_publico)}`}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-900 font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-600" />
                      <span>Auditar Prova</span>
                    </a>

                    <a
                      href={adulteradoUrl}
                      download
                      title="Baixar versão propositalmente adulterada em 1 byte para testes científicos"
                      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 text-[10px] font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                    >
                      <Bug className="w-3 h-3 text-amber-600" />
                      <span>Baixar Adulterado</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Interativo da Carteirinha Digital */}
      {carteirinhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 my-8">
            <button
              type="button"
              onClick={() => setCarteirinhaModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-accent-600 uppercase tracking-wider block">
                Visualização Digital Oficial
              </span>
              <h2 className="text-lg font-black text-brand-900 tracking-tight">
                Carteirinha Estudantil Interativa
              </h2>
            </div>

            <CarteirinhaDigital
              dados={carteirinhaModal}
              onClose={() => setCarteirinhaModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
