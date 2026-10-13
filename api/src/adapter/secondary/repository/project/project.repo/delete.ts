import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'

export async function deleteProject(id: string): Promise<void> {
  await getExecutor()
    .update(projects)
    .set({ deletedAt: new Date() })
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
}
