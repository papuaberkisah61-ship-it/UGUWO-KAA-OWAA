import {useEffect, useMemo, useRef, useState, type FormEvent} from 'react';
import {
  Apple,
  ArrowRight,
  Baby,
  BookHeart,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Droplets,
  Feather,
  Fish,
  Flame,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Home,
  Images,
  Info,
  Languages,
  LayoutGrid,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquareText,
  Newspaper,
  Quote,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Sprout,
  User,
  Users,
  Utensils,
  Wallet,
  Wheat,
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
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from './components/SocialIcons';
import {
  HeaderInstallButton,
  MobileAppSection,
  OfflineIndicator,
} from './components/PWAInstallBanner';

type HubCategoryId =
  | 'perkawinan'
  | 'pendidikan'
  | 'budaya'
  | 'artikel'
  | 'cerita'
  | 'direktori'
  | 'galeri';

const HERO_IMAGE_URL = '/src/assets/images/hero_papua_family_1794999656025.jpg';
const GALLERY_IMAGES = [
  {
    src: '/src/assets/images/culture_papua_coast_1794999641973.jpg',
    alt: 'Perahu tradisional Papua di perairan jernih danau dan pesisir kepulauan Papua',
    caption: 'Pesisir & Danau Papua',
    story:
      'Perairan jernih Papua menjadi sumber penghidupan nelayan lokal dan mengajarkan nilai menjaga alam leluhur bagi anak cucu.',
    prompt:
      'Ceritakan nilai kearifan masyarakat pesisir dan danau di Papua dalam menjaga alam dan penghidupan keluarga.',
  },
  {
    src: '/src/assets/images/culture_papua_ceremony_1794999641793.jpg',
    alt: 'Masyarakat Papua mengenakan busana adat tradisional penuh senyum kebersamaan',
    caption: 'Adat & Kebersamaan',
    story:
      'Busana adat dan senyum persaudaraan mencerminkan semangat gotong royong serta kehormatan keluarga besar di Tanah Papua.',
    prompt:
      'Bagaimana menjaga nilai gotong royong dan kebersamaan adat Papua tetap hidup bagi generasi muda masa kini?',
  },
  {
    src: '/src/assets/images/culture_honai_house_1794999641110.jpg',
    alt: 'Rumah adat Honai Papua di lembah pegunungan hijau',
    caption: 'Honai & Lembah Pegunungan',
    story:
      'Honai menjadi tempat berkumpulnya keluarga di sekitar tungku api yang hangat—tempat nasihat, dongeng, dan musyawarah diwariskan.',
    prompt:
      'Apa filosofi rumah Honai dalam mendidik anak dan menjaga kehangatan komunikasi keluarga Papua?',
  },
  {
    src: '/src/assets/images/parenting_papua_family_1795005760301.jpg',
    alt: 'Keluarga Papua duduk bersama membaca buku cerita dan merawat keharmonisan rumah tangga',
    caption: 'Keluarga & Literasi Rumah',
    story:
      'Kebersamaan orang tua dan anak saat membaca dan belajar bersama di rumah menumbuhkan iman, literasi, serta kebanggaan jati diri Papua.',
    prompt:
      'Bagaimana membangun kebiasaan membaca dan dialog hangat orang tua bersama anak setiap hari di rumah?',
  },
];

const NEWS_INFO_ITEMS = [
  {
    title: 'Keluarga Sehat, Papua Kuat',
    category: 'Ketahanan Gizi & Kesehatan',
    summary:
      'Gerakan mengolah pangan lokal bergizi dari dapur rumah—sagu, ubi jalar, keladi, ikan kuah kuning, dan sayur gedi—untuk mencegah stunting dan menjaga daya tahan keluarga.',
    prompt:
      'Bagaimana langkah praktis keluarga Papua menerapkan gerakan Keluarga Sehat, Papua Kuat lewat pangan lokal?',
  },
  {
    title: 'Pendidikan untuk Masa Depan',
    category: 'Parenting & Literasi',
    summary:
      'Mendampingi anak sejak usia balita hingga dewasa muda melalui kebiasaan membaca, bahasa ibu, disiplin tanpa kekerasan, dan literasi digital.',
    prompt:
      'Apa langkah penting orang tua di Papua untuk menyiapkan pendidikan dan karakter anak menuju masa depan?',
  },
  {
    title: 'Budaya Papua untuk Dunia',
    category: 'Warisan Leluhur',
    summary:
      'Merawat dongeng nilai leluhur, filosofi Noken, dan tutur bahasa daerah sebagai identitas mulia yang membanggakan di pergaulan nasional maupun dunia.',
    prompt:
      'Bagaimana agar generasi muda Papua tetap bangga memperkenalkan budaya daerahnya di tingkat nasional dan dunia?',
  },
  {
    title: 'Harmoni dalam Keberagaman',
    category: 'Adat & Iman',
    summary:
      'Menghidupi falsafah Satu Tungku Tiga Batu dalam keluarga besar lintas suku dan keyakinan dengan saling menghormati serta mengedepankan musyawarah.',
    prompt:
      'Bagaimana menjaga harmoni dan saling menghormati dalam keluarga lintas suku maupun keberagaman di Tanah Papua?',
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
  {
    id: 'galeri',
    title: 'Galeri Papua',
    subtitle: 'Potret alam, adat & keluarga',
    topic: 'Bahasa & Budaya',
    defaultPrompt: 'Ceritakan kisah keindahan alam, budaya, dan kehidupan keluarga di berbagai daerah Papua.',
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

const PARENTING_FAMILY_IMAGE_URL =
  '/src/assets/images/parenting_papua_family_1795005760301.jpg';

const PARENTING_STAGES = [
  {
    step: 'Tahap 01',
    stage: 'Usia Balita · 0–5 Tahun',
    title: 'Akar Kasih & Bahasa Ibu',
    points: [
      'Kasih sayang, pelukan, dan rasa aman.',
      'Perkembangan bicara dan bahasa ibu.',
      'Gizi, ASI, MPASI, dan kebersihan.',
      'Bermain, mengenal lingkungan, dan stimulasi.',
      'Pendidikan iman melalui teladan sederhana.',
    ],
    goal: 'Anak sehat, merasa aman, dan mulai mengenal identitas keluarganya.',
    prompt:
      'Bagaimana tips parenting Papua mendidik anak usia balita (0–5 tahun) agar sehat, merasa aman, dan mulai mengenal bahasa ibu serta teladan iman sejak kecil?',
    icon: Baby,
  },
  {
    step: 'Tahap 02',
    stage: 'Usia Anak Sekolah · 6–11 Tahun',
    title: 'Karakter, Belajar & Rasa Ingin Tahu',
    points: [
      'Membiasakan membaca dan belajar.',
      'Membangun disiplin tanpa kekerasan.',
      'Mengembangkan bakat dan kreativitas.',
      'Menghargai orang tua, guru, dan sesama.',
      'Mengenal sejarah, budaya, dan bahasa Papua.',
      'Mengajarkan tanggung jawab sesuai usia.',
    ],
    goal: 'Anak percaya diri, mandiri, memiliki karakter baik, dan senang belajar.',
    prompt:
      'Bagaimana cara membangun disiplin tanpa kekerasan dan menumbuhkan kebiasaan belajar pada anak usia sekolah (6–11 tahun) di keluarga Papua?',
    icon: BookOpenCheck,
  },
  {
    step: 'Tahap 03',
    stage: 'Usia Remaja · 12–17 Tahun',
    title: 'Baku Dengar & Percaya Diri',
    points: [
      'Mendengarkan tanpa menghakimi.',
      'Mendampingi pergaulan dan penggunaan HP.',
      'Pendidikan kesehatan reproduksi sesuai usia.',
      'Mengembangkan potensi dan cita-cita.',
      'Mengenali tekanan teman sebaya dan perundungan.',
      'Menumbuhkan kebanggaan atas identitas Papua.',
    ],
    goal: 'Remaja mampu mengambil keputusan sehat, bertanggung jawab, dan percaya diri.',
    prompt:
      'Bagaimana cara orang tua Papua mendampingi remaja usia 12–17 tahun dengan pendekatan baku dengar, bijak memakai HP, dan percaya diri atas jati dirinya?',
    icon: Compass,
  },
  {
    step: 'Tahap 04',
    stage: 'Dewasa Muda · 18 Tahun ke Atas',
    title: 'Kemandirian & Persiapan Keluarga',
    points: [
      'Kemandirian pendidikan dan pekerjaan.',
      'Literasi keuangan dan pengelolaan ekonomi.',
      'Kedewasaan emosional dan tanggung jawab.',
      'Hubungan sehat dan saling menghormati.',
      'Persiapan perkawinan dan kehidupan keluarga.',
      'Memahami musyawarah, adat, dan nilai iman.',
    ],
    goal: 'Generasi muda siap membangun kehidupan mandiri dan keluarga yang sehat.',
    prompt:
      'Bagaimana membimbing dewasa muda Papua (18+ tahun) agar mandiri dalam pekerjaan, literasi keuangan, serta siap secara iman dan adat memasuki kehidupan berkeluarga?',
    icon: GraduationCap,
  },
];

const PARENTING_PILLARS = [
  {
    number: '1',
    title: 'Kasih Sayang dan Perlindungan',
    description:
      'Membangun hubungan orang tua dan anak yang aman, penuh perhatian, serta bebas dari kekerasan.',
    icon: ShieldCheck,
  },
  {
    number: '2',
    title: 'Bahasa Ibu dan Budaya',
    description:
      'Mengenalkan bahasa daerah, cerita rakyat, sejarah keluarga, adat, dan identitas masyarakat Papua.',
    icon: Languages,
  },
  {
    number: '3',
    title: 'Gizi dan Kesehatan',
    description:
      'Mengenalkan makanan lokal bergizi, pemantauan pertumbuhan, imunisasi, kebersihan, dan kesehatan keluarga.',
    icon: HeartPulse,
  },
  {
    number: '4',
    title: 'Pendidikan dan Literasi',
    description:
      'Membiasakan membaca, belajar, berpikir kritis, dan menggunakan teknologi secara bertanggung jawab.',
    icon: BookOpen,
  },
  {
    number: '5',
    title: 'Iman dan Spiritualitas',
    description:
      'Menanamkan nilai kasih, kejujuran, pengampunan, tanggung jawab, dan penghormatan terhadap sesama sesuai keyakinan keluarga.',
    icon: Sparkles,
  },
  {
    number: '6',
    title: 'Ekonomi Keluarga',
    description:
      'Mengajarkan kemandirian, kebiasaan menabung, pengelolaan kebutuhan rumah tangga, dan keterampilan hidup.',
    icon: Wallet,
  },
  {
    number: '7',
    title: 'Kesehatan Mental dan Emosi',
    description:
      'Mengembangkan komunikasi sehat, pengendalian emosi, rasa percaya diri, serta kemampuan menghadapi masalah.',
    icon: Smile,
  },
  {
    number: '8',
    title: 'Adat dan Hubungan Sosial',
    description:
      'Menghargai orang tua, keluarga besar, tetua adat, musyawarah, gotong royong, dan tanggung jawab sosial.',
    icon: Users,
  },
];

const PARENTING_SAMPLE_QUESTIONS = [
  'Mengapa anak saya sulit berbicara?',
  'Bagaimana menghadapi anak yang sering menangis?',
  'Bagaimana membatasi penggunaan HP pada remaja?',
  'Bagaimana mengenalkan bahasa ibu kepada anak?',
  'Bagaimana menyiapkan makanan bergizi dari pangan lokal?',
  'Bagaimana berbicara dengan anak yang mulai tertutup?',
  'Bagaimana mempersiapkan anak muda memasuki kehidupan berkeluarga?',
];

const PARENTING_AGE_FILTERS = [
  'Semua Usia',
  'Balita (0–5 Tahun)',
  'Anak Sekolah (6–11 Tahun)',
  'Remaja (12–17 Tahun)',
  'Dewasa Muda (18+ Tahun)',
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

const PAPUA_FOOD_IMAGE_URL = '/src/assets/images/papua_local_food_1795004997993.jpg';

const LOCAL_NUTRITION_TIPS = [
  {
    nutrient: 'Karbohidrat & Energi',
    title: 'Sagu',
    description:
      'Sumber karbohidrat sebagai penyedia energi. Dapat diolah menjadi papeda, sagu bakar, atau makanan tradisional lainnya.',
    prompt:
      'Bagaimana cara memadukan papeda atau olahan sagu dengan lauk bergizi agar menjadi menu harian sehat untuk keluarga Papua?',
    icon: Wheat,
  },
  {
    nutrient: 'Serat & Vitamin A',
    title: 'Ubi Jalar',
    description:
      'Sumber karbohidrat, serat, dan berbagai vitamin. Ubi berwarna oranye mengandung beta-karoten yang dapat diubah tubuh menjadi vitamin A.',
    prompt:
      'Bagaimana tips mengolah ubi jalar oranye (hipere) menjadi makanan bergizi untuk balita, ibu hamil, dan keluarga Papua?',
    icon: Sprout,
  },
  {
    nutrient: 'Karbohidrat & Serat',
    title: 'Keladi dan Talas',
    description:
      'Mengandung karbohidrat dan serat yang mengenyangkan. Harus dimasak dengan benar dan matang sempurna sebelum dikonsumsi.',
    prompt:
      'Bagaimana cara mengolah keladi dan talas dengan benar agar aman, lezat, dan bergizi untuk seluruh anggota keluarga?',
    icon: Flame,
  },
  {
    nutrient: 'Protein & Omega-3',
    title: 'Ikan Lokal',
    description:
      'Sumber protein serta berbagai mineral penting. Ikan laut tertentu juga mengandung asam lemak omega-3 yang mendukung kecerdasan anak.',
    prompt:
      'Apa manfaat ikan lokal seperti ikan kuah kuning untuk mencegah stunting dan mendukung kecerdasan anak Papua?',
    icon: Fish,
  },
  {
    nutrient: 'Vitamin, Mineral & Serat',
    title: 'Sayuran Lokal',
    description:
      'Daun gedi, pakis, daun singkong, dan sayuran lokal lainnya dapat menyediakan vitamin, mineral, zat besi, serta serat harian.',
    prompt:
      'Bagaimana cara memasak daun gedi, pakis, dan daun singkong agar nutrisinya tetap terjaga untuk keluarga?',
    icon: Leaf,
  },
  {
    nutrient: 'Vitamin & Antioksidan',
    title: 'Buah-buahan Lokal',
    description:
      'Pisang, pepaya, alpukat, dan buah musiman Papua menjadi sumber vitamin, mineral, dan serat alami untuk daya tahan tubuh.',
    prompt:
      'Apa saja kombinasi buah-buahan lokal Papua seperti pisang, pepaya, dan alpukat yang baik untuk camilan sehat anak?',
    icon: Apple,
  },
];

const NUTRITION_PRINCIPLES = [
  {
    label: 'Makanan pokok',
    detail: 'Sagu, ubi, keladi, atau sumber karbohidrat lokal lainnya.',
  },
  {
    label: 'Lauk berprotein',
    detail: 'Ikan, telur, ayam, dan kacang-kacangan.',
  },
  {
    label: 'Sayuran',
    detail: 'Sayuran hijau dan sayuran lokal (daun gedi, pakis, daun singkong).',
  },
  {
    label: 'Buah',
    detail: 'Pepaya, pisang, alpukat, atau buah musiman yang tersedia.',
  },
  {
    label: 'Air minum',
    detail: 'Air bersih dan aman dikonsumsi setiap hari.',
  },
];

const DAILY_LOCAL_MENU = [
  {
    time: 'Pagi',
    menu: 'Ubi rebus, telur, dan pepaya',
  },
  {
    time: 'Siang',
    menu: 'Papeda, ikan kuah kuning, sayur gedi',
  },
  {
    time: 'Sore',
    menu: 'Pisang atau buah lokal',
  },
  {
    time: 'Malam',
    menu: 'Keladi rebus, ikan, dan sayuran',
  },
];

const LOCAL_FOOD_IMPORTANCE = [
  {
    number: '1',
    title: 'Memperkuat kemandirian pangan',
    description: 'Keluarga tidak selalu bergantung pada bahan pangan dari luar daerah.',
  },
  {
    number: '2',
    title: 'Menjaga budaya',
    description: 'Pengetahuan tentang pangan tradisional diwariskan kepada generasi berikutnya.',
  },
  {
    number: '3',
    title: 'Mendukung ekonomi masyarakat',
    description: 'Petani, nelayan, dan produsen lokal mendapatkan manfaat langsung.',
  },
  {
    number: '4',
    title: 'Meningkatkan kualitas gizi',
    description: 'Variasi pangan membantu memenuhi kebutuhan zat gizi keluarga.',
  },
  {
    number: '5',
    title: 'Melindungi lingkungan',
    description:
      'Pemanfaatan pangan lokal yang dikelola secara berkelanjutan mendukung ekosistem dan sumber penghidupan masyarakat.',
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
  const [activeNav, setActiveNav] = useState<
    | 'beranda'
    | 'keluarga'
    | 'pendidikan'
    | 'budaya'
    | 'kesehatan'
    | 'cerita'
    | 'galeri'
    | 'konsultasi'
    | 'tentang'
  >('beranda');
  const [activeHub, setActiveHub] = useState<HubCategoryId>('budaya');
  const [selectedExpressionIdx, setSelectedExpressionIdx] = useState(0);
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [activeTaleIdx, setActiveTaleIdx] = useState(0);
  const [selectedParentingAge, setSelectedParentingAge] = useState<string>('Semua Usia');
  const [showAboutDetail, setShowAboutDetail] = useState(false);
  const [selectedGalleryPhotoIdx, setSelectedGalleryPhotoIdx] = useState<number | null>(null);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraftName(userProfile.name);
    setDraftRegion(userProfile.region);
  }, [userProfile, profileModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchFocused(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      window.setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 60);
    }
  }, [mobileSearchOpen]);

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
      case 'galeri':
        return <Images className="h-8 w-8 text-[#1D4A27]" strokeWidth={1.75} aria-hidden="true" />;
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

  interface SearchItem {
    id: string;
    category: 'Topik Konsultasi' | 'Artikel & Gizi' | 'Dongeng Leluhur' | 'Parenting' | 'Wilayah Adat';
    title: string;
    subtitle: string;
    keywords: string;
    onSelect: () => void;
  }

  const searchIndex: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [
      ...FEATURE_CARDS.map((card) => ({
        id: `hub-${card.id}`,
        category: 'Topik Konsultasi' as const,
        title: card.title,
        subtitle: card.subtitle,
        keywords: `${card.title} ${card.subtitle} ${card.topic}`,
        onSelect: () => {
          setActiveHub(card.id);
          setActiveNav('budaya');
          hubRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      ...MINI_ARTICLES.map((art, idx) => ({
        id: `art-${idx}`,
        category: 'Artikel & Gizi' as const,
        title: art.title,
        subtitle: art.summary,
        keywords: `${art.title} ${art.summary}`,
        onSelect: () => {
          setActiveHub('artikel');
          setActiveNav('budaya');
          hubRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      ...LOCAL_NUTRITION_TIPS.map((food, idx) => ({
        id: `food-${idx}`,
        category: 'Artikel & Gizi' as const,
        title: `${food.title} (${food.nutrient})`,
        subtitle: food.description,
        keywords: `${food.title} ${food.nutrient} ${food.description} pangan lokal gizi nutrisi ketahanan gizi`,
        onSelect: () => {
          document.getElementById('pangan-lokal')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      {
        id: 'food-menu-sehari',
        category: 'Artikel & Gizi' as const,
        title: 'Prinsip Menu Bergizi & Contoh Menu Pangan Lokal 1 Hari',
        subtitle: 'Kombinasi makanan pokok, lauk berprotein, sayuran, buah lokal, dan air minum bersih.',
        keywords: 'menu sehari pagi siang sore malam prinsip gizi seimbang papeda ikan kuah kuning ketahanan gizi',
        onSelect: () => {
          document.getElementById('pangan-lokal')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      },
      ...PARENTING_STAGES.map((stage, idx) => ({
        id: `parenting-${idx}`,
        category: 'Parenting' as const,
        title: `${stage.step} · ${stage.stage} — ${stage.title}`,
        subtitle: stage.goal,
        keywords: `${stage.step} ${stage.title} ${stage.stage} ${stage.points.join(' ')} ${stage.goal} parenting anak sekolah balita remaja dewasa muda`,
        onSelect: () => {
          document.getElementById('tumbuh-kembang-anak')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      ...PARENTING_PILLARS.map((pillar) => ({
        id: `pillar-${pillar.number}`,
        category: 'Parenting' as const,
        title: `Pilar Parenting ${pillar.number}: ${pillar.title}`,
        subtitle: pillar.description,
        keywords: `${pillar.title} ${pillar.description} delapan pilar parenting keluarga papua`,
        onSelect: () => {
          document.getElementById('delapan-pilar-parenting')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      ...ANCESTRAL_TALES.map((tale, idx) => ({
        id: `tale-${tale.id}`,
        category: 'Dongeng Leluhur' as const,
        title: tale.title,
        subtitle: `${tale.value} · ${tale.origin}`,
        keywords: `${tale.title} ${tale.value} ${tale.origin} ${tale.familyLesson} dongeng cerita leluhur`,
        onSelect: () => {
          setActiveTaleIdx(idx);
          document.getElementById('dongeng-leluhur')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      ...WILAYAH_ADAT.map((region, idx) => ({
        id: `region-${region.name}`,
        category: 'Wilayah Adat' as const,
        title: `Adat ${region.name}`,
        subtitle: region.area,
        keywords: `${region.name} ${region.area} ${region.note} suku`,
        onSelect: () => {
          setActiveHub('direktori');
          setSelectedRegionIdx(idx);
          hubRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      })),
      ...NEWS_INFO_ITEMS.map((news, idx) => ({
        id: `news-${idx}`,
        category: 'Artikel & Gizi' as const,
        title: news.title,
        subtitle: news.summary,
        keywords: `${news.title} ${news.category} ${news.summary} berita info`,
        onSelect: () => {
          document.getElementById('berita-info')?.scrollIntoView({behavior: 'smooth', block: 'start'});
          setNewsModalOpen(true);
        },
      })),
      {
        id: 'galeri-kisah-papua',
        category: 'Artikel & Gizi' as const,
        title: 'Kisah dari Tanah Papua (Galeri Foto)',
        subtitle: 'Potret alam pesisir, adat kebersamaan, Honai pegunungan, dan literasi keluarga.',
        keywords: 'galeri papua foto kisah tanah papua honai pesisir upacara adat',
        onSelect: () => {
          document.getElementById('galeri-papua')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      },
      {
        id: 'app-install',
        category: 'Topik Konsultasi' as const,
        title: 'Pasang Aplikasi UGUWO KAA OWAA di HP',
        subtitle: 'Instal aplikasi Android / iOS (PWA) dan panduan info APK.',
        keywords: 'download apk unduh aplikasi pasang app android iphone ios pwa install hp',
        onSelect: () => {
          document.getElementById('unduh-aplikasi')?.scrollIntoView({behavior: 'smooth', block: 'start'});
        },
      },
    ];
    return items;
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return searchIndex.slice(0, 5);
    }
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      )
      .slice(0, 7);
  }, [searchIndex, searchQuery]);

  const handleSelectSearchResult = (item: SearchItem) => {
    setSearchFocused(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    item.onSelect();
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
    } else {
      setSearchFocused(false);
      setMobileSearchOpen(false);
      setSearchQuery('');
      handleAskAI(trimmed);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EB] text-[#16241D]">
      {/* Top Header Bar: Deep Forest Green, Spacious & Balanced */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#163B22] text-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 sm:gap-5 px-4 sm:px-6">
          {/* Brand Logo Lockup */}
          <a
            href="#beranda"
            onClick={() => setActiveNav('beranda')}
            className="inline-flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C22B] rounded-lg"
          >
            <PapuaFamilyCrest className="h-9 w-11 sm:h-10 sm:w-12 shrink-0" />
            <div className="leading-none">
              <span className="block font-display text-sm sm:text-base font-bold tracking-wide text-white whitespace-nowrap">
                UGUWO KAA OWAA
              </span>
              <span className="mt-0.5 block text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#F2C22B] whitespace-nowrap">
                RUMAH KELUARGA DARI PAPUA
              </span>
            </div>
          </a>

          {/* 7-Item Primary Navigation Links Matching Visual Blueprint */}
          <nav
            aria-label="Navigasi utama"
            className="hidden lg:flex items-center gap-0.5 xl:gap-1"
          >
            <a
              href="#beranda"
              onClick={() => setActiveNav('beranda')}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'beranda'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Beranda</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setActiveNav('keluarga');
                setActiveHub('perkawinan');
                hubRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
              }}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeNav === 'keluarga'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Keluarga</span>
            </button>

            <a
              href="#tumbuh-kembang-anak"
              onClick={() => setActiveNav('pendidikan')}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'pendidikan'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Pendidikan</span>
            </a>

            <a
              href="#budaya-hub"
              onClick={() => {
                setActiveNav('budaya');
                setActiveHub('budaya');
              }}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'budaya'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Feather className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Budaya</span>
            </a>

            <a
              href="#pangan-lokal"
              onClick={() => setActiveNav('kesehatan')}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'kesehatan'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <HeartPulse className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Kesehatan</span>
            </a>

            <a
              href="#dongeng-leluhur"
              onClick={() => setActiveNav('cerita')}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'cerita'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Cerita Papua</span>
            </a>

            <a
              href="#galeri-papua"
              onClick={() => setActiveNav('galeri')}
              className={`inline-flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'galeri'
                  ? 'bg-[#F2C22B] text-[#16241D]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Images className="h-3.5 w-3.5 mb-0.5" strokeWidth={2} aria-hidden="true" />
              <span>Galeri</span>
            </a>
          </nav>

          {/* Right Action: Global Search + Masuk / Profil + Mobile Triggers */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Global Search Bar */}
            <div ref={searchContainerRef} className="relative hidden lg:block">
              <form onSubmit={handleSearchSubmit} role="search" aria-label="Pencarian global">
                <label htmlFor="header-global-search" className="sr-only">
                  Cari topik konsultasi, artikel, atau dongeng leluhur
                </label>
                <div className="flex h-9 w-40 xl:w-48 items-center gap-2 rounded-full border border-white/25 bg-[#12301B] px-3 transition-colors focus-within:border-[#F2C22B]">
                  <Search className="h-3.5 w-3.5 shrink-0 text-[#F2C22B]" aria-hidden="true" />
                  <input
                    id="header-global-search"
                    type="search"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    placeholder="Cari di sini..."
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Hapus pencarian"
                      className="text-white/70 hover:text-white cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </form>

              {searchFocused && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 xl:w-96 overflow-hidden rounded-2xl border border-[#DFD8CA] bg-white text-[#16241D] shadow-xl">
                  <div className="border-b border-[#EFEAE0] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#5C3D2E]">
                    {searchQuery.trim() ? 'Hasil Pencarian' : 'Jelajahi Cepat'}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F3EFE7]">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSearchResult(item)}
                          className="flex w-full flex-col gap-0.5 px-3.5 py-2.5 text-left transition-colors hover:bg-[#FAF8F4] cursor-pointer"
                        >
                          <span className="text-[10px] font-semibold text-[#1D4A27]">
                            {item.category}
                          </span>
                          <span className="font-display text-xs font-bold text-[#16241D]">
                            {item.title}
                          </span>
                          <span className="line-clamp-1 text-[11px] text-[#5E6D64]">
                            {item.subtitle}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3.5 py-3 text-xs text-[#5E6D64]">
                        Tidak ditemukan topik yang persis cocok.
                      </div>
                    )}
                  </div>
                  {searchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        const q = searchQuery.trim();
                        setSearchFocused(false);
                        setSearchQuery('');
                        handleAskAI(q);
                      }}
                      className="flex w-full items-center justify-between gap-2 border-t border-[#EFEAE0] bg-[#FAF8F4] px-3.5 py-2.5 text-left text-xs font-semibold text-[#1D4A27] hover:bg-[#EFEAE0] cursor-pointer"
                    >
                      <span className="truncate">
                        Tanyakan &ldquo;{searchQuery.trim()}&rdquo; ke Sahabat AI
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Compact Tablet / Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((open) => !open);
                setMobileMenuOpen(false);
              }}
              aria-expanded={mobileSearchOpen}
              aria-label="Buka pencarian"
              className="inline-flex lg:hidden min-h-[42px] min-w-[42px] items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/35 bg-[#12301B] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#F2C22B] hover:bg-[#1E4A29] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#F2C22B]" strokeWidth={2} aria-hidden="true" />
              <span className="max-w-[90px] truncate">
                {userProfile.name ? userProfile.name : 'Masuk'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setMobileSearchOpen(false);
              }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              className="inline-flex lg:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Tablet & Mobile Expandable Search Panel */}
        {mobileSearchOpen && (
          <div className="border-t border-white/15 bg-[#12301B] px-4 py-3 lg:hidden">
            <form onSubmit={handleSearchSubmit} role="search" aria-label="Pencarian cepat">
              <label htmlFor="mobile-global-search" className="sr-only">
                Cari topik konsultasi, artikel, atau dongeng leluhur
              </label>
              <div className="flex h-10 items-center gap-2 rounded-full border border-white/25 bg-[#163B22] px-3.5 focus-within:border-[#F2C22B]">
                <Search className="h-4 w-4 shrink-0 text-[#F2C22B]" aria-hidden="true" />
                <input
                  ref={mobileSearchInputRef}
                  id="mobile-global-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari topik, artikel, atau dongeng..."
                  className="w-full bg-transparent text-base sm:text-xs text-white placeholder:text-white/60 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                    className="text-white/70 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>

            <div className="mt-2.5 max-h-60 overflow-y-auto rounded-xl bg-white text-[#16241D] divide-y divide-[#F3EFE7]">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="flex w-full flex-col gap-0.5 px-3.5 py-2.5 text-left hover:bg-[#FAF8F4] cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-[#1D4A27]">
                    {item.category}
                  </span>
                  <span className="font-display text-xs font-bold text-[#16241D]">
                    {item.title}
                  </span>
                  <span className="line-clamp-1 text-[11px] text-[#5E6D64]">
                    {item.subtitle}
                  </span>
                </button>
              ))}
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    const q = searchQuery.trim();
                    setMobileSearchOpen(false);
                    setSearchQuery('');
                    handleAskAI(q);
                  }}
                  className="flex w-full items-center justify-between gap-2 bg-[#FAF8F4] px-3.5 py-2.5 text-left text-xs font-semibold text-[#1D4A27] cursor-pointer"
                >
                  <span className="truncate">
                    Tanyakan &ldquo;{searchQuery.trim()}&rdquo; ke Sahabat AI
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile & Tablet Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navigasi seluler"
            className="border-t border-white/15 bg-[#163B22] px-4 py-3 lg:hidden"
          >
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              <a
                href="#beranda"
                onClick={() => {
                  setActiveNav('beranda');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Beranda</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveNav('keluarga');
                  setActiveHub('perkawinan');
                  hubRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium text-white hover:bg-white/10"
              >
                <Users className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Keluarga</span>
              </button>
              <a
                href="#tumbuh-kembang-anak"
                onClick={() => {
                  setActiveNav('pendidikan');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <GraduationCap className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Pendidikan</span>
              </a>
              <a
                href="#budaya-hub"
                onClick={() => {
                  setActiveNav('budaya');
                  setActiveHub('budaya');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Feather className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Budaya</span>
              </a>
              <a
                href="#pangan-lokal"
                onClick={() => {
                  setActiveNav('kesehatan');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <HeartPulse className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Kesehatan</span>
              </a>
              <a
                href="#dongeng-leluhur"
                onClick={() => {
                  setActiveNav('cerita');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Cerita Papua</span>
              </a>
              <a
                href="#galeri-papua"
                onClick={() => {
                  setActiveNav('galeri');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Images className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Galeri</span>
              </a>
              <a
                href="#tentang"
                onClick={() => {
                  setActiveNav('tentang');
                  setMobileMenuOpen(false);
                }}
                className="flex min-h-[42px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-white hover:bg-white/10"
              >
                <Info className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                <span>Tentang Kami</span>
              </a>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <HeaderInstallButton
                onClickBeforeOpen={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#F2C22B]/70 bg-[#12301B] px-4 py-2 text-sm font-semibold text-[#F2C22B] hover:bg-[#1E4A29] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#F2C22B] px-4 py-2 text-sm font-semibold text-[#16241D]"
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              {/* Hero Left Copy */}
              <div className="lg:col-span-6 xl:col-span-7 text-white">
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

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToChat(true)}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#F2C22B] px-7 py-3 text-sm font-bold text-[#16241D] shadow-md transition-colors hover:bg-[#E0B11F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Home className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                    <span>Mulai Konsultasi Keluarga</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                  </button>
                  <HeaderInstallButton className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/35 bg-[#12301B]/80 px-5 py-3 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B] whitespace-nowrap shrink-0 cursor-pointer" />
                </div>
              </div>

              {/* Hero Right Floating AI Chatbot Card */}
              <div
                id="konsultasi"
                ref={heroChatRef}
                className="w-full lg:col-span-6 xl:col-span-5 lg:max-w-[490px] lg:ml-auto"
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

        {/* 7-Card Feature Strip Overlapping Bottom Edge of Hero */}
        <section
          id="budaya-hub"
          ref={hubRef}
          className="relative z-20 mx-auto -mt-7 sm:-mt-9 max-w-6xl px-4 sm:px-6"
          aria-label="Layanan dan pilar UGUWO KAA OWAA"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {FEATURE_CARDS.map((card) => {
              const isActive = activeHub === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectFeatureCard(card.id)}
                  className={`flex flex-col items-center justify-center rounded-xl border px-2.5 py-4 text-center shadow-sm transition-all cursor-pointer ${
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

            {activeHub === 'galeri' && (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#16241D]">
                      Galeri Papua · Kisah Alam, Adat &amp; Keluarga
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-[#425249]">
                      Klik foto di bawah untuk melihat kisah budaya atau langsung berdiskusi dengan Sahabat AI.
                    </p>
                  </div>
                  <a
                    href="#galeri-papua"
                    className="inline-flex min-h-[38px] items-center gap-1.5 self-start rounded-full border border-[#1D4A27] px-4 py-1.5 text-xs font-semibold text-[#1D4A27] hover:bg-[#1D4A27] hover:text-white whitespace-nowrap shrink-0"
                  >
                    <span>Lihat Galeri Lengkap</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {GALLERY_IMAGES.map((img, idx) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setSelectedGalleryPhotoIdx(idx)}
                      className="group overflow-hidden rounded-xl border border-[#EAE4D8] bg-[#FAF8F4] text-left transition-all hover:border-[#1D4A27] cursor-pointer"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <p className="px-3 py-2 font-display text-xs font-bold text-[#16241D]">
                        {img.caption}
                      </p>
                    </button>
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

          {/* Section Fitur Utama: PARENTING KELUARGA PAPUA */}
          <div id="tumbuh-kembang-anak" className="mt-8 sm:mt-10 space-y-6">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  UGUWO KAA OWAA · Parenting Keluarga Papua
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                  Merawat Anak, Menguatkan Keluarga, Melestarikan Jati Diri Papua.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#425249] max-w-md">
                Pusat pendampingan keluarga yang memadukan ilmu tumbuh kembang anak, kearifan adat, bahasa ibu, iman, kesehatan, dan AI.
              </p>
            </div>

            {/* Deskripsi Utama Banner */}
            <div className="overflow-hidden rounded-2xl border border-[#E2DCCF] bg-white shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <img
                    src={PARENTING_FAMILY_IMAGE_URL}
                    alt="Keluarga Papua duduk bersama membaca buku cerita anak penuh kasih sayang dan kehangatan"
                    className="h-56 w-full object-cover lg:h-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-7 lg:col-span-7">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C3D2E]">
                    Pusat Pendampingan Orang Tua &amp; Keluarga
                  </span>
                  <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#16241D]">
                    Setiap anak berhak tumbuh dalam keluarga yang penuh kasih, aman, sehat, dan menghargai jati dirinya.
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#425249]">
                    UGUWO KAA OWAA hadir sebagai ruang belajar bagi orang tua, calon orang tua, remaja,
                    dan keluarga Papua untuk memahami setiap tahap perkembangan anak. Kami menggabungkan
                    pengetahuan pengasuhan modern dengan kearifan lokal Papua, bahasa ibu, nilai adat,
                    pendidikan iman, serta pemanfaatan pangan lokal.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleAskAI(
                          'Halo Sahabat AI, saya ingin berkonsultasi tentang pengasuhan dan tumbuh kembang anak di keluarga Papua.',
                          'Pendidikan Anak',
                        )
                      }
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] cursor-pointer"
                    >
                      <span>Konsultasi Parenting AI</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <a
                      href="#delapan-pilar-parenting"
                      className="inline-flex min-h-[40px] items-center rounded-full border border-[#DFD8CA] px-4 py-2 text-xs font-semibold text-[#16241D] transition-colors hover:border-[#1D4A27] hover:text-[#1D4A27]"
                    >
                      Lihat 8 Pilar Parenting
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Peta Tumbuh Kembang Anak (4 Kelompok Usia) */}
            <div>
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#16241D]">
                  1. Peta Tumbuh Kembang Anak
                </h3>
                <p className="text-xs text-[#425249]">
                  Empat kelompok usia agar tidak ada tahapan perkembangan anak yang terlewat.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {PARENTING_STAGES.map((item) => {
                  const StageIcon = item.icon;
                  return (
                    <article
                      key={item.step}
                      className="flex flex-col justify-between rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#1D4A27]">
                              <StageIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                            </div>
                            <div>
                              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5C3D2E]">
                                {item.step}
                              </span>
                              <span className="block text-xs font-semibold text-[#1D4A27]">
                                {item.stage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <h4 className="mt-4 font-display text-base sm:text-lg font-bold text-[#16241D]">
                          {item.title}
                        </h4>

                        <ul className="mt-3 space-y-1.5">
                          {item.points.map((point) => (
                            <li
                              key={point}
                              className="flex items-start gap-2 text-xs sm:text-sm text-[#425249]"
                            >
                              <CheckCircle2
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1D4A27]"
                                aria-hidden="true"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3.5 py-2.5 text-xs text-[#25352C]">
                          <strong className="font-semibold text-[#1D4A27]">Tujuan: </strong>
                          {item.goal}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAskAI(item.prompt, 'Pendidikan Anak')}
                        className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-full border border-[#1D4A27] px-4 py-1.5 text-xs font-semibold text-[#1D4A27] transition-colors hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                      >
                        <span>Tanya Sahabat AI</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* 2. Delapan Pilar Parenting Keluarga Papua */}
            <div id="delapan-pilar-parenting">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#16241D]">
                  2. Delapan Pilar Parenting Keluarga Papua
                </h3>
                <p className="text-xs text-[#425249]">
                  Pondasi pengasuhan menyeluruh yang memadukan kasih keluarga, budaya, dan nilai iman.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {PARENTING_PILLARS.map((pillar) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <article
                      key={pillar.number}
                      className="flex flex-col justify-between rounded-2xl border border-[#E2DCCF] bg-white p-4 sm:p-5 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#1D4A27]">
                            <PillarIcon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                          </div>
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1D4A27] text-[11px] font-bold text-white tabular-nums">
                            {pillar.number}
                          </span>
                        </div>

                        <h4 className="mt-3 font-display text-sm font-bold text-[#16241D]">
                          {pillar.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#425249]">
                          {pillar.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleAskAI(
                            `Bagaimana cara mempraktikkan pilar parenting "${pillar.title}" dalam kehidupan keluarga Papua sehari-hari?`,
                            'Pendidikan Anak',
                          )
                        }
                        className="mt-3.5 inline-flex items-center gap-1 self-start text-[11px] font-semibold text-[#1D4A27] hover:text-[#5C3D2E] hover:underline underline-offset-4 cursor-pointer"
                      >
                        <span>Konsultasi pilar ini</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* 3. Fitur Tanya Sahabat AI (Pusat Interaksi Parenting) */}
            <div className="rounded-2xl border border-[#DFD8CA] bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C3D2E]">
                    Pusat Interaksi Parenting
                  </span>
                  <h3 className="mt-0.5 font-display text-base sm:text-lg font-bold text-[#16241D]">
                    3. Fitur Tanya Sahabat AI
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#425249]">
                    Pilih kelompok usia anak lalu klik pertanyaan di bawah untuk langsung berkonsultasi dengan Sahabat Keluarga Papua AI.
                  </p>
                </div>
              </div>

              {/* Age Context Selector */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-xs font-semibold text-[#5C3D2E]">
                  Fokus Usia:
                </span>
                {PARENTING_AGE_FILTERS.map((ageLabel) => {
                  const isActive = selectedParentingAge === ageLabel;
                  return (
                    <button
                      key={ageLabel}
                      type="button"
                      onClick={() => setSelectedParentingAge(ageLabel)}
                      className={`min-h-[34px] rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'border-[#1D4A27] bg-[#1D4A27] text-white'
                          : 'border-[#E2DCCF] bg-[#FAF8F4] text-[#425249] hover:border-[#1D4A27]/50 hover:text-[#16241D]'
                      }`}
                    >
                      {ageLabel}
                    </button>
                  );
                })}
              </div>

              {/* 7 Curated Parenting Questions */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {PARENTING_SAMPLE_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      const promptWithContext =
                        selectedParentingAge === 'Semua Usia'
                          ? question
                          : `[Fokus usia anak: ${selectedParentingAge}] ${question}`;
                      handleAskAI(promptWithContext, 'Pendidikan Anak');
                    }}
                    className="flex min-h-[44px] items-center justify-between gap-2.5 rounded-xl border border-[#E5DFD2] bg-[#FAF8F4] px-3.5 py-2.5 text-left text-xs font-medium text-[#16241D] transition-colors hover:border-[#1D4A27] hover:bg-[#1D4A27] hover:text-white cursor-pointer group"
                  >
                    <span className="flex items-start gap-2">
                      <MessageCircle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1D4A27] group-hover:text-[#F2C22B]"
                        aria-hidden="true"
                      />
                      <span>{question}</span>
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 text-[#5E6D64] group-hover:text-white"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Ketahanan Gizi Keluarga — Pangan Lokal Bergizi dari Papua */}
          <div id="pangan-lokal" className="mt-8 sm:mt-10 space-y-6">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Ketahanan Gizi Keluarga
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#16241D]">
                  Pangan Lokal Bergizi dari Papua
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#425249] max-w-md">
                Ketahanan gizi keluarga dimulai dari dapur rumah sendiri dengan kekayaan alam Papua.
              </p>
            </div>

            {/* Intro Hero Card with Papuan Cuisine Photo */}
            <div className="overflow-hidden rounded-2xl border border-[#E2DCCF] bg-white shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <img
                    src={PAPUA_FOOD_IMAGE_URL}
                    alt="Hidangan pangan lokal bergizi khas Papua: papeda, ikan kuah kuning, ubi jalar, keladi, sayur gedi, pepaya, pisang, dan air bersih"
                    className="h-56 w-full object-cover lg:h-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-7 lg:col-span-7">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C3D2E]">
                    Dapur Sehat Keluarga Papua
                  </span>
                  <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#16241D]">
                    Ketahanan gizi keluarga dimulai dari dapur rumah sendiri.
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#425249]">
                    Papua memiliki kekayaan pangan lokal yang dapat menjadi sumber energi, protein,
                    vitamin, mineral, dan serat bagi keluarga. Pangan lokal bukan sekadar warisan
                    budaya, melainkan modal penting untuk membangun keluarga sehat, mandiri, dan
                    tangguh menghadapi tantangan pangan.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleAskAI(
                          'Bagaimana menyusun menu harian keluarga Papua yang bergizi seimbang dari bahan pangan lokal seperti sagu, ubi, keladi, ikan, dan sayur gedi?',
                          'Keluarga Modern',
                        )
                      }
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] cursor-pointer"
                    >
                      <span>Tanya Rencana Gizi ke Sahabat AI</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Mengenal Pangan Lokal Papua (6 Bahan Pangan) */}
            <div>
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#16241D]">
                  1. Mengenal Pangan Lokal Papua
                </h3>
                <p className="text-xs text-[#425249]">
                  Enam bahan pangan lokal utama untuk memenuhi kebutuhan gizi keluarga.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {LOCAL_NUTRITION_TIPS.map((item) => {
                  const FoodIcon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="flex flex-col justify-between rounded-2xl border border-[#E2DCCF] bg-white p-5 shadow-xs"
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

                        <h4 className="mt-3.5 font-display text-base font-bold text-[#16241D]">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#425249]">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAskAI(item.prompt, 'Keluarga Modern')}
                        className="mt-4 inline-flex min-h-[36px] items-center gap-1.5 self-start text-xs font-semibold text-[#1D4A27] hover:text-[#5C3D2E] hover:underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        <span>Tanya Menu &amp; Gizi AI</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* 2. Prinsip Menu Bergizi & 3. Contoh Menu Satu Hari */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* 2. Prinsip Menu Bergizi Keluarga */}
              <div className="rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs lg:col-span-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3EFE7] text-[#1D4A27]">
                    <Utensils className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#16241D]">
                    2. Prinsip Menu Bergizi Keluarga
                  </h3>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-[#425249]">
                  Pangan lokal perlu dikombinasikan agar kebutuhan gizi keluarga lebih seimbang:
                </p>

                <ul className="mt-4 space-y-2.5">
                  {NUTRITION_PRINCIPLES.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-2.5 rounded-xl bg-[#FAF8F4] px-3.5 py-2.5 text-xs sm:text-sm"
                    >
                      {item.label === 'Air minum' ? (
                        <Droplets
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4A27]"
                          aria-hidden="true"
                        />
                      ) : (
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4A27]"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <span className="font-semibold text-[#16241D]">{item.label}: </span>
                        <span className="text-[#425249]">{item.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Contoh Menu Pangan Lokal Selama Satu Hari */}
              <div className="rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#16241D]">
                    3. Contoh Menu Pangan Lokal Selama Satu Hari
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#425249]">
                    Susunan menu sederhana berbahan lokal Papua dari pagi hingga malam:
                  </p>

                  <div className="mt-4 overflow-hidden rounded-xl border border-[#E5DFD2]">
                    <table className="w-full border-collapse text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#1D4A27] text-white">
                          <th className="px-4 py-2.5 font-display font-semibold w-28">
                            Waktu
                          </th>
                          <th className="px-4 py-2.5 font-display font-semibold">
                            Contoh Menu
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFEAE0]">
                        {DAILY_LOCAL_MENU.map((row) => (
                          <tr key={row.time} className="bg-white hover:bg-[#FAF8F4]">
                            <td className="px-4 py-3 font-semibold text-[#1D4A27]">
                              {row.time}
                            </td>
                            <td className="px-4 py-3 text-[#25352C]">{row.menu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-4 rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3.5 py-2.5 text-xs leading-relaxed text-[#425249]">
                  Menu dapat disesuaikan dengan usia, kebutuhan gizi, ketersediaan pangan, dan kondisi
                  kesehatan setiap anggota keluarga.
                </p>
              </div>
            </div>

            {/* 4. Mengapa Pangan Lokal Penting? */}
            <div className="rounded-2xl border border-[#E2DCCF] bg-white p-5 sm:p-6 shadow-xs">
              <h3 className="font-display text-base sm:text-lg font-bold text-[#16241D]">
                4. Mengapa Pangan Lokal Penting?
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {LOCAL_FOOD_IMPORTANCE.map((reason) => (
                  <div
                    key={reason.number}
                    className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-4"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1D4A27] text-xs font-bold text-white tabular-nums">
                      {reason.number}
                    </span>
                    <h4 className="mt-2.5 font-display text-xs sm:text-sm font-bold text-[#16241D]">
                      {reason.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#425249]">
                      {reason.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Pesan Utama */}
            <div className="relative overflow-hidden rounded-2xl bg-[#1D4A27] p-6 sm:p-8 text-white shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F2C22B]">
                    5. Pesan Utama Ketahanan Gizi
                  </p>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                    PANGAN LOKAL, KELUARGA SEHAT, PAPUA KUAT
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#E7EFE9]">
                    Kekayaan pangan Papua adalah kekuatan keluarga. Mari mengenali, menanam, mengolah,
                    dan mengonsumsi pangan lokal yang beragam dan bergizi. Ketahanan pangan bukan hanya
                    tentang ketersediaan makanan, tetapi juga tentang kecukupan gizi, kesehatan,
                    budaya, dan kesejahteraan keluarga.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleAskAI(
                      'Berikan ide menu pangan lokal Papua yang ramah balita dan lansia untuk satu minggu agar keluarga sehat dan kuat.',
                      'Keluarga Modern',
                    )
                  }
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full bg-[#F2C22B] px-6 py-2.5 text-xs font-bold text-[#16241D] transition-colors hover:bg-[#E0B11F] whitespace-nowrap shrink-0 cursor-pointer lg:self-center"
                >
                  <span>Konsultasi Menu Gizi AI</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
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

        {/* 3-Column Bottom Showcase: Tentang Kami | Kisah dari Tanah Papua | Berita & Info */}
        <section id="tentang" className="py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* Column 1: Tentang Kami */}
              <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2DCCF] bg-white shadow-xs lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2.5 border-b border-[#EFEAE0] bg-[#FAF4E4] px-5 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1D4A27] text-white">
                      <Home className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-base font-bold text-[#16241D]">
                      Tentang Kami
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-12 sm:items-center">
                    <div className="sm:col-span-7">
                      <p className="text-xs sm:text-sm leading-relaxed text-[#2F3F36]">
                        UGUWO KAA OWAA hadir sebagai ruang digital untuk membantu masyarakat Papua
                        memahami kehidupan keluarga, perkawinan, pendidikan anak, dan pentingnya
                        menjaga warisan budaya leluhur di tengah perkembangan zaman.
                      </p>
                    </div>
                    <div className="sm:col-span-5">
                      <img
                        src="/src/assets/images/culture_honai_house_1794999641110.jpg"
                        alt="Rumah adat Honai Papua di lembah pegunungan"
                        loading="lazy"
                        className="h-32 w-full rounded-xl border border-[#E2DCCF] object-cover"
                      />
                    </div>
                  </div>

                  {showAboutDetail && (
                    <div className="mx-5 mb-4 rounded-xl border border-[#DFD8CA] bg-[#FAF8F4] p-3.5 text-xs leading-relaxed text-[#425249]">
                      Platform ini menggabungkan nilai kearifan lokal tujuh wilayah adat Papua,
                      penghormatan penuh terhadap iman dan ajaran agama, serta pendampingan AI yang
                      ramah berbahasa Indonesia dan dialek Papua agar setiap keluarga muda maupun
                      orang tua memiliki teman diskusi yang tulus.
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setShowAboutDetail((prev) => !prev)}
                    className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#265D33] cursor-pointer"
                  >
                    <span>{showAboutDetail ? 'Tutup Penjelasan' : 'Pelajari Lebih Lanjut'}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Column 2: Kisah dari Tanah Papua (4 Photo Gallery) */}
              <div
                id="galeri-papua"
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2DCCF] bg-white shadow-xs lg:col-span-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 border-b border-[#EFEAE0] bg-[#FAF4E4] px-5 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C9A24D] text-[#16241D]">
                      <Feather className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-base font-bold text-[#16241D]">
                      Kisah dari Tanah Papua
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-4 sm:p-5">
                    {GALLERY_IMAGES.map((img, idx) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setSelectedGalleryPhotoIdx(idx)}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E2DCCF] bg-[#E8E2D4] text-left shadow-xs cursor-pointer"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2.5 py-1.5 text-[11px] font-semibold text-white">
                          {img.caption}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="px-5 pb-4 text-[11px] text-[#5E6D64]">
                  Klik salah satu potret untuk membaca kisah budaya &amp; berdiskusi dengan AI.
                </p>
              </div>

              {/* Column 3: Berita & Info */}
              <div
                id="berita-info"
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2DCCF] bg-white shadow-xs lg:col-span-3"
              >
                <div>
                  <div className="flex items-center gap-2.5 border-b border-[#EFEAE0] bg-[#FAF4E4] px-5 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1D4A27] text-white">
                      <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-base font-bold text-[#16241D]">
                      Berita &amp; Info
                    </h2>
                  </div>

                  <ul className="divide-y divide-[#F3EFE7] px-5 py-2">
                    {NEWS_INFO_ITEMS.map((item) => (
                      <li key={item.title}>
                        <button
                          type="button"
                          onClick={() => setNewsModalOpen(true)}
                          className="flex w-full items-center gap-2.5 py-2.5 text-left text-xs font-semibold text-[#16241D] transition-colors hover:text-[#1D4A27] cursor-pointer"
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-[#1D4A27]"
                            aria-hidden="true"
                          />
                          <span>{item.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewsModalOpen(true)}
                    className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full bg-[#F2C22B] px-5 py-2 text-xs font-bold text-[#16241D] transition-colors hover:bg-[#E0B11F] cursor-pointer"
                  >
                    <span>Lihat Semua Berita</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MobileAppSection />
      </main>

      {/* Footer: Deep Forest Green with Papuan Carving Accent */}
      <footer className="relative overflow-hidden bg-[#163B22] text-white">
        <PapuaCarvingCorner className="pointer-events-none absolute right-0 bottom-0 h-28 w-52" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="flex items-center gap-3.5 lg:col-span-4">
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

            <div className="border-t border-white/20 pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
              <p className="text-sm font-medium italic leading-relaxed text-[#F5F2EB]">
                &ldquo;Adat Dijaga, Agama Dihormati,
                <br className="hidden sm:inline" /> Keluarga Dibangun, Generasi Dilindungi.&rdquo;
              </p>
            </div>

            <div className="border-t border-white/20 pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
              <p className="text-sm font-semibold italic leading-relaxed text-[#F2C22B]">
                &ldquo;Bersama Membangun Keluarga Papua yang Sehat, Damai dan Sejahtera&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 border-t border-white/15 pt-5 md:flex-row md:items-center md:justify-between">
            {/* Social Media Section: WhatsApp, Facebook, YouTube, Instagram, TikTok */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F2C22B]">
                Terhubung &amp; Bagikan
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'Mari belajar dan berkonsultasi keluarga bersama UGUWO KAA OWAA – Rumah Keluarga dari Papua: ' +
                      (typeof window !== 'undefined' ? window.location.origin : ''),
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan melalui WhatsApp"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/25 bg-[#12301B] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
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
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/25 bg-[#12301B] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  <span>Facebook</span>
                </a>

                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi YouTube UGUWO KAA OWAA"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/25 bg-[#12301B] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <YouTubeIcon className="h-4 w-4 shrink-0" />
                  <span>YouTube</span>
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi Instagram UGUWO KAA OWAA"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/25 bg-[#12301B] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <InstagramIcon className="h-4 w-4 shrink-0" />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi TikTok UGUWO KAA OWAA"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/25 bg-[#12301B] px-3 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#F2C22B] hover:text-[#F2C22B]"
                >
                  <TikTokIcon className="h-4 w-4 shrink-0" />
                  <span>TikTok</span>
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
                <a href="#unduh-aplikasi" className="hover:text-white">
                  Pasang App
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

      {/* Galeri Foto Kisah dari Tanah Papua Modal */}
      {selectedGalleryPhotoIdx !== null && (() => {
        const photo = GALLERY_IMAGES[selectedGalleryPhotoIdx];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
          >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#DFD8CA] bg-white shadow-2xl">
              <div className="relative aspect-[16/10] bg-[#12301B]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedGalleryPhotoIdx(null)}
                  aria-label="Tutup galeri"
                  className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="p-5 sm:p-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Kisah dari Tanah Papua
                </span>
                <h3
                  id="gallery-modal-title"
                  className="mt-0.5 font-display text-lg font-bold text-[#16241D]"
                >
                  {photo.caption}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#425249]">
                  {photo.story}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const p = photo.prompt;
                      setSelectedGalleryPhotoIdx(null);
                      handleAskAI(p, 'Bahasa & Budaya');
                    }}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
                  >
                    <span>Tanya Sahabat AI</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryPhotoIdx(null)}
                    className="min-h-[40px] rounded-full border border-[#DFD8CA] px-4 py-2 text-xs font-semibold text-[#425249] hover:bg-[#FAF8F4] cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Berita & Info Keluarga Papua Modal */}
      {newsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
        >
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[#DFD8CA] bg-[#FAF8F4] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#EFEAE0] pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  UGUWO KAA OWAA · Informasi Terkini
                </span>
                <h2
                  id="news-modal-title"
                  className="mt-0.5 font-display text-lg sm:text-xl font-bold text-[#16241D]"
                >
                  Berita &amp; Info Keluarga Papua
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setNewsModalOpen(false)}
                aria-label="Tutup berita"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6D64] hover:bg-[#EFEAE0] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {NEWS_INFO_ITEMS.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-[#E2DCCF] bg-white p-4 sm:p-5"
                >
                  <span className="text-[11px] font-semibold text-[#5C3D2E]">
                    {item.category}
                  </span>
                  <h3 className="mt-0.5 font-display text-base font-bold text-[#16241D]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#425249]">
                    {item.summary}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewsModalOpen(false);
                      handleAskAI(item.prompt, 'Keluarga Modern');
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4A27] hover:underline cursor-pointer"
                  >
                    <span>Diskusikan dengan Sahabat AI</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <OfflineIndicator />
    </div>
  );
}
