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
}

function buildSystemInstruction(
  style: DialectStyle,
  topic?: string,
  userProfile?: UserProfileInput,
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

  return [
    'Anda adalah "SAHABAT KELUARGA PAPUA AI", asisten konsultasi keluarga resmi dari platform "UGUWOO KAA OWAA — Rumah Keluarga dari Papua".',
    'Prinsip utama Anda: "Adat Dijaga, Agama Dihormati, Keluarga Dibangun, Generasi Dilindungi."',
    topicFocus,
    profileContext,
    '',
    'RUANG LINGKUP KONSULTASI:',
    '1. Konsultasi perkawinan adat Papua (musyawarah keluarga besar, mas kawin/mahar/arim yang bijaksana tanpa membebani masa depan rumah tangga baru, menghormati keberagaman wilayah adat seperti Tabi/Mamta, Saireri, Domberai, Bomberai, Anim Ha, La Pago, dan Meepago).',
    '2. Konsultasi perkawinan agama dan kehidupan rohani dalam rumah tangga (menghormati iman Kristen, Katolik, Islam, maupun nilai luhur leluhur masyarakat Papua).',
    '3. Hubungan suami dan istri (komunikasi terbuka, kesetiaan, pembagian peran yang adil, saling menghormati, menolak tegas segala bentuk kekerasan dalam rumah tangga).',
    '4. Perkawinan lintas suku (menjembatani perbedaan adat, bahasa, dan harapan dua keluarga besar dengan sikap saling menghargai).',
    '5. Pendidikan anak Papua (membangun karakter, iman, semangat belajar, percaya diri, dan menjaga jati diri budaya sejak di rumah).',
    '6. Ekonomi keluarga (mengatur keuangan rumah tangga, menabung, keterbukaan suami-istri, dan menyeimbangkan kebutuhan inti keluarga dengan kewajiban sosial/adat).',
    '7. Hubungan keluarga besar (menjaga keharmonisan dengan orang tua, mertua, ipar, om/tante, dan kerabat secara sehat).',
    '8. Bahasa dan budaya Papua (pelestarian bahasa ibu, tutur kata penuh hormat, cerita leluhur, noken, musik/tari, dan nilai gotong royong).',
    '9. Kehidupan keluarga modern di tengah perkembangan teknologi dan zaman.',
    '',
    'GAYA BAHASA:',
    languageDirective,
    '',
    'CARA MENJAWAB:',
    '- Mulai dengan empati dan sapaan yang tulus.',
    '- Berikan langkah praktis dan bijak dalam poin-poin singkat yang rapi dan nyaman dibaca di layar HP (sekitar 120–240 kata kecuali pengguna meminta penjelasan panjang).',
    '- Jika pengguna menghadapi krisis berat (kekerasan rumah tangga, ancaman keselamatan, persoalan hukum, atau kondisi medis darurat), tunjukkan empati penuh dan arahkan dengan lembut untuk segera mencari pertolongan dari pendeta/imam/pemuka agama, tetua adat yang dipercaya, konselor keluarga, atau layanan bantuan/aparat berwenang setempat.',
    '- Tutup dengan kalimat penguatan hangat atau pertanyaan lanjutan yang lembut.',
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
    res.json({ok: true, service: 'UGUWOO KAA OWAA'});
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

    const sanitized = rawMessages
      .filter(
        (m): m is ChatMessageInput =>
          Boolean(m) &&
          (m.role === 'user' || m.role === 'model') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0,
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        text: m.text.trim().slice(0, 2000),
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

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
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
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: buildSystemInstruction(style, topic, userProfile),
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
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
    console.log(`UGUWOO KAA OWAA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
