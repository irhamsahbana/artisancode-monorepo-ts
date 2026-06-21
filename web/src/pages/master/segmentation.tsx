import { masterData } from '@/data/master'

import { MasterPage } from './_master-page'

export function Segmentation() {
  return <MasterPage title="Segmentasi" items={masterData.segmentations} />
}
