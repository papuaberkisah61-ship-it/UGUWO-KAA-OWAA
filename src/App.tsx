import {useEffect, useRef, useState, type FormEvent} from 'react';
import {
  ArrowRight,
  BookOpen,
  Feather,
  HeartHandshake,
  Home,
  Info,
  MapPin,
  Menu,
  MessageCircle,
  User,
  Users,
  X,
} from 'lucide-react';
import {ChatAssistant, type UserProfile} from './components/ChatAssistant';
import {
  HonaiCardIcon,
  PapuaCarvingCorner,
  PapuaFamilyCrest,
} from './components/PapuaMotif';

type HubCategoryId =
  | 'perkawinan'
  | 'pendidikan'
  | 'budaya'
  | 'artikel'
  | 'cerita'
  | 'direktori';

const HERO_IMAGE_URL = '/src/assets/images/hero_papua_family_1794999656025.jpg';
const GALLERY_IMAGES = [
  {
    src: '/src/assets/images/culture_honai_house_1794999641110.jpg',
    alt: 'Rumah adat Honai Papua di lembah pegunungan hijau',
    caption: 'Honai & Rumah Keluarga',
  },
  {
    src: '/src/assets/images/culture_papua_ceremony_1794999641793.jpg',
    alt: 'Masyarakat Papua mengenakan busana adat tradisional penuh senyum',
    caption: 'Adat & Kebersamaan',
  },
  {
    src: '/src/assets/images/culture_papua_coast_1794999641973.jpg',
    alt: 'Perahu tradisional Papua di perairan jernih pesisir kepulauan Papua',
    caption: 'Pesisir & Warisan Alam',
  },
];

const FEATURE_CARDS: {
  id: HubCategoryId;
  title: string;
  subtitle: string;
  topic: string;
  defaultPrompt: string;
}[] = [
  {
    id: 'perkawinan',
    title: 'Perkawinan & Keluarga',
    subtitle: 'Adat, agama & mas kawin bijak',
    topic: 'Perkawinan Adat',
    defaultPrompt: 'Bagaimana mempersiapkan perkawinan adat dan pemberkatan agama yang harmonis?',
  },
  {
    id: 'pendidikan',
    title: 'Pendidikan Anak',
    subtitle: 'Karakter, iman & masa depan',
    topic: 'Pendidikan Anak',
    defaultPrompt: 'Bagaimana mendidik anak Papua agar cerdas, beriman, dan bangga akan budayanya?',
  },
  {
    id: 'budaya',
    title: 'Budaya Papua',
    subtitle: 'Dialek, bahasa & tutur hormat',
    topic: 'Bahasa & Budaya',
    defaultPrompt: 'Bagaimana menjaga bahasa daerah dan budaya Papua tetap hidup di rumah?',
  },
  {
    id: 'artikel',
    title: 'Artikel & Edukasi',
    subtitle: 'Panduan praktis rumah tangga',
    topic: 'Keluarga Modern',
    defaultPrompt: 'Bagaimana membangun ekonomi keluarga Papua yang sehat dan transparan?',
  },
  {
    id: 'cerita',
    title: 'Ruang Cerita',
    subtitle: 'Berbagi kisah bersama Sahabat AI',
    topic: 'Suami & Istri',
    defaultPrompt: 'Sa mau cerita soal menjaga komunikasi suami istri dan keluarga besar di rumah.',
  },
  {
    id: 'direktori',
    title: 'Direktori Suku',
    subtitle: '7 Wilayah Adat Papua',
    topic: 'Lintas Suku',
    defaultPrompt: 'Bagaimana cara menyatukan dua tradisi berbeda dalam perkawinan lintas suku Papua?',
  },
];

