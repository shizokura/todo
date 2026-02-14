# Task States

## Task: Status Management

**Phase:** 1
**Priority:** High
**Estimated Effort:** 1-2 days
**Dependencies:** Task CRUD UI

### Description
Implement task status management with Incomplete, In Progress, Completed, and Archived states.

### Acceptance Criteria
- [ ] Four status states: Incomplete, In Progress, Completed, Archived
- [ ] Status selection in task creation/edit form
- [ ] Quick status change from task list (tap checkbox for Complete)
- [ ] Status icons/indicators in task list
- [ ] Default status: Incomplete
- [ ] Status change animation/transition
- [ ] Completed tasks visual distinction (strikethrough, dimmed)
- [ ] Archived tasks removed from main views
- [ ] Bulk status update from selection mode
- [ ] Status history tracking (optional, for undo)

### Verification
Change statuses on multiple tasks and verify visual updates and filtering work correctly.

---

## Task: Archive Functionality

**Phase:** 1
**Priority:** Medium
**Estimated Effort:** 1 day
**Dependencies:** Status Management

### Description
Implement archiving of completed tasks with archive management and restore capability.

### Acceptance Criteria
- [ ] Archive completed tasks individually
- [ ] Bulk archive completed tasks
- [ ] Archive all completed tasks option
- [ ] Archived tasks view
- [ ] Restore from archived status
- [ ] Bulk restore from archive
- [ ] Permanently delete archived tasks (with confirmation)
- [ ] Archive count display
- [ ] Auto-archive option after X days (7, 14, 30 days)
- [ ] Archived tasks don't appear in active views

### Verification
Archive tasks, view archive, restore tasks, and verify persistence across app restarts.

---

## Task: Status Transitions

**Phase:** 2
**Priority:** Low
**Estimated Effort:** 1 day
**Dependencies:** Status Management, Statistics & Insights

### Description
Implement intelligent status transition suggestions and tracking for productivity insights.

### Acceptance Criteria
- [ ] Suggest "In Progress" when task edited
- [ ] Suggest "Complete" when all subtasks done
- [ ] Status transition history tracking
- [ ] Average time in each status per category
- [ ] Status transition visualization in statistics
- [ ] Manual override of suggestions

### Verification
Complete various status transitions and verify suggestions appear appropriately based on task context.
