# WiFi Offline Mode Testing

## What was fixed

1. **Enhanced network error detection** - added more network error codes
2. **Request timeout** - 10 seconds timeout for all API requests
3. **Periodic connection check** - checks real connectivity every 30 seconds
4. **Better error handling** - catches timeout, network errors, DNS failures
5. **Debug logging** - console logs show network status and offline fallback

## How to test when WiFi is disabled

### Method 1: Disable WiFi completely

1. **Start the application** while connected to WiFi
2. **Login and load tasks** (to populate IndexedDB)
3. **Disable WiFi** on your device
4. **Open DevTools Console** (F12) - you should see:
   ```
   [OfflineClient] Network status: OFFLINE
   [OfflineClient] Using OFFLINE mode directly
   ```

5. **Try to create a task**:
   - Task should appear immediately in UI
   - Console shows: `[OfflineClient] Using OFFLINE mode directly`
   - SyncStatusBadge shows pending changes count
   - NetworkStatusIndicator shows "Offline"

6. **Re-enable WiFi**:
   - NetworkStatusIndicator changes to "Online"
   - Sync starts automatically (within 2-3 seconds)
   - Console shows sync activity
   - Toast notification: "Синхронизация завершена"

### Method 2: DevTools Network Offline

1. Open **DevTools** → **Network** tab
2. Select **"Offline"** from throttling dropdown
3. Perform operations (create/update/delete tasks)
4. All operations work locally
5. Change to **"No throttling"**
6. Automatic sync happens

### What to look for in Console

When WiFi disabled, you should see:

```javascript
[OfflineClient] Network status: OFFLINE
[OfflineClient] Using OFFLINE mode directly
```

When trying operation online but fails:

```javascript
[OfflineClient] Network status: ONLINE
[OfflineClient] Request failed: ERR_NETWORK Network Error
[OfflineClient] Falling back to OFFLINE mode
```

When sync happens:

```javascript
Sync start
Item synced successfully
Sync complete
```

## Troubleshooting

### Issue: Still tries to connect when WiFi disabled

**Solution**:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check console for network status logs
- Wait 10 seconds for timeout to trigger

### Issue: Operations fail instead of going offline

**Check**:
1. IndexedDB is enabled in browser
2. Console shows no IndexedDB errors
3. DevTools → Application → IndexedDB → PanelDashboardDB exists
4. No browser extensions blocking IndexedDB

### Issue: Sync doesn't happen when WiFi restored

**Solution**:
- Wait 2-3 seconds (sync has small delay)
- Check NetworkStatusIndicator shows "Online"
- Click "Синхронизировать" button manually
- Check console for sync errors

## Expected Behavior Timeline

| Action | Time | Expected Result |
|--------|------|-----------------|
| Disable WiFi | 0s | NetworkStatusIndicator → "Offline" |
| Create task | +1s | Task appears in UI, saved to IndexedDB |
| Create more tasks | +5s | All tasks visible, sync queue grows |
| Enable WiFi | +30s | NetworkStatusIndicator → "Online" |
| Auto sync starts | +32s | SyncStatusBadge shows spinning icon |
| Sync completes | +35s | Toast notification, badge shows "Синхронизировано" |

## Debug Commands

Open browser console and run:

```javascript
// Check network status
networkService.getStatus()

// Check pending operations
db.syncQueue.toArray()

// Check local tasks
db.tasks.toArray()

// Check last sync time
db.getLastSyncTime()

// Force manual sync
syncService.forceSyncNow()

// Get unsynced stats
db.getUnsyncedStats()
```

## Performance Notes

- **Request timeout**: 10 seconds (fails fast when no network)
- **Periodic check**: Every 30 seconds (detects WiFi restoration)
- **Retry logic**: Exponential backoff (1s, 2s, 4s, 8s...)
- **Max retries**: 3 attempts before marking as failed

## Browser Compatibility

Tested and working on:
- Chrome/Edge (recommended)
- Firefox
- Safari

Note: `navigator.onLine` behavior varies by browser. Our implementation uses multiple detection methods.
