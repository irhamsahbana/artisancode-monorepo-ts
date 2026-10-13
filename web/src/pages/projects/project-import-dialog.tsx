import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Upload,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/pages/projects/project-status";
import { projectService } from "@/services/project";

import type {
  ProjectImportDryRunResult,
  ProjectImportExecuteResult,
} from "@artisancode/api-types";

interface ProjectImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: ProjectImportDialogProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [dryRunResult, setDryRunResult] =
    React.useState<ProjectImportDryRunResult | null>(null);
  const [importResult, setImportResult] =
    React.useState<ProjectImportExecuteResult | null>(null);
  const [previewTab, setPreviewTab] = React.useState<
    "projects" | "products" | "errors"
  >("projects");
  const [mode, setMode] = React.useState<"skip" | "upsert">("skip");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep(1);
    setFile(null);
    setDryRunResult(null);
    setImportResult(null);
    setPreviewTab("projects");
    setMode("skip");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await projectService.downloadTemplate();
      toast.success("Template Excel proyek berhasil diunduh.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengunduh template Excel",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileProcess = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Hanya file Excel format .xlsx yang didukung.");
      return;
    }

    setFile(selectedFile);
    setIsValidating(true);
    try {
      const result = await projectService.dryRunImport(selectedFile);
      setDryRunResult(result);
      if (result.errors.length > 0 && result.validProjects === 0) {
        setPreviewTab("errors");
      } else {
        setPreviewTab("projects");
      }
      setStep(2);
      toast.info("Analisis berkas selesai. Silakan tinjau data proyek.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal memproses file Excel proyek",
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await projectService.executeImport(file, mode);
      setImportResult(result);
      setStep(3);
      toast.success("Data proyek berhasil diimpor ke CRM.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengeksekusi impor proyek",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleFinish = () => {
    handleOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import Data Proyek & Kebutuhan Produk (Excel)
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              "Unggah berkas Excel (.xlsx) untuk menambahkan data proyek dan kebutuhan produk secara massal."}
            {step === 2 &&
              "Periksa hasil analisis data sebelum dieksekusi ke dalam database CRM."}
            {step === 3 && "Ringkasan hasil impor data proyek."}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: UPLOAD & DOWNLOAD TEMPLATE */}
        {step === 1 && (
          <div className="space-y-6 py-2">
            {/* Template Download Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-muted/30 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  Gunakan Template Excel CRM Wika
                </h4>
                <p className="text-xs text-muted-foreground">
                  Template ini sudah memuat Sheet Data Proyek, Kebutuhan Produk,
                  serta sheet referensi daftar pelanggan dan produk aktif di DB.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="shrink-0"
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Unduh Template (.xlsx)
              </Button>
            </div>

            {/* Dropzone Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />

              {isValidating ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm font-medium">
                    Menganalisis file Excel...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Memvalidasi relasi pelanggan, produk, dan baris proyek
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Tarik & lepas file Excel di sini, atau klik untuk memilih
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maksimal ukuran file 10MB (.xlsx)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW & CONFIRMATION */}
        {step === 2 && dryRunResult && (
          <div className="space-y-5 py-2">
            {/* Stats badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Data Proyek
                </span>
                <div className="text-lg font-bold flex items-center gap-1.5 mt-0.5">
                  <span>{dryRunResult.validProjects}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    / {dryRunResult.totalProjects} baris
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Kebutuhan Produk
                </span>
                <div className="text-lg font-bold flex items-center gap-1.5 mt-0.5">
                  <span>{dryRunResult.validProducts}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    / {dryRunResult.totalProducts} baris
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Catatan / Error
                </span>
                <div className="text-lg font-bold flex items-center gap-1.5 mt-0.5">
                  <span
                    className={
                      dryRunResult.errors.length > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {dryRunResult.errors.length}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    baris bermasalah
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">Nama File</span>
                <div
                  className="text-sm font-medium truncate mt-1"
                  title={file?.name}
                >
                  {file?.name}
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {dryRunResult.errors.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">
                    Ditemukan {dryRunResult.errors.length} catatan validasi.
                  </span>{" "}
                  Baris dengan error tidak akan diimpor. Baris proyek yang valid
                  tetap dapat diproses ke basis data.
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b pb-2">
              <Button
                variant={previewTab === "projects" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewTab("projects")}
              >
                Data Proyek ({dryRunResult.previewProjects.length})
              </Button>
              <Button
                variant={previewTab === "products" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewTab("products")}
              >
                Kebutuhan Produk ({dryRunResult.previewProducts.length})
              </Button>
              {dryRunResult.errors.length > 0 && (
                <Button
                  variant={previewTab === "errors" ? "destructive" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewTab("errors")}
                  className="gap-1"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Daftar Catatan & Error ({dryRunResult.errors.length})
                </Button>
              )}
            </div>

            {/* Tab: Projects Preview */}
            {previewTab === "projects" && (
              <div className="border rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-xs">
                  <thead className="bg-muted text-muted-foreground font-medium sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Baris</th>
                      <th className="p-2 text-left">No. Proyek</th>
                      <th className="p-2 text-left">Nama Proyek</th>
                      <th className="p-2 text-left">Pelanggan</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Nilai Estimasi</th>
                      <th className="p-2 text-left">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dryRunResult.previewProjects.map((p, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-mono text-muted-foreground">
                          {p.rowNumber}
                        </td>
                        <td className="p-2 font-mono">
                          {p.projectNumber || (
                            <span className="text-muted-foreground italic">
                              (Auto)
                            </span>
                          )}
                        </td>
                        <td className="p-2 font-medium">{p.name}</td>
                        <td className="p-2">{p.customerName}</td>
                        <td className="p-2 capitalize">
                          <Badge variant="outline" className="text-[10px] py-0">
                            {p.status || "prospect"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {p.estimatedValue ? formatRupiah(p.estimatedValue) : "-"}
                        </td>
                        <td className="p-2">{p.location || "-"}</td>
                      </tr>
                    ))}
                    {dryRunResult.previewProjects.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-6 text-center text-muted-foreground"
                        >
                          Tidak ada baris data proyek yang valid.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Products Preview */}
            {previewTab === "products" && (
              <div className="border rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-xs">
                  <thead className="bg-muted text-muted-foreground font-medium sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Baris</th>
                      <th className="p-2 text-left">Ref Proyek</th>
                      <th className="p-2 text-left">Nama Produk</th>
                      <th className="p-2 text-left">Volume</th>
                      <th className="p-2 text-left">Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dryRunResult.previewProducts.map((pr, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-mono text-muted-foreground">
                          {pr.rowNumber}
                        </td>
                        <td className="p-2 font-medium">{pr.projectRef}</td>
                        <td className="p-2">{pr.productName}</td>
                        <td className="p-2 font-medium">{pr.quantity}</td>
                        <td className="p-2 text-muted-foreground">
                          {pr.unit || "-"}
                        </td>
                      </tr>
                    ))}
                    {dryRunResult.previewProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-muted-foreground"
                        >
                          Tidak ada data kebutuhan produk (Sheet Kebutuhan Produk
                          opsional).
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Errors List */}
            {previewTab === "errors" && (
              <div className="border rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-xs">
                  <thead className="bg-destructive/10 text-destructive font-medium sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Sheet</th>
                      <th className="p-2 text-left">Baris</th>
                      <th className="p-2 text-left">Kolom</th>
                      <th className="p-2 text-left">Nilai</th>
                      <th className="p-2 text-left">Pesan Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dryRunResult.errors.map((err, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-medium">{err.sheet}</td>
                        <td className="p-2 font-mono">{err.row}</td>
                        <td className="p-2">{err.field || "-"}</td>
                        <td className="p-2 font-mono text-muted-foreground max-w-[120px] truncate">
                          {err.value || "-"}
                        </td>
                        <td className="p-2 text-destructive">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mode selection */}
            <div className="p-4 rounded-lg border bg-muted/20 space-y-2">
              <label className="text-xs font-semibold block">
                Tindakan Jika Proyek / Nomor Proyek Sudah Ada:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                    mode === "skip"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="skip"
                    checked={mode === "skip"}
                    onChange={() => setMode("skip")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-semibold block text-foreground">
                      Lewati Duplikat (Skip)
                    </span>
                    <span className="text-muted-foreground text-[11px] block mt-0.5">
                      Proyek yang sudah ada di database tidak akan diubah atau
                      ditimpa.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                    mode === "upsert"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="upsert"
                    checked={mode === "upsert"}
                    onChange={() => setMode("upsert")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-semibold block text-foreground">
                      Perbarui Data Lama (Upsert)
                    </span>
                    <span className="text-muted-foreground text-[11px] block mt-0.5">
                      Perbarui nilai estimasi, status, dan produk pada proyek
                      yang cocok.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT SUMMARY */}
        {step === 3 && importResult && (
          <div className="space-y-6 py-6 text-center">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold">Impor Proyek Berhasil</h3>
              <p className="text-xs text-muted-foreground">
                Data proyek telah berhasil diproses ke basis data CRM Wika.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left">
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Proyek Baru
                </span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  +{importResult.createdProjects}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Diperbarui
                </span>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {importResult.updatedProjects}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">Dilewati</span>
                <p className="text-xl font-bold text-muted-foreground mt-1">
                  {importResult.skippedProjects}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Item Produk
                </span>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {importResult.attachedProducts}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t pt-4 flex flex-row items-center justify-between sm:justify-between w-full">
          {step === 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                Batal
              </Button>
              <div />
            </>
          )}

          {step === 2 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                disabled={isImporting}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Ganti Berkas
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenChange(false)}
                  disabled={isImporting}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  onClick={handleExecuteImport}
                  disabled={
                    isImporting ||
                    !dryRunResult ||
                    dryRunResult.validProjects === 0
                  }
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Mulai Impor Proyek"
                  )}
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="w-full flex justify-end">
              <Button size="sm" onClick={handleFinish}>
                Selesai & Muat Ulang
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
