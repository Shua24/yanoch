# Step-by-Step Image Upload Guide

## 📸 How to Upload Images in Yanoch

### Step 1: Run the Application
```bash
cd /home/apollon/Sources/Yanoch/src/Yanoch.Web
dotnet run
```

### Step 2: Open Your Browser
Navigate to: `https://localhost:5072`

### Step 3: Login or Register
- If you don't have an account, register first
- If you have an account, login

### Step 4: Create a New Page
- Click "New Page" button
- Or open an existing page where you want to add images

### Step 5: Add an Image Block
**Method 1: Using the Image Button**
1. Click the **"🖼️ Image"** button in the editor header
2. A new image block will appear on your page

**Method 2: Using the Add Block Placeholder**
1. Scroll to the bottom of your page
2. Click the **"+ Click to add block"** placeholder
3. A text block will be created
4. Click the block type dropdown (if available) and select "Image"
5. Or delete the text block and use Method 1

### Step 6: Upload Your Image
**The image block should now show:**
- "Click to upload image" placeholder text
- This area is clickable!

**Click anywhere on the image block to enter edit mode**
- The block should now show:
  - "Upload Image" button (for new blocks)
  - Or "Change Image" button (if an image was previously uploaded)

**Click the "Upload Image" button**
- A file picker dialog will appear
- Select your image file (png, jpg, jpeg, gif, webp, or svg)
- Click "Open"

### Step 7: Verify Upload
- You should see "Uploading..." message briefly
- Your image should appear in the editor
- The block should now show your image

### Step 8: Manage Your Image
**To change the image:**
1. Click on the image block
2. Click "Change Image" button
3. Select a different image file

**To remove the image:**
1. Click on the image block
2. Click "Remove Image" button
3. The image will be removed, showing "Click to upload image" again

## 🔍 What to Look For

### ✅ Working Correctly
- Image block shows "Click to upload image" when empty
- Clicking the block enters edit mode
- "Upload Image" button appears in edit mode
- File picker opens when clicking "Upload Image"
- Image appears after upload
- "Remove Image" button only shows after upload

### ❌ Problems to Watch For
- **Block not clickable**: The "Click to upload image" area should be clickable
- **No upload button**: Should show "Upload Image" button in edit mode
- **Remove button shows too early**: Should only show after image is uploaded
- **Upload fails**: Check browser console for errors
- **Page crashes**: Should not happen with the fixed implementation

## 🐛 Troubleshooting

### Problem: Block shows "Remove Image" but no image
**Solution**: This was the bug that's now fixed! The block should now show "Upload Image" instead.

### Problem: Clicking the block doesn't do anything
**Solution**:
1. Check that you're clicking on the content area, not the drag handle
2. Try clicking the "Click to upload image" text specifically
3. Check browser console for JavaScript errors

### Problem: Upload button doesn't open file picker
**Solution**:
1. Make sure you're in edit mode (block should be highlighted)
2. Try refreshing the page
3. Check that no browser extensions are blocking file pickers

### Problem: Image uploads but doesn't display
**Solution**:
1. Check browser console for errors
2. Verify the image file is valid
3. Try a different image file

## 📋 Quick Checklist

- [ ] Application runs without errors
- [ ] Can login successfully
- [ ] Can create new page
- [ ] "🖼️ Image" button works
- [ ] Image block appears with "Click to upload image"
- [ ] Clicking block enters edit mode
- [ ] "Upload Image" button appears
- [ ] File picker opens when clicking button
- [ ] Image uploads successfully
- [ ] Image displays in editor
- [ ] Can remove image
- [ ] Can change image

## 🎥 Visual Guide

### What You Should See:

1. **Empty Image Block**:
   ```
   [ 🖼️ Image Block ]
   Click to upload image
   ```

2. **After Clicking Block (Edit Mode)**:
   ```
   [ 🖼️ Image Block - EDITING ]
   [ Upload Image button ]
   ```

3. **After Upload**:
   ```
   [ 🖼️ Image Block ]
   [ Your uploaded image ]
   ```

4. **After Clicking Uploaded Image (Edit Mode)**:
   ```
   [ 🖼️ Image Block - EDITING ]
   [ Your uploaded image ]
   [ Change Image button ] [ Remove Image button ]
   ```

## 💡 Tips

1. **Start with small images** (under 1MB) for faster testing
2. **Use common formats** (PNG or JPG work best)
3. **Check browser console** (F12) if anything doesn't work
4. **Refresh the page** if something seems stuck
5. **Try different browsers** if you encounter issues

## 📚 Related Documentation

- `QUICK_TEST.md` - Quick testing guide
- `CRASH_FIX.md` - Technical details about the fix
- `TROUBLESHOOTING.md` - General troubleshooting
- `TEST_PLAN.md` - Comprehensive test plan

## 🎉 Success!

When everything works, you should be able to:
- Add multiple image blocks
- Upload different image types
- Remove and change images
- Mix images with other block types
- Save pages with images
- All without any crashes!
