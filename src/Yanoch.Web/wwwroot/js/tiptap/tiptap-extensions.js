import { Node, createBlockMarkdownSpec } from '@tiptap/core'
import { Markdown } from '@tiptap/markdown'

// ─── Callout types ──────────────────────────────────────────────
export const calloutTypes = [
  { id: 'info',    icon: '💡',  label: 'Info',    color: '#2383e2' },
  { id: 'warning', icon: '⚠️', label: 'Warning', color: '#e5484d' },
  { id: 'success', icon: '✅', label: 'Success', color: '#2ea043' },
  { id: 'error',   icon: '❌', label: 'Error',   color: '#e5484d' },
  { id: 'gray',    icon: '⚪', label: 'Gray',    color: '#9b9b9b' },
  { id: 'brown',   icon: '🟤', label: 'Brown',   color: '#a07850' },
  { id: 'orange',  icon: '🟠', label: 'Orange',  color: '#ffa500' },
  { id: 'yellow',  icon: '🟡', label: 'Yellow',  color: '#ffd200' },
  { id: 'green',   icon: '🟢', label: 'Green',   color: '#00c864' },
  { id: 'blue',    icon: '🔵', label: 'Blue',    color: '#2383e2' },
  { id: 'purple',  icon: '🟣', label: 'Purple',  color: '#a050c8' },
  { id: 'pink',    icon: '🩷', label: 'Pink',    color: '#dc50a0' },
  { id: 'red',     icon: '🔴', label: 'Red',     color: '#e5484d' },
]

export const calloutEmojis = [
  '💡','ℹ️','❓','🔥','⭐','🎯','📌','📎','✏️','📖',
  '❤️','💚','💙','💜','🧡','🖤','🤍','💛','💗','🤎',
  '✅','❌','⚠️','🚀','📝','🔒','🔓','👀','💪','🧠',
  '🎨','🎵','📷','🔧','⚙️','🔗','📊','📁','🏠','🌍',
  '☀️','🌙','☁️','🌈','💧','🌱','🌸','🍀','🎉','🔴',
]

export const typeById = Object.fromEntries(calloutTypes.map(t => [t.id, t]))

// ─── Callout Markdown Spec ──────────────────────────────────────
const calloutMd = createBlockMarkdownSpec({
  nodeName: 'callout',
  name: 'callout',
  content: 'block',
  defaultAttributes: { type: 'info' },
  allowedAttributes: ['type', 'icon'],
})

// ─── Callout Node ───────────────────────────────────────────────
export const Callout = Node.create({
  name: 'callout',
  content: 'block+',
  group: 'block',
  defining: true,
  addAttributes() {
    return { type: { default: 'info' }, icon: { default: '' } }
  },
  parseHTML() {
    return [{
      tag: 'div[data-callout]',
      getAttrs: el => ({
        type: (el.getAttribute('data-type') || 'info').toLowerCase(),
        icon: el.getAttribute('data-icon') || '',
      }),
    }]
  },
  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes.type || 'info'
    const defaultIcon = (typeById[type] || typeById.info).icon
    const icon = HTMLAttributes.icon || defaultIcon
    return ['div', { 'data-callout': '', 'data-type': type, 'data-icon': icon, class: `callout callout--${type}` },
      ['div', { class: 'callout-side', contenteditable: 'false' },
        ['button', { class: 'callout-icon-btn', 'data-callout-icon': '', type: 'button' }, icon],
        ['button', { class: 'callout-color-btn', 'data-callout-color': '', type: 'button' },
          ['span', { class: 'callout-color-dot' }, ''],
        ],
      ],
      ['div', { class: 'callout-content' }, 0],
    ]
  },
  addCommands() {
    return {
      setCallout: (attrs = {}) => ({ commands }) => commands.wrapIn(this.name, attrs),
    }
  },
  ...calloutMd,
})

// ─── Toggle Markdown Spec ───────────────────────────────────────
const toggleMd = createBlockMarkdownSpec({
  nodeName: 'toggle',
  name: 'toggle',
  content: 'block',
  defaultAttributes: { collapsed: false },
  allowedAttributes: ['collapsed'],
})

// ─── Toggle Node ────────────────────────────────────────────────
export const Toggle = Node.create({
  name: 'toggle',
  content: 'block+',
  group: 'block',
  defining: true,
  addAttributes() {
    return { collapsed: { default: false } }
  },
  parseHTML() {
    return [{
      tag: 'div[data-toggle]',
      getAttrs: el => ({ collapsed: el.getAttribute('data-collapsed') === 'true' }),
    }]
  },
  renderHTML({ HTMLAttributes }) {
    const collapsed = !!HTMLAttributes.collapsed
    return ['div', { 'data-toggle': '', 'data-collapsed': collapsed ? 'true' : 'false', class: 'toggle' + (collapsed ? ' collapsed' : '') },
      ['span', { class: 'toggle-arrow', 'data-toggle-arrow': '', contenteditable: 'false' }, '\u25b6'],
      ['div', { class: 'toggle-inner' }, 0],
    ]
  },
  addCommands() {
    return {
      setToggle: (attrs = {}) => ({ commands, state }) => {
        const { $from } = state.selection
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.spec.defining) {
            return commands.insertContent({
              type: 'toggle',
              attrs,
              content: [{ type: 'paragraph' }],
            })
          }
        }
        return commands.wrapIn(this.name, attrs)
      },
    }
  },
  ...toggleMd,
})

// ─── PageReference Node ─────────────────────────────────────────
export const PageReference = Node.create({
  name: 'pageReference',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,
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
  renderMarkdown() {
    // Do not serialize — subpages are managed via API
  },
})

// ─── Status Badge Node ──────────────────────────────────────────
export { Status, setupStatusMenus, updateStatusMenu, closeStatusMenu, statusTypes } from './tiptap-status-column.js'

// ─── Shared utilities ───────────────────────────────────────────
export function updateCalloutAttr(editor, calloutEl, attr, value) {
  updateBlockAttr(editor, calloutEl, 'callout', attr, value)
}

export function updateBlockAttr(editor, el, nodeName, attr, value) {
  const { state, view } = editor
  const pos = view.posAtDOM(el, 0)
  if (pos == null) return
  const $pos = state.doc.resolve(pos)
  let depth = $pos.depth
  while (depth >= 0 && $pos.node(depth).type.name !== nodeName) depth--
  if (depth < 0) return
  const node = $pos.node(depth)
  view.dispatch(state.tr.setNodeMarkup($pos.before(depth), null, { ...node.attrs, [attr]: value }).scrollIntoView())
}

export function toggleCollapsed(e) {
  const arrow = e.target.closest('[data-toggle-arrow]')
  if (!arrow) return
  const toggleEl = arrow.closest('[data-toggle]')
  if (!toggleEl) return
  const ed = findEditorForElement(toggleEl)
  if (!ed) return
  const current = toggleEl.getAttribute('data-collapsed') === 'true'
  updateBlockAttr(ed, toggleEl, 'toggle', 'collapsed', !current)
}

// Instance registry
const instances = new Map()
export function registerInstance(id, inst) { instances.set(id, inst) }
export function unregisterInstance(id) { instances.delete(id) }

export function findEditorForElement(el) {
  return Array.from(instances.values()).find(i => i.editor?.view?.dom?.contains(el))?.editor || null
}