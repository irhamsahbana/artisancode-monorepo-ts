import { masterData } from '@/data/master'

import { MasterPage } from './_master-page'

export function CustomerTypes() {
  return <MasterPage title="Jenis Pelanggan" items={masterData.customerTypes} />
}
