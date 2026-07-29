import { findEditorForElement } from './tiptap-extensions.js'

// ─── Slash Menu Items ───────────────────────────────────────────
export const slashItems = [
  { title: 'Text',          desc: 'Plain paragraph',           icon: 'Aa',  md: '',      run: e => e.chain().focus().clearNodes().setParagraph().run() },
  { title: 'Heading 1',     desc: 'Large heading',             icon: 'H1',  md: '#',     run: e => e.chain().focus().clearNodes().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2',     desc: 'Medium heading',            icon: 'H2',  md: '##',    run: e => e.chain().focus().clearNodes().toggleHeading({ level: 2 }).run() },
  { title: 'Heading 3',     desc: 'Small heading',             icon: 'H3',  md: '###',   run: e => e.chain().focus().clearNodes().toggleHeading({ level: 3 }).run() },
  { title: 'Bullet List',   desc: 'Unordered items',           icon: '•',   md: '- ',    run: e => e.chain().focus().clearNodes().toggleBulletList().run() },
  { title: 'Numbered List', desc: 'Ordered items',             icon: '1.',  md: '1. ',   run: e => e.chain().focus().clearNodes().toggleOrderedList().run() },
  { title: 'Task List',     desc: 'Checklist',                 icon: '☑',   md: '[ ]',   run: e => e.chain().focus().clearNodes().toggleTaskList().run() },
  { title: 'Quote',         desc: 'Blockquote',                icon: '"',   md: '> ',    run: e => e.chain().focus().clearNodes().toggleBlockquote().run() },
  { title: 'Code Block',    desc: 'Code fence',                icon: '</>', md: '```',   run: e => e.chain().focus().clearNodes().toggleCodeBlock().run() },
  { title: 'Divider',       desc: 'Horizontal rule',           icon: '—',   md: '---',   run: e => e.chain().focus().setHorizontalRule().run() },
  { title: 'Image',         desc: 'Upload an image',           icon: '🖼️',  md: '',      run: e => triggerImageUpload(e) },
  { title: 'Table',         desc: 'Insert a 3×3 table',        icon: '⊞',   md: '',      run: e => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { title: 'Callout',       desc: 'Colored callout box',       icon: '📌',  md: '',      run: e => e.chain().focus().clearNodes().setCallout().run() },
  { title: 'Toggle',        desc: 'Insert collapsible section', icon: '▶',   md: '',      run: (e, pos) => {
      const { $from } = e.state.selection
      let inside = false
      for (let d = $from.depth; d > 0; d--) { if ($from.node(d).type.spec.defining) { inside = true; break } }
      if (inside) {
        e.chain().insertContent({ type: 'toggle', attrs: {}, content: [{ type: 'paragraph' }] }).run()
      } else {
        e.chain().focus().clearNodes().setToggle().run()
      }
    }
  },
  { title: 'Status',        desc: 'Inline status badge',        icon: '🏷️',  md: '',      run: e => e.chain().focus().insertContent({ type: 'status', attrs: { status: 'todo' } }).run() },
  { title: 'Subpage',       desc: 'Create a child page',       icon: '📄',  md: '',      run: async (e) => {
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
    }
  },
]

// Store instances for slash items to access
const instances = new Map()
export function registerSlashInstance(id, inst) { instances.set(id, inst) }
export function unregisterSlashInstance(id) { instances.delete(id) }

// ─── Image Upload ───────────────────────────────────────────────
let imageInputEl = null

export function ensureImageInput() {
  if (imageInputEl) return imageInputEl
  imageInputEl = document.createElement('input')
  imageInputEl.type = 'file'
  imageInputEl.accept = 'image/*'
  imageInputEl.style.cssText = 'display:none'
  document.body.appendChild(imageInputEl)
  return imageInputEl
}

export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  try {
    const r = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
    if (!r.ok) throw new Error('Upload failed')
    return (await r.json()).url
  } catch (e) {
    console.error('Upload error:', e)
    return null
  }
}

export function triggerImageUpload(editor) {
  const input = ensureImageInput()
  input.onchange = async () => {
    const file = input.files[0]
    input.value = ''
    if (!file) return
    const url = await uploadImage(file)
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }
  input.click()
}

// ─── Slash Menu (module-level singleton) ────────────────────────
let slashMenuEl = null
let slashActive = false
let slashIdx = 0
let slashFrom = -1
let slashQuery = ''
let slashEditor = null

function getLineText(doc, pos) {
  const resolved = doc.resolve(pos)
  if (!resolved) return ''
  try { return doc.textBetween(resolved.start(), pos) } catch { return '' }
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
  if (inCodeBlock) { if (slashActive) closeSlash(); return }
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
  const q = slashQuery.toLowerCase()
  const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
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

export function setupSlashMenu(editor, instId) {
  registerSlashInstance(instId, editor)
  return {
    checkSlash: () => checkSlash(editor),
    cleanup: () => { unregisterSlashInstance(instId); closeSlash() },
    getState: () => ({ slashActive, slashMenuEl, slashQuery, slashItems, slashIdx }),
    closeSlash,
    renderSlash,
    runSlashItem,
    navNext: () => {
      const q = slashQuery.toLowerCase()
      const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
      if (!items.length) return
      slashIdx = (slashIdx + 1) % items.length
      renderSlash()
    },
    navPrev: () => {
      const q = slashQuery.toLowerCase()
      const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
      if (!items.length) return
      slashIdx = (slashIdx - 1 + items.length) % items.length
      renderSlash()
    },
  }
}

export function getSlashState() {
  return { slashActive, slashMenuEl, slashQuery, slashItems, slashIdx }
}

export function slashNavNext() {
  if (!slashItems.length) return
  const q = slashQuery.toLowerCase()
  const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
  if (!items.length) return
  slashIdx = (slashIdx + 1) % items.length
  renderSlash()
}

export function slashNavPrev() {
  if (!slashItems.length) return
  const q = slashQuery.toLowerCase()
  const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
  if (!items.length) return
  slashIdx = (slashIdx - 1 + items.length) % items.length
  renderSlash()
}

export { checkSlash, closeSlash, renderSlash, runSlashItem }