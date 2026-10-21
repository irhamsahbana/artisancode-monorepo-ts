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
import { customerService } from "@/services/customer";

import type {
  CustomerImportDryRunResult,
  CustomerImportExecuteResult,
} from "@artisancode/api-types";

interface CustomerImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CustomerImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: CustomerImportDialogProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [dryRunResult, setDryRunResult] =
    React.useState<CustomerImportDryRunResult | null>(null);
  const [importResult, setImportResult] =
    React.useState<CustomerImportExecuteResult | null>(null);
  const [previewTab, setPreviewTab] = React.useState<
    "customers" | "keyPersons" | "errors"
  >("customers");
  const [mode, setMode] = React.useState<"skip" | "upsert">("skip");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep(1);
    setFile(null);
    setDryRunResult(null);
    setImportResult(null);
    setPreviewTab("customers");
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
      await customerService.downloadTemplate();
      toast.success("Template Excel berhasil diunduh.");
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
      const result = await customerService.dryRunImport(selectedFile);
      setDryRunResult(result);
      if (result.errors.length > 0 && result.validCustomers === 0) {
        setPreviewTab("errors");
      } else {
        setPreviewTab("customers");
      }
      setStep(2);
      toast.success("File berhasil dianalisis.");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menganalisis file Excel.",
      );
      setFile(null);
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
      const result = await customerService.executeImport(file, mode);
      setImportResult(result);
      setStep(3);
      toast.success("Impor data berhasil diproses.");
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal melakukan impor data.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import Data Pelanggan & Key Person
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              "Unggah berkas Excel (.xlsx) untuk menambahkan data pelanggan dan kontak PIC secara massal."}
            {step === 2 &&
              "Periksa hasil analisis data sebelum dieksekusi ke dalam basis data CRM."}
            {step === 3 && "Ringkasan proses impor data pelanggan."}
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
                  Template ini sudah disiapkan dengan format Sheet Data
                  Customer, Data Key Person, serta referensi master kategori &
                  sektor.
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
                className="hidden"
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
                    Memvalidasi baris data customer dan key person
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
                  Data Customer
                </span>
                <div className="text-lg font-bold flex items-center gap-1.5 mt-0.5">
                  <span>{dryRunResult.validCustomers}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    / {dryRunResult.totalCustomers} baris
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Data Key Person
                </span>
                <div className="text-lg font-bold flex items-center gap-1.5 mt-0.5">
                  <span>{dryRunResult.validKeyPersons}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    / {dryRunResult.totalKeyPersons} baris
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
                  Baris dengan error tidak akan diimpor. Baris data yang valid
                  tetap dapat diproses ke basis data.
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b pb-2">
              <Button
                variant={previewTab === "customers" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewTab("customers")}
              >
                Data Customer ({dryRunResult.previewCustomers.length})
              </Button>
              <Button
                variant={previewTab === "keyPersons" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewTab("keyPersons")}
              >
                Key Person ({dryRunResult.previewKeyPersons.length})
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

            {/* Tab: Customers Preview */}
            {previewTab === "customers" && (
              <div className="border rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-xs">
                  <thead className="bg-muted text-muted-foreground font-medium sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Baris</th>
                      <th className="p-2 text-left">Nama Perusahaan</th>
                      <th className="p-2 text-left">Kategori</th>
                      <th className="p-2 text-left">Segmentasi</th>
                      <th className="p-2 text-left">Area</th>
                      <th className="p-2 text-left">Tipe</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dryRunResult.previewCustomers.map((c, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-mono text-muted-foreground">
                          {c.rowNumber}
                        </td>
                        <td className="p-2 font-medium">{c.name}</td>
                        <td className="p-2">{c.categoryName || "-"}</td>
                        <td className="p-2">{c.segmentationName || "-"}</td>
                        <td className="p-2">{c.areaName || "-"}</td>
                        <td className="p-2">{c.companyType || "-"}</td>
                        <td className="p-2 capitalize">
                          <Badge variant="outline" className="text-[10px] py-0">
                            {c.status || "prospect"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {dryRunResult.previewCustomers.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-4 text-center text-muted-foreground"
                        >
                          Tidak ada baris data customer yang valid
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Key Persons Preview */}
            {previewTab === "keyPersons" && (
              <div className="border rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-xs">
                  <thead className="bg-muted text-muted-foreground font-medium sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Baris</th>
                      <th className="p-2 text-left">Perusahaan</th>
                      <th className="p-2 text-left">Nama PIC</th>
                      <th className="p-2 text-left">Jabatan</th>
                      <th className="p-2 text-left">WhatsApp</th>
                      <th className="p-2 text-left">Telepon Tetap</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Kontak Penting</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dryRunResult.previewKeyPersons.map((kp, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-mono text-muted-foreground">
                          {kp.rowNumber}
                        </td>
                        <td className="p-2 font-medium">{kp.customerName}</td>
                        <td className="p-2 font-medium">{kp.name}</td>
                        <td className="p-2">{kp.position || "-"}</td>
                        <td className="p-2 font-mono">{kp.whatsapp || "-"}</td>
                        <td className="p-2 font-mono">
                          {kp.landline
                            ? `+${kp.landlineCountryCode ?? "62"} ${kp.landline}`
                            : "-"}
                        </td>
                        <td className="p-2">{kp.email || "-"}</td>
                        <td className="p-2">
                          {kp.isPrimary ? (
                            <Badge className="text-[10px] py-0">Penting</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {dryRunResult.previewKeyPersons.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-4 text-center text-muted-foreground"
                        >
                          Tidak ada baris data key person yang valid
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Errors */}
            {previewTab === "errors" && (
              <div className="border rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-xs">
                  <thead className="bg-muted text-muted-foreground font-medium sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Sheet</th>
                      <th className="p-2 text-left">Baris</th>
                      <th className="p-2 text-left">Kolom</th>
                      <th className="p-2 text-left">Keterangan Error</th>
                      <th className="p-2 text-left">Nilai Masukan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dryRunResult.errors.map((err, idx) => (
                      <tr key={idx} className="hover:bg-muted/40">
                        <td className="p-2 font-medium">{err.sheet}</td>
                        <td className="p-2 font-mono">{err.row}</td>
                        <td className="p-2 font-medium text-amber-700 dark:text-amber-400">
                          {err.field || "-"}
                        </td>
                        <td className="p-2 text-destructive font-medium">
                          {err.message}
                        </td>
                        <td className="p-2 font-mono text-muted-foreground max-w-xs truncate">
                          {err.value || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mode selection */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold">
                Opsi Duplikasi Data Pelanggan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setMode("skip")}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    mode === "skip"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="import-mode"
                      checked={mode === "skip"}
                      onChange={() => setMode("skip")}
                      className="cursor-pointer"
                    />
                    <span className="text-xs font-semibold">
                      Lewati yang sudah ada (Skip)
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 ml-5">
                    Hanya tambah customer baru. Jika nama perusahaan sudah ada
                    di sistem, lewati baris tersebut.
                  </p>
                </div>

                <div
                  onClick={() => setMode("upsert")}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    mode === "upsert"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="import-mode"
                      checked={mode === "upsert"}
                      onChange={() => setMode("upsert")}
                      className="cursor-pointer"
                    />
                    <span className="text-xs font-semibold">
                      Perbarui yang sudah ada (Upsert)
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 ml-5">
                    Jika nama perusahaan sudah ada di sistem, perbarui datanya
                    dengan nilai terbaru dari Excel ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT SUMMARY */}
        {step === 3 && importResult && (
          <div className="space-y-6 py-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold">
                Impor Data Berhasil Selesai!
              </h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Data telah tersimpan ke dalam basis data CRM secara aman dan
                terintegrasi.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Customer Baru
                </span>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  +{importResult.createdCustomers}
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Customer Diperbarui
                </span>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {importResult.updatedCustomers}
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Customer Dilewati
                </span>
                <div className="text-xl font-bold text-muted-foreground mt-1">
                  {importResult.skippedCustomers}
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">
                  Key Person PIC
                </span>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  +{importResult.createdKeyPersons}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIALOG FOOTERS */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2 pt-2 border-t">
          {step === 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          )}

          {step === 2 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                disabled={isImporting}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Ganti File
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteImport}
                disabled={
                  isImporting ||
                  ((dryRunResult?.validCustomers ?? 0) === 0 &&
                    (dryRunResult?.validKeyPersons ?? 0) === 0)
                }
                className="w-full sm:w-auto"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses Impor...
                  </>
                ) : (
                  "Proses Impor ke CRM"
                )}
              </Button>
            </>
          )}

          {step === 3 && (
            <Button
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="w-full sm:w-auto ml-auto"
            >
              Selesai & Lihat Data
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
