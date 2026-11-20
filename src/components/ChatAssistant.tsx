import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {
  AlertCircle,
  BookHeart,
  Bot,
  Check,
  Compass,
  Copy,
  Download,
  Feather,
  GraduationCap,
  HeartHandshake,
  History,
  ImagePlus,
  Maximize2,
  MessageSquarePlus,
  Mic,
  MicOff,
  Minimize2,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Users,
  Utensils,
  Volume2,
  VolumeX,
  Wallet,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export type DialectStyle = 'papua_akrab' | 'campuran' | 'formal';
export type ComposerMode = 'chat' | 'image';

export interface GeneratedIllustration {
  title: string;
  caption: string;
  svgMarkup: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  illustration?: GeneratedIllustration;
}

export interface ChatSession {
  id: string;
  title: string;
  topic: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  region: string;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export interface PromptItem {
  label: string;
  topic: string;
  question: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
}

export const QUICK_PROMPTS: PromptItem[] = [
  {
    label: 'Perkawinan Adat',
    topic: 'Perkawinan Adat',
    question: 'Bagaimana mempersiapkan perkawinan adat dan pemberkatan agama yang bijak?',
    icon: HeartHandshake,
    accentBg: 'bg-[#F5E9D3]',
    accentText: 'text-[#8C5A2B]',
  },
  {
    label: 'Pendidikan Anak',
    topic: 'Pendidikan Anak',
    question: 'Bagaimana mendidik anak Papua agar cerdas, beriman, dan bangga akan budayanya?',
    icon: GraduationCap,
    accentBg: 'bg-[#E3EFE6]',
    accentText: 'text-[#1D4A27]',
  },
  {
    label: 'Keluarga Harmonis',
    topic: 'Keluarga Harmonis',
    question: 'Bagaimana membangun keluarga harmonis dan saling mendengarkan di rumah?',
    icon: Users,
    accentBg: 'bg-[#E5EDF4]',
    accentText: 'text-[#1E5670]',
  },
  {
    label: 'Budaya Papua',
    topic: 'Bahasa & Budaya',
    question: 'Bagaimana menjaga bahasa ibu dan budaya Papua tetap hidup bagi anak-anak?',
    icon: Feather,
    accentBg: 'bg-[#F3E7E4]',
    accentText: 'text-[#8C3B2B]',
  },
];

const EXTRA_PROMPTS: PromptItem[] = [
  {
    label: 'Beda Suku',
    topic: 'Lintas Suku',
    question: 'Bagaimana menyatukan tradisi dalam pernikahan beda suku di Papua?',
    icon: Compass,
    accentBg: 'bg-[#EAE6F3]',
    accentText: 'text-[#4B3A70]',
  },
  {
    label: 'Ekonomi Keluarga',
    topic: 'Ekonomi Keluarga',
    question: 'Bagaimana mengatur keuangan keluarga dan kebiasaan menabung di Papua?',
    icon: Wallet,
    accentBg: 'bg-[#E6EFE9]',
    accentText: 'text-[#255C34]',
  },
];

const TOPIC_OPTIONS: {label: string; icon: LucideIcon}[] = [
  {label: 'Semua Topik', icon: Sparkles},
  {label: 'Perkawinan Adat', icon: HeartHandshake},
  {label: 'Pendidikan Anak', icon: GraduationCap},
  {label: 'Keluarga Harmonis', icon: Users},
  {label: 'Bahasa & Budaya', icon: Feather},
  {label: 'Lintas Suku', icon: Compass},
  {label: 'Ekonomi Keluarga', icon: Wallet},
  {label: 'Ketahanan Gizi', icon: Utensils},
  {label: 'Dongeng Leluhur', icon: BookHeart},
];

const ILLUSTRATION_STARTERS = [
  {
    label: 'Honai & Keluarga',
    prompt: 'Rumah adat Honai di lembah hijau Papua dengan keluarga duduk hangat bersama saat matahari pagi',
  },
  {
    label: 'Cenderawasih & Literasi',
    prompt: 'Burung Cenderawasih emas terbang di atas hutan Papua sambil anak-anak membaca buku cerita',
  },
  {
    label: 'Dapur Pangan Lokal',
    prompt: 'Meja makan keluarga Papua berisi semangkuk papeda hangat, ikan kuah kuning, dan sayur daun gedi segar',
  },
];

const DIALECT_MODES: {id: DialectStyle; label: string}[] = [
  {id: 'papua_akrab', label: 'Papua Akrab'},
  {id: 'campuran', label: 'Campuran'},
  {id: 'formal', label: 'Baku'},
];

const STORAGE_SESSIONS_KEY = 'uguwoo_chat_sessions_v1';

function getTopicIcon(topic: string): LucideIcon {
  const found = TOPIC_OPTIONS.find(
    (t) => t.label.toLowerCase() === topic.toLowerCase(),
  );
  if (found) return found.icon;
  if (topic.toLowerCase().includes('ilustrasi') || topic.toLowerCase().includes('gambar')) {
    return Palette;
  }
  return Sparkles;
}

function createInitialGreeting(profile?: UserProfile): ChatMessage {
  const sapa = profile?.name ? `Halo, ${profile.name}!` : 'Halo, kaka!';
  return {
    id: 'welcome-msg',
    role: 'model',
    text: `${sapa} Ada yang ko mau konsultasi? Ko bisa ketik, **bicara pakai suara (mikrofon)**, dengarkan jawaban AI, atau **buat ilustrasi budaya Papua**.`,
  };
}

function createFreshSession(profile?: UserProfile, topic = 'Semua Topik'): ChatSession {
  return {
    id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: 'Obrolan Baru',
    topic,
    updatedAt: Date.now(),
    messages: [createInitialGreeting(profile)],
  };
}

function loadStoredSessions(profile?: UserProfile): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_SESSIONS_KEY);
    if (!raw) return [createFreshSession(profile)];
    const parsed = JSON.parse(raw) as ChatSession[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createFreshSession(profile)];
    }
    return parsed.slice(0, 15).map((s) => ({
      id: typeof s.id === 'string' ? s.id : `sess-${Date.now()}`,
      title: typeof s.title === 'string' && s.title.trim() ? s.title : 'Obrolan Keluarga',
      topic: typeof s.topic === 'string' ? s.topic : 'Semua Topik',
      updatedAt: typeof s.updatedAt === 'number' ? s.updatedAt : Date.now(),
      messages:
        Array.isArray(s.messages) && s.messages.length > 0
          ? s.messages
          : [createInitialGreeting(profile)],
    }));
  } catch {
    return [createFreshSession(profile)];
  }
}

