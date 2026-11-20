export type Bab07Category =
  | 'Kemandirian & Parenting'
  | 'Karier & Dunia Kerja'
  | 'Ekonomi & UMKM Papua'
  | 'Perkawinan & Keluarga';

export interface Bab07Lesson {
  id: string;
  number: string;
  category: Bab07Category;
  title: string;
  summary: string;
  explanation: string[];
  caseExample: string;
  practicalTips: string[];
  actionSteps: string[];
  evaluationQuestion: string;
  aiPrompt: string;
  aiTopic: string;
}

export interface Bab07AgeBand {
  id: '18-21' | '22-25' | '26-30' | '30+';
  label: string;
  shortTitle: string;
  tagline: string;
  goal: string;
  skills: string[];
  challenges: string[];
  guidance: string[];
  aiPrompt: string;
}

export interface Bab07AICard {
  id: string;
  title: string;
  description: string;
  topic: string;
  accentBg: string;
  accentText: string;
  borderAccent: string;
  aiPrompt: string;
  iconName:
    | 'briefcase'
    | 'graduation'
    | 'wallet'
    | 'store'
    | 'heart'
    | 'home'
    | 'utensils'
    | 'smile'
    | 'users'
    | 'compass'
    | 'shield'
    | 'feather';
}

export interface Bab07SubmenuItem {
  id: string;
  label: string;
  targetType: 'age' | 'category' | 'tool' | 'ai';
  targetValue: string;
}

export const BAB07_SUBMENUS: Bab07SubmenuItem[] = [
  {id: 'sub-18-21', label: 'Panduan 18–21', targetType: 'age', targetValue: '18-21'},
  {id: 'sub-22-25', label: 'Panduan 22–25', targetType: 'age', targetValue: '22-25'},
  {id: 'sub-26-30', label: 'Panduan 26–30', targetType: 'age', targetValue: '26-30'},
  {id: 'sub-30-plus', label: 'Panduan 30+', targetType: 'age', targetValue: '30+'},
  {id: 'sub-kerja', label: 'Dunia Kerja', targetType: 'category', targetValue: 'Karier & Dunia Kerja'},
  {id: 'sub-ekonomi', label: 'Kemandirian Ekonomi', targetType: 'tool', targetValue: 'penghasilan'},
  {id: 'sub-umkm', label: 'Kewirausahaan Papua', targetType: 'tool', targetValue: 'umkm'},
  {id: 'sub-nikah', label: 'Persiapan Perkawinan', targetType: 'tool', targetValue: 'perkawinan'},
  {id: 'sub-rumah', label: 'Rumah Tangga', targetType: 'tool', targetValue: 'keluarga'},
  {id: 'sub-ai', label: 'Konsultasi Sahabat AI', targetType: 'ai', targetValue: 'ai-grid'},
];

