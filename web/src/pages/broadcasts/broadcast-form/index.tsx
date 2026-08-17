import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useHasPermission } from "@/hooks/use-auth";
import { useCreateBroadcast } from "@/hooks/use-broadcasts";
import { useCategoryList } from "@/hooks/use-categories";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { contactService } from "@/services/contact";

import { AudienceFilters } from "./audience-filters";
import { RecipientsTable } from "./recipients-table";
import { schema, emptyValues, type FormValues } from "./schema";
import { TemplateFields } from "./template-fields";

import type { ContactSearchResult } from "@artisancode/api-types";

export function BroadcastForm() {
  const navigate = useNavigate();
  const canCreateTemplate = useHasPermission("broadcast_templates.create");
  const { mutateAsync: create, isPending } = useCreateBroadcast();
  const { data: segmentationsData } = useCategoryList("segmentation");

  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const contactTable = useServerTable<ContactSearchResult>({
    queryKey: (params) => queryKeys.contacts.searchPersons(params),
    fetcher: async (params) => {
      const result = await contactService.searchPersons(params);
      // Flatten ContactPersonGroup entries to individual ContactSearchResult rows
      const flattenedItems = result.items.flatMap((group) => group.entries);
      return {
        items: flattenedItems,
        pagination: result.pagination,
      };
    },
    pageSize: 10,
  });

  // Audience filter selects drive both the submitted template's audience
  // criteria (form state) and the live "Target Penerima" preview (table filters).
  function onFilterChange(
    key: "gender" | "religion" | "segmentationId" | "customerStatus",
    value: string,
  ) {
    form.setValue(key, value);
    contactTable.onFilterChange(key, value);
  }

  const religions = useMemo(() => {
    const set = new Set<string>();
    for (const r of contactTable.loadedItems ?? [])
      if (r.contact.religion) set.add(r.contact.religion);
    return Array.from(set).sort();
  }, [contactTable.loadedItems]);

  function handleSelectAll(checked: boolean) {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        contactTable.loadedItems.forEach((r) => next.add(r.contact.id));
      } else {
        next.clear();
      }
      return next;
    });
  }

  function toggleContactId(contactId: string, checked: boolean) {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(contactId);
      } else {
        next.delete(contactId);
      }
      return next;
    });
  }

  async function onSubmit(values: FormValues) {
    try {
      await create({
        name: values.name,
        message: values.message,
        occasion: values.occasion,
        audienceGender: (values.gender as "male" | "female") || undefined,
        audienceReligion: values.religion || undefined,
        audienceSegmentationId: values.segmentationId || undefined,
        audienceCustomerStatus: values.customerStatus || undefined,
        scheduledAt:
          values.scheduleType === "later" && values.scheduledAt
            ? values.scheduledAt
            : undefined,
      });
      toast.success("Template tersimpan.");
      navigate("/broadcasts");
    } catch {
      toast.error("Gagal menyimpan template.");
    }
  }

  const segmentations = segmentationsData?.items ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Template Broadcast Baru</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-5"
              >
                <TemplateFields control={form.control} watch={form.watch} />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !canCreateTemplate}
                  >
                    {isPending ? "Menyimpan..." : "Simpan Template"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Target Penerima ({contactTable.totalCount} key person)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AudienceFilters
              control={form.control}
              onFilterChange={onFilterChange}
              segmentations={segmentations}
              religions={religions}
            />

            <RecipientsTable
              contactTable={contactTable}
              selectedContactIds={selectedContactIds}
              onSelectAll={handleSelectAll}
              onToggleContact={toggleContactId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
