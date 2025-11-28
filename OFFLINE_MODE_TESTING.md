# Offline Mode Testing Guide

## Overview

The application now supports full offline functionality with automatic synchronization when internet connection is restored.

## Architecture Components

### Core Services

1. **IndexedDB (Dexie)** - `client/src/db/database.js`
   - Local database for offline storage
   - Tables: users, tasks, syncQueue, metadata

2. **NetworkService** - `client/src/services/NetworkService.js`
   - Monitors online/offline status
   - Notifies subscribers of status changes

3. **SyncQueueManager** - `client/src/services/SyncQueueManager.js`
   - Manages queue of pending operations
   - Tracks retry counts and priorities

4. **SyncService** - `client/src/services/SyncService.js`
   - Handles synchronization with server
   - Implements retry logic with exponential backoff
   - Auto-syncs when connection restored

5. **OfflineClient** - `client/src/http/offlineClient.js`
   - Wrapper around axios for offline-aware requests
   - Automatically stores operations in IndexedDB when offline

### UI Components

- **NetworkStatusIndicator** - Shows online/offline status
- **SyncStatusBadge** - Displays pending changes count and sync status

## Testing Scenarios

### 1. Create Task Offline

**Steps:**
1. Open DevTools → Network tab
2. Set network throttling to "Offline"
3. Navigate to task creation
4. Create a new task with title, description, assignee
5. Task should appear in UI immediately with temporary ID

**Expected Result:**
- Task created locally in IndexedDB
- Task visible in task list
- SyncStatusBadge shows "1 изм." (1 change pending)
- NetworkStatusIndicator shows "Offline"

### 2. Update Task Offline

**Steps:**
1. Ensure you're offline (Network → Offline)
2. Select existing task
3. Change status or edit details
4. Save changes

**Expected Result:**
- Changes applied immediately in UI
- Operation added to sync queue
- SyncStatusBadge increments counter

### 3. Delete Task Offline

**Steps:**
1. Remain offline
2. Delete a task
3. Verify task removed from UI

**Expected Result:**
- Task removed from IndexedDB and UI
- Delete operation queued for sync

### 4. Automatic Synchronization

**Steps:**
1. Perform 2-3 operations offline (create, update)
2. Check SyncStatusBadge shows correct count
3. Re-enable network (Network → No throttling)
4. Wait 2-3 seconds

**Expected Result:**
- NetworkStatusIndicator changes to "Online"
- Sync automatically starts (spinning icon in SyncStatusBadge)
- All operations synchronized to server
- Temporary IDs replaced with real server IDs
- SyncStatusBadge shows "Синхронизировано" when complete
- Toast notification: "Синхронизация завершена"

### 5. Manual Sync

**Steps:**
1. Create changes offline
2. Go online
3. Click "Синхронизировать" button in SyncStatusBadge

**Expected Result:**
- Immediate sync triggered
- Progress indicator shown
- Success notification displayed

### 6. Load Tasks Offline

**Steps:**
1. Load tasks while online (to populate IndexedDB)
2. Go offline
3. Refresh page or navigate to tasks

**Expected Result:**
- Tasks loaded from IndexedDB
- All tasks visible despite no network
- Full functionality available

### 7. Conflict Resolution

**Steps:**
1. Create task A offline
2. Wait for sync (go online)
3. On another device/browser, modify task A
4. On first device offline, modify task A again
5. Go online and sync

**Expected Result:**
- Last write wins (current implementation)
- No errors in sync process
- Final state matches last update

### 8. Failed Sync Retry

**Steps:**
1. Perform operations offline
2. Go online briefly (1-2 seconds) then offline again
3. Repeat 2-3 times

**Expected Result:**
- Sync attempts with exponential backoff
- Retry count increments in syncQueue
- No duplicate operations
- Eventually syncs when connection stable

## Testing Checklist

- [ ] Create task offline
- [ ] Update task offline
- [ ] Delete task offline
- [ ] Multiple operations offline
- [ ] Automatic sync on connection restore
- [ ] Manual sync button works
- [ ] Load cached tasks offline
- [ ] Navigate between pages offline
- [ ] Sync status updates correctly
- [ ] Network indicator accurate
- [ ] Toast notifications appear
- [ ] No console errors
- [ ] Browser refresh preserves offline changes
- [ ] Long-term offline (10+ operations)
- [ ] Retry logic on intermittent connection

## Browser DevTools Inspection

### Check IndexedDB

1. Open DevTools → Application → IndexedDB
2. Expand "PanelDashboardDB"
3. Inspect tables:
   - `tasks` - should contain all tasks with `_syncStatus`, `_version`
   - `syncQueue` - pending operations
   - `metadata` - last sync timestamp

### Monitor Network

1. DevTools → Network tab
2. Filter by "XHR"
3. When offline: no requests should go through
4. When online: batch of sync requests should execute

### Console Logs

Look for:
- "Sync start/complete" messages
- Operation queuing confirmations
- Network status changes
- Any errors (should be none)

## Known Limitations

1. **Authentication**: Login/Registration must be online
2. **File Uploads**: Not supported offline currently
3. **Real-time Updates**: No websocket support offline
4. **Conflict Resolution**: Simple last-write-wins strategy

## Troubleshooting

**Issue**: Changes not syncing
- Check sync queue in IndexedDB
- Verify network connection
- Look for errors in DevTools console
- Try manual sync button

**Issue**: Old data showing after sync
- Clear browser cache
- Check `_lastModified` timestamps
- Verify server returned updated data

**Issue**: Duplicate tasks after sync
- Check temporary ID format (should start with `temp_`)
- Verify sync service removes queue items after success
- Inspect syncQueue table for stuck operations

## Performance Considerations

- IndexedDB operations are async but fast (<10ms typically)
- Sync queue processed sequentially
- Exponential backoff prevents server overload
- Batch operations recommended for better UX

## Future Enhancements

1. More sophisticated conflict resolution
2. Offline file upload queue
3. Delta sync (only changed fields)
4. Compression for large datasets
5. Background sync API integration
6. Optimistic locking with version vectors
