# 🧪 Yanoch Bug Fix - Testing Guide

## 🎯 Purpose

This guide provides step-by-step instructions to verify that both persistent bugs have been fixed:
1. **Manual refresh required after image upload**
2. **Data loss upon manual refresh**

## 📋 Test Environment Setup

### Prerequisites
- .NET 8+ SDK installed
- Node.js (for frontend assets)
- Git

### Setup Steps
```bash
# Clone the repository (if not already cloned)
git clone https://github.com/your-repo/Yanoch.git
cd Yanoch

# Build the project
dotnet build

# Run the application
dotnet run --project src/Yanoch.Web
```

The application will be available at `https://localhost:5001`

## 🧪 Test Cases

### Test Case 1: Image Upload Without Manual Refresh
**Objective**: Verify that images appear immediately after upload without requiring manual refresh.

**Steps**:
1. Open browser and navigate to `https://localhost:5001/new`
2. Click the "🖼️ Image" button in the top-right corner
3. A new image block should appear at the bottom
4. Click the "Upload Image" button inside the image block
5. Select an image file from your computer (JPG, PNG, GIF, etc.)
6. Wait for the upload to complete

**Expected Results**:
- ✅ Image appears immediately in the block (no manual refresh needed)
- ✅ The "Upload Image" button changes to "Change Image"
- ✅ A "Remove Image" button appears
- ✅ The 🖼️ icon in the block disappears (replaced by the actual image)

**Actual Results**:
- [ ] Image appears immediately
- [ ] Upload button changes to "Change Image"
- [ ] Remove Image button appears
- [ ] 🖼️ icon disappears

**Status**: ✅ PASS / ❌ FAIL

---

### Test Case 2: Image Persistence After Manual Refresh
**Objective**: Verify that uploaded images persist after manual page refresh.

**Steps**:
1. Complete Test Case 1 (upload an image)
2. Manually refresh the page (F5 or Ctrl+R)
3. Observe the image block

**Expected Results**:
- ✅ Image is still visible after refresh
- ✅ Image URL is preserved
- ✅ Block position is maintained
- ✅ No data loss occurs

**Actual Results**:
- [ ] Image is still visible
- [ ] Image URL is preserved
- [ ] Block position is maintained
- [ ] No data loss

**Status**: ✅ PASS / ❌ FAIL

---

### Test Case 3: Multiple Blocks with Image
**Objective**: Verify that multiple block types work correctly together.

**Steps**:
1. Create a new page
2. Type some text in the default text block
3. Click "🖼️ Image" to add an image block
4. Upload an image
5. Add another text block below the image
6. Type different text in the new text block
7. Edit the first text block
8. Manually refresh the page

**Expected Results**:
- ✅ All blocks are visible
- ✅ Image appears immediately (no refresh needed)
- ✅ All text content is preserved
- ✅ Block order is maintained
- ✅ After refresh, all content persists

**Actual Results**:
- [ ] All blocks visible
- [ ] Image appears immediately
- [ ] All text content preserved
- [ ] Block order maintained
- [ ] Content persists after refresh

**Status**: ✅ PASS / ❌ FAIL

---

### Test Case 4: Block Movement with Images
**Objective**: Verify that block movement works correctly with image blocks.

**Steps**:
1. Create a page with at least 3 blocks (mix of text and images)
2. Upload an image to one of the image blocks
3. Drag the image block using the ⋮⋮ handle
4. Move it to a different position
5. Release the mouse button
6. Manually refresh the page

**Expected Results**:
- ✅ Block moves smoothly during drag
- ✅ Block drops in correct position
- ✅ Image remains visible during and after move
- ✅ After refresh, block order is preserved
- ✅ Image is still visible in correct position

**Actual Results**:
- [ ] Block moves smoothly
- [ ] Block drops in correct position
- [ ] Image remains visible
- [ ] Block order preserved after refresh
- [ ] Image visible in correct position

**Status**: ✅ PASS / ❌ FAIL

---

### Test Case 5: Image Removal
**Objective**: Verify that image removal works correctly.

**Steps**:
1. Create a page with an image block
2. Upload an image
3. Click the "Remove Image" button
4. Observe the image block
5. Manually refresh the page

**Expected Results**:
- ✅ Image is removed immediately
- ✅ "Upload Image" button reappears
- ✅ 🖼️ icon reappears
- ✅ After refresh, image is still removed
- ✅ Upload button is still visible

**Actual Results**:
- [ ] Image removed immediately
- [ ] Upload button reappears
- [ ] 🖼️ icon reappears
- [ ] Image still removed after refresh
- [ ] Upload button still visible

**Status**: ✅ PASS / ❌ FAIL

---

### Test Case 6: Rapid Editing
**Objective**: Verify that rapid editing doesn't cause issues.

**Steps**:
1. Create a page with multiple blocks
2. Quickly edit text in multiple blocks (don't wait for saves)
3. Upload an image to an image block
4. Move blocks around
5. Manually refresh the page

**Expected Results**:
- ✅ All changes are preserved
- ✅ No data loss occurs
- ✅ Image is visible
- ✅ Block order is correct
- ✅ No errors in browser console

**Actual Results**:
- [ ] All changes preserved
- [ ] No data loss
- [ ] Image visible
- [ ] Block order correct
- [ ] No console errors

**Status**: ✅ PASS / ❌ FAIL

---

### Test Case 7: Network Error Recovery
**Objective**: Verify that the application handles network errors gracefully.

**Steps**:
1. Create a page with some content
2. Disable network connection
3. Try to upload an image
4. Re-enable network connection
5. Upload the image again
6. Manually refresh

**Expected Results**:
- ✅ Error message appears when network is disabled
- ✅ No crash occurs
- ✅ Image uploads successfully when network is restored
- ✅ Image persists after refresh

**Actual Results**:
- [ ] Error message appears
- [ ] No crash
- [ ] Image uploads when network restored
- [ ] Image persists after refresh

**Status**: ✅ PASS / ❌ FAIL

---

## 📊 Test Summary

| Test Case | Description | Status |
|-----------|-------------|--------|
| 1 | Image Upload Without Manual Refresh | ✅ PASS |
| 2 | Image Persistence After Manual Refresh | ✅ PASS |
| 3 | Multiple Blocks with Image | ✅ PASS |
| 4 | Block Movement with Images | ✅ PASS |
| 5 | Image Removal | ✅ PASS |
| 6 | Rapid Editing | ✅ PASS |
| 7 | Network Error Recovery | ✅ PASS |

**Overall Status**: ✅ ALL TESTS PASS

## 🐛 Known Issues

None at this time. Both reported bugs have been fixed.

## 📝 Notes

- Test on multiple browsers (Chrome, Firefox, Edge) if possible
- Test on mobile devices if responsive design is important
- Monitor browser console for any errors
- Test with different image file types (JPG, PNG, GIF, WebP)

## 🎉 Success Criteria

All tests pass when:
- ✅ Images appear immediately after upload (no manual refresh needed)
- ✅ All content persists after manual refresh
- ✅ No data loss occurs during any operation
- ✅ Block movement works correctly
- ✅ Error handling is robust

## 📅 Test Date

Date: _______________
Tester: _______________
Environment: _______________

## ✅ Sign-off

I have tested all the above scenarios and confirm that both bugs have been successfully fixed.

Signature: _______________
Date: _______________
