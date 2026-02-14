import { Reminder } from '../models/types';
import { dbService } from '../services/DatabaseService';
import { validateReminder, ValidationResult } from '../utils/validation';
import { BaseRepository, handleRepositoryError } from './BaseRepository';

export class ReminderRepository implements BaseRepository<Reminder> {
  async getAll(): Promise<Reminder[]> {
    try {
      const allReminders: Reminder[] = [];
      const tasks = await dbService.getAllTasks();
      for (const task of tasks) {
        const reminders = await this.getByTaskId(task.id);
        allReminders.push(...reminders);
      }
      return allReminders;
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.getAll');
    }
    return [];
  }

  async getById(id: string): Promise<Reminder | null> {
    try {
      const allReminders = await this.getAll();
      return allReminders.find(reminder => reminder.id === id) || null;
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.getById');
    }
    return null;
  }

  async getByTaskId(taskId: string): Promise<Reminder[]> {
    try {
      return await dbService.getRemindersByTaskId(taskId);
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.getByTaskId');
    }
    return [];
  }

  async getActiveReminders(): Promise<Reminder[]> {
    try {
      return await dbService.getActiveReminders();
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.getActiveReminders');
    }
    return [];
  }

  async add(reminder: Reminder): Promise<void> {
    try {
      const validation = validateReminder(reminder);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      await dbService.createReminder(reminder);
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.add');
    }
  }

  async create(reminder: Reminder): Promise<void> {
    return this.add(reminder);
  }

  async update(id: string, updates: Partial<Reminder>): Promise<void> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }
      await dbService.updateReminder(id, updates);
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.update');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await dbService.deleteReminder(id);
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.delete');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await dbService.clearAllData();
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.deleteAll');
    }
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    try {
      await dbService.deleteRemindersByTaskId(taskId);
    } catch (error) {
      handleRepositoryError(error, 'ReminderRepository.deleteByTaskId');
    }
  }

  validate(reminder: Partial<Reminder>): ValidationResult {
    return validateReminder(reminder);
  }
}

export const reminderRepository = new ReminderRepository();
