declare module 'isolated-vm' {
  export interface VMOptions {
    memoryLimit?: number;
    timeout?: number;
  }

  export interface ScriptOptions {
    filename?: string;
    lineOffset?: number;
    columnOffset?: number;
  }

  export interface HeapStatistics {
    total_heap_size: number;
    used_heap_size: number;
    heap_size_limit: number;
  }

  export class Isolate {
    constructor(options?: VMOptions);
    createContext(): Context;
    dispose(): void;
    getHeapStatistics(): HeapStatistics;
  }

  export class Context {
    global: Global;
    release(): void;
    eval(script: string, options?: ScriptOptions): Promise<unknown>;
    run(script: string, options?: ScriptOptions): Promise<unknown>;
  }

  export class Global {
    set(name: string, value: unknown): void;
    get(name: string): unknown;
  }

  export class Script {
    constructor(isolate: Isolate, code: string, options?: ScriptOptions);
    run(context: Context): Promise<unknown>;
    compileSync(): void;
  }

  export function createScript(isolate: Isolate, code: string, options?: ScriptOptions): Script;
}
