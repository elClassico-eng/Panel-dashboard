# Quick Start: Testing Offline Mode

## 🚀 Setup (One-time)

1. **Restart both servers:**

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

2. **Verify both running:**
- Server: http://localhost:3001
- Client: http://localhost:5174

## ✅ Quick Test (2 minutes)

### Step 1: Load data online
1. Open http://localhost:5174
2. Login/Register
3. Create 1-2 test tasks
4. Verify tasks appear

### Step 2: Go offline
1. **Disable WiFi** OR DevTools → Network → Offline
2. Check indicators:
   - ❌ **NetworkStatusIndicator**: "Offline"
   - 🔄 **SyncStatusBadge**: shows counts

### Step 3: Work offline
1. Create new task → appears immediately
2. Edit existing task → changes save locally
3. Delete task → removes from UI
4. **Open Console** (F12):
```
[OfflineClient] Network status: OFFLINE
[OfflineClient] Using OFFLINE mode directly
```

### Step 4: Go back online
1. **Enable WiFi** OR DevTools → Network → No throttling
2. Watch auto-sync (2-3 seconds):
   - ✅ NetworkStatusIndicator: "Online"
   - ⏳ SyncStatusBadge: spinning icon → "Синхронизировано"
   - 🎉 Toast: "Синхронизация завершена"

### Step 5: Verify sync
1. Refresh page (F5)
2. All offline changes should persist
3. Check DevTools → Application → IndexedDB → PanelDashboardDB

## 🔍 Console Logs to Expect

### When offline:
```
[OfflineClient] Network status: OFFLINE
[OfflineClient] Using OFFLINE mode directly
```

### When syncing:
```
SYNC_START event
Syncing item: CREATE task/abc123
SYNC_COMPLETE event
```

### If issues:
```
[OfflineClient] Request failed: ERR_NETWORK
[OfflineClient] Falling back to OFFLINE mode
```

## ⚙️ What Changed

1. **Timeout added**: 10 seconds max wait
2. **Better error detection**: catches all network errors
3. **Debug logging**: see what's happening in console
4. **Fixed API URL**: uses port 3001
5. **Fixed CORS**: allows port 5174

## 🐛 If Something Doesn't Work

1. **Hard refresh**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Clear cache**: DevTools → Application → Clear storage
3. **Check console**: Look for red errors
4. **Restart servers**: Kill and restart both
5. **Check ports**: Server on 3001, Client on 5174

## 📊 Visual Indicators

| Indicator | Online | Offline | Syncing |
|-----------|--------|---------|---------|
| NetworkStatusIndicator | 🟢 Online | 🟠 Offline | 🟢 Online |
| SyncStatusBadge | ✅ Синхронизировано | 🕐 N изм. | 🔄 (spinning) |

## 🎯 Success Criteria

- ✅ Can create tasks offline
- ✅ Can edit tasks offline
- ✅ Can delete tasks offline
- ✅ Indicators show correct status
- ✅ Auto-sync when back online
- ✅ Manual sync button works
- ✅ No console errors
- ✅ Data persists after refresh
