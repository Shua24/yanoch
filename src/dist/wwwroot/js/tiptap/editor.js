import { Editor } from '@tiptap/core'
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

import { instances } from './instances.js'
import { invokeCb } from './utils.js'
import { ensureImageInput, uploadImage } from './image.js'
import { loadAndInjectSubpages, scheduleSubpageReorder, getSubpageOrder } from './subpages.js'
import { scheduleFlush, checkClearFlushTimer, setupFlushOnUnload } from './save-system.js'
import { setupCalloutMenus, closeCalloutMenu, calloutMenuEl, calloutMenuTarget, calloutMenuCalloutEl } from './callout-menu.js'
import { handleSlashKeyDown, checkSlash, closeSlash, slashActive, slashMenuEl } from './slash-menu.js'
import { handleWikiKeyDown, checkWiki, closeWiki, wikiActive, wikiMenuEl } from './wiki-menu.js'
import { closeTableBubbleMenu, updateTableBubbleMenu } from './table-menu.js'
import { Callout } from './callout-node.js'
import { Toggle, setupToggleClicks } from './toggle-node.js'
import { PageReference, setupPageReferenceClicks } from './page-ref-node.js'
import { TodoList, setupTodoList } from './todo-list-node.js'

// ─── Key handler ───────────────────────────────────────────────
// Coordinates keyboard interactions between wiki and slash menus
function handleKeyDown() {
  return (view, event) => {
    // Wiki menu takes priority
    if (handleWikiKeyDown(event)) return true
    // Slash menu second
    if (handleSlashKeyDown(event)) return true
    return false
  }
}

// ─── Public API ────────────────────────────────────────────────
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
      TodoList,
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
    onUpdate: ({ editor: ed, transaction }) => {
      if (transaction?.getMeta('subpageInject')) return
      if (inst.firstUpdate) { inst.firstUpdate = false; return }
      scheduleFlush(inst, ed.getMarkdown())
      checkSlash(ed)
      checkWiki(ed)
      updateTableBubbleMenu(ed, elementId)
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
      closeSlash()
      closeWiki()
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
  const onOutsideClick = function (e) {
    if (calloutMenuTarget !== undefined && calloutMenuEl && !calloutMenuEl.contains(e.target) &&
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
  inst._dirty = false
  inst._pendingMarkdown = null
  closeTableBubbleMenu(elementId)
  inst.listeners.forEach(l => document.removeEventListener(l.type, l.handler))
  inst.listeners = []
  inst.dotNetRef = null
  if (inst.editor) { inst.editor.destroy(); inst.editor = null }
  instances.delete(elementId)
  checkClearFlushTimer()
}

// ─── Utility exports ───────────────────────────────────────────
export function getMarkdown(elementId) { return instances.get(elementId)?.editor?.getMarkdown() ?? '' }
export function setContent(elementId, content) { instances.get(elementId)?.editor?.commands.setContent(content, false, 'markdown') }
export function setEditable(elementId, editable) { instances.get(elementId)?.editor?.setEditable(editable) }
export function focusEditor(elementId) { instances.get(elementId)?.editor?.commands.focus() }
export function blurEditor(elementId) { instances.get(elementId)?.editor?.commands.blur() }

// ─── Window globals (for Blazor interop) ──────────────────────
window.initTipTap = createEditor
window.destroyTipTap = destroyEditor
window.getTipTapMarkdown = getMarkdown
window.setTipTapContent = setContent
window.setTipTapEditable = setEditable
window.focusTipTap = focusEditor
window.blurTipTap = blurEditor

// ─── Singleton setup (runs once at module init) ────────────────
setupCalloutMenus()
setupToggleClicks()
setupPageReferenceClicks()
setupTodoList()
setupFlushOnUnload()
