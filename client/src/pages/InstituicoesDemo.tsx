import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, MapPin, Building, Shield } from 'lucide-react';
import { Instituicao } from '../types';
import { fetchInstituicoes } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const InstituicoesDemo: React.FC = () => {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    try {
      setLoading(true);
      setErro(null);
      const dados = await fetchInstituicoes();
      setInstituicoes(dados);
    } catch (err: any) {
      setErro(err.message || 'Não foi possível carregar as instituições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-50 text-brand-800 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Instituições de Ensino do Consórcio</h1>
            <p className="text-sm text-slate-600">
              IES fictícias registradas na base relacional e autorizadas a emitir documentos na rede AcadChain.
            </p>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner mensagem="Carregando instituições do banco SQLite..." />}

      {erro && <ErrorMessage mensagem={erro} onTentarNovamente={carregar} />}

      {!loading && !erro && instituicoes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Nenhuma instituição cadastrada.</p>
        </div>
      )}

      {!loading && !erro && instituicoes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instituicoes.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                    {inst.sigla}
                  </span>
                  <StatusBadge status={inst.status} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{inst.nome}</h3>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{inst.cidade} — {inst.estado}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>CNPJ Fictício: {inst.cnpj_ficticio}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Registro MEC Fictício: {inst.codigo_mec_ficticio}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Categoria:</span> {inst.tipo}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="block font-bold text-slate-900 text-sm">{inst.total_matriculas ?? 0}</span>
                  <span className="text-slate-500">Matrículas</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="block font-bold text-slate-900 text-sm">{inst.total_documentos ?? 0}</span>
                  <span className="text-slate-500">Documentos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
