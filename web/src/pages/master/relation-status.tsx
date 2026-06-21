import { masterData } from '@/data/master'

import { MasterPage } from './_master-page'

export function RelationStatus() {
  return <MasterPage title="Status Relasi" items={masterData.relationStatuses} />
}
