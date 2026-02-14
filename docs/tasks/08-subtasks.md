# Subtasks

## Task: Subtask Management

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 2-3 days
**Dependencies:** Task CRUD UI, Data Model Design

### Description
Implement subtasks within main tasks with nested structure and progress tracking.

### Acceptance Criteria
- [ ] Create subtask from parent task detail view
- [ ] Subtask title input (required, 100 char limit)
- [ ] Edit subtask title
- [ ] Delete subtask
- [ ] Toggle subtask completion
- [ ] Reorder subtasks (drag and drop)
- [ ] Subtask count display on parent task
- [ ] Completed subtasks visual distinction
- [ ] Progress indicator showing X/Y subtasks completed
- [ ] Expand/collapse subtasks list
- [ ] Inline subtask creation for quick entry

### Verification
Create tasks with multiple subtasks, complete various combinations, and verify progress tracking is accurate.

---

## Task: Nested Subtasks (3 Levels)

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 2-3 days
**Dependencies:** Subtask Management

### Description
Implement nested subtask structure up to 3 levels deep with proper visualization and editing.

### Acceptance Criteria
- [ ] Create nested subtasks (Level 2, Level 3)
- [ ] Visual indentation for nesting levels
- [ ] Expand/collapse individual subtask groups
- [ ] Edit nested subtasks
- [ ] Delete nested subtasks (cascade delete children)
- [ ] Toggle completion on nested subtasks
- [ ] Progress calculation including all levels
- [ ] Reorder within same parent only
- [ ] Move subtask to different parent
- [ ] Maximum 3 levels enforced
- [ ] Prevent circular references

### Verification
Create deeply nested subtask structures, perform operations at all levels, and verify hierarchy is maintained.

---

## Task: Subtask Progress Indicators

**Phase:** 2
**Priority:** Low
**Estimated Effort:** 1 day
**Dependencies:** Nested Subtasks (3 Levels)

### Description
Implement detailed progress visualization for subtasks at parent and nested levels.

### Acceptance Criteria
- [ ] Progress bar showing completion percentage
- [ ] Completed/total subtasks count (e.g., "3/10 subtasks")
- [ ] Indent-level specific progress indicators
- [ ] Parent task progress updates automatically
- [ ] Visual progress on task list item
- [ ] Color-coded progress (red < 30%, yellow 30-70%, green > 70%)
- [ ] Collapse all/expand all subtasks option
- [ ] Jump to incomplete subtasks option

### Verification
Create complex subtask hierarchies and verify progress indicators update accurately at all levels.
