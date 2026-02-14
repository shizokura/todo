import * as SQLite from 'expo-sqlite';
import { Task, Category, Subtask, Attachment, Reminder, UserPreferences } from '../models/types';

const DB_NAME = 'todo.db';

export class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'incomplete',
        priority TEXT DEFAULT 'none',
        dueDate INTEGER,
        categoryId TEXT,
        "order" INTEGER DEFAULT 0,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL,
        icon TEXT,
        createdAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subtasks (
        id TEXT PRIMARY KEY,
        taskId TEXT NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        taskOrder INTEGER NOT NULL,
        FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS attachments (
        id TEXT PRIMARY KEY,
        taskId TEXT NOT NULL,
        fileName TEXT NOT NULL,
        fileSize INTEGER NOT NULL,
        fileType TEXT NOT NULL,
        filePath TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        taskId TEXT NOT NULL,
        reminderTime INTEGER NOT NULL,
        recurringRule TEXT,
        isActive INTEGER DEFAULT 1,
        FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);
      CREATE INDEX IF NOT EXISTS idx_tasks_categoryId ON tasks(categoryId);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks("order");
      CREATE INDEX IF NOT EXISTS idx_reminders_taskId ON reminders(taskId);
      CREATE INDEX IF NOT EXISTS idx_subtasks_taskId ON subtasks(taskId);
      CREATE INDEX IF NOT EXISTS idx_attachments_taskId ON attachments(taskId);

      CREATE TABLE IF NOT EXISTS userPreferences (
        theme TEXT DEFAULT 'light',
        fontSize INTEGER DEFAULT 16,
        defaultView TEXT DEFAULT 'list',
        enableNotifications INTEGER DEFAULT 1,
        defaultPriority TEXT DEFAULT 'none',
        PRIMARY KEY (theme)
      );
    `);
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>('SELECT * FROM tasks ORDER BY "order" ASC, createdAt DESC');
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      order: row.order || 0,
    }));
  }

  async getTaskById(id: string): Promise<Task | null> {
    if (!this.db) return null;
    const row = await this.db.getFirstAsync<any>('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      order: row.order || 0,
    };
  }

  async createTask(task: Task): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      `INSERT INTO tasks (id, title, description, status, priority, dueDate, categoryId, "order", createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description || null,
        task.status,
        task.priority,
        task.dueDate || null,
        task.categoryId || null,
        task.order,
        task.createdAt,
        task.updatedAt,
      ]
    );
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (!this.db) return;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }
    if (updates.dueDate !== undefined) {
      fields.push('dueDate = ?');
      values.push(updates.dueDate);
    }
    if (updates.categoryId !== undefined) {
      fields.push('categoryId = ?');
      values.push(updates.categoryId);
    }
    if (updates.order !== undefined) {
      fields.push('"order" = ?');
      values.push(updates.order);
    }

    fields.push('updatedAt = ?');
    values.push(Date.now());
    values.push(id);

    await this.db.runAsync(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  async searchTasks(query: string): Promise<Task[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      `SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ? ORDER BY "order" ASC, createdAt DESC`,
      [`%${query}%`, `%${query}%`]
    );
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      order: row.order || 0,
    }));
  }

  async getAllCategories(): Promise<Category[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>('SELECT * FROM categories ORDER BY name');
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      color: row.color,
      icon: row.icon,
      createdAt: row.createdAt,
    }));
  }

  async createCategory(category: Category): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO categories (id, name, color, icon, createdAt) VALUES (?, ?, ?, ?, ?)',
      [category.id, category.name, category.color, category.icon || null, category.createdAt]
    );
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    if (!this.db) return;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color);
    }
    if (updates.icon !== undefined) {
      fields.push('icon = ?');
      values.push(updates.icon);
    }

    values.push(id);

    await this.db.runAsync(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteCategory(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  }

  async clearAllData(): Promise<void> {
    if (!this.db) return;
    await this.db.execAsync(`
      DELETE FROM tasks;
      DELETE FROM categories;
      DELETE FROM subtasks;
      DELETE FROM attachments;
      DELETE FROM reminders;
      DELETE FROM userPreferences;
    `);
  }

  async getSubtasksByTaskId(taskId: string): Promise<Subtask[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM subtasks WHERE taskId = ? ORDER BY taskOrder ASC',
      [taskId]
    );
    return rows.map(row => ({
      id: row.id,
      taskId: row.taskId,
      title: row.title,
      completed: Boolean(row.completed),
      taskOrder: row.taskOrder,
    }));
  }

  async createSubtask(subtask: Subtask): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO subtasks (id, taskId, title, completed, taskOrder) VALUES (?, ?, ?, ?, ?)',
      [subtask.id, subtask.taskId, subtask.title, subtask.completed ? 1 : 0, subtask.taskOrder]
    );
  }

  async updateSubtask(id: string, updates: Partial<Subtask>): Promise<void> {
    if (!this.db) return;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }
    if (updates.taskOrder !== undefined) {
      fields.push('taskOrder = ?');
      values.push(updates.taskOrder);
    }

    values.push(id);
    await this.db.runAsync(
      `UPDATE subtasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteSubtask(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM subtasks WHERE id = ?', [id]);
  }

  async deleteSubtasksByTaskId(taskId: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM subtasks WHERE taskId = ?', [taskId]);
  }

  async toggleSubtaskComplete(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'UPDATE subtasks SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END WHERE id = ?',
      [id]
    );
  }

  async getAttachmentsByTaskId(taskId: string): Promise<Attachment[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM attachments WHERE taskId = ? ORDER BY createdAt DESC',
      [taskId]
    );
    return rows.map(row => ({
      id: row.id,
      taskId: row.taskId,
      fileName: row.fileName,
      fileSize: row.fileSize,
      fileType: row.fileType,
      filePath: row.filePath,
      createdAt: row.createdAt,
    }));
  }

  async getAllAttachments(): Promise<Attachment[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>('SELECT * FROM attachments ORDER BY createdAt DESC');
    return rows.map(row => ({
      id: row.id,
      taskId: row.taskId,
      fileName: row.fileName,
      fileSize: row.fileSize,
      fileType: row.fileType,
      filePath: row.filePath,
      createdAt: row.createdAt,
    }));
  }

  async createAttachment(attachment: Attachment): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO attachments (id, taskId, fileName, fileSize, fileType, filePath, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        attachment.id,
        attachment.taskId,
        attachment.fileName,
        attachment.fileSize,
        attachment.fileType,
        attachment.filePath,
        attachment.createdAt,
      ]
    );
  }

  async deleteAttachment(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM attachments WHERE id = ?', [id]);
  }

  async deleteAttachmentsByTaskId(taskId: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM attachments WHERE taskId = ?', [taskId]);
  }

  async getRemindersByTaskId(taskId: string): Promise<Reminder[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM reminders WHERE taskId = ? ORDER BY reminderTime ASC',
      [taskId]
    );
    return rows.map(row => ({
      id: row.id,
      taskId: row.taskId,
      reminderTime: row.reminderTime,
      recurringRule: row.recurringRule,
      isActive: Boolean(row.isActive),
    }));
  }

  async getActiveReminders(): Promise<Reminder[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>(
      'SELECT * FROM reminders WHERE isActive = 1 ORDER BY reminderTime ASC'
    );
    return rows.map(row => ({
      id: row.id,
      taskId: row.taskId,
      reminderTime: row.reminderTime,
      recurringRule: row.recurringRule,
      isActive: Boolean(row.isActive),
    }));
  }

  async createReminder(reminder: Reminder): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      'INSERT INTO reminders (id, taskId, reminderTime, recurringRule, isActive) VALUES (?, ?, ?, ?, ?)',
      [
        reminder.id,
        reminder.taskId,
        reminder.reminderTime,
        reminder.recurringRule || null,
        reminder.isActive ? 1 : 0,
      ]
    );
  }

  async updateReminder(id: string, updates: Partial<Reminder>): Promise<void> {
    if (!this.db) return;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.reminderTime !== undefined) {
      fields.push('reminderTime = ?');
      values.push(updates.reminderTime);
    }
    if (updates.recurringRule !== undefined) {
      fields.push('recurringRule = ?');
      values.push(updates.recurringRule);
    }
    if (updates.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updates.isActive ? 1 : 0);
    }

    values.push(id);
    await this.db.runAsync(
      `UPDATE reminders SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteReminder(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
  }

  async deleteRemindersByTaskId(taskId: string): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync('DELETE FROM reminders WHERE taskId = ?', [taskId]);
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    if (!this.db) return null;
    const row = await this.db.getFirstAsync<any>('SELECT * FROM userPreferences LIMIT 1');
    if (!row) {
      return {
        theme: 'light',
        fontSize: 16,
        defaultView: 'list',
        enableNotifications: true,
        defaultPriority: 'none',
      };
    }
    return {
      theme: row.theme || 'light',
      fontSize: row.fontSize || 16,
      defaultView: row.defaultView || 'list',
      enableNotifications: Boolean(row.enableNotifications),
      defaultPriority: row.defaultPriority || 'none',
    };
  }

  async updateUserPreferences(prefs: Partial<UserPreferences>): Promise<void> {
    if (!this.db) return;

    const existing = await this.getUserPreferences();
    const merged = { ...existing, ...prefs };

    await this.db.runAsync(
      `INSERT OR REPLACE INTO userPreferences (theme, fontSize, defaultView, enableNotifications, defaultPriority)
       VALUES (?, ?, ?, ?, ?)`,
      [
        merged.theme || 'light',
        merged.fontSize || 16,
        merged.defaultView || 'list',
        merged.enableNotifications ? 1 : 0,
        merged.defaultPriority || 'none',
      ]
    );
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    if (!this.db) return null;
    const row = await this.db.getFirstAsync<any>('SELECT * FROM categories WHERE name = ?', [name]);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      color: row.color,
      icon: row.icon,
      createdAt: row.createdAt,
    };
  }

  async filterTasks(filter: {
    status?: string;
    priority?: string;
    categoryId?: string;
    dueDateFrom?: number;
    dueDateTo?: number;
  }): Promise<Task[]> {
    if (!this.db) return [];

    const conditions: string[] = [];
    const values: any[] = [];

    if (filter.status) {
      conditions.push('status = ?');
      values.push(filter.status);
    }
    if (filter.priority) {
      conditions.push('priority = ?');
      values.push(filter.priority);
    }
    if (filter.categoryId) {
      conditions.push('categoryId = ?');
      values.push(filter.categoryId);
    }
    if (filter.dueDateFrom) {
      conditions.push('dueDate >= ?');
      values.push(filter.dueDateFrom);
    }
    if (filter.dueDateTo) {
      conditions.push('dueDate <= ?');
      values.push(filter.dueDateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await this.db.getAllAsync<any>(
      `SELECT * FROM tasks ${whereClause} ORDER BY "order" ASC, createdAt DESC`,
      values
    );

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      order: row.order || 0,
    }));
  }
}

export const dbService = new DatabaseService();
