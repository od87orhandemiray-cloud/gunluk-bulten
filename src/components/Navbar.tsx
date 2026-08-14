import React, { useRef, useState } from 'react';
import { 
  Printer, 
  RotateCcw, 
  Database, 
  Save, 
  Download, 
  Upload, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  PanelLeftClose, 
  PanelLeftOpen,
  FileSpreadsheet,
  FileDown,
  FileImage,
  Loader2
} from 'lucide-react';

interface NavbarProps {
  onDownloadPdf: () => void;
  onDownloadPng: () => void;
  onPrint: () => void;
  isGeneratingPdf: boolean;
  isGeneratingPng: boolean;
  onLoadSample: () => void;
  onResetTemplate: () => void;
  onSaveDraft: () => void;
  onExportJson: () => void;
  onImportJson: (data: any) => void;
  onOpenAiModal: () => void;
  scale: number;
  setScale: (s: number) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onDownloadPdf,
  onDownloadPng,
  onPrint,
  isGeneratingPdf,
  isGeneratingPng,
  onLoadSample,
  onResetTemplate,
  onSaveDraft,
  onExportJson,
  onImportJson,
  onOpenAiModal,
  scale,
  setScale,
  showSidebar,
  setShowSidebar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onImportJson(parsed);
        } catch (err) {
          alert('Geçersiz JSON dosyası formatı!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="no-print bg-slate-950 border-b border-slate-800 text-slate-100 px-3 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-lg z-30">
      {/* LEFT BRAND & SIDEBAR TOGGLE */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          title={showSidebar ? 'Düzenleme Panelini Gizle' : 'Düzenleme Panelini Göster'}
        >
          {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-1.5 rounded-lg text-white">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Günlük Bülten <span className="text-[10px] bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">A4 PDF</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">Finans & Borsa Bülteni Düzenleyici</p>
          </div>
        </div>
      </div>

      {/* MIDDLE ACTIONS: TEMPLATE PRESETS & AI */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={onLoadSample}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-950/70 hover:bg-blue-900 text-blue-200 border border-blue-800/80 text-xs font-medium transition-colors"
          title="BIST ve Dünya verileriyle örnek bülten yükle"
        >
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Örnek Veri Yükle</span>
          <span className="md:hidden">Örnek</span>
        </button>

        <button
          onClick={onResetTemplate}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          title="Boş köşeli parantezli [ ] şablona sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Şablona Sıfırla</span>
        </button>

        <button
          onClick={onOpenAiModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800/80 text-xs font-medium transition-colors shadow-sm"
          title="Yapay zeka ile haber ve yorum üret"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span className="hidden lg:inline">AI Metin Asistanı</span>
          <span className="lg:hidden">AI</span>
        </button>
      </div>

      {/* RIGHT ACTIONS: ZOOM, SAVE, EXPORT, PRINT / PDF */}
      <div className="flex items-center gap-2">
        {/* ZOOM CONTROLS */}
        <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-md p-1 gap-1 text-xs">
          <button
            onClick={() => setScale(Math.max(0.4, scale - 0.1))}
            className="p-1 hover:bg-slate-800 rounded text-slate-300"
            title="Küçült"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-[11px] text-slate-400">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(Math.min(1.3, scale + 0.1))}
            className="p-1 hover:bg-slate-800 rounded text-slate-300"
            title="Büyüt"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(0.85)}
            className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
            title="Varsayılan Ölçek (%85)"
          >
            Fit
          </button>
        </div>

        {/* SAVE & JSON EXPORT */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSaveDraft}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            title="Taslağı Kaydet (Tarayıcı Deposu)"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={onExportJson}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            title="JSON Olarak İndir"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            title="JSON Yükle"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>

        {/* PRINT / PDF / PNG ACTION GROUP */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onDownloadPng}
            disabled={isGeneratingPng}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-950/40 cursor-pointer disabled:cursor-not-allowed"
            title="Bülteni yüksek çözünürlüklü A4 PNG resmi olarak indir"
          >
            {isGeneratingPng ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="hidden sm:inline">PNG...</span>
              </>
            ) : (
              <>
                <FileImage className="w-4 h-4" />
                <span>PNG İndir</span>
              </>
            )}
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer disabled:cursor-not-allowed"
            title="Bülteni doğrudan A4 PDF dosyası (.pdf) olarak indir"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="hidden sm:inline">PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>PDF İndir</span>
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
            title="Tarayıcı Yazdırma Penceresini Aç"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden md:inline">Yazdır</span>
          </button>
        </div>
      </div>
    </header>
  );
};

