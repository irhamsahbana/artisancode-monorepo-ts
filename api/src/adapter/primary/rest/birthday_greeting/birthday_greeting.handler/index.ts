import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IBirthdayGreetingUsecase } from '@/contracts/birthday_greeting.contract'

import { findBirthdayGreetingHandler as makeFind } from './find'
import { findBirthdayGreetingLogsHandler as makeFindLogs } from './find-logs'
import { updateBirthdayGreetingHandler as makeUpdate } from './update'

export function createBirthdayGreetingHandlerDeps(usecase: IBirthdayGreetingUsecase) {
  const handlers = {
    find: makeFind(usecase),
    update: makeUpdate(usecase),
    findLogs: makeFindLogs(usecase),
  }

  return {
    find: (c: Context<AppEnv>) => withSpan('BirthdayGreetingHandler.find', () => handlers.find(c)),
    update: (c: Context<AppEnv>) =>
      withSpan('BirthdayGreetingHandler.update', () => handlers.update(c)),
    findLogs: (c: Context<AppEnv>) =>
      withSpan('BirthdayGreetingHandler.findLogs', () => handlers.findLogs(c)),
  }
}

export { createBirthdayGreetingHandlerDeps as createBirthdayGreetingHandler }
export default createBirthdayGreetingHandlerDeps
