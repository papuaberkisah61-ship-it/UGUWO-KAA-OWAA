import {useEffect, useMemo, useState} from 'react';
import {jsPDF} from 'jspdf';
import {
  Briefcase,
  Calculator,
  Check,
  CheckCircle2,
  CheckSquare,
  Coins,
  Copy,
  Download,
  FileText,
  HeartHandshake,
  PiggyBank,
  RotateCcw,
  Sparkles,
  Store,
  Wallet,
} from 'lucide-react';

export type DewasaMudaToolId =
  | 'penghasilan'
  | 'darurat'
  | 'cv'
  | 'umkm'
  | 'modal'
  | 'perkawinan'
  | 'keluarga'
  | 'checklist';

const TOOL_TABS: {id: DewasaMudaToolId; label: string; shortLabel: string; icon: typeof Calculator}[] = [
  {id: 'penghasilan', label: 'Penghasilan & Pengeluaran', shortLabel: 'Arus Kas', icon: Wallet},
  {id: 'darurat', label: 'Tabungan & Dana Darurat', shortLabel: 'Dana Darurat', icon: PiggyBank},
  {id: 'cv', label: 'Generator CV & Lamaran', shortLabel: 'CV & Lamaran', icon: FileText},
  {id: 'umkm', label: 'Perencana UMKM Papua', shortLabel: 'UMKM Papua', icon: Store},
  {id: 'modal', label: 'Modal & Keuntungan', shortLabel: 'Hitung Modal', icon: Calculator},
  {id: 'perkawinan', label: 'Anggaran Perkawinan', shortLabel: 'Perkawinan', icon: HeartHandshake},
  {id: 'keluarga', label: 'Keuangan Keluarga', shortLabel: 'Keuangan Rumah', icon: Coins},
  {id: 'checklist', label: 'Checklist 90 Hari', shortLabel: '90 Hari', icon: CheckSquare},
];

const CHECKLIST_90_STORAGE_KEY = 'uguwo_90day_checklist_v1';

interface Checklist90Item {
  id: string;
  phase: 'Fase 1 · Hari 1–30 (Fondasi)' | 'Fase 2 · Hari 31–60 (Aksi)' | 'Fase 3 · Hari 61–90 (Konsistensi)';
  label: string;
}

const CHECKLIST_90_ITEMS: Checklist90Item[] = [
  {id: 'c1', phase: 'Fase 1 · Hari 1–30 (Fondasi)', label: 'Catat seluruh pemasukan dan pengeluaran harian selama minimal 14 hari berturut-turut.'},
  {id: 'c2', phase: 'Fase 1 · Hari 1–30 (Fondasi)', label: 'Pisahkan dompet/rekening transaksi harian dari tabungan khusus dana darurat.'},
  {id: 'c3', phase: 'Fase 1 · Hari 1–30 (Fondasi)', label: 'Rapikan salinan digital KTP, ijazah, transkrip, serta susun CV 1–2 halaman bebas salah ketik.'},
  {id: 'c4', phase: 'Fase 1 · Hari 1–30 (Fondasi)', label: 'Tetapkan jadwal tidur teratur, pola makan pangan lokal sehat, dan 15 menit belajar tiap hari.'},
  {id: 'c5', phase: 'Fase 1 · Hari 1–30 (Fondasi)', label: 'Berhenti dari kebiasaan cicilan/utang konsumtif baru yang tidak menghasilkan nilai tambah.'},
  {id: 'c6', phase: 'Fase 2 · Hari 31–60 (Aksi)', label: 'Ikuti minimal 1 pelatihan keterampilan (BLK, kursus daring gratis, atau pendampingan mentor).'},
  {id: 'c7', phase: 'Fase 2 · Hari 31–60 (Aksi)', label: 'Kirim minimal 5 lamaran kerja resmi ATAU lakukan uji coba jualan/jasa skala kecil kepada 5 pembeli nyata.'},
  {id: 'c8', phase: 'Fase 2 · Hari 31–60 (Aksi)', label: 'Latih simulasi wawancara kerja atau presentasi produk selama 15 menit bersama keluarga/teman.'},
  {id: 'c9', phase: 'Fase 2 · Hari 31–60 (Aksi)', label: 'Sisihkan minimal 10–15% dari setiap penghasilan yang diterima langsung ke tabungan darurat.'},
  {id: 'c10', phase: 'Fase 2 · Hari 31–60 (Aksi)', label: 'Bicarakan secara terbuka dan santun rencana kemandirian serta batas bantuan ekonomi bersama orang tua.'},
  {id: 'c11', phase: 'Fase 3 · Hari 61–90 (Konsistensi)', label: 'Evaluasi arus kas 60 hari pertama dan pangkas pos pengeluaran non-esensial terbesar.'},
  {id: 'c12', phase: 'Fase 3 · Hari 61–90 (Konsistensi)', label: 'Capai tabungan dana darurat awal minimal setara 1 bulan pengeluaran wajib (menuju target 3–6 bulan).'},
  {id: 'c13', phase: 'Fase 3 · Hari 61–90 (Konsistensi)', label: 'Susun peta rencana 1 tahun dan 5 tahun tertulis untuk karier, kesehatan, dan relasi/keluarga.'},
  {id: 'c14', phase: 'Fase 3 · Hari 61–90 (Konsistensi)', label: 'Pastikan perlindungan dasar (BPJS Kesehatan/Ketenagakerjaan dan kelengkapan dokumen sipil) aktif.'},
  {id: 'c15', phase: 'Fase 3 · Hari 61–90 (Konsistensi)', label: 'Bagikan satu ilmu atau keterampilan praktis kepada adik atau pemuda di komunitas sekitar.'},
];

function formatRupiah(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safe);
}

