import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Markdown } from '@tiptap/markdown'
import Placeholder from '@tiptap/extension-placeholder'

// ─── Slash item definitions ──────────────────────────────────────
const slashItems = [
  { title: 'Text',          desc: 'Plain paragraph',           icon: 'Aa',  run: e => e.chain().focus().clearNodes().setParagraph().run() },
  { title: 'Heading 1',     desc: 'Large heading',             icon: 'H1',  run: e => e.chain().focus().clearNodes().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2',     desc: 'Medium heading',            icon: 'H2',  run: e => e.chain().focus().clearNodes().toggleHeading({ level: 2 }).run() },
  { title: 'Heading 3',     desc: 'Small heading',             icon: 'H3',  run: e => e.chain().focus().clearNodes().toggleHeading({ level: 3 }).run() },
  { title: 'Bullet List',   desc: 'Unordered items',           icon: '•',   run: e => e.chain().focus().clearNodes().toggleBulletList().run() },
  { title: 'Numbered List', desc: 'Ordered items',             icon: '1.',  run: e => e.chain().focus().clearNodes().toggleOrderedList().run() },
  { title: 'Task List',     desc: 'Checklist',                 icon: '☑',   run: e => e.chain().focus().clearNodes().toggleTaskList().run() },
  { title: 'Quote',         desc: 'Blockquote',                icon: '"',   run: e => e.chain().focus().clearNodes().toggleBlockquote().run() },
  { title: 'Code Block',    desc: 'Code fence',                icon: '</>', run: e => e.chain().focus().clearNodes().toggleCodeBlock().run() },
  { title: 'Divider',       desc: 'Horizontal rule',           icon: '—',   run: e => e.chain().focus().setHorizontalRule().run() },
  { title: 'Image',         desc: 'Upload an image',            icon: '🖼️',  run: e => { triggerImageUpload(e); } },
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

function scrollActiveIntoView() {
  const active = slashMenuEl?.querySelector('.slash-item.active')
  if (active) active.scrollIntoView({ block: 'nearest' })
}

function renderSlash() {
  if (!slashMenuEl) return
  const q = slashQuery.toLowerCase()
  const items = slashItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
  slashMenuEl.innerHTML = items.map((it, i) =>
    `<button class="slash-item${i === slashIdx ? ' active' : ''}" data-idx="${i}">` +
    `<span class="slash-icon">${it.icon}</span>` +
    `<span class="slash-text"><strong>${it.title}</strong><span class="slash-desc">${it.desc}</span></span></button>`
  ).join('')
  slashMenuEl.querySelectorAll('.slash-item').forEach(btn => {
    const idx = parseInt(btn.dataset.idx, 10)
    if (isNaN(idx)) return
    btn.onclick = e => { e.stopPropagation(); slashIdx = idx; runSlashItem() }
    btn.onmouseenter = () => { slashIdx = idx; renderSlash() }
  })
  scrollActiveIntoView()
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

// ─── Per-instance state ─────────────────────────────────────────
const instances = new Map()

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
    if (!slashActive) return false
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

  const inst = { dotNetRef, blockId, firstUpdate: true, editor: null, listeners: [] }

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
      // StarterKit codeBlock already enabled (codeBlock: true by default)
      Placeholder.configure({ placeholder: "Type '/' for commands…" }),
      Markdown.configure({ html: false }),
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
        const text = event.clipboardData?.getData('text/plain')
        if (text && /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(text.trim())) {
          event.preventDefault()
          view.dispatch(view.state.tr.replaceSelectionWith(
            view.state.schema.nodes.image.create(null, { src: text.trim() })
          ))
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
    onUpdate: ({ editor: ed }) => {
      // First onUpdate fires during editor construction — skip it (initial parse)
      if (inst.firstUpdate) { inst.firstUpdate = false; return }
      invokeCb(inst.dotNetRef, 'OnMarkdownChanged', inst.blockId, ed.getMarkdown())
      checkSlash(ed)
    },
    onSelectionUpdate: ({ editor: ed }) => {
      if (slashActive) checkSlash(ed)
    },
    onFocus: () => invokeCb(inst.dotNetRef, 'OnFocus', inst.blockId),
    onBlur: () => {
      if (slashActive) closeSlash()
      invokeCb(inst.dotNetRef, 'OnBlur', inst.blockId)
    },
  })

  inst.editor = editor

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

  // Outside-click handler
  const onOutsideClick = function(e) {
    if (slashActive && slashMenuEl && !slashMenuEl.contains(e.target) && !el.contains(e.target)) closeSlash()
  }
  document.addEventListener('mousedown', onOutsideClick)
  inst.listeners.push({ type: 'mousedown', handler: onOutsideClick })

  instances.set(elementId, inst)
  return editor
}

export function destroyEditor(elementId) {
  const inst = instances.get(elementId)
  if (!inst) return
  inst.listeners.forEach(l => document.removeEventListener(l.type, l.handler))
  inst.listeners = []
  // Kill Blazor ref BEFORE destroying editor — editor.destroy() fires
  // onBlur/onUpdate callbacks that would invoke on a stale/stale ref
  inst.dotNetRef = null
  if (inst.editor) { inst.editor.destroy(); inst.editor = null }
  instances.delete(elementId)
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
