import {useEffect, useRef, useState, type FormEvent} from 'react';
import {
  ArrowRight,
  Baby,
  BookHeart,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Feather,
  Fish,
  Flame,
  GraduationCap,
  HeartHandshake,
  Home,
  Info,
  LayoutGrid,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquareText,
  Quote,
  SlidersHorizontal,
  Sprout,
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
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from './components/SocialIcons';

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

const PARENTING_STAGES = [
  {
    stage: 'Usia Balita · 0–5 Tahun',
    title: 'Akar Kasih & Bahasa Ibu',
    tip: 'Biasakan tutur kata lembut dan pelukan hangat setiap hari, kenalkan lagu serta kosakata bahasa daerah Papua di rumah, dan penuhi gizi alami dari pangan lokal agar anak tumbuh sehat serta merasa aman.',
    prompt:
      'Bagaimana tips parenting Papua mendidik anak usia balita di rumah agar dekat dengan orang tua, sehat, dan mengenal bahasa ibu sejak kecil?',
    icon: Baby,
  },
  {
    stage: 'Usia Remaja · 12–17 Tahun',
    title: 'Baku Dengar & Percaya Diri',
    tip: 'Bangun kebiasaan baku dengar tanpa langsung menghakimi agar remaja berani terbuka. Dampingi pergaulan serta penggunaan HP secara bijak, dan tanamkan kebanggaan atas jati diri serta semangat berprestasi.',
    prompt:
      'Bagaimana cara orang tua Papua mendampingi anak usia remaja agar tetap mau mendengar nasihat, bijak memakai HP, dan percaya diri di sekolah?',
    icon: Compass,
  },
  {
    stage: 'Dewasa Muda · 18+ Tahun',
    title: 'Kemandirian & Persiapan Keluarga',
    tip: 'Bimbing anak muda untuk mandiri secara karya dan keuangan, matang dalam iman dan karakter, serta paham nilai musyawarah adat sebelum melangkah ke jenjang perkawinan.',
    prompt:
      'Bagaimana membimbing anak muda Papua usia dewasa muda agar mandiri secara ekonomi dan siap secara mental, iman, serta adat sebelum menikah?',
    icon: GraduationCap,
  },
];

const FAMILY_STORIES = [
  {
    name: 'Yosep Kogoya & Ester Wanimbo',
    role: 'Pasangan Muda',
    community: 'Komunitas Keluarga Wamena · La Pago',
    topic: 'Perkawinan Adat',
    quote:
      'Sebelum menikah, kami sempat bingung soal pembagian musyawarah adat dan kesiapan tabungan rumah tangga. Setelah berdiskusi bersama Sahabat Keluarga Papua AI, kami mendapat panduan dialog yang sopan dengan orang tua dan tetua adat, sehingga prosesi adat berjalan penuh damai tanpa membebani awal pernikahan kami.',
    prompt:
      'Bagaimana cara menyampaikan rencana musyawarah mas kawin dengan sopan kepada orang tua dan tetua adat?',
  },
  {
    name: 'Martha Rumere',
    role: 'Ibu Rumah Tangga & Kader Posyandu',
    community: 'Keluarga Pesisir Biak · Saireri',
    topic: 'Pendidikan Anak',
    quote:
      'Anak sulung kami yang masuk masa SMA mulai jarang bercerita dan lebih banyak diam. Lewat arahan dialek Papua yang hangat dari Sahabat AI, sa belajar praktik baku dengar tanpa langsung memarahi. Sekarang hubungan kami di rumah jauh lebih terbuka dan tenang.',
    prompt:
      'Bagaimana cara memulai obrolan baku dengar dengan anak remaja yang mulai tertutup di rumah?',
  },
  {
    name: 'Daniel Korwa & Siti Rahmawati',
    role: 'Pasangan Lintas Suku',
    community: 'Forum Keluarga Harmonis Sorong · Domberai',
    topic: 'Lintas Suku',
    quote:
      'Menyatukan dua kebiasaan keluarga dari suku dan latar belakang berbeda bukan hal mudah pada tahun-tahun pertama. Konsultasi di UGUWO KAA OWAA membantu kami menyusun kesepakatan rumah tangga yang saling menghormati iman dan menjaga silaturahmi dua keluarga besar.',
    prompt:
      'Bagaimana menjaga keharmonisan keluarga besar dalam pernikahan lintas suku dan budaya?',
  },
  {
    name: 'Lukas Kayame',
    role: 'Ayah Dua Anak & Guru Sekolah Dasar',
    community: 'Komunitas Orang Tua Nabire · Meepago',
    topic: 'Bahasa & Budaya',
    quote:
      'Kami khawatir anak-anak mulai lupa bahasa ibu karena kesibukan sekolah dan gawai. Dari ruang konsultasi ini, kami mulai rutin bercerita kisah leluhur dan mengenalkan kosakata daerah setiap makan malam bersama—anak-anak justru senang dan bangga.',
    prompt:
      'Bagaimana cara rutin mengenalkan bahasa ibu dan cerita budaya Papua kepada anak setiap malam di rumah?',
  },
];

const CONSULT_STEPS = [
  {
    step: '01',
    title: 'Pilih Gaya Dialek',
    description:
      'Tekan ikon pengatur di kotak chat untuk memilih gaya Papua Akrab, Campuran, atau Indonesia Baku.',
    icon: SlidersHorizontal,
  },
  {
    step: '02',
    title: 'Pilih Topik Cepat',
    description:
      'Klik tombol topik seperti Perkawinan Adat atau Pendidikan Anak jika ingin langsung mulai diskusi.',
    icon: LayoutGrid,
  },
  {
    step: '03',
    title: 'Tulis Pertanyaan Ko',
    description:
      'Ketik cerita atau pertanyaan keluarga di kolom pesan lalu tekan tombol kirim berikon panah.',
    icon: MessageSquareText,
  },
  {
    step: '04',
    title: 'Baca & Salin Arahan',
    description:
      'Terima jawaban hangat yang ramah adat dan agama, lalu salin bila ingin dibagikan ke keluarga.',
    icon: CheckCircle2,
  },
];

const LOCAL_NUTRITION_TIPS = [
  {
    nutrient: 'Energi Alami',
    title: 'Sagu & Papeda',
    description:
      'Sagu mengandung karbohidrat kompleks yang ramah pencernaan dan melepas energi secara bertahap—menjaga stamina orang tua yang bekerja dan anak-anak tetap aktif belajar tanpa lonjakan gula berlebih.',
    prompt:
      'Bagaimana cara memadukan papeda atau olahan sagu dengan lauk bergizi agar menjadi menu harian sehat untuk keluarga Papua?',
    icon: Sprout,
  },
  {
    nutrient: 'Serat & Vitamin',
    title: 'Hipere, Keladi & Pisang',
    description:
      'Umbi-umbian kebun Papua seperti ubi jalar (hipere), keladi, dan pisang rebus kaya serat, kalium, serta vitamin alami yang baik untuk pencernaan, daya tahan tubuh, dan MPASI balita.',
    prompt:
      'Bagaimana tips mengolah hipere, keladi, dan pangan kebun Papua menjadi makanan bergizi untuk balita dan ibu hamil?',
    icon: Leaf,
  },
  {
    nutrient: 'Protein & Zat Besi',
    title: 'Ikan Kuah Kuning & Sayur Gedi',
    description:
      'Memadukan ikan segar kaya omega-3 dengan sayur gedi (aibika) atau daun pepaya membantu mencukupi kebutuhan protein, kalsium, dan zat besi guna mencegah stunting serta menjaga tumbuh kembang anak.',
    prompt:
      'Apa manfaat ikan kuah kuning dan sayur gedi untuk mencegah stunting dan mendukung kesehatan keluarga Papua?',
    icon: Fish,
  },
];

const ANCESTRAL_TALES = [
  {
    id: 'cenderawasih',
    origin: 'Pegunungan & Pesisir Papua',
    value: 'Kasih Ibu & Kepatuhan Anak',
    title: 'Kisah Burung Cenderawasih dan Benang Kulit Kayu',
    story:
      'Dahulu di sebuah kampung tenang di tepi hutan Papua, seorang mama tua memintal benang dari kulit kayu bersama anaknya dengan penuh kesabaran. Meski hidup sederhana, sang anak selalu mendengar nasihat mamanya agar tidak pernah menyakiti sesama maupun merusak hutan tempat mereka tinggal. Suatu pagi, ketulusan hati dan kepatuhan anak itu diberkati oleh Sang Pencipta—benang emas yang mereka pintal berubah menjadi sayap indah burung surga (Cenderawasih) yang menari di puncak pohon, menjadi pengingat turun-temurun bahwa kemuliaan hidup lahir dari bakti kepada orang tua dan hati yang tulus.',
    familyLesson:
      'Keindahan akhlak anak di masa depan tumbuh dari kesetiaan mendengar nasihat orang tua di rumah.',
    aiPrompt:
      'Ceritakan kembali dongeng Burung Cenderawasih versi cerita pengantar tidur yang hangat untuk anak-anak di rumah, lengkap dengan pesan moral hormat kepada orang tua.',
  },
  {
    id: 'noken',
    origin: 'La Pago & Meepago',
    value: 'Ketekunan & Gotong Royong',
    title: 'Dongeng Noken dan Anyaman Kesabaran',
    story:
      'Di dalam Honai yang hangat oleh asap tungku api, seorang mama menganyam serat pohon melinjo sedikit demi sedikit setiap malam. Anak-anaknya bertanya mengapa ia tak pernah lelah mengikat simpul kecil yang tampak sepele. Mama itu tersenyum dan menunjukkan bahwa satu helai serat mudah putus, tetapi ratusan simpul yang diikat sabar mampu menopang hasil kebun, kayu bakar, bahkan menggendong bayi dengan aman. Sejak itu, warga kampung menjaga tradisi noken sebagai simbol ketekunan dan persatuan keluarga.',
    familyLesson:
      'Rumah tangga yang kuat dibangun dari kesabaran dan kerja sama kecil setiap hari, seperti simpul noken yang saling mengikat.',
    aiPrompt:
      'Ceritakan dongeng tentang filosofi Noken dan kesabaran seorang mama kepada anak-anak kami agar mereka belajar tekun dan saling menolong.',
  },
  {
    id: 'tungku',
    origin: 'Bomberai & Pesisir Papua',
    value: 'Kerukunan & Satu Tungku Tiga Batu',
    title: 'Cerita Tiga Batu Penopang Periuk',
    story:
      'Pada zaman leluhur, sebuah keluarga besar hendak memasak hidangan bersama di tepi pantai. Mereka mencari tiga batu karang yang bentuk dan asalnya berbeda-beda untuk dijadikan tungku api. Awalnya setiap batu ingin menonjol sendiri, sehingga periuk miring dan hampir tumpah. Setelah tetua adat menata ketiga batu itu sejajar dan saling mengimbangi, api pun menyala tenang dan seluruh keluarga makan dengan kenyang serta penuh tawa.',
    familyLesson:
      'Suami, istri, dan keluarga besar meski berbeda suku atau keyakinan harus saling menopang agar api kehangatan rumah tidak padam.',
    aiPrompt:
      'Ceritakan dongeng rakyat tentang Tiga Batu Tungku (Satu Tungku Tiga Batu) dengan bahasa sederhana agar anak-anak mengerti arti rukun dalam perbedaan.',
  },
  {
    id: 'teluk',
    origin: 'Kepulauan Saireri & Teluk Cenderawasih',
    value: 'Kejujuran & Menjaga Alam Leluhur',
    title: 'Janji Dua Bersaudara di Atas Perahu Cadik',
    story:
      'Dua bersaudara mendayung perahu cadik menuju perairan biru sebelum fajar menyingsing. Sebelum berangkat, bapak mereka berpesan: ambillah ikan secukupnya untuk makan keluarga dan janda-janda di kampung, jangan serakah dan jangan merusak terumbu karang. Ketika badai tiba-tiba datang, keduanya tetap jujur menepati janji dan saling menjaga di atas perahu. Laut kembali teduh dan cahaya bintang menuntun mereka pulang dengan selamat ke pelukan keluarga.',
    familyLesson:
      'Rezeki keluarga menjadi berkat bila dicari dengan jujur, dibagikan dengan adil, dan menjaga alam titipan untuk anak cucu.',
    aiPrompt:
      'Ceritakan dongeng dua bersaudara di atas perahu cadik Papua tentang nilai kejujuran, berbagi dengan sesama, dan menjaga laut.',
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState<'beranda' | 'konsultasi' | 'budaya' | 'tentang'>('beranda');
  const [activeHub, setActiveHub] = useState<HubCategoryId>('budaya');
  const [selectedExpressionIdx, setSelectedExpressionIdx] = useState(0);
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [activeTaleIdx, setActiveTaleIdx] = useState(0);
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
  const activeStory = FAMILY_STORIES[activeStoryIdx];
  const activeTale = ANCESTRAL_TALES[activeTaleIdx];

  const handlePrevStory = () => {
    setActiveStoryIdx((prev) => (prev - 1 + FAMILY_STORIES.length) % FAMILY_STORIES.length);
  };

  const handleNextStory = () => {
    setActiveStoryIdx((prev) => (prev + 1) % FAMILY_STORIES.length);
  };

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

          {/* Section Baru: Tumbuh Kembang Anak */}
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Parenting Keluarga Papua
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                  Tumbuh Kembang Anak
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#425249] max-w-md">
                Panduan kasih sayang, iman, dan jati diri adat di setiap tahap usia anak.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {PARENTING_STAGES.map((item) => {
                const StageIcon = item.icon;
                return (
                  <article
                    key={item.stage}
                    className="flex flex-col justify-between rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#1D4A27]">
                          <StageIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <span className="text-xs font-medium text-[#5C3D2E]">
                          {item.stage}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-[#16241D]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#425249]">
                        {item.tip}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAskAI(item.prompt, 'Pendidikan Anak')}
                      className="mt-5 inline-flex min-h-[38px] items-center gap-1.5 self-start text-xs font-semibold text-[#1D4A27] hover:text-[#5C3D2E] hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      <span>Tanya Sahabat AI</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Section Baru: Pangan Lokal Bergizi */}
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Ketahanan Gizi Keluarga
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                  Pangan Lokal Bergizi
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#425249] max-w-md">
                Mengolah kekayaan alam Papua di meja makan untuk keluarga sehat dan generasi kuat.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {LOCAL_NUTRITION_TIPS.map((item) => {
                const FoodIcon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="flex flex-col justify-between rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#1D4A27]">
                          <FoodIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <span className="text-xs font-medium text-[#5C3D2E]">
                          {item.nutrient}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-[#16241D]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#425249]">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAskAI(item.prompt, 'Keluarga Modern')}
                      className="mt-5 inline-flex min-h-[38px] items-center gap-1.5 self-start text-xs font-semibold text-[#1D4A27] hover:text-[#5C3D2E] hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      <span>Tanya Menu & Gizi AI</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Section Baru: Suara Keluarga (Carousel Cerita & Testimoni) */}
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Cerita Nyata Pengguna
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                  Suara Keluarga
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="mr-1 text-xs font-medium text-[#5E6D64] tabular-nums">
                  {activeStoryIdx + 1} / {FAMILY_STORIES.length}
                </span>
                <button
                  type="button"
                  onClick={handlePrevStory}
                  aria-label="Cerita keluarga sebelumnya"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#DFD8CA] bg-white text-[#1D4A27] transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNextStory}
                  aria-label="Cerita keluarga berikutnya"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#DFD8CA] bg-white text-[#1D4A27] transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 text-xs text-[#5E6D64]">
                    <Quote className="h-5 w-5 shrink-0 text-[#C9A24D]" strokeWidth={1.9} aria-hidden="true" />
                    <span className="font-medium text-[#5C3D2E]">{activeStory.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeStory.community}</span>
                  </div>

                  <blockquote className="mt-3 text-sm sm:text-base leading-relaxed text-[#25352C]">
                    &ldquo;{activeStory.quote}&rdquo;
                  </blockquote>

                  <div className="mt-4 flex flex-col gap-3 border-t border-[#EFEAE0] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-display text-sm font-bold text-[#16241D]">
                        {activeStory.name}
                      </p>
                      <p className="text-xs text-[#5E6D64]">{activeStory.role}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAskAI(activeStory.prompt, activeStory.topic)}
                      className="inline-flex min-h-[40px] items-center justify-center gap-1.5 self-start rounded-full border border-[#1D4A27] px-4 py-2 text-xs font-semibold text-[#1D4A27] transition-colors hover:bg-[#1D4A27] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Konsultasi Topik Serupa</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Carousel Slide Selector Tabs */}
              <div
                className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#EFEAE0] pt-4"
                role="tablist"
                aria-label="Pilih cerita keluarga"
              >
                {FAMILY_STORIES.map((story, idx) => {
                  const isCurrent = idx === activeStoryIdx;
                  return (
                    <button
                      key={story.name}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => setActiveStoryIdx(idx)}
                      className={`min-h-[36px] rounded-xl border px-3 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                          : 'border-[#E5DFD2] bg-[#FAF8F4] text-[#425249] hover:border-[#1D4A27]/50 hover:text-[#16241D]'
                      }`}
                    >
                      {story.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section Baru: Cerita Dongeng tentang Nilai-Nilai Leluhur */}
          <div id="dongeng-leluhur" className="mt-8 sm:mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Tutur Kisah Warisan Papua
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                  Cerita Dongeng tentang Nilai-Nilai Leluhur
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#425249] max-w-md">
                Kisah pengantar tidur dan teladan rumah tangga agar generasi muda tidak lupa akar budayanya.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-7 shadow-xs">
              {/* Tale Selector Tabs */}
              <div
                className="flex flex-wrap gap-2 border-b border-[#EFEAE0] pb-4"
                role="tablist"
                aria-label="Pilih cerita dongeng leluhur Papua"
              >
                {ANCESTRAL_TALES.map((tale, idx) => {
                  const isSelected = idx === activeTaleIdx;
                  return (
                    <button
                      key={tale.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveTaleIdx(idx)}
                      className={`inline-flex min-h-[38px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                          : 'border-[#E2DCCF] bg-[#FAF8F4] text-[#425249] hover:border-[#1D4A27]/50 hover:text-[#16241D]'
                      }`}
                    >
                      <BookHeart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{tale.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tale Content */}
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5E6D64]">
                  <span className="font-semibold text-[#5C3D2E]">{activeTale.value}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTale.origin}</span>
                </div>

                <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-[#16241D]">
                  {activeTale.title}
                </h3>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#25352C]">
                  {activeTale.story}
                </p>

                <div className="mt-5 rounded-xl border border-[#EAE4D8] bg-[#FAF8F4] p-4">
                  <div className="flex items-start gap-2.5">
                    <Flame className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24D]" strokeWidth={2} aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#5C3D2E]">
                        Pesan Leluhur untuk Keluarga
                      </p>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#25352C]">
                        {activeTale.familyLesson}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAskAI(activeTale.aiPrompt, 'Bahasa & Budaya')}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Ceritakan Dongeng Ini untuk Anak (AI)</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAskAI(
                        'Buatkan satu cerita dongeng Papua singkat yang baru tentang nilai gotong royong, kejujuran, dan hormat kepada orang tua untuk dibacakan sebelum tidur.',
                        'Bahasa & Budaya',
                      )
                    }
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-[#1D4A27] px-5 py-2 text-xs font-semibold text-[#1D4A27] transition-colors hover:bg-[#1D4A27] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Minta Dongeng Baru dari AI</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Baru: Cara Konsultasi */}
        <section
          id="cara-konsultasi"
          className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                Panduan Singkat
              </p>
              <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                Cara Konsultasi
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#425249]">
                Empat langkah mudah untuk mulai berinteraksi dengan Sahabat Keluarga Papua AI.
              </p>
            </div>

            <button
              type="button"
              onClick={() => scrollToChat(true)}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 self-start rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Coba Konsultasi Sekarang</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONSULT_STEPS.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-[#E2DCCF] bg-white p-5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#1D4A27]">
                      <StepIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <span className="font-display text-sm font-bold text-[#C9A24D] tabular-nums">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-base font-bold text-[#16241D]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#425249]">
                    {item.description}
                  </p>
                </div>
              );
            })}
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

          <div className="mt-6 flex flex-col gap-5 border-t border-white/15 pt-5 md:flex-row md:items-center md:justify-between">
            {/* Social Media Section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F2C22B]">
                Terhubung & Bagikan
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'Mari belajar dan berkonsultasi keluarga bersama UGUWO KAA OWAA – Rumah Keluarga dari Papua: ' +
                      (typeof window !== 'undefined' ? window.location.origin : ''),
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan melalui WhatsApp"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/25 bg-[#12301B] px-3.5 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : 'https://uguwokaaowaa.id',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan ke Facebook"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/25 bg-[#12301B] px-3.5 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  <span>Facebook</span>
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi Instagram UGUWO KAA OWAA"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/25 bg-[#12301B] px-3.5 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <InstagramIcon className="h-4 w-4 shrink-0" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#C6D8CC] sm:flex-row sm:items-center sm:gap-5">
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
              <p className="text-[#C6D8CC]">Copyright © 2026 UGUWO KAA OWAA.</p>
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
