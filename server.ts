import 'dotenv/config';
import express, {type Request, type Response} from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {GoogleGenAI, ThinkingLevel} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

type DialectStyle = 'papua_akrab' | 'campuran' | 'formal';

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

interface UserProfileInput {
  name?: string;
  region?: string;
}

interface ChatRequestBody {
  messages?: ChatMessageInput[];
  style?: DialectStyle;
  topic?: string;
  userProfile?: UserProfileInput;
  fastMode?: boolean;
}

function buildSystemInstruction(
  style: DialectStyle,
  topic?: string,
  userProfile?: UserProfileInput,
  fastMode = true,
): string {
  let languageDirective = '';

  if (style === 'formal') {
    languageDirective =
      'Gunakan bahasa Indonesia baku yang hangat, santun, terstruktur, dan mudah dipahami oleh semua kalangan.';
  } else if (style === 'campuran') {
    languageDirective =
      'Gunakan bahasa Indonesia yang jernih dan mudah dipahami oleh pembaca di seluruh Indonesia, dipadukan secara lembut dengan sapaan akrab khas Papua (seperti "sa", "ko", "kitong", "baku jaga", "baku sayang") pada bagian pembuka atau penutup agar tetap terasa hangat dan bersahabat.';
  } else {
    languageDirective =
      'Gunakan bahasa Indonesia yang mudah dipahami dengan gaya dialek Papua sehari-hari yang ramah, alami, hormat, dan hangat (gunakan ungkapan natural seperti "sa", "ko", "kitong", "kaka/ade", "pace/mace", "su", "tra", "pu", "baku jaga", "baku dengar", "baku sayang"). Tetap jaga kejelasan pesan agar nasihat mudah diikuti dan tidak terkesan dibuat-buat.';
  }

  const topicFocus =
    topic && topic !== 'Semua Topik'
      ? `\nFOKUS TOPIK SAAT INI: "${topic}". Kaitkan nasihat Anda secara khusus dan mendalam dengan aspek "${topic}" dalam konteks keluarga Papua.`
      : '';

  const profileLines: string[] = [];
  if (userProfile?.name) {
    profileLines.push(`Nama panggilan pengguna: "${userProfile.name}". Sapa dengan ramah menggunakan namanya.`);
  }
  if (userProfile?.region) {
    profileLines.push(
      `Wilayah adat / asal pengguna: "${userProfile.region}". Hargai dan sesuaikan kepekaan budaya dengan wilayah adat tersebut bila relevan.`,
    );
  }
  const profileContext = profileLines.length > 0 ? `\nPROFIL PENGGUNA:\n${profileLines.join('\n')}` : '';

  const responsePaceDirective = fastMode
    ? 'FORMAT JAWABAN KILAT: Jawab langsung ke inti dalam 80–120 kata (kecuali diminta dongeng/penjelasan panjang), gunakan poin singkat yang rapi di HP, mulai dengan empati hangat, dan tutup dengan satu kalimat penguatan.'
    : 'FORMAT JAWABAN MENDALAM: Berikan penjelasan yang kaya, bijak, dan terstruktur dalam 150–240 kata dengan contoh nyata kehidupan keluarga Papua, poin-poin rapi, empati hangat, serta satu kalimat penguatan di akhir.';

  return [
    'Anda adalah "SAHABAT KELUARGA PAPUA AI" dari platform "UGUWO KAA OWAA — Rumah Keluarga dari Papua" ("Adat Dijaga, Agama Dihormati, Keluarga Dibangun, Generasi Dilindungi").',
    topicFocus,
    profileContext,
    'TOPIK: Perkawinan adat & agama Papua (termasuk mas kawin bijak & 7 wilayah adat), hubungan suami-istri, lintas suku, pendidikan & parenting anak, ekonomi keluarga, keluarga besar, bahasa & dongeng nilai leluhur Papua, serta keluarga modern.',
    `GAYA BAHASA: ${languageDirective}`,
    `${responsePaceDirective} Untuk krisis berat (KDRT/darurat), arahkan dengan lembut ke pemuka agama, tetua adat, atau layanan bantuan setempat.`,
  ]
    .filter(Boolean)
    .join('\n');
}

