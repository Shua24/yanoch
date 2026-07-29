import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import GapCursor from '@tiptap/extension-gapcursor'
import { Markdown } from '@tiptap/markdown'
import { DragHandle } from '@tiptap/extension-drag-handle'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { marked } from 'marked'

// Custom extensions
import { Callout, Toggle, PageReference, findEditorForElement } from './tiptap-extensions.js'
import { Status, setupStatusMenus, updateStatusMenu, closeStatusMenu } from './tiptap-status-column.js'

// Modules
import { setupSlashMenu, getSlashState, closeSlash, triggerImageUpload, ensureImageInput, uploadImage, renderSlash, runSlashItem, slashNavNext, slashNavPrev, checkSlash } from './tiptap-slash-menu.js'
import { setupWikiAutocomplete, getWikiState, closeWiki, renderWiki, runWikiItem, wikiNavNext, wikiNavPrev, checkWiki } from './tiptap-wiki-autocomplete.js'
import { initCalloutMenus, getState as getCalloutState, closeCalloutMenu } from './tiptap-callout-menus.js'
import { closeTableBubbleMenu, updateTableBubbleMenu } from './tiptap-table-menu.js'
import { registerInstance, unregisterInstance, setupSaveManager, forceFlushAll, clearFlushTimer } from './tiptap-save-manager.js'

// Instance registry
const instances = new Map()

// Expose to window for status menu to find editors
window.tiptapInstances = instances

// Initialize global handlers
const calloutMenus = initCalloutMenus()
const statusMenus = setupStatusMenus()

// ─── Safe Blazor invoke ─────────────────────────────────────────
function invokeCb(dotNetRef, method, ...args) {
  if (!dotNetRef) return
  try {
    dotNetRef.invokeMethodAsync(method, ...args).catch(() => { /* circuit gone */ })
  } catch { /* noop */ }
}

// ─── Keyboard handler ───────────────────────────────────────────
function handleKeyDown() {
  return (view, event) => {
    const { state } = view
    const { selection } = state
    const { $from } = selection

    // Wiki menu takes priority
    const { wikiActive, wikiMenuEl, wikiQuery, wikiItems, wikiIdx } = getWikiState()
    if (wikiActive && wikiMenuEl && wikiMenuEl.style.display !== 'none') {
      const q = wikiQuery.toLowerCase()
      const filtered = wikiItems.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.snippet && i.snippet.toLowerCase().includes(q))
      )
      switch (event.key) {
        case 'ArrowDown':
          if (!filtered.length) return true
          event.preventDefault(); wikiNavNext(); return true
        case 'ArrowUp':
          if (!filtered.length) return true
          event.preventDefault(); wikiNavPrev(); return true
        case 'Enter': case 'Tab':
          event.preventDefault(); runWikiItem(); return true
        case 'Escape':
          event.preventDefault(); closeWiki(); return true
      }
    }

    // Slash menu second
    const { slashActive, slashMenuEl, slashQuery, slashItems, slashIdx } = getSlashState()
    if (slashActive) {
      const q = slashQuery.toLowerCase()
      const items = slashItems.filter(i =>
        i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)
      )
      const handled = ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape']
      if (!items.length && !handled.includes(event.key)) return false
      switch (event.key) {
        case 'ArrowDown':
          if (!items.length) return true
          event.preventDefault(); slashNavNext(); return true
        case 'ArrowUp':
          if (!items.length) return true
          event.preventDefault(); slashNavPrev(); return true
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

// ─── onUpdate handler ───────────────────────────────────────────
function handleUpdate(inst) {
  return ({ editor: ed, transaction }) => {
    if (transaction?.getMeta('subpageInject')) return
    if (inst.firstUpdate) { inst.firstUpdate = false; return }

    // Save markdown
    inst.saveManager.markDirty(ed.getMarkdown())

    // Update UI
    checkSlash(ed)
    checkWiki(ed)
    updateTableBubbleMenu(ed, inst)
    updateStatusMenu(ed, inst)

    // Subpage reorder
    if (inst.blockId && ed.state.doc.childCount > 0) {
      const order = getSubpageOrder(ed)
      const orderKey = order.join(',')
      if (inst._lastSubpageOrder !== 'pending' && order.length > 0 && orderKey !== inst._lastSubpageOrder) {
        inst._lastSubpageOrder = orderKey
        scheduleSubpageReorder(inst.blockId, order)
      }
    }
  }
}

// ─── onSelectionUpdate handler ──────────────────────────────────
function handleSelectionUpdate(inst) {
  return ({ editor: ed }) => {
    if (getSlashState().slashActive) checkSlash(ed)
    if (getWikiState().wikiActive) checkWiki(ed)
    updateTableBubbleMenu(ed, inst)
    updateStatusMenu(ed, inst)
  }
}

// ─── onFocus handler ────────────────────────────────────────────
function handleFocus(inst) {
  return () => {
    invokeCb(inst.dotNetRef, 'OnFocus', inst.blockId)
  }
}

// ─── onBlur handler ─────────────────────────────────────────────
function handleBlur(inst) {
  return () => {
    if (getSlashState().slashActive) closeSlash()
    if (getWikiState().wikiActive) closeWiki()
    closeTableBubbleMenu(inst)
    closeStatusMenu(inst)
    invokeCb(inst.dotNetRef, 'OnBlur', inst.blockId)
  }
}

// ─── Load subpages ──────────────────────────────────────────────
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
    tr.setMeta('subpageInject', true)
    editor.view.dispatch(tr)
  } catch (e) {
    console.error('Failed to load subpages:', e)
  }
}

