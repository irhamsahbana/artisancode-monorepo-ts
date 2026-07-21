import { Download, Plus, Share, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isAndroid = /android/i.test(navigator.userAgent);
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone =
  (navigator as unknown as { standalone?: boolean }).standalone === true;

// ponytail: only Android Chrome fires beforeinstallprompt; iOS Safari has no
// install prompt API at all, so it gets a step-by-step guide instead.
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (!isAndroid) return;
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleAndroidInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (isAndroid && deferredPrompt) {
    return (
      <Button size="sm" variant="outline" onClick={handleAndroidInstall}>
        <Download className="mr-1 h-4 w-4" />
        Download Aplikasi
      </Button>
    );
  }

  if (isIOS && !isStandalone) {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowIOSGuide(true)}
        >
          <Download className="mr-1 h-4 w-4" />
          Download Aplikasi
        </Button>

        <Dialog open={showIOSGuide} onOpenChange={setShowIOSGuide}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Simpan ke Layar Utama</DialogTitle>
            </DialogHeader>

            <ol className="grid gap-3 py-2 text-sm">
              <li className="flex items-center gap-3 rounded-md border p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  1
                </span>
                <span>
                  Ketuk ikon <Share className="mx-1 inline h-4 w-4" /> Bagikan
                  di toolbar Safari (&quot;Share&quot;).
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-md border p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  2
                </span>
                <span>
                  Gulir ke bawah, ketuk{" "}
                  <SquarePlus className="mx-1 inline h-4 w-4" />
                  &quot;Tambah ke Layar Utama&quot; (&quot;Add to Home
                  Screen&quot;).
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-md border p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  3
                </span>
                <span>
                  Ketuk <Plus className="mx-1 inline h-4 w-4" />
                  &quot;Tambah&quot; (&quot;Add&quot;) di pojok kanan atas.
                </span>
              </li>
            </ol>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}
