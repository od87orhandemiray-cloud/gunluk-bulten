import React, { useState } from 'react';
import { Sparkles, X, Loader2, Check, AlertCircle } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'neOldu' | 'neOlacak' | 'piyasaYorumu';
  onApplyResult: (type: 'neOldu' | 'neOlacak' | 'piyasaYorumu', text: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'neOldu',
  onApplyResult,
}) => {
  const [type, setType] = useState<'neOldu' | 'neOlacak' | 'piyasaYorumu'>(defaultType);
  const [topic, setTopic] = useState('');
  const [marketContext, setMarketContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg('');
    setResultText('');

    try {
      const response = await fetch('/api/generate-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          topic,
          marketContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'AI yanıtı alınamadı.');
      }

      setResultText(data.result || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'Yapay zeka içeriği oluşturulurken bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (resultText) {
      onApplyResult(type, resultText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-900/50 border border-purple-700/50 rounded-lg text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Yapay Zeka Bülten Asistanı</h3>
              <p className="text-[11px] text-slate-400">Gemini ile Türkçe piyasa analizi ve haber üretimi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* SECTION TYPE SELECTOR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Hangi Bölüm İçin Metin Üretilecek?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('neOldu')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  type === 'neOldu'
                    ? 'bg-purple-600 text-white border-purple-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                1. Ne Oldu?
              </button>
              <button
                type="button"
                onClick={() => setType('neOlacak')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  type === 'neOlacak'
                    ? 'bg-purple-600 text-white border-purple-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                2. Ne Olacak?
              </button>
              <button
                type="button"
                onClick={() => setType('piyasaYorumu')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  type === 'piyasaYorumu'
                    ? 'bg-purple-600 text-white border-purple-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                3. Piyasa Yorumu
              </button>
            </div>
          </div>

          {/* TOPIC INPUT */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ana Konu / Gündem Başlığı
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                type === 'neOldu'
                  ? 'Örn: THYAO bilanço karı, TCMB faiz kararı ve MSCI endeks haberleri'
                  : type === 'neOlacak'
                  ? 'Örn: ABD enflasyon verisi, BIST100 açılış beklentisi ve direnç seviyeleri'
                  : 'Örn: BIST100 günü 9940 seviyesinden alımlarla kapattı'
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* EXTRA CONTEXT */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ek Bilgiler / Sayısal Veriler (İsteğe Bağlı)
            </label>
            <textarea
              rows={2}
              value={marketContext}
              onChange={(e) => setMarketContext(e.target.value)}
              placeholder="Örn: BIST100 %1.2 artış, Bankacılık %2.1 yükseliş, Dolar/TL 33.80, Destek: 9850, Direnç: 10050"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Üretiliyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> İçerik Oluştur
              </>
            )}
          </button>

          {/* RESULT AREA */}
          {resultText && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-purple-300">
                Oluşturulan Yapay Zeka Metni:
              </label>
              <textarea
                rows={5}
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                className="w-full bg-slate-950 border border-purple-800/60 rounded-lg p-3 text-xs text-slate-200 font-sans focus:outline-none focus:border-purple-500 resize-y"
              />
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Vazgeç
          </button>
          {resultText && (
            <button
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-colors shadow"
            >
              <Check className="w-4 h-4" /> Bültene Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
