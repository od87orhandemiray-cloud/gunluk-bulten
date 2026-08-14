import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini AI endpoint for generating Turkish market commentary or news bullets
  app.post('/api/generate-commentary', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: 'GEMINI_API_KEY bulunamadı. Lütfen AI Studio ayarlarından API anahtarınızı ekleyin.' 
        });
      }

      const { topic, marketContext, type } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      let prompt = '';
      if (type === 'neOldu') {
        prompt = `Sen profesyonel bir Borsa İstanbul ve finans piyasası analistisin. 
Aşağıdaki konu ve piyasa bağlamına dayanarak Günlük Finans Bülteninin "Ne Oldu?" bölümü için 3 ila 5 adet kısa, net, profesyonel Türkçe haber maddesi yaz.
Konu/Gündem: ${topic || 'Bugünkü piyasa gelişmeleri ve şirket haberleri'}
Ek Bağlam: ${marketContext || ''}

Lütfen direkt olarak her satırda bir madde olacak şekilde yanıt ver. Başlık veya ekstra açıklama yazma.
Örnek format:
- BIST100 endeksi günü %1.2 artışla 9.940 puandan tamamladı.
- TCMB piyasaya likidite adımları kapsamında yeni kararları duyurdu.`;
      } else if (type === 'neOlacak') {
        prompt = `Sen profesyonel bir Borsa İstanbul ve finans piyasası analistisin.
Aşağıdaki konu ve piyasa bağlamına dayanarak Günlük Finans Bülteninin "Ne Olacak?" bölümü için 3 adet kısa, net, profesyonel Türkçe beklenti ve ajanda maddesi yaz.
Konu/Gündem: ${topic || 'Bugün açıklanacak veriler ve açılış beklentisi'}
Ek Bağlam: ${marketContext || ''}

Lütfen direkt olarak her satırda bir madde olacak şekilde yanıt ver. Başlık veya ekstra açıklama yazma.
Örnek format:
- Bugün saat 10:00'da Cari İşlemler Dengesi açıklanacak.
- ABD ÜFE verileri küresel piyasalar tarafından takip edilecek.
- BIST100 endeksinin güne yatay-pozitif bir başlangıç yapması bekleniyor.`;
      } else {
        prompt = `Sen deneyimli bir Borsa İstanbul ve finans piyasası başanalistisin.
Aşağıdaki konu ve piyasa bilgilerine göre Günlük Finans Bülteninin "Piyasa Yorumu" bölümü için 2-3 paragraflık profesyonel Türkçe piyasa analizi yaz.
Konu/Gündem: ${topic || 'BIST100 endeksi günü yükselişle kapattı'}
Ek Bağlam: ${marketContext || ''}

Dil kurallarına uygun, yatırım tavsiyesi içermeyen, teknik seviyeleri (destek/direnç) ve sektör hareketlerini vurgulayan akıcı bir üslup kullan.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      res.json({ result: text });
    } catch (error: any) {
      console.error('Gemini API hatası:', error);
      res.status(500).json({ error: error?.message || 'AI içeriği üretilirken hata oluştu.' });
    }
  });

  // Vite middleware in dev, static serving in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Günlük Bülten sunucusu çalışıyor: http://0.0.0.0:${PORT}`);
  });
}

startServer();
