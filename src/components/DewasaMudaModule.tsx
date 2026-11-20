import {useEffect, useMemo, useState} from 'react';
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  Feather,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Lightbulb,
  MessageSquareText,
  Search,
  Shield,
  Smile,
  Sparkles,
  Store,
  Target,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react';
import {
  BAB07_AGE_MAP,
  BAB07_AI_CARDS,
  BAB07_LESSONS,
  BAB07_SUBMENUS,
  type Bab07AgeBand,
  type Bab07AICard,
  type Bab07Category,
  type Bab07SubmenuItem,
} from '../data/bab07DewasaMudaData';
import {DewasaMudaTools, type DewasaMudaToolId} from './DewasaMudaTools';

export interface DewasaMudaModuleProps {
  activeAgeBand: Bab07AgeBand['id'];
  onChangeAgeBand: (band: Bab07AgeBand['id']) => void;
  activeCategoryFilter: Bab07Category | 'Semua';
  onChangeCategoryFilter: (cat: Bab07Category | 'Semua') => void;
  activeTool: DewasaMudaToolId;
  onChangeTool: (tool: DewasaMudaToolId) => void;
  onAskAI: (promptText: string, topic?: string) => void;
  onReadBab07: () => void;
  onDownloadBab07: () => void;
  onDownloadOfflineHtml: () => void;
}

const LESSON_CATEGORIES: (Bab07Category | 'Semua')[] = [
  'Semua',
  'Kemandirian & Parenting',
  'Karier & Dunia Kerja',
  'Ekonomi & UMKM Papua',
  'Perkawinan & Keluarga',
];

const REFLECTION_STORAGE_KEY = 'uguwo_bab07_reflections_v1';

function renderCardIcon(iconName: Bab07AICard['iconName']) {
  switch (iconName) {
    case 'briefcase':
      return Briefcase;
    case 'graduation':
      return GraduationCap;
    case 'wallet':
      return Wallet;
    case 'store':
      return Store;
    case 'heart':
      return Heart;
    case 'home':
      return Home;
    case 'utensils':
      return Utensils;
    case 'smile':
      return Smile;
    case 'users':
      return Users;
    case 'compass':
      return Compass;
    case 'shield':
      return Shield;
    case 'feather':
      return Feather;
  }
}

