// ─── Dirty-flag save system ─────────────────────────────────────
let _flushTimer = null
const FLUSH_DEBOUNCE_MS = 500
const instances = new Map()

function markDirty(inst, markdown) {
  inst._dirty = true
  inst._pendingMarkdown = markdown
  if (!_flushTimer) _flushTimer = setTimeout(flushAllDirty, FLUSH_DEBOUNCE_MS)
}

function clearDirty(inst) {
  inst._dirty = false
  inst._pendingMarkdown = null
  if (_flushTimer) { clearTimeout(_flushTimer); _flushTimer = null }
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
    // leave dirty for retry
  }
}

function setupFlushOnUnload() {
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
        // leave dirty — nothing more we can do
      }
    }
  }
  window.addEventListener('beforeunload', handler)
  window.addEventListener('pagehide', handler)
}

setupFlushOnUnload()

export function registerInstance(inst) {
  instances.set(inst.blockId, inst)
}

export function unregisterInstance(blockId) {
  instances.delete(blockId)
}

export function scheduleFlush(inst, markdown) {
  markDirty(inst, markdown)
}

export function forceFlush(blockId) {
  const inst = instances.get(blockId)
  if (inst && inst._dirty) flushInstance(inst)
}

export function clearFlushTimer() {
  if (_flushTimer) { clearTimeout(_flushTimer); _flushTimer = null }
}

export function setupSaveManager(inst) {
  return {
    markDirty: (markdown) => scheduleFlush(inst, markdown),
    cleanup: () => unregisterInstance(inst.blockId)
  }
}

export function forceFlushAll() {
  for (const inst of instances.values()) {
    if (inst._dirty) flushInstance(inst)
  }
}