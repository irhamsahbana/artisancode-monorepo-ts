import { mockRatings } from "@/data/ratings";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateCustomerRatingReq,
  CustomerRating,
  CustomerRatingList,
  GetCustomerRatingReq,
} from "@artisancode/api-types";

function mockList(params?: GetCustomerRatingReq): CustomerRatingList {
  let items = mockRatings;
  if (params?.customerId)
    items = items.filter((r) => r.customerId === params.customerId);
  // ponytail: newest first, in-place sort fine for demo dataset
  items = [...items].sort((a, b) => b.ratingDate.localeCompare(a.ratingDate));
  return {
    items,
    pagination: { total: items.length, page: 1, per_page: 100, last_page: 1 },
  };
}

export const ratingService = {
  list: (params?: GetCustomerRatingReq) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<CustomerRatingList>(
          "/ratings",
          params as Record<string, string>,
        ),

  create: (body: CreateCustomerRatingReq) =>
    DEMO_MODE ? mockCreate(body) : api.post<CustomerRating>("/ratings", body),
};

function mockCreate(body: CreateCustomerRatingReq): Promise<CustomerRating> {
  const now = new Date().toISOString();
  const r: CustomerRating = {
    id: `r${crypto.randomUUID()}`,
    ...body,
    createdAt: now,
    updatedAt: now,
  };
  mockRatings.push(r);
  return Promise.resolve(r);
}

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
