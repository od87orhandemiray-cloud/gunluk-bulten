import { useState, useEffect } from 'react';
import { BulletinData, EditorTab } from './types';
import { EMPTY_TEMPLATE_BULLETIN, SAMPLE_POPULATED_BULLETIN } from './data/defaults';
import { Navbar } from './components/Navbar';
import { EditorPanel } from './components/EditorPanel';
import { BulletinPreview } from './components/BulletinPreview';
import { AiAssistantModal } from './components/AiAssistantModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadA4Pdf, downloadA4Png, openPrintWindow } from './utils/pdfGenerator';

const STORAGE_KEY = 'gunluk_bulten_draft_v1';

export default function App() {
  const [bulletinData, setBulletinData] = useState<BulletinData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Taslak okunamadı:', e);
    }
    return EMPTY_TEMPLATE_BULLETIN;
  });

  const [scale, setScale] = useState<number>(0.85);
  const [activeTab, setActiveTab] = useState<EditorTab>('genel');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiModalType, setAiModalType] = useState<'neOldu' | 'neOlacak' | 'piyasaYorumu'>('neOldu');
  const [toastMsg, setToastMsg] = useState<{ text: string; type?: 'success' | 'error' } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false);

  // Auto-save draft to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bulletinData));
    } catch (e) {
      console.error('Taslak kaydedilemedi:', e);
    }
  }, [bulletinData]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleDownloadPng = async () => {
    if (isGeneratingPng) return;
    setIsGeneratingPng(true);
    showToast('A4 PNG resmi oluşturuluyor, lütfen bekleyin...');

    try {
      const dateStr = bulletinData.header.date 
        ? bulletinData.header.date.replace(/[\/\s,.]+/g, '_') 
        : 'gunluk_bulten';
      const filename = `Bulten_${dateStr}.png`;

      await downloadA4Png('a4-bulletin-print-area', filename);
      showToast('PNG resmi başarıyla indirildi!', 'success');
    } catch (error) {
      console.error('PNG oluşturma hatası:', error);
      showToast('PNG oluşturulurken hata oluştu.', 'error');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    showToast('A4 PDF oluşturuluyor, lütfen bekleyin...');

    try {
      const dateStr = bulletinData.header.date 
        ? bulletinData.header.date.replace(/[\/\s,.]+/g, '_') 
        : 'gunluk_bulten';
      const filename = `Bulten_${dateStr}.pdf`;

      await downloadA4Pdf('a4-bulletin-print-area', filename);
      showToast('PDF başarıyla indirildi! Dosyalarınızı kontrol edin.', 'success');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      showToast('PDF oluşturulurken hata oluştu. "Yazdır" seçeneğini deneyebilirsiniz.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      openPrintWindow('a4-bulletin-print-area');
    } catch (e) {
      window.print();
    }
  };

  const handleLoadSample = () => {
    setBulletinData(SAMPLE_POPULATED_BULLETIN);
    showToast('Örnek borsa ve finans verileri yüklendi!');
  };

  const handleResetTemplate = () => {
    if (window.confirm('Tüm veriler boş şablona sıfırlanacak. Emin misiniz?')) {
      setBulletinData(EMPTY_TEMPLATE_BULLETIN);
      showToast('Boş doldurulabilir şablona sıfırlandı.');
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bulletinData));
    showToast('Taslak başarıyla kaydedildi.');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bulletinData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bulten_${bulletinData.header.date || 'taslak'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Bülten JSON dosyası indirildi.');
  };

  const handleImportJson = (importedData: any) => {
    if (importedData && importedData.header && importedData.bistIndices) {
      setBulletinData(importedData);
      showToast('Bülten verisi başarıyla içe aktarıldı.');
    } else {
      alert('Geçersiz bülten verisi yapısı!');
    }
  };

  const handleOpenAiModal = (type?: 'neOldu' | 'neOlacak' | 'piyasaYorumu') => {
    if (type) {
      setAiModalType(type);
    }
    setAiModalOpen(true);
  };

  const handleApplyAiResult = (type: 'neOldu' | 'neOlacak' | 'piyasaYorumu', text: string) => {
    if (type === 'neOldu' || type === 'neOlacak') {
      const lines = text
        .split('\n')
        .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter(l => l.length > 0);

      if (lines.length > 0) {
        setBulletinData(prev => ({
          ...prev,
          [type]: lines,
        }));
        showToast(`${type === 'neOldu' ? 'Ne Oldu' : 'Ne Olacak'} bölümü AI ile güncellendi.`);
      }
    } else if (type === 'piyasaYorumu') {
      const paragraphs = text
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (paragraphs.length > 0) {
        setBulletinData(prev => ({
          ...prev,
          piyasaYorumu: paragraphs,
        }));
        showToast('Piyasa Yorumu AI ile güncellendi.');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* NAVBAR */}
      <Navbar
        onDownloadPdf={handleDownloadPdf}
        onDownloadPng={handleDownloadPng}
        onPrint={handlePrint}
        isGeneratingPdf={isGeneratingPdf}
        isGeneratingPng={isGeneratingPng}
        onLoadSample={handleLoadSample}
        onResetTemplate={handleResetTemplate}
        onSaveDraft={handleSaveDraft}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenAiModal={() => handleOpenAiModal()}
        scale={scale}
        setScale={setScale}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* MAIN BODY AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR EDITOR PANEL */}
        {showSidebar && (
          <aside className="no-print w-full md:w-[420px] lg:w-[460px] h-full shrink-0 z-20 transition-all duration-200">
            <EditorPanel
              data={bulletinData}
              onChange={setBulletinData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenAiModal={handleOpenAiModal}
            />
          </aside>
        )}

        {/* BULLETIN PREVIEW CANVAS */}
        <main className="flex-1 h-full overflow-auto bg-slate-900 relative">
          <BulletinPreview
            data={bulletinData}
            scale={scale}
            onSelectField={(tabKey) => {
              setShowSidebar(true);
              setActiveTab(tabKey as EditorTab);
            }}
          />
        </main>
      </div>

      {/* AI ASSISTANT MODAL */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        defaultType={aiModalType}
        onApplyResult={handleApplyAiResult}
      />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className={`no-print fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 transition-all ${
          toastMsg.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toastMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
}

