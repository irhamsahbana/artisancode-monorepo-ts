import {
  MASTER_DATA_PERMISSION_MODULES,
  PERMISSION_MODULES,
} from "@artisancode/api-types";

import { Separator } from "@/components/ui/separator";

import { PermissionTable } from "./permission-table";

import type { Permission } from "@artisancode/api-types";

const mainModules = PERMISSION_MODULES.filter(
  (m) => !(MASTER_DATA_PERMISSION_MODULES as readonly string[]).includes(m.key),
);
const masterDataModules = PERMISSION_MODULES.filter((m) =>
  (MASTER_DATA_PERMISSION_MODULES as readonly string[]).includes(m.key),
);

export function PermissionsSection({
  permissions,
  disabled,
  onToggleModule,
  onTogglePermission,
}: {
  permissions: Set<Permission>;
  disabled: boolean;
  onToggleModule: (moduleKey: string, checked: boolean) => void;
  onTogglePermission: (p: Permission) => void;
}) {
  return (
    <>
      <p className="mb-1 text-sm font-medium">Hak Akses</p>
      <p className="mb-4 text-xs text-muted-foreground">
        Pilih modul dan tindakan yang boleh diakses role ini.
      </p>
      <Separator className="mb-4" />

      <PermissionTable
        modules={mainModules}
        permissions={permissions}
        disabled={disabled}
        onToggleModule={onToggleModule}
        onTogglePermission={onTogglePermission}
      />

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Master Data
        </span>
        <Separator className="flex-1" />
      </div>

      <PermissionTable
        modules={masterDataModules}
        permissions={permissions}
        disabled={disabled}
        onToggleModule={onToggleModule}
        onTogglePermission={onTogglePermission}
      />
    </>
  );
}
