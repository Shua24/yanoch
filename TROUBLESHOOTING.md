# Image Upload Troubleshooting Guide

## Issue: Webpage Crashes Before Upload

If the webpage crashes when trying to upload an image, here are the potential causes and solutions:

## Potential Causes

### 1. HttpClient Configuration Issue
Blazor Server has specific requirements for HttpClient configuration when making authenticated requests.

### 2. Authentication Token Missing
The API endpoint requires authentication, but the HttpClient request may not include the proper cookies.

### 3. CORS or Same-Origin Policy
If the frontend and backend are on different domains, CORS issues can cause crashes.

### 4. JavaScript Interop Issues
Blazor's file upload handling relies on JavaScript interop which can fail in certain configurations.

## Solutions to Try

### Solution 1: Use Relative URLs
Ensure the HttpClient uses relative URLs instead of absolute URLs:

```csharp
// Use relative URL
var response = await Http.PostAsync("api/upload", content);
```

### Solution 2: Configure HttpClient Properly
In `Program.cs`, configure HttpClient with proper base address:

```csharp
builder.Services.AddScoped(sp => {
    var httpClient = new HttpClient {
        BaseAddress = new Uri(builder.Configuration["BaseUrl"] ?? "https://localhost:5072")
    };
    return httpClient;
});
```

### Solution 3: Alternative Upload Approach
Instead of using HttpClient directly, use a traditional form submission approach:

```html
<form action="/api/upload" method="post" enctype="multipart/form-data" target="_blank">
    <input type="file" name="file" accept="image/*" />
    <button type="submit">Upload</button>
</form>
```

### Solution 4: Check Browser Console
Open browser developer tools (F12) and check the console for specific error messages:
- Network errors
- CORS errors
- JavaScript errors
- Authentication errors

### Solution 5: Verify API Endpoint
Test the API endpoint directly using curl or Postman:

```bash
curl -X POST -F "file=@test.png" http://localhost:5072/api/upload
```

## Debugging Steps

### 1. Check Browser Console
- Open developer tools (F12)
- Go to Console tab
- Look for error messages when uploading

### 2. Check Network Requests
- Go to Network tab
- Filter for "upload" requests
- Check request and response headers
- Verify authentication cookies are sent

### 3. Test API Directly
- Use Postman or curl to test the API endpoint
- Verify the endpoint works independently

### 4. Check Server Logs
- Look for exception messages in server logs
- Check for authentication failures
- Look for file validation errors

## Common Error Messages

### "Failed to fetch"
- Usually indicates CORS issue or network problem
- Check if frontend and backend are on same domain
- Verify CORS configuration in Program.cs

### "401 Unauthorized"
- Authentication token missing or invalid
- Check if user is logged in
- Verify authentication cookies are sent

### "400 Bad Request"
- File validation failed
- Check file size and type
- Verify file is not null

### "500 Internal Server Error"
- Server-side exception
- Check server logs for details
- Verify file storage permissions

## Current Implementation Status

The image upload component has been updated to:
- Use relative URLs for API calls
- Include proper error handling
- Validate file types and sizes
- Show upload progress and error states

## Next Steps

If the issue persists:
1. Check browser console for specific errors
2. Test API endpoint directly with curl/Postman
3. Verify authentication is working
4. Check server logs for exceptions
5. Try alternative upload approaches

## Contact

If you need further assistance, please provide:
- Browser console error messages
- Server log entries
- Steps to reproduce the issue
- Any recent changes to the codebase