export const BAB07_LESSONS: Bab07Lesson[] = [
  {
    id: 'l-01',
    number: '01',
    category: 'Kemandirian & Parenting',
    title: 'Filosofi Kedewasaan dan Kemandirian Papua',
    summary: 'Makna dewasa sejati: berdiri di atas kaki sendiri sambil tetap berakar pada hormat adat, iman, dan kasih keluarga.',
    explanation: [
      'Dalam budaya masyarakat Papua di berbagai wilayah adat, kedewasaan tidak hanya diukur dari bertambahnya usia, melainkan dari kesanggupan menjaga kehormatan diri, memikul tanggung jawab pekerjaan, mengelola penghasilan dengan jujur, dan ikut menjaga kedamaian keluarga besar.',
      'Menjadi dewasa muda yang mandiri berarti berani mengambil keputusan hidup secara sadar, tidak menggantungkan seluruh kebutuhan pribadi kepada orang tua, namun tetap memelihara hubungan hangat dengan kampung halaman, tetua adat, serta nilai iman keluarga.',
    ],
    caseExample:
      'Yohanes (21 tahun) dari Sentani baru lulus sekolah kejuruan. Alih-alih menunggu lowongan di satu kantor saja, ia mulai bekerja di bengkel setempat sambil mencatat pengeluaran harian dan menyisihkan sebagian upah untuk membantu adiknya sekolah.',
    practicalTips: [
      'Pisahkan kebutuhan pokok dari keinginan sesaat setiap menerima uang saku atau gaji.',
      'Latih diri mengambil inisiatif di rumah dan komunitas tanpa selalu menunggu disuruh.',
      'Hormati nasihat orang tua sambil belajar menyampaikan rencana hidup Anda dengan sopan dan jelas.',
    ],
    actionSteps: [
      'Tuliskan 3 bidang kemandirian yang ingin Anda capai tahun ini (pekerjaan, tabungan, dan keterampilan).',
      'Diskusikan rencana tersebut secara terbuka bersama orang tua atau wali.',
      'Mulai kebiasaan mencatat seluruh pemasukan dan pengeluaran selama 14 hari pertama.',
    ],
    evaluationQuestion:
      'Keputusan penting apa dalam hidup Anda saat ini yang masih sering Anda serahkan kepada orang lain, dan langkah kecil apa yang bisa Anda ambil sendiri minggu ini?',
    aiPrompt:
      'Jelaskan filosofi kemandirian dewasa muda Papua agar tetap menghormati orang tua dan adat namun mampu mengambil keputusan hidup sendiri.',
    aiTopic: 'Pendidikan Anak',
  },
  {
    id: 'l-02',
    number: '02',
    category: 'Kemandirian & Parenting',
    title: 'Peran Orang Tua dalam Membimbing Anak Usia 18+',
    summary: 'Berubah peran dari pengatur penuh menjadi pendamping, penasihat bijak, dan teman diskusi bagi anak dewasa.',
    explanation: [
      'Ketika anak memasuki usia 18 tahun ke atas, gaya pengasuhan orang tua perlu bergeser dari pola perintah satu arah menuju pola kemitraan dan musyawarah. Anak dewasa muda membutuhkan ruang untuk belajar dari pengalaman kerja, mengelola uangnya sendiri, dan menentukan arah kariernya.',
      'Dukungan terbaik orang tua pada fase ini adalah doa, kepercayaan, ruang aman untuk berdiskusi tanpa merendahkan, serta bimbingan adat dan nilai hidup ketika anak menghadapi persimpangan penting.',
    ],
    caseExample:
      'Mama Tabita di Manokwari tidak lagi mengatur jadwal harian putrinya yang kuliah sambil berjualan kue sagu, melainkan mengajak berdiskusi setiap akhir pekan tentang tantangan kuliah, keuangan usaha, dan kesehatan fisik putrinya.',
    practicalTips: [
      'Ganti kalimat menyalahkan dengan pertanyaan terbuka: "Menurut ko, opsi mana yang paling baik?"',
      'Izinkan anak belajar mengelola gajinya sendiri meski sesekali melakukan kesalahan kecil.',
      'Jangan membandingkan jalur hidup atau waktu menikah anak dengan saudara atau tetangga.',
    ],
    actionSteps: [
      'Jadwalkan obrolan santai 20 menit seminggu sekali antara orang tua dan anak dewasa muda.',
      'Sepakati batas bantuan finansial agar anak terdorong mencari penghasilan mandiri.',
      'Berikan apresiasi tulus setiap kali anak menunjukkan tanggung jawab baru.',
    ],
    evaluationQuestion:
      'Sebagai orang tua atau dewasa muda, bagaimana pola komunikasi paling sehat yang perlu diperbaiki di rumah agar tidak ada jarak atau rasa takut berbicara?',
    aiPrompt:
      'Bagaimana cara orang tua di Papua mendampingi anak usia 18 tahun ke atas agar tidak terlalu mengekang tetapi tetap memberi arah nilai adat dan iman?',
    aiTopic: 'Pendidikan Anak',
  },
  {
    id: 'l-03',
    number: '03',
    category: 'Kemandirian & Parenting',
    title: 'Delapan Pilar Parenting Dewasa Muda',
    summary: 'Delapan fondasi utuh: iman, karakter, literasi kerja, keuangan, pangan lokal, kesehatan mental, relasi sehat, dan adat.',
    explanation: [
      'Menghadapi masa transisi menuju kemandirian penuh memerlukan delapan pilar penguat: (1) Iman & integritas moral, (2) Kemandirian ekonomi, (3) Kecakapan kerja & belajar sepanjang hayat, (4) Kesehatan fisik & gizi lokal, (5) Kematangan emosi & kesehatan mental, (6) Relasi sehat & kesetaraan, (7) Tanggung jawab keluarga besar yang terukur, serta (8) Kebanggaan bahasa ibu dan 7 wilayah adat Papua.',
      'Kedelapan pilar ini saling menopang sehingga generasi muda Papua tidak mudah goyah saat merantau ke kota studi/kerja maupun saat membangun usaha di daerah asal.',
    ],
    caseExample:
      'Sekelompok mahasiswa Papua di Jayapura membentuk komunitas belajar mingguan yang menggabungkan pelatihan komputer, diskusi literasi keuangan, serta memasak bersama pangan lokal Papua agar tetap sehat di perantauan.',
    practicalTips: [
      'Evaluasi kedelapan pilar tiap 3 bulan untuk melihat area mana yang paling lemah.',
      'Carilah minimal satu mentor atau kakak pembimbing yang sejalan dengan nilai hidup Anda.',
      'Jaga keseimbangan antara ambisi karier, kesehatan tubuh, dan relasi keluarga.',
    ],
    actionSteps: [
      'Beri skor 1–5 untuk kondisi Anda pada masing-masing dari 8 pilar saat ini.',
      'Pilih 2 pilar dengan skor terendah sebagai fokus perbaikan 30 hari ke depan.',
      'Ikuti kegiatan positif komunitas atau gereja/masjid/adat yang mendukung pilar tersebut.',
    ],
    evaluationQuestion:
      'Dari 8 pilar dewasa muda tersebut, pilar mana yang paling kuat dalam diri Anda dan pilar mana yang paling membutuhkan pendampingan saat ini?',
    aiPrompt:
      'Bantu saya mengevaluasi 8 pilar kesiapan dewasa muda Papua dan susun langkah perbaikan sederhana untuk 1 bulan ke depan.',
    aiTopic: 'Pendidikan Anak',
  },
  {
    id: 'l-04',
    number: '04',
    category: 'Karier & Dunia Kerja',
    title: 'Pendidikan dan Peningkatan Keterampilan',
    summary: 'Menggabungkan pendidikan formal, kursus vokasi, magang, dan literasi digital agar siap bersaing.',
    explanation: [
      'Ijazah formal tetap penting, namun dunia kerja dan wirausaha modern sangat menilai keterampilan nyata (hard skills dan soft skills). Dewasa muda Papua memiliki peluang besar di bidang pariwisata berkelanjutan, pengolahan hasil laut & perkebunan, teknologi digital, pendidikan, kesehatan masyarakat, serta teknik terapan.',
      'Balai Latihan Kerja (BLK), program magang daerah, sertifikasi profesi BNSP, dan kursus daring gratis dapat dimanfaatkan untuk memperkaya portofolio tanpa harus selalu menunggu biaya besar.',
    ],
    caseExample:
      'Petrus (20 tahun) di Biak mengikuti pelatihan kelistrikan dasar di BLK setempat, lalu mendokumentasikan hasil praktik instalasi rapi ke dalam portofolio foto yang membantunya diterima bekerja di kontraktor lokal.',
    practicalTips: [
      'Pilih keterampilan yang dibutuhkan di kabupaten/kota tempat Anda tinggal atau daerah tujuan kerja.',
      'Latih literasi digital dasar: mengetik rapi, mengirim email profesional, serta mengelola spreadsheet sederhana.',
      'Biasakan belajar 30 menit setiap hari dari buku, mentor lapangan, atau materi terbuka terpercaya.',
    ],
    actionSteps: [
      'Identifikasi 2 keterampilan teknis dan 2 keterampilan komunikasi yang paling dicari di bidang minat Anda.',
      'Cari informasi kursus vokasi, BLK, atau program magang resmi di dinas tenaga kerja setempat.',
      'Buat proyek kecil atau pengalaman praktik nyata sebagai bukti keahlian Anda.',
    ],
    evaluationQuestion:
      'Keterampilan praktis apa yang jika Anda kuasai dalam 3 bulan ke depan akan langsung meningkatkan peluang kerja atau usaha Anda?',
    aiPrompt:
      'Keterampilan kerja dan vokasi apa saja yang paling potensial untuk dewasa muda Papua dan bagaimana cara mulai mempelajarinya dengan biaya terjangkau?',
    aiTopic: 'Pendidikan Anak',
  },
  {
    id: 'l-05',
    number: '05',
    category: 'Karier & Dunia Kerja',
    title: 'Persiapan Memasuki Dunia Kerja',
    summary: 'Strategi mencari lowongan resmi, memahami alur rekrutmen, persiapan wawancara, dan kewaspadaan terhadap penipuan.',
    explanation: [
      'Memasuki dunia kerja memerlukan riset lowongan yang terstruktur melalui portal resmi pemerintah (SIAPkerja Kemnaker), bursa kerja daerah, pengumuman instansi tepercaya, serta jejaring alumni dan komunitas.',
      'Calon pelamar perlu waspada terhadap penipuan berkedok lowongan kerja yang meminta transfer uang di awal untuk biaya seragam, tiket, atau jaminan penerimaan. Rekrutmen yang kredibel menilai kompetensi, kesiapan mental, dan integritas.',
    ],
    caseExample:
      'Maria (23 tahun) lulusan kesehatan masyarakat di Merauke melatih jawaban wawancara di depan cermin bersama kakaknya dan memeriksa akurasi dokumen sebelum melamar melalui situs resmi rumah sakit daerah.',
    practicalTips: [
      'Jangan pernah membayar uang muka apa pun demi dijanjikan lolos seleksi kerja.',
      'Pelajari profil lembaga/perusahaan sebelum datang wawancara agar jawaban Anda relevan.',
      'Siapkan salinan digital KTP, ijazah, transkrip, dan sertifikat dalam satu folder rapi.',
    ],
    actionSteps: [
      'Riset 5 lembaga, instansi, atau usaha lokal yang sesuai dengan minat dan latar belakang Anda.',
      'Lakukan simulasi wawancara 15 menit bersama teman atau anggota keluarga.',
      'Catat setiap lamaran yang dikirim beserta tanggal dan tindak lanjutnya.',
    ],
    evaluationQuestion:
      'Apa kekhawatiran terbesar Anda saat menghadapi proses melamar kerja atau wawancara, dan bagaimana cara Anda berlatih mengatasinya?',
    aiPrompt:
      'Bantu saya berlatih tanya-jawab wawancara kerja yang sopan, percaya diri, dan profesional untuk pelamar dewasa muda Papua.',
    aiTopic: 'Keluarga Modern',
  },
  {
    id: 'l-06',
    number: '06',
    category: 'Karier & Dunia Kerja',
    title: 'Pembuatan CV dan Surat Lamaran Efektif',
    summary: 'Menyusun daftar riwayat hidup yang ringkas, jujur, bebas salah ketik, dan menonjolkan pengalaman nyata.',
    explanation: [
      'Curriculum Vitae (CV) yang baik umumnya cukup 1–2 halaman, terstruktur rapi, mudah dibaca dalam 30 detik pertama, serta menonjolkan pencapaian atau pengalaman organisasi/magang/kerja nyata—bukan sekadar daftar tugas.',
      'Surat lamaran kerja harus disesuaikan dengan posisi yang dituju, menyebutkan secara singkat alasan ketertarikan Anda serta kontribusi keterampilan yang siap diberikan, ditulis dengan bahasa Indonesia baku yang santun.',
    ],
    caseExample:
      'Alih-alih menulis "Saya pekerja keras" tanpa bukti, Lukas menuliskan: "Aktif mengelola logistik kegiatan pemuda gereja untuk 150 peserta dengan laporan anggaran transparan dan tepat waktu."',
    practicalTips: [
      'Gunakan alamat email yang profesional (misalnya namalengkap@...) dan nomor HP/WhatsApp aktif.',
      'Sertakan pengalaman relawan, pengurus organisasi mahasiswa/pemuda, atau usaha keluarga sebagai bukti inisiatif.',
      'Periksa ulang ejaan dan simpan CV dalam format PDF sebelum dikirim.',
    ],
    actionSteps: [
      'Kumpulkan seluruh data riwayat pendidikan, pelatihan, organisasi, dan pengalaman kerja Anda.',
      'Gunakan Generator CV & Surat Lamaran di halaman ini untuk menyusun draf pertama.',
      'Minta satu orang yang Anda percaya untuk membaca ulang sebelum dikirim.',
    ],
    evaluationQuestion:
      'Pengalaman organisasi, kerja paruh waktu, atau proyek nyata apa yang selama ini belum Anda masukkan ke dalam CV Anda?',
    aiPrompt:
      'Tolong tinjau dan perbaiki kalimat perkenalan serta poin pengalaman kerja untuk CV dan surat lamaran saya agar terlihat lebih profesional.',
    aiTopic: 'Keluarga Modern',
  },
  {
    id: 'l-07',
    number: '07',
    category: 'Karier & Dunia Kerja',
    title: 'Etika Profesional dan Hak Pekerja',
    summary: 'Memahami disiplin kerja, komunikasi atasan-rekan, kontrak kerja tertulis, upah layak, K3, dan jaminan sosial.',
    explanation: [
      'Di tempat kerja, integritas tercermin dari ketepatan waktu, menjaga rahasia kerja, menghargai rekan lintas suku dan agama, serta berani melapor dengan sopan bila ada kendala teknis.',
      'Pada saat yang sama, pekerja perlu memahami hak dasarnya sesuai ketentuan ketenagakerjaan di Indonesia: hak atas perjanjian kerja tertulis, informasi besaran upah & waktu pembayaran, jam kerja dan istirahat yang manusiawi, keselamatan dan kesehatan kerja (K3), perlindungan dari diskriminasi/pelecehan, serta kepesertaan BPJS Kesehatan dan BPJS Ketenagakerjaan.',
    ],
    caseExample:
      'Sebelum menandatangani kontrak kerja di perusahaan logistik di Sorong, Naomi membaca dengan teliti poin jam lembur, masa percobaan, dan jaminan BPJS Ketenagakerjaan serta bertanya sopan kepada HRD mengenai bagian yang kurang jelas.',
    practicalTips: [
      'Selalu baca perjanjian kerja sebelum menandatangani dan minta salinannya.',
      'Komunikasikan izin atau keterlambatan darurat lebih awal kepada atasan langsung.',
      'Catat riwayat jam kerja dan slip gaji sebagai arsip pribadi.',
    ],
    actionSteps: [
      'Pelajari komponen utama kontrak kerja (status PKWT/PKWTT, upah pokok, tunjangan, dan durasi).',
      'Pastikan kepesertaan jaminan kesehatan dan ketenagakerjaan Anda aktif.',
      'Latih komunikasi asertif yang santun saat menyampaikan hak atau masukan di tempat kerja.',
    ],
    evaluationQuestion:
      'Apa saja isi kontrak kerja yang wajib Anda pahami terlebih dahulu sebelum menyatakan setuju bekerja di suatu tempat?',
    aiPrompt:
      'Jelaskan hak dasar pekerja menurut aturan ketenagakerjaan di Indonesia dan cara membaca kontrak kerja agar dewasa muda tidak dirugikan.',
    aiTopic: 'Keluarga Modern',
  },
  {
    id: 'l-08',
    number: '08',
    category: 'Ekonomi & UMKM Papua',
    title: 'Kemandirian Ekonomi Keluarga',
    summary: 'Membangun pondasi rumah tangga yang tidak bergantung pada utang konsumtif melalui kesadaran arus kas.',
    explanation: [
      'Kemandirian ekonomi bukan berarti langsung hidup mewah, melainkan mampu mencukupi kebutuhan dasar sendiri secara konsisten, siap menghadapi keadaan tak terduga tanpa panik berutang, serta punya rencana bertumbuh.',
      'Kesalahan paling sering pada dewasa muda adalah menaikkan gaya hidup terlalu cepat saat mulai berpenghasilan (membeli barang cicilan demi gengsi), sehingga tidak ada sisa untuk tabungan maupun keadaan darurat keluarga.',
    ],
    caseExample:
      'Meski baru menerima gaji UMR pertamanya di Jayapura, Daniel memilih tinggal di rumah sewa sederhana bersama sepupu yang sevisi agar ia bisa melunasi biaya kursus adik dan menyisihkan dana darurat.',
    practicalTips: [
      'Bedakan dengan tegas antara kebutuhan hidup (pangan, tempat tinggal, transport, kesehatan) dan keinginan gengsi.',
      'Hindari pinjaman online berbunga tinggi untuk kebutuhan konsumtif.',
      'Bangun kebiasaan meninjau arus kas setiap akhir bulan.',
    ],
    actionSteps: [
      'Hitung total biaya hidup wajib Anda selama 1 bulan menggunakan Kalkulator Penghasilan & Pengeluaran.',
      'Tetapkan batas maksimal pengeluaran non-esensial bulanan.',
      'Susun target 6 bulan untuk bebas dari utang konsumtif.',
    ],
    evaluationQuestion:
      'Pengeluaran kecil namun rutin apa yang paling sering menguras uang Anda setiap minggu tanpa disadari?',
    aiPrompt:
      'Bagaimana strategi membangun kemandirian ekonomi keluarga Papua dari gaji pertama tanpa terjebak utang konsumtif atau pinjaman online?',
    aiTopic: 'Ekonomi Keluarga',
  },
  {
    id: 'l-09',
    number: '09',
    category: 'Ekonomi & UMKM Papua',
    title: 'Pengelolaan Uang, Tabungan dan Dana Darurat',
    summary: 'Formula pembagian penghasilan realistis, rekening terpisah, dan target dana darurat 3–6 bulan.',
    explanation: [
      'Prinsip dasar pengelolaan keuangan pribadi yang banyak direkomendasikan pakar literasi keuangan adalah menyisihkan tabungan di awal saat uang diterima ("bayar diri sendiri lebih dulu"), bukan menabung sisa belanja di akhir bulan.',
      'Sebagai acuan fleksibel: 50–60% untuk kebutuhan pokok & kewajiban penting, 15–20% untuk tabungan/dana darurat/pendidikan, 10–15% untuk dukungan keluarga besar atau pelayanan sosial yang terencana, dan sisanya untuk kebutuhan pribadi secukupnya. Dana darurat idealnya mencapai 3 hingga 6 kali pengeluaran bulanan wajib.',
    ],
    caseExample:
      'Siska membuka dua rekening terpisah: satu rekening untuk transaksi harian dan satu rekening tanpa kartu ATM khusus dana darurat serta tabungan modal usaha.',
    practicalTips: [
      'Pisahkan uang tabungan di rekening atau celengan terkunci begitu menerima gaji.',
      'Mulai dari nominal yang sanggup dilakukan secara konsisten meski kecil, lalu naikkan bertahap.',
      'Gunakan dana darurat hanya untuk sakit, kehilangan pekerjaan, atau musibah keluarga mendesak.',
    ],
    actionSteps: [
      'Masukkan pengeluaran wajib bulanan Anda ke Kalkulator Dana Darurat di modul ini.',
      'Tentukan nominal transfer otomatis atau sisihan rutin setiap tanggal gajian.',
      'Tinjau saldo tabungan setiap tanggal 1 bersama pasangan atau sebagai refleksi pribadi.',
    ],
    evaluationQuestion:
      'Jika penghasilan Anda berhenti selama 2 bulan karena keadaan darurat, seberapa siap tabungan Anda saat ini menopang kebutuhan dasar?',
    aiPrompt:
      'Buatkan contoh pembagian anggaran bulanan realistis untuk pekerja muda Papua yang juga ingin menabung dana darurat dan membantu orang tua.',
    aiTopic: 'Ekonomi Keluarga',
  },
  {
    id: 'l-10',
    number: '10',
    category: 'Ekonomi & UMKM Papua',
    title: 'Kewirausahaan Berbasis Potensi Lokal Papua',
    summary: 'Mengubah kekayaan alam, kuliner, kerajinan Noken, kopi, dan jasa lokal menjadi usaha bertumbuh dan jujur.',
    explanation: [
      'Tanah Papua kaya akan potensi usaha lokal: olahan sagu dan umbi-umbian bernilai tambah, kopi pegunungan Wamena/Moanemani/Bintang, hasil laut dan ikan asap, buah merah/minyak herbal terstandar izin edar, anyaman Noken & ukiran tradisional yang menghormati hak cipta budaya, hingga jasa digital dan logistik antarkampung.',
      'Kunci UMKM bertahan bukanlah modal raksasa di hari pertama, melainkan validasi pembeli nyata, pemisahan uang usaha dan uang dapur, kualitas produk yang konsisten, serta kejujuran pelayanan. Tidak ada usaha yang otomatis untung tanpa kerja keras, pembukuan rapi, dan adaptasi pasar.',
    ],
    caseExample:
      'Kelompok pemuda di Wamena mengemas kopi sangrai lokal dalam kemasan kedap udara berlabel rapi dengan kisah petani setempat, lalu menjualnya ke kedai kopi kota dan pemesanan daring sebelum memproduksi dalam jumlah besar.',
    practicalTips: [
      'Mulailah dari skala uji coba (pre-order atau produksi kecil) agar tidak rugi menumpuk stok.',
      'Pisahkan dompet pribadi dengan kas usaha meskipun jualan dilakukan dari dapur rumah.',
      'Pelajari legalitas usaha resmi seperti NIB (OSS) dan PIRT/Halal bila menjual produk pangan kemasan.',
    ],
    actionSteps: [
      'Gunakan Perencana Usaha UMKM Papua di bawah untuk memetakan ide produk dan target pembeli.',
      'Hitung modal awal serta titik balik modal memakai Kalkulator Modal & Keuntungan.',
      'Lakukan wawancara kepada 5 calon pembeli potensial tentang harga dan kemasan yang mereka harapkan.',
    ],
    evaluationQuestion:
      'Potensi lokal apa di sekitar distrik atau kampung Anda yang paling sering dicari orang namun belum dikemas atau dilayani dengan baik?',
    aiPrompt:
      'Bantu saya merancang ide UMKM berbasis potensi lokal Papua yang realistis dimulai dengan modal terukur dan risiko kecil.',
    aiTopic: 'Ekonomi Keluarga',
  },
  {
    id: 'l-11',
    number: '11',
    category: 'Ekonomi & UMKM Papua',
    title: 'Pengembangan Pangan Lokal Bernilai Gizi dan Ekonomi',
    summary: 'Menjadikan sagu, keladi, ubi, daun gedi, dan ikan lokal sebagai sumber gizi keluarga sekaligus produk pangan sehat.',
    explanation: [
      'Pangan lokal Papua bukan makanan kelas dua, melainkan aset ketahanan gizi dan ekonomi keluarga. Mengonsumsi sagu, ubi jalar oranye kaya beta-karoten, keladi, ikan kaya omega-3, serta sayuran hijau seperti daun gedi menjaga kesehatan generasi muda sekaligus menekan ketergantungan pada pangan impor berharga tinggi.',
      'Dari sisi usaha, inovasi pangan lokal—seperti tepung sagu higienis, keripik keladi rendah minyak, sambal ikan asar kemasan, atau katering makan siang bergizi berbasis bahan lokal—memiliki prospek pasar keluarga dan perkantoran yang kuat.',
    ],
    caseExample:
      'Ibu Ruth bersama anak perempuannya yang baru lulus tata boga mengemas paket menu keluarga "Papeda & Ikan Kuah Kuning Siap Masak" lengkap dengan bumbu kuning alami untuk pekerja sibuk di Jayapura.',
    practicalTips: [
      'Pastikan keladi, talas, dan bahan lokal diolah matang dan higienis untuk keamanan pangan.',
      'Utamakan bahan segar dari mama-mama pasar setempat untuk menggerakkan ekonomi kampung.',
      'Kombinasikan karbohidrat lokal, protein ikan/telur/kacang, dan sayur hijau dalam setiap menu.',
    ],
    actionSteps: [
      'Pilih 2 bahan pangan lokal utama di daerah Anda dan cari cara olahan sehat yang disukai anak muda.',
      'Rancang variasi menu mingguan keluarga menggunakan minimal 70% bahan lokal.',
      'Jika berminat berjualan, uji coba resep bersama keluarga dan tetangga terdekat lebih dulu.',
    ],
    evaluationQuestion:
      'Olahan pangan lokal Papua apa yang paling Anda sukai dan bagaimana cara membuatnya lebih praktis dinikmati anak muda di kota?',
    aiPrompt:
      'Berikan ide pengolahan pangan lokal Papua (sagu, ubi, keladi, ikan) yang sehat untuk menu harian dewasa muda sekaligus berpeluang menjadi usaha rumahan.',
    aiTopic: 'Ketahanan Gizi',
  },
  {
    id: 'l-12',
    number: '12',
    category: 'Perkawinan & Keluarga',
    title: 'Kematangan Emosional dan Hubungan Sehat',
    summary: 'Mengenali emosi diri, membangun komunikasi tanpa kekerasan, dan membedakan cinta sehat dengan kontrol berlebihan.',
    explanation: [
      'Kematangan emosional terlihat dari kemampuan menahan amarah saat kecewa, berani meminta maaf ketika salah, mendengarkan sudut pandang orang lain, serta menyelesaikan masalah dengan musyawarah—bukan dengan bentakan, ancaman, atau kekerasan fisik.',
      'Hubungan yang sehat berdiri di atas rasa aman, saling menghargai martabat, kejujuran, serta kebebasan masing-masing untuk bertumbuh. Kekerasan dalam pacaran atau rumah tangga bukanlah bentuk kasih sayang maupun tradisi yang patut dipertahankan.',
    ],
    caseExample:
      'Ketika terjadi salah paham soal jadwal kerja dan pertemuan keluarga, Amos memilih menenangkan diri selama 20 menit sebelum berbicara baik-baik dengan pasangannya menggunakan kalimat "Saya merasa..." alih-alih menuduh.',
    practicalTips: [
      'Terapkan jeda tenang saat emosi memuncak sebelum mengambil keputusan atau mengirim pesan.',
      'Waspadai tanda hubungan tidak sehat: pencemburuan ekstrem, pengisolasian dari keluarga, atau kekerasan verbal/fisik.',
      'Berani mencari konseling dari pendamping rohani, psikolog, atau tokoh tepercaya bila relasi terasa menyakitkan.',
    ],
    actionSteps: [
      'Latih kebiasaan mendengarkan pasangan atau anggota keluarga selama 3 menit tanpa memotong pembicaraan.',
      'Catat pemicu stres utama Anda dan cara sehat meredakannya (olahraga, doa, musik, bercerita).',
      'Diskusikan batas-batas saling menghormati dalam hubungan yang sedang atau akan Anda jalani.',
    ],
    evaluationQuestion:
      'Bagaimana reaksi Anda biasanya saat sedang sangat marah atau tertekan, dan kebiasaan baru apa yang perlu dilatih agar tetap tenang dan hormat?',
    aiPrompt:
      'Bagaimana ciri-ciri hubungan sehat bagi dewasa muda Papua dan cara mengelola emosi agar komunikasi bebas dari kekerasan?',
    aiTopic: 'Keluarga Harmonis',
  },
  {
    id: 'l-13',
    number: '13',
    category: 'Perkawinan & Keluarga',
    title: 'Persiapan Perkawinan Secara Sadar dan Bertanggung Jawab',
    summary: 'Menimbang kesiapan mental, ekonomi, iman, dan kesepahaman visi hidup—tanpa paksaan usia maupun tekanan sosial.',
    explanation: [
      'Menikah adalah keputusan besar seumur hidup yang membutuhkan kesiapan mental, kemandirian nafkah, kemampuan mengelola konflik, serta kesepahaman nilai iman dan keluarga—bukan sekadar pelarian dari kesepian atau tekanan pertanyaan orang sekitar.',
      'Setiap orang dewasa muda berhak menentukan kesiapan waktunya secara matang. Sebelum melangkah ke pernikahan, calon pasangan dianjurkan mengikuti bimbingan pranikah dari gereja/KUA/lembaga agama serta melakukan diskusi terbuka mengenai keuangan, tempat tinggal, pekerjaan masing-masing, dan pengasuhan anak.',
    ],
    caseExample:
      'Pasangan muda di Timika sepakat menunda resepsi besar selama 1 tahun agar keduanya menyelesaikan pelatihan kerja, melunasi tanggungan pendidikan, dan mengikuti kelas bimbingan pranikah dengan tenang.',
    practicalTips: [
      'Bicarakan hal-hal sensitif sebelum menikah: utang lama, bantuan keluarga besar, dan pola asuh.',
      'Jangan menikah hanya karena desakan umur atau perbandingan dengan teman sebaya.',
      'Pastikan perkawinan kelak dicatatkan secara resmi oleh negara demi perlindungan hukum keluarga.',
    ],
    actionSteps: [
      'Buat daftar 10 pertanyaan diskusi pranikah mengenai nilai iman, keuangan, pekerjaan, dan keluarga.',
      'Ikuti konseling pranikah bersama pemuka agama atau penasihat keluarga tepercaya.',
      'Gunakan Perencana Anggaran Perkawinan untuk menghitung kesiapan biaya secara realistis.',
    ],
    evaluationQuestion:
      'Aspek kesiapan pernikahan mana (mental, komunikasi, pekerjaan, atau kesepakatan keluarga) yang menurut Anda paling perlu diperkuat sebelum melangkah?',
    aiPrompt:
      'Apa saja topik penting yang wajib dibahas bersama calon pasangan sebelum memutuskan menikah agar rumah tangga kelak kuat dan damai?',
    aiTopic: 'Perkawinan Adat',
  },
  {
    id: 'l-14',
    number: '14',
    category: 'Perkawinan & Keluarga',
    title: 'Adat, Agama dan Mas Kawin Bijak di 7 Wilayah Adat',
    summary: 'Menghormati keberagaman tradisi di Mamta/Tabi, Saireri, Domberai, Bomberai, Mee Pago, Lapago, dan Anim Ha.',
    explanation: [
      'Papua memiliki kekayaan tradisi perkawinan yang beragam antar suku dan 7 wilayah adat. Bentuk penghargaan adat—seperti piring gantung di Saireri, kain timur di Domberai, musyawarah marga di Mamta/Tabi, falsafah Satu Tungku Tiga Batu di Bomberai, maupun tradisi di Mee Pago, Lapago, dan Anim Ha—memiliki makna luhur masing-masing yang tidak boleh disamaratakan.',
      'Dalam semangat bijak masa kini, banyak tetua adat dan pemimpin agama mendorong agar prosesi adat dan mas kawin dijalankan lewat musyawarah penuh kasih, sesuai kesanggupan keluarga pengantin, serta beriringan harmonis dengan pemberkatan agama sehingga pasangan baru tidak memulai rumah tangga dalam lilitan utang.',
    ],
    caseExample:
      'Dua keluarga lintas suku (Biak dan Wamena) mengadakan pertemuan perkenalan lebih awal agar masing-masing memahami tata cara penghormatan orang tua pihak perempuan dan menyepakati rangkaian acara yang sederhana namun bermartabat.',
    practicalTips: [
      'Pelajari adat istiadat daerah pasangan secara langsung dari tetua atau orang tua kedua belah pihak.',
      'Libatkan juru bicara keluarga yang bijak dan mengutamakan persatuan daripada gengsi.',
      'Sepakati jadwal bertahap bila ada bagian penghargaan adat yang diselesaikan dengan gotong royong keluarga.',
    ],
    actionSteps: [
      'Kenali tata cara musyawarah keluarga di wilayah adat Anda dan pasangan.',
      'Susun anggaran adat secara transparan bersama orang tua sejak awal perencanaan.',
      'Pastikan prosesi adat, pemberkatan agama, dan pencatatan sipil terkoordinasi rapi.',
    ],
    evaluationQuestion:
      'Bagaimana cara keluarga Anda membangun dialog yang santun dengan tetua adat agar nilai luhur tradisi tetap dihormati sekaligus menjaga masa depan ekonomi pasangan muda?',
    aiPrompt:
      'Bagaimana cara bijak menyelaraskan tradisi adat yang beragam di Papua dengan kesiapan ekonomi pasangan muda dalam musyawarah pernikahan?',
    aiTopic: 'Lintas Suku',
  },
  {
    id: 'l-15',
    number: '15',
    category: 'Perkawinan & Keluarga',
    title: 'Perencanaan Rumah Tangga Sehat dan Setara',
    summary: 'Pembagian peran adil di rumah, tata kelola keuangan bersama, dan kebiasaan musyawarah rumah tangga.',
    explanation: [
      'Rumah tangga modern di Papua dibangun melalui kerja sama suami dan istri sebagai mitra sejajar. Baik suami maupun istri dapat berbagi tugas mencari nafkah, merawat rumah, mendampingi anak belajar, dan menjaga kesehatan keluarga dengan saling menghormati.',
      'Transparansi keuangan—mengetahui bersama berapa penghasilan masuk, cicilan atau kewajiban, dan rencana tabungan—adalah salah satu pelindung utama keharmonisan pernikahan.',
    ],
    caseExample:
      'Di Fakfak, pasangan guru dan perawat membuat jadwal bergantian mengantar anak, memasak bahan lokal, serta rapat keuangan keluarga kecil setiap tanggal 28 sambil minum teh hangat bersama.',
    practicalTips: [
      'Susun pembagian pekerjaan rumah yang adil terutama jika suami dan istri sama-sama bekerja.',
      'Jangan menyembunyikan utang atau transaksi keuangan besar dari pasangan.',
      'Jaga privasi rumah tangga; selesaikan perbedaan kecil berdua sebelum melibatkan pihak luar kecuali ada bahaya/krisis.',
    ],
    actionSteps: [
      'Buat pembagian peran harian di rumah secara tertulis dan fleksibel.',
      'Gunakan Perencana Keuangan Keluarga di halaman ini untuk menyusun pos belanja dan tabungan.',
      'Jadwalkan evaluasi bulanan rumah tangga dalam suasana santai dan saling mengapresiasi.',
    ],
    evaluationQuestion:
      'Kebiasaan kecil apa di dalam rumah tangga yang paling mempererat kekompakan suami dan istri setiap minggu?',
    aiPrompt:
      'Bagaimana tips membangun pembagian peran rumah tangga yang adil dan keterbukaan keuangan bagi pasangan muda Papua?',
    aiTopic: 'Keluarga Harmonis',
  },
  {
    id: 'l-16',
    number: '16',
    category: 'Perkawinan & Keluarga',
    title: 'Kesehatan Reproduksi dan Perencanaan Keluarga',
    summary: 'Informasi kesehatan reproduksi berbasis sains, pencegahan stunting sejak pranikah, dan hak keputusan keluarga yang sehat.',
    explanation: [
      'Kesehatan reproduksi adalah bagian penting dari martabat dan kesejahteraan keluarga. Bagi dewasa muda, menjaga kebersihan organ reproduksi, menghindari perilaku berisiko infeksi menular seksual (IMS/HIV), memeriksakan kesehatan pranikah (seperti status gizi, anemia/Hb, dan imunisasi TT bagi calon ibu), serta berkonsultasi ke Puskesmas atau tenaga kesehatan merupakan langkah cerdas.',
      'Perencanaan keluarga—termasuk jarak kelahiran yang sehat dan kesiapan ekonomi serta emosional sebelum memiliki anak—adalah keputusan bebas dan bertanggung jawab dari pasangan suami-istri bersama tenaga kesehatan, tanpa paksaan dari pihak mana pun.',
    ],
    caseExample:
      'Sebelum menikah, pasangan muda di Nabire memeriksakan kesehatan dasar di Puskesmas terdekat dan berkonsultasi dengan bidan mengenai gizi kaya zat besi dari sayur lokal dan ikan untuk mencegah anemia serta stunting di masa depan.',
    practicalTips: [
      'Cek kesehatan pra-nikah dan status gizi secara rutin di Puskesmas atau fasilitas kesehatan resmi.',
      'Pastikan asupan zat besi, asam folat, protein ikan, dan air bersih terjaga sejak usia muda.',
      'Diskusikan rencana jumlah dan jarak anak secara sehat dan setara bersama pasangan serta bidan/dokter.',
    ],
    actionSteps: [
      'Catat jadwal pemeriksaan kesehatan rutin minimal setahun sekali di Kalender Keluarga.',
      'Pelajari layanan konsultasi kesehatan reproduksi ramah remaja dan keluarga di Puskesmas.',
      'Bangun dialog sehat dan saling menghormati dengan pasangan terkait keputusan kesehatan keluarga.',
    ],
    evaluationQuestion:
      'Langkah pencegahan kesehatan apa yang bisa Anda mulai bulan ini untuk menjaga kebugaran dan kesiapan keluarga sehat?',
    aiPrompt:
      'Apa saja pemeriksaan kesehatan pranikah dan kebiasaan gizi lokal Papua yang disarankan tenaga kesehatan untuk mencegah anemia dan stunting?',
    aiTopic: 'Ketahanan Gizi',
  },
  {
    id: 'l-17',
    number: '17',
    category: 'Perkawinan & Keluarga',
    title: 'Tanggung Jawab Kepada Orang Tua dan Keluarga Besar',
    summary: 'Menghormati orang tua dan solidaritas marga dengan batasan keuangan dan waktu yang bijaksana.',
    explanation: [
      'Nilai berbakti kepada orang tua dan menopang saudara adalah kekuatan indah masyarakat Papua. Namun agar solidaritas ini berkelanjutan dan tidak melumpuhkan masa depan rumah tangga muda, dukungan finansial kepada keluarga besar perlu direncanakan dalam anggaran yang jelas dan dibicarakan secara terbuka.',
      'Membantu keluarga besar tidak selalu harus berupa uang tunai; bisa pula berupa dukungan pendidikan adik, menghubungkan peluang kerja/usaha, atau membantu mengurus administrasi kesehatan orang tua.',
    ],
    caseExample:
      'Setiap gajian, Hendra mengalokasikan pos tetap sebesar 10% untuk orang tua di kampung dan menyampaikannya secara jujur kepada keluarga ketika ada kebutuhan lain yang di luar kemampuan anggarannya.',
    practicalTips: [
      'Tetapkan pos anggaran tetap bulanan untuk orang tua sehingga tidak mengganggu dana darurat pribadi.',
      'Latih cara berkata "Belum bisa sekarang, tapi sa bantu cari solusi lain" dengan nada hangat dan hormat.',
      'Ajak saudara yang sudah dewasa untuk ikut berbagi tanggung jawab merawat orang tua secara adil.',
    ],
    actionSteps: [
      'Hitung kemampuan riil bantuan keluarga setiap bulan di Perencana Keuangan Keluarga.',
      'Diskusikan pembagian peran merawat orang tua bersama saudara sekandung.',
      'Pastikan orang tua memiliki jaminan kesehatan (BPJS/KIS) yang aktif.',
    ],
    evaluationQuestion:
      'Bagaimana Anda menyeimbangkan bakti kepada orang tua dan keluarga besar dengan menjaga kemandirian masa depan Anda sendiri?',
    aiPrompt:
      'Bagaimana cara menyampaikan batas kemampuan keuangan kepada keluarga besar di Papua secara sopan tanpa merusak hubungan kasih kekeluargaan?',
    aiTopic: 'Ekonomi Keluarga',
  },
  {
    id: 'l-18',
    number: '18',
    category: 'Kemandirian & Parenting',
    title: 'Perencanaan Masa Depan Lima Tahun',
    summary: 'Menyusun peta karier, pendidikan lanjutan, aset/rumah, kesehatan, dan kontribusi sosial secara terukur.',
    explanation: [
      'Perencanaan 5 tahun membantu dewasa muda tidak hanya bereaksi terhadap masalah harian, tetapi bergerak menuju tujuan hidup yang jelas. Peta 5 tahun mencakup empat jalur: (1) Peningkatan keahlian & karier/usaha, (2) Keuangan & tabungan aset, (3) Kesehatan & kehidupan keluarga, serta (4) Kontribusi bagi kampung/komunitas.',
      'Rencana bukanlah batu mati yang tidak bisa diubah; tinjau setiap 6 bulan agar tetap relevan dengan peluang baru maupun kondisi ekonomi nyata.',
    ],
    caseExample:
      'Grace (24 tahun) membagi target 5 tahunnya: Tahun 1–2 fokus melunasi modal alat jahit & bangun pelanggan tetap; Tahun 3 memperbesar tabungan dana darurat & melatih 2 pemuda kampung; Tahun 4–5 menyiapkan dana pendidikan atau rumah sederhana.',
    practicalTips: [
      'Tulis target 5 tahun dalam bahasa yang spesifik, terukur, dan realistis.',
      'Pecah target 5 tahun menjadi target tahunan, lalu langkah kecil bulanan.',
      'Rayakan pencapaian kecil setiap tahun agar semangat tetap terjaga.',
    ],
    actionSteps: [
      'Tuliskan kondisi yang ingin Anda capai pada usia +5 tahun di bidang karier, tabungan, dan keluarga.',
      'Tentukan langkah pertama yang harus dilakukan dalam 30 hari ini untuk mendekati visi itu.',
      'Simpan catatan rencana Anda dan evaluasi setiap 6 bulan.',
    ],
    evaluationQuestion:
      'Lima tahun dari sekarang, versi diri Anda yang paling mandiri, sehat, dan bermanfaat bagi Papua seperti apa yang ingin Anda wujudkan?',
    aiPrompt:
      'Bantu saya menyusun peta rencana masa depan 5 tahun untuk dewasa muda Papua agar seimbang antara karier, tabungan, dan kehidupan keluarga.',
    aiTopic: 'Keluarga Modern',
  },
  {
    id: 'l-19',
    number: '19',
    category: 'Kemandirian & Parenting',
    title: 'Program Kemandirian 90 Hari',
    summary: 'Rencana aksi terstruktur dalam 3 fase: Hari 1–30 (Fondasi), Hari 31–60 (Keterampilan & Aksi), Hari 61–90 (Konsistensi).',
    explanation: [
      'Perubahan besar lahir dari kebiasaan konsisten selama 90 hari. Program 90 hari membagi perjalanan kemandirian menjadi tiga tahap singkat yang mudah dipantau:',
      'Fase 1 (Hari 1–30 · Fondasi): Audit arus kas, rapikan dokumen diri & CV, buka tabungan terpisah, dan bangun disiplin jam bangun serta jadwal harian. Fase 2 (Hari 31–60 · Aksi Nyata): Daftar pelatihan vokasi, kirim lamaran kerja/mulai uji coba usaha lokal skala kecil, dan latih komunikasi asertif. Fase 3 (Hari 61–90 · Penguatan): Evaluasi penghasilan & tabungan, perbaiki strategi yang belum berjalan, dan tetapkan komitmen jangka menengah.',
    ],
    caseExample:
      'Menggunakan Checklist Kemandirian 90 Hari, Ronal berhasil merapikan CV, menyelesaikan kursus dasar komputer, mencatat seluruh pengeluaran selama 3 bulan, dan memulai jasa perbaikan HP kecil-kecilan di lingkungannya.',
    practicalTips: [
      'Fokus menuntaskan 1–2 checklist per minggu agar tidak kewalahan.',
      'Gunakan Checklist Kemandirian 90 Hari interaktif pada modul kalkulator di bawah.',
      'Ajak satu teman seperjuangan untuk saling mengingatkan kemajuan tiap hari Minggu.',
    ],
    actionSteps: [
      'Centang 3 langkah awal Fase 1 pada Checklist Kemandirian 90 Hari sekarang.',
      'Pasang pengingat evaluasi mingguan di Kalender Keluarga Papua.',
      'Tanyakan kendala yang Anda temui langsung ke Sahabat AI.',
    ],
    evaluationQuestion:
      'Dari seluruh langkah Fase 1 (Hari 1–30), tugas mana yang siap Anda selesaikan paling lambat hari Minggu ini?',
    aiPrompt:
      'Buatkan jadwal harian sederhana untuk menjalankan Program Kemandirian 90 Hari bagi dewasa muda Papua yang sedang mencari kerja atau merintis usaha.',
    aiTopic: 'Keluarga Modern',
  },
  {
    id: 'l-20',
    number: '20',
    category: 'Kemandirian & Parenting',
    title: 'Evaluasi Diri dan Latihan Pembelajaran Terpadu',
    summary: 'Refleksi menyeluruh dan studi kasus pengambilan keputusan nyata dalam pekerjaan, uang, adat, dan keluarga.',
    explanation: [
      'Belajar tanpa praktik mudah terlupakan. Pada unit terakhir Bab 07 ini, dewasa muda bersama orang tua atau pendamping diajak mengevaluasi pemahaman melalui latihan keputusan nyata: menyikapi tawaran kerja kontrak, membagi gaji pertama, berdialog mengenai anggaran adat secara hormat, serta menyusun rencana keuangan keluarga bebas utang konsumtif.',
      'Setiap jawaban refleksi dapat langsung didiskusikan bersama Sahabat Keluarga Papua AI untuk mendapatkan umpan balik yang hangat dan membangun.',
    ],
    caseExample:
      'Dalam latihan simulasi, keluarga mendiskusikan skenario: "Jika seorang anak mendapat gaji Rp 3.500.000 namun langsung ditawari kredit motor mahal dan ada undangan sumbangan acara besar, langkah mana yang paling bijak?"',
    practicalTips: [
      'Diskusikan soal latihan bersama pasangan, sahabat, atau orang tua untuk memperkaya sudut pandang.',
      'Jangan takut mengakui bagian yang masih belum dipahami—itu awal pertumbuhan.',
      'Ulangi membaca bab atau gunakan kalkulator kapan pun situasi hidup Anda berubah.',
    ],
    actionSteps: [
      'Jawab pertanyaan evaluasi di bawah dengan jujur sesuai kondisi nyata Anda saat ini.',
      'Gunakan tombol "Diskusikan dengan Sahabat AI" untuk mengevaluasi rencana aksi Anda.',
      'Unduh Buku Panduan PDF Lengkap Bab 01–07 agar selalu siap dibaca meski tanpa internet.',
    ],
    evaluationQuestion:
      'Latihan Kasus: Bayangkan Anda baru menerima penghasilan tetap pertama dan dihadapkan pada kebutuhan hidup mandiri, tabungan darurat, rencana pelatihan keterampilan, serta permintaan bantuan keluarga. Bagaimana pembagian prioritas Anda agar semuanya tetap sehat?',
    aiPrompt:
      'Ini latihan kasus Bab 07: Saya ingin berlatih menyusun prioritas saat menerima penghasilan pertama agar kebutuhan mandiri, dana darurat, pengembangan diri, dan bakti kepada orang tua tetap seimbang. Tolong pandu saya.',
    aiTopic: 'Ekonomi Keluarga',
  },
];

