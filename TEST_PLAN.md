# Image Upload Test Plan

## Overview
This test plan verifies that the image upload functionality works correctly after the crash fix implementation.

## Test Environment Setup

### Prerequisites
- .NET 10.0 SDK installed
- Node.js (for frontend assets)
- Browser (Chrome, Firefox, or Edge)

### Setup Steps
1. Navigate to project directory:
   ```bash
   cd /home/apollon/Sources/Yanoch/src/Yanoch.Web
   ```

2. Build the application:
   ```bash
   dotnet build
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

4. Open browser to: `https://localhost:5072`

## Test Cases

### Test Case 1: Basic Image Upload
**Description**: Verify that a valid image can be uploaded successfully

**Steps**:
1. Login to the application (if required)
2. Create a new page or open an existing page
3. Click the "🖼️ Image" button in the editor header
4. Click on the newly created image block
5. Click "Change Image" button
6. Select a valid image file (png, jpg, etc.)
7. Wait for upload to complete

**Expected Result**:
- ✅ Image block shows "Uploading..." during upload
- ✅ Image appears in the editor after upload
- ✅ No errors or crashes occur
- ✅ Page remains responsive

**Pass/Fail**: ______

### Test Case 2: Invalid File Type
**Description**: Verify that invalid file types are rejected

**Steps**:
1. Follow steps 1-5 from Test Case 1
2. Select a non-image file (e.g., .txt, .pdf)
3. Attempt to upload

**Expected Result**:
- ✅ Error message: "Unsupported file type. Allowed: png, jpg, jpeg, gif, webp, svg"
- ✅ No upload occurs
- ✅ No crashes

**Pass/Fail**: ______

### Test Case 3: Oversized File
**Description**: Verify that files exceeding 10MB are rejected

**Steps**:
1. Follow steps 1-5 from Test Case 1
2. Select a file larger than 10MB
3. Attempt to upload

**Expected Result**:
- ✅ Error message: "File size exceeds 10MB limit"
- ✅ No upload occurs
- ✅ No crashes

**Pass/Fail**: ______

### Test Case 4: Cancel Upload
**Description**: Verify that canceling file selection works

**Steps**:
1. Follow steps 1-5 from Test Case 1
2. Click "Cancel" in the file picker dialog

**Expected Result**:
- ✅ No upload occurs
- ✅ No error messages
- ✅ Image block remains in edit mode

**Pass/Fail**: ______

### Test Case 5: Remove Image
**Description**: Verify that images can be removed

**Steps**:
1. Complete Test Case 1 to upload an image
2. Click on the image block to enter edit mode
3. Click "Remove Image" button

**Expected Result**:
- ✅ Image is removed from block
- ✅ Block shows "Click to upload image" placeholder
- ✅ No errors

**Pass/Fail**: ______

### Test Case 6: Multiple Image Blocks
**Description**: Verify that multiple image blocks can be added

**Steps**:
1. Add first image block and upload an image
2. Click "+" button below the image block
3. Add another image block
4. Upload a different image to the second block

**Expected Result**:
- ✅ Both images upload successfully
- ✅ Both images display correctly
- ✅ Each block can be edited independently

**Pass/Fail**: ______

### Test Case 7: Image Block Reordering
**Description**: Verify that image blocks can be reordered

**Steps**:
1. Add two image blocks with different images
2. Use drag handles to reorder the blocks
3. Save the page
4. Refresh the page

**Expected Result**:
- ✅ Blocks maintain their new order
- ✅ Images display correctly after refresh

**Pass/Fail**: ______

### Test Case 8: Page Save with Images
**Description**: Verify that pages with images save correctly

**Steps**:
1. Create a new page
2. Add an image block and upload an image
3. Add some text blocks
4. Save the page
5. Refresh the browser
6. Reopen the page

**Expected Result**:
- ✅ Page loads successfully
- ✅ Image displays correctly
- ✅ All content is preserved

**Pass/Fail**: ______

### Test Case 9: Different Image Formats
**Description**: Verify that all supported image formats work

**Steps**:
1. Test each supported format: png, jpg, jpeg, gif, webp, svg
2. Upload one image of each format to separate blocks

