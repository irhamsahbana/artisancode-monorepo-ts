import { AppError, ErrorCode } from '@artisancode/types'

import type { CreateContactReq } from '@/entities/contact.entity'
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

    const customerIdMap = new Map<string, string>()

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
        customerIdMap.set(row.name.trim().toLowerCase(), row.id)
      }
    }

    // 1. Customers: existing ones are updated one by one (upsert only), new ones are
    // inserted in batches — one round trip per batch instead of one per row.
    const newCustomers: typeof dryRunResult.previewCustomers = []
    for (const c of dryRunResult.previewCustomers) {
      const key = c.name.trim().toLowerCase()
      const existing = customerIdMap.get(key)

      if (existing) {
        if (mode === 'upsert') {
          await deps.repo.update({
            id: existing,
            name: c.name.trim(),
            categoryId: c.categoryId,
            segmentationId: c.segmentationId,
            areaId: c.areaId,
            companyType: c.companyType,
            status: c.status,
            potential: c.potential,
            address: c.address,
            companyEmail: c.companyEmail,
            phone: c.phone,
            fax: c.fax,
            phoneCountryCode: c.phoneCountryCode,
            faxCountryCode: c.faxCountryCode,
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
        newCustomers.push(c)
      }
    }

    if (newCustomers.length > 0) {
      const created = await deps.repo.createMany(
        newCustomers.map((c) => ({
          name: c.name.trim(),
          categoryId: c.categoryId,
          segmentationId: c.segmentationId,
          areaId: c.areaId,
          companyType: c.companyType,
          status: c.status ?? 'prospect',
          potential: c.potential ?? 'medium',
          address: c.address,
          companyEmail: c.companyEmail,
          phone: c.phone,
          fax: c.fax,
          phoneCountryCode: c.phoneCountryCode,
          faxCountryCode: c.faxCountryCode,
          website: c.website,
          npwp: c.npwp,
          skt: c.skt,
          hasContractHistory: c.hasContractHistory ?? false,
          lastContractYear: c.lastContractYear,
          lastRevenue: c.lastRevenue,
          notes: c.notes,
        })),
      )
      newCustomers.forEach((c, i) => {
        // createMany keeps input order; fail loudly rather than attach contacts to the wrong customer
        if (created[i]?.name !== c.name.trim()) {
          throw new AppError(ErrorCode.INTERNAL_ERROR, 'Urutan hasil import customer tidak sesuai')
        }
        customerIdMap.set(c.name.trim().toLowerCase(), created[i].id)
      })
      createdCustomers += created.length
    }

    // 2. Key persons: one batch insert. "Kontak Penting?" is stored per contact
    // (is_primary), so a customer can have several important contacts.
    const keyPersonReqs: CreateContactReq[] = []
    for (const kp of dryRunResult.previewKeyPersons) {
      const customerId = customerIdMap.get(kp.customerName.trim().toLowerCase())
      if (!customerId) continue

      keyPersonReqs.push({
        customer_id: customerId,
        name: kp.name.trim(),
        position: kp.position?.trim(),
        whatsapp: kp.whatsapp?.trim(),
        landline: kp.landline?.trim(),
        landline_country_code: kp.landlineCountryCode?.trim(),
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
        isPrimary: kp.isPrimary ?? false,
      })
    }

    if (keyPersonReqs.length > 0) {
      createdKeyPersons = (await deps.contactUsecase.createMany(keyPersonReqs)).length
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
