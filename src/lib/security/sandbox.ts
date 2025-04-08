import { Isolate, Context, Script } from 'isolated-vm';

// Sandbox configuration types
interface SandboxOptions {
  timeoutMs?: number;
  memoryLimitMB?: number;
  cpuLimitPercent?: number;
}

// Sandbox result type
interface SandboxResult {
  success: boolean;
  result?: unknown;
  error?: string;
  logs: string[];
}

// Security configuration
const SECURITY_CONFIG = {
  MAX_TIMEOUT_MS: 5000,
  MAX_MEMORY_MB: 50,
  ALLOWED_MODULES: ['math', 'crypto'],
  FORBIDDEN_GLOBALS: ['process', 'require', 'import', 'eval', 'Function']
};

// Logging utility
class SandboxLogger {
  private logs: string[] = [];

  log(message: string): void {
    this.logs.push(message);
  }

  getLogs(): string[] {
    return this.logs;
  }

  clear(): void {
    this.logs = [];
  }
}

/**
 * Sanitize and validate code before execution
 */
function sanitizeCode(code: string): string {
  // Remove potentially dangerous statements
  const sanitizedCode = code
    .replace(/require\(/g, 'void(')
    .replace(/import\(/g, 'void(')
    .replace(/eval\(/g, 'void(')
    .replace(/Function\(/g, 'void(');

  return sanitizedCode;
}

/**
 * Create a secure sandbox environment
 */
async function createSandbox(options: SandboxOptions = {}): Promise<Isolate> {
  const { 
    timeoutMs = SECURITY_CONFIG.MAX_TIMEOUT_MS, 
    memoryLimitMB = SECURITY_CONFIG.MAX_MEMORY_MB 
  } = options;

  const isolate = new Isolate({
    memoryLimit: memoryLimitMB * 1024 * 1024,
    timeout: timeoutMs
  });

  return isolate;
}

/**
 * Configure sandbox context with security restrictions
 */
async function configureContext(isolate: Isolate, logger: SandboxLogger): Promise<Context> {
  const context = isolate.createContext();
  const global = context.global;

  // Override console methods
  global.set('console', {
    log: (message: unknown) => {
      logger.log(String(message));
    },
    warn: (message: unknown) => {
      logger.log(`[WARN] ${String(message)}`);
    },
    error: (message: unknown) => {
      logger.log(`[ERROR] ${String(message)}`);
    }
  });

  // Remove dangerous globals
  SECURITY_CONFIG.FORBIDDEN_GLOBALS.forEach(globalName => {
    context.global.set(globalName, undefined);
  });

  return context;
}

/**
 * Check if code is safe to execute
 */
function isCodeSafe(code: string): boolean {
  const dangerousPatterns = [
    /require\(/,
    /import\(/,
    /eval\(/,
    /Function\(/,
    /process\./,
    /global\./
  ];

  return !dangerousPatterns.some(pattern => pattern.test(code));
}

/**
 * Execute code in a sandboxed environment
 */
async function executeSandboxedCode(
  code: string, 
  options: SandboxOptions = {}
): Promise<SandboxResult> {
  const logger = new SandboxLogger();
  
  try {
    // Sanitize input code
    const sanitizedCode = sanitizeCode(code);

    // Create sandbox
    const isolate = await createSandbox(options);
    const context = await configureContext(isolate, logger);

    try {
      // Compile and run the script
      const script = new Script(isolate, sanitizedCode);
      const result = await script.run(context);

      return {
        success: true,
        result,
        logs: logger.getLogs()
      };
    } catch (executionError: unknown) {
      return {
        success: false,
        error: executionError instanceof Error 
          ? executionError.message 
          : String(executionError),
        logs: logger.getLogs()
      };
    } finally {
      // Clean up resources
      context.release();
      isolate.dispose();
    }
  } catch (setupError: unknown) {
    return {
      success: false,
      error: setupError instanceof Error 
        ? setupError.message 
        : String(setupError),
      logs: logger.getLogs()
    };
  }
}

/**
 * Execute code in sandbox with safety checks
 */
export async function runCodeSafely(
  code: string,
  options: SandboxOptions = {}
): Promise<SandboxResult> {
  // Preliminary security check
  const safetyCheck = isCodeSafe(code);
  
  if (!safetyCheck) {
    return {
      success: false,
      error: 'Code contains potentially dangerous operations',
      logs: []
    };
  }

  return executeSandboxedCode(code, options);
}

export type { 
  SandboxOptions, 
  SandboxResult 
};

export { 
  executeSandboxedCode
};