function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*#]+\s+/gm, '')
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function svgToDataUrl(svgMarkup: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
}

function renderInlineFormatting(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#16241D]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function FormattedMessage({text, isUser}: {text: string; isUser: boolean}) {
  if (isUser) {
    return <p className="whitespace-pre-wrap leading-relaxed">{text}</p>;
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-[#25352C]">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={index} className="h-1" aria-hidden="true" />;
        }

        if (/^[-*]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={index} className="flex items-start gap-2 pl-0.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A24D]"
                aria-hidden="true"
              />
              <span>{renderInlineFormatting(content)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={index} className="flex items-start gap-1.5 pl-0.5">
              <span className="font-semibold text-[#1B4332] tabular-nums shrink-0">
                {numMatch[1]}
              </span>
              <span>{renderInlineFormatting(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={index}>{renderInlineFormatting(trimmed)}</p>;
      })}
    </div>
  );
}

interface ChatAssistantProps {
  externalPrompt: {text: string; topic?: string; mode?: ComposerMode; nonce: number} | null;
  openWorkspaceNonce?: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  userProfile?: UserProfile;
}

export function ChatAssistant({
  externalPrompt,
  openWorkspaceNonce,
  inputRef,
  userProfile,
}: ChatAssistantProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(() =>
    loadStoredSessions(userProfile),
  );
  const [activeSessionId, setActiveSessionId] = useState<string>(
    () => loadStoredSessions(userProfile)[0]?.id ?? 'default',
  );
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<DialectStyle>('papua_akrab');
  const [fastMode, setFastMode] = useState<boolean>(true);
  const [composerMode, setComposerMode] = useState<ComposerMode>('chat');
  const [selectedTopic, setSelectedTopic] = useState<string>('Semua Topik');
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedAction, setLastFailedAction] = useState<{
    text: string;
    mode: ComposerMode;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice-to-Text (Web Speech API SpeechRecognition)
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Text-to-Speech (Web Speech API speechSynthesis)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseInputBeforeVoiceRef = useRef<string>('');
  const handledNonceRef = useRef<number>(0);
  const handledWorkspaceNonceRef = useRef<number>(0);
  const autoSpeakRef = useRef<boolean>(false);

  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
  }, [autoSpeak]);

  useEffect(() => {
    const win = window as WindowWithSpeech;
    setRecognitionSupported(Boolean(win.SpeechRecognition || win.webkitSpeechRecognition));
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [createInitialGreeting(userProfile)];

  // Persist sessions cleanly in localStorage
  useEffect(() => {
    try {
      const compactSessions = sessions.slice(0, 12).map((s) => ({
        ...s,
        messages: s.messages.slice(-30),
      }));
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(compactSessions));
    } catch {
      // Ignore storage quota issues
    }
  }, [sessions]);

  // Keep greeting personalized when user sets profile name
  useEffect(() => {
    setSessions((prev) =>
      prev.map((sess) => {
        if (
          sess.messages.length === 1 &&
          sess.messages[0].id === 'welcome-msg'
        ) {
          return {
            ...sess,
            messages: [createInitialGreeting(userProfile)],
          };
        }
        return sess;
      }),
    );
  }, [userProfile?.name]);

  // Cleanup active speech & mic on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      recognitionRef.current?.abort();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  };

  const speakText = (msgId: string, rawText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice('Browser ko belum mendukung fitur baca suara (Text-to-Speech).');
      return;
    }

    if (speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    const cleaned = stripMarkdownForSpeech(rawText);
    if (!cleaned) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'id-ID';
      utterance.rate = 0.98;
      utterance.pitch = 1.02;

      const voices = window.speechSynthesis.getVoices();
      const idVoice =
        voices.find((v) => v.lang.toLowerCase() === 'id-id') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('id'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => setSpeakingMsgId(msgId);
      utterance.onend = () =>
        setSpeakingMsgId((current) => (current === msgId ? null : current));
      utterance.onerror = () =>
        setSpeakingMsgId((current) => (current === msgId ? null : current));

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingMsgId(null);
      setVoiceNotice('Suara belum dapat diputar di perangkat ini.');
    }
  };

  const toggleVoiceInput = () => {
    setVoiceNotice(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    const win = window as WindowWithSpeech;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setVoiceNotice(
        'Fitur tanya lewat suara belum tersedia di browser ini. Coba gunakan Chrome atau Edge versi terbaru.',
      );
      return;
    }

    stopSpeaking();

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      baseInputBeforeVoiceRef.current = input.trim();

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript ?? '';
          if (result.isFinal) {
            finalChunk += `${text} `;
          } else {
            interimChunk += text;
          }
        }

        const combinedBase = baseInputBeforeVoiceRef.current;
        const finalClean = finalChunk.trim();
        const interimClean = interimChunk.trim();
        const spokenFull = [finalClean, interimClean].filter(Boolean).join(' ');
        const nextValue = [combinedBase, spokenFull].filter(Boolean).join(' ');

        setInput(nextValue);
        setInterimTranscript(interimClean);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceNotice(
            'Izin mikrofon ditolak. Izinkan akses mikrofon di browser untuk bertanya dengan suara.',
          );
        } else if (event.error === 'no-speech') {
          setVoiceNotice('Suara belum terdengar jelas. Ketuk mikrofon lalu bicara agak dekat.');
        } else if (event.error !== 'aborted') {
          setVoiceNotice('Rekaman suara terhenti. Silakan coba ketuk mikrofon lagi.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        inputRef.current?.focus();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Mikrofon belum bisa diaktifkan sekarang.');
    }
  };

  const updateSessionMessages = (
    targetSessionId: string,
    updater: (prevMsgs: ChatMessage[]) => ChatMessage[],
    maybeTitle?: string,
    maybeTopic?: string,
  ) => {
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== targetSessionId) return sess;
        const nextMsgs = updater(sess.messages);
        const derivedTitle =
          maybeTitle && sess.title === 'Obrolan Baru'
            ? maybeTitle.slice(0, 42)
            : sess.title;
        return {
          ...sess,
          title: derivedTitle,
          topic: maybeTopic ?? sess.topic,
          updatedAt: Date.now(),
          messages: nextMsgs,
        };
      }),
    );
  };

  const sendIllustrationRequest = async (
    rawPrompt: string,
    topicOverride?: string,
    sessionOverrideId?: string,
  ) => {
    const trimmed = rawPrompt.trim();
    if (!trimmed || isLoading) return;

    const targetId = sessionOverrideId ?? activeSession.id;
    const activeTopic = topicOverride ?? selectedTopic;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    stopSpeaking();
    setErrorMsg(null);
    setLastFailedAction(null);
    setVoiceNotice(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: `Buat ilustrasi: ${trimmed}`,
    };

    const assistantId = `m-${Date.now() + 1}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantId,
      role: 'model',
      text: '',
    };

    updateSessionMessages(
      targetId,
      (prev) => [...prev, userMsg, placeholderAssistant],
      `Ilustrasi: ${trimmed}`,
      activeTopic,
    );

    setInput('');
    setIsLoading(true);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prompt: trimmed,
          topic: activeTopic,
          style,
        }),
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => ({}))) as {
        title?: string;
        caption?: string;
        svgMarkup?: string;
        error?: string;
      };

      if (!response.ok || !payload.svgMarkup) {
        throw new Error(
          payload.error || 'Ilustrasi budaya belum berhasil dibuat. Coba lagi ya, kaka.',
        );
      }

      const finalCaption = `${payload.title ? `**${payload.title}**\n` : ''}${
        payload.caption || 'Ilustrasi budaya Papua siap dilihat.'
      }`;

      updateSessionMessages(targetId, (prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: finalCaption,
                illustration: {
                  title: payload.title || 'Ilustrasi Budaya Papua',
                  caption: payload.caption || '',
                  svgMarkup: payload.svgMarkup!,
                },
              }
            : m,
        ),
      );

      if (autoSpeakRef.current) {
        speakText(assistantId, finalCaption);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const friendly =
        err instanceof Error
          ? err.message
          : 'Terjadi gangguan jaringan saat membuat ilustrasi.';
      setErrorMsg(friendly);
      setLastFailedAction({text: trimmed, mode: 'image'});
      updateSessionMessages(targetId, (prev) =>
        prev.filter((m) => m.id !== assistantId),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuestion = async (
    rawQuestion: string,
    topicOverride?: string,
    options?: {skipUserAppend?: boolean; customHistory?: ChatMessage[]},
  ) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isLoading) return;

    const targetId = activeSession.id;
    const activeTopic = topicOverride ?? selectedTopic;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    stopSpeaking();
    setErrorMsg(null);
    setLastFailedAction(null);
    setVoiceNotice(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const assistantId = `m-${Date.now() + 1}`;
    const placeholderAssistant: ChatMessage = {
      id: assistantId,
      role: 'model',
      text: '',
    };

    const baseMessages = options?.customHistory ?? messages;
    const historyWindow = fastMode ? 4 : 10;
    const historySource = options?.skipUserAppend
      ? baseMessages
      : [...baseMessages, userMsg];

    const historyForApi = historySource
      .slice(-historyWindow)
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    updateSessionMessages(
      targetId,
      (prev) =>
        options?.skipUserAppend
          ? [...baseMessages, placeholderAssistant]
          : [...prev, userMsg, placeholderAssistant],
      trimmed,
      activeTopic,
    );

    if (!options?.skipUserAppend) {
      setInput('');
    }
    setIsLoading(true);

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: historyForApi,
          style,
          fastMode,
          topic: activeTopic,
          userProfile:
            userProfile?.name || userProfile?.region ? userProfile : undefined,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errPayload = (await response.json().catch(() => ({}))) as {error?: string};
        throw new Error(errPayload.error || 'Gagal menghubungi Sahabat Keluarga Papua AI.');
      }

      if (!response.body) {
        throw new Error('Respons streaming tidak tersedia.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const eventChunk of events) {
          const line = eventChunk.split('\n').find((l) => l.startsWith('data: '));
          if (!line) continue;

          const jsonText = line.slice(6).trim();
          if (!jsonText) continue;

          const parsed = JSON.parse(jsonText) as {
            text?: string;
            done?: boolean;
            error?: string;
          };

          if (parsed.error) {
            throw new Error(parsed.error);
          }

          if (parsed.text) {
            accumulated += parsed.text;
            updateSessionMessages(targetId, (prev) =>
              prev.map((m) => (m.id === assistantId ? {...m, text: accumulated} : m)),
            );
          }
        }
      }

      if (!accumulated.trim()) {
        throw new Error('Jawaban belum diterima. Silakan coba lagi.');
      }

      if (autoSpeakRef.current) {
        speakText(assistantId, accumulated);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const friendly =
        err instanceof Error
          ? err.message
          : 'Terjadi gangguan jaringan. Silakan coba lagi.';
      setErrorMsg(friendly);
      setLastFailedAction({text: trimmed, mode: 'chat'});
      updateSessionMessages(targetId, (prev) =>
        prev.filter((m) => m.id !== assistantId),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (externalPrompt && externalPrompt.nonce !== handledNonceRef.current) {
      handledNonceRef.current = externalPrompt.nonce;
      if (externalPrompt.topic) {
        setSelectedTopic(externalPrompt.topic);
      }
      if (externalPrompt.mode === 'image') {
        setComposerMode('image');
        void sendIllustrationRequest(externalPrompt.text, externalPrompt.topic);
      } else {
        setComposerMode('chat');
        void sendQuestion(externalPrompt.text, externalPrompt.topic);
      }
    }
  }, [externalPrompt]);

  useEffect(() => {
    if (
      openWorkspaceNonce &&
      openWorkspaceNonce !== handledWorkspaceNonceRef.current
    ) {
      handledWorkspaceNonceRef.current = openWorkspaceNonce;
      setIsExpanded(true);
    }
  }, [openWorkspaceNonce]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (composerMode === 'image') {
      void sendIllustrationRequest(input);
    } else {
      void sendQuestion(input);
    }
  };

  const handleNewSession = () => {
    abortControllerRef.current?.abort();
    stopSpeaking();
    setIsLoading(false);
    setErrorMsg(null);
    setLastFailedAction(null);
    setVoiceNotice(null);
    const fresh = createFreshSession(userProfile, selectedTopic);
    setSessions((prev) => [fresh, ...prev].slice(0, 15));
    setActiveSessionId(fresh.id);
    window.setTimeout(() => inputRef.current?.focus(), 60);
  };

  const handleSwitchSession = (session: ChatSession) => {
    if (isLoading) {
      abortControllerRef.current?.abort();
      setIsLoading(false);
    }
    stopSpeaking();
    setErrorMsg(null);
    setLastFailedAction(null);
    setActiveSessionId(session.id);
    setSelectedTopic(session.topic || 'Semua Topik');
  };

  const handleDeleteSession = (sessionId: string) => {
    stopSpeaking();
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const fresh = createFreshSession(userProfile, 'Semua Topik');
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleRegenerate = (msgIndex: number) => {
    if (isLoading) return;
    const precedingSlice = messages.slice(0, msgIndex);
    const lastUser = [...precedingSlice].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;

    if (lastUser.text.startsWith('Buat ilustrasi:')) {
      const promptOnly = lastUser.text.replace(/^Buat ilustrasi:\s*/i, '');
      void sendIllustrationRequest(promptOnly);
      return;
    }

    void sendQuestion(lastUser.text, selectedTopic, {
      skipUserAppend: true,
      customHistory: precedingSlice,
    });
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(stripMarkdownForSpeech(text));
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 1800);
    } catch {
      // Clipboard fallback
    }
  };

  const handleDownloadSvg = (illustration: GeneratedIllustration) => {
    const blob = new Blob([illustration.svgMarkup], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${illustration.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'ilustrasi-papua'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = (illustration: GeneratedIllustration) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FAF8F4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${illustration.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'ilustrasi-papua'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    img.src = svgToDataUrl(illustration.svgMarkup);
  };

  const hasUserMessages = messages.some((m) => m.role === 'user');
  const activeStyleLabel =
    DIALECT_MODES.find((d) => d.id === style)?.label ?? 'Papua Akrab';
  const ActiveTopicIcon = getTopicIcon(selectedTopic);

  const renderMessageList = (compactMode: boolean) => (
    <div className={compactMode ? 'space-y-2.5' : 'mx-auto max-w-3xl space-y-5'}>
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isEmptyStreaming = !isUser && msg.text.length === 0 && !msg.illustration;
        const isWelcome = msg.id === 'welcome-msg';
        const isSpeakingThis = speakingMsgId === msg.id;

        return (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isUser && !compactMode && (
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1D4A27] text-[#F2C22B] shadow-xs">
                <Bot className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </div>
            )}

            <div
              className={`rounded-2xl shadow-xs ${
                compactMode ? 'max-w-[92%] px-3.5 py-2.5 text-[13px]' : 'max-w-[88%] px-4 py-3 text-sm'
              } ${
                isUser
                  ? 'bg-[#1D4A27] text-white'
                  : 'border border-[#E5DFD2] bg-white text-[#16241D]'
              }`}
            >
              {!isUser && !isEmptyStreaming && !isWelcome && (
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#F2EDE3] pb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#5C3D2E]">
                    <Sparkles className="h-3 w-3 text-[#C9A24D]" aria-hidden="true" />
                    <span>Sahabat Keluarga Papua AI</span>
                  </span>

                  <div className="flex items-center gap-1">
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.id, msg.text)}
                        aria-label={isSpeakingThis ? 'Hentikan suara' : 'Dengarkan jawaban'}
                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                          isSpeakingThis
                            ? 'bg-[#1D4A27] text-white'
                            : 'text-[#5E6D64] hover:bg-[#F3F1EC] hover:text-[#1D4A27]'
                        }`}
                      >
                        {isSpeakingThis ? (
                          <>
                            <Square className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                            <span>Hentikan</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" aria-hidden="true" />
                            <span>Dengarkan</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleCopy(msg.id, msg.text)}
                      aria-label="Salin jawaban"
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-[#5E6D64] hover:bg-[#F3F1EC] hover:text-[#1D4A27] cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-[#1D4A27]" aria-hidden="true" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" aria-hidden="true" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    {!compactMode && idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRegenerate(idx)}
                        disabled={isLoading}
                        aria-label="Buat ulang jawaban"
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-[#5E6D64] hover:bg-[#F3F1EC] hover:text-[#1D4A27] disabled:opacity-40 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" aria-hidden="true" />
                        <span>Ulangi</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isEmptyStreaming ? (
                <div className="flex items-center gap-2 text-xs text-[#5E6D64]">
                  <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-[#1D4A27]" />
                  <span>
                    {composerMode === 'image'
                      ? 'Sedang melukis ilustrasi budaya Papua untuk ko...'
                      : 'Sedang menyusun jawaban hangat untuk ko...'}
                  </span>
                </div>
              ) : (
                <>
                  {msg.illustration && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-[#DFD8CA] bg-[#FAF8F4]">
                      <img
                        src={svgToDataUrl(msg.illustration.svgMarkup)}
                        alt={msg.illustration.title}
                        className="w-full h-auto max-h-72 object-contain bg-[#FAF8F4]"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DFD1] bg-white px-3 py-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1D4A27]">
                          <Palette className="h-3.5 w-3.5 text-[#C9A24D]" aria-hidden="true" />
                          <span>{msg.illustration.title}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDownloadPng(msg.illustration!)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#1D4A27] px-2 py-1 text-[10px] font-semibold text-[#1D4A27] transition-colors hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                          >
                            <Download className="h-3 w-3" aria-hidden="true" />
                            <span>PNG</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadSvg(msg.illustration!)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#DFD8CA] bg-[#FAF8F4] px-2 py-1 text-[10px] font-semibold text-[#425249] transition-colors hover:border-[#1D4A27] hover:text-[#1D4A27] cursor-pointer"
                          >
                            <Download className="h-3 w-3" aria-hidden="true" />
                            <span>SVG</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <FormattedMessage text={msg.text} isUser={isUser} />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Quick Starter Cards inside empty conversation */}
      {!hasUserMessages && (
        <div className={compactMode ? 'space-y-1.5 pt-1' : 'pt-2 space-y-5'}>
          {compactMode ? (
            <>
              <div className="space-y-1.5">
                {QUICK_PROMPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void sendQuestion(item.question, item.topic)}
                      className="group flex w-full min-h-[38px] items-center gap-2.5 rounded-xl border border-[#DFD8CA] bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#16241D] shadow-2xs transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${item.accentBg} ${item.accentText} group-hover:bg-white/20 group-hover:text-white transition-colors`}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {EXTRA_PROMPTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void sendQuestion(item.question, item.topic)}
                      className="group flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl border border-[#DFD8CA] bg-white px-2.5 py-1 text-[11px] font-medium text-[#425249] transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                      <Icon
                        className="h-3.5 w-3.5 shrink-0 text-[#1D4A27] group-hover:text-white"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Topik Konsultasi Pilihan
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[...QUICK_PROMPTS, ...EXTRA_PROMPTS].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setComposerMode('chat');
                          void sendQuestion(item.question, item.topic);
                        }}
                        className="group flex items-start gap-3 rounded-2xl border border-[#DFD8CA] bg-white p-3.5 text-left shadow-2xs transition-all hover:border-[#1D4A27] hover:shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.accentBg} ${item.accentText} transition-colors group-hover:bg-[#1D4A27] group-hover:text-[#F2C22B]`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-sm font-bold text-[#16241D] group-hover:text-[#1D4A27]">
                            {item.label}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[#5E6D64]">
                            {item.question}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  <Palette className="h-3.5 w-3.5 text-[#8C3B2B]" aria-hidden="true" />
                  <span>Studio Ilustrasi Budaya AI</span>
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {ILLUSTRATION_STARTERS.map((art) => (
                    <button
                      key={art.label}
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setComposerMode('image');
                        void sendIllustrationRequest(art.prompt);
                      }}
                      className="flex flex-col items-start gap-1 rounded-xl border border-[#DFD8CA] bg-[#FAF4E4] p-3 text-left transition-colors hover:border-[#1D4A27] hover:bg-[#F5E9D3] disabled:opacity-50 cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-[#16241D]">
                        <ImagePlus className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                        <span>{art.label}</span>
                      </span>
                      <span className="line-clamp-2 text-[11px] leading-snug text-[#425249]">
                        {art.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-xl border border-[#D8B4A6] bg-[#FDF6F3] p-3 text-xs text-[#5C3D2E]"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8C3B2B]" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
          {lastFailedAction && (
            <button
              type="button"
              onClick={() => {
                if (lastFailedAction.mode === 'image') {
                  void sendIllustrationRequest(lastFailedAction.text);
                } else {
                  void sendQuestion(lastFailedAction.text);
                }
              }}
              className="self-start rounded-lg bg-[#5C3D2E] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#4A3024] cursor-pointer"
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  const renderComposer = (compactMode: boolean) => (
    <form
      onSubmit={handleSubmit}
      className={`border-t border-[#E5DFD2] bg-[#F3F1EC] ${compactMode ? 'p-3' : 'px-4 py-3.5 sm:px-6'}`}
    >
      <div className={compactMode ? '' : 'mx-auto max-w-3xl'}>
        {/* Live Listening Indicator or Voice Notice */}
        {(isListening || voiceNotice) && (
          <div
            className={`mb-2 flex items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-[11px] ${
              isListening
                ? 'border border-[#1D4A27]/30 bg-[#E6EFE9] text-[#163B22]'
                : 'border border-[#D8B4A6] bg-[#FDF6F3] text-[#5C3D2E]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {isListening ? (
                <>
                  <span className="h-2 w-2 shrink-0 animate-ping rounded-full bg-[#C0392B]" />
                  <span className="truncate font-medium">
                    {interimTranscript
                      ? `Mendengar: "${interimTranscript}"`
                      : 'Mikrofon aktif — silakan bicara dalam bahasa Indonesia...'}
                  </span>
                </>
              ) : (
                <span>{voiceNotice}</span>
              )}
            </div>
            {voiceNotice && !isListening && (
              <button
                type="button"
                onClick={() => setVoiceNotice(null)}
                aria-label="Tutup pemberitahuan suara"
                className="shrink-0 text-[#5C3D2E] hover:text-[#16241D] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Mode Bar above input */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setComposerMode('chat')}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                composerMode === 'chat'
                  ? 'bg-[#1D4A27] text-white'
                  : 'border border-[#DCD6C8] bg-white text-[#425249] hover:border-[#1D4A27]'
              }`}
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Tanya AI</span>
            </button>

            <button
              type="button"
              onClick={() => setComposerMode('image')}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                composerMode === 'image'
                  ? 'bg-[#8C3B2B] text-white'
                  : 'border border-[#DCD6C8] bg-white text-[#425249] hover:border-[#8C3B2B]'
              }`}
            >
              <ImagePlus className="h-3 w-3" aria-hidden="true" />
              <span>Buat Gambar</span>
            </button>
          </div>

          {!compactMode && (
            <div className="flex items-center gap-1.5">
              <ActiveTopicIcon className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
              <label htmlFor="workspace-topic-select" className="sr-only">
                Pilih topik konsultasi
              </label>
              <select
                id="workspace-topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="rounded-full border border-[#DCD6C8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#16241D] focus:border-[#1D4A27] focus:outline-none cursor-pointer"
              >
                {TOPIC_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Input Pill with Voice Mic + Send */}
        <label htmlFor={compactMode ? 'chat-question-input' : 'workspace-question-input'} className="sr-only">
          {composerMode === 'image'
            ? 'Tulis ide ilustrasi budaya Papua'
            : 'Tulis atau ucapkan pertanyaan ko di sini'}
        </label>
        <div
          className={`flex items-center gap-1.5 rounded-full border bg-white pl-3.5 pr-1.5 py-1 shadow-2xs transition-colors ${
            isListening
              ? 'border-[#C0392B] ring-2 ring-[#C0392B]/15'
              : composerMode === 'image'
                ? 'border-[#D5B2A8] focus-within:border-[#8C3B2B]'
                : 'border-[#DCD6C8] focus-within:border-[#1D4A27]'
          }`}
        >
          <input
            ref={inputRef}
            id={compactMode ? 'chat-question-input' : 'workspace-question-input'}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              composerMode === 'image'
                ? 'Gambarkan suasana Papua, contoh: Honai di pagi hari...'
                : 'Tulis atau bicara pertanyaan ko di sini...'
            }
            disabled={isLoading}
            maxLength={1500}
            className="min-h-[40px] w-full bg-transparent text-base sm:text-xs text-[#16241D] placeholder:text-[#748078] focus:outline-none disabled:opacity-60"
          />

          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isLoading}
            aria-label={isListening ? 'Hentikan rekaman suara' : 'Tanya dengan suara'}
            aria-pressed={isListening}
            title={
              recognitionSupported
                ? isListening
                  ? 'Hentikan suara'
                  : 'Bicara untuk bertanya (Voice-to-Text)'
                : 'Browser belum mendukung mikrofon'
            }
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer disabled:opacity-45 ${
              isListening
                ? 'bg-[#C0392B] text-white animate-pulse'
                : 'bg-[#F3F1EC] text-[#1D4A27] hover:bg-[#E3EFE6]'
            }`}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Mic className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            aria-label={composerMode === 'image' ? 'Buat ilustrasi AI' : 'Kirim pertanyaan'}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer ${
              composerMode === 'image'
                ? 'bg-[#8C3B2B] hover:bg-[#732F22]'
                : 'bg-[#1D4A27] hover:bg-[#265D33]'
            }`}
          >
            {composerMode === 'image' ? (
              <Palette className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </form>
  );

  // Expanded ChatGPT-style Full Consultation Studio
  if (isExpanded) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-label="Ruang Konsultasi Lengkap Sahabat Keluarga Papua AI"
      >
        <div className="flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#DFD8CA] bg-[#F5F2EB] shadow-2xl">
          {/* Left ChatGPT-style Conversation History Sidebar */}
          {sidebarOpen && (
            <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-[#DFD8CA] bg-[#14351F] text-white">
              <div className="flex items-center justify-between gap-2 border-b border-white/12 px-4 py-3.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F2C22B] text-[#16241D]">
                    <Bot className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-white">
                      Ruang AI Papua
                    </p>
                    <p className="truncate text-[10px] text-[#CFE5D4]">
                      Suara, Teks &amp; Ilustrasi
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Sembunyikan riwayat obrolan"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="p-3">
                <button
                  type="button"
                  onClick={handleNewSession}
                  className="flex w-full min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#F2C22B] px-3 py-2 text-xs font-bold text-[#16241D] transition-colors hover:bg-[#E0B11F] cursor-pointer"
                >
                  <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                  <span>Obrolan Baru</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2.5 pb-3 space-y-1">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#CFE5D4]/80">
                  Riwayat Konsultasi ({sessions.length})
                </p>
                {sessions.map((sess) => {
                  const isCurrent = sess.id === activeSession.id;
                  const SessIcon = getTopicIcon(sess.topic);
                  return (
                    <div
                      key={sess.id}
                      className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 transition-colors ${
                        isCurrent
                          ? 'bg-white/15 text-white'
                          : 'text-[#DCECE1] hover:bg-white/8'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSwitchSession(sess)}
                        className="flex flex-1 items-center gap-2.5 min-w-0 text-left cursor-pointer py-1"
                      >
                        <SessIcon
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isCurrent ? 'text-[#F2C22B]' : 'text-[#CFE5D4]'
                          }`}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{sess.title}</p>
                          <p className="truncate text-[10px] text-white/60">
                            {sess.topic} · {sess.messages.length} pesan
                          </p>
                        </div>
                      </button>

                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(sess.id)}
                          aria-label={`Hapus obrolan ${sess.title}`}
                          className="opacity-0 group-hover:opacity-100 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/65 hover:bg-white/10 hover:text-[#F2C22B] transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/12 bg-[#102A18] px-3.5 py-3 text-[11px] text-[#DCECE1]">
                <p className="font-semibold text-white">
                  {userProfile?.name ? userProfile.name : 'Keluarga Papua'}
                </p>
                <p className="text-[10px] text-[#CFE5D4]">
                  {userProfile?.region
                    ? `Wilayah Adat: ${userProfile.region}`
                    : 'Mode Dialek: ' + activeStyleLabel}
                </p>
              </div>
            </aside>
          )}

          {/* Main Workspace Area */}
          <div className="flex flex-1 flex-col min-w-0 bg-[#F5F2EB]">
            {/* Workspace Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFD8CA] bg-[#1D4A27] px-4 py-3 text-white">
              <div className="flex items-center gap-2.5 min-w-0">
                {!sidebarOpen && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Tampilkan riwayat obrolan"
                    className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/85 hover:bg-white/15 cursor-pointer"
                  >
                    <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNewSession}
                  aria-label="Obrolan baru"
                  className="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-[#F2C22B] text-[#16241D] cursor-pointer"
                >
                  <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1D4A27]">
                  <ActiveTopicIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-display text-sm sm:text-base font-bold text-white">
                    Sahabat Keluarga Papua AI
                  </p>
                  <p className="truncate text-[11px] text-[#CFE5D4]">
                    {selectedTopic} · Dialek {activeStyleLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (autoSpeak) stopSpeaking();
                      setAutoSpeak((prev) => !prev);
                    }}
                    aria-pressed={autoSpeak}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      autoSpeak
                        ? 'bg-white text-[#1D4A27]'
                        : 'bg-white/12 text-white hover:bg-white/20'
                    }`}
                  >
                    {autoSpeak ? (
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span className="hidden sm:inline">
                      {autoSpeak ? 'Suara Otomatis Aktif' : 'Suara Otomatis'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setFastMode((prev) => !prev)}
                  aria-pressed={fastMode}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                    fastMode
                      ? 'bg-[#F2C22B] text-[#16241D]'
                      : 'bg-white/12 text-white hover:bg-white/20'
                  }`}
                >
                  <Zap className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
                  <span>{fastMode ? 'Respon Kilat' : 'Mode Lengkap'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowOptions((prev) => !prev)}
                  aria-label="Atur gaya dialek"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    showOptions ? 'bg-white/25 text-white' : 'text-white/90 hover:bg-white/15'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Kembali ke beranda"
                  title="Tutup Ruang Kerja"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/12 text-white hover:bg-white/22 cursor-pointer"
                >
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Collapsible Dialect & Preferences Panel */}
            {showOptions && (
              <div className="border-b border-[#DFD8CA] bg-white px-4 py-3">
                <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5C3D2E]">
                      Dialek:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {DIALECT_MODES.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setStyle(mode.id)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                            style === mode.id
                              ? 'bg-[#1D4A27] text-white'
                              : 'bg-[#F3F1EC] text-[#425249] hover:bg-[#E7E3D9]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Session Quick Switcher */}
                  <div className="flex md:hidden items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                    <select
                      aria-label="Pilih riwayat obrolan"
                      value={activeSession.id}
                      onChange={(e) => {
                        const found = sessions.find((s) => s.id === e.target.value);
                        if (found) handleSwitchSession(found);
                      }}
                      className="rounded-lg border border-[#DFD8CA] bg-[#FAF8F4] px-2 py-1 text-xs text-[#16241D]"
                    >
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Main Scrollable Chat Feed */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
              {renderMessageList(false)}
            </div>

            {/* Workspace Composer */}
            {renderComposer(false)}
          </div>
        </div>
      </div>
    );
  }

  // Compact Hero Widget Card
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#DFD8CA]/90 bg-[#F3F1EC] shadow-xl">
      {/* Top Green Chat Header */}
      <div className="bg-[#1D4A27] text-white">
        <div className="flex items-center justify-between gap-2.5 px-4 pt-3.5 pb-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1D4A27] shadow-sm">
              <Bot className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[15px] font-bold leading-snug text-white">
                Sahabat Keluarga Papua AI
              </p>
              <p className="text-[11px] leading-tight text-[#CFE5D4]">
                Konsultan Suara, Teks &amp; Ilustrasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowOptions((prev) => !prev)}
              aria-label="Atur gaya dialek Papua dan suara"
              aria-expanded={showOptions}
              title="Atur dialek & suara"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                showOptions
                  ? 'bg-white/20 text-white'
                  : 'text-[#E6F1E9] hover:bg-white/15'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
            </button>

            {hasUserMessages && (
              <button
                type="button"
                onClick={handleNewSession}
                aria-label="Mulai percakapan baru"
                title="Percakapan baru"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#E6F1E9] hover:bg-white/15 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label="Buka ruang konsultasi lengkap"
              title="Buka Ruang AI Lengkap (Gaya ChatGPT)"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/12 px-2 text-[11px] font-semibold text-white hover:bg-white/22 transition-colors cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.85} aria-hidden="true" />
              <span className="hidden sm:inline">Ruang AI</span>
            </button>
          </div>
        </div>

        {/* Clean Status, Auto-Voice & Fast Response Sub-bar */}
        <div className="flex items-center justify-between gap-2 border-t border-white/12 bg-[#163B22]/75 px-4 py-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 truncate text-[#D9ECE0]">
            <ActiveTopicIcon className="h-3 w-3 shrink-0 text-[#F2C22B]" aria-hidden="true" />
            <span className="truncate">
              <strong className="font-semibold text-white">{activeStyleLabel}</strong>
              {selectedTopic !== 'Semua Topik' ? ` · ${selectedTopic}` : ''}
            </span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {speechSupported && (
              <button
                type="button"
                onClick={() => {
                  if (autoSpeak) stopSpeaking();
                  setAutoSpeak((prev) => !prev);
                }}
                aria-pressed={autoSpeak}
                title="Bacakan jawaban AI secara otomatis"
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                  autoSpeak
                    ? 'bg-white text-[#1D4A27]'
                    : 'bg-white/12 text-[#E6F1E9] hover:bg-white/20'
                }`}
              >
                {autoSpeak ? (
                  <Volume2 className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3 w-3" aria-hidden="true" />
                )}
                <span>Suara</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setFastMode((prev) => !prev)}
              aria-pressed={fastMode}
              aria-label={fastMode ? 'Matikan mode Fast Response' : 'Aktifkan mode Fast Response'}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                fastMode
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'bg-white/12 text-[#E6F1E9] hover:bg-white/20'
              }`}
            >
              <Zap className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
              <span>{fastMode ? 'Respon Kilat' : 'Mode Lengkap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Dialect, Voice & Fast Response Controls */}
      {showOptions && (
        <div className="space-y-3 border-b border-[#E2DCCF] bg-white px-3.5 py-3">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#5C3D2E]">
              Pilih Gaya Dialek Bahasa
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {DIALECT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setStyle(mode.id)}
                  className={`min-h-[34px] rounded-lg px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    style === mode.id
                      ? 'bg-[#1D4A27] text-white'
                      : 'bg-[#F3F1EC] text-[#425249] hover:bg-[#E7E3D9]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#EFEAE0] pt-2.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#16241D]">Fast Response Mode</p>
              <p className="text-[11px] text-[#5E6D64]">
                Jawaban kilat latensi rendah &amp; tetap ramah dialek Papua.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={fastMode}
              onClick={() => setFastMode((prev) => !prev)}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                fastMode ? 'bg-[#1D4A27]' : 'bg-[#D2CCBE]'
              }`}
            >
              <span className="sr-only">Aktifkan Fast Response Mode</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                  fastMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        className="max-h-[260px] min-h-[215px] overflow-y-auto px-3.5 py-3.5"
        aria-live="polite"
      >
        {renderMessageList(true)}
      </div>

      {/* Input Pill Bar */}
      {renderComposer(true)}
    </div>
  );
}
