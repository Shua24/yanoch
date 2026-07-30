import hljs from 'highlight.js/lib/core'
import { Extension } from '@tiptap/core'

// ─── Register languages ─────────────────────────────────
// Only the most common languages; highlight.js will fall back
// to auto-detection for anything else.
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import csharp from 'highlight.js/lib/languages/csharp'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import diff from 'highlight.js/lib/languages/diff'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import ruby from 'highlight.js/lib/languages/ruby'
import php from 'highlight.js/lib/languages/php'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', html) // xml covers HTML
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('diff', diff)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('php', php)

// Cache of already-highlighted blocks to avoid re-highlighting
const highlighted = new WeakSet()

// ─── Extension ────────────────────────────────────────────
export const CodeBlockHighlight = Extension.create({
  name: 'codeBlockHighlight',

  onCreate() {
    requestAnimationFrame(() => {
      const { view } = this.editor
      view.dom.querySelectorAll('pre code').forEach((block) => {
        if (!highlighted.has(block)) {
          highlighted.add(block)
          hljs.highlightElement(block)
        }
      })
    })
  },

  onUpdate() {
    const { view } = this.editor
    view.dom.querySelectorAll('pre code').forEach((block) => {
      if (!highlighted.has(block)) {
        highlighted.add(block)
        hljs.highlightElement(block)
      }
    })
  },
})