import { findEditorForElement, updateCalloutAttr } from './utils.js'
import { calloutTypes, calloutEmojis } from './callout-config.js'

export let calloutMenuEl = null
export let calloutMenuTarget = null // 'icon' or 'color'
export let calloutMenuCalloutEl = null

export function closeCalloutMenu() {
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

// ─── Setup: global click handlers for callout controls ─────────
export function setupCalloutMenus() {
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