function parseSafeNumber(raw: string): number {
  const cleaned = Number(raw.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(cleaned) && cleaned >= 0 ? cleaned : 0;
}

interface DewasaMudaToolsProps {
  activeTool: DewasaMudaToolId;
  onSelectTool: (tool: DewasaMudaToolId) => void;
  onAskAI: (promptText: string, topic?: string) => void;
}

export function DewasaMudaTools({
  activeTool,
  onSelectTool,
  onAskAI,
}: DewasaMudaToolsProps) {
  // 1. Penghasilan & Pengeluaran
  const [incPrimary, setIncPrimary] = useState(3800000);
  const [incSide, setIncSide] = useState(700000);
  const [expHousing, setExpHousing] = useState(900000);
  const [expFood, setExpFood] = useState(1100000);
  const [expTransport, setExpTransport] = useState(450000);
  const [expFamilySupport, setExpFamilySupport] = useState(450000);
  const [expOther, setExpOther] = useState(500000);

  // 2. Tabungan & Dana Darurat
  const [emMonthlyNeed, setEmMonthlyNeed] = useState(2600000);
  const [emTargetMonths, setEmTargetMonths] = useState(4);
  const [emCurrentSaved, setEmCurrentSaved] = useState(2000000);
  const [emMonthlySave, setEmMonthlySave] = useState(650000);

  // 3. Generator CV & Surat Lamaran
  const [cvName, setCvName] = useState('Yohanes Wanimbo');
  const [cvLocation, setCvLocation] = useState('Jayapura, Papua');
  const [cvPhone, setCvPhone] = useState('0812-4000-1234');
  const [cvEmail, setCvEmail] = useState('yohanes.wanimbo@email.id');
  const [cvPosition, setCvPosition] = useState('Staf Administrasi & Operasional');
  const [cvCompany, setCvCompany] = useState('PT Maju Bersama Papua');
  const [cvEducation, setCvEducation] = useState('S1 Manajemen / D3 Administrasi Perkantoran');
  const [cvExperience, setCvExperience] = useState(
    'Pengelola logistik & pencatatan keuangan kegiatan pemuda komunitas selama 1 tahun; Magang administrasi arsip selama 3 bulan.',
  );
  const [cvSkills, setCvSkills] = useState(
    'Microsoft Excel & Google Sheets, pengetikan surat dinas rapi, komunikasi tim lintas budaya, disiplin waktu.',
  );
  const [cvCopiedState, setCvCopiedState] = useState<'cv' | 'letter' | null>(null);

  // 4. Perencana Usaha UMKM Papua
  const [umkmSector, setUmkmSector] = useState('Kuliner Pangan Lokal (Papeda / Olahan Sagu & Ikan)');
  const [umkmName, setUmkmName] = useState('Dapur Pangan Honai');
  const [umkmCustomer, setUmkmCustomer] = useState('Keluarga pekerja & mahasiswa di kota');
  const [umkmChannel, setUmkmChannel] = useState('Pre-order WhatsApp, pasar pagi, & titip jual kedai lokal');
  const [umkmUnique, setUmkmUnique] = useState(
    'Bahan segar dari mama-mama pasar lokal, kemasan bersih higienis, porsi bergizi keluarga.',
  );
  const [umkmChallenge, setUmkmChallenge] = useState('Menjaga konsistensi pasokan bahan & memisahkan kas usaha');

  // 5. Kalkulator Modal & Keuntungan Usaha
  const [bizFixedCapital, setBizFixedCapital] = useState(2500000);
  const [bizMonthlyOp, setBizMonthlyOp] = useState(600000);
  const [bizUnitCost, setBizUnitCost] = useState(14000);
  const [bizUnitPrice, setBizUnitPrice] = useState(25000);
  const [bizMonthlyUnits, setBizMonthlyUnits] = useState(180);

  // 6. Perencana Anggaran Perkawinan
  const [wedAdat, setWedAdat] = useState(15000000);
  const [wedReligiousCivil, setWedReligiousCivil] = useState(3500000);
  const [wedReception, setWedReception] = useState(10000000);
  const [wedHomeReserve, setWedHomeReserve] = useState(6000000);
  const [wedSavedNow, setWedSavedNow] = useState(9000000);
  const [wedMonthlySave, setWedMonthlySave] = useState(2000000);

  // 7. Perencana Keuangan Keluarga
  const [famIncome, setFamIncome] = useState(6500000);
  const [famNeeds, setFamNeeds] = useState(3400000);
  const [famSavings, setFamSavings] = useState(1300000);
  const [famParents, setFamParents] = useState(700000);
  const [famFlex, setFamFlex] = useState(700000);

  // 8. Checklist Kemandirian 90 Hari
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_90_STORAGE_KEY);
      if (!raw) return ['c1'];
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : ['c1'];
    } catch {
      return ['c1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_90_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore storage errors
    }
  }, [checkedIds]);

  // Derived Calculations
  const totalIncome = incPrimary + incSide;
  const totalExpenses = expHousing + expFood + expTransport + expFamilySupport + expOther;
  const netCashflow = totalIncome - totalExpenses;
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  const emTargetAmount = emMonthlyNeed * emTargetMonths;
  const emGap = Math.max(0, emTargetAmount - emCurrentSaved);
  const emProgressPct =
    emTargetAmount > 0 ? Math.min(100, Math.round((emCurrentSaved / emTargetAmount) * 100)) : 100;
  const emMonthsToGoal = emMonthlySave > 0 ? Math.ceil(emGap / emMonthlySave) : 0;

  const generatedCvText = useMemo(() => {
    return [
      `CURRICULUM VITAE (DAFTAR RIWAYAT HIDUP)`,
      `========================================`,
      `Nama Lengkap   : ${cvName || '-'}`,
      `Domisili       : ${cvLocation || '-'}`,
      `Telepon / WA   : ${cvPhone || '-'}`,
      `Email          : ${cvEmail || '-'}`,
      `Posisi Tujuan  : ${cvPosition || '-'}`,
      ``,
      `RINGKASAN PROFIL`,
      `Profesional muda yang berintegritas, disiplin waktu, dan siap berkontribusi nyata pada posisi ${cvPosition || 'yang dibutuhkan'} dengan semangat kerja sama tim yang kuat.`,
      ``,
      `PENDIDIKAN TERAKHIR`,
      `- ${cvEducation || '-'}`,
      ``,
      `PENGALAMAN KERJA / ORGANISASI / MAGANG`,
      `- ${cvExperience || '-'}`,
      ``,
      `KETERAMPILAN UTAMA`,
      `- ${cvSkills || '-'}`,
    ].join('\n');
  }, [cvName, cvLocation, cvPhone, cvEmail, cvPosition, cvEducation, cvExperience, cvSkills]);

  const generatedCoverLetterText = useMemo(() => {
    const todayFormatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    return [
      `${cvLocation || 'Papua'}, ${todayFormatted}`,
      ``,
      `Hal : Lamaran Pekerjaan — ${cvPosition || 'Posisi Terbuka'}`,
      ``,
      `Kepada Yth.`,
      `Bapak/Ibu Pimpinan / Bagian SDM`,
      `${cvCompany || 'Perusahaan / Instansi Tujuan'}`,
      `Di Tempat`,
      ``,
      `Dengan hormat,`,
      `Berdasarkan informasi kebutuhan tenaga kerja pada instansi yang Bapak/Ibu pimpin, saya yang bertanda tangan di bawah ini:`,
      `Nama            : ${cvName || '-'}`,
      `Pendidikan      : ${cvEducation || '-'}`,
      `Domisili        : ${cvLocation || '-'}`,
      `Kontak (HP/WA)  : ${cvPhone || '-'}`,
      `Email           : ${cvEmail || '-'}`,
      ``,
      `Bermaksud mengajukan lamaran untuk posisi ${cvPosition || 'yang tersedia'} di ${cvCompany || 'perusahaan Bapak/Ibu'}.`,
      ``,
      `Saya memiliki latar belakang dan pengalaman relevan berupa: ${cvExperience || '-'}. Selain itu, saya menguasai keterampilan ${cvSkills || '-'}, menjunjung tinggi kejujuran, keselamatan kerja, serta mampu bekerja sama secara harmonis dalam tim.`,
      ``,
      `Sebagai bahan pertimbangan, bersama surat ini saya lampirkan Curriculum Vitae dan dokumen pendukung. Besar harapan saya untuk mendapat kesempatan wawancara guna menjelaskan kontribusi yang dapat saya berikan.`,
      ``,
      `Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.`,
      ``,
      `Hormat saya,`,
      `${cvName || '-'}`,
    ].join('\n');
  }, [cvLocation, cvPosition, cvCompany, cvName, cvEducation, cvPhone, cvEmail, cvExperience, cvSkills]);

  const marginPerUnit = bizUnitPrice - bizUnitCost;
  const monthlyGrossProfit = marginPerUnit * bizMonthlyUnits;
  const monthlyNetProfit = monthlyGrossProfit - bizMonthlyOp;
  const bepUnitsPerMonth = marginPerUnit > 0 ? Math.ceil(bizMonthlyOp / marginPerUnit) : 0;
  const paybackMonths = monthlyNetProfit > 0 ? (bizFixedCapital / monthlyNetProfit).toFixed(1) : null;

  const wedTotalBudget = wedAdat + wedReligiousCivil + wedReception + wedHomeReserve;
  const wedGap = Math.max(0, wedTotalBudget - wedSavedNow);
  const wedMonthsLeft = wedMonthlySave > 0 ? Math.ceil(wedGap / wedMonthlySave) : 0;

  const famTotalPlanned = famNeeds + famSavings + famParents + famFlex;
  const famRemaining = famIncome - famTotalPlanned;
  const famSavingsPct = famIncome > 0 ? Math.round((famSavings / famIncome) * 100) : 0;
  const famNeedsPct = famIncome > 0 ? Math.round((famNeeds / famIncome) * 100) : 0;
  const famParentsPct = famIncome > 0 ? Math.round((famParents / famIncome) * 100) : 0;

  const checklistPct = Math.round((checkedIds.length / CHECKLIST_90_ITEMS.length) * 100);

  const handleCopyDoc = async (type: 'cv' | 'letter') => {
    try {
      await navigator.clipboard.writeText(
        type === 'cv' ? generatedCvText : generatedCoverLetterText,
      );
      setCvCopiedState(type);
      window.setTimeout(() => setCvCopiedState(null), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleDownloadCvPdf = () => {
    const doc = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'a4'});
    const marginX = 18;
    const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;
    let y = 20;

    doc.setFillColor(22, 59, 34);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(cvName || 'Curriculum Vitae', marginX, 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(242, 194, 43);
    doc.text(`${cvPosition}  ·  ${cvLocation}  ·  ${cvPhone}  ·  ${cvEmail}`, marginX, 20);

    y = 36;
    doc.setTextColor(22, 36, 29);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CURRICULUM VITAE', marginX, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const cvLines = doc.splitTextToSize(generatedCvText, maxWidth) as string[];
    cvLines.forEach((line) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, marginX, y);
      y += 5.2;
    });

    doc.addPage();
    y = 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(29, 74, 39);
    doc.text('SURAT LAMARAN KERJA', marginX, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(22, 36, 29);
    const letterLines = doc.splitTextToSize(generatedCoverLetterText, maxWidth) as string[];
    letterLines.forEach((line) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, marginX, y);
      y += 5.2;
    });

    doc.save(`CV-dan-Lamaran-${(cvName || 'Pelamar').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
  };

  const toggleChecklist = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div id="kalkulator-dewasa-muda" className="rounded-2xl border border-[#DFD8CA] bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[#EFEAE0] pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EFE6] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#1D4A27]">
            <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
            <span>8 Alat Hitung &amp; Rencana Nyata</span>
          </span>
          <h3 className="mt-1.5 font-display text-lg sm:text-xl font-bold text-[#16241D]">
            Kalkulator Ekonomi, Generator CV &amp; Checklist 90 Hari
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#425249]">
            Semua angka dihitung langsung dari data yang Anda masukkan untuk membantu pengambilan keputusan secara sadar dan realistis.
          </p>
        </div>
      </div>

      {/* 8 Tool Selector Tabs */}
      <div
        role="tablist"
        aria-label="Pilih alat kalkulator dan perencana dewasa muda"
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8"
      >
        {TOOL_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectTool(tab.id)}
              className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center text-[11px] font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#1D4A27] bg-[#1D4A27] text-white shadow-xs'
                  : 'border-[#E2DCCF] bg-[#FAF8F4] text-[#425249] hover:border-[#1D4A27]/50 hover:text-[#16241D]'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#F2C22B]' : 'text-[#1D4A27]'}`}
                aria-hidden="true"
              />
              <span className="leading-tight">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool Panel */}
      <div className="mt-5 rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] p-4 sm:p-6">
        {/* 1. KALKULATOR PENGHASILAN & PENGELUARAN */}
        {activeTool === 'penghasilan' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                1. Kalkulator Penghasilan &amp; Pengeluaran Bulanan
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {id: 'inc-1', label: 'Gaji / Penghasilan Utama (Rp)', val: incPrimary, set: setIncPrimary},
                  {id: 'inc-2', label: 'Penghasilan Sampingan / Usaha (Rp)', val: incSide, set: setIncSide},
                  {id: 'exp-1', label: 'Tempat Tinggal / Listrik / Air (Rp)', val: expHousing, set: setExpHousing},
                  {id: 'exp-2', label: 'Makan & Pangan Lokal (Rp)', val: expFood, set: setExpFood},
                  {id: 'exp-3', label: 'Transportasi & Pulsa/Internet (Rp)', val: expTransport, set: setExpTransport},
                  {id: 'exp-4', label: 'Dukungan Orang Tua / Keluarga Besar (Rp)', val: expFamilySupport, set: setExpFamilySupport},
                  {id: 'exp-5', label: 'Kebutuhan Pribadi & Lainnya (Rp)', val: expOther, set: setExpOther},
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-[11px] font-semibold text-[#425249]">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type="number"
                      min={0}
                      step={50000}
                      value={f.val}
                      onChange={(e) => f.set(parseSafeNumber(e.target.value))}
                      className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D] focus:border-[#1D4A27] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-5 lg:col-span-5">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Ringkasan Arus Kas Bulanan
                </p>
                <div className="flex items-baseline justify-between border-b border-[#EFEAE0] pb-2">
                  <span className="text-xs text-[#425249]">Total Pemasukan</span>
                  <span className="font-display text-sm font-bold text-[#1D4A27]">
                    {formatRupiah(totalIncome)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-b border-[#EFEAE0] pb-2">
                  <span className="text-xs text-[#425249]">Total Pengeluaran</span>
                  <span className="font-display text-sm font-bold text-[#5C3D2E]">
                    {formatRupiah(totalExpenses)} ({expenseRatio}%)
                  </span>
                </div>
                <div className="rounded-xl bg-[#FAF4E4] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5C3D2E]">
                    {netCashflow >= 0 ? 'Sisa Bersih Siap Ditabung' : 'Defisit (Pengeluaran Melebihi Pemasukan)'}
                  </span>
                  <span
                    className={`mt-1 block font-display text-2xl font-extrabold ${
                      netCashflow >= 0 ? 'text-[#1D4A27]' : 'text-[#8C3B2B]'
                    }`}
                  >
                    {formatRupiah(netCashflow)}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#425249]">
                  {netCashflow >= totalIncome * 0.15
                    ? 'Bagus! Arus kas sehat. Segera pindahkan minimal setengah dari sisa bersih ke tabungan dana darurat di awal bulan.'
                    : netCashflow >= 0
                      ? 'Arus kas cukup pas-pasan. Coba tinjau pos pengeluaran non-esensial agar bisa menyisihkan minimal 10% untuk cadangan.'
                      : 'Perhatian: Pengeluaran melebihi pemasukan. Evaluasi pengeluaran tidak mendesak agar tidak perlu menutup kekurangan dengan pinjaman berbunga.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Penghasilan bulanan saya ${formatRupiah(totalIncome)} dengan total pengeluaran ${formatRupiah(
                      totalExpenses,
                    )} (termasuk bantuan keluarga ${formatRupiah(
                      expFamilySupport,
                    )}), sehingga sisa bersih ${formatRupiah(
                      netCashflow,
                    )}. Berikan saran penataan anggaran yang realistis dan sehat.`,
                    'Ekonomi Keluarga',
                  )
                }
                className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Minta Evaluasi Sahabat AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. KALKULATOR TABUNGAN & DANA DARURAT */}
        {activeTool === 'darurat' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                2. Kalkulator Tabungan &amp; Dana Darurat
              </h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="em-need" className="block text-xs font-semibold text-[#425249]">
                    Pengeluaran Wajib per Bulan (Makan, Sewa, Transport, Listrik)
                  </label>
                  <input
                    id="em-need"
                    type="number"
                    min={0}
                    step={100000}
                    value={emMonthlyNeed}
                    onChange={(e) => setEmMonthlyNeed(parseSafeNumber(e.target.value))}
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="em-months" className="block text-xs font-semibold text-[#425249]">
                    Target Ketahanan Dana Darurat (Bulan)
                  </label>
                  <select
                    id="em-months"
                    value={emTargetMonths}
                    onChange={(e) => setEmTargetMonths(Number(e.target.value))}
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                  >
                    <option value={3}>3 Bulan (Lajang / Awal Karier)</option>
                    <option value={4}>4 Bulan (Menengah)</option>
                    <option value={6}>6 Bulan (Sudah Menikah / Punya Tanggungan)</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="em-now" className="block text-xs font-semibold text-[#425249]">
                      Tabungan Darurat Saat Ini (Rp)
                    </label>
                    <input
                      id="em-now"
                      type="number"
                      min={0}
                      step={100000}
                      value={emCurrentSaved}
                      onChange={(e) => setEmCurrentSaved(parseSafeNumber(e.target.value))}
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                    />
                  </div>
                  <div>
                    <label htmlFor="em-save" className="block text-xs font-semibold text-[#425249]">
                      Rencana Setoran per Bulan (Rp)
                    </label>
                    <input
                      id="em-save"
                      type="number"
                      min={0}
                      step={50000}
                      value={emMonthlySave}
                      onChange={(e) => setEmMonthlySave(parseSafeNumber(e.target.value))}
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-5 lg:col-span-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Proyeksi Pencapaian Dana Darurat
                </p>
                <div className="rounded-xl bg-[#E3EFE6] p-4">
                  <span className="text-xs font-medium text-[#1D4A27]">
                    Target Dana Darurat ({emTargetMonths} Bulan)
                  </span>
                  <p className="mt-1 font-display text-2xl font-extrabold text-[#16241D]">
                    {formatRupiah(emTargetAmount)}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#425249]">
                    <span>Ketercapaian Saat Ini</span>
                    <span>{emProgressPct}%</span>
                  </div>
                  <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-[#EFEAE0]">
                    <div
                      className="h-full rounded-full bg-[#1D4A27] transition-all"
                      style={{width: `${emProgressPct}%`}}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-3">
                    <span className="block text-[#5E6D64]">Kekurangan Dana</span>
                    <strong className="mt-0.5 block font-display text-sm text-[#5C3D2E]">
                      {formatRupiah(emGap)}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-3">
                    <span className="block text-[#5E6D64]">Perkiraan Waktu Tercapai</span>
                    <strong className="mt-0.5 block font-display text-sm text-[#1D4A27]">
                      {emGap === 0
                        ? 'Sudah Tercapai!'
                        : emMonthlySave > 0
                          ? `± ${emMonthsToGoal} bulan lagi`
                          : 'Isi setoran bulanan'}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Target dana darurat saya ${formatRupiah(emTargetAmount)} (${emTargetMonths} bulan). Saat ini baru terkumpul ${formatRupiah(
                      emCurrentSaved,
                    )} dengan kemampuan menabung ${formatRupiah(
                      emMonthlySave,
                    )}/bulan. Berikan tips menjaga konsistensi tabungan ini.`,
                    'Ekonomi Keluarga',
                  )
                }
                className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Konsultasi Strategi Menabung ke AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. GENERATOR CV & SURAT LAMARAN */}
        {activeTool === 'cv' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                3. Generator CV &amp; Surat Lamaran Kerja Otomatis
              </h4>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cv-name" className="block text-[11px] font-semibold text-[#425249]">
                    Nama Lengkap
                  </label>
                  <input
                    id="cv-name"
                    type="text"
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="cv-loc" className="block text-[11px] font-semibold text-[#425249]">
                    Kota / Kabupaten
                  </label>
                  <input
                    id="cv-loc"
                    type="text"
                    value={cvLocation}
                    onChange={(e) => setCvLocation(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="cv-phone" className="block text-[11px] font-semibold text-[#425249]">
                    Nomor HP / WhatsApp
                  </label>
                  <input
                    id="cv-phone"
                    type="text"
                    value={cvPhone}
                    onChange={(e) => setCvPhone(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="cv-email" className="block text-[11px] font-semibold text-[#425249]">
                    Email Aktif
                  </label>
                  <input
                    id="cv-email"
                    type="email"
                    value={cvEmail}
                    onChange={(e) => setCvEmail(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="cv-pos" className="block text-[11px] font-semibold text-[#425249]">
                    Posisi yang Dilamar
                  </label>
                  <input
                    id="cv-pos"
                    type="text"
                    value={cvPosition}
                    onChange={(e) => setCvPosition(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="cv-comp" className="block text-[11px] font-semibold text-[#425249]">
                    Instansi / Perusahaan Tujuan
                  </label>
                  <input
                    id="cv-comp"
                    type="text"
                    value={cvCompany}
                    onChange={(e) => setCvCompany(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cv-edu" className="block text-[11px] font-semibold text-[#425249]">
                  Pendidikan &amp; Pelatihan Terakhir
                </label>
                <input
                  id="cv-edu"
                  type="text"
                  value={cvEducation}
                  onChange={(e) => setCvEducation(e.target.value)}
                  className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                />
              </div>
              <div>
                <label htmlFor="cv-exp" className="block text-[11px] font-semibold text-[#425249]">
                  Pengalaman Kerja, Magang, atau Organisasi
                </label>
                <textarea
                  id="cv-exp"
                  rows={2}
                  value={cvExperience}
                  onChange={(e) => setCvExperience(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#DFD8CA] bg-white px-3 py-2 text-xs text-[#16241D]"
                />
              </div>
              <div>
                <label htmlFor="cv-skills" className="block text-[11px] font-semibold text-[#425249]">
                  Keterampilan Utama
                </label>
                <textarea
                  id="cv-skills"
                  rows={2}
                  value={cvSkills}
                  onChange={(e) => setCvSkills(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#DFD8CA] bg-white px-3 py-2 text-xs text-[#16241D]"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-4 sm:p-5 lg:col-span-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#5C3D2E]">
                    Pratinjau CV &amp; Surat Lamaran Siap Pakai
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => void handleCopyDoc('cv')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#DFD8CA] bg-[#FAF8F4] px-2.5 py-1 text-[11px] font-semibold text-[#16241D] hover:border-[#1D4A27] cursor-pointer"
                    >
                      {cvCopiedState === 'cv' ? (
                        <Check className="h-3 w-3 text-[#1D4A27]" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span>Salin CV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyDoc('letter')}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#DFD8CA] bg-[#FAF8F4] px-2.5 py-1 text-[11px] font-semibold text-[#16241D] hover:border-[#1D4A27] cursor-pointer"
                    >
                      {cvCopiedState === 'letter' ? (
                        <Check className="h-3 w-3 text-[#1D4A27]" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span>Salin Lamaran</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadCvPdf}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#1D4A27] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#265D33] cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-[#F2C22B]" aria-hidden="true" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>

                <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-3 font-sans text-[11px] leading-relaxed text-[#25352C]">
                  {generatedCoverLetterText}
                </pre>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Saya melamar sebagai "${cvPosition}" di "${cvCompany}". Pendidikan: ${cvEducation}. Pengalaman: ${cvExperience}. Keterampilan: ${cvSkills}. Bantu sempurnakan kalimat ringkasan profil dan beri 3 pertanyaan wawancara yang mungkin muncul.`,
                    'Keluarga Modern',
                  )
                }
                className="mt-3 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#1D4A27] bg-white px-4 py-2 text-xs font-semibold text-[#1D4A27] hover:bg-[#1D4A27] hover:text-white cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Perhalus CV &amp; Latih Wawancara bersama AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. PERENCANA USAHA UMKM PAPUA */}
        {activeTool === 'umkm' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                4. Perencana Usaha UMKM Berbasis Potensi Lokal Papua
              </h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="umkm-sector" className="block text-xs font-semibold text-[#425249]">
                    Bidang Potensi Lokal
                  </label>
                  <select
                    id="umkm-sector"
                    value={umkmSector}
                    onChange={(e) => setUmkmSector(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs font-semibold text-[#16241D]"
                  >
                    <option value="Kuliner Pangan Lokal (Papeda / Olahan Sagu & Ikan)">
                      Kuliner Pangan Lokal (Papeda / Olahan Sagu &amp; Ikan)
                    </option>
                    <option value="Kopi Pegunungan Papua & Minuman Kemasan">
                      Kopi Pegunungan Papua &amp; Minuman Kemasan
                    </option>
                    <option value="Kerajinan Noken, Ukiran & Budaya Resmi">
                      Kerajinan Noken, Ukiran &amp; Budaya Resmi
                    </option>
                    <option value="Pengolahan Ikan Asar / Hasil Laut Pesisir">
                      Pengolahan Ikan Asar / Hasil Laut Pesisir
                    </option>
                    <option value="Jasa Digital, Servis HP, atau Desain & Percetakan Lokal">
                      Jasa Digital, Servis HP, atau Desain &amp; Percetakan Lokal
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="umkm-name" className="block text-xs font-semibold text-[#425249]">
                    Nama Rencana Usaha
                  </label>
                  <input
                    id="umkm-name"
                    type="text"
                    value={umkmName}
                    onChange={(e) => setUmkmName(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="umkm-cust" className="block text-xs font-semibold text-[#425249]">
                    Siapa Pembeli Utama Anda?
                  </label>
                  <input
                    id="umkm-cust"
                    type="text"
                    value={umkmCustomer}
                    onChange={(e) => setUmkmCustomer(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="umkm-chan" className="block text-xs font-semibold text-[#425249]">
                    Cara Jualan &amp; Penyaluran
                  </label>
                  <input
                    id="umkm-chan"
                    type="text"
                    value={umkmChannel}
                    onChange={(e) => setUmkmChannel(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="umkm-uniq" className="block text-xs font-semibold text-[#425249]">
                    Keunggulan &amp; Nilai Lokal Produk
                  </label>
                  <input
                    id="umkm-uniq"
                    type="text"
                    value={umkmUnique}
                    onChange={(e) => setUmkmUnique(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
                <div>
                  <label htmlFor="umkm-chal" className="block text-xs font-semibold text-[#425249]">
                    Tantangan Utama yang Perlu Diantisipasi
                  </label>
                  <input
                    id="umkm-chal"
                    type="text"
                    value={umkmChallenge}
                    onChange={(e) => setUmkmChallenge(e.target.value)}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-xs text-[#16241D]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-5 lg:col-span-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Kanvas Rencana Aksi UMKM
                </p>
                <div className="rounded-xl border border-[#E6DFD1] bg-[#FAF4E4] p-4 space-y-2 text-xs text-[#25352C]">
                  <p>
                    <strong className="text-[#1D4A27]">Usaha:</strong> {umkmName || '-'} ({umkmSector})
                  </p>
                  <p>
                    <strong className="text-[#1D4A27]">Target Pelanggan:</strong> {umkmCustomer || '-'}
                  </p>
                  <p>
                    <strong className="text-[#1D4A27]">Saluran Penjualan:</strong> {umkmChannel || '-'}
                  </p>
                  <p>
                    <strong className="text-[#1D4A27]">Nilai Tambah Lokal:</strong> {umkmUnique || '-'}
                  </p>
                  <p>
                    <strong className="text-[#1D4A27]">Mitigasi Tantangan:</strong> {umkmChallenge || '-'}
                  </p>
                </div>
                <p className="text-[11px] leading-relaxed text-[#5E6D64]">
                  Catatan realistis: Tidak ada usaha yang otomatis untung tanpa uji pasar, kejujuran takaran/kualitas, pembukuan kas terpisah dari uang dapur, serta perizinan usaha resmi (NIB/PIRT bila produk pangan).
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Saya berencana merintis UMKM "${umkmName}" di bidang "${umkmSector}" dengan target pelanggan "${umkmCustomer}", saluran "${umkmChannel}", keunggulan "${umkmUnique}", dan tantangan "${umkmChallenge}". Berikan langkah uji coba 14 hari pertama yang realistis tanpa risiko besar.`,
                    'Ekonomi Keluarga',
                  )
                }
                className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Uji Ide UMKM Ini bersama Sahabat AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. KALKULATOR MODAL & KEUNTUNGAN USAHA */}
        {activeTool === 'modal' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                5. Kalkulator Modal, Harga Jual &amp; Titik Impas (BEP)
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {id: 'biz-fix', label: 'Modal Alat / Awal Sekali Beli (Rp)', val: bizFixedCapital, set: setBizFixedCapital},
                  {id: 'biz-op', label: 'Biaya Tetap per Bulan (Listrik, Lapak, Kuota)', val: bizMonthlyOp, set: setBizMonthlyOp},
                  {id: 'biz-cost', label: 'Biaya Bahan per 1 Produk/Jasa (Rp)', val: bizUnitCost, set: setBizUnitCost},
                  {id: 'biz-price', label: 'Harga Jual per 1 Produk/Jasa (Rp)', val: bizUnitPrice, set: setBizUnitPrice},
                  {id: 'biz-qty', label: 'Perkiraan Terjual per Bulan (Unit)', val: bizMonthlyUnits, set: setBizMonthlyUnits},
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-[11px] font-semibold text-[#425249]">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type="number"
                      min={0}
                      step={f.id === 'biz-qty' ? 5 : 1000}
                      value={f.val}
                      onChange={(e) => f.set(parseSafeNumber(e.target.value))}
                      className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-5 lg:col-span-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Simulasi Hitungan Usaha
                </p>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl bg-[#FAF8F4] p-3 border border-[#EFEAE0]">
                    <span className="text-[#5E6D64]">Laba Kotor per Unit</span>
                    <strong
                      className={`mt-0.5 block font-display text-sm ${
                        marginPerUnit > 0 ? 'text-[#1D4A27]' : 'text-[#8C3B2B]'
                      }`}
                    >
                      {formatRupiah(marginPerUnit)}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-[#FAF8F4] p-3 border border-[#EFEAE0]">
                    <span className="text-[#5E6D64]">Titik Impas Biaya Tetap (BEP)</span>
                    <strong className="mt-0.5 block font-display text-sm text-[#16241D]">
                      {marginPerUnit > 0 ? `${bepUnitsPerMonth} unit/bln` : 'Harga < Modal'}
                    </strong>
                  </div>
                </div>

                <div className="rounded-xl bg-[#E3EFE6] p-4">
                  <span className="text-xs font-medium text-[#1D4A27]">
                    Estimasi Laba Bersih Bulanan (Jika terjual {bizMonthlyUnits} unit)
                  </span>
                  <p
                    className={`mt-1 font-display text-2xl font-extrabold ${
                      monthlyNetProfit >= 0 ? 'text-[#16241D]' : 'text-[#8C3B2B]'
                    }`}
                  >
                    {formatRupiah(monthlyNetProfit)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#425249]">
                    {paybackMonths
                      ? `Perkiraan kembali modal alat awal: ± ${paybackMonths} bulan (simulasi matematis, bergantung penjualan nyata).`
                      : 'Naikkan harga jual atau efisiensi biaya agar usaha tidak merugi.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Dalam simulasi usaha saya: harga jual ${formatRupiah(bizUnitPrice)}, biaya bahan ${formatRupiah(
                      bizUnitCost,
                    )}, biaya operasional bulanan ${formatRupiah(
                      bizMonthlyOp,
                    )}, dan modal alat ${formatRupiah(
                      bizFixedCapital,
                    )}. Berikan saran cara menekan biaya bahan tanpa menurunkan kualitas.`,
                    'Ekonomi Keluarga',
                  )
                }
                className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Diskusikan Hitungan Modal ke AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. PERENCANA ANGGARAN PERKAWINAN */}
        {activeTool === 'perkawinan' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                6. Perencana Anggaran Perkawinan Adat, Agama &amp; Rumah Baru
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {id: 'wed-adat', label: 'Kesepakatan Adat & Mas Kawin Bijak (Rp)', val: wedAdat, set: setWedAdat},
                  {id: 'wed-rel', label: 'Pemberkatan Agama & Catatan Sipil (Rp)', val: wedReligiousCivil, set: setWedReligiousCivil},
                  {id: 'wed-rec', label: 'Jamuan Keluarga Sederhana (Rp)', val: wedReception, set: setWedReception},
                  {id: 'wed-home', label: 'Cadangan Awal Rumah Tangga (Rp)', val: wedHomeReserve, set: setWedHomeReserve},
                  {id: 'wed-now', label: 'Dana Sudah Terkumpul Saat Ini (Rp)', val: wedSavedNow, set: setWedSavedNow},
                  {id: 'wed-save', label: 'Rencana Tabungan Bersama / Bulan (Rp)', val: wedMonthlySave, set: setWedMonthlySave},
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-[11px] font-semibold text-[#425249]">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type="number"
                      min={0}
                      step={500000}
                      value={f.val}
                      onChange={(e) => f.set(parseSafeNumber(e.target.value))}
                      className="mt-1 min-h-[40px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-5 lg:col-span-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Rencana Biaya Bebas Utang
                </p>
                <div className="rounded-xl bg-[#FAF4E4] p-4">
                  <span className="text-xs font-medium text-[#5C3D2E]">
                    Total Rencana Anggaran Keseluruhan
                  </span>
                  <p className="mt-1 font-display text-2xl font-extrabold text-[#16241D]">
                    {formatRupiah(wedTotalBudget)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-3">
                    <span className="text-[#5E6D64]">Sisa Kekurangan Dana</span>
                    <strong className="mt-0.5 block font-display text-sm text-[#8C3B2B]">
                      {formatRupiah(wedGap)}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] p-3">
                    <span className="text-[#5E6D64]">Waktu Persiapan Menabung</span>
                    <strong className="mt-0.5 block font-display text-sm text-[#1D4A27]">
                      {wedGap === 0
                        ? 'Dana Sudah Cukup'
                        : wedMonthlySave > 0
                          ? `± ${wedMonthsLeft} bulan lagi`
                          : 'Isi tabungan/bln'}
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-[#425249]">
                  Prinsip bijak: Cadangan awal rumah tangga setelah acara sama pentingnya dengan hari pesta. Bicarakan kesepakatan adat secara hormat sesuai tradisi wilayah masing-masing agar tidak memicu utang jangka panjang.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Rencana anggaran pernikahan kami total ${formatRupiah(wedTotalBudget)} (termasuk cadangan awal rumah tangga ${formatRupiah(
                      wedHomeReserve,
                    )}). Bagaimana cara menyampaikan rencana anggaran sederhana namun bermartabat kepada keluarga besar dalam musyawarah adat?`,
                    'Perkawinan Adat',
                  )
                }
                className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Minta Panduan Musyawarah Adat ke AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 7. PERENCANA KEUANGAN KELUARGA */}
        {activeTool === 'keluarga' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-6">
              <h4 className="font-display text-base font-bold text-[#16241D]">
                7. Perencana Keuangan Rumah Tangga Bulanan
              </h4>
              <div className="space-y-2.5">
                {[
                  {id: 'fam-inc', label: 'Total Penghasilan Rumah Tangga / Gabungan (Rp)', val: famIncome, set: setFamIncome},
                  {id: 'fam-need', label: 'Kebutuhan Pokok Rumah & Kesehatan (Rp)', val: famNeeds, set: setFamNeeds},
                  {id: 'fam-sav', label: 'Tabungan, Dana Darurat & Pendidikan (Rp)', val: famSavings, set: setFamSavings},
                  {id: 'fam-par', label: 'Dukungan Orang Tua & Sosial Adat/Gereja/Masjid (Rp)', val: famParents, set: setFamParents},
                  {id: 'fam-flx', label: 'Rekreasi Keluarga & Kebutuhan Pribadi (Rp)', val: famFlex, set: setFamFlex},
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-[11px] font-semibold text-[#425249]">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type="number"
                      min={0}
                      step={100000}
                      value={f.val}
                      onChange={(e) => f.set(parseSafeNumber(e.target.value))}
                      className="mt-1 min-h-[38px] w-full rounded-xl border border-[#DFD8CA] bg-white px-3 text-sm font-semibold text-[#16241D]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#DFD8CA] bg-white p-5 lg:col-span-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5C3D2E]">
                  Komposisi Anggaran Rumah Tangga
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Kebutuhan Pokok ({famNeedsPct}%)</span>
                    <strong className="text-[#16241D]">{formatRupiah(famNeeds)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tabungan &amp; Masa Depan ({famSavingsPct}%)</span>
                    <strong className="text-[#1D4A27]">{formatRupiah(famSavings)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bakti Orang Tua &amp; Sosial ({famParentsPct}%)</span>
                    <strong className="text-[#5C3D2E]">{formatRupiah(famParents)}</strong>
                  </div>
                </div>

                <div className="rounded-xl bg-[#E3EFE6] p-4">
                  <span className="text-xs font-medium text-[#1D4A27]">
                    Selisih Belum Teralokasi
                  </span>
                  <p
                    className={`mt-1 font-display text-2xl font-extrabold ${
                      famRemaining >= 0 ? 'text-[#16241D]' : 'text-[#8C3B2B]'
                    }`}
                  >
                    {formatRupiah(famRemaining)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#425249]">
                    {famRemaining < 0
                      ? 'Total rencana melampaui penghasilan. Kurangi pos fleksibel terlebih dahulu.'
                      : famSavingsPct >= 15
                        ? 'Porsi tabungan sangat baik (≥ 15%) untuk ketahanan keluarga jangka panjang.'
                        : 'Usahakan porsi tabungan perlahan mencapai 15–20% dari penghasilan total.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Penghasilan rumah tangga kami ${formatRupiah(famIncome)} dengan kebutuhan pokok ${famNeedsPct}%, tabungan ${famSavingsPct}%, dan bantuan keluarga/sosial ${famParentsPct}%. Apakah komposisi ini sudah sehat?`,
                    'Ekonomi Keluarga',
                  )
                }
                className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Tinjau Anggaran Keluarga bersama AI</span>
              </button>
            </div>
          </div>
        )}

        {/* 8. CHECKLIST KEMANDIRIAN 90 HARI */}
        {activeTool === 'checklist' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-[#16241D]">
                  8. Checklist Program Kemandirian 90 Hari (Tersimpan Otomatis)
                </h4>
                <p className="text-xs text-[#425249]">
                  Centang setiap langkah nyata yang sudah Anda selesaikan. Progres otomatis tersimpan di perangkat ini.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#1D4A27] px-3 py-1 text-xs font-bold text-white tabular-nums">
                  {checkedIds.length}/{CHECKLIST_90_ITEMS.length} ({checklistPct}%)
                </span>
                <button
                  type="button"
                  onClick={() => setCheckedIds([])}
                  title="Reset checklist"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFD8CA] bg-white text-[#5E6D64] hover:text-[#8C3B2B] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E5DFD2]">
              <div
                className="h-full rounded-full bg-[#1D4A27] transition-all"
                style={{width: `${checklistPct}%`}}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {(
                [
                  'Fase 1 · Hari 1–30 (Fondasi)',
                  'Fase 2 · Hari 31–60 (Aksi)',
                  'Fase 3 · Hari 61–90 (Konsistensi)',
                ] as const
              ).map((phaseTitle) => (
                <div
                  key={phaseTitle}
                  className="rounded-xl border border-[#DFD8CA] bg-white p-4 space-y-2.5"
                >
                  <p className="font-display text-xs font-bold uppercase tracking-wide text-[#5C3D2E]">
                    {phaseTitle}
                  </p>
                  <div className="space-y-2">
                    {CHECKLIST_90_ITEMS.filter((i) => i.phase === phaseTitle).map((item) => {
                      const isDone = checkedIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleChecklist(item.id)}
                          aria-pressed={isDone}
                          className={`flex w-full items-start gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors cursor-pointer ${
                            isDone
                              ? 'border-[#C5DEC9] bg-[#E3EFE6]/60 text-[#1D4A27]'
                              : 'border-[#EFEAE0] bg-[#FAF8F4] text-[#25352C] hover:border-[#1D4A27]/40'
                          }`}
                        >
                          <CheckCircle2
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isDone ? 'text-[#1D4A27]' : 'text-[#B5AEA0]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className={isDone ? 'line-through opacity-85' : ''}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onAskAI(
                    `Saya sedang menjalankan Program Kemandirian 90 Hari dan baru menyelesaikan ${checkedIds.length} dari ${CHECKLIST_90_ITEMS.length} target (${checklistPct}%). Bantu saya menyusun semangat dan prioritas minggu ini.`,
                    'Keluarga Modern',
                  )
                }
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#1D4A27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#265D33] cursor-pointer"
              >
                <Briefcase className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
                <span>Minta Pendampingan Program 90 Hari ke AI</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
