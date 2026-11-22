import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hash,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { verificarPdf } from '../services/api';
import { VerificacaoPdfResult } from '../types';

export const VerificadorPdf: React.FC = () => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState<VerificacaoPdfResult | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processarArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processarArquivo(e.target.files[0]);
    }
  };

  const processarArquivo = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErro('Por favor, envie um arquivo em formato PDF.');
      setArquivo(null);
      setResultado(null);
      return;
    }
    setArquivo(file);
    setErro(null);
    setResultado(null);
  };

  const executarVerificacao = async () => {
    if (!arquivo) return;

    try {
      setAnalisando(true);
      setErro(null);
      const res = await verificarPdf(arquivo);
      setResultado(res);
    } catch (err: any) {
      setErro(err.message || 'Falha ao processar arquivo no servidor.');
    } finally {
      setAnalisando(false);
    }
  };

  const limpar = () => {
    setArquivo(null);
    setResultado(null);
    setErro(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verificação Criptográfica de Arquivos Físicos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-900 tracking-tight">
          Verificador de Diplomas e Carteirinhas em PDF
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2">
          Arraste qualquer documento acadêmico em PDF gerado pelo sistema. O servidor calculará o hash SHA-256 exato dos bytes binários e validará diretamente contra o Smart Contract na blockchain Ethereum.
        </p>
      </div>

      {/* Área de Upload / Dropzone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-accent-500 bg-accent-50/50 scale-[1.01]'
              : arquivo
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-300 hover:border-brand-900 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                arquivo ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-brand-900'
              }`}
            >
              {arquivo ? <FileCheck2 className="w-8 h-8" /> : <UploadCloud className="w-8 h-8 text-accent-500" />}
            </div>

            {arquivo ? (
              <div>
                <p className="text-sm font-bold text-slate-800">{arquivo.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tamanho: {(arquivo.size / 1024).toFixed(1)} KB | Clique para trocar de arquivo
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Arraste e solte o arquivo PDF aqui ou <span className="text-accent-600 underline">clique para selecionar</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Formatos aceitos: .pdf (máximo 10 MB)</p>
              </div>
            )}
          </div>
        </div>

        {erro && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Botões de Ação do Upload */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {arquivo && (
            <button
              type="button"
              onClick={limpar}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Limpar Seleção
            </button>
          )}

          <button
            type="button"
            disabled={!arquivo || analisando}
            onClick={executarVerificacao}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
          >
            {analisando ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-accent-400" />
                <span>Auditando Bytes na Blockchain...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-accent-400" />
                <span>Verificar Autenticidade do PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resultados da Verificação */}
      {resultado && (
        <div className="space-y-4">
          {resultado.autentico ? (
            /* CARTÃO DE SUCESSO: AUTÊNTICO */
            <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-lg overflow-hidden">
              <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                  <div>
                    <h3 className="text-base font-extrabold uppercase tracking-wide">
                      DOCUMENTO AUTÊNTICO E ÍNTEGRO
                    </h3>
                    <p className="text-xs text-emerald-100">
                      O arquivo físico coincide exatamente com a prova criptográfica registrada na blockchain.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-emerald-700 shadow-sm">
                  100% VÁLIDO
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Dados do Documento */}
                {resultado.documento && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 block">Tipo & Título</span>
                      <span className="text-sm font-bold text-brand-900 block">{resultado.documento.titulo}</span>
                      <span className="text-xs text-slate-700">Categoria: {resultado.documento.tipo}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 block">Instituição Emissora</span>
                      <span className="text-sm font-bold text-slate-900 block">{resultado.documento.instituicao}</span>
                      <span className="text-xs text-slate-700">Sigla: {resultado.documento.siglaInstituicao}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 block">Estudante Titular</span>
                      <span className="text-sm font-bold text-slate-900 block">{resultado.documento.estudante}</span>
                      <span className="text-xs text-slate-700">CPF: {resultado.documento.cpf} | Matrícula: {resultado.documento.matricula}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 block">Data de Emissão</span>
                      <span className="text-sm font-bold text-slate-900 block">{resultado.documento.dataEmissao}</span>
                      <span className="text-xs text-emerald-700 font-semibold">Status: Ativo / Regular</span>
                    </div>
                  </div>
                )}

                {/* Dupla Camada de Integridade */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-accent-600" />
                    <span>Auditoria de Dupla Prova On-Chain</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Prova 1: Metadados Estruturados</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Os dados do estudante e curso foram normalizados (RFC 8785) e conferem com a prova no contrato.
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Prova 2: Bytes Físicos do PDF</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        O hash SHA-256 do arquivo PDF físico enviado confere byte-a-byte com a prova registrada on-chain.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hashes Auditáveis */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Hash SHA-256 dos Bytes do Arquivo:
                    </span>
                    <span className="text-xs font-mono bg-slate-100 text-slate-800 p-2 rounded-lg block break-all border border-slate-200 select-all">
                      {resultado.hashArquivoSha256}
                    </span>
                  </div>

                  {resultado.documento?.txHash && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Transação Ethereum de Emissão (Bloco #{resultado.documento.bloco}):
                      </span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-800 p-2 rounded-lg block break-all border border-slate-200 select-all">
                        {resultado.documento.txHash}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* CARTÃO DE FALHA: ADULTERAÇÃO DETECTADA */
            <div className="bg-white rounded-2xl border-2 border-rose-500 shadow-lg overflow-hidden">
              <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-6 h-6 text-rose-200" />
                  <div>
                    <h3 className="text-base font-extrabold uppercase tracking-wide">
                      ADULTERAÇÃO DETECTADA OU REGISTRO INEXISTENTE
                    </h3>
                    <p className="text-xs text-rose-100">
                      O arquivo enviado não possui integridade comprovada na blockchain do consórcio.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-rose-700 shadow-sm">
                  REJEITADO
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Diagnóstico da Auditoria Criptográfica</span>
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {resultado.motivo}
                  </p>
                  <p className="text-[11px] text-rose-700 italic">
                    Propriedade do SHA-256: Qualquer alteração física (mesmo 1 byte em milhões) altera completamente o hash resultante devido ao efeito avalanche, tornando fraudes indetectáveis matematicamente impossíveis.
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Hash SHA-256 Calculado dos Bytes Recebidos:
                  </span>
                  <span className="text-xs font-mono bg-slate-100 text-rose-700 p-2 rounded-lg block break-all border border-rose-200 select-all">
                    {resultado.hashCalculado || resultado.hashArquivoSha256}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seção Didática: Como Testar Rejeição de Adulteração */}
      <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center gap-2">
          <Hash className="w-4 h-4 text-accent-600" />
          <span>Experimento Científico do Laboratório</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Para testar como a blockchain detecta fraude instantaneamente: vá para a aba <strong>Documentos</strong>, clique em <strong>"Baixar Adulterado"</strong> em qualquer diploma ou carteirinha (onde apenas 1 byte foi propositalmente invertido) e arraste o arquivo resultante para este verificador.
        </p>
      </div>
    </div>
  );
};
