export type TaskStatus = 'incomplete' | 'in_progress' | 'completed' | 'archived';
export type TaskPriority = 'high' | 'medium' | 'low' | 'none';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: number;
  categoryId?: string;
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  taskOrder: number;
}

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  createdAt: number;
}

export interface Reminder {
  id: string;
  taskId: string;
  reminderTime: number;
  recurringRule?: string;
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  defaultView: 'list' | 'kanban';
  enableNotifications: boolean;
  defaultPriority: TaskPriority;
}

export interface FilterState {
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string;
  searchQuery?: string;
  dueDateFrom?: number;
  dueDateTo?: number;
}
