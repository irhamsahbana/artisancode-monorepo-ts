import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

const parseHeaders = (raw: string | undefined): Record<string, string> | undefined => {
  if (!raw?.trim()) return undefined
  const headers: Record<string, string> = {}
  for (const pair of raw.split(',')) {
    const idx = pair.indexOf('=')
    if (idx === -1) continue
    const key = pair.slice(0, idx).trim()
    const value = pair.slice(idx + 1).trim()
    if (key) headers[key] = value
  }
  return Object.keys(headers).length > 0 ? headers : undefined
}

let loggerProvider: LoggerProvider | null = null

export const initOtelLogProvider = () => {
  if (process.env.OTEL_ENABLED !== 'true') return null

  const logExporterUrl =
    process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT ||
    (process.env.OTEL_EXPORTER_OTLP_ENDPOINT
      ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT.replace(/\/$/, '')}/v1/logs`
      : undefined)

  if (!logExporterUrl) return null

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.APP_NAME || 'app',
    [ATTR_SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
    'deployment.environment': process.env.APP_ENV || 'development',
  })

  const otlpHeaders = parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS)
  const compression = (process.env.OTEL_EXPORTER_OTLP_COMPRESSION || 'none') as CompressionAlgorithm

  const exporter = new OTLPLogExporter({
    url: logExporterUrl,
    headers: otlpHeaders,
    compression,
  })

  loggerProvider = new LoggerProvider({
    resource,
    processors: [new SimpleLogRecordProcessor(exporter)],
  })

  return loggerProvider
}

export const shutdownOtelLogProvider = async () => {
  if (loggerProvider) {
    await loggerProvider.shutdown()
    loggerProvider = null
  }
}
