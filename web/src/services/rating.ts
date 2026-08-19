import { api } from "@/lib/api";

import type {
  CreateCustomerRatingReq,
  CustomerRating,
  CustomerRatingList,
  GetCustomerRatingReq,
} from "@artisancode/api-types";

export const ratingService = {
  list: (params?: GetCustomerRatingReq) =>
    api.get<CustomerRatingList>("/ratings", params as Record<string, string>),

  create: (body: CreateCustomerRatingReq) =>
    api.post<CustomerRating>("/ratings", body),
};

// Helpers for derived UI data (kept here, close to the data source).

export interface RatingSummary {
  customerId: string;
  count: number;
  avgPayment: number;
  avgRelationship: number;
  avgTotal: number;
  latest: CustomerRating;
}

export function summarizeRatings(
  ratings: CustomerRating[],
): Map<string, RatingSummary> {
  const map = new Map<string, RatingSummary>();
  for (const r of ratings) {
    const existing = map.get(r.customerId);
    const total = r.paymentScore + r.relationshipScore;
    if (!existing) {
      map.set(r.customerId, {
        customerId: r.customerId,
        count: 1,
        avgPayment: r.paymentScore,
        avgRelationship: r.relationshipScore,
        avgTotal: total,
        latest: r,
      });
    } else {
      const n = existing.count + 1;
      existing.avgPayment =
        (existing.avgPayment * existing.count + r.paymentScore) / n;
      existing.avgRelationship =
        (existing.avgRelationship * existing.count + r.relationshipScore) / n;
      existing.avgTotal = (existing.avgTotal * existing.count + total) / n;
      existing.count = n;
      if (r.ratingDate > existing.latest.ratingDate) existing.latest = r;
    }
  }
  return map;
}
