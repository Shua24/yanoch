var ud = Object.defineProperty;
var dd = (n, e, t) => e in n ? ud(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var B = (n, e, t) => dd(n, typeof e != "symbol" ? e + "" : e, t);
function te(n) {
  this.content = n;
}
te.prototype = {
  constructor: te,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, s = r.find(n), i = r.content.slice();
    return s == -1 ? i.push(t || n, e) : (i[s + 1] = e, t && (i[s] = t)), new te(i);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new te(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new te([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new te(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), s = r.content.slice(), i = r.find(n);
    return s.splice(i == -1 ? s.length : i, 0, e, t), new te(s);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = te.from(n), n.size ? new te(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = te.from(n), n.size ? new te(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = te.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
te.from = function(n) {
  if (n instanceof te) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new te(e);
};
function ia(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let s = n.child(r), i = e.child(r);
    if (s == i) {
      t += s.nodeSize;
      continue;
    }
    if (!s.sameMarkup(i))
      return t;
    if (s.isText && s.text != i.text) {
      let o = s.text, l = i.text, a = 0;
      for (; o[a] == l[a]; a++)
        t++;
      return a && a < o.length && a < l.length && aa(o.charCodeAt(a - 1)) && la(o.charCodeAt(a)) && t--, t;
    }
    if (s.content.size || i.content.size) {
      let o = ia(s.content, i.content, t + 1);
      if (o != null)
        return o;
    }
    t += s.nodeSize;
  }
}
function oa(n, e, t, r) {
  for (let s = n.childCount, i = e.childCount; ; ) {
    if (s == 0 || i == 0)
      return s == i ? null : { a: t, b: r };
    let o = n.child(--s), l = e.child(--i), a = o.nodeSize;
    if (o == l) {
      t -= a, r -= a;
      continue;
    }
    if (!o.sameMarkup(l))
      return { a: t, b: r };
    if (o.isText && o.text != l.text) {
      let c = o.text, u = l.text, d = c.length, f = u.length;
      for (; d > 0 && f > 0 && c[d - 1] == u[f - 1]; )
        d--, f--, t--, r--;
      return d && f && d < c.length && aa(c.charCodeAt(d - 1)) && la(c.charCodeAt(d)) && (t++, r++), { a: t, b: r };
    }
    if (o.content.size || l.content.size) {
      let c = oa(o.content, l.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= a, r -= a;
  }
}
function la(n) {
  return n >= 56320 && n < 57344;
}
function aa(n) {
  return n >= 55296 && n < 56320;
}
class b {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, s = 0, i) {
    for (let o = 0, l = 0; l < t; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, s + l, i || null, o) !== !1 && a.content.size) {
        let u = l + 1;
        a.nodesBetween(Math.max(0, e - u), Math.min(a.content.size, t - u), r, s + u);
      }
      l = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, s) {
    let i = "", o = !0;
    return this.nodesBetween(e, t, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, t - a) : l.isLeaf ? s ? typeof s == "function" ? s(l) : s : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && r && (o ? o = !1 : i += r), i += c;
    }, 0), i;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, s = this.content.slice(), i = 0;
    for (t.isText && t.sameMarkup(r) && (s[s.length - 1] = t.withText(t.text + r.text), i = 1); i < e.content.length; i++)
      s.push(e.content[i]);
    return new b(s, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], s = 0;
    if (t > e)
      for (let i = 0, o = 0; o < t; i++) {
        let l = this.content[i], a = o + l.nodeSize;
        a > e && ((o < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, t - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, t - o - 1))), r.push(l), s += l.nodeSize), o = a;
      }
    return new b(r, s);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? b.empty : e == 0 && t == this.content.length ? this : new b(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let s = this.content.slice(), i = this.size + t.nodeSize - r.nodeSize;
    return s[e] = t, new b(s, i);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new b([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new b(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let s = this.content[t];
      e(s, r, t), r += s.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return ia(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return oa(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Wn(0, e);
    if (e == this.size)
      return Wn(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let s = this.child(t), i = r + s.nodeSize;
      if (i >= e)
        return i == e ? Wn(t + 1, i) : Wn(t, r);
      r = i;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return b.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return b.fromArray(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return b.empty;
    let t, r = 0;
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      r += i.nodeSize, s && i.isText && e[s - 1].sameMarkup(i) ? (t || (t = e.slice(0, s)), t[t.length - 1] = i.withText(t[t.length - 1].text + i.text)) : t && t.push(i);
    }
    return new b(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return b.empty;
    if (e instanceof b)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new b([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
b.empty = new b([], 0);
const ws = { index: 0, offset: 0 };
function Wn(n, e) {
  return ws.index = n, ws.offset = e, ws;
}
function dr(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!dr(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !dr(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let $ = class Gs {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (this.eq(i))
        return e;
      if (this.type.excludes(i.type))
        t || (t = e.slice(0, s));
      else {
        if (i.type.excludes(this.type))
          return e;
        !r && i.type.rank > this.type.rank && (t || (t = e.slice(0, s)), t.push(this), r = !0), t && t.push(i);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && dr(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let s = r.create(t.attrs);
    return r.checkAttrs(s.attrs), s;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return Gs.none;
    if (e instanceof Gs)
      return [e];
    let t = e.slice();
    return t.sort((r, s) => r.type.rank - s.type.rank), t;
  }
};
$.none = [];
class Cn extends Error {
}
class C {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = ua(this.content, e + this.openStart, t, this.openStart + 1, this.openEnd + 1);
    return r && new C(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new C(ca(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return C.empty;
    let r = t.openStart || 0, s = t.openEnd || 0;
    if (typeof r != "number" || typeof s != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new C(b.fromJSON(e, t.content), r, s);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, s = 0;
    for (let i = e.firstChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.firstChild)
      r++;
    for (let i = e.lastChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.lastChild)
      s++;
    return new C(e, r, s);
  }
}
C.empty = new C(b.empty, 0, 0);
function ca(n, e, t) {
  let { index: r, offset: s } = n.findIndex(e), i = n.maybeChild(r), { index: o, offset: l } = n.findIndex(t);
  if (s == e || i.isText) {
    if (l != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, i.copy(ca(i.content, e - s - 1, t - s - 1)));
}
function ua(n, e, t, r, s, i) {
  let { index: o, offset: l } = n.findIndex(e), a = n.maybeChild(o);
  if (l == e || a.isText)
    return i && r <= 0 && s <= 0 && !i.canReplace(o, o, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let c = ua(a.content, e - l - 1, t, o == 0 ? r - 1 : 0, o == n.childCount - 1 ? s - 1 : 0, a);
  return c && n.replaceChild(o, a.copy(c));
}
function hd(n, e, t) {
  if (t.openStart > n.depth)
    throw new Cn("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Cn("Inconsistent open depths");
  return da(n, e, t, 0);
}
function da(n, e, t, r) {
  let s = n.index(r), i = n.node(r);
  if (s == e.index(r) && r < n.depth - t.openStart) {
    let o = da(n, e, t, r + 1);
    return i.copy(i.content.replaceChild(s, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, l = o.content;
      return Tt(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = fd(t, n);
      return Tt(i, fa(n, o, l, e, r));
    }
  else return Tt(i, hr(n, e, r));
}
function ha(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Cn("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Qs(n, e, t) {
  let r = n.node(t);
  return ha(r, e.node(t)), r;
}
function St(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function fn(n, e, t, r) {
  let s = (e || n).node(t), i = 0, o = e ? e.index(t) : s.childCount;
  n && (i = n.index(t), n.depth > t ? i++ : n.textOffset && (St(n.nodeAfter, r), i++));
  for (let l = i; l < o; l++)
    St(s.child(l), r);
  e && e.depth == t && e.textOffset && St(e.nodeBefore, r);
}
function Tt(n, e) {
  if (!n.type.validContent(e))
    throw new Cn("Invalid content for node " + n.type.name);
  return n.copy(e);
}
function fa(n, e, t, r, s) {
  let i = n.depth > s && Qs(n, e, s + 1), o = r.depth > s && Qs(t, r, s + 1), l = [];
  return fn(null, n, s, l), i && o && e.index(s) == t.index(s) ? (ha(i, o), St(Tt(i, fa(n, e, t, r, s + 1)), l)) : (i && St(Tt(i, hr(n, e, s + 1)), l), fn(e, t, s, l), o && St(Tt(o, hr(t, r, s + 1)), l)), fn(r, null, s, l), new b(l);
}
function hr(n, e, t) {
  let r = [];
  if (fn(null, n, t, r), n.depth > t) {
    let s = Qs(n, e, t + 1);
    St(Tt(s, hr(n, e, t + 1)), r);
  }
  return fn(e, null, t, r), new b(r);
}
function fd(n, e) {
  let t = e.depth - n.openStart, s = e.node(t).copy(n.content);
  for (let i = t - 1; i >= 0; i--)
    s = e.node(i).copy(b.from(s));
  return {
    start: s.resolveNoCache(n.openStart + t),
    end: s.resolveNoCache(s.content.size - n.openEnd - t)
  };
}
class vn {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], s = e.child(t);
    return r ? e.child(t).cut(r) : s;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], s = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let i = 0; i < e; i++)
      s += r.child(i).nodeSize;
    return s;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return $.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), s = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = s, s = l;
    }
    let i = r.marks;
    for (var o = 0; o < i.length; o++)
      i[o].type.spec.inclusive === !1 && (!s || !i[o].isInSet(s.marks)) && (i = i[o--].removeFromSet(i));
    return i;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, s = e.parent.maybeChild(e.index());
    for (var i = 0; i < r.length; i++)
      r[i].type.spec.inclusive === !1 && (!s || !r[i].isInSet(s.marks)) && (r = r[i--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new fr(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], s = 0, i = t;
    for (let o = e; ; ) {
      let { index: l, offset: a } = o.content.findIndex(i), c = i - a;
      if (r.push(o, l, s + a), !c || (o = o.child(l), o.isText))
        break;
      i = c - 1, s += a + 1;
    }
    return new vn(t, r, i);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Ao.get(e);
    if (r)
      for (let i = 0; i < r.elts.length; i++) {
        let o = r.elts[i];
        if (o.pos == t)
          return o;
      }
    else
      Ao.set(e, r = new pd());
    let s = r.elts[r.i] = vn.resolve(e, t);
    return r.i = (r.i + 1) % md, s;
  }
}
class pd {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const md = 12, Ao = /* @__PURE__ */ new WeakMap();
class fr {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const gd = /* @__PURE__ */ Object.create(null);
class Oe {
  /**
  @internal
  */
  constructor(e, t, r, s = $.none) {
    this.type = e, this.attrs = t, this.marks = s, this.content = r || b.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively overlapping
  the given two positions that are relative to start of this
  node's content. This includes all ancestors of the nodes
  containing the two positions. The callback is invoked with the
  node, its position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, s = 0) {
    this.content.nodesBetween(e, t, r, s, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, r, s) {
    return this.content.textBetween(e, t, r, s);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && dr(this.attrs, t || e.defaultAttrs || gd) && $.sameSet(this.marks, r || $.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Oe(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Oe(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return C.empty;
    let s = this.resolve(e), i = this.resolve(t), o = r ? 0 : s.sharedDepth(t), l = s.start(o), c = s.node(o).content.cut(s.pos - l, i.pos - l);
    return new C(c, s.depth - o, i.depth - o);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return hd(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: s } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (s == e || t.isText)
        return t;
      e -= s + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let s = this.content.child(t - 1);
    return { node: s, index: t - 1, offset: r - s.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return vn.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return vn.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let s = !1;
    return t > e && this.nodesBetween(e, t, (i) => (r.isInSet(i.marks) && (s = !0), !s)), s;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), pa(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = b.empty, s = 0, i = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, s, i), l = o && o.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = s; a < i; a++)
      if (!this.type.allowsMarks(r.child(a).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, s) {
    if (s && !this.type.allowsMarks(s))
      return !1;
    let i = this.contentMatchAt(e).matchType(r), o = i && i.matchFragment(this.content, t);
    return o ? o.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = $.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!$.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let s = b.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, s, r);
    return i.type.checkAttrs(i.attrs), i;
  }
}
Oe.prototype.text = void 0;
class pr extends Oe {
  /**
  @internal
  */
  constructor(e, t, r, s) {
    if (super(e, t, null, s), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : pa(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new pr(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new pr(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function pa(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class Et {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new yd(e, t);
    if (r.next == null)
      return Et.empty;
    let s = ma(r);
    r.next && r.err("Unexpected trailing text");
    let i = Md(Td(s));
    return Cd(i, r), i;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let s = this;
    for (let i = t; s && i < r; i++)
      s = s.matchType(e.child(i).type);
    return s;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let s = [this];
    function i(o, l) {
      let a = o.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return b.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: u, next: d } = o.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && s.indexOf(d) == -1) {
          s.push(d);
          let f = i(d, l.concat(u));
          if (f)
            return f;
        }
      }
      return null;
    }
    return i(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let s = r.shift(), i = s.match;
      if (i.matchType(e)) {
        let o = [];
        for (let l = s; l.type; l = l.via)
          o.push(l.type);
        return o.reverse();
      }
      for (let o = 0; o < i.next.length; o++) {
        let { type: l, next: a } = i.next[o];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!s.type || a.validEnd) && (r.push({ match: l.contentMatch, type: l, via: s }), t[l.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let s = 0; s < r.next.length; s++)
        e.indexOf(r.next[s].next) == -1 && t(r.next[s].next);
    }
    return t(this), e.map((r, s) => {
      let i = s + (r.validEnd ? "*" : " ") + " ";
      for (let o = 0; o < r.next.length; o++)
        i += (o ? ", " : "") + r.next[o].type.name + "->" + e.indexOf(r.next[o].next);
      return i;
    }).join(`
`);
  }
}
Et.empty = new Et(!0);
class yd {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function ma(n) {
  let e = [];
  do
    e.push(kd(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function kd(n) {
  let e = [];
  do
    e.push(bd(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function bd(n) {
  let e = Sd(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = xd(n, e);
    else
      break;
  return e;
}
function Oo(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function xd(n, e) {
  let t = Oo(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Oo(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function wd(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let s = [];
  for (let i in t) {
    let o = t[i];
    o.isInGroup(e) && s.push(o);
  }
  return s.length == 0 && n.err("No node type or group '" + e + "' found"), s;
}
function Sd(n) {
  if (n.eat("(")) {
    let e = ma(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = wd(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Td(n) {
  let e = [[]];
  return s(i(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(o, l, a) {
    let c = { term: a, to: l };
    return e[o].push(c), c;
  }
  function s(o, l) {
    o.forEach((a) => a.to = l);
  }
  function i(o, l) {
    if (o.type == "choice")
      return o.exprs.reduce((a, c) => a.concat(i(c, l)), []);
    if (o.type == "seq")
      for (let a = 0; ; a++) {
        let c = i(o.exprs[a], l);
        if (a == o.exprs.length - 1)
          return c;
        s(c, l = t());
      }
    else if (o.type == "star") {
      let a = t();
      return r(l, a), s(i(o.expr, a), a), [r(a)];
    } else if (o.type == "plus") {
      let a = t();
      return s(i(o.expr, l), a), s(i(o.expr, a), a), [r(a)];
    } else {
      if (o.type == "opt")
        return [r(l)].concat(i(o.expr, l));
      if (o.type == "range") {
        let a = l;
        for (let c = 0; c < o.min; c++) {
          let u = t();
          s(i(o.expr, a), u), a = u;
        }
        if (o.max == -1)
          s(i(o.expr, a), a);
        else
          for (let c = o.min; c < o.max; c++) {
            let u = t();
            r(a, u), s(i(o.expr, a), u), a = u;
          }
        return [r(a)];
      } else {
        if (o.type == "name")
          return [r(l, void 0, o.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function ga(n, e) {
  return e - n;
}
function No(n, e) {
  let t = [];
  return r(e), t.sort(ga);
  function r(s) {
    let i = n[s];
    if (i.length == 1 && !i[0].term)
      return r(i[0].to);
    t.push(s);
    for (let o = 0; o < i.length; o++) {
      let { term: l, to: a } = i[o];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function Md(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(No(n, 0));
  function t(r) {
    let s = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let u = 0; u < s.length; u++)
          s[u][0] == l && (c = s[u][1]);
        No(n, a).forEach((u) => {
          c || s.push([l, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let i = e[r.join(",")] = new Et(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < s.length; o++) {
      let l = s[o][1].sort(ga);
      i.next.push({ type: s[o][0], next: e[l.join(",")] || t(l) });
    }
    return i;
  }
}
function Cd(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let s = r[t], i = !s.validEnd, o = [];
    for (let l = 0; l < s.next.length; l++) {
      let { type: a, next: c } = s.next[l];
      o.push(a.name), i && !(a.isText || a.hasRequiredAttrs()) && (i = !1), r.indexOf(c) == -1 && r.push(c);
    }
    i && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function ya(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function ka(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let s = e && e[r];
    if (s === void 0) {
      let i = n[r];
      if (i.hasDefault)
        s = i.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = s;
  }
  return t;
}
function ba(n, e, t, r) {
  for (let s in e)
    if (!(s in n))
      throw new RangeError(`Unsupported attribute ${s} for ${t} of type ${r}`);
  for (let s in n)
    n[s].validate && n[s].validate(e[s]);
}
function xa(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new Ed(n, r, e[r]);
  return t;
}
let Ro = class wa {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = xa(e, r.attrs), this.defaultAttrs = ya(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == Et.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : ka(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new Oe(this, this.computeAttrs(e), b.from(t), $.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = b.from(t), this.checkContent(t), new Oe(this, this.computeAttrs(e), t, $.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = b.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let s = this.contentMatch.matchFragment(t), i = s && s.fillBefore(b.empty, !0);
    return i ? new Oe(this, e, t.append(i), $.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    ba(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : $.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((i, o) => r[i] = new wa(i, t, o));
    let s = t.spec.topNode || "doc";
    if (!r[s])
      throw new RangeError("Schema is missing its top node type ('" + s + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let i in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
function vd(n, e, t) {
  let r = t.split("|");
  return (s) => {
    let i = s === null ? "null" : typeof s;
    if (r.indexOf(i) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${i}`);
  };
}
class Ed {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? vd(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class ns {
  /**
  @internal
  */
  constructor(e, t, r, s) {
    this.name = e, this.rank = t, this.schema = r, this.spec = s, this.attrs = xa(e, s.attrs), this.excluded = null;
    let i = ya(this.attrs);
    this.instance = i ? new $(this, i) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new $(this, ka(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), s = 0;
    return e.forEach((i, o) => r[i] = new ns(i, s++, t, o)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    ba(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Sa {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let s in e)
      t[s] = e[s];
    t.nodes = te.from(e.nodes), t.marks = te.from(e.marks || {}), this.nodes = Ro.compile(this.spec.nodes, this), this.marks = ns.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in this.nodes) {
      if (s in this.marks)
        throw new RangeError(s + " can not be both a node and a mark");
      let i = this.nodes[s], o = i.spec.content || "", l = i.spec.marks;
      if (i.contentMatch = r[o] || (r[o] = Et.parse(o, this.nodes)), i.inlineContent = i.contentMatch.inlineContent, i.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!i.isInline || !i.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = i;
      }
      i.markSet = l == "_" ? null : l ? Io(this, l.split(" ")) : l == "" || !i.inlineContent ? [] : null;
    }
    for (let s in this.marks) {
      let i = this.marks[s], o = i.spec.excludes;
      i.excluded = o == null ? [i] : o == "" ? [] : Io(this, o.split(" "));
    }
    this.nodeFromJSON = (s) => Oe.fromJSON(this, s), this.markFromJSON = (s) => $.fromJSON(this, s), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, s) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Ro) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, s);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new pr(r, r.defaultAttrs, e, $.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Io(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let s = e[r], i = n.marks[s], o = i;
    if (i)
      t.push(i);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (s == "_" || a.spec.group && a.spec.group.split(" ").indexOf(s) > -1) && t.push(o = a);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function Ad(n) {
  return n.tag != null;
}
function Od(n) {
  return n.style != null;
}
class Ue {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((s) => {
      if (Ad(s))
        this.tags.push(s);
      else if (Od(s)) {
        let i = /[^=]*/.exec(s.style)[0];
        r.indexOf(i) < 0 && r.push(i), this.styles.push(s);
      }
    }), this.normalizeLists = !this.tags.some((s) => {
      if (!/^(ul|ol)\b/.test(s.tag) || !s.node)
        return !1;
      let i = e.nodes[s.node];
      return i.contentMatch.matchType(i);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Lo(this, t, !1);
    return r.addAll(e, $.none, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Lo(this, t, !0);
    return r.addAll(e, $.none, t.from, t.to), C.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let s = r ? this.tags.indexOf(r) + 1 : 0; s < this.tags.length; s++) {
      let i = this.tags[s];
      if (Id(e, i.tag) && (i.namespace === void 0 || e.namespaceURI == i.namespace) && (!i.context || t.matchesContext(i.context))) {
        if (i.getAttrs) {
          let o = i.getAttrs(e);
          if (o === !1)
            continue;
          i.attrs = o || void 0;
        }
        return i;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, s) {
    for (let i = s ? this.styles.indexOf(s) + 1 : 0; i < this.styles.length; i++) {
      let o = this.styles[i], l = o.style;
      if (!(l.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (o.getAttrs) {
          let a = o.getAttrs(t);
          if (a === !1)
            continue;
          o.attrs = a || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(s) {
      let i = s.priority == null ? 50 : s.priority, o = 0;
      for (; o < t.length; o++) {
        let l = t[o];
        if ((l.priority == null ? 50 : l.priority) < i)
          break;
      }
      t.splice(o, 0, s);
    }
    for (let s in e.marks) {
      let i = e.marks[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Po(o)), o.mark || o.ignore || o.clearMark || (o.mark = s);
      });
    }
    for (let s in e.nodes) {
      let i = e.nodes[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Po(o)), o.node || o.ignore || o.mark || (o.node = s);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new Ue(e, Ue.schemaRules(e)));
  }
}
const Ta = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  body: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, Nd = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Ma = { ol: !0, ul: !0 }, En = 1, Xs = 2, pn = 4;
function Do(n, e, t) {
  return e != null ? (e ? En : 0) | (e === "full" ? Xs : 0) : n && n.whitespace == "pre" ? En | Xs : t & ~pn;
}
class qn {
  constructor(e, t, r, s, i, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = s, this.options = o, this.content = [], this.activeMarks = $.none, this.match = i || (o & pn ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(b.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, s;
        return (s = r.findWrapping(e.type)) ? (this.match = r, s) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & En)) {
      let r = this.content[this.content.length - 1], s;
      if (r && r.isText && (s = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let i = r;
        r.text.length == s[0].length ? this.content.pop() : this.content[this.content.length - 1] = i.withText(i.text.slice(0, i.text.length - s[0].length));
      }
    }
    let t = b.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(b.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Ta.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Lo {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let s = t.topNode, i, o = Do(null, t.preserveWhitespace, 0) | (r ? pn : 0);
    s ? i = new qn(s.type, s.attrs, $.none, !0, t.topMatch || s.type.contentMatch, o) : r ? i = new qn(null, null, $.none, !0, null, o) : i = new qn(e.schema.topNodeType, null, $.none, !0, null, o), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let r = e.nodeValue, s = this.top, i = s.options & Xs ? "full" : this.localPreserveWS || (s.options & En) > 0, { schema: o } = this.parser;
    if (i === "full" || s.inlineContext(e) || /[^ \t\r\n\u000c]/.test(r)) {
      if (i)
        if (i === "full")
          r = r.replace(/\r\n?/g, `
`);
        else if (o.linebreakReplacement && /[\r\n]/.test(r) && this.top.findWrapping(o.linebreakReplacement.create())) {
          let l = r.split(/\r?\n|\r/);
          for (let a = 0; a < l.length; a++)
            a && this.insertNode(o.linebreakReplacement.create(), t, !0), l[a] && this.insertNode(o.text(l[a]), t, !/\S/.test(l[a]));
          r = "";
        } else
          r = r.replace(/\r?\n|\r/g, " ");
      else if (r = r.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(r) && this.open == this.nodes.length - 1) {
        let l = s.content[s.content.length - 1], a = e.previousSibling;
        (!l || a && a.nodeName == "BR" || l.isText && /[ \t\r\n\u000c]$/.test(l.text)) && (r = r.slice(1));
      }
      r && this.insertNode(o.text(r), t, !/\S/.test(r)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, r) {
    let s = this.localPreserveWS, i = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let o = e.nodeName.toLowerCase(), l;
    Ma.hasOwnProperty(o) && this.parser.normalizeLists && Rd(e);
    let a = this.options.ruleFromNode && this.options.ruleFromNode(e) || (l = this.parser.matchTag(e, this, r));
    e: if (a ? a.ignore : Nd.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!a || a.skip || a.closeParent) {
      a && a.closeParent ? this.open = Math.max(0, this.open - 1) : a && a.skip.nodeType && (e = a.skip);
      let c, u = this.needsBlock;
      if (Ta.hasOwnProperty(o))
        i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), c = !0, i.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let d = a && a.skip ? t : this.readStyles(e, t);
      d && this.addAll(e, d), c && this.sync(i), this.needsBlock = u;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, a, c, a.consuming === !1 ? l : void 0);
    }
    this.localPreserveWS = s;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let r = e.style;
    if (r && r.length)
      for (let s = 0; s < this.parser.matchedStyles.length; s++) {
        let i = this.parser.matchedStyles[s], o = r.getPropertyValue(i);
        if (o)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(i, o, this, l);
            if (!a)
              break;
            if (a.ignore)
              return null;
            if (a.clearMark ? t = t.filter((c) => !a.clearMark(c)) : t = t.concat(this.parser.schema.marks[a.mark].create(a.attrs)), a.consuming === !1)
              l = a;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r, s) {
    let i, o;
    if (t.node)
      if (o = this.parser.schema.nodes[t.node], o.isLeaf)
        this.insertNode(o.create(t.attrs), r, e.nodeName == "BR") || this.leafFallback(e, r);
      else {
        let a = this.enter(o, t.attrs || null, r, t.preserveWhitespace);
        a && (i = !0, r = a);
      }
    else {
      let a = this.parser.schema.marks[t.mark];
      r = r.concat(a.create(t.attrs));
    }
    let l = this.top;
    if (o && o.isLeaf)
      this.findInside(e);
    else if (s)
      this.addElement(e, r, s);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a, r, !1));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a, r), this.findAround(e, a, !1);
    }
    i && this.sync(l) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r, s) {
    let i = r || 0;
    for (let o = r ? e.childNodes[r] : e.firstChild, l = s == null ? null : e.childNodes[s]; o != l; o = o.nextSibling, ++i)
      this.findAtPoint(e, i), this.addDOM(o, t);
    this.findAtPoint(e, i);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, r) {
    let s, i;
    for (let o = this.open, l = 0; o >= 0; o--) {
      let a = this.nodes[o], c = a.findWrapping(e);
      if (c && (!s || s.length > c.length + l) && (s = c, i = a, !c.length))
        break;
      if (a.solid) {
        if (r)
          break;
        l += 2;
      }
    }
    if (!s)
      return null;
    this.sync(i);
    for (let o = 0; o < s.length; o++)
      t = this.enterInner(s[o], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, r) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let i = this.textblockFromContext();
      i && (t = this.enterInner(i, null, t));
    }
    let s = this.findPlace(e, t, r);
    if (s) {
      this.closeExtra();
      let i = this.top;
      i.match && (i.match = i.match.matchType(e.type));
      let o = $.none;
      for (let l of s.concat(e.marks))
        (i.type ? i.type.allowsMarkType(l.type) : zo(l.type, e.type)) && (o = l.addToSet(o));
      return i.content.push(e.mark(o)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r, s) {
    let i = this.findPlace(e.create(t), r, !1);
    return i && (i = this.enterInner(e, t, r, !0, s)), i;
  }
  // Open a node of the given type
  enterInner(e, t, r, s = !1, i) {
    this.closeExtra();
    let o = this.top;
    o.match = o.match && o.match.matchType(e);
    let l = Do(e, i, o.options);
    o.options & pn && o.content.length == 0 && (l |= pn);
    let a = $.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : zo(c.type, e)) ? (a = c.addToSet(a), !1) : !0), this.nodes.push(new qn(e, t, a, s, null, l)), this.open++, r;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= En);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let s = r.length - 1; s >= 0; s--)
        e += r[s].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let s = 0; s < this.find.length; s++)
        this.find[s].pos == null && e.nodeType == 1 && e.contains(this.find[s].node) && t.compareDocumentPosition(this.find[s].node) & (r ? 2 : 4) && (this.find[s].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, s = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), i = -(r ? r.depth + 1 : 0) + (s ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= i; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let u = a > 0 || a == 0 && s ? this.nodes[a].type : r && a >= i ? r.node(a - i).type : null;
          if (!u || u.name != c && !u.isInGroup(c))
            return !1;
          a--;
        }
      }
      return !0;
    };
    return o(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
}
function Rd(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ma.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Id(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Po(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function zo(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let s = t[r];
    if (!s.allowsMarkType(n))
      continue;
    let i = [], o = (l) => {
      i.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: u } = l.edge(a);
        if (c == e || i.indexOf(u) < 0 && o(u))
          return !0;
      }
    };
    if (o(s.contentMatch))
      return !0;
  }
}
class It {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, t = {}, r) {
    r || (r = Un(t).createDocumentFragment());
    let s = r, i = [];
    return e.forEach((o) => {
      if (i.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < i.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(i[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < i.length; )
          s = i.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], u = this.serializeMark(c, o.isInline, t);
          u && (i.push([c, s]), s.appendChild(u.dom), s = u.contentDOM || u.dom);
        }
      }
      s.appendChild(this.serializeNodeInner(o, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    if (e.isText)
      return Un(t).createTextNode(e.text);
    let { dom: r, contentDOM: s } = or(Un(t), this.nodes[e.type.name](e), null, e.attrs);
    if (s) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, s);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let s = e.marks.length - 1; s >= 0; s--) {
      let i = this.serializeMark(e.marks[s], e.isInline, t);
      i && ((i.contentDOM || i.dom).appendChild(r), r = i.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let s = this.marks[e.type.name];
    return s && or(Un(r), s(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, s) {
    return typeof t == "string" ? { dom: e.createTextNode(t) } : or(e, t, r, s);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new It(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Bo(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Bo(e.marks);
  }
}
function Bo(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Un(n) {
  return n.document || window.document;
}
const $o = /* @__PURE__ */ new WeakMap();
function Dd(n) {
  let e = $o.get(n);
  return e === void 0 && $o.set(n, e = Ld(n)), e;
}
function Ld(n) {
  let e = null;
  function t(r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        if (typeof r[0] == "string")
          e || (e = []), e.push(r);
        else
          for (let s = 0; s < r.length; s++)
            t(r[s]);
      else
        for (let s in r)
          t(r[s]);
  }
  return t(n), e;
}
function or(n, e, t, r) {
  if (e.nodeType == 1)
    return { dom: e };
  if (e.dom && e.dom.nodeType == 1)
    return e;
  let s = e[0], i;
  if (typeof s != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (i = Dd(r)) && i.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let o = s.indexOf(" ");
  o > 0 && (t = s.slice(0, o), s = s.slice(o + 1));
  let l, a = t ? n.createElementNS(t, s) : n.createElement(s), c = e[1], u = 1;
  if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
    u = 2;
    for (let d in c)
      if (c[d] != null) {
        let f = d.indexOf(" ");
        f > 0 ? a.setAttributeNS(d.slice(0, f), d.slice(f + 1), c[d]) : d == "style" && a.style ? a.style.cssText = c[d] : a.setAttribute(d, c[d]);
      }
  }
  for (let d = u; d < e.length; d++) {
    let f = e[d];
    if (f === 0) {
      if (d < e.length - 1 || d > u)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: a, contentDOM: a };
    } else if (typeof f == "string")
      a.appendChild(n.createTextNode(f));
    else {
      let { dom: h, contentDOM: p } = or(n, f, t, r);
      if (a.appendChild(h), p) {
        if (l)
          throw new RangeError("Multiple content holes");
        l = p;
      }
    }
  }
  return { dom: a, contentDOM: l };
}
const Ca = 65535, va = Math.pow(2, 16);
function Pd(n, e) {
  return n + e * va;
}
function _o(n) {
  return n & Ca;
}
function zd(n) {
  return (n - (n & Ca)) / va;
}
const Ea = 1, Aa = 2, lr = 4, Oa = 8;
class Zs {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Oa) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Ea | lr)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Aa | lr)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & lr) > 0;
  }
}
class me {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && me.empty)
      return me.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = _o(e);
    if (!this.inverted)
      for (let s = 0; s < r; s++)
        t += this.ranges[s * 3 + 2] - this.ranges[s * 3 + 1];
    return this.ranges[r * 3] + t + zd(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let s = 0, i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? s : 0);
      if (a > e)
        break;
      let c = this.ranges[l + i], u = this.ranges[l + o], d = a + c;
      if (e <= d) {
        let f = c ? e == a ? -1 : e == d ? 1 : t : t, h = a + s + (f < 0 ? 0 : u);
        if (r)
          return h;
        let p = e == (t < 0 ? a : d) ? null : Pd(l / 3, e - a), m = e == a ? Aa : e == d ? Ea : lr;
        return (t < 0 ? e != a : e != d) && (m |= Oa), new Zs(h, m, p);
      }
      s += u - c;
    }
    return r ? e + s : new Zs(e + s, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, s = _o(t), i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + i], u = a + c;
      if (e <= u && l == s * 3)
        return !0;
      r += this.ranges[l + o] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let s = 0, i = 0; s < this.ranges.length; s += 3) {
      let o = this.ranges[s], l = o - (this.inverted ? i : 0), a = o + (this.inverted ? 0 : i), c = this.ranges[s + t], u = this.ranges[s + r];
      e(l, l + c, a, a + u), i += u - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new me(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? me.empty : new me(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
me.empty = new me([]);
class An {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e, t, r = 0, s = e ? e.length : 0) {
    this.mirror = t, this.from = r, this.to = s, this._maps = e || [], this.ownData = !(e || t);
  }
  /**
  The step maps in this mapping.
  */
  get maps() {
    return this._maps;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, t = this.maps.length) {
    return new An(this._maps, this.mirror, e, t);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, t) {
    this.ownData || (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), this.ownData = !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let t = 0, r = this._maps.length; t < e._maps.length; t++) {
      let s = e.getMirror(t);
      this.appendMap(e._maps[t], s != null && s < t ? r + s : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this._maps.length + e._maps.length; t >= 0; t--) {
      let s = e.getMirror(t);
      this.appendMap(e._maps[t].invert(), s != null && s > t ? r - s - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new An();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this._maps[r].map(e, t);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let s = 0;
    for (let i = this.from; i < this.to; i++) {
      let o = this._maps[i], l = o.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(i);
        if (a != null && a > i && a < this.to) {
          i = a, e = this._maps[a].recover(l.recover);
          continue;
        }
      }
      s |= l.delInfo, e = l.pos;
    }
    return r ? e : new Zs(e, s, null);
  }
}
const Ss = /* @__PURE__ */ Object.create(null);
class ae {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return me.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = Ss[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in Ss)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Ss[e] = t, t.prototype.jsonID = e, t;
  }
}
class K {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new K(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new K(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, s) {
    try {
      return K.ok(e.replace(t, r, s));
    } catch (i) {
      if (i instanceof Cn)
        return K.fail(i.message);
      throw i;
    }
  }
}
function Ri(n, e, t) {
  let r = [];
  for (let s = 0; s < n.childCount; s++) {
    let i = n.child(s);
    i.content.size && (i = i.copy(Ri(i.content, e, i))), i.isInline && (i = e(i, t, s)), r.push(i);
  }
  return b.fromArray(r);
}
class nt extends ae {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), s = r.node(r.sharedDepth(this.to)), i = new C(Ri(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), s), t.openStart, t.openEnd);
    return K.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new Ae(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new nt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof nt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new nt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new nt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ae.jsonID("addMark", nt);
class Ae extends ae {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new C(Ri(t.content, (s) => s.mark(this.mark.removeFromSet(s.marks)), e), t.openStart, t.openEnd);
    return K.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new nt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Ae(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ae && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ae(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Ae(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ae.jsonID("removeMark", Ae);
class rt extends ae {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return K.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return K.fromReplace(e, this.pos, this.pos + 1, new C(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let s = 0; s < t.marks.length; s++)
          if (!t.marks[s].isInSet(r))
            return new rt(this.pos, t.marks[s]);
        return new rt(this.pos, this.mark);
      }
    }
    return new At(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new rt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new rt(t.pos, e.markFromJSON(t.mark));
  }
}
ae.jsonID("addNodeMark", rt);
class At extends ae {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return K.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return K.fromReplace(e, this.pos, this.pos + 1, new C(b.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new rt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new At(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new At(t.pos, e.markFromJSON(t.mark));
  }
}
ae.jsonID("removeNodeMark", At);
class U extends ae {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, s = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = s;
  }
  apply(e) {
    return this.structure && Ys(e, this.from, this.to) ? K.fail("Structure replace would overwrite content") : K.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new me([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new U(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), r = this.from == this.to && U.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return r.deletedAcross && t.deletedAcross ? null : new U(r.pos, Math.max(r.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof U) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? C.empty : new C(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new U(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? C.empty : new C(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new U(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new U(t.from, t.to, C.fromJSON(e, t.slice), !!t.structure);
  }
}
U.MAP_BIAS = 1;
ae.jsonID("replace", U);
class Y extends ae {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, s, i, o, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = s, this.slice = i, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (Ys(e, this.from, this.gapFrom) || Ys(e, this.gapTo, this.to)))
      return K.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return K.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? K.fromReplace(e, this.from, this.to, r) : K.fail("Content does not fit in gap");
  }
  getMap() {
    return new me([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new Y(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), s = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), i = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || s < t.pos || i > r.pos ? null : new Y(t.pos, r.pos, s, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new Y(t.from, t.to, t.gapFrom, t.gapTo, C.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
ae.jsonID("replaceAround", Y);
function Ys(n, e, t) {
  let r = n.resolve(e), s = t - e, i = r.depth;
  for (; s > 0 && i > 0 && r.indexAfter(i) == r.node(i).childCount; )
    i--, s--;
  if (s > 0) {
    let o = r.node(i).maybeChild(r.indexAfter(i));
    for (; s > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, s--;
    }
  }
  return !1;
}
function Bd(n, e, t, r) {
  let s = [], i = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, u) => {
    if (!a.isInline)
      return;
    let d = a.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + a.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : s.push(o = new Ae(f, h, d[m])));
      l && l.to == f ? l.to = h : i.push(l = new nt(f, h, r));
    }
  }), s.forEach((a) => n.step(a)), i.forEach((a) => n.step(a));
}
function $d(n, e, t, r) {
  let s = [], i = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    i++;
    let a = null;
    if (r instanceof ns) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (a || (a = [])).push(u), c = u.removeFromSet(c);
    } else r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, t);
      for (let u = 0; u < a.length; u++) {
        let d = a[u], f;
        for (let h = 0; h < s.length; h++) {
          let p = s[h];
          p.step == i - 1 && d.eq(s[h].style) && (f = p);
        }
        f ? (f.to = c, f.step = i) : s.push({ style: d, from: Math.max(l, e), to: c, step: i });
      }
    }
  }), s.forEach((o) => n.step(new Ae(o.from, o.to, o.style)));
}
function Ii(n, e, t, r = t.contentMatch, s = !0) {
  let i = n.doc.nodeAt(e), o = [], l = e + 1;
  for (let a = 0; a < i.childCount; a++) {
    let c = i.child(a), u = l + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new U(l, u, C.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new Ae(l, u, c.marks[f]));
      if (s && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new C(b.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new U(l + f.index, l + f.index + f[0].length, p));
      }
    }
    l = u;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(b.empty, !0);
    n.replace(l, l, new C(a, 0, 0));
  }
  for (let a = o.length - 1; a >= 0; a--)
    n.step(o[a]);
}
function _d(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Xt(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, s = 0, i = 0; ; --r) {
    let o = n.$from.node(r), l = n.$from.index(r) + s, a = n.$to.indexAfter(r) - i;
    if (r < n.depth && o.canReplace(l, a, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !_d(o, l, a))
      break;
    l && (s = 1), a < o.childCount && (i = 1);
  }
  return null;
}
function Fd(n, e, t) {
  let { $from: r, $to: s, depth: i } = e, o = r.before(i + 1), l = s.after(i + 1), a = o, c = l, u = b.empty, d = 0;
  for (let p = i, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = b.from(r.node(p).copy(u)), d++) : a--;
  let f = b.empty, h = 0;
  for (let p = i, m = !1; p > t; p--)
    m || s.after(p + 1) < s.end(p) ? (m = !0, f = b.from(s.node(p).copy(f)), h++) : c++;
  n.step(new Y(a, c, o, l, new C(u.append(f), d, h), u.size - d, !0));
}
function Di(n, e, t = null, r = n) {
  let s = Hd(n, e), i = s && Vd(r, e);
  return i ? s.map(Fo).concat({ type: e, attrs: t }).concat(i.map(Fo)) : null;
}
function Fo(n) {
  return { type: n, attrs: null };
}
function Hd(n, e) {
  let { parent: t, startIndex: r, endIndex: s } = n, i = t.contentMatchAt(r).findWrapping(e);
  if (!i)
    return null;
  let o = i.length ? i[0] : e;
  return t.canReplaceWith(r, s, o) ? i : null;
}
function Vd(n, e) {
  let { parent: t, startIndex: r, endIndex: s } = n, i = t.child(r), o = e.contentMatch.findWrapping(i.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < s; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function jd(n, e, t) {
  let r = b.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = t[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = b.from(t[o].type.create(t[o].attrs, r));
  }
  let s = e.start, i = e.end;
  n.step(new Y(s, i, s, i, new C(r, 0, 0), t.length, !0));
}
function Wd(n, e, t, r, s) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let i = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    let a = typeof s == "function" ? s(o) : s;
    if (o.isTextblock && !o.hasMarkup(r, a) && qd(n.doc, n.mapping.slice(i).map(l), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && Ra(n, o, l, i), Ii(n, n.mapping.slice(i).map(l, 1), r, void 0, c === null);
      let u = n.mapping.slice(i), d = u.map(l, 1), f = u.map(l + o.nodeSize, 1);
      return n.step(new Y(d, f, d + 1, f - 1, new C(b.from(r.create(a, null, o.marks)), 0, 0), 1, !0)), c === !0 && Na(n, o, l, i), !1;
    }
  });
}
function Na(n, e, t, r) {
  e.forEach((s, i) => {
    if (s.isText) {
      let o, l = /\r?\n|\r/g;
      for (; o = l.exec(s.text); ) {
        let a = n.mapping.slice(r).map(t + 1 + i + o.index);
        n.replaceWith(a, a + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Ra(n, e, t, r) {
  e.forEach((s, i) => {
    if (s.type == s.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + i);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function qd(n, e, t) {
  let r = n.resolve(e), s = r.index();
  return r.parent.canReplaceWith(s, s + 1, t);
}
function Ud(n, e, t, r, s) {
  let i = n.doc.nodeAt(e);
  if (!i)
    throw new RangeError("No node at given position");
  t || (t = i.type);
  let o = t.create(r, null, s || i.marks);
  if (i.isLeaf)
    return n.replaceWith(e, e + i.nodeSize, o);
  if (!t.validContent(i.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new Y(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new C(b.from(o), 0, 0), 1, !0));
}
function Ke(n, e, t = 1, r) {
  let s = n.resolve(e), i = s.depth - t, o = r && r[r.length - 1] || s.parent;
  if (i < 0 || s.parent.type.spec.isolating || !s.parent.canReplace(s.index(), s.parent.childCount) || !o.type.validContent(s.parent.content.cutByIndex(s.index(), s.parent.childCount)))
    return !1;
  for (let c = s.depth - 1, u = t - 2; c > i; c--, u--) {
    let d = s.node(c), f = s.index(c);
    if (d.type.spec.isolating)
      return !1;
    let h = d.content.cutByIndex(f, d.childCount), p = r && r[u + 1];
    p && (h = h.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[u] || d;
    if (!d.canReplace(f + 1, d.childCount) || !m.type.validContent(h))
      return !1;
  }
  let l = s.indexAfter(i), a = r && r[0];
  return s.node(i).canReplaceWith(l, l, a ? a.type : s.node(i + 1).type);
}
function Kd(n, e, t = 1, r) {
  let s = n.doc.resolve(e), i = b.empty, o = b.empty;
  for (let l = s.depth, a = s.depth - t, c = t - 1; l > a; l--, c--) {
    i = b.from(s.node(l).copy(i));
    let u = r && r[c];
    o = b.from(u ? u.type.create(u.attrs, o) : s.node(l).copy(o));
  }
  n.step(new U(e, e, new C(i.append(o), t, t), !0));
}
function ht(n, e) {
  let t = n.resolve(e), r = t.index();
  return Ia(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Jd(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let s = 0; s < e.childCount; s++) {
    let i = e.child(s), o = i.type == r ? n.type.schema.nodes.text : i.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(i.marks))
      return !1;
  }
  return t.validEnd;
}
function Ia(n, e) {
  return !!(n && e && !n.isLeaf && Jd(n, e));
}
function rs(n, e, t = -1) {
  let r = n.resolve(e);
  for (let s = r.depth; ; s--) {
    let i, o, l = r.index(s);
    if (s == r.depth ? (i = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (i = r.node(s + 1), l++, o = r.node(s).maybeChild(l)) : (i = r.node(s).maybeChild(l - 1), o = r.node(s + 1)), i && !i.isTextblock && Ia(i, o) && r.node(s).canReplace(l, l + 1))
      return e;
    if (s == 0)
      break;
    e = t < 0 ? r.before(s) : r.after(s);
  }
}
function Gd(n, e, t) {
  let r = null, { linebreakReplacement: s } = n.doc.type.schema, i = n.doc.resolve(e - t), o = i.node().type;
  if (s && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(s);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let l = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    Ra(n, u.node(), u.before(), l);
  }
  o.inlineContent && Ii(n, e + t - 1, o, i.node().contentMatchAt(i.index()), r == null);
  let a = n.mapping.slice(l), c = a.map(e - t);
  if (n.step(new U(c, a.map(e + t, -1), C.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    Na(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function Qd(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let s = r.depth - 1; s >= 0; s--) {
      let i = r.index(s);
      if (r.node(s).canReplaceWith(i, i, t))
        return r.before(s + 1);
      if (i > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let s = r.depth - 1; s >= 0; s--) {
      let i = r.indexAfter(s);
      if (r.node(s).canReplaceWith(i, i, t))
        return r.after(s + 1);
      if (i < r.node(s).childCount)
        return null;
    }
  return null;
}
function Da(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let s = t.content;
  for (let i = 0; i < t.openStart; i++)
    s = s.firstChild.content;
  for (let i = 1; i <= (t.openStart == 0 && t.size ? 2 : 1); i++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), u = !1;
      if (i == 1)
        u = c.canReplace(a, a, s);
      else {
        let d = c.contentMatchAt(a).findWrapping(s.firstChild.type);
        u = d && c.canReplaceWith(a, a, d[0]);
      }
      if (u)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function ss(n, e, t = e, r = C.empty) {
  if (e == t && !r.size)
    return null;
  let s = n.resolve(e), i = n.resolve(t);
  return La(s, i, r) ? new U(e, t, r) : new Xd(s, i, r).fit();
}
function La(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Xd {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = b.empty;
    for (let s = 0; s <= e.depth; s++) {
      let i = e.node(s);
      this.frontier.push({
        type: i.type,
        match: i.contentMatchAt(e.indexAfter(s))
      });
    }
    for (let s = e.depth; s > 0; s--)
      this.placed = b.from(e.node(s).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, s = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!s)
      return null;
    let i = this.placed, o = r.depth, l = s.depth;
    for (; o && l && i.childCount == 1; )
      i = i.firstChild.content, o--, l--;
    let a = new C(i, o, l);
    return e > -1 ? new Y(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new U(r.pos, s.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, s = this.unplaced.openEnd; r < e; r++) {
      let i = t.firstChild;
      if (t.childCount > 1 && (s = 0), i.type.spec.isolating && s <= r) {
        e = r;
        break;
      }
      t = i.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let s, i = null;
        r ? (i = Ts(this.unplaced.content, r - 1).firstChild, s = i.content) : s = this.unplaced.content;
        let o = s.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], u, d = null;
          if (t == 1 && (o ? c.matchType(o.type) || (d = c.fillBefore(b.from(o), !1)) : i && a.compatibleContent(i.type)))
            return { sliceDepth: r, frontierDepth: l, parent: i, inject: d };
          if (t == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: i, wrap: u };
          if (i && c.matchType(i.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, s = Ts(e, t);
    return !s.childCount || s.firstChild.isLeaf ? !1 : (this.unplaced = new C(e, t + 1, Math.max(r, s.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, s = Ts(e, t);
    if (s.childCount <= 1 && t > 0) {
      let i = e.size - t <= t + s.size;
      this.unplaced = new C(sn(e, t - 1, 1), t - 1, i ? t - 1 : r);
    } else
      this.unplaced = new C(sn(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: s, wrap: i }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (i)
      for (let m = 0; m < i.length; m++)
        this.openFrontierNode(i[m]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, u = [], { match: d, type: f } = this.frontier[t];
    if (s) {
      for (let m = 0; m < s.childCount; m++)
        u.push(s.child(m));
      d = d.matchFragment(s);
    }
    let h = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c), g = d.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || a == 0 || m.content.size) && (d = g, u.push(Pa(m.mark(f.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? h : -1)));
    }
    let p = c == l.childCount;
    p || (h = -1), this.placed = on(this.placed, t, b.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < h; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? C.empty : new C(sn(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new C(sn(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Ms(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, s = this.$to.after(r);
    for (; r > 1 && s == this.$to.end(--r); )
      ++s;
    return s;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: s } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Ms(e, t, s, r, i);
      if (o) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], u = Ms(e, l, c, a, !0);
          if (!u || u.childCount)
            continue e;
        }
        return { depth: t, fit: o, move: i ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = on(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let s = e.node(r), i = s.type.contentMatch.fillBefore(s.content, !0, e.index(r));
      this.openFrontierNode(s.type, s.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let s = this.frontier[this.depth];
    s.match = s.match.matchType(e), this.placed = on(this.placed, this.depth, b.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(b.empty, !0);
    t.childCount && (this.placed = on(this.placed, this.frontier.length, t));
  }
}
function sn(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(sn(n.firstChild.content, e - 1, t)));
}
function on(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(on(n.lastChild.content, e - 1, t)));
}
function Ts(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Pa(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Pa(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(b.empty, !0)))), n.copy(r);
}
function Ms(n, e, t, r, s) {
  let i = n.node(e), o = s ? n.indexAfter(e) : n.index(e);
  if (o == i.childCount && !t.compatibleContent(i.type))
    return null;
  let l = r.fillBefore(i.content, !0, o);
  return l && !Zd(t, i.content, o) ? l : null;
}
function Zd(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Yd(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function eh(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let s = n.doc.resolve(e), i = n.doc.resolve(t);
  if (La(s, i, r))
    return n.step(new U(e, t, r));
  let o = Ba(s, i);
  o[o.length - 1] == 0 && o.pop();
  let l = -(s.depth + 1);
  o.unshift(l);
  for (let f = s.depth, h = s.pos - 1; f > 0; f--, h--) {
    let p = s.node(f).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(f) > -1 ? l = f : s.before(f) == h && o.splice(1, 0, -f);
  }
  let a = o.indexOf(l), c = [], u = r.openStart;
  for (let f = r.content, h = 0; ; h++) {
    let p = f.firstChild;
    if (c.push(p), h == r.openStart)
      break;
    f = p.content;
  }
  for (let f = u - 1; f >= 0; f--) {
    let h = c[f], p = Yd(h.type);
    if (p && !h.sameMarkup(s.node(Math.abs(l) - 1)))
      u = f;
    else if (p || !h.type.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let h = (f + u + 1) % (r.openStart + 1), p = c[h];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + a) % o.length], y = !0;
        g < 0 && (y = !1, g = -g);
        let k = s.node(g - 1), S = s.index(g - 1);
        if (k.canReplaceWith(S, S, p.type, p.marks))
          return n.replace(s.before(g), y ? i.after(g) : t, new C(za(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = s.before(h), t = i.after(h));
  }
}
function za(n, e, t, r, s) {
  if (e < t) {
    let i = n.firstChild;
    n = n.replaceChild(0, i.copy(za(i.content, e + 1, t, r, i)));
  }
  if (e > r) {
    let i = s.contentMatchAt(0), o = i.fillBefore(n).append(n);
    n = o.append(i.matchFragment(o).fillBefore(b.empty, !0));
  }
  return n;
}
function th(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let s = Qd(n.doc, e, r.type);
    s != null && (e = t = s);
  }
  n.replaceRange(e, t, new C(b.from(r), 0, 0));
}
function nh(n, e, t) {
  let r = n.doc.resolve(e), s = n.doc.resolve(t);
  if (r.parent.isTextblock && s.parent.isTextblock && r.start() != s.start() && r.parentOffset == 0 && s.parentOffset == 0) {
    let o = r.sharedDepth(t), l = !1;
    for (let a = r.depth; a > o; a--)
      r.node(a).type.spec.isolating && (l = !0);
    for (let a = s.depth; a > o; a--)
      s.node(a).type.spec.isolating && (l = !0);
    if (!l) {
      for (let a = r.depth; a > 0 && e == r.start(a); a--)
        e = r.before(a);
      for (let a = s.depth; a > 0 && t == s.start(a); a--)
        t = s.before(a);
      r = n.doc.resolve(e), s = n.doc.resolve(t);
    }
  }
  let i = Ba(r, s);
  for (let o = 0; o < i.length; o++) {
    let l = i[o], a = o == i.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), s.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), s.indexAfter(l - 1))))
      return n.delete(r.before(l), s.after(l));
  }
  for (let o = 1; o <= r.depth && o <= s.depth; o++)
    if (e - r.start(o) == r.depth - o && t > r.end(o) && s.end(o) - t != s.depth - o && r.start(o - 1) == s.start(o - 1) && r.node(o - 1).canReplace(r.index(o - 1), s.index(o - 1)))
      return n.delete(r.before(o), t);
  n.delete(e, t);
}
function Ba(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let s = r; s >= 0; s--) {
    let i = n.start(s);
    if (i < n.pos - (n.depth - s) || e.end(s) > e.pos + (e.depth - s) || n.node(s).type.spec.isolating || e.node(s).type.spec.isolating)
      break;
    (i == e.start(s) || s == n.depth && s == e.depth && n.parent.inlineContent && e.parent.inlineContent && s && e.start(s - 1) == i - 1) && t.push(s);
  }
  return t;
}
class Ht extends ae {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return K.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in t.attrs)
      r[i] = t.attrs[i];
    r[this.attr] = this.value;
    let s = t.type.create(r, null, t.marks);
    return K.fromReplace(e, this.pos, this.pos + 1, new C(b.from(s), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return me.empty;
  }
  invert(e) {
    return new Ht(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ht(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Ht(t.pos, t.attr, t.value);
  }
}
ae.jsonID("attr", Ht);
class On extends ae {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let s in e.attrs)
      t[s] = e.attrs[s];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return K.ok(r);
  }
  getMap() {
    return me.empty;
  }
  invert(e) {
    return new On(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new On(t.attr, t.value);
  }
}
ae.jsonID("docAttr", On);
let jt = class extends Error {
};
jt = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
jt.prototype = Object.create(Error.prototype);
jt.prototype.constructor = jt;
jt.prototype.name = "TransformError";
class $a {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new An();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new jt(t.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  Return a single range, in post-transform document positions,
  that covers all content changed by this transform. Returns null
  if no replacements are made. Note that this will ignore changes
  that add/remove marks without replacing the underlying content.
  */
  changedRange() {
    let e = 1e9, t = -1e9;
    for (let r = 0; r < this.mapping.maps.length; r++) {
      let s = this.mapping.maps[r];
      r && (e = s.map(e, 1), t = s.map(t, -1)), s.forEach((i, o, l, a) => {
        e = Math.min(e, l), t = Math.max(t, a);
      });
    }
    return e == 1e9 ? null : { from: e, to: t };
  }
  /**
  @internal
  */
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, t = e, r = C.empty) {
    let s = ss(this.doc, e, t, r);
    return s && this.step(s), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new C(b.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, C.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, t, r) {
    return eh(this, e, t, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, t, r) {
    return th(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return nh(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Fd(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Gd(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return jd(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, s = null) {
    return Wd(this, e, t, r, s), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, s) {
    return Ud(this, e, t, r, s), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Ht(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new On(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new rt(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof $)
      t.isInSet(r.marks) && this.step(new At(e, t));
    else {
      let s = r.marks, i, o = [];
      for (; i = t.isInSet(s); )
        o.push(new At(e, i)), s = i.removeFromSet(s);
      for (let l = o.length - 1; l >= 0; l--)
        this.step(o[l]);
    }
    return this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split (with the outermost nodes coming first).
  */
  split(e, t = 1, r) {
    return Kd(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Bd(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return $d(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Ii(this, e, t, r), this;
  }
}
const Cs = /* @__PURE__ */ Object.create(null);
class I {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new rh(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = C.empty) {
    let r = t.content.lastChild, s = null;
    for (let l = 0; l < t.openEnd; l++)
      s = r, r = r.lastChild;
    let i = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], u = e.mapping.slice(i);
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? C.empty : t), l == 0 && jo(e, i, (r ? r.isInline : s && s.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, s = this.ranges;
    for (let i = 0; i < s.length; i++) {
      let { $from: o, $to: l } = s[i], a = e.mapping.slice(r), c = a.map(o.pos), u = a.map(l.pos);
      i ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), jo(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let s = e.parent.inlineContent ? new N(e) : $t(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (s)
      return s;
    for (let i = e.depth - 1; i >= 0; i--) {
      let o = t < 0 ? $t(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, r) : $t(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, r);
      if (o)
        return o;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new ge(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return $t(e, e, 0, 0, 1) || new ge(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return $t(e, e, e.content.size, e.childCount, -1) || new ge(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Cs[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in Cs)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Cs[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return N.between(this.$anchor, this.$head).getBookmark();
  }
}
I.prototype.visible = !0;
class rh {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Ho = !1;
function Vo(n) {
  !Ho && !n.parent.inlineContent && (Ho = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class N extends I {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Vo(e), Vo(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return I.near(r);
    let s = e.resolve(t.map(this.anchor));
    return new N(s.parent.inlineContent ? s : r, r);
  }
  replace(e, t = C.empty) {
    if (super.replace(e, t), t == C.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof N && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new is(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new N(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let s = e.resolve(t);
    return new this(s, r == t ? s : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let s = e.pos - t.pos;
    if ((!r || s) && (r = s >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let i = I.findFrom(t, r, !0) || I.findFrom(t, -r, !0);
      if (i)
        t = i.$head;
      else
        return I.near(t, r);
    }
    return e.parent.inlineContent || (s == 0 ? e = t : (e = (I.findFrom(e, -r, !0) || I.findFrom(e, r, !0)).$anchor, e.pos < t.pos != s < 0 && (e = t))), new N(e, t);
  }
}
I.jsonID("text", N);
class is {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new is(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return N.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class O extends I {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: s } = t.mapResult(this.anchor), i = e.resolve(s);
    return r ? I.near(i) : new O(i);
  }
  content() {
    return new C(b.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof O && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Li(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new O(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new O(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
O.prototype.visible = !1;
I.jsonID("node", O);
class Li {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new is(r, r) : new Li(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && O.isSelectable(r) ? new O(t) : I.near(t);
  }
}
class ge extends I {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = C.empty) {
    if (t == C.empty) {
      e.delete(0, e.doc.content.size);
      let r = I.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new ge(e);
  }
  map(e) {
    return new ge(e);
  }
  eq(e) {
    return e instanceof ge;
  }
  getBookmark() {
    return sh;
  }
}
I.jsonID("all", ge);
const sh = {
  map() {
    return this;
  },
  resolve(n) {
    return new ge(n);
  }
};
function $t(n, e, t, r, s, i = !1) {
  if (e.inlineContent)
    return N.create(n, t);
  for (let o = r - (s > 0 ? 0 : 1); s > 0 ? o < e.childCount : o >= 0; o += s) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!i && O.isSelectable(l))
        return O.create(n, t - (s < 0 ? l.nodeSize : 0));
    } else {
      let a = $t(n, l, t + s, s < 0 ? l.childCount : 0, s, i);
      if (a)
        return a;
    }
    t += l.nodeSize * s;
  }
  return null;
}
function jo(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let s = n.steps[r];
  if (!(s instanceof U || s instanceof Y))
    return;
  let i = n.mapping.maps[r], o;
  i.forEach((l, a, c, u) => {
    o == null && (o = u);
  }), n.setSelection(I.near(n.doc.resolve(o), t));
}
const Wo = 1, Kn = 2, qo = 4;
class ih extends $a {
  /**
  @internal
  */
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  /**
  The transaction's current selection. This defaults to the editor
  selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
  transaction, but can be overwritten with
  [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
  */
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  /**
  Update the transaction's current selection. Will determine the
  selection that the editor gets when the transaction is applied.
  */
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Wo) & ~Kn, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Wo) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= Kn, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return $.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  /**
  Add a mark to the set of stored marks.
  */
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Remove a mark or mark type from the set of stored marks.
  */
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Whether the stored marks were explicitly set for this transaction.
  */
  get storedMarksSet() {
    return (this.updated & Kn) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~Kn, this.storedMarks = null;
  }
  /**
  Update the timestamp for the transaction.
  */
  setTime(e) {
    return this.time = e, this;
  }
  /**
  Replace the current selection with the given slice.
  */
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  /**
  Replace the selection with the given node. When `inheritMarks` is
  true and the content is inline, it inherits the marks from the
  place where it is inserted.
  */
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || $.none))), r.replaceWith(this, e), this;
  }
  /**
  Delete the selection.
  */
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  /**
  Replace the given range, or the selection if no range is given,
  with a text node containing the given string.
  */
  insertText(e, t, r) {
    let s = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(s.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), !e)
        return this.deleteRange(t, r);
      let i = this.storedMarks;
      if (!i) {
        let o = this.doc.resolve(t);
        i = r == t ? o.marks() : o.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, s.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(I.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  /**
  Retrieve a metadata property for a given name or plugin.
  */
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  /**
  Returns true if this transaction doesn't contain any metadata,
  and can thus safely be extended.
  */
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  /**
  Indicate that the editor should scroll the selection into view
  when updated to the state produced by this transaction.
  */
  scrollIntoView() {
    return this.updated |= qo, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & qo) > 0;
  }
}
function Uo(n, e) {
  return !e || !n ? n : n.bind(e);
}
class ln {
  constructor(e, t, r) {
    this.name = e, this.init = Uo(t.init, r), this.apply = Uo(t.apply, r);
  }
}
const oh = [
  new ln("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new ln("selection", {
    init(n, e) {
      return n.selection || I.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new ln("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new ln("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class vs {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = oh.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new ln(r.key, r.spec.state, r));
    });
  }
}
class gt {
  /**
  @internal
  */
  constructor(e) {
    this.config = e;
  }
  /**
  The schema of the state's document.
  */
  get schema() {
    return this.config.schema;
  }
  /**
  The plugins that are active in this state.
  */
  get plugins() {
    return this.config.plugins;
  }
  /**
  Apply the given transaction to produce a new state.
  */
  apply(e) {
    return this.applyTransaction(e).state;
  }
  /**
  @internal
  */
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let s = this.config.plugins[r];
        if (s.spec.filterTransaction && !s.spec.filterTransaction.call(s, e, this))
          return !1;
      }
    return !0;
  }
  /**
  Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
  returns the precise transactions that were applied (which might
  be influenced by the [transaction
  hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
  plugins) along with the new state.
  */
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), s = null;
    for (; ; ) {
      let i = !1;
      for (let o = 0; o < this.config.plugins.length; o++) {
        let l = this.config.plugins[o];
        if (l.spec.appendTransaction) {
          let a = s ? s[o].n : 0, c = s ? s[o].state : this, u = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (u && r.filterTransaction(u, o)) {
            if (u.setMeta("appendedTransaction", e), !s) {
              s = [];
              for (let d = 0; d < this.config.plugins.length; d++)
                s.push(d < o ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(u), r = r.applyInner(u), i = !0;
          }
          s && (s[o] = { state: r, n: t.length });
        }
      }
      if (!i)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new gt(this.config), r = this.config.fields;
    for (let s = 0; s < r.length; s++) {
      let i = r[s];
      t[i.name] = i.apply(e, this[i.name], this, t);
    }
    return t;
  }
  /**
  Accessor that constructs and returns a new [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new ih(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new vs(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new gt(t);
    for (let s = 0; s < t.fields.length; s++)
      r[t.fields[s].name] = t.fields[s].init(e, r);
    return r;
  }
  /**
  Create a new state based on this one, but with an adjusted set
  of active plugins. State fields that exist in both sets of
  plugins are kept unchanged. Those that no longer exist are
  dropped, and those that are new are initialized using their
  [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
  configuration object..
  */
  reconfigure(e) {
    let t = new vs(this.schema, e.plugins), r = t.fields, s = new gt(t);
    for (let i = 0; i < r.length; i++) {
      let o = r[i].name;
      s[o] = this.hasOwnProperty(o) ? this[o] : r[i].init(e, s);
    }
    return s;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let s = e[r], i = s.spec.state;
        i && i.toJSON && (t[r] = i.toJSON.call(s, this[s.key]));
      }
    return t;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let s = new vs(e.schema, e.plugins), i = new gt(s);
    return s.fields.forEach((o) => {
      if (o.name == "doc")
        i.doc = Oe.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        i.selection = I.fromJSON(i.doc, t.selection);
      else if (o.name == "storedMarks")
        t.storedMarks && (i.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let a = r[l], c = a.spec.state;
            if (a.key == o.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              i[o.name] = c.fromJSON.call(a, e, t[l], i);
              return;
            }
          }
        i[o.name] = o.init(e, i);
      }
    }), i;
  }
}
function _a(n, e, t) {
  for (let r in n) {
    let s = n[r];
    s instanceof Function ? s = s.bind(e) : r == "handleDOMEvents" && (s = _a(s, e, {})), t[r] = s;
  }
  return t;
}
class H {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && _a(e.props, this, this.props), this.key = e.key ? e.key.key : Fa("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Es = /* @__PURE__ */ Object.create(null);
function Fa(n) {
  return n in Es ? n + "$" + ++Es[n] : (Es[n] = 0, n + "$");
}
class Q {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Fa(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Ha = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Va(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const ja = (n, e, t) => {
  let r = Va(n, t);
  if (!r)
    return !1;
  let s = Pi(r);
  if (!s) {
    let o = r.blockRange(), l = o && Xt(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let i = s.nodeBefore;
  if (Za(n, s, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (Wt(i, "end") || O.isSelectable(i)))
    for (let o = r.depth; ; o--) {
      let l = ss(n.doc, r.before(o), r.after(o), C.empty);
      if (l && l.slice.size < l.to - l.from) {
        if (e) {
          let a = n.tr.step(l);
          a.setSelection(Wt(i, "end") ? I.findFrom(a.doc.resolve(a.mapping.map(s.pos, -1)), -1) : O.create(a.doc, s.pos - i.nodeSize)), e(a.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(n.tr.delete(s.pos - i.nodeSize, s.pos).scrollIntoView()), !0) : !1;
}, lh = (n, e, t) => {
  let r = Va(n, t);
  if (!r)
    return !1;
  let s = Pi(r);
  return s ? Wa(n, s, e) : !1;
}, ah = (n, e, t) => {
  let r = Ua(n, t);
  if (!r)
    return !1;
  let s = zi(r);
  return s ? Wa(n, s, e) : !1;
};
function Wa(n, e, t) {
  let r = e.nodeBefore, s = r, i = e.pos - 1;
  for (; !s.isTextblock; i--) {
    if (s.type.spec.isolating)
      return !1;
    let u = s.lastChild;
    if (!u)
      return !1;
    s = u;
  }
  let o = e.nodeAfter, l = o, a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating)
      return !1;
    let u = l.firstChild;
    if (!u)
      return !1;
    l = u;
  }
  let c = ss(n.doc, i, a, C.empty);
  if (!c || c.from != i || c instanceof U && c.slice.size >= a - i)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(N.create(u.doc, i)), t(u.scrollIntoView());
  }
  return !0;
}
function Wt(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const qa = (n, e, t) => {
  let { $head: r, empty: s } = n.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    i = Pi(r);
  }
  let o = i && i.nodeBefore;
  return !o || !O.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(O.create(n.doc, i.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Pi(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Ua(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Ka = (n, e, t) => {
  let r = Ua(n, t);
  if (!r)
    return !1;
  let s = zi(r);
  if (!s)
    return !1;
  let i = s.nodeAfter;
  if (Za(n, s, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (Wt(i, "start") || O.isSelectable(i))) {
    let o = ss(n.doc, r.before(), r.after(), C.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(Wt(i, "start") ? I.findFrom(l.doc.resolve(l.mapping.map(s.pos)), 1) : O.create(l.doc, l.mapping.map(s.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(n.tr.delete(s.pos, s.pos + i.nodeSize).scrollIntoView()), !0) : !1;
}, Ja = (n, e, t) => {
  let { $head: r, empty: s } = n.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    i = zi(r);
  }
  let o = i && i.nodeAfter;
  return !o || !O.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(O.create(n.doc, i.pos)).scrollIntoView()), !0);
};
function zi(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const ch = (n, e) => {
  let t = n.selection, r = t instanceof O, s;
  if (r) {
    if (t.node.isTextblock || !ht(n.doc, t.from))
      return !1;
    s = t.from;
  } else if (s = rs(n.doc, t.from, -1), s == null)
    return !1;
  if (e) {
    let i = n.tr.join(s);
    r && i.setSelection(O.create(i.doc, s - n.doc.resolve(s).nodeBefore.nodeSize)), e(i.scrollIntoView());
  }
  return !0;
}, uh = (n, e) => {
  let t = n.selection, r;
  if (t instanceof O) {
    if (t.node.isTextblock || !ht(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = rs(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, dh = (n, e) => {
  let { $from: t, $to: r } = n.selection, s = t.blockRange(r), i = s && Xt(s);
  return i == null ? !1 : (e && e(n.tr.lift(s, i).scrollIntoView()), !0);
}, Ga = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Bi(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const hh = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let s = t.node(-1), i = t.indexAfter(-1), o = Bi(s.contentMatchAt(i));
  if (!o || !s.canReplaceWith(i, i, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(I.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, Qa = (n, e) => {
  let t = n.selection, { $from: r, $to: s } = t;
  if (t instanceof ge || r.parent.inlineContent || s.parent.inlineContent)
    return !1;
  let i = Bi(s.parent.contentMatchAt(s.indexAfter()));
  if (!i || !i.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && s.index() < s.parent.childCount ? r : s).pos, l = n.tr.insert(o, i.createAndFill());
    l.setSelection(N.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, Xa = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let i = t.before();
    if (Ke(n.doc, i))
      return e && e(n.tr.split(i).scrollIntoView()), !0;
  }
  let r = t.blockRange(), s = r && Xt(r);
  return s == null ? !1 : (e && e(n.tr.lift(r, s).scrollIntoView()), !0);
};
function fh(n) {
  return (e, t) => {
    let { $from: r, $to: s } = e.selection;
    if (e.selection instanceof O && e.selection.node.isBlock)
      return !r.parentOffset || !Ke(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let i = [], o, l, a = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        a = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), l = Bi(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1))), i.unshift(a && l ? { type: l } : null), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        i.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof N || e.selection instanceof ge) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = Ke(u.doc, d, i.length, i);
    if (f || (i[0] = l ? { type: l } : null, f = Ke(u.doc, d, i.length, i)), !f)
      return !1;
    if (u.split(d, i.length, i), !a && c && r.node(o).type != l) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      l && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, l) && u.setNodeMarkup(u.mapping.map(r.before(o)), l);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const ph = fh(), mh = (n, e) => {
  let { $from: t, to: r } = n.selection, s, i = t.sharedDepth(r);
  return i == 0 ? !1 : (s = t.before(i), e && e(n.tr.setSelection(O.create(n.doc, s))), !0);
};
function gh(n, e, t) {
  let r = e.nodeBefore, s = e.nodeAfter, i = e.index();
  return !r || !s || !r.type.compatibleContent(s.type) ? !1 : !r.content.size && e.parent.canReplace(i - 1, i) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(i, i + 1) || !(s.isTextblock || ht(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Za(n, e, t, r) {
  let s = e.nodeBefore, i = e.nodeAfter, o, l, a = s.type.spec.isolating || i.type.spec.isolating;
  if (!a && gh(n, e, t))
    return !0;
  let c = !a && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (l = s.contentMatchAt(s.childCount)).findWrapping(i.type)) && l.matchType(o[0] || i.type).validEnd) {
    if (t) {
      let h = e.pos + i.nodeSize, p = b.empty;
      for (let y = o.length - 1; y >= 0; y--)
        p = b.from(o[y].create(null, p));
      p = b.from(s.copy(p));
      let m = n.tr.step(new Y(e.pos - 1, h, e.pos, h, new C(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == s.type && ht(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = i.type.spec.isolating || r > 0 && a ? null : I.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && Xt(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && Wt(i, "start", !0) && Wt(s, "end")) {
    let h = s, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = i, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let y = b.empty;
        for (let S = p.length - 1; S >= 0; S--)
          y = b.from(p[S].copy(y));
        let k = n.tr.step(new Y(e.pos - p.length, e.pos + i.nodeSize, e.pos + g, e.pos + i.nodeSize - g, new C(y, p.length, 0), 0, !0));
        t(k.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ya(n) {
  return function(e, t) {
    let r = e.selection, s = n < 0 ? r.$from : r.$to, i = s.depth;
    for (; s.node(i).isInline; ) {
      if (!i)
        return !1;
      i--;
    }
    return s.node(i).isTextblock ? (t && t(e.tr.setSelection(N.create(e.doc, n < 0 ? s.start(i) : s.end(i)))), !0) : !1;
  };
}
const yh = Ya(-1), kh = Ya(1);
function bh(n, e = null) {
  return function(t, r) {
    let { $from: s, $to: i } = t.selection, o = s.blockRange(i), l = o && Di(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Ko(n, e = null) {
  return function(t, r) {
    let s = !1;
    for (let i = 0; i < t.selection.ranges.length && !s; i++) {
      let { $from: { pos: o }, $to: { pos: l } } = t.selection.ranges[i];
      t.doc.nodesBetween(o, l, (a, c) => {
        if (s)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n)
            s = !0;
          else {
            let u = t.doc.resolve(c), d = u.index();
            s = u.parent.canReplaceWith(d, d + 1, n);
          }
      });
    }
    if (!s)
      return !1;
    if (r) {
      let i = t.tr;
      for (let o = 0; o < t.selection.ranges.length; o++) {
        let { $from: { pos: l }, $to: { pos: a } } = t.selection.ranges[o];
        i.setBlockType(l, a, n, e);
      }
      r(i.scrollIntoView());
    }
    return !0;
  };
}
function $i(...n) {
  return function(e, t, r) {
    for (let s = 0; s < n.length; s++)
      if (n[s](e, t, r))
        return !0;
    return !1;
  };
}
$i(Ha, ja, qa);
$i(Ha, Ka, Ja);
$i(Ga, Qa, Xa, ph);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function xh(n, e = null) {
  return function(t, r) {
    let { $from: s, $to: i } = t.selection, o = s.blockRange(i);
    if (!o)
      return !1;
    let l = r ? t.tr : null;
    return wh(l, o, n, e) ? (r && r(l.scrollIntoView()), !0) : !1;
  };
}
function wh(n, e, t, r = null) {
  let s = !1, i = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let a = o.resolve(e.start - 2);
    i = new fr(a, a, e.depth), e.endIndex < e.parent.childCount && (e = new fr(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), s = !0;
  }
  let l = Di(i, t, r, e);
  return l ? (n && Sh(n, e, l, s, t), !0) : !1;
}
function Sh(n, e, t, r, s) {
  let i = b.empty;
  for (let u = t.length - 1; u >= 0; u--)
    i = b.from(t[u].type.create(t[u].attrs, i));
  n.step(new Y(e.start - (r ? 2 : 0), e.end, e.start, e.end, new C(i, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == s && (o = u + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Ke(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return n;
}
function Th(n) {
  return function(e, t) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (o) => o.childCount > 0 && o.firstChild.type == n);
    return i ? t ? r.node(i.depth - 1).type == n ? Mh(e, t, n, i) : Ch(e, t, i) : !0 : !1;
  };
}
function Mh(n, e, t, r) {
  let s = n.tr, i = r.end, o = r.$to.end(r.depth);
  i < o && (s.step(new Y(i - 1, o, i, o, new C(b.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new fr(s.doc.resolve(r.$from.pos), s.doc.resolve(o), r.depth));
  const l = Xt(r);
  if (l == null)
    return !1;
  s.lift(r, l);
  let a = s.doc.resolve(s.mapping.map(i, -1) - 1);
  return ht(s.doc, a.pos) && a.nodeBefore.type == a.nodeAfter.type && s.join(a.pos), e(s.scrollIntoView()), !0;
}
function Ch(n, e, t) {
  let r = n.tr, s = t.parent;
  for (let h = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    h -= s.child(p).nodeSize, r.delete(h - 1, h + 1);
  let i = r.doc.resolve(t.start), o = i.nodeAfter;
  if (r.mapping.map(t.end) != t.start + i.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == s.childCount, c = i.node(-1), u = i.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, o.content.append(a ? b.empty : b.from(s))))
    return !1;
  let d = i.pos, f = d + o.nodeSize;
  return r.step(new Y(d - (l ? 1 : 0), f + (a ? 1 : 0), d + 1, f - 1, new C((l ? b.empty : b.from(s.copy(b.empty))).append(a ? b.empty : b.from(s.copy(b.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function vh(n) {
  return function(e, t) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!i)
      return !1;
    let o = i.startIndex;
    if (o == 0)
      return !1;
    let l = i.parent, a = l.child(o - 1);
    if (a.type != n)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, u = b.from(c ? n.create() : null), d = new C(b.from(n.create(null, b.from(l.type.create(null, u)))), c ? 3 : 1, 0), f = i.start, h = i.end;
      t(e.tr.step(new Y(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const ne = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, qt = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let ei = null;
const je = function(n, e, t) {
  let r = ei || (ei = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, Eh = function() {
  ei = null;
}, Ot = function(n, e, t, r) {
  return t && (Jo(n, e, t, r, -1) || Jo(n, e, t, r, 1));
}, Ah = /^(img|br|input|textarea|hr)$/i;
function Jo(n, e, t, r, s) {
  for (var i; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (s < 0 ? 0 : we(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || zn(n) || Ah.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = ne(n) + (s < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (s < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((i = o.pmViewDesc) === null || i === void 0) && i.ignoreForSelection)
          e += s;
        else
          return !1;
      else
        n = o, e = s < 0 ? we(n) : 0;
    } else
      return !1;
  }
}
function we(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Oh(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = we(n);
    } else if (n.parentNode && !zn(n))
      e = ne(n), n = n.parentNode;
    else
      return null;
  }
}
function Nh(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !zn(n))
      e = ne(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function Rh(n, e, t) {
  for (let r = e == 0, s = e == we(n); r || s; ) {
    if (n == t)
      return !0;
    let i = ne(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && i == 0, s = s && i == we(n);
  }
}
function zn(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const ls = function(n) {
  return n.focusNode && Ot(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function pt(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function Ih(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Dh(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(we(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(we(r.startContainer), r.startOffset) };
  }
}
const ze = typeof navigator < "u" ? navigator : null, Go = typeof document < "u" ? document : null, ft = ze && ze.userAgent || "", ti = /Edge\/(\d+)/.exec(ft), ec = /MSIE \d/.exec(ft), ni = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ft), pe = !!(ec || ni || ti), st = ec ? document.documentMode : ni ? +ni[1] : ti ? +ti[1] : 0, Se = !pe && /gecko\/(\d+)/i.test(ft);
Se && +(/Firefox\/(\d+)/.exec(ft) || [0, 0])[1];
const ri = !pe && /Chrome\/(\d+)/.exec(ft), se = !!ri, tc = ri ? +ri[1] : 0, le = !pe && !!ze && /Apple Computer/.test(ze.vendor), Ut = le && (/Mobile\/\w+/.test(ft) || !!ze && ze.maxTouchPoints > 2), xe = Ut || (ze ? /Mac/.test(ze.platform) : !1), nc = ze ? /Win/.test(ze.platform) : !1, We = /Android \d/.test(ft), Bn = !!Go && "webkitFontSmoothing" in Go.documentElement.style, Lh = Bn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Ph(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function $e(n, e) {
  return typeof n == "number" ? n : n[e];
}
function zh(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function Qo(n, e, t) {
  if (!si(e) && e.left == 0)
    return;
  let r = n.someProp("scrollThreshold") || 0, s = n.someProp("scrollMargin") || 5, i = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = qt(o);
      continue;
    }
    let l = o, a = l == i.body, c = a ? Ph(i) : zh(l), u = 0, d = 0;
    if (e.top < c.top + $e(r, "top") ? d = -(c.top - e.top + $e(s, "top")) : e.bottom > c.bottom - $e(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + $e(s, "top") - c.top : e.bottom - c.bottom + $e(s, "bottom")), e.left < c.left + $e(r, "left") ? u = -(c.left - e.left + $e(s, "left")) : e.right > c.right - $e(r, "right") && (u = e.right - c.right + $e(s, "right")), u || d)
      if (a)
        i.defaultView.scrollBy(u, d);
      else {
        let h = l.scrollLeft, p = l.scrollTop;
        d && (l.scrollTop += d), u && (l.scrollLeft += u);
        let m = l.scrollLeft - h, g = l.scrollTop - p;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let f = a ? "fixed" : getComputedStyle(o).position;
    if (/^(fixed|sticky)$/.test(f))
      break;
    o = f == "absolute" ? o.offsetParent : qt(o);
  }
}
function Bh(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, s;
  for (let i = (e.left + e.right) / 2, o = t + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let l = n.root.elementFromPoint(i, o);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      r = l, s = a.top;
      break;
    }
  }
  return { refDOM: r, refTop: s, stack: rc(n.dom) };
}
function rc(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = qt(r))
    ;
  return e;
}
function $h({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  sc(t, r == 0 ? 0 : r - e);
}
function sc(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: s, left: i } = n[t];
    r.scrollTop != s + e && (r.scrollTop = s + e), r.scrollLeft != i && (r.scrollLeft = i);
  }
}
let zt = null;
function _h(n) {
  if (n.setActive)
    return n.setActive();
  if (zt)
    return n.focus(zt);
  let e = rc(n);
  n.focus(zt == null ? {
    get preventScroll() {
      return zt = { preventScroll: !0 }, !0;
    }
  } : void 0), zt || (zt = !1, sc(e, 0));
}
function ic(n, e) {
  let t, r = 2e8, s, i = 0, o = e.top, l = e.top, a, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = je(u).getClientRects();
    else
      continue;
    for (let h = 0; h < f.length; h++) {
      let p = f[h];
      if (p.top <= o && p.bottom >= l) {
        o = Math.max(p.bottom, o), l = Math.min(p.top, l);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = u, r = m, s = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, u.nodeType == 1 && m && (i = d + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else p.top > e.top && !a && p.left <= e.left && p.right >= e.left && (a = u, c = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (i = d + 1);
    }
  }
  return !t && a && (t = a, s = c, r = 0), t && t.nodeType == 3 ? Fh(t, s) : !t || r && t.nodeType == 1 ? { node: n, offset: i } : ic(t, s);
}
function Fh(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), s;
  for (let i = 0; i < t; i++) {
    r.setEnd(n, i + 1), r.setStart(n, i);
    let o = Xe(r, 1);
    if (o.top != o.bottom && _i(e, o)) {
      s = { node: n, offset: i + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), s || { node: n, offset: 0 };
}
function _i(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Hh(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function Vh(n, e, t) {
  let { node: r, offset: s } = ic(e, t), i = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    i = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, s, i);
}
function jh(n, e, t, r) {
  let s = -1;
  for (let i = e, o = !1; i != n.dom; ) {
    let l = n.docView.nearestDesc(i, !0), a;
    if (!l)
      return null;
    if (l.dom.nodeType == 1 && (l.node.isBlock && l.parent || !l.contentDOM) && // Ignore elements with zero-size bounding rectangles
    ((a = l.dom.getBoundingClientRect()).width || a.height) && (l.node.isBlock && l.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(l.dom.nodeName) && (!o && a.left > r.left || a.top > r.top ? s = l.posBefore : (!o && a.right < r.left || a.bottom < r.top) && (s = l.posAfter), o = !0), !l.contentDOM && s < 0 && !l.node.isText))
      return (l.node.isBlock ? r.top < (a.top + a.bottom) / 2 : r.left < (a.left + a.right) / 2) ? l.posBefore : l.posAfter;
    i = l.dom.parentNode;
  }
  return s > -1 ? s : n.docView.posFromDOM(e, t, -1);
}
function oc(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let s = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), i = s; ; ) {
      let o = n.childNodes[i];
      if (o.nodeType == 1) {
        let l = o.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (_i(e, c))
            return oc(o, e, c);
        }
      }
      if ((i = (i + 1) % r) == s)
        break;
    }
  return n;
}
function Wh(n, e) {
  let t = n.dom.ownerDocument, r, s = 0, i = Dh(t, e.left, e.top);
  i && ({ node: r, offset: s } = i);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!_i(e, c) || (o = oc(n.dom, e, c), !o))
      return null;
  }
  if (le)
    for (let c = o; r && c; c = qt(c))
      c.draggable && (r = void 0);
  if (o = Hh(o, e), r) {
    if (Se && r.nodeType == 1 && (s = Math.min(s, r.childNodes.length), s < r.childNodes.length)) {
      let u = r.childNodes[s], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && s++;
    }
    let c;
    Bn && s && r.nodeType == 1 && (c = r.childNodes[s - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && s--, r == n.dom && s == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (s == 0 || r.nodeType != 1 || r.childNodes[s - 1].nodeName != "BR") && (l = jh(n, r, s, e));
  }
  l == null && (l = Vh(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function si(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Xe(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (si(r))
      return r;
  }
  return Array.prototype.find.call(t, si) || n.getBoundingClientRect();
}
const qh = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function lc(n, e, t) {
  let { node: r, offset: s, atom: i } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = Bn || Se;
  if (r.nodeType == 3)
    if (o && (qh.test(r.nodeValue) || (t < 0 ? !s : s == r.nodeValue.length))) {
      let a = Xe(je(r, s, s), t);
      if (Se && s && /\s/.test(r.nodeValue[s - 1]) && s < r.nodeValue.length) {
        let c = Xe(je(r, s - 1, s - 1), -1);
        if (c.top == a.top) {
          let u = Xe(je(r, s, s + 1), -1);
          if (u.top != a.top)
            return Yt(u, u.left < c.left);
        }
      }
      return a;
    } else {
      let a = s, c = s, u = t < 0 ? 1 : -1;
      return t < 0 && !s ? (c++, u = -1) : t >= 0 && s == r.nodeValue.length ? (a--, u = 1) : t < 0 ? a-- : c++, Yt(Xe(je(r, a, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (i || 0)).parent.inlineContent) {
    if (i == null && s && (t < 0 || s == we(r))) {
      let a = r.childNodes[s - 1];
      if (a.nodeType == 1)
        return As(a.getBoundingClientRect(), !1);
    }
    if (i == null && s < we(r)) {
      let a = r.childNodes[s];
      if (a.nodeType == 1)
        return As(a.getBoundingClientRect(), !0);
    }
    return As(r.getBoundingClientRect(), t >= 0);
  }
  if (i == null && s && (t < 0 || s == we(r))) {
    let a = r.childNodes[s - 1], c = a.nodeType == 3 ? je(a, we(a) - (o ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return Yt(Xe(c, 1), !1);
  }
  if (i == null && s < we(r)) {
    let a = r.childNodes[s];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? je(a, 0, o ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return Yt(Xe(c, -1), !0);
  }
  return Yt(Xe(r.nodeType == 3 ? je(r) : r, -t), t >= 0);
}
function Yt(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function As(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function ac(n, e, t) {
  let r = n.state, s = n.root.activeElement;
  r != e && n.updateState(e), s != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), s != n.dom && s && s.focus();
  }
}
function Uh(n, e, t) {
  let r = e.selection, s = t == "up" ? r.$from : r.$to;
  return ac(n, e, () => {
    let { node: i } = n.docView.domFromPos(s.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(i, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        i = l.contentDOM || l.dom;
        break;
      }
      i = l.dom.parentNode;
    }
    let o = lc(n, s.pos, 1);
    for (let l = i.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = je(l, 0, l.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < a.length; c++) {
        let u = a[c];
        if (u.bottom > u.top + 1 && (t == "up" ? o.top - u.top > (u.bottom - o.top) * 2 : u.bottom - o.bottom > (o.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const Kh = /[\u0590-\u08ac]/;
function Jh(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let s = r.parentOffset, i = !s, o = s == r.parent.content.size, l = n.domSelection();
  return l ? !Kh.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? i : o : ac(n, e, () => {
    let { focusNode: a, focusOffset: c, anchorNode: u, anchorOffset: d } = n.domSelectionRange(), f = l.caretBidiLevel;
    l.modify("move", t, "character");
    let h = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !h.contains(p.nodeType == 1 ? p : p.parentNode) || a == p && c == m;
    try {
      l.collapse(u, d), a && (a != u || c != d) && l.extend && l.extend(a, c);
    } catch {
    }
    return f != null && (l.caretBidiLevel = f), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let Xo = null, Zo = null, Yo = !1;
function Gh(n, e, t) {
  return Xo == e && Zo == t ? Yo : (Xo = e, Zo = t, Yo = t == "up" || t == "down" ? Uh(n, e, t) : Jh(n, e, t));
}
const Te = 0, el = 1, yt = 2, Ne = 3;
class $n {
  constructor(e, t, r, s) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = s, this.dirty = Te, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  parseRule(e) {
    return null;
  }
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  stopEvent(e) {
    return !1;
  }
  // The size of the content represented by this desc.
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let s = this.children[t];
      if (s == e)
        return r;
      r += s.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let i, o;
        if (e == this.contentDOM)
          i = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          i = e.previousSibling;
        }
        for (; i && !((o = i.pmViewDesc) && o.parent == this); )
          i = i.previousSibling;
        return i ? this.posBeforeChild(o) + o.size : this.posAtStart;
      } else {
        let i, o;
        if (e == this.contentDOM)
          i = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          i = e.nextSibling;
        }
        for (; i && !((o = i.pmViewDesc) && o.parent == this); )
          i = i.nextSibling;
        return i ? this.posBeforeChild(o) : this.posAtEnd;
      }
    let s;
    if (e == this.dom && this.contentDOM)
      s = t > ne(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      s = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let i = e; ; i = i.parentNode) {
          if (i == this.dom) {
            s = !1;
            break;
          }
          if (i.previousSibling)
            break;
        }
      if (s == null && t == e.childNodes.length)
        for (let i = e; ; i = i.parentNode) {
          if (i == this.dom) {
            s = !0;
            break;
          }
          if (i.nextSibling)
            break;
        }
    }
    return s ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, s = e; s; s = s.parentNode) {
      let i = this.getDesc(s), o;
      if (i && (!t || i.node))
        if (r && (o = i.nodeDOM) && !(o.nodeType == 1 ? o.contains(e.nodeType == 1 ? e : e.parentNode) : o == e))
          r = !1;
        else
          return i;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let s = e; s; s = s.parentNode) {
      let i = this.getDesc(s);
      if (i)
        return i.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let s = this.children[t], i = r + s.size;
      if (r == e && i != r) {
        for (; !s.border && s.children.length; )
          for (let o = 0; o < s.children.length; o++) {
            let l = s.children[o];
            if (l.size) {
              s = l;
              break;
            }
          }
        return s;
      }
      if (e < i)
        return s.descAt(e - r - s.border);
      r = i;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, s = 0;
    for (let i = 0; r < this.children.length; r++) {
      let o = this.children[r], l = i + o.size;
      if (l > e || o instanceof uc) {
        s = e - i;
        break;
      }
      i = l;
    }
    if (s)
      return this.children[r].domFromPos(s - this.children[r].border, t);
    for (let i; r && !(i = this.children[r - 1]).size && i instanceof cc && i.side >= 0; r--)
      ;
    if (t <= 0) {
      let i, o = !0;
      for (; i = r ? this.children[r - 1] : null, !(!i || i.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return i && t && o && !i.border && !i.domAtom ? i.domFromPos(i.size, t) : { node: this.contentDOM, offset: i ? ne(i.dom) + 1 : 0 };
    } else {
      let i, o = !0;
      for (; i = r < this.children.length ? this.children[r] : null, !(!i || i.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return i && o && !i.border && !i.domAtom ? i.domFromPos(0, t) : { node: this.contentDOM, offset: i ? ne(i.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let s = -1, i = -1;
    for (let o = r, l = 0; ; l++) {
      let a = this.children[l], c = o + a.size;
      if (s == -1 && e <= c) {
        let u = o + a.border;
        if (e >= u && t <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM))
          return a.parseRange(e, t, u);
        e = o;
        for (let d = l; d > 0; d--) {
          let f = this.children[d - 1];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(1)) {
            s = ne(f.dom) + 1;
            break;
          }
          e -= f.size;
        }
        s == -1 && (s = 0);
      }
      if (s > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let u = l + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            i = ne(d.dom);
            break;
          }
          t += d.size;
        }
        i == -1 && (i = this.contentDOM.childNodes.length);
        break;
      }
      o = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: s, toOffset: i };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, t, r, s = !1) {
    let i = Math.min(e, t), o = Math.max(e, t);
    for (let h = 0, p = 0; h < this.children.length; h++) {
      let m = this.children[h], g = p + m.size;
      if (i > p && o < g)
        return m.setSelection(e - p - m.border, t - p - m.border, r, s);
      p = g;
    }
    let l = this.domFromPos(e, e ? -1 : 1), a = t == e ? l : this.domFromPos(t, t ? -1 : 1), c = r.root.getSelection(), u = r.domSelectionRange(), d = !1;
    if ((Se || le) && e == t) {
      let { node: h, offset: p } = l;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (l = a = { node: g.parentNode, offset: ne(g) + 1 });
              break;
            }
            let y = m.pmViewDesc;
            if (y && y.node && y.node.isBlock)
              break;
          }
      } else {
        let m = h.childNodes[p - 1];
        d = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (Se && u.focusNode && u.focusNode != a.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (s = !0);
    }
    if (!(s || d && le) && Ot(l.node, l.offset, u.anchorNode, u.anchorOffset) && Ot(a.node, a.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && Se)) {
      c.collapse(l.node, l.offset);
      try {
        e != t && c.extend(a.node, a.offset), f = !0;
      } catch {
      }
    }
    if (!f) {
      if (e > t) {
        let p = l;
        l = a, a = p;
      }
      let h = document.createRange();
      h.setEnd(a.node, a.offset), h.setStart(l.node, l.offset), c.removeAllRanges(), c.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  markDirty(e, t) {
    for (let r = 0, s = 0; s < this.children.length; s++) {
      let i = this.children[s], o = r + i.size;
      if (r == o ? e <= o && t >= r : e < o && t > r) {
        let l = r + i.border, a = o - i.border;
        if (e >= l && t <= a) {
          this.dirty = e == r || t == o ? yt : el, e == l && t == a && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Ne : i.markDirty(e - l, t - l);
          return;
        } else
          i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? yt : Ne;
      }
      r = o;
    }
    this.dirty = yt;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? yt : el;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  get ignoreForSelection() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class cc extends $n {
  constructor(e, t, r, s) {
    let i, o = t.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!i)
        return s;
      if (i.parent)
        return i.parent.posBeforeChild(i);
    })), !t.type.spec.raw) {
      if (o.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(o), o = l;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = t, this.widget = t, i = this;
  }
  matchesWidget(e) {
    return this.dirty == Te && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get ignoreForSelection() {
    return !!this.widget.type.spec.relaxedSide;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Qh extends $n {
  constructor(e, t, r, s) {
    super(e, [], t, null), this.textDOM = r, this.text = s;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class it extends $n {
  constructor(e, t, r, s, i) {
    super(e, [], r, s), this.mark = t, this.spec = i;
  }
  static create(e, t, r, s) {
    let i = s.nodeViews[t.type.name], o = i && i(t, s, r);
    return (!o || !o.dom) && (o = It.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new it(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & Ne || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != Ne && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != Te) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = Te;
    }
  }
  slice(e, t, r) {
    let s = it.create(this.parent, this.mark, !0, r), i = this.children, o = this.size;
    t < o && (i = oi(i, t, o, r)), e > 0 && (i = oi(i, 0, e, r));
    for (let l = 0; l < i.length; l++)
      i[l].parent = s;
    return s.children = i, s;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
}
class ot extends $n {
  constructor(e, t, r, s, i, o, l) {
    super(e, [], i, o), this.node = t, this.outerDeco = r, this.innerDeco = s, this.nodeDOM = l;
  }
  // By default, a node is rendered using the `toDOM` method from the
  // node type spec. But client code can use the `nodeViews` spec to
  // supply a custom node view, which can influence various aspects of
  // the way the node works.
  //
  // (Using subclassing for this was intentionally decided against,
  // since it'd require exposing a whole slew of finicky
  // implementation details to the user code that they probably will
  // never need.)
  static create(e, t, r, s, i, o) {
    let l = i.nodeViews[t.type.name], a, c = l && l(t, i, () => {
      if (!a)
        return o;
      if (a.parent)
        return a.parent.posBeforeChild(a);
    }, r, s), u = c && c.dom, d = c && c.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else u || ({ dom: u, contentDOM: d } = It.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = fc(u, r, t), c ? a = new Xh(e, t, r, s, u, d || null, f, c) : t.isText ? new as(e, t, r, s, u, f) : new ot(e, t, r, s, u, d || null, f);
  }
  parseRule(e) {
    if (this.node.type.spec.reparseInView)
      return null;
    let t = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (t.preserveWhitespace = "full"), !this.contentDOM)
      t.getContent = () => this.node.content;
    else if (!this.contentLost)
      t.contentElement = this.contentDOM;
    else {
      for (let r = this.children.length - 1; r >= 0; r--) {
        let s = this.children[r];
        if (this.dom.contains(s.dom.parentNode)) {
          t.contentElement = s.dom.parentNode;
          break;
        }
      }
      if (!t.contentElement) {
        let r = e && e.find((s) => s.nodeType == 1 && e.indexOf(s.parentNode) < 0 && this.dom.contains(s));
        r ? t.contentElement = r : t.getContent = () => b.empty;
      }
    }
    return t;
  }
  matchesNode(e, t, r) {
    return this.dirty == Te && e.eq(this.node) && mr(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  // Syncs `this.children` to match `this.node.content` and the local
  // decorations, possibly introducing nesting for marks. Then, in a
  // separate step, syncs the DOM inside `this.contentDOM` to
  // `this.children`.
  updateChildren(e, t) {
    let r = this.node.inlineContent, s = t, i = e.composing ? this.localCompositionInfo(e, t) : null, o = i && i.pos > -1 ? i : null, l = i && i.pos < 0, a = new Yh(this, o && o.node, e);
    nf(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && a.syncToMarks(u == this.node.childCount ? $.none : this.node.child(u).marks, r, e, u), a.placeWidget(c, e, s);
    }, (c, u, d, f) => {
      a.syncToMarks(c.marks, r, e, f);
      let h;
      a.findNodeMatch(c, u, d, f) || l && e.state.selection.from > s && e.state.selection.to < s + c.nodeSize && (h = a.findIndexWithChild(i.node)) > -1 && a.updateNodeAt(c, u, d, h, e) || a.updateNextNode(c, u, d, e, f, s) || a.addNode(c, u, d, e, s), s += c.nodeSize;
    }), a.syncToMarks([], r, e, 0), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == yt) && (o && this.protectLocalComposition(e, o), dc(this.contentDOM, this.children, e), Ut && rf(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: s } = e.state.selection;
    if (!(e.state.selection instanceof N) || r < t || s > t + this.node.content.size)
      return null;
    let i = e.input.compositionNode;
    if (!i || !this.dom.contains(i.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = i.nodeValue, l = sf(this.node.content, o, r - t, s - t);
      return l < 0 ? null : { node: i, pos: l, text: o };
    } else
      return { node: i, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: s }) {
    if (this.getDesc(t))
      return;
    let i = t;
    for (; i.parentNode != this.contentDOM; i = i.parentNode) {
      for (; i.previousSibling; )
        i.parentNode.removeChild(i.previousSibling);
      for (; i.nextSibling; )
        i.parentNode.removeChild(i.nextSibling);
      i.pmViewDesc && (i.pmViewDesc = void 0);
    }
    let o = new Qh(this, i, t, s);
    e.input.compositionNodes.push(o), this.children = oi(this.children, r, r + s.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, s) {
    return this.dirty == Ne || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, s), !0);
  }
  updateInner(e, t, r, s) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(s, this.posAtStart), this.dirty = Te;
  }
  updateOuterDeco(e) {
    if (mr(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = hc(this.dom, this.nodeDOM, ii(this.outerDeco, this.node, t), ii(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  // Mark this node as being the selected node.
  selectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
  }
  // Remove selected node marking from this node.
  deselectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function tl(n, e, t, r, s) {
  fc(r, e, n);
  let i = new ot(void 0, n, e, t, r, r, r);
  return i.contentDOM && i.updateChildren(s, 0), i;
}
class as extends ot {
  constructor(e, t, r, s, i, o) {
    super(e, t, r, s, i, null, o);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, s) {
    return this.dirty == Ne || this.dirty != Te && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != Te || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, s.trackWrites == this.nodeDOM && (s.trackWrites = null)), this.node = e, this.dirty = Te, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let s = this.node.cut(e, t), i = document.createTextNode(s.text);
    return new as(this.parent, s, this.outerDeco, this.innerDeco, i, i);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Ne);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class uc extends $n {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == Te && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Xh extends ot {
  constructor(e, t, r, s, i, o, l, a) {
    super(e, t, r, s, i, o, l), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, s) {
    if (this.dirty == Ne)
      return !1;
    if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
      let i = this.spec.update(e, t, r);
      return i && this.updateInner(e, t, r, s), i;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, s);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, s) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r.root) : super.setSelection(e, t, r, s);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function dc(n, e, t) {
  let r = n.firstChild, s = !1;
  for (let i = 0; i < e.length; i++) {
    let o = e[i], l = o.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = nl(r), s = !0;
      r = r.nextSibling;
    } else
      s = !0, n.insertBefore(l, r);
    if (o instanceof it) {
      let a = r ? r.previousSibling : n.lastChild;
      dc(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = nl(r), s = !0;
  s && t.trackWrites == n && (t.trackWrites = null);
}
const mn = function(n) {
  n && (this.nodeName = n);
};
mn.prototype = /* @__PURE__ */ Object.create(null);
const kt = [new mn()];
function ii(n, e, t) {
  if (n.length == 0)
    return kt;
  let r = t ? kt[0] : new mn(), s = [r];
  for (let i = 0; i < n.length; i++) {
    let o = n[i].type.attrs;
    if (o) {
      o.nodeName && s.push(r = new mn(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && s.length == 1 && s.push(r = new mn(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return s;
}
function hc(n, e, t, r) {
  if (t == kt && r == kt)
    return e;
  let s = e;
  for (let i = 0; i < r.length; i++) {
    let o = r[i], l = t[i];
    if (i) {
      let a;
      l && l.nodeName == o.nodeName && s != n && (a = s.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(s), l = kt[0]), s = a;
    }
    Zh(s, l || kt[0], o);
  }
  return s;
}
function Zh(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], s = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let i = 0; i < r.length; i++)
      s.indexOf(r[i]) == -1 && n.classList.remove(r[i]);
    for (let i = 0; i < s.length; i++)
      r.indexOf(s[i]) == -1 && n.classList.add(s[i]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, s;
      for (; s = r.exec(e.style); )
        n.style.removeProperty(s[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function fc(n, e, t) {
  return hc(n, n, kt, ii(e, t, n.nodeType != 1));
}
function mr(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function nl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Yh {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = ef(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, t, r, s) {
    let i = 0, o = this.stack.length >> 1, l = Math.min(o, e.length);
    for (; i < l && (i == o - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1; )
      i++;
    for (; i < o; )
      this.destroyRest(), this.top.dirty = Te, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
    for (; o < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let a = -1, c = this.top.children.length;
      s < this.preMatch.index && (c = Math.min(this.index + 3, c));
      for (let u = this.index; u < c; u++) {
        let d = this.top.children[u];
        if (d.matchesMark(e[o]) && !this.isLocked(d.dom)) {
          a = u;
          break;
        }
      }
      if (a < 0 && this.index < this.top.children.length) {
        let u = this.top.children[this.index];
        u instanceof it && u.dirty != Ne && u.mark.type == e[o].type && u.spec.update && !this.isLocked(u.dom) && u.spec.update(e[o]) && (u.mark = e[o], a = this.index, this.changed = !0);
      }
      if (a > -1)
        a > this.index && (this.changed = !0, this.destroyBetween(this.index, a)), this.top = this.top.children[this.index];
      else {
        let u = it.create(this.top, e[o], t, r);
        this.top.children.splice(this.index, 0, u), this.top = u, this.changed = !0;
      }
      this.index = 0, o++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, s) {
    let i = -1, o;
    if (s >= this.preMatch.index && (o = this.preMatch.matches[s - this.preMatch.index]).parent == this.top && o.matchesNode(e, t, r))
      i = this.top.children.indexOf(o, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          i = l;
          break;
        }
      }
    return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
  }
  updateNodeAt(e, t, r, s, i) {
    let o = this.top.children[s];
    return o.dirty == Ne && o.dom == o.contentDOM && (o.dirty = yt), o.update(e, t, r, i) ? (this.destroyBetween(this.index, s), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let s = this.index; s < this.top.children.length; s++)
            if (this.top.children[s] == r)
              return s;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, s, i, o) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof ot) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != i)
          return !1;
        let u = a.dom, d, f = this.isLocked(u) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != Ne && mr(t, a.outerDeco));
        if (!f && a.update(e, t, r, s))
          return this.destroyBetween(this.index, l), a.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(a, e, t, r, s, o)))
          return this.destroyBetween(this.index, l), this.top.children[this.index] = d, d.contentDOM && (d.dirty = yt, d.updateChildren(s, o + 1), d.dirty = Te), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, s, i, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !mr(r, e.outerDeco) || !s.eq(e.innerDeco))
      return null;
    let l = ot.create(this.top, t, r, s, i, o);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, s, i) {
    let o = ot.create(this.top, e, t, r, s, i);
    o.contentDOM && o.updateChildren(s, i + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let s = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (s && s.matchesWidget(e) && (e == s.widget || !s.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let i = new cc(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof it; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof as) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((le || se) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let s = new uc(this.top, [], r, null);
      t != this.top ? t.children.push(s) : t.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function ef(n, e) {
  let t = e, r = t.children.length, s = n.childCount, i = /* @__PURE__ */ new Map(), o = [];
  e: for (; s > 0; ) {
    let l;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof it)
          t = c, r = c.children.length;
        else {
          l = c, r--;
          break;
        }
      } else {
        if (t == e)
          break e;
        r = t.parent.children.indexOf(t), t = t.parent;
      }
    let a = l.node;
    if (a) {
      if (a != n.child(s - 1))
        break;
      --s, i.set(l, s), o.push(l);
    }
  }
  return { index: s, matched: i, matches: o.reverse() };
}
function tf(n, e) {
  return n.type.side - e.type.side;
}
function nf(n, e, t, r) {
  let s = e.locals(n), i = 0;
  if (s.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let u = n.child(c);
      r(u, s, e.forChild(i, u), c), i += u.nodeSize;
    }
    return;
  }
  let o = 0, l = [], a = null;
  for (let c = 0; ; ) {
    let u, d;
    for (; o < s.length && s[o].to == i; ) {
      let g = s[o++];
      g.widget && (u ? (d || (d = [u])).push(g) : u = g);
    }
    if (u)
      if (d) {
        d.sort(tf);
        for (let g = 0; g < d.length; g++)
          t(d[g], c, !!a);
      } else
        t(u, c, !!a);
    let f, h;
    if (a)
      h = -1, f = a, a = null;
    else if (c < n.childCount)
      h = c, f = n.child(c++);
    else
      break;
    for (let g = 0; g < l.length; g++)
      l[g].to <= i && l.splice(g--, 1);
    for (; o < s.length && s[o].from <= i && s[o].to > i; )
      l.push(s[o++]);
    let p = i + f.nodeSize;
    if (f.isText) {
      let g = p;
      o < s.length && s[o].from < g && (g = s[o].from);
      for (let y = 0; y < l.length; y++)
        l[y].to < g && (g = l[y].to);
      g < p && (a = f.cut(g - i), f = f.cut(0, g - i), p = g, h = -1);
    } else
      for (; o < s.length && s[o].to < p; )
        o++;
    let m = f.isInline && !f.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(f, m, e.forChild(i, f), h), i = p;
  }
}
function rf(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function sf(n, e, t, r) {
  for (let s = 0, i = 0; s < n.childCount && i <= r; ) {
    let o = n.child(s++), l = i;
    if (i += o.nodeSize, !o.isText)
      continue;
    let a = o.text;
    for (; s < n.childCount; ) {
      let c = n.child(s++);
      if (i += c.nodeSize, !c.isText)
        break;
      a += c.text;
    }
    if (i >= t) {
      if (i >= r && a.slice(r - e.length - l, r - l) == e)
        return r - e.length;
      let c = l < r ? a.lastIndexOf(e, r - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t)
        return l + c;
      if (t == r && a.length >= r + e.length - l && a.slice(r - l, r - l + e.length) == e)
        return r;
    }
  }
  return -1;
}
function oi(n, e, t, r, s) {
  let i = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, u = l += a.size;
    c >= t || u <= e ? i.push(a) : (c < e && i.push(a.slice(0, e - c, r)), s && (i.push(s), s = void 0), u > t && i.push(a.slice(t - c, a.size, r)));
  }
  return i;
}
function Fi(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let s = n.docView.nearestDesc(t.focusNode), i = s && s.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (ls(t)) {
    for (a = o; s && !s.node; )
      s = s.parent;
    let d = s.node;
    if (s && d.isAtom && O.isSelectable(d) && s.parent && !(d.isInline && Rh(t.focusNode, t.focusOffset, s.dom))) {
      let f = s.posBefore;
      c = new O(o == f ? l : r.resolve(f));
    }
  } else {
    if (t instanceof n.dom.ownerDocument.defaultView.Selection && t.rangeCount > 1) {
      let d = o, f = o;
      for (let h = 0; h < t.rangeCount; h++) {
        let p = t.getRangeAt(h);
        d = Math.min(d, n.docView.posFromDOM(p.startContainer, p.startOffset, 1)), f = Math.max(f, n.docView.posFromDOM(p.endContainer, p.endOffset, -1));
      }
      if (d < 0)
        return null;
      [a, o] = f == n.state.selection.anchor ? [f, d] : [d, f], l = r.resolve(o);
    } else
      a = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (a < 0)
      return null;
  }
  let u = r.resolve(a);
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < l.pos && !i ? 1 : -1;
    c = Hi(n, u, l, d);
  }
  return c;
}
function pc(n) {
  return n.editable ? n.hasFocus() : gc(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Je(n, e = !1) {
  let t = n.state.selection;
  if (mc(n, t), !pc(n))
    return;
  let r = n.input.mouseDown;
  if (!e && se && r) {
    let s = n.domSelectionRange(), i = n.domObserver.currentSelection;
    if (s.anchorNode && i.anchorNode && Ot(s.anchorNode, s.anchorOffset, i.anchorNode, i.anchorOffset) && r.delaySelUpdate()) {
      n.domObserver.setCurSelection();
      return;
    }
  }
  if (n.domObserver.disconnectSelection(), n.cursorWrapper)
    lf(n);
  else {
    let { anchor: s, head: i } = t, o, l;
    rl && !(t instanceof N) && (t.$from.parent.inlineContent || (o = sl(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (l = sl(n, t.to))), n.docView.setSelection(s, i, n, e), rl && (o && il(o), l && il(l)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && of(n));
  }
  n.domObserver.setCurSelection(), n.domObserver.connectSelection();
}
const rl = le || se && tc < 63;
function sl(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), s = r < t.childNodes.length ? t.childNodes[r] : null, i = r ? t.childNodes[r - 1] : null;
  if (le && s && s.contentEditable == "false")
    return Os(s);
  if ((!s || s.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (s)
      return Os(s);
    if (i)
      return Os(i);
  }
}
function Os(n) {
  return n.contentEditable = "true", le && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function il(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function of(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, s = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != s) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!pc(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function lf(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, ne(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && pe && st <= 11 && (t.disabled = !0, t.disabled = !1);
}
function mc(n, e) {
  if (e instanceof O) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (ol(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    ol(n);
}
function ol(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Hi(n, e, t, r) {
  return n.someProp("createSelectionBetween", (s) => s(n, e, t)) || N.between(e, t, r);
}
function ll(n) {
  return n.editable && !n.hasFocus() ? !1 : gc(n);
}
function gc(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function af(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Ot(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function li(n, e) {
  let { $anchor: t, $head: r } = n.selection, s = e > 0 ? t.max(r) : t.min(r), i = s.parent.inlineContent ? s.depth ? n.doc.resolve(e > 0 ? s.after() : s.before()) : null : s;
  return i && I.findFrom(i, e);
}
function Ze(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function al(n, e, t) {
  let r = n.state.selection;
  if (r instanceof N)
    if (t.indexOf("s") > -1) {
      let { $head: s } = r, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter;
      if (!i || i.isText || !i.isLeaf)
        return !1;
      let o = n.state.doc.resolve(s.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return Ze(n, new N(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let s = li(n.state, e);
        return s && s instanceof O ? Ze(n, s) : !1;
      } else if (!(xe && t.indexOf("m") > -1)) {
        let s = r.$head, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter, o;
        if (!i || i.isText)
          return !1;
        let l = e < 0 ? s.pos - i.nodeSize : s.pos;
        return i.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? O.isSelectable(i) ? Ze(n, new O(e < 0 ? n.state.doc.resolve(s.pos - i.nodeSize) : s)) : Bn ? Ze(n, new N(n.state.doc.resolve(e < 0 ? l : l + i.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof O && r.node.isInline)
      return Ze(n, new N(e > 0 ? r.$to : r.$from));
    {
      let s = li(n.state, e);
      return s ? Ze(n, s) : !1;
    }
  }
}
function gr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function gn(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Bt(n, e) {
  return e < 0 ? cf(n) : uf(n);
}
function cf(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let s, i, o = !1;
  for (Se && t.nodeType == 1 && r < gr(t) && gn(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (gn(l, -1))
          s = t, i = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (yc(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && gn(l, -1); )
          s = t.parentNode, i = ne(l), l = l.previousSibling;
        if (l)
          t = l, r = gr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? ai(n, t, r) : s && ai(n, s, i);
}
function uf(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let s = gr(t), i, o;
  for (; ; )
    if (r < s) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (gn(l, 1))
        i = t, o = ++r;
      else
        break;
    } else {
      if (yc(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && gn(l, 1); )
          i = l.parentNode, o = ne(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, s = gr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = s = 0;
        }
      }
    }
  i && ai(n, i, o);
}
function yc(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function df(n, e) {
  for (; n && e == n.childNodes.length && !zn(n); )
    e = ne(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function hf(n, e) {
  for (; n && !e && !zn(n); )
    e = ne(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function ai(n, e, t) {
  if (e.nodeType != 3) {
    let i, o;
    (o = df(e, t)) ? (e = o, t = 0) : (i = hf(e, t)) && (e = i, t = i.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (ls(r)) {
    let i = document.createRange();
    i.setEnd(e, t), i.setStart(e, t), r.removeAllRanges(), r.addRange(i);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: s } = n;
  setTimeout(() => {
    n.state == s && Je(n);
  }, 50);
}
function cl(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(se || nc) && t.parent.inlineContent) {
    let s = n.coordsAtPos(e);
    if (e > t.start()) {
      let i = n.coordsAtPos(e - 1), o = (i.top + i.bottom) / 2;
      if (o > s.top && o < s.bottom && Math.abs(i.left - s.left) > 1)
        return i.left < s.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let i = n.coordsAtPos(e + 1), o = (i.top + i.bottom) / 2;
      if (o > s.top && o < s.bottom && Math.abs(i.left - s.left) > 1)
        return i.left > s.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function ul(n, e, t) {
  let r = n.state.selection;
  if (r instanceof N && !r.empty || t.indexOf("s") > -1 || xe && t.indexOf("m") > -1)
    return !1;
  let { $from: s, $to: i } = r;
  if (!s.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = li(n.state, e);
    if (o && o instanceof O)
      return Ze(n, o);
  }
  if (!s.parent.inlineContent) {
    let o = e < 0 ? s : i, l = r instanceof ge ? I.near(o, e) : I.findFrom(o, e);
    return l ? Ze(n, l) : !1;
  }
  return !1;
}
function dl(n, e) {
  if (!(n.state.selection instanceof N))
    return !0;
  let { $head: t, $anchor: r, empty: s } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!s)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let i = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (i && !i.isText) {
    let o = n.state.tr;
    return e < 0 ? o.delete(t.pos - i.nodeSize, t.pos) : o.delete(t.pos, t.pos + i.nodeSize), n.dispatch(o), !0;
  }
  return !1;
}
function hl(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function ff(n) {
  if (!le || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    hl(n, r, "true"), setTimeout(() => hl(n, r, "false"), 20);
  }
  return !1;
}
function pf(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function mf(n, e) {
  let t = e.keyCode, r = pf(e);
  if (t == 8 || xe && t == 72 && r == "c")
    return dl(n, -1) || Bt(n, -1);
  if (t == 46 && !e.shiftKey || xe && t == 68 && r == "c")
    return dl(n, 1) || Bt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || xe && t == 66 && r == "c") {
    let s = t == 37 ? cl(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return al(n, s, r) || Bt(n, s);
  } else if (t == 39 || xe && t == 70 && r == "c") {
    let s = t == 39 ? cl(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return al(n, s, r) || Bt(n, s);
  } else {
    if (t == 38 || xe && t == 80 && r == "c")
      return ul(n, -1, r) || Bt(n, -1);
    if (t == 40 || xe && t == 78 && r == "c")
      return ff(n) || ul(n, 1, r) || Bt(n, 1);
    if (r == (xe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Vi(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: s, openEnd: i } = e;
  for (; s > 1 && i > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    s--, i--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || It.fromSchema(n.state.schema), l = Tc(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = Sc[c.nodeName.toLowerCase()]); ) {
    for (let h = u.length - 1; h >= 0; h--) {
      let p = l.createElement(u[h]);
      for (; a.firstChild; )
        p.appendChild(a.firstChild);
      a.appendChild(p), d++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${s} ${i}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let f = n.someProp("clipboardTextSerializer", (h) => h(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: f, slice: e };
}
function kc(n, e, t, r, s) {
  let i = s.parent.type.spec.code, o, l;
  if (!t && !e)
    return null;
  let a = !!e && (r || i || !t);
  if (a) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, i || r, n);
    }), i)
      return l = new C(b.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        l = f(l, n, !0);
      }), l;
    let d = n.someProp("clipboardTextParser", (f) => f(e, s, r, n));
    if (d)
      l = d;
    else {
      let f = s.marks(), { schema: h } = n.state, p = It.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = bf(t), Bn && xf(o);
  let c = o && o.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let d = +u[3]; d > 0; d--) {
      let f = o.firstChild;
      for (; f && f.nodeType != 1; )
        f = f.nextSibling;
      if (!f)
        break;
      o = f;
    }
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || Ue.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || u),
    context: s,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !gf.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = wf(fl(l, +u[1], +u[2]), u[4]);
  else if (l = C.maxOpen(yf(l.content, s), !0), l.openStart || l.openEnd) {
    let d = 0, f = 0;
    for (let h = l.content.firstChild; d < l.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = l.content.lastChild; f < l.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    l = fl(l, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    l = d(l, n, a);
  }), l;
}
const gf = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function yf(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let s = e.node(t).contentMatchAt(e.index(t)), i, o = [];
    if (n.forEach((l) => {
      if (!o)
        return;
      let a = s.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && i.length && xc(a, i, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = wc(o[o.length - 1], i.length));
        let u = bc(l, a);
        o.push(u), s = s.matchType(u.type), i = a;
      }
    }), o)
      return b.from(o);
  }
  return n;
}
function bc(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, b.from(n));
  return n;
}
function xc(n, e, t, r, s) {
  if (s < n.length && s < e.length && n[s] == e[s]) {
    let i = xc(n, e, t, r.lastChild, s + 1);
    if (i)
      return r.copy(r.content.replaceChild(r.childCount - 1, i));
    if (r.contentMatchAt(r.childCount).matchType(s == n.length - 1 ? t.type : n[s + 1]))
      return r.copy(r.content.append(b.from(bc(t, n, s + 1))));
  }
}
function wc(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, wc(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(b.empty, !0);
  return n.copy(t.append(r));
}
function ci(n, e, t, r, s, i) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return n.childCount > 1 && (i = 0), s < r - 1 && (l = ci(l, e, t, r, s + 1, i)), s >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, i <= s).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(b.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function fl(n, e, t) {
  return e < n.openStart && (n = new C(ci(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new C(ci(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Sc = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
function Tc() {
  return document.implementation.createHTMLDocument("title");
}
let Ns = null;
function kf(n) {
  let e = window.trustedTypes;
  return e ? (Ns || (Ns = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), Ns.createHTML(n)) : n;
}
function bf(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Tc(), r = t.body, s = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = s && Sc[s[1].toLowerCase()]) && (n = i.map((o) => "<" + o + ">").join("") + n + i.map((o) => "</" + o + ">").reverse().join("")), r.innerHTML = kf(n), i)
    for (let o = 0; o < i.length; o++)
      r = r.querySelector(i[o]) || r;
  for (let o = 0; o < t.styleSheets.length; o++) {
    let l = t.styleSheets[o];
    for (let a = 0; a < l.rules.length; a++) {
      let c = l.rules[a];
      if (c instanceof CSSStyleRule) {
        let u = r.querySelectorAll(c.selectorText);
        for (let d = 0; d < u.length; d++)
          u[d].style.cssText += c.style.cssText;
      }
    }
  }
  return r;
}
function xf(n) {
  let e = n.querySelectorAll(se ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function wf(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: s, openStart: i, openEnd: o } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    s = b.from(a.create(r[l + 1], s)), i++, o++;
  }
  return new C(s, i, o);
}
const de = {}, he = {}, Sf = { touchstart: !0, touchmove: !0 };
class Tf {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Mf(n) {
  for (let e in de) {
    let t = de[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      vf(n, r) && !ji(n, r) && (n.editable || !(r.type in he)) && t(n, r);
    }, Sf[e] ? { passive: !0 } : void 0);
  }
  le && n.dom.addEventListener("input", () => null), ui(n);
}
function qe(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Cf(n) {
  n.input.mouseDown && n.input.mouseDown.done(), n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function ui(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => ji(n, r));
  });
}
function ji(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function vf(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Ef(n, e) {
  !ji(n, e) && de[e.type] && (n.editable || !(e.type in he)) && de[e.type](n, e);
}
he.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Ec(n) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(We && se && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), Ut && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (s) => s(n, pt(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || mf(n, t) ? t.preventDefault() : qe(n, "key");
};
he.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
he.keypress = (n, e) => {
  let t = e;
  if (Ec(n) || !t.charCode || t.ctrlKey && !t.altKey || xe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (s) => s(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof N) || !r.$from.sameParent(r.$to)) {
    let s = String.fromCharCode(t.charCode), i = () => n.state.tr.insertText(s).scrollIntoView();
    !/[\r\n]/.test(s) && !n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, s, i)) && n.dispatch(i()), t.preventDefault();
  }
};
function _n(n) {
  return { left: n.clientX, top: n.clientY };
}
function Af(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function Wi(n, e, t, r, s) {
  if (r == -1)
    return !1;
  let i = n.state.doc.resolve(r);
  for (let o = i.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > i.depth ? l(n, t, i.nodeAfter, i.before(o), s, !0) : l(n, t, i.node(o), i.before(o), s, !1)))
      return !0;
  return !1;
}
function Fn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function Of(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && O.isSelectable(r) ? (Fn(n, new O(t)), !0) : !1;
}
function Nf(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, s;
  t instanceof O && (r = t.node);
  let i = n.state.doc.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let l = o > i.depth ? i.nodeAfter : i.node(o);
    if (O.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && i.before(t.$from.depth + 1) == t.$from.pos ? s = i.before(t.$from.depth) : s = i.before(o);
      break;
    }
  }
  return s != null ? (Fn(n, O.create(n.state.doc, s)), !0) : !1;
}
function Rf(n, e, t, r, s) {
  return Wi(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (i) => i(n, e, r)) || (s ? Nf(n, t) : Of(n, t));
}
function If(n, e, t, r) {
  return Wi(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (s) => s(n, e, r));
}
function Df(n, e, t, r) {
  return Wi(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (s) => s(n, e, r)) || Lf(n, t, r);
}
function Lf(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = Mc(n, e, !0), s = n.state.doc;
  return r ? (Fn(n, r), r instanceof N && s.eq(n.state.doc) && (n.input.mouseDown = new zf(n, r)), !0) : !1;
}
function Mc(n, e, t) {
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? N.create(r, 0, r.content.size) : null;
  let s = r.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let o = i > s.depth ? s.nodeAfter : s.node(i), l = s.before(i);
    if (o.inlineContent)
      return N.create(r, l + 1, l + 1 + o.content.size);
    if (t && O.isSelectable(o))
      return O.create(r, l);
  }
  return null;
}
function qi(n) {
  return yr(n);
}
const Cc = xe ? "metaKey" : "ctrlKey";
de.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = qi(n), s = Date.now(), i = "singleClick";
  s - n.input.lastClick.time < 500 && Af(t, n.input.lastClick) && !t[Cc] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? i = "doubleClick" : n.input.lastClick.type == "doubleClick" && (i = "tripleClick")), n.input.lastClick = { time: s, x: t.clientX, y: t.clientY, type: i, button: t.button }, n.input.mouseDown && n.input.mouseDown.done();
  let o = n.posAtCoords(_n(t));
  o && (i == "singleClick" ? n.input.mouseDown = new Pf(n, o, t, !!r) : (i == "doubleClick" ? If : Df)(n, o.pos, o.inside, t) ? t.preventDefault() : qe(n, "pointer"));
};
class vc {
  constructor(e) {
    this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
  }
  up(e) {
    this.done();
  }
  move(e) {
    e.buttons == 0 && this.done();
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
  }
  delaySelUpdate() {
    return !1;
  }
}
class Pf extends vc {
  constructor(e, t, r, s) {
    super(e), this.pos = t, this.event = r, this.flushed = s, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!r[Cc], this.allowDefault = r.shiftKey;
    let i, o;
    if (t.inside > -1)
      i = e.state.doc.nodeAt(t.inside), o = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      i = u.parent, o = u.depth ? u.before() : 0;
    }
    const l = s ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a && a.nodeDOM.nodeType == 1 ? a.nodeDOM : null;
    let { selection: c } = e.state;
    r.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof O && c.from <= o && c.to > o) && (this.mightDrag = {
      node: i,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Se && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), qe(e, "pointer");
  }
  done() {
    super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
      this.view.isDestroyed || Je(this.view);
    });
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(_n(e))), this.updateAllowDefault(e), this.allowDefault || !t ? qe(this.view, "pointer") : Rf(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    le && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    se && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Fn(this.view, I.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : qe(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), qe(this.view, "pointer"), super.move(e);
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
  delaySelUpdate() {
    return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
  }
}
class zf extends vc {
  constructor(e, t) {
    super(e), this.startSelection = t, this.startDoc = e.state.doc;
  }
  move(e) {
    if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
      this.done();
      return;
    }
    e.preventDefault(), qe(this.view, "pointer");
    let t = this.view.posAtCoords(_n(e)), r = t && Mc(this.view, t.inside, !1);
    if (!r)
      return;
    let { doc: s } = this.view.state, i = this.startSelection, [o, l] = r.from < i.from ? [i.to, r.from] : [i.from, r.to];
    Fn(this.view, N.create(s, o, l));
  }
}
de.touchstart = (n) => {
  n.input.lastTouch = Date.now(), qi(n), qe(n, "pointer");
};
de.touchmove = (n) => {
  n.input.lastTouch = Date.now(), qe(n, "pointer");
};
de.contextmenu = (n) => qi(n);
function Ec(n, e) {
  return n.composing ? !0 : le && Math.abs(Date.now() - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const Bf = We ? 5e3 : -1;
he.compositionstart = he.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof N && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || se && nc && $f(n)))
      n.markCursor = n.state.storedMarks || t.marks(), yr(n, !0), n.markCursor = null;
    else if (yr(n, !e.selection.empty), Se && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let s = r.focusNode, i = r.focusOffset; s && s.nodeType == 1 && i != 0; ) {
        let o = i < 0 ? s.lastChild : s.childNodes[i - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          let l = n.domSelection();
          l && l.collapse(o, o.nodeValue.length);
          break;
        } else
          s = o, i = -1;
      }
    }
    n.input.composing = !0;
  }
  Ac(n, Bf);
};
function $f(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
he.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now(), n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Ac(n, 20));
};
function Ac(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => yr(n), e));
}
function Oc(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function _f(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Oh(e.focusNode, e.focusOffset), r = Nh(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let s = r.pmViewDesc, i = n.domObserver.lastChangedTextNode;
    if (t == i || r == i)
      return i;
    if (!s || !s.isText(r.nodeValue))
      return r;
    if (n.input.compositionNode == r) {
      let o = t.pmViewDesc;
      if (!(!o || !o.isText(t.nodeValue)))
        return r;
    }
  }
  return t || r;
}
function yr(n, e = !1) {
  if (!(We && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Oc(n), e || n.docView && n.docView.dirty) {
      let t = Fi(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Ff(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), s = document.createRange();
  s.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(s), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Nn = pe && st < 15 || Ut && Lh < 604;
de.copy = he.cut = (n, e) => {
  let t = e, r = n.state.selection, s = t.type == "cut";
  if (r.empty)
    return;
  let i = Nn ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = Vi(n, o);
  i ? (t.preventDefault(), i.clearData(), i.setData("text/html", l.innerHTML), i.setData("text/plain", a)) : Ff(n, l), s && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Hf(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Vf(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let s = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Rn(n, r.value, null, s, e) : Rn(n, r.textContent, r.innerHTML, s, e);
  }, 50);
}
function Rn(n, e, t, r, s) {
  let i = kc(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, s, i || C.empty)))
    return !0;
  if (!i)
    return !1;
  let o = Hf(i), l = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(i);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Nc(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
he.paste = (n, e) => {
  let t = e;
  if (n.composing && !We)
    return;
  let r = Nn ? null : t.clipboardData, s = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Rn(n, Nc(r), r.getData("text/html"), s, t) ? t.preventDefault() : Vf(n, t);
};
class Rc {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const jf = xe ? "altKey" : "ctrlKey";
function Ic(n, e) {
  let t;
  return n.someProp("dragCopies", (r) => {
    t = t || r(e);
  }), t != null ? !t : !e[jf];
}
de.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let s = n.state.selection, i = s.empty ? null : n.posAtCoords(_n(t)), o;
  if (!(i && i.pos >= s.from && i.pos <= (s instanceof O ? s.to - 1 : s.to))) {
    if (r && r.mightDrag)
      o = O.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = O.create(n.state.doc, d.posBefore));
    }
  }
  let l = (o || n.state.selection).content(), { dom: a, text: c, slice: u } = Vi(n, l);
  (!t.dataTransfer.files.length || !se || tc > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Nn ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Nn || t.dataTransfer.setData("text/plain", c), n.dragging = new Rc(u, Ic(n, t), o);
};
de.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
he.dragover = he.dragenter = (n, e) => e.preventDefault();
he.drop = (n, e) => {
  try {
    Wf(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function Wf(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(_n(e));
  if (!r)
    return;
  let s = n.state.doc.resolve(r.pos), i = t && t.slice;
  i ? n.someProp("transformPasted", (h) => {
    i = h(i, n, !1);
  }) : i = kc(n, Nc(e.dataTransfer), Nn ? null : e.dataTransfer.getData("text/html"), !1, s);
  let o = !!(t && Ic(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, i || C.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!i)
    return;
  e.preventDefault();
  let l = i ? Da(n.state.doc, s.pos, i) : s.pos;
  l == null && (l = s.pos);
  let a = n.state.tr;
  if (o) {
    let { node: h } = t;
    h ? h.replace(a) : a.deleteSelection();
  }
  let c = a.mapping.map(l), u = i.openStart == 0 && i.openEnd == 0 && i.content.childCount == 1, d = a.doc;
  if (u ? a.replaceRangeWith(c, c, i.content.firstChild) : a.replaceRange(c, c, i), a.doc.eq(d))
    return;
  let f = a.doc.resolve(c);
  if (u && O.isSelectable(i.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(i.content.firstChild))
    a.setSelection(new O(f));
  else {
    let h = a.mapping.map(l);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((p, m, g, y) => h = y), a.setSelection(Hi(n, f, a.doc.resolve(h)));
  }
  n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
}
de.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Je(n);
  }, 20));
};
de.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
de.beforeinput = (n, e) => {
  if (We && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (i) => i(n, pt(8, "Backspace")))))
        return;
      let { $cursor: s } = n.state.selection;
      s && s.pos > 0 && n.dispatch(n.state.tr.delete(s.pos - 1, s.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in he)
  de[n] = he[n];
function In(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class kr {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Mt, this.side = this.spec.side || 0;
  }
  map(e, t, r, s) {
    let { pos: i, deleted: o } = e.mapResult(t.from + s, this.side < 0 ? -1 : 1);
    return o ? null : new ce(i - r, i - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof kr && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && In(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class lt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Mt;
  }
  map(e, t, r, s) {
    let i = e.map(t.from + s, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + s, this.spec.inclusiveEnd ? 1 : -1) - r;
    return i >= o ? null : new ce(i, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof lt && In(this.attrs, e.attrs) && In(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof lt;
  }
  destroy() {
  }
}
class Ui {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Mt;
  }
  map(e, t, r, s) {
    let i = e.mapResult(t.from + s, 1);
    if (i.deleted)
      return null;
    let o = e.mapResult(t.to + s, -1);
    return o.deleted || o.pos <= i.pos ? null : new ce(i.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: s } = e.content.findIndex(t.from), i;
    return s == t.from && !(i = e.child(r)).isText && s + i.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Ui && In(this.attrs, e.attrs) && In(this.spec, e.spec);
  }
  destroy() {
  }
}
class ce {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  /**
  @internal
  */
  copy(e, t) {
    return new ce(e, t, this.type);
  }
  /**
  @internal
  */
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  /**
  @internal
  */
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, t, r) {
    return new ce(e, e, new kr(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, s) {
    return new ce(e, t, new lt(r, s));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, s) {
    return new ce(e, t, new Ui(r, s));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof lt;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof kr;
  }
}
const _t = [], Mt = {};
class _ {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : _t, this.children = t.length ? t : _t;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? br(t, e, 0, Mt) : oe;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, t, r) {
    let s = [];
    return this.findInner(e ?? 0, t ?? 1e9, s, 0, r), s;
  }
  findInner(e, t, r, s, i) {
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      l.from <= t && l.to >= e && (!i || i(l.spec)) && r.push(l.copy(l.from + s, l.to + s));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < t && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, t - l, r, s + l, i);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == oe || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Mt);
  }
  /**
  @internal
  */
  mapInner(e, t, r, s, i) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, s);
      a && a.type.valid(t, a) ? (o || (o = [])).push(a) : i.onRemove && i.onRemove(this.local[l].spec);
    }
    return this.children.length ? qf(this.children, o || [], e, t, r, s, i) : o ? new _(o.sort(Ct), _t) : oe;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == oe ? _.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let s, i = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (u = Lc(t, l, c)) {
        for (s || (s = this.children.slice()); i < s.length && s[i] < a; )
          i += 3;
        s[i] == a ? s[i + 2] = s[i + 2].addInner(l, u, c + 1) : s.splice(i, 0, a, a + l.nodeSize, br(u, l, c + 1, Mt)), i += 3;
      }
    });
    let o = Dc(i ? Pc(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new _(o.length ? this.local.concat(o).sort(Ct) : this.local, s || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == oe ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, s = this.local;
    for (let i = 0; i < r.length; i += 3) {
      let o, l = r[i] + t, a = r[i + 1] + t;
      for (let u = 0, d; u < e.length; u++)
        (d = e[u]) && d.from > l && d.to < a && (e[u] = null, (o || (o = [])).push(d));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[i + 2].removeInner(o, l + 1);
      c != oe ? r[i + 2] = c : (r.splice(i, 3), i -= 3);
    }
    if (s.length) {
      for (let i = 0, o; i < e.length; i++)
        if (o = e[i])
          for (let l = 0; l < s.length; l++)
            s[l].eq(o, t) && (s == this.local && (s = this.local.slice()), s.splice(l--, 1));
    }
    return r == this.children && s == this.local ? this : s.length || r.length ? new _(s, r) : oe;
  }
  forChild(e, t) {
    if (this == oe)
      return this;
    if (t.isLeaf)
      return _.empty;
    let r, s;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let i = e + 1, o = i + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > i && a.type instanceof lt) {
        let c = Math.max(i, a.from) - i, u = Math.min(o, a.to) - i;
        c < u && (s || (s = [])).push(a.copy(c, u));
      }
    }
    if (s) {
      let l = new _(s.sort(Ct), _t);
      return r ? new tt([l, r]) : l;
    }
    return r || oe;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof _) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return Ki(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == oe)
      return _t;
    if (e.inlineContent || !this.local.some(lt.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof lt || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
_.empty = new _([], []);
_.removeOverlap = Ki;
const oe = _.empty;
class tt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((s) => s.map(e, t, Mt));
    return tt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return _.empty;
    let r = [];
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].forChild(e, t);
      i != oe && (i instanceof tt ? r = r.concat(i.members) : r.push(i));
    }
    return tt.from(r);
  }
  eq(e) {
    if (!(e instanceof tt) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].localsInner(e);
      if (i.length)
        if (!t)
          t = i;
        else {
          r && (t = t.slice(), r = !1);
          for (let o = 0; o < i.length; o++)
            t.push(i[o]);
        }
    }
    return t ? Ki(r ? t : t.sort(Ct)) : _t;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return oe;
      case 1:
        return e[0];
      default:
        return new tt(e.every((t) => t instanceof _) ? e : e.reduce((t, r) => t.concat(r instanceof _ ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function qf(n, e, t, r, s, i, o) {
  let l = n.slice();
  for (let c = 0, u = i; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let y = 0; y < l.length; y += 3) {
        let k = l[y + 1];
        if (k < 0 || f > k + u - d)
          continue;
        let S = l[y] + u - d;
        h >= S ? l[y + 1] = f <= S ? -2 : -1 : f >= u && g && (l[y] += g, l[y + 1] += g);
      }
      d += g;
    }), u = t.maps[c].map(u, -1);
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        a = !0, l[c + 1] = -1;
        continue;
      }
      let u = t.map(n[c] + i), d = u - s;
      if (d < 0 || d >= r.content.size) {
        a = !0;
        continue;
      }
      let f = t.map(n[c + 1] + i, -1), h = f - s, { index: p, offset: m } = r.content.findIndex(d), g = r.maybeChild(p);
      if (g && m == d && m + g.nodeSize == h) {
        let y = l[c + 2].mapInner(t, g, u + 1, n[c] + i + 1, o);
        y != oe ? (l[c] = d, l[c + 1] = h, l[c + 2] = y) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = Uf(l, n, e, t, s, i, o), u = br(c, r, 0, o);
    e = u.local;
    for (let d = 0; d < l.length; d += 3)
      l[d + 1] < 0 && (l.splice(d, 3), d -= 3);
    for (let d = 0, f = 0; d < u.children.length; d += 3) {
      let h = u.children[d];
      for (; f < l.length && l[f] < h; )
        f += 3;
      l.splice(f, 0, u.children[d], u.children[d + 1], u.children[d + 2]);
    }
  }
  return new _(e.sort(Ct), l);
}
function Dc(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let s = n[r];
    t.push(new ce(s.from + e, s.to + e, s.type));
  }
  return t;
}
function Uf(n, e, t, r, s, i, o) {
  function l(a, c) {
    for (let u = 0; u < a.local.length; u++) {
      let d = a.local[u].map(r, s, c);
      d ? t.push(d) : o.onRemove && o.onRemove(a.local[u].spec);
    }
    for (let u = 0; u < a.children.length; u += 3)
      l(a.children[u + 2], a.children[u] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + i + 1);
  return t;
}
function Lc(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, s = null;
  for (let i = 0, o; i < n.length; i++)
    (o = n[i]) && o.from > t && o.to < r && ((s || (s = [])).push(o), n[i] = null);
  return s;
}
function Pc(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function br(n, e, t, r) {
  let s = [], i = !1;
  e.forEach((l, a) => {
    let c = Lc(n, l, a + t);
    if (c) {
      i = !0;
      let u = br(c, l, t + a + 1, r);
      u != oe && s.push(a, a + l.nodeSize, u);
    }
  });
  let o = Dc(i ? Pc(n) : n, -t).sort(Ct);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || s.length ? new _(o, s) : oe;
}
function Ct(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Ki(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let s = t + 1; s < e.length; s++) {
        let i = e[s];
        if (i.from == r.from) {
          i.to != r.to && (e == n && (e = n.slice()), e[s] = i.copy(i.from, r.to), pl(e, s + 1, i.copy(r.to, i.to)));
          continue;
        } else {
          i.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, i.from), pl(e, s, r.copy(i.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function pl(n, e, t) {
  for (; e < n.length && Ct(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Rs(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != oe && e.push(r);
  }), n.cursorWrapper && e.push(_.create(n.state.doc, [n.cursorWrapper.deco])), tt.from(e);
}
const Kf = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Jf = pe && st <= 11;
class Gf {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class Qf {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Gf(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let s = 0; s < r.length; s++)
        this.queue.push(r[s]);
      pe && st <= 11 && r.some((s) => s.type == "childList" && s.removedNodes.length || s.type == "characterData" && s.oldValue.length > s.target.nodeValue.length) ? this.flushSoon() : le && e.composing && r.some((s) => s.type == "childList" && s.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), Jf && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Kf)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (ll(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Je(this.view);
      if (pe && st <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Ot(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let i = e.focusNode; i; i = qt(i))
      t.add(i);
    for (let i = e.anchorNode; i; i = qt(i))
      if (t.has(i)) {
        r = i;
        break;
      }
    let s = r && this.view.docView.nearestDesc(r);
    if (s && s.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords())
        this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(), s = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && ll(e) && !this.ignoreSelectionChange(r), i = -1, o = -1, l = !1, a = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let d = this.registerMutation(t[u], a);
        d && (i = i < 0 ? d.from : Math.min(d.from, i), o = o < 0 ? d.to : Math.max(d.to, o), d.typeOver && (l = !0));
      }
    if (a.some((u) => u.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || se && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((u) => u.type == "childList" && u.removedNodes.length))) {
      for (let u of a)
        if (u.nodeName == "BR" && u.parentNode) {
          let d = u.nextSibling;
          for (; d && d.nodeType == 1; ) {
            if (d.contentEditable == "false") {
              u.parentNode.removeChild(u);
              break;
            }
            d = d.firstChild;
          }
        }
    } else if (Se && a.length) {
      let u = a.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || Yf(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    i < 0 && s && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && ls(r) && (c = Fi(e)) && c.eq(I.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Je(e), this.currentSelection.set(r), e.scrollToSelection()) : (i > -1 || s) && (i > -1 && (e.docView.markDirty(i, o), Xf(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, ep(e, a)), this.handleDOMChange(i, o, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Je(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let u = 0; u < e.addedNodes.length; u++) {
        let d = e.addedNodes[u];
        t.push(d), d.nodeType == 3 && (this.lastChangedTextNode = d);
      }
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let s = e.previousSibling, i = e.nextSibling;
      if (pe && st <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (s = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (i = f);
        }
      let o = s && s.parentNode == e.target ? ne(s) + 1 : 0, l = r.localPosFromDOM(e.target, o, -1), a = i && i.parentNode == e.target ? ne(i) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
      return { from: l, to: c };
    } else return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : (this.lastChangedTextNode = e.target, {
      from: r.posAtStart,
      to: r.posAtEnd,
      // An event was generated for a text change that didn't change
      // any text. Mark the dom change to fall back to assuming the
      // selection was typed over with an identical value if it can't
      // find another change.
      typeOver: e.target.nodeValue == e.oldValue
    });
  }
}
let ml = /* @__PURE__ */ new WeakMap(), gl = !1;
function Xf(n) {
  if (!ml.has(n) && (ml.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = Se, gl)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), gl = !0;
  }
}
function yl(n, e) {
  let t = e.startContainer, r = e.startOffset, s = e.endContainer, i = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return Ot(o.node, o.offset, s, i) && ([t, r, s, i] = [s, i, t, r]), { anchorNode: t, anchorOffset: r, focusNode: s, focusOffset: i };
}
function Zf(n, e) {
  if (e.getComposedRanges) {
    let s = e.getComposedRanges(n.root)[0];
    if (s)
      return yl(n, s);
  }
  let t;
  function r(s) {
    s.preventDefault(), s.stopImmediatePropagation(), t = s.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? yl(n, t) : null;
}
function Yf(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function ep(n, e) {
  var t;
  let { focusNode: r, focusOffset: s } = n.domSelectionRange();
  for (let i of e)
    if (((t = i.parentNode) === null || t === void 0 ? void 0 : t.nodeName) == "TR") {
      let o = i.nextSibling;
      for (; o && o.nodeName != "TD" && o.nodeName != "TH"; )
        o = o.nextSibling;
      if (o) {
        let l = o;
        for (; ; ) {
          let a = l.firstChild;
          if (!a || a.nodeType != 1 || a.contentEditable == "false" || /^(BR|IMG)$/.test(a.nodeName))
            break;
          l = a;
        }
        l.insertBefore(i, l.firstChild), r == i && n.domSelection().collapse(i, s);
      } else
        i.parentNode.removeChild(i);
    }
}
function tp(n, e, t, r) {
  let { node: s, fromOffset: i, toOffset: o, from: l, to: a } = n.docView.parseRange(e, t), c = n.domSelectionRange(), u, d = c.anchorNode;
  if (d && n.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (u = [{ node: d, offset: c.anchorOffset }], ls(c) || u.push({ node: c.focusNode, offset: c.focusOffset })), se && n.input.lastKeyCode === 8)
    for (let y = o; y > i; y--) {
      let k = s.childNodes[y - 1], S = k.pmViewDesc;
      if (k.nodeName == "BR" && !S) {
        o = y;
        break;
      }
      if (!S || S.size)
        break;
    }
  let f = n.state.doc, h = n.someProp("domParser") || Ue.fromSchema(n.state.schema), p = f.resolve(l), m = null, g = h.parse(s, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: i,
    to: o,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: u,
    ruleFromNode: np(r),
    context: p
  });
  if (u && u[0].pos != null) {
    let y = u[0].pos, k = u[1] && u[1].pos;
    k == null && (k = y), m = { anchor: y + l, head: k + l };
  }
  return { doc: g, sel: m, from: l, to: a };
}
const np = (n) => (e) => {
  let t = e.pmViewDesc;
  if (t)
    return t.parseRule(n);
  if (e.nodeName == "BR" && e.parentNode) {
    if (le && /^(ul|ol)$/i.test(e.parentNode.nodeName)) {
      let r = document.createElement("div");
      return r.appendChild(document.createElement("li")), { skip: r };
    } else if (e.parentNode.lastChild == e || le && /^(tr|table)$/i.test(e.parentNode.nodeName))
      return { ignore: !0 };
  } else if (e.nodeName == "IMG" && e.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}, rp = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function sp(n, e, t, r, s) {
  let i = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let M = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, A = Fi(n, M);
    if (A && !n.state.selection.eq(A)) {
      if (se && We && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (X) => X(n, pt(13, "Enter"))))
        return;
      let R = n.state.tr.setSelection(A);
      M == "pointer" ? R.setMeta("pointer", !0) : M == "key" && R.scrollIntoView(), i && R.setMeta("composition", i), n.dispatch(R);
    }
    return;
  }
  let o = n.state.doc.resolve(e), l = o.sharedDepth(t);
  e = o.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = tp(n, e, t, s), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = lp(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (Ut && n.input.lastIOSEnter > Date.now() - 225 || We) && s.some((M) => M.nodeType == 1 && !rp.test(M.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (M) => M(n, pt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof N && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let M = kl(n, n.state.doc, c.sel);
        if (M && !M.eq(n.state.selection)) {
          let A = n.state.tr.setSelection(M);
          i && A.setMeta("composition", i), n.dispatch(A);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof N && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), pe && st <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = u.resolve(p.start), k = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA;
  if ((Ut && n.input.lastIOSEnter > Date.now() - 225 && (!k || s.some((M) => M.nodeName == "DIV" || M.nodeName == "P")) || !k && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (M) => M(n, pt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && op(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (M) => M(n, pt(8, "Backspace")))) {
    We && se && n.domObserver.suppressSelectionUpdates();
    return;
  }
  se && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), We && !k && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(M) {
      return M(n, pt(13, "Enter"));
    });
  }, 20));
  let S = p.start, T = p.endA, x = (M) => {
    let A = M || n.state.tr.replace(S, T, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let R = kl(n, A.doc, c.sel);
      R && !(se && n.composing && R.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (R.head == S || R.head == A.mapping.map(T) - 1) || pe && R.empty && R.head == S) && A.setSelection(R);
    }
    return i && A.setMeta("composition", i), A.scrollIntoView();
  }, E;
  if (k)
    if (m.pos == g.pos) {
      pe && st <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Je(n), 20));
      let M = x(n.state.tr.delete(S, T)), A = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      A && M.ensureMarks(A), n.dispatch(M);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (E = ip(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    ) {
      let M = x(n.state.tr);
      E.type == "add" ? M.addMark(S, T, E.mark) : M.removeMark(S, T, E.mark), n.dispatch(M);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let M = m.parent.textBetween(m.parentOffset, g.parentOffset), A = () => x(n.state.tr.insertText(M, S, T));
      n.someProp("handleTextInput", (R) => R(n, S, T, M, A)) || n.dispatch(A());
    } else
      n.dispatch(x());
  else
    n.dispatch(x());
}
function kl(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Hi(n, e.resolve(t.anchor), e.resolve(t.head));
}
function ip(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, s = t, i = r, o, l, a;
  for (let u = 0; u < r.length; u++)
    s = r[u].removeFromSet(s);
  for (let u = 0; u < t.length; u++)
    i = t[u].removeFromSet(i);
  if (s.length == 1 && i.length == 0)
    l = s[0], o = "add", a = (u) => u.mark(l.addToSet(u.marks));
  else if (s.length == 0 && i.length == 1)
    l = i[0], o = "remove", a = (u) => u.mark(l.removeFromSet(u.marks));
  else
    return null;
  let c = [];
  for (let u = 0; u < e.childCount; u++)
    c.push(a(e.child(u)));
  if (b.from(c).eq(n))
    return { mark: l, type: o };
}
function op(n, e, t, r, s) {
  if (
    // The content must have shrunk
    t - e <= s.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    Is(r, !0, !1) < s.pos
  )
    return !1;
  let i = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = i.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock)
    return !1;
  let o = n.resolve(Is(i, !0, !0));
  return !o.parent.isTextblock || o.pos > t || Is(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Is(n, e, t) {
  let r = n.depth, s = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, s++, e = !1;
  if (t) {
    let i = n.node(r).maybeChild(n.indexAfter(r));
    for (; i && !i.isLeaf; )
      i = i.firstChild, s++;
  }
  return s;
}
function lp(n, e, t, r, s) {
  let i = n.findDiffStart(e, t), o = t + n.size, l = t + e.size;
  if (i == null)
    return null;
  let { a, b: c } = n.findDiffEnd(e, o, l);
  if (s == "end") {
    let u = Math.max(0, i - Math.min(a, c));
    r -= a + u - i;
  }
  if (a < i && o < l) {
    let u = r <= i && r >= a ? i - r : 0;
    i -= u, c = i + (c - a), a = i;
  } else if (c < i) {
    let u = r <= i && r >= c ? i - r : 0;
    i -= u, a = i + (a - c), c = i;
  }
  return { start: i, endA: a, endB: c };
}
class zc {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Tf(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Tl), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = wl(this), xl(this), this.nodeViews = Sl(this), this.docView = tl(this.state.doc, bl(this), Rs(this), this.dom, this), this.domObserver = new Qf(this, (r, s, i, o) => sp(this, r, s, i, o)), this.domObserver.start(), Mf(this), this.updatePluginViews();
  }
  /**
  Holds `true` when a
  [composition](https://w3c.github.io/uievents/#events-compositionevents)
  is active.
  */
  get composing() {
    return this.input.composing;
  }
  /**
  The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
  */
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && ui(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Tl), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let s = this.state, i = !1, o = !1;
    e.storedMarks && this.composing && (Oc(this), o = !0), this.state = e;
    let l = s.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = Sl(this);
      cp(h, this.nodeViews) && (this.nodeViews = h, i = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && ui(this), this.editable = wl(this), xl(this);
    let a = Rs(this), c = bl(this), u = s.plugins != e.plugins && !s.doc.eq(e.doc) ? "reset" : e.scrollToSelection > s.scrollToSelection ? "to selection" : "preserve", d = i || !this.docView.matchesNode(e.doc, c, a);
    (d || !e.selection.eq(s.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && Bh(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (pe || se) && !this.composing && !s.selection.empty && !e.selection.empty && ap(s.selection, e.selection);
      if (d) {
        let m = se ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = _f(this)), (i || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = tl(e.doc, c, a, this.dom, this)), m && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      let p = this.input.mouseDown;
      h || !(p && this.domObserver.currentSelection.eq(this.domSelectionRange()) && af(this) && p.delaySelUpdate()) ? Je(this, h) : (mc(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(s), !((r = this.dragging) === null || r === void 0) && r.node && !s.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, s), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && $h(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof O) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && Qo(this, t.getBoundingClientRect(), e);
      } else
        Qo(this, this.coordsAtPos(this.state.selection.head, 1), e);
    }
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node, s = -1;
    if (r.from < this.state.doc.content.size && this.state.doc.nodeAt(r.from) == r.node)
      s = r.from;
    else {
      let i = r.from + (this.state.doc.content.size - t.doc.content.size);
      (i > 0 && i < this.state.doc.content.size && this.state.doc.nodeAt(i)) == r.node && (s = i);
    }
    this.dragging = new Rc(e.slice, e.move, s < 0 ? void 0 : O.create(this.state.doc, s));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], s;
    if (r != null && (s = t ? t(r) : r))
      return s;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let l = this.directPlugins[o].props[e];
      if (l != null && (s = t ? t(l) : l))
        return s;
    }
    let i = this.state.plugins;
    if (i)
      for (let o = 0; o < i.length; o++) {
        let l = i[o].props[e];
        if (l != null && (s = t ? t(l) : l))
          return s;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (pe) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  /**
  Focus the editor.
  */
  focus() {
    this.domObserver.stop(), this.editable && _h(this.dom), Je(this), this.domObserver.start();
  }
  /**
  Get the document root in which the editor exists. This will
  usually be the top-level `document`, but might be a [shadow
  DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  root if the editor is inside one.
  */
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  /**
  When an existing editor view is moved to a new document or
  shadow tree, call this to make it recompute its root.
  */
  updateRoot() {
    this._root = null;
  }
  /**
  Given a pair of viewport coordinates, return the document
  position that corresponds to them. May return null if the given
  coordinates aren't inside of the editor. When an object is
  returned, its `pos` property is the position nearest to the
  coordinates, and its `inside` property holds the position of the
  inner node that the position falls inside of, or -1 if it is at
  the top level, not in any node.
  */
  posAtCoords(e) {
    return Wh(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, t = 1) {
    return lc(this, e, t);
  }
  /**
  Find the DOM position that corresponds to the given document
  position. When `side` is negative, find the position as close as
  possible to the content before the position. When positive,
  prefer positions close to the content after the position. When
  zero, prefer as shallow a position as possible.
  
  Note that you should **not** mutate the editor's internal DOM,
  only inspect it (and even that is usually not necessary).
  */
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  /**
  Find the DOM node that represents the document node after the
  given position. May return `null` when the position doesn't point
  in front of a node or if the node is inside an opaque node view.
  
  This is intended to be able to call things like
  `getBoundingClientRect` on that DOM node. Do **not** mutate the
  editor DOM directly, or add styling this way, since that will be
  immediately overriden by the editor as it redraws the node.
  */
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  /**
  Find the document position that corresponds to a given DOM
  position. (Whenever possible, it is preferable to inspect the
  document structure directly, rather than poking around in the
  DOM, but sometimes—for example when interpreting an event
  target—you don't have a choice.)
  
  The `bias` parameter can be used to influence which side of a DOM
  node to use when the position is inside a leaf node.
  */
  posAtDOM(e, t, r = -1) {
    let s = this.docView.posFromDOM(e, t, r);
    if (s == null)
      throw new RangeError("DOM position not inside the editor");
    return s;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, t) {
    return Gh(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Rn(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Rn(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Serialize the given slice as it would be if it was copied from
  this editor. Returns a DOM element that contains a
  representation of the slice as its children, a textual
  representation, and the transformed slice (which can be
  different from the given input due to hooks like
  [`transformCopied`](https://prosemirror.net/docs/ref/#view.EditorProps.transformCopied)).
  */
  serializeForClipboard(e) {
    return Vi(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Cf(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Rs(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Eh());
  }
  /**
  This is true when the view has been
  [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
  used anymore).
  */
  get isDestroyed() {
    return this.docView == null;
  }
  /**
  Used for testing.
  */
  dispatchEvent(e) {
    return Ef(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? le && this.root.nodeType === 11 && Ih(this.dom.ownerDocument) == this.dom && Zf(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
zc.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function bl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [ce.node(0, n.state.doc.content.size, e)];
}
function xl(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: ce.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function wl(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function ap(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Sl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let s in r)
      Object.prototype.hasOwnProperty.call(e, s) || (e[s] = r[s]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function cp(n, e) {
  let t = 0, r = 0;
  for (let s in n) {
    if (n[s] != e[s])
      return !0;
    t++;
  }
  for (let s in e)
    r++;
  return t != r;
}
function Tl(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var at = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, xr = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, up = typeof navigator < "u" && /Mac/.test(navigator.platform), dp = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var re = 0; re < 10; re++) at[48 + re] = at[96 + re] = String(re);
for (var re = 1; re <= 24; re++) at[re + 111] = "F" + re;
for (var re = 65; re <= 90; re++)
  at[re] = String.fromCharCode(re + 32), xr[re] = String.fromCharCode(re);
for (var Ds in at) xr.hasOwnProperty(Ds) || (xr[Ds] = at[Ds]);
function hp(n) {
  var e = up && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || dp && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? xr : at)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const fp = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), pp = typeof navigator < "u" && /Win/.test(navigator.platform);
function mp(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, s, i, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      s = !0;
    else if (/^s(hift)?$/i.test(a))
      i = !0;
    else if (/^mod$/i.test(a))
      fp ? o = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), s && (t = "Ctrl-" + t), o && (t = "Meta-" + t), i && (t = "Shift-" + t), t;
}
function gp(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[mp(t)] = n[t];
  return e;
}
function Ls(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function yp(n) {
  return new H({ props: { handleKeyDown: Bc(n) } });
}
function Bc(n) {
  let e = gp(n);
  return function(t, r) {
    let s = hp(r), i, o = e[Ls(s, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (s.length == 1 && s != " ") {
      if (r.shiftKey) {
        let l = e[Ls(s, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(pp && r.ctrlKey && r.altKey) && (i = at[r.keyCode]) && i != s) {
        let l = e[Ls(i, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var kp = Object.defineProperty, Ji = (n, e) => {
  for (var t in e)
    kp(n, t, { get: e[t], enumerable: !0 });
};
function cs(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: s } = t, { storedMarks: i } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return r;
    },
    get doc() {
      return s;
    },
    get tr() {
      return r = t.selection, s = t.doc, i = t.storedMarks, t;
    }
  };
}
var us = class {
  constructor(n) {
    this.editor = n.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = n.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: n, editor: e, state: t } = this, { view: r } = e, { tr: s } = t, i = this.buildProps(s);
    return Object.fromEntries(
      Object.entries(n).map(([o, l]) => [o, (...c) => {
        const u = l(...c)(i);
        return !s.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(s), u;
      }])
    );
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(n, e = !0) {
    const { rawCommands: t, editor: r, state: s } = this, { view: i } = r, o = [], l = !!n, a = n || s.tr, c = () => (!l && e && !a.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(a), o.every((d) => d === !0)), u = {
      ...Object.fromEntries(
        Object.entries(t).map(([d, f]) => [d, (...p) => {
          const m = this.buildProps(a, e), g = f(...p)(m);
          return o.push(g), u;
        }])
      ),
      run: c
    };
    return u;
  }
  createCan(n) {
    const { rawCommands: e, state: t } = this, r = !1, s = n || t.tr, i = this.buildProps(s, r);
    return {
      ...Object.fromEntries(
        Object.entries(e).map(([l, a]) => [l, (...c) => a(...c)({ ...i, dispatch: void 0 })])
      ),
      chain: () => this.createChain(s, r)
    };
  }
  buildProps(n, e = !0) {
    const { rawCommands: t, editor: r, state: s } = this, { view: i } = r, o = {
      tr: n,
      editor: r,
      view: i,
      state: cs({
        state: s,
        transaction: n
      }),
      dispatch: e ? () => {
      } : void 0,
      chain: () => this.createChain(n, e),
      can: () => this.createCan(n),
      get commands() {
        return Object.fromEntries(
          Object.entries(t).map(([l, a]) => [l, (...c) => a(...c)(o)])
        );
      }
    };
    return o;
  }
}, Me = {};
Ji(Me, {
  blur: () => bp,
  clearContent: () => xp,
  clearNodes: () => wp,
  command: () => Sp,
  createParagraphNear: () => Tp,
  cut: () => Mp,
  deleteCurrentNode: () => Cp,
  deleteNode: () => vp,
  deleteRange: () => Ep,
  deleteSelection: () => Np,
  enter: () => Rp,
  exitCode: () => Ip,
  extendMarkRange: () => Dp,
  first: () => Lp,
  focus: () => zp,
  forEach: () => Bp,
  insertContent: () => $p,
  insertContentAt: () => Fp,
  insertDefaultBlock: () => Hp,
  joinBackward: () => Wp,
  joinDown: () => jp,
  joinForward: () => qp,
  joinItemBackward: () => Up,
  joinItemForward: () => Kp,
  joinTextblockBackward: () => Jp,
  joinTextblockForward: () => Gp,
  joinUp: () => Vp,
  keyboardShortcut: () => Xp,
  lift: () => Zp,
  liftEmptyBlock: () => Yp,
  liftListItem: () => em,
  newlineInCode: () => tm,
  resetAttributes: () => nm,
  scrollIntoView: () => rm,
  selectAll: () => sm,
  selectNodeBackward: () => im,
  selectNodeForward: () => om,
  selectParentNode: () => lm,
  selectTextblockEnd: () => am,
  selectTextblockStart: () => cm,
  setContent: () => um,
  setMark: () => Nm,
  setMeta: () => Rm,
  setNode: () => Im,
  setNodeSelection: () => Dm,
  setTextDirection: () => Lm,
  setTextSelection: () => Pm,
  sinkListItem: () => zm,
  splitBlock: () => Bm,
  splitListItem: () => $m,
  toggleList: () => Fm,
  toggleMark: () => Hm,
  toggleNode: () => Vm,
  toggleWrap: () => jm,
  undoInputRule: () => Wm,
  unsetAllMarks: () => qm,
  unsetMark: () => Um,
  unsetTextDirection: () => Km,
  updateAttributes: () => Jm,
  wrapIn: () => Gm,
  wrapInList: () => Qm
});
var bp = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) == null || t.removeAllRanges());
}), !0), xp = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), wp = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: s } = r;
  return t && s.forEach(({ $from: i, $to: o }) => {
    n.doc.nodesBetween(i.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(a)), f = c.resolve(u.map(a + l.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = Xt(h);
      if (l.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, Sp = (n) => (e) => n(e), Tp = () => ({ state: n, dispatch: e }) => Qa(n, e), Mp = (n, e) => ({ editor: t, tr: r }) => {
  const { state: s } = t, i = s.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, i.content), r.setSelection(new N(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Cp = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const s = n.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === r.type) {
      if (e) {
        const l = s.before(i), a = s.after(i);
        n.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
};
function J(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(
        `There is no node type named '${n}'. Maybe you forgot to add the extension?`
      );
    return e.nodes[n];
  }
  return n;
}
var vp = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const s = J(n, t.schema), i = e.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === s) {
      if (r) {
        const a = i.before(o), c = i.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Ep = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: s } = n;
  return t && e.delete(r, s), !0;
}, Ap = (n) => n.content ? /^text(\*|\+)/.test(n.content) : !1, Ml = (n, e, t) => {
  if (!n.parent.isInline || t === "left" && n.pos > n.start() || t === "right" && n.pos < n.end())
    return n.pos;
  const r = e.nodes[n.parent.type.name].spec;
  return Ap(r) ? t === "left" ? n.start() - 1 : n.end() + 1 : n.pos;
}, Op = (n, e, t) => {
  const r = Ml(n, t, "left"), s = Ml(e, t, "right");
  return { from: r, to: s };
}, Np = () => ({ state: n, dispatch: e }) => {
  if (n.selection.empty)
    return !1;
  if (e) {
    const t = n.tr, { ranges: r } = n.selection, s = t.steps.length;
    r.forEach((i) => {
      const o = t.mapping.slice(s), l = t.doc.resolve(o.map(i.$from.pos)), a = t.doc.resolve(o.map(i.$to.pos)), { from: c, to: u } = Op(l, a, n.schema);
      t.deleteRange(c, u);
    }), t.selection.empty || t.setSelection(N.near(t.doc.resolve(t.selection.from))), t.scrollIntoView(), e(t);
  }
  return !0;
}, Rp = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Ip = () => ({ state: n, dispatch: e }) => hh(n, e);
function Gi(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function wr(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((s) => t.strict ? e[s] === n[s] : Gi(e[s]) ? e[s].test(n[s]) : e[s] === n[s]) : !0;
}
function $c(n, e, t = {}) {
  return n.find((r) => r.type === e && wr(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((s) => [s, r.attrs[s]])),
    t
  ));
}
function Cl(n, e, t = {}) {
  return !!$c(n, e, t);
}
function Qi(n, e, t) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if ((!r.node || !r.node.marks.some((c) => c.type === e)) && (r = n.parent.childBefore(n.parentOffset)), !r.node || !r.node.marks.some((c) => c.type === e))
    return;
  if (!t) {
    const c = r.node.marks.find((u) => u.type === e);
    c && (t = c.attrs);
  }
  if (!$c([...r.node.marks], e, t))
    return;
  let i = r.index, o = n.start() + r.offset, l = i + 1, a = o + r.node.nodeSize;
  for (; i > 0 && Cl([...n.parent.child(i - 1).marks], e, t); )
    i -= 1, o -= n.parent.child(i).nodeSize;
  for (; l < n.parent.childCount && Cl([...n.parent.child(l).marks], e, t); )
    a += n.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function Ge(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(
        `There is no mark type named '${n}'. Maybe you forgot to add the extension?`
      );
    return e.marks[n];
  }
  return n;
}
var Dp = (n, e) => ({ tr: t, state: r, dispatch: s }) => {
  const i = Ge(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: u } = l;
  if (s) {
    const d = Qi(a, i, e);
    if (d && d.from <= c && d.to >= u) {
      const f = N.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, Lp = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function _c(n) {
  return n instanceof N;
}
function bt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function di(n, e = null) {
  if (!e)
    return null;
  const t = I.atStart(n), r = I.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const s = t.from, i = r.to;
  return e === "all" ? N.create(
    n,
    bt(0, s, i),
    bt(n.content.size, s, i)
  ) : N.create(
    n,
    bt(e, s, i),
    bt(e, s, i)
  );
}
function vl() {
  return ["Android"].includes(navigator.platform) || /android/i.test(navigator.userAgent);
}
function Sr() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
    navigator.platform
  ) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function Pp() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var zp = (n = null, e = {}) => ({ editor: t, view: r, tr: s, dispatch: i }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (Sr() || vl()) && r.dom.focus(), Pp() && !Sr() && !vl() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (i && n === null && !_c(t.state.selection))
    return o(), !0;
  const l = di(s.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return i && (a || s.setSelection(l), a && s.storedMarks && s.setStoredMarks(s.storedMarks), o()), !0;
}, Bp = (n, e) => (t) => n.every((r, s) => e(r, { ...t, index: s })), $p = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt(
  { from: t.selection.from, to: t.selection.to },
  n,
  e
), Fc = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Fc(r);
  }
  return n;
};
function an(n) {
  if (typeof window > "u")
    throw new Error(
      "[tiptap error]: there is no window object available, so this function cannot be used"
    );
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Fc(t);
}
function Kt(n, e, t) {
  if (n instanceof Oe || n instanceof b)
    return n;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const r = typeof n == "object" && n !== null, s = typeof n == "string";
  if (r)
    try {
      if (Array.isArray(n) && n.length > 0)
        return b.fromArray(n.map((l) => e.nodeFromJSON(l)));
      const o = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && o.check(), o;
    } catch (i) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: i });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", i), Kt("", e, t);
    }
  if (s) {
    if (t.errorOnInvalidContent) {
      let o = !1, l = "";
      const a = new Sa({
        topNode: e.spec.topNode,
        marks: e.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: e.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (c) => (o = !0, l = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? Ue.fromSchema(a).parseSlice(
        an(n),
        t.parseOptions
      ) : Ue.fromSchema(a).parse(
        an(n),
        t.parseOptions
      ), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${l}`)
        });
    }
    const i = Ue.fromSchema(e);
    return t.slice ? i.parseSlice(an(n), t.parseOptions).content : i.parse(an(n), t.parseOptions);
  }
  return Kt("", e, t);
}
function Hc(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const s = n.steps[r];
  if (!(s instanceof U || s instanceof Y))
    return;
  const i = n.mapping.maps[r];
  let o = 0;
  i.forEach((l, a, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(I.near(n.doc.resolve(o), t));
}
var _p = (n) => !("type" in n), Fp = (n, e, t) => ({ tr: r, dispatch: s, editor: i }) => {
  var o;
  if (s) {
    t = {
      parseOptions: i.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let l;
    const a = (g) => {
      i.emit("contentError", {
        editor: i,
        error: g,
        disableCollaboration: () => {
          "collaboration" in i.storage && typeof i.storage.collaboration == "object" && i.storage.collaboration && (i.storage.collaboration.isDisabled = !0);
        }
      });
    }, c = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !i.options.enableContentCheck && i.options.emitContentError)
      try {
        Kt(e, i.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        a(g);
      }
    try {
      l = Kt(e, i.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : i.options.enableContentCheck
      });
    } catch (g) {
      return a(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((_p(l) ? l : [l]).forEach((g) => {
      g.check(), f = f ? g.isText && g.marks.length === 0 : !1, h = h ? g.isBlock : !1;
    }), u === d && h) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof b) {
        let g = "";
        e.forEach((y) => {
          y.text && (g += y.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else {
      m = l;
      const g = r.doc.resolve(u), y = g.node(), k = g.parentOffset === 0, S = y.isText || y.isTextblock, T = y.content.size > 0;
      k && S && T && h && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && Hc(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
};
function Vc(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
var Hp = (n = {}) => ({ tr: e, dispatch: t, editor: r }) => {
  const { pos: s, attrs: i, content: o, updateSelection: l = !0 } = n;
  let a;
  typeof s == "number" ? a = e.doc.resolve(s) : s ? a = s : a = e.selection.$from;
  const c = Vc(a.parent.contentMatchAt(a.index()));
  if (!c)
    return !1;
  const u = Object.keys(c.spec.attrs || {}), d = i ? Object.fromEntries(Object.entries(i).filter(([h]) => u.includes(h))) : {};
  let f;
  if (o) {
    const h = Kt(o, r.schema);
    f = c.createAndFill(d, h);
  } else
    f = c.createAndFill(d);
  return f ? (t && (e.insert(a.pos, f), l && Hc(e, e.steps.length - 1, -1)), !0) : !1;
}, Vp = () => ({ state: n, dispatch: e }) => ch(n, e), jp = () => ({ state: n, dispatch: e }) => uh(n, e), Wp = () => ({ state: n, dispatch: e }) => ja(n, e), qp = () => ({ state: n, dispatch: e }) => Ka(n, e), Up = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = rs(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Kp = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = rs(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Jp = () => ({ state: n, dispatch: e }) => lh(n, e), Gp = () => ({ state: n, dispatch: e }) => ah(n, e);
function jc() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Qp(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, s, i, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      s = !0;
    else if (/^s(hift)?$/i.test(a))
      i = !0;
    else if (/^mod$/i.test(a))
      Sr() || jc() ? o = !0 : s = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), s && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), i && (t = `Shift-${t}`), t;
}
var Xp = (n) => ({ editor: e, view: t, tr: r, dispatch: s }) => {
  const i = Qp(n).split(/-(?!$)/), o = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: i.includes("Alt"),
    ctrlKey: i.includes("Ctrl"),
    metaKey: i.includes("Meta"),
    shiftKey: i.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a == null || a.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && s && r.maybeStep(u);
  }), !0;
};
function ct(n, e, t = {}) {
  const { from: r, to: s, empty: i } = n.selection, o = e ? J(e, n.schema) : null, l = [];
  n.doc.nodesBetween(r, s, (d, f) => {
    if (d.isText)
      return;
    const h = Math.max(r, f), p = Math.min(s, f + d.nodeSize);
    l.push({
      node: d,
      from: h,
      to: p
    });
  });
  const a = s - r, c = l.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => wr(d.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= a;
}
var Zp = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = J(n, t.schema);
  return ct(t, s, e) ? dh(t, r) : !1;
}, Yp = () => ({ state: n, dispatch: e }) => Xa(n, e), em = (n) => ({ state: e, dispatch: t }) => {
  const r = J(n, e.schema);
  return Th(r)(e, t);
}, tm = () => ({ state: n, dispatch: e }) => Ga(n, e);
function ds(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function El(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, s) => (t.includes(s) || (r[s] = n[s]), r), {});
}
var nm = (n, e) => ({ tr: t, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = ds(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!l)
    return !1;
  l === "node" && (i = J(n, r.schema)), l === "mark" && (o = Ge(n, r.schema));
  let a = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      i && i === u.type && (a = !0, s && t.setNodeMarkup(d, void 0, El(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (a = !0, s && t.addMark(
          d,
          d + u.nodeSize,
          o.create(El(f.attrs, e))
        ));
      });
    });
  }), a;
}, rm = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), sm = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new ge(n.doc);
    n.setSelection(t);
  }
  return !0;
}, im = () => ({ state: n, dispatch: e }) => qa(n, e), om = () => ({ state: n, dispatch: e }) => Ja(n, e), lm = () => ({ state: n, dispatch: e }) => mh(n, e), am = () => ({ state: n, dispatch: e }) => kh(n, e), cm = () => ({ state: n, dispatch: e }) => yh(n, e);
function hi(n, e, t = {}, r = {}) {
  return Kt(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var um = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: s, tr: i, dispatch: o, commands: l }) => {
  const { doc: a } = i;
  if (r.preserveWhitespace !== "full") {
    const c = hi(n, s.schema, r, {
      errorOnInvalidContent: e ?? s.options.enableContentCheck
    });
    return o && i.replaceWith(0, a.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && i.setMeta("preventUpdate", !t), l.insertContentAt({ from: 0, to: a.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? s.options.enableContentCheck
  });
};
function Wc(n, e) {
  const t = Ge(e, n.schema), { from: r, to: s, empty: i } = n.selection, o = [];
  i ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, s, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function qc(n, e) {
  const t = new $a(n);
  return e.forEach((r) => {
    r.steps.forEach((s) => {
      t.step(s);
    });
  }), t;
}
function dm(n, e, t) {
  const r = [];
  return n.nodesBetween(e.from, e.to, (s, i) => {
    t(s) && r.push({
      node: s,
      pos: i
    });
  }), r;
}
function hm(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function hs(n) {
  return (e) => hm(e.$from, n);
}
function v(n, e, t) {
  return n.config[e] === void 0 && n.parent ? v(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? v(n.parent, e, t) : null
  }) : n.config[e];
}
function fs(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = v(
      e,
      "addExtensions",
      t
    );
    return r ? [e, ...fs(r())] : e;
  }).flat(10);
}
function Xi(n, e) {
  const t = It.fromSchema(e).serializeFragment(n), s = document.implementation.createHTMLDocument().createElement("div");
  return s.appendChild(t), s.innerHTML;
}
function Uc(n) {
  return typeof n == "function";
}
function P(n, e = void 0, ...t) {
  return Uc(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function fm(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function Jt(n) {
  const e = n.filter(
    (s) => s.type === "extension"
  ), t = n.filter((s) => s.type === "node"), r = n.filter((s) => s.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Kc(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = Jt(n), s = [...t, ...r], i = {
    default: null,
    validate: void 0,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  }, o = t.filter((c) => c.name !== "text").map((c) => c.name), l = r.map((c) => c.name), a = [...o, ...l];
  return n.forEach((c) => {
    const u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      extensions: s
    }, d = v(
      c,
      "addGlobalAttributes",
      u
    );
    if (!d)
      return;
    d().forEach((h) => {
      let p;
      Array.isArray(h.types) ? p = h.types : h.types === "*" ? p = a : h.types === "nodes" ? p = o : h.types === "marks" ? p = l : p = [], p.forEach((m) => {
        Object.entries(h.attributes).forEach(([g, y]) => {
          e.push({
            type: m,
            name: g,
            attribute: {
              ...i,
              ...y
            }
          });
        });
      });
    });
  }), s.forEach((c) => {
    const u = {
      name: c.name,
      options: c.options,
      storage: c.storage
    }, d = v(c, "addAttributes", u);
    if (!d)
      return;
    const f = d();
    Object.entries(f).forEach(([h, p]) => {
      const m = {
        ...i,
        ...p
      };
      typeof (m == null ? void 0 : m.default) == "function" && (m.default = m.default()), m != null && m.isRequired && (m == null ? void 0 : m.default) === void 0 && delete m.default, e.push({
        type: c.name,
        name: h,
        attribute: m
      });
    });
  }), e;
}
function pm(n) {
  const e = [];
  let t = "", r = !1, s = !1, i = 0;
  const o = n.length;
  for (let l = 0; l < o; l += 1) {
    const a = n[l];
    if (a === "'" && !s) {
      r = !r, t += a;
      continue;
    }
    if (a === '"' && !r) {
      s = !s, t += a;
      continue;
    }
    if (!r && !s) {
      if (a === "(") {
        i += 1, t += a;
        continue;
      }
      if (a === ")" && i > 0) {
        i -= 1, t += a;
        continue;
      }
      if (a === ";" && i === 0) {
        e.push(t), t = "";
        continue;
      }
    }
    t += a;
  }
  return t && e.push(t), e;
}
function Al(n) {
  const e = [], t = pm(n || ""), r = t.length;
  for (let s = 0; s < r; s += 1) {
    const i = t[s], o = i.indexOf(":");
    if (o === -1)
      continue;
    const l = i.slice(0, o).trim(), a = i.slice(o + 1).trim();
    l && a && e.push([l, a]);
  }
  return e;
}
function G(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([s, i]) => {
      if (!r[s]) {
        r[s] = i;
        return;
      }
      if (s === "class") {
        const l = i ? String(i).split(" ") : [], a = r[s] ? r[s].split(" ") : [], c = l.filter(
          (u) => !a.includes(u)
        );
        r[s] = [...a, ...c].join(" ");
      } else if (s === "style") {
        const l = new Map([
          ...Al(r[s]),
          ...Al(i)
        ]);
        r[s] = Array.from(l.entries()).map(([a, c]) => `${a}: ${c}`).join("; ");
      } else
        r[s] = i;
    }), r;
  }, {});
}
function Dn(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => G(t, r), {});
}
function mm(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Ol(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const s = e.reduce((i, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : mm(t.getAttribute(o.name));
        return l == null ? i : {
          ...i,
          [o.name]: l
        };
      }, {});
      return { ...r, ...s };
    }
  };
}
function Nl(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && fm(t) ? !1 : t != null)
  );
}
function Rl(n) {
  var e, t;
  const r = {};
  return !((e = n == null ? void 0 : n.attribute) != null && e.isRequired) && "default" in ((n == null ? void 0 : n.attribute) || {}) && (r.default = n.attribute.default), ((t = n == null ? void 0 : n.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function Jc(n, e) {
  var t;
  const r = Kc(n), { nodeExtensions: s, markExtensions: i } = Jt(n), o = (t = s.find((c) => v(c, "topNode"))) == null ? void 0 : t.name, l = Object.fromEntries(
    s.map((c) => {
      const u = r.filter(
        (y) => y.type === c.name
      ), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((y, k) => {
        const S = v(
          k,
          "extendNodeSchema",
          d
        );
        return {
          ...y,
          ...S ? S(c) : {}
        };
      }, {}), h = Nl({
        ...f,
        content: P(
          v(c, "content", d)
        ),
        marks: P(v(c, "marks", d)),
        group: P(v(c, "group", d)),
        inline: P(v(c, "inline", d)),
        atom: P(v(c, "atom", d)),
        selectable: P(
          v(c, "selectable", d)
        ),
        draggable: P(
          v(c, "draggable", d)
        ),
        code: P(v(c, "code", d)),
        whitespace: P(
          v(c, "whitespace", d)
        ),
        linebreakReplacement: P(
          v(
            c,
            "linebreakReplacement",
            d
          )
        ),
        defining: P(
          v(c, "defining", d)
        ),
        isolating: P(
          v(c, "isolating", d)
        ),
        attrs: Object.fromEntries(u.map(Rl))
      }), p = P(
        v(c, "parseHTML", d)
      );
      p && (h.parseDOM = p.map(
        (y) => Ol(y, u)
      ));
      const m = v(
        c,
        "renderHTML",
        d
      );
      m && (h.toDOM = (y) => m({
        node: y,
        HTMLAttributes: Dn(y, u)
      }));
      const g = v(
        c,
        "renderText",
        d
      );
      return g && (h.toText = g), [c.name, h];
    })
  ), a = Object.fromEntries(
    i.map((c) => {
      const u = r.filter(
        (g) => g.type === c.name
      ), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((g, y) => {
        const k = v(
          y,
          "extendMarkSchema",
          d
        );
        return {
          ...g,
          ...k ? k(c) : {}
        };
      }, {}), h = Nl({
        ...f,
        inclusive: P(
          v(c, "inclusive", d)
        ),
        excludes: P(
          v(c, "excludes", d)
        ),
        group: P(v(c, "group", d)),
        spanning: P(
          v(c, "spanning", d)
        ),
        code: P(v(c, "code", d)),
        attrs: Object.fromEntries(u.map(Rl))
      }), p = P(
        v(c, "parseHTML", d)
      );
      p && (h.parseDOM = p.map(
        (g) => Ol(g, u)
      ));
      const m = v(
        c,
        "renderHTML",
        d
      );
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: Dn(g, u)
      })), [c.name, h];
    })
  );
  return new Sa({
    topNode: o,
    nodes: l,
    marks: a
  });
}
function gm(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function Vt(n) {
  return n.sort((t, r) => {
    const s = v(t, "priority") || 100, i = v(r, "priority") || 100;
    return s > i ? -1 : s < i ? 1 : 0;
  });
}
function Zi(n) {
  const e = Vt(fs(n)), t = gm(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function Gc(n, e) {
  const t = Zi(n);
  return Jc(t, e);
}
function ym(n, e) {
  const t = Gc(e), r = an(n);
  return Ue.fromSchema(t).parse(r).toJSON();
}
function Qc(n, e, t) {
  const { from: r, to: s } = e, { blockSeparator: i = `

`, textSerializers: o = {} } = t || {};
  let l = "";
  return n.nodesBetween(r, s, (a, c, u, d) => {
    var f;
    a.isBlock && c > r && (l += i);
    const h = o == null ? void 0 : o[a.type.name];
    if (h)
      return u && (l += h({
        node: a,
        pos: c,
        parent: u,
        index: d,
        range: e
      })), !1;
    a.isText && (l += (f = a == null ? void 0 : a.text) == null ? void 0 : f.slice(Math.max(r, c) - c, s - c));
  }), l;
}
function km(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Qc(n, t, e);
}
function Xc(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function bm(n, e) {
  const t = J(e, n.schema), { from: r, to: s } = n.selection, i = [];
  n.doc.nodesBetween(r, s, (l) => {
    i.push(l);
  });
  const o = i.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function Zc(n, e) {
  const t = ds(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? bm(n, e) : t === "mark" ? Wc(n, e) : {};
}
function xm(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const s = e(r);
    return Object.prototype.hasOwnProperty.call(t, s) ? !1 : t[s] = !0;
  });
}
function wm(n) {
  const e = xm(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((i, o) => o !== r).some((i) => t.oldRange.from >= i.oldRange.from && t.oldRange.to <= i.oldRange.to && t.newRange.from >= i.newRange.from && t.newRange.to <= i.newRange.to));
}
function Yi(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((s, i) => {
    const o = [];
    if (s.ranges.length)
      s.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = t[i];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(i).map(l, -1), u = e.slice(i).map(a), d = e.invert().map(c, -1), f = e.invert().map(u);
      r.push({
        oldRange: {
          from: d,
          to: f
        },
        newRange: {
          from: c,
          to: u
        }
      });
    });
  }), wm(r);
}
function eo(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((s) => {
    const i = t.resolve(n), o = Qi(i, s.type);
    o && r.push({
      mark: s,
      ...o
    });
  }) : t.nodesBetween(n, e, (s, i) => {
    !s || (s == null ? void 0 : s.nodeSize) === void 0 || r.push(
      ...s.marks.map((o) => ({
        from: i,
        to: i + s.nodeSize,
        mark: o
      }))
    );
  }), r;
}
var Sm = (n, e, t, r = 20) => {
  const s = n.doc.resolve(t);
  let i = r, o = null;
  for (; i > 0 && o === null; ) {
    const l = s.node(i);
    (l == null ? void 0 : l.type.name) === e ? o = l : i -= 1;
  }
  return [o, i];
};
function en(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function ar(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const s = n.find((i) => i.type === e && i.name === r);
      return s ? s.attribute.keepOnSplit : !1;
    })
  );
}
var Tm = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(
    Math.max(0, r - e),
    r,
    (s, i, o, l) => {
      var a, c;
      const u = ((c = (a = s.type.spec).toText) == null ? void 0 : c.call(a, {
        node: s,
        pos: i,
        parent: o,
        index: l
      })) || s.textContent || "%leaf%";
      t += s.isAtom && !s.isText ? u : u.slice(0, Math.max(0, r - i));
    }
  ), t;
};
function fi(n, e, t = {}) {
  const { empty: r, ranges: s } = n.selection, i = e ? Ge(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => i ? i.name === d.type.name : !0).find((d) => wr(d.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (s.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (i && m.inlineContent && !m.type.allowsMarkType(i))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(h, g), k = Math.min(p, g + m.nodeSize), S = k - y;
      o += S, l.push(
        ...m.marks.map((T) => ({
          mark: T,
          from: y,
          to: k
        }))
      );
    });
  }), o === 0)
    return !1;
  const a = l.filter((d) => i ? i.name === d.mark.type.name : !0).filter((d) => wr(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = l.filter((d) => i ? d.mark.type !== i && d.mark.type.excludes(i) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function Mm(n, e, t = {}) {
  if (!e)
    return ct(n, null, t) || fi(n, null, t);
  const r = ds(e, n.schema);
  return r === "node" ? ct(n, e, t) : r === "mark" ? fi(n, e, t) : !1;
}
var Cm = (n, e) => {
  const { $from: t, $to: r, $anchor: s } = n.selection;
  if (e) {
    const i = hs((l) => l.type.name === e)(n.selection);
    if (!i)
      return !1;
    const o = n.doc.resolve(i.pos + 1);
    return s.pos + 1 === o.end();
  }
  return !(r.parentOffset < r.parent.nodeSize - 2 || t.pos !== r.pos);
}, vm = (n) => {
  const { $from: e, $to: t } = n.selection;
  return !(e.parentOffset > 0 || e.pos !== t.pos);
};
function Il(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Ps(n, e) {
  const { nodeExtensions: t } = Jt(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const s = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, i = P(v(r, "group", s));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function Hn(n, {
  checkChildren: e = !0,
  ignoreWhitespace: t = !1
} = {}) {
  var r;
  if (t) {
    if (n.type.name === "hardBreak")
      return !0;
    if (n.isText)
      return !/\S/.test((r = n.text) != null ? r : "");
  }
  if (n.isText)
    return !n.text;
  if (n.isAtom || n.isLeaf)
    return !1;
  if (n.content.childCount === 0)
    return !0;
  if (e) {
    let s = !0;
    return n.content.forEach((i) => {
      s !== !1 && (Hn(i, { ignoreWhitespace: t, checkChildren: e }) || (s = !1));
    }), s;
  }
  return !1;
}
function Yc(n) {
  return n instanceof O;
}
var eu = class tu {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new tu(e.position);
  }
  /**
   * Converts the MappablePosition to a JSON object.
   */
  toJSON() {
    return {
      position: this.position
    };
  }
};
function Em(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new eu(t.pos),
    mapResult: t
  };
}
function Am(n) {
  return new eu(n);
}
function Om(n, e, t) {
  var r;
  const { selection: s } = e;
  let i = null;
  if (_c(s) && (i = s.$cursor), i) {
    const l = (r = n.storedMarks) != null ? r : i.marks();
    return i.parent.type.allowsMarkType(t) && (!!t.isInSet(l) || !l.some((c) => c.type.excludes(t)));
  }
  const { ranges: o } = s;
  return o.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(l.pos, a.pos, (u, d, f) => {
      if (c)
        return !1;
      if (u.isInline) {
        const h = !f || f.type.allowsMarkType(t), p = !!t.isInSet(u.marks) || !u.marks.some((m) => m.type.excludes(t));
        c = h && p;
      }
      return !c;
    }), c;
  });
}
var Nm = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  const { selection: i } = t, { empty: o, ranges: l } = i, a = Ge(n, r.schema);
  if (s)
    if (o) {
      const c = Wc(r, a);
      t.addStoredMark(
        a.create({
          ...c,
          ...e
        })
      );
    } else
      l.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (f, h) => {
          const p = Math.max(h, u), m = Math.min(h + f.nodeSize, d);
          f.marks.find((y) => y.type === a) ? f.marks.forEach((y) => {
            a === y.type && t.addMark(
              p,
              m,
              a.create({
                ...y.attrs,
                ...e
              })
            );
          }) : t.addMark(p, m, a.create(e));
        });
      });
  return Om(r, t, a);
}, Rm = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), Im = (n, e = {}) => ({ state: t, dispatch: r, chain: s }) => {
  const i = J(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), i.isTextblock ? s().command(({ commands: l }) => Ko(i, { ...o, ...e })(t) ? !0 : l.clearNodes()).command(({ state: l }) => Ko(i, { ...o, ...e })(l, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Dm = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, s = bt(n, 0, r.content.size), i = O.create(r, s);
    e.setSelection(i);
  }
  return !0;
}, Lm = (n, e) => ({ tr: t, state: r, dispatch: s }) => {
  const { selection: i } = r;
  let o, l;
  return typeof e == "number" ? (o = e, l = e) : e && "from" in e && "to" in e ? (o = e.from, l = e.to) : (o = i.from, l = i.to), s && t.doc.nodesBetween(o, l, (a, c) => {
    a.isText || t.setNodeMarkup(c, void 0, {
      ...a.attrs,
      dir: n
    });
  }), !0;
}, Pm = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: s, to: i } = typeof n == "number" ? { from: n, to: n } : n, o = N.atStart(r).from, l = N.atEnd(r).to, a = bt(s, o, l), c = bt(i, o, l), u = N.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, zm = (n) => ({ state: e, dispatch: t }) => {
  const r = J(n, e.schema);
  return vh(r)(e, t);
};
function Dl(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((s) => e == null ? void 0 : e.includes(s.type.name));
    n.tr.ensureMarks(r);
  }
}
var Bm = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: s }) => {
  const { selection: i, doc: o } = e, { $from: l, $to: a } = i, c = s.extensionManager.attributes, u = ar(
    c,
    l.node().type.name,
    l.node().attrs
  );
  if (i instanceof O && i.node.isBlock)
    return !l.parentOffset || !Ke(o, l.pos) ? !1 : (r && (n && Dl(t, s.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  const d = a.parentOffset === a.parent.content.size, f = l.depth === 0 ? void 0 : Vc(l.node(-1).contentMatchAt(l.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Ke(e.doc, e.mapping.map(l.pos), 1, h);
  if (!h && !p && Ke(e.doc, e.mapping.map(l.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (i instanceof N && e.deleteSelection(), e.split(e.mapping.map(l.pos), 1, h), f && !d && !l.parentOffset && l.parent.type !== f)) {
      const m = e.mapping.map(l.before()), g = e.doc.resolve(m);
      l.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(l.before()), f);
    }
    n && Dl(t, s.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, $m = (n, e = {}) => ({ tr: t, state: r, dispatch: s, editor: i }) => {
  var o;
  const l = J(n, r.schema), { $from: a, $to: c } = r.selection, u = r.selection.node;
  if (u && u.isBlock || a.depth < 2 || !a.sameParent(c))
    return !1;
  const d = a.node(-1);
  if (d.type !== l)
    return !1;
  const f = i.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== l || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (s) {
      let y = b.empty;
      const k = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let A = a.depth - k; A >= a.depth - 3; A -= 1)
        y = b.from(a.node(A).copy(y));
      const S = (
        // oxlint-disable-next-line no-nested-ternary
        a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3
      ), T = {
        ...ar(f, a.node().type.name, a.node().attrs),
        ...e
      }, x = ((o = l.contentMatch.defaultType) == null ? void 0 : o.createAndFill(T)) || void 0;
      y = y.append(b.from(l.createAndFill(null, x) || void 0));
      const E = a.before(a.depth - (k - 1));
      t.replace(E, a.after(-S), new C(y, 4 - k, 0));
      let M = -1;
      t.doc.nodesBetween(E, t.doc.content.size, (A, R) => {
        if (M > -1)
          return !1;
        A.isTextblock && A.content.size === 0 && (M = R + 1);
      }), M > -1 && t.setSelection(N.near(t.doc.resolve(M))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === a.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...ar(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...ar(f, a.node().type.name, a.node().attrs),
    ...e
  };
  t.delete(a.pos, c.pos);
  const g = h ? [
    { type: l, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: l, attrs: p }];
  if (!Ke(t.doc, a.pos, 2))
    return !1;
  if (s) {
    const { selection: y, storedMarks: k } = r, { splittableMarks: S } = i.extensionManager, T = k || y.$to.parentOffset && y.$from.marks();
    if (t.split(a.pos, 2, g).scrollIntoView(), !T || !s)
      return !0;
    const x = T.filter((E) => S.includes(E.type.name));
    t.ensureMarks(x);
  }
  return !0;
};
function Ll(n) {
  return !n || n === "1" ? null : n;
}
function nu(n, e) {
  return Ll(n) === Ll(e);
}
var zs = (n, e) => {
  const t = hs((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const s = n.doc.nodeAt(r);
  return !(t.node.type === (s == null ? void 0 : s.type) && ht(n.doc, t.pos)) || !nu(t.node.attrs.type, s == null ? void 0 : s.attrs.type) || n.join(t.pos), !0;
}, Bs = (n, e) => {
  const t = hs((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const s = n.doc.nodeAt(r);
  return !(t.node.type === (s == null ? void 0 : s.type) && ht(n.doc, r)) || !nu(t.node.attrs.type, s == null ? void 0 : s.attrs.type) || n.join(r), !0;
};
function _m(n) {
  const e = n.doc, t = e.firstChild;
  if (!t)
    return null;
  const r = e.resolve(1), s = e.resolve(t.nodeSize - 1);
  return N.between(r, s);
}
var Fm = (n, e, t, r = {}) => ({ editor: s, tr: i, state: o, dispatch: l, chain: a, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = s.extensionManager, h = J(n, o.schema), p = J(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: k } = m, S = y.blockRange(k), T = g || m.$to.parentOffset && m.$from.marks();
  if (!S)
    return !1;
  const x = hs((ie) => Ps(ie.type.name, d))(m), E = m.from === 0 && m.to === o.doc.content.size, M = o.doc.content.content, A = M.length === 1 ? M[0] : null, R = E && A && Ps(A.type.name, d) ? {
    node: A,
    pos: 0
  } : null, X = x ?? R, Be = !!x && S.depth >= 1 && S.depth - x.depth <= 1, Re = !!R;
  if ((Be || Re) && X) {
    if (X.node.type === h)
      return E && Re ? a().command(({ tr: ie, dispatch: Z }) => {
        const q = _m(ie);
        return q ? (ie.setSelection(q), Z && Z(ie), !0) : !1;
      }).liftListItem(p).run() : c.liftListItem(p);
    if (Ps(X.node.type.name, d) && h.validContent(X.node.content))
      return a().command(() => (i.setNodeMarkup(X.pos, h), !0)).command(() => zs(i, h)).command(() => Bs(i, h)).run();
  }
  return !t || !T || !l ? a().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => zs(i, h)).command(() => Bs(i, h)).run() : a().command(() => {
    const ie = u().wrapInList(h, r), Z = T.filter((q) => f.includes(q.type.name));
    return i.ensureMarks(Z), ie ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => zs(i, h)).command(() => Bs(i, h)).run();
}, Hm = (n, e = {}, t = {}) => ({ state: r, commands: s }) => {
  const { extendEmptyMarkRange: i = !1 } = t, o = Ge(n, r.schema);
  return fi(r, o, e) ? s.unsetMark(o, { extendEmptyMarkRange: i }) : s.setMark(o, e);
}, Vm = (n, e, t = {}) => ({ state: r, commands: s }) => {
  const i = J(n, r.schema), o = J(e, r.schema), l = ct(r, i, t);
  let a;
  return r.selection.$anchor.sameParent(r.selection.$head) && (a = r.selection.$anchor.parent.attrs), l ? s.setNode(o, a) : s.setNode(i, { ...a, ...t });
}, jm = (n, e = {}) => ({ state: t, commands: r }) => {
  const s = J(n, t.schema);
  return ct(t, s, e) ? r.lift(s) : r.wrapIn(s, e);
}, Wm = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const s = t[r];
    let i;
    if (s.spec.isInputRules && (i = s.getState(n))) {
      if (e) {
        const o = n.tr, l = i.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (i.text) {
          const a = o.doc.resolve(i.from).marks();
          o.replaceWith(i.from, i.to, n.schema.text(i.text, a));
        } else
          o.delete(i.from, i.to);
      }
      return !0;
    }
  }
  return !1;
}, qm = (n = {}) => ({ tr: e, dispatch: t, editor: r }) => {
  const { ignoreClearable: s = !1 } = n, { selection: i } = e, { empty: o, ranges: l } = i;
  if (o)
    return !0;
  const { nonClearableMarks: a } = r.extensionManager;
  if (t) {
    const c = Object.values(r.schema.marks).filter(
      (u) => s || !a.includes(u.name)
    );
    l.forEach((u) => {
      for (const d of c)
        e.removeMark(u.$from.pos, u.$to.pos, d);
    });
  }
  return !0;
}, Um = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  var i;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = Ge(n, r.schema), { $from: c, empty: u, ranges: d } = l;
  if (!s)
    return !0;
  if (u && o) {
    let { from: f, to: h } = l;
    const p = (i = c.marks().find((g) => g.type === a)) == null ? void 0 : i.attrs, m = Qi(c, a, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, a);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, Km = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: s } = t;
  let i, o;
  return typeof n == "number" ? (i = n, o = n) : n && "from" in n && "to" in n ? (i = n.from, o = n.to) : (i = s.from, o = s.to), r && e.doc.nodesBetween(i, o, (l, a) => {
    if (l.isText)
      return;
    const c = { ...l.attrs };
    delete c.dir, e.setNodeMarkup(a, void 0, c);
  }), !0;
}, Jm = (n, e = {}) => ({ tr: t, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = ds(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!l)
    return !1;
  l === "node" && (i = J(n, r.schema)), l === "mark" && (o = Ge(n, r.schema));
  let a = !1;
  return t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let f, h, p, m;
    t.selection.empty ? r.doc.nodesBetween(u, d, (g, y) => {
      i && i === g.type && (a = !0, p = Math.max(y, u), m = Math.min(y + g.nodeSize, d), f = y, h = g);
    }) : r.doc.nodesBetween(u, d, (g, y) => {
      y < u && i && i === g.type && (a = !0, p = Math.max(y, u), m = Math.min(y + g.nodeSize, d), f = y, h = g), y >= u && y <= d && (i && i === g.type && (a = !0, s && t.setNodeMarkup(y, void 0, {
        ...g.attrs,
        ...e
      })), o && g.marks.length && g.marks.forEach((k) => {
        if (o === k.type && (a = !0, s)) {
          const S = Math.max(y, u), T = Math.min(y + g.nodeSize, d);
          t.addMark(
            S,
            T,
            o.create({
              ...k.attrs,
              ...e
            })
          );
        }
      }));
    }), h && (f !== void 0 && s && t.setNodeMarkup(f, void 0, {
      ...h.attrs,
      ...e
    }), o && h.marks.length && h.marks.forEach((g) => {
      o === g.type && s && t.addMark(
        p,
        m,
        o.create({
          ...g.attrs,
          ...e
        })
      );
    }));
  }), a;
}, Gm = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = J(n, t.schema);
  return bh(s, e)(t, r);
}, Qm = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const s = J(n, t.schema);
  return xh(s, e)(t, r);
}, Xm = class {
  constructor() {
    this.callbacks = {};
  }
  on(n, e) {
    return this.callbacks[n] || (this.callbacks[n] = []), this.callbacks[n].push(e), this;
  }
  emit(n, ...e) {
    const t = this.callbacks[n];
    return t && t.forEach((r) => r.apply(this, e)), this;
  }
  off(n, e) {
    const t = this.callbacks[n];
    return t && (e ? this.callbacks[n] = t.filter((r) => r !== e) : delete this.callbacks[n]), this;
  }
  once(n, e) {
    const t = (...r) => {
      this.off(n, t), e.apply(this, r);
    };
    return this.on(n, t);
  }
  removeAllListeners() {
    this.callbacks = {};
  }
};
function Gt(n, e) {
  if (n === e)
    return !0;
  if (!n || !e)
    return !1;
  const t = Object.keys(n), r = Object.keys(e);
  return t.length !== r.length ? !1 : t.every(
    (s) => Object.prototype.hasOwnProperty.call(e, s) && Object.is(n[s], e[s])
  );
}
function Zm(n, e) {
  const { selection: t } = n, { $from: r } = t;
  if (t instanceof O) {
    const i = r.index();
    return r.parent.canReplaceWith(i, i + 1, e);
  }
  let s = r.depth;
  for (; s >= 0; ) {
    const i = r.index(s);
    if (r.node(s).contentMatchAt(i).matchType(e))
      return !0;
    s -= 1;
  }
  return !1;
}
function Ym(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const s = document.createElement("style");
  return e && s.setAttribute("nonce", e), s.setAttribute("data-tiptap-style", ""), s.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(s), s;
}
function Pl(n) {
  return n.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}
function eg(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function tg(n) {
  return typeof n == "number";
}
function ng(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Jn(n) {
  return ng(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
var rg = {};
Ji(rg, {
  createAtomBlockMarkdownSpec: () => sg,
  createBlockMarkdownSpec: () => ig,
  createInlineMarkdownSpec: () => ag,
  parseAttributes: () => to,
  parseIndentedBlocks: () => pi,
  renderNestedMarkdownContent: () => ro,
  serializeAttributes: () => no
});
function to(n) {
  if (!(n != null && n.trim()))
    return {};
  const e = {}, t = [], r = n.replace(/["']([^"']*)["']/g, (c) => (t.push(c), `__QUOTED_${t.length - 1}__`)), s = r.match(/(?:^|\s)\.([\w-]+)/g);
  if (s) {
    const c = s.map((u) => u.trim().slice(1));
    e.class = c.join(" ");
  }
  const i = r.match(/(?:^|\s)#([\w-]+)/);
  i && (e.id = i[1]);
  const o = /([a-zA-Z][\w-]*)\s*=\s*(__QUOTED_\d+__)/g;
  Array.from(r.matchAll(o)).forEach(([, c, u]) => {
    var d;
    const f = parseInt(((d = u.match(/__QUOTED_(\d+)__/)) == null ? void 0 : d[1]) || "0", 10), h = t[f];
    h && (e[c] = h.slice(1, -1));
  });
  const a = r.replace(/(?:^|\s)\.([\w-]+)/g, "").replace(/(?:^|\s)#([\w-]+)/g, "").replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g, "").trim();
  return a && a.split(/\s+/).filter(Boolean).forEach((u) => {
    u.match(/^[a-zA-Z][\w-]*$/) && (e[u] = !0);
  }), e;
}
function no(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function sg(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = to,
    serializeAttributes: s = no,
    defaultAttributes: i = {},
    requiredAttributes: o = [],
    allowedAttributes: l
  } = n, a = t || e, c = (u) => {
    if (!l)
      return u;
    const d = {};
    return l.forEach((f) => {
      f in u && (d[f] = u[f]);
    }), d;
  };
  return {
    parseMarkdown: (u, d) => {
      const f = { ...i, ...u.attributes };
      return d.createNode(e, f, []);
    },
    markdownTokenizer: {
      name: e,
      level: "block",
      start(u) {
        var d;
        const f = new RegExp(`^:::${a}(?:\\s|$)`, "m"), h = (d = u.match(f)) == null ? void 0 : d.index;
        return h !== void 0 ? h : -1;
      },
      tokenize(u, d, f) {
        const h = new RegExp(`^:::${a}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`), p = u.match(h);
        if (!p)
          return;
        const m = p[1] || "", g = r(m);
        if (!o.find((k) => !(k in g)))
          return {
            type: e,
            raw: p[0],
            attributes: g
          };
      }
    },
    renderMarkdown: (u) => {
      const d = c(u.attrs || {}), f = s(d), h = f ? ` {${f}}` : "";
      return `:::${a}${h} :::`;
    }
  };
}
function ig(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: s = to,
    serializeAttributes: i = no,
    defaultAttributes: o = {},
    content: l = "block",
    allowedAttributes: a
  } = n, c = t || e, u = (d) => {
    if (!a)
      return d;
    const f = {};
    return a.forEach((h) => {
      h in d && (f[h] = d[h]);
    }), f;
  };
  return {
    parseMarkdown: (d, f) => {
      let h;
      if (r) {
        const m = r(d);
        h = typeof m == "string" ? [{ type: "text", text: m }] : m;
      } else l === "block" ? h = f.parseChildren(d.tokens || []) : h = f.parseInline(d.tokens || []);
      const p = { ...o, ...d.attributes };
      return f.createNode(e, p, h);
    },
    markdownTokenizer: {
      name: e,
      level: "block",
      start(d) {
        var f;
        const h = new RegExp(`^:::${c}`, "m"), p = (f = d.match(h)) == null ? void 0 : f.index;
        return p !== void 0 ? p : -1;
      },
      tokenize(d, f, h) {
        var p;
        const m = new RegExp(`^:::${c}(?:\\s+\\{([^}]*)\\})?\\s*\\n`), g = d.match(m);
        if (!g)
          return;
        const [y, k = ""] = g, S = s(k);
        let T = 1;
        const x = y.length;
        let E = "";
        const M = /^:::([\w-]*)(\s.*)?/gm, A = d.slice(x);
        for (M.lastIndex = 0; ; ) {
          const R = M.exec(A);
          if (R === null)
            break;
          const X = R.index, Be = R[1];
          if (!((p = R[2]) != null && p.endsWith(":::"))) {
            if (Be)
              T += 1;
            else if (T -= 1, T === 0) {
              const Re = A.slice(0, X);
              E = Re.trim();
              const ie = d.slice(0, x + X + R[0].length);
              let Z = [];
              if (E)
                if (l === "block")
                  for (Z = h.blockTokens(Re), Z.forEach((q) => {
                    q.text && (!q.tokens || q.tokens.length === 0) && (q.tokens = h.inlineTokens(q.text));
                  }); Z.length > 0; ) {
                    const q = Z[Z.length - 1];
                    if (q.type === "paragraph" && (!q.text || q.text.trim() === ""))
                      Z.pop();
                    else
                      break;
                  }
                else
                  Z = h.inlineTokens(E);
              return {
                type: e,
                raw: ie,
                attributes: S,
                content: E,
                tokens: Z
              };
            }
          }
        }
      }
    },
    renderMarkdown: (d, f) => {
      const h = u(d.attrs || {}), p = i(h), m = p ? ` {${p}}` : "", g = f.renderChildren(d.content || [], `

`);
      return `:::${c}${m}

${g}

:::`;
    }
  };
}
function og(n) {
  if (!n.trim())
    return {};
  const e = {}, t = /(\w+)=(?:"([^"]*)"|'([^']*)')/g;
  let r = t.exec(n);
  for (; r !== null; ) {
    const [, s, i, o] = r;
    e[s] = i || o, r = t.exec(n);
  }
  return e;
}
function lg(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function ag(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: s = og,
    serializeAttributes: i = lg,
    defaultAttributes: o = {},
    selfClosing: l = !1,
    allowedAttributes: a
  } = n, c = t || e, u = (f) => {
    if (!a)
      return f;
    const h = {};
    return a.forEach((p) => {
      const m = typeof p == "string" ? p : p.name, g = typeof p == "string" ? void 0 : p.skipIfDefault;
      if (m in f) {
        const y = f[m];
        if (g !== void 0 && y === g)
          return;
        h[m] = y;
      }
    }), h;
  }, d = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    parseMarkdown: (f, h) => {
      const p = { ...o, ...f.attributes };
      if (l)
        return h.createNode(e, p);
      const m = r ? r(f) : f.content || "";
      return m ? h.createNode(e, p, [h.createTextNode(m)]) : h.createNode(e, p, []);
    },
    markdownTokenizer: {
      name: e,
      level: "inline",
      start(f) {
        const h = l ? new RegExp(`\\[${d}\\s*[^\\]]*\\]`) : new RegExp(`\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`), p = f.match(h), m = p == null ? void 0 : p.index;
        return m !== void 0 ? m : -1;
      },
      tokenize(f, h, p) {
        const m = l ? new RegExp(`^\\[${d}\\s*([^\\]]*)\\]`) : new RegExp(
          `^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`
        ), g = f.match(m);
        if (!g)
          return;
        let y = "", k = "";
        if (l) {
          const [, T] = g;
          k = T;
        } else {
          const [, T, x] = g;
          k = T, y = x || "";
        }
        const S = s(k.trim());
        return {
          type: e,
          raw: g[0],
          content: y.trim(),
          attributes: S
        };
      }
    },
    renderMarkdown: (f) => {
      let h = "";
      r ? h = r(f) : f.content && f.content.length > 0 && (h = f.content.filter((y) => y.type === "text").map((y) => y.text).join(""));
      const p = u(f.attrs || {}), m = i(p), g = m ? ` ${m}` : "";
      return l ? `[${c}${g}]` : `[${c}${g}]${h}[/${c}]`;
    }
  };
}
function pi(n, e, t) {
  var r, s, i, o;
  const l = n.split(`
`), a = [];
  let c = "", u = 0;
  const d = e.baseIndentSize || 2;
  for (; u < l.length; ) {
    const f = l[u], h = f.match(e.itemPattern);
    if (!h) {
      if (a.length > 0)
        break;
      if (f.trim() === "") {
        u += 1, c = `${c}${f}
`;
        continue;
      } else
        return;
    }
    const p = e.extractItemData(h), { indentLevel: m, mainContent: g } = p;
    c = `${c}${f}
`;
    const y = [g];
    for (u += 1; u < l.length; ) {
      const x = l[u];
      if (x.trim() === "") {
        const M = l.slice(u + 1).findIndex((X) => X.trim() !== "");
        if (M === -1)
          break;
        if ((((s = (r = l[u + 1 + M].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : s.length) || 0) > m) {
          y.push(x), c = `${c}${x}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (i = x.match(/^(\s*)/)) == null ? void 0 : i[1]) == null ? void 0 : o.length) || 0) > m)
        y.push(x), c = `${c}${x}
`, u += 1;
      else
        break;
    }
    let k;
    const S = y.slice(1);
    if (S.length > 0) {
      const x = S.map((E) => E.slice(m + d)).join(`
`);
      x.trim() && (e.customNestedParser ? k = e.customNestedParser(x) : k = t.blockTokens(x));
    }
    const T = e.createToken(p, k);
    a.push(T);
  }
  if (a.length !== 0)
    return {
      items: a,
      raw: c
    };
}
function ro(n, e, t, r) {
  if (!n || !Array.isArray(n.content))
    return "";
  const s = typeof t == "function" ? t(r) : t, [i, ...o] = n.content, l = e.renderChildren([i]);
  let a = `${s}${l}`;
  return o && o.length > 0 && o.forEach((c, u) => {
    var d, f;
    const h = (f = (d = e.renderChild) == null ? void 0 : d.call(e, c, u + 1)) != null ? f : e.renderChildren([c]);
    if (h != null) {
      const p = h.split(`
`).map((m) => m ? e.indent(m) : e.indent("")).join(`
`);
      a += c.type === "paragraph" ? `

${p}` : `
${p}`;
    }
  }), a;
}
function zl(n) {
  return typeof n.type == "string" ? n.type : n.type.name;
}
function cg(n, e) {
  if (n.length !== e.length)
    return !1;
  const t = Array.from({ length: e.length }, () => !1);
  return n.every((r) => {
    const s = zl(r), i = e.findIndex(
      (o, l) => !t[l] && s === zl(o) && Gt(r.attrs, o.attrs)
    );
    return i === -1 ? !1 : (t[i] = !0, !0);
  });
}
function ru(n, e) {
  const t = { ...n };
  return Jn(n) && Jn(e) && Object.keys(e).forEach((r) => {
    Jn(e[r]) && Jn(n[r]) ? t[r] = ru(n[r], e[r]) : t[r] = e[r];
  }), t;
}
function ug(n, e, t = {}) {
  const { state: r } = e, { doc: s, tr: i } = r, o = n;
  s.descendants((l, a) => {
    const c = i.mapping.map(a), u = i.mapping.map(a) + l.nodeSize;
    let d = null;
    if (l.marks.forEach((h) => {
      if (h !== o)
        return !1;
      d = h;
    }), !d)
      return;
    let f = !1;
    if (Object.keys(t).forEach((h) => {
      t[h] !== d.attrs[h] && (f = !0);
    }), f) {
      const h = n.type.create({
        ...n.attrs,
        ...t
      });
      i.removeMark(c, u, n.type), i.addMark(c, u, h);
    }
  }), i.docChanged && e.view.dispatch(i);
}
var Vn = class {
  constructor(n) {
    var e;
    this.find = n.find, this.handler = n.handler, this.undoable = (e = n.undoable) != null ? e : !0;
  }
}, dg = (n, e) => {
  if (Gi(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn(
    '[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'
  ), r.push(t.replaceWith)), r;
};
function Gn(n) {
  var e;
  const { editor: t, from: r, to: s, text: i, rules: o, plugin: l } = n, { view: a } = t;
  if (a.composing)
    return !1;
  const c = a.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || (e = c.nodeBefore || c.nodeAfter) != null && e.marks.find((f) => f.type.spec.code)
  )
    return !1;
  let u = !1;
  const d = Tm(c) + i;
  return o.forEach((f) => {
    if (u)
      return;
    const h = dg(d, f.find);
    if (!h)
      return;
    const p = h[0].length - i.length;
    if (p > 0) {
      const E = c.parentOffset - p;
      if (E < 0 || c.parent.textBetween(E, c.parentOffset) !== h[0].slice(0, p))
        return;
    }
    const m = a.state.tr, g = cs({
      state: a.state,
      transaction: m
    }), y = {
      from: r - (h[0].length - i.length),
      to: s
    }, { commands: k, chain: S, can: T } = new us({
      editor: t,
      state: g
    });
    f.handler({
      state: g,
      range: y,
      match: h,
      commands: k,
      chain: S,
      can: T
    }) === null || !m.steps.length || (f.undoable && m.setMeta(l, {
      transform: m,
      from: r,
      to: s,
      text: i
    }), a.dispatch(m), u = !0);
  }), u;
}
function hg(n) {
  const { editor: e, rules: t } = n, r = new H({
    state: {
      init() {
        return null;
      },
      apply(s, i, o) {
        const l = s.getMeta(r);
        if (l)
          return l;
        const a = s.getMeta("applyInputRules");
        return !!a && setTimeout(() => {
          let { text: u } = a;
          typeof u == "string" ? u = u : u = Xi(b.from(u), o.schema);
          const { from: d } = a, f = d + u.length;
          Gn({
            editor: e,
            from: d,
            to: f,
            text: u,
            rules: t,
            plugin: r
          });
        }), s.selectionSet || s.docChanged ? null : i;
      }
    },
    props: {
      handleTextInput(s, i, o, l) {
        return Gn({
          editor: e,
          from: i,
          to: o,
          text: l,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (s) => (setTimeout(() => {
          const { $cursor: i } = s.state.selection;
          i && Gn({
            editor: e,
            from: i.pos,
            to: i.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      // add support for input rules to trigger on enter
      // this is useful for example for code blocks
      handleKeyDown(s, i) {
        if (i.key !== "Enter")
          return !1;
        const { $cursor: o } = s.state.selection;
        return o ? Gn({
          editor: e,
          from: o.pos,
          to: o.pos,
          text: `
`,
          rules: t,
          plugin: r
        }) : !1;
      }
    },
    // @ts-ignore
    isInputRules: !0
  });
  return r;
}
var so = class {
  constructor(n = {}) {
    this.type = "extendable", this.parent = null, this.child = null, this.name = "", this.config = {
      name: this.name
    }, this.config = {
      ...this.config,
      ...n
    }, this.name = this.config.name;
  }
  get options() {
    return {
      ...P(
        v(this, "addOptions", {
          name: this.name
        })
      )
    };
  }
  get storage() {
    return {
      ...P(
        v(this, "addStorage", {
          name: this.name,
          options: this.options
        })
      )
    };
  }
  configure(n = {}) {
    const e = this.extend({
      ...this.config,
      addOptions: () => ru(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, this.child = null, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, Dt = class su extends so {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new su(t);
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, s = e.state.selection.$from;
    if (s.pos === s.end()) {
      const o = s.marks();
      if (!!!o.find((c) => (c == null ? void 0 : c.type.name) === t.name))
        return !1;
      const a = o.find((c) => (c == null ? void 0 : c.type.name) === t.name);
      return a && r.removeStoredMark(a), r.insertText(" ", s.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, iu = class {
  constructor(n) {
    this.find = n.find, this.handler = n.handler;
  }
}, fg = (n, e, t) => {
  if (Gi(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((s) => {
    const i = [s.text];
    return i.index = s.index, i.input = n, i.data = s.data, s.replaceWith && (s.text.includes(s.replaceWith) || console.warn(
      '[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'
    ), i.push(s.replaceWith)), i;
  }) : [];
};
function pg(n) {
  const { editor: e, state: t, from: r, to: s, rule: i, pasteEvent: o, dropEvent: l } = n, { commands: a, chain: c, can: u } = new us({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, s, (h, p) => {
    var m, g, y, k, S;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const T = (S = (k = (y = h.content) == null ? void 0 : y.size) != null ? k : h.nodeSize) != null ? S : 0, x = Math.max(r, p), E = Math.min(s, p + T);
    if (x >= E)
      return;
    const M = h.isText ? h.text || "" : h.textBetween(x - p, E - p, void 0, "￼");
    fg(M, i.find, o).forEach((R) => {
      if (R.index === void 0)
        return;
      const X = x + R.index + 1, Be = X + R[0].length, Re = {
        from: t.tr.mapping.map(X),
        to: t.tr.mapping.map(Be)
      }, ie = i.handler({
        state: t,
        range: Re,
        match: R,
        commands: a,
        chain: c,
        can: u,
        pasteEvent: o,
        dropEvent: l
      });
      d.push(ie);
    });
  }), d.every((h) => h !== null);
}
var Qn = null, mg = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function gg(n) {
  const { editor: e, rules: t } = n;
  let r = null, s = !1, i = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, l;
  try {
    l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  } catch {
    l = null;
  }
  const a = ({
    state: u,
    from: d,
    to: f,
    rule: h,
    pasteEvt: p
  }) => {
    const m = u.tr, g = cs({
      state: u,
      transaction: m
    });
    if (!(!pg({
      editor: e,
      state: g,
      from: Math.max(d - 1, 0),
      to: f.b - 1,
      rule: h,
      pasteEvent: p,
      dropEvent: l
    }) || !m.steps.length)) {
      try {
        l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
      } catch {
        l = null;
      }
      return o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, m;
    }
  };
  return t.map((u) => new H({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (Qn = e);
      }, h = () => {
        Qn && (Qn = null);
      };
      return window.addEventListener("dragstart", f), window.addEventListener("dragend", h), {
        destroy() {
          window.removeEventListener("dragstart", f), window.removeEventListener("dragend", h);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (d, f) => {
          if (i = r === d.dom.parentElement, l = f, !i) {
            const h = Qn;
            h != null && h.isEditable && setTimeout(() => {
              const p = h.state.selection;
              p && h.commands.deleteRange({
                from: p.from,
                to: p.to
              });
            }, 10);
          }
          return !1;
        },
        paste: (d, f) => {
          var h;
          const p = (h = f.clipboardData) == null ? void 0 : h.getData("text/html");
          return o = f, s = !!(p != null && p.includes("data-pm-slice")), !1;
        }
      }
    },
    appendTransaction: (d, f, h) => {
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !s, g = p.getMeta("uiEvent") === "drop" && !i, y = p.getMeta("applyPasteRules"), k = !!y;
      if (!m && !g && !k)
        return;
      if (k) {
        let { text: x } = y;
        typeof x == "string" ? x = x : x = Xi(b.from(x), h.schema);
        const { from: E } = y, M = E + x.length, A = mg(x);
        return a({
          rule: u,
          state: h,
          from: E,
          to: { b: M },
          pasteEvt: A
        });
      }
      const S = f.doc.content.findDiffStart(h.doc.content), T = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!tg(S) || !T || S === T.b))
        return a({
          rule: u,
          state: h,
          from: S,
          to: T,
          pasteEvt: o
        });
    }
  }));
}
var ps = class {
  constructor(n, e) {
    this.splittableMarks = [], this.nonClearableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = Zi(n), this.schema = Jc(this.extensions, e), this.setupExtensions();
  }
  /**
   * Get all commands from the extensions.
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  get commands() {
    return this.extensions.reduce((n, e) => {
      const t = {
        name: e.name,
        options: e.options,
        storage: this.editor.extensionStorage[e.name],
        editor: this.editor,
        type: en(e.name, this.schema)
      }, r = v(
        e,
        "addCommands",
        t
      );
      return r ? {
        ...n,
        ...r()
      } : n;
    }, {});
  }
  /**
   * Get all registered Prosemirror plugins from the extensions.
   * @returns An array of Prosemirror plugins
   */
  get plugins() {
    const { editor: n } = this;
    return Vt([...this.extensions].reverse()).flatMap((r) => {
      const s = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: en(r.name, this.schema)
      }, i = [], o = v(
        r,
        "addKeyboardShortcuts",
        s
      );
      let l = {};
      if (r.type === "mark" && v(r, "exitable", s) && (l.ArrowRight = () => Dt.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        l = { ...l, ...f };
      }
      const a = yp(l);
      i.push(a);
      const c = v(
        r,
        "addInputRules",
        s
      );
      if (Il(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = hg({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          i.push(...p);
        }
      }
      const u = v(
        r,
        "addPasteRules",
        s
      );
      if (Il(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = gg({ editor: n, rules: f });
          i.push(...h);
        }
      }
      const d = v(
        r,
        "addProseMirrorPlugins",
        s
      );
      if (d) {
        const f = d();
        i.push(...f);
      }
      return i;
    });
  }
  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return Kc(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = Jt(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!v(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter(
          (a) => a.type === t.name
        ), s = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: J(t.name, this.schema)
        }, i = v(
          t,
          "addNodeView",
          s
        );
        if (!i)
          return [];
        const o = i();
        if (!o)
          return [];
        const l = (a, c, u, d, f) => {
          const h = Dn(a, r);
          return o({
            // pass-through
            node: a,
            view: c,
            getPos: u,
            decorations: d,
            innerDecorations: f,
            // tiptap-specific
            editor: n,
            extension: t,
            HTMLAttributes: h
          });
        };
        return [t.name, l];
      })
    );
  }
  /**
   * Get the composed dispatchTransaction function from all extensions.
   * @param baseDispatch The base dispatch function (e.g. from the editor or user props)
   * @returns A composed dispatch function
   */
  dispatchTransaction(n) {
    const { editor: e } = this;
    return Vt([...this.extensions].reverse()).reduceRight((r, s) => {
      const i = {
        name: s.name,
        options: s.options,
        storage: this.editor.extensionStorage[s.name],
        editor: e,
        type: en(s.name, this.schema)
      }, o = v(
        s,
        "dispatchTransaction",
        i
      );
      return o ? (l) => {
        o.call(i, { transaction: l, next: r });
      } : r;
    }, n);
  }
  /**
   * Get the composed transformPastedHTML function from all extensions.
   * @param baseTransform The base transform function (e.g. from the editor props)
   * @returns A composed transform function that chains all extension transforms
   */
  transformPastedHTML(n) {
    const { editor: e } = this;
    return Vt([...this.extensions]).reduce(
      (r, s) => {
        const i = {
          name: s.name,
          options: s.options,
          storage: this.editor.extensionStorage[s.name],
          editor: e,
          type: en(s.name, this.schema)
        }, o = v(
          s,
          "transformPastedHTML",
          i
        );
        return o ? (l, a) => {
          const c = r(l, a);
          return o.call(i, c);
        } : r;
      },
      n || ((r) => r)
    );
  }
  get markViews() {
    const { editor: n } = this, { markExtensions: e } = Jt(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!v(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter(
          (l) => l.type === t.name
        ), s = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Ge(t.name, this.schema)
        }, i = v(
          t,
          "addMarkView",
          s
        );
        if (!i)
          return [];
        const o = (l, a, c) => {
          const u = Dn(l, r);
          return i()({
            // pass-through
            mark: l,
            view: a,
            inline: c,
            // tiptap-specific
            editor: n,
            extension: t,
            HTMLAttributes: u,
            updateAttributes: (d) => {
              ug(l, n, d);
            }
          });
        };
        return [t.name, o];
      })
    );
  }
  /**
   * Destroy the extension manager and clean up all extension references
   * to prevent memory leaks through parent/child extension chains.
   *
   * Walks each extension's full parent chain and nulls every forward
   * `parent.child → current` link where the parent still points to the
   * current node. This breaks the retention path from module-scope
   * singleton roots through deep extend() chains.
   *
   * Only ancestor `.child` links matching the current chain are cleared.
   * The `.parent` pointer on ancestors is never touched — extensions
   * may be shared across live editors, so their own backward references
   * and non-matching forward links must remain intact.
   */
  destroy() {
    this.extensions.forEach((n) => {
      let e = n;
      for (; e.parent; ) {
        const t = e.parent;
        t.child === e && (t.child = null), e = t;
      }
    }), this.extensions = [], this.baseExtensions = [], this.schema = null, this.editor = null;
  }
  /**
   * Go through all extensions, create extension storages & setup marks
   * & bind editor event listener.
   */
  setupExtensions() {
    const n = this.extensions;
    this.editor.extensionStorage = Object.fromEntries(
      n.map((e) => [e.name, e.storage])
    ), n.forEach((e) => {
      var t, r;
      const s = {
        name: e.name,
        options: e.options,
        storage: this.editor.extensionStorage[e.name],
        editor: this.editor,
        type: en(e.name, this.schema)
      };
      e.type === "mark" && (((t = P(v(e, "keepOnSplit", s))) == null || t) && this.splittableMarks.push(e.name), (r = P(
        v(e, "clearable", s)
      )) == null || r || this.nonClearableMarks.push(e.name));
      const i = v(
        e,
        "onBeforeCreate",
        s
      ), o = v(e, "onCreate", s), l = v(e, "onUpdate", s), a = v(
        e,
        "onSelectionUpdate",
        s
      ), c = v(
        e,
        "onTransaction",
        s
      ), u = v(e, "onFocus", s), d = v(e, "onBlur", s), f = v(e, "onDestroy", s);
      i && this.editor.on("beforeCreate", i), o && this.editor.on("create", o), l && this.editor.on("update", l), a && this.editor.on("selectionUpdate", a), c && this.editor.on("transaction", c), u && this.editor.on("focus", u), d && this.editor.on("blur", d), f && this.editor.on("destroy", f);
    });
  }
};
ps.resolve = Zi;
ps.sort = Vt;
ps.flatten = fs;
var yg = {};
Ji(yg, {
  ClipboardTextSerializer: () => lu,
  Commands: () => au,
  Delete: () => cu,
  Drop: () => uu,
  Editable: () => du,
  FocusEvents: () => fu,
  Keymap: () => pu,
  Paste: () => mu,
  Tabindex: () => gu,
  TextDirection: () => yu,
  focusEventsPluginKey: () => hu
});
var V = class ou extends so {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new ou(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, lu = V.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: s } = e, i = Xc(t), { blockSeparator: o } = this.options, l = {
              ...o !== void 0 ? { blockSeparator: o } : {},
              textSerializers: i
            };
            return [...s.ranges].sort((c, u) => c.$from.pos - u.$from.pos).map(
              ({ $from: c, $to: u }) => Qc(r, { from: c.pos, to: u.pos }, l)
            ).join(o ?? `

`);
          }
        }
      })
    ];
  }
}), au = V.create({
  name: "commands",
  addCommands() {
    return {
      ...Me
    };
  }
}), cu = V.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, s;
    const i = () => {
      var o, l, a, c;
      if ((c = (a = (l = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : l.filterTransaction) == null ? void 0 : a.call(l, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = qc(n.before, [
        n,
        ...e
      ]);
      Yi(u).forEach((h) => {
        u.mapping.mapResult(h.oldRange.from).deletedAfter && u.mapping.mapResult(h.oldRange.to).deletedBefore && u.before.nodesBetween(
          h.oldRange.from,
          h.oldRange.to,
          (p, m) => {
            const g = m + p.nodeSize - 2, y = h.oldRange.from <= m && g <= h.oldRange.to;
            this.editor.emit("delete", {
              type: "node",
              node: p,
              from: m,
              to: g,
              newFrom: u.mapping.map(m),
              newTo: u.mapping.map(g),
              deletedRange: h.oldRange,
              newRange: h.newRange,
              partial: !y,
              editor: this.editor,
              transaction: n,
              combinedTransform: u
            });
          }
        );
      });
      const f = u.mapping;
      u.steps.forEach((h, p) => {
        var m, g;
        if (h instanceof Ae) {
          const y = f.slice(p).map(h.from, -1), k = f.slice(p).map(h.to), S = f.invert().map(y, -1), T = f.invert().map(k), x = y > 0 ? (m = u.doc.nodeAt(y - 1)) == null ? void 0 : m.marks.some((M) => M.eq(h.mark)) : !1, E = (g = u.doc.nodeAt(k)) == null ? void 0 : g.marks.some((M) => M.eq(h.mark));
          this.editor.emit("delete", {
            type: "mark",
            mark: h.mark,
            from: h.from,
            to: h.to,
            deletedRange: {
              from: S,
              to: T
            },
            newRange: {
              from: y,
              to: k
            },
            partial: !!(E || x),
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        }
      });
    };
    (s = (r = (t = this.editor.options.coreExtensionOptions) == null ? void 0 : t.delete) == null ? void 0 : r.async) == null || s ? setTimeout(i, 0) : i();
  }
}), uu = V.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("tiptapDrop"),
        props: {
          handleDrop: (n, e, t, r) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: e,
              slice: t,
              moved: r
            });
          }
        }
      })
    ];
  }
}), du = V.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), hu = new Q("focusEvents"), fu = V.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new H({
        key: hu,
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
}), pu = V.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: d } = a, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? l.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, y = m && p.parent.childCount === 1 ? g === d.pos : I.atStart(c).from === f;
        return !u || !h.type.isTextblock || h.textContent.length || !y || y && d.parent.type.name === "paragraph" ? !1 : o.clearNodes();
      }),
      () => o.deleteSelection(),
      () => o.joinBackward(),
      () => o.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: o }) => [
      () => o.deleteSelection(),
      () => o.deleteCurrentNode(),
      () => o.joinForward(),
      () => o.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: o }) => [
        () => o.newlineInCode(),
        () => o.createParagraphNear(),
        () => o.liftEmptyBlock(),
        () => o.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, s = {
      ...r
    }, i = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Sr() || jc() ? i : s;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new H({
        key: new Q("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), s = n.some(
            (m) => m.getMeta("preventClearDocument")
          );
          if (!r || s)
            return;
          const { empty: i, from: o, to: l } = e.selection, a = I.atStart(e.doc).from, c = I.atEnd(e.doc).to;
          if (i || !(o === a && l === c) || !Hn(t.doc))
            return;
          const f = t.tr, h = cs({
            state: t,
            transaction: f
          }), { commands: p } = new us({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), mu = V.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("tiptapPaste"),
        props: {
          handlePaste: (n, e, t) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: e,
              slice: t
            });
          }
        }
      })
    ];
  }
}), gu = V.create({
  name: "tabindex",
  addOptions() {
    return {
      value: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("tabindex"),
        props: {
          attributes: () => {
            var n;
            return !this.editor.isEditable && this.options.value === void 0 ? {} : { tabindex: (n = this.options.value) != null ? n : "0" };
          }
        }
      })
    ];
  }
}), yu = V.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = Jt(this.extensions);
    return [
      {
        types: n.filter((e) => e.name !== "text").map((e) => e.name),
        attributes: {
          dir: {
            default: this.options.direction,
            parseHTML: (e) => {
              const t = e.getAttribute("dir");
              return t && (t === "ltr" || t === "rtl" || t === "auto") ? t : this.options.direction;
            },
            renderHTML: (e) => e.dir ? {
              dir: e.dir
            } : {}
          }
        }
      }
    ];
  },
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("textDirection"),
        props: {
          attributes: () => {
            const n = this.options.direction;
            return n ? {
              dir: n
            } : {};
          }
        }
      })
    ];
  }
}), kg = class cn {
  constructor(e, t, r = !1, s = null) {
    this.currentNode = null, this.actualDepth = null, this.isBlock = r, this.resolvedPos = e, this.editor = t, this.currentNode = s;
  }
  get name() {
    return this.node.type.name;
  }
  get node() {
    return this.currentNode || this.resolvedPos.node();
  }
  get element() {
    return this.editor.view.domAtPos(this.pos).node;
  }
  get depth() {
    var e;
    return (e = this.actualDepth) != null ? e : this.resolvedPos.depth;
  }
  get pos() {
    return this.resolvedPos.pos;
  }
  get content() {
    return this.node.content;
  }
  set content(e) {
    let t = this.from, r = this.to;
    if (this.isBlock) {
      if (this.content.size === 0) {
        console.error(
          `You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`
        );
        return;
      }
      t = this.from + 1, r = this.to - 1;
    }
    this.editor.commands.insertContentAt({ from: t, to: r }, e);
  }
  get attributes() {
    return this.node.attrs;
  }
  get textContent() {
    return this.node.textContent;
  }
  get size() {
    return this.node.nodeSize;
  }
  get from() {
    return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
  }
  get range() {
    return {
      from: this.from,
      to: this.to
    };
  }
  get to() {
    return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + (this.node.isText ? 0 : 1);
  }
  get parent() {
    if (this.depth === 0)
      return null;
    const e = this.resolvedPos.start(this.resolvedPos.depth - 1), t = this.resolvedPos.doc.resolve(e);
    return new cn(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new cn(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new cn(e, this.editor);
  }
  get children() {
    const e = [];
    return this.node.content.forEach((t, r) => {
      const s = t.isBlock && !t.isTextblock, i = t.isAtom && !t.isText, o = t.isInline, l = this.pos + r + (i ? 0 : 1);
      if (l < 0 || l > this.resolvedPos.doc.nodeSize - 2)
        return;
      const a = this.resolvedPos.doc.resolve(l);
      if (!s && !o && a.depth <= this.depth)
        return;
      const c = new cn(
        a,
        this.editor,
        s,
        s || o ? t : null
      );
      s && (c.actualDepth = this.depth + 1), e.push(c);
    }), e;
  }
  get firstChild() {
    return this.children[0] || null;
  }
  get lastChild() {
    const e = this.children;
    return e[e.length - 1] || null;
  }
  closest(e, t = {}) {
    let r = null, s = this.parent;
    for (; s && !r; ) {
      if (s.node.type.name === e)
        if (Object.keys(t).length > 0) {
          const i = s.node.attrs, o = Object.keys(t);
          for (let l = 0; l < o.length; l += 1) {
            const a = o[l];
            if (i[a] !== t[a])
              break;
          }
        } else
          r = s;
      s = s.parent;
    }
    return r;
  }
  querySelector(e, t = {}) {
    return this.querySelectorAll(e, t, !0)[0] || null;
  }
  querySelectorAll(e, t = {}, r = !1) {
    let s = [];
    if (!this.children || this.children.length === 0)
      return s;
    const i = Object.keys(t);
    return this.children.forEach((o) => {
      r && s.length > 0 || (o.node.type.name === e && i.every(
        (a) => t[a] === o.node.attrs[a]
      ) && s.push(o), !(r && s.length > 0) && (s = s.concat(o.querySelectorAll(e, t, r))));
    }), s;
  }
  setAttribute(e) {
    const { tr: t } = this.editor.state;
    t.setNodeMarkup(this.from, void 0, {
      ...this.node.attrs,
      ...e
    }), this.editor.view.dispatch(t);
  }
}, bg = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}`, xg = class extends Xm {
  constructor(n = {}) {
    super(), this.css = null, this.className = "tiptap", this.editorView = null, this.isFocused = !1, this.destroyed = !1, this.isInitialized = !1, this.extensionStorage = {}, this.instanceId = Math.random().toString(36).slice(2, 9), this.options = {
      element: typeof document < "u" ? document.createElement("div") : null,
      content: "",
      injectCSS: !0,
      injectNonce: void 0,
      extensions: [],
      autofocus: !1,
      editable: !0,
      textDirection: void 0,
      editorProps: {},
      parseOptions: {},
      coreExtensionOptions: {},
      enableInputRules: !0,
      enablePasteRules: !0,
      enableCoreExtensions: !0,
      enableContentCheck: !1,
      emitContentError: !1,
      onBeforeCreate: () => null,
      onCreate: () => null,
      onMount: () => null,
      onUnmount: () => null,
      onUpdate: () => null,
      onSelectionUpdate: () => null,
      onTransaction: () => null,
      onFocus: () => null,
      onBlur: () => null,
      onDestroy: () => null,
      onContentError: ({ error: t }) => {
        throw t;
      },
      onPaste: () => null,
      onDrop: () => null,
      onDelete: () => null,
      enableExtensionDispatchTransaction: !0
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.utils = {
      getUpdatedPosition: Em,
      createMappablePosition: Am
    }, this.setOptions(n), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: t, slice: r, moved: s }) => this.options.onDrop(t, r, s)), this.on("paste", ({ event: t, slice: r }) => this.options.onPaste(t, r)), this.on("delete", this.options.onDelete);
    const e = this.createDoc();
    if (!this.editorState) {
      const t = di(e, this.options.autofocus);
      this.editorState = gt.create({
        doc: e,
        schema: this.schema,
        selection: t || void 0
      });
    }
    this.options.element && this.mount(this.options.element);
  }
  /**
   * Attach the editor to the DOM, creating a new editor view.
   */
  mount(n) {
    if (typeof document > "u")
      throw new Error(
        "[tiptap error]: The editor cannot be mounted because there is no 'document' defined in this environment."
      );
    this.createView(n), this.emit("mount", { editor: this }), this.css && !document.head.contains(this.css) && document.head.appendChild(this.css), window.setTimeout(() => {
      this.isDestroyed || (this.options.autofocus !== !1 && this.options.autofocus !== null && this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
    }, 0);
  }
  /**
   * Remove the editor from the DOM, but still allow remounting at a different point in time
   */
  unmount() {
    if (this.editorView) {
      const n = this.editorView.dom;
      n != null && n.editor && delete n.editor, this.editorView.destroy();
    }
    if (this.editorView = null, this.isInitialized = !1, this.css && !document.querySelectorAll(`.${this.className}`).length)
      try {
        typeof this.css.remove == "function" ? this.css.remove() : this.css.parentNode && this.css.parentNode.removeChild(this.css);
      } catch (n) {
        console.warn("Failed to remove CSS element:", n);
      }
    this.css = null, this.emit("unmount", { editor: this });
  }
  /**
   * Returns the editor storage.
   */
  get storage() {
    return this.extensionStorage;
  }
  /**
   * An object of all registered commands.
   */
  get commands() {
    return this.commandManager.commands;
  }
  /**
   * Create a command chain to call multiple commands at once.
   */
  chain() {
    return this.commandManager.chain();
  }
  /**
   * Check if a command or a command chain can be executed. Without executing it.
   */
  can() {
    return this.commandManager.can();
  }
  /**
   * Inject CSS styles.
   */
  injectCSS() {
    this.options.injectCSS && typeof document < "u" && (this.css = Ym(bg, this.options.injectNonce));
  }
  /**
   * Update editor options.
   *
   * @param options A list of options
   */
  setOptions(n = {}) {
    this.options = {
      ...this.options,
      ...n
    }, !(!this.editorView || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  /**
   * Update editable state of the editor.
   */
  setEditable(n, e = !0) {
    this.setOptions({ editable: n }), e && this.emit("update", { editor: this, transaction: this.state.tr, appendedTransactions: [] });
  }
  /**
   * Returns whether the editor is editable.
   */
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  /**
   * Returns the editor view.
   */
  get view() {
    return this.editorView ? this.editorView : new Proxy(
      {
        state: this.editorState,
        updateState: (n) => {
          this.editorState = n;
        },
        dispatch: (n) => {
          this.dispatchTransaction(n);
        },
        // Stub some commonly accessed properties to prevent errors
        composing: !1,
        dragging: null,
        editable: !0,
        isDestroyed: !1
      },
      {
        get: (n, e) => {
          if (this.editorView)
            return this.editorView[e];
          if (e === "state")
            return this.editorState;
          if (e in n)
            return Reflect.get(n, e);
          throw new Error(
            `[tiptap error]: The editor view is not available. Cannot access view['${e}']. The editor may not be mounted yet.`
          );
        }
      }
    );
  }
  /**
   * Returns the editor state.
   */
  get state() {
    return this.editorView && (this.editorState = this.view.state), this.editorState;
  }
  /**
   * Register a ProseMirror plugin.
   *
   * @param plugin A ProseMirror plugin
   * @param handlePlugins Control how to merge the plugin into the existing plugins.
   * @returns The new editor state
   */
  registerPlugin(n, e) {
    const t = Uc(e) ? e(n, [...this.state.plugins]) : [...this.state.plugins, n], r = this.state.reconfigure({ plugins: t });
    return this.view.updateState(r), r;
  }
  /**
   * Unregister a ProseMirror plugin.
   *
   * @param nameOrPluginKeyToRemove The plugins name
   * @returns The new editor state or undefined if the editor is destroyed
   */
  unregisterPlugin(n) {
    if (this.isDestroyed)
      return;
    const e = this.state.plugins;
    let t = e;
    if ([].concat(n).forEach((s) => {
      const i = typeof s == "string" ? `${s}$` : s.key;
      t = t.filter((o) => !o.key.startsWith(i));
    }), e.length === t.length)
      return;
    const r = this.state.reconfigure({
      plugins: t
    });
    return this.view.updateState(r), r;
  }
  /**
   * Creates an extension manager.
   */
  createExtensionManager() {
    var n, e, t, r;
    const i = [...this.options.enableCoreExtensions ? [
      du,
      lu.configure({
        blockSeparator: (e = (n = this.options.coreExtensionOptions) == null ? void 0 : n.clipboardTextSerializer) == null ? void 0 : e.blockSeparator
      }),
      au,
      fu,
      pu,
      gu.configure({
        value: (r = (t = this.options.coreExtensionOptions) == null ? void 0 : t.tabindex) == null ? void 0 : r.value
      }),
      uu,
      mu,
      cu,
      yu.configure({
        direction: this.options.textDirection
      })
    ].filter((o) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[o.name] !== !1 : !0) : [], ...this.options.extensions].filter((o) => ["extension", "node", "mark"].includes(o == null ? void 0 : o.type));
    this.extensionManager = new ps(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new us({
      editor: this
    });
  }
  /**
   * Creates a ProseMirror schema.
   */
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  /**
   * Creates the initial document.
   */
  createDoc() {
    let n;
    try {
      n = hi(this.options.content, this.schema, this.options.parseOptions, {
        errorOnInvalidContent: this.options.enableContentCheck
      });
    } catch (e) {
      if (!(e instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(
        e.message
      ))
        throw e;
      const t = hi(
        this.options.content,
        this.schema,
        this.options.parseOptions,
        {
          errorOnInvalidContent: !1
        }
      );
      return this.editorState = gt.create({
        doc: t,
        schema: this.schema,
        selection: di(t, this.options.autofocus) || void 0
      }), this.emit("contentError", {
        editor: this,
        error: e,
        disableCollaboration: () => {
          "collaboration" in this.storage && typeof this.storage.collaboration == "object" && this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter(
            (r) => r.name !== "collaboration"
          ), this.createExtensionManager();
        }
      }), this.editorState.doc;
    }
    return n;
  }
  /**
   * Creates a ProseMirror view.
   */
  createView(n) {
    const { editorProps: e, enableExtensionDispatchTransaction: t } = this.options, r = e.dispatchTransaction || this.dispatchTransaction.bind(this), s = t ? this.extensionManager.dispatchTransaction(r) : r, i = e.transformPastedHTML, o = this.extensionManager.transformPastedHTML(i);
    this.editorView = new zc(n, {
      ...e,
      attributes: {
        // add `role="textbox"` to the editor element
        role: "textbox",
        ...e == null ? void 0 : e.attributes
      },
      dispatchTransaction: s,
      transformPastedHTML: o,
      state: this.editorState,
      markViews: this.extensionManager.markViews,
      nodeViews: this.extensionManager.nodeViews
    });
    const l = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(l), this.prependClass(), this.injectCSS();
    const a = this.view.dom;
    a.editor = this;
  }
  /**
   * Creates all node and mark views.
   */
  createNodeViews() {
    this.view.isDestroyed || this.view.setProps({
      markViews: this.extensionManager.markViews,
      nodeViews: this.extensionManager.nodeViews
    });
  }
  /**
   * Prepend class name to element.
   */
  prependClass() {
    this.view.dom.className = `${this.className} ${this.view.dom.className}`;
  }
  captureTransaction(n) {
    this.isCapturingTransaction = !0, n(), this.isCapturingTransaction = !1;
    const e = this.capturedTransaction;
    return this.capturedTransaction = null, e;
  }
  /**
   * The callback over which to send transactions (state updates) produced by the view.
   *
   * @param transaction An editor state transaction
   */
  dispatchTransaction(n) {
    if (this.view.isDestroyed)
      return;
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = n;
        return;
      }
      n.steps.forEach((c) => {
        var u;
        return (u = this.capturedTransaction) == null ? void 0 : u.step(c);
      });
      return;
    }
    const { state: e, transactions: t } = this.state.applyTransaction(n), r = !this.state.selection.eq(e.selection), s = t.includes(n), i = this.state;
    if (this.emit("beforeTransaction", {
      editor: this,
      transaction: n,
      nextState: e
    }), !s)
      return;
    this.view.updateState(e), this.emit("transaction", {
      editor: this,
      transaction: n,
      appendedTransactions: t.slice(1)
    }), r && this.emit("selectionUpdate", {
      editor: this,
      transaction: n
    });
    const o = t.findLast((c) => c.getMeta("focus") || c.getMeta("blur")), l = o == null ? void 0 : o.getMeta("focus"), a = o == null ? void 0 : o.getMeta("blur");
    l && this.emit("focus", {
      editor: this,
      event: l.event,
      // oxlint-disable-next-lineno-non-null-assertion
      transaction: o
    }), a && this.emit("blur", {
      editor: this,
      event: a.event,
      // oxlint-disable-next-lineno-non-null-assertion
      transaction: o
    }), !(n.getMeta("preventUpdate") || !t.some((c) => c.docChanged) || i.doc.eq(e.doc)) && this.emit("update", {
      editor: this,
      transaction: n,
      appendedTransactions: t.slice(1)
    });
  }
  /**
   * Get attributes of the currently selected node or mark.
   */
  getAttributes(n) {
    return Zc(this.state, n);
  }
  isActive(n, e) {
    const t = typeof n == "string" ? n : null, r = typeof n == "string" ? e : n;
    return Mm(this.state, t, r);
  }
  /**
   * Get the document as JSON.
   */
  getJSON() {
    return this.state.doc.toJSON();
  }
  /**
   * Get the document as HTML.
   */
  getHTML() {
    return Xi(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(n) {
    const { blockSeparator: e = `

`, textSerializers: t = {} } = n || {};
    return km(this.state.doc, {
      blockSeparator: e,
      textSerializers: {
        ...Xc(this.schema),
        ...t
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Hn(this.state.doc);
  }
  /**
   * Destroy the editor.
   */
  destroy() {
    this.destroyed || (this.destroyed = !0, this.emit("destroy"), this.unmount(), this.removeAllListeners(), this.extensionManager.destroy(), this.extensionManager = null, this.schema = null, this.commandManager = null, this.extensionStorage = {});
  }
  /**
   * Check if the editor is already destroyed.
   */
  get isDestroyed() {
    var n, e;
    return (e = (n = this.editorView) == null ? void 0 : n.isDestroyed) != null ? e : !0;
  }
  $node(n, e) {
    var t;
    return ((t = this.$doc) == null ? void 0 : t.querySelector(n, e)) || null;
  }
  $nodes(n, e) {
    var t;
    return ((t = this.$doc) == null ? void 0 : t.querySelectorAll(n, e)) || null;
  }
  $pos(n) {
    const e = this.state.doc.resolve(n), t = n > 0 && e.nodeAfter && !e.nodeAfter.isText && e.nodeAfter.isAtom ? e.nodeAfter : null;
    return new kg(e, this, !1, t);
  }
  get $doc() {
    return this.$pos(0);
  }
};
function Nt(n) {
  return new Vn({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = P(n.getAttributes, void 0, r);
      if (s === !1 || s === null)
        return null;
      const { tr: i } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = t.from + l.indexOf(o), u = c + o.length;
        if (eo(t.from, t.to, e.doc).filter((h) => h.mark.type.excluded.find((m) => m === n.type && m !== h.mark.type)).filter((h) => h.to > c).length)
          return null;
        u < t.to && i.delete(u, t.to), c > t.from && i.delete(t.from + a, c);
        const f = t.from + a + o.length;
        i.addMark(t.from + a, f, n.type.create(s || {})), i.removeStoredMark(n.type);
      }
    },
    undoable: n.undoable
  });
}
function wg(n) {
  return new Vn({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = P(n.getAttributes, void 0, r) || {}, { tr: i } = e, o = t.from;
      let l = t.to;
      const a = n.type.create(s);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let u = o + c;
        u > l ? u = l : l = u + r[1].length;
        const d = r[0][r[0].length - 1];
        i.insertText(d, o + r[0].length - 1), i.replaceWith(u, l, a);
      } else if (r[0]) {
        const c = n.type.isInline ? o : o - 1;
        i.insert(c, n.type.create(s)).delete(
          i.mapping.map(o),
          i.mapping.map(l)
        );
      }
      i.scrollIntoView();
    },
    undoable: n.undoable
  });
}
function mi(n) {
  return new Vn({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const s = e.doc.resolve(t.from), i = P(n.getAttributes, void 0, r) || {};
      if (!s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, i);
    },
    undoable: n.undoable
  });
}
function Qt(n) {
  return new Vn({
    find: n.find,
    handler: ({ state: e, range: t, match: r, chain: s }) => {
      const i = P(n.getAttributes, void 0, r) || {}, o = e.tr.delete(t.from, t.to), a = o.doc.resolve(t.from).blockRange(), c = a && Di(a, n.type, i);
      if (!c)
        return null;
      if (o.wrap(a, c), n.keepMarks && n.editor) {
        const { selection: d, storedMarks: f } = e, { splittableMarks: h } = n.editor.extensionManager, p = f || d.$to.parentOffset && d.$from.marks();
        if (p) {
          const m = p.filter((g) => h.includes(g.type.name));
          o.ensureMarks(m);
        }
      }
      if (n.keepAttributes) {
        const d = n.type.name === "bulletList" || n.type.name === "orderedList" ? "listItem" : "taskList";
        s().updateAttributes(d, i).run();
      }
      const u = o.doc.resolve(t.from - 1).nodeBefore;
      u && u.type === n.type && ht(o.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, u)) && o.join(t.from - 1);
    },
    undoable: n.undoable
  });
}
var ye = class ku extends so {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new ku(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
};
function ut(n) {
  return new iu({
    find: n.find,
    handler: ({ state: e, range: t, match: r, pasteEvent: s }) => {
      const i = P(n.getAttributes, void 0, r, s);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = t.to;
      if (l) {
        const u = a.search(/\S/), d = t.from + a.indexOf(l), f = d + l.length;
        if (eo(t.from, t.to, e.doc).filter((m) => m.mark.type.excluded.find((y) => y === n.type && y !== m.mark.type)).filter((m) => m.to > d).length)
          return null;
        f < t.to && o.delete(f, t.to), d > t.from && o.delete(t.from + u, d), c = t.from + u + l.length, o.addMark(t.from + u, c, n.type.create(i || {})), r.index !== void 0 && r.input !== void 0 && r.index + r[0].length >= r.input.length || o.removeStoredMark(n.type);
      }
    }
  });
}
var Tr = (n, e) => {
  if (n === "slot")
    return 0;
  if (n instanceof Function)
    return n(e);
  const { children: t, ...r } = e ?? {};
  if (n === "svg")
    throw new Error(
      "SVG elements are not supported in the JSX syntax, use the array syntax instead"
    );
  return [n, r, t];
}, Sg = (n, e) => {
  var t;
  const { state: r, view: s } = n, { selection: i } = r;
  if (!i.empty) return !1;
  const { $from: o } = i;
  if (o.parentOffset !== 0) return !1;
  const l = o.depth - 1;
  if (l < 0) return !1;
  const a = o.node(l), c = o.index(l);
  if (c === 0) return !1;
  if (a.type === e)
    return n.commands.lift(e.name);
  const u = a.child(c - 1);
  if (u.type !== e || !((t = u.lastChild) != null && t.isTextblock))
    return !1;
  const d = o.before(), h = d - 1 - 1, { tr: p } = r;
  return p.delete(d, o.after()).insert(h, o.parent.content), p.setSelection(N.create(p.doc, h)), s.dispatch(p.scrollIntoView()), !0;
}, Tg = /^\s*>\s$/, Mg = ye.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: !0,
  parseHTML() {
    return [{ tag: "blockquote" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return /* @__PURE__ */ Tr("blockquote", { ...G(this.options.HTMLAttributes, n), children: /* @__PURE__ */ Tr("slot", {}) });
  },
  parseMarkdown: (n, e) => {
    var t;
    const r = (t = e.parseBlockChildren) != null ? t : e.parseChildren;
    return e.createNode("blockquote", void 0, r(n.tokens || []));
  },
  renderMarkdown: (n, e) => {
    if (!n.content)
      return "";
    const t = ">", r = [];
    return n.content.forEach((s, i) => {
      var o, l;
      const u = ((l = (o = e.renderChild) == null ? void 0 : o.call(e, s, i)) != null ? l : e.renderChildren([s])).split(`
`).map((d) => d.trim() === "" ? t : `${t} ${d}`);
      r.push(u.join(`
`));
    }), r.join(`
${t}
`);
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands: n }) => n.wrapIn(this.name),
      toggleBlockquote: () => ({ commands: n }) => n.toggleWrap(this.name),
      unsetBlockquote: () => ({ commands: n }) => n.lift(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
      Backspace: () => Sg(this.editor, this.type)
    };
  },
  addInputRules() {
    return [
      Qt({
        find: Tg,
        type: this.type
      })
    ];
  }
}), Cg = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, vg = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, Eg = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, Ag = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, Og = Dt.create({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b",
        getAttrs: (n) => n.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight=400",
        clearMark: (n) => n.type.name === this.name
      },
      {
        style: "font-weight",
        getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return /* @__PURE__ */ Tr("strong", { ...G(this.options.HTMLAttributes, n), children: /* @__PURE__ */ Tr("slot", {}) });
  },
  markdownTokenName: "strong",
  parseMarkdown: (n, e) => e.applyMark("bold", e.parseInline(n.tokens || [])),
  markdownOptions: {
    htmlReopen: {
      open: "<strong>",
      close: "</strong>"
    }
  },
  renderMarkdown: (n, e) => `**${e.renderChildren(n)}**`,
  addCommands() {
    return {
      setBold: () => ({ commands: n }) => n.setMark(this.name),
      toggleBold: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetBold: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [
      Nt({
        find: Cg,
        type: this.type
      }),
      Nt({
        find: Eg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      ut({
        find: vg,
        type: this.type
      }),
      ut({
        find: Ag,
        type: this.type
      })
    ];
  }
}), Ng = (n) => {
  const e = /`([^`]+)`(?!`)$/.exec(n);
  return !e || e.index > 0 && n[e.index - 1] === "`" ? null : {
    index: e.index,
    text: e[0],
    replaceWith: e[1]
  };
}, Rg = (n) => {
  const e = /`([^`]+)`(?!`)/g, t = [];
  let r;
  for (; (r = e.exec(n)) !== null; )
    r.index > 0 && n[r.index - 1] === "`" || t.push({
      index: r.index,
      text: r[0],
      replaceWith: r[1]
    });
  return t;
}, Ig = Dt.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: !0,
  exitable: !0,
  parseHTML() {
    return [{ tag: "code" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["code", G(this.options.HTMLAttributes, n), 0];
  },
  markdownTokenName: "codespan",
  parseMarkdown: (n, e) => e.applyMark("code", [{ type: "text", text: n.text || "" }]),
  renderMarkdown: (n, e) => n.content ? `\`${e.renderChildren(n.content)}\`` : "",
  addCommands() {
    return {
      setCode: () => ({ commands: n }) => n.setMark(this.name),
      toggleCode: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetCode: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      Nt({
        find: Ng,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      ut({
        find: Rg,
        type: this.type
      })
    ];
  }
}), $s = 4, Dg = /^```([a-z]+)?[\s\n]$/, Lg = /^~~~([a-z]+)?[\s\n]$/, Pg = ye.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      exitOnArrowUp: !0,
      defaultLanguage: null,
      enableTabIndentation: !1,
      tabSize: $s,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (n) => {
          var e;
          const { languageClassPrefix: t } = this.options;
          if (!t)
            return null;
          const i = [...((e = n.firstElementChild) == null ? void 0 : e.classList) || []].filter((o) => o.startsWith(t)).map((o) => o.replace(t, ""))[0];
          return i || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "pre",
      G(this.options.HTMLAttributes, e),
      [
        "code",
        {
          class: n.attrs.language ? this.options.languageClassPrefix + n.attrs.language : null
        },
        0
      ]
    ];
  },
  markdownTokenName: "code",
  parseMarkdown: (n, e) => {
    var t, r;
    return ((t = n.raw) == null ? void 0 : t.startsWith("```")) === !1 && ((r = n.raw) == null ? void 0 : r.startsWith("~~~")) === !1 && n.codeBlockStyle !== "indented" ? [] : e.createNode(
      "codeBlock",
      { language: n.lang || null },
      n.text ? [e.createTextNode(n.text)] : []
    );
  },
  renderMarkdown: (n, e) => {
    var t;
    let r = "";
    const s = ((t = n.attrs) == null ? void 0 : t.language) || "";
    return n.content ? r = [`\`\`\`${s}`, e.renderChildren(n.content), "```"].join(`
`) : r = `\`\`\`${s}

\`\`\``, r;
  },
  addCommands() {
    return {
      setCodeBlock: (n) => ({ commands: e }) => e.setNode(this.name, n),
      toggleCodeBlock: (n) => ({ commands: e }) => e.toggleNode(this.name, "paragraph", n)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      // remove code block when at start of document or code block is empty
      Backspace: () => {
        const { empty: n, $anchor: e } = this.editor.state.selection, t = e.pos === 1;
        return !n || e.parent.type.name !== this.name ? !1 : t || !e.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      // handle tab indentation
      Tab: ({ editor: n }) => {
        var e;
        if (!this.options.enableTabIndentation)
          return !1;
        const t = (e = this.options.tabSize) != null ? e : $s, { state: r } = n, { selection: s } = r, { $from: i, empty: o } = s;
        if (i.parent.type !== this.type)
          return !1;
        const l = " ".repeat(t);
        return o ? n.commands.insertContent(l) : n.commands.command(({ tr: a }) => {
          const { from: c, to: u } = s, h = r.doc.textBetween(c, u, `
`, `
`).split(`
`).map((p) => l + p).join(`
`);
          return a.replaceWith(c, u, r.schema.text(h)), !0;
        });
      },
      // handle shift+tab reverse indentation
      "Shift-Tab": ({ editor: n }) => {
        var e;
        if (!this.options.enableTabIndentation)
          return !1;
        const t = (e = this.options.tabSize) != null ? e : $s, { state: r } = n, { selection: s } = r, { $from: i, empty: o } = s;
        return i.parent.type !== this.type ? !1 : o ? n.commands.command(({ tr: l }) => {
          var a;
          const { pos: c } = i, u = i.start(), d = i.end(), h = r.doc.textBetween(u, d, `
`, `
`).split(`
`);
          let p = 0, m = 0;
          const g = c - u;
          for (let E = 0; E < h.length; E += 1) {
            if (m + h[E].length >= g) {
              p = E;
              break;
            }
            m += h[E].length + 1;
          }
          const k = ((a = h[p].match(/^ */)) == null ? void 0 : a[0]) || "", S = Math.min(k.length, t);
          if (S === 0)
            return !0;
          let T = u;
          for (let E = 0; E < p; E += 1)
            T += h[E].length + 1;
          return l.delete(T, T + S), c - T <= S && l.setSelection(N.create(l.doc, T)), !0;
        }) : n.commands.command(({ tr: l }) => {
          const { from: a, to: c } = s, f = r.doc.textBetween(a, c, `
`, `
`).split(`
`).map((h) => {
            var p;
            const m = ((p = h.match(/^ */)) == null ? void 0 : p[0]) || "", g = Math.min(m.length, t);
            return h.slice(g);
          }).join(`
`);
          return l.replaceWith(a, c, r.schema.text(f)), !0;
        });
      },
      // exit node on triple enter
      Enter: ({ editor: n }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: e } = n, { selection: t } = e, { $from: r, empty: s } = t;
        if (!s || r.parent.type !== this.type)
          return !1;
        const i = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !i || !o ? !1 : n.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow up if there is no node before it
      ArrowUp: ({ editor: n }) => {
        if (!this.options.exitOnArrowUp)
          return !1;
        const { state: e } = n, { selection: t } = e, { $from: r, empty: s } = t;
        if (!s || r.parent.type !== this.type || r.parentOffset !== 0)
          return !1;
        const i = r.before();
        return i > 0 ? !1 : n.commands.insertDefaultBlock({ pos: i });
      },
      // exit node on arrow down
      ArrowDown: ({ editor: n }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = n, { selection: t, doc: r } = e, { $from: s, empty: i } = t;
        if (!i || s.parent.type !== this.type || !(s.parentOffset === s.parent.nodeSize - 2))
          return !1;
        const l = s.after();
        return l === void 0 ? !1 : r.nodeAt(l) ? n.commands.command(({ tr: c }) => (c.setSelection(I.near(r.resolve(l))), !0)) : n.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      mi({
        find: Dg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      mi({
        find: Lg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new H({
        key: new Q("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (n, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), s = r ? JSON.parse(r) : void 0, i = s == null ? void 0 : s.mode;
            if (!t || !i)
              return !1;
            const { tr: o, schema: l } = n.state, a = l.text(t.replace(/\r\n?/g, `
`));
            return o.replaceSelectionWith(this.type.create({ language: i }, a)), o.selection.$from.parent.type !== this.type && o.setSelection(
              N.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))
            ), o.setMeta("paste", !0), n.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), zg = ye.create({
  name: "doc",
  topNode: !0,
  content: "block+",
  renderMarkdown: (n, e) => n.content ? e.renderChildren(n.content, `

`) : ""
}), Bg = ye.create({
  name: "hardBreak",
  markdownTokenName: "br",
  addOptions() {
    return {
      keepMarks: !0,
      HTMLAttributes: {}
    };
  },
  inline: !0,
  group: "inline",
  selectable: !1,
  linebreakReplacement: !0,
  parseHTML() {
    return [{ tag: "br" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["br", G(this.options.HTMLAttributes, n)];
  },
  renderText() {
    return `
`;
  },
  renderMarkdown: () => `  
`,
  parseMarkdown: () => ({
    type: "hardBreak"
  }),
  addCommands() {
    return {
      setHardBreak: () => ({ commands: n, chain: e, state: t, editor: r }) => n.first([
        () => n.exitCode(),
        () => n.command(() => {
          const { selection: s, storedMarks: i } = t;
          if (s.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: l } = r.extensionManager, a = i || s.$to.parentOffset && s.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: u }) => {
            if (u && a && o) {
              const d = a.filter(
                (f) => l.includes(f.type.name)
              );
              c.ensureMarks(d);
            }
            return !0;
          }).scrollIntoView().run();
        })
      ])
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
}), $g = ye.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: !0,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: !1
      }
    };
  },
  parseHTML() {
    return this.options.levels.map((n) => ({
      tag: `h${n}`,
      attrs: { level: n }
    }));
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [`h${this.options.levels.includes(n.attrs.level) ? n.attrs.level : this.options.levels[0]}`, G(this.options.HTMLAttributes, e), 0];
  },
  parseMarkdown: (n, e) => e.createNode(
    "heading",
    { level: n.depth || 1 },
    e.parseInline(n.tokens || [])
  ),
  renderMarkdown: (n, e) => {
    var t;
    const r = (t = n.attrs) != null && t.level ? parseInt(n.attrs.level, 10) : 1, s = "#".repeat(r);
    return n.content ? `${s} ${e.renderChildren(n.content)}` : "";
  },
  addCommands() {
    return {
      setHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.setNode(this.name, n) : !1,
      toggleHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.toggleNode(this.name, "paragraph", n) : !1
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (n, e) => ({
        ...n,
        [`Mod-Alt-${e}`]: () => this.editor.commands.toggleHeading({ level: e })
      }),
      {}
    );
  },
  addInputRules() {
    return this.options.levels.map((n) => mi({
      find: new RegExp(`^(#{${Math.min(...this.options.levels)},${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
}), _g = ye.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {},
      nextNodeType: "paragraph"
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["hr", G(this.options.HTMLAttributes, n)];
  },
  markdownTokenName: "hr",
  parseMarkdown: (n, e) => e.createNode("horizontalRule"),
  renderMarkdown: () => "---",
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: n, state: e }) => {
        if (!Zm(e, e.schema.nodes[this.name]))
          return !1;
        const { selection: t } = e, { $to: r } = t, s = n();
        return Yc(t) ? s.insertContentAt(r.pos, {
          type: this.name
        }) : s.insertContent({ type: this.name }), s.command(({ state: i, tr: o, dispatch: l }) => {
          if (l) {
            const { $to: a } = o.selection, c = a.end();
            if (a.nodeAfter)
              a.nodeAfter.isTextblock ? o.setSelection(N.create(o.doc, a.pos + 1)) : a.nodeAfter.isBlock ? o.setSelection(O.create(o.doc, a.pos)) : o.setSelection(N.create(o.doc, a.pos));
            else {
              const u = i.schema.nodes[this.options.nextNodeType] || a.parent.type.contentMatch.defaultType, d = u == null ? void 0 : u.create();
              d && (o.insert(c, d), o.setSelection(N.create(o.doc, c + 1)));
            }
            o.scrollIntoView();
          }
          return !0;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      wg({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), Fg = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, Hg = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, Vg = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, jg = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, Wg = Dt.create({
  name: "italic",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "em"
      },
      {
        tag: "i",
        getAttrs: (n) => n.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=normal",
        clearMark: (n) => n.type.name === this.name
      },
      {
        style: "font-style=italic"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["em", G(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands: n }) => n.setMark(this.name),
      toggleItalic: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetItalic: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  markdownTokenName: "em",
  parseMarkdown: (n, e) => e.applyMark("italic", e.parseInline(n.tokens || [])),
  markdownOptions: {
    htmlReopen: {
      open: "<em>",
      close: "</em>"
    }
  },
  renderMarkdown: (n, e) => `*${e.renderChildren(n)}*`,
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [
      Nt({
        find: Fg,
        type: this.type
      }),
      Nt({
        find: Vg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      ut({
        find: Hg,
        type: this.type
      }),
      ut({
        find: jg,
        type: this.type
      })
    ];
  }
});
const qg = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", Ug = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", gi = "numeric", yi = "ascii", ki = "alpha", yn = "asciinumeric", un = "alphanumeric", bi = "domain", bu = "emoji", Kg = "scheme", Jg = "slashscheme", _s = "whitespace";
function Gg(n, e) {
  return n in e || (e[n] = []), e[n];
}
function xt(n, e, t) {
  e[gi] && (e[yn] = !0, e[un] = !0), e[yi] && (e[yn] = !0, e[ki] = !0), e[yn] && (e[un] = !0), e[ki] && (e[un] = !0), e[un] && (e[bi] = !0), e[bu] && (e[bi] = !0);
  for (const r in e) {
    const s = Gg(r, t);
    s.indexOf(n) < 0 && s.push(n);
  }
}
function Qg(n, e) {
  const t = {};
  for (const r in e)
    e[r].indexOf(n) >= 0 && (t[r] = !0);
  return t;
}
function fe(n = null) {
  this.j = {}, this.jr = [], this.jd = null, this.t = n;
}
fe.groups = {};
fe.prototype = {
  accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go(n) {
    const e = this, t = e.j[n];
    if (t)
      return t;
    for (let r = 0; r < e.jr.length; r++) {
      const s = e.jr[r][0], i = e.jr[r][1];
      if (i && s.test(n))
        return i;
    }
    return e.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has(n, e = !1) {
    return e ? n in this.j : !!this.go(n);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta(n, e, t, r) {
    for (let s = 0; s < n.length; s++)
      this.tt(n[s], e, t, r);
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr(n, e, t, r) {
    r = r || fe.groups;
    let s;
    return e && e.j ? s = e : (s = new fe(e), t && r && xt(e, t, r)), this.jr.push([n, s]), s;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts(n, e, t, r) {
    let s = this;
    const i = n.length;
    if (!i)
      return s;
    for (let o = 0; o < i - 1; o++)
      s = s.tt(n[o]);
    return s.tt(n[i - 1], e, t, r);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt(n, e, t, r) {
    r = r || fe.groups;
    const s = this;
    if (e && e.j)
      return s.j[n] = e, e;
    const i = e;
    let o, l = s.go(n);
    if (l ? (o = new fe(), Object.assign(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new fe(), i) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = Object.assign(Qg(o.t, r), t);
          xt(i, a, r);
        } else t && xt(i, t, r);
      o.t = i;
    }
    return s.j[n] = o, o;
  }
};
const D = (n, e, t, r, s) => n.ta(e, t, r, s), j = (n, e, t, r, s) => n.tr(e, t, r, s), Bl = (n, e, t, r, s) => n.ts(e, t, r, s), w = (n, e, t, r, s) => n.tt(e, t, r, s), Ve = "WORD", xi = "UWORD", xu = "ASCIINUMERICAL", wu = "ALPHANUMERICAL", Ln = "LOCALHOST", wi = "TLD", Si = "UTLD", cr = "SCHEME", Ft = "SLASH_SCHEME", io = "NUM", Ti = "WS", oo = "NL", kn = "OPENBRACE", bn = "CLOSEBRACE", Mr = "OPENBRACKET", Cr = "CLOSEBRACKET", vr = "OPENPAREN", Er = "CLOSEPAREN", Ar = "OPENANGLEBRACKET", Or = "CLOSEANGLEBRACKET", Nr = "FULLWIDTHLEFTPAREN", Rr = "FULLWIDTHRIGHTPAREN", Ir = "LEFTCORNERBRACKET", Dr = "RIGHTCORNERBRACKET", Lr = "LEFTWHITECORNERBRACKET", Pr = "RIGHTWHITECORNERBRACKET", zr = "FULLWIDTHLESSTHAN", Br = "FULLWIDTHGREATERTHAN", $r = "AMPERSAND", _r = "APOSTROPHE", Fr = "ASTERISK", Ye = "AT", Hr = "BACKSLASH", Vr = "BACKTICK", jr = "CARET", wt = "COLON", lo = "COMMA", Wr = "DOLLAR", De = "DOT", qr = "EQUALS", ao = "EXCLAMATION", be = "HYPHEN", xn = "PERCENT", Ur = "PIPE", Kr = "PLUS", Jr = "POUND", wn = "QUERY", co = "QUOTE", Su = "FULLWIDTHMIDDLEDOT", uo = "SEMI", Le = "SLASH", Sn = "TILDE", Gr = "UNDERSCORE", Tu = "EMOJI", Qr = "SYM";
var Mu = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ALPHANUMERICAL: wu,
  AMPERSAND: $r,
  APOSTROPHE: _r,
  ASCIINUMERICAL: xu,
  ASTERISK: Fr,
  AT: Ye,
  BACKSLASH: Hr,
  BACKTICK: Vr,
  CARET: jr,
  CLOSEANGLEBRACKET: Or,
  CLOSEBRACE: bn,
  CLOSEBRACKET: Cr,
  CLOSEPAREN: Er,
  COLON: wt,
  COMMA: lo,
  DOLLAR: Wr,
  DOT: De,
  EMOJI: Tu,
  EQUALS: qr,
  EXCLAMATION: ao,
  FULLWIDTHGREATERTHAN: Br,
  FULLWIDTHLEFTPAREN: Nr,
  FULLWIDTHLESSTHAN: zr,
  FULLWIDTHMIDDLEDOT: Su,
  FULLWIDTHRIGHTPAREN: Rr,
  HYPHEN: be,
  LEFTCORNERBRACKET: Ir,
  LEFTWHITECORNERBRACKET: Lr,
  LOCALHOST: Ln,
  NL: oo,
  NUM: io,
  OPENANGLEBRACKET: Ar,
  OPENBRACE: kn,
  OPENBRACKET: Mr,
  OPENPAREN: vr,
  PERCENT: xn,
  PIPE: Ur,
  PLUS: Kr,
  POUND: Jr,
  QUERY: wn,
  QUOTE: co,
  RIGHTCORNERBRACKET: Dr,
  RIGHTWHITECORNERBRACKET: Pr,
  SCHEME: cr,
  SEMI: uo,
  SLASH: Le,
  SLASH_SCHEME: Ft,
  SYM: Qr,
  TILDE: Sn,
  TLD: wi,
  UNDERSCORE: Gr,
  UTLD: Si,
  UWORD: xi,
  WORD: Ve,
  WS: Ti
});
const _e = /[a-z]/, tn = new RegExp("\\p{L}", "u"), Fs = new RegExp("\\p{Emoji}", "u"), Fe = /\d/, Hs = /\s/, $l = "\r", Vs = `
`, Xg = "️", Zg = "‍", js = "￼";
let Xn = null, Zn = null;
function Yg(n = []) {
  const e = {};
  fe.groups = e;
  const t = new fe();
  Xn == null && (Xn = _l(qg)), Zn == null && (Zn = _l(Ug)), w(t, "'", _r), w(t, "{", kn), w(t, "}", bn), w(t, "[", Mr), w(t, "]", Cr), w(t, "(", vr), w(t, ")", Er), w(t, "<", Ar), w(t, ">", Or), w(t, "（", Nr), w(t, "）", Rr), w(t, "「", Ir), w(t, "」", Dr), w(t, "『", Lr), w(t, "』", Pr), w(t, "＜", zr), w(t, "＞", Br), w(t, "&", $r), w(t, "*", Fr), w(t, "@", Ye), w(t, "`", Vr), w(t, "^", jr), w(t, ":", wt), w(t, ",", lo), w(t, "$", Wr), w(t, ".", De), w(t, "=", qr), w(t, "!", ao), w(t, "-", be), w(t, "%", xn), w(t, "|", Ur), w(t, "+", Kr), w(t, "#", Jr), w(t, "?", wn), w(t, '"', co), w(t, "/", Le), w(t, ";", uo), w(t, "~", Sn), w(t, "_", Gr), w(t, "\\", Hr), w(t, "・", Su);
  const r = j(t, Fe, io, {
    [gi]: !0
  });
  j(r, Fe, r);
  const s = j(r, _e, xu, {
    [yn]: !0
  }), i = j(r, tn, wu, {
    [un]: !0
  }), o = j(t, _e, Ve, {
    [yi]: !0
  });
  j(o, Fe, s), j(o, _e, o), j(s, Fe, s), j(s, _e, s);
  const l = j(t, tn, xi, {
    [ki]: !0
  });
  j(l, _e), j(l, Fe, i), j(l, tn, l), j(i, Fe, i), j(i, _e), j(i, tn, i);
  const a = w(t, Vs, oo, {
    [_s]: !0
  }), c = w(t, $l, Ti, {
    [_s]: !0
  }), u = j(t, Hs, Ti, {
    [_s]: !0
  });
  w(t, js, u), w(c, Vs, a), w(c, js, u), j(c, Hs, u), w(u, $l), w(u, Vs), j(u, Hs, u), w(u, js, u);
  const d = j(t, Fs, Tu, {
    [bu]: !0
  });
  w(d, "#"), j(d, Fs, d), w(d, Xg, d);
  const f = w(d, Zg);
  w(f, "#"), j(f, Fs, d);
  const h = [[_e, o], [Fe, s]], p = [[_e, null], [tn, l], [Fe, i]];
  for (let m = 0; m < Xn.length; m++)
    Qe(t, Xn[m], wi, Ve, h);
  for (let m = 0; m < Zn.length; m++)
    Qe(t, Zn[m], Si, xi, p);
  xt(wi, {
    tld: !0,
    ascii: !0
  }, e), xt(Si, {
    utld: !0,
    alpha: !0
  }, e), Qe(t, "file", cr, Ve, h), Qe(t, "mailto", cr, Ve, h), Qe(t, "http", Ft, Ve, h), Qe(t, "https", Ft, Ve, h), Qe(t, "ftp", Ft, Ve, h), Qe(t, "ftps", Ft, Ve, h), xt(cr, {
    scheme: !0,
    ascii: !0
  }, e), xt(Ft, {
    slashscheme: !0,
    ascii: !0
  }, e), n = n.sort((m, g) => m[0] > g[0] ? 1 : -1);
  for (let m = 0; m < n.length; m++) {
    const g = n[m][0], k = n[m][1] ? {
      [Kg]: !0
    } : {
      [Jg]: !0
    };
    g.indexOf("-") >= 0 ? k[bi] = !0 : _e.test(g) ? Fe.test(g) ? k[yn] = !0 : k[yi] = !0 : k[gi] = !0, Bl(t, g, g, k);
  }
  return Bl(t, "localhost", Ln, {
    ascii: !0
  }), t.jd = new fe(Qr), {
    start: t,
    tokens: Object.assign({
      groups: e
    }, Mu)
  };
}
function Cu(n, e) {
  const t = ey(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = t.length, s = [];
  let i = 0, o = 0;
  for (; o < r; ) {
    let l = n, a = null, c = 0, u = null, d = -1, f = -1;
    for (; o < r && (a = l.go(t[o])); )
      l = a, l.accepts() ? (d = 0, f = 0, u = l) : d >= 0 && (d += t[o].length, f++), c += t[o].length, i += t[o].length, o++;
    i -= d, o -= f, c -= d, s.push({
      t: u.t,
      // token type/name
      v: e.slice(i - c, i),
      // string value
      s: i - c,
      // start index
      e: i
      // end index (excluding)
    });
  }
  return s;
}
function ey(n) {
  const e = [], t = n.length;
  let r = 0;
  for (; r < t; ) {
    let s = n.charCodeAt(r), i, o = s < 55296 || s > 56319 || r + 1 === t || (i = n.charCodeAt(r + 1)) < 56320 || i > 57343 ? n[r] : n.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function Qe(n, e, t, r, s) {
  let i;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    n.j[a] ? i = n.j[a] : (i = new fe(r), i.jr = s.slice(), n.j[a] = i), n = i;
  }
  return i = new fe(t), i.jr = s.slice(), n.j[e[o - 1]] = i, i;
}
function _l(n) {
  const e = [], t = [];
  let r = 0, s = "0123456789";
  for (; r < n.length; ) {
    let i = 0;
    for (; s.indexOf(n[r + i]) >= 0; )
      i++;
    if (i > 0) {
      e.push(t.join(""));
      for (let o = parseInt(n.substring(r, r + i), 10); o > 0; o--)
        t.pop();
      r += i;
    } else
      t.push(n[r]), r++;
  }
  return e;
}
const Pn = {
  defaultProtocol: "http",
  events: null,
  format: Fl,
  formatHref: Fl,
  nl2br: !1,
  tagName: "a",
  target: null,
  rel: null,
  validate: !0,
  truncate: 1 / 0,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};
function ho(n, e = null) {
  let t = Object.assign({}, Pn);
  n && (t = Object.assign(t, n instanceof ho ? n.o : n));
  const r = t.ignoreTags, s = [];
  for (let i = 0; i < r.length; i++)
    s.push(r[i].toUpperCase());
  this.o = t, e && (this.defaultRender = e), this.ignoreTags = s;
}
ho.prototype = {
  o: Pn,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender(n) {
    return n;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check(n) {
    return this.get("validate", n.toString(), n);
  },
  // Private methods
  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get(n, e, t) {
    const r = e != null;
    let s = this.o[n];
    return s && (typeof s == "object" ? (s = t.t in s ? s[t.t] : Pn[n], typeof s == "function" && r && (s = s(e, t))) : typeof s == "function" && r && (s = s(e, t.t, t)), s);
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj(n, e, t) {
    let r = this.o[n];
    return typeof r == "function" && e != null && (r = r(e, t.t, t)), r;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render(n) {
    const e = n.render(this);
    return (this.get("render", null, n) || this.defaultRender)(e, n.t, n);
  }
};
function Fl(n) {
  return n;
}
function vu(n, e) {
  this.t = "token", this.v = n, this.tk = e;
}
vu.prototype = {
  isLink: !1,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
   */
  toHref(n) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString(n) {
    const e = this.toString(), t = n.get("truncate", e, this), r = n.get("format", e, this);
    return t && r.length > t ? r.substring(0, t) + "…" : r;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref(n) {
    return n.get("formatHref", this.toHref(n.get("defaultProtocol")), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject(n = Pn.defaultProtocol) {
    return {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(n),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject(n) {
    return {
      type: this.t,
      value: this.toFormattedString(n),
      isLink: this.isLink,
      href: this.toFormattedHref(n),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate(n) {
    return n.get("validate", this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render(n) {
    const e = this, t = this.toHref(n.get("defaultProtocol")), r = n.get("formatHref", t, this), s = n.get("tagName", t, e), i = this.toFormattedString(n), o = {}, l = n.get("className", t, e), a = n.get("target", t, e), c = n.get("rel", t, e), u = n.getObj("attributes", t, e), d = n.getObj("events", t, e);
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), u && Object.assign(o, u), {
      tagName: s,
      attributes: o,
      content: i,
      eventListeners: d
    };
  }
};
function ms(n, e) {
  class t extends vu {
    constructor(s, i) {
      super(s, i), this.t = n;
    }
  }
  for (const r in e)
    t.prototype[r] = e[r];
  return t.t = n, t;
}
const ty = ms("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), Hl = ms("text"), ny = ms("nl"), Yn = ms("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(n = Pn.defaultProtocol) {
    return this.hasProtocol() ? this.v : `${n}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const n = this.tk;
    return n.length >= 2 && n[0].t !== Ln && n[1].t === wt;
  }
}), ke = (n) => new fe(n);
function ry({
  groups: n
}) {
  const e = n.domain.concat([$r, Fr, Ye, Hr, Vr, jr, Wr, qr, be, io, xn, Ur, Kr, Jr, Le, Qr, Sn, Gr]), t = [_r, wt, lo, De, ao, xn, wn, co, uo, Ar, Or, kn, bn, Cr, Mr, vr, Er, Nr, Rr, Ir, Dr, Lr, Pr, zr, Br], r = [$r, _r, Fr, Hr, Vr, jr, Wr, qr, be, kn, bn, xn, Ur, Kr, Jr, wn, Le, Qr, Sn, Gr], s = ke(), i = w(s, Sn);
  D(i, r, i), D(i, n.domain, i);
  const o = ke(), l = ke(), a = ke();
  D(s, n.domain, o), D(s, n.scheme, l), D(s, n.slashscheme, a), D(o, r, i), D(o, n.domain, o);
  const c = w(o, Ye);
  w(i, Ye, c), w(l, Ye, c), w(a, Ye, c);
  const u = w(i, De);
  D(u, r, i), D(u, n.domain, i);
  const d = ke();
  D(c, n.domain, d), D(d, n.domain, d);
  const f = w(d, De);
  D(f, n.domain, d);
  const h = ke(ty);
  D(f, n.tld, h), D(f, n.utld, h), w(c, Ln, h);
  const p = w(d, be);
  w(p, be, p), D(p, n.domain, d), D(h, n.domain, d), w(h, De, f), w(h, be, p);
  const m = w(o, be), g = w(o, De);
  w(m, be, m), D(m, n.domain, o), D(g, r, i), D(g, n.domain, o);
  const y = ke(Yn);
  D(g, n.tld, y), D(g, n.utld, y), D(y, n.domain, o), D(y, r, i), w(y, De, g), w(y, be, m), w(y, Ye, c);
  const k = w(y, wt), S = ke(Yn);
  D(k, n.numeric, S);
  const T = ke(Yn), x = ke();
  D(T, e, T), D(T, t, x), D(x, e, T), D(x, t, x), w(y, Le, T), w(S, Le, T);
  const E = w(l, wt), M = w(a, wt), A = w(M, Le), R = w(A, Le);
  D(l, n.domain, o), w(l, De, g), w(l, be, m), D(a, n.domain, o), w(a, De, g), w(a, be, m), D(E, n.domain, T), w(E, Le, T), w(E, wn, T), D(R, n.domain, T), D(R, e, T), w(R, Le, T);
  const X = [
    [kn, bn],
    // {}
    [Mr, Cr],
    // []
    [vr, Er],
    // ()
    [Ar, Or],
    // <>
    [Nr, Rr],
    // （）
    [Ir, Dr],
    // 「」
    [Lr, Pr],
    // 『』
    [zr, Br]
    // ＜＞
  ];
  for (let Be = 0; Be < X.length; Be++) {
    const [Re, ie] = X[Be], Z = w(T, Re);
    w(x, Re, Z);
    const q = ke(Yn);
    D(Z, e, q);
    const Pt = ke();
    D(Z, t, Pt), w(Z, ie, T), D(q, e, q), D(q, t, Pt), D(Pt, e, q), D(Pt, t, Pt), w(q, ie, T), w(Pt, ie, T);
  }
  return w(s, Ln, y), w(s, oo, ny), {
    start: s,
    tokens: Mu
  };
}
function sy(n, e, t) {
  let r = t.length, s = 0, i = [], o = [];
  for (; s < r; ) {
    let l = n, a = null, c = null, u = 0, d = null, f = -1;
    for (; s < r && !(a = l.go(t[s].t)); )
      o.push(t[s++]);
    for (; s < r && (c = a || l.go(t[s].t)); )
      a = null, l = c, l.accepts() ? (f = 0, d = l) : f >= 0 && f++, s++, u++;
    if (f < 0)
      s -= u, s < r && (o.push(t[s]), s++);
    else {
      o.length > 0 && (i.push(Ws(Hl, e, o)), o = []), s -= f, u -= f;
      const h = d.t, p = t.slice(s - u, s);
      i.push(Ws(h, e, p));
    }
  }
  return o.length > 0 && i.push(Ws(Hl, e, o)), i;
}
function Ws(n, e, t) {
  const r = t[0].s, s = t[t.length - 1].e, i = e.slice(r, s);
  return new n(i, t);
}
const iy = typeof console < "u" && console && console.warn || (() => {
}), oy = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", F = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function ly() {
  return fe.groups = {}, F.scanner = null, F.parser = null, F.tokenQueue = [], F.pluginQueue = [], F.customSchemes = [], F.initialized = !1, F;
}
function Vl(n, e = !1) {
  if (F.initialized && iy(`linkifyjs: already initialized - will not register custom scheme "${n}" ${oy}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(n))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  F.customSchemes.push([n, e]);
}
function ay() {
  F.scanner = Yg(F.customSchemes);
  for (let n = 0; n < F.tokenQueue.length; n++)
    F.tokenQueue[n][1]({
      scanner: F.scanner
    });
  F.parser = ry(F.scanner.tokens);
  for (let n = 0; n < F.pluginQueue.length; n++)
    F.pluginQueue[n][1]({
      scanner: F.scanner,
      parser: F.parser
    });
  return F.initialized = !0, F;
}
function fo(n) {
  return F.initialized || ay(), sy(F.parser.start, n, Cu(F.scanner.start, n));
}
fo.scan = Cu;
function Eu(n, e = null, t = null) {
  if (e && typeof e == "object") {
    if (t)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    t = e, e = null;
  }
  const r = new ho(t), s = fo(n), i = [];
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    l.isLink && (!e || l.t === e) && r.check(l) && i.push(l.toFormattedObject(r));
  }
  return i;
}
var po = "[\0-   ᠎ -\u2029 　]", cy = new RegExp(po), uy = new RegExp(`${po}$`), dy = new RegExp(po, "g");
function hy(n) {
  return n.length === 1 ? n[0].isLink : n.length === 3 && n[1].isLink ? ["()", "[]"].includes(n[0].value + n[2].value) : !1;
}
function fy(n) {
  return new H({
    key: new Q("autolink"),
    appendTransaction: (e, t, r) => {
      const s = e.some((c) => c.docChanged) && !t.doc.eq(r.doc), i = e.some(
        (c) => c.getMeta("preventAutolink")
      );
      if (!s || i)
        return;
      const { tr: o } = r, l = qc(t.doc, [...e]);
      if (Yi(l).forEach(({ newRange: c }) => {
        const u = dm(
          r.doc,
          c,
          (h) => h.isTextblock
        );
        let d, f;
        if (u.length > 1)
          d = u[0], f = r.doc.textBetween(
            d.pos,
            d.pos + d.node.nodeSize,
            void 0,
            " "
          );
        else if (u.length) {
          const h = r.doc.textBetween(c.from, c.to, " ", " ");
          if (!uy.test(h))
            return;
          d = u[0], f = r.doc.textBetween(
            d.pos,
            c.to,
            void 0,
            " "
          );
        }
        if (d && f) {
          const h = f.split(cy).filter(Boolean);
          if (h.length <= 0)
            return !1;
          const p = h[h.length - 1], m = d.pos + f.lastIndexOf(p);
          if (!p)
            return !1;
          const g = fo(p).map(
            (y) => y.toObject(n.defaultProtocol)
          );
          if (!hy(g))
            return !1;
          g.filter((y) => y.isLink).map((y) => ({
            ...y,
            from: m + y.start + 1,
            to: m + y.end + 1
          })).filter((y) => r.schema.marks.code ? !r.doc.rangeHasMark(y.from, y.to, r.schema.marks.code) : !0).filter((y) => n.validate(y.value)).filter((y) => n.shouldAutoLink(y.value)).forEach((y) => {
            eo(y.from, y.to, r.doc).some(
              (k) => k.mark.type === n.type
            ) || o.addMark(
              y.from,
              y.to,
              n.type.create({
                href: y.href
              })
            );
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function py(n) {
  return new H({
    key: new Q("handleClickLink"),
    props: {
      handleClick: (e, t, r) => {
        var s, i;
        if (r.button !== 0 || !e.editable)
          return !1;
        let o = null;
        if (r.target instanceof HTMLAnchorElement)
          o = r.target;
        else {
          const a = r.target;
          if (!a)
            return !1;
          const c = n.editor.view.dom;
          o = a.closest("a"), o && !c.contains(o) && (o = null);
        }
        if (!o)
          return !1;
        let l = !1;
        if (n.enableClickSelection && (l = n.editor.commands.extendMarkRange(n.type.name)), n.openOnClick) {
          const a = Zc(e.state, n.type.name), c = (s = o.href) != null ? s : a.href, u = (i = o.target) != null ? i : a.target;
          c && (window.open(c, u), l = !0);
        }
        return l;
      }
    }
  });
}
var my = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/, gy = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;
function Au(n, e) {
  let t = 0;
  for (let r = e - 1; r >= 0 && n[r] === "\\"; r -= 1)
    t += 1;
  return t % 2 === 1;
}
function yy(n, e) {
  let t = 0, r = 0;
  for (; r < e; ) {
    if (n[r] !== "`") {
      r += 1;
      continue;
    }
    if (t === 0 && Au(n, r)) {
      r += 1;
      continue;
    }
    let s = 0;
    for (; r < e && n[r] === "`"; )
      s += 1, r += 1;
    t === 0 ? t = s : s === t && (t = 0);
  }
  return t > 0;
}
function Ou(n, e, t) {
  var r, s;
  const [, i, o] = e;
  return (e.index ? n[e.index - 1] : void 0) === "!" || Au(n, (r = e.index) != null ? r : 0) || yy(n, (s = e.index) != null ? s : 0) ? !1 : !!i.trim() && t(o);
}
function Nu(n) {
  var e, t;
  const [r, s, i, , o, l, a] = n, c = (e = o ?? l) != null ? e : a;
  return {
    index: (t = n.index) != null ? t : 0,
    text: r,
    replaceWith: s,
    data: {
      href: i,
      // an empty title ("") counts as no title, as in CommonMark
      title: c || null,
      markdown: !0
    }
  };
}
function ky(n, e) {
  return n.index < e.index + e.text.length && e.index < n.index + n.text.length;
}
function Ru(n) {
  var e, t, r;
  return {
    href: (e = n.data) == null ? void 0 : e.href,
    title: (r = (t = n.data) == null ? void 0 : t.title) != null ? r : null
  };
}
function by(n) {
  const e = Nt({
    find: (t) => {
      const r = my.exec(t);
      return !r || !Ou(t, r, n.isAllowedHref) ? null : Nu(r);
    },
    type: n.type,
    getAttributes: Ru
  });
  return new Vn({
    find: e.find,
    handler: (t) => {
      const r = e.handler(t);
      return r !== null && t.state.tr.steps.length && t.state.tr.setMeta("preventAutolink", !0), r;
    }
  });
}
function xy(n) {
  const e = ut({
    find: (t) => {
      var r, s;
      const i = [];
      for (const l of t.matchAll(gy))
        Ou(t, l, n.isAllowedHref) && i.push(Nu(l));
      const o = ((s = (r = n.findPlainUrls) == null ? void 0 : r.call(n, t)) != null ? s : []).filter(
        (l) => !i.some((a) => ky(a, l))
      );
      return [...i, ...o];
    },
    type: n.type,
    getAttributes: Ru
  });
  return new iu({
    find: e.find,
    handler: (t) => {
      var r;
      const s = e.handler(t);
      return s !== null && t.state.tr.steps.length && ((r = t.match.data) != null && r.markdown) && t.state.tr.setMeta("preventAutolink", !0), s;
    }
  });
}
function wy(n) {
  return new H({
    key: new Q("handlePasteLink"),
    props: {
      handlePaste: (e, t, r) => {
        const { shouldAutoLink: s } = n, { state: i } = e, { selection: o } = i, { empty: l } = o;
        if (l)
          return !1;
        let a = "";
        r.content.forEach((u) => {
          a += u.textContent;
        });
        const c = Eu(a, { defaultProtocol: n.defaultProtocol }).find(
          (u) => u.isLink && u.value === a
        );
        return !a || !c || s !== void 0 && !s(c.value) ? !1 : n.editor.commands.setMark(n.type, {
          href: c.href
        });
      }
    }
  });
}
function He(n, e) {
  const t = [
    "http",
    "https",
    "ftp",
    "ftps",
    "mailto",
    "tel",
    "callto",
    "sms",
    "cid",
    "xmpp"
  ];
  return e && e.forEach((r) => {
    const s = typeof r == "string" ? r : r.scheme;
    s && t.push(s);
  }), !n || n.replace(dy, "").match(
    new RegExp(
      `^(?:(?:${t.map((r) => r.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`,
      "i"
    )
  );
}
var Sy = Dt.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  exitable: !0,
  onCreate() {
    this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn(
      "The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead."
    )), this.options.protocols.forEach((n) => {
      if (typeof n == "string") {
        Vl(n);
        return;
      }
      Vl(n.scheme, n.optionalSlashes);
    });
  },
  onDestroy() {
    ly();
  },
  inclusive() {
    return this.options.autolink;
  },
  addOptions() {
    return {
      openOnClick: !0,
      enableClickSelection: !1,
      linkOnPaste: !0,
      markdownLinks: !1,
      // TODO (major) - default to true on next major version
      autolink: !0,
      protocols: [],
      defaultProtocol: "http",
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        class: null
      },
      isAllowedUri: (n, e) => !!He(n, e.protocols),
      validate: (n) => !!n,
      shouldAutoLink: (n) => {
        const e = /^[a-z][a-z0-9+.-]*:\/\//i.test(n), t = /^[a-z][a-z0-9+.-]*:/i.test(n);
        if (e || t && !n.includes("@"))
          return !0;
        const s = (n.includes("@") ? n.split("@").pop() : n).split(/[/?#:]/)[0];
        return !(/^\d{1,3}(\.\d{1,3}){3}$/.test(s) || !/\./.test(s));
      }
    };
  },
  addAttributes() {
    var n, e, t;
    return {
      href: {
        default: null,
        parseHTML(r) {
          return r.getAttribute("href");
        }
      },
      target: {
        // Coerce `undefined` to `null` because `undefined` is an invalid attribute value
        default: (n = this.options.HTMLAttributes.target) != null ? n : null
      },
      rel: {
        // Coerce `undefined` to `null` because `undefined` is an invalid attribute value
        default: (e = this.options.HTMLAttributes.rel) != null ? e : null
      },
      class: {
        // Coerce `undefined` to `null` because `undefined` is an invalid attribute value
        default: (t = this.options.HTMLAttributes.class) != null ? t : null
      },
      title: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "a[href]",
        getAttrs: (n) => {
          const e = n.getAttribute("href");
          return !e || !this.options.isAllowedUri(e, {
            defaultValidate: (t) => !!He(t, this.options.protocols),
            protocols: this.options.protocols,
            defaultProtocol: this.options.defaultProtocol
          }) ? !1 : null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return this.options.isAllowedUri(n.href, {
      defaultValidate: (e) => !!He(e, this.options.protocols),
      protocols: this.options.protocols,
      defaultProtocol: this.options.defaultProtocol
    }) ? ["a", G(this.options.HTMLAttributes, n), 0] : ["a", G(this.options.HTMLAttributes, { ...n, href: "" }), 0];
  },
  markdownTokenName: "link",
  parseMarkdown: (n, e) => e.applyMark("link", e.parseInline(n.tokens || []), {
    href: n.href,
    title: n.title || null
  }),
  renderMarkdown: (n, e) => {
    var t, r, s, i;
    const o = (r = (t = n.attrs) == null ? void 0 : t.href) != null ? r : "", l = (i = (s = n.attrs) == null ? void 0 : s.title) != null ? i : "", a = e.renderChildren(n);
    return l ? `[${a}](${o} "${l}")` : `[${a}](${o})`;
  },
  addCommands() {
    return {
      setLink: (n) => ({ chain: e }) => {
        const { href: t } = n;
        return this.options.isAllowedUri(t, {
          defaultValidate: (r) => !!He(r, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        }) ? e().setMark(this.name, n).setMeta("preventAutolink", !0).run() : !1;
      },
      toggleLink: (n) => ({ chain: e }) => {
        const { href: t } = n || {};
        return t && !this.options.isAllowedUri(t, {
          defaultValidate: (r) => !!He(r, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        }) ? !1 : e().toggleMark(this.name, n, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run();
      },
      unsetLink: () => ({ chain: n }) => n().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
    };
  },
  addInputRules() {
    return this.options.markdownLinks ? [
      by({
        type: this.type,
        isAllowedHref: (n) => this.options.isAllowedUri(n, {
          defaultValidate: (e) => !!He(e, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        })
      })
    ] : [];
  },
  addPasteRules() {
    const n = (e) => {
      const t = [];
      if (e) {
        const { protocols: r, defaultProtocol: s } = this.options;
        Eu(e).filter(
          (o) => o.isLink && this.options.isAllowedUri(o.value, {
            defaultValidate: (l) => !!He(l, r),
            protocols: r,
            defaultProtocol: s
          })
        ).forEach((o) => {
          this.options.shouldAutoLink(o.value) && t.push({
            text: o.value,
            data: {
              href: o.href
            },
            index: o.start
          });
        });
      }
      return t;
    };
    return this.options.markdownLinks ? [
      xy({
        type: this.type,
        isAllowedHref: (e) => this.options.isAllowedUri(e, {
          defaultValidate: (t) => !!He(t, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        }),
        findPlainUrls: n
      })
    ] : [
      ut({
        find: n,
        type: this.type,
        getAttributes: (e) => {
          var t;
          return {
            href: (t = e.data) == null ? void 0 : t.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const n = [], { protocols: e, defaultProtocol: t } = this.options;
    return this.options.autolink && n.push(
      fy({
        type: this.type,
        defaultProtocol: this.options.defaultProtocol,
        validate: (r) => this.options.isAllowedUri(r, {
          defaultValidate: (s) => !!He(s, e),
          protocols: e,
          defaultProtocol: t
        }),
        shouldAutoLink: this.options.shouldAutoLink
      })
    ), n.push(
      py({
        type: this.type,
        editor: this.editor,
        openOnClick: this.options.openOnClick === "whenNotEditable" ? !0 : this.options.openOnClick,
        enableClickSelection: this.options.enableClickSelection
      })
    ), this.options.linkOnPaste && n.push(
      wy({
        editor: this.editor,
        defaultProtocol: this.options.defaultProtocol,
        type: this.type,
        shouldAutoLink: this.options.shouldAutoLink
      })
    ), n;
  }
}), Ty = Object.defineProperty, My = (n, e) => {
  for (var t in e)
    Ty(n, t, { get: e[t], enumerable: !0 });
}, Cy = "listItem", jl = "textStyle", Wl = /^\s*([-+*])\s$/, Iu = ye.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [{ tag: "ul" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["ul", G(this.options.HTMLAttributes, n), 0];
  },
  markdownTokenName: "list",
  parseMarkdown: (n, e) => n.type !== "list" || n.ordered ? [] : {
    type: "bulletList",
    content: n.items ? e.parseChildren(n.items) : []
  },
  renderMarkdown: (n, e) => n.content ? e.renderChildren(n.content, `
`) : "",
  markdownOptions: {
    indentsContent: !0
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Cy, this.editor.getAttributes(jl)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let n = Qt({
      find: Wl,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (n = Qt({
      find: Wl,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(jl),
      editor: this.editor
    })), [n];
  }
}), vy = (n, e, t) => {
  const { selection: r } = n;
  if (!r.empty)
    return null;
  const { $from: s } = r;
  if (!s.parent.isTextblock || s.parentOffset !== s.parent.content.size)
    return null;
  let i = -1;
  for (let h = s.depth; h > 0; h -= 1)
    if (s.node(h).type.name === e) {
      i = h;
      break;
    }
  if (i < 0)
    return null;
  const o = s.node(i), l = s.index(i);
  if (l + 1 >= o.childCount)
    return null;
  const a = o.child(l + 1);
  if (!t.includes(a.type.name))
    return null;
  const c = n.schema.nodes[e];
  let u = !1;
  if (a.forEach((h) => {
    h.type === c && h.childCount > 1 && (u = !0);
  }), !u)
    return null;
  const d = n.doc.resolve(s.after()).nodeAfter;
  if (!d || !t.includes(d.type.name))
    return null;
  const f = [];
  return d.forEach((h) => {
    f.push(h);
  }), f.length === 0 ? null : {
    listItemDepth: i,
    nestedList: d,
    nestedListPos: s.after(),
    insertPos: s.after(i),
    items: f
  };
}, Ey = (n, e, t, r) => {
  const s = vy(n, t, r);
  if (!s)
    return !1;
  const { selection: i } = n, { nestedList: o, nestedListPos: l, insertPos: a, items: c } = s, u = n.tr;
  u.delete(l, l + o.nodeSize);
  const d = u.mapping.map(a);
  return u.insert(d, b.from(c)), u.setSelection(i.map(u.doc, u.mapping)), e && e(u), !0;
}, Ay = (n, e, t) => Ey(n.state, n.view.dispatch, e, t), Du = (n, e) => V.create({
  name: `${n}BranchingDeleteKeymap`,
  priority: 101,
  addKeyboardShortcuts() {
    const t = () => Ay(this.editor, n, e);
    return {
      Delete: t,
      "Mod-Delete": t
    };
  }
}), Lu = [
  [1e3, "m"],
  [900, "cm"],
  [500, "d"],
  [400, "cd"],
  [100, "c"],
  [90, "xc"],
  [50, "l"],
  [40, "xl"],
  [10, "x"],
  [9, "ix"],
  [5, "v"],
  [4, "iv"],
  [1, "i"]
], er = "abcdefghijklmnopqrstuvwxyz", Oy = "[a-zA-Z]{1,2}", Pu = String.raw`\d+|[ivxlcdmIVXLCDM]+|${Oy}`;
function gs(n) {
  let e = n, t = "";
  for (const [r, s] of Lu)
    for (; e >= r; )
      t += s, e -= r;
  return t;
}
function mo(n) {
  return gs(n).toUpperCase();
}
function zu(n) {
  const e = n.toLowerCase();
  let t = 0, r = 0;
  for (; t < e.length; ) {
    let s = !1;
    for (const [i, o] of Lu)
      if (e.startsWith(o, t)) {
        r += i, t += o.length, s = !0;
        break;
      }
    if (!s)
      return 0;
  }
  return r;
}
function Ny(n) {
  if (!/^[ivxlcdmIVXLCDM]+$/.test(n))
    return !1;
  const e = zu(n);
  return e <= 0 ? !1 : (n === n.toLowerCase() ? gs(e) : mo(e)) === n;
}
function Ry(n) {
  const e = n.toLowerCase();
  if (e.length === 1)
    return e.charCodeAt(0) - 97 + 1;
  if (e.length === 2) {
    const t = e.charCodeAt(0) - 97, r = e.charCodeAt(1) - 97;
    return (t + 1) * 26 + r + 1;
  }
  return 0;
}
function Xr(n) {
  if (n <= 26)
    return er[n - 1];
  const e = Math.floor((n - 1) / 26) - 1, t = (n - 1) % 26;
  return e < 0 ? er[t] : er[e] + er[t];
}
function ys(n) {
  if (!(!n || /^\d+$/.test(n))) {
    if (Ny(n))
      return n === n.toLowerCase() ? "i" : "I";
    if (/^[a-z]{1,2}$/.test(n))
      return "a";
    if (/^[A-Z]{1,2}$/.test(n))
      return "A";
  }
}
function go(n) {
  if (/^\d+$/.test(n))
    return parseInt(n, 10);
  const e = ys(n);
  if (e === "i" || e === "I")
    return zu(n);
  if (e === "a" || e === "A") {
    const r = Ry(n);
    return r > 0 ? r : 1;
  }
  const t = parseInt(n, 10);
  return Number.isNaN(t) ? 1 : t;
}
function Iy(n, e) {
  if (n === "numeric")
    return String(e);
  switch (n) {
    case "a":
      return Xr(e);
    case "A":
      return Xr(e).toUpperCase();
    case "i":
      return gs(e);
    case "I":
      return mo(e);
    default:
      return String(e);
  }
}
function Dy(n) {
  var e;
  if (n.length === 0)
    return !1;
  const t = (e = ys(n[0])) != null ? e : "numeric", r = go(n[0]);
  if (r < 1)
    return !1;
  for (let s = 0; s < n.length; s++) {
    const i = Iy(t, r + s);
    if (n[s] !== i)
      return !1;
  }
  return !0;
}
function Ly(n) {
  return {
    type: ys(n),
    start: go(n)
  };
}
function Py(n) {
  const { type: e, start: t } = Ly(n), r = {};
  return e && (r.type = e), t !== 1 && (r.start = t), r;
}
function zy(n, e, t = ". ") {
  const r = e + 1;
  if (!n || n === "1")
    return `${r}${t}`;
  switch (n) {
    case "a":
      return `${Xr(r)}${t}`;
    case "A":
      return `${Xr(r).toUpperCase()}${t}`;
    case "i":
      return `${gs(r)}${t}`;
    case "I":
      return `${mo(r)}${t}`;
    default:
      return `${r}${t}`;
  }
}
function By(n) {
  var e, t;
  const r = (e = n.tokens) == null ? void 0 : e[0];
  return !!(n.text && ((t = n.tokens) == null ? void 0 : t.length) === 1 && (r == null ? void 0 : r.type) === "list" && r.ordered && r.raw === n.text);
}
function $y(n, e) {
  return e.tokenizeInline ? e.parseInline(e.tokenizeInline(n)) : e.parseInline([
    {
      type: "text",
      raw: n,
      text: n
    }
  ]);
}
var Bu = ye.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", G(this.options.HTMLAttributes, n), 0];
  },
  markdownTokenName: "list_item",
  parseMarkdown: (n, e) => {
    var t;
    if (n.type !== "list_item")
      return [];
    const r = (t = e.parseBlockChildren) != null ? t : e.parseChildren;
    let s = [];
    if (n.tokens && n.tokens.length > 0) {
      if (By(n))
        return {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: $y(n.text || "", e)
            }
          ]
        };
      if (n.tokens.some((o) => o.type === "paragraph"))
        s = r(n.tokens);
      else {
        const o = n.tokens[0];
        if (o && o.type === "text" && o.tokens && o.tokens.length > 0) {
          if (s = [
            {
              type: "paragraph",
              content: e.parseInline(o.tokens)
            }
          ], n.tokens.length > 1) {
            const a = n.tokens.slice(1), c = r(a);
            s.push(...c);
          }
        } else
          s = r(n.tokens);
      }
    }
    return s.length === 0 && (s = [
      {
        type: "paragraph",
        content: []
      }
    ]), {
      type: "listItem",
      content: s
    };
  },
  renderMarkdown: (n, e, t) => ro(
    n,
    e,
    (r) => {
      var s, i, o, l;
      if (r.parentType === "bulletList")
        return "- ";
      if (r.parentType === "orderedList") {
        const a = ((i = (s = r.meta) == null ? void 0 : s.parentAttrs) == null ? void 0 : i.start) || 1, c = (l = (o = r.meta) == null ? void 0 : o.parentAttrs) == null ? void 0 : l.type, u = a - 1 + (r.index || 0);
        return zy(c, u, ". ");
      }
      return "- ";
    },
    t
  ),
  addExtensions() {
    return [
      Du(this.name, [
        this.options.bulletListTypeName,
        this.options.orderedListTypeName
      ])
    ];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), _y = {};
My(_y, {
  findListItemPos: () => ks,
  getNextListDepth: () => yo,
  handleBackspace: () => Mi,
  handleDelete: () => Ci,
  hasListBefore: () => $u,
  hasListItemAfter: () => Fy,
  hasListItemBefore: () => Hy,
  listItemHasSubList: () => Vy,
  nextListIsDeeper: () => _u,
  nextListIsHigher: () => Fu
});
var ks = (n, e) => {
  const { $from: t } = e.selection, r = J(n, e.schema);
  let s = null, i = t.depth, o = t.pos, l = null;
  for (; i > 0 && l === null; )
    s = t.node(i), s.type === r ? l = i : (i -= 1, o -= 1);
  return l === null ? null : { $pos: e.doc.resolve(o), depth: l };
}, yo = (n, e) => {
  const t = ks(n, e);
  if (!t)
    return !1;
  const [, r] = Sm(e, n, t.$pos.pos + 4);
  return r;
}, $u = (n, e, t) => {
  const { $anchor: r } = n.selection, s = Math.max(0, r.pos - 2), i = n.doc.resolve(s).node();
  return !(!i || !t.includes(i.type.name));
}, Mi = (n, e, t) => {
  if (n.commands.undoInputRule())
    return !0;
  if (n.state.selection.from !== n.state.selection.to)
    return !1;
  if (!ct(n.state, e) && $u(n.state, e, t)) {
    const { $anchor: r } = n.state.selection, s = n.state.doc.resolve(r.before() - 1), i = [];
    s.node().descendants((a, c) => {
      a.type.name === e && i.push({ node: a, pos: c });
    });
    const o = i.at(-1);
    if (!o)
      return !1;
    const l = n.state.doc.resolve(s.start() + o.pos + 1);
    return n.chain().cut({ from: r.start() - 1, to: r.end() + 1 }, l.end()).joinForward().run();
  }
  return !ct(n.state, e) || !vm(n.state) ? !1 : n.chain().liftListItem(e).run();
}, _u = (n, e) => {
  const t = yo(n, e), r = ks(n, e);
  return !r || !t ? !1 : t > r.depth;
}, Fu = (n, e) => {
  const t = yo(n, e), r = ks(n, e);
  return !r || !t ? !1 : t < r.depth;
}, Ci = (n, e) => {
  if (!ct(n.state, e) || !Cm(n.state, e))
    return !1;
  const { selection: t } = n.state, { $from: r, $to: s } = t;
  return !t.empty && r.sameParent(s) ? !1 : _u(e, n.state) ? n.chain().focus(n.state.selection.from + 4).lift(e).joinBackward().run() : Fu(e, n.state) ? n.chain().joinForward().joinBackward().run() : n.commands.joinItemForward();
}, Fy = (n, e) => {
  var t;
  const { $anchor: r } = e.selection, s = e.doc.resolve(r.pos - r.parentOffset - 2);
  return !(s.index() === s.parent.childCount - 1 || ((t = s.nodeAfter) == null ? void 0 : t.type.name) !== n);
}, Hy = (n, e) => {
  var t;
  const { $anchor: r } = e.selection, s = e.doc.resolve(r.pos - 2);
  return !(s.index() === 0 || ((t = s.nodeBefore) == null ? void 0 : t.type.name) !== n);
}, Vy = (n, e, t) => {
  if (!t)
    return !1;
  const r = J(n, e.schema);
  let s = !1;
  return t.descendants((i) => {
    i.type === r && (s = !0);
  }), s;
}, Hu = V.create({
  name: "listKeymap",
  addOptions() {
    return {
      listTypes: [
        {
          itemName: "listItem",
          wrapperNames: ["bulletList", "orderedList"]
        },
        {
          itemName: "taskItem",
          wrapperNames: ["taskList"]
        }
      ]
    };
  },
  addKeyboardShortcuts() {
    return {
      Delete: ({ editor: n }) => {
        let e = !1;
        return this.options.listTypes.forEach(({ itemName: t }) => {
          n.state.schema.nodes[t] !== void 0 && Ci(n, t) && (e = !0);
        }), e;
      },
      "Mod-Delete": ({ editor: n }) => {
        let e = !1;
        return this.options.listTypes.forEach(({ itemName: t }) => {
          n.state.schema.nodes[t] !== void 0 && Ci(n, t) && (e = !0);
        }), e;
      },
      Backspace: ({ editor: n }) => {
        let e = !1;
        return this.options.listTypes.forEach(({ itemName: t, wrapperNames: r }) => {
          n.state.schema.nodes[t] !== void 0 && Mi(n, t, r) && (e = !0);
        }), e;
      },
      "Mod-Backspace": ({ editor: n }) => {
        let e = !1;
        return this.options.listTypes.forEach(({ itemName: t, wrapperNames: r }) => {
          n.state.schema.nodes[t] !== void 0 && Mi(n, t, r) && (e = !0);
        }), e;
      }
    };
  }
}), vi = new RegExp(
  `^(\\s*)(${Pu})([.)])\\s+(.*)$`
), jy = /^\s/, dn = {
  heading: /^#{1,6}(?:\s|$)/,
  bulletItem: /^[-+*]\s+/,
  codeFence: /^(?:```|~~~)/,
  thematicBreak: /^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/
};
function Wy(n) {
  return vi.test(n.trimStart());
}
function qy(n) {
  const e = n.trimStart();
  return dn.bulletItem.test(e) || Wy(e) || dn.heading.test(e) || // dash breaks are excluded: "---" directly below paragraph text is a
  // setext heading underline, not a thematic break
  dn.thematicBreak.test(e) && !e.startsWith("-") || // oxlint-disable-next-line prefer-string-starts-ends-with
  /^>\s?/.test(e) || dn.codeFence.test(e);
}
function Uy(n) {
  return Object.values(dn).some((e) => e.test(n));
}
function Ky(n) {
  const e = [], t = [];
  let r = !1;
  return n.forEach((s) => {
    if (r) {
      t.push(s);
      return;
    }
    if (s.trim() === "") {
      r = !0, t.push(s);
      return;
    }
    if (e.length > 0 && qy(s)) {
      r = !0, t.push(s);
      return;
    }
    e.push(s);
  }), {
    paragraphLines: e,
    blockLines: t
  };
}
function Jy(n) {
  const e = [];
  let t = 0, r = 0;
  for (; t < n.length; ) {
    const s = n[t], i = s.match(vi);
    if (!i)
      break;
    const [, o, l, a, c] = i, u = o.length, d = parseInt(l, 10), f = isNaN(d) ? ys(l) : void 0, h = isNaN(d) ? go(l) : d, p = [c];
    let m = t + 1;
    const g = [s];
    let y = !1;
    for (; m < n.length; ) {
      const k = n[m];
      if (k.match(vi))
        break;
      if (k.trim() === "")
        g.push(k), p.push(""), y = !0, m += 1;
      else if (k.match(jy)) {
        const T = k.length - k.trimStart().length, x = u + l.length + 1;
        g.push(k), p.push(k.slice(Math.min(T, x))), m += 1;
      } else {
        if (y || Uy(k))
          break;
        g.push(k), p.push(k), m += 1;
      }
    }
    e.push({
      indent: u,
      number: h,
      type: f,
      content: p.join(`
`).trim(),
      contentLines: p,
      raw: g.join(`
`)
    }), r = m, t = m;
  }
  return [e, r];
}
var Gy = new RegExp(
  `^(${Pu})([.)])\\s+(.+)$`
);
function Qy(n) {
  const e = n.split(`
`).filter((i) => i.trim().length > 0);
  if (e.length === 0)
    return null;
  const t = [];
  for (const i of e) {
    const o = i.trim().match(Gy);
    if (!o)
      return null;
    t.push({
      marker: o[1],
      content: o[3]
    });
  }
  const r = t.map((i) => i.marker);
  return Dy(r) ? {
    type: "orderedList",
    attrs: Py(t[0].marker),
    content: t.map((i) => ({
      type: "listItem",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: i.content }]
        }
      ]
    }))
  } : null;
}
function Vu(n, e, t) {
  const r = [];
  let s = 0;
  for (; s < n.length; ) {
    const i = n[s];
    if (i.indent === e) {
      const { paragraphLines: o, blockLines: l } = Ky(i.contentLines), a = o.join(`
`).trim(), c = [];
      a && c.push({
        type: "paragraph",
        raw: a,
        tokens: t.inlineTokens(a)
      });
      const u = l.join(`
`).trim();
      if (u) {
        const h = t.blockTokens(u);
        c.push(...h);
      }
      let d = s + 1;
      const f = [];
      for (; d < n.length && n[d].indent > e; )
        f.push(n[d]), d += 1;
      if (f.length > 0) {
        const h = Math.min(...f.map((m) => m.indent)), p = Vu(f, h, t);
        c.push({
          type: "list",
          ordered: !0,
          start: f[0].number,
          typeMarker: f[0].type,
          items: p,
          raw: f.map((m) => m.raw).join(`
`)
        });
      }
      r.push({
        type: "list_item",
        raw: i.raw,
        tokens: c
      }), s = d;
    } else
      s += 1;
  }
  return r;
}
function Xy(n, e) {
  return n.map((t) => {
    if (t.type !== "list_item")
      return e.parseChildren([t])[0];
    const r = [];
    return t.tokens && t.tokens.length > 0 && t.tokens.forEach((s) => {
      if (s.type === "paragraph" || s.type === "list" || s.type === "blockquote" || s.type === "code")
        r.push(...e.parseChildren([s]));
      else if (s.type === "text" && s.tokens) {
        const i = e.parseChildren([s]);
        r.push({
          type: "paragraph",
          content: i
        });
      } else {
        const i = e.parseChildren([s]);
        i.length > 0 && r.push(...i);
      }
    }), {
      type: "listItem",
      content: r
    };
  });
}
var Zy = "listItem", ql = "textStyle", Ul = /^(\d+)\.\s$/;
function Kl(n) {
  const e = n.match(/list-style-type\s*:\s*([^;]+)/i);
  if (!e)
    return null;
  switch (e[1].trim().toLowerCase()) {
    case "upper-roman":
      return "I";
    case "lower-roman":
      return "i";
    case "upper-alpha":
    case "upper-latin":
      return "A";
    case "lower-alpha":
    case "lower-latin":
      return "a";
    default:
      return null;
  }
}
var ju = ye.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (n) => n.hasAttribute("start") ? parseInt(n.getAttribute("start") || "", 10) : 1
      },
      type: {
        default: null,
        parseHTML: (n) => {
          const e = n.getAttribute("type");
          if (e)
            return e;
          const t = n.getAttribute("style");
          if (t) {
            const s = Kl(t);
            if (s)
              return s;
          }
          const r = n.querySelector("li");
          if (r) {
            const s = r.getAttribute("style");
            if (s) {
              const i = Kl(s);
              if (i)
                return i;
            }
          }
          return null;
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    const { start: e, type: t, ...r } = n, s = G(this.options.HTMLAttributes, r);
    return e !== 1 && (s.start = e), t && t !== "1" && (s.type = t), ["ol", s, 0];
  },
  markdownTokenName: "list",
  parseMarkdown: (n, e) => {
    if (n.type !== "list" || !n.ordered)
      return [];
    const t = n.start || 1, r = n.typeMarker, s = n.items ? Xy(n.items, e) : [], i = {};
    return t !== 1 && (i.start = t), r && (i.type = r), Object.keys(i).length > 0 ? {
      type: "orderedList",
      attrs: i,
      content: s
    } : {
      type: "orderedList",
      content: s
    };
  },
  renderMarkdown: (n, e) => n.content ? e.renderChildren(n.content, `
`) : "",
  markdownTokenizer: {
    name: "orderedList",
    level: "block",
    // marked already breaks paragraphs before a start-of-line list marker. It
    // probes this with `src.slice(1)`, so any marker it surfaces here is
    // mid-line (like the "216)" in "(216) 555-1234") and must not start a list.
    // We still define the callback so marked does not fall back to probing
    // `tokenize`, which would re-introduce the mid-line split.
    start: () => -1,
    tokenize: (n, e, t) => {
      var r, s;
      const i = n.split(`
`), [o, l] = Jy(i);
      if (o.length === 0)
        return;
      const a = Vu(o, o[0].indent, t);
      if (a.length === 0)
        return;
      const c = ((r = o[0]) == null ? void 0 : r.number) || 1, u = (s = o[0]) == null ? void 0 : s.type;
      return {
        type: "list",
        ordered: !0,
        start: c,
        typeMarker: u,
        items: a,
        raw: i.slice(0, l).join(`
`)
      };
    }
  },
  markdownOptions: {
    indentsContent: !0
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: n, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Zy, this.editor.getAttributes(ql)).run() : n.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addProseMirrorPlugins() {
    return [
      new H({
        props: {
          handlePaste: (n, e) => {
            var t, r;
            const s = (t = e.clipboardData) == null ? void 0 : t.getData("text/html");
            if (s != null && s.trim())
              return !1;
            const i = (r = e.clipboardData) == null ? void 0 : r.getData("text/plain");
            if (!i)
              return !1;
            const o = Qy(i);
            if (!o)
              return !1;
            try {
              const l = n.state.schema.nodeFromJSON(o), a = n.state.tr.replaceSelectionWith(l);
              return n.dispatch(a), !0;
            } catch {
              return !1;
            }
          }
        }
      })
    ];
  },
  addInputRules() {
    const n = (t, r) => (!r.attrs.type || r.attrs.type === "1") && r.childCount + r.attrs.start === +t[1];
    let e = Qt({
      find: Ul,
      type: this.type,
      getAttributes: (t) => ({ start: +t[1] }),
      joinPredicate: n
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (e = Qt({
      find: Ul,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (t) => ({ start: +t[1], ...this.editor.getAttributes(ql) }),
      joinPredicate: n,
      editor: this.editor
    })), [e];
  }
}), Yy = /^\s*(\[([( |x])?\])\s$/, ek = ye.create({
  name: "taskItem",
  addOptions() {
    return {
      nested: !1,
      HTMLAttributes: {},
      taskListTypeName: "taskList",
      a11y: void 0
    };
  },
  content() {
    return this.options.nested ? "paragraph block*" : "paragraph+";
  },
  defining: !0,
  addAttributes() {
    return {
      checked: {
        default: !1,
        keepOnSplit: !1,
        parseHTML: (n) => {
          const e = n.getAttribute("data-checked");
          return e === "" || e === "true";
        },
        renderHTML: (n) => ({
          "data-checked": n.checked
        })
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "li",
      G(this.options.HTMLAttributes, e, {
        "data-type": this.name
      }),
      [
        "label",
        [
          "input",
          {
            type: "checkbox",
            checked: n.attrs.checked ? "checked" : null
          }
        ],
        ["span"]
      ],
      ["div", 0]
    ];
  },
  parseMarkdown: (n, e) => {
    const t = [];
    if (n.tokens && n.tokens.length > 0 ? t.push(e.createNode("paragraph", {}, e.parseInline(n.tokens))) : n.text ? t.push(e.createNode("paragraph", {}, [e.createNode("text", { text: n.text })])) : t.push(e.createNode("paragraph", {}, [])), n.nestedTokens && n.nestedTokens.length > 0) {
      const r = e.parseChildren(n.nestedTokens);
      t.push(...r);
    }
    return e.createNode("taskItem", { checked: n.checked || !1 }, t);
  },
  renderMarkdown: (n, e) => {
    var t;
    const s = `- [${(t = n.attrs) != null && t.checked ? "x" : " "}] `;
    return ro(n, e, s);
  },
  addExtensions() {
    return this.options.nested ? [Du(this.name, [this.options.taskListTypeName])] : [];
  },
  addKeyboardShortcuts() {
    const n = {
      Enter: () => this.editor.commands.splitListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
    return this.options.nested ? {
      ...n,
      Tab: () => this.editor.commands.sinkListItem(this.name)
    } : n;
  },
  addNodeView() {
    return ({ node: n, HTMLAttributes: e, getPos: t, editor: r }) => {
      const s = document.createElement("li"), i = document.createElement("label"), o = document.createElement("span"), l = document.createElement("input"), a = document.createElement("div"), c = (d) => {
        var f, h;
        l.ariaLabel = ((h = (f = this.options.a11y) == null ? void 0 : f.checkboxLabel) == null ? void 0 : h.call(f, d, l.checked)) || `Task item checkbox for ${d.textContent || "empty task item"}`;
      };
      c(n), i.contentEditable = "false", l.type = "checkbox", l.addEventListener("mousedown", (d) => d.preventDefault()), l.addEventListener("change", (d) => {
        if (!r.isEditable && !this.options.onReadOnlyChecked) {
          l.checked = !l.checked;
          return;
        }
        const { checked: f } = d.target;
        r.isEditable && typeof t == "function" && r.chain().focus(void 0, { scrollIntoView: !1 }).command(({ tr: h }) => {
          const p = t();
          if (typeof p != "number")
            return !1;
          const m = h.doc.nodeAt(p);
          return h.setNodeMarkup(p, void 0, {
            ...m == null ? void 0 : m.attrs,
            checked: f
          }), !0;
        }).run(), !r.isEditable && this.options.onReadOnlyChecked && (this.options.onReadOnlyChecked(n, f) || (l.checked = !l.checked));
      }), Object.entries(this.options.HTMLAttributes).forEach(([d, f]) => {
        s.setAttribute(d, f);
      }), s.dataset.checked = n.attrs.checked, l.checked = n.attrs.checked, i.append(l, o), s.append(i, a), Object.entries(e).forEach(([d, f]) => {
        s.setAttribute(d, f);
      });
      let u = new Set(Object.keys(e));
      return {
        dom: s,
        contentDOM: a,
        update: (d) => {
          if (d.type !== this.type)
            return !1;
          s.dataset.checked = d.attrs.checked, l.checked = d.attrs.checked, c(d);
          const f = r.extensionManager.attributes, h = Dn(d, f), p = new Set(Object.keys(h)), m = this.options.HTMLAttributes;
          return u.forEach((g) => {
            p.has(g) || (g in m ? s.setAttribute(g, m[g]) : s.removeAttribute(g));
          }), Object.entries(h).forEach(([g, y]) => {
            y == null ? g in m ? s.setAttribute(g, m[g]) : s.removeAttribute(g) : s.setAttribute(g, y);
          }), u = p, !0;
        }
      };
    };
  },
  addInputRules() {
    return [
      Qt({
        find: Yy,
        type: this.type,
        getAttributes: (n) => ({
          checked: n[n.length - 1] === "x"
        })
      })
    ];
  }
}), tk = ye.create({
  name: "taskList",
  addOptions() {
    return {
      itemTypeName: "taskItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return [
      "ul",
      G(this.options.HTMLAttributes, n, { "data-type": this.name }),
      0
    ];
  },
  parseMarkdown: (n, e) => e.createNode("taskList", {}, e.parseChildren(n.items || [])),
  renderMarkdown: (n, e) => n.content ? e.renderChildren(n.content, `
`) : "",
  markdownTokenizer: {
    name: "taskList",
    level: "block",
    start(n) {
      var e;
      const t = (e = n.match(/^\s*[-+*]\s+\[([ xX])\]\s+/)) == null ? void 0 : e.index;
      return t !== void 0 ? t : -1;
    },
    tokenize(n, e, t) {
      const r = (i) => {
        const o = pi(
          i,
          {
            itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
            extractItemData: (l) => ({
              indentLevel: l[1].length,
              mainContent: l[4],
              checked: l[3].toLowerCase() === "x"
            }),
            createToken: (l, a) => ({
              type: "taskItem",
              raw: "",
              mainContent: l.mainContent,
              indentLevel: l.indentLevel,
              checked: l.checked,
              text: l.mainContent,
              tokens: t.inlineTokens(l.mainContent),
              nestedTokens: a
            }),
            // Allow recursive nesting
            customNestedParser: r
          },
          t
        );
        if (o) {
          const l = {
            type: "taskList",
            raw: o.raw,
            items: o.items
          }, a = i.slice(o.raw.length);
          return a.trim() ? [l, ...t.blockTokens(a)] : [l];
        }
        return t.blockTokens(i);
      }, s = pi(
        n,
        {
          itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
          extractItemData: (i) => ({
            indentLevel: i[1].length,
            mainContent: i[4],
            checked: i[3].toLowerCase() === "x"
          }),
          createToken: (i, o) => ({
            type: "taskItem",
            raw: "",
            mainContent: i.mainContent,
            indentLevel: i.indentLevel,
            checked: i.checked,
            text: i.mainContent,
            tokens: t.inlineTokens(i.mainContent),
            nestedTokens: o
          }),
          // Use the recursive parser for nested content
          customNestedParser: r
        },
        t
      );
      if (s)
        return {
          type: "taskList",
          raw: s.raw,
          items: s.items
        };
    }
  },
  markdownOptions: {
    indentsContent: !0
  },
  addCommands() {
    return {
      toggleTaskList: () => ({ commands: n }) => n.toggleList(this.name, this.options.itemTypeName)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-9": () => this.editor.commands.toggleTaskList()
    };
  }
});
V.create({
  name: "listKit",
  addExtensions() {
    const n = [];
    return this.options.bulletList !== !1 && n.push(Iu.configure(this.options.bulletList)), this.options.listItem !== !1 && n.push(Bu.configure(this.options.listItem)), this.options.listKeymap !== !1 && n.push(Hu.configure(this.options.listKeymap)), this.options.orderedList !== !1 && n.push(ju.configure(this.options.orderedList)), this.options.taskItem !== !1 && n.push(ek.configure(this.options.taskItem)), this.options.taskList !== !1 && n.push(tk.configure(this.options.taskList)), n;
  }
});
var tr = "&nbsp;", qs = " ", nk = ye.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p" }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["p", G(this.options.HTMLAttributes, n), 0];
  },
  parseMarkdown: (n, e) => {
    const t = n.tokens || [];
    if (t.length === 1 && t[0].type === "image")
      return e.parseChildren([t[0]]);
    const r = e.parseInline(t);
    return t.length === 1 && t[0].type === "text" && (t[0].raw === tr || t[0].text === tr || t[0].raw === qs || t[0].text === qs) && r.length === 1 && r[0].type === "text" && (r[0].text === tr || r[0].text === qs) ? e.createNode("paragraph", void 0, []) : e.createNode("paragraph", void 0, r);
  },
  renderMarkdown: (n, e, t) => {
    var r, s;
    if (!n)
      return "";
    const i = Array.isArray(n.content) ? n.content : [];
    if (i.length === 0) {
      const o = Array.isArray((r = t == null ? void 0 : t.previousNode) == null ? void 0 : r.content) ? t.previousNode.content : [];
      return ((s = t == null ? void 0 : t.previousNode) == null ? void 0 : s.type) === "paragraph" && o.length === 0 ? tr : "";
    }
    return e.renderChildren(i);
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands: n }) => n.setNode(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
}), rk = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, sk = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, ik = Dt.create({
  name: "strike",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "s"
      },
      {
        tag: "del"
      },
      {
        tag: "strike"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("line-through") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["s", G(this.options.HTMLAttributes, n), 0];
  },
  markdownTokenName: "del",
  parseMarkdown: (n, e) => e.applyMark("strike", e.parseInline(n.tokens || [])),
  renderMarkdown: (n, e) => `~~${e.renderChildren(n)}~~`,
  addCommands() {
    return {
      setStrike: () => ({ commands: n }) => n.setMark(this.name),
      toggleStrike: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetStrike: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-s": () => this.editor.commands.toggleStrike()
    };
  },
  addInputRules() {
    return [
      Nt({
        find: rk,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      ut({
        find: sk,
        type: this.type
      })
    ];
  }
}), ok = ye.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
}), lk = Dt.create({
  name: "underline",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "u"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("underline") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["u", G(this.options.HTMLAttributes, n), 0];
  },
  parseMarkdown(n, e) {
    return e.applyMark(this.name || "underline", e.parseInline(n.tokens || []));
  },
  renderMarkdown(n, e) {
    return `++${e.renderChildren(n)}++`;
  },
  markdownTokenizer: {
    name: "underline",
    level: "inline",
    start(n) {
      return n.indexOf("++");
    },
    tokenize(n, e, t) {
      const s = /^(\+\+)([\s\S]+?)(\+\+)/.exec(n);
      if (!s)
        return;
      const i = s[2].trim();
      return {
        type: "underline",
        raw: s[0],
        text: i,
        tokens: t.inlineTokens(i)
      };
    }
  },
  addCommands() {
    return {
      setUnderline: () => ({ commands: n }) => n.setMark(this.name),
      toggleUnderline: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetUnderline: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-U": () => this.editor.commands.toggleUnderline()
    };
  }
});
function ak(n = {}) {
  return new H({
    view(e) {
      return new ck(e, n);
    }
  });
}
class ck {
  constructor(e, t) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.lastDragEvent = null, this.width = (r = t.width) !== null && r !== void 0 ? r : 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((s) => {
      let i = (o) => {
        this[s](o);
      };
      return e.dom.addEventListener(s, i), { name: s, handler: i };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    if (this.cursorPos != null && t.doc != e.state.doc)
      if (this.lastDragEvent) {
        let r = this.computeTarget(this.lastDragEvent);
        r == this.cursorPos ? this.updateOverlay() : this.setCursor(r);
      } else
        this.updateOverlay();
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, r, s = this.editorView.dom, i = s.getBoundingClientRect(), o = i.width / s.offsetWidth, l = i.height / s.offsetHeight;
    if (t) {
      let d = e.nodeBefore, f = e.nodeAfter;
      if (d || f) {
        let h = this.editorView.nodeDOM(this.cursorPos - (d ? d.nodeSize : 0));
        if (h) {
          let p = h.getBoundingClientRect(), m = d ? p.bottom : p.top;
          d && f && (m = (m + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2);
          let g = this.width / 2 * l;
          r = { left: p.left, right: p.right, top: m - g, bottom: m + g };
        }
      }
    }
    if (!r) {
      let d = this.editorView.coordsAtPos(this.cursorPos), f = this.width / 2 * o;
      r = { left: d.left - f, right: d.left + f, top: d.top, bottom: d.bottom };
    }
    let a = this.editorView.dom.offsetParent;
    this.element || (this.element = a.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
    let c, u;
    if (!a || a == document.body && getComputedStyle(a).position == "static")
      c = -pageXOffset, u = -pageYOffset;
    else {
      let d = a.getBoundingClientRect(), f = d.width / a.offsetWidth, h = d.height / a.offsetHeight;
      c = d.left - a.scrollLeft * f, u = d.top - a.scrollTop * h;
    }
    this.element.style.left = (r.left - c) / o + "px", this.element.style.top = (r.top - u) / l + "px", this.element.style.width = (r.right - r.left) / o + "px", this.element.style.height = (r.bottom - r.top) / l + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  computeTarget(e) {
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), s = r && r.type.spec.disableDropCursor, i = typeof s == "function" ? s(this.editorView, t, e) : s;
    if (!t || i)
      return null;
    let o = t.pos;
    if (this.editorView.dragging && this.editorView.dragging.slice) {
      let l = Da(this.editorView.state.doc, o, this.editorView.dragging.slice);
      l != null && (o = l);
    }
    return o;
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    this.lastDragEvent = e;
    let t = this.computeTarget(e);
    t != null && (this.setCursor(t), this.scheduleRemoval(5e3));
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    this.editorView.dom.contains(e.relatedTarget) || this.setCursor(null);
  }
}
class W extends I {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return W.valid(r) ? new W(r) : I.near(r);
  }
  content() {
    return C.empty;
  }
  eq(e) {
    return e instanceof W && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new W(e.resolve(t.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new ko(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.inlineContent || !uk(e) || !dk(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let s = t.contentMatchAt(e.index()).defaultType;
    return s && s.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, t, r = !1) {
    e: for (; ; ) {
      if (!r && W.valid(e))
        return e;
      let s = e.pos, i = null;
      for (let o = e.depth; ; o--) {
        let l = e.node(o);
        if (t > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
          i = l.child(t > 0 ? e.indexAfter(o) : e.index(o) - 1);
          break;
        } else if (o == 0)
          return null;
        s += t;
        let a = e.doc.resolve(s);
        if (W.valid(a))
          return a;
      }
      for (; ; ) {
        let o = t > 0 ? i.firstChild : i.lastChild;
        if (!o) {
          if (i.isAtom && !i.isText && !O.isSelectable(i)) {
            e = e.doc.resolve(s + i.nodeSize * t), r = !1;
            continue e;
          }
          break;
        }
        i = o, s += t;
        let l = e.doc.resolve(s);
        if (W.valid(l))
          return l;
      }
      return null;
    }
  }
}
W.prototype.visible = !1;
W.findFrom = W.findGapCursorFrom;
I.jsonID("gapcursor", W);
class ko {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new ko(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return W.valid(t) ? new W(t) : I.near(t);
  }
}
function Wu(n) {
  return n.isAtom || n.spec.isolating || n.spec.createGapCursor;
}
function uk(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let s = r.child(t - 1); ; s = s.lastChild) {
      if (s.childCount == 0 && !s.inlineContent || Wu(s.type))
        return !0;
      if (s.inlineContent)
        return !1;
    }
  }
  return !0;
}
function dk(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let s = r.child(t); ; s = s.firstChild) {
      if (s.childCount == 0 && !s.inlineContent || Wu(s.type))
        return !0;
      if (s.inlineContent)
        return !1;
    }
  }
  return !0;
}
function hk() {
  return new H({
    props: {
      decorations: gk,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && W.valid(t) ? new W(t) : null;
      },
      handleClick: pk,
      handleKeyDown: fk,
      handleDOMEvents: { beforeinput: mk }
    }
  });
}
const fk = Bc({
  ArrowLeft: nr("horiz", -1),
  ArrowRight: nr("horiz", 1),
  ArrowUp: nr("vert", -1),
  ArrowDown: nr("vert", 1)
});
function nr(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, s, i) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof N) {
      if (!i.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = W.findGapCursorFrom(l, e, a);
    return c ? (s && s(r.tr.setSelection(new W(c))), !0) : !1;
  };
}
function pk(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!W.valid(r))
    return !1;
  let s = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return s && s.inside > -1 && O.isSelectable(n.state.doc.nodeAt(s.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new W(r))), !0);
}
function mk(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof W))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let s = b.empty;
  for (let o = r.length - 1; o >= 0; o--)
    s = b.from(r[o].createAndFill(null, s));
  let i = n.state.tr.replace(t.pos, t.pos, new C(s, 0, 0));
  return i.setSelection(N.near(i.doc.resolve(t.pos + 1))), n.dispatch(i), !1;
}
function gk(n) {
  if (!(n.selection instanceof W))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", _.create(n.doc, [ce.widget(n.selection.head, e, { key: "gapcursor" })]);
}
var Zr = 200, ee = function() {
};
ee.prototype.append = function(e) {
  return e.length ? (e = ee.from(e), !this.length && e || e.length < Zr && this.leafAppend(e) || this.length < Zr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
ee.prototype.prepend = function(e) {
  return e.length ? ee.from(e).append(this) : this;
};
ee.prototype.appendInner = function(e) {
  return new yk(this, e);
};
ee.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? ee.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
ee.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
ee.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
ee.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var s = [];
  return this.forEach(function(i, o) {
    return s.push(e(i, o));
  }, t, r), s;
};
ee.from = function(e) {
  return e instanceof ee ? e : e && e.length ? new qu(e) : ee.empty;
};
var qu = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(s, i) {
    return s == 0 && i == this.length ? this : new e(this.values.slice(s, i));
  }, e.prototype.getInner = function(s) {
    return this.values[s];
  }, e.prototype.forEachInner = function(s, i, o, l) {
    for (var a = i; a < o; a++)
      if (s(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(s, i, o, l) {
    for (var a = i - 1; a >= o; a--)
      if (s(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(s) {
    if (this.length + s.length <= Zr)
      return new e(this.values.concat(s.flatten()));
  }, e.prototype.leafPrepend = function(s) {
    if (this.length + s.length <= Zr)
      return new e(s.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(ee);
ee.empty = new qu([]);
var yk = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, s, i, o) {
    var l = this.left.length;
    if (s < l && this.left.forEachInner(r, s, Math.min(i, l), o) === !1 || i > l && this.right.forEachInner(r, Math.max(s - l, 0), Math.min(this.length, i) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, s, i, o) {
    var l = this.left.length;
    if (s > l && this.right.forEachInvertedInner(r, s - l, Math.max(i, l) - l, o + l) === !1 || i < l && this.left.forEachInvertedInner(r, Math.min(s, l), i, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, s) {
    if (r == 0 && s == this.length)
      return this;
    var i = this.left.length;
    return s <= i ? this.left.slice(r, s) : r >= i ? this.right.slice(r - i, s - i) : this.left.slice(r, i).append(this.right.slice(0, s - i));
  }, e.prototype.leafAppend = function(r) {
    var s = this.right.leafAppend(r);
    if (s)
      return new e(this.left, s);
  }, e.prototype.leafPrepend = function(r) {
    var s = this.left.leafPrepend(r);
    if (s)
      return new e(s, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(ee);
const kk = 500;
class Ee {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let s, i;
    t && (s = this.remapping(r, this.items.length), i = s.maps.length);
    let o = e.tr, l, a, c = [], u = [];
    return this.items.forEach((d, f) => {
      if (!d.step) {
        s || (s = this.remapping(r, f + 1), i = s.maps.length), i--, u.push(d);
        return;
      }
      if (s) {
        u.push(new Pe(d.map));
        let h = d.step.map(s.slice(i)), p;
        h && o.maybeStep(h).doc && (p = o.mapping.maps[o.mapping.maps.length - 1], c.push(new Pe(p, void 0, void 0, c.length + u.length))), i--, p && s.appendMap(p, i);
      } else
        o.maybeStep(d.step);
      if (d.selection)
        return l = s ? d.selection.map(s.slice(i)) : d.selection, a = new Ee(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, s) {
    let i = [], o = this.eventCount, l = this.items, a = !s && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let d = e.steps[u].invert(e.docs[u]), f = new Pe(e.mapping.maps[u], d, t), h;
      (h = a && a.merge(f)) && (f = h, u ? i.pop() : l = l.slice(0, l.length - 1)), i.push(f), t && (o++, t = void 0), s || (a = f);
    }
    let c = o - r.depth;
    return c > xk && (l = bk(l, c), o -= c), new Ee(l.append(i), o);
  }
  remapping(e, t) {
    let r = new An();
    return this.items.forEach((s, i) => {
      let o = s.mirrorOffset != null && i - s.mirrorOffset >= e ? r.maps.length - s.mirrorOffset : void 0;
      r.appendMap(s.map, o);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Ee(this.items.append(e.map((t) => new Pe(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], s = Math.max(0, this.items.length - t), i = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((f) => {
      f.selection && l--;
    }, s);
    let a = t;
    this.items.forEach((f) => {
      let h = i.getMirror(--a);
      if (h == null)
        return;
      o = Math.min(o, h);
      let p = i.maps[h];
      if (f.step) {
        let m = e.steps[h].invert(e.docs[h]), g = f.selection && f.selection.map(i.slice(a + 1, h));
        g && l++, r.push(new Pe(p, m, g));
      } else
        r.push(new Pe(p));
    }, s);
    let c = [];
    for (let f = t; f < o; f++)
      c.push(new Pe(i.maps[f]));
    let u = this.items.slice(0, s).append(c).append(r), d = new Ee(u, l);
    return d.emptyItemCount() > kk && (d = d.compress(this.items.length - r.length)), d;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, s = [], i = 0;
    return this.items.forEach((o, l) => {
      if (l >= e)
        s.push(o), o.selection && i++;
      else if (o.step) {
        let a = o.step.map(t.slice(r)), c = a && a.getMap();
        if (r--, c && t.appendMap(c, r), a) {
          let u = o.selection && o.selection.map(t.slice(r));
          u && i++;
          let d = new Pe(c.invert(), a, u), f, h = s.length - 1;
          (f = s.length && s[h].merge(d)) ? s[h] = f : s.push(d);
        }
      } else o.map && r--;
    }, this.items.length, 0), new Ee(ee.from(s.reverse()), i);
  }
}
Ee.empty = new Ee(ee.empty, 0);
function bk(n, e) {
  let t;
  return n.forEach((r, s) => {
    if (r.selection && e-- == 0)
      return t = s, !1;
  }), n.slice(t);
}
class Pe {
  constructor(e, t, r, s) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = s;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new Pe(t.getMap().invert(), t, this.selection);
    }
  }
}
class et {
  constructor(e, t, r, s, i) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = s, this.prevComposition = i;
  }
}
const xk = 20;
function wk(n, e, t, r) {
  let s = t.getMeta(vt), i;
  if (s)
    return s.historyState;
  t.getMeta(Mk) && (n = new et(n.done, n.undone, null, 0, -1));
  let o = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (o && o.getMeta(vt))
    return o.getMeta(vt).redo ? new et(n.done.addTransform(t, void 0, r, ur(e)), n.undone, Jl(t.mapping.maps), n.prevTime, n.prevComposition) : new et(n.done, n.undone.addTransform(t, void 0, r, ur(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), a = n.prevTime == 0 || !o && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !Sk(t, n.prevRanges)), c = o ? Us(n.prevRanges, t.mapping) : Jl(t.mapping.maps);
    return new et(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, ur(e)), Ee.empty, c, t.time, l ?? n.prevComposition);
  } else return (i = t.getMeta("rebased")) ? new et(n.done.rebased(t, i), n.undone.rebased(t, i), Us(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new et(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), Us(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function Sk(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, s) => {
    for (let i = 0; i < e.length; i += 2)
      r <= e[i + 1] && s >= e[i] && (t = !0);
  }), t;
}
function Jl(n) {
  let e = [];
  for (let t = n.length - 1; t >= 0 && e.length == 0; t--)
    n[t].forEach((r, s, i, o) => e.push(i, o));
  return e;
}
function Us(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let s = e.map(n[r], 1), i = e.map(n[r + 1], -1);
    s <= i && t.push(s, i);
  }
  return t;
}
function Tk(n, e, t) {
  let r = ur(e), s = vt.get(e).spec.config, i = (t ? n.undone : n.done).popEvent(e, r);
  if (!i)
    return null;
  let o = i.selection.resolve(i.transform.doc), l = (t ? n.done : n.undone).addTransform(i.transform, e.selection.getBookmark(), s, r), a = new et(t ? l : i.remaining, t ? i.remaining : l, null, 0, -1);
  return i.transform.setSelection(o).setMeta(vt, { redo: t, historyState: a });
}
let Ks = !1, Gl = null;
function ur(n) {
  let e = n.plugins;
  if (Gl != e) {
    Ks = !1, Gl = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        Ks = !0;
        break;
      }
  }
  return Ks;
}
const vt = new Q("history"), Mk = new Q("closeHistory");
function Ck(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new H({
    key: vt,
    state: {
      init() {
        return new et(Ee.empty, Ee.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return wk(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, s = r == "historyUndo" ? Ku : r == "historyRedo" ? Ju : null;
          return !s || !e.editable ? !1 : (t.preventDefault(), s(e.state, e.dispatch));
        }
      }
    }
  });
}
function Uu(n, e) {
  return (t, r) => {
    let s = vt.getState(t);
    if (!s || (n ? s.undone : s.done).eventCount == 0)
      return !1;
    if (r) {
      let i = Tk(s, t, n);
      i && r(e ? i.scrollIntoView() : i);
    }
    return !0;
  };
}
const Ku = Uu(!1, !0), Ju = Uu(!0, !0);
V.create({
  name: "characterCount",
  addOptions() {
    return {
      limit: null,
      autoTrim: !0,
      mode: "textSize",
      textCounter: (n) => n.length,
      wordCounter: (n) => n.split(" ").filter((e) => e !== "").length
    };
  },
  addStorage() {
    return {
      characters: () => 0,
      words: () => 0
    };
  },
  onBeforeCreate() {
    this.storage.characters = (n) => {
      const e = (n == null ? void 0 : n.node) || this.editor.state.doc;
      if (((n == null ? void 0 : n.mode) || this.options.mode) === "textSize") {
        const r = e.textBetween(0, e.content.size, void 0, " ");
        return this.options.textCounter(r);
      }
      return e.nodeSize;
    }, this.storage.words = (n) => {
      const e = (n == null ? void 0 : n.node) || this.editor.state.doc, t = e.textBetween(0, e.content.size, " ", " ");
      return this.options.wordCounter(t);
    };
  },
  addProseMirrorPlugins() {
    let n = !1;
    return [
      new H({
        key: new Q("characterCount"),
        appendTransaction: (e, t, r) => {
          if (n)
            return;
          const s = this.options.limit, i = this.options.autoTrim;
          if (s == null || s === 0 || i === !1) {
            n = !0;
            return;
          }
          const o = this.storage.characters({ node: r.doc });
          if (o > s) {
            const l = o - s, a = 0, c = l;
            console.warn(
              `[CharacterCount] Initial content exceeded limit of ${s} characters. Content was automatically trimmed.`
            );
            const u = r.tr.deleteRange(a, c);
            return n = !0, u;
          }
          n = !0;
        },
        filterTransaction: (e, t) => {
          const r = this.options.limit;
          if (!e.docChanged || r === 0 || r === null || r === void 0)
            return !0;
          const s = this.storage.characters({ node: t.doc }), i = this.storage.characters({ node: e.doc });
          if (i <= r || s > r && i > r && i <= s)
            return !0;
          if (s > r && i > r && i > s || !e.getMeta("paste"))
            return !1;
          const l = e.selection.$head.pos, a = i - r, c = l - a, u = l;
          return e.deleteRange(c, u), !(this.storage.characters({ node: e.doc }) > r);
        }
      })
    ];
  }
});
var vk = V.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [ak(this.options)];
  }
});
V.create({
  name: "focus",
  addOptions() {
    return {
      className: "has-focus",
      mode: "all"
    };
  },
  addProseMirrorPlugins() {
    return [
      new H({
        key: new Q("focus"),
        props: {
          decorations: ({ doc: n, selection: e }) => {
            const { isEditable: t, isFocused: r } = this.editor, { anchor: s } = e, i = [];
            if (!t || !r)
              return _.create(n, []);
            let o = 0;
            this.options.mode === "deepest" && n.descendants((a, c) => {
              if (a.isText)
                return;
              if (!(s >= c && s <= c + a.nodeSize - 1))
                return !1;
              o += 1;
            });
            let l = 0;
            return n.descendants((a, c) => {
              if (a.isText || !(s >= c && s <= c + a.nodeSize - 1))
                return !1;
              if (l += 1, this.options.mode === "deepest" && o - l > 0 || this.options.mode === "shallowest" && l > 1)
                return this.options.mode === "deepest";
              i.push(
                ce.node(c, c + a.nodeSize, {
                  class: this.options.className
                })
              );
            }), _.create(n, i);
          }
        }
      })
    ];
  }
});
var Ek = V.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [hk()];
  },
  extendNodeSchema(n) {
    var e;
    const t = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      allowGapCursor: (e = P(v(n, "allowGapCursor", t))) != null ? e : null
    };
  }
}), Gu = "placeholder", Ql = new Q("tiptap__placeholder");
function Qu(n) {
  const {
    editor: e,
    placeholder: t,
    dataAttribute: r,
    pos: s,
    node: i,
    isEmptyDoc: o,
    hasAnchor: l,
    classes: { emptyNode: a, emptyEditor: c }
  } = n, u = [a];
  return o && u.push(c), ce.node(s, s + i.nodeSize, {
    class: u.join(" "),
    [r]: typeof t == "function" ? t({
      editor: e,
      node: i,
      pos: s,
      hasAnchor: l
    }) : t
  });
}
function Xu(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Zu({
  editor: n,
  options: e,
  dataAttribute: t,
  doc: r,
  selection: s,
  from: i,
  to: o
}) {
  const { anchor: l } = s, a = [], c = n.isEmpty;
  return r.nodesBetween(i, o, (u, d) => {
    const f = l >= d && l <= d + u.nodeSize, h = !u.isLeaf && Hn(u);
    return u.type.isTextblock && (f || !e.showOnlyCurrent) && h && a.push(
      Qu({
        editor: n,
        isEmptyDoc: c,
        dataAttribute: t,
        hasAnchor: f,
        placeholder: e.placeholder,
        classes: {
          emptyEditor: e.emptyEditorClass,
          emptyNode: Xu(e.emptyNodeClass, {
            editor: n,
            node: u,
            pos: d,
            hasAnchor: f
          })
        },
        node: u,
        pos: d
      })
    ), e.includeChildren;
  }), a;
}
function Yu({
  editor: n,
  options: e,
  dataAttribute: t,
  doc: r,
  selection: s
}) {
  if (!(n.isEditable || !e.showOnlyWhenEditable))
    return null;
  const { anchor: o } = s, l = [], a = n.isEmpty;
  if (e.showOnlyCurrent && !e.includeChildren) {
    const u = r.resolve(o), d = u.depth > 0 ? u.node(1) : u.nodeAfter, f = u.depth > 0 ? u.before(1) : o;
    if (d && d.type.isTextblock && Hn(d)) {
      const h = o >= f && o <= f + d.nodeSize;
      l.push(
        Qu({
          editor: n,
          isEmptyDoc: a,
          dataAttribute: t,
          hasAnchor: h,
          placeholder: e.placeholder,
          classes: {
            emptyEditor: e.emptyEditorClass,
            emptyNode: Xu(e.emptyNodeClass, {
              editor: n,
              node: d,
              pos: f,
              hasAnchor: h
            })
          },
          node: d,
          pos: f
        })
      );
    }
  } else
    l.push(
      ...Zu({
        editor: n,
        options: e,
        dataAttribute: t,
        doc: r,
        selection: s,
        from: 0,
        to: r.content.size
      })
    );
  return _.create(r, l);
}
function Tn(n, e) {
  var t;
  const r = n.resolve(e);
  if (r.depth === 0) {
    const o = (t = r.nodeAfter) != null ? t : r.nodeBefore;
    if (!o)
      return { from: e, to: e };
    const l = r.nodeAfter ? e : e - o.nodeSize;
    return { from: l, to: l + o.nodeSize };
  }
  const s = r.before(1), i = r.node(1);
  return { from: s, to: s + i.nodeSize };
}
function Mn(n, e) {
  return {
    from: Math.max(0, e.from - 1),
    to: Math.min(n.content.size, e.to - 1)
  };
}
function Ak(n, e, t) {
  const r = [];
  return n.forEach((s, i) => {
    const o = i, l = o + s.nodeSize, a = o + 1, c = l + 1;
    a < t && c > e && r.push({ from: o, to: l });
  }), r;
}
function Ok(n) {
  if (n.length === 0)
    return [];
  const e = [...n].sort((r, s) => r.from - s.from), t = [{ ...e[0] }];
  for (let r = 1; r < e.length; r += 1) {
    const s = t[t.length - 1], i = e[r];
    i.from <= s.to ? s.to = Math.max(s.to, i.to) : t.push({ ...i });
  }
  return t;
}
function Nk(n, e) {
  const t = Ak(n, e.from, e.to);
  return t.push(Mn(n, Tn(n, e.from))), e.to > e.from ? t.push(
    Mn(
      n,
      Tn(n, Math.min(e.to, n.content.size + 1) - 1)
    )
  ) : e.from < n.content.size + 1 && t.push(
    Mn(
      n,
      Tn(n, Math.min(e.from + 1, n.content.size))
    )
  ), t;
}
function Rk(n, e, t) {
  const r = [];
  if (n.docChanged) {
    const s = Yi(n);
    for (const i of s)
      r.push(...Nk(t.doc, i.newRange));
  }
  return n.selectionSet && (r.push(
    Mn(
      t.doc,
      Tn(t.doc, n.mapping.map(e.selection.anchor))
    )
  ), r.push(
    Mn(
      t.doc,
      Tn(t.doc, t.selection.anchor)
    )
  )), Ok(r);
}
function Ik(n, e, t) {
  const r = Math.max(0, Math.min(n, t.content.size)), s = Math.max(r, Math.min(e, t.content.size));
  return { from: r, to: s };
}
function Dk({
  decorations: n,
  ranges: e,
  editor: t,
  options: r,
  dataAttribute: s,
  doc: i,
  selection: o
}) {
  let l = n;
  for (const a of e) {
    const { from: c, to: u } = Ik(a.from, a.to, i), d = l.find(c, u).filter((h) => h.from >= c && h.to <= u);
    d.length && (l = l.remove(d));
    const f = Zu({
      editor: t,
      options: r,
      dataAttribute: s,
      doc: i,
      selection: o,
      from: c,
      to: u
    });
    f.length && (l = l.add(i, f));
  }
  return l;
}
function Lk({
  editor: n,
  options: e,
  dataAttribute: t
}) {
  return {
    init(r, s) {
      const i = Yu({
        editor: n,
        options: e,
        dataAttribute: t,
        doc: s.doc,
        selection: s.selection
      });
      return i ?? _.empty;
    },
    apply(r, s, i, o) {
      if (!r.docChanged && !r.selectionSet)
        return s;
      const l = s.map(r.mapping, r.doc), a = Rk(r, i, o);
      return Dk({
        decorations: l,
        ranges: a,
        editor: n,
        options: e,
        dataAttribute: t,
        doc: o.doc,
        selection: o.selection
      });
    }
  };
}
function Pk(n) {
  return n.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
function zk({ editor: n, options: e }) {
  const t = e.dataAttribute ? `data-${Pk(e.dataAttribute)}` : `data-${Gu}`, r = e.showOnlyCurrent && !e.includeChildren;
  return new H({
    key: Ql,
    ...r ? {} : {
      state: Lk({ editor: n, options: e, dataAttribute: t })
    },
    props: {
      decorations: r ? ({ doc: s, selection: i }) => Yu({ editor: n, options: e, dataAttribute: t, doc: s, selection: i }) : (s) => {
        var i;
        return e.showOnlyWhenEditable && !n.isEditable ? _.empty : (i = Ql.getState(s)) != null ? i : _.empty;
      }
    }
  });
}
var Bk = V.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      dataAttribute: Gu,
      placeholder: "Write something …",
      showOnlyWhenEditable: !0,
      showOnlyCurrent: !0,
      includeChildren: !1
    };
  },
  addProseMirrorPlugins() {
    return [zk({ editor: this.editor, options: this.options })];
  }
});
function Ei(n, e) {
  return !n.selection.empty && !Yc(n.selection) && e.isEditable;
}
function $k(n, e) {
  return Ei(n, e) && !e.isFocused && !e.view.dragging;
}
function _k() {
  var n;
  (n = window.getSelection()) == null || n.removeAllRanges();
}
function Fk(n) {
  n.focus();
}
V.create({
  name: "selection",
  addOptions() {
    return {
      className: "selection"
    };
  },
  addProseMirrorPlugins() {
    const { editor: n, options: e } = this;
    return [
      new H({
        key: new Q("selection"),
        props: {
          decorations(t) {
            return $k(t, n) ? _.create(t.doc, [
              ce.inline(t.selection.from, t.selection.to, {
                class: e.className
              })
            ]) : null;
          },
          handleDOMEvents: {
            blur(t) {
              return Ei(t.state, n) && _k(), !1;
            },
            focus(t) {
              return Ei(t.state, n) && requestAnimationFrame(() => {
                !n.isDestroyed && t.hasFocus() && Fk(t);
              }), !1;
            }
          }
        }
      })
    ];
  }
});
var Hk = "skipTrailingNode";
function Xl({
  types: n,
  node: e
}) {
  return e && Array.isArray(n) && n.includes(e.type) || (e == null ? void 0 : e.type) === n;
}
var Vk = V.create({
  name: "trailingNode",
  addOptions() {
    return {
      node: void 0,
      notAfter: []
    };
  },
  addProseMirrorPlugins() {
    var n;
    const e = new Q(this.name), t = this.options.node || ((n = this.editor.schema.topNodeType.contentMatch.defaultType) == null ? void 0 : n.name) || "paragraph", r = Object.entries(this.editor.schema.nodes).map(([, s]) => s).filter((s) => (this.options.notAfter || []).concat(t).includes(s.name));
    return [
      new H({
        key: e,
        appendTransaction: (s, i, o) => {
          const { doc: l, tr: a, schema: c } = o, u = e.getState(o), d = l.content.size, f = c.nodes[t];
          if (!s.some((h) => h.getMeta(Hk)) && u)
            return a.insert(d, f.create());
        },
        state: {
          init: (s, i) => {
            const o = i.tr.doc.lastChild;
            return !Xl({ node: o, types: r });
          },
          apply: (s, i) => {
            if (!s.docChanged || s.getMeta("__uniqueIDTransaction"))
              return i;
            const o = s.doc.lastChild;
            return !Xl({ node: o, types: r });
          }
        }
      })
    ];
  }
}), jk = V.create({
  name: "undoRedo",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => Ku(n, e),
      redo: () => ({ state: n, dispatch: e }) => Ju(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [Ck(this.options)];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
}), Wk = V.create({
  name: "starterKit",
  addExtensions() {
    var n, e, t, r;
    const s = [];
    return this.options.bold !== !1 && s.push(Og.configure(this.options.bold)), this.options.blockquote !== !1 && s.push(Mg.configure(this.options.blockquote)), this.options.bulletList !== !1 && s.push(Iu.configure(this.options.bulletList)), this.options.code !== !1 && s.push(Ig.configure(this.options.code)), this.options.codeBlock !== !1 && s.push(Pg.configure(this.options.codeBlock)), this.options.document !== !1 && s.push(zg.configure(this.options.document)), this.options.dropcursor !== !1 && s.push(vk.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && s.push(Ek.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && s.push(Bg.configure(this.options.hardBreak)), this.options.heading !== !1 && s.push($g.configure(this.options.heading)), this.options.undoRedo !== !1 && s.push(jk.configure(this.options.undoRedo)), this.options.horizontalRule !== !1 && s.push(_g.configure(this.options.horizontalRule)), this.options.italic !== !1 && s.push(Wg.configure(this.options.italic)), this.options.listItem !== !1 && s.push(Bu.configure(this.options.listItem)), this.options.listKeymap !== !1 && s.push(Hu.configure((n = this.options) == null ? void 0 : n.listKeymap)), this.options.link !== !1 && s.push(Sy.configure((e = this.options) == null ? void 0 : e.link)), this.options.orderedList !== !1 && s.push(ju.configure(this.options.orderedList)), this.options.paragraph !== !1 && s.push(nk.configure(this.options.paragraph)), this.options.strike !== !1 && s.push(ik.configure(this.options.strike)), this.options.text !== !1 && s.push(ok.configure(this.options.text)), this.options.underline !== !1 && s.push(lk.configure((t = this.options) == null ? void 0 : t.underline)), this.options.trailingNode !== !1 && s.push(Vk.configure((r = this.options) == null ? void 0 : r.trailingNode)), s;
  }
}), qk = Wk;
function bo() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Lt = bo();
function ed(n) {
  Lt = n;
}
var mt = { exec: () => null };
function L(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (s, i) => {
    let o = typeof i == "string" ? i : i.source;
    return o = o.replace(ue.caret, "$1"), t = t.replace(s, o), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Uk = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ue = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`), htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}>`) }, Kk = /^(?:[ \t]*(?:\n|$))+/, Jk = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Gk = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, jn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Qk = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, xo = / {0,3}(?:[*+-]|\d{1,9}[.)])/, td = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, nd = L(td).replace(/bull/g, xo).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Xk = L(td).replace(/bull/g, xo).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), wo = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Zk = /^[^\n]+/, So = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Yk = L(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", So).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), e0 = L(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, xo).getRegex(), bs = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", To = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, t0 = L("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", To).replace("tag", bs).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), rd = L(wo).replace("hr", jn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bs).getRegex(), n0 = L(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", rd).getRegex(), Mo = { blockquote: n0, code: Jk, def: Yk, fences: Gk, heading: Qk, hr: jn, html: t0, lheading: nd, list: e0, newline: Kk, paragraph: rd, table: mt, text: Zk }, Zl = L("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", jn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bs).getRegex(), r0 = { ...Mo, lheading: Xk, table: Zl, paragraph: L(wo).replace("hr", jn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Zl).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bs).getRegex() }, s0 = { ...Mo, html: L(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", To).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: mt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: L(wo).replace("hr", jn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", nd).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, i0 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, o0 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, sd = /^( {2,}|\\)\n(?!\s*$)/, l0 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Zt = /[\p{P}\p{S}]/u, xs = /[\s\p{P}\p{S}]/u, Co = /[^\s\p{P}\p{S}]/u, a0 = L(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, xs).getRegex(), id = /(?!~)[\p{P}\p{S}]/u, c0 = /(?!~)[\s\p{P}\p{S}]/u, u0 = /(?:[^\s\p{P}\p{S}]|~)/u, d0 = L(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Uk ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), od = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, h0 = L(od, "u").replace(/punct/g, Zt).getRegex(), f0 = L(od, "u").replace(/punct/g, id).getRegex(), ld = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", p0 = L(ld, "gu").replace(/notPunctSpace/g, Co).replace(/punctSpace/g, xs).replace(/punct/g, Zt).getRegex(), m0 = L(ld, "gu").replace(/notPunctSpace/g, u0).replace(/punctSpace/g, c0).replace(/punct/g, id).getRegex(), g0 = L("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Co).replace(/punctSpace/g, xs).replace(/punct/g, Zt).getRegex(), y0 = L(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Zt).getRegex(), k0 = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", b0 = L(k0, "gu").replace(/notPunctSpace/g, Co).replace(/punctSpace/g, xs).replace(/punct/g, Zt).getRegex(), x0 = L(/\\(punct)/, "gu").replace(/punct/g, Zt).getRegex(), w0 = L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), S0 = L(To).replace("(?:-->|$)", "-->").getRegex(), T0 = L("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", S0).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Yr = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, M0 = L(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Yr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ad = L(/^!?\[(label)\]\[(ref)\]/).replace("label", Yr).replace("ref", So).getRegex(), cd = L(/^!?\[(ref)\](?:\[\])?/).replace("ref", So).getRegex(), C0 = L("reflink|nolink(?!\\()", "g").replace("reflink", ad).replace("nolink", cd).getRegex(), Yl = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, vo = { _backpedal: mt, anyPunctuation: x0, autolink: w0, blockSkip: d0, br: sd, code: o0, del: mt, delLDelim: mt, delRDelim: mt, emStrongLDelim: h0, emStrongRDelimAst: p0, emStrongRDelimUnd: g0, escape: i0, link: M0, nolink: cd, punctuation: a0, reflink: ad, reflinkSearch: C0, tag: T0, text: l0, url: mt }, v0 = { ...vo, link: L(/^!?\[(label)\]\((.*?)\)/).replace("label", Yr).getRegex(), reflink: L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Yr).getRegex() }, Ai = { ...vo, emStrongRDelimAst: m0, emStrongLDelim: f0, delLDelim: y0, delRDelim: b0, url: L(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Yl).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: L(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Yl).getRegex() }, E0 = { ...Ai, br: L(sd).replace("{2,}", "*").getRegex(), text: L(Ai.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, rr = { normal: Mo, gfm: r0, pedantic: s0 }, nn = { normal: vo, gfm: Ai, breaks: E0, pedantic: v0 }, A0 = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ea = (n) => A0[n];
function Ie(n, e) {
  if (e) {
    if (ue.escapeTest.test(n)) return n.replace(ue.escapeReplace, ea);
  } else if (ue.escapeTestNoEncode.test(n)) return n.replace(ue.escapeReplaceNoEncode, ea);
  return n;
}
function ta(n) {
  try {
    n = encodeURI(n).replace(ue.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function na(n, e) {
  var i;
  let t = n.replace(ue.findPipe, (o, l, a) => {
    let c = !1, u = l;
    for (; --u >= 0 && a[u] === "\\"; ) c = !c;
    return c ? "|" : " |";
  }), r = t.split(ue.splitPipe), s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !((i = r.at(-1)) != null && i.trim()) && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; s < r.length; s++) r[s] = r[s].trim().replace(ue.slashPipe, "|");
  return r;
}
function rn(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let s = 0;
  for (; s < r && n.charAt(r - s - 1) === e; )
    s++;
  return n.slice(0, r - s);
}
function O0(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function N0(n, e = 0) {
  let t = e, r = "";
  for (let s of n) if (s === "	") {
    let i = 4 - t % 4;
    r += " ".repeat(i), t += i;
  } else r += s, t++;
  return r;
}
function ra(n, e, t, r, s) {
  let i = e.href, o = e.title || null, l = n[1].replace(s.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let a = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: o, text: l, tokens: r.inlineTokens(l) };
  return r.state.inLink = !1, a;
}
function R0(n, e, t) {
  let r = n.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let s = r[1];
  return e.split(`
`).map((i) => {
    let o = i.match(t.other.beginningSpace);
    if (o === null) return i;
    let [l] = o;
    return l.length >= s.length ? i.slice(s.length) : i;
  }).join(`
`);
}
var es = class {
  constructor(n) {
    B(this, "options");
    B(this, "rules");
    B(this, "lexer");
    this.options = n || Lt;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? t : rn(t, `
`) };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let t = e[0], r = R0(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let r = rn(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: rn(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = rn(e[0], `
`).split(`
`), r = "", s = "", i = [];
      for (; t.length > 0; ) {
        let o = !1, l = [], a;
        for (a = 0; a < t.length; a++) if (this.rules.other.blockquoteStart.test(t[a])) l.push(t[a]), o = !0;
        else if (!o) l.push(t[a]);
        else break;
        t = t.slice(a);
        let c = l.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, s = s ? `${s}
${u}` : u;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, i, !0), this.lexer.state.top = d, t.length === 0) break;
        let f = i.at(-1);
        if ((f == null ? void 0 : f.type) === "code") break;
        if ((f == null ? void 0 : f.type) === "blockquote") {
          let h = f, p = h.raw + `
` + t.join(`
`), m = this.blockquote(p);
          i[i.length - 1] = m, r = r.substring(0, r.length - h.raw.length) + m.raw, s = s.substring(0, s.length - h.text.length) + m.text;
          break;
        } else if ((f == null ? void 0 : f.type) === "list") {
          let h = f, p = h.raw + `
` + t.join(`
`), m = this.list(p);
          i[i.length - 1] = m, r = r.substring(0, r.length - f.raw.length) + m.raw, s = s.substring(0, s.length - h.raw.length) + m.raw, t = p.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: i, text: s };
    }
  }
  list(n) {
    var t, r;
    let e = this.rules.block.list.exec(n);
    if (e) {
      let s = e[1].trim(), i = s.length > 1, o = { type: "list", raw: "", ordered: i, start: i ? +s.slice(0, -1) : "", loose: !1, items: [] };
      s = i ? `\\d{1,9}\\${s.slice(-1)}` : `\\${s}`, this.options.pedantic && (s = i ? s : "[*+-]");
      let l = this.rules.other.listItemRegex(s), a = !1;
      for (; n; ) {
        let u = !1, d = "", f = "";
        if (!(e = l.exec(n)) || this.rules.block.hr.test(n)) break;
        d = e[0], n = n.substring(d.length);
        let h = N0(e[2].split(`
`, 1)[0], e[1].length), p = n.split(`
`, 1)[0], m = !h.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, f = h.trimStart()) : m ? g = e[1].length + 1 : (g = h.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, f = h.slice(g), g += e[1].length), m && this.rules.other.blankLine.test(p) && (d += p + `
`, n = n.substring(p.length + 1), u = !0), !u) {
          let y = this.rules.other.nextBulletRegex(g), k = this.rules.other.hrRegex(g), S = this.rules.other.fencesBeginRegex(g), T = this.rules.other.headingBeginRegex(g), x = this.rules.other.htmlBeginRegex(g), E = this.rules.other.blockquoteBeginRegex(g);
          for (; n; ) {
            let M = n.split(`
`, 1)[0], A;
            if (p = M, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), A = p) : A = p.replace(this.rules.other.tabCharGlobal, "    "), S.test(p) || T.test(p) || x.test(p) || E.test(p) || y.test(p) || k.test(p)) break;
            if (A.search(this.rules.other.nonSpaceChar) >= g || !p.trim()) f += `
` + A.slice(g);
            else {
              if (m || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || S.test(h) || T.test(h) || k.test(h)) break;
              f += `
` + p;
            }
            m = !p.trim(), d += M + `
`, n = n.substring(M.length + 1), h = A.slice(g);
          }
        }
        o.loose || (a ? o.loose = !0 : this.rules.other.doubleBlankLine.test(d) && (a = !0)), o.items.push({ type: "list_item", raw: d, task: !!this.options.gfm && this.rules.other.listIsTask.test(f), loose: !1, text: f, tokens: [] }), o.raw += d;
      }
      let c = o.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      o.raw = o.raw.trimEnd();
      for (let u of o.items) {
        if (this.lexer.state.top = !1, u.tokens = this.lexer.blockTokens(u.text, []), u.task) {
          if (u.text = u.text.replace(this.rules.other.listReplaceTask, ""), ((t = u.tokens[0]) == null ? void 0 : t.type) === "text" || ((r = u.tokens[0]) == null ? void 0 : r.type) === "paragraph") {
            u.tokens[0].raw = u.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), u.tokens[0].text = u.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let f = this.lexer.inlineQueue.length - 1; f >= 0; f--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)) {
              this.lexer.inlineQueue[f].src = this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let d = this.rules.other.listTaskCheckbox.exec(u.raw);
          if (d) {
            let f = { type: "checkbox", raw: d[0] + " ", checked: d[0] !== "[ ]" };
            u.checked = f.checked, o.loose ? u.tokens[0] && ["paragraph", "text"].includes(u.tokens[0].type) && "tokens" in u.tokens[0] && u.tokens[0].tokens ? (u.tokens[0].raw = f.raw + u.tokens[0].raw, u.tokens[0].text = f.raw + u.tokens[0].text, u.tokens[0].tokens.unshift(f)) : u.tokens.unshift({ type: "paragraph", raw: f.raw, text: f.raw, tokens: [f] }) : u.tokens.unshift(f);
          }
        }
        if (!o.loose) {
          let d = u.tokens.filter((h) => h.type === "space"), f = d.length > 0 && d.some((h) => this.rules.other.anyLine.test(h.raw));
          o.loose = f;
        }
      }
      if (o.loose) for (let u of o.items) {
        u.loose = !0;
        for (let d of u.tokens) d.type === "text" && (d.type = "paragraph");
      }
      return o;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: e[0], href: r, title: s };
    }
  }
  table(n) {
    var o;
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = na(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (o = e[3]) != null && o.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < t.length; l++) i.header.push({ text: t[l], tokens: this.lexer.inline(t[l]), header: !0, align: i.align[l] });
      for (let l of s) i.rows.push(na(l, i.header.length).map((a, c) => ({ text: a, tokens: this.lexer.inline(a), header: !1, align: i.align[c] })));
      return i;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: t, tokens: this.lexer.inline(t) };
    }
  }
  paragraph(n) {
    let e = this.rules.block.paragraph.exec(n);
    if (e) {
      let t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: t, tokens: this.lexer.inline(t) };
    }
  }
  text(n) {
    let e = this.rules.block.text.exec(n);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(n) {
    let e = this.rules.inline.escape.exec(n);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(n) {
    let e = this.rules.inline.tag.exec(n);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(n) {
    let e = this.rules.inline.link.exec(n);
    if (e) {
      let t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t)) return;
        let i = rn(t.slice(0, -1), "\\");
        if ((t.length - i.length) % 2 === 0) return;
      } else {
        let i = O0(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let r = e[2], s = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], s = i[3]);
      } else s = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), ra(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[r.toLowerCase()];
      if (!s) {
        let i = t[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return ra(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, i, o, l = s, a = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = c.exec(e)) !== null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
        if (o = [...i].length, r[3] || r[4]) {
          l += o;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
          a += o;
          continue;
        }
        if (l -= o, l > 0) continue;
        o = Math.min(o, o + l + a);
        let u = [...r[0]][0].length, d = n.slice(0, s + r.index + u + o);
        if (Math.min(s, o) % 2) {
          let h = d.slice(1, -1);
          return { type: "em", raw: d, text: h, tokens: this.lexer.inlineTokens(h) };
        }
        let f = d.slice(2, -2);
        return { type: "strong", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  codespan(n) {
    let e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && s && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(n) {
    let e = this.rules.inline.br.exec(n);
    if (e) return { type: "br", raw: e[0] };
  }
  del(n, e, t = "") {
    let r = this.rules.inline.delLDelim.exec(n);
    if (r && (!r[1] || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, i, o, l = s, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = a.exec(e)) !== null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (o = [...i].length, o !== s)) continue;
        if (r[3] || r[4]) {
          l += o;
          continue;
        }
        if (l -= o, l > 0) continue;
        o = Math.min(o, o + l);
        let c = [...r[0]][0].length, u = n.slice(0, s + r.index + c + o), d = u.slice(s, -s);
        return { type: "del", raw: u, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  autolink(n) {
    let e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), { type: "link", raw: e[0], text: t, href: r, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(n) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let r, s;
      if (e[2] === "@") r = e[0], s = "mailto:" + r;
      else {
        let i;
        do
          i = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (i !== e[0]);
        r = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: s, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(n) {
    let e = this.rules.inline.text.exec(n);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: t };
    }
  }
}, Ce = class Oi {
  constructor(e) {
    B(this, "tokens");
    B(this, "options");
    B(this, "state");
    B(this, "inlineQueue");
    B(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Lt, this.options.tokenizer = this.options.tokenizer || new es(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: ue, block: rr.normal, inline: nn.normal };
    this.options.pedantic ? (t.block = rr.pedantic, t.inline = nn.pedantic) : this.options.gfm && (t.block = rr.gfm, this.options.breaks ? t.inline = nn.breaks : t.inline = nn.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: rr, inline: nn };
  }
  static lex(e, t) {
    return new Oi(t).lex(e);
  }
  static lexInline(e, t) {
    return new Oi(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(ue.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    var s, i, o;
    for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(ue.tabCharGlobal, "    ").replace(ue.spaceLine, "")); e; ) {
      let l;
      if ((i = (s = this.options.extensions) == null ? void 0 : s.block) != null && i.some((c) => (l = c.call({ lexer: this }, e, t)) ? (e = e.substring(l.raw.length), t.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.space(e)) {
        e = e.substring(l.raw.length);
        let c = t.at(-1);
        l.raw.length === 1 && c !== void 0 ? c.raw += `
` : t.push(l);
        continue;
      }
      if (l = this.tokenizer.code(e)) {
        e = e.substring(l.raw.length);
        let c = t.at(-1);
        (c == null ? void 0 : c.type) === "paragraph" || (c == null ? void 0 : c.type) === "text" ? (c.raw += (c.raw.endsWith(`
`) ? "" : `
`) + l.raw, c.text += `
` + l.text, this.inlineQueue.at(-1).src = c.text) : t.push(l);
        continue;
      }
      if (l = this.tokenizer.fences(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.heading(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.hr(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.blockquote(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.list(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.html(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.def(e)) {
        e = e.substring(l.raw.length);
        let c = t.at(-1);
        (c == null ? void 0 : c.type) === "paragraph" || (c == null ? void 0 : c.type) === "text" ? (c.raw += (c.raw.endsWith(`
`) ? "" : `
`) + l.raw, c.text += `
` + l.raw, this.inlineQueue.at(-1).src = c.text) : this.tokens.links[l.tag] || (this.tokens.links[l.tag] = { href: l.href, title: l.title }, t.push(l));
        continue;
      }
      if (l = this.tokenizer.table(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      if (l = this.tokenizer.lheading(e)) {
        e = e.substring(l.raw.length), t.push(l);
        continue;
      }
      let a = e;
      if ((o = this.options.extensions) != null && o.startBlock) {
        let c = 1 / 0, u = e.slice(1), d;
        this.options.extensions.startBlock.forEach((f) => {
          d = f.call({ lexer: this }, u), typeof d == "number" && d >= 0 && (c = Math.min(c, d));
        }), c < 1 / 0 && c >= 0 && (a = e.substring(0, c + 1));
      }
      if (this.state.top && (l = this.tokenizer.paragraph(a))) {
        let c = t.at(-1);
        r && (c == null ? void 0 : c.type) === "paragraph" ? (c.raw += (c.raw.endsWith(`
`) ? "" : `
`) + l.raw, c.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = c.text) : t.push(l), r = a.length !== e.length, e = e.substring(l.raw.length);
        continue;
      }
      if (l = this.tokenizer.text(e)) {
        e = e.substring(l.raw.length);
        let c = t.at(-1);
        (c == null ? void 0 : c.type) === "text" ? (c.raw += (c.raw.endsWith(`
`) ? "" : `
`) + l.raw, c.text += `
` + l.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = c.text) : t.push(l);
        continue;
      }
      if (e) {
        let c = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else throw new Error(c);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    var a, c, u, d, f;
    this.tokenizer.lexer = this;
    let r = e, s = null;
    if (this.tokens.links) {
      let h = Object.keys(this.tokens.links);
      if (h.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(r)) !== null; ) h.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(r)) !== null; ) r = r.slice(0, s.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(r)) !== null; ) i = s[2] ? s[2].length : 0, r = r.slice(0, s.index + i) + "[" + "a".repeat(s[0].length - i - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = ((c = (a = this.options.hooks) == null ? void 0 : a.emStrongMask) == null ? void 0 : c.call({ lexer: this }, r)) ?? r;
    let o = !1, l = "";
    for (; e; ) {
      o || (l = ""), o = !1;
      let h;
      if ((d = (u = this.options.extensions) == null ? void 0 : u.inline) != null && d.some((m) => (h = m.call({ lexer: this }, e, t)) ? (e = e.substring(h.raw.length), t.push(h), !0) : !1)) continue;
      if (h = this.tokenizer.escape(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.tag(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.link(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(h.raw.length);
        let m = t.at(-1);
        h.type === "text" && (m == null ? void 0 : m.type) === "text" ? (m.raw += h.raw, m.text += h.text) : t.push(h);
        continue;
      }
      if (h = this.tokenizer.emStrong(e, r, l)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.codespan(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.br(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.del(e, r, l)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.autolink(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (!this.state.inLink && (h = this.tokenizer.url(e))) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      let p = e;
      if ((f = this.options.extensions) != null && f.startInline) {
        let m = 1 / 0, g = e.slice(1), y;
        this.options.extensions.startInline.forEach((k) => {
          y = k.call({ lexer: this }, g), typeof y == "number" && y >= 0 && (m = Math.min(m, y));
        }), m < 1 / 0 && m >= 0 && (p = e.substring(0, m + 1));
      }
      if (h = this.tokenizer.inlineText(p)) {
        e = e.substring(h.raw.length), h.raw.slice(-1) !== "_" && (l = h.raw.slice(-1)), o = !0;
        let m = t.at(-1);
        (m == null ? void 0 : m.type) === "text" ? (m.raw += h.raw, m.text += h.text) : t.push(h);
        continue;
      }
      if (e) {
        let m = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(m);
          break;
        } else throw new Error(m);
      }
    }
    return t;
  }
}, ts = class {
  constructor(n) {
    B(this, "options");
    B(this, "parser");
    this.options = n || Lt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var i;
    let r = (i = (e || "").match(ue.notSpaceStart)) == null ? void 0 : i[0], s = n.replace(ue.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + Ie(r) + '">' + (t ? s : Ie(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : Ie(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  def(n) {
    return "";
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    let e = n.ordered, t = n.start, r = "";
    for (let o = 0; o < n.items.length; o++) {
      let l = n.items[o];
      r += this.listitem(l);
    }
    let s = e ? "ol" : "ul", i = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + i + `>
` + r + "</" + s + `>
`;
  }
  listitem(n) {
    return `<li>${this.parser.parse(n.tokens)}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let s = 0; s < n.header.length; s++) t += this.tablecell(n.header[s]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let s = 0; s < n.rows.length; s++) {
      let i = n.rows[s];
      t = "";
      for (let o = 0; o < i.length; o++) t += this.tablecell(i[o]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    let e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${Ie(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    let r = this.parser.parseInline(t), s = ta(n);
    if (s === null) return r;
    n = s;
    let i = '<a href="' + n + '"';
    return e && (i += ' title="' + Ie(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let s = ta(n);
    if (s === null) return Ie(t);
    n = s;
    let i = `<img src="${n}" alt="${Ie(t)}"`;
    return e && (i += ` title="${Ie(e)}"`), i += ">", i;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Ie(n.text);
  }
}, Eo = class {
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
  checkbox({ raw: n }) {
    return n;
  }
}, ve = class Ni {
  constructor(e) {
    B(this, "options");
    B(this, "renderer");
    B(this, "textRenderer");
    this.options = e || Lt, this.options.renderer = this.options.renderer || new ts(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Eo();
  }
  static parse(e, t) {
    return new Ni(t).parse(e);
  }
  static parseInline(e, t) {
    return new Ni(t).parseInline(e);
  }
  parse(e) {
    var r, s;
    this.renderer.parser = this;
    let t = "";
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if ((s = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && s[o.type]) {
        let a = o, c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          t += c || "";
          continue;
        }
      }
      let l = o;
      switch (l.type) {
        case "space": {
          t += this.renderer.space(l);
          break;
        }
        case "hr": {
          t += this.renderer.hr(l);
          break;
        }
        case "heading": {
          t += this.renderer.heading(l);
          break;
        }
        case "code": {
          t += this.renderer.code(l);
          break;
        }
        case "table": {
          t += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          t += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          t += this.renderer.html(l);
          break;
        }
        case "def": {
          t += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          t += this.renderer.text(l);
          break;
        }
        default: {
          let a = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    var s, i;
    this.renderer.parser = this;
    let r = "";
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if ((i = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && i[l.type]) {
        let c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          r += c || "";
          continue;
        }
      }
      let a = l;
      switch (a.type) {
        case "escape": {
          r += t.text(a);
          break;
        }
        case "html": {
          r += t.html(a);
          break;
        }
        case "link": {
          r += t.link(a);
          break;
        }
        case "image": {
          r += t.image(a);
          break;
        }
        case "checkbox": {
          r += t.checkbox(a);
          break;
        }
        case "strong": {
          r += t.strong(a);
          break;
        }
        case "em": {
          r += t.em(a);
          break;
        }
        case "codespan": {
          r += t.codespan(a);
          break;
        }
        case "br": {
          r += t.br(a);
          break;
        }
        case "del": {
          r += t.del(a);
          break;
        }
        case "text": {
          r += t.text(a);
          break;
        }
        default: {
          let c = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return r;
  }
}, ir, hn = (ir = class {
  constructor(n) {
    B(this, "options");
    B(this, "block");
    this.options = n || Lt;
  }
  preprocess(n) {
    return n;
  }
  postprocess(n) {
    return n;
  }
  processAllTokens(n) {
    return n;
  }
  emStrongMask(n) {
    return n;
  }
  provideLexer(n = this.block) {
    return n ? Ce.lex : Ce.lexInline;
  }
  provideParser(n = this.block) {
    return n ? ve.parse : ve.parseInline;
  }
}, B(ir, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), B(ir, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), ir), I0 = class {
  constructor(...n) {
    B(this, "defaults", bo());
    B(this, "options", this.setOptions);
    B(this, "parse", this.parseMarkdown(!0));
    B(this, "parseInline", this.parseMarkdown(!1));
    B(this, "Parser", ve);
    B(this, "Renderer", ts);
    B(this, "TextRenderer", Eo);
    B(this, "Lexer", Ce);
    B(this, "Tokenizer", es);
    B(this, "Hooks", hn);
    this.use(...n);
  }
  walkTokens(n, e) {
    var r, s;
    let t = [];
    for (let i of n) switch (t = t.concat(e.call(this, i)), i.type) {
      case "table": {
        let o = i;
        for (let l of o.header) t = t.concat(this.walkTokens(l.tokens, e));
        for (let l of o.rows) for (let a of l) t = t.concat(this.walkTokens(a.tokens, e));
        break;
      }
      case "list": {
        let o = i;
        t = t.concat(this.walkTokens(o.items, e));
        break;
      }
      default: {
        let o = i;
        (s = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && s[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((l) => {
          let a = o[l].flat(1 / 0);
          t = t.concat(this.walkTokens(a, e));
        }) : o.tokens && (t = t.concat(this.walkTokens(o.tokens, e)));
      }
    }
    return t;
  }
  use(...n) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      let r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((s) => {
        if (!s.name) throw new Error("extension name required");
        if ("renderer" in s) {
          let i = e.renderers[s.name];
          i ? e.renderers[s.name] = function(...o) {
            let l = s.renderer.apply(this, o);
            return l === !1 && (l = i.apply(this, o)), l;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[s.level];
          i ? i.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), t.renderer) {
        let s = this.defaults.renderer || new ts(this.defaults);
        for (let i in t.renderer) {
          if (!(i in s)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let o = i, l = t.renderer[o], a = s[o];
          s[o] = (...c) => {
            let u = l.apply(s, c);
            return u === !1 && (u = a.apply(s, c)), u || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new es(this.defaults);
        for (let i in t.tokenizer) {
          if (!(i in s)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let o = i, l = t.tokenizer[o], a = s[o];
          s[o] = (...c) => {
            let u = l.apply(s, c);
            return u === !1 && (u = a.apply(s, c)), u;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new hn();
        for (let i in t.hooks) {
          if (!(i in s)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let o = i, l = t.hooks[o], a = s[o];
          hn.passThroughHooks.has(i) ? s[o] = (c) => {
            if (this.defaults.async && hn.passThroughHooksRespectAsync.has(i)) return (async () => {
              let d = await l.call(s, c);
              return a.call(s, d);
            })();
            let u = l.call(s, c);
            return a.call(s, u);
          } : s[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let d = await l.apply(s, c);
              return d === !1 && (d = await a.apply(s, c)), d;
            })();
            let u = l.apply(s, c);
            return u === !1 && (u = a.apply(s, c)), u;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        let s = this.defaults.walkTokens, i = t.walkTokens;
        r.walkTokens = function(o) {
          let l = [];
          return l.push(i.call(this, o)), s && (l = l.concat(s.call(this, o))), l;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Ce.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return ve.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, s = { ...this.defaults, ...r }, i = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = n), s.async) return (async () => {
        let o = s.hooks ? await s.hooks.preprocess(e) : e, l = await (s.hooks ? await s.hooks.provideLexer(n) : n ? Ce.lex : Ce.lexInline)(o, s), a = s.hooks ? await s.hooks.processAllTokens(l) : l;
        s.walkTokens && await Promise.all(this.walkTokens(a, s.walkTokens));
        let c = await (s.hooks ? await s.hooks.provideParser(n) : n ? ve.parse : ve.parseInline)(a, s);
        return s.hooks ? await s.hooks.postprocess(c) : c;
      })().catch(i);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let o = (s.hooks ? s.hooks.provideLexer(n) : n ? Ce.lex : Ce.lexInline)(e, s);
        s.hooks && (o = s.hooks.processAllTokens(o)), s.walkTokens && this.walkTokens(o, s.walkTokens);
        let l = (s.hooks ? s.hooks.provideParser(n) : n ? ve.parse : ve.parseInline)(o, s);
        return s.hooks && (l = s.hooks.postprocess(l)), l;
      } catch (o) {
        return i(o);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let r = "<p>An error occurred:</p><pre>" + Ie(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Rt = new I0();
function z(n, e) {
  return Rt.parse(n, e);
}
z.options = z.setOptions = function(n) {
  return Rt.setOptions(n), z.defaults = Rt.defaults, ed(z.defaults), z;
};
z.getDefaults = bo;
z.defaults = Lt;
z.use = function(...n) {
  return Rt.use(...n), z.defaults = Rt.defaults, ed(z.defaults), z;
};
z.walkTokens = function(n, e) {
  return Rt.walkTokens(n, e);
};
z.parseInline = Rt.parseInline;
z.Parser = ve;
z.parser = ve.parse;
z.Renderer = ts;
z.TextRenderer = Eo;
z.Lexer = Ce;
z.lexer = Ce.lex;
z.Tokenizer = es;
z.Hooks = hn;
z.parse = z;
z.options;
z.setOptions;
z.use;
z.walkTokens;
z.parseInline;
ve.parse;
Ce.lex;
var D0 = /\n[^\S\n]*(?:\n[^\S\n]*)+$/;
function L0(n) {
  return n.flatMap((e, t) => {
    var r;
    if (e.type === "space" || ((r = n[t + 1]) == null ? void 0 : r.type) === "space")
      return [e];
    const s = (e.raw || "").match(D0);
    return s ? [
      { ...e, raw: (e.raw || "").slice(0, -s[0].length) },
      { type: "space", raw: s[0] }
    ] : [e];
  });
}
function P0(n, e) {
  const r = e.split(`
`).flatMap((s) => [s, ""]).map((s) => `${n}${s}`).join(`
`);
  return r.slice(0, r.length - 1);
}
function z0(n, e) {
  const t = [];
  return Array.from(n.entries()).forEach(([r, s]) => {
    if (!e) {
      t.push(r);
      return;
    }
    (e.marks || []).find(
      (o) => o.type === r && Gt(o.attrs, s.attrs)
    ) || t.push(r);
  }), t;
}
function B0(n, e) {
  const t = [];
  return Array.from(e.entries()).forEach(([r, s]) => {
    const i = n.get(r);
    (!i || !Gt(i.attrs, s.attrs)) && t.push({ type: r, mark: s });
  }), t;
}
function $0(n, e, t, r) {
  const s = !t, i = t && (!t.marks || t.marks.length === 0), o = t && t.marks && !r(e, new Map(t.marks.map((a) => [a.type, a]))), l = [];
  return (s || i || o) && (t && t.marks ? Array.from(n.entries()).reverse().forEach(([a, c]) => {
    t.marks.find(
      (d) => d.type === a && Gt(d.attrs, c.attrs)
    ) || l.push(a);
  }) : (s || i) && l.push(...Array.from(n.keys()).reverse())), l;
}
function _0(n, e) {
  let t = "";
  return Array.from(n.keys()).reverse().forEach((r) => {
    const s = n.get(r), i = e(r, s);
    i && (t = i + t);
  }), n.clear(), t;
}
function F0(n, e, t) {
  let r = "";
  return Array.from(n.entries()).forEach(([s, i]) => {
    const o = t(s, i);
    o && (r += o), e.set(s, i);
  }), r;
}
function Js(n) {
  const t = (n.raw || n.text || "").match(/^(\s*)[-+*]\s+\[([ xX])\]\s+/);
  return t ? { isTask: !0, checked: t[2].toLowerCase() === "x", indentLevel: t[1].length } : { isTask: !1, indentLevel: 0 };
}
function sr(n, e) {
  return typeof n != "string" ? "json" : e;
}
var H0 = /* @__PURE__ */ new Set([
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "circle",
  "clippath",
  "defs",
  "ellipse",
  "foreignobject",
  "g",
  "image",
  "line",
  "lineargradient",
  "mask",
  "path",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "switch",
  "symbol",
  "textpath",
  "tspan",
  "use",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), V0 = /<\/?([a-zA-Z][\w-]*)/g;
function j0(n) {
  const e = [];
  let t;
  for (; (t = V0.exec(n)) !== null; )
    e.push(t[1].toLowerCase());
  return e;
}
function W0(n) {
  const e = n.toLowerCase();
  return e.includes("-") ? !1 : !H0.has(e);
}
function q0(n, e) {
  return j0(n).some((r) => W0(r) ? !e.has(r) : !1);
}
var U0 = class {
  /**
   * Create a MarkdownManager.
   * @param options.marked Optional marked instance to use (injected).
   * @param options.markedOptions Optional options to pass to marked.setOptions
   * @param options.indentation Indentation settings (style and size).
   * @param options.extensions An array of Tiptap extensions to register for markdown parsing and rendering.
   */
  constructor(n) {
    this.activeParseLexer = null, this.extensionRanks = /* @__PURE__ */ new Map(), this.baseExtensions = [], this.extensions = [], this.codeTypes = /* @__PURE__ */ new Set(), this.schemaParseDomTagsCache = null, this.lastParseResult = null;
    var e, t, r, s, i;
    this.markedInstance = (e = n == null ? void 0 : n.marked) != null ? e : z, this.indentStyle = (r = (t = n == null ? void 0 : n.indentation) == null ? void 0 : t.style) != null ? r : "space", this.indentSize = (i = (s = n == null ? void 0 : n.indentation) == null ? void 0 : s.size) != null ? i : 2, this.baseExtensions = (n == null ? void 0 : n.extensions) || [], n != null && n.markedOptions && typeof this.markedInstance.setOptions == "function" && this.markedInstance.setOptions(n.markedOptions), this.registry = /* @__PURE__ */ new Map(), this.nodeTypeRegistry = /* @__PURE__ */ new Map(), n != null && n.extensions && (this.baseExtensions = n.extensions, Vt(fs(n.extensions)).forEach((l) => this.registerExtension(l)));
  }
  /** Returns the underlying marked instance. */
  get instance() {
    return this.markedInstance;
  }
  /** Returns the correct indentCharacter (space or tab) */
  get indentCharacter() {
    return this.indentStyle === "space" ? " " : "	";
  }
  /** Returns the correct indentString repeated X times */
  get indentString() {
    return this.indentCharacter.repeat(this.indentSize);
  }
  /** Helper to quickly check whether a marked instance is available. */
  hasMarked() {
    return !!this.markedInstance;
  }
  /**
   * Register a Tiptap extension (Node/Mark/Extension). This will read
   * `markdownName`, `parseMarkdown`, `renderMarkdown` and `priority` from the
   * extension config (using the same resolution used across the codebase).
   */
  registerExtension(n) {
    var e, t;
    this.extensions.push(n);
    const r = P(v(n, "code")), s = n.name;
    r && this.codeTypes.add(s), this.extensionRanks.has(s) || this.extensionRanks.set(s, this.extensionRanks.size);
    const i = v(
      n,
      "markdownTokenName"
    ) || s, o = v(n, "parseMarkdown"), l = v(n, "renderMarkdown"), a = v(n, "markdownTokenizer"), c = (e = v(n, "markdownOptions")) != null ? e : null, u = (t = c == null ? void 0 : c.indentsContent) != null ? t : !1, d = c == null ? void 0 : c.htmlReopen, f = {
      tokenName: i,
      nodeName: s,
      parseMarkdown: o,
      renderMarkdown: l,
      isIndenting: u,
      htmlReopen: d,
      tokenizer: a
    };
    if (i && o) {
      const h = this.registry.get(i) || [];
      h.push(f), this.registry.set(i, h);
    }
    if (l) {
      const h = this.nodeTypeRegistry.get(s) || [];
      h.push(f), this.nodeTypeRegistry.set(s, h);
    }
    a && this.hasMarked() && this.registerTokenizer(a);
  }
  createLexer() {
    return new this.markedInstance.Lexer(this.markedInstance.defaults);
  }
  createTokenizerHelpers(n) {
    return {
      inlineTokens: (e) => n.inlineTokens(e),
      blockTokens: (e) => n.blockTokens(e)
    };
  }
  tokenizeInline(n) {
    var e;
    return ((e = this.activeParseLexer) != null ? e : this.createLexer()).inlineTokens(n);
  }
  /**
   * Register a custom tokenizer with marked.js for parsing non-standard markdown syntax.
   */
  registerTokenizer(n) {
    if (!this.hasMarked())
      return;
    const { name: e, start: t, level: r = "inline", tokenize: s } = n, i = this.createTokenizerHelpers.bind(this), o = this.createLexer.bind(this);
    let l;
    t ? l = typeof t == "function" ? t : (c) => c.indexOf(t) : l = (c) => {
      const u = s(c, [], this.createTokenizerHelpers(this.createLexer()));
      return u && u.raw ? c.indexOf(u.raw) : -1;
    };
    const a = {
      name: e,
      level: r,
      start: l,
      tokenizer(c, u) {
        const d = this.lexer ? i(this.lexer) : i(o()), f = s(c, u, d);
        if (f && f.type)
          return {
            ...f,
            type: f.type || e,
            raw: f.raw || "",
            tokens: f.tokens || []
          };
      },
      childTokens: []
    };
    this.markedInstance.use({
      extensions: [a]
    });
  }
  /** Get registered handlers for a token type and try each until one succeeds. */
  getHandlersForToken(n) {
    try {
      return this.registry.get(n) || [];
    } catch {
      return [];
    }
  }
  /** Get the first handler for a token type (for backwards compatibility). */
  getHandlerForToken(n) {
    const e = this.getHandlersForToken(n);
    if (e.length > 0)
      return e[0];
    const t = this.getHandlersForNodeType(n);
    return t.length > 0 ? t[0] : void 0;
  }
  /** Get registered handlers for a node type (for rendering). */
  getHandlersForNodeType(n) {
    try {
      return this.nodeTypeRegistry.get(n) || [];
    } catch {
      return [];
    }
  }
  /**
   * Serialize a ProseMirror-like JSON document (or node array) to a Markdown string
   * using registered renderers and fallback renderers.
   */
  serialize(n) {
    if (!n)
      return "";
    const e = this.renderNodes(n, n);
    return this.isEmptyOutput(e) ? "" : e;
  }
  /**
   * Check if the markdown output represents an empty document.
   * Empty documents may contain only &nbsp; entities or non-breaking space characters
   * which are used by the Paragraph extension to preserve blank lines.
   */
  isEmptyOutput(n) {
    return !n || n.trim() === "" ? !0 : n.replace(/&nbsp;/g, "").replace(/\u00A0/g, "").trim() === "";
  }
  /**
   * Parse markdown string into Tiptap JSON document using registered extension handlers.
   */
  parse(n) {
    if (!this.hasMarked())
      throw new Error("No marked instance available for parsing");
    const e = this.activeParseLexer, t = this.createLexer();
    this.activeParseLexer = t;
    try {
      const r = t.lex(n);
      return {
        type: "doc",
        content: this.parseTokens(r, !0)
      };
    } finally {
      this.activeParseLexer = e;
    }
  }
  /**
   * Convert an array of marked tokens into Tiptap JSON nodes using registered extension handlers.
   */
  parseTokens(n, e = !1) {
    const t = e ? L0(n) : n, r = t.reduce((o, l, a) => (l.type !== "space" && o.push(a), o), []);
    let s = -1, i = 0;
    return t.flatMap((o, l) => {
      for (var a; i < r.length && r[i] < l; )
        s = r[i], i += 1;
      if (e && o.type === "space") {
        const u = (a = r[i]) != null ? a : -1;
        return this.createImplicitEmptyParagraphsFromSpace(
          o,
          s,
          u
        );
      }
      const c = this.parseToken(o, e);
      return c === null ? [] : Array.isArray(c) ? c : [c];
    });
  }
  createImplicitEmptyParagraphsFromSpace(n, e, t) {
    const r = this.countParagraphSeparators(n.raw || "");
    if (r === 0)
      return [];
    const i = Math.max(r - (e === -1 || t === -1 ? 0 : 1), 0);
    return Array.from({ length: i }, () => ({ type: "paragraph", content: [] }));
  }
  countParagraphSeparators(n) {
    return (n.replace(/\r\n/g, `
`).match(/\n\n/g) || []).length;
  }
  /**
   * Parse a single token into Tiptap JSON using the appropriate registered handler.
   */
  parseToken(n, e = !1) {
    if (!n.type)
      return null;
    if (n.type === "list")
      return this.parseListToken(n);
    const t = this.getHandlersForToken(n.type), r = this.createParseHelpers();
    if (t.find((i) => {
      if (!i.parseMarkdown)
        return !1;
      const o = i.parseMarkdown(n, r), l = this.normalizeParseResult(o);
      return l && (!Array.isArray(l) || l.length > 0) ? (this.lastParseResult = l, !0) : !1;
    }) && this.lastParseResult) {
      const i = this.lastParseResult;
      return this.lastParseResult = null, i;
    }
    return this.parseFallbackToken(n, e);
  }
  /**
   * Parse a list token, handling mixed bullet and task list items by splitting them into separate lists.
   * This ensures that consecutive task items and bullet items are grouped and parsed as separate list nodes.
   *
   * @param token The list token to parse
   * @returns Array of parsed list nodes, or null if parsing fails
   */
  parseListToken(n) {
    if (!n.items || n.items.length === 0)
      return this.parseTokenWithHandlers(n);
    const e = n.items.some((l) => Js(l).isTask), t = n.items.some((l) => !Js(l).isTask);
    if (!e || !t || this.getHandlersForToken("taskList").length === 0)
      return this.parseTokenWithHandlers(n);
    const r = [];
    let s = [], i = null;
    for (let l = 0; l < n.items.length; l += 1) {
      const a = n.items[l], { isTask: c, checked: u, indentLevel: d } = Js(a);
      let f = a;
      if (c) {
        const m = (a.raw || a.text || "").split(`
`), g = m[0].match(/^\s*[-+*]\s+\[([ xX])\]\s+(.*)$/), y = g ? g[2] : "";
        let k = [];
        if (m.length > 1 && m.slice(1).join(`
`).trim()) {
          const T = m.slice(1), x = T.filter((E) => E.trim());
          if (x.length > 0) {
            const E = Math.min(
              ...x.map((R) => R.length - R.trimStart().length)
            ), A = T.map((R) => R.trim() ? R.slice(E) : "").join(`
`).trim();
            A && (k = this.markedInstance.lexer(`${A}
`));
          }
        }
        f = {
          type: "taskItem",
          raw: "",
          mainContent: y,
          indentLevel: d,
          checked: u ?? !1,
          text: y,
          tokens: this.tokenizeInline(y),
          nestedTokens: k
        };
      }
      const h = c ? "taskList" : "list";
      i !== h ? (s.length > 0 && r.push({ type: i, items: s }), s = [f], i = h) : s.push(f);
    }
    s.length > 0 && r.push({ type: i, items: s });
    const o = [];
    for (let l = 0; l < r.length; l += 1) {
      const a = r[l], c = { ...n, type: a.type, items: a.items }, u = this.parseToken(c);
      u && (Array.isArray(u) ? o.push(...u) : o.push(u));
    }
    return o.length > 0 ? o : null;
  }
  /**
   * Parse a token using registered handlers (extracted for reuse).
   */
  parseTokenWithHandlers(n) {
    if (!n.type)
      return null;
    const e = this.getHandlersForToken(n.type), t = this.createParseHelpers();
    if (e.find((s) => {
      if (!s.parseMarkdown)
        return !1;
      const i = s.parseMarkdown(n, t), o = this.normalizeParseResult(i);
      return o && (!Array.isArray(o) || o.length > 0) ? (this.lastParseResult = o, !0) : !1;
    }) && this.lastParseResult) {
      const s = this.lastParseResult;
      return this.lastParseResult = null, s;
    }
    return this.parseFallbackToken(n);
  }
  /**
   * Creates helper functions for parsing markdown tokens.
   * @returns An object containing helper functions for parsing.
   */
  createParseHelpers() {
    return {
      parseInline: (n) => this.parseInlineTokens(n),
      tokenizeInline: (n) => this.tokenizeInline(n),
      parseChildren: (n) => this.parseTokens(n),
      parseBlockChildren: (n) => this.parseTokens(n, !0),
      createTextNode: (n, e) => ({
        type: "text",
        text: n,
        marks: e || void 0
      }),
      createNode: (n, e, t) => {
        const r = {
          type: n,
          attrs: e || void 0,
          content: t || void 0
        };
        return (!e || Object.keys(e).length === 0) && delete r.attrs, r;
      },
      applyMark: (n, e, t) => ({
        mark: n,
        content: e,
        attrs: t && Object.keys(t).length > 0 ? t : void 0
      })
    };
  }
  /**
   * Escape special regex characters in a string.
   */
  escapeRegex(n) {
    return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  /**
   * Parse inline tokens (bold, italic, links, etc.) into text nodes with marks.
   * This is the complex part that handles mark nesting and boundaries.
   */
  parseInlineTokens(n) {
    var e, t, r, s;
    const i = [];
    for (let o = 0; o < n.length; o += 1) {
      const l = n[o];
      if (l.type === "text")
        i.push({
          type: "text",
          text: Pl(l.text || "")
        });
      else if (l.type === "escape")
        i.push({
          type: "text",
          text: l.text || ""
        });
      else if (l.type === "html") {
        const a = ((t = (e = l.raw) != null ? e : l.text) != null ? t : "").toString(), c = /^<\/[\s]*[\w-]+/i.test(a), u = a.match(/^<[\s]*([\w-]+)(\s|>|\/|$)/i);
        if (!c && u && !/\/>$/.test(a)) {
          const f = u[1], h = this.escapeRegex(f), p = new RegExp(`^<\\/\\s*${h}\\b`, "i");
          let m = -1;
          const g = [a];
          for (let y = o + 1; y < n.length; y += 1) {
            const k = n[y], S = ((s = (r = k.raw) != null ? r : k.text) != null ? s : "").toString();
            if (g.push(S), k.type === "html" && p.test(S)) {
              m = y;
              break;
            }
          }
          if (m !== -1) {
            const y = g.join(""), k = {
              type: "html",
              raw: y,
              text: y,
              block: !1
            }, S = this.parseHTMLToken(k);
            if (S) {
              const T = this.normalizeParseResult(S);
              Array.isArray(T) ? i.push(...T) : T && i.push(T);
            }
            o = m;
            continue;
          }
        }
        const d = this.parseHTMLToken(l);
        if (d) {
          const f = this.normalizeParseResult(d);
          Array.isArray(f) ? i.push(...f) : f && i.push(f);
        }
      } else if (l.type) {
        const a = this.getHandlerForToken(l.type);
        if (a && a.parseMarkdown) {
          const c = this.createParseHelpers(), u = a.parseMarkdown(l, c);
          if (this.isMarkResult(u)) {
            const d = this.applyMarkToContent(u.mark, u.content, u.attrs);
            i.push(...d);
          } else {
            const d = this.normalizeParseResult(u);
            Array.isArray(d) ? i.push(...d) : d && i.push(d);
          }
        } else l.tokens && i.push(...this.parseInlineTokens(l.tokens));
      }
    }
    for (let o = i.length - 1; o > 0; o -= 1) {
      const l = i[o], a = i[o - 1];
      if (l.type === "text" && a.type === "text") {
        const c = l.marks || [], u = a.marks || [];
        cg(c, u) && (a.text = (a.text || "") + (l.text || ""), i.splice(o, 1));
      }
    }
    return i;
  }
  /**
   * Apply a mark to content nodes.
   */
  applyMarkToContent(n, e, t) {
    return e.map((r) => {
      if (r.type === "text") {
        const s = r.marks || [], i = t ? { type: n, attrs: t } : { type: n };
        return {
          ...r,
          marks: [...s, i]
        };
      }
      return {
        ...r,
        content: r.content ? this.applyMarkToContent(n, r.content, t) : void 0
      };
    });
  }
  /**
  * Check if a parse result represents a mark to be applied.
  */
  isMarkResult(n) {
    return n && typeof n == "object" && "mark" in n;
  }
  /**
   * Normalize parse results to ensure they're valid JSONContent.
   */
  normalizeParseResult(n) {
    return n ? this.isMarkResult(n) ? n.content : n : null;
  }
  /**
   * Fallback parsing for common tokens when no specific handler is registered.
   */
  parseFallbackToken(n, e = !1) {
    switch (n.type) {
      case "paragraph":
        return {
          type: "paragraph",
          content: n.tokens ? this.parseInlineTokens(n.tokens) : []
        };
      case "heading":
        return {
          type: "heading",
          attrs: { level: n.depth || 1 },
          content: n.tokens ? this.parseInlineTokens(n.tokens) : []
        };
      case "text":
        return {
          type: "text",
          text: Pl(n.text || "")
        };
      case "html":
        return this.parseHTMLToken(n);
      case "escape":
        return {
          type: "text",
          text: n.text || ""
        };
      case "space":
        return null;
      default:
        return n.tokens ? this.parseTokens(n.tokens, e) : null;
    }
  }
  /**
   * Parse an HTML token from marked into JSONContent using the registered
   * extensions' `parseHTML` rules. Falls back to literal text when the HTML
   * has nothing for the schema to keep.
   *
   * @param token Marked HTML token (block or inline).
   * @example
   *   parseHTMLToken({ type: 'html', raw: '<em>hi</em>', block: false })
   *   // → text node with an italic mark
   */
  parseHTMLToken(n) {
    const e = n.text || n.raw || "";
    if (!e.trim())
      return null;
    if (this.isUnrecognizedHtml(e))
      return this.htmlAsLiteralText(e, !!n.block);
    if (typeof window > "u" || typeof window.DOMParser > "u")
      return this.htmlAsLiteralText(e, !!n.block);
    try {
      const t = ym(e, this.baseExtensions);
      return t.type === "doc" && t.content ? n.block ? t.content : t.content.length === 1 && t.content[0].type === "paragraph" && t.content[0].content ? t.content[0].content : t.content : t;
    } catch (t) {
      throw new Error(`Failed to parse HTML in markdown: ${t}`);
    }
  }
  /**
   * Returns true when the HTML contains a tag that is neither a standard
   * HTML/SVG element nor declared in a registered extension's parseDOM rules.
   *
   * Recognized but empty elements such as `<em></em>` or `<span></span>`,
   * and hyphenated custom elements like `<my-mention>`, are not considered
   * unrecognized.
   *
   * @param html Raw HTML string from a marked token.
   * @example
   *   isUnrecognizedHtml('<enter foo bar>')  // → true
   *   isUnrecognizedHtml('<em></em>')        // → false (empty, but real tag)
   *   isUnrecognizedHtml('<em>hi</em>')      // → false
   *   isUnrecognizedHtml('<my-el></my-el>')  // → false (valid custom element)
   *   isUnrecognizedHtml('<br>')             // → false
   */
  isUnrecognizedHtml(n) {
    return q0(n, this.getSchemaParseDomTags());
  }
  /**
   * Collect the lower-cased tag names declared by the registered extensions'
   * parseDOM rules, so custom node/mark elements that use non-hyphenated,
   * non-standard tag names are treated as recognized HTML. Result is cached for the
   * lifetime of the manager since extensions don't change after registration.
   *
   * @example
   *   // After registering an extension with parseDOM [{ tag: 'something' }]
   *   getSchemaParseDomTags().has('something') // → true
   */
  getSchemaParseDomTags() {
    if (this.schemaParseDomTagsCache)
      return this.schemaParseDomTagsCache;
    const n = /* @__PURE__ */ new Set();
    try {
      const e = Gc(this.baseExtensions), t = (r) => {
        const s = r == null ? void 0 : r.parseDOM;
        Array.isArray(s) && s.forEach((i) => {
          if (typeof (i == null ? void 0 : i.tag) == "string") {
            const o = i.tag.match(/^[a-zA-Z][\w-]*/);
            o && n.add(o[0].toLowerCase());
          }
        });
      };
      Object.values(e.nodes).forEach((r) => t(r.spec)), Object.values(e.marks).forEach((r) => t(r.spec));
    } catch {
    }
    return this.schemaParseDomTagsCache = n, n;
  }
  /**
   * Build a JSONContent that preserves the original HTML markup as literal
   * text. Used when the HTML would otherwise be silently dropped during
   * schema-aware parsing.
   *
   * @param html Raw HTML string to preserve verbatim.
   * @param isBlock Whether to wrap the text in a paragraph node (block tokens)
   *   or return it as a bare text node (inline tokens).
   * @example
   *   htmlAsLiteralText('<enter foo>', true)
   *   // → { type: 'paragraph', content: [{ type: 'text', text: '<enter foo>' }] }
   */
  htmlAsLiteralText(n, e) {
    const t = n.replace(/\s+$/, "");
    return t ? e ? {
      type: "paragraph",
      content: [{ type: "text", text: t }]
    } : { type: "text", text: t } : null;
  }
  /**
   * Encode HTML entities in text unless the node is inside a code context
   * (code mark or code-block parent) where literal characters should be preserved.
   * Also backslash-escape markdown-significant characters in non-code text to
   * prevent them from being misinterpreted as formatting delimiters.
   */
  encodeTextForMarkdown(n, e, t) {
    return (t == null ? void 0 : t.type) != null && this.codeTypes.has(t.type) || (e.marks || []).some((s) => this.codeTypes.has(typeof s == "string" ? s : s.type)) ? n : this.escapeMarkdownSyntax(eg(n));
  }
  /**
   * Backslash-escape characters that have special meaning in markdown inline
   * syntax. This prevents literal characters in text nodes from being
   * misinterpreted as formatting delimiters when the output is parsed again.
   *
   * The set covers the most common inline markdown syntax characters.
   * Characters inside code blocks/code marks are skipped by the caller
   * (`encodeTextForMarkdown`) via the existing `isInsideCode` guard.
   */
  escapeMarkdownSyntax(n) {
    return n.replace(/([\\`*_[\]~])/g, "\\$1");
  }
  renderNodeToMarkdown(n, e, t = 0, r = 0, s = {}) {
    var i;
    if (n.type === "text")
      return this.encodeTextForMarkdown(n.text || "", n, e);
    if (!n.type)
      return "";
    const o = this.getHandlerForToken(n.type);
    if (!o)
      return "";
    const l = Array.isArray(e == null ? void 0 : e.content) && t > 0 ? e.content[t - 1] : void 0, a = {
      renderChildren: (d, f) => {
        const h = o.isIndenting ? r + 1 : r;
        return !Array.isArray(d) && d.content ? this.renderNodes(
          d.content,
          n,
          f || "",
          t,
          h
        ) : this.renderNodes(d, n, f || "", t, h);
      },
      renderChild: (d, f) => {
        const h = o.isIndenting ? r + 1 : r;
        return this.renderNodeToMarkdown(d, n, f, h);
      },
      indent: (d) => this.indentString + d,
      wrapInBlock: P0
    }, c = {
      index: t,
      level: r,
      parentType: e == null ? void 0 : e.type,
      previousNode: l,
      meta: {
        parentAttrs: e == null ? void 0 : e.attrs,
        ...s
      }
    };
    return ((i = o.renderMarkdown) == null ? void 0 : i.call(o, n, a, c)) || "";
  }
  /**
   * Render a node or an array of nodes. Parent type controls how children
   * are joined (which determines newline insertion between children).
   */
  renderNodes(n, e, t = "", r = 0, s = 0) {
    return Array.isArray(n) ? this.renderNodesWithMarkBoundaries(n, e, t, s) : n.type ? this.renderNodeToMarkdown(n, e, r, s) : "";
  }
  /**
   * Render an array of nodes while properly tracking mark boundaries.
   * This handles cases where marks span across multiple text nodes.
   */
  renderNodesWithMarkBoundaries(n, e, t = "", r = 0) {
    const s = [], i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map();
    return n.forEach((a, c) => {
      const u = c < n.length - 1 ? n[c + 1] : null;
      if (a.type)
        if (a.type === "text") {
          let d = this.encodeTextForMarkdown(a.text || "", a, e);
          const f = new Map((a.marks || []).map((x) => [x.type, x])), h = this.getMarksToOpenForSerialization(i, f, u), p = z0(f, u), m = p.filter((x) => i.has(x)), g = m.length > 0 && h.length > 0;
          let y = "";
          if (p.length > 0 && !g) {
            const x = d.match(/(\s+)$/);
            x && (y = x[1], d = d.slice(0, -y.length));
          }
          g || p.slice().reverse().forEach((x) => {
            if (!i.has(x))
              return;
            const E = f.get(x), M = this.getMarkClosing(
              x,
              E,
              l.get(x)
            );
            M && (d += M), i.has(x) && (i.delete(x), l.delete(x));
          });
          let k = "";
          if (h.length > 0) {
            const x = d.match(/^(\s+)/);
            x && (k = x[1], d = d.slice(k.length));
          }
          h.forEach(({ type: x, mark: E }) => {
            const M = o.has(x) ? "html" : "markdown", A = this.getMarkOpening(x, E, M);
            A && (d = A + d), l.set(x, M), o.delete(x);
          }), g || h.slice().reverse().forEach(({ type: x, mark: E }) => {
            i.set(x, E);
          }), d = k + d;
          let S;
          if (g) {
            const x = new Set(((u == null ? void 0 : u.marks) || []).map((A) => A.type));
            h.forEach(({ type: A }) => {
              x.has(A) && this.getHtmlReopenTags(A) && o.add(A);
            });
            const E = Array.from(i.keys()), M = m.slice().sort((A, R) => E.indexOf(R) - E.indexOf(A));
            S = [
              ...h.map((A) => A.type),
              // inner (opened here) — close first
              ...M
              // outer (were active before) — close last, LIFO
            ];
          } else
            S = $0(
              i,
              f,
              u,
              this.markSetsEqual.bind(this)
            );
          let T = "";
          if (S.length > 0) {
            const x = d.match(/(\s+)$/);
            x && (T = x[1], d = d.slice(0, -T.length));
          }
          S.forEach((x) => {
            var E;
            const M = (E = i.get(x)) != null ? E : f.get(x), A = this.getMarkClosing(x, M, l.get(x));
            A && (d += A), i.delete(x), l.delete(x);
          }), d += T, d += y, s.push(d);
        } else {
          const d = new Set((a.marks || []).map((y) => y.type)), f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
          i.forEach((y, k) => {
            var S;
            d.has(k) && (f.set(k, y), h.set(k, (S = l.get(k)) != null ? S : "markdown"));
          });
          const p = _0(i, (y, k) => this.getMarkClosing(y, k, l.get(y)));
          l.clear();
          const m = this.renderNodeToMarkdown(a, e, c, r), g = a.type === "hardBreak" ? "" : F0(f, i, (y, k) => {
            var S;
            const T = (S = h.get(y)) != null ? S : "markdown";
            return l.set(y, T), this.getMarkOpening(y, k, T);
          });
          s.push(p + m + g);
        }
    }), s.join(t);
  }
  /**
   * Get the opening markdown syntax for a mark type.
   */
  getMarkOpening(n, e, t = "markdown") {
    var r;
    if (t === "html")
      return ((r = this.getHtmlReopenTags(n)) == null ? void 0 : r.open) || "";
    const s = this.getHandlersForNodeType(n), i = s.length > 0 ? s[0] : void 0;
    if (!i || !i.renderMarkdown)
      return "";
    const o = "__TIPTAP_MARKDOWN_PLACEHOLDER__", l = {
      type: n,
      attrs: e.attrs || {},
      content: [{ type: "text", text: o }]
    };
    try {
      const a = i.renderMarkdown(
        l,
        {
          renderChildren: () => o,
          renderChild: () => o,
          indent: (u) => u,
          wrapInBlock: (u, d) => u + d
        },
        { index: 0, level: 0, parentType: "text", meta: {} }
      ), c = a.indexOf(o);
      return c >= 0 ? a.substring(0, c) : "";
    } catch (a) {
      throw new Error(`Failed to get mark opening for ${n}: ${a}`);
    }
  }
  /**
   * Get the closing markdown syntax for a mark type.
   */
  getMarkClosing(n, e, t = "markdown") {
    var r;
    if (t === "html")
      return ((r = this.getHtmlReopenTags(n)) == null ? void 0 : r.close) || "";
    const s = this.getHandlersForNodeType(n), i = s.length > 0 ? s[0] : void 0;
    if (!i || !i.renderMarkdown)
      return "";
    const o = "__TIPTAP_MARKDOWN_PLACEHOLDER__", l = {
      type: n,
      attrs: e.attrs || {},
      content: [{ type: "text", text: o }]
    };
    try {
      const a = i.renderMarkdown(
        l,
        {
          renderChildren: () => o,
          renderChild: () => o,
          indent: (d) => d,
          wrapInBlock: (d, f) => d + f
        },
        { index: 0, level: 0, parentType: "text", meta: {} }
      ), c = a.indexOf(o), u = c + o.length;
      return c >= 0 ? a.substring(u) : "";
    } catch (a) {
      throw new Error(`Failed to get mark closing for ${n}: ${a}`);
    }
  }
  /**
   * Returns the inline HTML tags an extension exposes for overlap-boundary
   * reopen handling, if that mark explicitly opted into HTML reopen mode.
   */
  getHtmlReopenTags(n) {
    const e = this.getHandlersForNodeType(n), t = e.length > 0 ? e[0] : void 0;
    return t == null ? void 0 : t.htmlReopen;
  }
  /**
   * Check if two mark sets are equal (same types and matching attributes).
   */
  markSetsEqual(n, e) {
    return n.size !== e.size ? !1 : Array.from(n.entries()).every(([t, r]) => {
      const s = e.get(t);
      return s && Gt(r.attrs, s.attrs);
    });
  }
  /**
   * Decide the order in which marks open on the current text node.
   *
   * The returned array is iterated head-first when prepending opening
   * delimiters, so the first entry becomes the innermost mark in the emitted
   * markdown and the last becomes the outermost. Two stable signals drive
   * the order — neither one inspects any rendered markdown:
   *
   *   1. Marks that end on this node must be inner relative to marks that
   *      continue into the next node, otherwise the delimiters interleave
   *      instead of nesting.
   *   2. Within each lifetime group, marks are sorted so that lower
   *      registration ranks (i.e. higher Tiptap extension priorities) end up
   *      outermost. ProseMirror assigns mark ranks in the same priority-aware
   *      order Tiptap uses when building the schema, so link (priority 1000)
   *      naturally wraps bold/italic without the serializer needing to peek
   *      at how any particular mark renders.
   */
  getMarksToOpenForSerialization(n, e, t) {
    const r = B0(n, e);
    if (r.length <= 1)
      return r;
    const s = (t == null ? void 0 : t.marks) || [], i = (c, u) => s.some((d) => d.type === c && Gt(d.attrs, u)), o = (c, u) => {
      var d, f;
      const h = (d = this.extensionRanks.get(c.type)) != null ? d : Number.MAX_SAFE_INTEGER, p = (f = this.extensionRanks.get(u.type)) != null ? f : Number.MAX_SAFE_INTEGER;
      return h !== p ? p - h : c.type.localeCompare(u.type);
    }, l = r.filter((c) => !i(c.type, c.mark.attrs)).sort(o), a = r.filter((c) => i(c.type, c.mark.attrs)).sort(o);
    return [...l, ...a];
  }
}, sa = U0, K0 = V.create({
  name: "markdown",
  addOptions() {
    return {
      indentation: { style: "space", size: 2 },
      marked: void 0,
      markedOptions: {}
    };
  },
  addCommands() {
    return {
      setContent: (n, e) => {
        if (!(e != null && e.contentType) || sr(n, e == null ? void 0 : e.contentType) !== "markdown" || !this.editor.markdown)
          return Me.setContent(n, e);
        const r = this.editor.markdown.parse(n);
        return Me.setContent(r, e);
      },
      insertContent: (n, e) => {
        if (!(e != null && e.contentType) || sr(n, e == null ? void 0 : e.contentType) !== "markdown" || !this.editor.markdown)
          return Me.insertContent(n, e);
        const r = this.editor.markdown.parse(n);
        return Me.insertContent(r, e);
      },
      insertContentAt: (n, e, t) => {
        if (!(t != null && t.contentType) || sr(e, t == null ? void 0 : t.contentType) !== "markdown" || !this.editor.markdown)
          return Me.insertContentAt(n, e, t);
        const s = this.editor.markdown.parse(e);
        return Me.insertContentAt(n, s, t);
      }
    };
  },
  addStorage() {
    return {
      manager: new sa({
        indentation: this.options.indentation,
        marked: this.options.marked,
        markedOptions: this.options.markedOptions,
        extensions: []
      })
    };
  },
  onBeforeCreate() {
    var n;
    if (this.editor.markdown) {
      console.error(
        "[tiptap][markdown]: There is already a `markdown` property on the editor instance. This might lead to unexpected behavior."
      );
      return;
    }
    if (this.storage.manager = new sa({
      indentation: this.options.indentation,
      marked: this.options.marked,
      markedOptions: this.options.markedOptions,
      extensions: this.editor.extensionManager.baseExtensions
    }), this.editor.markdown = this.storage.manager, this.editor.getMarkdown = () => this.storage.manager.serialize(this.editor.getJSON()), !this.editor.options.contentType || sr(
      this.editor.options.content,
      this.editor.options.contentType
    ) !== "markdown")
      return;
    if (!this.editor.markdown)
      throw new Error(
        '[tiptap][markdown]: The `contentType` option is set to "markdown", but the Markdown extension is not added to the editor. Please add the Markdown extension to use this feature.'
      );
    if (this.editor.options.content === void 0 || typeof this.editor.options.content != "string")
      throw new Error(
        '[tiptap][markdown]: The `contentType` option is set to "markdown", but the initial content is not a string. Please provide the initial content as a markdown string.'
      );
    const t = this.editor.markdown.parse(this.editor.options.content);
    (n = t.content) != null && n.length && (this.editor.options.content = t);
  }
}), J0 = Bk;
let dt = /* @__PURE__ */ new Map();
function G0(n, e, t, r) {
  const s = document.getElementById(n);
  if (!s) return null;
  const i = new xg({
    element: s,
    extensions: [
      qk.configure({
        codeBlock: !1,
        heading: { levels: [1, 2, 3] }
      }),
      K0.configure({ breaks: !0 }),
      J0.configure({ placeholder: "" })
    ],
    content: e || "",
    contentType: "markdown",
    editable: !0,
    editorProps: {
      attributes: {
        class: "tiptap-editor",
        "data-block-id": r
      }
    },
    onUpdate: ({ editor: o }) => {
      const l = o.storage.markdown.getMarkdown();
      t.invokeMethodAsync("OnMarkdownChanged", r, l);
    },
    onFocus: () => t.invokeMethodAsync("OnFocus", r),
    onBlur: () => t.invokeMethodAsync("OnBlur", r)
  });
  return dt.set(n, i), i;
}
function Q0(n) {
  const e = dt.get(n);
  e && (e.destroy(), dt.delete(n));
}
function X0(n) {
  var t;
  const e = dt.get(n);
  return ((t = e == null ? void 0 : e.storage.markdown) == null ? void 0 : t.getMarkdown()) ?? "";
}
function Z0(n, e) {
  const t = dt.get(n);
  t && t.commands.setContent(e, !1, "markdown");
}
function Y0(n, e) {
  const t = dt.get(n);
  t && t.setEditable(e);
}
function eb(n) {
  const e = dt.get(n);
  e && e.commands.focus();
}
function tb(n) {
  const e = dt.get(n);
  e && e.commands.blur();
}
window.initTipTap = G0;
window.destroyTipTap = Q0;
window.getTipTapMarkdown = X0;
window.setTipTapContent = Z0;
window.setTipTapEditable = Y0;
window.focusTipTap = eb;
window.blurTipTap = tb;
export {
  tb as blurEditor,
  G0 as createEditor,
  Q0 as destroyEditor,
  eb as focusEditor,
  X0 as getMarkdown,
  Z0 as setContent,
  Y0 as setEditable
};
