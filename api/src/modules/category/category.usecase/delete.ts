import { AppError, ErrorCode } from '@artisancode/types'

import { CategoryUsecaseDeps } from '../category.usecase'

export async function deleteCategory(deps: CategoryUsecaseDeps, id: string): Promise<void> {
  const category = await deps.repo.findById(id)
  if (!category) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Category not found')
  }
  return deps.repo.delete(id)
}
