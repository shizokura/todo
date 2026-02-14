import { Category } from '../models/types';
import { dbService } from '../services/DatabaseService';
import { validateCategory, ValidationResult } from '../utils/validation';
import { BaseRepository, handleRepositoryError } from './BaseRepository';

export class CategoryRepository implements BaseRepository<Category> {
  async getAll(): Promise<Category[]> {
    try {
      return await dbService.getAllCategories();
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.getAll');
    }
    return [];
  }

  async getById(id: string): Promise<Category | null> {
    try {
      const categories = await this.getAll();
      return categories.find(cat => cat.id === id) || null;
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.getById');
    }
    return null;
  }

  async getByName(name: string): Promise<Category | null> {
    try {
      return await dbService.getCategoryByName(name);
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.getByName');
    }
    return null;
  }

  async create(category: Category): Promise<void> {
    try {
      const validation = validateCategory(category);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      await dbService.createCategory(category);
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.create');
    }
  }

  async update(id: string, updates: Partial<Category>): Promise<void> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }
      await dbService.updateCategory(id, updates);
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.update');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await dbService.deleteCategory(id);
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.delete');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await dbService.clearAllData();
    } catch (error) {
      handleRepositoryError(error, 'CategoryRepository.deleteAll');
    }
  }

  validate(category: Partial<Category>): ValidationResult {
    return validateCategory(category);
  }
}

export const categoryRepository = new CategoryRepository();
