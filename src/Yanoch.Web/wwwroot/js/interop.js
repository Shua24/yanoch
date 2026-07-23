// File Upload Interop
function triggerFileUpload(element) {
    if (element && element.click) {
        element.click();
    } else {
        console.error('Could not trigger file upload: element not found or not clickable');
    }
}

// Block Drag and Drop Interop - Enhanced Version
function setupBlockDragAndDrop() {
    console.log('Setting up block drag and drop...');
    
    let draggedBlock = null;
    let dragStartY = 0;
    let originalIndex = -1;
    let blocksContainer = document.getElementById('blocks-container');
    
    if (!blocksContainer) {
        console.warn('Blocks container not found');
        return;
    }
    
    // Get all drag handles
    const dragHandles = document.querySelectorAll('.block-drag-handle');
    
    dragHandles.forEach((handle, index) => {
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            draggedBlock = handle.closest('.block-editor');
            if (draggedBlock) {
                dragStartY = e.clientY;
                originalIndex = index;
                
                // Store original positions
                const blocks = Array.from(blocksContainer.querySelectorAll('.block-editor'));
                blocks.forEach((block, idx) => {
                    block.setAttribute('data-original-index', idx);
                });
                
                draggedBlock.style.opacity = '0.7';
                draggedBlock.style.transition = 'transform 0.1s ease';
                draggedBlock.style.zIndex = '1000';
                draggedBlock.classList.add('dragging');
                
                console.log('Started dragging block:', draggedBlock.getAttribute('data-block-id'));
            }
        });
    });
    
    // Mouse move for visual feedback
    document.addEventListener('mousemove', function(e) {
        if (draggedBlock) {
            // Calculate vertical movement
            const movementY = e.clientY - dragStartY;
            
            // Apply transform for smooth movement
            draggedBlock.style.transform = `translateY(${movementY}px)`;
            
            // Find drop target based on mouse position
            const blocks = Array.from(blocksContainer.querySelectorAll('.block-editor:not(.dragging)'));
            let dropTarget = null;
            let dropPosition = 'after'; // 'before' or 'after'
            
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                const rect = block.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                
                if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    dropTarget = block;
                    dropPosition = e.clientY < midY ? 'before' : 'after';
                    break;
                }
            }
            
            // Visual feedback for drop target
            if (dropTarget) {
                dropTarget.style.borderTop = dropPosition === 'before' ? '2px dashed #4285f4' : 'none';
                dropTarget.style.borderBottom = dropPosition === 'after' ? '2px dashed #4285f4' : 'none';
            }
        }
    });
    
    // Mouse up to complete drag operation
    document.addEventListener('mouseup', function(e) {
        if (draggedBlock) {
            // Reset styles
            draggedBlock.style.opacity = '1';
            draggedBlock.style.transform = 'none';
            draggedBlock.style.zIndex = 'auto';
            draggedBlock.classList.remove('dragging');
            
            // Reset all drop target visual feedback
            document.querySelectorAll('.block-editor').forEach(block => {
                block.style.borderTop = 'none';
                block.style.borderBottom = 'none';
            });
            
            // Find final position
            const blocks = Array.from(blocksContainer.querySelectorAll('.block-editor'));
            const finalIndex = blocks.indexOf(draggedBlock);
            
            if (finalIndex !== -1 && finalIndex !== originalIndex) {
                console.log('Block moved from', originalIndex, 'to', finalIndex);
                
                // Trigger reordering
                const blockId = draggedBlock.getAttribute('data-block-id');
                if (blockId) {
                    window.triggerBlockReorder(blockId);
                }
            } else {
                console.log('Block returned to original position');
            }
            
            draggedBlock = null;
        }
    });
}

// Block Reorder Callback
// Enhanced block reorder with full position tracking
window.triggerBlockReorder = function(blockId) {
    if (typeof DotNet !== 'undefined') {
        try {
            // Get all blocks with their current DOM order
            const blocksContainer = document.getElementById('blocks-container');
            if (blocksContainer) {
                const blockElements = blocksContainer.querySelectorAll('.block-editor');
                const newOrder = [];
                
                blockElements.forEach((element, index) => {
                    const elementId = element.getAttribute('data-block-id');
                    if (elementId) {
                        newOrder.push({
                            blockId: elementId,
                            newSortOrder: index
                        });
                    }
                });
                
                console.log('Sending new block order to server:', newOrder);
                DotNet.invokeMethodAsync('Yanoch.Web', 'HandleCompleteBlockReorder', newOrder);
            }
        } catch (error) {
            console.error('Error calling block reorder:', error);
        }
    } else {
        console.log('Block reordered:', blockId);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        triggerFileUpload,
        setupBlockDragAndDrop
    };
}