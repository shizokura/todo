import { Task, Category, Subtask, Attachment, Reminder, UserPreferences } from '../models/types';

const TaskStatusValues = ['incomplete', 'in_progress', 'completed', 'archived'] as const;
const TaskPriorityValues = ['high', 'medium', 'low', 'none'] as const;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateTask = (task: Partial<Task>): ValidationResult => {
  const errors: string[] = [];

  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (task.title.trim().length > 200) {
    errors.push('Task title must be 200 characters or less');
  }

  if (task.description !== undefined && task.description.length > 2000) {
    errors.push('Task description must be 2000 characters or less');
  }

  if (task.status && !TaskStatusValues.includes(task.status)) {
    errors.push('Invalid task status');
  }

  if (task.priority && !TaskPriorityValues.includes(task.priority)) {
    errors.push('Invalid task priority');
  }

  if (task.dueDate !== undefined && task.dueDate < 0) {
    errors.push('Due date must be a valid timestamp');
  }

  if (task.order !== undefined && task.order < 0) {
    errors.push('Task order must be a non-negative number');
  }

  if (task.createdAt !== undefined && task.createdAt < 0) {
    errors.push('Created at must be a valid timestamp');
  }

  if (task.updatedAt !== undefined && task.updatedAt < 0) {
    errors.push('Updated at must be a valid timestamp');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateCategory = (category: Partial<Category>): ValidationResult => {
  const errors: string[] = [];

  if (!category.name || category.name.trim().length === 0) {
    errors.push('Category name is required');
  } else if (category.name.trim().length > 50) {
    errors.push('Category name must be 50 characters or less');
  }

  if (!category.color || category.color.trim().length === 0) {
    errors.push('Category color is required');
  } else if (!/^#[0-9A-Fa-f]{6}$/.test(category.color)) {
    errors.push('Category color must be a valid hex color (e.g., #FF5733)');
  }

  if (category.icon !== undefined && category.icon.length > 50) {
    errors.push('Category icon must be 50 characters or less');
  }

  if (category.createdAt !== undefined && category.createdAt < 0) {
    errors.push('Created at must be a valid timestamp');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateSubtask = (subtask: Partial<Subtask>): ValidationResult => {
  const errors: string[] = [];

  if (!subtask.title || subtask.title.trim().length === 0) {
    errors.push('Subtask title is required');
  } else if (subtask.title.trim().length > 200) {
    errors.push('Subtask title must be 200 characters or less');
  }

  if (!subtask.taskId || subtask.taskId.trim().length === 0) {
    errors.push('Task ID is required');
  }

  if (subtask.completed !== undefined && typeof subtask.completed !== 'boolean') {
    errors.push('Subtask completed must be a boolean');
  }

  if (subtask.taskOrder !== undefined && subtask.taskOrder < 0) {
    errors.push('Subtask order must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateAttachment = (attachment: Partial<Attachment>): ValidationResult => {
  const errors: string[] = [];

  if (!attachment.fileName || attachment.fileName.trim().length === 0) {
    errors.push('File name is required');
  } else if (attachment.fileName.length > 255) {
    errors.push('File name must be 255 characters or less');
  }

  if (attachment.fileSize === undefined || attachment.fileSize <= 0) {
    errors.push('File size must be a positive number');
  } else if (attachment.fileSize > 100 * 1024 * 1024) {
    errors.push('File size cannot exceed 100MB');
  }

  if (!attachment.fileType || attachment.fileType.trim().length === 0) {
    errors.push('File type is required');
  }

  if (!attachment.filePath || attachment.filePath.trim().length === 0) {
    errors.push('File path is required');
  }

  if (!attachment.taskId || attachment.taskId.trim().length === 0) {
    errors.push('Task ID is required');
  }

  if (attachment.createdAt !== undefined && attachment.createdAt < 0) {
    errors.push('Created at must be a valid timestamp');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateReminder = (reminder: Partial<Reminder>): ValidationResult => {
  const errors: string[] = [];

  if (reminder.reminderTime === undefined || reminder.reminderTime <= 0) {
    errors.push('Reminder time is required and must be in the future');
  }

  if (!reminder.taskId || reminder.taskId.trim().length === 0) {
    errors.push('Task ID is required');
  }

  if (reminder.isActive !== undefined && typeof reminder.isActive !== 'boolean') {
    errors.push('Active status must be a boolean');
  }

  if (reminder.recurringRule !== undefined) {
    const validRules = ['daily', 'weekly', 'monthly', 'yearly', 'none'];
    if (!validRules.includes(reminder.recurringRule)) {
      errors.push('Invalid recurring rule. Must be one of: daily, weekly, monthly, yearly, none');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateUserPreferences = (prefs: Partial<UserPreferences>): ValidationResult => {
  const errors: string[] = [];

  if (prefs.theme && !['light', 'dark'].includes(prefs.theme)) {
    errors.push('Theme must be either "light" or "dark"');
  }

  if (prefs.fontSize !== undefined && (prefs.fontSize < 12 || prefs.fontSize > 24)) {
    errors.push('Font size must be between 12 and 24');
  }

  if (prefs.defaultView && !['list', 'kanban'].includes(prefs.defaultView)) {
    errors.push('Default view must be either "list" or "kanban"');
  }

  if (prefs.enableNotifications !== undefined && typeof prefs.enableNotifications !== 'boolean') {
    errors.push('Enable notifications must be a boolean');
  }

  if (prefs.defaultPriority && !TaskPriorityValues.includes(prefs.defaultPriority)) {
    errors.push('Invalid default priority');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (value === undefined || value === null || value === '') {
    return {
      valid: false,
      errors: [`${fieldName} is required`]
    };
  }
  return { valid: true, errors: [] };
};
