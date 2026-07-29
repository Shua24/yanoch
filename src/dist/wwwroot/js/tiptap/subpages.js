import { instances } from './instances.js'

// ─── Load subpages from API and inject as pageReference nodes ──
export async function loadAndInjectSubpages(editor, pageId) {
  try {
    const r = await fetch(`/api/pages/children/${pageId}`, { credentials: 'same-origin' })
    if (!r.ok) return
    const subpages = await r.json()
    if (!subpages || !subpages.length) return

    const { schema } = editor.state
    const nodes = subpages
      .filter(sp => sp && sp.id)
      .map(sp => schema.nodes.pageReference.create({
        pageId: sp.id,
        title: sp.title || 'Untitled',
        icon: sp.icon || '📄',
      }))

    if (!nodes.length) return

    const pos = editor.state.doc.content.size
    const tr = editor.state.tr.replaceWith(pos, pos, nodes)
    tr.setMeta('subpageInject', true)
    editor.view.dispatch(tr)
  } catch (e) {
    console.error('Failed to load subpages:', e)
  }
}

// ─── Save subpage order to backend ─────────────────────────────
// Per-pageId debounce timers so concurrent editors don't clobber each other.
const _reorderTimers = new Map()

export function scheduleSubpageReorder(pageId, orderedIds) {
  if (_reorderTimers.has(pageId)) clearTimeout(_reorderTimers.get(pageId))
  _reorderTimers.set(pageId, setTimeout(async () => {
    _reorderTimers.delete(pageId)
    try {
      const r = await fetch(`/api/pages/${pageId}/reorder-subpages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageIds: orderedIds }),
        credentials: 'same-origin',
      })
      if (!r.ok) {
        const text = await r.text().catch(() => '(no body)')
        console.warn(`Reorder rejected (${r.status}) for page ${pageId}:`, text)
      }
    } catch (e) {
      console.error('Reorder network error for page', pageId, ':', e)
    }
  }, 600))
}

// ─── Extract pageReference node order from editor ──────────────
export function getSubpageOrder(editor) {
  const ids = []
  editor.state.doc.descendants(node => {
    if (node.type.name === 'pageReference' && node.attrs.pageId) {
      ids.push(node.attrs.pageId)
    }
  })
  return ids
}
