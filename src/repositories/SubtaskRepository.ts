import { Subtask } from '../models/types';
import { dbService } from '../services/DatabaseService';
import { validateSubtask, ValidationResult } from '../utils/validation';
import { BaseRepository, handleRepositoryError } from './BaseRepository';

export class SubtaskRepository implements BaseRepository<Subtask> {
  async getAll(): Promise<Subtask[]> {
    try {
      const allSubtasks: Subtask[] = [];
      const tasks = await dbService.getAllTasks();
      for (const task of tasks) {
        const subtasks = await this.getByTaskId(task.id);
        allSubtasks.push(...subtasks);
      }
      return allSubtasks;
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.getAll');
    }
    return [];
  }

  async getById(id: string): Promise<Subtask | null> {
    try {
      const allSubtasks = await this.getAll();
      return allSubtasks.find(subtask => subtask.id === id) || null;
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.getById');
    }
    return null;
  }

  async getByTaskId(taskId: string): Promise<Subtask[]> {
    try {
      return await dbService.getSubtasksByTaskId(taskId);
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.getByTaskId');
    }
    return [];
  }

  async create(subtask: Subtask): Promise<void> {
    try {
      const validation = validateSubtask(subtask);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      await dbService.createSubtask(subtask);
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.create');
    }
  }

  async update(id: string, updates: Partial<Subtask>): Promise<void> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }
      await dbService.updateSubtask(id, updates);
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.update');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await dbService.deleteSubtask(id);
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.delete');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await dbService.clearAllData();
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.deleteAll');
    }
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    try {
      await dbService.deleteSubtasksByTaskId(taskId);
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.deleteByTaskId');
    }
  }

  async toggleComplete(id: string): Promise<void> {
    try {
      await dbService.toggleSubtaskComplete(id);
    } catch (error) {
      handleRepositoryError(error, 'SubtaskRepository.toggleComplete');
    }
  }

  validate(subtask: Partial<Subtask>): ValidationResult {
    return validateSubtask(subtask);
  }
}

export const subtaskRepository = new SubtaskRepository();
