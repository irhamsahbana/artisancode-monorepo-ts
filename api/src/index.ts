import { startTelemetry } from '@artisancode/observability'

import { env } from '@/config/env'

await startTelemetry({
  enabled: env.OTEL.ENABLED,
  diagLogLevel: env.OTEL.DIAG_LOG_LEVEL,
  serviceName: env.APP_NAME,
  serviceVersion: env.APP_VERSION,
  deploymentEnvironment: env.APP_ENV,
  samplingRatio: env.OTEL.SAMPLING_RATIO,
  exporter: {
    endpoint: env.OTEL.EXPORTER.OTLP.ENDPOINT,
    tracesEndpoint: env.OTEL.EXPORTER.OTLP.TRACES_ENDPOINT,
    logsEndpoint: env.OTEL.EXPORTER.OTLP.LOGS_ENDPOINT,
    headers: env.OTEL.EXPORTER.OTLP.HEADERS,
    compression: env.OTEL.EXPORTER.OTLP.COMPRESSION,
  },
})

const { default: App } = await import('./bin/app')
new App()
