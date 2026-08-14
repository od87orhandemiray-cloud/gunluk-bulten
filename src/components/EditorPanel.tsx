import React, { useState } from 'react';
import { BulletinData, EditorTab } from '../types';
import { 
  FileText, 
  TrendingUp, 
  Globe, 
  ListPlus, 
  BarChart3, 
  Sparkles, 
  Trash2, 
  Plus, 
  Calendar, 
  Building2, 
  Upload,
  ChevronDown,
  ChevronUp,
  Type
} from 'lucide-react';

interface EditorPanelProps {
  data: BulletinData;
  onChange: (newData: BulletinData) => void;
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  onOpenAiModal?: (type: 'neOldu' | 'neOlacak' | 'piyasaYorumu') => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  onChange,
  activeTab,
  onTabChange,
  onOpenAiModal,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generic updater for deep nested property
  const updateHeader = (field: keyof BulletinData['header'], value: string) => {
    onChange({
      ...data,
      header: {
        ...data.header,
        [field]: value,
      },
    });
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeader('logoImageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Array helper for list items
  const updateArrayItem = (key: 'neOldu' | 'neOlacak' | 'piyasaYorumu', index: number, value: string) => {
    const newArr = [...data[key]];
    newArr[index] = value;
    onChange({ ...data, [key]: newArr });
  };

  const addArrayItem = (key: 'neOldu' | 'neOlacak' | 'piyasaYorumu') => {
    const defaultPlaceholder = key === 'neOldu' 
      ? '[Yeni haber gelişmesi buraya yazılacak.]' 
      : key === 'neOlacak' 
      ? '[Yeni beklenti / gösterge verisi.]' 
      : '[Yeni piyasa yorumu paragrafı.]';
    onChange({ ...data, [key]: [...data[key], defaultPlaceholder] });
  };

  const removeArrayItem = (key: 'neOldu' | 'neOlacak' | 'piyasaYorumu', index: number) => {
    const newArr = data[key].filter((_, i) => i !== index);
    onChange({ ...data, [key]: newArr });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* EDITOR TAB HEADER */}
      <div className="flex overflow-x-auto border-b border-slate-800 p-2 gap-1 bg-slate-950/60 no-scrollbar">
        <button
          onClick={() => onTabChange('genel')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'genel'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Genel & Başlık
        </button>

        <button
          onClick={() => onTabChange('haberler')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'haberler'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Haber & Yorum
        </button>

        <button
          onClick={() => onTabChange('bist')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'bist'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> BİST
        </button>

        <button
          onClick={() => onTabChange('dunya')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'dunya'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Dünya
        </button>

        <button
          onClick={() => onTabChange('yukselen_dusen')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'yukselen_dusen'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ListPlus className="w-3.5 h-3.5" /> Yükselen/Düşen
        </button>

        <button
          onClick={() => onTabChange('hacim_etki')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'hacim_etki'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Hacim & Etki
        </button>

        <button
          onClick={() => onTabChange('ai_assistant')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'ai_assistant'
              ? 'bg-purple-600 text-white shadow'
              : 'text-purple-400 hover:text-purple-200 hover:bg-purple-900/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" /> AI Asistan
        </button>
      </div>

      {/* EDITOR CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: GENEL & BAŞLIK */}
        {activeTab === 'genel' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Building2 className="w-4 h-4 text-blue-400" /> Bülten Üst Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Bülten Başlığı
                </label>
                <input
                  type="text"
                  value={data.header.title}
                  onChange={(e) => updateHeader('title', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Günlük Bülten"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tarih
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.header.date}
                    onChange={(e) => updateHeader('date', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    placeholder="13.08.2026"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Logo Metni
                </label>
                <input
                  type="text"
                  value={data.header.logoText}
                  onChange={(e) => updateHeader('logoText', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="LOGO"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Logo Görsel Yükle (İsteğe Bağlı)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-2 rounded-md flex items-center gap-1.5 text-slate-200 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Görsel Seç
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {data.header.logoImageUrl && (
                    <button
                      onClick={() => updateHeader('logoImageUrl', '')}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Şirket Adı / Telif (Alt Bilgi)
                </label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="PRİM PORTFÖY"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Sorumluluk Reddi (Footer Notu)
                </label>
                <input
                  type="text"
                  value={data.footerNote}
                  onChange={(e) => onChange({ ...data, footerNote: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Bu bülten bilgilendirme amaçlıdır..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Üst Doldurma İpucu Kutusu Metni (Boş Bırakırsanız Gizlenir)
                </label>
                <textarea
                  rows={2}
                  value={data.tipText}
                  onChange={(e) => onChange({ ...data, tipText: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Bu bir doldurulabilir şablondur..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HABERLER & YORUM */}
        {activeTab === 'haberler' && (
          <div className="space-y-6">
            {/* FONT SIZE CONTROLS FOR LEFT COLUMN */}
            <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/60 p-3 rounded-lg border border-blue-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" /> Sol Kolon Yazı Boyutu
                </span>
                <span className="text-[11px] text-slate-400">
                  {data.fontSizeLeft === 'small' ? 'Küçük (11px)' : data.fontSizeLeft === 'normal' ? 'Normal (12px)' : data.fontSizeLeft === 'xlarge' ? 'Çok Büyük (14.5px)' : 'Büyük (13px - Önerilen)'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(['small', 'normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => onChange({ ...data, fontSizeLeft: size })}
                    className={`py-1.5 px-2 rounded text-xs font-medium transition-all ${
                      (data.fontSizeLeft || 'large') === size
                        ? 'bg-blue-600 text-white font-semibold shadow ring-1 ring-blue-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {size === 'small' && 'Küçük'}
                    {size === 'normal' && 'Normal'}
                    {size === 'large' && 'Büyük ★'}
                    {size === 'xlarge' && 'Çok Büyük'}
                  </button>
                ))}
              </div>
            </div>

            {/* NE OLDU SECTION */}
            <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  Ne Oldu? (Gelişmeler)
                </h4>
                {onOpenAiModal && (
                  <button
                    onClick={() => onOpenAiModal('neOldu')}
                    className="text-[11px] bg-purple-900/50 hover:bg-purple-800/80 text-purple-200 px-2 py-1 rounded flex items-center gap-1 border border-purple-700/50 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-purple-300" /> AI İle Üret
                  </button>
                )}
              </div>

              {data.neOldu.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs text-slate-500 mt-2 font-mono">{idx + 1}.</span>
                  <textarea
                    rows={2}
                    value={item}
                    onChange={(e) => updateArrayItem('neOldu', idx, e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <button
                    onClick={() => removeArrayItem('neOldu', idx)}
                    className="text-slate-500 hover:text-red-400 p-1 mt-1 transition-colors"
                    title="Maddeyi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addArrayItem('neOldu')}
                className="w-full py-1.5 border border-dashed border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-xs rounded flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Yeni Haber Maddesi Ekle
              </button>
            </div>

            {/* NE OLACAK SECTION */}
            <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  Ne Olacak? (Beklentiler & Ajanda)
                </h4>
                {onOpenAiModal && (
                  <button
                    onClick={() => onOpenAiModal('neOlacak')}
                    className="text-[11px] bg-purple-900/50 hover:bg-purple-800/80 text-purple-200 px-2 py-1 rounded flex items-center gap-1 border border-purple-700/50 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-purple-300" /> AI İle Üret
                  </button>
                )}
              </div>

              {data.neOlacak.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs text-slate-500 mt-2 font-mono">{idx + 1}.</span>
                  <textarea
                    rows={2}
                    value={item}
                    onChange={(e) => updateArrayItem('neOlacak', idx, e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <button
                    onClick={() => removeArrayItem('neOlacak', idx)}
                    className="text-slate-500 hover:text-red-400 p-1 mt-1 transition-colors"
                    title="Maddeyi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addArrayItem('neOlacak')}
                className="w-full py-1.5 border border-dashed border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-xs rounded flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Yeni Beklenti Maddesi Ekle
              </button>
            </div>

            {/* PİYASA YORUMU SECTION */}
            <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  Piyasa Yorumu (Paragraflar)
                </h4>
                {onOpenAiModal && (
                  <button
                    onClick={() => onOpenAiModal('piyasaYorumu')}
                    className="text-[11px] bg-purple-900/50 hover:bg-purple-800/80 text-purple-200 px-2 py-1 rounded flex items-center gap-1 border border-purple-700/50 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-purple-300" /> AI İle Yorum Yaz
                  </button>
                )}
              </div>

              {data.piyasaYorumu.map((para, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => updateArrayItem('piyasaYorumu', idx, e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-y"
                  />
                  <button
                    onClick={() => removeArrayItem('piyasaYorumu', idx)}
                    className="text-slate-500 hover:text-red-400 p-1 mt-1 transition-colors"
                    title="Paragrafı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addArrayItem('piyasaYorumu')}
                className="w-full py-1.5 border border-dashed border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-xs rounded flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Yeni Yorum Paragrafı Ekle
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BİST ENDEKSLERİ */}
        {activeTab === 'bist' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <TrendingUp className="w-4 h-4 text-blue-400" /> BİST Endeksleri
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-2">Endeks</th>
                    <th className="p-2">Kapanış</th>
                    <th className="p-2">Günlük %</th>
                    <th className="p-2">Haftalık %</th>
                    <th className="p-2">Aylık %</th>
                    <th className="p-2">Yılbaşı %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.bistIndices.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-slate-800/40">
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => {
                            const newRows = [...data.bistIndices];
                            newRows[idx].name = e.target.value;
                            onChange({ ...data, bistIndices: newRows });
                          }}
                          className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-bold text-blue-400"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.close}
                          onChange={(e) => {
                            const newRows = [...data.bistIndices];
                            newRows[idx].close = e.target.value;
                            onChange({ ...data, bistIndices: newRows });
                          }}
                          className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.daily}
                          onChange={(e) => {
                            const newRows = [...data.bistIndices];
                            newRows[idx].daily = e.target.value;
                            onChange({ ...data, bistIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.weekly}
                          onChange={(e) => {
                            const newRows = [...data.bistIndices];
                            newRows[idx].weekly = e.target.value;
                            onChange({ ...data, bistIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.monthly}
                          onChange={(e) => {
                            const newRows = [...data.bistIndices];
                            newRows[idx].monthly = e.target.value;
                            onChange({ ...data, bistIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.ytd}
                          onChange={(e) => {
                            const newRows = [...data.bistIndices];
                            newRows[idx].ytd = e.target.value;
                            onChange({ ...data, bistIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DÜNYA ENDEKSLERİ */}
        {activeTab === 'dunya' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Globe className="w-4 h-4 text-blue-400" /> Dünya Endeksleri
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-2">Endeks</th>
                    <th className="p-2">Kapanış</th>
                    <th className="p-2">Günlük %</th>
                    <th className="p-2">Haftalık %</th>
                    <th className="p-2">Aylık %</th>
                    <th className="p-2">Yılbaşı %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.worldIndices.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-slate-800/40">
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => {
                            const newRows = [...data.worldIndices];
                            newRows[idx].name = e.target.value;
                            onChange({ ...data, worldIndices: newRows });
                          }}
                          className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-bold text-blue-400"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.close}
                          onChange={(e) => {
                            const newRows = [...data.worldIndices];
                            newRows[idx].close = e.target.value;
                            onChange({ ...data, worldIndices: newRows });
                          }}
                          className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.daily}
                          onChange={(e) => {
                            const newRows = [...data.worldIndices];
                            newRows[idx].daily = e.target.value;
                            onChange({ ...data, worldIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.weekly}
                          onChange={(e) => {
                            const newRows = [...data.worldIndices];
                            newRows[idx].weekly = e.target.value;
                            onChange({ ...data, worldIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.monthly}
                          onChange={(e) => {
                            const newRows = [...data.worldIndices];
                            newRows[idx].monthly = e.target.value;
                            onChange({ ...data, worldIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={row.ytd}
                          onChange={(e) => {
                            const newRows = [...data.worldIndices];
                            newRows[idx].ytd = e.target.value;
                            onChange({ ...data, worldIndices: newRows });
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: YÜKSELEN / DÜŞEN PAYLAR */}
        {activeTab === 'yukselen_dusen' && (
          <div className="space-y-6">
            {/* GAINERS */}
            <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>En Çok Yükselen Paylar (10 Adet)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.gainers.map((g, idx) => (
                  <div key={g.id || idx} className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 w-4 font-mono">{idx + 1}.</span>
                    <input
                      type="text"
                      value={g.symbol}
                      placeholder="Sembol"
                      onChange={(e) => {
                        const newGainers = [...data.gainers];
                        newGainers[idx].symbol = e.target.value;
                        onChange({ ...data, gainers: newGainers });
                      }}
                      className="w-20 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={g.close}
                      placeholder="Kapanış"
                      onChange={(e) => {
                        const newGainers = [...data.gainers];
                        newGainers[idx].close = e.target.value;
                        onChange({ ...data, gainers: newGainers });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 text-center"
                    />
                    <input
                      type="text"
                      value={g.change}
                      placeholder="Değişim"
                      onChange={(e) => {
                        const newGainers = [...data.gainers];
                        newGainers[idx].change = e.target.value;
                        onChange({ ...data, gainers: newGainers });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-emerald-400 font-bold text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* LOSERS */}
            <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 space-y-2">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                <span>En Çok Düşen Paylar (10 Adet)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.losers.map((l, idx) => (
                  <div key={l.id || idx} className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 w-4 font-mono">{idx + 1}.</span>
                    <input
                      type="text"
                      value={l.symbol}
                      placeholder="Sembol"
                      onChange={(e) => {
                        const newLosers = [...data.losers];
                        newLosers[idx].symbol = e.target.value;
                        onChange({ ...data, losers: newLosers });
                      }}
                      className="w-20 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={l.close}
                      placeholder="Kapanış"
                      onChange={(e) => {
                        const newLosers = [...data.losers];
                        newLosers[idx].close = e.target.value;
                        onChange({ ...data, losers: newLosers });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 text-center"
                    />
                    <input
                      type="text"
                      value={l.change}
                      placeholder="Değişim"
                      onChange={(e) => {
                        const newLosers = [...data.losers];
                        newLosers[idx].change = e.target.value;
                        onChange({ ...data, losers: newLosers });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-rose-400 font-bold text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: HACİM & ENDEKSE ETKİ */}
        {activeTab === 'hacim_etki' && (
          <div className="space-y-6">
            {/* VOLUMES */}
            <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Günlük İşlem Hacmi (8 Pay)
              </h4>

              <div className="space-y-2">
                {data.volumes.map((v, idx) => (
                  <div key={v.id || idx} className="grid grid-cols-2 gap-2 bg-slate-900 p-2 rounded border border-slate-800">
                    {/* Pay 1 */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={v.symbol1}
                        placeholder="Pay 1"
                        onChange={(e) => {
                          const newV = [...data.volumes];
                          newV[idx].symbol1 = e.target.value;
                          onChange({ ...data, volumes: newV });
                        }}
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs font-bold text-blue-400"
                      />
                      <input
                        type="text"
                        value={v.close1}
                        placeholder="Kap"
                        onChange={(e) => {
                          const newV = [...data.volumes];
                          newV[idx].close1 = e.target.value;
                          onChange({ ...data, volumes: newV });
                        }}
                        className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 text-center"
                      />
                      <input
                        type="text"
                        value={v.volume1}
                        placeholder="Milyon TL"
                        onChange={(e) => {
                          const newV = [...data.volumes];
                          newV[idx].volume1 = e.target.value;
                          onChange({ ...data, volumes: newV });
                        }}
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 text-center"
                      />
                    </div>

                    {/* Pay 2 */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={v.symbol2}
                        placeholder="Pay 2"
                        onChange={(e) => {
                          const newV = [...data.volumes];
                          newV[idx].symbol2 = e.target.value;
                          onChange({ ...data, volumes: newV });
                        }}
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs font-bold text-blue-400"
                      />
                      <input
                        type="text"
                        value={v.close2}
                        placeholder="Kap"
                        onChange={(e) => {
                          const newV = [...data.volumes];
                          newV[idx].close2 = e.target.value;
                          onChange({ ...data, volumes: newV });
                        }}
                        className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 text-center"
                      />
                      <input
                        type="text"
                        value={v.volume2}
                        placeholder="Milyon TL"
                        onChange={(e) => {
                          const newV = [...data.volumes];
                          newV[idx].volume2 = e.target.value;
                          onChange({ ...data, volumes: newV });
                        }}
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-100 text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IMPACT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* POSITIVE IMPACT */}
              <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40 space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Pozitif Etki (5 Pay)
                </h4>
                {data.positiveImpact.map((p, idx) => (
                  <div key={p.id || idx} className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                    <input
                      type="text"
                      value={p.symbol}
                      onChange={(e) => {
                        const newPos = [...data.positiveImpact];
                        newPos[idx].symbol = e.target.value;
                        onChange({ ...data, positiveImpact: newPos });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={p.point}
                      placeholder="Puan"
                      onChange={(e) => {
                        const newPos = [...data.positiveImpact];
                        newPos[idx].point = e.target.value;
                        onChange({ ...data, positiveImpact: newPos });
                      }}
                      className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center"
                    />
                    <input
                      type="text"
                      value={p.change}
                      placeholder="Değişim"
                      onChange={(e) => {
                        const newPos = [...data.positiveImpact];
                        newPos[idx].change = e.target.value;
                        onChange({ ...data, positiveImpact: newPos });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-emerald-400 font-bold text-center"
                    />
                  </div>
                ))}
              </div>

              {/* NEGATIVE IMPACT */}
              <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 space-y-2">
                <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Negatif Etki (5 Pay)
                </h4>
                {data.negativeImpact.map((n, idx) => (
                  <div key={n.id || idx} className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                    <input
                      type="text"
                      value={n.symbol}
                      onChange={(e) => {
                        const newNeg = [...data.negativeImpact];
                        newNeg[idx].symbol = e.target.value;
                        onChange({ ...data, negativeImpact: newNeg });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={n.point}
                      placeholder="Puan"
                      onChange={(e) => {
                        const newNeg = [...data.negativeImpact];
                        newNeg[idx].point = e.target.value;
                        onChange({ ...data, negativeImpact: newNeg });
                      }}
                      className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-center"
                    />
                    <input
                      type="text"
                      value={n.change}
                      placeholder="Değişim"
                      onChange={(e) => {
                        const newNeg = [...data.negativeImpact];
                        newNeg[idx].change = e.target.value;
                        onChange({ ...data, negativeImpact: newNeg });
                      }}
                      className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-xs text-rose-400 font-bold text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AI ASİSTAN */}
        {activeTab === 'ai_assistant' && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Yapay Zeka Finans Bülten Asistanı
              </h3>
              <p className="text-xs text-slate-300">
                Piyasa gelişmelerini, şirket haberlerini veya BIST100 teknik seviyelerini yazarak Gemini AI'ın bülteniniz için profesyonel Türkçe haber maddeleri ve piyasa yorumu üretmesini sağlayın.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => onOpenAiModal && onOpenAiModal('neOldu')}
                className="p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-blue-400">1. "Ne Oldu?" Haber Maddeleri Üret</div>
                  <div className="text-[11px] text-slate-400">Günün şirket haberleri, merkez bankaları ve makro ekonomik gelişmeler</div>
                </div>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAiModal && onOpenAiModal('neOlacak')}
                className="p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-blue-400">2. "Ne Olacak?" Ajanda & Beklenti Üret</div>
                  <div className="text-[11px] text-slate-400">Açıklanacak veriler, toplantılar ve Borsa İstanbul açılış beklentisi</div>
                </div>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAiModal && onOpenAiModal('piyasaYorumu')}
                className="p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-left flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-blue-400">3. "Piyasa Yorumu" Paragrafları Yaz</div>
                  <div className="text-[11px] text-slate-400">Endeks kapanış seviyeleri, hacim ve teknik analiz paragrafları</div>
                </div>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