export function DewasaMudaModule({
  activeAgeBand,
  onChangeAgeBand,
  activeCategoryFilter,
  onChangeCategoryFilter,
  activeTool,
  onChangeTool,
  onAskAI,
  onReadBab07,
  onDownloadBab07,
  onDownloadOfflineHtml,
}: DewasaMudaModuleProps) {
  const [lessonSearch, setLessonSearch] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(BAB07_LESSONS[0].id);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [reflections, setReflections] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(REFLECTION_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Record<string, string>;
    } catch {
      // Ignore storage error
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(REFLECTION_STORAGE_KEY, JSON.stringify(reflections));
    } catch {
      // Ignore storage error
    }
  }, [reflections]);

  const filteredLessons = useMemo(() => {
    const q = lessonSearch.trim().toLowerCase();
    return BAB07_LESSONS.filter((lesson) => {
      const matchCat =
        activeCategoryFilter === 'Semua' || lesson.category === activeCategoryFilter;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.summary.toLowerCase().includes(q) ||
        lesson.number.toLowerCase().includes(q) ||
        lesson.category.toLowerCase().includes(q)
      );
    });
  }, [activeCategoryFilter, lessonSearch]);

  useEffect(() => {
    if (
      filteredLessons.length > 0 &&
      !filteredLessons.some((l) => l.id === selectedLessonId)
    ) {
      setSelectedLessonId(filteredLessons[0].id);
    }
  }, [filteredLessons, selectedLessonId]);

  const activeLesson =
    filteredLessons.find((l) => l.id === selectedLessonId) ??
    filteredLessons[0] ??
    BAB07_LESSONS[0];

  const activeLessonIdx = filteredLessons.findIndex((l) => l.id === activeLesson.id);
  const currentAgeBand =
    BAB07_AGE_MAP.find((b) => b.id === activeAgeBand) ?? BAB07_AGE_MAP[0];

  const triggerDownloadNotice = (label: string) => {
    setDownloadStatus(label);
    window.setTimeout(() => {
      setDownloadStatus((curr) => (curr === label ? null : curr));
    }, 3200);
  };

  const handleSubmenuAction = (item: Bab07SubmenuItem) => {
    if (item.targetType === 'age') {
      onChangeAgeBand(item.targetValue as Bab07AgeBand['id']);
      document
        .getElementById('bab07-peta-usia')
        ?.scrollIntoView({behavior: 'smooth', block: 'start'});
    } else if (item.targetType === 'category') {
      onChangeCategoryFilter(item.targetValue as Bab07Category);
      document
        .getElementById('bab07-materi')
        ?.scrollIntoView({behavior: 'smooth', block: 'start'});
    } else if (item.targetType === 'tool') {
      onChangeTool(item.targetValue as DewasaMudaToolId);
      document
        .getElementById('bab07-kalkulator')
        ?.scrollIntoView({behavior: 'smooth', block: 'start'});
    } else {
      document
        .getElementById('bab07-ai-cards')
        ?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <section
      id="bab-07-dewasa-muda"
      aria-labelledby="bab07-heading"
      className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12 space-y-6"
    >
      {/* 1. Showcase Banner Bab 07 + Integrasi PDF */}
      <div className="overflow-hidden rounded-2xl border border-[#DFD8CA] bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="flex flex-col justify-between bg-[#163B22] p-6 sm:p-8 text-white lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C22B] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16241D]">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>BAB 07 · Modul Lengkap 18+</span>
                </span>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#DCECE1]">
                  20 Materi · 4 Peta Usia · 12 Kartu AI · 8 Kalkulator
                </span>
              </div>

              <h2
                id="bab07-heading"
                className="mt-4 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-white"
              >
                BAB 07 — DEWASA MUDA PAPUA: MANDIRI SECARA EKONOMI, SIAP BEKERJA DAN MEMBANGUN KELUARGA
              </h2>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DCECE1]">
                Panduan nyata untuk orang tua dan generasi 18+ di 7 wilayah adat Papua dalam menyiapkan
                kemandirian finansial, karier dan kewirausahaan pangan lokal, kematangan emosi, hingga
                musyawarah rumah tangga yang bijak dan bermartabat.
              </p>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/15 pt-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onReadBab07}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#F2C22B] px-5 py-2 text-xs sm:text-sm font-bold text-[#16241D] transition-colors hover:bg-[#E0B11F] cursor-pointer"
                >
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Baca Bab 07</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDownloadBab07();
                    triggerDownloadNotice('Bab 07 Dewasa Muda 18+ (.PDF) berhasil diunduh!');
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#F2C22B] bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                  <span>Unduh Bab 07</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDownloadOfflineHtml();
                    triggerDownloadNotice('E-Book Offline Lengkap 7 Bab (.HTML) berhasil diunduh!');
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/30 bg-[#12301B] px-4 py-2 text-xs font-semibold text-[#DCECE1] transition-colors hover:border-white cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                  <span>Unduh E-book Offline</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAskAI(
                      'Saya ingin konsultasi tentang Bab 07 Dewasa Muda Papua 18+: kemandirian ekonomi, dunia kerja, atau kesiapan membangun keluarga sesuai nilai adat Papua.',
                      'Dewasa Muda Papua 18+',
                    )
                  }
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#163B22] transition-colors hover:bg-[#FAF4E4] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#C9A24D]" aria-hidden="true" />
                  <span>Tanya Sahabat AI Tentang Bab Ini</span>
                </button>
              </div>

              {downloadStatus && (
                <div
                  role="status"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#F2C22B]/50 bg-[#12301B] px-3.5 py-2 text-xs font-semibold text-[#F2C22B]"
                >
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{downloadStatus}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Realistic Papuan Photography Collage */}
          <div className="grid grid-cols-2 gap-2 bg-[#FAF8F4] p-3 lg:col-span-5 lg:grid-cols-1 lg:grid-rows-2">
            <div className="relative overflow-hidden rounded-xl border border-[#E2DCCF]">
              <img
                src="/src/assets/images/parenting_papua_family_1795005760301.jpg"
                alt="Kebersamaan keluarga Papua saling mendengar dan membimbing generasi muda"
                className="h-44 sm:h-52 lg:h-full w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent px-3 py-2.5">
                <p className="text-[11px] font-bold text-[#F2C22B]">Kemitraan Orang Tua &amp; Usia 18+</p>
                <p className="text-[10px] text-white/90">Baku dengar, musyawarah &amp; percaya pada anak dewasa</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-[#E2DCCF]">
              <img
                src="/src/assets/images/culture_papua_ceremony_1794999641793.jpg"
                alt="Masyarakat Papua tersenyum dalam busana adat menjaga persaudaraan di Tanah Papua"
                className="h-44 sm:h-52 lg:h-full w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent px-3 py-2.5">
                <p className="text-[11px] font-bold text-[#F2C22B]">Menghormati 7 Wilayah Adat</p>
                <p className="text-[10px] text-white/90">Kemandirian modern tetap berakar pada martabat budaya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submenu Ribbon: PARENTING DEWASA MUDA 18+ */}
        <div className="border-t border-[#EFEAE0] bg-[#FAF8F4] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5C3D2E]">
              PARENTING DEWASA MUDA 18+:
            </span>
            {BAB07_SUBMENUS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSubmenuAction(item)}
                className="min-h-[34px] rounded-full border border-[#DFD8CA] bg-white px-3 py-1 text-xs font-semibold text-[#16241D] transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. BAGIAN B: Peta Usia Dewasa Muda (4 Kategori) */}
      <div
        id="bab07-peta-usia"
        className="rounded-2xl border border-[#DFD8CA] bg-white p-5 sm:p-7 shadow-xs"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C3D2E]">
              Bagian B · Peta Perkembangan Usia 18+
            </span>
            <h3 className="mt-0.5 font-display text-lg sm:text-xl font-bold text-[#16241D]">
              Peta Usia Dewasa Muda Papua (Tanpa Pemaksaan Status)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#425249]">
              Pilih kelompok usia untuk melihat tujuan perkembangan, keterampilan prioritas, tantangan umum, dan panduan praktis.
            </p>
          </div>
        </div>

        {/* 4 Age Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BAB07_AGE_MAP.map((band) => {
            const isSelected = band.id === activeAgeBand;
            return (
              <button
                key={band.id}
                type="button"
                onClick={() => onChangeAgeBand(band.id)}
                className={`rounded-xl border px-3.5 py-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#1D4A27] bg-[#1D4A27] text-white shadow-xs'
                    : 'border-[#E2DCCF] bg-[#FAF8F4] text-[#16241D] hover:border-[#1D4A27]/50'
                }`}
              >
                <p
                  className={`text-[11px] font-bold uppercase tracking-wide ${
                    isSelected ? 'text-[#F2C22B]' : 'text-[#5C3D2E]'
                  }`}
                >
                  {band.label}
                </p>
                <p className="mt-0.5 font-display text-xs sm:text-sm font-bold">
                  {band.shortTitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Age Detail Panel */}
        <div className="mt-5 rounded-2xl border border-[#E2DCCF] bg-[#FAF8F4] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF4E4] px-3 py-0.5 text-[11px] font-bold text-[#5C3D2E]">
                <Target className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                <span>{currentAgeBand.label} · {currentAgeBand.shortTitle}</span>
              </span>
              <h4 className="mt-2 font-display text-base sm:text-lg font-bold text-[#16241D]">
                {currentAgeBand.tagline}
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#25352C]">
                <strong className="text-[#1D4A27]">Tujuan Utama: </strong>
                {currentAgeBand.goal}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAskAI(currentAgeBand.aiPrompt, `Panduan ${currentAgeBand.label}`)}
              className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] cursor-pointer self-start"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
              <span>Tanya AI Usia Ini</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#E5DFD2] bg-white p-4">
              <p className="font-display text-xs font-bold uppercase tracking-wide text-[#1D4A27]">
                Keterampilan Prioritas
              </p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#25352C]">
                {currentAgeBand.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1D4A27]"
                      aria-hidden="true"
                    />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#E5DFD2] bg-white p-4">
              <p className="font-display text-xs font-bold uppercase tracking-wide text-[#8C3B2B]">
                Tantangan yang Sering Muncul
              </p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#25352C]">
                {currentAgeBand.challenges.map((challenge) => (
                  <li key={challenge} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C3B2B]"
                      aria-hidden="true"
                    />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#E5DFD2] bg-white p-4">
              <p className="font-display text-xs font-bold uppercase tracking-wide text-[#5C3D2E]">
                Panduan Orang Tua &amp; Diri Sendiri
              </p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#25352C]">
                {currentAgeBand.guidance.map((guide) => (
                  <li key={guide} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A24D]"
                      aria-hidden="true"
                    />
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#E6DFD1] bg-[#FAF4E4] px-4 py-3 text-xs leading-relaxed text-[#425249]">
            <strong className="text-[#5C3D2E]">Prinsip Penghormatan Martabat: </strong>
            Rentang usia di atas adalah peta pendampingan potensi diri dan kemandirian ekonomi —
            <strong> bukan kewajiban atau pemaksaan untuk menikah maupun memiliki anak pada usia tertentu.</strong>{' '}
            Keputusan menikah dan berkeluarga diambil secara bebas, dewasa, dan bertanggung jawab oleh pribadi yang siap.
          </div>
        </div>
      </div>

      {/* 3. BAGIAN A: 20 Materi Edukasi Mendalam & Evaluasi */}
      <div
        id="bab07-materi"
        className="rounded-2xl border border-[#DFD8CA] bg-white p-5 sm:p-7 shadow-xs"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C3D2E]">
              Bagian A · Kurikulum 20 Unit Pembelajaran
            </span>
            <h3 className="mt-0.5 font-display text-lg sm:text-xl font-bold text-[#16241D]">
              20 Materi Mendalam Parenting &amp; Kemandirian Dewasa Muda (18+)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#425249]">
              Setiap unit dilengkapi penjelasan, contoh kasus nyata di Tanah Papua, tips praktis, langkah penerapan, dan evaluasi diri.
            </p>
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6D64]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={lessonSearch}
              onChange={(e) => setLessonSearch(e.target.value)}
              placeholder="Cari unit materi (mis. CV, mas kawin, sagu)..."
              aria-label="Cari di 20 materi Bab 07"
              className="h-10 w-full rounded-xl border border-[#DFD8CA] bg-[#FAF8F4] pl-9 pr-3 text-xs text-[#16241D] focus:border-[#1D4A27] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {LESSON_CATEGORIES.map((cat) => {
            const isActive = activeCategoryFilter === cat;
            const count =
              cat === 'Semua'
                ? BAB07_LESSONS.length
                : BAB07_LESSONS.filter((l) => l.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChangeCategoryFilter(cat)}
                className={`min-h-[34px] rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                    : 'border-[#E2DCCF] bg-[#FAF8F4] text-[#425249] hover:border-[#1D4A27]/50 hover:text-[#16241D]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Master-Detail Reader for All 20 Units */}
        {filteredLessons.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-[#DFD8CA] bg-[#FAF8F4] p-6 text-center text-xs text-[#5E6D64]">
            Tidak ditemukan materi yang cocok dengan kata kunci &ldquo;{lessonSearch}&rdquo;.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left Lesson Selector List */}
            <div className="lg:col-span-4">
              <div className="max-h-[540px] space-y-1.5 overflow-y-auto pr-1">
                {filteredLessons.map((lesson) => {
                  const isActive = lesson.id === activeLesson.id;
                  const hasReflection = Boolean(reflections[lesson.id]?.trim());
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                          : 'border-[#EAE4D8] bg-[#FAF8F4] text-[#16241D] hover:border-[#1D4A27]/40 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                          isActive
                            ? 'bg-[#F2C22B] text-[#16241D]'
                            : 'bg-white text-[#1D4A27] border border-[#E2DCCF]'
                        }`}
                      >
                        {lesson.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xs font-bold leading-snug">
                          {lesson.title}
                        </p>
                        <p
                          className={`mt-0.5 text-[10px] ${
                            isActive ? 'text-[#DCECE1]' : 'text-[#5C3D2E]'
                          }`}
                        >
                          {lesson.category}
                          {hasReflection ? ' · Tercatat' : ''}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Active Unit Detail */}
            <div className="rounded-2xl border border-[#E2DCCF] bg-[#FAF8F4] p-5 sm:p-6 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DFD2] pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF4E4] px-2.5 py-0.5 text-[11px] font-bold text-[#5C3D2E]">
                    <BookOpen className="h-3 w-3 text-[#1D4A27]" aria-hidden="true" />
                    <span>
                      Unit {activeLesson.number} · {activeLesson.category}
                    </span>
                  </span>
                  <h4 className="mt-1.5 font-display text-lg sm:text-xl font-bold text-[#16241D]">
                    {activeLesson.title}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#425249]">
                    {activeLesson.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={activeLessonIdx <= 0}
                    onClick={() =>
                      activeLessonIdx > 0 &&
                      setSelectedLessonId(filteredLessons[activeLessonIdx - 1].id)
                    }
                    aria-label="Unit sebelumnya"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#DFD8CA] bg-white text-[#16241D] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={activeLessonIdx >= filteredLessons.length - 1}
                    onClick={() =>
                      activeLessonIdx < filteredLessons.length - 1 &&
                      setSelectedLessonId(filteredLessons[activeLessonIdx + 1].id)
                    }
                    aria-label="Unit berikutnya"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#DFD8CA] bg-white text-[#16241D] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Explanation Paragraphs */}
              <div className="mt-4 space-y-3 text-xs sm:text-sm leading-relaxed text-[#25352C]">
                {activeLesson.explanation.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Case Example */}
              <div className="mt-4 rounded-xl border border-[#DCE5DC] bg-white p-4">
                <p className="font-display text-xs font-bold uppercase tracking-wide text-[#1D4A27]">
                  Contoh Kasus Nyata di Tanah Papua
                </p>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#25352C]">
                  {activeLesson.caseExample}
                </p>
              </div>

              {/* Practical Tips & Action Steps */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E5DFD2] bg-white p-4">
                  <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-[#5C3D2E]">
                    <Lightbulb className="h-3.5 w-3.5 text-[#C9A24D]" aria-hidden="true" />
                    <span>Tips Praktis</span>
                  </p>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-[#25352C]">
                    {activeLesson.practicalTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A24D]"
                          aria-hidden="true"
                        />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[#E5DFD2] bg-white p-4">
                  <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-[#1D4A27]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                    <span>Langkah Penerapan</span>
                  </p>
                  <ol className="mt-2 space-y-2 text-xs leading-relaxed text-[#25352C]">
                    {activeLesson.actionSteps.map((step, idx) => (
                      <li key={step} className="flex items-start gap-2">
                        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E3EFE6] text-[10px] font-bold text-[#1D4A27]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Self Evaluation + Saved Reflection */}
              <div className="mt-4 rounded-xl border border-[#E6DFD1] bg-[#FAF4E4] p-4 space-y-2.5">
                <p className="font-display text-xs font-bold uppercase tracking-wide text-[#5C3D2E]">
                  Evaluasi &amp; Latihan Pembelajaran Mandiri
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#16241D]">
                  {activeLesson.evaluationQuestion}
                </p>
                <textarea
                  rows={2}
                  value={reflections[activeLesson.id] ?? ''}
                  onChange={(e) =>
                    setReflections((prev) => ({
                      ...prev,
                      [activeLesson.id]: e.target.value,
                    }))
                  }
                  placeholder="Tulis catatan refleksi pribadi Anda di sini (tersimpan lokal di perangkat Anda)..."
                  aria-label={`Catatan evaluasi unit ${activeLesson.number}`}
                  className="w-full rounded-xl border border-[#DFD8CA] bg-white px-3 py-2 text-xs text-[#16241D] focus:border-[#1D4A27] focus:outline-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-[#5E6D64]">
                    Tersimpan otomatis hanya di browser perangkat Anda.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const userNote = reflections[activeLesson.id]?.trim();
                      const combinedPrompt = userNote
                        ? `${activeLesson.aiPrompt}\n\nCatatan refleksi saya: "${userNote}"`
                        : activeLesson.aiPrompt;
                      onAskAI(combinedPrompt, activeLesson.aiTopic);
                    }}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#1D4A27] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                    <span>Diskusikan Unit Ini dengan Sahabat AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BAGIAN C: 12 Kartu Interaktif Sahabat AI */}
      <div
        id="bab07-ai-cards"
        className="rounded-2xl border border-[#DFD8CA] bg-white p-5 sm:p-7 shadow-xs"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C3D2E]">
              Bagian C · 12 Kartu Konsultasi Fungsional
            </span>
            <h3 className="mt-0.5 font-display text-lg sm:text-xl font-bold text-[#16241D]">
              Tanya Sahabat AI — 12 Topik Dewasa Muda Papua (18+)
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#425249]">
              Klik kartu mana saja untuk langsung membuka Sahabat Keluarga Papua AI dengan topik dan konteks pertanyaan yang tepat.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BAB07_AI_CARDS.map((card) => {
            const Icon = renderCardIcon(card.iconName);
            return (
              <div
                key={card.id}
                className={`group flex flex-col justify-between rounded-2xl border ${card.borderAccent} bg-[#FAF8F4] p-4 transition-all hover:border-[#1D4A27] hover:bg-white hover:shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.accentBg} ${card.accentText} transition-colors group-hover:bg-[#1D4A27] group-hover:text-[#F2C22B]`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.85} aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-[#E5DFD2] bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#5C3D2E]">
                      {card.topic}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-sm sm:text-base font-bold text-[#16241D] group-hover:text-[#1D4A27]">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#425249]">
                    {card.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAskAI(card.aiPrompt, card.topic)}
                  className="mt-4 inline-flex min-h-[38px] w-full items-center justify-between gap-2 rounded-xl border border-[#1D4A27]/25 bg-white px-3 py-2 text-xs font-semibold text-[#1D4A27] transition-colors hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Tanya Sahabat AI</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-[#5E6D64]">
          Privasi &amp; Etika: Jangan memasukkan NIK, nomor rekening, atau data sensitif pribadi ke dalam kolom chat AI. Panduan menghormati keberagaman adat di 7 wilayah Papua dan tidak menjanjikan jaminan pekerjaan maupun keuntungan usaha instan.
        </p>
      </div>

      {/* 5. BAGIAN D: 8 Kalkulator & Generator Nyata */}
      <DewasaMudaTools
        activeTool={activeTool}
        onSelectTool={onChangeTool}
        onAskAI={onAskAI}
      />
    </section>
  );
}
