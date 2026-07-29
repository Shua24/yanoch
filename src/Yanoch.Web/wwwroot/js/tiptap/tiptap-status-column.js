// ─── Status Column Node + Dropdown Menu ──────────────────────────
import { Node, createBlockMarkdownSpec } from '@tiptap/core'

// Status types matching Notion-style
export const statusTypes = [
  { id: 'todo', label: 'Todo', color: '#f59e0b', bg: '#fef3c7', text: '#92400e' },
  { id: 'in-progress', label: 'In Progress', color: '#3b82f6', bg: '#dbeafe', text: '#1e40af' },
  { id: 'done', label: 'Done', color: '#22c55e', bg: '#dcfce7', text: '#166534' },
]

export const statusById = Object.fromEntries(statusTypes.map(s => [s.id, s]))

// ─── Markdown Spec ───────────────────────────────────────────────
// Uses :::status{todo} syntax (inline-compatible via text content)
const statusMd = createBlockMarkdownSpec({
  nodeName: 'status',
  name: 'status',
  content: 'inline*',
  defaultAttributes: { status: 'todo' },
  allowedAttributes: ['status'],
})

// ─── Status Node ─────────────────────────────────────────────────
// Inline node (atom) that lives inside text/table cells
export const Status = Node.create({
  name: 'status',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return { status: { default: 'todo' } }
  },

  parseHTML() {
    return [{
      tag: 'span[data-status]',
      getAttrs: el => ({ status: el.getAttribute('data-status') || 'todo' }),
    }]
  },

  renderHTML({ HTMLAttributes }) {
    const status = HTMLAttributes.status || 'todo'
    const info = statusById[status] || statusById.todo
    return [
      'span',
      {
        'data-status': status,
        class: `status-badge status-${status}`,
        style: `background:${info.bg};color:${info.text};border-color:${info.color};`,
        contenteditable: 'false',
      },
      info.label,
    ]
  },

  addCommands() {
    return {
      setStatus: (attrs = {}) => ({ commands }) => commands.insertContent({
        type: 'status',
        attrs,
      }),
      updateStatus: (attrs = {}) => ({ commands, state }) => {
        const { selection } = state
        if (!selection.empty) return false
        const node = selection.$from.nodeAfter
        if (!node || node.type.name !== 'status') return false
        return commands.updateAttributes('status', attrs)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Enter': () => false, // Don't split on Enter
      'Backspace': () => false,
    }
  },

  ...statusMd,
})

// ─── Global Dropdown Menu ────────────────────────────────────────
let statusMenuEl = null
let statusMenuTarget = null // the status badge DOM element
let statusMenuEditor = null
let statusMenuPos = null // position of the status node in the document

export function setupStatusMenus() {
  // Create menu element
  const menu = document.createElement('div')
  menu.className = 'status-badge-menu'
  menu.style.cssText = `
    position:fixed;z-index:99999;display:none;
    background:var(--card-bg,#ffffff);
    border:1px solid var(--border,rgba(0,0,0,0.12));
    border-radius:6px;
    box-shadow:0 4px 12px rgba(0,0,0,0.1);
    padding:4px;min-width:140px;
  `
  menu.innerHTML = statusTypes.map(s => `
    <button
      type="button"
      data-status="${s.id}"
      style="
        display:flex;align-items:center;gap:8px;width:100%;
        padding:6px 10px;border:none;background:transparent;
        border-radius:4px;cursor:pointer;font-size:0.875rem;
        text-align:left;color:var(--text,#1f2937);
      "
      title="Set status to ${s.label}"
    >
      <span style="width:8px;height:8px;border-radius:50%;background:${s.color};flex-shrink:0;"></span>
      ${s.label}
    </button>
  `).join('')

  // Prevent menu clicks from blurring editor
  menu.addEventListener('mousedown', e => e.preventDefault())

  menu.querySelectorAll('button').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault()
      const status = btn.dataset.status
      if (status && statusMenuEditor && statusMenuPos !== null) {
        // Use the stored position to update the correct node
        statusMenuEditor.view.dispatch(
          statusMenuEditor.state.tr.setNodeMarkup(statusMenuPos, null, {
            ...statusMenuEditor.state.doc.nodeAt(statusMenuPos).attrs,
            status,
          }).scrollIntoView()
        )
      }
      closeStatusMenu()
    }
  })

  document.body.appendChild(menu)
  statusMenuEl = menu

  // Outside click to close
  document.addEventListener('mousedown', (e) => {
    if (statusMenuEl && statusMenuEl.style.display !== 'none') {
      if (!statusMenuEl.contains(e.target) && e.target !== statusMenuTarget) {
        closeStatusMenu()
      }
    }
  })

  return { closeStatusMenu, updateStatusMenu }
}

export function updateStatusMenu(editor, inst) {
  const { state, view } = editor
  const { selection } = state

  // Check if cursor is on or next to a status node
  let statusNode = null
  let statusPos = null

  // Check node at cursor position
  if (!selection.empty) {
    closeStatusMenu(inst)
    return
  }

  const $from = selection.$from
  // Check node after cursor
  const nodeAfter = $from.nodeAfter
  if (nodeAfter && nodeAfter.type.name === 'status') {
    statusNode = nodeAfter
    statusPos = $from.pos
  } else {
    // Check node before cursor
    const nodeBefore = $from.nodeBefore
    if (nodeBefore && nodeBefore.type.name === 'status') {
      statusNode = nodeBefore
      statusPos = $from.pos - nodeBefore.nodeSize
    }
  }

  if (!statusNode || statusPos === null) {
    closeStatusMenu(inst)
    return
  }

  // Find the DOM element for the status node
  let statusDOM = null
  try {
    statusDOM = view.nodeDOM(statusPos)
  } catch (e) {}

  if (!statusDOM) {
    closeStatusMenu(inst)
    return
  }

  // Show menu
  if (!statusMenuEl) return

  statusMenuTarget = statusDOM
  statusMenuEditor = editor
  statusMenuPos = statusPos

  // Update active state in menu
  const currentStatus = statusNode.attrs.status
  statusMenuEl.querySelectorAll('button').forEach(btn => {
    btn.style.background = btn.dataset.status === currentStatus
      ? 'var(--hover-bg, #f3f4f6)'
      : 'transparent'
    btn.style.fontWeight = btn.dataset.status === currentStatus ? '600' : '400'
  })

  // Position menu below the status badge
  const rect = statusDOM.getBoundingClientRect()
  const menuRect = statusMenuEl.getBoundingClientRect()
  const top = rect.bottom + 4
  const left = rect.left + (rect.width / 2) - (menuRect.width / 2)

  statusMenuEl.style.top = Math.max(8, top) + 'px'
  statusMenuEl.style.left = Math.max(8, left) + 'px'
  statusMenuEl.style.display = 'block'
}

export function closeStatusMenu(inst) {
  if (statusMenuEl) {
    statusMenuEl.style.display = 'none'
  }
  statusMenuTarget = null
  statusMenuEditor = null
  statusMenuPos = null
}