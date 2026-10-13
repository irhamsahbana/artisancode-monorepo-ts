import { AppError, ErrorCode } from '@artisancode/types'

import type {
  CustomerImportExecuteReq,
  CustomerImportExecuteResult,
} from '@/entities/customer.entity'

import { dryRunImport } from './dry-run-import'

import type { CustomerUsecaseDeps } from '../customer.usecase'

export async function executeImport(
  deps: CustomerUsecaseDeps,
  req: CustomerImportExecuteReq,
): Promise<CustomerImportExecuteResult> {
  const dryRunResult = await dryRunImport(deps, req.file)

  if (dryRunResult.previewCustomers.length === 0 && dryRunResult.previewKeyPersons.length === 0) {
    const errorDetail =
      dryRunResult.errors.length > 0
        ? dryRunResult.errors.map((e) => `[${e.sheet} Baris ${e.row}] ${e.message}`).join(', ')
        : 'File tidak memuat baris data yang valid'

    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `Tidak ada data valid yang dapat diimpor: ${errorDetail}`,
    )
  }

  const mode = req.mode ?? 'skip'
  const runTransaction =
    deps.transactor?.withinTransaction.bind(deps.transactor) ??
    (async <T>(fn: () => Promise<T>) => fn())

  return runTransaction(async () => {
    let createdCustomers = 0
    let updatedCustomers = 0
    let skippedCustomers = 0
    let createdKeyPersons = 0

    const customerIdMap = new Map<string, { id: string; primaryContactId: string | null }>()

    // Collect all customer names mentioned in both sheets
    const allNamesSet = new Set<string>()
    for (const c of dryRunResult.previewCustomers) {
      if (c.name?.trim()) allNamesSet.add(c.name.trim().toLowerCase())
    }
    for (const kp of dryRunResult.previewKeyPersons) {
      if (kp.customerName?.trim()) allNamesSet.add(kp.customerName.trim().toLowerCase())
    }

    const allNames = Array.from(allNamesSet)
    if (allNames.length > 0) {
      const existingRows = await deps.repo.findCustomersByNames(allNames)
      for (const row of existingRows) {
        customerIdMap.set(row.name.trim().toLowerCase(), {
          id: row.id,
          primaryContactId: row.primaryContactId,
        })
      }
    }

    // 1. Process Customers via customer repo
    for (const c of dryRunResult.previewCustomers) {
      const key = c.name.trim().toLowerCase()
      const existing = customerIdMap.get(key)

      if (existing) {
        if (mode === 'upsert') {
          await deps.repo.update({
            id: existing.id,
            name: c.name.trim(),
            categoryId: c.categoryId,
            segmentationId: c.segmentationId,
            areaId: c.areaId,
            companyType: c.companyType,
            status: c.status,
            potential: c.potential,
            address: c.address,
            companyEmail: c.companyEmail,
            website: c.website,
            npwp: c.npwp,
            skt: c.skt,
            hasContractHistory: c.hasContractHistory,
            lastContractYear: c.lastContractYear,
            lastRevenue: c.lastRevenue,
            notes: c.notes,
          })
          updatedCustomers++
        } else {
          skippedCustomers++
        }
      } else {
        const created = await deps.repo.create({
          name: c.name.trim(),
          categoryId: c.categoryId,
          segmentationId: c.segmentationId,
          areaId: c.areaId,
          companyType: c.companyType,
          status: c.status ?? 'prospect',
          potential: c.potential ?? 'medium',
          address: c.address,
          companyEmail: c.companyEmail,
          website: c.website,
          npwp: c.npwp,
          skt: c.skt,
          hasContractHistory: c.hasContractHistory ?? false,
          lastContractYear: c.lastContractYear,
          lastRevenue: c.lastRevenue,
          notes: c.notes,
        })

        customerIdMap.set(key, { id: created.id, primaryContactId: null })
        createdCustomers++
      }
    }

    // 2. Process Key Persons via contact usecase
    for (const kp of dryRunResult.previewKeyPersons) {
      const key = kp.customerName.trim().toLowerCase()
      const cust = customerIdMap.get(key)
      if (!cust) continue

      const isPrimary = kp.isPrimary ?? false

      const createdContact = await deps.contactUsecase.create({
        customer_id: cust.id,
        name: kp.name.trim(),
        position: kp.position?.trim(),
        whatsapp: kp.whatsapp.trim(),
        country_code: kp.countryCode?.trim() || '62',
        email: kp.email?.trim(),
        gender: kp.gender,
        birthPlace: kp.birthPlace?.trim(),
        dateOfBirth: kp.dateOfBirth?.trim(),
        religion: kp.religion?.trim(),
        education: kp.education?.trim(),
        address: kp.address?.trim(),
        spouseName: kp.spouseName?.trim(),
        spouseOccupation: kp.spouseOccupation?.trim(),
        childrenNames: kp.childrenNames?.trim(),
        childrenOccupation: kp.childrenOccupation?.trim(),
        profiling: kp.profiling?.trim(),
        notes: kp.notes?.trim(),
        isPrimary,
      })

      createdKeyPersons++

      if (isPrimary || !cust.primaryContactId) {
        await deps.repo.update({
          id: cust.id,
          primaryContactId: createdContact.id,
        })
        cust.primaryContactId = createdContact.id
      }
    }

    return {
      createdCustomers,
      updatedCustomers,
      createdKeyPersons,
      skippedCustomers,
      errors: dryRunResult.errors,
    }
  })
}
