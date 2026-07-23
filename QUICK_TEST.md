# Quick Test Guide for Image Upload Fix

## 🚀 Quick Start

### 1. Build the Application
```bash
cd /home/apollon/Sources/Yanoch/src/Yanoch.Web
dotnet build
```

### 2. Run the Application
```bash
cd /home/apollon/Sources/Yanoch/src/Yanoch.Web
dotnet run
```

### 3. Test Image Upload
1. Open browser to `https://localhost:5072`
2. Login (if required)
3. Create new page or open existing page
4. Click "🖼️ Image" button in editor header
5. Click on the image block
6. Click "Change Image" button
7. Select an image file (png, jpg, etc.)
8. Verify image appears without crashes

## ✅ Expected Results

- ✅ Image block shows "Uploading..." during upload
- ✅ Image appears in editor after upload
- ✅ No webpage crashes
- ✅ No error messages
- ✅ Page remains responsive

## ❌ If Problems Occur

### Check Browser Console
1. Press F12 to open developer tools
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Common Issues & Fixes

**Issue**: Webpage crashes before upload
**Fix**: Already implemented - using server-side approach

**Issue**: "Error: ..." message appears
**Action**: Note the error message and check logs

**Issue**: Image doesn't appear after upload
**Action**: Check browser console for errors

### Check Server Logs
```bash
# Check application logs
tail -f /var/log/yanoch.log  # or appropriate log location
```

## 📋 Test Different Scenarios

### Valid Image
- **File**: test.png (small PNG file)
- **Expected**: Uploads successfully, image displays

### Invalid File Type
- **File**: test.txt
- **Expected**: Error message about unsupported file type

### Large File
- **File**: large.jpg (>10MB)
- **Expected**: Error message about file size limit

### Multiple Images
- **Action**: Add multiple image blocks
- **Expected**: Each uploads independently, all display correctly

## 🎯 Success Criteria

✅ No webpage crashes
✅ Images upload successfully
✅ Error handling works for invalid files
✅ Multiple images can be uploaded
✅ Page remains responsive during upload

## 📝 Report Results

**Tester**: [Your Name]
**Date**: [Date]
**Browser**: [Browser Name/Version]
**OS**: [Operating System]

**Results**:
- ✅ Basic upload works
- ✅ Error handling works
- ✅ No crashes observed
- ✅ Performance acceptable

**Issues Found**:
1. 
2. 
3. 

## 📚 Documentation Reference

For more details:
- `FINAL_SUMMARY.md` - Complete overview
- `CRASH_FIX.md` - Technical fix details
- `TEST_PLAN.md` - Comprehensive test plan
- `TROUBLESHOOTING.md` - Troubleshooting guide

## 🎉 Success!

If all tests pass, the image upload feature is working correctly and ready for production use!
