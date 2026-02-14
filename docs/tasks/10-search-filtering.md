# Search & Filtering

## Task: Full-Text Search

**Phase:** 1
**Priority:** High
**Estimated Effort:** 2-3 days
**Dependencies:** Task CRUD UI, Data Repository Layer

### Description
Implement full-text search across tasks with support for titles, descriptions, and attachments.

### Acceptance Criteria
- [ ] Search bar in main view
- [ ] Search across task titles
- [ ] Search across task descriptions
- [ ] Search result highlighting
- [ ] Real-time search results (debounced 300ms)
- [ ] Search history (last 10 searches)
- [ ] Clear search button
- [ ] Search result count display
- [ ] Empty state for no results
- [ ] Keyboard handling (Enter to search, Escape to clear)
- [ ] Minimum 2 character search requirement
- [ ] Case-insensitive search

### Verification
Search for various terms across titles and descriptions and verify results are accurate and highlighted.

---

## Task: Advanced Filtering

**Phase:** 1
**Priority:** High
**Estimated Effort:** 2 days
**Dependencies:** Full-Text Search

### Description
Implement comprehensive filtering by category, priority, due date, status, and custom criteria.

### Acceptance Criteria
- [ ] Filter by category (single or multiple)
- [ ] Filter by priority level
- [ ] Filter by due date range (today, this week, this month, custom)
- [ ] Filter by status
- [ ] Filter by has attachments
- [ ] Filter by has subtasks
- [ ] Filter by overdue tasks
- [ ] Combine multiple filters (AND logic)
- [ ] Clear all filters option
- [ ] Active filters display with badges
- [ ] Remove individual filter option
- [ ] Filter count display

### Verification
Apply various filter combinations and verify results match criteria correctly.

---

## Task: Saved Filters

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 1-2 days
**Dependencies:** Advanced Filtering

### Description
Allow users to save and reuse custom filter combinations for quick access.

### Acceptance Criteria
- [ ] Save current filter combination
- [ ] Name saved filter (required, 30 char limit)
- [ ] List saved filters
- [ ] Apply saved filter (replaces current filters)
- [ ] Edit saved filter name
- [ ] Delete saved filter
- [ ] Default filter option
- [ ] Create quick filter preset
- [ ] Share saved filter (export/import)

### Verification
Save various filter combinations, apply them, and verify they restore correctly.

---

## Task: Quick Filter Presets

**Phase:** 1
**Priority:** Medium
**Estimated Effort:** 1 day
**Dependencies:** Advanced Filtering

### Description
Implement quick access filter buttons for common use cases.

### Acceptance Criteria
- [ ] "Today" filter (due today)
- [ ] "This Week" filter (due this week)
- [ ] "Overdue" filter
- [ ] "High Priority" filter
- [ ] "In Progress" filter
- [ ] "Completed" filter
- [ ] "All Tasks" filter (clear filters)
- [ ] Preset buttons in main view
- [ ] Active preset indication
- [ ] Preset count badges

### Verification
Click each preset and verify correct tasks are displayed.