const PAPUA_EXPRESSIONS = [
  {
    term: 'Baku Jaga & Baku Sayang',
    meaning: 'Saling melindungi, setia, dan menjaga kehormatan pasangan serta anak-anak.',
    prompt: 'Bagaimana menerapkan nilai baku jaga dan baku sayang saat ada perbedaan pendapat suami istri?',
  },
  {
    term: 'Kitong Satu Tungku',
    meaning: 'Kesatuan keluarga besar yang saling menopang dalam suka dan duka.',
    prompt: 'Bagaimana menjaga semangat kitong satu tungku dengan keluarga besar tanpa membebani rumah tangga baru?',
  },
  {
    term: 'Baku Dengar',
    meaning: 'Mendengarkan nasihat orang tua, tetua adat, dan suara pasangan dengan rendah hati.',
    prompt: 'Bagaimana membangun kebiasaan baku dengar antara orang tua dan anak muda Papua di era modern?',
  },
  {
    term: 'Hormati Mas Kawin',
    meaning: 'Memandang arim atau mas kawin sebagai ikatan persaudaraan dua keluarga, bukan beban.',
    prompt: 'Bagaimana menjelaskan makna mas kawin secara bijak kepada keluarga muda agar tidak jadi beban berat?',
  },
];

const WILAYAH_ADAT = [
  {
    name: 'Mamta / Tabi',
    area: 'Jayapura, Sentani, Keerom, Sarmi',
    note: 'Musyawarah keluarga (Ondoafi/Kepala Suku), pengikatan kekerabatan, dan nilai persatuan pesisir-danau.',
  },
  {
    name: 'Saireri',
    area: 'Biak, Numfor, Yapen, Waropen',
    note: 'Tradisi arim/mas kawin piring gantung dan penghargaan tinggi pada keluarga pihak perempuan.',
  },
  {
    name: 'Domberai',
    area: 'Sorong, Manokwari, Raja Ampat, Tambrauw',
    note: 'Kearifan kain timur dan musyawarah marga yang mengutamakan kerukunan dua keluarga besar.',
  },
  {
    name: 'Bomberai',
    area: 'Fakfak, Kaimana, Teluk Bintuni, Wondama',
    note: 'Falsafah Satu Tungku Tiga Batu: harmoni iman berbeda dalam satu ikatan darah keluarga.',
  },
  {
    name: 'Anim Ha',
    area: 'Merauke, Boven Digoel, Mappi, Asmat',
    note: 'Kekuatan komunitas, seni ukir warisan leluhur, dan gotong royong menjaga generasi.',
  },
  {
    name: 'La Pago',
    area: 'Jayawijaya, Wamena, Lanny Jaya, Yahukimo',
    note: 'Kehidupan Honai, musyawarah tungku api, dan tanggung jawab bersama mendidik anak di lembah.',
  },
  {
    name: 'Meepago',
    area: 'Nabire, Paniai, Dogiyai, Deiyai, Mimika, Intan Jaya',
    note: 'Tradisi Noken sebagai simbol kehidupan, kerja keras, dan keterikatan marga yang saling menopang.',
  },
];

