import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {
  AlertCircle,
  Bot,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  SlidersHorizontal,
} from 'lucide-react';

export type DialectStyle = 'papua_akrab' | 'campuran' | 'formal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface UserProfile {
  name: string;
  region: string;
}

export const QUICK_PROMPTS = [
  {label: 'Perkawinan Adat', question: 'Bagaimana mempersiapkan perkawinan adat?'},
  {label: 'Pendidikan Anak', question: 'Bagaimana mendidik anak Papua?'},
  {label: 'Keluarga Harmonis', question: 'Bagaimana membangun keluarga harmonis?'},
  {label: 'Budaya Papua', question: 'Bagaimana menjaga budaya Papua di rumah?'},
];

const EXTRA_PROMPTS = [
  {label: 'Beda Suku', question: 'Bagaimana menikah dengan pasangan beda suku?'},
  {label: 'Ekonomi Keluarga', question: 'Bagaimana mengatur keuangan keluarga dan menabung di Papua?'},
];

const DIALECT_MODES: {id: DialectStyle; label: string}[] = [
  {id: 'papua_akrab', label: 'Papua Akrab'},
  {id: 'campuran', label: 'Campuran'},
  {id: 'formal', label: 'Baku'},
];

function createInitialGreeting(profile?: UserProfile): ChatMessage {
  const sapa = profile?.name ? `Halo, ${profile.name}!` : 'Halo, kaka!';
  return {
    id: 'welcome-msg',
    role: 'model',
    text: `${sapa} Ada yang ko mau konsultasi? Mari kita bicara tentang keluarga, adat, atau budaya Papua.`,
  };
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
  externalPrompt: {text: string; topic?: string; nonce: number} | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  userProfile?: UserProfile;
}

