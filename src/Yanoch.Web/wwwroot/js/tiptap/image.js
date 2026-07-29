// ─── Image upload (one-off) ─────────────────────────────────────
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
    const r = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!r.ok) throw new Error('Upload failed')
    return (await r.json()).url
  } catch (e) {
    console.error('Upload error:', e)
    return null
  }
}

export function triggerImageUpload(editor) {
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
