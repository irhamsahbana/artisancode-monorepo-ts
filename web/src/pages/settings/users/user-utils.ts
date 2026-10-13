export function generatePassword(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
