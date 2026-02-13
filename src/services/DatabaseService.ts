import * as SQLite from 'expo-sqlite';
import { Task, Category } from '../models/types';

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
      CREATE INDEX IF NOT EXISTS idx_reminders_taskId ON reminders(taskId);
      CREATE INDEX IF NOT EXISTS idx_subtasks_taskId ON subtasks(taskId);
    `);
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) return [];
    const rows = await this.db.getAllAsync<any>('SELECT * FROM tasks ORDER BY createdAt DESC');
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
    };
  }

  async createTask(task: Task): Promise<void> {
    if (!this.db) return;
    await this.db.runAsync(
      `INSERT INTO tasks (id, title, description, status, priority, dueDate, categoryId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description || null,
        task.status,
        task.priority,
        task.dueDate || null,
        task.categoryId || null,
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
      `SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ? ORDER BY createdAt DESC`,
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
    `);
  }
}

export const dbService = new DatabaseService();
