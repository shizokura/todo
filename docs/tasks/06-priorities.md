# Priorities

## Task: Priority Levels

**Phase:** 1
**Priority:** High
**Estimated Effort:** 1 day
**Dependencies:** Task CRUD UI

### Description
Implement priority levels for tasks with visual indicators and sorting/filtering.

### Acceptance Criteria
- [ ] Four priority levels: High, Medium, Low, None
- [ ] Priority selection in task creation/edit form
- [ ] Visual priority indicators in task list (colored badges, icons)
- [ ] Priority colors: High (red), Medium (orange), Low (yellow), None (gray)
- [ ] Default priority: None
- [ ] Sort tasks by priority
- [ ] Filter tasks by priority level
- [ ] Quick priority change from task list
- [ ] Priority display in task detail view
- [ ] Bulk priority update from selection mode

### Verification
Create tasks with different priorities and verify visual indicators, sorting, and filtering work correctly.

---

## Task: Custom Priority Labels

**Phase:** 2
**Priority:** Low
**Estimated Effort:** 1-2 days
**Dependencies:** Priority Levels

### Description
Allow users to customize priority labels while maintaining the four-level structure.

### Acceptance Criteria
- [ ] Custom label input for each priority level
- [ ] Default labels: High, Medium, Low, None
- [ ] Label length limit (20 chars)
- [ ] Custom colors for each priority level (maintain defaults)
- [ ] Priority label management in settings
- [ ] Reset to default labels option
- [ ] Label changes reflect across all views immediately

### Verification
Customize priority labels and colors and verify updates apply consistently throughout the app.
