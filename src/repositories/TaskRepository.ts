import { Task, FilterState } from '../models/types';
import { dbService } from '../services/DatabaseService';
import { validateTask, ValidationResult } from '../utils/validation';
import { BaseRepository, handleRepositoryError } from './BaseRepository';

export class TaskRepository implements BaseRepository<Task> {
  async getAll(): Promise<Task[]> {
    try {
      return await dbService.getAllTasks();
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.getAll');
    }
    return [];
  }

  async getById(id: string): Promise<Task | null> {
    try {
      return await dbService.getTaskById(id);
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.getById');
    }
    return null;
  }

  async create(task: Task): Promise<void> {
    try {
      const validation = validateTask(task);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      await dbService.createTask(task);
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.create');
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<void> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }
      await dbService.updateTask(id, updates);
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.update');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await dbService.deleteTask(id);
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.delete');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await dbService.clearAllData();
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.deleteAll');
    }
  }

  async search(query: string): Promise<Task[]> {
    try {
      return await dbService.searchTasks(query);
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.search');
    }
    return [];
  }

  async filter(filter: FilterState): Promise<Task[]> {
    try {
      return await dbService.filterTasks(filter);
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.filter');
    }
    return [];
  }

  async batchUpdate(updates: Array<{ id: string; changes: Partial<Task> }>): Promise<void> {
    try {
      for (const update of updates) {
        await this.update(update.id, update.changes);
      }
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.batchUpdate');
    }
  }

  async batchDelete(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        await this.delete(id);
      }
    } catch (error) {
      handleRepositoryError(error, 'TaskRepository.batchDelete');
    }
  }

  validate(task: Partial<Task>): ValidationResult {
    return validateTask(task);
  }
}

export const taskRepository = new TaskRepository();
