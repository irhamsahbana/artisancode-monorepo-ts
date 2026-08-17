import { PageHeader } from "@/components/shared/page-header";

import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";

export function AccountSettings() {
  return (
    <div className="space-y-6">
      <PageHeader title="Akun" description="Kelola informasi akun Anda." />
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}
