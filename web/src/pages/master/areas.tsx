import { masterData } from '@/data/master'

import { MasterPage } from './_master-page'

export function Areas() {
  return <MasterPage title="Area" items={masterData.areas} />
}