export const BAB07_AGE_MAP: Bab07AgeBand[] = [
  {
    id: '18-21',
    label: 'Usia 18–21 Tahun',
    shortTitle: 'Fondasi Pendidikan, Keterampilan & Identitas',
    tagline: 'Masa transisi dari pelajar menjadi pembelajar mandiri yang siap berkarya.',
    goal: 'Menuntaskan pendidikan/pelatihan vokasi, membangun disiplin diri, literasi keuangan dasar, dan mengenali potensi karier atau wirausaha lokal Papua.',
    skills: [
      'Kebiasaan mencatat uang saku/upah paruh waktu dan menabung sejak dini',
      'Keterampilan teknis dasar, literasi digital, dan komunikasi bahasa Indonesia/daerah yang santun',
      'Kemampuan menyaring pergaulan sehat serta menjauhi miras, perundungan, dan hoaks',
    ],
    challenges: [
      'Kebingungan memilih jurusan kuliah/vokasi atau ragu dengan kemampuan diri',
      'Tekanan teman sebaya untuk gaya hidup konsumtif dan kecanduan gawai',
      'Adaptasi saat merantau jauh dari orang tua dan kampung halaman',
    ],
    guidance: [
      'Fokus membangun keahlian nyata, pengalaman organisasi/relawan, dan portofolio sederhana.',
      'Bangun komunikasi terbuka dengan orang tua soal rencana belajar serta batas dukungan biaya.',
      'Tidak perlu terburu-buru memikirkan target menikah; prioritaskan kematangan diri terlebih dahulu.',
    ],
    aiPrompt:
      'Berikan panduan lengkap untuk anak muda Papua usia 18–21 tahun dalam memilih keterampilan vokasi, beradaptasi di perantauan/kuliah, dan mulai mengelola uang pribadi.',
  },
  {
    id: '22-25',
    label: 'Usia 22–25 Tahun',
    shortTitle: 'Masuk Dunia Kerja, Etos Profesional & Kemandirian Ekonomi',
    tagline: 'Masa menguji kemampuan di dunia kerja atau merintis usaha pertama dengan jujur.',
    goal: 'Memperoleh pengalaman kerja/usaha yang stabil, membangun dana darurat pribadi 3 bulan, memahami hak pekerja, dan menata tanggung jawab kepada keluarga secara terukur.',
    skills: [
      'Menyusun CV & surat lamaran profesional serta teknik wawancara kerja yang percaya diri',
      'Membaca kontrak kerja, memahami BPJS/K3, serta disiplin kerja di tim lintas budaya',
      'Memisahkan rekening harian dengan tabungan dana darurat serta pembukuan usaha kecil',
    ],
    challenges: [
      'Persaingan mencari pekerjaan pertama atau mengalami penolakan lamaran berkali-kali',
      'Godaan kredit konsumtif atau pinjaman online saat baru memegang penghasilan sendiri',
      'Menyeimbangkan keinginan membantu orang tua/adik dengan tabungan masa depan sendiri',
    ],
    guidance: [
      'Gunakan Checklist Kemandirian 90 Hari dan Generator CV untuk mempercepat kesiapan karier.',
      'Mulailah menyisihkan dana darurat minimal 10–20% sejak penghasilan pertama.',
      'Jika sedang menjalin hubungan, latih kematangan emosi dan komunikasi tanpa kekerasan—ingat bahwa usia 22–25 bukan kewajiban harus menikah.',
    ],
    aiPrompt:
      'Bagaimana langkah praktis dewasa muda Papua usia 22–25 tahun menghadapi persaingan kerja pertama, membangun dana darurat, dan menghindari jebakan utang konsumtif?',
  },
  {
    id: '26-30',
    label: 'Usia 26–30 Tahun',
    shortTitle: 'Penguatan Karier/UMKM, Kematangan Relasi & Rencana Jangka Panjang',
    tagline: 'Fase memperdalam keahlian, menstabilkan ekonomi, dan menimbang komitmen jangka panjang secara sadar.',
    goal: 'Meningkatkan kapasitas karier/skala UMKM Papua, memiliki dana darurat 3–6 bulan, dan apabila memilih berkeluarga—mempersiapkan musyawarah adat, ekonomi, dan kesehatan keluarga secara matang.',
    skills: [
      'Negosiasi gaji/peningkatan kompetensi atau pengelolaan arus kas & margin keuntungan UMKM',
      'Perencanaan masa depan 5 tahun (aset produktif, pendidikan lanjutan, atau tempat tinggal)',
      'Keterampilan musyawarah lintas keluarga, pengelolaan konflik sehat, dan literasi kesehatan reproduksi',
    ],
    challenges: [
      'Tekanan sosial atau pertanyaan lingkungan sekitar mengenai status pernikahan atau memiliki anak',
      'Tuntutan biaya hidup yang meningkat seiring bertambahnya peran sosial di keluarga besar',
      'Risiko kejenuhan kerja (burnout) atau usaha jalan di tempat tanpa pembukuan yang baik',
    ],
    guidance: [
      'Tegaskan prinsip sehat: menikah dan memiliki anak adalah pilihan hidup sadar, bukan kewajiban yang dipaksakan usia 26–30.',
      'Bagi yang berencana menikah, bahas anggaran mas kawin bijak, keterbukaan keuangan, dan bimbingan pranikah jauh hari.',
      'Kembangkan jaringan usaha atau mentor karier yang jujur dan saling menguatkan.',
    ],
    aiPrompt:
      'Panduan untuk usia 26–30 tahun di Papua: bagaimana memperkuat karier atau usaha lokal sekaligus menghadapi pertanyaan lingkungan soal pernikahan dengan tenang dan bermartabat?',
  },
  {
    id: '30+',
    label: 'Usia 30 Tahun ke Atas',
    shortTitle: 'Kepemimpinan Keluarga, Aset Berkelanjutan & Mentorship Generasi',
    tagline: 'Fase keteguhan hidup, perlindungan keluarga, kemandirian finansial matang, dan membimbing yang lebih muda.',
    goal: 'Memperkuat ketahanan ekonomi jangka panjang, memastikan perlindungan kesehatan/pendidikan keluarga, menjaga kehormatan adat & iman, serta menjadi teladan bagi adik dan generasi muda Papua.',
    skills: [
      'Manajemen keuangan keluarga jangka panjang, dana pendidikan/hari tua, dan mitigasi risiko usaha',
      'Kepemimpinan keluarga berbasis musyawarah, pengasuhan anti-kekerasan, dan pelestarian bahasa ibu',
      'Pendampingan (mentoring) karier atau usaha bagi keponakan, adik, dan pemuda di komunitas',
    ],
    challenges: [
      'Beban generasi sandwich (mendukung orang tua lanjut usia sekaligus keluarga/anak atau karier)',
      'Perubahan teknologi dan dunia kerja yang menuntut adaptasi keterampilan baru terus-menerus',
      'Menjaga kesehatan fisik, gizi lokal seimbang, serta kesehatan mental di tengah tanggung jawab besar',
    ],
    guidance: [
      'Baik memilih hidup melajang produktif, baru membangun keluarga, maupun telah berkeluarga—fokuslah pada martabat, kesehatan, dan dampak nyata bagi sesama.',
      'Pastikan pencatatan sipil, jaminan kesehatan keluarga, dan batas tanggung jawab finansial tertata rapi.',
      'Bagikan pengalaman nyata Anda kepada generasi 18–25 tahun agar mereka belajar dari langkah bijak Anda.',
    ],
    aiPrompt:
      'Bagaimana panduan bagi masyarakat Papua usia 30+ tahun dalam menata ketahanan ekonomi jangka panjang, menjaga kesehatan, dan menjadi mentor bagi generasi muda?',
  },
];

