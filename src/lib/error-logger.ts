/**
 * Error Logger Utility
 * Centralized error logging for development and production
 */

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  orderId?: string;
  productId?: string;
  [key: string]: string | undefined;
}

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  context?: ErrorContext;
  environment: string;
}

class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  /**
   * Log an error with context
   */
  error(error: Error | unknown, context?: ErrorContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorObj.message,
      error: {
        name: errorObj.name,
        message: errorObj.message,
        stack: errorObj.stack,
      },
      context,
      environment: process.env.NODE_ENV || 'development',
    };

    this.addToLogs(logEntry);

    // Always log to console in development
    if (this.isDevelopment) {
      console.error('[ERROR]', {
        message: errorObj.message,
        context,
        stack: errorObj.stack,
      });
    } else {
      // In production, you could send to a monitoring service
      // Examples: Sentry, LogRocket, Datadog, etc.
      this.sendToMonitoringService(logEntry);
    }
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: ErrorContext): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
      environment: process.env.NODE_ENV || 'development',
    };

    this.addToLogs(logEntry);

    if (this.isDevelopment) {
      console.warn('[WARN]', message, context);
    }
  }

  /**
   * Log info
   */
  info(message: string, context?: ErrorContext): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      environment: process.env.NODE_ENV || 'development',
    };

    this.addToLogs(logEntry);

    if (this.isDevelopment) {
      console.info('[INFO]', message, context);
    }
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(count = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  private addToLogs(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private sendToMonitoringService(_entry: LogEntry): void {
    // Placeholder for external monitoring service integration
    // Example integrations:
    // - Sentry: Sentry.captureException(error, { extra: context })
    // - LogRocket: LogRocket.error(message, { extra: context })
    // - Datadog: datadogLogs.logger.error(message, context)
    
    // For now, just log to console in production
    console.error('[PROD ERROR]', _entry.message, _entry.context);
  }
}

// Export singleton instance
export const logger = new ErrorLogger();

/**
 * Create a user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    // Map technical errors to user-friendly messages
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.';
    }
    if (message.includes('timeout')) {
      return 'Permintaan timeout. Silakan coba lagi.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Sesi Anda telah berakhir. Silakan login kembali.';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'Anda tidak memiliki akses untuk melakukan aksi ini.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'Data yang Anda cari tidak ditemukan.';
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'Data yang dimasukkan tidak valid.';
    }
    if (message.includes('storage') || message.includes('upload')) {
      return 'Gagal mengunggah file. Silakan coba lagi.';
    }
    
    return error.message;
  }
  
  return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
}

/**
 * Custom error classes for specific scenarios
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} tidak ditemukan`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Tidak terautentikasi') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Akses ditolak') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 'PAYMENT_ERROR', 400);
    this.name = 'PaymentError';
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR', 500);
    this.name = 'StorageError';
  }
}
