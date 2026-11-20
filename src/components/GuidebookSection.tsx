import {useEffect, useState} from 'react';
import {jsPDF} from 'jspdf';
import {
  BookHeart,
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Feather,
  FileText,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Utensils,
  X,
  type LucideIcon,
} from 'lucide-react';

export interface GuideChapterSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  tip?: string;
}

export interface GuideChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
  summary: string;
  sections: GuideChapterSection[];
  aiPrompt: string;
}

export const GUIDEBOOK_CHAPTERS: GuideChapter[] = [
  {
    id: 'filosofi',
    number: 'Bab 01',
    title: 'Filosofi UGUWO KAA OWAA & Nilai Keluarga',
    subtitle: 'Menjaga adat, menghormati iman, membangun generasi',
    icon: BookHeart,
    accentBg: 'bg-[#E3EFE6]',
    accentText: 'text-[#1D4A27]',
    summary:
      'Landasan hidup keluarga Papua modern yang menghidupi falsafah Satu Tungku Tiga Batu, Baku Jaga, Baku Sayang, dan Baku Dengar.',
    aiPrompt:
      'Jelaskan bagaimana keluarga muda Papua bisa menerapkan nilai Baku Jaga, Baku Sayang, dan Satu Tungku Tiga Batu dalam keseharian rumah tangga.',
    sections: [
      {
        heading: 'Empat Sendi Utama Rumah Keluarga Papua',
        paragraphs: [
          'UGUWO KAA OWAA hadir dengan pegangan utama: "Adat Dijaga, Agama Dihormati, Keluarga Dibangun, Generasi Dilindungi." Keempat sendi ini berjalan beriringan untuk menjaga martabat rumah tangga Papua di tengah perubahan zaman.',
        ],
        bullets: [
          'Baku Jaga & Baku Sayang: Saling melindungi kehormatan pasangan dan anak-anak dengan tutur kata yang lembut.',
          'Kitong Satu Tungku: Kesatuan keluarga besar yang saling menopang dalam suka dan duka tanpa membebani rumah tangga baru.',
          'Baku Dengar: Kebiasaan mendengarkan nasihat orang tua, tetua adat, pemuka agama, serta suara hati anak dan pasangan.',
        ],
        tip: 'Luangkan 15 menit setiap malam di ruang keluarga untuk berdoa bersama dan saling mendengar cerita hari ini tanpa gawai.',
      },
    ],
  },
  {
    id: 'perkawinan-adat',
    number: 'Bab 02',
    title: 'Perkawinan Adat, Agama & 7 Wilayah Adat',
    subtitle: 'Musyawarah bijak, pemberkatan, dan harmoni lintas suku',
    icon: HeartHandshake,
    accentBg: 'bg-[#F5E9D3]',
    accentText: 'text-[#8C5A2B]',
    summary:
      'Panduan memahami makna luhur arim/mas kawin, tata krama pertemuan dua keluarga besar, serta penghormatan tradisi di 7 wilayah adat Papua.',
    aiPrompt:
      'Berikan panduan praktis mempersiapkan musyawarah perkawinan adat Papua dan mas kawin yang bijak tanpa memberatkan pasangan muda.',
    sections: [
      {
        heading: 'Memaknai Mas Kawin Secara Bijak',
        paragraphs: [
          'Dalam budaya Papua, mas kawin (seperti piring gantung, kain timur, atau tanda adat lainnya) adalah simbol ikatan persaudaraan dua marga dan bentuk penghormatan atas jasa orang tua yang membesarkan anak.',
        ],
        bullets: [
          'Utamakan musyawarah terbuka antara pihak laki-laki dan perempuan agar kesepakatan adat tidak menjadi utang berat bagi keluarga baru.',
          'Selaraskan prosesi adat dengan pemberkatan agama dan pencatatan sipil yang sah demi perlindungan hukum istri dan anak.',
          'Untuk perkawinan lintas suku, kenalkan adat masing-masing secara santun sejak masa pertunangan.',
        ],
      },
      {
        heading: 'Sekilas 7 Wilayah Adat Papua',
        bullets: [
          'Mamta / Tabi (Jayapura, Sentani, Keerom, Sarmi): Musyawarah Ondoafi/Kepala Suku dan persatuan pesisir-danau.',
          'Saireri (Biak, Numfor, Yapen, Waropen): Tradisi arim/piring gantung sebagai tanda hormat kepada keluarga pihak ibu.',
          'Domberai (Sorong, Manokwari, Raja Ampat, Tambrauw): Kearifan kain timur dan kerukunan dua marga besar.',
          'Bomberai (Fakfak, Kaimana, Teluk Bintuni, Wondama): Falsafah Satu Tungku Tiga Batu dalam keberagaman iman.',
          'Mee Pago (Nabire, Paniai, Dogiyai, Deiyai, Intan Jaya): Gotong royong dan kebersamaan marga pegunungan.',
          'Lapago (Jayawijaya, Lanny Jaya, Tolikara, Yahukimo): Kehormatan Honai, kejujuran, dan solidaritas kampung.',
          'Anim Ha (Merauke, Mappi, Asmat, Boven Digoel): Adat pesisir selatan-rawa, seni ukir, dan ikatan keluarga besar.',
        ],
      },
    ],
  },
  {
    id: 'tumbuh-kembang',
    number: 'Bab 03',
    title: 'Peta Tumbuh Kembang Anak (0–18+ Tahun)',
    subtitle: 'Pendampingan tepat dari balita hingga dewasa muda',
    icon: GraduationCap,
    accentBg: 'bg-[#E5EDF4]',
    accentText: 'text-[#1E5670]',
    summary:
      'Tahapan lengkap mendampingi anak sejak 0-5 tahun (akar kasih), 6-11 tahun (karakter), 12-17 tahun (remaja percaya diri), hingga 18+ tahun (mandiri).',
    aiPrompt:
      'Buatkan contoh jadwal pendampingan harian di rumah untuk anak usia sekolah (6-11 tahun) agar rajin belajar dan hormat kepada orang tua.',
    sections: [
      {
        heading: 'Empat Tahapan Perkembangan Anak Papua',
        bullets: [
          'Tahap 01 · Balita (0–5 Tahun) — Akar Kasih & Bahasa Ibu: Pelukan aman, ASI/MPASI bergizi, stimulasi bicara bahasa ibu, dan teladan iman sederhana.',
          'Tahap 02 · Anak Sekolah (6–11 Tahun) — Karakter & Rasa Ingin Tahu: Kebiasaan membaca 15 menit sehari, disiplin tanpa kekerasan, mengenal budaya Papua, dan tanggung jawab rumah.',
          'Tahap 03 · Remaja (12–17 Tahun) — Baku Dengar & Percaya Diri: Mendengar tanpa menghakimi, pendampingan HP/pergaulan sehat, pendidikan kesehatan reproduksi, dan kebanggaan jati diri.',
          'Tahap 04 · Dewasa Muda (18+ Tahun) — Kemandirian & Persiapan Keluarga: Kemandirian studi/kerja, literasi keuangan, kedewasaan emosi, dan persiapan pernikahan.',
        ],
        tip: 'Gunakan disiplin yang membangun dan ajak anak berdialog tentang akibat perbuatan, bukan membentak atau memukul.',
      },
    ],
  },
  {
    id: 'pilar-parenting',
    number: 'Bab 04',
    title: 'Delapan Pilar Parenting Keluarga Papua',
    subtitle: 'Fondasi utuh mengasuh anak dengan kasih, iman & adat',
    icon: Feather,
    accentBg: 'bg-[#F3E7E4]',
    accentText: 'text-[#8C3B2B]',
    summary:
      'Delapan pilar pengasuhan modern berakar kearifan lokal: kasih sayang, bahasa ibu, gizi, literasi, iman, ekonomi, kesehatan mental, dan adat.',
    aiPrompt:
      'Bagaimana orang tua di Papua mengajarkan literasi keuangan dan kebiasaan menabung sejak dini kepada anak?',
    sections: [
      {
        heading: 'Delapan Pilar Praktis di Rumah',
        bullets: [
          '1. Kasih Sayang & Perlindungan: Rumah aman bebas dari kekerasan fisik maupun ucapan kasar.',
          '2. Bahasa Ibu & Budaya: Mengenalkan sapaan daerah, dongeng leluhur, dan sejarah keluarga.',
          '3. Gizi & Kesehatan: Menyajikan pangan lokal bergizi, pemantauan tumbuh kembang, imunisasi, dan kebersihan.',
          '4. Pendidikan & Literasi: Membiasakan membaca buku, berpikir kritis, dan bijak memakai gawai.',
          '5. Iman & Spiritualitas: Menanamkan kasih, kejujuran, pengampunan, dan hormat pada sesama.',
          '6. Ekonomi Keluarga: Mengajarkan menabung, membedakan kebutuhan vs keinginan, dan keterampilan hidup.',
          '7. Kesehatan Mental & Emosi: Mengajari anak mengekspresikan perasaan dengan sehat dan membangun percaya diri.',
          '8. Adat & Hubungan Sosial: Menghormati orang tua, tetua adat, musyawarah, serta semangat gotong royong.',
        ],
      },
    ],
  },
  {
    id: 'ketahanan-gizi',
    number: 'Bab 05',
    title: 'Ketahanan Gizi & Pangan Lokal Papua',
    subtitle: 'Dapur sehat dengan sagu, ubi, keladi, ikan & sayur lokal',
    icon: Utensils,
    accentBg: 'bg-[#E6EFE9]',
    accentText: 'text-[#255C34]',
    summary:
      'Mengenal kekayaan bahan pangan lokal Papua, prinsip menu bergizi seimbang, serta contoh susunan makan 1 hari untuk keluarga.',
    aiPrompt:
      'Berikan 3 ide resep MPASI atau sarapan bergizi untuk balita Papua memakai bahan lokal seperti ubi oranye, ikan, dan sayur daun gedi.',
    sections: [
      {
        heading: 'Enam Bahan Pangan Lokal Utama Papua',
        bullets: [
          'Sagu: Sumber karbohidrat energi alami (papeda, sagu bakar, sagu lempeng).',
          'Ubi Jalar (khususnya ubi oranye): Sumber serat serta beta-karoten untuk vitamin A mata dan daya tahan tubuh.',
          'Keladi & Talas: Karbohidrat dan serat mengenyangkan (pastikan dimasak matang sempurna sebelum disajikan).',
          'Ikan Lokal (laut & danau): Sumber protein hewani tinggi, mineral, dan asam lemak omega-3 untuk kecerdasan anak.',
          'Sayuran Lokal (daun gedi, pakis, daun singkong, kangkung): Kaya vitamin, zat besi, dan serat harian.',
          'Buah Lokal (pisang, pepaya, alpukat): Vitamin segar penunjang pencernaan keluarga.',
        ],
      },
      {
        heading: 'Contoh Menu Bergizi Pangan Lokal 1 Hari',
        bullets: [
          'Pagi: Ubi rebus / bakar + telur rebus + tumis sayur hijau + air putih hangat.',
          'Siang: Papeda + ikan kuah kuning segar + sayur daun gedi + potongan buah pepaya.',
          'Sore: Pisang rebus atau olahan sagu tradisional secukupnya.',
          'Malam: Keladi rebus + ikan panggang + sayur pakis/singkong + buah pisang.',
        ],
        tip: 'Kurangi jajanan instan tinggi gula dan garam; prioritaskan hasil kebun dan laut segar sekitar kampung.',
      },
    ],
  },
  {
    id: 'panduan-aplikasi',
    number: 'Bab 06',
    title: 'Panduan Menggunakan Fitur UGUWO KAA OWAA',
    subtitle: 'Sahabat AI Suara & Gambar, Kalender Keluarga & Aplikasi HP',
    icon: BookOpenCheck,
    accentBg: 'bg-[#EAE6F3]',
    accentText: 'text-[#4B3A70]',
    summary:
      'Langkah praktis memanfaatkan Tanya AI (ketik & suara), pembacaan audio jawaban, studio ilustrasi budaya, Kalender Keluarga, hingga pemasangan aplikasi di HP.',
    aiPrompt:
      'Bantu sa memahami cara paling efektif menggunakan Sahabat Keluarga Papua AI dan Kalender Keluarga untuk mendampingi anak di rumah.',
    sections: [
      {
        heading: 'Memaksimalkan Fitur Platform',
        bullets: [
          'Sahabat Keluarga Papua AI: Pilih gaya bahasa (Papua Akrab, Campuran, atau Baku), aktifkan Respon Kilat untuk jawaban cepat, atau buka Ruang AI Lengkap untuk riwayat percakapan bergaya ChatGPT.',
          'Suara & Ilustrasi AI: Ketuk tombol Mikrofon untuk bertanya lewat suara (Voice-to-Text), ketuk Dengarkan pada balasan AI agar dibacakan (Text-to-Speech), atau pilih Mode Buat Gambar untuk membuat ilustrasi budaya Papua siap unduh (PNG/SVG).',
          'Kalender Keluarga Papua: Catat acara adat, pertemuan komunitas, dan rapor sekolah anak, lalu aktifkan Pengingat Notifikasi Browser agar tidak terlewat.',
          'Pencarian Global & Aplikasi HP (PWA): Gunakan bilah pencarian di header untuk menemukan artikel, gizi, atau dongeng dengan cepat, serta pasang ikon UGUWO KAA OWAA langsung ke layar utama HP.',
        ],
      },
    ],
  },
  {
    id: 'dewasa-muda-bab07',
    number: 'Bab 07',
    title: 'Dewasa Muda Papua: Mandiri Ekonomi, Kerja & Keluarga',
    subtitle: '20 unit praktis usia 18+, peta usia, karier, UMKM lokal & rumah tangga bijak',
    icon: Briefcase,
    accentBg: 'bg-[#FAF4E4]',
    accentText: 'text-[#8C5A2B]',
    summary:
      'Modul lengkap mendampingi generasi 18+ berdiri mandiri secara ekonomi, siap memasuki dunia kerja atau usaha pangan lokal Papua, matang secara emosional, dan bijak mempersiapkan keluarga sesuai adat dan iman.',
    aiPrompt:
      'Bantu sa merangkum langkah paling realistis dari Bab 07 Dewasa Muda Papua 18+ untuk menyiapkan kemandirian ekonomi, pekerjaan, dan kesiapan keluarga.',
    sections: [
      {
        heading: 'Filosofi Kedewasaan, Peran Orang Tua (18+) & 8 Pilar',
        paragraphs: [
          'Kedewasaan Papua bukan sekadar angka usia, melainkan keberanian bertanggung jawab atas nafkah, tutur kata, pengelolaan uang, serta penghormatan kepada keluarga besar dan adat. Orang tua beralih peran dari pengatur menjadi sahabat diskusi yang bijak.',
        ],
        bullets: [
          'Delapan Pilar Dewasa Muda: Kemandirian mental, literasi keuangan, disiplin kerja, keterampilan digital/vokasi, komunikasi sehat, kematangan emosi, tanggung jawab keluarga besar, serta penghormatan adat dan iman.',
          'Peta Usia Tanpa Pemaksaan: Kelompok 18–21 (fondasi & vokasi), 22–25 (transisi kerja & dana darurat), 26–30 (kemapanan karier & musyawarah hidup), dan 30+ (kepemimpinan & mentor generasi). Rentang usia bukan kewajiban menikah atau memiliki anak.',
        ],
      },
      {
        heading: 'Dunia Kerja, CV Profesional, Hak Pekerja & Kewirausahaan Papua',
        bullets: [
          'Persiapan Karier & CV: Susun CV ringkas 1–2 halaman berisi keahlian nyata, pengalaman organisasi/magang, dan surat lamaran sopan tanpa melebih-lebihkan fakta.',
          'Etika & Hak Pekerja: Pahami perjanjian kerja tertulis, hak upah layak, jam kerja aman, kepesertaan BPJS Ketenagakerjaan/Kesehatan, serta kedisiplinan waktu.',
          'UMKM & Pangan Lokal Papua: Kelola potensi sagu, ikan asap/segar, kopi pegunungan, keladi, serta kerajinan noken dengan pembukuan modal terpisah dari uang dapur, tanpa menjanjikan keuntungan instan.',
        ],
      },
      {
        heading: 'Keuangan Keluarga, Mas Kawin Bijak (7 Wilayah Adat) & Program 90 Hari',
        bullets: [
          'Aturan Arus Kas 50-30-20 Adaptif: Prioritaskan kebutuhan pokok dan dana darurat 3–6 bulan pengeluaran sebelum mengambil cicilan konsumtif.',
          'Mas Kawin & Persiapan Perkawinan: Utamakan musyawarah keluarga di masing-masing 7 wilayah adat tanpa menyamaratakan tradisi antar suku, menjaga martabat sekaligus mencegah jerat utang pasangan muda.',
          'Kesehatan Reproduksi & Perencanaan 5 Tahun: Jaga kesehatan mental, komunikasi tanpa kekerasan, diskusi bersama tenaga medis terpercaya, dan evaluasi kemajuan melalui Program Kemandirian 90 Hari.',
        ],
        tip: 'Gunakan 8 kalkulator nyata di bagian Bab 07 (Arus Kas, Dana Darurat, Generator CV PDF, UMKM, Modal, Anggaran Perkawinan, Keuangan Keluarga, dan Checklist 90 Hari).',
      },
    ],
  },
];

