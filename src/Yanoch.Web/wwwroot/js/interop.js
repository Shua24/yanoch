// Block Drag and Drop Interop
function setupBlockDragAndDrop(dotNetRef) {
    console.log('Setting up block drag and drop...');
    
    let draggedBlock = null;
    let dragStartY = 0;
    let dropTarget = null;
    let dropPosition = 'after';
    let blocksContainer = document.getElementById('blocks-container');
    
    if (!blocksContainer) {
        console.warn('Blocks container not found');
        return;
    }
    
    // Event delegation: mousedown on drag handles (works across re-renders)
    blocksContainer.addEventListener('mousedown', function(e) {
        const handle = e.target.closest('.block-drag-handle');
        if (!handle) return;
        e.preventDefault();
        
        draggedBlock = handle.closest('.block-editor');
        if (!draggedBlock) return;
        
        dragStartY = e.clientY;
        draggedBlock.classList.add('dragging');
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!draggedBlock) return;
        
        const dy = e.clientY - dragStartY;
        draggedBlock.style.transform = `translateY(${dy}px)`;
        
        // Find drop target based on mouse position
        const blocks = Array.from(blocksContainer.querySelectorAll('.block-editor:not(.dragging)'));
        dropTarget = null;
        
        for (const block of blocks) {
            const rect = block.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                dropTarget = block;
                dropPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
                break;
            }
        }
        
        // Visual feedback for drop target
        blocksContainer.querySelectorAll('.block-editor').forEach(b => {
            b.style.borderTop = '';
            b.style.borderBottom = '';
        });
        if (dropTarget) {
            dropTarget.style.borderTop = dropPosition === 'before' ? '2px dashed #4285f4' : '';
            dropTarget.style.borderBottom = dropPosition === 'after' ? '2px dashed #4285f4' : '';
        }
    });
    
    document.addEventListener('mouseup', async function() {
        if (!draggedBlock) return;
        
        // Reset styles
        draggedBlock.style.transform = '';
        draggedBlock.classList.remove('dragging');
        blocksContainer.querySelectorAll('.block-editor').forEach(b => {
            b.style.borderTop = '';
            b.style.borderBottom = '';
        });
        
        // Reorder DOM element to drop position
        if (dropTarget && draggedBlock !== dropTarget) {
            if (dropPosition === 'before') {
                dropTarget.parentNode.insertBefore(draggedBlock, dropTarget);
            } else {
                dropTarget.parentNode.insertBefore(draggedBlock, dropTarget.nextSibling);
            }
        }
        
        // Collect new order from DOM and persist via server
        if (dotNetRef) {
            const blockIds = Array.from(blocksContainer.querySelectorAll('.block-editor'))
                .map(el => el.getAttribute('data-block-id'));
            try {
                await dotNetRef.invokeMethodAsync('HandleBlockReorder', blockIds);
            } catch (error) {
                console.error('HandleBlockReorder failed:', error);
            }
        }
        
        draggedBlock = null;
        dropTarget = null;
    });
}

function focusBlockInput(blockId) {
    console.log('focusBlockInput called for:', blockId);
    var block = document.querySelector('[data-block-id="' + blockId + '"]');
    if (!block) { console.warn('Block not found:', blockId); return; }
    var input = block.querySelector('input, textarea');
    if (input) { input.focus(); console.log('Focused input for:', blockId); }
    else { console.warn('No input found in block:', blockId); }
}

function scrollElementIntoView(blockId) {
    var el = document.querySelector('[data-block-id="' + blockId + '"]');
    if (!el) return;
    var input = el.querySelector('input, textarea');
    if (input) {
        // Scroll the input into view if it's partially or fully below the viewport
        var rect = input.getBoundingClientRect();
        var viewBottom = window.innerHeight;
        if (rect.bottom > viewBottom || rect.top < 0) {
            input.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }
}

function watchBlockInputScroll(blockId) {
    var el = document.querySelector('[data-block-id="' + blockId + '"]');
    if (!el) return;
    var input = el.querySelector('textarea');
    if (!input) return;

    // Keep cursor visible while typing past the viewport
    var scrollToCursor = function() {
        var rect = input.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
            input.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    };
    input.addEventListener('input', scrollToCursor);
}