function getFriendlyErrorMessage(err: unknown): {status: number; error: string} {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (!process.env.GEMINI_API_KEY) {
    return {
      status: 500,
      error:
        'Kunci API Gemini belum tersedia di pengaturan server. Silakan periksa panel Settings > Secrets.',
    };
  }
  if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return {
      status: 429,
      error:
        'Layanan AI sedang sibuk menerima permintaan. Tunggu sebentar lalu coba kirim pertanyaan ko lagi.',
    };
  }
  if (
    lower.includes('403') ||
    lower.includes('401') ||
    lower.includes('permission_denied') ||
    lower.includes('api_key_invalid')
  ) {
    return {
      status: 403,
      error:
        'Akses ke layanan Gemini AI ditolak atau kunci API tidak valid. Periksa kunci API di Settings > Secrets.',
    };
  }
  return {
    status: 500,
    error: 'Maaf, ada gangguan sebentar saat menghubungi Sahabat Keluarga Papua AI. Coba kirim ulang ya.',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({limit: '64kb'}));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ok: true, service: 'UGUWO KAA OWAA'});
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = (req.body || {}) as ChatRequestBody;
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const style: DialectStyle =
      body.style === 'formal'
        ? 'formal'
        : body.style === 'campuran'
          ? 'campuran'
          : 'papua_akrab';
    const topic =
      typeof body.topic === 'string' ? body.topic.trim().slice(0, 80) : undefined;
    const userProfile: UserProfileInput | undefined = body.userProfile
      ? {
          name:
            typeof body.userProfile.name === 'string'
              ? body.userProfile.name.trim().slice(0, 60)
              : undefined,
          region:
            typeof body.userProfile.region === 'string'
              ? body.userProfile.region.trim().slice(0, 60)
              : undefined,
        }
      : undefined;

    const fastMode = body.fastMode !== false;
    const historyLimit = fastMode ? 4 : 10;

    const sanitized = rawMessages
      .filter(
        (m): m is ChatMessageInput =>
          Boolean(m) &&
          (m.role === 'user' || m.role === 'model') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0,
      )
      .slice(-historyLimit)
      .map((m) => ({
        role: m.role,
        text: m.text.trim().slice(0, 1500),
      }));

    const firstUserIdx = sanitized.findIndex((m) => m.role === 'user');
    const validHistory = firstUserIdx >= 0 ? sanitized.slice(firstUserIdx) : [];

    if (validHistory.length === 0 || validHistory[validHistory.length - 1].role !== 'user') {
      res.status(400).json({error: 'Silakan tulis pertanyaan terlebih dahulu.'});
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'Kunci API Gemini belum dikonfigurasi di server. Silakan periksa panel Settings > Secrets.',
      });
      return;
    }

    req.socket?.setNoDelay?.(true);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const sendEvent = (payload: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    try {
      const contents = validHistory.map((m) => ({
        role: m.role,
        parts: [{text: m.text}],
      }));

      const stream = await ai.models.generateContentStream({
        model: fastMode ? 'gemini-3.1-flash-lite' : 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: buildSystemInstruction(style, topic, userProfile, fastMode),
          thinkingConfig: {
            thinkingLevel: fastMode ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW,
          },
        },
      });

      let hasText = false;
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          hasText = true;
          sendEvent({text});
        }
      }

      if (!hasText) {
        sendEvent({
          error: 'Respons AI belum muncul. Silakan coba tanya sekali lagi.',
        });
      } else {
        sendEvent({done: true});
      }
      res.end();
    } catch (err) {
      const {error} = getFriendlyErrorMessage(err);
      sendEvent({error});
      res.end();
    }
  });

  const sanitizeSvgMarkup = (rawSvg: string): string => {
    const svgMatch = rawSvg.match(/<svg[\s\S]*?<\/svg>/i);
    if (!svgMatch) return '';
    let clean = svgMatch[0];
    // Remove script, foreignObject, iframe, object, embed, and external image tags
    clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
    clean = clean.replace(/<(iframe|object|embed|link|meta|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
    clean = clean.replace(/<(iframe|object|embed|link|meta|image)\b[^>]*\/?>/gi, '');
    // Strip inline event handlers and javascript: URIs
    clean = clean.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    clean = clean.replace(/(?:href|xlink:href)\s*=\s*(?:"[^"]*"|'[^']*')/gi, (attr) =>
      attr.toLowerCase().includes('#') && !attr.toLowerCase().includes('javascript:') ? attr : '',
    );
    // Normalize opening <svg> tag dimensions cleanly
    clean = clean.replace(/<svg\b([^>]*)>/i, (_full, attrs: string) => {
      const hasViewBox = /viewBox=/i.test(attrs);
      const cleanedAttrs = attrs
        .replace(/\bxmlns\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
        .replace(/\bwidth\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
        .replace(/\bheight\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
        .trim();
      return `<svg xmlns="http://www.w3.org/2000/svg" ${
        hasViewBox ? '' : 'viewBox="0 0 640 400"'
      } width="640" height="400" ${cleanedAttrs}>`;
    });
    return clean;
  };

  app.post('/api/generate-illustration', async (req: Request, res: Response) => {
    const body = (req.body || {}) as {prompt?: string; topic?: string; style?: DialectStyle};
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 600) : '';
    const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 80) : '';

    if (!prompt) {
      res.status(400).json({error: 'Tuliskan deskripsi gambar atau ilustrasi yang ingin dibuat.'});
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'Kunci API Gemini belum dikonfigurasi di server. Silakan periksa panel Settings > Secrets.',
      });
      return;
    }

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Buatkan ilustrasi seni vektor SVG modern, artistik, hangat, dan kaya detail bertema Papua dan keluarga untuk permintaan ini: "${prompt}"${
          topic && topic !== 'Semua Topik' ? ` (Konteks topik: ${topic})` : ''
        }.`,
        config: {
          systemInstruction:
            'Anda adalah ilustrator seni vektor budaya Papua modern untuk platform UGUWO KAA OWAA. Jawab PERSIS dengan format 3 bagian berikut tanpa blok markdown:\nJUDUL: <judul singkat 2-6 kata>\nCAPTION: <deskripsi hangat 1 kalimat dialek Papua sopan>\n<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">...</svg>\n\nAturan SVG: Gunakan palet elegan Papua (#1D4A27, #163B22, #2E6F40 hijau hutan; #F2C22B, #C9A24D emas hangat; #FAF8F4, #EFE4C8 krem; #5C3D2E, #8C5A3C kayu; #1D6A8A biru pesisir; #8C3B2B terakota). Sertakan <defs> linearGradient/radialGradient, latar pegunungan/danau/langit, dan 12-24 elemen bersih (<rect>, <circle>, <ellipse>, <path>, <polygon>, <g>) seperti Honai, Noken, Cenderawasih, perahu, atau keluarga. DILARANG <script>, <image>, atau event handler.',
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
        },
      });

      const rawText = (result.text || '').trim();
      const titleMatch = rawText.match(/JUDUL:\s*(.+)/i);
      const captionMatch = rawText.match(/CAPTION:\s*(.+)/i);
      const safeSvg = sanitizeSvgMarkup(rawText);

      if (!safeSvg) {
        res.status(500).json({
          error: 'Ilustrasi belum berhasil dibentuk. Coba ubah deskripsi singkatnya ya, kaka.',
        });
        return;
      }

      res.json({
        title: (titleMatch?.[1]?.trim() || 'Ilustrasi Budaya Papua').slice(0, 90),
        caption: (
          captionMatch?.[1]?.trim() ||
          'Ilustrasi hangat bertema keluarga dan budaya Tanah Papua.'
        ).slice(0, 260),
        svgMarkup: safeSvg,
      });
    } catch (err) {
      console.error('Illustration generation error:', err);
      const {status, error} = getFriendlyErrorMessage(err);
      res.status(status).json({error});
    }
  });

  if (!IS_PROD) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Application build not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UGUWO KAA OWAA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
