import { Attachment } from '../models/types';
import { dbService } from '../services/DatabaseService';
import { validateAttachment, ValidationResult } from '../utils/validation';
import { BaseRepository, handleRepositoryError } from './BaseRepository';

export class AttachmentRepository implements BaseRepository<Attachment> {
  async getAll(): Promise<Attachment[]> {
    try {
      return await dbService.getAllAttachments();
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.getAll');
    }
    return [];
  }

  async getById(id: string): Promise<Attachment | null> {
    try {
      const allAttachments = await this.getAll();
      return allAttachments.find(attachment => attachment.id === id) || null;
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.getById');
    }
    return null;
  }

  async getByTaskId(taskId: string): Promise<Attachment[]> {
    try {
      return await dbService.getAttachmentsByTaskId(taskId);
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.getByTaskId');
    }
    return [];
  }

  async add(attachment: Attachment): Promise<void> {
    try {
      const validation = validateAttachment(attachment);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      await dbService.createAttachment(attachment);
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.add');
    }
  }

  async create(attachment: Attachment): Promise<void> {
    return this.add(attachment);
  }

  async update(id: string, updates: Partial<Attachment>): Promise<void> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('Attachment not found');
      }
      const updated = { ...existing, ...updates };
      await dbService.createAttachment(updated);
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.update');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await dbService.deleteAttachment(id);
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.delete');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await dbService.clearAllData();
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.deleteAll');
    }
  }

  async deleteByTaskId(taskId: string): Promise<void> {
    try {
      await dbService.deleteAttachmentsByTaskId(taskId);
    } catch (error) {
      handleRepositoryError(error, 'AttachmentRepository.deleteByTaskId');
    }
  }

  validate(attachment: Partial<Attachment>): ValidationResult {
    return validateAttachment(attachment);
  }
}

export const attachmentRepository = new AttachmentRepository();
