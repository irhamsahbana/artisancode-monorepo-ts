import { PERMISSION_ACTIONS } from "@artisancode/api-types";

import { cn } from "@/lib/utils";

import type { Permission, PermissionModule } from "@artisancode/api-types";

export function PermissionTable({
  modules,
  permissions,
  disabled,
  onToggleModule,
  onTogglePermission,
}: {
  modules: readonly { key: PermissionModule; label: string }[];
  permissions: Set<Permission>;
  disabled: boolean;
  onToggleModule: (moduleKey: string, checked: boolean) => void;
  onTogglePermission: (p: Permission) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-120 text-sm">
        <thead>
          <tr>
            <th className="pb-2 text-left font-medium text-muted-foreground">
              Modul
            </th>
            {PERMISSION_ACTIONS.map((a) => (
              <th
                key={a.key}
                className="pb-2 text-center font-medium text-muted-foreground"
              >
                {a.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((m) => {
            const modulePermissions = PERMISSION_ACTIONS.map(
              (a) => `${m.key}.${a.key}` as Permission,
            );
            const allChecked = modulePermissions.every((p) =>
              permissions.has(p),
            );
            return (
              <tr key={m.key} className="border-t">
                <td className="py-2">
                  <label className="flex items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={allChecked}
                      onChange={(e) => onToggleModule(m.key, e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    {m.label}
                  </label>
                </td>
                {PERMISSION_ACTIONS.map((a) => {
                  const p = `${m.key}.${a.key}` as Permission;
                  return (
                    <td key={a.key} className="py-2 text-center">
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={permissions.has(p)}
                        onChange={() => onTogglePermission(p)}
                        className={cn("h-4 w-4 rounded border-input")}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