export function ChatAssistant({externalPrompt, inputRef, userProfile}: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createInitialGreeting(userProfile),
  ]);
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<DialectStyle>('papua_akrab');
  const [selectedTopic, setSelectedTopic] = useState<string>('Semua Topik');
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const handledNonceRef = useRef<number>(0);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [createInitialGreeting(userProfile)];
      }
      return prev;
    });
  }, [userProfile?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const sendQuestion = async (rawQuestion: string, topicOverride?: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isLoading) return;

    const activeTopic = topicOverride ?? selectedTopic;
    setErrorMsg(null);
    setLastFailedText(null);

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

    const historyForApi = [...messages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg, placeholderAssistant]);
    setInput('');
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
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? {...m, text: accumulated} : m)),
            );
          }
        }
      }

      if (!accumulated.trim()) {
        throw new Error('Jawaban belum diterima. Silakan coba lagi.');
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const friendly =
        err instanceof Error
          ? err.message
          : 'Terjadi gangguan jaringan. Silakan coba lagi.';
      setErrorMsg(friendly);
      setLastFailedText(trimmed);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
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
      void sendQuestion(externalPrompt.text, externalPrompt.topic);
    }
  }, [externalPrompt]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  const handleReset = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setErrorMsg(null);
    setLastFailedText(null);
    setMessages([createInitialGreeting(userProfile)]);
    inputRef.current?.focus();
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 1800);
    } catch {
      // Clipboard fallback
    }
  };

  const hasUserMessages = messages.some((m) => m.role === 'user');
  const activeStyleLabel = DIALECT_MODES.find((d) => d.id === style)?.label ?? 'Papua Akrab';

  const cardContent = (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-[#DFD8CA]/90 bg-[#F3F1EC] shadow-xl ${
        isExpanded ? 'h-[82vh] w-full max-w-2xl' : 'w-full'
      }`}
    >
      {/* Top Green Chat Header */}
      <div className="flex items-center justify-between gap-2 bg-[#1D4A27] px-4 py-3 text-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1D4A27] shadow-sm">
            <Bot className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold leading-tight text-white">
              Sahabat Keluarga Papua AI
            </p>
            <p className="truncate text-[11px] text-[#CFE5D4]">
              Gaya: {activeStyleLabel}
              {selectedTopic !== 'Semua Topik' ? ` · ${selectedTopic}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowOptions((prev) => !prev)}
            aria-label="Atur gaya dialek Papua"
            aria-expanded={showOptions}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#E6F1E9] hover:bg-white/15 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
          </button>

          {hasUserMessages && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Mulai percakapan baru"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#E6F1E9] hover:bg-white/15 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? 'Perkecil jendela chat' : 'Perbesar jendela chat'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#E6F1E9] hover:bg-white/15 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" strokeWidth={1.85} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Dialect & Topic Controls */}
      {showOptions && (
        <div className="border-b border-[#E2DCCF] bg-white px-3.5 py-2.5">
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
      )}

      {/* Messages Area */}
      <div
        className={`overflow-y-auto px-3.5 py-3.5 space-y-2.5 ${
          isExpanded ? 'flex-1' : 'max-h-[260px] min-h-[215px]'
        }`}
        aria-live="polite"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isEmptyStreaming = !isUser && msg.text.length === 0;
          const isWelcome = msg.id === 'welcome-msg';

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-xs ${
                  isUser
                    ? 'bg-[#1D4A27] text-white'
                    : 'bg-white text-[#16241D] border border-[#E5DFD2]'
                }`}
              >
                {!isUser && !isEmptyStreaming && !isWelcome && (
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#5C3D2E]">
                      Sahabat Keluarga Papua AI
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopy(msg.id, msg.text)}
                      aria-label="Salin jawaban"
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-[#5E6D64] hover:bg-[#F3F1EC] hover:text-[#1D4A27] cursor-pointer"
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
                  </div>
                )}

                {isEmptyStreaming ? (
                  <p className="text-xs text-[#5E6D64]">
                    Sedang menyusun jawaban hangat untuk ko...
                  </p>
                ) : (
                  <FormattedMessage text={msg.text} isUser={isUser} />
                )}
              </div>
            </div>
          );
        })}

        {/* Quick Topic Buttons Inside Chat Like Mockup */}
        {!hasUserMessages && (
          <div className="space-y-1.5 pt-1">
            {QUICK_PROMPTS.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={isLoading}
                onClick={() => void sendQuestion(item.question, item.label)}
                className="w-full min-h-[38px] rounded-full border border-[#DFD8CA] bg-white px-4 py-1.5 text-center text-xs font-medium text-[#16241D] shadow-2xs transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white disabled:opacity-50 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-1.5">
              {EXTRA_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void sendQuestion(item.question)}
                  className="min-h-[36px] rounded-full border border-[#DFD8CA] bg-white px-3 py-1 text-center text-[11px] font-medium text-[#425249] transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white disabled:opacity-50 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
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
            {lastFailedText && (
              <button
                type="button"
                onClick={() => void sendQuestion(lastFailedText)}
                className="self-start rounded-lg bg-[#5C3D2E] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#4A3024] cursor-pointer"
              >
                Coba Lagi
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Pill Bar */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[#E5DFD2] bg-[#F3F1EC] p-3"
      >
        <label htmlFor="chat-question-input" className="sr-only">
          Tulis pertanyaan ko di sini
        </label>
        <div className="flex items-center gap-2 rounded-full border border-[#DCD6C8] bg-white pl-4 pr-1.5 py-1 shadow-2xs focus-within:border-[#1D4A27]">
          <input
            ref={inputRef}
            id="chat-question-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaan ko di sini..."
            disabled={isLoading}
            maxLength={1500}
            className="min-h-[40px] w-full bg-transparent text-base sm:text-xs text-[#16241D] placeholder:text-[#748078] focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            aria-label="Kirim pertanyaan"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D4A27] text-white transition-colors hover:bg-[#265D33] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );

  if (isExpanded) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-label="Konsultasi Sahabat Keluarga Papua AI"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
