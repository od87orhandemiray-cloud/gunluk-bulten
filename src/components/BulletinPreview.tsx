import React from 'react';
import { BulletinData } from '../types';

interface BulletinPreviewProps {
  data: BulletinData;
  scale?: number;
  onSelectField?: (section: string) => void;
  showTip?: boolean;
}

export const BulletinPreview: React.FC<BulletinPreviewProps> = ({
  data,
  scale = 1,
  onSelectField,
  showTip = true,
}) => {
  // Helper to determine change class (up or down)
  const getChangeClass = (val: string) => {
    if (!val || val === '[·]') return '';
    if (val.startsWith('+') || (!val.startsWith('-') && !val.includes('[') && parseFloat(val.replace(',', '.')) > 0)) {
      return 'up';
    }
    if (val.startsWith('-')) {
      return 'down';
    }
    return '';
  };

  // Font size configuration for left column
  const getLeftColumnTypography = () => {
    const size = data.fontSizeLeft || 'large'; // Default to large for high readability
    switch (size) {
      case 'small':
        return { fontSize: '11px', lineHeight: '1.42', bulletMargin: '6px', paraMargin: '8px' };
      case 'normal':
        return { fontSize: '12px', lineHeight: '1.46', bulletMargin: '7px', paraMargin: '9px' };
      case 'xlarge':
        return { fontSize: '14.5px', lineHeight: '1.55', bulletMargin: '10px', paraMargin: '12px' };
      case 'large':
      default:
        return { fontSize: '13px', lineHeight: '1.50', bulletMargin: '8px', paraMargin: '10px' };
    }
  };

  const leftTypo = getLeftColumnTypography();

  // Smart text formatter that handles bolding (*...* or **...**), removes raw ugly quotes, and highlights lead phrases
  const formatBulletText = (rawText: string) => {
    if (!rawText) return null;
    let text = rawText.trim();
    if (text.startsWith('[') && text.endsWith(']')) {
      return <span style={{ color: '#8a99a8', fontStyle: 'italic' }}>{text}</span>;
    }

    // Strip leading/trailing quotation marks from copy-paste
    if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith('“') && text.endsWith('”'))) {
      text = text.slice(1, -1).trim();
    }

    // Check for markdown bolding or leading asterisk
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const boldContent = match[0].replace(/^\*+|\*+$/g, '').trim();
      parts.push(
        <strong key={match.index} style={{ fontWeight: 700, color: '#093a6b' }}>
          {boldContent}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="flex justify-center overflow-auto p-2 sm:p-6 bg-slate-200/80 min-h-full">
      {/* Outer wrapper that scales the A4 paper for screen view */}
      <div
        className="a4-wrapper transition-transform origin-top shadow-2xl bg-white rounded-sm"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '10mm 9mm',
          transform: `scale(${scale})`,
          marginBottom: scale < 1 ? `-${(1 - scale) * 297}mm` : '0',
          boxSizing: 'border-box',
        }}
        id="a4-bulletin-print-area"
      >
        <div className="a4-content text-[#1c2b39] text-[9.2px] leading-[1.35] font-sans select-none">
          {/* HEADER */}
          <div
            className="header cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all rounded-[6px]"
            style={{
              background: 'linear-gradient(90deg, #0b4f8f 0%, #1f78c4 60%, #2f8fd6 100%)',
              padding: '10px 16px',
              display: 'table',
              width: '100%',
              marginBottom: '8px',
            }}
            onClick={() => onSelectField && onSelectField('genel')}
            title="Genel Ayarları Düzenlemek İçin Tıklayın"
          >
            <div className="header-logo" style={{ display: 'table-cell', width: '70px', verticalAlign: 'middle' }}>
              {data.header.logoImageUrl ? (
                <img
                  src={data.header.logoImageUrl}
                  alt="Logo"
                  className="max-h-[30px] max-w-[65px] object-contain rounded bg-white p-1"
                />
              ) : (
                <span
                  className="header-logo-box"
                  style={{
                    background: '#ffffff',
                    borderRadius: '4px',
                    padding: '5px 8px',
                    display: 'inline-block',
                    fontWeight: 'bold',
                    color: '#0b4f8f',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {data.header.logoText || 'LOGO'}
                </span>
              )}
            </div>
            <div
              className="header-title"
              style={{
                display: 'table-cell',
                verticalAlign: 'middle',
                textAlign: 'center',
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: 'bold',
                letterSpacing: '1px',
              }}
            >
              {data.header.title || 'Günlük Bülten'}
            </div>
            <div
              className="header-date"
              style={{
                display: 'table-cell',
                width: '90px',
                verticalAlign: 'middle',
                textAlign: 'right',
                color: '#eaf3fb',
                fontSize: '9px',
              }}
            >
              [{data.header.date || new Date().toLocaleDateString('tr-TR')}]
            </div>
          </div>

          {/* FILL TIP */}
          {showTip && data.tipText && (
            <div
              className="fill-tip cursor-pointer hover:bg-amber-100/80 transition-colors"
              style={{
                background: '#fff8e1',
                border: '1px dashed #e0c060',
                borderRadius: '4px',
                padding: '5px 8px',
                fontSize: '7.8px',
                color: '#7a6320',
                marginBottom: '8px',
              }}
              onClick={() => onSelectField && onSelectField('genel')}
            >
              {data.tipText}
            </div>
          )}

          {/* MAIN LAYOUT 55/45 */}
          <div
            className="layout"
            style={{
              display: 'table',
              width: '100%',
              tableLayout: 'fixed',
              borderCollapse: 'separate',
              borderSpacing: '8px 0',
            }}
          >
            {/* LEFT COLUMN 55% */}
            <div
              className="col-left"
              style={{
                display: 'table-cell',
                width: '55%',
                verticalAlign: 'top',
              }}
            >
              {/* NE OLDU */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2.5"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('haberler')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    letterSpacing: '0.3px',
                    padding: '6px 12px',
                  }}
                >
                  Ne Oldu?
                </div>
                <div className="section-body" style={{ padding: '9px 12px' }}>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '16px',
                      fontSize: leftTypo.fontSize,
                      lineHeight: leftTypo.lineHeight,
                      color: '#1c2b39',
                    }}
                  >
                    {data.neOldu.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: leftTypo.bulletMargin, textAlign: 'justify' }}>
                        {formatBulletText(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* NE OLACAK */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2.5"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('haberler')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    letterSpacing: '0.3px',
                    padding: '6px 12px',
                  }}
                >
                  Ne Olacak?
                </div>
                <div className="section-body" style={{ padding: '9px 12px' }}>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '16px',
                      fontSize: leftTypo.fontSize,
                      lineHeight: leftTypo.lineHeight,
                      color: '#1c2b39',
                    }}
                  >
                    {data.neOlacak.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: leftTypo.bulletMargin, textAlign: 'justify' }}>
                        {formatBulletText(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* PİYASA YORUMU */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2.5"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('haberler')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    letterSpacing: '0.3px',
                    padding: '6px 12px',
                  }}
                >
                  Piyasa Yorumu
                </div>
                <div
                  className="section-body"
                  style={{
                    padding: '9px 12px',
                    fontSize: leftTypo.fontSize,
                    lineHeight: leftTypo.lineHeight,
                    color: '#1c2b39',
                  }}
                >
                  {data.piyasaYorumu.map((p, idx) => (
                    <p key={idx} style={{ margin: `0 0 ${leftTypo.paraMargin} 0`, textAlign: 'justify' }}>
                      {formatBulletText(p)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN 45% */}
            <div
              className="col-right"
              style={{
                display: 'table-cell',
                width: '45%',
                verticalAlign: 'top',
              }}
            >
              {/* BİST ENDEKSLERİ */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('bist')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    padding: '5px 10px',
                  }}
                >
                  BİST Endeksleri
                </div>
                <div className="section-body" style={{ padding: '8px 10px' }}>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                    <thead>
                      <tr>
                        <th style={{ background: '#1f6fb2', color: '#fff', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }} rowSpan={2}>Endeksler</th>
                        <th style={{ background: '#1f6fb2', color: '#fff', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }} rowSpan={2}>Kapanış</th>
                        <th style={{ background: '#1f6fb2', color: '#fff', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }} colSpan={4}>Değişim (%)</th>
                      </tr>
                      <tr>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Günlük</th>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Haftalık</th>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Aylık</th>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Yılbaşı İtibariyle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.bistIndices.map((row, idx) => (
                        <tr key={row.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                          <td style={{ padding: '3px 4px', textAlign: 'left', fontWeight: 'bold', color: '#14406b', borderBottom: '1px solid #e7ecf1' }}>{row.name}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{row.close}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.daily)}>{row.daily}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.weekly)}>{row.weekly}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.monthly)}>{row.monthly}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.ytd)}>{row.ytd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DÜNYA ENDEKSLERİ */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('dunya')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    padding: '5px 10px',
                  }}
                >
                  Dünya Endeksleri
                </div>
                <div className="section-body" style={{ padding: '8px 10px' }}>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                    <thead>
                      <tr>
                        <th style={{ background: '#1f6fb2', color: '#fff', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }} rowSpan={2}>Endeksler</th>
                        <th style={{ background: '#1f6fb2', color: '#fff', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }} rowSpan={2}>Kapanış</th>
                        <th style={{ background: '#1f6fb2', color: '#fff', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }} colSpan={4}>Değişim (%)</th>
                      </tr>
                      <tr>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Günlük</th>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Haftalık</th>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Aylık</th>
                        <th style={{ background: '#2c7fc4', color: '#fff', fontSize: '7.5px', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ffffff33' }}>Yılbaşı İtibariyle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.worldIndices.map((row, idx) => (
                        <tr key={row.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                          <td style={{ padding: '3px 4px', textAlign: 'left', fontWeight: 'bold', color: '#14406b', borderBottom: '1px solid #e7ecf1' }}>{row.name}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{row.close}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.daily)}>{row.daily}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.weekly)}>{row.weekly}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.monthly)}>{row.monthly}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className={getChangeClass(row.ytd)}>{row.ytd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* YÜKSELEN / DÜŞEN PAYLAR */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('yukselen_dusen')}
              >
                <div
                  className="section-title green"
                  style={{
                    background: 'linear-gradient(90deg, #3fa63f, #63c463)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    padding: '5px 10px',
                  }}
                >
                  Yükselen / Düşen Paylar
                </div>
                <div className="section-body" style={{ padding: '8px 10px' }}>
                  <div
                    className="two-table"
                    style={{
                      display: 'table',
                      width: '100%',
                      tableLayout: 'fixed',
                      borderSpacing: '6px 0',
                    }}
                  >
                    {/* YÜKSELEN */}
                    <div className="tcell" style={{ display: 'table-cell', width: '50%', verticalAlign: 'top' }}>
                      <div
                        className="mini-title rise"
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontSize: '8px',
                          padding: '3px 0',
                          background: '#3fa63f',
                        }}
                      >
                        YÜKSELEN
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                        <thead>
                          <tr style={{ background: '#1f6fb2', color: '#fff' }}>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Pay</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Kapanış</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Değişim (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.gainers.map((g, idx) => (
                            <tr key={g.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                              <td style={{ padding: '3px 4px', fontWeight: 'bold', color: '#14406b', textAlign: 'left', borderBottom: '1px solid #e7ecf1' }}>{g.symbol}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{g.close}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className="up">{g.change}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* DÜŞEN */}
                    <div className="tcell" style={{ display: 'table-cell', width: '50%', verticalAlign: 'top' }}>
                      <div
                        className="mini-title fall"
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontSize: '8px',
                          padding: '3px 0',
                          background: '#c62828',
                        }}
                      >
                        DÜŞEN
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                        <thead>
                          <tr style={{ background: '#1f6fb2', color: '#fff' }}>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Pay</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Kapanış</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Değişim (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.losers.map((l, idx) => (
                            <tr key={l.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                              <td style={{ padding: '3px 4px', fontWeight: 'bold', color: '#14406b', textAlign: 'left', borderBottom: '1px solid #e7ecf1' }}>{l.symbol}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{l.close}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className="down">{l.change}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* GÜNLÜK İŞLEM HACMİ */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('hacim_etki')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    padding: '5px 10px',
                  }}
                >
                  Günlük İşlem Hacmi
                </div>
                <div className="section-body" style={{ padding: '8px 10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                    <thead>
                      <tr style={{ background: '#1f6fb2', color: '#fff' }}>
                        <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Pay</th>
                        <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Kapanış</th>
                        <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Milyon TL</th>
                        <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Pay</th>
                        <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Kapanış</th>
                        <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Milyon TL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.volumes.map((v, idx) => (
                        <tr key={v.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                          <td style={{ padding: '3px 4px', fontWeight: 'bold', color: '#14406b', textAlign: 'left', borderBottom: '1px solid #e7ecf1' }}>{v.symbol1}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{v.close1}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{v.volume1}</td>
                          <td style={{ padding: '3px 4px', fontWeight: 'bold', color: '#14406b', textAlign: 'left', borderBottom: '1px solid #e7ecf1' }}>{v.symbol2}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{v.close2}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{v.volume2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAYLARIN ENDEKSE ETKİSİ */}
              <div
                className="section cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all mb-2"
                style={{
                  border: '1px solid #d7dee5',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
                onClick={() => onSelectField && onSelectField('hacim_etki')}
              >
                <div
                  className="section-title"
                  style={{
                    background: '#1f6fb2',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    padding: '5px 10px',
                  }}
                >
                  Payların Endekse Etkisi
                </div>
                <div className="section-body" style={{ padding: '8px 10px' }}>
                  <div
                    className="two-table"
                    style={{
                      display: 'table',
                      width: '100%',
                      tableLayout: 'fixed',
                      borderSpacing: '6px 0',
                    }}
                  >
                    {/* POZİTİF */}
                    <div className="tcell" style={{ display: 'table-cell', width: '50%', verticalAlign: 'top' }}>
                      <div
                        className="mini-title rise"
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontSize: '8px',
                          padding: '3px 0',
                          background: '#3fa63f',
                        }}
                      >
                        POZİTİF
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                        <thead>
                          <tr style={{ background: '#1f6fb2', color: '#fff' }}>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Pay</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Puan</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Değişim (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.positiveImpact.map((p, idx) => (
                            <tr key={p.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                              <td style={{ padding: '3px 4px', fontWeight: 'bold', color: '#14406b', textAlign: 'left', borderBottom: '1px solid #e7ecf1' }}>{p.symbol}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{p.point}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className="up">{p.change}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* NEGATİF */}
                    <div className="tcell" style={{ display: 'table-cell', width: '50%', verticalAlign: 'top' }}>
                      <div
                        className="mini-title fall"
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontSize: '8px',
                          padding: '3px 0',
                          background: '#c62828',
                        }}
                      >
                        NEGATİF
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.3px' }}>
                        <thead>
                          <tr style={{ background: '#1f6fb2', color: '#fff' }}>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Pay</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Puan</th>
                            <th style={{ padding: '3px 4px', fontWeight: 'bold' }}>Değişim (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.negativeImpact.map((n, idx) => (
                            <tr key={n.id || idx} style={{ background: idx % 2 === 1 ? '#f4f8fb' : '#ffffff' }}>
                              <td style={{ padding: '3px 4px', fontWeight: 'bold', color: '#14406b', textAlign: 'left', borderBottom: '1px solid #e7ecf1' }}>{n.symbol}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }}>{n.point}</td>
                              <td style={{ padding: '3px 4px', textAlign: 'center', borderBottom: '1px solid #e7ecf1' }} className="down">{n.change}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div
            className="footer-note cursor-pointer hover:text-slate-600 transition-colors"
            style={{
              textAlign: 'center',
              fontSize: '7.5px',
              color: '#8a97a3',
              marginTop: '6px',
            }}
            onClick={() => onSelectField && onSelectField('genel')}
          >
            {data.footerNote} © [{data.companyName || 'Şirket Adınız'}]
          </div>
        </div>
      </div>
    </div>
  );
};
