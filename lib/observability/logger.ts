/**
 * Structured server-side logger. Emits single-line JSON entries suitable for
 * log aggregation, keyed by request id (set by proxy.ts).
 *
 * redact() masks sensitive keys defensively, but call sites are still
 * responsible for never passing secret values (passwords, tokens, hashes,
 * connection strings) into log context.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const REDACTED = '[REDACTED]';
const SENSITIVE_KEY =
  /^(password|passwordhash|secret|token|authorization|cookie|session|apikey|api_key|databaseurl)$/i;
const MAX_DEPTH = 6;

export function redact(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) return '[MAX_DEPTH]';
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(entry, depth + 1);
    }
    return out;
  }
  return value;
}

export interface LogContext {
  [key: string]: unknown;
}

function emit(level: LogLevel, message: string, context?: LogContext) {
  const entry: Record<string, unknown> = {
    time: new Date().toISOString(),
    level,
    message,
  };
  if (context) {
    const safe = redact(context) as LogContext;
    for (const [key, value] of Object.entries(safe)) {
      entry[key] = value;
    }
  }
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.LOG_LEVEL === 'debug') emit('debug', message, context);
  },
  info(message: string, context?: LogContext) {
    emit('info', message, context);
  },
  warn(message: string, context?: LogContext) {
    emit('warn', message, context);
  },
  error(message: string, context?: LogContext) {
    emit('error', message, context);
  },
};
