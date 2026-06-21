import { env } from './env'

// Interchangeable logger — set APP_LOGGER=winston or pino (default: winston)
const logger =
  env.APP_LOGGER === 'pino'
    ? (await import('@artisancode/logger-pino')).logger
    : (await import('@artisancode/logger')).logger

export default logger
