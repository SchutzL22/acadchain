import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  QrCode,
  ExternalLink,
  RotateCw,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { CarteirinhaData } from '../types';
import { getPdfDownloadUrl } from '../services/api';

interface CarteirinhaDigitalProps {
  dados: CarteirinhaData;
  onClose?: () => void;
}

export const CarteirinhaDigital: React.FC<CarteirinhaDigitalProps> = ({ dados, onClose }) => {
  const [versoAberto, setVersoAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const isValida = dados.status === 'EMITIDO' && dados.matricula_status === 'REGULAR';
  const downloadUrl = getPdfDownloadUrl(dados.uuid_publico, true);

  const copiarLink = () => {
    navigator.clipboard.writeText(dados.verificarUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Container Cartão com Efeito de Perspectiva */}
      <div className="w-full max-w-md relative select-none">
        {!versoAberto ? (
          /* FRENTE DA CARTEIRINHA */
          <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all">
            {/* Header com Cores AcadChain */}
            <div className="bg-brand-900 text-white p-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400">
                  Consórcio AcadChain
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isValida
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isValida ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Válida
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-rose-400" /> Revogada
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-base font-extrabold tracking-tight text-white leading-tight">
                CARTEIRA DE IDENTIFICAÇÃO ESTUDANTIL
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {dados.instituicao_nome} ({dados.instituicao_sigla})
              </p>
            </div>

            {/* Faixa decorativa esmeralda */}
            <div className="h-1.5 bg-accent-500 w-full" />

            {/* Corpo do Cartão */}
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                {/* Avatar / Foto com placeholder moderno */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-24 h-32 rounded-xl bg-slate-100 border-2 border-slate-200 flex flex-col items-center justify-center p-2 text-slate-400 shadow-inner">
                    <User className="w-12 h-12 text-slate-300 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Discente
                    </span>
                  </div>
                  <span className="mt-1 text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    ID-1 Nacional
                  </span>
                </div>

                {/* Informações Principais */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Nome do Estudante
                    </span>
                    <span className="text-sm font-bold text-slate-900 block truncate leading-tight">
                      {dados.estudante_nome}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Curso Regular
                    </span>
                    <span className="text-xs font-semibold text-slate-700 block truncate">
                      {dados.curso}
                    </span>
                    <span className="text-[10px] text-slate-600 block">
                      Nível: {dados.nivel || 'Graduação'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                        Matrícula
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-900">
                        {dados.numero_matricula}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                        CPF Fictício
                      </span>
                      <span className="text-xs font-mono text-slate-700">
                        {dados.estudante_cpf}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                      Validade
                    </span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dados.data_validade || '31/03/2027'}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code & Identificador */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
                    <ShieldCheck className="w-4 h-4 text-accent-500 flex-shrink-0" />
                    <span>Verificação On-Chain</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-mono truncate mt-0.5" title={dados.uuid_publico}>
                    UUID: {dados.uuid_publico}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-0.5">
                    Aponte a câmera para auditar a prova na blockchain
                  </p>
                </div>

                {/* QR Code Img */}
                {(dados as any).qrCodeDataUrl ? (
                  <div className="flex-shrink-0 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <img
                      src={(dados as any).qrCodeDataUrl}
                      alt="QR Code de Verificação"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Aviso Científico */}
              <p className="text-[9px] text-slate-600 italic text-center mt-2.5">
                Protótipo científico AcadChain. Não substitui o Documento Nacional do Estudante (DNE) governamental.
              </p>
            </div>
          </div>
        ) : (
          /* VERSO DO CARTÃO (DADOS TÉCNICOS & PROVAS ON-CHAIN) */
          <div className="w-full bg-slate-900 text-slate-100 rounded-2xl shadow-xl overflow-hidden border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Provas Criptográficas On-Chain
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Dupla Prova (RFC 8785 + PDF)
              </span>
            </div>

            {/* Prova 1: Metadados Canônicos */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Hash SHA-256 Metadados Canônicos:
              </span>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 break-all select-all">
                {dados.hash_sha256_conteudo}
              </div>
            </div>

            {/* Prova 2: Hash do PDF */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Hash SHA-256 do Arquivo PDF Físico:
              </span>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-blue-400 break-all select-all">
                {dados.hash_sha256_pdf || 'Calculado automaticamente no download'}
              </div>
            </div>

            {/* Informações da Transação Blockchain */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Status de Registro:</span>
                <span className="text-emerald-400 font-bold">
                  {dados.status_sincronizacao || 'CONFIRMADO_ONCHAIN'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Bloco de Confirmação:</span>
                <span className="text-slate-200 font-mono">
                  #{dados.bloco_blockchain ?? 'Local'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block font-semibold">Hash da Transação (TX):</span>
                <span className="text-[10px] font-mono text-slate-300 break-all block">
                  {dados.tx_hash_blockchain || '0xSimuladoNaInicializacao'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block font-semibold">Smart Contract Registry:</span>
                <span className="text-[10px] font-mono text-slate-300 break-all block">
                  {dados.smart_contract_address || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}
                </span>
              </div>
            </div>

            <p className="text-[9px] text-slate-500 italic text-center">
              Consórcio Acadêmico: UFS, ITB, PUI conectados ao nó Hardhat 3 local.
            </p>
          </div>
        )}

        {/* Botão de Virar Cartão */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setVersoAberto(!versoAberto)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 shadow-sm transition"
          >
            <RotateCw className="w-3.5 h-3.5 text-accent-600" />
            <span>{versoAberto ? 'Ver Frente da Carteirinha' : 'Ver Verso & Provas Criptográficas'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Ações Rápidas */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full max-w-md">
        <a
          href={downloadUrl}
          download
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold shadow transition"
        >
          <Download className="w-4 h-4 text-accent-400" />
          <span>Baixar PDF Oficial</span>
        </a>

        <button
          type="button"
          onClick={copiarLink}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-sm transition"
        >
          {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copiado ? 'Copiado!' : 'Copiar Link'}</span>
        </button>

        <a
          href={dados.verificarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition"
        >
          <ExternalLink className="w-4 h-4 text-emerald-600" />
          <span>Auditar Online</span>
        </a>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-[11px] text-slate-500 hover:text-slate-700 underline mt-1"
          >
            Fechar Visualização
          </button>
        )}
      </div>
    </div>
  );
};
