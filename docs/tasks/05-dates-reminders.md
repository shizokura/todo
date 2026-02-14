# Due Dates & Reminders

## Task: Due Date Picker & Display

**Phase:** 1
**Priority:** High
**Estimated Effort:** 1-2 days
**Dependencies:** Task CRUD UI

### Description
Implement due date selection, display, and timezone support for tasks.

### Acceptance Criteria
- [ ] Due date picker with calendar UI
- [ ] Time picker for specific time
- [ ] Today, Tomorrow, Next Week quick options
- [ ] Clear due date option
- [ ] Due date display in task list (date, time, relative time)
- [ ] Overdue task highlighting (red indicator)
- [ ] Due today highlighting (orange indicator)
- [ ] Upcoming task highlighting (green indicator)
- [ ] Timezone detection and display
- [ ] Timezone conversion for display
- [ ] Sort tasks by due date

### Verification
Create tasks with various due dates across different timezones and verify correct display and highlighting.

---

## Task: Reminder System

**Phase:** 1
**Priority:** High
**Estimated Effort:** 2-3 days
**Dependencies:** Due Date Picker & Display, Local Database Setup

### Description
Implement local notification reminders with multiple reminder options per task.

### Acceptance Criteria
- [ ] Set reminder at time of due date
- [ ] Set reminder X minutes/hours/days before due date
- [ ] Multiple reminders per task (up to 5)
- [ ] Reminder time picker
- [ ] Quick reminder presets (5 min, 15 min, 1 hour, 1 day before)
- [ ] Local notification scheduling
- [ ] Reminder tap opens task detail
- [ ] Snooze reminder option (5 min, 10 min, 30 min, 1 hour)
- [ ] Dismiss reminder option
- [ ] Reminder on/off toggle per task
- [ ] Reminder sound customization
- [ ] Notification permission handling

### Verification
Set multiple reminders on tasks and verify notifications fire correctly with snooze and dismiss functionality.

---

## Task: Recurring Tasks

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 3-4 days
**Dependencies:** Reminder System, Task States

### Description
Implement recurring task functionality with various recurrence patterns and automatic task generation.

### Acceptance Criteria
- [ ] Daily recurrence option
- [ ] Weekly recurrence option (select specific days)
- [ ] Monthly recurrence option (date of month)
- [ ] Custom recurrence (every X days/weeks/months)
- [ ] Recurrence end options (never, after X occurrences, on specific date)
- [ ] Automatic new task creation upon completion
- [ ] Copy original task data to recurring instance
- [ ] Recurrence pattern display
- [ ] Edit recurrence pattern
- [ ] Stop recurrence option
- [ ] Recurrence history tracking
- [ ] Next due date calculation and display

### Verification
Create recurring tasks with different patterns, complete instances, and verify automatic generation works correctly.
