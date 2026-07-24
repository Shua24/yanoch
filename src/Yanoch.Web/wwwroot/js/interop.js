// ---------------------------------------------------------------
// Block DnD, Context Menu, Slash Command — shared IIFE
// ---------------------------------------------------------------
(function() {
    var dotNetRef = null;
    var imageRef = null;
    var blocksContainer = null;

    // --- Drag state ---
    var drag = { el: null, startY: 0, target: null, position: 'after' };

    // --- Handle click tracker ---
    var handlePending = null; // { el, blockId, startX, startY }

    // --- Context menu ---
    var ctxMenu = null; // { el, blockId }
    var turnIntoMenu = null; // { el, blockId }

    // --- Slash menu ---
    var slash = { el: null, blockId: null, filter: '', items: [], idx: 0 };
    var slashMenuEl = null;

    var SLASH_ITEMS = [
        { type: 'text', label: 'Text', icon: 'Aa' },
        { type: 'heading1', label: 'Heading 1', icon: 'H1' },
        { type: 'heading2', label: 'Heading 2', icon: 'H2' },
        { type: 'heading3', label: 'Heading 3', icon: 'H3' },
        { type: 'todo', label: 'To-do', icon: '☐' },
        { type: 'bulletList', label: 'Bullet list', icon: '•' },
        { type: 'numberedList', label: 'Numbered list', icon: '1.' },
        { type: 'toggle', label: 'Toggle', icon: '▶' },
        { type: 'quote', label: 'Quote', icon: '"' },
        { type: 'code', label: 'Code', icon: '</>' },
        { type: 'callout', label: 'Callout', icon: '💡' },
        { type: 'divider', label: 'Divider', icon: '—' },
        { type: 'image', label: 'Image', icon: '🖼️' },
    ];

    // ====================== DRAG HANDLE + CLICK vs DRAG ======================

    document.addEventListener('mousedown', function(e) {
        var handle = e.target.closest('.block-drag-handle');
        // Image block: allow drag from container area (not on img itself)
        var imgArea = e.target.closest('.image-block-container');
        if (imgArea && !handle && !e.target.closest('.image-block') && !e.target.closest('.image-drag-edge')) {
            handle = imgArea;
        }
        if (!handle) return;
        e.preventDefault();
        var blockEl = handle.closest('.block-editor');
        if (!blockEl) return;
        handlePending = {
            el: blockEl,
            blockId: blockEl.getAttribute('data-block-id'),
            startY: e.clientY,
            startX: e.clientX
        };
    });

    document.addEventListener('mousemove', function(e) {
        if (handlePending) {
            var dy = e.clientY - handlePending.startY;
            var dx = e.clientX - handlePending.startX;
            if (Math.abs(dy) > 5 || Math.abs(dx) > 5) {
                // Convert click to drag
                drag.el = handlePending.el;
                drag.startY = e.clientY;
                drag.el.classList.add('dragging');
                handlePending = null;
            }
            return;
        }
        updateBlockDrag(e.clientY);
    });

    function updateBlockDrag(clientY) {
        if (!drag.el || !blocksContainer) return;
        var dy2 = clientY - drag.startY;
        drag.el.style.transform = 'translateY(' + dy2 + 'px)';
        var all = blocksContainer.querySelectorAll('.block-editor:not(.dragging)');
        drag.target = null;
        for (var i = 0; i < all.length; i++) {
            var r = all[i].getBoundingClientRect();
            if (clientY >= r.top && clientY <= r.bottom) {
                drag.target = all[i];
                drag.position = clientY < r.top + r.height / 2 ? 'before' : 'after';
                break;
            }
        }
        [].forEach.call(all, function(b) { b.style.borderTop = ''; b.style.borderBottom = ''; });
        if (drag.target) {
            drag.target.style.borderTop = drag.position === 'before' ? '2px dashed #4285f4' : '';
            drag.target.style.borderBottom = drag.position === 'after' ? '2px dashed #4285f4' : '';
        }
    }

    document.addEventListener('mouseup', async function(e) {
        if (handlePending) {
            // Click (not drag) on handle → context menu
            var blockId = handlePending.blockId;
            handlePending = null;
            closeSlashMenu();
            showContextMenu(blockId, e.clientX, e.clientY);
            return;
        }
        handlePending = null;
        if (!drag.el || !dotNetRef || !blocksContainer) { drag.el = null; return; }
        drag.el.style.transform = '';
        drag.el.classList.remove('dragging');
        [].forEach.call(blocksContainer.querySelectorAll('.block-editor'), function(b) {
            b.style.borderTop = ''; b.style.borderBottom = '';
        });
        if (drag.target) {
            var dragId = drag.el.getAttribute('data-block-id');
            var targetId = drag.target.getAttribute('data-block-id');
            var currentIds = [].map.call(blocksContainer.querySelectorAll('.block-editor'), function(el) {
                return el.getAttribute('data-block-id');
            });
            if (dragId && targetId) {
                var newIds = currentIds.slice();
                var fi = newIds.indexOf(dragId);
                if (fi !== -1) newIds.splice(fi, 1);
                var ti = newIds.indexOf(targetId);
                if (ti !== -1) newIds.splice(drag.position === 'before' ? ti : ti + 1, 0, dragId);
                var changed = false;
                for (var ci = 0; ci < currentIds.length; ci++) {
                    if (currentIds[ci] !== newIds[ci]) { changed = true; break; }
                }
                if (changed) {
                    try { await dotNetRef.invokeMethodAsync('HandleBlockReorder', newIds); }
                    catch (ex) { console.error('Reorder:', ex); }
                }
            }
        }
        drag.el = null; drag.target = null;
    });

    // ====================== CONTEXT MENU ======================

    function showContextMenu(blockId, x, y) {
        closeContextMenu();
        var el = document.createElement('div');
        el.className = 'block-context-menu';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.setAttribute('data-block-id', blockId);

        var items = [
            { label: 'Duplicate', action: 'duplicate', icon: '📋' },
            { label: 'Delete', action: 'delete', icon: '🗑️' },
            { type: 'sep' },
            { label: 'Turn into', action: 'turninto', icon: '↪️', hasSub: true },
        ];
        items.forEach(function(item) {
            if (item.type === 'sep') { el.appendChild(document.createElement('hr')); return; }
            var btn = document.createElement('button');
            btn.className = 'ctx-item';
            btn.innerHTML = '<span class="ctx-icon">' + item.icon + '</span><span class="ctx-label">' + item.label + '</span>' + (item.hasSub ? '<span class="ctx-arrow">▸</span>' : '');
            btn.addEventListener('mousedown', function(ev) {
                ev.preventDefault(); ev.stopPropagation();
                handleCtxAction(item.action, blockId);
            });
            el.appendChild(btn);
        });

        document.body.appendChild(el);
        ctxMenu = { el: el, blockId: blockId };
        var rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) el.style.left = Math.max(4, x - rect.width) + 'px';
        if (rect.bottom > window.innerHeight) el.style.top = Math.max(4, y - rect.height) + 'px';
    }

    function closeContextMenu() {
        if (ctxMenu) { ctxMenu.el.remove(); ctxMenu = null; }
        closeTurnIntoMenu();
    }

    function showTurnIntoMenu(blockId) {
        closeTurnIntoMenu();
        if (!ctxMenu) return;
        var rect = ctxMenu.el.getBoundingClientRect();
        var el = document.createElement('div');
        el.className = 'turninto-menu';
        el.style.left = (rect.right + 4) + 'px';
        el.style.top = rect.top + 'px';
        el.style.minWidth = '180px';

        SLASH_ITEMS.forEach(function(item) {
            var btn = document.createElement('button');
            btn.className = 'ctx-item';
            btn.innerHTML = '<span class="ctx-icon">' + item.icon + '</span><span class="ctx-label">' + item.label + '</span>';
            btn.addEventListener('mousedown', function(ev) {
                ev.preventDefault(); ev.stopPropagation();
                closeContextMenu();
                convertBlock(blockId, item.type);
            });
            el.appendChild(btn);
        });

        document.body.appendChild(el);
        turnIntoMenu = { el: el, blockId: blockId };
        var mr = el.getBoundingClientRect();
        if (mr.right > window.innerWidth) el.style.left = (rect.left - mr.width) + 'px';
        if (mr.bottom > window.innerHeight) el.style.top = Math.max(4, window.innerHeight - mr.height) + 'px';
    }

    function closeTurnIntoMenu() {
        if (turnIntoMenu) { turnIntoMenu.el.remove(); turnIntoMenu = null; }
    }

    async function handleCtxAction(action, blockId) {
        closeContextMenu();
        if (action === 'delete') {
            try { await dotNetRef.invokeMethodAsync('HandleBlockDelete', blockId); }
            catch (ex) { console.error('Delete:', ex); }
        } else if (action === 'duplicate') {
            try { await dotNetRef.invokeMethodAsync('HandleBlockDuplicate', blockId); }
            catch (ex) { console.error('Duplicate:', ex); }
        } else if (action === 'turninto') {
            showTurnIntoMenu(blockId);
        }
    }

    async function convertBlock(blockId, type) {
        try { await dotNetRef.invokeMethodAsync('HandleBlockConvert', blockId, type); }
        catch (ex) { console.error('Convert:', ex); }
    }

    // Close menus on outside click
    document.addEventListener('click', function(e) {
        if (ctxMenu && !e.target.closest('.block-context-menu') && !e.target.closest('.turninto-menu') && !e.target.closest('.context-menu-anchor')) {
            closeContextMenu();
        }
    });

    // ====================== SLASH COMMAND ======================

    // Detect '/' typed in any block textarea/input
    document.addEventListener('input', function(e) {
        if (slashMenuEl) {
            // Menu is open, update filter
            var val = e.target.value;
            var lsi = val.lastIndexOf('/');
            slash.filter = lsi >= 0 ? val.substring(lsi + 1).toLowerCase() : '';
            filterSlashMenu();
            return;
        }
        var target = e.target;
        if (!target.matches('textarea.block-textarea, input.block-input, div.block-textarea')) return;
        var val = target.value;
        // Only open if content is just '/' at the start (nothing before it)
        if (val.trim() === '/' && val.lastIndexOf('/') === val.length - 1) {
            var blockEl = target.closest('.block-editor');
            if (!blockEl) return;
            var bid = blockEl.getAttribute('data-block-id');
            if (bid) openSlashMenu(target, bid);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!slashMenuEl) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); slash.idx = Math.min(slash.idx + 1, slash.items.length - 1); updateSlashMenu(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); slash.idx = Math.max(slash.idx - 1, 0); updateSlashMenu(); }
        else if (e.key === 'Enter') { e.preventDefault(); if (slash.items[slash.idx]) selectSlashItem(slash.items[slash.idx]); }
        else if (e.key === 'Escape') { e.preventDefault(); closeSlashMenu(); }
    });

    function openSlashMenu(inputEl, blockId) {
        closeSlashMenu();
        var ir = inputEl.getBoundingClientRect();
        var el = document.createElement('div');
        el.className = 'slash-menu';
        el.style.left = Math.max(4, ir.left) + 'px';
        el.style.top = (ir.bottom + 4) + 'px';
        el.style.minWidth = '240px';
        el.style.maxHeight = '320px';
        document.body.appendChild(el);
        slashMenuEl = el;
        slash.el = inputEl;
        slash.blockId = blockId;
        slash.filter = '';
        slash.items = SLASH_ITEMS.slice();
        slash.idx = 0;
        renderSlashMenu();
        // Reposition if overflow
        var sr = el.getBoundingClientRect();
        if (sr.right > window.innerWidth) el.style.left = Math.max(4, window.innerWidth - sr.width - 4) + 'px';
    }

    function filterSlashMenu() {
        if (!slash.filter) { slash.items = SLASH_ITEMS.slice(); }
        else { slash.items = SLASH_ITEMS.filter(function(it) { return it.label.toLowerCase().indexOf(slash.filter) >= 0; }); }
        slash.idx = 0;
        renderSlashMenu();
    }

    function renderSlashMenu() {
        if (!slashMenuEl) return;
        slashMenuEl.innerHTML = '';
        var h = document.createElement('div');
        h.className = 'slash-header';
        h.textContent = 'Blocks';
        slashMenuEl.appendChild(h);
        if (slash.items.length === 0) {
            var e = document.createElement('div'); e.className = 'slash-empty'; e.textContent = 'No results';
            slashMenuEl.appendChild(e); return;
        }
        slash.items.forEach(function(item, i) {
            var b = document.createElement('button');
            b.className = 'slash-item' + (i === slash.idx ? ' selected' : '');
            b.innerHTML = '<span class="slash-icon">' + item.icon + '</span><span class="slash-label">' + item.label + '</span>';
            b.addEventListener('mousedown', function(ev) { ev.preventDefault(); selectSlashItem(item); });
            b.addEventListener('mouseenter', function() { slash.idx = i; updateSlashMenu(); });
            slashMenuEl.appendChild(b);
        });
    }

    function updateSlashMenu() {
        if (!slashMenuEl) return;
        var items = slashMenuEl.querySelectorAll('.slash-item');
        [].forEach.call(items, function(el, i) { el.classList.toggle('selected', i === slash.idx); });
        var sel = items[slash.idx];
        if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    async function selectSlashItem(item) {
        var blockId = slash.blockId;
        var el = slash.el;
        closeSlashMenu();
        if (!dotNetRef || !blockId) return;
        if (el) el.value = '';
        try { await dotNetRef.invokeMethodAsync('HandleBlockConvert', blockId, item.type); }
        catch (ex) { console.error('Slash convert:', ex); }
    }

    function closeSlashMenu() {
        if (slashMenuEl) { slashMenuEl.remove(); slashMenuEl = null; }
        slash.el = null; slash.blockId = null; slash.filter = ''; slash.items = []; slash.idx = 0;
    }

    // Close slash menu on scroll away
    window.addEventListener('scroll', function() {
        if (slashMenuEl) closeSlashMenu();
        if (ctxMenu) closeContextMenu();
    }, true);

    // ====================== IMAGE DRAG-TO-PLACE ======================

    var imageDrag = null;
    var zoneIndicator = null;

    document.addEventListener('pointerdown', function(e) {
        if (e.button !== 0) return;
        var img = e.target.closest('.image-block');
        if (!img) return;
        var c = e.target.closest('.image-block-container');
        if (!c) return;
        img.setPointerCapture(e.pointerId);
        imageDrag = { blockId: c.getAttribute('data-image-block-id'), container: c, img: img, startX: e.clientX, startY: e.clientY, isDrag: false };
    });

    document.addEventListener('pointermove', function(e) {
        if (!imageDrag) return;
        var dx = e.clientX - imageDrag.startX;
        var dy = e.clientY - imageDrag.startY;
        // Check for vertical drag (block reorder) before horizontal (alignment)
        if (!imageDrag.isDrag && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
            var blockEl = imageDrag.container.closest('.block-editor');
            if (blockEl) {
                try { imageDrag.img.releasePointerCapture(e.pointerId); } catch(ex) {}
                drag.el = blockEl;
                drag.startY = e.clientY;
                drag.el.classList.add('dragging');
                updateBlockDrag(e.clientY);
            }
            imageDrag = null;
            return;
        }
        if (!imageDrag.isDrag && Math.abs(dx) > 8) {
            imageDrag.isDrag = true;
            imageDrag.container.classList.add('image-place-dragging');
            var ind = document.createElement('div');
            ind.className = 'image-place-indicator';
            imageDrag.container.appendChild(ind);
            zoneIndicator = ind;
        }
        if (imageDrag && imageDrag.isDrag) {
            e.preventDefault();
            imageDrag.img.style.marginLeft = dx + 'px';
            var zone = getZone(e.clientX, imageDrag.container);
            if (zoneIndicator) zoneIndicator.textContent = zone === 'full' ? 'Full width' : zone.charAt(0).toUpperCase() + zone.slice(1);
        }
    });

    document.addEventListener('pointerup', function(e) {
        if (!imageDrag) return;
        try { imageDrag.img.releasePointerCapture(e.pointerId); } catch(ex) {}
        if (imageDrag.isDrag && imageRef) {
            var zone = getZone(e.clientX, imageDrag.container);
            imageDrag.img.style.marginLeft = '';
            imageDrag.container.classList.remove('image-place-dragging');
            if (zoneIndicator) { zoneIndicator.remove(); zoneIndicator = null; }
            imageRef.invokeMethodAsync('HandleImageAlign', imageDrag.blockId, zone).catch(function(err) { console.error('ImageAlign:', err); });
        }
        imageDrag = null;
    });

    function getZone(clientX, c) {
        var rect = c.getBoundingClientRect();
        var pct = (clientX - rect.left) / rect.width;
        if (pct < 0.25) return 'left'; if (pct < 0.40) return 'center'; if (pct < 0.70) return 'right'; return 'full';
    }

    // ====================== PUBLIC API ======================

    window.setupBlockDragAndDrop = function(ref) {
        dotNetRef = ref;
        blocksContainer = document.getElementById('blocks-container');
        if (!blocksContainer) console.warn('blocks-container not found');
        console.log('[Interop] Block DnD + ctx menu + slash ready');
    };

    window.setupImagePlaceDrag = function(ref) {
        imageRef = ref;
        console.log('[Interop] Image drag ref set');
    };

    window.addEventListener('beforeunload', function() {
        dotNetRef = null; imageRef = null; blocksContainer = null;
        closeContextMenu(); closeSlashMenu();
    });

    // Scroll focused block input into view
    document.addEventListener('focusin', function(e) {
        var el = e.target.closest('input.block-textarea');
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.bottom > window.innerHeight) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
})();

function focusBlockInput(blockId) {
    var el = document.querySelector('[data-block-id="' + blockId + '"]');
    if (!el) return;
    var input = el.querySelector('input, textarea');
    if (input) input.focus();
}

function scrollElementIntoView(blockId) {
    var el = document.querySelector('[data-block-id="' + blockId + '"]');
    if (!el) return;
    var input = el.querySelector('input, textarea');
    if (input) {
        var rect = input.getBoundingClientRect();
        if (rect.bottom > window.innerHeight || rect.top < 0) input.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

function blurElementById(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.blur();
}
function watchTitleInputScroll() {}
function watchBlockInputScroll() {}

function getDivText(el) {
    if (!el) return '';
    if (el.tagName === 'DIV') return el.innerText || '';
    return el.value || '';
}

