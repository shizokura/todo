# Attachments

## Task: File Upload & Storage

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 2-3 days
**Dependencies:** Task CRUD UI, Local Database Setup

### Description
Implement file attachment functionality for tasks with support for images, documents, and files.

### Acceptance Criteria
- [ ] File picker integration (images, documents)
- [ ] Camera capture for images (mobile)
- [ ] Supported file types: JPG, PNG, PDF, DOC, TXT
- [ ] File size limit: 10MB per file
- [ ] Multiple attachments per task (up to 10)
- [ ] Attachment preview (thumbnail for images, icon for docs)
- [ ] Attachment name display
- [ ] Attachment file size display
- [ ] Upload progress indicator
- [ ] File validation and error handling
- [ ] Local file storage with encryption
- [ ] Delete individual attachments

### Verification
Upload various file types and sizes to tasks and verify storage, preview, and deletion work correctly.

---

## Task: Attachment Management

**Phase:** 2
**Priority:** Medium
**Estimated Effort:** 1-2 days
**Dependencies:** File Upload & Storage

### Description
Implement attachment management features for organizing and accessing task attachments.

### Acceptance Criteria
- [ ] View attachment list in task detail
- [ ] Open attachment in default viewer
- [ ] Download/save attachment option
- [ ] Rename attachment
- [ ] Replace attachment
- [ ] Copy attachment to another task
- [ ] Attachment search within task
- [ ] Sort attachments by name, size, date
- [ ] Total attachment size display
- [ ] Attachment count display

### Verification
Manage multiple attachments on tasks and verify all management operations work correctly.

---

## Task: Image Preview & Editing

**Phase:** 2
**Priority:** Low
**Estimated Effort:** 2 days
**Dependencies:** File Upload & Storage

### Description
Implement image preview with basic editing capabilities for image attachments.

### Acceptance Criteria
- [ ] Full-screen image preview
- [ ] Pinch to zoom
- [ ] Swipe between attachments
- [ ] Basic image crop
- [ ] Image rotation (90° increments)
- [ ] Image filters (grayscale, sepia, brightness, contrast)
- [ ] Save edited image
- [ ] Revert to original option

### Verification
Upload images, apply edits, and verify changes persist correctly.
