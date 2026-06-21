import { diag, DiagConsoleLogger } from '@opentelemetry/api'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston'
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

import { getDiagLogLevel } from './get-diag-log-level'
import { parseHeaders } from './parse-headers'
import { getSdk, setSdk } from './sdk-state'

export interface TelemetryConfig {
  enabled: boolean
  diagLogLevel?: string
  serviceName: string
  serviceVersion: string
  deploymentEnvironment: string
  samplingRatio: number
  exporter: {
    endpoint?: string
    tracesEndpoint?: string
    logsEndpoint?: string
    headers?: string
    compression?: string
  }
}

export const startTelemetry = (config: TelemetryConfig) => {
  if (getSdk()) return

  const diagLogLevel = getDiagLogLevel(config.diagLogLevel)
  if (diagLogLevel !== undefined) {
    diag.setLogger(new DiagConsoleLogger(), diagLogLevel)
  }

  if (!config.enabled) return

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: config.serviceName,
    [ATTR_SERVICE_VERSION]: config.serviceVersion,
    'deployment.environment': config.deploymentEnvironment,
  })

  const traceExporterUrl =
    config.exporter.tracesEndpoint ||
    (config.exporter.endpoint
      ? `${config.exporter.endpoint.replace(/\/$/, '')}/v1/traces`
      : undefined)

  const logExporterUrl =
    config.exporter.logsEndpoint ||
    (config.exporter.endpoint
      ? `${config.exporter.endpoint.replace(/\/$/, '')}/v1/logs`
      : undefined)

  const otlpHeaders = parseHeaders(config.exporter.headers)
  const compression = (config.exporter.compression || 'none') as CompressionAlgorithm

  const traceExporter = new OTLPTraceExporter(
    traceExporterUrl
      ? {
          url: traceExporterUrl,
          headers: otlpHeaders,
          compression,
        }
      : undefined,
  )

  const logExporter = logExporterUrl
    ? new OTLPLogExporter({ url: logExporterUrl, headers: otlpHeaders, compression })
    : null

  const sampler = new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(config.samplingRatio),
  })

  const sdk = new NodeSDK({
    resource,
    traceExporter,
    sampler,
    instrumentations: [
      new WinstonInstrumentation({
        disableLogSending: false,
      }),
    ],
    logRecordProcessors: logExporter ? [new BatchLogRecordProcessor(logExporter)] : [],
  })

  setSdk(sdk)
  void sdk.start()
}
