# Image Upload Crash Troubleshooting

## 🚨 Current Issue
The image upload crashes when clicking on the image block or the upload button.

## 🔍 Root Cause Analysis

### Potential Causes
1. **Blazor InputFile Component Issues**
   - `InputFile` has known limitations in Blazor Server
   - May require specific JavaScript interop
   - Can conflict with parent click handlers

2. **Edit Mode State Management**
   - Block may not be properly entering/exiting edit mode
   - State variables might not be updating correctly
   - Event handlers could be conflicting

3. **Click Event Propagation**
   - Parent `@onclick` and child `@onclick` conflicting
   - Event bubbling causing multiple handlers to fire
   - StopPropagation not working as expected

4. **File Upload Lifecycle**
   - File selection not properly handled
   - Stream disposal issues
   - Memory management problems

## 🛠️ Troubleshooting Steps

### Step 1: Check Browser Console
1. Open developer tools (F12)
2. Go to Console tab
3. Click on image block
4. Look for error messages

**Common Errors**:
- `InputFile requires a multipart/form-data form`
- `Cannot read property 'click' of null`
- `Object reference not set to instance`

### Step 2: Verify Block State
1. Add debug logging to `StartEdit` method
2. Check if `isEditing` is being set correctly
3. Verify block content state

### Step 3: Test InputFile Directly
1. Create a simple test page with just `InputFile`
2. Verify it works outside of block editor
3. Gradually add complexity

### Step 4: Check Event Propagation
1. Add `@onclick:stopPropagation` to image upload area
2. Test if this prevents the crash
3. Verify edit mode still works

## 🔧 Potential Solutions

### Solution 1: Simplify InputFile Usage
```csharp
<InputFile OnChange="HandleFileSelected" accept="image/*">
    <button class="upload-button">@UploadText</button>
</InputFile>
```

### Solution 2: Separate Edit Mode
```csharp
@if (isEditing)
{
    <ImageUploadArea />
}
else
{
    <ImageDisplayArea />
}
```

### Solution 3: JavaScript Interop
```csharp
@inject IJSRuntime JSRuntime

private async Task TriggerFileUpload()
{
    await JSRuntime.InvokeVoidAsync("triggerFileUpload");
}
```

### Solution 4: Direct File Access
```csharp
<input type="file" @ref="fileInput" style="display:none" 
       accept="image/*" @onchange="HandleFileSelected" />
<button @onclick="() => fileInput.click()">@UploadText</button>

@code {
    private ElementReference fileInput;
}
```

## 💡 Recommended Fix

### Modified ImageUpload.razor
```csharp
@using Microsoft.AspNetCore.Components.Forms
@using Microsoft.JSInterop
@inject IJSRuntime JSRuntime

<div class="image-upload-component">
    <input type="file" @ref="fileInput" style="display:none" 
           accept="image/*" @onchange="HandleFileSelected" />
    
    <div class="drop-zone">
        <button class="upload-button" @onclick="TriggerFileUpload">
            @UploadText
        </button>
        
        @if (isUploading)
        {
            <div class="upload-progress">Uploading...</div>
        }
        
        @if (!string.IsNullOrEmpty(errorMessage))
        {
            <div class="upload-error">@errorMessage</div>
        }
    </div>
</div>

@code {
    private ElementReference fileInput;
    
    private async Task TriggerFileUpload()
    {
        try
        {
            await fileInput.FocusAsync();
            // Note: Actual click requires JS interop
            await JSRuntime.InvokeVoidAsync("clickElement", fileInput);
        }
        catch (Exception ex)
        {
            errorMessage = "Error: " + ex.Message;
        }
    }
    
    private async Task HandleFileSelected(ChangeEventArgs e)
    {
        // Handle file selection
    }
}
```

### Required JavaScript
```javascript
window.clickElement = function(element) {
    element.click();
};
```

## 🧪 Testing the Fix

### Test 1: Basic Functionality
1. Click upload button
2. Verify file picker opens
3. Select image file
4. Verify upload completes

### Test 2: Error Handling
1. Try invalid file type
2. Verify error message
3. Try oversized file
4. Verify error message

### Test 3: State Management
1. Upload image
2. Verify block exits edit mode
3. Click image again
4. Verify edit mode re-enters

## 📋 Implementation Checklist

- [ ] Replace InputFile with native file input
- [ ] Add JavaScript interop for click triggering
- [ ] Test file selection
- [ ] Test upload process
- [ ] Test error handling
- [ ] Test state management
- [ ] Verify no crashes

## 🎯 Success Criteria

✅ File picker opens when clicking upload button
✅ Image uploads successfully
✅ No crashes or errors
✅ Edit mode works correctly
✅ Error handling functional

## 📚 References

- Blazor InputFile documentation
- JavaScript interop guide
- File upload best practices
- Error handling patterns

## 🆘 Need More Help?

If the crash persists after trying these solutions:
1. Check browser console for specific errors
2. Test in different browsers
3. Verify .NET SDK version
4. Check for conflicting packages
5. Review Blazor Server limitations
