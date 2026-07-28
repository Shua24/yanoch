import { Editor, Node, createBlockMarkdownSpec } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Markdown } from '@tiptap/markdown'
import Placeholder from '@tiptap/extension-placeholder'
import GapCursor from '@tiptap/extension-gapcursor'
import { DragHandle } from '@tiptap/extension-drag-handle'
import { Table } from '@tiptap/extension-table'
import { marked } from 'marked'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

// ─── Callout type defs ─────────────────────────────────────────
const calloutTypes = [
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
const typeById = Object.fromEntries(calloutTypes.map(t => [t.id, t]))

// ─── Callout emoji palette ─────────────────────────────────────
const calloutEmojis = [
  '💡','ℹ️','❓','🔥','⭐','🎯','📌','📎','✏️','📖',
  '❤️','💚','💙','💜','🧡','🖤','🤍','💛','💗','🤎',
  '✅','❌','⚠️','🚀','📝','🔒','🔓','👀','💪','🧠',
  '🎨','🎵','📷','🔧','⚙️','🔗','📊','📁','🏠','🌍',
  '☀️','🌙','☁️','🌈','💧','🌱','🌸','🍀','🎉','🔴',
]

// ─── Callout node ─────────────────────────────────────────────
// Markdown round-trip via ::callout {type:"info" icon:"💡"} ::: fenced syntax
const calloutMd = createBlockMarkdownSpec({
  nodeName: 'callout',
  name: 'callout',
  content: 'block',
  defaultAttributes: { type: 'info' },
  allowedAttributes: ['type', 'icon'],
})

// ─── Update a callout node attribute from a mounted DOM element ─
function updateCalloutAttr(editor, calloutEl, attr, value) {
  updateBlockAttr(editor, calloutEl, 'callout', attr, value)
}

// ─── Update any block node attribute from DOM element ─
function updateBlockAttr(editor, el, nodeName, attr, value) {
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

// ─── Create editor-aware toggle handler ─
function toggleCollapsed(e) {
  const arrow = e.target.closest('[data-toggle-arrow]')
  if (!arrow) return
  const toggleEl = arrow.closest('[data-toggle]')
  if (!toggleEl) return
  const ed = findEditorForElement(toggleEl)
  if (!ed) return
  const current = toggleEl.getAttribute('data-collapsed') === 'true'
  updateBlockAttr(ed, toggleEl, 'toggle', 'collapsed', !current)
}

const Callout = Node.create({
  name: 'callout',
  content: 'block+',
  group: 'block',
  defining: true,
  addAttributes() {
    return {
      type: { default: 'info' },
      icon: { default: '' },
    }
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
    return ['div', { 'data-callout': '', 'data-type': type, 'data-icon': icon, class: 'callout callout--' + type },
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
      setCallout: (attrs = {}) => ({ commands }) => {
        return commands.wrapIn(this.name, attrs)
      },
    }
  },
  // Markdown bridge — ::callout {type:"info" icon:"💡"} ... :::
  ...calloutMd,
})

// ─── Toggle node (collapsible) ─────────────────────────────────────
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

const Toggle = Node.create({
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
            // Inside a defining container (toggle/callout):
            // insert a new toggle at cursor, splitting the current block
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

// ─── Toggle click handler ────────────────────────────────────────
function setupToggleClicks() {
  document.addEventListener('click', function handler(e) {
    const arrow = e.target.closest('[data-toggle-arrow]')
    if (arrow) toggleCollapsed(e)
  })
}

// ─── PageReference node (inline subpage block) ──────────────────
// A void block node that renders a draggable page reference inside the editor.
// Not serialized to markdown — subpages are loaded from the backend separately.
const PageReference = Node.create({
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
  renderMarkdown(state, node) {
    // Output nothing — pageReference nodes are not persisted in markdown
  },
})

// ─── Load subpages from API and inject as pageReference nodes ────
let _suppressSubpageSave = false

async function loadAndInjectSubpages(editor, pageId) {
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
    // Mark transaction so onUpdate can skip saving
    tr.setMeta('subpageInject', true)
    editor.view.dispatch(tr)
  } catch (e) {
    console.error('Failed to load subpages:', e)
  }
}

// ─── Save subpage order to backend ───────────────────────────────
let _reorderTimeout = null

function scheduleSubpageReorder(pageId, orderedIds) {
  if (_reorderTimeout) clearTimeout(_reorderTimeout)
  _reorderTimeout = setTimeout(async () => {
    _reorderTimeout = null
    try {
      await fetch(`/api/pages/${pageId}/reorder-subpages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageIds: orderedIds }),
        credentials: 'same-origin',
      })
    } catch (e) {
      console.error('Reorder failed:', e)
    }
  }, 600)
}

// ─── Extract pageReference node order from editor ────────────────
function getSubpageOrder(editor) {
  const ids = []
  editor.state.doc.descendants(node => {
    if (node.type.name === 'pageReference' && node.attrs.pageId) {
      ids.push(node.attrs.pageId)
    }
  })
  return ids
}

// ─── Page-reference click handler (double-click to open) ─────────
function setupPageReferenceClicks() {
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

// ─── Callout context menus (emoji + color) ───────────────────────
let calloutMenuEl = null
let calloutMenuTarget = null // 'icon' or 'color'
let calloutMenuCalloutEl = null

function closeCalloutMenu() {
  if (calloutMenuEl) { calloutMenuEl.style.display = 'none'; calloutMenuEl.innerHTML = '' }
  calloutMenuTarget = null
  calloutMenuCalloutEl = null
}

function openCalloutIconMenu(btn, calloutEl) {
  const editor = findEditorForElement(calloutEl)
  if (!editor) return
  const currentIcon = calloutEl.getAttribute('data-icon') || ''
  if (!calloutMenuEl) {
    calloutMenuEl = document.createElement('div')
    calloutMenuEl.className = 'callout-menu'
    document.body.appendChild(calloutMenuEl)
  }
  const rect = btn.getBoundingClientRect()
  calloutMenuEl.style.cssText = 'position:fixed;z-index:100000;display:block;left:' + Math.max(0, rect.left) + 'px;top:' + (rect.bottom + 4) + 'px;max-height:260px;overflow-y:auto;width:280px;'
  calloutMenuTarget = 'icon'
  calloutMenuCalloutEl = calloutEl

  calloutMenuEl.innerHTML = '<div class="callout-menu-grid">' +
    calloutEmojis.map(e =>
      '<button class="callout-menu-item' + (e === currentIcon ? ' active' : '') + '" data-value="' + e + '">' + e + '</button>'
    ).join('') + '</div>'

  calloutMenuEl.querySelectorAll('.callout-menu-item').forEach(btn => {
    btn.onclick = () => {
      const emoji = btn.dataset.value
      const ed = findEditorForElement(calloutEl)
      if (ed) updateCalloutAttr(ed, calloutEl, 'icon', emoji)
      closeCalloutMenu()
    }
  })
}

function openCalloutColorMenu(btn, calloutEl) {
  const editor = findEditorForElement(calloutEl)
  if (!editor) return
  const currentType = calloutEl.getAttribute('data-type') || 'info'
  if (!calloutMenuEl) {
    calloutMenuEl = document.createElement('div')
    calloutMenuEl.className = 'callout-menu'
    document.body.appendChild(calloutMenuEl)
  }
  const rect = btn.getBoundingClientRect()
  calloutMenuEl.style.cssText = 'position:fixed;z-index:100000;display:block;left:' + Math.max(0, rect.left) + 'px;top:' + (rect.bottom + 4) + 'px;'
  calloutMenuTarget = 'color'
  calloutMenuCalloutEl = calloutEl

  calloutMenuEl.innerHTML = '<div class="callout-menu-grid callout-menu-colors">' +
    calloutTypes.map(ct =>
      '<button class="callout-menu-color' + (ct.id === currentType ? ' active' : '') + '" data-value="' + ct.id + '" title="' + ct.label + '">' +
        '<span class="callout-swatch" style="background:' + ct.color + '"></span>' +
        '<span class="callout-label">' + ct.label + '</span>' +
      '</button>'
    ).join('') + '</div>'

  calloutMenuEl.querySelectorAll('.callout-menu-color').forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.value
      const ed = findEditorForElement(calloutEl)
      if (ed) updateCalloutAttr(ed, calloutEl, 'type', type)
      closeCalloutMenu()
    }
  })
}

function findEditorForElement(el) {
  return Array.from(instances.values()).find(i => i.editor?.view?.dom?.contains(el))?.editor || null
}

function setupCalloutMenus() {
  document.addEventListener('click', function handler(e) {
    // Icon button click
    const iconBtn = e.target.closest('[data-callout-icon]')
    if (iconBtn) {
      e.preventDefault()
      const calloutEl = iconBtn.closest('[data-callout]')
      if (!calloutEl) return
      if (calloutMenuTarget === 'icon' && calloutMenuCalloutEl === calloutEl && calloutMenuEl?.style.display !== 'none') {
        closeCalloutMenu()
        return
      }
      closeCalloutMenu()
      openCalloutIconMenu(iconBtn, calloutEl)
      return
    }

    // Color button click
    const colorBtn = e.target.closest('[data-callout-color]')
    if (colorBtn) {
      e.preventDefault()
      const calloutEl = colorBtn.closest('[data-callout]')
      if (!calloutEl) return
      if (calloutMenuTarget === 'color' && calloutMenuCalloutEl === calloutEl && calloutMenuEl?.style.display !== 'none') {
        closeCalloutMenu()
        return
      }
      closeCalloutMenu()
      openCalloutColorMenu(colorBtn, calloutEl)
      return
    }

    // Click outside the callout menu — close it
    if (calloutMenuTarget && calloutMenuEl && !calloutMenuEl.contains(e.target)) {
      closeCalloutMenu()
    }
  })
}

// ─── Slash item definitions ──────────────────────────────────────
const slashItems = [
  { title: 'Text',          desc: 'Plain paragraph',           icon: 'Aa',  md: '',                              run: e => e.chain().focus().clearNodes().setParagraph().run() },
  { title: 'Heading 1',     desc: 'Large heading',             icon: 'H1',  md: '#',                             run: e => e.chain().focus().clearNodes().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2',     desc: 'Medium heading',            icon: 'H2',  md: '##',                            run: e => e.chain().focus().clearNodes().toggleHeading({ level: 2 }).run() },
  { title: 'Heading 3',     desc: 'Small heading',             icon: 'H3',  md: '###',                           run: e => e.chain().focus().clearNodes().toggleHeading({ level: 3 }).run() },
  { title: 'Bullet List',   desc: 'Unordered items',           icon: '•',   md: '- ',                            run: e => e.chain().focus().clearNodes().toggleBulletList().run() },
  { title: 'Numbered List', desc: 'Ordered items',             icon: '1.',  md: '1. ',                           run: e => e.chain().focus().clearNodes().toggleOrderedList().run() },
  { title: 'Task List',     desc: 'Checklist',                 icon: '☑',   md: '[ ]',                           run: e => e.chain().focus().clearNodes().toggleTaskList().run() },
  { title: 'Quote',         desc: 'Blockquote',                icon: '"',   md: '> ',                            run: e => e.chain().focus().clearNodes().toggleBlockquote().run() },
  { title: 'Code Block',    desc: 'Code fence',                icon: '</>', md: '```',                           run: e => e.chain().focus().clearNodes().toggleCodeBlock().run() },
  { title: 'Divider',       desc: 'Horizontal rule',           icon: '—',   md: '---',                           run: e => e.chain().focus().setHorizontalRule().run() },
  { title: 'Image',         desc: 'Upload an image',            icon: '🖼️',  md: '',                              run: e => { triggerImageUpload(e); } },
  { title: 'Table',         desc: 'Insert a 3×3 table',         icon: '⊞',   md: '',                              run: e => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { title: 'Callout',       desc: 'Colored callout box',        icon: '📌',  md: '',                              run: e => e.chain().focus().clearNodes().setCallout().run() },
  { title: 'Toggle',        desc: 'Insert collapsible section',  icon: '▶',  md: '',                              run: (e, pos) => {
    // Inside a container (toggle/callout): insert child. Top-level: insert as sibling.
    const { $from } = e.state.selection
    let inside = false
    for (let d = $from.depth; d > 0; d--) { if ($from.node(d).type.spec.defining) { inside = true; break } }
    if (inside) {
      e.chain().insertContent({ type: 'toggle', attrs: {}, content: [{ type: 'paragraph' }] }).run()
    } else {
      e.chain().focus().clearNodes().setToggle().run()
    }
  } },
  { title: 'Subpage',       desc: 'Create a child page',          icon: '📄',  md: '',                              run: async (e) => {
    // Create a subpage (child page) via Blazor interop, then insert a page-reference block
    const inst = Array.from(instances.values()).find(i => i.editor === e)
    if (inst && inst.dotNetRef) {
      try {
        const result = await inst.dotNetRef.invokeMethodAsync('CreateSubpage', inst.blockId)
        if (result && result.id) {
          e.chain().focus().insertContent({
            type: 'pageReference',
            attrs: { pageId: result.id, title: result.title, icon: result.icon || '📄' }
          }).run()
        }
      } catch (err) {
        console.error('CreateSubpage error:', err)
      }
    }
  } },
]

// ─── Image upload (one-off) ─────────────────────────────────────
let imageInputEl = null

function ensureImageInput() {
  if (imageInputEl) return imageInputEl
  imageInputEl = document.createElement('input')
  imageInputEl.type = 'file'
  imageInputEl.accept = 'image/*'
  imageInputEl.style.cssText = 'display:none'
  document.body.appendChild(imageInputEl)
  return imageInputEl
}

async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  try {
    const r = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!r.ok) throw new Error('Upload failed')
    return (await r.json()).url
  } catch (e) {
    console.error('Upload error:', e)
    return null
  }
}

// ─── Slash menu (module-level singleton) ────────────────────────
let slashMenuEl = null
let slashActive = false
let slashIdx = 0
let slashFrom = -1
let slashQuery = ''
let slashEditor = null

function getLineText(doc, pos) {
  const resolved = doc.resolve(pos)
  if (!resolved) return ''
  try {
    return doc.textBetween(resolved.start(), pos)
  } catch {
    return ''
  }
}

function scrollActiveIntoView(el) {
  const active = el?.querySelector('.active')
  if (active) active.scrollIntoView({ block: 'nearest' })
}

function renderSlash() {
  if (!slashMenuEl) return
  const q = slashQuery.toLowerCase()
  const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
  slashMenuEl.innerHTML = items.map((it, i) =>
    `<button class="slash-item${i === slashIdx ? ' active' : ''}" data-idx="${i}">` +
    `<span class="slash-icon">${it.icon}</span>` +
    `<span class="slash-text"><strong>${it.title}</strong><span class="slash-desc">${it.desc}</span></span>` +
    (it.md ? `<span class="slash-md">${it.md}</span>` : '') +
    `</button>`
  ).join('')
  slashMenuEl.querySelectorAll('.slash-item').forEach(btn => {
    const idx = parseInt(btn.dataset.idx, 10)
    if (isNaN(idx)) return
    btn.onclick = e => { e.stopPropagation(); slashIdx = idx; runSlashItem() }
    btn.onmouseenter = () => { slashIdx = idx; renderSlash() }
  })
  scrollActiveIntoView(slashMenuEl)
}

function closeSlash() {
  if (slashMenuEl) { slashMenuEl.style.display = 'none'; slashMenuEl.innerHTML = '' }
  slashActive = false
  slashFrom = -1
  slashQuery = ''
  slashEditor = null
}

function openSlash(editor) {
  slashEditor = editor
  const { view, state } = editor
  const { from } = state.selection
  slashFrom = state.doc.resolve(from).start()
  if (!slashMenuEl) {
    slashMenuEl = document.createElement('div')
    slashMenuEl.className = 'slash-menu'
    slashMenuEl.style.cssText = 'position:fixed;z-index:100000;'
    document.body.appendChild(slashMenuEl)
  }
  const coords = view.coordsAtPos(from)
  slashMenuEl.style.left = Math.max(0, coords.left) + 'px'
  slashMenuEl.style.top = (coords.bottom + 4) + 'px'
  slashMenuEl.style.display = 'block'
  slashIdx = 0
  slashQuery = ''
  slashActive = true
  renderSlash()
}

function checkSlash(editor) {
  if (!editor) return
  const { doc, selection } = editor.state
  const { $from } = selection
  const inCodeBlock = $from.parent.type.name === 'codeBlock'
  if (inCodeBlock) {
    if (slashActive) closeSlash()
    return
  }
  if (!editor.isFocused) return
  const from = $from.pos
  const text = getLineText(doc, from)
  if (text === '/' && !slashActive) { openSlash(editor); return }
  if (slashActive) {
    if (text.startsWith('/')) {
      const q = text.slice(1)
      if (q !== slashQuery) { slashQuery = q; slashIdx = 0; renderSlash() }
    } else { closeSlash() }
  }
}

function runSlashItem() {
  if (!slashActive || !slashMenuEl) return
  const items = slashItems.filter(i => i.title.toLowerCase().includes(slashQuery) || i.desc.toLowerCase().includes(slashQuery))
  const item = items[slashIdx]
  if (!item) { closeSlash(); return }
  const ed = slashEditor
  if (!ed) { closeSlash(); return }
  const { view } = ed
  const from = view.state.selection.from
  const delFrom = slashFrom
  closeSlash()
  try {
    view.dispatch(view.state.tr.delete(delFrom, from))
    item.run(ed)
    ed.commands.focus()
  } catch (err) {
    console.error('runSlashItem error:', err)
  }
}

// ─── Wiki-link [[ autocomplete ───────────────────────────────────
let wikiMenuEl = null
let wikiActive = false
let wikiFrom = -1
let wikiQuery = ''
let wikiIdx = 0
let wikiItems = []
let wikiEditor = null
let wikiSearchTimeout = null

function renderWiki() {
  if (!wikiMenuEl) return
  const q = wikiQuery.toLowerCase()
  const filtered = wikiItems.filter(i =>
    i.title.toLowerCase().includes(q) ||
    (i.snippet && i.snippet.toLowerCase().includes(q))
  )
  if (!filtered.length) { wikiMenuEl.style.display = 'none'; return }
  wikiMenuEl.innerHTML = filtered.map((it, i) =>
    `<button class="wiki-item${i === wikiIdx ? ' active' : ''}" data-idx="${i}">` +
    `<span class="wiki-icon">${it.icon || '📄'}</span>` +
    `<span class="wiki-text"><strong>${it.title}</strong></span></button>`
  ).join('')
  wikiMenuEl.querySelectorAll('.wiki-item').forEach(btn => {
    const idx = parseInt(btn.dataset.idx, 10)
    if (isNaN(idx)) return
    btn.onclick = e => { e.stopPropagation(); wikiIdx = idx; runWikiItem() }
    btn.onmouseenter = () => { wikiIdx = idx; renderWiki() }
  })
  wikiMenuEl.style.display = 'block'
  scrollActiveIntoView(wikiMenuEl)
}

function closeWiki() {
  if (wikiMenuEl) { wikiMenuEl.style.display = 'none'; wikiMenuEl.innerHTML = '' }
  wikiActive = false
  wikiFrom = -1
  wikiQuery = ''
  wikiIdx = 0
  wikiItems = []
  wikiEditor = null
  if (wikiSearchTimeout) { clearTimeout(wikiSearchTimeout); wikiSearchTimeout = null }
}

function openWiki(editor, fromPos) {
  wikiEditor = editor
  wikiFrom = fromPos
  wikiQuery = ''
  wikiIdx = 0
  wikiItems = []
  if (!wikiMenuEl) {
    wikiMenuEl = document.createElement('div')
    wikiMenuEl.className = 'wiki-menu'
    wikiMenuEl.style.cssText = 'position:fixed;z-index:100000;max-height:240px;overflow-y:auto;'
    document.body.appendChild(wikiMenuEl)
  }
  const { view } = editor
  const coords = view.coordsAtPos(fromPos)
  wikiMenuEl.style.left = Math.max(0, coords.left) + 'px'
  wikiMenuEl.style.top = (coords.bottom + 4) + 'px'
  wikiActive = true
  fetchWikiSuggestions('')
}

function fetchWikiSuggestions(query) {
  if (wikiSearchTimeout) clearTimeout(wikiSearchTimeout)
  wikiSearchTimeout = setTimeout(async () => {
    wikiSearchTimeout = null
    try {
      const r = await fetch('/api/search?q=' + encodeURIComponent(query), { credentials: 'same-origin' })
      if (!r.ok) return
      const data = await r.json()
      if (!wikiActive) return
      wikiItems = (data.pages && Array.isArray(data.pages)) ? data.pages : []
      renderWiki()
    } catch { /* network err — close */ if (wikiActive) closeWiki() }
  }, 200)
}

function runWikiItem() {
  if (!wikiActive || !wikiMenuEl || !wikiEditor) return
  const q = wikiQuery.toLowerCase()
  const filtered = wikiItems.filter(i =>
    i.title.toLowerCase().includes(q) ||
    (i.snippet && i.snippet.toLowerCase().includes(q))
  )
  const item = filtered[wikiIdx]
  if (!item) { closeWiki(); return }
  const ed = wikiEditor
  const from = wikiFrom
  closeWiki()
  // The text at cursor: [[partial → complete to [[Full Title]]
  try {
    const { view } = ed
    const currentText = view.state.doc.textBetween(from, view.state.selection.from)
    const replaceText = '[[' + item.title + ']]'
    view.dispatch(view.state.tr.replaceWith(
      from, view.state.selection.from,
      view.state.schema.text(replaceText)
    ))
    ed.commands.focus()
  } catch { /* ignore */ }
}

function checkWiki(editor) {
  if (!editor || !editor.isFocused) return
  const { doc, selection } = editor.state
  const { $from } = selection
  const inCodeBlock = $from.parent.type.name === 'codeBlock'
  if (inCodeBlock) { if (wikiActive) closeWiki(); return }

  const from = $from.pos
  // Look back up to 100 chars for [[query pattern
  const start = Math.max(0, from - 100)
  const textBefore = doc.textBetween(start, from)

  // Find last [[ in textBefore; must not have ]] after it
  const lastOpen = textBefore.lastIndexOf('[[')
  if (lastOpen !== -1) {
    const afterOpen = textBefore.slice(lastOpen + 2)
    if (afterOpen.indexOf(']]') === -1) {
      // We are inside [[ ... (unclosed)
      const query = afterOpen
      const absPos = start + lastOpen

      if (!wikiActive) {
        openWiki(editor, absPos + 2) // pos after [[
      }

      if (query !== wikiQuery) {
        wikiQuery = query
        wikiIdx = 0
        fetchWikiSuggestions(query)
      }
      return
    }
  }

  // Close wiki if we moved away from the [[ context
  if (wikiActive) {
    // Check if wikiFrom is still on the same line and [[ is still there
    if (wikiFrom > 0) {
      const aroundWiki = doc.textBetween(Math.max(0, wikiFrom - 2), Math.min(doc.content.size, wikiFrom + 50))
      if (!aroundWiki.startsWith('[[') || aroundWiki.includes(']]')) { closeWiki(); return }
      // Only close if cursor moved before wikiFrom
      if (from < wikiFrom) { closeWiki(); return }
    } else {
      closeWiki()
    }
  }
}

// ─── Table Floating Bubble Menu ────────────────────────────────
function closeTableBubbleMenu(elementId) {
  const inst = instances.get(elementId)
  if (inst && inst.tableMenuEl) {
    inst.tableMenuEl.remove()
    inst.tableMenuEl = null
  }
}

function updateTableBubbleMenu(editor, elementId) {
  const inst = instances.get(elementId)
  if (!inst) return

  const { state, view } = editor
  const { selection } = state
  const isTableActive = state.schema.nodes.table && editor.isActive('table')

  if (!isTableActive) {
    closeTableBubbleMenu(elementId)
    return
  }

  // Find the selected cell or parent cell element
  const cellPos = selection.$from.pos
  let cellDOM = null
  try {
    cellDOM = view.nodeDOM(selection.$from.before(selection.$from.depth))
  } catch (e) {}

  if (!cellDOM || !cellDOM.closest) {
    // Fallback: look for parent td/th in DOM
    const selectionDOM = window.getSelection()?.anchorNode
    if (selectionDOM) {
      cellDOM = selectionDOM.closest ? selectionDOM.closest('td, th') : selectionDOM.parentElement?.closest('td, th')
    }
  }

  if (!cellDOM) {
    closeTableBubbleMenu(elementId)
    return
  }

  // Create table menu element if not exists
  if (!inst.tableMenuEl) {
    const menu = document.createElement('div')
    menu.className = 'table-bubble-menu'
    menu.style.cssText = 'position:fixed;z-index:99999;display:flex;gap:4px;padding:4px;background:var(--card-bg, #ffffff);border:1px solid var(--border, rgba(0,0,0,0.12));border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.1);'
    menu.innerHTML = `
      <button class="table-menu-btn" data-action="addRowAfter" title="Add Row Below">➕ Row</button>
      <button class="table-menu-btn" data-action="deleteRow" title="Delete Row">❌ Row</button>
      <button class="table-menu-btn" data-action="addColumnAfter" title="Add Column Right">➕ Col</button>
      <button class="table-menu-btn" data-action="deleteColumn" title="Delete Column">❌ Col</button>
      <button class="table-menu-btn table-menu-btn-danger" data-action="deleteTable" title="Delete Table">🗑️ Table</button>
    `
    // Prevent menu clicks from blurring the editor
    menu.addEventListener('mousedown', e => e.preventDefault())
    menu.querySelectorAll('.table-menu-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault()
        const action = btn.dataset.action
        if (action && editor.commands[action]) {
          editor.chain().focus()[action]().run()
        }
      }
    })
    document.body.appendChild(menu)
    inst.tableMenuEl = menu
  }

  // Position the menu above the cell
  const rect = cellDOM.getBoundingClientRect()
  const menuRect = inst.tableMenuEl.getBoundingClientRect()
  const top = rect.top - menuRect.height - 8
  const left = rect.left + (rect.width / 2) - (menuRect.width / 2)

  inst.tableMenuEl.style.top = Math.max(8, top) + 'px'
  inst.tableMenuEl.style.left = Math.max(8, left) + 'px'
}


// ─── Per-instance state ─────────────────────────────────────────
const instances = new Map()

// ─── Dirty-flag save system ─────────────────────────────────
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
  // Flush each dirty instance in parallel (each self-throttled on success)
  await Promise.all(dirty.map(inst => flushInstance(inst)))
}

async function flushInstance(inst) {
  if (!inst._dirty || !inst.dotNetRef || !inst.editor) return
  const markdown = inst._pendingMarkdown ?? inst.editor.getMarkdown()
  try {
    await inst.dotNetRef.invokeMethodAsync('OnMarkdownChanged', inst.blockId, markdown)
    // Only clear dirty if the server accepted it.  The C# OnMarkdownChanged
    // guard (debounce / null page) may swallow the call; that's fine — the
    // next real edit will re-mark dirty.
    clearDirty(inst)
  } catch {
    // Leave dirty so a later timer or beforeunload retry will flush it
  }
}

function scheduleFlush(inst, markdown) {
  markDirty(inst, markdown)
}

// Wire up beforeunload / pagehide so unsaved changes are flushed on navigation
// or tab close.  Both events fire even when the browser is being closed.
// We use navigator.sendBeacon — it's designed to survive page
// unload.  The content-type defaults to text/plain; for JSON we
// explicitly pass a Blob so the server receives the correct type.
// (fetch+keepalive also works in modern browsers; sendBeacon has
// better delivery guarantees during pagehide across all browsers.)
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
        // leave dirty — nothing more we can do at this point
      }
    }
  }
  window.addEventListener('beforeunload', handler)
  window.addEventListener('pagehide', handler)
}

