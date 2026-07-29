import { Node } from '@tiptap/core'

// ─── PageReference node (inline subpage block) ─────────────────
// A void block node that renders a draggable page reference inside the editor.
// Not serialized to markdown — subpages are loaded from the backend separately.
export const PageReference = Node.create({
  name: 'pageReference',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false, // DragHandle extension handles dragging
  addAttributes() {
    return {
      pageId: { default: '' },
      title: { default: 'Untitled' },
      icon: { default: '📄' },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-page-ref]' }]
  },
  renderHTML({ HTMLAttributes }) {
    const { pageId, title, icon } = HTMLAttributes
    return ['div', { 'data-page-ref': pageId, class: 'page-ref-block' },
      ['span', { class: 'page-ref-icon' }, icon || '📄'],
      ['span', { class: 'page-ref-title' }, title || 'Untitled'],
      ['span', { class: 'page-ref-open', title: 'Open page' }, '↗'],
    ]
  },
  // Prevent serialization to markdown — subpages are managed via API
  renderMarkdown() {
    // Output nothing — pageReference nodes are not persisted in markdown
  },
})

// ─── Page-reference click handler (double-click to open) ───────
export function setupPageReferenceClicks() {
  document.addEventListener('click', function handler(e) {
    const openEl = e.target.closest('.page-ref-open')
    if (!openEl) return
    e.preventDefault()
    e.stopPropagation()
    const block = openEl.closest('[data-page-ref]')
    if (block) {
      const pageId = block.getAttribute('data-page-ref')
      if (pageId) window.location.href = `/page/${pageId}`
    }
  })
}
