import React from 'react';
import { BookOpen, ShieldCheck, Database, Cpu, Lock, FileCode, CheckCircle2 } from 'lucide-react';

export const ComoFunciona: React.FC = () => {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-50 text-brand-800 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Como Funciona a Tecnologia do AcadChain</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Fundamentos científicos: funções de dispersão unidirecional, separação de armazenamento e redes descentralizadas.
            </p>
          </div>
        </div>
      </div>

      {/* 1. O Conceito Fundamental de Hash SHA-256 */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-700" />
          1. O que é o Hash SHA-256 e o Efeito Avalanche?
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          O <strong>SHA-256 (Secure Hash Algorithm 256 bits)</strong> é uma função criptográfica unidirecional. Ele recebe qualquer conjunto de dados (como o nome do aluno, curso, data de colação de grau e instituição) e gera uma sequência matemática de 64 caracteres hexadecimais única.
        </p>

        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono space-y-3">
          <div>
            <span className="text-emerald-400 font-bold block mb-1">Entrada Original:</span>
            <span>{"{\"aluno\": \"Carlos Eduardo Moreira\", \"curso\": \"Sistemas de Informação\", \"grau\": \"Bacharel\"}"}</span>
            <span className="text-slate-400 block mt-1">↳ Hash SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">Entrada com 1 letra alterada (Tentativa de Adulteração):</span>
            <span>{"{\"aluno\": \"Carlos Eduardo MoreirA\", \"curso\": \"Sistemas de Informação\", \"grau\": \"Bacharel\"}"}</span>
            <span className="text-slate-400 block mt-1">↳ Hash SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Note que a simples troca de uma letra minúscula por maiúscula muda completamente todos os caracteres do hash (efeito avalanche). Por isso, qualquer adulteração física ou digital é instantaneamente detectável.
        </p>
      </section>

      {/* 2. Armazenamento Híbrido: Banco Local vs. Blockchain */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-700" />
          2. Por que não guardar tudo dentro da Blockchain?
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Gravar dados pessoais completos na blockchain viola princípios basilares de privacidade (LGPD), além de gerar um custo computacional proibitivo. O AcadChain adota a arquitetura de <strong>Provas On-Chain com Armazenamento Off-Chain</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <h3 className="font-bold text-brand-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-700" />
              Banco Relacional Local (SQLite)
            </h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Nome do estudante, CPF e data de nascimento</li>
              <li>Histórico de notas e créditos cursados</li>
              <li>Dados administrativos da secretaria acadêmica</li>
              <li>Preserva o direito à privacidade e retificação</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-700" />
              Blockchain Local (Ethereum/Hardhat)
            </h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Apenas o Hash SHA-256 (32 bytes)</li>
              <li>Endereço criptográfico da universidade emissora</li>
              <li>Data e hora imutáveis do bloco de registro</li>
              <li>Estado da credencial: EMITIDO ou REVOGADO</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. O Problema da Origem */}
      <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          3. O "Problema da Origem" e a Governança Universitária
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Uma distinção científica que todo pesquisador deve ter em mente: <strong>a blockchain prova que os dados não foram adulterados desde a sua gravação, mas não atesta que a instituição emissora disse a verdade.</strong>
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Por isso, a arquitetura do AcadChain é baseada em um consórcio federado com controle de acesso rigoroso por papéis (AccessControl): apenas chaves criptográficas autenticadas de instituições credenciadas podem executar a função de emissão no Smart Contract.
        </p>
      </section>
    </div>
  );
};
