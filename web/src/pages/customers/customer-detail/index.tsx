import { ArrowLeft, Pencil } from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHasPermission } from "@/hooks/use-auth";
import { useContacts } from "@/hooks/use-contacts";
import { useCustomer } from "@/hooks/use-customers";
import { useProjects } from "@/hooks/use-projects";

import { ContactsTab } from "./contacts-tab";
import { ContractHistoryTab } from "./contract-history-tab";
import { InfoTab } from "./info-tab";
import {
  TABS,
  TAB_SLUGS,
  type Tab,
  statusLabel,
  statusVariant,
  potentialLabel,
} from "./labels";

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: Tab =
    TABS.find((tab) => TAB_SLUGS[tab] === searchParams.get("tab")) ??
    "Info Umum";
  const setActiveTab = (tab: Tab) =>
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (tab === "Info Umum") params.delete("tab");
        else params.set("tab", TAB_SLUGS[tab]);
        return params;
      },
      { replace: true },
    );
  const canEdit = useHasPermission("customers.update");

  const { data: customer, isLoading } = useCustomer(id ?? "");
  const { data: contactsData } = useContacts(id ?? "");
  const { data: wonProjectsData } = useProjects({
    customerId: id ?? "",
    status: "won",
  });

  const wonProjects = wonProjectsData?.items ?? [];

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Memuat...</p>;
  if (!customer)
    return (
      <p className="text-sm text-muted-foreground">
        Pelanggan tidak ditemukan.
      </p>
    );

  const customerContacts = contactsData?.items ?? [];
  const contactName = (contactId?: string) =>
    customerContacts.find((c) => c.id === contactId)?.name ?? "-";

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={statusVariant[customer.status]}>
              {statusLabel[customer.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Potensi: {potentialLabel[customer.potential]}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/customers/${id}/edit`)}
          disabled={!canEdit}
        >
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="flex gap-1 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Info Umum" && <InfoTab customer={customer} />}

      {activeTab === "Kontak" && (
        <ContactsTab
          customerId={id ?? ""}
          contacts={customerContacts}
          onOpenContact={(contactId) => navigate(`/contacts/${contactId}`)}
        />
      )}

      {activeTab === "Riwayat Kontrak" && (
        <ContractHistoryTab
          wonProjects={wonProjects}
          contactName={contactName}
          onOpenProject={(projectId) => navigate(`/projects/${projectId}`)}
        />
      )}
    </div>
  );
}