export const BAB07_AI_CARDS: Bab07AICard[] = [
  {
    id: 'ai-cari-kerja',
    title: 'Cari Pekerjaan',
    description: 'Strategi lowongan resmi, simulasi wawancara kerja, dan tips menghindari penipuan rekrutmen.',
    topic: 'Keluarga Modern',
    accentBg: 'bg-[#E5EDF4]',
    accentText: 'text-[#1E5670]',
    borderAccent: 'hover:border-[#1E5670]',
    iconName: 'briefcase',
    aiPrompt:
      '[Bab 07 · Cari Pekerjaan] Bantu saya menyusun rencana mencari pekerjaan resmi di Papua atau luar daerah, cara menyusun CV meyakinkan, dan simulasi jawaban wawancara yang percaya diri.',
  },
  {
    id: 'ai-pendidikan-karier',
    title: 'Pendidikan dan Karier',
    description: 'Memilih kuliah, kursus vokasi BLK, sertifikasi keterampilan, dan peta karier 5 tahun.',
    topic: 'Pendidikan Anak',
    accentBg: 'bg-[#EAE6F3]',
    accentText: 'text-[#4B3A70]',
    borderAccent: 'hover:border-[#4B3A70]',
    iconName: 'graduation',
    aiPrompt:
      '[Bab 07 · Pendidikan & Karier] Tolong bantu saya memetakan pilihan pendidikan lanjutan, pelatihan vokasi, atau keterampilan digital yang relevan untuk membangun karier jangka panjang dari Papua.',
  },
  {
    id: 'ai-keuangan-pribadi',
    title: 'Keuangan Pribadi',
    description: 'Mengatur gaji bulanan, membangun dana darurat 3–6 bulan, dan bebas dari jerat pinjol.',
    topic: 'Ekonomi Keluarga',
    accentBg: 'bg-[#E6EFE9]',
    accentText: 'text-[#255C34]',
    borderAccent: 'hover:border-[#255C34]',
    iconName: 'wallet',
    aiPrompt:
      '[Bab 07 · Keuangan Pribadi] Bagaimana cara mengatur penghasilan bulanan saya agar kebutuhan wajib aman, dana darurat terbentuk konsisten, dan terhindar dari utang konsumtif?',
  },
  {
    id: 'ai-bangun-usaha',
    title: 'Bangun Usaha',
    description: 'Merintis UMKM berbasis potensi lokal Papua dengan pembukuan rapi dan modal terukur.',
    topic: 'Ekonomi Keluarga',
    accentBg: 'bg-[#F5E9D3]',
    accentText: 'text-[#8C5A2B]',
    borderAccent: 'hover:border-[#8C5A2B]',
    iconName: 'store',
    aiPrompt:
      '[Bab 07 · Bangun Usaha UMKM Papua] Bantu saya menguji ide usaha lokal Papua, memisahkan uang usaha dan pribadi, serta menghitung titik impas modal tanpa janji keuntungan muluk-muluk.',
  },
  {
    id: 'ai-persiapan-menikah',
    title: 'Persiapan Menikah',
    description: 'Kesiapan mental, dialog pranikah, kesepakatan keuangan, dan rencana pernikahan tanpa utang.',
    topic: 'Perkawinan Adat',
    accentBg: 'bg-[#F3E7E4]',
    accentText: 'text-[#8C3B2B]',
    borderAccent: 'hover:border-[#8C3B2B]',
    iconName: 'heart',
    aiPrompt:
      '[Bab 07 · Persiapan Menikah] Apa saja tanda kesiapan mental dan finansial sebelum menikah, serta topik wajib dalam dialog pranikah bersama pasangan?',
  },
  {
    id: 'ai-rumah-tangga',
    title: 'Rumah Tangga',
    description: 'Pembagian peran suami-istri yang setara, transparansi uang, dan musyawarah harian.',
    topic: 'Keluarga Harmonis',
    accentBg: 'bg-[#E3EFE6]',
    accentText: 'text-[#1D4A27]',
    borderAccent: 'hover:border-[#1D4A27]',
    iconName: 'home',
    aiPrompt:
      '[Bab 07 · Rumah Tangga] Bagaimana membangun pembagian peran yang adil antara suami dan istri yang sama-sama bekerja serta menjaga komunikasi rumah tangga yang transparan?',
  },
  {
    id: 'ai-pangan-lokal',
    title: 'Pangan Lokal',
    description: 'Menu harian sehat berbasis sagu, ubi, keladi, ikan, dan sayur gedi serta peluang olahannya.',
    topic: 'Ketahanan Gizi',
    accentBg: 'bg-[#E6EFE9]',
    accentText: 'text-[#1D4A27]',
    borderAccent: 'hover:border-[#1D4A27]',
    iconName: 'utensils',
    aiPrompt:
      '[Bab 07 · Pangan Lokal Papua] Berikan ide menu bergizi hemat untuk anak muda atau keluarga baru menggunakan sagu, ubi jalar, keladi, daun gedi, dan ikan lokal Papua.',
  },
  {
    id: 'ai-kesehatan-emosional',
    title: 'Kesehatan Emosional',
    description: 'Mengelola stres kerja, komunikasi asertif bebas kekerasan, dan relasi yang aman.',
    topic: 'Keluarga Harmonis',
    accentBg: 'bg-[#E5EDF4]',
    accentText: 'text-[#1E5670]',
    borderAccent: 'hover:border-[#1E5670]',
    iconName: 'smile',
    aiPrompt:
      '[Bab 07 · Kesehatan Emosional] Bagaimana cara dewasa muda mengelola tekanan pekerjaan, meredakan amarah secara sehat, dan membangun hubungan tanpa kekerasan verbal maupun fisik?',
  },
  {
    id: 'ai-tanggung-jawab-keluarga',
    title: 'Tanggung Jawab Keluarga',
    description: 'Berbakti pada orang tua dan membantu keluarga besar secara terencana dan saling menguatkan.',
    topic: 'Ekonomi Keluarga',
    accentBg: 'bg-[#F5E9D3]',
    accentText: 'text-[#8C5A2B]',
    borderAccent: 'hover:border-[#8C5A2B]',
    iconName: 'users',
    aiPrompt:
      '[Bab 07 · Tanggung Jawab Keluarga] Bagaimana cara membantu orang tua dan saudara di keluarga besar Papua dengan penuh kasih namun tetap menjaga batas anggaran agar kemandirian diri tidak terganggu?',
  },
  {
    id: 'ai-rencana-5-tahun',
    title: 'Rencana Lima Tahun',
    description: 'Menyusun target 5 tahun karier, tabungan, kesehatan, dan program aksi 90 hari pertama.',
    topic: 'Keluarga Modern',
    accentBg: 'bg-[#EAE6F3]',
    accentText: 'text-[#4B3A70]',
    borderAccent: 'hover:border-[#4B3A70]',
    iconName: 'compass',
    aiPrompt:
      '[Bab 07 · Rencana Lima Tahun] Bantu saya membuat peta rencana masa depan 5 tahun beserta langkah konkret 90 hari pertama agar hidup lebih terarah dan terukur.',
  },
  {
    id: 'ai-hak-pekerja',
    title: 'Hak dan Perlindungan Kerja',
    description: 'Memahami kontrak kerja tertulis, upah layak, K3, BPJS, serta etika profesional.',
    topic: 'Keluarga Modern',
    accentBg: 'bg-[#E3EFE6]',
    accentText: 'text-[#1D4A27]',
    borderAccent: 'hover:border-[#1D4A27]',
    iconName: 'shield',
    aiPrompt:
      '[Bab 07 · Hak & Perlindungan Kerja] Jelaskan hal-hal penting dalam kontrak kerja, hak atas upah & jaminan sosial (BPJS), serta etika profesional yang melindungi pekerja muda.',
  },
  {
    id: 'ai-adat-budaya',
    title: 'Adat dan Budaya',
    description: 'Menghormati keragaman 7 wilayah adat Papua, bahasa ibu, dan musyawarah mas kawin bijak.',
    topic: 'Lintas Suku',
    accentBg: 'bg-[#F3E7E4]',
    accentText: 'text-[#8C3B2B]',
    borderAccent: 'hover:border-[#8C3B2B]',
    iconName: 'feather',
    aiPrompt:
      '[Bab 07 · Adat dan Budaya] Bagaimana cara generasi muda Papua menjaga kekhasan adat dari 7 wilayah adat yang berbeda dan melakukan musyawarah mas kawin secara bijak dan bermartabat?',
  },
];
