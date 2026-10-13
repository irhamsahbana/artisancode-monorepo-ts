import { env } from "@/config/env";
import { api } from "@/lib/api";

import type {
  CreateCustomerReq,
  Customer,
  CustomerImportDryRunResult,
  CustomerImportExecuteResult,
  CustomerList,
  UpdateCustomerReq,
} from "@artisancode/api-types";

export interface CustomerQuery {
  q?: string;
  status?: string;
  potential?: string;
  segmentation_id?: string;
  area_id?: string;
  per_page?: number;
  page?: number;
}

export const customerService = {
  list: (params?: CustomerQuery) =>
    api.get<CustomerList>("/customers", params as Record<string, string>),

  get: (id: string) => api.get<Customer>(`/customers/${id}`),

  create: (body: CreateCustomerReq) =>
    api.post<Customer>("/customers", toSnakeBody(body)),

  update: (id: string, body: UpdateCustomerReq) =>
    api.put<Customer>(`/customers/${id}`, toSnakeBody(body)),

  delete: (id: string) => api.del(`/customers/${id}`),

  downloadTemplate: async () => {
    const token = localStorage.getItem("token") ?? "";
    const res = await fetch(`${env.API_BASE_URL}/api/customers/template`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Gagal mengunduh template Excel");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_import_customer_crm_wika.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  dryRunImport: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<CustomerImportDryRunResult>(
      "/customers/import/dry-run",
      formData,
    );
  },

  executeImport: (file: File, mode: "upsert" | "skip" = "skip") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    return api.post<CustomerImportExecuteResult>("/customers/import", formData);
  },
};

function toSnakeBody(body: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v]),
  );
}
