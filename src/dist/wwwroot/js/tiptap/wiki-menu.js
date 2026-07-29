// ─── Wiki-link [[ autocomplete ─────────────────────────────────
let wikiMenuEl = null
let wikiActive = false
let wikiFrom = -1
let wikiQuery = ''
let wikiIdx = 0
let wikiItems = []
let wikiEditor = null
let wikiSearchTimeout = null

// Escape HTML special chars in untrusted user data before innerHTML assignment
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, ch => map[ch])
}

function scrollActiveIntoView(el) {
  const active = el?.querySelector('.active')
  if (active) active.scrollIntoView({ block: 'nearest' })
}

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
    `<span class="wiki-icon">${escapeHtml(it.icon || '📄')}</span>` +
    `<span class="wiki-text"><strong>${escapeHtml(it.title)}</strong></span></button>`
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
  closeWiki()
  try {
    const { view } = ed
    const { schema } = view.state
    const href = `/page/${item.id}`
    const linkMark = schema.marks.link.create({ href })
    const text = schema.text(item.title, [linkMark])
    view.dispatch(view.state.tr.replaceWith(
      Math.max(0, wikiFrom - 2), view.state.selection.from,
      text
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
  const start = Math.max(0, from - 100)
  const textBefore = doc.textBetween(start, from)

  const lastOpen = textBefore.lastIndexOf('[[')
  if (lastOpen !== -1) {
    const afterOpen = textBefore.slice(lastOpen + 2)
    if (afterOpen.indexOf(']]') === -1) {
      const query = afterOpen
      const absPos = start + lastOpen

      if (!wikiActive) {
        openWiki(editor, absPos + 2)
      }

      if (query !== wikiQuery) {
        wikiQuery = query
        wikiIdx = 0
        fetchWikiSuggestions(query)
      }
      return
    }
  }

  if (wikiActive) {
    if (wikiFrom > 0) {
      const aroundWiki = doc.textBetween(Math.max(0, wikiFrom - 2), Math.min(doc.content.size, wikiFrom + 50))
      if (!aroundWiki.startsWith('[[') || aroundWiki.includes(']]')) { closeWiki(); return }
      if (from < wikiFrom) { closeWiki(); return }
    } else {
      closeWiki()
    }
  }
}

// ─── Keyboard handler for wiki menu ────────────────────────────
export function handleWikiKeyDown(event) {
  if (!wikiActive || !wikiMenuEl || wikiMenuEl.style.display === 'none') return false
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
  return false
}

// ─── Exports for editor module ─────────────────────────────────
export { checkWiki, closeWiki, openWiki, renderWiki, runWikiItem, fetchWikiSuggestions, wikiActive, wikiMenuEl }
