# Data Model & Storage

## Task: Data Model Design ✅

**Phase:** 1
**Priority:** High
**Estimated Effort:** 1 day
**Dependencies:** Local Database Setup
**Status:** COMPLETED

### Description
Design and implement data models for all core entities with proper relationships, validation, and indexing.

### Acceptance Criteria
- [x] Task model implemented (id, title, description, status, priority, dueDate, categoryId, createdAt, updatedAt, order)
- [x] Category model implemented (id, name, color, icon)
- [x] Subtask model implemented (id, taskId, title, completed, order)
- [x] Attachment model implemented (id, taskId, fileName, fileSize, fileType, filePath, createdAt)
- [x] Reminder model implemented (id, taskId, reminderTime, recurringRule, isActive)
- [x] UserPreferences model implemented (theme, fontSize, defaultView, etc.)
- [x] Database indexes created on frequently queried fields (dueDate, priority, status, categoryId, order)
- [x] Data validation rules implemented (title required, priority enum, etc.)
- [x] Relationship constraints defined (cascade delete for subtasks when task deleted)

### Verification
Create test records for all models and verify relationships work correctly (e.g., deleting a task cascades to subtasks).

### Implementation Status
**COMPLETED** ✅ - All data models implemented with TypeScript interfaces in `src/models/types.ts`. Added `order` field to Task model for custom sorting.

---

## Task: Data Repository Layer ✅

**Phase:** 1
**Priority:** High
**Estimated Effort:** 1-2 days
**Dependencies:** Data Model Design
**Status:** COMPLETED

### Description
Implement repository pattern for data access with methods for CRUD operations, queries, and batch operations.

### Acceptance Criteria
- [x] TaskRepository with methods: getAll, getById, create, update, delete, search, filter
- [x] CategoryRepository with methods: getAll, getById, create, update, delete, getByName
- [x] SubtaskRepository with methods: getByTaskId, create, update, delete, toggleComplete
- [x] AttachmentRepository with methods: getByTaskId, add, delete, getAll
- [x] ReminderRepository with methods: getByTaskId, add, update, delete, getActiveReminders
- [x] Batch operation support for bulk updates/deletes
- [x] Query optimization with proper indexing utilization
- [x] Error handling with meaningful error messages

### Verification
Write unit tests for each repository method with various scenarios (success, failure, edge cases).

### Implementation Status
**COMPLETED** ✅ - Full repository layer implemented with:
- BaseRepository interface with error handling
- Individual repositories for Task, Category, Subtask, Attachment, Reminder, UserPreferences
- All CRUD operations with validation
- Batch operation support
- Singleton instances exported from `src/repositories/index.ts`

---

## Task: Data Backup & Restore

**Phase:** 3
**Priority:** Medium
**Estimated Effort:** 2-3 days
**Dependencies:** Data Repository Layer

### Description
Implement data backup and restore functionality with encryption support and automatic backup reminders.

### Acceptance Criteria
- [ ] Backup service creates encrypted JSON export of all user data
- [ ] Backup file includes tasks, categories, subtasks, attachments metadata, and preferences
- [ ] Restore functionality validates backup file format and data integrity
- [ ] Restore provides preview of data before restoration
- [ ] Clear data functionality with confirmation dialog
- [ ] Backup reminder notification (monthly)
- [ ] Manual backup trigger from settings
- [ ] Restore with conflict resolution (overwrite, merge, cancel)

### Verification
Test backup/restore cycle with various data sets including attachments and verify data integrity.

---

## Task: Data Export/Import

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 2 days
**Dependencies:** Data Repository Layer

### Description
Implement export and import functionality for tasks in JSON and CSV formats for sharing and migration.

### Acceptance Criteria
- [ ] Export to JSON format with all task data, subtasks, and categories
- [ ] Export to CSV format (tasks only for spreadsheet compatibility)
- [ ] Import from JSON format with validation
- [ ] Import from CSV format with column mapping
- [ ] File size validation (max 50MB for imports)
- [ ] Import preview showing count of tasks to be imported
- [ ] Import error handling with specific error messages
- [ ] Duplicate task detection during import

### Verification
Test export/import roundtrip with various data sets and verify data integrity.