const MINI_ARTICLES = [
  {
    title: 'Menyeimbangkan Mas Kawin & Masa Depan Keluarga Muda',
    summary:
      'Cara bijak bermusyawarah dengan tetua adat dan keluarga besar agar prosesi adat tetap mulia tanpa meninggalkan beban utang bagi pengantin baru.',
    prompt: 'Bagaimana tips musyawarah mas kawin agar tetap menghormati adat tanpa memberatkan pengantin baru?',
  },
  {
    title: 'Mengelola Ekonomi Keluarga & Kewajiban Sosial',
    summary:
      'Keterbukaan antara suami dan istri dalam mengatur pos tabungan anak, kebutuhan pokok rumah tangga, serta dukungan untuk kerabat.',
    prompt: 'Bagaimana cara suami dan istri di Papua mengatur keuangan rumah tangga agar tetap bisa menabung untuk anak?',
  },
  {
    title: 'Menjaga Bahasa Ibu di Tengah Pergaulan Modern',
    summary:
      'Langkah ringan mengenalkan kosakata daerah dan cerita rakyat Papua di meja makan agar anak-anak tumbuh dengan jati diri yang kuat.',
    prompt: 'Bagaimana cara mengenalkan bahasa daerah Papua kepada anak-anak sejak kecil di rumah?',
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState<'beranda' | 'konsultasi' | 'budaya' | 'tentang'>('beranda');
  const [activeHub, setActiveHub] = useState<HubCategoryId>('budaya');
  const [selectedExpressionIdx, setSelectedExpressionIdx] = useState(0);
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);
  const [showAboutDetail, setShowAboutDetail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('uguwoo_profile');
      if (saved) {
        return JSON.parse(saved) as UserProfile;
      }
    } catch {
      // Ignore storage error
    }
    return {name: '', region: ''};
  });

  const [draftName, setDraftName] = useState(userProfile.name);
  const [draftRegion, setDraftRegion] = useState(userProfile.region);

  const [externalPrompt, setExternalPrompt] = useState<{
    text: string;
    topic?: string;
    nonce: number;
  } | null>(null);

  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const heroChatRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setDraftName(userProfile.name);
    setDraftRegion(userProfile.region);
  }, [userProfile, profileModalOpen]);

  const scrollToChat = (focusInput = true) => {
    setActiveNav('konsultasi');
    heroChatRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    if (focusInput) {
      window.setTimeout(() => {
        chatInputRef.current?.focus();
      }, 300);
    }
  };

  const handleAskAI = (promptText: string, topic?: string) => {
    scrollToChat(false);
    setExternalPrompt({text: promptText, topic, nonce: Date.now()});
  };

  const handleSelectFeatureCard = (cardId: HubCategoryId) => {
    setActiveHub(cardId);
    setActiveNav('budaya');
    hubRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const cleaned: UserProfile = {
      name: draftName.trim(),
      region: draftRegion.trim(),
    };
    setUserProfile(cleaned);
    try {
      localStorage.setItem('uguwoo_profile', JSON.stringify(cleaned));
    } catch {
      // Ignore storage error
    }
    setProfileModalOpen(false);
  };

  const renderFeatureIcon = (id: HubCategoryId) => {
    switch (id) {
      case 'perkawinan':
        return <HeartHandshake className="h-8 w-8 text-[#1D4A27]" strokeWidth={1.75} aria-hidden="true" />;
      case 'pendidikan':
        return <Users className="h-8 w-8 text-[#1D4A27]" strokeWidth={1.75} aria-hidden="true" />;
      case 'budaya':
        return <HonaiCardIcon className="h-9 w-9" />;
      case 'artikel':
        return <BookOpen className="h-8 w-8 text-[#1D4A27]" strokeWidth={1.75} aria-hidden="true" />;
      case 'cerita':
        return <MessageCircle className="h-8 w-8 text-[#1D4A27]" strokeWidth={1.75} aria-hidden="true" />;
      case 'direktori':
        return <MapPin className="h-8 w-8 text-[#1D4A27]" strokeWidth={1.75} aria-hidden="true" />;
    }
  };

  const activeExpression = PAPUA_EXPRESSIONS[selectedExpressionIdx];
  const activeRegion = WILAYAH_ADAT[selectedRegionIdx];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EB] text-[#16241D]">
      {/* Top Header Bar: Deep Forest Green Matching Mockup */}
      <header className="sticky top-0 z-40 bg-[#163B22] text-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand Logo Lockup */}
          <a
            href="#beranda"
            onClick={() => setActiveNav('beranda')}
            className="inline-flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C22B] rounded-lg"
          >
            <PapuaFamilyCrest className="h-10 w-12 shrink-0" />
            <div className="leading-none">
              <span className="block font-display text-sm sm:text-base font-bold tracking-wide text-white whitespace-nowrap">
                UGUWO KAA OWAA
              </span>
              <span className="mt-0.5 block text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#F2C22B] whitespace-nowrap">
                RUMAH KELUARGA DARI PAPUA
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
          >
            <a
              href="#beranda"
              onClick={() => setActiveNav('beranda')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'beranda'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Home className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>Beranda</span>
            </a>

            <button
              type="button"
              onClick={() => scrollToChat(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeNav === 'konsultasi'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>Konsultasi AI</span>
            </button>

            <a
              href="#budaya-hub"
              onClick={() => setActiveNav('budaya')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'budaya'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Feather className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>Budaya Papua</span>
            </a>

            <a
              href="#tentang"
              onClick={() => setActiveNav('tentang')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'tentang'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              <span>Tentang Kami</span>
            </a>
          </nav>

          {/* Right Action: Masuk / Profil + Mobile Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/35 bg-[#12301B] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#F2C22B] hover:bg-[#1E4A29] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#F2C22B]" strokeWidth={2} aria-hidden="true" />
              <span className="max-w-[110px] truncate">
                {userProfile.name ? userProfile.name : 'Masuk'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navigasi seluler"
            className="border-t border-white/15 bg-[#163B22] px-4 py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              <a
                href="#beranda"
                onClick={() => {
                  setActiveNav('beranda');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Beranda</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToChat(true);
                }}
                className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Konsultasi AI</span>
              </button>
              <a
                href="#budaya-hub"
                onClick={() => {
                  setActiveNav('budaya');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Feather className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Budaya Papua</span>
              </a>
              <a
                href="#tentang"
                onClick={() => {
                  setActiveNav('tentang');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Info className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Tentang Kami</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="mt-1 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#F2C22B] px-4 py-2 text-sm font-semibold text-[#16241D]"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span>{userProfile.name ? `Profil: ${userProfile.name}` : 'Masuk / Profil'}</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section with Full-Bleed Papua Family Photo & Floating AI Widget */}
        <section
          id="beranda"
          className="relative overflow-hidden bg-[#12301B]"
        >
          {/* Background Photo */}
          <img
            src={HERO_IMAGE_URL}
            alt="Keluarga Papua tersenyum hangat dalam balutan busana adat di lembah pegunungan hijau dengan rumah Honai"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Contrast Scrim */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0B2213]/88 via-[#0B2213]/58 to-[#0B2213]/35"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 sm:pt-14 sm:pb-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Hero Left Copy */}
              <div className="lg:col-span-7 text-white">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-sm [text-wrap:balance]">
                  UGUWO KAA OWAA
                </h1>
                <p className="mt-1.5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#F2C22B] drop-shadow-sm">
                  Rumah Keluarga dari Papua
                </p>

                <p className="mt-4 max-w-xl text-base sm:text-lg font-semibold italic leading-snug text-white/95">
                  &ldquo;Adat Dijaga, Agama Dihormati,
                  <br className="hidden sm:inline" /> Keluarga Dibangun, Generasi Dilindungi.&rdquo;
                </p>

                <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#E7EFE9]">
                  Mari belajar, berkonsultasi, dan berbagi tentang keluarga, perkawinan,
                  budaya, dan masa depan anak-anak Papua.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => scrollToChat(true)}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#F2C22B] px-7 py-3 text-sm font-bold text-[#16241D] shadow-md transition-colors hover:bg-[#E0B11F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Mulai Konsultasi AI</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Hero Right Floating AI Chatbot Card */}
              <div
                id="konsultasi"
                ref={heroChatRef}
                className="lg:col-span-5"
              >
                <ChatAssistant
                  externalPrompt={externalPrompt}
                  inputRef={chatInputRef}
                  userProfile={userProfile}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 6-Card Feature Strip Overlapping Bottom Edge of Hero */}
        <section
          id="budaya-hub"
          ref={hubRef}
          className="relative z-20 mx-auto -mt-7 sm:-mt-9 max-w-6xl px-4 sm:px-6"
          aria-label="Layanan dan pilar UGUWO KAA OWAA"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURE_CARDS.map((card) => {
              const isActive = activeHub === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectFeatureCard(card.id)}
                  className={`flex flex-col items-center justify-center rounded-xl border px-3 py-4 text-center shadow-sm transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#1D4A27] bg-white ring-2 ring-[#1D4A27]/15'
                      : 'border-[#E2DCCF] bg-white hover:border-[#1D4A27]/45'
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center">
                    {renderFeatureIcon(card.id)}
                  </div>
                  <span className="mt-2 font-display text-xs sm:text-[13px] font-bold leading-snug text-[#16241D]">
                    {card.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Contextual Hub Panel for the 6 Cards */}
          <div className="mt-5 rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs">
            {activeHub === 'budaya' && (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#16241D]">
                      Budaya Papua & Ungkapan Hangat Keluarga
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-[#425249]">
                      Pilih tutur dialek Papua di bawah untuk memahami maknanya atau konsultasi langsung dengan AI.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PAPUA_EXPRESSIONS.map((item, idx) => (
                      <button
                        key={item.term}
                        type="button"
                        onClick={() => setSelectedExpressionIdx(idx)}
                        className={`min-h-[36px] rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                          idx === selectedExpressionIdx
                            ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                            : 'border-[#DFD8CA] bg-[#F8F6F1] text-[#425249] hover:border-[#1D4A27]/50'
                        }`}
                      >
                        {item.term}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 border-t border-[#EFEAE0] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-sm font-bold text-[#1D4A27]">
                      {activeExpression.term}
                    </p>
                    <p className="mt-0.5 text-sm text-[#425249]">{activeExpression.meaning}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAskAI(activeExpression.prompt, 'Bahasa & Budaya')}
                    className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Tanya Sahabat AI</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {activeHub === 'direktori' && (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#16241D]">
                      Direktori 7 Wilayah Adat Papua
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-[#425249]">
                      Kenali kekayaan adat perkawinan dan kekeluargaan dari tujuh wilayah adat di Tanah Papua.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {WILAYAH_ADAT.map((region, idx) => (
                      <button
                        key={region.name}
                        type="button"
                        onClick={() => setSelectedRegionIdx(idx)}
                        className={`min-h-[34px] rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                          idx === selectedRegionIdx
                            ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                            : 'border-[#DFD8CA] bg-[#F8F6F1] text-[#425249] hover:border-[#1D4A27]/50'
                        }`}
                      >
                        {region.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 border-t border-[#EFEAE0] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-sm font-bold text-[#1D4A27]">
                      {activeRegion.name} · <span className="font-normal text-[#5C3D2E]">{activeRegion.area}</span>
                    </p>
                    <p className="mt-1 text-sm text-[#425249]">{activeRegion.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleAskAI(
                        `Ceritakan bagaimana adat perkawinan dan kehidupan keluarga di wilayah adat ${activeRegion.name} (${activeRegion.area}) agar tetap harmonis dengan ajaran agama dan masa depan anak?`,
                        'Perkawinan Adat',
                      )
                    }
                    className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Konsultasi Adat Wilayah Ini</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {activeHub === 'artikel' && (
              <div>
                <h2 className="font-display text-lg font-bold text-[#16241D]">
                  Artikel & Edukasi Keluarga Papua
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {MINI_ARTICLES.map((art) => (
                    <div
                      key={art.title}
                      className="flex flex-col justify-between rounded-xl border border-[#EAE4D8] bg-[#FAF8F4] p-4"
                    >
                      <div>
                        <h3 className="font-display text-sm font-bold text-[#16241D]">
                          {art.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#425249]">
                          {art.summary}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAskAI(art.prompt, 'Keluarga Modern')}
                        className="mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-[#1D4A27] hover:underline cursor-pointer"
                      >
                        <span>Diskusikan dengan AI</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeHub === 'perkawinan' ||
              activeHub === 'pendidikan' ||
              activeHub === 'cerita') && (() => {
              const current = FEATURE_CARDS.find((c) => c.id === activeHub)!;
              return (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#16241D]">
                      {current.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-[#425249]">
                      {activeHub === 'perkawinan' &&
                        'Pendampingan musyawarah keluarga besar, mas kawin yang bijaksana, kesiapan iman/pemberkatan agama, dan pernikahan lintas suku.'}
                      {activeHub === 'pendidikan' &&
                        'Membangun kedisiplinan, iman, rasa percaya diri, serta kecintaan anak Papua terhadap sekolah dan budaya orang tua.'}
                      {activeHub === 'cerita' &&
                        'Ruang curhat yang aman, hangat, dan rahasia bersama Sahabat Keluarga Papua AI dalam gaya dialek Papua atau bahasa Indonesia baku.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAskAI(current.defaultPrompt, current.topic)}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white hover:bg-[#265D33] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Mulai Konsultasi Topik Ini</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Tentang UGUWO KAA OWAA Section + 3 Cultural Photo Cards */}
        <section id="tentang" className="py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Text Column */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-[#C9A24D]" aria-hidden="true" />
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                    Tentang <span className="text-[#1D4A27]">UGUWO KAA OWAA</span>
                  </h2>
                  <span className="h-[2px] flex-1 max-w-[48px] bg-[#C9A24D]" aria-hidden="true" />
                </div>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#2F3F36]">
                  UGUWO KAA OWAA hadir sebagai ruang digital untuk membantu masyarakat Papua
                  memahami kehidupan keluarga, perkawinan, pendidikan anak, dan pentingnya
                  menjaga warisan budaya leluhur di tengah perkembangan zaman.
                </p>

                {showAboutDetail && (
                  <div className="mt-4 rounded-xl border border-[#DFD8CA] bg-white p-4 text-xs sm:text-sm leading-relaxed text-[#425249]">
                    Platform ini menggabungkan nilai kearifan lokal tujuh wilayah adat Papua,
                    penghormatan penuh terhadap iman dan ajaran agama, serta pendampingan AI yang
                    ramah berbahasa Indonesia dan dialek Papua agar setiap keluarga muda maupun
                    orang tua memiliki teman diskusi yang tulus.
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAboutDetail((prev) => !prev)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#265D33] cursor-pointer"
                  >
                    <span>{showAboutDetail ? 'Tutup Penjelasan' : 'Pelajari Lebih Lanjut'}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Right 3 Square Cultural Photography Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {GALLERY_IMAGES.map((img) => (
                    <figure
                      key={img.src}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-[#E2DCCF] bg-[#E8E2D4] shadow-xs"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <figcaption className="sr-only">{img.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer: Deep Forest Green with Papuan Carving Accent */}
      <footer className="relative overflow-hidden bg-[#163B22] text-white">
        <PapuaCarvingCorner className="pointer-events-none absolute right-0 bottom-0 h-28 w-52" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3.5">
              <PapuaFamilyCrest className="h-12 w-14 shrink-0" />
              <div>
                <p className="font-display text-lg font-bold tracking-wide text-white">
                  UGUWO KAA OWAA
                </p>
                <p className="text-xs font-semibold tracking-wider text-[#F2C22B]">
                  RUMAH KELUARGA DARI PAPUA.
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <p className="text-sm sm:text-base font-medium italic leading-relaxed text-[#F5F2EB]">
                &ldquo;Adat Dijaga, Agama Dihormati,
                <br className="hidden sm:inline" /> Keluarga Dibangun, Generasi Dilindungi.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-white/15 pt-4 text-xs text-[#C6D8CC] sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright © 2026 UGUWO KAA OWAA.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#beranda" className="hover:text-white">
                Beranda
              </a>
              <a href="#konsultasi" className="hover:text-white">
                Konsultasi AI
              </a>
              <a href="#budaya-hub" className="hover:text-white">
                Budaya Papua
              </a>
              <a href="#tentang" className="hover:text-white">
                Tentang Kami
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Profil Keluarga Modal (for "Masuk" button) */}
      {profileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#DFD8CA] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <h2 id="profile-modal-title" className="font-display text-lg font-bold text-[#16241D]">
                Profil Keluarga
              </h2>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                aria-label="Tutup"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6D64] hover:bg-[#F3F1EC] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#425249]">
              Isi nama panggilan dan wilayah adat ko agar Sahabat Keluarga Papua AI bisa menyapa
              lebih akrab dan sesuai tradisi daerah.
            </p>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-semibold text-[#16241D]"
                >
                  Nama Panggilan
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Contoh: Kaka Yosep / Mace Ester"
                  maxLength={50}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#DCD6C8] bg-[#FAF8F4] px-3.5 py-2 text-sm text-[#16241D] focus:border-[#1D4A27] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-region"
                  className="block text-xs font-semibold text-[#16241D]"
                >
                  Wilayah Adat (Opsional)
                </label>
                <select
                  id="profile-region"
                  value={draftRegion}
                  onChange={(e) => setDraftRegion(e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#DCD6C8] bg-[#FAF8F4] px-3.5 py-2 text-sm text-[#16241D] focus:border-[#1D4A27] focus:bg-white focus:outline-none"
                >
                  <option value="">Umum / Seluruh Tanah Papua</option>
                  {WILAYAH_ADAT.map((w) => (
                    <option key={w.name} value={w.name}>
                      {w.name} ({w.area})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="min-h-[42px] rounded-xl border border-[#DCD6C8] px-4 py-2 text-xs font-semibold text-[#425249] hover:bg-[#F3F1EC] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] rounded-xl bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
