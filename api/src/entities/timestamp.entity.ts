export interface Timestamp {
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface BaseEntity extends Timestamp {
  roleId?: string
  userId?: string
}