// Run once at module load
setupFlushOnUnload()

function triggerImageUpload(editor) {
  const inp = ensureImageInput()
  inp.onchange = async () => {
    const file = inp.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) editor.chain().focus().setImage({ src: url }).run()
    inp.value = ''
  }
  inp.click()
}

function handleKeyDown() {
  return (view, event) => {
    // Wiki menu takes priority
    if (wikiActive && wikiMenuEl && wikiMenuEl.style.display !== 'none') {
      const q = wikiQuery.toLowerCase()
      const filtered = wikiItems.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.snippet && i.snippet.toLowerCase().includes(q))
      )
      switch (event.key) {
        case 'ArrowDown':
          if (!filtered.length) return true
          event.preventDefault(); wikiIdx = (wikiIdx + 1) % filtered.length; renderWiki(); return true
        case 'ArrowUp':
          if (!filtered.length) return true
          event.preventDefault(); wikiIdx = (wikiIdx - 1 + filtered.length) % filtered.length; renderWiki(); return true
        case 'Enter': case 'Tab':
          event.preventDefault(); runWikiItem(); return true
        case 'Escape':
          event.preventDefault(); closeWiki(); return true
      }
    }

    // Slash menu second
    if (slashActive) {
      const items = slashItems.filter(i => i.title.toLowerCase().includes(slashQuery) || i.desc.toLowerCase().includes(slashQuery))
      const handled = ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape']
      if (!items.length && !handled.includes(event.key)) return false
      switch (event.key) {
        case 'ArrowDown':
          if (!items.length) return true
          event.preventDefault(); slashIdx = (slashIdx + 1) % items.length; renderSlash(); return true
        case 'ArrowUp':
          if (!items.length) return true
          event.preventDefault(); slashIdx = (slashIdx - 1 + items.length) % items.length; renderSlash(); return true
        case 'Enter': case 'Tab':
          event.preventDefault(); runSlashItem(); return true
        case 'Escape':
          event.preventDefault(); closeSlash(); return true
        default:
          return false
      }
    }

    return false
  }
}

