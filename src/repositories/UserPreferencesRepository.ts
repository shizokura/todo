import { UserPreferences } from '../models/types';
import { dbService } from '../services/DatabaseService';
import { validateUserPreferences, ValidationResult } from '../utils/validation';
import { handleRepositoryError } from './BaseRepository';

export class UserPreferencesRepository {
  async get(): Promise<UserPreferences> {
    try {
      return await dbService.getUserPreferences() || this.getDefaultPreferences();
    } catch (error) {
      handleRepositoryError(error, 'UserPreferencesRepository.get');
      return this.getDefaultPreferences();
    }
  }

  async update(prefs: Partial<UserPreferences>): Promise<void> {
    try {
      const validation = validateUserPreferences(prefs);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      await dbService.updateUserPreferences(prefs);
    } catch (error) {
      handleRepositoryError(error, 'UserPreferencesRepository.update');
    }
  }

  async reset(): Promise<void> {
    try {
      const defaults = this.getDefaultPreferences();
      await this.update(defaults);
    } catch (error) {
      handleRepositoryError(error, 'UserPreferencesRepository.reset');
    }
  }

  validate(prefs: Partial<UserPreferences>): ValidationResult {
    return validateUserPreferences(prefs);
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      fontSize: 16,
      defaultView: 'list',
      enableNotifications: true,
      defaultPriority: 'none',
    };
  }
}

export const userPreferencesRepository = new UserPreferencesRepository();
