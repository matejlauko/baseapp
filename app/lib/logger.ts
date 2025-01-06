const ENABLED = false

export function getLogger(ns = '') {
  function log(
    message: string,
    // dataOrLevel?: Sentry.Severity | Record<string, unknown>,
    ...data: unknown[]
  ) {
    // const _data = typeof dataOrLevel === 'object' ? dataOrLevel : data
    // const _level = typeof dataOrLevel === 'string' ? dataOrLevel : Sentry.Severity.Info;
    // Sentry.addBreadcrumb({
    //   category,
    //   level: _level,
    //   message,
    //   data: _data,
    // });

    if (!ENABLED) return
    if (ns) {
      console.log(`[${ns}]`, message, ...data)
    } else {
      console.log(message, ...data)
    }
  }

  function warn(
    message: string,
    // dataOrLevel?: Sentry.Severity | Record<string, unknown>,
    ...data: unknown[]
  ) {
    // const _data = typeof dataOrLevel === 'object' ? dataOrLevel : data
    // const _level = typeof dataOrLevel === 'string' ? dataOrLevel : Sentry.Severity.Warning;
    // Sentry.addBreadcrumb({
    //   category,
    //   level: _level,
    //   message,
    //   data: _data,
    // });

    if (!ENABLED) return

    message = ns ? `[${ns}] ${message}` : message

    console.warn(message, ...data)
  }

  function captureError<Arg1 = unknown>(...errorArgs: Array<Error | string | Arg1>) {
    // Sentry.captureException(error);

    if (ns) {
      console.error(`[${ns}]`, ...errorArgs)
    } else {
      console.error(...errorArgs)
    }
  }

  log.log = log
  log.warn = warn
  log.captureError = captureError

  return log
}
