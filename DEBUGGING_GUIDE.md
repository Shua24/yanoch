# Debugging Guide - Auto-Refresh & Text Loss Issues

## 🔍 Current Issues

### Issue 1: Manual Refresh Still Needed
**Symptoms**: Page doesn't auto-refresh after image upload
**Expected**: Image should appear immediately after upload
**Actual**: Requires manual page refresh

### Issue 2: Text Disappearing After Refresh
**Symptoms**: Text content around images vanishes after manual refresh
**Expected**: All content should be preserved
**Actual**: Text blocks disappear or become empty

## 🕵️‍♂️ Root Cause Analysis

### Possible Causes

#### 1. State Management Issue
- Page state not properly updated after upload
- Block IDs not preserved during update
- StateHasChanged() not working as expected

#### 2. Database Update Problem
- Blocks not saved correctly to database
- Update operation failing silently
- Incorrect block data being stored

#### 3. Rendering Issue
- Component not re-rendering properly
- Block content not binding correctly
- CSS hiding content unexpectedly

#### 4. Race Condition
- Async operations not completing in order
- State updated before API call completes
- Multiple updates conflicting

## 🔧 Debugging Steps

### Step 1: Check Browser Console
1. Open developer tools (F12)
2. Go to Console tab
3. Perform image upload
4. Look for errors or warnings

**Common issues to check**:
- Network errors (404, 500, etc.)
- JavaScript errors
- Failed API calls
- CORS issues

### Step 2: Verify API Response
1. Go to Network tab
2. Filter for "pages" or "blocks"
3. Perform image upload
4. Check request/response

**Verify**:
- Request payload is correct
- Response contains updated page
- No errors in response

### Step 3: Check Server Logs
```bash
# Check application logs
tail -f /var/log/yanoch.log  # Adjust path as needed
```

**Look for**:
- Exception messages
- Database errors
- API call failures

### Step 4: Add Debug Logging
Add temporary logging to key methods:

```csharp
private async Task HandleBlockUpdate(BlockDto block)
{
    Console.WriteLine($