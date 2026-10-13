import { AppError, ErrorCode } from '@artisancode/types'

import type {
  ProjectImportExecuteReq,
  ProjectImportExecuteResult,
  ProjectProductLine,
} from '@/entities/project.entity'

import { dryRunImport } from './dry-run-import'

import type { ProjectUsecaseDeps } from '../project.usecase'

export async function executeImport(
  deps: ProjectUsecaseDeps,
  req: ProjectImportExecuteReq,
): Promise<ProjectImportExecuteResult> {
  const dryRunResult = await dryRunImport(deps, req.file)

  if (dryRunResult.previewProjects.length === 0) {
    const errorDetail =
      dryRunResult.errors.length > 0
        ? dryRunResult.errors.map((e) => `[${e.sheet} Baris ${e.row}] ${e.message}`).join(', ')
        : 'File tidak memuat baris data proyek yang valid'

    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `Tidak ada data proyek valid yang dapat diimpor: ${errorDetail}`,
    )
  }

  const mode = req.mode ?? 'skip'
  const runTransaction =
    deps.transactor?.withinTransaction.bind(deps.transactor) ??
    (async <T>(fn: () => Promise<T>) => fn())

  return runTransaction(async () => {
    let createdProjects = 0
    let updatedProjects = 0
    let skippedProjects = 0
    let attachedProducts = 0

    // 1. Group products by projectRef (case-insensitive lowercase)
    const productsByRef = new Map<string, ProjectProductLine[]>()
    for (const prod of dryRunResult.previewProducts) {
      if (!prod.productId) continue
      const refKey = prod.projectRef.toLowerCase().trim()
      const list = productsByRef.get(refKey) || []
      list.push({ productId: prod.productId, quantity: prod.quantity })
      productsByRef.set(refKey, list)
    }

    // 2. Lookup existing projects by numbers and name+customerId
    const numbersToLookup = dryRunResult.previewProjects
      .map((p) => p.projectNumber?.trim())
      .filter((n): n is string => Boolean(n))

    const nameCustomerPairs: { customerId: string; name: string }[] = []
    for (const p of dryRunResult.previewProjects) {
      if (p.customerId && p.name.trim()) {
        nameCustomerPairs.push({ customerId: p.customerId, name: p.name.trim() })
      }
    }

    const [existingByNumbers, existingByPairs] = await Promise.all([
      numbersToLookup.length > 0 ? deps.repo.findProjectsByNumbers(numbersToLookup) : [],
      nameCustomerPairs.length > 0 ? deps.repo.findProjectsByNamesAndCustomers(nameCustomerPairs) : [],
    ])

    const existingByNumberMap = new Map<string, typeof existingByNumbers[0]>()
    for (const p of existingByNumbers) {
      existingByNumberMap.set(p.projectNumber.toLowerCase().trim(), p)
    }

    const existingByPairMap = new Map<string, typeof existingByPairs[0]>()
    for (const p of existingByPairs) {
      existingByPairMap.set(`${p.name.toLowerCase().trim()}|${p.customerId.toLowerCase().trim()}`, p)
    }

    // 3. Process projects
    for (const p of dryRunResult.previewProjects) {
      if (!p.customerId) continue

      let existing = p.projectNumber
        ? existingByNumberMap.get(p.projectNumber.toLowerCase().trim())
        : undefined

      if (!existing) {
        existing = existingByPairMap.get(
          `${p.name.toLowerCase().trim()}|${p.customerId.toLowerCase().trim()}`,
        )
      }

      // Check attached products from Sheet 2
      const matchedProducts =
        (p.projectNumber && productsByRef.get(p.projectNumber.toLowerCase().trim())) ||
        productsByRef.get(p.name.toLowerCase().trim()) ||
        []

      if (existing) {
        if (mode === 'upsert') {
          const finalProducts =
            matchedProducts.length > 0 ? matchedProducts : existing.products || []

          await deps.repo.update({
            id: existing.id,
            name: p.name.trim(),
            customerId: p.customerId,
            contactId: p.contactId || existing.contactId || undefined,
            status: p.status ?? existing.status,
            estimatedValue: p.estimatedValue !== undefined ? p.estimatedValue : (existing.estimatedValue ?? undefined),
            location: p.location !== undefined ? p.location : (existing.location ?? undefined),
            latitude: p.latitude !== undefined ? p.latitude : (existing.latitude ?? undefined),
            longitude: p.longitude !== undefined ? p.longitude : (existing.longitude ?? undefined),
            sourceOfFunds: p.sourceOfFunds !== undefined ? p.sourceOfFunds : (existing.sourceOfFunds ?? undefined),
            picName: p.picName !== undefined ? p.picName : (existing.picName ?? undefined),
            spkNumber: p.spkNumber !== undefined ? p.spkNumber : (existing.spkNumber ?? undefined),
            lostReason: p.lostReason !== undefined ? p.lostReason : (existing.lostReason ?? undefined),
            winnerCompetitor: p.winnerCompetitor !== undefined ? p.winnerCompetitor : (existing.winnerCompetitor ?? undefined),
            notes: p.notes !== undefined ? p.notes : (existing.notes ?? undefined),
            products: finalProducts,
          })
          if (matchedProducts.length > 0) {
            attachedProducts += matchedProducts.length
          }
          updatedProjects++
        } else {
          skippedProjects++
        }
      } else {
        await deps.repo.create({
          projectNumber: p.projectNumber?.trim() || undefined,
          name: p.name.trim(),
          customerId: p.customerId,
          contactId: p.contactId || undefined,
          status: p.status ?? 'prospect',
          estimatedValue: p.estimatedValue,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          sourceOfFunds: p.sourceOfFunds,
          picName: p.picName,
          spkNumber: p.spkNumber,
          lostReason: p.lostReason,
          winnerCompetitor: p.winnerCompetitor,
          notes: p.notes,
          products: matchedProducts,
        })
        if (matchedProducts.length > 0) {
          attachedProducts += matchedProducts.length
        }
        createdProjects++
      }
    }

    return {
      createdProjects,
      updatedProjects,
      skippedProjects,
      attachedProducts,
    }
  })
}
