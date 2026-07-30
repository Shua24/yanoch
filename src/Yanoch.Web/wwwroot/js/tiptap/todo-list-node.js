import { Node, createBlockMarkdownSpec } from '@tiptap/core'
import { instances } from './instances.js'

// ─── Markdown serialisation ────────────────────────────────────
// ::todo-list {rows:[{"checked":false,"task":"","deadline":""}]}
// ::
const todoListMd = createBlockMarkdownSpec({
  nodeName: 'todoList',
  name: 'todoList',
  content: '',
  defaultAttributes: { rows: [] },
  allowedAttributes: ['rows'],
  parseAttributes(str) {
    if (!str) return {}
    const match = str.match(/rows=['"]([^'"]+)['"]/)
    if (!match) return {}
    try {
      return { rows: JSON.parse(decodeURIComponent(match[1])) }
    } catch {
      return {}
    }
  },
  serializeAttributes(attrs) {
    if (!attrs || !Array.isArray(attrs.rows) || attrs.rows.length === 0) return ''
    return `rows='${encodeURIComponent(JSON.stringify(attrs.rows))}'`
  },
})

// ─── Helpers ───────────────────────────────────────────────────
function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildTableHTML(rows) {
  if (!Array.isArray(rows)) rows = []
  const tbody = rows.map(r => `
    <tr>
      <td><input class="todo-task" type="text" value="${escapeHtml(r.task)}" placeholder="What needs doing?"></td>
      <td><input class="todo-deadline" type="text" value="${escapeHtml(r.deadline)}" placeholder="Due date"></td>
      <td class="todo-check-col"><input type="checkbox"${r.checked ? ' checked' : ''}></td>
    </tr>
  `).join('')
  return `
    <div class="todo-filter">
      <button class="todo-filter-btn active" data-filter="all">All</button>
      <button class="todo-filter-btn" data-filter="done">Done</button>
      <button class="todo-filter-btn" data-filter="open">Not done</button>
    </div>
    <table class="todo-table">
      <thead><tr><th>Task</th><th>Deadline</th><th>Checklist</th></tr></thead>
      <tbody>${tbody}</tbody>
    </table>
    <button class="todo-add-btn">+ Add item</button>
  `
}

function findEditorForElement(el) {
  return Array.from(instances.values()).find(i => i.editor?.view?.dom?.contains(el))?.editor || null
}

function serializeRows(el) {
  const rows = []
  el.querySelectorAll('tbody tr').forEach(tr => {
    rows.push({
      checked: tr.querySelector('input[type="checkbox"]')?.checked || false,
      task: tr.querySelector('.todo-task')?.value || '',
      deadline: tr.querySelector('.todo-deadline')?.value || '',
    })
  })
  return rows
}

function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// ─── TodoList node ─────────────────────────────────────────────
export const TodoList = Node.create({
  name: 'todoList',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return { rows: { default: [] } }
  },

  parseHTML() {
    return [{
      tag: 'div[data-todo-list]',
      getAttrs: el => ({
        rows: JSON.parse(el.getAttribute('data-rows') || '[]'),
      }),
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', {
      'data-todo-list': '',
      'data-rows': JSON.stringify(HTMLAttributes.rows || []),
      class: 'todo-list',
    }]
  },

  addNodeView() {
    return ({ node, getPos }) => {
      const dom = document.createElement('div')
      dom.setAttribute('data-todo-list', '')
      dom.className = 'todo-list'
      dom.contentEditable = 'false'

      let activeFilter = 'all'

      dom._todoUpdate = (rows) => {
        const editor = findEditorForElement(dom)
        if (!editor) return
        const { state, view } = editor
        const pos = getPos()
        if (pos == null) return
        view.dispatch(state.tr.setNodeMarkup(pos, null, { rows }))
      }

      dom._todoUpdateDebounced = debounce(() => {
        dom._todoUpdate(serializeRows(dom))
      }, 300)

      function applyFilter() {
        dom.querySelectorAll('.todo-filter-btn').forEach(b => b.classList.remove('active'))
        const activeBtn = dom.querySelector(`.todo-filter-btn[data-filter="${activeFilter}"]`)
        if (activeBtn) activeBtn.classList.add('active')
        dom.querySelectorAll('tbody tr').forEach(tr => {
          const checked = tr.querySelector('input[type="checkbox"]')?.checked
          tr.style.display =
            activeFilter === 'all' ? '' :
            activeFilter === 'done' ? (checked ? '' : 'none') :
            (!checked ? '' : 'none')
        })
      }

      function render() {
        const rows = Array.isArray(node.attrs.rows) ? node.attrs.rows : []
        dom.setAttribute('data-rows', JSON.stringify(rows))

        const active = dom.ownerDocument.activeElement
        let savedSel = null
        if (active && dom.contains(active)) {
          savedSel = {
            tag: active.tagName,
            cls: active.className,
            value: active.value,
            start: active.selectionStart,
            end: active.selectionEnd,
          }
        }

        dom.innerHTML = buildTableHTML(rows)

        // Wire up filter bar click handlers
        dom.querySelectorAll('.todo-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter
            applyFilter()
          })
        })

        if (savedSel && savedSel.tag === 'INPUT') {
          const inputs = dom.querySelectorAll('tbody input')
          for (const input of inputs) {
            if (input.className === savedSel.cls) {
              input.value = savedSel.value
              input.focus()
              try {
                input.selectionStart = savedSel.start
                input.selectionEnd = savedSel.end
              } catch (_) { /* selection may be invalid for non-text inputs */ }
              break
            }
          }
        }

        applyFilter()
      }

      render()

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'todoList') return false
          node = updatedNode
          render()
          return true
        },
        ignoreMutation() { return true },
        stopEvent(event) {
          const t = event.target
          return t.closest('.todo-add-btn') != null ||
                 t.closest('.todo-filter-btn') != null ||
                 t.closest('input') != null ||
                 t.closest('td') != null
        },
      }
    }
  },

  ...todoListMd,
})

// ─── Global event handlers ─────────────────────────────────────
export function setupTodoList() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-todo-list]')
    if (!el) return

    // Add button
    if (e.target.closest('.todo-add-btn')) {
      e.preventDefault()
      const rows = serializeRows(el)
      rows.push({ checked: false, task: '', deadline: '' })
      el._todoUpdate(rows)
      return
    }

    // Checkbox toggle — update immediately
    if (e.target.matches('input[type="checkbox"]')) {
      el._todoUpdate(serializeRows(el))
      return
    }
  })

  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-todo-list]')
    if (!el) return
    if (e.target.matches('.todo-task, .todo-deadline')) {
      el._todoUpdateDebounced()
    }
  })
}
