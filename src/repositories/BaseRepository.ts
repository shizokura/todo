export interface BaseRepository<T, K extends string = string> {
  getAll(): Promise<T[]>;
  getById(_id: K): Promise<T | null>;
  create(_entity: T): Promise<void>;
  update(_id: K, _updates: Partial<T>): Promise<void>;
  delete(_id: K): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface RepositoryError {
  message: string;
  code?: string;
  details?: unknown;
}

export class RepositoryException extends Error {
  constructor(message: string, _code?: string, _details?: unknown) {
    super(message);
    this.name = 'RepositoryException';
  }
}

export const handleRepositoryError = (error: unknown, context: string): never => {
  console.error(`[${context}] Error:`, error);

  if (error instanceof RepositoryException) {
    throw error;
  }

  if (error instanceof Error) {
    throw new RepositoryException(error.message, 'REPO_ERROR', { originalError: error.name });
  }

  throw new RepositoryException('Unknown repository error', 'UNKNOWN_ERROR', { error });
};
