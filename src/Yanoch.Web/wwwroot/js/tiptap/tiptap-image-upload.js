// ─── Image Upload ────────────────────────────────────────────────
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

export function triggerImageUpload(editor) {
  const input = ensureImageInput()
  input.onchange = async () => {
    const file = input.files[0]
    input.value = ''
    if (!file) return
    const url = await uploadImage(file)
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }
  input.click()
}

export function cleanupImageUpload() {
  if (imageInputEl) {
    imageInputEl.remove()
    imageInputEl = null
  }
}