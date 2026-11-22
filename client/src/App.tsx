import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { InstituicoesDemo } from './pages/InstituicoesDemo';
import { EstudantesDemo } from './pages/EstudantesDemo';
import { VerificacaoPublica } from './pages/VerificacaoPublica';
import { ComoFunciona } from './pages/ComoFunciona';
import { LaboratorioBlockchain } from './pages/LaboratorioBlockchain';
import { ExploradorBlockchain } from './pages/ExploradorBlockchain';
import { DocumentosView } from './pages/DocumentosView';
import { VerificadorPdf } from './pages/VerificadorPdf';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/documentos" element={<DocumentosView />} />
            <Route path="/verificar-pdf" element={<VerificadorPdf />} />
            <Route path="/laboratorio" element={<LaboratorioBlockchain />} />
            <Route path="/explorador" element={<ExploradorBlockchain />} />
            <Route path="/instituicoes" element={<InstituicoesDemo />} />
            <Route path="/estudantes" element={<EstudantesDemo />} />
            <Route path="/verificar" element={<VerificacaoPublica />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