export function downloadFullGuidebookPdf() {
  buildPdfFromChapters(
    GUIDEBOOK_CHAPTERS,
    'Buku-Panduan-Keluarga-Papua-UGUWO-KAA-OWAA.pdf',
    'Panduan Lengkap 7 Bab · Keluarga, Parenting 0–18+, Adat & Ketahanan Gizi Papua',
  );
}

export function downloadChapterPdfById(chapterId: string): GuideChapter | undefined {
  const chapter = GUIDEBOOK_CHAPTERS.find((c) => c.id === chapterId);
  if (!chapter) return undefined;
  buildPdfFromChapters(
    [chapter],
    `UGUWO-KAA-OWAA-${chapter.number.replace(/\s+/g, '-')}-${chapter.id}.pdf`,
    `${chapter.number} · ${chapter.title}`,
  );
  return chapter;
}

export function downloadAllChaptersOfflineHtml() {
  downloadGuidebookHtml(GUIDEBOOK_CHAPTERS);
}

function buildPdfFromChapters(chapters: GuideChapter[], fileName: string, docSubtitle: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const maxWidth = pageWidth - marginX * 2;
  let cursorY = 22;

  const drawRunningHeaderFooter = (pageNum: number, totalPages: number) => {
    if (pageNum === 1) return;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(29, 74, 39);
    doc.text('UGUWO KAA OWAA  ·  BUKU PANDUAN KELUARGA PAPUA', marginX, 12);

    doc.setDrawColor(223, 216, 202);
    doc.setLineWidth(0.3);
    doc.line(marginX, 14.5, pageWidth - marginX, 14.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(94, 109, 100);
    doc.text('Adat Dijaga, Agama Dihormati, Keluarga Dibangun, Generasi Dilindungi', marginX, pageHeight - 10);
    doc.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth - marginX, pageHeight - 10, {
      align: 'right',
    });
  };

  const ensureSpace = (neededMm: number) => {
    if (cursorY + neededMm > pageHeight - 18) {
      doc.addPage();
      cursorY = 22;
    }
  };

  // --- Cover Page ---
  doc.setFillColor(22, 59, 34); // #163B22
  doc.rect(0, 0, pageWidth, 108, 'F');

  doc.setFillColor(242, 194, 43); // #F2C22B gold bar
  doc.rect(0, 108, pageWidth, 4, 'F');

  doc.setTextColor(242, 194, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RUMAH KELUARGA DARI PAPUA · EDISI DIGITAL', marginX, 34);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.text('UGUWO KAA OWAA', marginX, 49);

  doc.setFontSize(16);
  doc.text('Buku Panduan Keluarga, Parenting, Adat & Gizi Lokal Papua', marginX, 62, {
    maxWidth,
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(220, 236, 225);
  doc.text(
    '"Adat Dijaga, Agama Dihormati, Keluarga Dibangun, Generasi Dilindungi."',
    marginX,
    84,
    {maxWidth},
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(207, 229, 212);
  doc.text(docSubtitle, marginX, 97, {maxWidth});

  // Cover Overview & Table of Contents
  cursorY = 123;
  doc.setTextColor(22, 36, 29);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Daftar Isi Panduan', marginX, cursorY);
  cursorY += 7;

  chapters.forEach((ch) => {
    doc.setFillColor(250, 248, 244);
    doc.setDrawColor(226, 220, 207);
    doc.roundedRect(marginX, cursorY, maxWidth, 14.5, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(92, 61, 46);
    doc.text(ch.number.toUpperCase(), marginX + 4, cursorY + 5);

    doc.setFontSize(10.5);
    doc.setTextColor(29, 74, 39);
    doc.text(ch.title, marginX + 4, cursorY + 10.5);

    cursorY += 17.5;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(94, 109, 100);
  doc.text(
    'Disusun untuk mendampingi orang tua, pasangan muda, remaja, dan keluarga besar Papua.',
    marginX,
    pageHeight - 16,
  );

  // --- Chapters Pages ---
  chapters.forEach((chapter) => {
    doc.addPage();
    cursorY = 22;

    // Chapter Header Banner
    doc.setFillColor(245, 242, 235);
    doc.setDrawColor(223, 216, 202);
    doc.roundedRect(marginX, cursorY, maxWidth, 24, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(92, 61, 46);
    doc.text(chapter.number.toUpperCase(), marginX + 5, cursorY + 7);

    doc.setFontSize(14.5);
    doc.setTextColor(29, 74, 39);
    doc.text(chapter.title, marginX + 5, cursorY + 14.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(66, 82, 73);
    doc.text(chapter.subtitle, marginX + 5, cursorY + 20.5);

    cursorY += 31;

    // Summary
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(66, 82, 73);
    const summaryLines = doc.splitTextToSize(chapter.summary, maxWidth) as string[];
    ensureSpace(summaryLines.length * 5.2 + 4);
    doc.text(summaryLines, marginX, cursorY);
    cursorY += summaryLines.length * 5.2 + 5;

    chapter.sections.forEach((sec) => {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      doc.setTextColor(22, 36, 29);
      doc.text(sec.heading, marginX, cursorY);
      cursorY += 6.5;

      sec.paragraphs?.forEach((p) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(37, 53, 44);
        const lines = doc.splitTextToSize(p, maxWidth) as string[];
        ensureSpace(lines.length * 5 + 3);
        doc.text(lines, marginX, cursorY);
        cursorY += lines.length * 5 + 3.5;
      });

      sec.bullets?.forEach((b) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(37, 53, 44);
        const bulletLines = doc.splitTextToSize(b, maxWidth - 7) as string[];
        ensureSpace(bulletLines.length * 5 + 2.5);

        doc.setFillColor(201, 162, 77);
        doc.circle(marginX + 2, cursorY - 1.3, 1, 'F');
        doc.text(bulletLines, marginX + 6.5, cursorY);
        cursorY += bulletLines.length * 5 + 2.5;
      });

      if (sec.tip) {
        const tipLines = doc.splitTextToSize(`Catatan Praktis: ${sec.tip}`, maxWidth - 10) as string[];
        const boxHeight = tipLines.length * 5 + 7;
        ensureSpace(boxHeight + 4);

        doc.setFillColor(250, 244, 228);
        doc.setDrawColor(230, 223, 209);
        doc.roundedRect(marginX, cursorY, maxWidth, boxHeight, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(92, 61, 46);
        doc.text(tipLines, marginX + 5, cursorY + 6);
        cursorY += boxHeight + 5;
      }

      cursorY += 3;
    });
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawRunningHeaderFooter(i, totalPages);
  }

  doc.save(fileName);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function downloadGuidebookHtml(chapters: GuideChapter[]) {
  const chaptersMarkup = chapters
    .map(
      (ch) => `
      <section class="chapter">
        <span class="badge">${escapeHtml(ch.number)}</span>
        <h2>${escapeHtml(ch.title)}</h2>
        <p class="subtitle">${escapeHtml(ch.subtitle)}</p>
        <p class="summary">${escapeHtml(ch.summary)}</p>
        ${ch.sections
          .map(
            (sec) => `
          <div class="section">
            <h3>${escapeHtml(sec.heading)}</h3>
            ${(sec.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            ${
              sec.bullets && sec.bullets.length > 0
                ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
                : ''
            }
            ${sec.tip ? `<div class="tip"><strong>Catatan Praktis:</strong> ${escapeHtml(sec.tip)}</div>` : ''}
          </div>
        `,
          )
          .join('')}
      </section>
    `,
    )
    .join('');

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Buku Panduan Keluarga Papua — UGUWO KAA OWAA</title>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #F5F2EB; color: #16241D; margin: 0; padding: 24px; line-height: 1.65; }
    .book { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid #DFD8CA; overflow: hidden; }
    .cover { background: #163B22; color: #fff; padding: 40px 32px; border-bottom: 5px solid #F2C22B; }
    .cover .eyebrow { color: #F2C22B; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .cover h1 { margin: 8px 0 6px; font-size: 28px; }
    .cover p { margin: 6px 0 0; color: #DCECE1; font-size: 15px; }
    .content { padding: 28px 32px; }
    .chapter { padding-bottom: 28px; margin-bottom: 28px; border-bottom: 1px solid #EFEAE0; }
    .chapter:last-child { border-bottom: none; margin-bottom: 0; }
    .badge { display: inline-block; background: #FAF4E4; color: #5C3D2E; border: 1px solid #E6DFD1; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
    h2 { color: #1D4A27; margin: 10px 0 4px; font-size: 21px; }
    .subtitle { color: #5E6D64; font-size: 13px; margin: 0 0 10px; }
    .summary { font-style: italic; color: #2F3F36; background: #FAF8F4; padding: 10px 14px; border-radius: 10px; }
    h3 { color: #16241D; font-size: 16px; margin: 16px 0 8px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .tip { background: #FAF4E4; border-left: 4px solid #C9A24D; padding: 10px 14px; border-radius: 8px; margin-top: 12px; font-size: 14px; }
    @media print { body { background: #fff; padding: 0; } .book { border: none; } }
  </style>
</head>
<body>
  <article class="book">
    <header class="cover">
      <div class="eyebrow">Rumah Keluarga dari Papua · Edisi Offline</div>
      <h1>Buku Panduan UGUWO KAA OWAA</h1>
      <p>&ldquo;Adat Dijaga, Agama Dihormati, Keluarga Dibangun, Generasi Dilindungi.&rdquo;</p>
    </header>
    <main class="content">
      ${chaptersMarkup}
    </main>
  </article>
</body>
</html>`;

  const blob = new Blob([html], {type: 'text/html;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Buku-Panduan-Keluarga-Papua-UGUWO-KAA-OWAA.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface GuidebookSectionProps {
  onAskAI: (promptText: string, topic?: string) => void;
  externalReaderRequest?: {chapterId: string; nonce: number} | null;
}

export function GuidebookSection({onAskAI, externalReaderRequest}: GuidebookSectionProps) {
  const [readerOpen, setReaderOpen] = useState(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [downloadedFeedback, setDownloadedFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!externalReaderRequest) return;
    const idx = GUIDEBOOK_CHAPTERS.findIndex((c) => c.id === externalReaderRequest.chapterId);
    if (idx >= 0) {
      setActiveChapterIdx(idx);
      setReaderOpen(true);
    }
  }, [externalReaderRequest]);

  const showFeedback = (message: string) => {
    setDownloadedFeedback(message);
    window.setTimeout(() => {
      setDownloadedFeedback((curr) => (curr === message ? null : curr));
    }, 3200);
  };

  const handleDownloadFullPdf = () => {
    downloadFullGuidebookPdf();
    showFeedback('Buku Panduan Lengkap 7 Bab (.PDF) berhasil diunduh!');
  };

  const handleDownloadChapterPdf = (chapter: GuideChapter) => {
    buildPdfFromChapters(
      [chapter],
      `UGUWO-KAA-OWAA-${chapter.number.replace(/\s+/g, '-')}-${chapter.id}.pdf`,
      `${chapter.number} · ${chapter.title}`,
    );
    showFeedback(`${chapter.number} (.PDF) berhasil diunduh!`);
  };

  const handleDownloadOfflineHtml = () => {
    downloadAllChaptersOfflineHtml();
    showFeedback('E-Book Offline 7 Bab (.HTML) berhasil diunduh!');
  };

  const activeChapter = GUIDEBOOK_CHAPTERS[activeChapterIdx] ?? GUIDEBOOK_CHAPTERS[0];
  const ActiveChapterIcon = activeChapter.icon;

  return (
    <section
      id="buku-panduan"
      className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12"
    >
      {/* Main Guidebook Showcase Banner */}
      <div className="overflow-hidden rounded-2xl border border-[#DFD8CA] bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Cover Visual Card */}
          <div className="flex flex-col justify-between bg-[#163B22] p-6 sm:p-8 text-white lg:col-span-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C22B] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16241D]">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>E-Book Resmi Gratis · 7 Bab</span>
              </span>

              <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                Buku Panduan Keluarga Papua
              </h2>
              <p className="mt-1.5 font-display text-sm font-semibold text-[#F2C22B]">
                Edisi Lengkap UGUWO KAA OWAA (Termasuk Bab 07 Dewasa Muda 18+)
              </p>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DCECE1]">
                Pegangan praktis untuk dewasa muda 18+, pasangan muda, orang tua, dan keluarga besar Papua berisi nilai adat, mas kawin bijak, 8 pilar parenting, gizi lokal, kemandirian ekonomi, hingga panduan fitur AI.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-center">
              <div className="rounded-xl bg-white/10 px-2 py-2">
                <p className="font-display text-lg font-extrabold text-[#F2C22B]">7</p>
                <p className="text-[10px] text-[#DCECE1]">Bab Lengkap</p>
              </div>
              <div className="rounded-xl bg-white/10 px-2 py-2">
                <p className="font-display text-lg font-extrabold text-[#F2C22B]">PDF</p>
                <p className="text-[10px] text-[#DCECE1]">Siap Cetak</p>
              </div>
              <div className="rounded-xl bg-white/10 px-2 py-2">
                <p className="font-display text-lg font-extrabold text-[#F2C22B]">100%</p>
                <p className="text-[10px] text-[#DCECE1]">Baca Offline</p>
              </div>
            </div>
          </div>

          {/* Right Actions & Quick Highlights */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                Unduh &amp; Simpan di HP atau Laptop
              </p>
              <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#16241D]">
                Pilih Format Buku Panduan yang Nyaman untuk Keluarga Ko
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[
                  'Ringkasan 7 Wilayah Adat & Mas Kawin Bijak',
                  'Peta Tumbuh Kembang Anak 0–18+ Tahun',
                  'Bab 07 Baru: Dewasa Muda 18+, Karier & UMKM Papua',
                  'Menu Gizi Lokal, Suara AI & Kalender Keluarga',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3 py-2.5 text-xs text-[#25352C]"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4A27]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-[#EFEAE0] pt-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadFullPdf}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#265D33] cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#F2C22B]" aria-hidden="true" />
                  <span>Unduh Buku Lengkap (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadOfflineHtml}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#1D4A27] bg-white px-5 py-2.5 text-xs font-semibold text-[#1D4A27] transition-colors hover:bg-[#E3EFE6] cursor-pointer"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>Unduh Versi Offline (HTML)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(0);
                    setReaderOpen(true);
                  }}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#DFD8CA] bg-[#FAF4E4] px-5 py-2.5 text-xs font-semibold text-[#5C3D2E] transition-colors hover:border-[#C9A24D] hover:bg-[#F5E9D3] cursor-pointer"
                >
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Baca di Layar</span>
                </button>
              </div>

              {downloadedFeedback && (
                <div
                  role="status"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#C5DEC9] bg-[#E3EFE6] px-3.5 py-2 text-xs font-semibold text-[#1D4A27]"
                >
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{downloadedFeedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7 Chapter Cards Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDEBOOK_CHAPTERS.map((chapter, idx) => {
          const Icon = chapter.icon;
          const isFeaturedBab07 = chapter.id === 'dewasa-muda-bab07';
          return (
            <div
              key={chapter.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-colors hover:border-[#1D4A27]/40 ${
                isFeaturedBab07
                  ? 'border-[#C9A24D] bg-linear-to-br from-white via-[#FAF8F4] to-[#FAF4E4] sm:col-span-2 lg:col-span-3'
                  : 'border-[#E2DCCF] bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${chapter.accentBg} ${chapter.accentText}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.85} aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-[#FAF4E4] px-2.5 py-0.5 text-[11px] font-bold text-[#5C3D2E]">
                    {chapter.number}
                  </span>
                </div>

                <h3 className="mt-3.5 font-display text-base font-bold text-[#16241D]">
                  {chapter.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#425249]">
                  {chapter.summary}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#EFEAE0] pt-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(idx);
                    setReaderOpen(true);
                  }}
                  className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F3F1EC] px-3 py-1.5 text-xs font-semibold text-[#16241D] transition-colors hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Baca Bab</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadChapterPdf(chapter)}
                  aria-label={`Unduh ${chapter.number} format PDF`}
                  className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl border border-[#1D4A27] px-3 py-1.5 text-xs font-semibold text-[#1D4A27] transition-colors hover:bg-[#1D4A27] hover:text-white cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Book Reader Modal */}
      {readerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Pembaca Buku Panduan Keluarga Papua"
        >
          <div className="flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#DFD8CA] bg-white shadow-2xl">
            {/* Reader Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#163B22] px-5 py-3.5 text-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2C22B] text-[#16241D]">
                  <ActiveChapterIcon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#F2C22B]">
                    {activeChapter.number} · Buku Panduan UGUWO KAA OWAA
                  </p>
                  <h3 className="truncate font-display text-sm sm:text-base font-bold text-white">
                    {activeChapter.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadChapterPdf(activeChapter)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#F2C22B] px-3 text-xs font-bold text-[#16241D] hover:bg-[#E0B11F] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Unduh Bab Ini (PDF)</span>
                  <span className="sm:hidden">PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReaderOpen(false)}
                  aria-label="Tutup pembaca buku panduan"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/12 text-white hover:bg-white/22 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Chapter Tabs Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#EFEAE0] bg-[#FAF8F4] px-4 py-2.5">
              {GUIDEBOOK_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveChapterIdx(idx)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    idx === activeChapterIdx
                      ? 'bg-[#1D4A27] text-white'
                      : 'border border-[#DFD8CA] bg-white text-[#425249] hover:border-[#1D4A27]'
                  }`}
                >
                  {ch.number}
                </button>
              ))}
            </div>

            {/* Chapter Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5C3D2E]">
                  {activeChapter.subtitle}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#25352C]">
                  {activeChapter.summary}
                </p>
              </div>

              {activeChapter.sections.map((sec) => (
                <div key={sec.heading} className="space-y-3">
                  <h4 className="font-display text-base sm:text-lg font-bold text-[#1D4A27]">
                    {sec.heading}
                  </h4>

                  {sec.paragraphs?.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm leading-relaxed text-[#25352C]"
                    >
                      {para}
                    </p>
                  ))}

                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {sec.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-[#25352C]"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A24D]"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.tip && (
                    <div className="rounded-xl border border-[#E6DFD1] bg-[#FAF4E4] p-4 text-xs sm:text-sm text-[#425249]">
                      <span className="font-bold text-[#5C3D2E]">Catatan Praktis: </span>
                      {sec.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reader Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFEAE0] bg-[#FAF8F4] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeChapterIdx === 0}
                  onClick={() => setActiveChapterIdx((prev) => Math.max(0, prev - 1))}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs font-semibold text-[#16241D] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  disabled={activeChapterIdx === GUIDEBOOK_CHAPTERS.length - 1}
                  onClick={() =>
                    setActiveChapterIdx((prev) =>
                      Math.min(GUIDEBOOK_CHAPTERS.length - 1, prev + 1),
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs font-semibold text-[#16241D] disabled:opacity-40 cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReaderOpen(false);
                    onAskAI(activeChapter.aiPrompt, activeChapter.title);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                  <span>Tanya Sahabat AI Tentang Bab Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
