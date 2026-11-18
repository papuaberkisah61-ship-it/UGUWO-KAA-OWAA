import {useState} from 'react';
import {
  CheckCircle2,
  Download,
  Info,
  Share,
  Smartphone,
  WifiOff,
  X,
} from 'lucide-react';
import {useOnlineStatus, usePWAInstall} from '../hooks/usePWAInstall';

export function PWAInstallGuideModal({
  open,
  onClose,
  isIOS,
  isInstallable,
  onNativeInstall,
}: {
  open: boolean;
  onClose: () => void;
  isIOS: boolean;
  isInstallable: boolean;
  onNativeInstall: () => Promise<boolean>;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-app-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#DFD8CA] bg-[#FAF8F4] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/pwa-192x192.png"
              alt="Ikon Aplikasi UGUWO KAA OWAA"
              className="h-12 w-12 rounded-xl border border-[#DFD8CA] shadow-xs"
            />
            <div>
              <h3
                id="install-app-modal-title"
                className="font-display text-base font-bold text-[#16241D]"
              >
                Pasang Aplikasi di HP
              </h3>
              <p className="text-xs text-[#425249]">
                UGUWO KAA OWAA · Versi Web App (PWA)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panduan instalasi"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#425249] hover:bg-[#EFEAE0] cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#25352C]">
          {isInstallable && (
            <button
              type="button"
              onClick={async () => {
                const ok = await onNativeInstall();
                if (ok) onClose();
              }}
              className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#265D33] cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Pasang Langsung ke Layar Utama</span>
            </button>
          )}

          {isIOS ? (
            <div className="rounded-xl border border-[#E2DCCF] bg-white p-4">
              <p className="font-display text-xs font-bold text-[#1D4A27]">
                Cara Pasang di iPhone / iPad (Safari):
              </p>
              <ol className="mt-2 space-y-1.5 list-decimal pl-4 text-xs text-[#425249]">
                <li>
                  Ketuk ikon{' '}
                  <strong className="inline-flex items-center gap-1 text-[#16241D]">
                    <Share className="h-3.5 w-3.5" aria-hidden="true" /> Bagikan (Share)
                  </strong>{' '}
                  di bilah bawah Safari.
                </li>
                <li>
                  Gulir ke bawah lalu pilih{' '}
                  <strong className="text-[#16241D]">Tambahkan ke Layar Utama (Add to Home Screen)</strong>.
                </li>
                <li>
                  Ketuk <strong className="text-[#16241D]">Tambah</strong> untuk membuka aplikasi layar penuh.
                </li>
              </ol>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E2DCCF] bg-white p-4">
              <p className="font-display text-xs font-bold text-[#1D4A27]">
                Cara Pasang di HP Android (Chrome / Edge):
              </p>
              <ol className="mt-2 space-y-1.5 list-decimal pl-4 text-xs text-[#425249]">
                <li>
                  Buka halaman ini di browser <strong className="text-[#16241D]">Google Chrome</strong> atau{' '}
                  <strong className="text-[#16241D]">Edge</strong>.
                </li>
                <li>
                  Ketuk ikon titik tiga (<strong className="text-[#16241D]">⋮</strong>) di pojok kanan atas browser.
                </li>
                <li>
                  Pilih <strong className="text-[#16241D]">Tambahkan ke Layar Utama</strong> atau{' '}
                  <strong className="text-[#16241D]">Instal Aplikasi</strong>, lalu ketuk{' '}
                  <strong className="text-[#16241D]">Instal</strong>.
                </li>
              </ol>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-xl border border-[#EFEAE0] bg-[#F3EFE7] p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5C3D2E]" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-[#425249]">
              <strong className="text-[#16241D]">Info tentang file APK:</strong> Aplikasi ini
              menggunakan teknologi Web App (PWA) resmi sehingga langsung terpasang ke layar utama HP
              sebagai aplikasi mandiri yang ringan, aman tanpa perlu mengizinkan sumber tidak
              dikenal, dan materi bacaan tetap tersimpan saat jaringan lemah. Untuk distribusi file{' '}
              <code>.apk</code> di Play Store, pengelola dapat membungkus URL aplikasi ini melalui
              Trusted Web Activity / PWABuilder.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full min-h-[42px] rounded-full border border-[#DFD8CA] bg-white py-2 text-xs font-semibold text-[#16241D] hover:bg-[#EFEAE0] cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export function HeaderInstallButton({
  className = '',
  onClickBeforeOpen,
}: {
  className?: string;
  onClickBeforeOpen?: () => void;
}) {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [guideOpen, setGuideOpen] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    onClickBeforeOpen?.();
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setGuideOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        aria-label="Pasang aplikasi UGUWO KAA OWAA di HP"
        className={
          className ||
          'inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#F2C22B] px-3.5 py-1.5 text-xs font-bold text-[#16241D] transition-colors hover:bg-[#E0B11F] whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <Download className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
        <span>Pasang App</span>
      </button>

      <PWAInstallGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        isIOS={isIOS}
        isInstallable={isInstallable}
        onNativeInstall={install}
      />
    </>
  );
}

export function MobileAppSection() {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [guideOpen, setGuideOpen] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) return;
    }
    setGuideOpen(true);
  };

  return (
    <section
      id="unduh-aplikasi"
      aria-label="Pasang aplikasi mobile UGUWO KAA OWAA"
      className="mx-auto max-w-6xl px-4 pb-10 sm:px-6"
    >
      <div className="overflow-hidden rounded-2xl border border-[#DFD8CA] bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <img
              src="/pwa-192x192.png"
              alt="Logo Aplikasi UGUWO KAA OWAA"
              className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl border border-[#E2DCCF] shadow-sm"
            />
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#5C3D2E]">
                <Smartphone className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                <span>Aplikasi HP · Android &amp; iPhone</span>
              </span>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#16241D]">
                Pasang UGUWO KAA OWAA Langsung di HP Anda
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#425249]">
                Akses Sahabat Keluarga Papua AI, panduan Parenting Keluarga Papua, Ketahanan Gizi,
                dan Dongeng Leluhur lebih cepat dari layar utama ponsel Anda—ringan, aman tanpa
                risiko file APK tak dikenal, dan tetap bisa membuka materi saat sinyal lemah.
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#25352C]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                  Tampilan layar penuh seperti aplikasi Android/iOS
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1D4A27]" aria-hidden="true" />
                  Hemat kuota &amp; memori penyimpanan
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isInstalled ? (
              <div className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#EAF3EC] px-5 py-2 text-xs font-semibold text-[#1D4A27]">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Aplikasi Sudah Terpasang</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => void handleInstallClick()}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1D4A27] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#265D33] whitespace-nowrap cursor-pointer"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {isInstallable
                      ? 'Pasang Aplikasi Sekarang'
                      : 'Pasang di HP (Android / iOS)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#DFD8CA] px-4 py-2.5 text-xs font-semibold text-[#16241D] transition-colors hover:border-[#1D4A27] hover:text-[#1D4A27] whitespace-nowrap cursor-pointer"
                >
                  Panduan &amp; Info APK
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <PWAInstallGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        isIOS={isIOS}
        isInstallable={isInstallable}
        onNativeInstall={install}
      />
    </section>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-[#C9A24D] bg-[#163B22] px-4 py-2 text-xs font-medium text-white shadow-lg"
    >
      <WifiOff className="h-3.5 w-3.5 text-[#F2C22B]" aria-hidden="true" />
      <span>Mode Offline — Materi halaman tetap tersimpan untuk dibaca</span>
    </div>
  );
}
