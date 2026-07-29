import { instances } from './instances.js'

// ─── Dirty-flag save system ────────────────────────────────────
// 1) onUpdate marks the instance dirty and stores the latest markdown
// 2) A 500ms debounce schedules a flush to the backend
// 3) On successful flush the dirty flag is cleared
// 4) beforeunload / pagehide force-flush any dirty instance immediately
// 5) Destroying an editor clears its pending flush timer
let _flushTimer = null
const FLUSH_DEBOUNCE_MS = 500

function markDirty(inst, markdown) {
  inst._dirty = true
  inst._pendingMarkdown = markdown
  if (!_flushTimer) {
    _flushTimer = setTimeout(flushAllDirty, FLUSH_DEBOUNCE_MS)
  }
}

function clearDirty(inst) {
  inst._dirty = false
  inst._pendingMarkdown = null
  if (_flushTimer) {
    clearTimeout(_flushTimer)
    _flushTimer = null
  }
}

async function flushAllDirty() {
  _flushTimer = null
  const dirty = [...instances.values()].filter(i => i._dirty && i.dotNetRef && i.editor)
  if (!dirty.length) return
  await Promise.all(dirty.map(inst => flushInstance(inst)))
}

async function flushInstance(inst) {
  if (!inst._dirty || !inst.dotNetRef || !inst.editor) return
  const markdown = inst._pendingMarkdown ?? inst.editor.getMarkdown()
  try {
    await inst.dotNetRef.invokeMethodAsync('OnMarkdownChanged', inst.blockId, markdown)
    clearDirty(inst)
  } catch {
    // Leave dirty so a later timer or beforeunload retry will flush it
  }
}

export function scheduleFlush(inst, markdown) {
  markDirty(inst, markdown)
}

// Clear the global flush timer if no more dirty instances remain
export function checkClearFlushTimer() {
  if (![...instances.values()].some(i => i._dirty)) {
    if (_flushTimer) { clearTimeout(_flushTimer); _flushTimer = null }
  }
}

// Wire up beforeunload / pagehide so unsaved changes are flushed on navigation
export function setupFlushOnUnload() {
  const handler = async () => {
    const dirty = [...instances.values()].filter(i => i._dirty && i.dotNetRef && i.editor)
    if (!dirty.length) return
    for (const inst of dirty) {
      const markdown = inst._pendingMarkdown ?? inst.editor.getMarkdown()
      try {
        const blob = new Blob([JSON.stringify({ content: markdown })], { type: 'application/json' })
        await navigator.sendBeacon(`/api/pages/${inst.blockId}/content`, blob)
        clearDirty(inst)
      } catch {
        // leave dirty — nothing more we can do at this point
      }
    }
  }
  window.addEventListener('beforeunload', handler)
  window.addEventListener('pagehide', handler)
}
