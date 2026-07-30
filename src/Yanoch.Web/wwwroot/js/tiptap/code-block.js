import hljs from 'highlight.js/lib/core'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

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
hljs.registerLanguage('html', html)
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

export const CodeBlockHighlight = Extension.create({
  name: 'codeBlockHighlight',

  addProseMirrorPlugins() {
    const key = new PluginKey('codeBlockHighlight')

    return [
      new Plugin({
        key,
        state: {
          init(_, { doc }) {
            return buildDecorations(doc)
          },
          apply(tr, set) {
            if (!tr.docChanged) return set
            return buildDecorations(tr.doc)
          },
        },
        props: {
          decorations(state) {
            return key.getState(state)
          },
        },
      }),
    ]
  },
})

function buildDecorations(doc) {
  const decos = []

  doc.descendants((node, pos) => {
    if (node.type.name !== 'codeBlock') return
    const text = node.textContent
    if (!text) return

    const lang = node.attrs.language
    let result
    try {
      result = lang && hljs.getLanguage(lang)
        ? hljs.highlight(text, { language: lang })
        : hljs.highlightAuto(text)
    } catch {
      return
    }

    const el = document.createElement('div')
    el.innerHTML = result.value

    const pairs = []
    function walk(parent, inherited) {
      for (const child of parent.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent) {
            pairs.push({ len: child.textContent.length, cls: inherited })
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const combined = inherited
            ? inherited + ' ' + child.className
            : child.className
          walk(child, combined)
        }
      }
    }
    walk(el, '')

    let offset = 0
    for (const { len, cls } of pairs) {
      if (len <= 0) continue
      const from = pos + 1 + offset
      const to = from + len
      if (cls) {
        decos.push(Decoration.inline(from, to, { class: cls }))
      }
      offset += len
    }
  })

  return DecorationSet.create(doc, decos)
}
