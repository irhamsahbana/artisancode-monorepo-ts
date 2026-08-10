import { Plus, Phone, Mail, Star } from "lucide-react";
import { Link } from "react-router";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Contact } from "@artisancode/api-types";

export function ContactsTab({
  customerId,
  contacts,
  onOpenContact,
}: {
  customerId: string;
  contacts: Contact[];
  onOpenContact: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/contacts/new?customerId=${customerId}`}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah Key Person
          </Link>
        </Button>
      </div>
      {contacts.length === 0 ? (
        <EmptyState
          title="Belum ada kontak"
          description="Tambahkan kontak untuk pelanggan ini."
        />
      ) : (
        contacts.map((con) => (
          <Card
            key={con.id}
            className="cursor-pointer transition-colors hover:bg-muted/40"
            onClick={() => onOpenContact(con.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                {con.name}
                {con.isPrimary && (
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                )}
              </CardTitle>
              {con.position && (
                <p className="text-sm text-muted-foreground">{con.position}</p>
              )}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {con.whatsapp && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {con.whatsapp}
                </span>
              )}
              {con.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {con.email}
                </span>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
