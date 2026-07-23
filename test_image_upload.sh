#!/bin/bash

# Test image upload functionality
# This script tests the image upload endpoint

# Create a test image file
convert -size 100x100 xc:red /tmp/test_image.png

# Test the upload endpoint (assuming the server is running on localhost:5072)
echo "Testing image upload endpoint..."
curl -X POST -F "file=@/tmp/test_image.png" http://localhost:5072/api/upload

# Clean up
rm /tmp/test_image.png

echo "Test completed."