// ─── Safe Blazor invoke ─────────────────────────────────────────
function invokeCb(dotNetRef, method, ...args) {
  if (!dotNetRef) return
  try {
    dotNetRef.invokeMethodAsync(method, ...args).catch(() => { /* circuit gone */ })
  } catch {
    /* noop */
  }
}

// ─── Public API ──────────────────────────────────────────────────
export function createEditor(elementId, content, dotNetRef, blockId) {
  destroyEditor(elementId)

  const el = document.getElementById(elementId)
  if (!el) return null

  const inst = { dotNetRef, blockId, firstUpdate: true, editor: null, listeners: [], _lastSubpageOrder: 'pending' }

  const editor = new Editor({
    element: el,
    extensions: [
      StarterKit.configure({
        codeBlock: true,
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: true, autolink: false, HTMLAttributes: { class: 'wiki-link' } }),
      Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'editor-image' } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Type '/' for commands…" }),
      GapCursor,
      Markdown.configure({
        html: true,
        transformCopiedText: true,
        transformPastedText: true,
      }),
      DragHandle.configure({
        // nested: false — drag handle shows on top-level blocks only.
        // Inner blocks inside toggles/callouts aren't independently draggable,
        // which matches Notion behavior and avoids upstream nested bugs.
        nested: false,
        render() {
          const el = document.createElement('div')
          el.classList.add('drag-handle')
          el.innerHTML = '⣿'
          el.title = 'Drag to reorder'
          return el
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Callout,
      Toggle,
      PageReference,
    ],
    content: content || '',
    contentType: 'markdown',
    editorProps: {
      attributes: { class: 'tiptap-editor', 'data-block-id': blockId },
      handleKeyDown: handleKeyDown(),
      handlePaste(view, event) {
        const files = event.clipboardData?.files
        if (files && files[0]?.type.startsWith('image/')) {
          event.preventDefault()
          uploadImage(files[0]).then(url => {
            if (url) view.dispatch(view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create(null, { src: url })
            ))
          })
          return true
        }
        var text = event.clipboardData?.getData('text/plain')
        if (text && /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(text.trim())) {
          event.preventDefault()
          view.dispatch(view.state.tr.replaceSelectionWith(
            view.state.schema.nodes.image.create(null, { src: text.trim() })
          ))
          return true
        }
        // Paste markdown table text -> convert to table node
        if (text && /^\|[^\n]+\n\|[\s:-]+\|/.test(text.trim())) {
          event.preventDefault()
          try {
            var html = marked.parse(text.trim())
            view.pasteHTML(html, { event: event })
          } catch(e) { console.warn('table paste failed', e) }
          return true
        }
        return false
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files
        if (files && files[0]?.type.startsWith('image/')) {
          event.preventDefault()
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
          if (!pos) return true
          uploadImage(files[0]).then(url => {
            if (url) view.dispatch(view.state.tr.insert(
              pos.pos, view.state.schema.nodes.image.create(null, { src: url })
            ))
          })
          return true
        }
        return false
      },
    },
    onCreate: ({ editor: ed }) => {
      // Inject subpage blocks into the editor after content is loaded
      if (blockId) {
        loadAndInjectSubpages(ed, blockId).then(() => {
          // Record initial subpage order after injection
          inst._lastSubpageOrder = getSubpageOrder(ed).join(',')
        })
      }
    },
    onUpdate: ({ editor: ed, transaction }) => {
      // Skip if this transaction was a subpage injection
      if (transaction?.getMeta('subpageInject')) return
      // First onUpdate fires during editor construction — skip it (initial parse)
      if (inst.firstUpdate) { inst.firstUpdate = false; return }
      scheduleFlush(inst, ed.getMarkdown())
      checkSlash(ed)
      checkWiki(ed)
      updateTableBubbleMenu(ed, elementId)
      // Detect subpage reorder and save to backend
      if (inst.blockId && ed.state.doc.childCount > 0) {
        const order = getSubpageOrder(ed)
        const orderKey = order.join(',')
        if (inst._lastSubpageOrder !== 'pending' && order.length > 0 && orderKey !== inst._lastSubpageOrder) {
          inst._lastSubpageOrder = orderKey
          scheduleSubpageReorder(inst.blockId, order)
        }
      }
    },
    onSelectionUpdate: ({ editor: ed }) => {
      if (slashActive) checkSlash(ed)
      if (wikiActive) checkWiki(ed)
      updateTableBubbleMenu(ed, elementId)
    },
    onFocus: () => invokeCb(inst.dotNetRef, 'OnFocus', inst.blockId),
    onBlur: () => {
      if (slashActive) closeSlash()
      if (wikiActive) closeWiki()
      closeTableBubbleMenu(elementId)
      invokeCb(inst.dotNetRef, 'OnBlur', inst.blockId)
    },
  })

  inst.editor = editor
  inst.tableMenuEl = null

  // Image upload button
  const uploadBtn = document.getElementById('btn-upload-image')
  if (uploadBtn) {
    const inp = ensureImageInput()
    inp.onchange = async () => {
      const file = inp.files?.[0]
      if (!file) return
      const ed = instances.get(elementId)?.editor
      if (!ed) return
      const url = await uploadImage(file)
      if (url) ed.chain().focus().setImage({ src: url }).run()
      inp.value = ''
    }
    uploadBtn.onclick = () => inp.click()
  }

  // Outside-click handlers
  const onOutsideClick = function(e) {
    if (calloutMenuTarget && calloutMenuEl && !calloutMenuEl.contains(e.target) &&
        !e.target.closest('[data-callout-icon]') && !e.target.closest('[data-callout-color]')) {
      const calloutEl = e.target.closest('[data-callout]')
      if (!calloutEl || calloutEl !== calloutMenuCalloutEl) closeCalloutMenu()
    }
    if (slashActive && slashMenuEl && !slashMenuEl.contains(e.target) && !el.contains(e.target)) closeSlash()
    if (wikiActive && wikiMenuEl && !wikiMenuEl.contains(e.target) && !el.contains(e.target)) closeWiki()
  }
  document.addEventListener('mousedown', onOutsideClick)
  inst.listeners.push({ type: 'mousedown', handler: onOutsideClick })

  instances.set(elementId, inst)
  return editor
}

export function destroyEditor(elementId) {
  const inst = instances.get(elementId)
  if (!inst) return
  // Clear any pending save so a destroyed editor doesn't leak timers
  inst._dirty = false
  inst._pendingMarkdown = null
  closeTableBubbleMenu(elementId)
  inst.listeners.forEach(l => document.removeEventListener(l.type, l.handler))
  inst.listeners = []
  // Kill Blazor ref BEFORE destroying editor — editor.destroy() fires
  // onBlur/onUpdate callbacks that would invoke on a stale ref
  inst.dotNetRef = null
  if (inst.editor) { inst.editor.destroy(); inst.editor = null }
  instances.delete(elementId)
  // Clear the global flush timer if no more dirty instances remain
  if (![...instances.values()].some(i => i._dirty)) {
    if (_flushTimer) { clearTimeout(_flushTimer); _flushTimer = null }
  }
}

// ─── Utility exports ────────────────────────────────────────────
export function getMarkdown(elementId) { return instances.get(elementId)?.editor?.getMarkdown() ?? '' }
export function setContent(elementId, content) { instances.get(elementId)?.editor?.commands.setContent(content, false, 'markdown') }
export function setEditable(elementId, editable) { instances.get(elementId)?.editor?.setEditable(editable) }
export function focusEditor(elementId) { instances.get(elementId)?.editor?.commands.focus() }
export function blurEditor(elementId) { instances.get(elementId)?.editor?.commands.blur() }

window.initTipTap = createEditor
window.destroyTipTap = destroyEditor
window.getTipTapMarkdown = getMarkdown
window.setTipTapContent = setContent
window.setTipTapEditable = setEditable
window.focusTipTap = focusEditor
window.blurTipTap = blurEditor
setupCalloutMenus()
setupToggleClicks()
setupPageReferenceClicks()
