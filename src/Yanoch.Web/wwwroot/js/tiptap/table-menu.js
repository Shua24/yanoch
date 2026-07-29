import { instances } from './instances.js'

// ─── Table Floating Bubble Menu ────────────────────────────────
export function closeTableBubbleMenu(elementId) {
  const inst = instances.get(elementId)
  if (inst && inst.tableMenuEl) {
    inst.tableMenuEl.remove()
    inst.tableMenuEl = null
  }
}

export function updateTableBubbleMenu(editor, elementId) {
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
  let cellDOM = null
  try {
    cellDOM = view.nodeDOM(selection.$from.before(selection.$from.depth))
  } catch (e) { /* ignore */ }

  if (!cellDOM || !cellDOM.closest) {
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