**Expected Result**:
- ✅ All formats upload successfully
- ✅ All formats display correctly
- ✅ No format-specific errors

**Pass/Fail**: ______

### Test Case 10: Concurrent Uploads
**Description**: Verify that multiple uploads can happen concurrently

**Steps**:
1. Add three image blocks
2. Quickly click "Change Image" on all three
3. Select different files for each

**Expected Result**:
- ✅ All uploads complete successfully
- ✅ No conflicts or errors
- ✅ All images display correctly

**Pass/Fail**: ______

## Regression Tests

### Test Case 11: Existing Functionality
**Description**: Verify that existing features still work

**Steps**:
1. Create text blocks
2. Create heading blocks
3. Create todo blocks
4. Create list blocks
5. Save the page

**Expected Result**:
- ✅ All existing block types work
- ✅ No regression in existing functionality

**Pass/Fail**: ______

### Test Case 12: Authentication
**Description**: Verify that authentication still works

**Steps**:
1. Logout
2. Try to access editor
3. Login again
4. Access editor

**Expected Result**:
- ✅ Unauthenticated users redirected to login
- ✅ Authenticated users can access editor

**Pass/Fail**: ______

## Performance Tests

### Test Case 13: Upload Speed
**Description**: Measure upload speed for different file sizes

**Steps**:
1. Test with 100KB image
2. Test with 1MB image
3. Test with 5MB image
4. Measure time from selection to display

**Expected Result**:
- ✅ Small files upload quickly (< 1 second)
- ✅ Large files show progress indication
- ✅ No timeouts or errors

**Pass/Fail**: ______

## Browser Compatibility

### Test Case 14: Different Browsers
**Description**: Verify compatibility across browsers

**Steps**:
1. Test in Chrome
2. Test in Firefox
3. Test in Edge
4. Test in Safari (if available)

**Expected Result**:
- ✅ Works in all major browsers
- ✅ Consistent behavior across browsers

**Pass/Fail**: ______

## Mobile Testing

### Test Case 15: Mobile Devices
**Description**: Verify mobile compatibility

**Steps**:
1. Access application on mobile device
2. Try to upload image from mobile
3. Verify display on mobile screen

**Expected Result**:
- ✅ Mobile upload works
- ✅ Images display correctly on mobile
- ✅ Touch interface works properly

**Pass/Fail**: ______

## Error Recovery

### Test Case 16: Network Interruption
**Description**: Verify behavior when network is interrupted

**Steps**:
1. Start an upload
2. Disable network during upload
3. Re-enable network

**Expected Result**:
- ✅ Error message displayed
- ✅ Can retry upload
- ✅ No corrupted state

**Pass/Fail**: ______

## Test Results Summary

| Test Case | Description | Pass/Fail | Notes |
|-----------|-------------|-----------|-------|
| 1 | Basic Image Upload | | |
| 2 | Invalid File Type | | |
| 3 | Oversized File | | |
| 4 | Cancel Upload | | |
| 5 | Remove Image | | |
| 6 | Multiple Image Blocks | | |
| 7 | Image Block Reordering | | |
| 8 | Page Save with Images | | |
| 9 | Different Image Formats | | |
| 10 | Concurrent Uploads | | |
| 11 | Existing Functionality | | |
| 12 | Authentication | | |
| 13 | Upload Speed | | |
| 14 | Different Browsers | | |
| 15 | Mobile Devices | | |
| 16 | Network Interruption | | |

## Overall Assessment

**Pass Rate**: ____/16 tests passed

**Quality Level**: 
- ✅ Excellent (15-16 tests passed)
- ✅ Good (12-14 tests passed)
- ⚠️ Needs Work (8-11 tests passed)
- ❌ Failed (< 8 tests passed)

## Known Issues

List any issues discovered during testing:
1. 
2. 
3. 

## Recommendations

1. 
2. 
3. 

## Sign-off

**Tester**: ___________________
**Date**: ___________________
**Version**: 1.0

## Notes

- Test on production-like environment for best results
- Include real user testing if possible
- Monitor performance in production
- Collect user feedback on the feature