// ─── Subpage order ──────────────────────────────────────────────
function getSubpageOrder(editor) {
  const ids = []
  editor.state.doc.descendants(node => {
    if (node.type.name === 'pageReference' && node.attrs.pageId) {
      ids.push(node.attrs.pageId)
    }
  })
  return ids
}

function scheduleSubpageReorder(pageId, orderedIds) {
  if (window._reorderTimeout) clearTimeout(window._reorderTimeout)
  window._reorderTimeout = setTimeout(async () => {
    window._reorderTimeout = null
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

// ─── Main editor creation ───────────────────────────────────────
export function createEditor(elementId, content, dotNetRef, blockId) {
  destroyEditor(elementId)

  const el = document.getElementById(elementId)
  if (!el) return null

  const inst = { dotNetRef, blockId, firstUpdate: true, editor: null, listeners: [], tableMenuEl: null }

  // Setup save manager
  inst.saveManager = setupSaveManager(inst)
  registerInstance(inst)

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
      Status,
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
        // Paste markdown table text -> convert to table node
        if (text && /^\|[^\n]+\n\|[\s:-]+\|/.test(text.trim())) {
          event.preventDefault()
          try {
            const html = marked.parse(text.trim())
            view.pasteHTML(html, { event: event })
          } catch (e) { console.warn('table paste failed', e) }
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
      if (blockId) {
        loadAndInjectSubpages(ed, blockId).then(() => {
          inst._lastSubpageOrder = getSubpageOrder(ed).join(',')
        })
      }
    },
    onUpdate: handleUpdate(inst),
    onSelectionUpdate: handleSelectionUpdate(inst),
    onFocus: handleFocus(inst),
    onBlur: handleBlur(inst),
  })

  inst.editor = editor

  // Image upload button
  const uploadBtn = document.getElementById('btn-upload-image')
  if (uploadBtn) {
    const input = ensureImageInput()
    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return
      const ed = instances.get(elementId)?.editor
      if (!ed) return
      const url = await uploadImage(file)
      if (url) ed.chain().focus().setImage({ src: url }).run()
      input.value = ''
    }
    uploadBtn.onclick = () => input.click()
  }

  // Outside-click handlers
  const onOutsideClick = function(e) {
    const { calloutMenuTarget, calloutMenuEl, calloutMenuCalloutEl } = getCalloutState()
    if (calloutMenuTarget && calloutMenuEl && !calloutMenuEl.contains(e.target) &&
        !e.target.closest('[data-callout-icon]') && !e.target.closest('[data-callout-color]')) {
      const calloutEl = e.target.closest('[data-callout]')
      if (!calloutEl || calloutEl !== calloutMenuCalloutEl) closeCalloutMenu()
    }
    if (getSlashState().slashActive && getSlashState().slashMenuEl && !getSlashState().slashMenuEl.contains(e.target) && !el.contains(e.target)) closeSlash()
    if (getWikiState().wikiActive && getWikiState().wikiMenuEl && !getWikiState().wikiMenuEl.contains(e.target) && !el.contains(e.target)) closeWiki()
  }
  document.addEventListener('mousedown', onOutsideClick)
  inst.listeners.push({ type: 'mousedown', handler: onOutsideClick })

  instances.set(elementId, inst)
  return editor
}

// ─── Editor destruction ─────────────────────────────────────────
export function destroyEditor(elementId) {
  const inst = instances.get(elementId)
  if (!inst) return

  inst.saveManager.cleanup()
  unregisterInstance(inst.blockId)

  closeTableBubbleMenu(inst)
  inst.listeners.forEach(l => document.removeEventListener(l.type, l.handler))
  inst.listeners = []

  // Kill Blazor ref BEFORE destroying editor
  inst.dotNetRef = null
  if (inst.editor) { inst.editor.destroy(); inst.editor = null }

  instances.delete(elementId)

  if (![...instances.values()].some(i => i._dirty)) {
    clearFlushTimer()
  }
}

// ─── Utility exports ────────────────────────────────────────────
export function getMarkdown(elementId) { return instances.get(elementId)?.editor?.getMarkdown() ?? '' }
export function setContent(elementId, content) { instances.get(elementId)?.editor?.commands.setContent(content, false, 'markdown') }
export function setEditable(elementId, editable) { instances.get(elementId)?.editor?.setEditable(editable) }
export function focusEditor(elementId) { instances.get(elementId)?.editor?.commands.focus() }
export function blurEditor(elementId) { instances.get(elementId)?.editor?.commands.blur() }

// ─── Window globals for Blazor interop ──────────────────────────
window.initTipTap = createEditor
window.destroyTipTap = destroyEditor
window.getTipTapMarkdown = getMarkdown
window.setTipTapContent = setContent
window.setTipTapEditable = setEditable
window.focusTipTap = focusEditor
window.blurTipTap = blurEditor