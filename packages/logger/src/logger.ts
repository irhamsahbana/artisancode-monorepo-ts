import winston from 'winston'

import { withSourceLocation } from './with-source-location'
import { withTraceContext } from './with-trace-context'

const { combine, timestamp } = winston.format

const logger = winston.createLogger({
  level: process.env.APP_LOG_LEVEL || 'info',
  format: combine(timestamp(), withTraceContext(), withSourceLocation(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
  ],
})

export default logger
