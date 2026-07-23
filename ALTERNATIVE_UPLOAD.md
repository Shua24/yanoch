# Alternative Image Upload Implementation

## Problem
The current HttpClient-based upload approach may not work well with Blazor Server's authentication system, causing webpage crashes.

## Solution: Traditional Form Submission

Instead of using HttpClient directly, we can use a traditional form submission approach that works better with cookie-based authentication.

## Implementation Option 1: Hidden Form with JavaScript

### Updated ImageUpload.razor

```csharp
@using Microsoft.AspNetCore.Components.Forms
@using Microsoft.JSInterop
@inject IJSRuntime JSRuntime

<div class="image-upload-component">
    <form id="uploadForm" action="/api/upload" method="post" enctype="multipart/form-data" style="display:none;">
        <input type="file" name="file" id="fileInput" accept="image/*" @onchange="HandleFileSelected" />
    </form>
    
    <div class="drop-zone @(isDragging ? "drop-zone-active" : "")">
        <button type="button" @onclick="TriggerFileUpload" class="upload-trigger">@UploadText</button>
        
        @if (isDragging)
        {
            <div class="drop-zone-overlay">
                <span>📁 Drop images here</span>
            </div>
        }
        
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
    [Parameter] public string UploadText { get; set; } = "Upload Image";
    [Parameter] public EventCallback<string> OnUploadComplete { get; set; }
    
    private bool isUploading = false;
    private string errorMessage = "";
    private bool isDragging = false;
    private ElementReference fileInput;
    
    private async Task TriggerFileUpload()
    {
        try
        {
            await JSRuntime.InvokeVoidAsync("clickElement", "fileInput");
        }
        catch (Exception ex)
        {
            errorMessage = "Error: " + ex.Message;
        }
    }
    
    private async Task HandleFileSelected()
    {
        try
        {
            errorMessage = "";
            isUploading = true;
            
            // Submit the form
            await JSRuntime.InvokeVoidAsync("submitForm", "uploadForm");
            
            // This would need JavaScript to handle the response
            // and call back to Blazor
        }
        catch (Exception ex)
        {
            errorMessage = "Error: " + ex.Message;
        }
        finally
        {
            isUploading = false;
        }
    }
}
```

### JavaScript Interop

Add this to your `wwwroot/js/interop.js`:

```javascript
window.clickElement = function(elementId) {
    document.getElementById(elementId).click();
};

window.submitForm = function(formId) {
    return new Promise((resolve, reject) => {
        const form = document.getElementById(formId);
        
        // Handle form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    credentials: 'include' // Important for cookies
                });
                
                if (response.ok) {
                    const result = await response.json();
                    // Call back to Blazor with the result
                    DotNet.invokeMethodAsync('Yanoch.Web', 'HandleUploadResponse', result.url);
                    resolve();
                } else {
                    reject('Upload failed');
                }
            } catch (error) {
                reject(error.message);
            }
        });
        
        form.submit();
    });
};

window.handleUploadResponse = function(url) {
    // This would be called from Blazor
    console.log('Upload successful:', url);
};
```

## Implementation Option 2: Direct Fetch API Call

### Updated ImageUpload.razor

```csharp
@using Microsoft.AspNetCore.Components.Forms
@using Microsoft.JSInterop
@inject IJSRuntime JSRuntime

<div class="image-upload-component">
    <InputFile OnChange="HandleFileSelected" accept="image/*" class="file-input">
        <span class="upload-trigger">@UploadText</span>
    </InputFile>
    
    @if (isUploading)
    {
        <div class="upload-progress">Uploading...</div>
    }
    
    @if (!string.IsNullOrEmpty(errorMessage))
    {
        <div class="upload-error">@errorMessage</div>
    }
</div>

@code {
    [Parameter] public string UploadText { get; set; } = "Upload Image";
    [Parameter] public EventCallback<string> OnUploadComplete { get; set; }
    
    private bool isUploading = false;
    private string errorMessage = "";
    
    private async Task HandleFileSelected(InputFileChangeEventArgs e)
    {
        try
        {
            errorMessage = "";
            isUploading = true;
            
            var file = e.File;
            if (file == null)
            {
                errorMessage = "No file selected";
                return;
            }
            
            // Use JavaScript interop to handle the upload
            using (var stream = file.OpenReadStream())
            {
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    
                    // Call JavaScript function to handle upload
                    var result = await JSRuntime.InvokeAsync<string>(
                        "uploadFile", 
                        file.Name, 
                        Convert.ToBase64String(fileBytes)
                    );
                    
                    if (!string.IsNullOrEmpty(result))
                    {
                        await OnUploadComplete.InvokeAsync(result);
                    }
                }
            }
            
        }
        catch (Exception ex)
        {
            errorMessage = "Error: " + ex.Message;
        }
        finally
        {
            isUploading = false;
        }
    }
}
```

### JavaScript Function

```javascript
window.uploadFile = async function(fileName, fileBase64) {
    try {
        // Convert base64 to blob
        const byteCharacters = atob(fileBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        
        // Create form data
        const formData = new FormData();
        formData.append('file', blob, fileName);
        
        // Make fetch request
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Important for cookies
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};
```

## Implementation Option 3: Server-Side Upload

If JavaScript interop is problematic, consider handling the upload server-side:

### Create an Upload Service

```csharp
public interface IUploadService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName);
}

public class UploadService : IUploadService
{
    private readonly IFileStorageService _fileStorage;
    
    public UploadService(IFileStorageService fileStorage)
    {
        _fileStorage = fileStorage;
    }
    
    public async Task<string> UploadImageAsync(Stream fileStream, string fileName)
    {
        return await _fileStorage.SaveAsync(fileStream, fileName);
    }
}
```

### Register the Service

```csharp
builder.Services.AddScoped<IUploadService, UploadService>();
```

### Update ImageUpload.razor

```csharp
@inject IUploadService UploadService

private async Task HandleFileSelected(InputFileChangeEventArgs e)
{
    try
    {
        errorMessage = "";
        isUploading = true;
        
        var file = e.File;
        if (file == null)
        {
            errorMessage = "No file selected";
            return;
        }
        
        // Validate file
        if (file.Size > 10 * 1024 * 1024)
        {
            errorMessage = "File size exceeds 10MB limit";
            return;
        }
        
        var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg" };
        var extension = Path.GetExtension(file.Name).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            errorMessage = "Unsupported file type";
            return;
        }
        
        // Upload using service
        using (var stream = file.OpenReadStream())
        {
            var url = await UploadService.UploadImageAsync(stream, file.Name);
            await OnUploadComplete.InvokeAsync(url);
        }
        
    }
    catch (Exception ex)
    {
        errorMessage = "Error: " + ex.Message;
    }
    finally
    {
        isUploading = false;
    }
}
```

## Recommendation

**Option 3 (Server-Side Upload)** is recommended because:
1. No JavaScript interop issues
2. Works seamlessly with Blazor Server authentication
3. No CORS issues
4. Better error handling
5. More maintainable

The server-side approach avoids the complexities of client-side file handling and authentication in Blazor Server applications.
