import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Award, FileText, Hash, Calendar, CheckCircle2 } from 'lucide-react';
import { Estudante } from '../types';
import { fetchEstudantes } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const EstudantesDemo: React.FC = () => {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    try {
      setLoading(true);
      setErro(null);
      const dados = await fetchEstudantes();
      setEstudantes(dados);
    } catch (err: any) {
      setErro(err.message || 'Não foi possível carregar os estudantes');
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
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Estudantes e Credenciais Emitidas</h1>
            <p className="text-sm text-slate-600">
              Dados fictícios demonstrando a relação entre discentes, cursos e os hashes de integridade SHA-256 gerados.
            </p>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner mensagem="Carregando discentes e documentos do banco SQLite..." />}

      {erro && <ErrorMessage mensagem={erro} onTentarNovamente={carregar} />}

      {!loading && !erro && estudantes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Nenhum estudante encontrado.</p>
        </div>
      )}

      {!loading && !erro && (
        <div className="space-y-6">
          {estudantes.map((est) => (
            <div
              key={est.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{est.nome_completo}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
                    <span>E-mail: {est.email}</span>
                    <span>CPF Fictício: {est.cpf_ficticio}</span>
                  </div>
                </div>
                <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full self-start">
                  Cadastrado na base local
                </div>
              </div>

              {/* Matrículas do Estudante */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-700" />
                  Matrículas e Cursos Vinculados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {est.matriculas && est.matriculas.length > 0 ? (
                    est.matriculas.map((mat) => (
                      <div key={mat.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{mat.curso}</span>
                          <StatusBadge status={mat.status} />
                        </div>
                        <p className="text-slate-500">
                          {mat.instituicao_nome} ({mat.instituicao_sigla}) • Matrícula: {mat.numero_matricula}
                        </p>
                        <p className="text-slate-400">Nível: {mat.nivel} • Ingresso: {mat.ano_ingresso}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Sem matrículas cadastradas.</p>
                  )}
                </div>
              </div>

              {/* Documentos Emitidos */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Documentos Emitidos (Prontos para Registro na Blockchain na Etapa 2)
                </h4>
                <div className="space-y-2">
                  {est.documentos && est.documentos.length > 0 ? (
                    est.documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/60 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{doc.titulo}</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {doc.tipo}
                            </span>
                            <StatusBadge status={doc.status} />
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-xs sm:max-w-md">SHA-256: {doc.hash_sha256_conteudo}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500 text-[11px] shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Emissão: {doc.data_emissao}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Nenhum documento emitido para este discente.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
