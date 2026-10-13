import { ProductUsecaseDeps } from '../product.usecase'

export async function deleteProduct(deps: ProductUsecaseDeps, id: string): Promise<void> {
  return deps.repo.delete(id)
}
