export interface CloudflareKVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' }): Promise<any>;
  put(key: string, value: string, options?: { expirationTtl?: number; metadata?: Record<string, any> }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: Array<{ name: string; expiration?: number; metadata?: unknown }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

export interface CloudflareD1PreparedStatement {
  bind(...values: unknown[]): CloudflareD1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<{ success: boolean; results?: T[]; meta?: Record<string, unknown> }>;
  all<T = Record<string, unknown>>(): Promise<{ success: boolean; results: T[]; meta?: Record<string, unknown> }>;
}

export interface CloudflareD1Database {
  prepare(query: string): CloudflareD1PreparedStatement;
  batch<T = unknown>(statements: CloudflareD1PreparedStatement[]): Promise<Array<{ success: boolean; results?: T[] }>>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface Env {
  PAC_KV?: CloudflareKVNamespace;
  PAC_D1?: CloudflareD1Database;
}

export interface PagesContext<P extends string = string> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]>;
  waitUntil(promise: Promise<unknown>): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
  data: Record<string, unknown>;
}

export const STATE_KEYS = [
  'settings',
  'slides',
  'units',
  'officers',
  'members',
  'supervisors',
  'alumni',
  'spDocs',
  'activities',
  'users',
  'logs',
  'notifications',
  'weights',
  'currentUser',
] as const;

export const CORS_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
