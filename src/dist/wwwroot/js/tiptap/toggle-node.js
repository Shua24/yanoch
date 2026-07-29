import { Node, createBlockMarkdownSpec } from '@tiptap/core'
import { findEditorForElement, updateBlockAttr } from './utils.js'

// Markdown: :::toggle {collapsed:true}
// content
// :::
const toggleMd = createBlockMarkdownSpec({
  nodeName: 'toggle',
  name: 'toggle',
  content: 'block',
  defaultAttributes: { collapsed: false },
  allowedAttributes: ['collapsed'],
})

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
      getAttrs: el => ({
        collapsed: el.getAttribute('data-collapsed') === 'true',
      }),
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

// ─── Create editor-aware toggle handler ────────────────────────
function toggleCollapsed(e) {
  const arrow = e.target.closest('[data-toggle-arrow]')
  if (!arrow) return
  const toggleEl = arrow.closest('[data-toggle]')
  if (!toggleEl) return
  const editor = findEditorForElement(toggleEl)
  if (!editor) return
  const current = toggleEl.getAttribute('data-collapsed') === 'true'
  updateBlockAttr(editor, toggleEl, 'toggle', 'collapsed', !current)
}

// ─── Toggle click handler ──────────────────────────────────────
export function setupToggleClicks() {
  document.addEventListener('click', function handler(e) {
    const arrow = e.target.closest('[data-toggle-arrow]')
    if (arrow) toggleCollapsed(e)
  })
}
