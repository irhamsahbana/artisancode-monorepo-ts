import { UomUsecaseDeps } from '../uom.usecase'

export async function deleteConversion(deps: UomUsecaseDeps, id: string): Promise<void> {
  return deps.repo.deleteConversion(id)
}
