//#region node_modules/orderedmap/dist/index.js
function e(e) {
	this.content = e;
}
e.prototype = {
	constructor: e,
	find: function(e) {
		for (var t = 0; t < this.content.length; t += 2) if (this.content[t] === e) return t;
		return -1;
	},
	get: function(e) {
		var t = this.find(e);
		return t == -1 ? void 0 : this.content[t + 1];
	},
	update: function(t, n, r) {
		var i = r && r != t ? this.remove(r) : this, a = i.find(t), o = i.content.slice();
		return a == -1 ? o.push(r || t, n) : (o[a + 1] = n, r && (o[a] = r)), new e(o);
	},
	remove: function(t) {
		var n = this.find(t);
		if (n == -1) return this;
		var r = this.content.slice();
		return r.splice(n, 2), new e(r);
	},
	addToStart: function(t, n) {
		return new e([t, n].concat(this.remove(t).content));
	},
	addToEnd: function(t, n) {
		var r = this.remove(t).content.slice();
		return r.push(t, n), new e(r);
	},
	addBefore: function(t, n, r) {
		var i = this.remove(n), a = i.content.slice(), o = i.find(t);
		return a.splice(o == -1 ? a.length : o, 0, n, r), new e(a);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(t) {
		return t = e.from(t), t.size ? new e(t.content.concat(this.subtract(t).content)) : this;
	},
	append: function(t) {
		return t = e.from(t), t.size ? new e(this.subtract(t).content.concat(t.content)) : this;
	},
	subtract: function(t) {
		var n = this;
		t = e.from(t);
		for (var r = 0; r < t.content.length; r += 2) n = n.remove(t.content[r]);
		return n;
	},
	toObject: function() {
		var e = {};
		return this.forEach(function(t, n) {
			e[t] = n;
		}), e;
	},
	get size() {
		return this.content.length >> 1;
	}
}, e.from = function(t) {
	if (t instanceof e) return t;
	var n = [];
	if (t) for (var r in t) n.push(r, t[r]);
	return new e(n);
};
//#endregion
//#region node_modules/prosemirror-model/dist/index.js
function t(e, n, a) {
	for (let o = 0;; o++) {
		if (o == e.childCount || o == n.childCount) return e.childCount == n.childCount ? null : a;
		let s = e.child(o), c = n.child(o);
		if (s == c) {
			a += s.nodeSize;
			continue;
		}
		if (!s.sameMarkup(c)) return a;
		if (s.isText && s.text != c.text) {
			let e = s.text, t = c.text, n = 0;
			for (; e[n] == t[n]; n++) a++;
			return n && n < e.length && n < t.length && i(e.charCodeAt(n - 1)) && r(e.charCodeAt(n)) && a--, a;
		}
		if (s.content.size || c.content.size) {
			let e = t(s.content, c.content, a + 1);
			if (e != null) return e;
		}
		a += s.nodeSize;
	}
}
function n(e, t, a, o) {
	for (let s = e.childCount, c = t.childCount;;) {
		if (s == 0 || c == 0) return s == c ? null : {
			a,
			b: o
		};
		let l = e.child(--s), u = t.child(--c), d = l.nodeSize;
		if (l == u) {
			a -= d, o -= d;
			continue;
		}
		if (!l.sameMarkup(u)) return {
			a,
			b: o
		};
		if (l.isText && l.text != u.text) {
			let e = l.text, t = u.text, n = e.length, s = t.length;
			for (; n > 0 && s > 0 && e[n - 1] == t[s - 1];) n--, s--, a--, o--;
			return n && s && n < e.length && i(e.charCodeAt(n - 1)) && r(e.charCodeAt(n)) && (a++, o++), {
				a,
				b: o
			};
		}
		if (l.content.size || u.content.size) {
			let e = n(l.content, u.content, a - 1, o - 1);
			if (e) return e;
		}
		a -= d, o -= d;
	}
}
function r(e) {
	return e >= 56320 && e < 57344;
}
function i(e) {
	return e >= 55296 && e < 56320;
}
var a = class e {
	constructor(e, t) {
		if (this.content = e, this.size = t || 0, t == null) for (let t = 0; t < e.length; t++) this.size += e[t].nodeSize;
	}
	nodesBetween(e, t, n, r = 0, i) {
		for (let a = 0, o = 0; o < t; a++) {
			let s = this.content[a], c = o + s.nodeSize;
			if (c > e && n(s, r + o, i || null, a) !== !1 && s.content.size) {
				let i = o + 1;
				s.nodesBetween(Math.max(0, e - i), Math.min(s.content.size, t - i), n, r + i);
			}
			o = c;
		}
	}
	descendants(e) {
		this.nodesBetween(0, this.size, e);
	}
	textBetween(e, t, n, r) {
		let i = "", a = !0;
		return this.nodesBetween(e, t, (o, s) => {
			let c = o.isText ? o.text.slice(Math.max(e, s) - s, t - s) : o.isLeaf ? r ? typeof r == "function" ? r(o) : r : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
			o.isBlock && (o.isLeaf && c || o.isTextblock) && n && (a ? a = !1 : i += n), i += c;
		}, 0), i;
	}
	append(t) {
		if (!t.size) return this;
		if (!this.size) return t;
		let n = this.lastChild, r = t.firstChild, i = this.content.slice(), a = 0;
		for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), a = 1); a < t.content.length; a++) i.push(t.content[a]);
		return new e(i, this.size + t.size);
	}
	cut(t, n = this.size) {
		if (t == 0 && n == this.size) return this;
		let r = [], i = 0;
		if (n > t) for (let e = 0, a = 0; a < n; e++) {
			let o = this.content[e], s = a + o.nodeSize;
			s > t && ((a < t || s > n) && (o = o.isText ? o.cut(Math.max(0, t - a), Math.min(o.text.length, n - a)) : o.cut(Math.max(0, t - a - 1), Math.min(o.content.size, n - a - 1))), r.push(o), i += o.nodeSize), a = s;
		}
		return new e(r, i);
	}
	cutByIndex(t, n) {
		return t == n ? e.empty : t == 0 && n == this.content.length ? this : new e(this.content.slice(t, n));
	}
	replaceChild(t, n) {
		let r = this.content[t];
		if (r == n) return this;
		let i = this.content.slice(), a = this.size + n.nodeSize - r.nodeSize;
		return i[t] = n, new e(i, a);
	}
	addToStart(t) {
		return new e([t].concat(this.content), this.size + t.nodeSize);
	}
	addToEnd(t) {
		return new e(this.content.concat(t), this.size + t.nodeSize);
	}
	eq(e) {
		if (this.content.length != e.content.length) return !1;
		for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
		return !0;
	}
	get firstChild() {
		return this.content.length ? this.content[0] : null;
	}
	get lastChild() {
		return this.content.length ? this.content[this.content.length - 1] : null;
	}
	get childCount() {
		return this.content.length;
	}
	child(e) {
		let t = this.content[e];
		if (!t) throw RangeError("Index " + e + " out of range for " + this);
		return t;
	}
	maybeChild(e) {
		return this.content[e] || null;
	}
	forEach(e) {
		for (let t = 0, n = 0; t < this.content.length; t++) {
			let r = this.content[t];
			e(r, n, t), n += r.nodeSize;
		}
	}
	findDiffStart(e, n = 0) {
		return t(this, e, n);
	}
	findDiffEnd(e, t = this.size, r = e.size) {
		return n(this, e, t, r);
	}
	findIndex(e) {
		if (e == 0) return s(0, e);
		if (e == this.size) return s(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? s(t + 1, i) : s(t, n);
			n = i;
		}
	}
	toString() {
		return "<" + this.toStringInner() + ">";
	}
	toStringInner() {
		return this.content.join(", ");
	}
	toJSON() {
		return this.content.length ? this.content.map((e) => e.toJSON()) : null;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		if (!Array.isArray(n)) throw RangeError("Invalid input for Fragment.fromJSON");
		return e.fromArray(n.map(t.nodeFromJSON));
	}
	static fromArray(t) {
		if (!t.length) return e.empty;
		let n, r = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			r += i.nodeSize, e && i.isText && t[e - 1].sameMarkup(i) ? (n ||= t.slice(0, e), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
		}
		return new e(n || t, r);
	}
	static from(t) {
		if (!t) return e.empty;
		if (t instanceof e) return t;
		if (Array.isArray(t)) return this.fromArray(t);
		if (t.attrs) return new e([t], t.nodeSize);
		throw RangeError("Can not convert " + t + " to a Fragment" + (t.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
	}
};
a.empty = new a([], 0);
var o = {
	index: 0,
	offset: 0
};
function s(e, t) {
	return o.index = e, o.offset = t, o;
}
function c(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!c(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !c(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var l = class e {
	constructor(e, t) {
		this.type = e, this.attrs = t;
	}
	addToSet(e) {
		let t, n = !1;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.eq(i)) return e;
			if (this.type.excludes(i.type)) t ||= e.slice(0, r);
			else if (i.type.excludes(this.type)) return e;
			else !n && i.type.rank > this.type.rank && (t ||= e.slice(0, r), t.push(this), n = !0), t && t.push(i);
		}
		return t ||= e.slice(), n || t.push(this), t;
	}
	removeFromSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
		return !1;
	}
	eq(e) {
		return this == e || this.type == e.type && c(this.attrs, e.attrs);
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Mark.fromJSON");
		let n = e.marks[t.type];
		if (!n) throw RangeError(`There is no mark type ${t.type} in this schema`);
		let r = n.create(t.attrs);
		return n.checkAttrs(r.attrs), r;
	}
	static sameSet(e, t) {
		if (e == t) return !0;
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!e[n].eq(t[n])) return !1;
		return !0;
	}
	static setFrom(t) {
		if (!t || Array.isArray(t) && t.length == 0) return e.none;
		if (t instanceof e) return [t];
		let n = t.slice();
		return n.sort((e, t) => e.type.rank - t.type.rank), n;
	}
};
l.none = [];
var u = class extends Error {}, d = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = p(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(f(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
	}
	eq(e) {
		return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
	}
	toString() {
		return this.content + "(" + this.openStart + "," + this.openEnd + ")";
	}
	toJSON() {
		if (!this.content.size) return null;
		let e = { content: this.content.toJSON() };
		return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
	}
	static fromJSON(t, n) {
		if (!n) return e.empty;
		let r = n.openStart || 0, i = n.openEnd || 0;
		if (typeof r != "number" || typeof i != "number") throw RangeError("Invalid input for Slice.fromJSON");
		return new e(a.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
d.empty = new d(a.empty, 0, 0);
function f(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(f(a.content, t - i - 1, n - i - 1)));
}
function p(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = p(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function m(e, t, n) {
	if (n.openStart > e.depth) throw new u("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new u("Inconsistent open depths");
	return h(e, t, n, 0);
}
function h(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = h(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	} else if (!n.content.size) return b(a, S(e, t, r));
	else if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return b(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	} else {
		let { start: i, end: o } = ee(n, e);
		return b(a, x(e, i, o, t, r));
	}
}
function g(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new u("Cannot join " + t.type.name + " onto " + e.type.name);
}
function _(e, t, n) {
	let r = e.node(n);
	return g(r, t.node(n)), r;
}
function v(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function y(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (v(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) v(i.child(e), r);
	t && t.depth == n && t.textOffset && v(t.nodeBefore, r);
}
function b(e, t) {
	if (!e.type.validContent(t)) throw new u("Invalid content for node " + e.type.name);
	return e.copy(t);
}
function x(e, t, n, r, i) {
	let o = e.depth > i && _(e, t, i + 1), s = r.depth > i && _(n, r, i + 1), c = [];
	return y(null, e, i, c), o && s && t.index(i) == n.index(i) ? (g(o, s), v(b(o, x(e, t, n, r, i + 1)), c)) : (o && v(b(o, S(e, t, i + 1)), c), y(t, n, i, c), s && v(b(s, S(n, r, i + 1)), c)), y(r, null, i, c), new a(c);
}
function S(e, t, n) {
	let r = [];
	return y(null, e, n, r), e.depth > n && v(b(_(e, t, n + 1), S(e, t, n + 1)), r), y(t, null, n, r), new a(r);
}
function ee(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(a.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var te = class e {
	constructor(e, t, n) {
		this.pos = e, this.path = t, this.parentOffset = n, this.depth = t.length / 3 - 1;
	}
	resolveDepth(e) {
		return e == null ? this.depth : e < 0 ? this.depth + e : e;
	}
	get parent() {
		return this.node(this.depth);
	}
	get doc() {
		return this.node(0);
	}
	node(e) {
		return this.path[this.resolveDepth(e) * 3];
	}
	index(e) {
		return this.path[this.resolveDepth(e) * 3 + 1];
	}
	indexAfter(e) {
		return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
	}
	start(e) {
		return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
	}
	end(e) {
		return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
	}
	before(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position before the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
	}
	after(e) {
		if (e = this.resolveDepth(e), !e) throw RangeError("There is no position after the top-level node");
		return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
	}
	get textOffset() {
		return this.pos - this.path[this.path.length - 1];
	}
	get nodeAfter() {
		let e = this.parent, t = this.index(this.depth);
		if (t == e.childCount) return null;
		let n = this.pos - this.path[this.path.length - 1], r = e.child(t);
		return n ? e.child(t).cut(n) : r;
	}
	get nodeBefore() {
		let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
		return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
	}
	posAtIndex(e, t) {
		t = this.resolveDepth(t);
		let n = this.path[t * 3], r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
		for (let t = 0; t < e; t++) r += n.child(t).nodeSize;
		return r;
	}
	marks() {
		let e = this.parent, t = this.index();
		if (e.content.size == 0) return l.none;
		if (this.textOffset) return e.child(t).marks;
		let n = e.maybeChild(t - 1), r = e.maybeChild(t);
		if (!n) {
			let e = n;
			n = r, r = e;
		}
		let i = n.marks;
		for (var a = 0; a < i.length; a++) i[a].type.spec.inclusive === !1 && (!r || !i[a].isInSet(r.marks)) && (i = i[a--].removeFromSet(i));
		return i;
	}
	marksAcross(e) {
		let t = this.parent.maybeChild(this.index());
		if (!t || !t.isInline) return null;
		let n = t.marks, r = e.parent.maybeChild(e.index());
		for (var i = 0; i < n.length; i++) n[i].type.spec.inclusive === !1 && (!r || !n[i].isInSet(r.marks)) && (n = n[i--].removeFromSet(n));
		return n;
	}
	sharedDepth(e) {
		for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
		return 0;
	}
	blockRange(e = this, t) {
		if (e.pos < this.pos) return e.blockRange(this);
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new ae(this, e, n);
		return null;
	}
	sameParent(e) {
		return this.pos - this.parentOffset == e.pos - e.parentOffset;
	}
	max(e) {
		return e.pos > this.pos ? e : this;
	}
	min(e) {
		return e.pos < this.pos ? e : this;
	}
	toString() {
		let e = "";
		for (let t = 1; t <= this.depth; t++) e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
		return e + ":" + this.parentOffset;
	}
	static resolve(t, n) {
		if (!(n >= 0 && n <= t.content.size)) throw RangeError("Position " + n + " out of range");
		let r = [], i = 0, a = n;
		for (let e = t;;) {
			let { index: t, offset: n } = e.content.findIndex(a), o = a - n;
			if (r.push(e, t, i + n), !o || (e = e.child(t), e.isText)) break;
			a = o - 1, i += n + 1;
		}
		return new e(n, r, a);
	}
	static resolveCached(t, n) {
		let r = ie.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else ie.set(t, r = new ne());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % re, i;
	}
}, ne = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, re = 12, ie = /* @__PURE__ */ new WeakMap(), ae = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.depth = n;
	}
	get start() {
		return this.$from.before(this.depth + 1);
	}
	get end() {
		return this.$to.after(this.depth + 1);
	}
	get parent() {
		return this.$from.node(this.depth);
	}
	get startIndex() {
		return this.$from.index(this.depth);
	}
	get endIndex() {
		return this.$to.indexAfter(this.depth);
	}
}, oe = Object.create(null), se = class e {
	constructor(e, t, n, r = l.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || a.empty;
	}
	get children() {
		return this.content.content;
	}
	get nodeSize() {
		return this.isLeaf ? 1 : 2 + this.content.size;
	}
	get childCount() {
		return this.content.childCount;
	}
	child(e) {
		return this.content.child(e);
	}
	maybeChild(e) {
		return this.content.maybeChild(e);
	}
	forEach(e) {
		this.content.forEach(e);
	}
	nodesBetween(e, t, n, r = 0) {
		this.content.nodesBetween(e, t, n, r, this);
	}
	descendants(e) {
		this.nodesBetween(0, this.content.size, e);
	}
	get textContent() {
		return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
	}
	textBetween(e, t, n, r) {
		return this.content.textBetween(e, t, n, r);
	}
	get firstChild() {
		return this.content.firstChild;
	}
	get lastChild() {
		return this.content.lastChild;
	}
	eq(e) {
		return this == e || this.sameMarkup(e) && this.content.eq(e.content);
	}
	sameMarkup(e) {
		return this.hasMarkup(e.type, e.attrs, e.marks);
	}
	hasMarkup(e, t, n) {
		return this.type == e && c(this.attrs, t || e.defaultAttrs || oe) && l.sameSet(this.marks, n || l.none);
	}
	copy(t = null) {
		return t == this.content ? this : new e(this.type, this.attrs, t, this.marks);
	}
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.content, t);
	}
	cut(e, t = this.content.size) {
		return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
	}
	slice(e, t = this.content.size, n = !1) {
		if (e == t) return d.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new d(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return m(this.resolve(e), this.resolve(t), n);
	}
	nodeAt(e) {
		for (let t = this;;) {
			let { index: n, offset: r } = t.content.findIndex(e);
			if (t = t.maybeChild(n), !t) return null;
			if (r == e || t.isText) return t;
			e -= r + 1;
		}
	}
	childAfter(e) {
		let { index: t, offset: n } = this.content.findIndex(e);
		return {
			node: this.content.maybeChild(t),
			index: t,
			offset: n
		};
	}
	childBefore(e) {
		if (e == 0) return {
			node: null,
			index: 0,
			offset: 0
		};
		let { index: t, offset: n } = this.content.findIndex(e);
		if (n < e) return {
			node: this.content.child(t),
			index: t,
			offset: n
		};
		let r = this.content.child(t - 1);
		return {
			node: r,
			index: t - 1,
			offset: n - r.nodeSize
		};
	}
	resolve(e) {
		return te.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return te.resolve(this, e);
	}
	rangeHasMark(e, t, n) {
		let r = !1;
		return t > e && this.nodesBetween(e, t, (e) => (n.isInSet(e.marks) && (r = !0), !r)), r;
	}
	get isBlock() {
		return this.type.isBlock;
	}
	get isTextblock() {
		return this.type.isTextblock;
	}
	get inlineContent() {
		return this.type.inlineContent;
	}
	get isInline() {
		return this.type.isInline;
	}
	get isText() {
		return this.type.isText;
	}
	get isLeaf() {
		return this.type.isLeaf;
	}
	get isAtom() {
		return this.type.isAtom;
	}
	toString() {
		if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
		let e = this.type.name;
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), le(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = a.empty, r = 0, i = n.childCount) {
		let o = this.contentMatchAt(e).matchFragment(n, r, i), s = o && o.matchFragment(this.content, t);
		if (!s || !s.validEnd) return !1;
		for (let e = r; e < i; e++) if (!this.type.allowsMarks(n.child(e).marks)) return !1;
		return !0;
	}
	canReplaceWith(e, t, n, r) {
		if (r && !this.type.allowsMarks(r)) return !1;
		let i = this.contentMatchAt(e).matchType(n), a = i && i.matchFragment(this.content, t);
		return a ? a.validEnd : !1;
	}
	canAppend(e) {
		return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
	}
	check() {
		this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
		let e = l.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			n.type.checkAttrs(n.attrs), e = n.addToSet(e);
		}
		if (!l.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
		this.content.forEach((e) => e.check());
	}
	toJSON() {
		let e = { type: this.type.name };
		for (let t in this.attrs) {
			e.attrs = this.attrs;
			break;
		}
		return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((e) => e.toJSON())), e;
	}
	static fromJSON(e, t) {
		if (!t) throw RangeError("Invalid input for Node.fromJSON");
		let n;
		if (t.marks) {
			if (!Array.isArray(t.marks)) throw RangeError("Invalid mark data for Node.fromJSON");
			n = t.marks.map(e.markFromJSON);
		}
		if (t.type == "text") {
			if (typeof t.text != "string") throw RangeError("Invalid text node in JSON");
			return e.text(t.text, n);
		}
		let r = a.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, r, n);
		return i.type.checkAttrs(i.attrs), i;
	}
};
se.prototype.text = void 0;
var ce = class e extends se {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : le(this.marks, JSON.stringify(this.text));
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
	mark(t) {
		return t == this.marks ? this : new e(this.type, this.attrs, this.text, t);
	}
	withText(t) {
		return t == this.text ? this : new e(this.type, this.attrs, t, this.marks);
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
};
function le(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
var ue = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new de(t, n);
		if (r.next == null) return e.empty;
		let i = fe(r);
		r.next && r.err("Unexpected trailing text");
		let a = Se(ye(i));
		return Ce(a, r), a;
	}
	matchType(e) {
		for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
		return null;
	}
	matchFragment(e, t = 0, n = e.childCount) {
		let r = this;
		for (let i = t; r && i < n; i++) r = r.matchType(e.child(i).type);
		return r;
	}
	get inlineContent() {
		return this.next.length != 0 && this.next[0].type.isInline;
	}
	get defaultType() {
		for (let e = 0; e < this.next.length; e++) {
			let { type: t } = this.next[e];
			if (!(t.isText || t.hasRequiredAttrs())) return t;
		}
		return null;
	}
	compatible(e) {
		for (let t = 0; t < this.next.length; t++) for (let n = 0; n < e.next.length; n++) if (this.next[t].type == e.next[n].type) return !0;
		return !1;
	}
	fillBefore(e, t = !1, n = 0) {
		let r = [this];
		function i(o, s) {
			let c = o.matchFragment(e, n);
			if (c && (!t || c.validEnd)) return a.from(s.map((e) => e.createAndFill()));
			for (let e = 0; e < o.next.length; e++) {
				let { type: t, next: n } = o.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, s.concat(t));
					if (e) return e;
				}
			}
			return null;
		}
		return i(this, []);
	}
	findWrapping(e) {
		for (let t = 0; t < this.wrapCache.length; t += 2) if (this.wrapCache[t] == e) return this.wrapCache[t + 1];
		let t = this.computeWrapping(e);
		return this.wrapCache.push(e, t), t;
	}
	computeWrapping(e) {
		let t = Object.create(null), n = [{
			match: this,
			type: null,
			via: null
		}];
		for (; n.length;) {
			let r = n.shift(), i = r.match;
			if (i.matchType(e)) {
				let e = [];
				for (let t = r; t.type; t = t.via) e.push(t.type);
				return e.reverse();
			}
			for (let e = 0; e < i.next.length; e++) {
				let { type: a, next: o } = i.next[e];
				!a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!r.type || o.validEnd) && (n.push({
					match: a.contentMatch,
					type: a,
					via: r
				}), t[a.name] = !0);
			}
		}
		return null;
	}
	get edgeCount() {
		return this.next.length;
	}
	edge(e) {
		if (e >= this.next.length) throw RangeError(`There's no ${e}th edge in this content match`);
		return this.next[e];
	}
	toString() {
		let e = [];
		function t(n) {
			e.push(n);
			for (let r = 0; r < n.next.length; r++) e.indexOf(n.next[r].next) == -1 && t(n.next[r].next);
		}
		return t(this), e.map((t, n) => {
			let r = n + (t.validEnd ? "*" : " ") + " ";
			for (let n = 0; n < t.next.length; n++) r += (n ? ", " : "") + t.next[n].type.name + "->" + e.indexOf(t.next[n].next);
			return r;
		}).join("\n");
	}
};
ue.empty = new ue(!0);
var de = class {
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
		throw SyntaxError(e + " (in content expression '" + this.string + "')");
	}
};
function fe(e) {
	let t = [];
	do
		t.push(pe(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function pe(e) {
	let t = [];
	do
		t.push(me(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function me(e) {
	let t = ve(e);
	for (;;) if (e.eat("+")) t = {
		type: "plus",
		expr: t
	};
	else if (e.eat("*")) t = {
		type: "star",
		expr: t
	};
	else if (e.eat("?")) t = {
		type: "opt",
		expr: t
	};
	else if (e.eat("{")) t = ge(e, t);
	else break;
	return t;
}
function he(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function ge(e, t) {
	let n = he(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : he(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function _e(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function ve(e) {
	if (e.eat("(")) {
		let t = fe(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	} else if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = _e(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function ye(e) {
	let t = [[]];
	return i(a(e, 0), n()), t;
	function n() {
		return t.push([]) - 1;
	}
	function r(e, n, r) {
		let i = {
			term: r,
			to: n
		};
		return t[e].push(i), i;
	}
	function i(e, t) {
		e.forEach((e) => e.to = t);
	}
	function a(e, t) {
		if (e.type == "choice") return e.exprs.reduce((e, n) => e.concat(a(n, t)), []);
		if (e.type == "seq") for (let r = 0;; r++) {
			let o = a(e.exprs[r], t);
			if (r == e.exprs.length - 1) return o;
			i(o, t = n());
		}
		else if (e.type == "star") {
			let o = n();
			return r(t, o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "plus") {
			let o = n();
			return i(a(e.expr, t), o), i(a(e.expr, o), o), [r(o)];
		} else if (e.type == "opt") return [r(t)].concat(a(e.expr, t));
		else if (e.type == "range") {
			let o = t;
			for (let t = 0; t < e.min; t++) {
				let t = n();
				i(a(e.expr, o), t), o = t;
			}
			if (e.max == -1) i(a(e.expr, o), o);
			else for (let t = e.min; t < e.max; t++) {
				let t = n();
				r(o, t), i(a(e.expr, o), t), o = t;
			}
			return [r(o)];
		} else if (e.type == "name") return [r(t, void 0, e.value)];
		else throw Error("Unknown expr type");
	}
}
function be(e, t) {
	return t - e;
}
function xe(e, t) {
	let n = [];
	return r(t), n.sort(be);
	function r(t) {
		let i = e[t];
		if (i.length == 1 && !i[0].term) return r(i[0].to);
		n.push(t);
		for (let e = 0; e < i.length; e++) {
			let { term: t, to: a } = i[e];
			!t && n.indexOf(a) == -1 && r(a);
		}
	}
}
function Se(e) {
	let t = Object.create(null);
	return n(xe(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				xe(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new ue(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(be);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function Ce(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function we(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function Te(e, t) {
	let n = Object.create(null);
	for (let r in e) {
		let i = t && t[r];
		if (i === void 0) {
			let t = e[r];
			if (t.hasDefault) i = t.default;
			else throw RangeError("No value supplied for attribute " + r);
		}
		n[r] = i;
	}
	return n;
}
function Ee(e, t, n, r) {
	for (let i in t) if (!(i in e)) throw RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);
	for (let n in e) e[n].validate && e[n].validate(t[n]);
}
function De(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new Ae(e, r, t[r]);
	return n;
}
var Oe = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = De(e, n.attrs), this.defaultAttrs = we(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == ue.empty;
	}
	get isAtom() {
		return this.isLeaf || !!this.spec.atom;
	}
	isInGroup(e) {
		return this.groups.indexOf(e) > -1;
	}
	get whitespace() {
		return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
	}
	hasRequiredAttrs() {
		for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
		return !1;
	}
	compatibleContent(e) {
		return this == e || this.contentMatch.compatible(e.contentMatch);
	}
	computeAttrs(e) {
		return !e && this.defaultAttrs ? this.defaultAttrs : Te(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new se(this, this.computeAttrs(e), a.from(t), l.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = a.from(t), this.checkContent(t), new se(this, this.computeAttrs(e), t, l.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = a.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(a.empty, !0);
		return i ? new se(this, e, t.append(i), l.setFrom(n)) : null;
	}
	validContent(e) {
		let t = this.contentMatch.matchFragment(e);
		if (!t || !t.validEnd) return !1;
		for (let t = 0; t < e.childCount; t++) if (!this.allowsMarks(e.child(t).marks)) return !1;
		return !0;
	}
	checkContent(e) {
		if (!this.validContent(e)) throw RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
	}
	checkAttrs(e) {
		Ee(this.attrs, e, "node", this.name);
	}
	allowsMarkType(e) {
		return this.markSet == null || this.markSet.indexOf(e) > -1;
	}
	allowsMarks(e) {
		if (this.markSet == null) return !0;
		for (let t = 0; t < e.length; t++) if (!this.allowsMarkType(e[t].type)) return !1;
		return !0;
	}
	allowedMarks(e) {
		if (this.markSet == null) return e;
		let t;
		for (let n = 0; n < e.length; n++) this.allowsMarkType(e[n].type) ? t && t.push(e[n]) : t ||= e.slice(0, n);
		return t ? t.length ? t : l.none : e;
	}
	static compile(t, n) {
		let r = Object.create(null);
		t.forEach((t, i) => r[t] = new e(t, n, i));
		let i = n.spec.topNode || "doc";
		if (!r[i]) throw RangeError("Schema is missing its top node type ('" + i + "')");
		if (!r.text) throw RangeError("Every schema needs a 'text' type");
		for (let e in r.text.attrs) throw RangeError("The text node type should not have attributes");
		return r;
	}
};
function ke(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var Ae = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? ke(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, je = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = De(e, r.attrs), this.excluded = null;
		let i = we(this.attrs);
		this.instance = i ? new l(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new l(this, Te(this.attrs, e));
	}
	static compile(t, n) {
		let r = Object.create(null), i = 0;
		return t.forEach((t, a) => r[t] = new e(t, i++, n, a)), r;
	}
	removeFromSet(e) {
		for (var t = 0; t < e.length; t++) e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
		return e;
	}
	isInSet(e) {
		for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
	}
	checkAttrs(e) {
		Ee(this.attrs, e, "mark", this.name);
	}
	excludes(e) {
		return this.excluded.indexOf(e) > -1;
	}
}, Me = class {
	constructor(t) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let n = this.spec = {};
		for (let e in t) n[e] = t[e];
		n.nodes = e.from(t.nodes), n.marks = e.from(t.marks || {}), this.nodes = Oe.compile(this.spec.nodes, this), this.marks = je.compile(this.spec.marks, this);
		let r = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], n = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = r[n] || (r[n] = ue.parse(n, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? Ne(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : Ne(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => se.fromJSON(this, e), this.markFromJSON = (e) => l.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof Oe)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new ce(n, n.defaultAttrs, e, l.setFrom(t));
	}
	mark(e, t) {
		return typeof e == "string" && (e = this.marks[e]), e.create(t);
	}
	nodeType(e) {
		let t = this.nodes[e];
		if (!t) throw RangeError("Unknown node type: " + e);
		return t;
	}
};
function Ne(e, t) {
	let n = [];
	for (let r = 0; r < t.length; r++) {
		let i = t[r], a = e.marks[i], o = a;
		if (a) n.push(a);
		else for (let t in e.marks) {
			let r = e.marks[t];
			(i == "_" || r.spec.group && r.spec.group.split(" ").indexOf(i) > -1) && n.push(o = r);
		}
		if (!o) throw SyntaxError("Unknown mark type: '" + t[r] + "'");
	}
	return n;
}
function Pe(e) {
	return e.tag != null;
}
function Fe(e) {
	return e.style != null;
}
var Ie = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (Pe(e)) this.tags.push(e);
			else if (Fe(e)) {
				let t = /[^=]*/.exec(e.style)[0];
				n.indexOf(t) < 0 && n.push(t), this.styles.push(e);
			}
		}), this.normalizeLists = !this.tags.some((t) => {
			if (!/^(ul|ol)\b/.test(t.tag) || !t.node) return !1;
			let n = e.nodes[t.node];
			return n.contentMatch.matchType(n);
		});
	}
	parse(e, t = {}) {
		let n = new Ge(this, t, !1);
		return n.addAll(e, l.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new Ge(this, t, !0);
		return n.addAll(e, l.none, t.from, t.to), d.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (qe(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
				if (n.getAttrs) {
					let t = n.getAttrs(e);
					if (t === !1) continue;
					n.attrs = t || void 0;
				}
				return n;
			}
		}
	}
	matchStyle(e, t, n, r) {
		for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
			let r = this.styles[i], a = r.style;
			if (!(a.indexOf(e) != 0 || r.context && !n.matchesContext(r.context) || a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
				if (r.getAttrs) {
					let e = r.getAttrs(t);
					if (e === !1) continue;
					r.attrs = e || void 0;
				}
				return r;
			}
		}
	}
	static schemaRules(e) {
		let t = [];
		function n(e) {
			let n = e.priority == null ? 50 : e.priority, r = 0;
			for (; r < t.length; r++) {
				let e = t[r];
				if ((e.priority == null ? 50 : e.priority) < n) break;
			}
			t.splice(r, 0, e);
		}
		for (let t in e.marks) {
			let r = e.marks[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = Je(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = Je(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, Le = {
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
}, Re = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, ze = {
	ol: !0,
	ul: !0
}, Be = 1, Ve = 2, He = 4;
function Ue(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? Be | Ve : n & ~He : (t ? Be : 0) | (t === "full" ? Ve : 0);
}
var We = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = l.none, this.match = i || (a & He ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(a.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & Be)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = a.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(a.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Le.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, Ge = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = Ue(null, t.preserveWhitespace, 0) | (n ? He : 0);
		i = r ? new We(r.type, r.attrs, l.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new We(null, null, l.none, !0, null, a) : new We(e.schema.topNodeType, null, l.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & Ve ? "full" : this.localPreserveWS || (r.options & Be) > 0, { schema: a } = this.parser;
		if (i === "full" || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
			if (!i) {
				if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
					let t = r.content[r.content.length - 1], i = e.previousSibling;
					(!t || i && i.nodeName == "BR" || t.isText && /[ \t\r\n\u000c]$/.test(t.text)) && (n = n.slice(1));
				}
			} else if (i === "full") n = n.replace(/\r\n?/g, "\n");
			else if (a.linebreakReplacement && /[\r\n]/.test(n) && this.top.findWrapping(a.linebreakReplacement.create())) {
				let e = n.split(/\r?\n|\r/);
				for (let n = 0; n < e.length; n++) n && this.insertNode(a.linebreakReplacement.create(), t, !0), e[n] && this.insertNode(a.text(e[n]), t, !/\S/.test(e[n]));
				n = "";
			} else n = n.replace(/\r?\n|\r/g, " ");
			n && this.insertNode(a.text(n), t, !/\S/.test(n)), this.findInText(e);
		} else this.findInside(e);
	}
	addElement(e, t, n) {
		let r = this.localPreserveWS, i = this.top;
		(e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
		let a = e.nodeName.toLowerCase(), o;
		ze.hasOwnProperty(a) && this.parser.normalizeLists && Ke(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : Re.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (Le.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
			else if (!e.firstChild) {
				this.leafFallback(e, t);
				break out;
			}
			let o = s && s.skip ? t : this.readStyles(e, t);
			o && this.addAll(e, o), n && this.sync(i), this.needsBlock = r;
		} else {
			let n = this.readStyles(e, t);
			n && this.addElementByRule(e, s, n, s.consuming === !1 ? o : void 0);
		}
		this.localPreserveWS = r;
	}
	leafFallback(e, t) {
		e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode("\n"), t);
	}
	ignoreFallback(e, t) {
		e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
	}
	readStyles(e, t) {
		let n = e.style;
		if (n && n.length) for (let e = 0; e < this.parser.matchedStyles.length; e++) {
			let r = this.parser.matchedStyles[e], i = n.getPropertyValue(r);
			if (i) for (let e;;) {
				let n = this.parser.matchStyle(r, i, this, e);
				if (!n) break;
				if (n.ignore) return null;
				if (t = n.clearMark ? t.filter((e) => !n.clearMark(e)) : t.concat(this.parser.schema.marks[n.mark].create(n.attrs)), n.consuming === !1) e = n;
				else break;
			}
		}
		return t;
	}
	addElementByRule(e, t, n, r) {
		let i, a;
		if (t.node) if (a = this.parser.schema.nodes[t.node], a.isLeaf) this.insertNode(a.create(t.attrs), n, e.nodeName == "BR") || this.leafFallback(e, n);
		else {
			let e = this.enter(a, t.attrs || null, n, t.preserveWhitespace);
			e && (i = !0, n = e);
		}
		else {
			let e = this.parser.schema.marks[t.mark];
			n = n.concat(e.create(t.attrs));
		}
		let o = this.top;
		if (a && a.isLeaf) this.findInside(e);
		else if (r) this.addElement(e, n, r);
		else if (t.getContent) this.findInside(e), t.getContent(e, this.parser.schema).forEach((e) => this.insertNode(e, n, !1));
		else {
			let r = e;
			typeof t.contentElement == "string" ? r = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? r = t.contentElement(e) : t.contentElement && (r = t.contentElement), this.findAround(e, r, !0), this.addAll(r, n), this.findAround(e, r, !1);
		}
		i && this.sync(o) && this.open--;
	}
	addAll(e, t, n, r) {
		let i = n || 0;
		for (let a = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; a != o; a = a.nextSibling, ++i) this.findAtPoint(e, i), this.addDOM(a, t);
		this.findAtPoint(e, i);
	}
	findPlace(e, t, n) {
		let r, i;
		for (let t = this.open, a = 0; t >= 0; t--) {
			let o = this.nodes[t], s = o.findWrapping(e);
			if (s && (!r || r.length > s.length + a) && (r = s, i = o, !s.length)) break;
			if (o.solid) {
				if (n) break;
				a += 2;
			}
		}
		if (!r) return null;
		this.sync(i);
		for (let e = 0; e < r.length; e++) t = this.enterInner(r[e], null, t, !1);
		return t;
	}
	insertNode(e, t, n) {
		if (e.isInline && this.needsBlock && !this.top.type) {
			let e = this.textblockFromContext();
			e && (t = this.enterInner(e, null, t));
		}
		let r = this.findPlace(e, t, n);
		if (r) {
			this.closeExtra();
			let t = this.top;
			t.match &&= t.match.matchType(e.type);
			let n = l.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : Ye(i.type, e.type)) && (n = i.addToSet(n));
			return t.content.push(e.mark(n)), !0;
		}
		return !1;
	}
	enter(e, t, n, r) {
		let i = this.findPlace(e.create(t), n, !1);
		return i &&= this.enterInner(e, t, n, !0, r), i;
	}
	enterInner(e, t, n, r = !1, i) {
		this.closeExtra();
		let a = this.top;
		a.match = a.match && a.match.matchType(e);
		let o = Ue(e, i, a.options);
		a.options & He && a.content.length == 0 && (o |= He);
		let s = l.none;
		return n = n.filter((t) => (a.type ? a.type.allowsMarkType(t.type) : Ye(t.type, e)) ? (s = t.addToSet(s), !1) : !0), this.nodes.push(new We(e, t, s, r, null, o)), this.open++, n;
	}
	closeExtra(e = !1) {
		let t = this.nodes.length - 1;
		if (t > this.open) {
			for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
			this.nodes.length = this.open + 1;
		}
	}
	finish() {
		return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
	}
	sync(e) {
		for (let t = this.open; t >= 0; t--) {
			if (this.nodes[t] == e) return this.open = t, !0;
			this.localPreserveWS && (this.nodes[t].options |= Be);
		}
		return !1;
	}
	get currentPos() {
		this.closeExtra();
		let e = 0;
		for (let t = this.open; t >= 0; t--) {
			let n = this.nodes[t].content;
			for (let t = n.length - 1; t >= 0; t--) e += n[t].nodeSize;
			t && e++;
		}
		return e;
	}
	findAtPoint(e, t) {
		if (this.find) for (let n = 0; n < this.find.length; n++) this.find[n].node == e && this.find[n].offset == t && (this.find[n].pos = this.currentPos);
	}
	findInside(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
	}
	findAround(e, t, n) {
		if (e != t && this.find) for (let r = 0; r < this.find.length; r++) this.find[r].pos == null && e.nodeType == 1 && e.contains(this.find[r].node) && t.compareDocumentPosition(this.find[r].node) & (n ? 2 : 4) && (this.find[r].pos = this.currentPos);
	}
	findInText(e) {
		if (this.find) for (let t = 0; t < this.find.length; t++) this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
	}
	matchesContext(e) {
		if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
		let t = e.split("/"), n = this.options.context, r = !this.isOpen && (!n || n.parent.type == this.nodes[0].type), i = -(n ? n.depth + 1 : 0) + +!r, a = (e, o) => {
			for (; e >= 0; e--) {
				let s = t[e];
				if (s == "") {
					if (e == t.length - 1 || e == 0) continue;
					for (; o >= i; o--) if (a(e - 1, o)) return !0;
					return !1;
				} else {
					let e = o > 0 || o == 0 && r ? this.nodes[o].type : n && o >= i ? n.node(o - i).type : null;
					if (!e || e.name != s && !e.isInGroup(s)) return !1;
					o--;
				}
			}
			return !0;
		};
		return a(t.length - 1, this.open);
	}
	textblockFromContext() {
		let e = this.options.context;
		if (e) for (let t = e.depth; t >= 0; t--) {
			let n = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
			if (n && n.isTextblock && n.defaultAttrs) return n;
		}
		for (let e in this.parser.schema.nodes) {
			let t = this.parser.schema.nodes[e];
			if (t.isTextblock && t.defaultAttrs) return t;
		}
	}
};
function Ke(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && ze.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function qe(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function Je(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function Ye(e, t) {
	let n = t.schema.nodes;
	for (let r in n) {
		let i = n[r];
		if (!i.allowsMarkType(e)) continue;
		let a = [], o = (e) => {
			a.push(e);
			for (let n = 0; n < e.edgeCount; n++) {
				let { type: r, next: i } = e.edge(n);
				if (r == t || a.indexOf(i) < 0 && o(i)) return !0;
			}
		};
		if (o(i.contentMatch)) return !0;
	}
}
var Xe = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n ||= Qe(t).createDocumentFragment();
		let r = n, i = [];
		return e.forEach((e) => {
			if (i.length || e.marks.length) {
				let n = 0, a = 0;
				for (; n < i.length && a < e.marks.length;) {
					let t = e.marks[a];
					if (!this.marks[t.type.name]) {
						a++;
						continue;
					}
					if (!t.eq(i[n][0]) || t.type.spec.spanning === !1) break;
					n++, a++;
				}
				for (; n < i.length;) r = i.pop()[1];
				for (; a < e.marks.length;) {
					let n = e.marks[a++], o = this.serializeMark(n, e.isInline, t);
					o && (i.push([n, r]), r.appendChild(o.dom), r = o.contentDOM || o.dom);
				}
			}
			r.appendChild(this.serializeNodeInner(e, t));
		}), n;
	}
	serializeNodeInner(e, t) {
		if (e.isText) return Qe(t).createTextNode(e.text);
		let { dom: n, contentDOM: r } = nt(Qe(t), this.nodes[e.type.name](e), null, e.attrs);
		if (r) {
			if (e.isLeaf) throw RangeError("Content hole not allowed in a leaf node spec");
			this.serializeFragment(e.content, t, r);
		}
		return n;
	}
	serializeNode(e, t = {}) {
		let n = this.serializeNodeInner(e, t);
		for (let r = e.marks.length - 1; r >= 0; r--) {
			let i = this.serializeMark(e.marks[r], e.isInline, t);
			i && ((i.contentDOM || i.dom).appendChild(n), n = i.dom);
		}
		return n;
	}
	serializeMark(e, t, n = {}) {
		let r = this.marks[e.type.name];
		return r && nt(Qe(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return typeof t == "string" ? { dom: e.createTextNode(t) } : nt(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = Ze(e.nodes);
		return t.text ||= (e) => e.text, t;
	}
	static marksFromSchema(e) {
		return Ze(e.marks);
	}
};
function Ze(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function Qe(e) {
	return e.document || window.document;
}
var $e = /* @__PURE__ */ new WeakMap();
function et(e) {
	let t = $e.get(e);
	return t === void 0 && $e.set(e, t = tt(e)), t;
}
function tt(e) {
	let t = null;
	function n(e) {
		if (e && typeof e == "object") if (Array.isArray(e)) if (typeof e[0] == "string") t ||= [], t.push(e);
		else for (let t = 0; t < e.length; t++) n(e[t]);
		else for (let t in e) n(e[t]);
	}
	return n(e), t;
}
function nt(e, t, n, r) {
	if (t.nodeType == 1) return { dom: t };
	if (t.dom && t.dom.nodeType == 1) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = et(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
	let o = i.indexOf(" ");
	o > 0 && (n = i.slice(0, o), i = i.slice(o + 1));
	let s, c = n ? e.createElementNS(n, i) : e.createElement(i), l = t[1], u = 1;
	if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
		u = 2;
		for (let e in l) if (l[e] != null) {
			let t = e.indexOf(" ");
			t > 0 ? c.setAttributeNS(e.slice(0, t), e.slice(t + 1), l[e]) : e == "style" && c.style ? c.style.cssText = l[e] : c.setAttribute(e, l[e]);
		}
	}
	for (let i = u; i < t.length; i++) {
		let a = t[i];
		if (a === 0) {
			if (i < t.length - 1 || i > u) throw RangeError("Content hole must be the only child of its parent node");
			return {
				dom: c,
				contentDOM: c
			};
		} else if (typeof a == "string") c.appendChild(e.createTextNode(a));
		else {
			let { dom: t, contentDOM: i } = nt(e, a, n, r);
			if (c.appendChild(t), i) {
				if (s) throw RangeError("Multiple content holes");
				s = i;
			}
		}
	}
	return {
		dom: c,
		contentDOM: s
	};
}
//#endregion
//#region node_modules/prosemirror-transform/dist/index.js
var rt = 65535, it = 2 ** 16;
function at(e, t) {
	return e + t * it;
}
function ot(e) {
	return e & rt;
}
function st(e) {
	return (e - (e & rt)) / it;
}
var ct = 1, lt = 2, ut = 4, dt = 8, ft = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & dt) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & (ct | ut)) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & (lt | ut)) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & ut) > 0;
	}
}, pt = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = ot(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + st(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : at(o / 3, e - s), f = e == s ? lt : e == u ? ct : ut;
				return (t < 0 ? e != s : e != u) && (f |= dt), new ft(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new ft(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = ot(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
pt.empty = new pt([]);
var mt = class e {
	constructor(e, t, n = 0, r = e ? e.length : 0) {
		this.mirror = t, this.from = n, this.to = r, this._maps = e || [], this.ownData = !(e || t);
	}
	get maps() {
		return this._maps;
	}
	slice(t = 0, n = this.maps.length) {
		return new e(this._maps, this.mirror, t, n);
	}
	appendMap(e, t) {
		this.ownData ||= (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
	}
	appendMapping(e) {
		for (let t = 0, n = this._maps.length; t < e._maps.length; t++) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t], r != null && r < t ? n + r : void 0);
		}
	}
	getMirror(e) {
		if (this.mirror) {
			for (let t = 0; t < this.mirror.length; t++) if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
		}
	}
	setMirror(e, t) {
		this.mirror ||= [], this.mirror.push(e, t);
	}
	appendMappingInverted(e) {
		for (let t = e.maps.length - 1, n = this._maps.length + e._maps.length; t >= 0; t--) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t].invert(), r != null && r > t ? n - r - 1 : void 0);
		}
	}
	invert() {
		let t = new e();
		return t.appendMappingInverted(this), t;
	}
	map(e, t = 1) {
		if (this.mirror) return this._map(e, t, !0);
		for (let n = this.from; n < this.to; n++) e = this._maps[n].map(e, t);
		return e;
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	_map(e, t, n) {
		let r = 0;
		for (let n = this.from; n < this.to; n++) {
			let i = this._maps[n].mapResult(e, t);
			if (i.recover != null) {
				let t = this.getMirror(n);
				if (t != null && t > n && t < this.to) {
					n = t, e = this._maps[t].recover(i.recover);
					continue;
				}
			}
			r |= i.delInfo, e = i.pos;
		}
		return n ? e : new ft(e, r, null);
	}
}, ht = Object.create(null), gt = class {
	getMap() {
		return pt.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = ht[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in ht) throw RangeError("Duplicate use of step JSON ID " + e);
		return ht[e] = t, t.prototype.jsonID = e, t;
	}
}, _t = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof u) return e.fail(t.message);
			throw t;
		}
	}
};
function vt(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(vt(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return a.fromArray(r);
}
var yt = class e extends gt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new d(vt(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return _t.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new bt(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
gt.jsonID("addMark", yt);
var bt = class e extends gt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new d(vt(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return _t.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new yt(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
gt.jsonID("removeMark", bt);
var xt = class e extends gt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return _t.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return _t.fromReplace(e, this.pos, this.pos + 1, new d(a.from(n), 0, +!t.isLeaf));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new St(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
gt.jsonID("addNodeMark", xt);
var St = class e extends gt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return _t.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return _t.fromReplace(e, this.pos, this.pos + 1, new d(a.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new xt(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
gt.jsonID("removeNodeMark", St);
var Ct = class e extends gt {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Tt(e, this.from, this.to) ? _t.fail("Structure replace would overwrite content") : _t.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new pt([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.to, -1), r = this.from == this.to && e.MAP_BIAS < 0 ? n : t.mapResult(this.from, 1);
		return r.deletedAcross && n.deletedAcross ? null : new e(r.pos, Math.max(r.pos, n.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? d.empty : new d(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		} else if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? d.empty : new d(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		} else return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, d.fromJSON(t, n.slice), !!n.structure);
	}
};
Ct.MAP_BIAS = 1, gt.jsonID("replace", Ct);
var wt = class e extends gt {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Tt(e, this.from, this.gapFrom) || Tt(e, this.gapTo, this.to))) return _t.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return _t.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? _t.fromReplace(e, this.from, this.to, n) : _t.fail("Content does not fit in gap");
	}
	getMap() {
		return new pt([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
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
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, d.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
gt.jsonID("replaceAround", wt);
function Tt(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function Et(e, t, n, r) {
	let i = [], a = [], o, s;
	e.doc.nodesBetween(t, n, (e, c, l) => {
		if (!e.isInline) return;
		let u = e.marks;
		if (!r.isInSet(u) && l.type.allowsMarkType(r.type)) {
			let l = Math.max(c, t), d = Math.min(c + e.nodeSize, n), f = r.addToSet(u);
			for (let e = 0; e < u.length; e++) u[e].isInSet(f) || (o && o.to == l && o.mark.eq(u[e]) ? o.to = d : i.push(o = new bt(l, d, u[e])));
			s && s.to == l ? s.to = d : a.push(s = new yt(l, d, r));
		}
	}), i.forEach((t) => e.step(t)), a.forEach((t) => e.step(t));
}
function Dt(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline) return;
		a++;
		let s = null;
		if (r instanceof je) {
			let t = e.marks, n;
			for (; n = r.isInSet(t);) (s ||= []).push(n), t = n.removeFromSet(t);
		} else r ? r.isInSet(e.marks) && (s = [r]) : s = e.marks;
		if (s && s.length) {
			let r = Math.min(o + e.nodeSize, n);
			for (let e = 0; e < s.length; e++) {
				let n = s[e], c;
				for (let e = 0; e < i.length; e++) {
					let t = i[e];
					t.step == a - 1 && n.eq(i[e].style) && (c = t);
				}
				c ? (c.to = r, c.step = a) : i.push({
					style: n,
					from: Math.max(o, t),
					to: r,
					step: a
				});
			}
		}
	}), i.forEach((t) => e.step(new bt(t.from, t.to, t.style)));
}
function Ot(e, t, n, r = n.contentMatch, i = !0) {
	let o = e.doc.nodeAt(t), s = [], c = t + 1;
	for (let t = 0; t < o.childCount; t++) {
		let l = o.child(t), u = c + l.nodeSize, f = r.matchType(l.type);
		if (!f) s.push(new Ct(c, u, d.empty));
		else {
			r = f;
			for (let t = 0; t < l.marks.length; t++) n.allowsMarkType(l.marks[t].type) || e.step(new bt(c, u, l.marks[t]));
			if (i && l.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(l.text);) r ||= new d(a.from(n.schema.text(" ", n.allowedMarks(l.marks))), 0, 0), s.push(new Ct(c + e.index, c + e.index + e[0].length, r));
			}
		}
		c = u;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(a.empty, !0);
		e.replace(c, c, new d(t, 0, 0));
	}
	for (let t = s.length - 1; t >= 0; t--) e.step(s[t]);
}
function kt(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function At(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !kt(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function jt(e, t, n) {
	let { $from: r, $to: i, depth: o } = t, s = r.before(o + 1), c = i.after(o + 1), l = s, u = c, f = a.empty, p = 0;
	for (let e = o, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, f = a.from(r.node(e).copy(f)), p++) : l--;
	let m = a.empty, h = 0;
	for (let e = o, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, m = a.from(i.node(e).copy(m)), h++) : u++;
	e.step(new wt(l, u, s, c, new d(f.append(m), p, h), f.size - p, !0));
}
function Mt(e, t, n = null, r = e) {
	let i = Pt(e, t), a = i && Ft(r, t);
	return a ? i.map(Nt).concat({
		type: t,
		attrs: n
	}).concat(a.map(Nt)) : null;
}
function Nt(e) {
	return {
		type: e,
		attrs: null
	};
}
function Pt(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function Ft(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function It(e, t, n) {
	let r = a.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = a.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, o = t.end;
	e.step(new wt(i, o, i, o, new d(r, 0, 0), n.length, !0));
}
function Lt(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let o = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let s = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, s) && Bt(e.doc, e.mapping.slice(o).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && zt(e, t, n, o), Ot(e, e.mapping.slice(o).map(n, 1), r, void 0, i === null);
			let c = e.mapping.slice(o), l = c.map(n, 1), u = c.map(n + t.nodeSize, 1);
			return e.step(new wt(l, u, l + 1, u - 1, new d(a.from(r.create(s, null, t.marks)), 0, 0), 1, !0)), i === !0 && Rt(e, t, n, o), !1;
		}
	});
}
function Rt(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.isText) {
			let o, s = /\r?\n|\r/g;
			for (; o = s.exec(i.text);) {
				let i = e.mapping.slice(r).map(n + 1 + a + o.index);
				e.replaceWith(i, i + 1, t.type.schema.linebreakReplacement.create());
			}
		}
	});
}
function zt(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function Bt(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function Vt(e, t, n, r, i) {
	let o = e.doc.nodeAt(t);
	if (!o) throw RangeError("No node at given position");
	n ||= o.type;
	let s = n.create(r, null, i || o.marks);
	if (o.isLeaf) return e.replaceWith(t, t + o.nodeSize, s);
	if (!n.validContent(o.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new wt(t, t + o.nodeSize, t + 1, t + o.nodeSize - 1, new d(a.from(s), 0, 0), 1, !0));
}
function Ht(e, t, n = 1, r) {
	let i = e.resolve(t), a = i.depth - n, o = r && r[r.length - 1] || i.parent;
	if (a < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount))) return !1;
	for (let e = i.depth - 1, t = n - 2; e > a; e--, t--) {
		let n = i.node(e), a = i.index(e);
		if (n.type.spec.isolating) return !1;
		let o = n.content.cutByIndex(a, n.childCount), s = r && r[t + 1];
		s && (o = o.replaceChild(0, s.type.create(s.attrs)));
		let c = r && r[t] || n;
		if (!n.canReplace(a + 1, n.childCount) || !c.type.validContent(o)) return !1;
	}
	let s = i.indexAfter(a), c = r && r[0];
	return i.node(a).canReplaceWith(s, s, c ? c.type : i.node(a + 1).type);
}
function Ut(e, t, n = 1, r) {
	let i = e.doc.resolve(t), o = a.empty, s = a.empty;
	for (let e = i.depth, t = i.depth - n, c = n - 1; e > t; e--, c--) {
		o = a.from(i.node(e).copy(o));
		let t = r && r[c];
		s = a.from(t ? t.type.create(t.attrs, s) : i.node(e).copy(s));
	}
	e.step(new Ct(t, t, new d(o.append(s), n, n), !0));
}
function Wt(e, t) {
	let n = e.resolve(t), r = n.index();
	return Kt(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function Gt(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function Kt(e, t) {
	return !!(e && t && !e.isLeaf && Gt(e, t));
}
function qt(e, t, n = -1) {
	let r = e.resolve(t);
	for (let e = r.depth;; e--) {
		let i, a, o = r.index(e);
		if (e == r.depth ? (i = r.nodeBefore, a = r.nodeAfter) : n > 0 ? (i = r.node(e + 1), o++, a = r.node(e).maybeChild(o)) : (i = r.node(e).maybeChild(o - 1), a = r.node(e + 1)), i && !i.isTextblock && Kt(i, a) && r.node(e).canReplace(o, o + 1)) return t;
		if (e == 0) break;
		t = n < 0 ? r.before(e) : r.after(e);
	}
}
function Jt(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		zt(e, r.node(), r.before(), s);
	}
	o.inlineContent && Ot(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new Ct(l, c.map(t + n, -1), d.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		Rt(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function Yt(e, t, n) {
	let r = e.resolve(t);
	if (r.parent.canReplaceWith(r.index(), r.index(), n)) return t;
	if (r.parentOffset == 0) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.index(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.before(e + 1);
		if (t > 0) return null;
	}
	if (r.parentOffset == r.parent.content.size) for (let e = r.depth - 1; e >= 0; e--) {
		let t = r.indexAfter(e);
		if (r.node(e).canReplaceWith(t, t, n)) return r.after(e + 1);
		if (t < r.node(e).childCount) return null;
	}
	return null;
}
function Xt(e, t, n) {
	let r = e.resolve(t);
	if (!n.content.size) return t;
	let i = n.content;
	for (let e = 0; e < n.openStart; e++) i = i.firstChild.content;
	for (let e = 1; e <= (n.openStart == 0 && n.size ? 2 : 1); e++) for (let t = r.depth; t >= 0; t--) {
		let n = t == r.depth ? 0 : r.pos <= (r.start(t + 1) + r.end(t + 1)) / 2 ? -1 : 1, a = r.index(t) + +(n > 0), o = r.node(t), s = !1;
		if (e == 1) s = o.canReplace(a, a, i);
		else {
			let e = o.contentMatchAt(a).findWrapping(i.firstChild.type);
			s = e && o.canReplaceWith(a, a, e[0]);
		}
		if (s) return n == 0 ? r.pos : n < 0 ? r.before(t + 1) : r.after(t + 1);
	}
	return null;
}
function Zt(e, t, n = t, r = d.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return Qt(i, a, r) ? new Ct(t, n, r) : new $t(i, a, r).fit();
}
function Qt(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var $t = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = a.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = a.from(e.node(t).copy(this.placed));
	}
	get depth() {
		return this.frontier.length - 1;
	}
	fit() {
		for (; this.unplaced.size;) {
			let e = this.findFittable();
			e ? this.placeNodes(e) : this.openMore() || this.dropNode();
		}
		let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, r = this.close(e < 0 ? this.$to : n.doc.resolve(e));
		if (!r) return null;
		let i = this.placed, a = n.depth, o = r.depth;
		for (; a && o && i.childCount == 1;) i = i.firstChild.content, a--, o--;
		let s = new d(i, a, o);
		return e > -1 ? new wt(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new Ct(n.pos, r.pos, s) : null;
	}
	findFittable() {
		let e = this.unplaced.openStart;
		for (let t = this.unplaced.content, n = 0, r = this.unplaced.openEnd; n < e; n++) {
			let i = t.firstChild;
			if (t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= n) {
				e = n;
				break;
			}
			t = i.content;
		}
		for (let t = 1; t <= 2; t++) for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
			let e, r = null;
			n ? (r = nn(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: o, match: s } = this.frontier[e], c, l = null;
				if (t == 1 && (i ? s.matchType(i.type) || (l = s.fillBefore(a.from(i), !1)) : r && o.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: l
				};
				if (t == 2 && i && (c = s.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: c
				};
				if (r && s.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = nn(e, t);
		return !r.childCount || r.firstChild.isLeaf ? !1 : (this.unplaced = new d(e, t + 1, Math.max(n, r.size + t >= e.size - n ? t + 1 : 0)), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = nn(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new d(en(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new d(en(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let o = this.unplaced, s = n ? n.content : o.content, c = o.openStart - e, l = 0, u = [], { match: f, type: p } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) u.push(r.child(e));
			f = f.matchFragment(r);
		}
		let m = s.size + e - (o.content.size - o.openEnd);
		for (; l < s.childCount;) {
			let e = s.child(l), t = f.matchType(e.type);
			if (!t) break;
			l++, (l > 1 || c == 0 || e.content.size) && (f = t, u.push(rn(e.mark(p.allowedMarks(e.marks)), l == 1 ? c : 0, l == s.childCount ? m : -1)));
		}
		let h = l == s.childCount;
		h || (m = -1), this.placed = tn(this.placed, t, a.from(u)), this.frontier[t].match = f, h && m < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = s; e < m; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = h ? e == 0 ? d.empty : new d(en(o.content, e - 1, 1), e - 1, m < 0 ? o.openEnd : e - 1) : new d(en(o.content, e, l), o.openStart, o.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !an(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = an(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = an(e, n, r, t, !0);
					if (!i || i.childCount) continue scan;
				}
				return {
					depth: t,
					fit: a,
					move: i ? e.doc.resolve(e.after(t + 1)) : e
				};
			}
		}
	}
	close(e) {
		let t = this.findCloseLevel(e);
		if (!t) return null;
		for (; this.depth > t.depth;) this.closeFrontierNode();
		t.fit.childCount && (this.placed = tn(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = tn(this.placed, this.depth, a.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(a.empty, !0);
		e.childCount && (this.placed = tn(this.placed, this.frontier.length, e));
	}
};
function en(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(en(e.firstChild.content, t - 1, n)));
}
function tn(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(tn(e.lastChild.content, t - 1, n)));
}
function nn(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function rn(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, rn(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(a.empty, !0)))), e.copy(r);
}
function an(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !on(n, a.content, o) ? s : null;
}
function on(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function sn(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function cn(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (Qt(i, a, r)) return e.step(new Ct(t, n, r));
	let o = fn(i, a);
	o[o.length - 1] == 0 && o.pop();
	let s = -(i.depth + 1);
	o.unshift(s);
	for (let e = i.depth, t = i.pos - 1; e > 0; e--, t--) {
		let n = i.node(e).type.spec;
		if (n.defining || n.definingAsContext || n.isolating) break;
		o.indexOf(e) > -1 ? s = e : i.before(e) == t && o.splice(1, 0, -e);
	}
	let c = o.indexOf(s), l = [], u = r.openStart;
	for (let e = r.content, t = 0;; t++) {
		let n = e.firstChild;
		if (l.push(n), t == r.openStart) break;
		e = n.content;
	}
	for (let e = u - 1; e >= 0; e--) {
		let t = l[e], n = sn(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), f = l[s];
		if (f) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let p = i.node(l - 1), m = i.index(l - 1);
			if (p.canReplaceWith(m, m, f.type, f.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new d(ln(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let f = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > f)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function ln(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy(ln(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(a.empty, !0));
	}
	return e;
}
function un(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = Yt(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new d(a.from(r), 0, 0));
}
function dn(e, t, n) {
	let r = e.doc.resolve(t), i = e.doc.resolve(n);
	if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
		let a = r.sharedDepth(n), o = !1;
		for (let e = r.depth; e > a; e--) r.node(e).type.spec.isolating && (o = !0);
		for (let e = i.depth; e > a; e--) i.node(e).type.spec.isolating && (o = !0);
		if (!o) {
			for (let e = r.depth; e > 0 && t == r.start(e); e--) t = r.before(e);
			for (let e = i.depth; e > 0 && n == i.start(e); e--) n = i.before(e);
			r = e.doc.resolve(t), i = e.doc.resolve(n);
		}
	}
	let a = fn(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function fn(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var pn = class e extends gt {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return _t.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return _t.fromReplace(e, this.pos, this.pos + 1, new d(a.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return pt.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
gt.jsonID("attr", pn);
var mn = class e extends gt {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return _t.ok(n);
	}
	getMap() {
		return pt.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
gt.jsonID("docAttr", mn);
var hn = class extends Error {};
hn = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, hn.prototype = Object.create(Error.prototype), hn.prototype.constructor = hn, hn.prototype.name = "TransformError";
var gn = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new mt();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new hn(t.failed);
		return this;
	}
	maybeStep(e) {
		let t = e.apply(this.doc);
		return t.failed || this.addStep(e, t.doc), t;
	}
	get docChanged() {
		return this.steps.length > 0;
	}
	changedRange() {
		let e = 1e9, t = -1e9;
		for (let n = 0; n < this.mapping.maps.length; n++) {
			let r = this.mapping.maps[n];
			n && (e = r.map(e, 1), t = r.map(t, -1)), r.forEach((n, r, i, a) => {
				e = Math.min(e, i), t = Math.max(t, a);
			});
		}
		return e == 1e9 ? null : {
			from: e,
			to: t
		};
	}
	addStep(e, t) {
		this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
	}
	replace(e, t = e, n = d.empty) {
		let r = Zt(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new d(a.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, d.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return cn(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return un(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return dn(this, e, t), this;
	}
	lift(e, t) {
		return jt(this, e, t), this;
	}
	join(e, t = 1) {
		return Jt(this, e, t), this;
	}
	wrap(e, t) {
		return It(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return Lt(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return Vt(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new pn(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new mn(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new xt(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof l) t.isInSet(n.marks) && this.step(new St(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new St(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return Ut(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return Et(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return Dt(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return Ot(this, e, t, n), this;
	}
}, _n = Object.create(null), C = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new vn(e.min(t), e.max(t))];
	}
	get anchor() {
		return this.$anchor.pos;
	}
	get head() {
		return this.$head.pos;
	}
	get from() {
		return this.$from.pos;
	}
	get to() {
		return this.$to.pos;
	}
	get $from() {
		return this.ranges[0].$from;
	}
	get $to() {
		return this.ranges[0].$to;
	}
	get empty() {
		let e = this.ranges;
		for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
		return !0;
	}
	content() {
		return this.$from.doc.slice(this.from, this.to, !0);
	}
	replace(e, t = d.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? d.empty : t), o == 0 && En(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), En(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new w(e) : Tn(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? Tn(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : Tn(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new Cn(e.node(0));
	}
	static atStart(e) {
		return Tn(e, e, 0, 0, 1) || new Cn(e);
	}
	static atEnd(e) {
		return Tn(e, e, e.content.size, e.childCount, -1) || new Cn(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = _n[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in _n) throw RangeError("Duplicate use of selection JSON ID " + e);
		return _n[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return w.between(this.$anchor, this.$head).getBookmark();
	}
};
C.prototype.visible = !0;
var vn = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, yn = !1;
function bn(e) {
	!yn && !e.parent.inlineContent && (yn = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var w = class e extends C {
	constructor(e, t = e) {
		bn(e), bn(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return C.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = d.empty) {
		if (super.replace(e, t), t == d.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new xn(this.anchor, this.head);
	}
	toJSON() {
		return {
			type: "text",
			anchor: this.anchor,
			head: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number" || typeof n.head != "number") throw RangeError("Invalid input for TextSelection.fromJSON");
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(e, t, n = t) {
		let r = e.resolve(t);
		return new this(r, n == t ? r : e.resolve(n));
	}
	static between(t, n, r) {
		let i = t.pos - n.pos;
		if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
			let e = C.findFrom(n, r, !0) || C.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return C.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (C.findFrom(t, -r, !0) || C.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
C.jsonID("text", w);
var xn = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return w.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, T = class e extends C {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? C.near(a) : new e(a);
	}
	content() {
		return new d(a.from(this.node), 0, 0);
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor;
	}
	toJSON() {
		return {
			type: "node",
			anchor: this.anchor
		};
	}
	getBookmark() {
		return new Sn(this.anchor);
	}
	static fromJSON(t, n) {
		if (typeof n.anchor != "number") throw RangeError("Invalid input for NodeSelection.fromJSON");
		return new e(t.resolve(n.anchor));
	}
	static create(t, n) {
		return new e(t.resolve(n));
	}
	static isSelectable(e) {
		return !e.isText && e.type.spec.selectable !== !1;
	}
};
T.prototype.visible = !1, C.jsonID("node", T);
var Sn = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new xn(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && T.isSelectable(n) ? new T(t) : C.near(t);
	}
}, Cn = class e extends C {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = d.empty) {
		if (t == d.empty) {
			e.delete(0, e.doc.content.size);
			let t = C.atStart(e.doc);
			t.eq(e.selection) || e.setSelection(t);
		} else super.replace(e, t);
	}
	toJSON() {
		return { type: "all" };
	}
	static fromJSON(t) {
		return new e(t);
	}
	map(t) {
		return new e(t);
	}
	eq(t) {
		return t instanceof e;
	}
	getBookmark() {
		return wn;
	}
};
C.jsonID("all", Cn);
var wn = {
	map() {
		return this;
	},
	resolve(e) {
		return new Cn(e);
	}
};
function Tn(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return w.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = Tn(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && T.isSelectable(r)) return T.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function En(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Ct || i instanceof wt)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(C.near(e.doc.resolve(o), n));
}
var Dn = 1, On = 2, kn = 4, An = class extends gn {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Dn) & ~On, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & Dn) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= On, this;
	}
	ensureMarks(e) {
		return l.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & On) > 0;
	}
	addStep(e, t) {
		super.addStep(e, t), this.updated &= ~On, this.storedMarks = null;
	}
	setTime(e) {
		return this.time = e, this;
	}
	replaceSelection(e) {
		return this.selection.replace(this, e), this;
	}
	replaceSelectionWith(e, t = !0) {
		let n = this.selection;
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || l.none))), n.replaceWith(this, e), this;
	}
	deleteSelection() {
		return this.selection.replace(this), this;
	}
	insertText(e, t, n) {
		let r = this.doc.type.schema;
		if (t == null) return e ? this.replaceSelectionWith(r.text(e), !0) : this.deleteSelection();
		{
			if (n ??= t, !e) return this.deleteRange(t, n);
			let i = this.storedMarks;
			if (!i) {
				let e = this.doc.resolve(t);
				i = n == t ? e.marks() : e.marksAcross(this.doc.resolve(n));
			}
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(C.near(this.selection.$to)), this;
		}
	}
	setMeta(e, t) {
		return this.meta[typeof e == "string" ? e : e.key] = t, this;
	}
	getMeta(e) {
		return this.meta[typeof e == "string" ? e : e.key];
	}
	get isGeneric() {
		for (let e in this.meta) return !1;
		return !0;
	}
	scrollIntoView() {
		return this.updated |= kn, this;
	}
	get scrolledIntoView() {
		return (this.updated & kn) > 0;
	}
};
function jn(e, t) {
	return !t || !e ? e : e.bind(t);
}
var Mn = class {
	constructor(e, t, n) {
		this.name = e, this.init = jn(t.init, n), this.apply = jn(t.apply, n);
	}
}, Nn = [
	new Mn("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new Mn("selection", {
		init(e, t) {
			return e.selection || C.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new Mn("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new Mn("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], Pn = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = Nn.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new Mn(e.key, e.spec.state, e));
		});
	}
}, Fn = class e {
	constructor(e) {
		this.config = e;
	}
	get schema() {
		return this.config.schema;
	}
	get plugins() {
		return this.config.plugins;
	}
	apply(e) {
		return this.applyTransaction(e).state;
	}
	filterTransaction(e, t = -1) {
		for (let n = 0; n < this.config.plugins.length; n++) if (n != t) {
			let t = this.config.plugins[n];
			if (t.spec.filterTransaction && !t.spec.filterTransaction.call(t, e, this)) return !1;
		}
		return !0;
	}
	applyTransaction(e) {
		if (!this.filterTransaction(e)) return {
			state: this,
			transactions: []
		};
		let t = [e], n = this.applyInner(e), r = null;
		for (;;) {
			let i = !1;
			for (let a = 0; a < this.config.plugins.length; a++) {
				let o = this.config.plugins[a];
				if (o.spec.appendTransaction) {
					let s = r ? r[a].n : 0, c = r ? r[a].state : this, l = s < t.length && o.spec.appendTransaction.call(o, s ? t.slice(s) : t, c, n);
					if (l && n.filterTransaction(l, a)) {
						if (l.setMeta("appendedTransaction", e), !r) {
							r = [];
							for (let e = 0; e < this.config.plugins.length; e++) r.push(e < a ? {
								state: n,
								n: t.length
							} : {
								state: this,
								n: 0
							});
						}
						t.push(l), n = n.applyInner(l), i = !0;
					}
					r && (r[a] = {
						state: n,
						n: t.length
					});
				}
			}
			if (!i) return {
				state: n,
				transactions: t
			};
		}
	}
	applyInner(t) {
		if (!t.before.eq(this.doc)) throw RangeError("Applying a mismatched transaction");
		let n = new e(this.config), r = this.config.fields;
		for (let e = 0; e < r.length; e++) {
			let i = r[e];
			n[i.name] = i.apply(t, this[i.name], this, n);
		}
		return n;
	}
	get tr() {
		return new An(this);
	}
	static create(t) {
		let n = new Pn(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new Pn(this.schema, t.plugins), r = n.fields, i = new e(n);
		for (let e = 0; e < r.length; e++) {
			let n = r[e].name;
			i[n] = this.hasOwnProperty(n) ? this[n] : r[e].init(t, i);
		}
		return i;
	}
	toJSON(e) {
		let t = {
			doc: this.doc.toJSON(),
			selection: this.selection.toJSON()
		};
		if (this.storedMarks && (t.storedMarks = this.storedMarks.map((e) => e.toJSON())), e && typeof e == "object") for (let n in e) {
			if (n == "doc" || n == "selection") throw RangeError("The JSON fields `doc` and `selection` are reserved");
			let r = e[n], i = r.spec.state;
			i && i.toJSON && (t[n] = i.toJSON.call(r, this[r.key]));
		}
		return t;
	}
	static fromJSON(t, n, r) {
		if (!n) throw RangeError("Invalid input for EditorState.fromJSON");
		if (!t.schema) throw RangeError("Required config field 'schema' missing");
		let i = new Pn(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = se.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = C.fromJSON(a.doc, n.selection);
			else if (e.name == "storedMarks") n.storedMarks && (a.storedMarks = n.storedMarks.map(t.schema.markFromJSON));
			else {
				if (r) for (let i in r) {
					let o = r[i], s = o.spec.state;
					if (o.key == e.name && s && s.fromJSON && Object.prototype.hasOwnProperty.call(n, i)) {
						a[e.name] = s.fromJSON.call(o, t, n[i], a);
						return;
					}
				}
				a[e.name] = e.init(t, a);
			}
		}), a;
	}
};
function In(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = In(i, t, {})), n[r] = i;
	}
	return n;
}
var E = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && In(e.props, this, this.props), this.key = e.key ? e.key.key : Rn("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, Ln = Object.create(null);
function Rn(e) {
	return e in Ln ? e + "$" + ++Ln[e] : (Ln[e] = 0, e + "$");
}
var D = class {
	constructor(e = "key") {
		this.key = Rn(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, zn = (e, t) => e.selection.empty ? !1 : (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function Bn(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var Vn = (e, t, n) => {
	let r = Bn(e, n);
	if (!r) return !1;
	let i = qn(r);
	if (!i) {
		let n = r.blockRange(), i = n && At(n);
		return i == null ? !1 : (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (dr(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (Gn(a, "end") || T.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = Zt(e.doc, r.before(n), r.after(n), d.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(Gn(a, "end") ? C.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : T.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Hn = (e, t, n) => {
	let r = Bn(e, n);
	if (!r) return !1;
	let i = qn(r);
	return i ? Wn(e, i, t) : !1;
}, Un = (e, t, n) => {
	let r = Jn(e, n);
	if (!r) return !1;
	let i = Zn(r);
	return i ? Wn(e, i, t) : !1;
};
function Wn(e, t, n) {
	let r = t.nodeBefore, i = t.pos - 1;
	for (; !r.isTextblock; i--) {
		if (r.type.spec.isolating) return !1;
		let e = r.lastChild;
		if (!e) return !1;
		r = e;
	}
	let a = t.nodeAfter, o = t.pos + 1;
	for (; !a.isTextblock; o++) {
		if (a.type.spec.isolating) return !1;
		let e = a.firstChild;
		if (!e) return !1;
		a = e;
	}
	let s = Zt(e.doc, i, o, d.empty);
	if (!s || s.from != i || s instanceof Ct && s.slice.size >= o - i) return !1;
	if (n) {
		let t = e.tr.step(s);
		t.setSelection(w.create(t.doc, i)), n(t.scrollIntoView());
	}
	return !0;
}
function Gn(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var Kn = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = qn(r);
	}
	let o = a && a.nodeBefore;
	return !o || !T.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(T.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function qn(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function Jn(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var Yn = (e, t, n) => {
	let r = Jn(e, n);
	if (!r) return !1;
	let i = Zn(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (dr(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (Gn(a, "start") || T.isSelectable(a))) {
		let n = Zt(e.doc, r.before(), r.after(), d.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(Gn(a, "start") ? C.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : T.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, Xn = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = Zn(r);
	}
	let o = a && a.nodeAfter;
	return !o || !T.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(T.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function Zn(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var Qn = (e, t) => {
	let n = e.selection, r = n instanceof T, i;
	if (r) {
		if (n.node.isTextblock || !Wt(e.doc, n.from)) return !1;
		i = n.from;
	} else if (i = qt(e.doc, n.from, -1), i == null) return !1;
	if (t) {
		let n = e.tr.join(i);
		r && n.setSelection(T.create(n.doc, i - e.doc.resolve(i).nodeBefore.nodeSize)), t(n.scrollIntoView());
	}
	return !0;
}, $n = (e, t) => {
	let n = e.selection, r;
	if (n instanceof T) {
		if (n.node.isTextblock || !Wt(e.doc, n.to)) return !1;
		r = n.to;
	} else if (r = qt(e.doc, n.to, 1), r == null) return !1;
	return t && t(e.tr.join(r).scrollIntoView()), !0;
}, er = (e, t) => {
	let { $from: n, $to: r } = e.selection, i = n.blockRange(r), a = i && At(i);
	return a == null ? !1 : (t && t(e.tr.lift(i, a).scrollIntoView()), !0);
}, tr = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function nr(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var rr = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = nr(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(C.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, ir = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof Cn || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = nr(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(w.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, ar = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (Ht(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && At(r);
	return i == null ? !1 : (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function or(e) {
	return (t, n) => {
		let { $from: r, $to: i } = t.selection;
		if (t.selection instanceof T && t.selection.node.isBlock) return !r.parentOffset || !Ht(t.doc, r.pos) ? !1 : (n && n(t.tr.split(r.pos).scrollIntoView()), !0);
		if (!r.depth) return !1;
		let a = [], o, s, c = !1, l = !1;
		for (let t = r.depth;; t--) if (r.node(t).isBlock) {
			c = r.end(t) == r.pos + (r.depth - t), l = r.start(t) == r.pos - (r.depth - t), s = nr(r.node(t - 1).contentMatchAt(r.indexAfter(t - 1)));
			let n = e && e(i.parent, c, r);
			a.unshift(n || (c && s ? { type: s } : null)), o = t;
			break;
		} else {
			if (t == 1) return !1;
			a.unshift(null);
		}
		let u = t.tr;
		(t.selection instanceof w || t.selection instanceof Cn) && u.deleteSelection();
		let d = u.mapping.map(r.pos), f = Ht(u.doc, d, a.length, a);
		if (f ||= (a[0] = s ? { type: s } : null, Ht(u.doc, d, a.length, a)), !f) return !1;
		if (u.split(d, a.length, a), !c && l && r.node(o).type != s) {
			let e = u.mapping.map(r.before(o)), t = u.doc.resolve(e);
			s && r.node(o - 1).canReplaceWith(t.index(), t.index() + 1, s) && u.setNodeMarkup(u.mapping.map(r.before(o)), s);
		}
		return n && n(u.scrollIntoView()), !0;
	};
}
var sr = or(), cr = (e, t) => {
	let { $from: n, to: r } = e.selection, i, a = n.sharedDepth(r);
	return a == 0 ? !1 : (i = n.before(a), t && t(e.tr.setSelection(T.create(e.doc, i))), !0);
}, lr = (e, t) => (t && t(e.tr.setSelection(new Cn(e.doc))), !0);
function ur(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || Wt(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function dr(e, t, n, r) {
	let i = t.nodeBefore, o = t.nodeAfter, s, c, l = i.type.spec.isolating || o.type.spec.isolating;
	if (!l && ur(e, t, n)) return !0;
	let u = !l && t.parent.canReplace(t.index(), t.index() + 1);
	if (u && (s = (c = i.contentMatchAt(i.childCount)).findWrapping(o.type)) && c.matchType(s[0] || o.type).validEnd) {
		if (n) {
			let r = t.pos + o.nodeSize, c = a.empty;
			for (let e = s.length - 1; e >= 0; e--) c = a.from(s[e].create(null, c));
			c = a.from(i.copy(c));
			let l = e.tr.step(new wt(t.pos - 1, r, t.pos, r, new d(c, 1, 0), s.length, !0)), u = l.doc.resolve(r + 2 * s.length);
			u.nodeAfter && u.nodeAfter.type == i.type && Wt(l.doc, u.pos) && l.join(u.pos), n(l.scrollIntoView());
		}
		return !0;
	}
	let f = o.type.spec.isolating || r > 0 && l ? null : C.findFrom(t, 1), p = f && f.$from.blockRange(f.$to), m = p && At(p);
	if (m != null && m >= t.depth) return n && n(e.tr.lift(p, m).scrollIntoView()), !0;
	if (u && Gn(o, "start", !0) && Gn(i, "end")) {
		let r = i, s = [];
		for (; s.push(r), !r.isTextblock;) r = r.lastChild;
		let c = o, l = 1;
		for (; !c.isTextblock; c = c.firstChild) l++;
		if (r.canReplace(r.childCount, r.childCount, c.content)) {
			if (n) {
				let r = a.empty;
				for (let e = s.length - 1; e >= 0; e--) r = a.from(s[e].copy(r));
				n(e.tr.step(new wt(t.pos - s.length, t.pos + o.nodeSize, t.pos + l, t.pos + o.nodeSize - l, new d(r, s.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function fr(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(w.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var pr = fr(-1), mr = fr(1);
function hr(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && Mt(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function gr(e, t = null) {
	return function(n, r) {
		let i = !1;
		for (let r = 0; r < n.selection.ranges.length && !i; r++) {
			let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
			n.doc.nodesBetween(a, o, (r, a) => {
				if (i) return !1;
				if (!(!r.isTextblock || r.hasMarkup(e, t))) if (r.type == e) i = !0;
				else {
					let t = n.doc.resolve(a), r = t.index();
					i = t.parent.canReplaceWith(r, r + 1, e);
				}
			});
		}
		if (!i) return !1;
		if (r) {
			let i = n.tr;
			for (let r = 0; r < n.selection.ranges.length; r++) {
				let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
				i.setBlockType(a, o, e, t);
			}
			r(i.scrollIntoView());
		}
		return !0;
	};
}
function _r(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var vr = _r(zn, Vn, Kn), yr = _r(zn, Yn, Xn), br = {
	Enter: _r(tr, ir, ar, sr),
	"Mod-Enter": rr,
	Backspace: vr,
	"Mod-Backspace": vr,
	"Shift-Backspace": vr,
	Delete: yr,
	"Mod-Delete": yr,
	"Mod-a": lr
}, xr = {
	"Ctrl-h": br.Backspace,
	"Alt-Backspace": br["Mod-Backspace"],
	"Ctrl-d": br.Delete,
	"Ctrl-Alt-Backspace": br["Mod-Delete"],
	"Alt-Delete": br["Mod-Delete"],
	"Alt-d": br["Mod-Delete"],
	"Ctrl-a": pr,
	"Ctrl-e": mr
};
for (let e in br) xr[e] = br[e];
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform();
function Sr(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return Cr(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function Cr(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new ae(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new ae(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = Mt(a, n, r, t);
	return s ? (e && wr(e, t, s, i, n), !0) : !1;
}
function wr(e, t, n, r, i) {
	let o = a.empty;
	for (let e = n.length - 1; e >= 0; e--) o = a.from(n[e].type.create(n[e].attrs, o));
	e.step(new wt(t.start - (r ? 2 : 0), t.end, t.start, t.end, new d(o, 0, 0), n.length, !0));
	let s = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (s = e + 1);
	let c = n.length - s, l = t.start + n.length - (r ? 2 : 0), u = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && Ht(e.doc, l, c) && (e.split(l, c), l += 2 * c), l += u.child(n).nodeSize;
	return e;
}
function Tr(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		return a ? n ? r.node(a.depth - 1).type == e ? Er(t, n, e, a) : Dr(t, n, a) : !0 : !1;
	};
}
function Er(e, t, n, r) {
	let i = e.tr, o = r.end, s = r.$to.end(r.depth);
	o < s && (i.step(new wt(o - 1, s, o, s, new d(a.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new ae(i.doc.resolve(r.$from.pos), i.doc.resolve(s), r.depth));
	let c = At(r);
	if (c == null) return !1;
	i.lift(r, c);
	let l = i.doc.resolve(i.mapping.map(o, -1) - 1);
	return Wt(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), t(i.scrollIntoView()), !0;
}
function Dr(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let o = r.doc.resolve(n.start), s = o.nodeAfter;
	if (r.mapping.map(n.end) != n.start + o.nodeAfter.nodeSize) return !1;
	let c = n.startIndex == 0, l = n.endIndex == i.childCount, u = o.node(-1), f = o.index(-1);
	if (!u.canReplace(f + +!c, f + 1, s.content.append(l ? a.empty : a.from(i)))) return !1;
	let p = o.pos, m = p + s.nodeSize;
	return r.step(new wt(p - +!!c, m + +!!l, p + 1, m - 1, new d((c ? a.empty : a.from(i.copy(a.empty))).append(l ? a.empty : a.from(i.copy(a.empty))), +!c, +!l), +!c)), t(r.scrollIntoView()), !0;
}
function Or(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, o = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		if (!o) return !1;
		let s = o.startIndex;
		if (s == 0) return !1;
		let c = o.parent, l = c.child(s - 1);
		if (l.type != e) return !1;
		if (n) {
			let r = l.lastChild && l.lastChild.type == c.type, i = a.from(r ? e.create() : null), s = new d(a.from(e.create(null, a.from(c.type.create(null, i)))), r ? 3 : 1, 0), u = o.start, f = o.end;
			n(t.tr.step(new wt(u - (r ? 3 : 1), f, u, f, s, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
//#endregion
//#region node_modules/prosemirror-view/dist/index.js
var kr = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, Ar = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, jr = null, Mr = function(e, t, n) {
	let r = jr ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Nr = function() {
	jr = null;
}, Pr = function(e, t, n, r) {
	return n && (Ir(e, t, n, r, -1) || Ir(e, t, n, r, 1));
}, Fr = /^(img|br|input|textarea|hr)$/i;
function Ir(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : Lr(e))) {
			let n = e.parentNode;
			if (!n || n.nodeType != 1 || Vr(e) || Fr.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = kr(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (n.nodeType == 1 && n.contentEditable == "false") if (n.pmViewDesc?.ignoreForSelection) t += i;
			else return !1;
			else e = n, t = i < 0 ? Lr(e) : 0;
		} else return !1;
	}
}
function Lr(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Rr(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t) return e;
		if (e.nodeType == 1 && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = Lr(e);
		} else if (e.parentNode && !Vr(e)) t = kr(e), e = e.parentNode;
		else return null;
	}
}
function zr(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t < e.nodeValue.length) return e;
		if (e.nodeType == 1 && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !Vr(e)) t = kr(e) + 1, e = e.parentNode;
		else return null;
	}
}
function Br(e, t, n) {
	for (let r = t == 0, i = t == Lr(e); r || i;) {
		if (e == n) return !0;
		let t = kr(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == Lr(e);
	}
}
function Vr(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var Hr = function(e) {
	return e.focusNode && Pr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function Ur(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Wr(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Gr(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(Lr(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(Lr(r.startContainer), r.startOffset)
		};
	}
}
var Kr = typeof navigator < "u" ? navigator : null, qr = typeof document < "u" ? document : null, Jr = Kr && Kr.userAgent || "", Yr = /Edge\/(\d+)/.exec(Jr), Xr = /MSIE \d/.exec(Jr), Zr = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Jr), Qr = !!(Xr || Zr || Yr), $r = Xr ? document.documentMode : Zr ? +Zr[1] : Yr ? +Yr[1] : 0, ei = !Qr && /gecko\/(\d+)/i.test(Jr);
ei && +(/Firefox\/(\d+)/.exec(Jr) || [0, 0])[1];
var ti = !Qr && /Chrome\/(\d+)/.exec(Jr), ni = !!ti, ri = ti ? +ti[1] : 0, ii = !Qr && !!Kr && /Apple Computer/.test(Kr.vendor), ai = ii && (/Mobile\/\w+/.test(Jr) || !!Kr && Kr.maxTouchPoints > 2), oi = ai || (Kr ? /Mac/.test(Kr.platform) : !1), si = Kr ? /Win/.test(Kr.platform) : !1, ci = /Android \d/.test(Jr), li = !!qr && "webkitFontSmoothing" in qr.documentElement.style, ui = li ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function di(e) {
	let t = e.defaultView && e.defaultView.visualViewport;
	return t ? {
		left: 0,
		right: t.width,
		top: 0,
		bottom: t.height
	} : {
		left: 0,
		right: e.documentElement.clientWidth,
		top: 0,
		bottom: e.documentElement.clientHeight
	};
}
function fi(e, t) {
	return typeof e == "number" ? e : e[t];
}
function pi(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function mi(e, t, n) {
	if (!ki(t) && t.left == 0) return;
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (o.nodeType != 1) {
			o = Ar(o);
			continue;
		}
		let e = o, n = e == a.body, s = n ? di(a) : pi(e), c = 0, l = 0;
		if (t.top < s.top + fi(r, "top") ? l = -(s.top - t.top + fi(i, "top")) : t.bottom > s.bottom - fi(r, "bottom") && (l = t.bottom - t.top > s.bottom - s.top ? t.top + fi(i, "top") - s.top : t.bottom - s.bottom + fi(i, "bottom")), t.left < s.left + fi(r, "left") ? c = -(s.left - t.left + fi(i, "left")) : t.right > s.right - fi(r, "right") && (c = t.right - s.right + fi(i, "right")), c || l) if (n) a.defaultView.scrollBy(c, l);
		else {
			let n = e.scrollLeft, r = e.scrollTop;
			l && (e.scrollTop += l), c && (e.scrollLeft += c);
			let i = e.scrollLeft - n, a = e.scrollTop - r;
			t = {
				left: t.left - i,
				top: t.top - a,
				right: t.right - i,
				bottom: t.bottom - a
			};
		}
		let u = n ? "fixed" : getComputedStyle(o).position;
		if (/^(fixed|sticky)$/.test(u)) break;
		o = u == "absolute" ? o.offsetParent : Ar(o);
	}
}
function hi(e) {
	let t = e.dom.getBoundingClientRect(), n = Math.max(0, t.top), r, i;
	for (let a = (t.left + t.right) / 2, o = n + 1; o < Math.min(innerHeight, t.bottom); o += 5) {
		let t = e.root.elementFromPoint(a, o);
		if (!t || t == e.dom || !e.dom.contains(t)) continue;
		let s = t.getBoundingClientRect();
		if (s.top >= n - 20) {
			r = t, i = s.top;
			break;
		}
	}
	return {
		refDOM: r,
		refTop: i,
		stack: gi(e.dom)
	};
}
function gi(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = Ar(r));
	return t;
}
function _i({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	vi(n, r == 0 ? 0 : r - t);
}
function vi(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var yi = null;
function bi(e) {
	if (e.setActive) return e.setActive();
	if (yi) return e.focus(yi);
	let t = gi(e);
	e.focus(yi == null ? { get preventScroll() {
		return yi = { preventScroll: !0 }, !0;
	} } : void 0), yi || (yi = !1, vi(t, 0));
}
function xi(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (u.nodeType == 1) e = u.getClientRects();
		else if (u.nodeType == 3) e = Mr(u).getClientRects();
		else continue;
		for (let f = 0; f < e.length; f++) {
			let p = e[f];
			if (p.top <= o && p.bottom >= s) {
				o = Math.max(p.bottom, o), s = Math.min(p.top, s);
				let e = p.left > t.left ? p.left - t.left : p.right < t.left ? t.left - p.right : 0;
				if (e < r) {
					n = u, r = e, i = e && n.nodeType == 3 ? {
						left: p.right < t.left ? p.right : p.left,
						top: t.top
					} : t, u.nodeType == 1 && e && (a = d + +(t.left >= (p.left + p.right) / 2));
					continue;
				}
			} else p.top > t.top && !c && p.left <= t.left && p.right >= t.left && (c = u, l = {
				left: Math.max(p.left, Math.min(p.right, t.left)),
				top: p.top
			});
			!n && (t.left >= p.right && t.top >= p.top || t.left >= p.left && t.top >= p.bottom) && (a = d + 1);
		}
	}
	return !n && c && (n = c, i = l, r = 0), n && n.nodeType == 3 ? Si(n, i) : !n || r && n.nodeType == 1 ? {
		node: e,
		offset: a
	} : xi(n, i);
}
function Si(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = Ai(r, 1);
		if (n.top != n.bottom && Ci(t, n)) {
			i = {
				node: e,
				offset: a + +(t.left >= (n.left + n.right) / 2)
			};
			break;
		}
	}
	return r.detach(), i || {
		node: e,
		offset: 0
	};
}
function Ci(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function wi(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function Ti(e, t, n) {
	let { node: r, offset: i } = xi(t, n), a = -1;
	if (r.nodeType == 1 && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function Ei(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (t.dom.nodeType == 1 && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function Di(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (n.nodeType == 1) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (Ci(t, i)) return Di(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function Oi(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Gr(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o.nodeType == 1 ? o : o.parentNode)) {
		let n = e.dom.getBoundingClientRect();
		if (!Ci(t, n) || (o = Di(e.dom, t, n), !o)) return null;
	}
	if (ii) for (let e = o; r && e; e = Ar(e)) e.draggable && (r = void 0);
	if (o = wi(o, t), r) {
		if (ei && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		li && i && r.nodeType == 1 && (n = r.childNodes[i - 1]).nodeType == 1 && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = Ei(e, r, i, t));
	}
	s ??= Ti(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function ki(e) {
	return e.top < e.bottom || e.left < e.right;
}
function Ai(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (ki(e)) return e;
	}
	return Array.prototype.find.call(n, ki) || e.getBoundingClientRect();
}
var ji = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Mi(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = li || ei;
	if (r.nodeType == 3) if (o && (ji.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
		let e = Ai(Mr(r, i, i), n);
		if (ei && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
			let t = Ai(Mr(r, i - 1, i - 1), -1);
			if (t.top == e.top) {
				let n = Ai(Mr(r, i, i + 1), -1);
				if (n.top != e.top) return Ni(n, n.left < t.left);
			}
		}
		return e;
	} else {
		let e = i, t = i, a = n < 0 ? 1 : -1;
		return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, Ni(Ai(Mr(r, e, t), a), a < 0);
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == Lr(r))) {
			let e = r.childNodes[i - 1];
			if (e.nodeType == 1) return Pi(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < Lr(r)) {
			let e = r.childNodes[i];
			if (e.nodeType == 1) return Pi(e.getBoundingClientRect(), !0);
		}
		return Pi(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == Lr(r))) {
		let e = r.childNodes[i - 1], t = e.nodeType == 3 ? Mr(e, Lr(e) - +!o) : e.nodeType == 1 && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return Ni(Ai(t, 1), !1);
	}
	if (a == null && i < Lr(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? e.nodeType == 3 ? Mr(e, 0, +!o) : e.nodeType == 1 ? e : null : null;
		if (t) return Ni(Ai(t, -1), !0);
	}
	return Ni(Ai(r.nodeType == 3 ? Mr(r) : r, -n), n >= 0);
}
function Ni(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function Pi(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function Fi(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Ii(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return Fi(e, t, () => {
		let { node: t } = e.docView.domFromPos(i.pos, n == "up" ? -1 : 1);
		for (;;) {
			let n = e.docView.nearestDesc(t, !0);
			if (!n) break;
			if (n.node.isBlock) {
				t = n.contentDOM || n.dom;
				break;
			}
			t = n.dom.parentNode;
		}
		let r = Mi(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (e.nodeType == 1) t = e.getClientRects();
			else if (e.nodeType == 3) t = Mr(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var Li = /[\u0590-\u08ac]/;
function Ri(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !Li.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : Fi(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !l.contains(u.nodeType == 1 ? u : u.parentNode) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var zi = null, Bi = null, Vi = !1;
function Hi(e, t, n) {
	return zi == t && Bi == n ? Vi : (zi = t, Bi = n, Vi = n == "up" || n == "down" ? Ii(e, t, n) : Ri(e, t, n));
}
var Ui = 0, Wi = 1, Gi = 2, Ki = 3, qi = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = Ui, n.pmViewDesc = this;
	}
	matchesWidget(e) {
		return !1;
	}
	matchesMark(e) {
		return !1;
	}
	matchesNode(e, t, n) {
		return !1;
	}
	matchesHack(e) {
		return !1;
	}
	parseRule(e) {
		return null;
	}
	stopEvent(e) {
		return !1;
	}
	get size() {
		let e = 0;
		for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
		return e;
	}
	get border() {
		return 0;
	}
	destroy() {
		this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
		for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
	}
	posBeforeChild(e) {
		for (let t = 0, n = this.posAtStart;; t++) {
			let r = this.children[t];
			if (r == e) return n;
			n += r.size;
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
	localPosFromDOM(e, t, n) {
		if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)) if (n < 0) {
			let n, r;
			if (e == this.contentDOM) n = e.childNodes[t - 1];
			else {
				for (; e.parentNode != this.contentDOM;) e = e.parentNode;
				n = e.previousSibling;
			}
			for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.previousSibling;
			return n ? this.posBeforeChild(r) + r.size : this.posAtStart;
		} else {
			let n, r;
			if (e == this.contentDOM) n = e.childNodes[t];
			else {
				for (; e.parentNode != this.contentDOM;) e = e.parentNode;
				n = e.nextSibling;
			}
			for (; n && !((r = n.pmViewDesc) && r.parent == this);) n = n.nextSibling;
			return n ? this.posBeforeChild(r) : this.posAtEnd;
		}
		let r;
		if (e == this.dom && this.contentDOM) r = t > kr(this.contentDOM);
		else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) r = e.compareDocumentPosition(this.contentDOM) & 2;
		else if (this.dom.firstChild) {
			if (t == 0) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !1;
					break;
				}
				if (t.previousSibling) break;
			}
			if (r == null && t == e.childNodes.length) for (let t = e;; t = t.parentNode) {
				if (t == this.dom) {
					r = !0;
					break;
				}
				if (t.nextSibling) break;
			}
		}
		return r ?? n > 0 ? this.posAtEnd : this.posAtStart;
	}
	nearestDesc(e, t = !1) {
		for (let n = !0, r = e; r; r = r.parentNode) {
			let i = this.getDesc(r), a;
			if (i && (!t || i.node)) if (n && (a = i.nodeDOM) && !(a.nodeType == 1 ? a.contains(e.nodeType == 1 ? e : e.parentNode) : a == e)) n = !1;
			else return i;
		}
	}
	getDesc(e) {
		let t = e.pmViewDesc;
		for (let e = t; e; e = e.parent) if (e == this) return t;
	}
	posFromDOM(e, t, n) {
		for (let r = e; r; r = r.parentNode) {
			let i = this.getDesc(r);
			if (i) return i.localPosFromDOM(e, t, n);
		}
		return -1;
	}
	descAt(e) {
		for (let t = 0, n = 0; t < this.children.length; t++) {
			let r = this.children[t], i = n + r.size;
			if (n == e && i != n) {
				for (; !r.border && r.children.length;) for (let e = 0; e < r.children.length; e++) {
					let t = r.children[e];
					if (t.size) {
						r = t;
						break;
					}
				}
				return r;
			}
			if (e < i) return r.descAt(e - n - r.border);
			n = i;
		}
	}
	domFromPos(e, t) {
		if (!this.contentDOM) return {
			node: this.dom,
			offset: 0,
			atom: e + 1
		};
		let n = 0, r = 0;
		for (let t = 0; n < this.children.length; n++) {
			let i = this.children[n], a = t + i.size;
			if (a > e || i instanceof ea) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (let e; n && !(e = this.children[n - 1]).size && e instanceof Ji && e.side >= 0; n--);
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, !(!e || e.dom.parentNode == this.contentDOM); n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? kr(e.dom) + 1 : 0
			};
		} else {
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, !(!e || e.dom.parentNode == this.contentDOM); n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? kr(e.dom) : this.contentDOM.childNodes.length
			};
		}
	}
	parseRange(e, t, n = 0) {
		if (this.children.length == 0) return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: 0,
			toOffset: this.contentDOM.childNodes.length
		};
		let r = -1, i = -1;
		for (let a = n, o = 0;; o++) {
			let n = this.children[o], s = a + n.size;
			if (r == -1 && e <= s) {
				let i = a + n.border;
				if (e >= i && t <= s - n.border && n.node && n.contentDOM && this.contentDOM.contains(n.contentDOM)) return n.parseRange(e, t, i);
				e = a;
				for (let t = o; t > 0; t--) {
					let n = this.children[t - 1];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
						r = kr(n.dom) + 1;
						break;
					}
					e -= n.size;
				}
				r == -1 && (r = 0);
			}
			if (r > -1 && (s > t || o == this.children.length - 1)) {
				t = s;
				for (let e = o + 1; e < this.children.length; e++) {
					let n = this.children[e];
					if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(-1)) {
						i = kr(n.dom);
						break;
					}
					t += n.size;
				}
				i == -1 && (i = this.contentDOM.childNodes.length);
				break;
			}
			a = s;
		}
		return {
			node: this.contentDOM,
			from: e,
			to: t,
			fromOffset: r,
			toOffset: i
		};
	}
	emptyChildAt(e) {
		if (this.border || !this.contentDOM || !this.children.length) return !1;
		let t = this.children[e < 0 ? 0 : this.children.length - 1];
		return t.size == 0 || t.emptyChildAt(e);
	}
	domAfterPos(e) {
		let { node: t, offset: n } = this.domFromPos(e, 0);
		if (t.nodeType != 1 || n == t.childNodes.length) throw RangeError("No node after pos " + e);
		return t.childNodes[n];
	}
	setSelection(e, t, n, r = !1) {
		let i = Math.min(e, t), a = Math.max(e, t);
		for (let o = 0, s = 0; o < this.children.length; o++) {
			let c = this.children[o], l = s + c.size;
			if (i > s && a < l) return c.setSelection(e - s - c.border, t - s - c.border, n, r);
			s = l;
		}
		let o = this.domFromPos(e, e ? -1 : 1), s = t == e ? o : this.domFromPos(t, t ? -1 : 1), c = n.root.getSelection(), l = n.domSelectionRange(), u = !1;
		if ((ei || ii) && e == t) {
			let { node: e, offset: t } = o;
			if (e.nodeType == 3) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: kr(n) + 1
						});
						break;
					}
					let e = t.pmViewDesc;
					if (e && e.node && e.node.isBlock) break;
				}
			} else {
				let n = e.childNodes[t - 1];
				u = n && (n.nodeName == "BR" || n.contentEditable == "false");
			}
		}
		if (ei && l.focusNode && l.focusNode != s.node && l.focusNode.nodeType == 1) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && ii) && Pr(o.node, o.offset, l.anchorNode, l.anchorOffset) && Pr(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && ei)) {
			c.collapse(o.node, o.offset);
			try {
				e != t && c.extend(s.node, s.offset), d = !0;
			} catch {}
		}
		if (!d) {
			if (e > t) {
				let e = o;
				o = s, s = e;
			}
			let n = document.createRange();
			n.setEnd(s.node, s.offset), n.setStart(o.node, o.offset), c.removeAllRanges(), c.addRange(n);
		}
	}
	ignoreMutation(e) {
		return !this.contentDOM && e.type != "selection";
	}
	get contentLost() {
		return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
	}
	markDirty(e, t) {
		for (let n = 0, r = 0; r < this.children.length; r++) {
			let i = this.children[r], a = n + i.size;
			if (n == a ? e <= a && t >= n : e < a && t > n) {
				let r = n + i.border, o = a - i.border;
				if (e >= r && t <= o) {
					this.dirty = e == n || t == a ? Gi : Wi, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Ki : i.markDirty(e - r, t - r);
					return;
				} else i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Gi : Ki;
			}
			n = a;
		}
		this.dirty = Gi;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? Gi : Wi;
			t.dirty < n && (t.dirty = n);
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
}, Ji = class extends qi {
	constructor(e, t, n, r) {
		let i, a = t.type.toDOM;
		if (typeof a == "function" && (a = a(n, () => {
			if (!i) return r;
			if (i.parent) return i.parent.posBeforeChild(i);
		})), !t.type.spec.raw) {
			if (a.nodeType != 1) {
				let e = document.createElement("span");
				e.appendChild(a), a = e;
			}
			a.contentEditable = "false", a.classList.add("ProseMirror-widget");
		}
		super(e, [], a, null), this.widget = t, this.widget = t, i = this;
	}
	matchesWidget(e) {
		return this.dirty == Ui && e.type.eq(this.widget.type);
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
}, Yi = class extends qi {
	constructor(e, t, n, r) {
		super(e, [], t, null), this.textDOM = n, this.text = r;
	}
	get size() {
		return this.text.length;
	}
	localPosFromDOM(e, t) {
		return e == this.textDOM ? this.posAtStart + t : this.posAtStart + (t ? this.size : 0);
	}
	domFromPos(e) {
		return {
			node: this.textDOM,
			offset: e
		};
	}
	ignoreMutation(e) {
		return e.type === "characterData" && e.target.nodeValue == e.oldValue;
	}
}, Xi = class e extends qi {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return (!o || !o.dom) && (o = Xe.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & Ki || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != Ki && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != Ui) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = Ui;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = _a(a, n, o, r)), t > 0 && (a = _a(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, Zi = class e extends qi {
	constructor(e, t, n, r, i, a, o) {
		super(e, [], i, a), this.node = t, this.outerDeco = n, this.innerDeco = r, this.nodeDOM = o;
	}
	static create(t, n, r, i, a, o) {
		let s = a.nodeViews[n.type.name], c, l = s && s(n, a, () => {
			if (!c) return o;
			if (c.parent) return c.parent.posBeforeChild(c);
		}, r, i), u = l && l.dom, d = l && l.contentDOM;
		if (n.isText) {
			if (!u) u = document.createTextNode(n.text);
			else if (u.nodeType != 3) throw RangeError("Text must be rendered as a DOM text node");
		} else if (!u) {
			let e = Xe.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = ca(u, r, n), l ? c = new ta(t, n, r, i, u, d || null, f, l) : n.isText ? new $i(t, n, r, i, u, f) : new e(t, n, r, i, u, d || null, f);
	}
	parseRule(e) {
		if (this.node.type.spec.reparseInView) return null;
		let t = {
			node: this.node.type.name,
			attrs: this.node.attrs
		};
		if (this.node.type.whitespace == "pre" && (t.preserveWhitespace = "full"), !this.contentDOM) t.getContent = () => this.node.content;
		else if (!this.contentLost) t.contentElement = this.contentDOM;
		else {
			for (let e = this.children.length - 1; e >= 0; e--) {
				let n = this.children[e];
				if (this.dom.contains(n.dom.parentNode)) {
					t.contentElement = n.dom.parentNode;
					break;
				}
			}
			if (!t.contentElement) {
				let n = e && e.find((t) => t.nodeType == 1 && e.indexOf(t.parentNode) < 0 && this.dom.contains(t));
				n ? t.contentElement = n : t.getContent = () => a.empty;
			}
		}
		return t;
	}
	matchesNode(e, t, n) {
		return this.dirty == Ui && e.eq(this.node) && la(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new da(this, a && a.node, e);
		ma(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? l.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, c, l) => {
			s.syncToMarks(t.marks, n, e, l);
			let u;
			s.findNodeMatch(t, a, c, l) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (u = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, c, u, e) || s.updateNextNode(t, a, c, e, l, r) || s.addNode(t, a, c, e, r), r += t.nodeSize;
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == Gi) && (a && this.protectLocalComposition(e, a), na(this.contentDOM, this.children, e), ai && ha(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof w) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = ga(this.node.content, e, n - t, r - t);
			return a < 0 ? null : {
				node: i,
				pos: a,
				text: e
			};
		} else return {
			node: i,
			pos: -1,
			text: ""
		};
	}
	protectLocalComposition(e, { node: t, pos: n, text: r }) {
		if (this.getDesc(t)) return;
		let i = t;
		for (; i.parentNode != this.contentDOM; i = i.parentNode) {
			for (; i.previousSibling;) i.parentNode.removeChild(i.previousSibling);
			for (; i.nextSibling;) i.parentNode.removeChild(i.nextSibling);
			i.pmViewDesc &&= void 0;
		}
		let a = new Yi(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = _a(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == Ki || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = Ui;
	}
	updateOuterDeco(e) {
		if (la(e, this.outerDeco)) return;
		let t = this.nodeDOM.nodeType != 1, n = this.dom;
		this.dom = oa(this.dom, this.nodeDOM, aa(this.outerDeco, this.node, t), aa(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
	}
	selectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
	}
	deselectNode() {
		this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
	}
	get domAtom() {
		return this.node.isAtom;
	}
};
function Qi(e, t, n, r, i) {
	ca(r, t, e);
	let a = new Zi(void 0, e, t, n, r, r, r);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var $i = class e extends Zi {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, null, a);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == Ki || this.dirty != Ui && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != Ui || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = Ui, !0);
	}
	inParent() {
		let e = this.parent.contentDOM;
		for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
		return !1;
	}
	domFromPos(e) {
		return {
			node: this.nodeDOM,
			offset: e
		};
	}
	localPosFromDOM(e, t, n) {
		return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, n);
	}
	ignoreMutation(e) {
		return e.type != "characterData" && e.type != "selection";
	}
	slice(t, n, r) {
		let i = this.node.cut(t, n), a = document.createTextNode(i.text);
		return new e(this.parent, i, this.outerDeco, this.innerDeco, a, a);
	}
	markDirty(e, t) {
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Ki);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, ea = class extends qi {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == Ui && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, ta = class extends Zi {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, t, n, r, i, a, o), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == Ki) return !1;
		if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
			let i = this.spec.update(e, t, n);
			return i && this.updateInner(e, t, n, r), i;
		} else if (!this.contentDOM && !e.isLeaf) return !1;
		else return super.update(e, t, n, r);
	}
	selectNode() {
		this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
	}
	deselectNode() {
		this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
	}
	setSelection(e, t, n, r) {
		this.spec.setSelection ? this.spec.setSelection(e, t, n.root) : super.setSelection(e, t, n, r);
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
};
function na(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = ua(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof Xi) {
			let t = r ? r.previousSibling : e.lastChild;
			na(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = ua(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var ra = function(e) {
	e && (this.nodeName = e);
};
ra.prototype = Object.create(null);
var ia = [new ra()];
function aa(e, t, n) {
	if (e.length == 0) return ia;
	let r = n ? ia[0] : new ra(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new ra(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new ra(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function oa(e, t, n, r) {
	if (n == ia && r == ia) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName ? i = t : (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = ia[0], i = t);
		}
		sa(i, o || ia[0], a);
	}
	return i;
}
function sa(e, t, n) {
	for (let r in t) r != "class" && r != "style" && r != "nodeName" && !(r in n) && e.removeAttribute(r);
	for (let r in n) r != "class" && r != "style" && r != "nodeName" && n[r] != t[r] && e.setAttribute(r, n[r]);
	if (t.class != n.class) {
		let r = t.class ? t.class.split(" ").filter(Boolean) : [], i = n.class ? n.class.split(" ").filter(Boolean) : [];
		for (let t = 0; t < r.length; t++) i.indexOf(r[t]) == -1 && e.classList.remove(r[t]);
		for (let t = 0; t < i.length; t++) r.indexOf(i[t]) == -1 && e.classList.add(i[t]);
		e.classList.length == 0 && e.removeAttribute("class");
	}
	if (t.style != n.style) {
		if (t.style) {
			let n = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, r;
			for (; r = n.exec(t.style);) e.style.removeProperty(r[1]);
		}
		n.style && (e.style.cssText += n.style);
	}
}
function ca(e, t, n) {
	return oa(e, e, ia, aa(t, n, e.nodeType != 1));
}
function la(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function ua(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var da = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = fa(e.node.content, e);
	}
	destroyBetween(e, t) {
		if (e != t) {
			for (let n = e; n < t; n++) this.top.children[n].destroy();
			this.top.children.splice(e, t - e), this.changed = !0;
		}
	}
	destroyRest() {
		this.destroyBetween(this.index, this.top.children.length);
	}
	syncToMarks(e, t, n, r) {
		let i = 0, a = this.stack.length >> 1, o = Math.min(a, e.length);
		for (; i < o && (i == a - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1;) i++;
		for (; i < a;) this.destroyRest(), this.top.dirty = Ui, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
		for (; a < e.length;) {
			this.stack.push(this.top, this.index + 1);
			let i = -1, o = this.top.children.length;
			r < this.preMatch.index && (o = Math.min(this.index + 3, o));
			for (let t = this.index; t < o; t++) {
				let n = this.top.children[t];
				if (n.matchesMark(e[a]) && !this.isLocked(n.dom)) {
					i = t;
					break;
				}
			}
			if (i < 0 && this.index < this.top.children.length) {
				let t = this.top.children[this.index];
				t instanceof Xi && t.dirty != Ki && t.mark.type == e[a].type && t.spec.update && !this.isLocked(t.dom) && t.spec.update(e[a]) && (t.mark = e[a], i = this.index, this.changed = !0);
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = Xi.create(this.top, e[a], t, n);
				this.top.children.splice(this.index, 0, r), this.top = r, this.changed = !0;
			}
			this.index = 0, a++;
		}
	}
	findNodeMatch(e, t, n, r) {
		let i = -1, a;
		if (r >= this.preMatch.index && (a = this.preMatch.matches[r - this.preMatch.index]).parent == this.top && a.matchesNode(e, t, n)) i = this.top.children.indexOf(a, this.index);
		else for (let r = this.index, a = Math.min(this.top.children.length, r + 5); r < a; r++) {
			let a = this.top.children[r];
			if (a.matchesNode(e, t, n) && !this.preMatch.matched.has(a)) {
				i = r;
				break;
			}
		}
		return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
	}
	updateNodeAt(e, t, n, r, i) {
		let a = this.top.children[r];
		return a.dirty == Ki && a.dom == a.contentDOM && (a.dirty = Gi), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
	}
	findIndexWithChild(e) {
		for (;;) {
			let t = e.parentNode;
			if (!t) return -1;
			if (t == this.top.contentDOM) {
				let t = e.pmViewDesc;
				if (t) {
					for (let e = this.index; e < this.top.children.length; e++) if (this.top.children[e] == t) return e;
				}
				return -1;
			}
			e = t;
		}
	}
	updateNextNode(e, t, n, r, i, a) {
		for (let o = this.index; o < this.top.children.length; o++) {
			let s = this.top.children[o];
			if (s instanceof Zi) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != Ki && la(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = Gi, u.updateChildren(r, a + 1), u.dirty = Ui), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !la(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = Zi.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = Zi.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new Ji(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof Xi;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof $i) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((ii || ni) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new ea(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
	}
};
function fa(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof Xi) n = e, r = e.children.length;
			else {
				s = e, r--;
				break;
			}
		} else if (n == t) break outer;
		else r = n.parent.children.indexOf(n), n = n.parent;
		let c = s.node;
		if (c) {
			if (c != e.child(i - 1)) break;
			--i, a.set(s, i), o.push(s);
		}
	}
	return {
		index: i,
		matched: a,
		matches: o.reverse()
	};
}
function pa(e, t) {
	return e.type.side - t.type.side;
}
function ma(e, t, n, r) {
	let i = t.locals(e), a = 0;
	if (i.length == 0) {
		for (let n = 0; n < e.childCount; n++) {
			let o = e.child(n);
			r(o, i, t.forChild(a, o), n), a += o.nodeSize;
		}
		return;
	}
	let o = 0, s = [], c = null;
	for (let l = 0;;) {
		let u, d;
		for (; o < i.length && i[o].to == a;) {
			let e = i[o++];
			e.widget && (u ? (d ||= [u]).push(e) : u = e);
		}
		if (u) if (d) {
			d.sort(pa);
			for (let e = 0; e < d.length; e++) n(d[e], l, !!c);
		} else n(u, l, !!c);
		let f, p;
		if (c) p = -1, f = c, c = null;
		else if (l < e.childCount) p = l, f = e.child(l++);
		else break;
		for (let e = 0; e < s.length; e++) s[e].to <= a && s.splice(e--, 1);
		for (; o < i.length && i[o].from <= a && i[o].to > a;) s.push(i[o++]);
		let m = a + f.nodeSize;
		if (f.isText) {
			let e = m;
			o < i.length && i[o].from < e && (e = i[o].from);
			for (let t = 0; t < s.length; t++) s[t].to < e && (e = s[t].to);
			e < m && (c = f.cut(e - a), f = f.cut(0, e - a), m = e, p = -1);
		} else for (; o < i.length && i[o].to < m;) o++;
		let h = f.isInline && !f.isLeaf ? s.filter((e) => !e.inline) : s.slice();
		r(f, h, t.forChild(a, f), p), a = m;
	}
}
function ha(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function ga(e, t, n, r) {
	for (let i = 0, a = 0; i < e.childCount && a <= r;) {
		let o = e.child(i++), s = a;
		if (a += o.nodeSize, !o.isText) continue;
		let c = o.text;
		for (; i < e.childCount;) {
			let t = e.child(i++);
			if (a += t.nodeSize, !t.isText) break;
			c += t.text;
		}
		if (a >= n) {
			if (a >= r && c.slice(r - t.length - s, r - s) == t) return r - t.length;
			let e = s < r ? c.lastIndexOf(t, r - s - 1) : -1;
			if (e >= 0 && e + t.length + s >= n) return s + e;
			if (n == r && c.length >= r + t.length - s && c.slice(r - s, r - s + t.length) == t) return r;
		}
	}
	return -1;
}
function _a(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function va(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (Hr(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		let e = i.node;
		if (i && e.isAtom && T.isSelectable(e) && i.parent && !(e.isInline && Br(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new T(o == e ? s : r.resolve(e));
		}
	} else {
		if (n instanceof e.dom.ownerDocument.defaultView.Selection && n.rangeCount > 1) {
			let t = o, i = o;
			for (let r = 0; r < n.rangeCount; r++) {
				let a = n.getRangeAt(r);
				t = Math.min(t, e.docView.posFromDOM(a.startContainer, a.startOffset, 1)), i = Math.max(i, e.docView.posFromDOM(a.endContainer, a.endOffset, -1));
			}
			if (t < 0) return null;
			[c, o] = i == e.state.selection.anchor ? [i, t] : [t, i], s = r.resolve(o);
		} else c = e.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
		if (c < 0) return null;
	}
	let u = r.resolve(c);
	if (!l) {
		let n = t == "pointer" || e.state.selection.head < s.pos && !a ? 1 : -1;
		l = ka(e, u, s, n);
	}
	return l;
}
function ya(e) {
	return e.editable ? e.hasFocus() : ja(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function ba(e, t = !1) {
	let n = e.state.selection;
	if (Da(e, n), !ya(e)) return;
	let r = e.input.mouseDown;
	if (!t && ni && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && Pr(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) Ea(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		xa && !(n instanceof w) && (n.$from.parent.inlineContent || (a = Sa(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = Sa(e, n.to))), e.docView.setSelection(r, i, e, t), xa && (a && wa(a), o && wa(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ta(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var xa = ii || ni && ri < 63;
function Sa(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (ii && i && i.contentEditable == "false") return Ca(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return Ca(i);
		if (a) return Ca(a);
	}
}
function Ca(e) {
	return e.contentEditable = "true", ii && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function wa(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function Ta(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!ya(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function Ea(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, kr(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && Qr && $r <= 11 && (n.disabled = !0, n.disabled = !1);
}
function Da(e, t) {
	if (t instanceof T) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (Oa(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else Oa(e);
}
function Oa(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function ka(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || w.between(t, n, r);
}
function Aa(e) {
	return e.editable && !e.hasFocus() ? !1 : ja(e);
}
function ja(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode));
	} catch {
		return !1;
	}
}
function Ma(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return Pr(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function Na(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && C.findFrom(a, t);
}
function Pa(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function Fa(e, t, n) {
	let r = e.state.selection;
	if (r instanceof w) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return Pa(e, new w(r.$anchor, a));
		} else if (!r.empty) return !1;
		else if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = Na(e.state, t);
			return n && n instanceof T ? Pa(e, n) : !1;
		} else if (!(oi && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? T.isSelectable(i) ? Pa(e, new T(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : li ? Pa(e, new w(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1 : !1;
		}
	} else if (r instanceof T && r.node.isInline) return Pa(e, new w(t > 0 ? r.$to : r.$from));
	else {
		let n = Na(e.state, t);
		return n ? Pa(e, n) : !1;
	}
}
function Ia(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function La(e, t) {
	let n = e.pmViewDesc;
	return n && n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR");
}
function Ra(e, t) {
	return t < 0 ? za(e) : Ba(e);
}
function za(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (ei && n.nodeType == 1 && r < Ia(n) && La(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (n.nodeType != 1) break;
		{
			let e = n.childNodes[r - 1];
			if (La(e, -1)) i = n, a = --r;
			else if (e.nodeType == 3) n = e, r = n.nodeValue.length;
			else break;
		}
	} else if (Va(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && La(t, -1);) i = n.parentNode, a = kr(t), t = t.previousSibling;
		if (t) n = t, r = Ia(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? Wa(e, n, r) : i && Wa(e, i, a);
}
function Ba(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = Ia(n), a, o;
	for (;;) if (r < i) {
		if (n.nodeType != 1) break;
		let e = n.childNodes[r];
		if (La(e, 1)) a = n, o = ++r;
		else break;
	} else if (Va(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && La(t, 1);) a = t.parentNode, o = kr(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = Ia(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && Wa(e, a, o);
}
function Va(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function Ha(e, t) {
	for (; e && t == e.childNodes.length && !Vr(e);) t = kr(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function Ua(e, t) {
	for (; e && !t && !Vr(e);) t = kr(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function Wa(e, t, n) {
	if (t.nodeType != 3) {
		let e, r;
		(r = Ha(t, n)) ? (t = r, n = 0) : (e = Ua(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (Hr(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && ba(e);
	}, 50);
}
function Ga(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(ni || si) && n.parent.inlineContent) {
		let r = e.coordsAtPos(t);
		if (t > n.start()) {
			let n = e.coordsAtPos(t - 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left < r.left ? "ltr" : "rtl";
		}
		if (t < n.end()) {
			let n = e.coordsAtPos(t + 1), i = (n.top + n.bottom) / 2;
			if (i > r.top && i < r.bottom && Math.abs(n.left - r.left) > 1) return n.left > r.left ? "ltr" : "rtl";
		}
	}
	return getComputedStyle(e.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Ka(e, t, n) {
	let r = e.state.selection;
	if (r instanceof w && !r.empty || n.indexOf("s") > -1 || oi && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = Na(e.state, t);
		if (n && n instanceof T) return Pa(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof Cn ? C.near(n, t) : C.findFrom(n, t);
		return o ? Pa(e, o) : !1;
	}
	return !1;
}
function qa(e, t) {
	if (!(e.state.selection instanceof w)) return !0;
	let { $head: n, $anchor: r, empty: i } = e.state.selection;
	if (!n.sameParent(r)) return !0;
	if (!i) return !1;
	if (e.endOfTextblock(t > 0 ? "forward" : "backward")) return !0;
	let a = !n.textOffset && (t < 0 ? n.nodeBefore : n.nodeAfter);
	if (a && !a.isText) {
		let r = e.state.tr;
		return t < 0 ? r.delete(n.pos - a.nodeSize, n.pos) : r.delete(n.pos, n.pos + a.nodeSize), e.dispatch(r), !0;
	}
	return !1;
}
function Ja(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function Ya(e) {
	if (!ii || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && t.nodeType == 1 && n == 0 && t.firstChild && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		Ja(e, n, "true"), setTimeout(() => Ja(e, n, "false"), 20);
	}
	return !1;
}
function Xa(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function Za(e, t) {
	let n = t.keyCode, r = Xa(t);
	if (n == 8 || oi && n == 72 && r == "c") return qa(e, -1) || Ra(e, -1);
	if (n == 46 && !t.shiftKey || oi && n == 68 && r == "c") return qa(e, 1) || Ra(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || oi && n == 66 && r == "c") {
		let t = n == 37 ? Ga(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return Fa(e, t, r) || Ra(e, t);
	} else if (n == 39 || oi && n == 70 && r == "c") {
		let t = n == 39 ? Ga(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return Fa(e, t, r) || Ra(e, t);
	} else if (n == 38 || oi && n == 80 && r == "c") return Ka(e, -1, r) || Ra(e, -1);
	else if (n == 40 || oi && n == 78 && r == "c") return Ya(e) || Ka(e, 1, r) || Ra(e, 1);
	else if (r == (oi ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90)) return !0;
	return !1;
}
function Qa(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || Xe.fromSchema(e.state.schema), s = co(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && l.nodeType == 1 && (u = so[l.nodeName.toLowerCase()]);) {
		for (let e = u.length - 1; e >= 0; e--) {
			let t = s.createElement(u[e]);
			for (; c.firstChild;) t.appendChild(c.firstChild);
			c.appendChild(t), d++;
		}
		l = c.firstChild;
	}
	return l && l.nodeType == 1 && l.setAttribute("data-pm-slice", `${i} ${a}${d ? ` -${d}` : ""} ${JSON.stringify(n)}`), {
		dom: c,
		text: e.someProp("clipboardTextSerializer", (n) => n(t, e)) || t.content.textBetween(0, t.content.size, "\n\n"),
		slice: t
	};
}
function $a(e, t, n, r, i) {
	let o = i.parent.type.spec.code, s, c;
	if (!n && !t) return null;
	let l = !!t && (r || o || !n);
	if (l) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, o || r, e);
		}), o) return c = new d(a.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			c = t(c, e, !0);
		}), c;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) c = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = Xe.fromSchema(r);
			s = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = s.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), s = fo(n), li && po(s);
	let u = s && s.querySelector("[data-pm-slice]"), f = u && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(u.getAttribute("data-pm-slice") || "");
	if (f && f[3]) for (let e = +f[3]; e > 0; e--) {
		let e = s.firstChild;
		for (; e && e.nodeType != 1;) e = e.nextSibling;
		if (!e) break;
		s = e;
	}
	if (c ||= (e.someProp("clipboardParser") || e.someProp("domParser") || Ie.fromSchema(e.state.schema)).parseSlice(s, {
		preserveWhitespace: !!(l || f),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !eo.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), f) c = mo(oo(c, +f[1], +f[2]), f[4]);
	else if (c = d.maxOpen(to(c.content, i), !0), c.openStart || c.openEnd) {
		let e = 0, t = 0;
		for (let t = c.content.firstChild; e < c.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = c.content.lastChild; t < c.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		c = oo(c, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		c = t(c, e, l);
	}), c;
}
var eo = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function to(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, o = [];
		if (e.forEach((e) => {
			if (!o) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return o = null;
			if (n = o.length && i.length && ro(t, i, e, o[o.length - 1], 0)) o[o.length - 1] = n;
			else {
				o.length && (o[o.length - 1] = io(o[o.length - 1], i.length));
				let n = no(e, t);
				o.push(n), r = r.matchType(n.type), i = t;
			}
		}), o) return a.from(o);
	}
	return e;
}
function no(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, a.from(e));
	return e;
}
function ro(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let o = ro(e, t, n, r.lastChild, i + 1);
		if (o) return r.copy(r.content.replaceChild(r.childCount - 1, o));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(a.from(no(n, e, i + 1))));
	}
}
function io(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, io(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(a.empty, !0);
	return e.copy(n.append(r));
}
function ao(e, t, n, r, i, o) {
	let s = t < 0 ? e.firstChild : e.lastChild, c = s.content;
	return e.childCount > 1 && (o = 0), i < r - 1 && (c = ao(c, t, n, r, i + 1, o)), i >= n && (c = t < 0 ? s.contentMatchAt(0).fillBefore(c, o <= i).append(c) : c.append(s.contentMatchAt(s.childCount).fillBefore(a.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, s.copy(c));
}
function oo(e, t, n) {
	return t < e.openStart && (e = new d(ao(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new d(ao(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var so = {
	thead: ["table"],
	tbody: ["table"],
	tfoot: ["table"],
	caption: ["table"],
	colgroup: ["table"],
	col: ["table", "colgroup"],
	tr: ["table", "tbody"],
	td: [
		"table",
		"tbody",
		"tr"
	],
	th: [
		"table",
		"tbody",
		"tr"
	]
};
function co() {
	return document.implementation.createHTMLDocument("title");
}
var lo = null;
function uo(e) {
	let t = window.trustedTypes;
	return t ? (lo ||= t.defaultPolicy || t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e }), lo.createHTML(e)) : e;
}
function fo(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = co(), r = n.body, i = /<([a-z][^>\s]+)/i.exec(e), a;
	if ((a = i && so[i[1].toLowerCase()]) && (e = a.map((e) => "<" + e + ">").join("") + e + a.map((e) => "</" + e + ">").reverse().join("")), r.innerHTML = uo(e), a) for (let e = 0; e < a.length; e++) r = r.querySelector(a[e]) || r;
	for (let e = 0; e < n.styleSheets.length; e++) {
		let t = n.styleSheets[e];
		for (let e = 0; e < t.rules.length; e++) {
			let n = t.rules[e];
			if (n instanceof CSSStyleRule) {
				let e = r.querySelectorAll(n.selectorText);
				for (let t = 0; t < e.length; t++) e[t].style.cssText += n.style.cssText;
			}
		}
	}
	return r;
}
function po(e) {
	let t = e.querySelectorAll(ni ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function mo(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch {
		return e;
	}
	let { content: i, openStart: o, openEnd: s } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		i = a.from(t.create(r[e + 1], i)), o++, s++;
	}
	return new d(i, o, s);
}
var ho = {}, go = {}, _o = {
	touchstart: !0,
	touchmove: !0
}, vo = class {
	constructor() {
		this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = {
			time: 0,
			x: 0,
			y: 0,
			type: "",
			button: 0
		}, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = Object.create(null), this.hideSelectionGuard = null;
	}
};
function yo(e) {
	for (let t in ho) {
		let n = ho[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			wo(e, t) && !Co(e, t) && (e.editable || !(t.type in go)) && n(e, t);
		}, _o[t] ? { passive: !0 } : void 0);
	}
	ii && e.dom.addEventListener("input", () => null), So(e);
}
function bo(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function xo(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function So(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => Co(e, t));
	});
}
function Co(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function wo(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function To(e, t) {
	!Co(e, t) && ho[t.type] && (e.editable || !(t.type in go)) && ho[t.type](e, t);
}
go.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Ho(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(ci && ni && n.keyCode == 13))) if (n.keyCode != 229 && e.domObserver.forceFlush(), ai && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
		let t = Date.now();
		e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
			e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, Ur(13, "Enter"))), e.input.lastIOSEnter = 0);
		}, 200);
	} else e.someProp("handleKeyDown", (t) => t(e, n)) || Za(e, n) ? n.preventDefault() : bo(e, "key");
}, go.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, go.keypress = (e, t) => {
	let n = t;
	if (Ho(e) || !n.charCode || n.ctrlKey && !n.altKey || oi && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof w) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function Eo(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function Do(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function Oo(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function ko(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	n == "pointer" && r.setMeta("pointer", !0), e.dispatch(r);
}
function Ao(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && T.isSelectable(r) ? (ko(e, new T(n), "pointer"), !0) : !1;
}
function jo(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof T && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (T.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i == null ? !1 : (ko(e, T.create(e.state.doc, i), "pointer"), !0);
}
function Mo(e, t, n, r, i) {
	return Oo(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? jo(e, n) : Ao(e, n));
}
function No(e, t, n, r) {
	return Oo(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function Po(e, t, n, r) {
	return Oo(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || Fo(e, n, r);
}
function Fo(e, t, n) {
	if (n.button != 0) return !1;
	let r = Io(e, t, !0), i = e.state.doc;
	return r ? (ko(e, r, "pointer"), r instanceof w && i.eq(e.state.doc) && (e.input.mouseDown = new Vo(e, r)), !0) : !1;
}
function Io(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? w.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return w.create(r, a + 1, a + 1 + t.content.size);
		if (n && T.isSelectable(t)) return T.create(r, a);
	}
	return null;
}
function Lo(e) {
	return Jo(e);
}
var Ro = oi ? "metaKey" : "ctrlKey";
ho.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = Lo(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && Do(n, e.input.lastClick) && !n[Ro] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(Eo(n));
	o && (a == "singleClick" ? e.input.mouseDown = new Bo(e, o, n, !!r) : (a == "doubleClick" ? No : Po)(e, o.pos, o.inside, n) ? n.preventDefault() : bo(e, "pointer"));
};
var zo = class {
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
}, Bo = class extends zo {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Ro], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && s.nodeDOM.nodeType == 1 ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof T && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !!(this.target && !this.target.draggable),
			setUneditable: !!(this.target && ei && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), bo(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || ba(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Eo(e))), this.updateAllowDefault(e), this.allowDefault || !t ? bo(this.view, "pointer") : Mo(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || ii && this.mightDrag && !this.mightDrag.node.isAtom || ni && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (ko(this.view, C.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : bo(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), bo(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, Vo = class extends zo {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), bo(this.view, "pointer");
		let t = this.view.posAtCoords(Eo(e)), n = t && Io(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		ko(this.view, w.create(r, a, o), "pointer");
	}
};
ho.touchstart = (e) => {
	e.input.lastTouch = Date.now(), Lo(e), bo(e, "pointer");
}, ho.touchmove = (e) => {
	e.input.lastTouch = Date.now(), bo(e, "pointer");
}, ho.contextmenu = (e) => Lo(e);
function Ho(e, t) {
	return e.composing ? !0 : ii && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var Uo = ci ? 5e3 : -1;
go.compositionstart = go.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof w && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || ni && si && Wo(e))) e.markCursor = e.state.storedMarks || n.marks(), Jo(e, !0), e.markCursor = null;
		else if (Jo(e, !t.selection.empty), ei && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
			let t = e.domSelectionRange();
			for (let n = t.focusNode, r = t.focusOffset; n && n.nodeType == 1 && r != 0;) {
				let t = r < 0 ? n.lastChild : n.childNodes[r - 1];
				if (!t) break;
				if (t.nodeType == 3) {
					let n = e.domSelection();
					n && n.collapse(t, t.nodeValue.length);
					break;
				} else n = t, r = -1;
			}
		}
		e.input.composing = !0;
	}
	Go(e, Uo);
};
function Wo(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || t.nodeType != 1 || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return r.nodeType == 1 && r.contentEditable == "false";
}
go.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, Go(e, 20));
};
function Go(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => Jo(e), t));
}
function Ko(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function qo(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = Rr(t.focusNode, t.focusOffset), r = zr(t.focusNode, t.focusOffset);
	if (n && r && n != r) {
		let t = r.pmViewDesc, i = e.domObserver.lastChangedTextNode;
		if (n == i || r == i) return i;
		if (!t || !t.isText(r.nodeValue)) return r;
		if (e.input.compositionNode == r) {
			let e = n.pmViewDesc;
			if (!(!e || !e.isText(n.nodeValue))) return r;
		}
	}
	return n || r;
}
function Jo(e, t = !1) {
	if (!(ci && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), Ko(e), t || e.docView && e.docView.dirty) {
			let n = va(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function Yo(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var Xo = Qr && $r < 15 || ai && ui < 604;
ho.copy = go.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = Xo ? null : n.clipboardData, { dom: o, text: s } = Qa(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : Yo(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Zo(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function Qo(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? $o(e, r.value, null, i, t) : $o(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function $o(e, t, n, r, i) {
	let a = $a(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || d.empty))) return !0;
	if (!a) return !1;
	let o = Zo(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function es(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
go.paste = (e, t) => {
	let n = t;
	if (e.composing && !ci) return;
	let r = Xo ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && $o(e, es(r), r.getData("text/html"), i, n) ? n.preventDefault() : Qo(e, n);
};
var ts = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, ns = oi ? "altKey" : "ctrlKey";
function rs(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[ns] : !n;
}
ho.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(Eo(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof T ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = T.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && n.target.nodeType == 1) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = T.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = Qa(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !ni || ri > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(Xo ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Xo || n.dataTransfer.setData("text/plain", c), e.dragging = new ts(l, rs(e, n), o);
}, ho.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, go.dragover = go.dragenter = (e, t) => t.preventDefault(), go.drop = (e, t) => {
	try {
		is(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function is(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(Eo(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = $a(e, es(t.dataTransfer), Xo ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && rs(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || d.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? Xt(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, f = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(f)) return;
	let p = c.doc.resolve(l);
	if (u && T.isSelectable(a.content.firstChild) && p.nodeAfter && p.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new T(p));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(ka(e, p, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
ho.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && ba(e);
	}, 20));
}, ho.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, ho.beforeinput = (e, t) => {
	if (ci && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, Ur(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in go) ho[e] = go[e];
function as(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var ss = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || fs, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new us(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && as(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, cs = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || fs;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new us(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && as(this.attrs, t.attrs) && as(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, ls = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || fs;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new us(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && as(this.attrs, t.attrs) && as(this.spec, t.spec);
	}
	destroy() {}
}, us = class e {
	constructor(e, t, n) {
		this.from = e, this.to = t, this.type = n;
	}
	copy(t, n) {
		return new e(t, n, this.type);
	}
	eq(e, t = 0) {
		return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
	}
	map(e, t, n) {
		return this.type.map(e, this, t, n);
	}
	static widget(t, n, r) {
		return new e(t, t, new ss(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new cs(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new ls(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof cs;
	}
	get widget() {
		return this.type instanceof ss;
	}
}, ds = [], fs = {}, O = class e {
	constructor(e, t) {
		this.local = e.length ? e : ds, this.children = t.length ? t : ds;
	}
	static create(e, t) {
		return t.length ? bs(t, e, 0, fs) : ps;
	}
	find(e, t, n) {
		let r = [];
		return this.findInner(e ?? 0, t ?? 1e9, r, 0, n), r;
	}
	findInner(e, t, n, r, i) {
		for (let a = 0; a < this.local.length; a++) {
			let o = this.local[a];
			o.from <= t && o.to >= e && (!i || i(o.spec)) && n.push(o.copy(o.from + r, o.to + r));
		}
		for (let a = 0; a < this.children.length; a += 3) if (this.children[a] < t && this.children[a + 1] > e) {
			let o = this.children[a] + 1;
			this.children[a + 2].findInner(e - o, t - o, n, r + o, i);
		}
	}
	map(e, t, n) {
		return this == ps || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || fs);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? hs(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(xs), ds) : ps;
	}
	add(t, n) {
		return n.length ? this == ps ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = vs(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, bs(s, e, o + 1, fs)), a += 3;
			}
		});
		let o = gs(a ? ys(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(xs) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == ps ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == ps ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : ps;
	}
	forChild(t, n) {
		if (this == ps) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof cs) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(xs), ds);
			return r ? new ms([t, r]) : t;
		}
		return r || ps;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return Ss(this.localsInner(e));
	}
	localsInner(e) {
		if (this == ps) return ds;
		if (e.inlineContent || !this.local.some(cs.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof cs || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
O.empty = new O([], []), O.removeOverlap = Ss;
var ps = O.empty, ms = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, fs));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return O.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != ps && (a instanceof e ? r = r.concat(a.members) : r.push(a));
		}
		return e.from(r);
	}
	eq(t) {
		if (!(t instanceof e) || t.members.length != this.members.length) return !1;
		for (let e = 0; e < this.members.length; e++) if (!this.members[e].eq(t.members[e])) return !1;
		return !0;
	}
	locals(e) {
		let t, n = !0;
		for (let r = 0; r < this.members.length; r++) {
			let i = this.members[r].localsInner(e);
			if (i.length) if (!t) t = i;
			else {
				n &&= (t = t.slice(), !1);
				for (let e = 0; e < i.length; e++) t.push(i[e]);
			}
		}
		return t ? Ss(n ? t : t.sort(xs)) : ds;
	}
	static from(t) {
		switch (t.length) {
			case 0: return ps;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof O) ? t : t.reduce((e, t) => e.concat(t instanceof O ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function hs(e, t, n, r, i, a, o) {
	let s = e.slice();
	for (let e = 0, t = a; e < n.maps.length; e++) {
		let r = 0;
		n.maps[e].forEach((e, n, i, a) => {
			let o = a - i - (n - e);
			for (let i = 0; i < s.length; i += 3) {
				let a = s[i + 1];
				if (a < 0 || e > a + t - r) continue;
				let c = s[i] + t - r;
				n >= c ? s[i + 1] = e <= c ? -2 : -1 : e >= t && o && (s[i] += o, s[i + 1] += o);
			}
			r += o;
		}), t = n.maps[e].map(t, -1);
	}
	let c = !1;
	for (let t = 0; t < s.length; t += 3) if (s[t + 1] < 0) {
		if (s[t + 1] == -2) {
			c = !0, s[t + 1] = -1;
			continue;
		}
		let l = n.map(e[t] + a), u = l - i;
		if (u < 0 || u >= r.content.size) {
			c = !0;
			continue;
		}
		let d = n.map(e[t + 1] + a, -1) - i, { index: f, offset: p } = r.content.findIndex(u), m = r.maybeChild(f);
		if (m && p == u && p + m.nodeSize == d) {
			let r = s[t + 2].mapInner(n, m, l + 1, e[t] + a + 1, o);
			r == ps ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = bs(_s(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new O(t.sort(xs), s);
}
function gs(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new us(i.from + t, i.to + t, i.type));
	}
	return n;
}
function _s(e, t, n, r, i, a, o) {
	function s(e, t) {
		for (let a = 0; a < e.local.length; a++) {
			let s = e.local[a].map(r, i, t);
			s ? n.push(s) : o.onRemove && o.onRemove(e.local[a].spec);
		}
		for (let n = 0; n < e.children.length; n += 3) s(e.children[n + 2], e.children[n] + t + 1);
	}
	for (let n = 0; n < e.length; n += 3) e[n + 1] == -1 && s(e[n + 2], t[n] + a + 1);
	return n;
}
function vs(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function ys(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function bs(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = vs(e, t, o + n);
		if (s) {
			a = !0;
			let e = bs(s, t, n + o + 1, r);
			e != ps && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = gs(a ? ys(e) : e, -n).sort(xs);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new O(o, i) : ps;
}
function xs(e, t) {
	return e.from - t.from || e.to - t.to;
}
function Ss(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) {
				a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), Cs(t, i + 1, a.copy(r.to, a.to)));
				continue;
			} else {
				a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), Cs(t, i, r.copy(a.from, r.to)));
				break;
			}
		}
	}
	return t;
}
function Cs(e, t, n) {
	for (; t < e.length && xs(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function ws(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != ps && t.push(r);
	}), e.cursorWrapper && t.push(O.create(e.state.doc, [e.cursorWrapper.deco])), ms.from(t);
}
var Ts = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, Es = Qr && $r <= 11, Ds = class {
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
}, Os = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Ds(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			Qr && $r <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : ii && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), Es && (this.onCharData = (e) => {
			this.queue.push({
				target: e.target,
				type: "characterData",
				oldValue: e.prevValue
			}), this.flushSoon();
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
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Ts)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
	}
	stop() {
		if (this.observer) {
			let e = this.observer.takeRecords();
			if (e.length) {
				for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
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
		if (Aa(this.view)) {
			if (this.suppressingSelectionUpdates) return ba(this.view);
			if (Qr && $r <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && Pr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
			}
			this.flush();
		}
	}
	setCurSelection() {
		this.currentSelection.set(this.view.domSelectionRange());
	}
	ignoreSelectionChange(e) {
		if (!e.focusNode) return !0;
		let t = /* @__PURE__ */ new Set(), n;
		for (let n = e.focusNode; n; n = Ar(n)) t.add(n);
		for (let r = e.anchorNode; r; r = Ar(r)) if (t.has(r)) {
			n = r;
			break;
		}
		let r = n && this.view.docView.nearestDesc(n);
		if (r && r.ignoreMutation({
			type: "selection",
			target: n.nodeType == 3 ? n.parentNode : n
		})) return this.setCurSelection(), !0;
	}
	pendingRecords() {
		if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
		return this.queue;
	}
	flush() {
		let { view: e } = this;
		if (!e.docView || this.flushingSoon > -1) return;
		let t = this.pendingRecords();
		t.length && (this.queue = []);
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && Aa(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || ni && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
			for (let e of s) if (e.nodeName == "BR" && e.parentNode) {
				let t = e.nextSibling;
				for (; t && t.nodeType == 1;) {
					if (t.contentEditable == "false") {
						e.parentNode.removeChild(e);
						break;
					}
					t = t.firstChild;
				}
			}
		} else if (ei && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || Ps(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Hr(n) && (c = va(e)) && c.eq(C.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, ba(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), js(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, Fs(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || ba(e), this.currentSelection.set(n));
	}
	registerMutation(e, t) {
		if (t.indexOf(e.target) > -1) return null;
		let n = this.view.docView.nearestDesc(e.target);
		if (e.type == "attributes" && (n == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !n || n.ignoreMutation(e)) return null;
		if (e.type == "childList") {
			for (let n = 0; n < e.addedNodes.length; n++) {
				let r = e.addedNodes[n];
				t.push(r), r.nodeType == 3 && (this.lastChangedTextNode = r);
			}
			if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(e.target)) return {
				from: n.posBefore,
				to: n.posAfter
			};
			let r = e.previousSibling, i = e.nextSibling;
			if (Qr && $r <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? kr(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? kr(i) : e.target.childNodes.length;
			return {
				from: o,
				to: n.localPosFromDOM(e.target, s, 1)
			};
		} else if (e.type == "attributes") return {
			from: n.posAtStart - n.border,
			to: n.posAtEnd + n.border
		};
		else return this.lastChangedTextNode = e.target, {
			from: n.posAtStart,
			to: n.posAtEnd,
			typeOver: e.target.nodeValue == e.oldValue
		};
	}
}, ks = /* @__PURE__ */ new WeakMap(), As = !1;
function js(e) {
	if (!ks.has(e) && (ks.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = ei, As) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), As = !0;
	}
}
function Ms(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return Pr(o.node, o.offset, i, a) && ([n, r, i, a] = [
		i,
		a,
		n,
		r
	]), {
		anchorNode: n,
		anchorOffset: r,
		focusNode: i,
		focusOffset: a
	};
}
function Ns(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return Ms(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? Ms(e, n) : null;
}
function Ps(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function Fs(e, t) {
	let { focusNode: n, focusOffset: r } = e.domSelectionRange();
	for (let i of t) if (i.parentNode?.nodeName == "TR") {
		let t = i.nextSibling;
		for (; t && t.nodeName != "TD" && t.nodeName != "TH";) t = t.nextSibling;
		if (t) {
			let a = t;
			for (;;) {
				let e = a.firstChild;
				if (!e || e.nodeType != 1 || e.contentEditable == "false" || /^(BR|IMG)$/.test(e.nodeName)) break;
				a = e;
			}
			a.insertBefore(i, a.firstChild), n == i && e.domSelection().collapse(i, r);
		} else i.parentNode.removeChild(i);
	}
}
function Is(e, t, n, r) {
	let { node: i, fromOffset: a, toOffset: o, from: s, to: c } = e.docView.parseRange(t, n), l = e.domSelectionRange(), u, d = l.anchorNode;
	if (d && e.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (u = [{
		node: d,
		offset: l.anchorOffset
	}], Hr(l) || u.push({
		node: l.focusNode,
		offset: l.focusOffset
	})), ni && e.input.lastKeyCode === 8) for (let e = o; e > a; e--) {
		let t = i.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			o = e;
			break;
		}
		if (!n || n.size) break;
	}
	let f = e.state.doc, p = e.someProp("domParser") || Ie.fromSchema(e.state.schema), m = f.resolve(s), h = null, g = p.parse(i, {
		topNode: m.parent,
		topMatch: m.parent.contentMatchAt(m.index()),
		topOpen: !0,
		from: a,
		to: o,
		preserveWhitespace: m.parent.type.whitespace != "pre" || "full",
		findPositions: u,
		ruleFromNode: Ls(r),
		context: m
	});
	if (u && u[0].pos != null) {
		let e = u[0].pos, t = u[1] && u[1].pos;
		t ??= e, h = {
			anchor: e + s,
			head: t + s
		};
	}
	return {
		doc: g,
		sel: h,
		from: s,
		to: c
	};
}
var Ls = (e) => (t) => {
	let n = t.pmViewDesc;
	if (n) return n.parseRule(e);
	if (t.nodeName == "BR" && t.parentNode) {
		if (ii && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		} else if (t.parentNode.lastChild == t || ii && /^(tr|table)$/i.test(t.parentNode.nodeName)) return { ignore: !0 };
	} else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}, Rs = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function zs(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = va(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (ni && ci && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, Ur(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = Is(e, t, n, i), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Ws(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (ai && e.input.lastIOSEnter > Date.now() - 225 || ci) && i.some((e) => e.nodeType == 1 && !Rs.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, Ur(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) if (r && c instanceof w && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
		start: c.from,
		endA: c.to,
		endB: c.to
	};
	else {
		if (l.sel) {
			let t = Bs(e, e.state.doc, l.sel);
			if (t && !t.eq(e.state.selection)) {
				let n = e.state.tr.setSelection(t);
				a && n.setMeta("composition", a), e.dispatch(n);
			}
		}
		return;
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof w && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), Qr && $r <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((ai && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && h.pos < l.doc.content.size && (!h.sameParent(g) || !h.parent.inlineContent) && h.pos < g.pos && !/\S/.test(l.doc.textBetween(h.pos, g.pos, "", ""))) && e.someProp("handleKeyDown", (t) => t(e, Ur(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && Hs(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, Ur(8, "Backspace")))) {
		ci && ni && e.domObserver.suppressSelectionUpdates();
		return;
	}
	ni && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), ci && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, Ur(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = Bs(e, n.doc, l.sel);
			t && !(ni && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || Qr && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, S;
	if (v) if (h.pos == g.pos) {
		Qr && $r <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => ba(e), 20));
		let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
		n && t.ensureMarks(n), e.dispatch(t);
	} else if (m.endA == m.endB && (S = Vs(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
		let t = x(e.state.tr);
		S.type == "add" ? t.addMark(y, b, S.mark) : t.removeMark(y, b, S.mark), e.dispatch(t);
	} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
		let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
		e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
	} else e.dispatch(x());
	else e.dispatch(x());
}
function Bs(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : ka(e, t.resolve(n.anchor), t.resolve(n.head));
}
function Vs(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, o = r, s, c, l;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) o = n[e].removeFromSet(o);
	if (i.length == 1 && o.length == 0) c = i[0], s = "add", l = (e) => e.mark(c.addToSet(e.marks));
	else if (i.length == 0 && o.length == 1) c = o[0], s = "remove", l = (e) => e.mark(c.removeFromSet(e.marks));
	else return null;
	let u = [];
	for (let e = 0; e < t.childCount; e++) u.push(l(t.child(e)));
	if (a.from(u).eq(e)) return {
		mark: c,
		type: s
	};
}
function Hs(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || Us(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(Us(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || Us(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Us(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Ws(e, t, n, r, i) {
	let a = e.findDiffStart(t, n), o = n + e.size, s = n + t.size;
	if (a == null) return null;
	let { a: c, b: l } = e.findDiffEnd(t, o, s);
	if (i == "end") {
		let e = Math.max(0, a - Math.min(c, l));
		r -= c + e - a;
	}
	if (c < a && o < s) {
		let e = r <= a && r >= c ? a - r : 0;
		a -= e, l = a + (l - c), c = a;
	} else if (l < a) {
		let e = r <= a && r >= l ? a - r : 0;
		a -= e, c = a + (c - l), l = a;
	}
	return {
		start: a,
		endA: c,
		endB: l
	};
}
var Gs = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new vo(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Qs), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Js(this), qs(this), this.nodeViews = Xs(this), this.docView = Qi(this.state.doc, Ks(this), ws(this), this.dom, this), this.domObserver = new Os(this, (e, t, n, r) => zs(this, e, t, n, r)), this.domObserver.start(), yo(this), this.updatePluginViews();
	}
	get composing() {
		return this.input.composing;
	}
	get props() {
		if (this._props.state != this.state) {
			let e = this._props;
			this._props = {};
			for (let t in e) this._props[t] = e[t];
			this._props.state = this.state;
		}
		return this._props;
	}
	update(e) {
		e.handleDOMEvents != this._props.handleDOMEvents && So(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(Qs), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
	}
	setProps(e) {
		let t = {};
		for (let e in this._props) t[e] = this._props[e];
		t.state = this.state;
		for (let n in e) t[n] = e[n];
		this.update(t);
	}
	updateState(e) {
		this.updateStateInner(e, this._props);
	}
	updateStateInner(e, t) {
		let n = this.state, r = !1, i = !1;
		e.storedMarks && this.composing && (Ko(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = Xs(this);
			Zs(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && So(this), this.editable = Js(this), qs(this);
		let o = ws(this), s = Ks(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && hi(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (Qr || ni) && !this.composing && !n.selection.empty && !e.selection.empty && Ys(n.selection, e.selection);
			if (l) {
				let n = ni ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = qo(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = Qi(e.doc, s, o, this.dom, this)), n && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Ma(this) && i.delaySelUpdate()) ? ba(this, t) : (Da(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && _i(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode)) && !this.someProp("handleScrollToSelection", (e) => e(this))) if (this.state.selection instanceof T) {
			let t = this.docView.domAfterPos(this.state.selection.from);
			t.nodeType == 1 && mi(this, t.getBoundingClientRect(), e);
		} else mi(this, this.coordsAtPos(this.state.selection.head, 1), e);
	}
	destroyPluginViews() {
		let e;
		for (; e = this.pluginViews.pop();) e.destroy && e.destroy();
	}
	updatePluginViews(e) {
		if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
			this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
			for (let e = 0; e < this.directPlugins.length; e++) {
				let t = this.directPlugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
			for (let e = 0; e < this.state.plugins.length; e++) {
				let t = this.state.plugins[e];
				t.spec.view && this.pluginViews.push(t.spec.view(this));
			}
		} else for (let t = 0; t < this.pluginViews.length; t++) {
			let n = this.pluginViews[t];
			n.update && n.update(this, e);
		}
	}
	updateDraggedNode(e, t) {
		let n = e.node, r = -1;
		if (n.from < this.state.doc.content.size && this.state.doc.nodeAt(n.from) == n.node) r = n.from;
		else {
			let e = n.from + (this.state.doc.content.size - t.doc.content.size);
			(e > 0 && e < this.state.doc.content.size && this.state.doc.nodeAt(e)) == n.node && (r = e);
		}
		this.dragging = new ts(e.slice, e.move, r < 0 ? void 0 : T.create(this.state.doc, r));
	}
	someProp(e, t) {
		let n = this._props && this._props[e], r;
		if (n != null && (r = t ? t(n) : n)) return r;
		for (let n = 0; n < this.directPlugins.length; n++) {
			let i = this.directPlugins[n].props[e];
			if (i != null && (r = t ? t(i) : i)) return r;
		}
		let i = this.state.plugins;
		if (i) for (let n = 0; n < i.length; n++) {
			let a = i[n].props[e];
			if (a != null && (r = t ? t(a) : a)) return r;
		}
	}
	hasFocus() {
		if (Qr) {
			let e = this.root.activeElement;
			if (e == this.dom) return !0;
			if (!e || !this.dom.contains(e)) return !1;
			for (; e && this.dom != e && this.dom.contains(e);) {
				if (e.contentEditable == "false") return !1;
				e = e.parentElement;
			}
			return !0;
		}
		return this.root.activeElement == this.dom;
	}
	focus() {
		this.domObserver.stop(), this.editable && bi(this.dom), ba(this), this.domObserver.start();
	}
	get root() {
		let e = this._root;
		if (e == null) {
			for (let e = this.dom.parentNode; e; e = e.parentNode) if (e.nodeType == 9 || e.nodeType == 11 && e.host) return e.getSelection || (Object.getPrototypeOf(e).getSelection = () => e.ownerDocument.getSelection()), this._root = e;
		}
		return e || document;
	}
	updateRoot() {
		this._root = null;
	}
	posAtCoords(e) {
		return Oi(this, e);
	}
	coordsAtPos(e, t = 1) {
		return Mi(this, e, t);
	}
	domAtPos(e, t = 0) {
		return this.docView.domFromPos(e, t);
	}
	nodeDOM(e) {
		let t = this.docView.descAt(e);
		return t ? t.nodeDOM : null;
	}
	posAtDOM(e, t, n = -1) {
		let r = this.docView.posFromDOM(e, t, n);
		if (r == null) throw RangeError("DOM position not inside the editor");
		return r;
	}
	endOfTextblock(e, t) {
		return Hi(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return $o(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return $o(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return Qa(this, e);
	}
	destroy() {
		this.docView && (xo(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ws(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Nr());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return To(this, e);
	}
	domSelectionRange() {
		let e = this.domSelection();
		return e ? ii && this.root.nodeType === 11 && Wr(this.dom.ownerDocument) == this.dom && Ns(this, e) || e : {
			focusNode: null,
			focusOffset: 0,
			anchorNode: null,
			anchorOffset: 0
		};
	}
	domSelection() {
		return this.root.getSelection();
	}
};
Gs.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function Ks(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [us.node(0, e.state.doc.content.size, t)];
}
function qs(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: us.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function Js(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function Ys(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function Xs(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function Zs(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function Qs(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
for (var $s = {
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
}, ec = {
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
	222: "\""
}, tc = typeof navigator < "u" && /Mac/.test(navigator.platform), nc = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), rc = 0; rc < 10; rc++) $s[48 + rc] = $s[96 + rc] = String(rc);
for (var rc = 1; rc <= 24; rc++) $s[rc + 111] = "F" + rc;
for (var rc = 65; rc <= 90; rc++) $s[rc] = String.fromCharCode(rc + 32), ec[rc] = String.fromCharCode(rc);
for (var ic in $s) ec.hasOwnProperty(ic) || (ec[ic] = $s[ic]);
function ac(e) {
	var t = !(tc && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || nc && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? ec : $s)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
//#endregion
//#region node_modules/prosemirror-keymap/dist/index.js
var oc = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), sc = typeof navigator < "u" && /Win/.test(navigator.platform);
function cc(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) oc ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function lc(e) {
	let t = Object.create(null);
	for (let n in e) t[cc(n)] = e[n];
	return t;
}
function uc(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function dc(e) {
	return new E({ props: { handleKeyDown: fc(e) } });
}
function fc(e) {
	let t = lc(e);
	return function(e, n) {
		let r = ac(n), i, a = t[uc(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[uc(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(sc && n.ctrlKey && n.altKey) && (i = $s[n.keyCode]) && i != r) {
				let r = t[uc(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
//#endregion
//#region node_modules/@tiptap/core/dist/index.js
var pc = Object.defineProperty, mc = (e, t) => {
	for (var n in t) pc(e, n, {
		get: t[n],
		enumerable: !0
	});
};
function hc(e) {
	let { state: t, transaction: n } = e, { selection: r } = n, { doc: i } = n, { storedMarks: a } = n;
	return {
		...t,
		apply: t.apply.bind(t),
		applyTransaction: t.applyTransaction.bind(t),
		plugins: t.plugins,
		schema: t.schema,
		reconfigure: t.reconfigure.bind(t),
		toJSON: t.toJSON.bind(t),
		get storedMarks() {
			return a;
		},
		get selection() {
			return r;
		},
		get doc() {
			return i;
		},
		get tr() {
			return r = n.selection, i = n.doc, a = n.storedMarks, n;
		}
	};
}
var gc = class {
	constructor(e) {
		this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
	}
	get hasCustomState() {
		return !!this.customState;
	}
	get state() {
		return this.customState || this.editor.state;
	}
	get commands() {
		let { rawCommands: e, editor: t, state: n } = this, { view: r } = t, { tr: i } = n, a = this.buildProps(i);
		return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, (...e) => {
			let n = t(...e)(a);
			return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), n;
		}]));
	}
	get chain() {
		return () => this.createChain();
	}
	get can() {
		return () => this.createCan();
	}
	createChain(e, t = !0) {
		let { rawCommands: n, editor: r, state: i } = this, { view: a } = r, o = [], s = !!e, c = e || i.tr, l = () => (!s && t && !c.getMeta("preventDispatch") && !this.hasCustomState && a.dispatch(c), o.every((e) => e === !0)), u = {
			...Object.fromEntries(Object.entries(n).map(([e, n]) => [e, (...e) => {
				let r = this.buildProps(c, t), i = n(...e)(r);
				return o.push(i), u;
			}])),
			run: l
		};
		return u;
	}
	createCan(e) {
		let { rawCommands: t, state: n } = this, r = e || n.tr, i = this.buildProps(r, !1);
		return {
			...Object.fromEntries(Object.entries(t).map(([e, t]) => [e, (...e) => t(...e)({
				...i,
				dispatch: void 0
			})])),
			chain: () => this.createChain(r, !1)
		};
	}
	buildProps(e, t = !0) {
		let { rawCommands: n, editor: r, state: i } = this, { view: a } = r, o = {
			tr: e,
			editor: r,
			view: a,
			state: hc({
				state: i,
				transaction: e
			}),
			dispatch: t ? () => void 0 : void 0,
			chain: () => this.createChain(e, t),
			can: () => this.createCan(e),
			get commands() {
				return Object.fromEntries(Object.entries(n).map(([e, t]) => [e, (...e) => t(...e)(o)]));
			}
		};
		return o;
	}
}, _c = {};
mc(_c, {
	blur: () => vc,
	clearContent: () => yc,
	clearNodes: () => bc,
	command: () => xc,
	createParagraphNear: () => Sc,
	cut: () => Cc,
	deleteCurrentNode: () => wc,
	deleteNode: () => Tc,
	deleteRange: () => Ec,
	deleteSelection: () => Ac,
	enter: () => jc,
	exitCode: () => Mc,
	extendMarkRange: () => zc,
	first: () => Bc,
	focus: () => qc,
	forEach: () => Jc,
	insertContent: () => Yc,
	insertContentAt: () => tl,
	insertDefaultBlock: () => rl,
	joinBackward: () => ol,
	joinDown: () => al,
	joinForward: () => sl,
	joinItemBackward: () => cl,
	joinItemForward: () => ll,
	joinTextblockBackward: () => ul,
	joinTextblockForward: () => dl,
	joinUp: () => il,
	keyboardShortcut: () => ml,
	lift: () => gl,
	liftEmptyBlock: () => _l,
	liftListItem: () => vl,
	newlineInCode: () => yl,
	resetAttributes: () => Sl,
	scrollIntoView: () => Cl,
	selectAll: () => wl,
	selectNodeBackward: () => Tl,
	selectNodeForward: () => El,
	selectParentNode: () => Dl,
	selectTextblockEnd: () => Ol,
	selectTextblockStart: () => kl,
	setContent: () => jl,
	setMark: () => ku,
	setMeta: () => Au,
	setNode: () => ju,
	setNodeSelection: () => Mu,
	setTextDirection: () => Nu,
	setTextSelection: () => Pu,
	sinkListItem: () => Fu,
	splitBlock: () => Lu,
	splitListItem: () => Ru,
	toggleList: () => Wu,
	toggleMark: () => Gu,
	toggleNode: () => Ku,
	toggleWrap: () => qu,
	undoInputRule: () => Ju,
	unsetAllMarks: () => Yu,
	unsetMark: () => Xu,
	unsetTextDirection: () => Zu,
	updateAttributes: () => Qu,
	wrapIn: () => $u,
	wrapInList: () => ed
});
var vc = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
	e.isDestroyed || (t.dom.blur(), (window == null ? void 0 : window.getSelection())?.removeAllRanges());
}), !0), yc = (e = !0) => ({ commands: t }) => t.setContent("", { emitUpdate: e }), bc = () => ({ state: e, tr: t, dispatch: n }) => {
	let { selection: r } = t, { ranges: i } = r;
	return n && i.forEach(({ $from: n, $to: r }) => {
		e.doc.nodesBetween(n.pos, r.pos, (e, n) => {
			if (e.type.isText) return;
			let { doc: r, mapping: i } = t, a = r.resolve(i.map(n)), o = r.resolve(i.map(n + e.nodeSize)), s = a.blockRange(o);
			if (!s) return;
			let c = At(s);
			if (e.type.isTextblock) {
				let { defaultType: e } = a.parent.contentMatchAt(a.index());
				t.setNodeMarkup(s.start, e);
			}
			(c || c === 0) && t.lift(s, c);
		});
	}), !0;
}, xc = (e) => (t) => e(t), Sc = () => ({ state: e, dispatch: t }) => ir(e, t), Cc = (e, t) => ({ editor: n, tr: r }) => {
	let { state: i } = n, a = i.doc.slice(e.from, e.to);
	r.deleteRange(e.from, e.to);
	let o = r.mapping.map(t);
	return r.insert(o, a.content), r.setSelection(new w(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, wc = () => ({ tr: e, dispatch: t }) => {
	let { selection: n } = e, r = n.$anchor.node();
	if (r.content.size > 0) return !1;
	let i = e.selection.$anchor;
	for (let n = i.depth; n > 0; --n) if (i.node(n).type === r.type) {
		if (t) {
			let t = i.before(n), r = i.after(n);
			e.delete(t, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
};
function k(e, t) {
	if (typeof e == "string") {
		if (!t.nodes[e]) throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
		return t.nodes[e];
	}
	return e;
}
var Tc = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let i = k(e, n.schema), a = t.selection.$anchor;
	for (let e = a.depth; e > 0; --e) if (a.node(e).type === i) {
		if (r) {
			let n = a.before(e), r = a.after(e);
			t.delete(n, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
}, Ec = (e) => ({ tr: t, dispatch: n }) => {
	let { from: r, to: i } = e;
	return n && t.delete(r, i), !0;
}, Dc = (e) => e.content ? /^text(\*|\+)/.test(e.content) : !1, Oc = (e, t, n) => {
	if (!e.parent.isInline || n === "left" && e.pos > e.start() || n === "right" && e.pos < e.end()) return e.pos;
	let r = t.nodes[e.parent.type.name].spec;
	return Dc(r) ? n === "left" ? e.start() - 1 : e.end() + 1 : e.pos;
}, kc = (e, t, n) => ({
	from: Oc(e, n, "left"),
	to: Oc(t, n, "right")
}), Ac = () => ({ state: e, dispatch: t }) => {
	if (e.selection.empty) return !1;
	if (t) {
		let n = e.tr, { ranges: r } = e.selection, i = n.steps.length;
		r.forEach((t) => {
			let r = n.mapping.slice(i), { from: a, to: o } = kc(n.doc.resolve(r.map(t.$from.pos)), n.doc.resolve(r.map(t.$to.pos)), e.schema);
			n.deleteRange(a, o);
		}), n.selection.empty || n.setSelection(w.near(n.doc.resolve(n.selection.from))), n.scrollIntoView(), t(n);
	}
	return !0;
}, jc = () => ({ commands: e }) => e.keyboardShortcut("Enter"), Mc = () => ({ state: e, dispatch: t }) => rr(e, t);
function Nc(e) {
	return Object.prototype.toString.call(e) === "[object RegExp]";
}
function Pc(e, t, n = { strict: !0 }) {
	let r = Object.keys(t);
	return !r.length || r.every((r) => n.strict ? t[r] === e[r] : Nc(t[r]) ? t[r].test(e[r]) : t[r] === e[r]);
}
function Fc(e, t, n = {}) {
	return e.find((e) => e.type === t && Pc(Object.fromEntries(Object.keys(n).map((t) => [t, e.attrs[t]])), n));
}
function Ic(e, t, n = {}) {
	return !!Fc(e, t, n);
}
function Lc(e, t, n) {
	if (!e || !t) return;
	let r = e.parent.childAfter(e.parentOffset);
	if ((!r.node || !r.node.marks.some((e) => e.type === t)) && (r = e.parent.childBefore(e.parentOffset)), !r.node || !r.node.marks.some((e) => e.type === t)) return;
	if (!n) {
		let e = r.node.marks.find((e) => e.type === t);
		e && (n = e.attrs);
	}
	if (!Fc([...r.node.marks], t, n)) return;
	let i = r.index, a = e.start() + r.offset, o = i + 1, s = a + r.node.nodeSize;
	for (; i > 0 && Ic([...e.parent.child(i - 1).marks], t, n);) --i, a -= e.parent.child(i).nodeSize;
	for (; o < e.parent.childCount && Ic([...e.parent.child(o).marks], t, n);) s += e.parent.child(o).nodeSize, o += 1;
	return {
		from: a,
		to: s
	};
}
function Rc(e, t) {
	if (typeof e == "string") {
		if (!t.marks[e]) throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
		return t.marks[e];
	}
	return e;
}
var zc = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = Rc(e, r.schema), { doc: o, selection: s } = n, { $from: c, from: l, to: u } = s;
	if (i) {
		let e = Lc(c, a, t);
		if (e && e.from <= l && e.to >= u) {
			let t = w.create(o, e.from, e.to);
			n.setSelection(t);
		}
	}
	return !0;
}, Bc = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	for (let e = 0; e < n.length; e += 1) if (n[e](t)) return !0;
	return !1;
};
function Vc(e) {
	return e instanceof w;
}
function Hc(e = 0, t = 0, n = 0) {
	return Math.min(Math.max(e, t), n);
}
function Uc(e, t = null) {
	if (!t) return null;
	let n = C.atStart(e), r = C.atEnd(e);
	if (t === "start" || t === !0) return n;
	if (t === "end") return r;
	let i = n.from, a = r.to;
	return t === "all" ? w.create(e, Hc(0, i, a), Hc(e.content.size, i, a)) : w.create(e, Hc(t, i, a), Hc(t, i, a));
}
function Wc() {
	return ["Android"].includes(navigator.platform) || /android/i.test(navigator.userAgent);
}
function Gc() {
	return [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod"
	].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function Kc() {
	return typeof navigator < "u" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
var qc = (e = null, t = {}) => ({ editor: n, view: r, tr: i, dispatch: a }) => {
	t = {
		scrollIntoView: !0,
		...t
	};
	let o = () => {
		(Gc() || Wc()) && r.dom.focus(), Kc() && !Gc() && !Wc() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
			n.isDestroyed || (r.focus(), t?.scrollIntoView && n.commands.scrollIntoView());
		});
	};
	try {
		if (r.hasFocus() && e === null || e === !1) return !0;
	} catch {
		return !1;
	}
	if (a && e === null && !Vc(n.state.selection)) return o(), !0;
	let s = Uc(i.doc, e) || n.state.selection, c = n.state.selection.eq(s);
	return a && (c || i.setSelection(s), c && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, Jc = (e, t) => (n) => e.every((e, r) => t(e, {
	...n,
	index: r
})), Yc = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({
	from: n.selection.from,
	to: n.selection.to
}, e, t), Xc = (e) => {
	let t = e.childNodes;
	for (let n = t.length - 1; n >= 0; --n) {
		let r = t[n];
		r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && Xc(r);
	}
	return e;
};
function Zc(e) {
	if (typeof window > "u") throw Error("[tiptap error]: there is no window object available, so this function cannot be used");
	let t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
	return Xc(n);
}
function Qc(e, t, n) {
	if (e instanceof se || e instanceof a) return e;
	n = {
		slice: !0,
		parseOptions: {},
		...n
	};
	let r = typeof e == "object" && !!e, i = typeof e == "string";
	if (r) try {
		if (Array.isArray(e) && e.length > 0) return a.fromArray(e.map((e) => t.nodeFromJSON(e)));
		let r = t.nodeFromJSON(e);
		return n.errorOnInvalidContent && r.check(), r;
	} catch (r) {
		if (n.errorOnInvalidContent) throw Error("[tiptap error]: Invalid JSON content", { cause: r });
		return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", r), Qc("", t, n);
	}
	if (i) {
		if (n.errorOnInvalidContent) {
			let r = !1, i = "", a = new Me({
				topNode: t.spec.topNode,
				marks: t.spec.marks,
				nodes: t.spec.nodes.append({ __tiptap__private__unknown__catch__all__node: {
					content: "inline*",
					group: "block",
					parseDOM: [{
						tag: "*",
						getAttrs: (e) => (r = !0, i = typeof e == "string" ? e : e.outerHTML, null)
					}]
				} })
			});
			if (n.slice ? Ie.fromSchema(a).parseSlice(Zc(e), n.parseOptions) : Ie.fromSchema(a).parse(Zc(e), n.parseOptions), n.errorOnInvalidContent && r) throw Error("[tiptap error]: Invalid HTML content", { cause: /* @__PURE__ */ Error(`Invalid element found: ${i}`) });
		}
		let r = Ie.fromSchema(t);
		return n.slice ? r.parseSlice(Zc(e), n.parseOptions).content : r.parse(Zc(e), n.parseOptions);
	}
	return Qc("", t, n);
}
function $c(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Ct || i instanceof wt)) return;
	let a = e.mapping.maps[r], o = 0;
	a.forEach((e, t, n, r) => {
		o === 0 && (o = r);
	}), e.setSelection(C.near(e.doc.resolve(o), n));
}
var el = (e) => !("type" in e), tl = (e, t, n) => ({ tr: r, dispatch: i, editor: o }) => {
	if (i) {
		n = {
			parseOptions: o.options.parseOptions,
			updateSelection: !0,
			applyInputRules: !1,
			applyPasteRules: !1,
			...n
		};
		let i, s = (e) => {
			o.emit("contentError", {
				editor: o,
				error: e,
				disableCollaboration: () => {
					"collaboration" in o.storage && typeof o.storage.collaboration == "object" && o.storage.collaboration && (o.storage.collaboration.isDisabled = !0);
				}
			});
		}, c = {
			preserveWhitespace: "full",
			...n.parseOptions
		};
		if (!n.errorOnInvalidContent && !o.options.enableContentCheck && o.options.emitContentError) try {
			Qc(t, o.schema, {
				parseOptions: c,
				errorOnInvalidContent: !0
			});
		} catch (e) {
			s(e);
		}
		try {
			i = Qc(t, o.schema, {
				parseOptions: c,
				errorOnInvalidContent: n.errorOnInvalidContent ?? o.options.enableContentCheck
			});
		} catch (e) {
			return s(e), !1;
		}
		let { from: l, to: u } = typeof e == "number" ? {
			from: e,
			to: e
		} : {
			from: e.from,
			to: e.to
		}, d = !0, f = !0;
		if ((el(i) ? i : [i]).forEach((e) => {
			e.check(), d = d ? e.isText && e.marks.length === 0 : !1, f = f ? e.isBlock : !1;
		}), l === u && f) {
			let { parent: e } = r.doc.resolve(l);
			e.isTextblock && !e.type.spec.code && !e.childCount && (--l, u += 1);
		}
		let p;
		if (d) {
			if (Array.isArray(t)) p = t.map((e) => e.text || "").join("");
			else if (t instanceof a) {
				let e = "";
				t.forEach((t) => {
					t.text && (e += t.text);
				}), p = e;
			} else p = typeof t == "object" && t && t.text ? t.text : t;
			r.insertText(p, l, u);
		} else {
			p = i;
			let e = r.doc.resolve(l), t = e.node(), n = e.parentOffset === 0, a = t.isText || t.isTextblock, o = t.content.size > 0;
			n && a && o && f && (l = Math.max(0, l - 1)), r.replaceWith(l, u, p);
		}
		n.updateSelection && $c(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", {
			from: l,
			text: p
		}), n.applyPasteRules && r.setMeta("applyPasteRules", {
			from: l,
			text: p
		});
	}
	return !0;
};
function nl(e) {
	for (let t = 0; t < e.edgeCount; t += 1) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var rl = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { pos: i, attrs: a, content: o, updateSelection: s = !0 } = e, c;
	c = typeof i == "number" ? t.doc.resolve(i) : i || t.selection.$from;
	let l = nl(c.parent.contentMatchAt(c.index()));
	if (!l) return !1;
	let u = Object.keys(l.spec.attrs || {}), d = a ? Object.fromEntries(Object.entries(a).filter(([e]) => u.includes(e))) : {}, f;
	if (o) {
		let e = Qc(o, r.schema);
		f = l.createAndFill(d, e);
	} else f = l.createAndFill(d);
	return f ? (n && (t.insert(c.pos, f), s && $c(t, t.steps.length - 1, -1)), !0) : !1;
}, il = () => ({ state: e, dispatch: t }) => Qn(e, t), al = () => ({ state: e, dispatch: t }) => $n(e, t), ol = () => ({ state: e, dispatch: t }) => Vn(e, t), sl = () => ({ state: e, dispatch: t }) => Yn(e, t), cl = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = qt(e.doc, e.selection.$from.pos, -1);
		return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, ll = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = qt(e.doc, e.selection.$from.pos, 1);
		return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, ul = () => ({ state: e, dispatch: t }) => Hn(e, t), dl = () => ({ state: e, dispatch: t }) => Un(e, t);
function fl() {
	return typeof navigator < "u" && /Mac/.test(navigator.platform);
}
function pl(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n === "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e += 1) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) Gc() || fl() ? o = !0 : i = !0;
		else throw Error(`Unrecognized modifier name: ${n}`);
	}
	return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), a && (n = `Shift-${n}`), n;
}
var ml = (e) => ({ editor: t, view: n, tr: r, dispatch: i }) => {
	let a = pl(e).split(/-(?!$)/), o = a.find((e) => ![
		"Alt",
		"Ctrl",
		"Meta",
		"Shift"
	].includes(e)), s = new KeyboardEvent("keydown", {
		key: o === "Space" ? " " : o,
		altKey: a.includes("Alt"),
		ctrlKey: a.includes("Ctrl"),
		metaKey: a.includes("Meta"),
		shiftKey: a.includes("Shift"),
		bubbles: !0,
		cancelable: !0
	});
	return t.captureTransaction(() => {
		n.someProp("handleKeyDown", (e) => e(n, s));
	})?.steps.forEach((e) => {
		let t = e.map(r.mapping);
		t && i && r.maybeStep(t);
	}), !0;
};
function hl(e, t, n = {}) {
	let { from: r, to: i, empty: a } = e.selection, o = t ? k(t, e.schema) : null, s = [];
	e.doc.nodesBetween(r, i, (e, t) => {
		if (e.isText) return;
		let n = Math.max(r, t), a = Math.min(i, t + e.nodeSize);
		s.push({
			node: e,
			from: n,
			to: a
		});
	});
	let c = i - r, l = s.filter((e) => !o || o.name === e.node.type.name).filter((e) => Pc(e.node.attrs, n, { strict: !1 }));
	return a ? !!l.length : l.reduce((e, t) => e + t.to - t.from, 0) >= c;
}
var gl = (e, t = {}) => ({ state: n, dispatch: r }) => hl(n, k(e, n.schema), t) ? er(n, r) : !1, _l = () => ({ state: e, dispatch: t }) => ar(e, t), vl = (e) => ({ state: t, dispatch: n }) => Tr(k(e, t.schema))(t, n), yl = () => ({ state: e, dispatch: t }) => tr(e, t);
function bl(e, t) {
	return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function xl(e, t) {
	let n = typeof t == "string" ? [t] : t;
	return Object.keys(e).reduce((t, r) => (n.includes(r) || (t[r] = e[r]), t), {});
}
var Sl = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = bl(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = k(e, r.schema)), s === "mark" && (o = Rc(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		r.doc.nodesBetween(e.$from.pos, e.$to.pos, (e, r) => {
			a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, xl(e.attrs, t))), o && e.marks.length && e.marks.forEach((a) => {
				o === a.type && (c = !0, i && n.addMark(r, r + e.nodeSize, o.create(xl(a.attrs, t))));
			});
		});
	}), c;
}, Cl = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), wl = () => ({ tr: e, dispatch: t }) => {
	if (t) {
		let t = new Cn(e.doc);
		e.setSelection(t);
	}
	return !0;
}, Tl = () => ({ state: e, dispatch: t }) => Kn(e, t), El = () => ({ state: e, dispatch: t }) => Xn(e, t), Dl = () => ({ state: e, dispatch: t }) => cr(e, t), Ol = () => ({ state: e, dispatch: t }) => mr(e, t), kl = () => ({ state: e, dispatch: t }) => pr(e, t);
function Al(e, t, n = {}, r = {}) {
	return Qc(e, t, {
		slice: !1,
		parseOptions: n,
		errorOnInvalidContent: r.errorOnInvalidContent
	});
}
var jl = (e, { errorOnInvalidContent: t, emitUpdate: n = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: a, dispatch: o, commands: s }) => {
	let { doc: c } = a;
	if (r.preserveWhitespace !== "full") {
		let s = Al(e, i.schema, r, { errorOnInvalidContent: t ?? i.options.enableContentCheck });
		return o && a.replaceWith(0, c.content.size, s).setMeta("preventUpdate", !n), !0;
	}
	return o && a.setMeta("preventUpdate", !n), s.insertContentAt({
		from: 0,
		to: c.content.size
	}, e, {
		parseOptions: r,
		errorOnInvalidContent: t ?? i.options.enableContentCheck
	});
};
function Ml(e, t) {
	let n = Rc(t, e.schema), { from: r, to: i, empty: a } = e.selection, o = [];
	a ? (e.storedMarks && o.push(...e.storedMarks), o.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, i, (e) => {
		o.push(...e.marks);
	});
	let s = o.find((e) => e.type.name === n.name);
	return s ? { ...s.attrs } : {};
}
function Nl(e, t) {
	let n = new gn(e);
	return t.forEach((e) => {
		e.steps.forEach((e) => {
			n.step(e);
		});
	}), n;
}
function Pl(e, t, n) {
	let r = [];
	return e.nodesBetween(t.from, t.to, (e, t) => {
		n(e) && r.push({
			node: e,
			pos: t
		});
	}), r;
}
function Fl(e, t) {
	for (let n = e.depth; n > 0; --n) {
		let r = e.node(n);
		if (t(r)) return {
			pos: n > 0 ? e.before(n) : 0,
			start: e.start(n),
			depth: n,
			node: r
		};
	}
}
function Il(e) {
	return (t) => Fl(t.$from, e);
}
function A(e, t, n) {
	return e.config[t] === void 0 && e.parent ? A(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
		...n,
		parent: e.parent ? A(e.parent, t, n) : null
	}) : e.config[t];
}
function Ll(e) {
	return e.map((e) => {
		let t = A(e, "addExtensions", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		return t ? [e, ...Ll(t())] : e;
	}).flat(10);
}
function Rl(e, t) {
	let n = Xe.fromSchema(t).serializeFragment(e), r = document.implementation.createHTMLDocument().createElement("div");
	return r.appendChild(n), r.innerHTML;
}
function zl(e) {
	return typeof e == "function";
}
function j(e, t = void 0, ...n) {
	return zl(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function Bl(e = {}) {
	return Object.keys(e).length === 0 && e.constructor === Object;
}
function Vl(e) {
	return {
		baseExtensions: e.filter((e) => e.type === "extension"),
		nodeExtensions: e.filter((e) => e.type === "node"),
		markExtensions: e.filter((e) => e.type === "mark")
	};
}
function Hl(e) {
	let t = [], { nodeExtensions: n, markExtensions: r } = Vl(e), i = [...n, ...r], a = {
		default: null,
		validate: void 0,
		rendered: !0,
		renderHTML: null,
		parseHTML: null,
		keepOnSplit: !0,
		isRequired: !1
	}, o = n.filter((e) => e.name !== "text").map((e) => e.name), s = r.map((e) => e.name), c = [...o, ...s];
	return e.forEach((e) => {
		let n = A(e, "addGlobalAttributes", {
			name: e.name,
			options: e.options,
			storage: e.storage,
			extensions: i
		});
		n && n().forEach((e) => {
			let n;
			n = Array.isArray(e.types) ? e.types : e.types === "*" ? c : e.types === "nodes" ? o : e.types === "marks" ? s : [], n.forEach((n) => {
				Object.entries(e.attributes).forEach(([e, r]) => {
					t.push({
						type: n,
						name: e,
						attribute: {
							...a,
							...r
						}
					});
				});
			});
		});
	}), i.forEach((e) => {
		let n = A(e, "addAttributes", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		if (!n) return;
		let r = n();
		Object.entries(r).forEach(([n, r]) => {
			let i = {
				...a,
				...r
			};
			typeof i?.default == "function" && (i.default = i.default()), i?.isRequired && i?.default === void 0 && delete i.default, t.push({
				type: e.name,
				name: n,
				attribute: i
			});
		});
	}), t;
}
function Ul(e) {
	let t = [], n = "", r = !1, i = !1, a = 0, o = e.length;
	for (let s = 0; s < o; s += 1) {
		let o = e[s];
		if (o === "'" && !i) {
			r = !r, n += o;
			continue;
		}
		if (o === "\"" && !r) {
			i = !i, n += o;
			continue;
		}
		if (!r && !i) {
			if (o === "(") {
				a += 1, n += o;
				continue;
			}
			if (o === ")" && a > 0) {
				--a, n += o;
				continue;
			}
			if (o === ";" && a === 0) {
				t.push(n), n = "";
				continue;
			}
		}
		n += o;
	}
	return n && t.push(n), t;
}
function Wl(e) {
	let t = [], n = Ul(e || ""), r = n.length;
	for (let e = 0; e < r; e += 1) {
		let r = n[e], i = r.indexOf(":");
		if (i === -1) continue;
		let a = r.slice(0, i).trim(), o = r.slice(i + 1).trim();
		a && o && t.push([a, o]);
	}
	return t;
}
function M(...e) {
	return e.filter((e) => !!e).reduce((e, t) => {
		let n = { ...e };
		return Object.entries(t).forEach(([e, t]) => {
			if (!n[e]) {
				n[e] = t;
				return;
			}
			if (e === "class") {
				let r = t ? String(t).split(" ") : [], i = n[e] ? n[e].split(" ") : [], a = r.filter((e) => !i.includes(e));
				n[e] = [...i, ...a].join(" ");
			} else if (e === "style") {
				let r = new Map([...Wl(n[e]), ...Wl(t)]);
				n[e] = Array.from(r.entries()).map(([e, t]) => `${e}: ${t}`).join("; ");
			} else n[e] = t;
		}), n;
	}, {});
}
function Gl(e, t) {
	return t.filter((t) => t.type === e.type.name).filter((e) => e.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(e.attrs) || {} : { [t.name]: e.attrs[t.name] }).reduce((e, t) => M(e, t), {});
}
function Kl(e) {
	return typeof e == "string" ? e.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(e) : e === "true" || e !== "false" && e : e;
}
function ql(e, t) {
	return "style" in e ? e : {
		...e,
		getAttrs: (n) => {
			let r = e.getAttrs ? e.getAttrs(n) : e.attrs;
			if (r === !1) return !1;
			let i = t.reduce((e, t) => {
				let r = t.attribute.parseHTML ? t.attribute.parseHTML(n) : Kl(n.getAttribute(t.name));
				return r == null ? e : {
					...e,
					[t.name]: r
				};
			}, {});
			return {
				...r,
				...i
			};
		}
	};
}
function Jl(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e === "attrs" && Bl(t) ? !1 : t != null));
}
function Yl(e) {
	let t = {};
	return !e?.attribute?.isRequired && "default" in (e?.attribute || {}) && (t.default = e.attribute.default), e?.attribute?.validate !== void 0 && (t.validate = e.attribute.validate), [e.name, t];
}
function Xl(e, t) {
	let n = Hl(e), { nodeExtensions: r, markExtensions: i } = Vl(e), a = r.find((e) => A(e, "topNode"))?.name;
	return new Me({
		topNode: a,
		nodes: Object.fromEntries(r.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = Jl({
				...e.reduce((e, t) => {
					let n = A(t, "extendNodeSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				content: j(A(r, "content", a)),
				marks: j(A(r, "marks", a)),
				group: j(A(r, "group", a)),
				inline: j(A(r, "inline", a)),
				atom: j(A(r, "atom", a)),
				selectable: j(A(r, "selectable", a)),
				draggable: j(A(r, "draggable", a)),
				code: j(A(r, "code", a)),
				whitespace: j(A(r, "whitespace", a)),
				linebreakReplacement: j(A(r, "linebreakReplacement", a)),
				defining: j(A(r, "defining", a)),
				isolating: j(A(r, "isolating", a)),
				attrs: Object.fromEntries(i.map(Yl))
			}), s = j(A(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => ql(e, i)));
			let c = A(r, "renderHTML", a);
			c && (o.toDOM = (e) => c({
				node: e,
				HTMLAttributes: Gl(e, i)
			}));
			let l = A(r, "renderText", a);
			return l && (o.toText = l), [r.name, o];
		})),
		marks: Object.fromEntries(i.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = Jl({
				...e.reduce((e, t) => {
					let n = A(t, "extendMarkSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				inclusive: j(A(r, "inclusive", a)),
				excludes: j(A(r, "excludes", a)),
				group: j(A(r, "group", a)),
				spanning: j(A(r, "spanning", a)),
				code: j(A(r, "code", a)),
				attrs: Object.fromEntries(i.map(Yl))
			}), s = j(A(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => ql(e, i)));
			let c = A(r, "renderHTML", a);
			return c && (o.toDOM = (e) => c({
				mark: e,
				HTMLAttributes: Gl(e, i)
			})), [r.name, o];
		}))
	});
}
function Zl(e) {
	let t = e.filter((t, n) => e.indexOf(t) !== n);
	return Array.from(new Set(t));
}
function Ql(e) {
	return e.sort((e, t) => {
		let n = A(e, "priority") || 100, r = A(t, "priority") || 100;
		return n > r ? -1 : +(n < r);
	});
}
function $l(e) {
	let t = Ql(Ll(e)), n = Zl(t.map((e) => e.name));
	return n.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${n.map((e) => `'${e}'`).join(", ")}]. This can lead to issues.`), t;
}
function eu(e, t) {
	return Xl($l(e), t);
}
function tu(e, t) {
	let n = eu(t), r = Zc(e);
	return Ie.fromSchema(n).parse(r).toJSON();
}
function nu(e, t, n) {
	let { from: r, to: i } = t, { blockSeparator: a = "\n\n", textSerializers: o = {} } = n || {}, s = "";
	return e.nodesBetween(r, i, (e, n, c, l) => {
		e.isBlock && n > r && (s += a);
		let u = o?.[e.type.name];
		if (u) return c && (s += u({
			node: e,
			pos: n,
			parent: c,
			index: l,
			range: t
		})), !1;
		e.isText && (s += (e?.text)?.slice(Math.max(r, n) - n, i - n));
	}), s;
}
function ru(e, t) {
	return nu(e, {
		from: 0,
		to: e.content.size
	}, t);
}
function iu(e) {
	return Object.fromEntries(Object.entries(e.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
function au(e, t) {
	let n = k(t, e.schema), { from: r, to: i } = e.selection, a = [];
	e.doc.nodesBetween(r, i, (e) => {
		a.push(e);
	});
	let o = a.reverse().find((e) => e.type.name === n.name);
	return o ? { ...o.attrs } : {};
}
function ou(e, t) {
	let n = bl(typeof t == "string" ? t : t.name, e.schema);
	return n === "node" ? au(e, t) : n === "mark" ? Ml(e, t) : {};
}
function su(e, t = JSON.stringify) {
	let n = {};
	return e.filter((e) => {
		let r = t(e);
		return Object.prototype.hasOwnProperty.call(n, r) ? !1 : n[r] = !0;
	});
}
function cu(e) {
	let t = su(e);
	return t.length === 1 ? t : t.filter((e, n) => !t.filter((e, t) => t !== n).some((t) => e.oldRange.from >= t.oldRange.from && e.oldRange.to <= t.oldRange.to && e.newRange.from >= t.newRange.from && e.newRange.to <= t.newRange.to));
}
function lu(e) {
	let { mapping: t, steps: n } = e, r = [];
	return t.maps.forEach((e, i) => {
		let a = [];
		if (e.ranges.length) e.forEach((e, t) => {
			a.push({
				from: e,
				to: t
			});
		});
		else {
			let { from: e, to: t } = n[i];
			if (e === void 0 || t === void 0) return;
			a.push({
				from: e,
				to: t
			});
		}
		a.forEach(({ from: e, to: n }) => {
			let a = t.slice(i).map(e, -1), o = t.slice(i).map(n), s = t.invert().map(a, -1), c = t.invert().map(o);
			r.push({
				oldRange: {
					from: s,
					to: c
				},
				newRange: {
					from: a,
					to: o
				}
			});
		});
	}), cu(r);
}
function uu(e, t = 0) {
	let n = +(e.type !== e.type.schema.topNodeType), r = t, i = r + e.nodeSize, a = e.marks.map((e) => {
		let t = { type: e.type.name };
		return Object.keys(e.attrs).length && (t.attrs = { ...e.attrs }), t;
	}), o = { ...e.attrs }, s = {
		type: e.type.name,
		from: r,
		to: i
	};
	return Object.keys(o).length && (s.attrs = o), a.length && (s.marks = a), e.content.childCount && (s.content = [], e.forEach((e, r) => {
		s.content?.push(uu(e, t + r + n));
	})), e.text && (s.text = e.text), s;
}
function du(e, t, n) {
	let r = [];
	return e === t ? n.resolve(e).marks().forEach((t) => {
		let i = Lc(n.resolve(e), t.type);
		i && r.push({
			mark: t,
			...i
		});
	}) : n.nodesBetween(e, t, (e, t) => {
		!e || e?.nodeSize === void 0 || r.push(...e.marks.map((n) => ({
			from: t,
			to: t + e.nodeSize,
			mark: n
		})));
	}), r;
}
var fu = (e, t, n, r = 20) => {
	let i = e.doc.resolve(n), a = r, o = null;
	for (; a > 0 && o === null;) {
		let e = i.node(a);
		e?.type.name === t ? o = e : --a;
	}
	return [o, a];
};
function pu(e, t) {
	return t.nodes[e] || t.marks[e] || null;
}
function mu(e, t, n) {
	return Object.fromEntries(Object.entries(n).filter(([n]) => {
		let r = e.find((e) => e.type === t && e.name === n);
		return r ? r.attribute.keepOnSplit : !1;
	}));
}
var hu = (e, t = 500) => {
	let n = "", r = e.parentOffset;
	return e.parent.nodesBetween(Math.max(0, r - t), r, (e, t, i, a) => {
		var o;
		let s = (o = e.type.spec).toText?.call(o, {
			node: e,
			pos: t,
			parent: i,
			index: a
		}) || e.textContent || "%leaf%";
		n += e.isAtom && !e.isText ? s : s.slice(0, Math.max(0, r - t));
	}), n;
};
function gu(e, t, n = {}) {
	let { empty: r, ranges: i } = e.selection, a = t ? Rc(t, e.schema) : null;
	if (r) return !!(e.storedMarks || e.selection.$from.marks()).filter((e) => !a || a.name === e.type.name).find((e) => Pc(e.attrs, n, { strict: !1 }));
	let o = 0, s = [];
	if (i.forEach(({ $from: t, $to: n }) => {
		let r = t.pos, i = n.pos;
		e.doc.nodesBetween(r, i, (e, t) => {
			if (a && e.inlineContent && !e.type.allowsMarkType(a)) return !1;
			if (!e.isText && !e.marks.length) return;
			let n = Math.max(r, t), c = Math.min(i, t + e.nodeSize), l = c - n;
			o += l, s.push(...e.marks.map((e) => ({
				mark: e,
				from: n,
				to: c
			})));
		});
	}), o === 0) return !1;
	let c = s.filter((e) => !a || a.name === e.mark.type.name).filter((e) => Pc(e.mark.attrs, n, { strict: !1 })).reduce((e, t) => e + t.to - t.from, 0), l = s.filter((e) => !a || e.mark.type !== a && e.mark.type.excludes(a)).reduce((e, t) => e + t.to - t.from, 0);
	return (c > 0 ? c + l : c) >= o;
}
function _u(e, t, n = {}) {
	if (!t) return hl(e, null, n) || gu(e, null, n);
	let r = bl(t, e.schema);
	return r === "node" ? hl(e, t, n) : r === "mark" && gu(e, t, n);
}
var vu = (e, t) => {
	let { $from: n, $to: r, $anchor: i } = e.selection;
	if (t) {
		let n = Il((e) => e.type.name === t)(e.selection);
		if (!n) return !1;
		let r = e.doc.resolve(n.pos + 1);
		return i.pos + 1 === r.end();
	}
	return !(r.parentOffset < r.parent.nodeSize - 2 || n.pos !== r.pos);
}, yu = (e) => {
	let { $from: t, $to: n } = e.selection;
	return !(t.parentOffset > 0 || t.pos !== n.pos);
};
function bu(e, t) {
	return Array.isArray(t) ? t.some((t) => (typeof t == "string" ? t : t.name) === e.name) : t;
}
function xu(e, t) {
	let { nodeExtensions: n } = Vl(t), r = n.find((t) => t.name === e);
	if (!r) return !1;
	let i = j(A(r, "group", {
		name: r.name,
		options: r.options,
		storage: r.storage
	}));
	return typeof i == "string" && i.split(" ").includes("list");
}
function Su(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
	if (n) {
		if (e.type.name === "hardBreak") return !0;
		if (e.isText) return !/\S/.test(e.text ?? "");
	}
	if (e.isText) return !e.text;
	if (e.isAtom || e.isLeaf) return !1;
	if (e.content.childCount === 0) return !0;
	if (t) {
		let r = !0;
		return e.content.forEach((e) => {
			r !== !1 && (Su(e, {
				ignoreWhitespace: n,
				checkChildren: t
			}) || (r = !1));
		}), r;
	}
	return !1;
}
function Cu(e) {
	return e instanceof T;
}
var wu = class e {
	constructor(e) {
		this.position = e;
	}
	static fromJSON(t) {
		return new e(t.position);
	}
	toJSON() {
		return { position: this.position };
	}
};
function Tu(e, t) {
	let n = t.mapping.mapResult(e.position);
	return {
		position: new wu(n.pos),
		mapResult: n
	};
}
function Eu(e) {
	return new wu(e);
}
function Du({ json: e, validMarks: t, validNodes: n, options: r, rewrittenContent: i = [] }) {
	return e.marks && Array.isArray(e.marks) && (e.marks = e.marks.filter((e) => {
		if (e == null) return !1;
		let n = typeof e == "string" ? e : e.type;
		return t.has(n) ? !0 : (i.push({
			original: JSON.parse(JSON.stringify(e)),
			unsupported: n
		}), !1);
	})), e.content && Array.isArray(e.content) && (e.content = e.content.map((e) => e == null ? null : Du({
		json: e,
		validMarks: t,
		validNodes: n,
		options: r,
		rewrittenContent: i
	}).json).filter((e) => e != null)), e.type && !n.has(e.type) ? (i.push({
		original: JSON.parse(JSON.stringify(e)),
		unsupported: e.type
	}), e.content && Array.isArray(e.content) && r?.fallbackToParagraph !== !1 ? (e.type = "paragraph", {
		json: e,
		rewrittenContent: i
	}) : {
		json: null,
		rewrittenContent: i
	}) : {
		json: e,
		rewrittenContent: i
	};
}
function Ou(e, t, n) {
	let { selection: r } = t, i = null;
	if (Vc(r) && (i = r.$cursor), i) {
		let t = e.storedMarks ?? i.marks();
		return i.parent.type.allowsMarkType(n) && (!!n.isInSet(t) || !t.some((e) => e.type.excludes(n)));
	}
	let { ranges: a } = r;
	return a.some(({ $from: t, $to: r }) => {
		let i = t.depth === 0 && e.doc.inlineContent && e.doc.type.allowsMarkType(n);
		return e.doc.nodesBetween(t.pos, r.pos, (e, t, r) => {
			if (i) return !1;
			if (e.isInline) {
				let t = !r || r.type.allowsMarkType(n), a = !!n.isInSet(e.marks) || !e.marks.some((e) => e.type.excludes(n));
				i = t && a;
			}
			return !i;
		}), i;
	});
}
var ku = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = n, { empty: o, ranges: s } = a, c = Rc(e, r.schema);
	if (i) if (o) {
		let e = Ml(r, c);
		n.addStoredMark(c.create({
			...e,
			...t
		}));
	} else s.forEach((e) => {
		let i = e.$from.pos, a = e.$to.pos;
		r.doc.nodesBetween(i, a, (e, r) => {
			let o = Math.max(r, i), s = Math.min(r + e.nodeSize, a);
			e.marks.find((e) => e.type === c) ? e.marks.forEach((e) => {
				c === e.type && n.addMark(o, s, c.create({
					...e.attrs,
					...t
				}));
			}) : n.addMark(o, s, c.create(t));
		});
	});
	return Ou(r, n, c);
}, Au = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), ju = (e, t = {}) => ({ state: n, dispatch: r, chain: i }) => {
	let a = k(e, n.schema), o;
	return n.selection.$anchor.sameParent(n.selection.$head) && (o = n.selection.$anchor.parent.attrs), a.isTextblock ? i().command(({ commands: e }) => gr(a, {
		...o,
		...t
	})(n) ? !0 : e.clearNodes()).command(({ state: e }) => gr(a, {
		...o,
		...t
	})(e, r)).run() : (console.warn("[tiptap warn]: Currently \"setNode()\" only supports text block nodes."), !1);
}, Mu = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, r = Hc(e, 0, n.content.size), i = T.create(n, r);
		t.setSelection(i);
	}
	return !0;
}, Nu = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = r, o, s;
	return typeof t == "number" ? (o = t, s = t) : t && "from" in t && "to" in t ? (o = t.from, s = t.to) : (o = a.from, s = a.to), i && n.doc.nodesBetween(o, s, (t, r) => {
		t.isText || n.setNodeMarkup(r, void 0, {
			...t.attrs,
			dir: e
		});
	}), !0;
}, Pu = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, { from: r, to: i } = typeof e == "number" ? {
			from: e,
			to: e
		} : e, a = w.atStart(n).from, o = w.atEnd(n).to, s = Hc(r, a, o), c = Hc(i, a, o), l = w.create(n, s, c);
		t.setSelection(l);
	}
	return !0;
}, Fu = (e) => ({ state: t, dispatch: n }) => Or(k(e, t.schema))(t, n);
function Iu(e, t) {
	let n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
	if (n) {
		let r = n.filter((e) => t?.includes(e.type.name));
		e.tr.ensureMarks(r);
	}
}
var Lu = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: i }) => {
	let { selection: a, doc: o } = t, { $from: s, $to: c } = a, l = i.extensionManager.attributes, u = mu(l, s.node().type.name, s.node().attrs);
	if (a instanceof T && a.node.isBlock) return !s.parentOffset || !Ht(o, s.pos) ? !1 : (r && (e && Iu(n, i.extensionManager.splittableMarks), t.split(s.pos).scrollIntoView()), !0);
	if (!s.parent.isBlock) return !1;
	let d = c.parentOffset === c.parent.content.size, f = s.depth === 0 ? void 0 : nl(s.node(-1).contentMatchAt(s.indexAfter(-1))), p = d && f ? [{
		type: f,
		attrs: u
	}] : void 0, m = Ht(t.doc, t.mapping.map(s.pos), 1, p);
	if (!p && !m && Ht(t.doc, t.mapping.map(s.pos), 1, f ? [{ type: f }] : void 0) && (m = !0, p = f ? [{
		type: f,
		attrs: u
	}] : void 0), r) {
		if (m && (a instanceof w && t.deleteSelection(), t.split(t.mapping.map(s.pos), 1, p), f && !d && !s.parentOffset && s.parent.type !== f)) {
			let e = t.mapping.map(s.before()), n = t.doc.resolve(e);
			s.node(-1).canReplaceWith(n.index(), n.index() + 1, f) && t.setNodeMarkup(t.mapping.map(s.before()), f);
		}
		e && Iu(n, i.extensionManager.splittableMarks), t.scrollIntoView();
	}
	return m;
}, Ru = (e, t = {}) => ({ tr: n, state: r, dispatch: i, editor: o }) => {
	let s = k(e, r.schema), { $from: c, $to: l } = r.selection, u = r.selection.node;
	if (u && u.isBlock || c.depth < 2 || !c.sameParent(l)) return !1;
	let f = c.node(-1);
	if (f.type !== s) return !1;
	let p = o.extensionManager.attributes;
	if (c.parent.content.size === 0 && c.node(-1).childCount === c.indexAfter(-1)) {
		if (c.depth === 2 || c.node(-3).type !== s || c.index(-2) !== c.node(-2).childCount - 1) return !1;
		if (i) {
			let e = a.empty, r = c.index(-1) ? 1 : c.index(-2) ? 2 : 3;
			for (let t = c.depth - r; t >= c.depth - 3; --t) e = a.from(c.node(t).copy(e));
			let i = c.indexAfter(-1) < c.node(-2).childCount ? 1 : c.indexAfter(-2) < c.node(-3).childCount ? 2 : 3, o = {
				...mu(p, c.node().type.name, c.node().attrs),
				...t
			}, l = s.contentMatch.defaultType?.createAndFill(o) || void 0;
			e = e.append(a.from(s.createAndFill(null, l) || void 0));
			let u = c.before(c.depth - (r - 1));
			n.replace(u, c.after(-i), new d(e, 4 - r, 0));
			let f = -1;
			n.doc.nodesBetween(u, n.doc.content.size, (e, t) => {
				if (f > -1) return !1;
				e.isTextblock && e.content.size === 0 && (f = t + 1);
			}), f > -1 && n.setSelection(w.near(n.doc.resolve(f))), n.scrollIntoView();
		}
		return !0;
	}
	let m = l.pos === c.end() ? f.contentMatchAt(0).defaultType : null, h = {
		...mu(p, f.type.name, f.attrs),
		...t
	}, g = {
		...mu(p, c.node().type.name, c.node().attrs),
		...t
	};
	n.delete(c.pos, l.pos);
	let _ = m ? [{
		type: s,
		attrs: h
	}, {
		type: m,
		attrs: g
	}] : [{
		type: s,
		attrs: h
	}];
	if (!Ht(n.doc, c.pos, 2)) return !1;
	if (i) {
		let { selection: e, storedMarks: t } = r, { splittableMarks: a } = o.extensionManager, s = t || e.$to.parentOffset && e.$from.marks();
		if (n.split(c.pos, 2, _).scrollIntoView(), !s || !i) return !0;
		let l = s.filter((e) => a.includes(e.type.name));
		n.ensureMarks(l);
	}
	return !0;
};
function zu(e) {
	return !e || e === "1" ? null : e;
}
function Bu(e, t) {
	return zu(e) === zu(t);
}
var Vu = (e, t) => {
	let n = Il((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Wt(e.doc, n.pos)) || !Bu(n.node.attrs.type, i?.attrs.type) || e.join(n.pos), !0;
}, Hu = (e, t) => {
	let n = Il((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(n.start).after(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Wt(e.doc, r)) || !Bu(n.node.attrs.type, i?.attrs.type) || e.join(r), !0;
};
function Uu(e) {
	let t = e.doc, n = t.firstChild;
	if (!n) return null;
	let r = t.resolve(1), i = t.resolve(n.nodeSize - 1);
	return w.between(r, i);
}
var Wu = (e, t, n, r = {}) => ({ editor: i, tr: a, state: o, dispatch: s, chain: c, commands: l, can: u }) => {
	let { extensions: d, splittableMarks: f } = i.extensionManager, p = k(e, o.schema), m = k(t, o.schema), { selection: h, storedMarks: g } = o, { $from: _, $to: v } = h, y = _.blockRange(v), b = g || h.$to.parentOffset && h.$from.marks();
	if (!y) return !1;
	let x = Il((e) => xu(e.type.name, d))(h), S = h.from === 0 && h.to === o.doc.content.size, ee = o.doc.content.content, te = ee.length === 1 ? ee[0] : null, ne = S && te && xu(te.type.name, d) ? {
		node: te,
		pos: 0,
		depth: 0
	} : null, re = x ?? ne, ie = !!x && y.depth >= 1 && y.depth - x.depth <= 1, ae = !!ne;
	if ((ie || ae) && re) {
		if (re.node.type === p) return S && ae ? c().command(({ tr: e, dispatch: t }) => {
			let n = Uu(e);
			return n ? (e.setSelection(n), t && t(e), !0) : !1;
		}).liftListItem(m).run() : l.liftListItem(m);
		if (xu(re.node.type.name, d) && p.validContent(re.node.content)) return c().command(() => (a.setNodeMarkup(re.pos, p), !0)).command(() => Vu(a, p)).command(() => Hu(a, p)).run();
	}
	return !n || !b || !s ? c().command(() => u().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => Vu(a, p)).command(() => Hu(a, p)).run() : c().command(() => {
		let e = u().wrapInList(p, r), t = b.filter((e) => f.includes(e.type.name));
		return a.ensureMarks(t), e ? !0 : l.clearNodes();
	}).wrapInList(p, r).command(() => Vu(a, p)).command(() => Hu(a, p)).run();
}, Gu = (e, t = {}, n = {}) => ({ state: r, commands: i }) => {
	let { extendEmptyMarkRange: a = !1 } = n, o = Rc(e, r.schema);
	return gu(r, o, t) ? i.unsetMark(o, { extendEmptyMarkRange: a }) : i.setMark(o, t);
}, Ku = (e, t, n = {}) => ({ state: r, commands: i }) => {
	let a = k(e, r.schema), o = k(t, r.schema), s = hl(r, a, n), c;
	return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), s ? i.setNode(o, c) : i.setNode(a, {
		...c,
		...n
	});
}, qu = (e, t = {}) => ({ state: n, commands: r }) => {
	let i = k(e, n.schema);
	return hl(n, i, t) ? r.lift(i) : r.wrapIn(i, t);
}, Ju = () => ({ state: e, dispatch: t }) => {
	let n = e.plugins;
	for (let r = 0; r < n.length; r += 1) {
		let i = n[r], a;
		if (i.spec.isInputRules && (a = i.getState(e))) {
			if (t) {
				let t = e.tr, n = a.transform;
				for (let e = n.steps.length - 1; e >= 0; --e) t.step(n.steps[e].invert(n.docs[e]));
				if (a.text) {
					let n = t.doc.resolve(a.from).marks();
					t.replaceWith(a.from, a.to, e.schema.text(a.text, n));
				} else t.delete(a.from, a.to);
			}
			return !0;
		}
	}
	return !1;
}, Yu = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { ignoreClearable: i = !1 } = e, { selection: a } = t, { empty: o, ranges: s } = a;
	if (o) return !0;
	let { nonClearableMarks: c } = r.extensionManager;
	if (n) {
		let e = Object.values(r.schema.marks).filter((e) => i || !c.includes(e.name));
		s.forEach((n) => {
			for (let r of e) t.removeMark(n.$from.pos, n.$to.pos, r);
		});
	}
	return !0;
}, Xu = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { extendEmptyMarkRange: a = !1 } = t, { selection: o } = n, s = Rc(e, r.schema), { $from: c, empty: l, ranges: u } = o;
	if (!i) return !0;
	if (l && a) {
		let { from: e, to: t } = o, r = c.marks().find((e) => e.type === s)?.attrs, i = Lc(c, s, r);
		i && (e = i.from, t = i.to), n.removeMark(e, t, s);
	} else u.forEach((e) => {
		n.removeMark(e.$from.pos, e.$to.pos, s);
	});
	return n.removeStoredMark(s), !0;
}, Zu = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let { selection: i } = n, a, o;
	return typeof e == "number" ? (a = e, o = e) : e && "from" in e && "to" in e ? (a = e.from, o = e.to) : (a = i.from, o = i.to), r && t.doc.nodesBetween(a, o, (e, n) => {
		if (e.isText) return;
		let r = { ...e.attrs };
		delete r.dir, t.setNodeMarkup(n, void 0, r);
	}), !0;
}, Qu = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = bl(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = k(e, r.schema)), s === "mark" && (o = Rc(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		let s = e.$from.pos, l = e.$to.pos, u, d, f, p;
		n.selection.empty ? r.doc.nodesBetween(s, l, (e, t) => {
			a && a === e.type && (c = !0, f = Math.max(t, s), p = Math.min(t + e.nodeSize, l), u = t, d = e);
		}) : r.doc.nodesBetween(s, l, (e, r) => {
			r < s && a && a === e.type && (c = !0, f = Math.max(r, s), p = Math.min(r + e.nodeSize, l), u = r, d = e), r >= s && r <= l && (a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, {
				...e.attrs,
				...t
			})), o && e.marks.length && e.marks.forEach((a) => {
				if (o === a.type && (c = !0, i)) {
					let i = Math.max(r, s), c = Math.min(r + e.nodeSize, l);
					n.addMark(i, c, o.create({
						...a.attrs,
						...t
					}));
				}
			}));
		}), d && (u !== void 0 && i && n.setNodeMarkup(u, void 0, {
			...d.attrs,
			...t
		}), o && d.marks.length && d.marks.forEach((e) => {
			o === e.type && i && n.addMark(f, p, o.create({
				...e.attrs,
				...t
			}));
		}));
	}), c;
}, $u = (e, t = {}) => ({ state: n, dispatch: r }) => hr(k(e, n.schema), t)(n, r), ed = (e, t = {}) => ({ state: n, dispatch: r }) => Sr(k(e, n.schema), t)(n, r), td = class {
	constructor() {
		this.callbacks = {};
	}
	on(e, t) {
		return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
	}
	emit(e, ...t) {
		let n = this.callbacks[e];
		return n && n.forEach((e) => e.apply(this, t)), this;
	}
	off(e, t) {
		let n = this.callbacks[e];
		return n && (t ? this.callbacks[e] = n.filter((e) => e !== t) : delete this.callbacks[e]), this;
	}
	once(e, t) {
		let n = (...r) => {
			this.off(e, n), t.apply(this, r);
		};
		return this.on(e, n);
	}
	removeAllListeners() {
		this.callbacks = {};
	}
};
function nd(e, t) {
	if (e === t) return !0;
	if (!e || !t) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	return n.length === r.length && n.every((n) => Object.prototype.hasOwnProperty.call(t, n) && Object.is(e[n], t[n]));
}
function rd(e, t) {
	let { selection: n } = e, { $from: r } = n;
	if (n instanceof T) {
		let e = r.index();
		return r.parent.canReplaceWith(e, e + 1, t);
	}
	let i = r.depth;
	for (; i >= 0;) {
		let e = r.index(i);
		if (r.node(i).contentMatchAt(e).matchType(t)) return !0;
		--i;
	}
	return !1;
}
function id(e, t, n) {
	let r = document.querySelector(`style[data-tiptap-style${n ? `-${n}` : ""}]`);
	if (r !== null) return r;
	let i = document.createElement("style");
	return t && i.setAttribute("nonce", t), i.setAttribute(`data-tiptap-style${n ? `-${n}` : ""}`, ""), i.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(i), i;
}
function ad(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
}
function od(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sd() {
	return typeof navigator < "u" && /Firefox/.test(navigator.userAgent);
}
function cd(e) {
	return typeof e == "number";
}
function ld(e) {
	return Object.prototype.toString.call(e).slice(8, -1);
}
function ud(e) {
	return ld(e) === "Object" && e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
mc({}, {
	createAtomBlockMarkdownSpec: () => pd,
	createBlockMarkdownSpec: () => md,
	createInlineMarkdownSpec: () => _d,
	parseAttributes: () => dd,
	parseIndentedBlocks: () => vd,
	renderNestedMarkdownContent: () => yd,
	serializeAttributes: () => fd
});
function dd(e) {
	if (!e?.trim()) return {};
	let t = {}, n = [], r = e.replace(/["']([^"']*)["']/g, (e) => (n.push(e), `__QUOTED_${n.length - 1}__`)), i = r.match(/(?:^|\s)\.([\w-]+)/g);
	i && (t.class = i.map((e) => e.trim().slice(1)).join(" "));
	let a = r.match(/(?:^|\s)#([\w-]+)/);
	a && (t.id = a[1]), Array.from(r.matchAll(/([a-zA-Z][\w-]*)\s*=\s*(__QUOTED_\d+__)/g)).forEach(([, e, r]) => {
		let i = parseInt(r.match(/__QUOTED_(\d+)__/)?.[1] || "0", 10), a = n[i];
		a && (t[e] = a.slice(1, -1));
	});
	let o = r.replace(/(?:^|\s)\.([\w-]+)/g, "").replace(/(?:^|\s)#([\w-]+)/g, "").replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g, "").trim();
	return o && o.split(/\s+/).filter(Boolean).forEach((e) => {
		e.match(/^[a-zA-Z][\w-]*$/) && (t[e] = !0);
	}), t;
}
function fd(e) {
	if (!e || Object.keys(e).length === 0) return "";
	let t = [];
	return e.class && String(e.class).split(/\s+/).filter(Boolean).forEach((e) => t.push(`.${e}`)), e.id && t.push(`#${e.id}`), Object.entries(e).forEach(([e, n]) => {
		e === "class" || e === "id" || (n === !0 ? t.push(e) : n !== !1 && n != null && t.push(`${e}="${String(n)}"`));
	}), t.join(" ");
}
function pd(e) {
	let { nodeName: t, name: n, parseAttributes: r = dd, serializeAttributes: i = fd, defaultAttributes: a = {}, requiredAttributes: o = [], allowedAttributes: s } = e, c = n || t, l = (e) => {
		if (!s) return e;
		let t = {};
		return s.forEach((n) => {
			n in e && (t[n] = e[n]);
		}), t;
	};
	return {
		parseMarkdown: (e, n) => {
			let r = {
				...a,
				...e.attributes
			};
			return n.createNode(t, r, []);
		},
		markdownTokenizer: {
			name: t,
			level: "block",
			start(e) {
				let t = RegExp(`^:::${c}(?:\\s|$)`, "m"), n = e.match(t)?.index;
				return n === void 0 ? -1 : n;
			},
			tokenize(e, n, i) {
				let a = RegExp(`^:::${c}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`), s = e.match(a);
				if (!s) return;
				let l = s[1] || "", u = r(l);
				if (!o.find((e) => !(e in u))) return {
					type: t,
					raw: s[0],
					attributes: u
				};
			}
		},
		renderMarkdown: (e) => {
			let t = l(e.attrs || {}), n = i(t), r = n ? ` {${n}}` : "";
			return `:::${c}${r} :::`;
		}
	};
}
function md(e) {
	let { nodeName: t, name: n, getContent: r, parseAttributes: i = dd, serializeAttributes: a = fd, defaultAttributes: o = {}, content: s = "block", allowedAttributes: c } = e, l = n || t, u = (e) => {
		if (!c) return e;
		let t = {};
		return c.forEach((n) => {
			n in e && (t[n] = e[n]);
		}), t;
	};
	return {
		parseMarkdown: (e, n) => {
			let i;
			if (r) {
				let t = r(e);
				i = typeof t == "string" ? [{
					type: "text",
					text: t
				}] : t;
			} else i = s === "block" ? n.parseChildren(e.tokens || []) : n.parseInline(e.tokens || []);
			let a = {
				...o,
				...e.attributes
			};
			return n.createNode(t, a, i);
		},
		markdownTokenizer: {
			name: t,
			level: "block",
			start(e) {
				let t = RegExp(`^:::${l}`, "m"), n = e.match(t)?.index;
				return n === void 0 ? -1 : n;
			},
			tokenize(e, n, r) {
				let a = RegExp(`^:::${l}(?:\\s+\\{([^}]*)\\})?\\s*\\n`), o = e.match(a);
				if (!o) return;
				let [c, u = ""] = o, d = i(u), f = 1, p = c.length, m = "", h = /^:::([\w-]*)(\s.*)?/gm, g = e.slice(p);
				for (h.lastIndex = 0;;) {
					let n = h.exec(g);
					if (n === null) break;
					let i = n.index, a = n[1];
					if (!n[2]?.endsWith(":::")) {
						if (a) f += 1;
						else if (--f, f === 0) {
							let a = g.slice(0, i);
							m = a.trim();
							let o = e.slice(0, p + i + n[0].length), c = [];
							if (m) if (s === "block") for (c = r.blockTokens(a), c.forEach((e) => {
								e.text && (!e.tokens || e.tokens.length === 0) && (e.tokens = r.inlineTokens(e.text));
							}); c.length > 0;) {
								let e = c[c.length - 1];
								if (e.type === "paragraph" && (!e.text || e.text.trim() === "")) c.pop();
								else break;
							}
							else c = r.inlineTokens(m);
							return {
								type: t,
								raw: o,
								attributes: d,
								content: m,
								tokens: c
							};
						}
					}
				}
			}
		},
		renderMarkdown: (e, t) => {
			let n = u(e.attrs || {}), r = a(n), i = r ? ` {${r}}` : "", o = t.renderChildren(e.content || [], "\n\n");
			return `:::${l}${i}

${o}

:::`;
		}
	};
}
function hd(e) {
	if (!e.trim()) return {};
	let t = {}, n = /(\w+)=(?:"([^"]*)"|'([^']*)')/g, r = n.exec(e);
	for (; r !== null;) {
		let [, i, a, o] = r;
		t[i] = a || o, r = n.exec(e);
	}
	return t;
}
function gd(e) {
	return Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function _d(e) {
	let { nodeName: t, name: n, getContent: r, parseAttributes: i = hd, serializeAttributes: a = gd, defaultAttributes: o = {}, selfClosing: s = !1, allowedAttributes: c } = e, l = n || t, u = (e) => {
		if (!c) return e;
		let t = {};
		return c.forEach((n) => {
			let r = typeof n == "string" ? n : n.name, i = typeof n == "string" ? void 0 : n.skipIfDefault;
			if (r in e) {
				let n = e[r];
				if (i !== void 0 && n === i) return;
				t[r] = n;
			}
		}), t;
	}, d = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return {
		parseMarkdown: (e, n) => {
			let i = {
				...o,
				...e.attributes
			};
			if (s) return n.createNode(t, i);
			let a = r ? r(e) : e.content || "";
			return a ? n.createNode(t, i, [n.createTextNode(a)]) : n.createNode(t, i, []);
		},
		markdownTokenizer: {
			name: t,
			level: "inline",
			start(e) {
				let t = RegExp(s ? `\\[${d}\\s*[^\\]]*\\]` : `\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`), n = e.match(t)?.index;
				return n === void 0 ? -1 : n;
			},
			tokenize(e, n, r) {
				let a = RegExp(s ? `^\\[${d}\\s*([^\\]]*)\\]` : `^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`), o = e.match(a);
				if (!o) return;
				let c = "", l = "";
				if (s) {
					let [, e] = o;
					l = e;
				} else {
					let [, e, t] = o;
					l = e, c = t || "";
				}
				let u = i(l.trim());
				return {
					type: t,
					raw: o[0],
					content: c.trim(),
					attributes: u
				};
			}
		},
		renderMarkdown: (e) => {
			let t = "";
			r ? t = r(e) : e.content && e.content.length > 0 && (t = e.content.filter((e) => e.type === "text").map((e) => e.text).join(""));
			let n = u(e.attrs || {}), i = a(n), o = i ? ` ${i}` : "";
			return s ? `[${l}${o}]` : `[${l}${o}]${t}[/${l}]`;
		}
	};
}
function vd(e, t, n) {
	let r = e.split("\n"), i = [], a = "", o = 0, s = t.baseIndentSize || 2;
	for (; o < r.length;) {
		let e = r[o], c = e.match(t.itemPattern);
		if (!c) {
			if (i.length > 0) break;
			if (e.trim() === "") {
				o += 1, a = `${a}${e}
`;
				continue;
			} else return;
		}
		let l = t.extractItemData(c), { indentLevel: u, mainContent: d } = l;
		a = `${a}${e}
`;
		let f = [d];
		for (o += 1; o < r.length;) {
			let e = r[o];
			if (e.trim() === "") {
				let t = r.slice(o + 1).findIndex((e) => e.trim() !== "");
				if (t === -1) break;
				if ((r[o + 1 + t].match(/^(\s*)/)?.[1]?.length || 0) > u) {
					f.push(e), a = `${a}${e}
`, o += 1;
					continue;
				} else break;
			}
			if ((e.match(/^(\s*)/)?.[1]?.length || 0) > u) f.push(e), a = `${a}${e}
`, o += 1;
			else break;
		}
		let p, m = f.slice(1);
		if (m.length > 0) {
			let e = m.map((e) => e.slice(u + s)).join("\n");
			e.trim() && (p = t.customNestedParser ? t.customNestedParser(e) : n.blockTokens(e));
		}
		let h = t.createToken(l, p);
		i.push(h);
	}
	if (i.length !== 0) return {
		items: i,
		raw: a
	};
}
function yd(e, t, n, r) {
	if (!e || !Array.isArray(e.content)) return "";
	let i = typeof n == "function" ? n(r) : n, [a, ...o] = e.content, s = `${i}${t.renderChildren([a])}`;
	return o && o.length > 0 && o.forEach((e, n) => {
		let r = t.renderChild?.call(t, e, n + 1) ?? t.renderChildren([e]);
		if (r != null) {
			let n = r.split("\n").map((e) => e ? t.indent(e) : t.indent("")).join("\n");
			s += e.type === "paragraph" ? `

${n}` : `
${n}`;
		}
	}), s;
}
function bd(e) {
	return typeof e.type == "string" ? e.type : e.type.name;
}
function xd(e, t) {
	if (e.length !== t.length) return !1;
	let n = Array.from({ length: t.length }, () => !1);
	return e.every((e) => {
		let r = bd(e), i = t.findIndex((t, i) => !n[i] && r === bd(t) && nd(e.attrs, t.attrs));
		return i === -1 ? !1 : (n[i] = !0, !0);
	});
}
function Sd(e, t) {
	let n = { ...e };
	return ud(e) && ud(t) && Object.keys(t).forEach((r) => {
		ud(t[r]) && ud(e[r]) ? n[r] = Sd(e[r], t[r]) : n[r] = t[r];
	}), n;
}
function Cd(e, t, n = {}) {
	let { state: r } = t, { doc: i, tr: a } = r, o = e;
	i.descendants((t, r) => {
		let i = a.mapping.map(r), s = a.mapping.map(r) + t.nodeSize, c = null;
		if (t.marks.forEach((e) => {
			if (e !== o) return !1;
			c = e;
		}), !c) return;
		let l = !1;
		if (Object.keys(n).forEach((e) => {
			n[e] !== c.attrs[e] && (l = !0);
		}), l) {
			let t = e.type.create({
				...e.attrs,
				...n
			});
			a.removeMark(i, s, e.type), a.addMark(i, s, t);
		}
	}), a.docChanged && t.view.dispatch(a);
}
var wd = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler, this.undoable = e.undoable ?? !0;
	}
}, Td = (e, t) => {
	if (Nc(t)) return t.exec(e);
	let n = t(e);
	if (!n) return null;
	let r = [n.text];
	return r.index = n.index, r.input = e, r.data = n.data, n.replaceWith && (n.text.includes(n.replaceWith) || console.warn("[tiptap warn]: \"inputRuleMatch.replaceWith\" must be part of \"inputRuleMatch.text\"."), r.push(n.replaceWith)), r;
};
function Ed(e) {
	let { editor: t, from: n, to: r, text: i, rules: a, plugin: o } = e, { view: s } = t;
	if (s.composing) return !1;
	let c = s.state.doc.resolve(n);
	if (c.parent.type.spec.code || (c.nodeBefore || c.nodeAfter)?.marks.find((e) => e.type.spec.code)) return !1;
	let l = !1, u = hu(c) + i;
	return a.forEach((e) => {
		if (l) return;
		let a = Td(u, e.find);
		if (!a) return;
		let d = a[0].length - i.length;
		if (d > 0) {
			let e = c.parentOffset - d;
			if (e < 0 || c.parent.textBetween(e, c.parentOffset) !== a[0].slice(0, d)) return;
		}
		let f = s.state.tr, p = hc({
			state: s.state,
			transaction: f
		}), m = {
			from: n - (a[0].length - i.length),
			to: r
		}, { commands: h, chain: g, can: _ } = new gc({
			editor: t,
			state: p
		});
		e.handler({
			state: p,
			range: m,
			match: a,
			commands: h,
			chain: g,
			can: _
		}) === null || !f.steps.length || (e.undoable && f.setMeta(o, {
			transform: f,
			from: n,
			to: r,
			text: i
		}), s.dispatch(f), l = !0);
	}), l;
}
function Dd(e) {
	let { editor: t, rules: n } = e, r = new E({
		state: {
			init() {
				return null;
			},
			apply(e, i, o) {
				let s = e.getMeta(r);
				if (s) return s;
				let c = e.getMeta("applyInputRules");
				return c && setTimeout(() => {
					let { text: e } = c;
					e = typeof e == "string" ? e : Rl(a.from(e), o.schema);
					let { from: i } = c, s = i + e.length;
					Ed({
						editor: t,
						from: i,
						to: s,
						text: e,
						rules: n,
						plugin: r
					});
				}), e.selectionSet || e.docChanged ? null : i;
			}
		},
		props: {
			handleTextInput(e, i, a, o) {
				return Ed({
					editor: t,
					from: i,
					to: a,
					text: o,
					rules: n,
					plugin: r
				});
			},
			handleDOMEvents: { compositionend: (e) => (setTimeout(() => {
				let { $cursor: i } = e.state.selection;
				i && Ed({
					editor: t,
					from: i.pos,
					to: i.pos,
					text: "",
					rules: n,
					plugin: r
				});
			}), !1) },
			handleKeyDown(e, i) {
				if (i.key !== "Enter") return !1;
				let { $cursor: a } = e.state.selection;
				return a ? Ed({
					editor: t,
					from: a.pos,
					to: a.pos,
					text: "\n",
					rules: n,
					plugin: r
				}) : !1;
			}
		},
		isInputRules: !0
	});
	return r;
}
var Od = class {
	constructor(e = {}) {
		this.type = "extendable", this.parent = null, this.child = null, this.name = "", this.config = { name: this.name }, this.config = {
			...this.config,
			...e
		}, this.name = this.config.name;
	}
	get options() {
		return { ...j(A(this, "addOptions", { name: this.name })) };
	}
	get storage() {
		return { ...j(A(this, "addStorage", {
			name: this.name,
			options: this.options
		})) };
	}
	configure(e = {}) {
		let t = this.extend({
			...this.config,
			addOptions: () => Sd(this.options, e)
		});
		return t.name = this.name, t.parent = this.parent, this.child = null, t;
	}
	extend(e = {}) {
		let t = new this.constructor({
			...this.config,
			...e
		});
		return t.parent = this, this.child = t, t.name = "name" in e ? e.name : t.parent.name, t;
	}
}, kd = class e extends Od {
	constructor() {
		super(...arguments), this.type = "mark";
	}
	static create(t = {}) {
		let n = typeof t == "function" ? t() : t;
		return new e(n);
	}
	static handleExit({ editor: e, mark: t }) {
		let { tr: n } = e.state, r = e.state.selection.$from;
		if (r.pos === r.end()) {
			let i = r.marks();
			if (!i.find((e) => e?.type.name === t.name)) return !1;
			let a = i.find((e) => e?.type.name === t.name);
			return a && n.removeStoredMark(a), n.insertText(" ", r.pos), e.view.dispatch(n), !0;
		}
		return !1;
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, Ad = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler;
	}
}, jd = (e, t, n) => {
	if (Nc(t)) return [...e.matchAll(t)];
	let r = t(e, n);
	return r ? r.map((t) => {
		let n = [t.text];
		return n.index = t.index, n.input = e, n.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn("[tiptap warn]: \"pasteRuleMatch.replaceWith\" must be part of \"pasteRuleMatch.text\"."), n.push(t.replaceWith)), n;
	}) : [];
};
function Md(e) {
	let { editor: t, state: n, from: r, to: i, rule: a, pasteEvent: o, dropEvent: s } = e, { commands: c, chain: l, can: u } = new gc({
		editor: t,
		state: n
	}), d = [];
	return n.doc.nodesBetween(r, i, (e, t) => {
		if (e.type?.spec?.code || !(e.isText || e.isTextblock || e.isInline)) return;
		let f = e.content?.size ?? e.nodeSize ?? 0, p = Math.max(r, t), m = Math.min(i, t + f);
		p >= m || jd(e.isText ? e.text || "" : e.textBetween(p - t, m - t, void 0, "￼"), a.find, o).forEach((e) => {
			if (e.index === void 0) return;
			let t = p + e.index + 1, r = t + e[0].length, i = {
				from: n.tr.mapping.map(t),
				to: n.tr.mapping.map(r)
			}, f = a.handler({
				state: n,
				range: i,
				match: e,
				commands: c,
				chain: l,
				can: u,
				pasteEvent: o,
				dropEvent: s
			});
			d.push(f);
		});
	}), d.every((e) => e !== null);
}
var Nd = null, Pd = (e) => {
	let t = new ClipboardEvent("paste", { clipboardData: new DataTransfer() });
	return t.clipboardData?.setData("text/html", e), t;
};
function Fd(e) {
	let { editor: t, rules: n } = e, r = null, i = !1, o = !1, s = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, c;
	try {
		c = typeof DragEvent < "u" ? new DragEvent("drop") : null;
	} catch {
		c = null;
	}
	let l = ({ state: e, from: n, to: r, rule: i, pasteEvt: a }) => {
		let o = e.tr, l = hc({
			state: e,
			transaction: o
		});
		if (!(!Md({
			editor: t,
			state: l,
			from: Math.max(n - 1, 0),
			to: r.b - 1,
			rule: i,
			pasteEvent: a,
			dropEvent: c
		}) || !o.steps.length)) {
			try {
				c = typeof DragEvent < "u" ? new DragEvent("drop") : null;
			} catch {
				c = null;
			}
			return s = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, o;
		}
	};
	return n.map((e) => new E({
		view(e) {
			let n = (n) => {
				r = e.dom.parentElement?.contains(n.target) ? e.dom.parentElement : null, r && (Nd = t);
			}, i = () => {
				Nd &&= null;
			};
			return window.addEventListener("dragstart", n), window.addEventListener("dragend", i), { destroy() {
				window.removeEventListener("dragstart", n), window.removeEventListener("dragend", i);
			} };
		},
		props: { handleDOMEvents: {
			drop: (e, t) => {
				if (o = r === e.dom.parentElement, c = t, !o) {
					let e = Nd;
					e?.isEditable && setTimeout(() => {
						let t = e.state.selection;
						t && e.commands.deleteRange({
							from: t.from,
							to: t.to
						});
					}, 10);
				}
				return !1;
			},
			paste: (e, t) => {
				let n = t.clipboardData?.getData("text/html");
				return s = t, i = !!n?.includes("data-pm-slice"), !1;
			}
		} },
		appendTransaction: (t, n, r) => {
			let c = t[0], u = c.getMeta("uiEvent") === "paste" && !i, d = c.getMeta("uiEvent") === "drop" && !o, f = c.getMeta("applyPasteRules"), p = !!f;
			if (!u && !d && !p) return;
			if (p) {
				let { text: t } = f;
				t = typeof t == "string" ? t : Rl(a.from(t), r.schema);
				let { from: n } = f, i = n + t.length, o = Pd(t);
				return l({
					rule: e,
					state: r,
					from: n,
					to: { b: i },
					pasteEvt: o
				});
			}
			let m = n.doc.content.findDiffStart(r.doc.content), h = n.doc.content.findDiffEnd(r.doc.content);
			if (!(!cd(m) || !h || m === h.b)) return l({
				rule: e,
				state: r,
				from: m,
				to: h,
				pasteEvt: s
			});
		}
	}));
}
var Id = class {
	constructor(e, t) {
		this.splittableMarks = [], this.nonClearableMarks = [], this.editor = t, this.baseExtensions = e, this.extensions = $l(e), this.schema = Xl(this.extensions, t), this.setupExtensions();
	}
	get commands() {
		return this.extensions.reduce((e, t) => {
			let n = A(t, "addCommands", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: this.editor,
				type: pu(t.name, this.schema)
			});
			return n ? {
				...e,
				...n()
			} : e;
		}, {});
	}
	get plugins() {
		let { editor: e } = this;
		return Ql([...this.extensions].reverse()).flatMap((t) => {
			let n = {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: pu(t.name, this.schema)
			}, r = [], i = A(t, "addKeyboardShortcuts", n), a = {};
			if (t.type === "mark" && A(t, "exitable", n) && (a.ArrowRight = () => kd.handleExit({
				editor: e,
				mark: t
			})), i) {
				let t = Object.fromEntries(Object.entries(i()).map(([t, n]) => [t, () => n({ editor: e })]));
				a = {
					...a,
					...t
				};
			}
			let o = dc(a);
			r.push(o);
			let s = A(t, "addInputRules", n);
			if (bu(t, e.options.enableInputRules) && s) {
				let t = s();
				if (t && t.length) {
					let n = Dd({
						editor: e,
						rules: t
					}), i = Array.isArray(n) ? n : [n];
					r.push(...i);
				}
			}
			let c = A(t, "addPasteRules", n);
			if (bu(t, e.options.enablePasteRules) && c) {
				let t = c();
				if (t && t.length) {
					let n = Fd({
						editor: e,
						rules: t
					});
					r.push(...n);
				}
			}
			let l = A(t, "addProseMirrorPlugins", n);
			if (l) {
				let e = l();
				r.push(...e);
			}
			return r;
		});
	}
	get attributes() {
		return Hl(this.extensions);
	}
	get nodeViews() {
		let { editor: e } = this, { nodeExtensions: t } = Vl(this.extensions);
		return Object.fromEntries(t.filter((e) => !!A(e, "addNodeView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = A(t, "addNodeView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: k(t.name, this.schema)
			});
			if (!r) return [];
			let i = r();
			return i ? [t.name, (r, a, o, s, c) => {
				let l = Gl(r, n);
				return i({
					node: r,
					view: a,
					getPos: o,
					decorations: s,
					innerDecorations: c,
					editor: e,
					extension: t,
					HTMLAttributes: l
				});
			}] : [];
		}));
	}
	dispatchTransaction(e) {
		let { editor: t } = this;
		return Ql([...this.extensions].reverse()).reduceRight((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: pu(n.name, this.schema)
			}, i = A(n, "dispatchTransaction", r);
			return i ? (t) => {
				i.call(r, {
					transaction: t,
					next: e
				});
			} : e;
		}, e);
	}
	transformPastedHTML(e) {
		let { editor: t } = this;
		return Ql([...this.extensions]).reduce((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: pu(n.name, this.schema)
			}, i = A(n, "transformPastedHTML", r);
			return i ? (t, n) => {
				let a = e(t, n);
				return i.call(r, a);
			} : e;
		}, e || ((e) => e));
	}
	get markViews() {
		let { editor: e } = this, { markExtensions: t } = Vl(this.extensions);
		return Object.fromEntries(t.filter((e) => !!A(e, "addMarkView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = A(t, "addMarkView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: Rc(t.name, this.schema)
			});
			return r ? [t.name, (i, a, o) => {
				let s = Gl(i, n);
				return r()({
					mark: i,
					view: a,
					inline: o,
					editor: e,
					extension: t,
					HTMLAttributes: s,
					updateAttributes: (t) => {
						Cd(i, e, t);
					}
				});
			}] : [];
		}));
	}
	destroy() {
		this.extensions.forEach((e) => {
			let t = e;
			for (; t.parent;) {
				let e = t.parent;
				e.child === t && (e.child = null), t = e;
			}
		}), this.extensions = [], this.baseExtensions = [], this.schema = null, this.editor = null;
	}
	setupExtensions() {
		let e = this.extensions;
		this.editor.extensionStorage = Object.fromEntries(e.map((e) => [e.name, e.storage])), e.forEach((e) => {
			let t = {
				name: e.name,
				options: e.options,
				storage: this.editor.extensionStorage[e.name],
				editor: this.editor,
				type: pu(e.name, this.schema)
			};
			e.type === "mark" && ((j(A(e, "keepOnSplit", t)) ?? !0) && this.splittableMarks.push(e.name), (j(A(e, "clearable", t)) ?? !0) || this.nonClearableMarks.push(e.name));
			let n = A(e, "onBeforeCreate", t), r = A(e, "onCreate", t), i = A(e, "onUpdate", t), a = A(e, "onSelectionUpdate", t), o = A(e, "onTransaction", t), s = A(e, "onFocus", t), c = A(e, "onBlur", t), l = A(e, "onDestroy", t);
			n && this.editor.on("beforeCreate", n), r && this.editor.on("create", r), i && this.editor.on("update", i), a && this.editor.on("selectionUpdate", a), o && this.editor.on("transaction", o), s && this.editor.on("focus", s), c && this.editor.on("blur", c), l && this.editor.on("destroy", l);
		});
	}
};
Id.resolve = $l, Id.sort = Ql, Id.flatten = Ll, mc({}, {
	ClipboardTextSerializer: () => Ld,
	Commands: () => Rd,
	Delete: () => zd,
	Drop: () => Bd,
	Editable: () => Vd,
	FocusEvents: () => Ud,
	Keymap: () => Wd,
	Paste: () => Gd,
	Tabindex: () => Kd,
	TextDirection: () => qd,
	focusEventsPluginKey: () => Hd
});
var N = class e extends Od {
	constructor() {
		super(...arguments), this.type = "extension";
	}
	static create(t = {}) {
		let n = typeof t == "function" ? t() : t;
		return new e(n);
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
}, Ld = N.create({
	name: "clipboardTextSerializer",
	addOptions() {
		return { blockSeparator: void 0 };
	},
	addProseMirrorPlugins() {
		return [new E({
			key: new D("clipboardTextSerializer"),
			props: { clipboardTextSerializer: () => {
				let { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: i } = t, a = iu(n), { blockSeparator: o } = this.options, s = {
					...o === void 0 ? {} : { blockSeparator: o },
					textSerializers: a
				};
				return [...i.ranges].sort((e, t) => e.$from.pos - t.$from.pos).map(({ $from: e, $to: t }) => nu(r, {
					from: e.pos,
					to: t.pos
				}, s)).join(o ?? "\n\n");
			} }
		})];
	}
}), Rd = N.create({
	name: "commands",
	addCommands() {
		return { ..._c };
	}
}), zd = N.create({
	name: "delete",
	onUpdate({ transaction: e, appendedTransactions: t }) {
		let n = () => {
			var n;
			if (((n = this.editor.options.coreExtensionOptions?.delete)?.filterTransaction)?.call(n, e) ?? e.getMeta("y-sync$")) return;
			let r = Nl(e.before, [e, ...t]);
			lu(r).forEach((t) => {
				r.mapping.mapResult(t.oldRange.from).deletedAfter && r.mapping.mapResult(t.oldRange.to).deletedBefore && r.before.nodesBetween(t.oldRange.from, t.oldRange.to, (n, i) => {
					let a = i + n.nodeSize - 2, o = t.oldRange.from <= i && a <= t.oldRange.to;
					this.editor.emit("delete", {
						type: "node",
						node: n,
						from: i,
						to: a,
						newFrom: r.mapping.map(i),
						newTo: r.mapping.map(a),
						deletedRange: t.oldRange,
						newRange: t.newRange,
						partial: !o,
						editor: this.editor,
						transaction: e,
						combinedTransform: r
					});
				});
			});
			let i = r.mapping;
			r.steps.forEach((t, n) => {
				if (t instanceof bt) {
					let a = i.slice(n).map(t.from, -1), o = i.slice(n).map(t.to), s = i.invert().map(a, -1), c = i.invert().map(o), l = a > 0 && r.doc.nodeAt(a - 1)?.marks.some((e) => e.eq(t.mark)), u = r.doc.nodeAt(o)?.marks.some((e) => e.eq(t.mark));
					this.editor.emit("delete", {
						type: "mark",
						mark: t.mark,
						from: t.from,
						to: t.to,
						deletedRange: {
							from: s,
							to: c
						},
						newRange: {
							from: a,
							to: o
						},
						partial: !!(u || l),
						editor: this.editor,
						transaction: e,
						combinedTransform: r
					});
				}
			});
		};
		this.editor.options.coreExtensionOptions?.delete?.async ?? !0 ? setTimeout(n, 0) : n();
	}
}), Bd = N.create({
	name: "drop",
	addProseMirrorPlugins() {
		return [new E({
			key: new D("tiptapDrop"),
			props: { handleDrop: (e, t, n, r) => {
				this.editor.emit("drop", {
					editor: this.editor,
					event: t,
					slice: n,
					moved: r
				});
			} }
		})];
	}
}), Vd = N.create({
	name: "editable",
	addProseMirrorPlugins() {
		return [new E({
			key: new D("editable"),
			props: { editable: () => this.editor.options.editable }
		})];
	}
}), Hd = new D("focusEvents"), Ud = N.create({
	name: "focusEvents",
	addProseMirrorPlugins() {
		let { editor: e } = this;
		return [new E({
			key: Hd,
			props: { handleDOMEvents: {
				focus: (t, n) => {
					e.isFocused = !0;
					let r = e.state.tr.setMeta("focus", { event: n }).setMeta("addToHistory", !1);
					return t.dispatch(r), !1;
				},
				blur: (t, n) => {
					e.isFocused = !1;
					let r = e.state.tr.setMeta("blur", { event: n }).setMeta("addToHistory", !1);
					return t.dispatch(r), !1;
				}
			} }
		})];
	}
}), Wd = N.create({
	name: "keymap",
	addKeyboardShortcuts() {
		let e = () => this.editor.commands.first(({ commands: e }) => [
			() => e.undoInputRule(),
			() => e.command(({ tr: t }) => {
				let { selection: n, doc: r } = t, { empty: i, $anchor: a } = n, { pos: o, parent: s } = a, c = a.parent.isTextblock && o > 0 ? t.doc.resolve(o - 1) : a, l = c.parent.type.spec.isolating, u = a.pos - a.parentOffset, d = l && c.parent.childCount === 1 ? u === a.pos : C.atStart(r).from === o;
				return !i || !s.type.isTextblock || s.textContent.length || !d || d && a.parent.type.name === "paragraph" ? !1 : e.clearNodes();
			}),
			() => e.deleteSelection(),
			() => e.joinBackward(),
			() => e.selectNodeBackward()
		]), t = () => this.editor.commands.first(({ commands: e }) => [
			() => e.deleteSelection(),
			() => e.deleteCurrentNode(),
			() => e.joinForward(),
			() => e.selectNodeForward()
		]), n = {
			Enter: () => this.editor.commands.first(({ commands: e }) => [
				() => e.newlineInCode(),
				() => e.createParagraphNear(),
				() => e.liftEmptyBlock(),
				() => e.splitBlock()
			]),
			"Mod-Enter": () => this.editor.commands.exitCode(),
			Backspace: e,
			"Mod-Backspace": e,
			"Shift-Backspace": e,
			Delete: t,
			"Mod-Delete": t,
			"Mod-a": () => this.editor.commands.selectAll()
		}, r = { ...n }, i = {
			...n,
			"Ctrl-h": e,
			"Alt-Backspace": e,
			"Ctrl-d": t,
			"Ctrl-Alt-Backspace": t,
			"Alt-Delete": t,
			"Alt-d": t,
			"Ctrl-a": () => this.editor.commands.selectTextblockStart(),
			"Ctrl-e": () => this.editor.commands.selectTextblockEnd()
		};
		return Gc() || fl() ? i : r;
	},
	addProseMirrorPlugins() {
		return [new E({
			key: new D("clearDocument"),
			appendTransaction: (e, t, n) => {
				if (e.some((e) => e.getMeta("composition"))) return;
				let r = e.some((e) => e.docChanged) && !t.doc.eq(n.doc), i = e.some((e) => e.getMeta("preventClearDocument"));
				if (!r || i) return;
				let { empty: a, from: o, to: s } = t.selection, c = C.atStart(t.doc).from, l = C.atEnd(t.doc).to;
				if (a || !(o === c && s === l) || !Su(n.doc)) return;
				let u = n.tr, d = hc({
					state: n,
					transaction: u
				}), { commands: f } = new gc({
					editor: this.editor,
					state: d
				});
				if (f.clearNodes(), u.steps.length) return u;
			}
		})];
	}
}), Gd = N.create({
	name: "paste",
	addProseMirrorPlugins() {
		return [new E({
			key: new D("tiptapPaste"),
			props: { handlePaste: (e, t, n) => {
				this.editor.emit("paste", {
					editor: this.editor,
					event: t,
					slice: n
				});
			} }
		})];
	}
}), Kd = N.create({
	name: "tabindex",
	addOptions() {
		return { value: void 0 };
	},
	addProseMirrorPlugins() {
		return [new E({
			key: new D("tabindex"),
			props: { attributes: () => !this.editor.isEditable && this.options.value === void 0 ? {} : { tabindex: this.options.value ?? "0" } }
		})];
	}
}), qd = N.create({
	name: "textDirection",
	addOptions() {
		return { direction: void 0 };
	},
	addGlobalAttributes() {
		if (!this.options.direction) return [];
		let { nodeExtensions: e } = Vl(this.extensions);
		return [{
			types: e.filter((e) => e.name !== "text").map((e) => e.name),
			attributes: { dir: {
				default: this.options.direction,
				parseHTML: (e) => {
					let t = e.getAttribute("dir");
					return t && (t === "ltr" || t === "rtl" || t === "auto") ? t : this.options.direction;
				},
				renderHTML: (e) => e.dir ? { dir: e.dir } : {}
			} }
		}];
	},
	addProseMirrorPlugins() {
		return [new E({
			key: new D("textDirection"),
			props: { attributes: () => {
				let e = this.options.direction;
				return e ? { dir: e } : {};
			} }
		})];
	}
}), Jd = class e {
	constructor(e, t, n = !1, r = null) {
		this.currentNode = null, this.actualDepth = null, this.isBlock = n, this.resolvedPos = e, this.editor = t, this.currentNode = r;
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
		return this.actualDepth ?? this.resolvedPos.depth;
	}
	get pos() {
		return this.resolvedPos.pos;
	}
	get content() {
		return this.node.content;
	}
	set content(e) {
		let t = this.from, n = this.to;
		if (this.isBlock) {
			if (this.content.size === 0) {
				console.error(`You can\u2019t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
				return;
			}
			t = this.from + 1, n = this.to - 1;
		}
		this.editor.commands.insertContentAt({
			from: t,
			to: n
		}, e);
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
		return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + +!this.node.isText;
	}
	get parent() {
		if (this.depth === 0) return null;
		let t = this.resolvedPos.start(this.resolvedPos.depth - 1), n = this.resolvedPos.doc.resolve(t);
		return new e(n, this.editor);
	}
	get before() {
		let t = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
		return t.depth !== this.depth && (t = this.resolvedPos.doc.resolve(this.from - 3)), new e(t, this.editor);
	}
	get after() {
		let t = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
		return t.depth !== this.depth && (t = this.resolvedPos.doc.resolve(this.to + 3)), new e(t, this.editor);
	}
	get children() {
		let t = [];
		return this.node.content.forEach((n, r) => {
			let i = n.isBlock && !n.isTextblock, a = n.isAtom && !n.isText, o = n.isInline, s = this.pos + r + +!a;
			if (s < 0 || s > this.resolvedPos.doc.nodeSize - 2) return;
			let c = this.resolvedPos.doc.resolve(s);
			if (!i && !o && c.depth <= this.depth) return;
			let l = new e(c, this.editor, i, i || o ? n : null);
			i && (l.actualDepth = this.depth + 1), t.push(l);
		}), t;
	}
	get firstChild() {
		return this.children[0] || null;
	}
	get lastChild() {
		let e = this.children;
		return e[e.length - 1] || null;
	}
	closest(e, t = {}) {
		let n = null, r = this.parent;
		for (; r && !n;) {
			if (r.node.type.name === e) if (Object.keys(t).length > 0) {
				let e = r.node.attrs, n = Object.keys(t);
				for (let r = 0; r < n.length; r += 1) {
					let i = n[r];
					if (e[i] !== t[i]) break;
				}
			} else n = r;
			r = r.parent;
		}
		return n;
	}
	querySelector(e, t = {}) {
		return this.querySelectorAll(e, t, !0)[0] || null;
	}
	querySelectorAll(e, t = {}, n = !1) {
		let r = [];
		if (!this.children || this.children.length === 0) return r;
		let i = Object.keys(t);
		return this.children.forEach((a) => {
			n && r.length > 0 || (a.node.type.name === e && i.every((e) => t[e] === a.node.attrs[e]) && r.push(a), !(n && r.length > 0) && (r = r.concat(a.querySelectorAll(e, t, n))));
		}), r;
	}
	setAttribute(e) {
		let { tr: t } = this.editor.state;
		t.setNodeMarkup(this.from, void 0, {
			...this.node.attrs,
			...e
		}), this.editor.view.dispatch(t);
	}
}, Yd = ".ProseMirror {\n  position: relative;\n}\n\n.ProseMirror {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  white-space: break-spaces;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n  font-feature-settings: \"liga\" 0; /* the above doesn't seem to work in Edge */\n}\n\n.ProseMirror [contenteditable=\"false\"] {\n  white-space: normal;\n}\n\n.ProseMirror [contenteditable=\"false\"] [contenteditable=\"true\"] {\n  white-space: pre-wrap;\n}\n\n.ProseMirror pre {\n  white-space: pre-wrap;\n}\n\nimg.ProseMirror-separator {\n  display: inline !important;\n  border: none !important;\n  margin: 0 !important;\n  width: 0 !important;\n  height: 0 !important;\n}\n\n.ProseMirror-gapcursor {\n  display: none;\n  pointer-events: none;\n  position: absolute;\n  margin: 0;\n}\n\n.ProseMirror-gapcursor:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: -2px;\n  width: 20px;\n  border-top: 1px solid black;\n  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n}\n\n@keyframes ProseMirror-cursor-blink {\n  to {\n    visibility: hidden;\n  }\n}\n\n.ProseMirror-hideselection *::selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection *::-moz-selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection * {\n  caret-color: transparent;\n}\n\n.ProseMirror-focused .ProseMirror-gapcursor {\n  display: block;\n}", Xd = class extends td {
	constructor(e = {}) {
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
			onContentError: ({ error: e }) => {
				throw e;
			},
			onPaste: () => null,
			onDrop: () => null,
			onDelete: () => null,
			enableExtensionDispatchTransaction: !0
		}, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.utils = {
			getUpdatedPosition: Tu,
			createMappablePosition: Eu
		}, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: e, slice: t, moved: n }) => this.options.onDrop(e, t, n)), this.on("paste", ({ event: e, slice: t }) => this.options.onPaste(e, t)), this.on("delete", this.options.onDelete);
		let t = this.createDoc();
		if (!this.editorState) {
			let e = Uc(t, this.options.autofocus);
			this.editorState = Fn.create({
				doc: t,
				schema: this.schema,
				selection: e || void 0
			});
		}
		this.options.element && this.mount(this.options.element);
	}
	mount(e) {
		if (typeof document > "u") throw Error("[tiptap error]: The editor cannot be mounted because there is no 'document' defined in this environment.");
		this.createView(e), this.emit("mount", { editor: this }), this.css && !document.head.contains(this.css) && document.head.appendChild(this.css), window.setTimeout(() => {
			this.isDestroyed || (this.options.autofocus !== !1 && this.options.autofocus !== null && this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
		}, 0);
	}
	unmount() {
		if (this.editorView) {
			let e = this.editorView.dom;
			e?.editor && delete e.editor, this.editorView.destroy();
		}
		if (this.editorView = null, this.isInitialized = !1, this.css && !document.querySelectorAll(`.${this.className}`).length) try {
			typeof this.css.remove == "function" ? this.css.remove() : this.css.parentNode && this.css.parentNode.removeChild(this.css);
		} catch (e) {
			console.warn("Failed to remove CSS element:", e);
		}
		this.css = null, this.emit("unmount", { editor: this });
	}
	get storage() {
		return this.extensionStorage;
	}
	get commands() {
		return this.commandManager.commands;
	}
	chain() {
		return this.commandManager.chain();
	}
	can() {
		return this.commandManager.can();
	}
	injectCSS() {
		this.options.injectCSS && typeof document < "u" && (this.css = id(Yd, this.options.injectNonce));
	}
	setOptions(e = {}) {
		this.options = {
			...this.options,
			...e
		}, !(!this.editorView || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
	}
	setEditable(e, t = !0) {
		this.setOptions({ editable: e }), t && this.emit("update", {
			editor: this,
			transaction: this.state.tr,
			appendedTransactions: []
		});
	}
	get isEditable() {
		return this.options.editable && this.view && this.view.editable;
	}
	get view() {
		return this.editorView ? this.editorView : new Proxy({
			state: this.editorState,
			updateState: (e) => {
				this.editorState = e;
			},
			dispatch: (e) => {
				this.dispatchTransaction(e);
			},
			composing: !1,
			dragging: null,
			editable: !0,
			isDestroyed: !1
		}, { get: (e, t) => {
			if (this.editorView) return this.editorView[t];
			if (t === "state") return this.editorState;
			if (t in e) return Reflect.get(e, t);
			throw Error(`[tiptap error]: The editor view is not available. Cannot access view['${t}']. The editor may not be mounted yet.`);
		} });
	}
	get state() {
		return this.editorView && (this.editorState = this.view.state), this.editorState;
	}
	registerPlugin(e, t) {
		let n = zl(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], r = this.state.reconfigure({ plugins: n });
		return this.view.updateState(r), r;
	}
	unregisterPlugin(e) {
		if (this.isDestroyed) return;
		let t = this.state.plugins, n = t;
		if ([].concat(e).forEach((e) => {
			let t = typeof e == "string" ? `${e}$` : e.key;
			n = n.filter((e) => !e.key.startsWith(t));
		}), t.length === n.length) return;
		let r = this.state.reconfigure({ plugins: n });
		return this.view.updateState(r), r;
	}
	createExtensionManager() {
		let e = [...this.options.enableCoreExtensions ? [
			Vd,
			Ld.configure({ blockSeparator: this.options.coreExtensionOptions?.clipboardTextSerializer?.blockSeparator }),
			Rd,
			Ud,
			Wd,
			Kd.configure({ value: this.options.coreExtensionOptions?.tabindex?.value }),
			Bd,
			Gd,
			zd,
			qd.configure({ direction: this.options.textDirection })
		].filter((e) => typeof this.options.enableCoreExtensions != "object" || this.options.enableCoreExtensions[e.name] !== !1) : [], ...this.options.extensions].filter((e) => [
			"extension",
			"node",
			"mark"
		].includes(e?.type));
		this.extensionManager = new Id(e, this);
	}
	createCommandManager() {
		this.commandManager = new gc({ editor: this });
	}
	createSchema() {
		this.schema = this.extensionManager.schema;
	}
	createDoc() {
		let e;
		try {
			e = Al(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: this.options.enableContentCheck });
		} catch (e) {
			if (!(e instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(e.message)) throw e;
			let t = Al(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: !1 });
			return this.editorState = Fn.create({
				doc: t,
				schema: this.schema,
				selection: Uc(t, this.options.autofocus) || void 0
			}), this.emit("contentError", {
				editor: this,
				error: e,
				disableCollaboration: () => {
					"collaboration" in this.storage && typeof this.storage.collaboration == "object" && this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter((e) => e.name !== "collaboration"), this.createExtensionManager();
				}
			}), this.editorState.doc;
		}
		return e;
	}
	createView(e) {
		let { editorProps: t, enableExtensionDispatchTransaction: n } = this.options, r = t.dispatchTransaction || this.dispatchTransaction.bind(this), i = n ? this.extensionManager.dispatchTransaction(r) : r, a = t.transformPastedHTML, o = this.extensionManager.transformPastedHTML(a);
		this.editorView = new Gs(e, {
			...t,
			attributes: {
				role: "textbox",
				...t?.attributes
			},
			dispatchTransaction: i,
			transformPastedHTML: o,
			state: this.editorState,
			markViews: this.extensionManager.markViews,
			nodeViews: this.extensionManager.nodeViews
		});
		let s = this.state.reconfigure({ plugins: this.extensionManager.plugins });
		this.view.updateState(s), this.prependClass(), this.injectCSS();
		let c = this.view.dom;
		c.editor = this;
	}
	createNodeViews() {
		this.view.isDestroyed || this.view.setProps({
			markViews: this.extensionManager.markViews,
			nodeViews: this.extensionManager.nodeViews
		});
	}
	prependClass() {
		this.view.dom.className = `${this.className} ${this.view.dom.className}`;
	}
	captureTransaction(e) {
		this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
		let t = this.capturedTransaction;
		return this.capturedTransaction = null, t;
	}
	dispatchTransaction(e) {
		if (this.view.isDestroyed) return;
		if (this.isCapturingTransaction) {
			if (!this.capturedTransaction) {
				this.capturedTransaction = e;
				return;
			}
			e.steps.forEach((e) => this.capturedTransaction?.step(e));
			return;
		}
		let { state: t, transactions: n } = this.state.applyTransaction(e), r = !this.state.selection.eq(t.selection), i = n.includes(e), a = this.state;
		if (this.emit("beforeTransaction", {
			editor: this,
			transaction: e,
			nextState: t
		}), !i) return;
		this.view.updateState(t), this.emit("transaction", {
			editor: this,
			transaction: e,
			appendedTransactions: n.slice(1)
		}), r && this.emit("selectionUpdate", {
			editor: this,
			transaction: e
		});
		let o = n.findLast((e) => e.getMeta("focus") || e.getMeta("blur")), s = o?.getMeta("focus"), c = o?.getMeta("blur");
		s && this.emit("focus", {
			editor: this,
			event: s.event,
			transaction: o
		}), c && this.emit("blur", {
			editor: this,
			event: c.event,
			transaction: o
		}), !(e.getMeta("preventUpdate") || !n.some((e) => e.docChanged) || a.doc.eq(t.doc)) && this.emit("update", {
			editor: this,
			transaction: e,
			appendedTransactions: n.slice(1)
		});
	}
	getAttributes(e) {
		return ou(this.state, e);
	}
	isActive(e, t) {
		let n = typeof e == "string" ? e : null, r = typeof e == "string" ? t : e;
		return _u(this.state, n, r);
	}
	getJSON() {
		return this.state.doc.toJSON();
	}
	getHTML() {
		return Rl(this.state.doc.content, this.schema);
	}
	getText(e) {
		let { blockSeparator: t = "\n\n", textSerializers: n = {} } = e || {};
		return ru(this.state.doc, {
			blockSeparator: t,
			textSerializers: {
				...iu(this.schema),
				...n
			}
		});
	}
	get isEmpty() {
		return Su(this.state.doc);
	}
	destroy() {
		this.destroyed || (this.destroyed = !0, this.emit("destroy"), this.unmount(), this.removeAllListeners(), this.extensionManager.destroy(), this.extensionManager = null, this.schema = null, this.commandManager = null, this.extensionStorage = {});
	}
	get isDestroyed() {
		return this.editorView?.isDestroyed ?? !0;
	}
	$node(e, t) {
		return this.$doc?.querySelector(e, t) || null;
	}
	$nodes(e, t) {
		return this.$doc?.querySelectorAll(e, t) || null;
	}
	$pos(e) {
		let t = this.state.doc.resolve(e), n = e > 0 && t.nodeAfter && !t.nodeAfter.isText && t.nodeAfter.isAtom ? t.nodeAfter : null;
		return new Jd(t, this, !1, n);
	}
	get $doc() {
		return this.$pos(0);
	}
};
function Zd(e) {
	return new wd({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = j(e.getAttributes, void 0, r);
			if (i === !1 || i === null) return null;
			let { tr: a } = t, o = r[r.length - 1], s = r[0];
			if (o) {
				let r = s.search(/\S/), c = n.from + s.indexOf(o), l = c + o.length;
				if (du(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > c).length) return null;
				l < n.to && a.delete(l, n.to), c > n.from && a.delete(n.from + r, c);
				let u = n.from + r + o.length;
				a.addMark(n.from + r, u, e.type.create(i || {})), a.removeStoredMark(e.type);
			}
		},
		undoable: e.undoable
	});
}
function Qd(e) {
	return new wd({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = j(e.getAttributes, void 0, r) || {}, { tr: a } = t, o = n.from, s = n.to, c = e.type.create(i);
			if (r[1]) {
				let e = o + r[0].lastIndexOf(r[1]);
				e > s ? e = s : s = e + r[1].length;
				let t = r[0][r[0].length - 1];
				a.insertText(t, o + r[0].length - 1), a.replaceWith(e, s, c);
			} else if (r[0]) {
				let t = e.type.isInline ? o : o - 1;
				a.insert(t, e.type.create(i)).delete(a.mapping.map(o), a.mapping.map(s));
			}
			a.scrollIntoView();
		},
		undoable: e.undoable
	});
}
function $d(e) {
	return new wd({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = t.doc.resolve(n.from), a = j(e.getAttributes, void 0, r) || {};
			if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), e.type)) return null;
			t.tr.delete(n.from, n.to).setBlockType(n.from, n.from, e.type, a);
		},
		undoable: e.undoable
	});
}
function ef(e) {
	return new wd({
		find: e.find,
		handler: ({ state: t, range: n, match: r, chain: i }) => {
			let a = j(e.getAttributes, void 0, r) || {}, o = t.tr.delete(n.from, n.to), s = o.doc.resolve(n.from).blockRange(), c = s && Mt(s, e.type, a);
			if (!c) return null;
			if (o.wrap(s, c), e.keepMarks && e.editor) {
				let { selection: n, storedMarks: r } = t, { splittableMarks: i } = e.editor.extensionManager, a = r || n.$to.parentOffset && n.$from.marks();
				if (a) {
					let e = a.filter((e) => i.includes(e.type.name));
					o.ensureMarks(e);
				}
			}
			if (e.keepAttributes) {
				let t = e.type.name === "bulletList" || e.type.name === "orderedList" ? "listItem" : "taskList";
				i().updateAttributes(t, a).run();
			}
			let l = o.doc.resolve(n.from - 1).nodeBefore;
			l && l.type === e.type && Wt(o.doc, n.from - 1) && (!e.joinPredicate || e.joinPredicate(r, l)) && o.join(n.from - 1);
		},
		undoable: e.undoable
	});
}
var tf = (e) => "touches" in e, nf = class {
	constructor(e) {
		this.directions = [
			"bottom-left",
			"bottom-right",
			"top-left",
			"top-right"
		], this.minSize = {
			height: 8,
			width: 8
		}, this.preserveAspectRatio = !1, this.classNames = {
			container: "",
			wrapper: "",
			handle: "",
			resizing: ""
		}, this.initialWidth = 0, this.initialHeight = 0, this.aspectRatio = 1, this.isResizing = !1, this.activeHandle = null, this.startX = 0, this.startY = 0, this.startWidth = 0, this.startHeight = 0, this.isShiftKeyPressed = !1, this.lastEditableState = void 0, this.handleMap = /* @__PURE__ */ new Map(), this.handleMouseMove = (e) => {
			if (!this.isResizing || !this.activeHandle) return;
			let t = e.clientX - this.startX, n = e.clientY - this.startY;
			this.handleResize(t, n);
		}, this.handleTouchMove = (e) => {
			if (!this.isResizing || !this.activeHandle) return;
			let t = e.touches[0];
			if (!t) return;
			let n = t.clientX - this.startX, r = t.clientY - this.startY;
			this.handleResize(n, r);
		}, this.handleMouseUp = () => {
			if (!this.isResizing) return;
			let e = this.element.offsetWidth, t = this.element.offsetHeight;
			this.onCommit(e, t), this.isResizing = !1, this.activeHandle = null, this.container.dataset.resizeState = "false", this.classNames.resizing && this.container.classList.remove(this.classNames.resizing), document.removeEventListener("mousemove", this.handleMouseMove), document.removeEventListener("mouseup", this.handleMouseUp), document.removeEventListener("keydown", this.handleKeyDown), document.removeEventListener("keyup", this.handleKeyUp);
		}, this.handleKeyDown = (e) => {
			e.key === "Shift" && (this.isShiftKeyPressed = !0);
		}, this.handleKeyUp = (e) => {
			e.key === "Shift" && (this.isShiftKeyPressed = !1);
		}, this.node = e.node, this.editor = e.editor, this.element = e.element, this.element.draggable = !1, this.contentElement = e.contentElement, this.getPos = e.getPos, this.onResize = e.onResize, this.onCommit = e.onCommit, this.onUpdate = e.onUpdate, e.options?.min && (this.minSize = {
			...this.minSize,
			...e.options.min
		}), e.options?.max && (this.maxSize = e.options.max), e?.options?.directions && (this.directions = e.options.directions), e.options?.preserveAspectRatio && (this.preserveAspectRatio = e.options.preserveAspectRatio), e.options?.className && (this.classNames = {
			container: e.options.className.container || "",
			wrapper: e.options.className.wrapper || "",
			handle: e.options.className.handle || "",
			resizing: e.options.className.resizing || ""
		}), e.options?.createCustomHandle && (this.createCustomHandle = e.options.createCustomHandle), this.wrapper = this.createWrapper(), this.container = this.createContainer(), this.applyInitialSize(), this.attachHandles(), this.editor.on("update", this.handleEditorUpdate.bind(this));
	}
	get dom() {
		return this.container;
	}
	get contentDOM() {
		return this.contentElement ?? null;
	}
	handleEditorUpdate() {
		let e = this.editor.isEditable;
		e !== this.lastEditableState && (this.lastEditableState = e, e ? e && this.handleMap.size === 0 && this.attachHandles() : this.removeHandles());
	}
	update(e, t, n) {
		return e.type === this.node.type ? (this.node = e, !this.onUpdate || this.onUpdate(e, t, n)) : !1;
	}
	destroy() {
		this.isResizing && (this.container.dataset.resizeState = "false", this.classNames.resizing && this.container.classList.remove(this.classNames.resizing), document.removeEventListener("mousemove", this.handleMouseMove), document.removeEventListener("mouseup", this.handleMouseUp), document.removeEventListener("keydown", this.handleKeyDown), document.removeEventListener("keyup", this.handleKeyUp), this.isResizing = !1, this.activeHandle = null), this.editor.off("update", this.handleEditorUpdate.bind(this)), this.container.remove();
	}
	createContainer() {
		let e = document.createElement("div");
		return e.dataset.resizeContainer = "", e.dataset.node = this.node.type.name, e.style.display = this.node.type.isInline ? "inline-flex" : "flex", this.classNames.container && (e.className = this.classNames.container), e.appendChild(this.wrapper), e;
	}
	createWrapper() {
		let e = document.createElement("div");
		return e.style.position = "relative", e.style.display = "block", e.dataset.resizeWrapper = "", this.classNames.wrapper && (e.className = this.classNames.wrapper), e.appendChild(this.element), e;
	}
	createHandle(e) {
		let t = document.createElement("div");
		return t.dataset.resizeHandle = e, t.style.position = "absolute", this.classNames.handle && (t.className = this.classNames.handle), t;
	}
	positionHandle(e, t) {
		let n = t.includes("top"), r = t.includes("bottom"), i = t.includes("left"), a = t.includes("right");
		n && (e.style.top = "0"), r && (e.style.bottom = "0"), i && (e.style.left = "0"), a && (e.style.right = "0"), (t === "top" || t === "bottom") && (e.style.left = "0", e.style.right = "0"), (t === "left" || t === "right") && (e.style.top = "0", e.style.bottom = "0");
	}
	attachHandles() {
		this.directions.forEach((e) => {
			let t;
			t = this.createCustomHandle ? this.createCustomHandle(e) : this.createHandle(e), t instanceof HTMLElement || (console.warn(`[ResizableNodeView] createCustomHandle("${e}") did not return an HTMLElement. Falling back to default handle.`), t = this.createHandle(e)), this.createCustomHandle || this.positionHandle(t, e), t.addEventListener("mousedown", (t) => this.handleResizeStart(t, e)), t.addEventListener("touchstart", (t) => this.handleResizeStart(t, e)), this.handleMap.set(e, t), this.wrapper.appendChild(t);
		});
	}
	removeHandles() {
		this.handleMap.forEach((e) => e.remove()), this.handleMap.clear();
	}
	applyInitialSize() {
		let e = this.node.attrs.width, t = this.node.attrs.height;
		e ? (this.element.style.width = `${e}px`, this.initialWidth = e) : this.initialWidth = this.element.offsetWidth, t ? (this.element.style.height = `${t}px`, this.initialHeight = t) : this.initialHeight = this.element.offsetHeight, this.initialWidth > 0 && this.initialHeight > 0 && (this.aspectRatio = this.initialWidth / this.initialHeight);
	}
	handleResizeStart(e, t) {
		e.preventDefault(), e.stopPropagation(), this.isResizing = !0, this.activeHandle = t, tf(e) ? (this.startX = e.touches[0].clientX, this.startY = e.touches[0].clientY) : (this.startX = e.clientX, this.startY = e.clientY), this.startWidth = this.element.offsetWidth, this.startHeight = this.element.offsetHeight, this.startWidth > 0 && this.startHeight > 0 && (this.aspectRatio = this.startWidth / this.startHeight), this.getPos(), this.container.dataset.resizeState = "true", this.classNames.resizing && this.container.classList.add(this.classNames.resizing), document.addEventListener("mousemove", this.handleMouseMove), document.addEventListener("touchmove", this.handleTouchMove), document.addEventListener("mouseup", this.handleMouseUp), document.addEventListener("keydown", this.handleKeyDown), document.addEventListener("keyup", this.handleKeyUp);
	}
	handleResize(e, t) {
		if (!this.activeHandle) return;
		let n = this.preserveAspectRatio || this.isShiftKeyPressed, { width: r, height: i } = this.calculateNewDimensions(this.activeHandle, e, t), a = this.applyConstraints(r, i, n);
		this.element.style.width = `${a.width}px`, this.element.style.height = `${a.height}px`, this.onResize && this.onResize(a.width, a.height);
	}
	calculateNewDimensions(e, t, n) {
		let r = this.startWidth, i = this.startHeight, a = e.includes("right"), o = e.includes("left"), s = e.includes("bottom"), c = e.includes("top");
		return a ? r = this.startWidth + t : o && (r = this.startWidth - t), s ? i = this.startHeight + n : c && (i = this.startHeight - n), (e === "right" || e === "left") && (r = this.startWidth + (a ? t : -t)), (e === "top" || e === "bottom") && (i = this.startHeight + (s ? n : -n)), this.preserveAspectRatio || this.isShiftKeyPressed ? this.applyAspectRatio(r, i, e) : {
			width: r,
			height: i
		};
	}
	applyConstraints(e, t, n) {
		if (!n) {
			let n = Math.max(this.minSize.width, e), r = Math.max(this.minSize.height, t);
			return this.maxSize?.width && (n = Math.min(this.maxSize.width, n)), this.maxSize?.height && (r = Math.min(this.maxSize.height, r)), {
				width: n,
				height: r
			};
		}
		let r = e, i = t;
		return r < this.minSize.width && (r = this.minSize.width, i = r / this.aspectRatio), i < this.minSize.height && (i = this.minSize.height, r = i * this.aspectRatio), this.maxSize?.width && r > this.maxSize.width && (r = this.maxSize.width, i = r / this.aspectRatio), this.maxSize?.height && i > this.maxSize.height && (i = this.maxSize.height, r = i * this.aspectRatio), {
			width: r,
			height: i
		};
	}
	applyAspectRatio(e, t, n) {
		return n === "left" || n === "right" ? {
			width: e,
			height: e / this.aspectRatio
		} : n === "top" || n === "bottom" ? {
			width: t * this.aspectRatio,
			height: t
		} : {
			width: e,
			height: e / this.aspectRatio
		};
	}
}, rf = class e extends Od {
	constructor() {
		super(...arguments), this.type = "node";
	}
	static create(t = {}) {
		let n = typeof t == "function" ? t() : t;
		return new e(n);
	}
	configure(e) {
		return super.configure(e);
	}
	extend(e) {
		let t = typeof e == "function" ? e() : e;
		return super.extend(t);
	}
};
function af(e) {
	return new Ad({
		find: e.find,
		handler: ({ state: t, range: n, match: r, pasteEvent: i }) => {
			let a = j(e.getAttributes, void 0, r, i);
			if (a === !1 || a === null) return null;
			let { tr: o } = t, s = r[r.length - 1], c = r[0], l = n.to;
			if (s) {
				let i = c.search(/\S/), u = n.from + c.indexOf(s), d = u + s.length;
				if (du(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > u).length) return null;
				d < n.to && o.delete(d, n.to), u > n.from && o.delete(n.from + i, u), l = n.from + i + s.length, o.addMark(n.from + i, l, e.type.create(a || {})), r.index !== void 0 && r.input !== void 0 && r.index + r[0].length >= r.input.length || o.removeStoredMark(e.type);
			}
		}
	});
}
var of = (e, t) => {
	if (e === "slot") return 0;
	if (e instanceof Function) return e(t);
	let { children: n, ...r } = t ?? {};
	if (e === "svg") throw Error("SVG elements are not supported in the JSX syntax, use the array syntax instead");
	return [
		e,
		r,
		n
	];
}, sf = (e, t) => {
	let { state: n, view: r } = e, { selection: i } = n;
	if (!i.empty) return !1;
	let { $from: a } = i;
	if (a.parentOffset !== 0) return !1;
	let o = a.depth - 1;
	if (o < 0) return !1;
	let s = a.node(o), c = a.index(o);
	if (c === 0) return !1;
	if (s.type === t) return e.commands.lift(t.name);
	let l = s.child(c - 1);
	if (l.type !== t || !l.lastChild?.isTextblock) return !1;
	let u = a.before(), d = u - 1 - 1, { tr: f } = n;
	return f.delete(u, a.after()).insert(d, a.parent.content), f.setSelection(w.create(f.doc, d)), r.dispatch(f.scrollIntoView()), !0;
}, cf = /^\s*>\s$/, lf = rf.create({
	name: "blockquote",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	content: "block+",
	group: "block",
	defining: !0,
	parseHTML() {
		return [{ tag: "blockquote" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return /* @__PURE__ */ of("blockquote", {
			...M(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ of("slot", {})
		});
	},
	parseMarkdown: (e, t) => {
		let n = t.parseBlockChildren ?? t.parseChildren;
		return t.createNode("blockquote", void 0, n(e.tokens || []));
	},
	renderMarkdown: (e, t) => {
		if (!e.content) return "";
		let n = [];
		return e.content.forEach((e, r) => {
			let i = (t.renderChild?.call(t, e, r) ?? t.renderChildren([e])).split("\n").map((e) => e.trim() === "" ? ">" : `> ${e}`);
			n.push(i.join("\n"));
		}), n.join("\n>\n");
	},
	addCommands() {
		return {
			setBlockquote: () => ({ commands: e }) => e.wrapIn(this.name),
			toggleBlockquote: () => ({ commands: e }) => e.toggleWrap(this.name),
			unsetBlockquote: () => ({ commands: e }) => e.lift(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
			Backspace: () => sf(this.editor, this.type)
		};
	},
	addInputRules() {
		return [ef({
			find: cf,
			type: this.type
		})];
	}
}), uf = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, df = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, ff = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, pf = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, mf = kd.create({
	name: "bold",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "strong" },
			{
				tag: "b",
				getAttrs: (e) => e.style.fontWeight !== "normal" && null
			},
			{
				style: "font-weight=400",
				clearMark: (e) => e.type.name === this.name
			},
			{
				style: "font-weight",
				getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null
			}
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return /* @__PURE__ */ of("strong", {
			...M(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ of("slot", {})
		});
	},
	markdownTokenName: "strong",
	parseMarkdown: (e, t) => t.applyMark("bold", t.parseInline(e.tokens || [])),
	markdownOptions: { htmlReopen: {
		open: "<strong>",
		close: "</strong>"
	} },
	renderMarkdown: (e, t) => `**${t.renderChildren(e)}**`,
	addCommands() {
		return {
			setBold: () => ({ commands: e }) => e.setMark(this.name),
			toggleBold: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetBold: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-b": () => this.editor.commands.toggleBold(),
			"Mod-B": () => this.editor.commands.toggleBold()
		};
	},
	addInputRules() {
		return [Zd({
			find: uf,
			type: this.type
		}), Zd({
			find: ff,
			type: this.type
		})];
	},
	addPasteRules() {
		return [af({
			find: df,
			type: this.type
		}), af({
			find: pf,
			type: this.type
		})];
	}
}), hf = (e) => {
	let t = /`([^`]+)`(?!`)$/.exec(e);
	return !t || t.index > 0 && e[t.index - 1] === "`" ? null : {
		index: t.index,
		text: t[0],
		replaceWith: t[1]
	};
}, gf = (e) => {
	let t = /`([^`]+)`(?!`)/g, n = [], r;
	for (; (r = t.exec(e)) !== null;) r.index > 0 && e[r.index - 1] === "`" || n.push({
		index: r.index,
		text: r[0],
		replaceWith: r[1]
	});
	return n;
}, _f = kd.create({
	name: "code",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	excludes: "_",
	code: !0,
	exitable: !0,
	parseHTML() {
		return [{ tag: "code" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"code",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "codespan",
	parseMarkdown: (e, t) => t.applyMark("code", [{
		type: "text",
		text: e.text || ""
	}]),
	renderMarkdown: (e, t) => e.content ? `\`${t.renderChildren(e.content)}\`` : "",
	addCommands() {
		return {
			setCode: () => ({ commands: e }) => e.setMark(this.name),
			toggleCode: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetCode: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return { "Mod-e": () => this.editor.commands.toggleCode() };
	},
	addInputRules() {
		return [Zd({
			find: hf,
			type: this.type
		})];
	},
	addPasteRules() {
		return [af({
			find: gf,
			type: this.type
		})];
	}
}), vf = 4, yf = /^```([a-z]+)?[\s\n]$/, bf = /^~~~([a-z]+)?[\s\n]$/, xf = rf.create({
	name: "codeBlock",
	addOptions() {
		return {
			languageClassPrefix: "language-",
			exitOnTripleEnter: !0,
			exitOnArrowDown: !0,
			exitOnArrowUp: !0,
			defaultLanguage: null,
			enableTabIndentation: !1,
			tabSize: vf,
			HTMLAttributes: {}
		};
	},
	content: "text*",
	marks: "",
	group: "block",
	code: !0,
	defining: !0,
	addAttributes() {
		return { language: {
			default: this.options.defaultLanguage,
			parseHTML: (e) => {
				let { languageClassPrefix: t } = this.options;
				return t && [...e.firstElementChild?.classList || []].filter((e) => e.startsWith(t)).map((e) => e.replace(t, ""))[0] || null;
			},
			rendered: !1
		} };
	},
	parseHTML() {
		return [{
			tag: "pre",
			preserveWhitespace: "full"
		}];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			"pre",
			M(this.options.HTMLAttributes, t),
			[
				"code",
				{ class: e.attrs.language ? this.options.languageClassPrefix + e.attrs.language : null },
				0
			]
		];
	},
	markdownTokenName: "code",
	parseMarkdown: (e, t) => e.raw?.startsWith("```") === !1 && e.raw?.startsWith("~~~") === !1 && e.codeBlockStyle !== "indented" ? [] : t.createNode("codeBlock", { language: e.lang || null }, e.text ? [t.createTextNode(e.text)] : []),
	renderMarkdown: (e, t) => {
		let n = "", r = e.attrs?.language || "";
		return n = e.content ? [
			`\`\`\`${r}`,
			t.renderChildren(e.content),
			"```"
		].join("\n") : `\`\`\`${r}

\`\`\``, n;
	},
	addCommands() {
		return {
			setCodeBlock: (e) => ({ commands: t }) => t.setNode(this.name, e),
			toggleCodeBlock: (e) => ({ commands: t }) => t.toggleNode(this.name, "paragraph", e)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
			Backspace: () => {
				let { empty: e, $anchor: t } = this.editor.state.selection, n = t.pos === 1;
				return !e || t.parent.type.name !== this.name ? !1 : n || !t.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
			},
			Tab: ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? vf, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				if (i.parent.type !== this.type) return !1;
				let o = " ".repeat(t);
				return a ? e.commands.insertContent(o) : e.commands.command(({ tr: e }) => {
					let { from: t, to: i } = r, a = n.doc.textBetween(t, i, "\n", "\n").split("\n").map((e) => o + e).join("\n");
					return e.replaceWith(t, i, n.schema.text(a)), !0;
				});
			},
			"Shift-Tab": ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? vf, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				return i.parent.type === this.type ? a ? e.commands.command(({ tr: e }) => {
					let { pos: r } = i, a = i.start(), o = i.end(), s = n.doc.textBetween(a, o, "\n", "\n").split("\n"), c = 0, l = 0, u = r - a;
					for (let e = 0; e < s.length; e += 1) {
						if (l + s[e].length >= u) {
							c = e;
							break;
						}
						l += s[e].length + 1;
					}
					let d = s[c].match(/^ */)?.[0] || "", f = Math.min(d.length, t);
					if (f === 0) return !0;
					let p = a;
					for (let e = 0; e < c; e += 1) p += s[e].length + 1;
					return e.delete(p, p + f), r - p <= f && e.setSelection(w.create(e.doc, p)), !0;
				}) : e.commands.command(({ tr: e }) => {
					let { from: i, to: a } = r, o = n.doc.textBetween(i, a, "\n", "\n").split("\n").map((e) => {
						let n = e.match(/^ */)?.[0] || "", r = Math.min(n.length, t);
						return e.slice(r);
					}).join("\n");
					return e.replaceWith(i, a, n.schema.text(o)), !0;
				}) : !1;
			},
			Enter: ({ editor: e }) => {
				if (!this.options.exitOnTripleEnter) return !1;
				let { state: t } = e, { selection: n } = t, { $from: r, empty: i } = n;
				if (!i || r.parent.type !== this.type) return !1;
				let a = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith("\n\n");
				return !a || !o ? !1 : e.chain().command(({ tr: e }) => (e.delete(r.pos - 2, r.pos), !0)).exitCode().run();
			},
			ArrowUp: ({ editor: e }) => {
				if (!this.options.exitOnArrowUp) return !1;
				let { state: t } = e, { selection: n } = t, { $from: r, empty: i } = n;
				if (!i || r.parent.type !== this.type || r.parentOffset !== 0) return !1;
				let a = r.before();
				return a > 0 ? !1 : e.commands.insertDefaultBlock({ pos: a });
			},
			ArrowDown: ({ editor: e }) => {
				if (!this.options.exitOnArrowDown) return !1;
				let { state: t } = e, { selection: n, doc: r } = t, { $from: i, empty: a } = n;
				if (!a || i.parent.type !== this.type || i.parentOffset !== i.parent.nodeSize - 2) return !1;
				let o = i.after();
				return o === void 0 ? !1 : r.nodeAt(o) ? e.commands.command(({ tr: e }) => (e.setSelection(C.near(r.resolve(o))), !0)) : e.commands.exitCode();
			}
		};
	},
	addInputRules() {
		return [$d({
			find: yf,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		}), $d({
			find: bf,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		})];
	},
	addProseMirrorPlugins() {
		return [new E({
			key: new D("codeBlockVSCodeHandler"),
			props: { handlePaste: (e, t) => {
				if (!t.clipboardData || this.editor.isActive(this.type.name)) return !1;
				let n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), i = (r ? JSON.parse(r) : void 0)?.mode;
				if (!n || !i) return !1;
				let { tr: a, schema: o } = e.state, s = o.text(n.replace(/\r\n?/g, "\n"));
				return a.replaceSelectionWith(this.type.create({ language: i }, s)), a.selection.$from.parent.type !== this.type && a.setSelection(w.near(a.doc.resolve(Math.max(0, a.selection.from - 2)))), a.setMeta("paste", !0), e.dispatch(a), !0;
			} }
		})];
	}
}), Sf = rf.create({
	name: "doc",
	topNode: !0,
	content: "block+",
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n\n") : ""
}), Cf = rf.create({
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
	renderHTML({ HTMLAttributes: e }) {
		return ["br", M(this.options.HTMLAttributes, e)];
	},
	renderText() {
		return "\n";
	},
	renderMarkdown: () => "  \n",
	parseMarkdown: () => ({ type: "hardBreak" }),
	addCommands() {
		return { setHardBreak: () => ({ commands: e, chain: t, state: n, editor: r }) => e.first([() => e.exitCode(), () => e.command(() => {
			let { selection: e, storedMarks: i } = n;
			if (e.$from.parent.type.spec.isolating) return !1;
			let { keepMarks: a } = this.options, { splittableMarks: o } = r.extensionManager, s = i || e.$to.parentOffset && e.$from.marks();
			return t().insertContent({ type: this.name }).command(({ tr: e, dispatch: t }) => {
				if (t && s && a) {
					let t = s.filter((e) => o.includes(e.type.name));
					e.ensureMarks(t);
				}
				return !0;
			}).scrollIntoView().run();
		})]) };
	},
	addKeyboardShortcuts() {
		return {
			"Mod-Enter": () => this.editor.commands.setHardBreak(),
			"Shift-Enter": () => this.editor.commands.setHardBreak()
		};
	}
}), wf = rf.create({
	name: "heading",
	addOptions() {
		return {
			levels: [
				1,
				2,
				3,
				4,
				5,
				6
			],
			HTMLAttributes: {}
		};
	},
	content: "inline*",
	group: "block",
	defining: !0,
	addAttributes() {
		return { level: {
			default: 1,
			rendered: !1
		} };
	},
	parseHTML() {
		return this.options.levels.map((e) => ({
			tag: `h${e}`,
			attrs: { level: e }
		}));
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			`h${this.options.levels.includes(e.attrs.level) ? e.attrs.level : this.options.levels[0]}`,
			M(this.options.HTMLAttributes, t),
			0
		];
	},
	parseMarkdown: (e, t) => t.createNode("heading", { level: e.depth || 1 }, t.parseInline(e.tokens || [])),
	renderMarkdown: (e, t) => {
		let n = e.attrs?.level ? parseInt(e.attrs.level, 10) : 1, r = "#".repeat(n);
		return e.content ? `${r} ${t.renderChildren(e.content)}` : "";
	},
	addCommands() {
		return {
			setHeading: (e) => ({ commands: t }) => this.options.levels.includes(e.level) ? t.setNode(this.name, e) : !1,
			toggleHeading: (e) => ({ commands: t }) => this.options.levels.includes(e.level) ? t.toggleNode(this.name, "paragraph", e) : !1
		};
	},
	addKeyboardShortcuts() {
		return this.options.levels.reduce((e, t) => ({
			...e,
			[`Mod-Alt-${t}`]: () => this.editor.commands.toggleHeading({ level: t })
		}), {});
	},
	addInputRules() {
		return this.options.levels.map((e) => $d({
			find: RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),
			type: this.type,
			getAttributes: { level: e }
		}));
	}
}), Tf = rf.create({
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
	renderHTML({ HTMLAttributes: e }) {
		return ["hr", M(this.options.HTMLAttributes, e)];
	},
	markdownTokenName: "hr",
	parseMarkdown: (e, t) => t.createNode("horizontalRule"),
	renderMarkdown: () => "---",
	addCommands() {
		return { setHorizontalRule: () => ({ chain: e, state: t }) => {
			if (!rd(t, t.schema.nodes[this.name])) return !1;
			let { selection: n } = t, { $to: r } = n, i = e();
			return Cu(n) ? i.insertContentAt(r.pos, { type: this.name }) : i.insertContent({ type: this.name }), i.command(({ state: e, tr: t, dispatch: n }) => {
				if (n) {
					let { $to: n } = t.selection, r = n.end();
					if (n.nodeAfter) n.nodeAfter.isTextblock ? t.setSelection(w.create(t.doc, n.pos + 1)) : n.nodeAfter.isBlock ? t.setSelection(T.create(t.doc, n.pos)) : t.setSelection(w.create(t.doc, n.pos));
					else {
						let i = (e.schema.nodes[this.options.nextNodeType] || n.parent.type.contentMatch.defaultType)?.create();
						i && (t.insert(r, i), t.setSelection(w.create(t.doc, r + 1)));
					}
					t.scrollIntoView();
				}
				return !0;
			}).run();
		} };
	},
	addInputRules() {
		return [Qd({
			find: /^(?:---|—-|___\s|\*\*\*\s)$/,
			type: this.type
		})];
	}
}), Ef = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, Df = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, Of = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, kf = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, Af = kd.create({
	name: "italic",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "em" },
			{
				tag: "i",
				getAttrs: (e) => e.style.fontStyle !== "normal" && null
			},
			{
				style: "font-style=normal",
				clearMark: (e) => e.type.name === this.name
			},
			{ style: "font-style=italic" }
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"em",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	addCommands() {
		return {
			setItalic: () => ({ commands: e }) => e.setMark(this.name),
			toggleItalic: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetItalic: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	markdownTokenName: "em",
	parseMarkdown: (e, t) => t.applyMark("italic", t.parseInline(e.tokens || [])),
	markdownOptions: { htmlReopen: {
		open: "<em>",
		close: "</em>"
	} },
	renderMarkdown: (e, t) => `*${t.renderChildren(e)}*`,
	addKeyboardShortcuts() {
		return {
			"Mod-i": () => this.editor.commands.toggleItalic(),
			"Mod-I": () => this.editor.commands.toggleItalic()
		};
	},
	addInputRules() {
		return [Zd({
			find: Ef,
			type: this.type
		}), Zd({
			find: Of,
			type: this.type
		})];
	},
	addPasteRules() {
		return [af({
			find: Df,
			type: this.type
		}), af({
			find: kf,
			type: this.type
		})];
	}
}), jf = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", Mf = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Nf = "numeric", Pf = "ascii", Ff = "alpha", If = "asciinumeric", Lf = "alphanumeric", Rf = "domain", zf = "emoji", Bf = "scheme", Vf = "slashscheme", Hf = "whitespace";
function Uf(e, t) {
	return e in t || (t[e] = []), t[e];
}
function Wf(e, t, n) {
	t[Nf] && (t[If] = !0, t[Lf] = !0), t[Pf] && (t[If] = !0, t[Ff] = !0), t[If] && (t[Lf] = !0), t[Ff] && (t[Lf] = !0), t[Lf] && (t[Rf] = !0), t[zf] && (t[Rf] = !0);
	for (let r in t) {
		let t = Uf(r, n);
		t.indexOf(e) < 0 && t.push(e);
	}
}
function Gf(e, t) {
	let n = {};
	for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
	return n;
}
function Kf(e = null) {
	this.j = {}, this.jr = [], this.jd = null, this.t = e;
}
Kf.groups = {}, Kf.prototype = {
	accepts() {
		return !!this.t;
	},
	go(e) {
		let t = this, n = t.j[e];
		if (n) return n;
		for (let n = 0; n < t.jr.length; n++) {
			let r = t.jr[n][0], i = t.jr[n][1];
			if (i && r.test(e)) return i;
		}
		return t.jd;
	},
	has(e, t = !1) {
		return t ? e in this.j : !!this.go(e);
	},
	ta(e, t, n, r) {
		for (let i = 0; i < e.length; i++) this.tt(e[i], t, n, r);
	},
	tr(e, t, n, r) {
		r ||= Kf.groups;
		let i;
		return t && t.j ? i = t : (i = new Kf(t), n && r && Wf(t, n, r)), this.jr.push([e, i]), i;
	},
	ts(e, t, n, r) {
		let i = this, a = e.length;
		if (!a) return i;
		for (let t = 0; t < a - 1; t++) i = i.tt(e[t]);
		return i.tt(e[a - 1], t, n, r);
	},
	tt(e, t, n, r) {
		r ||= Kf.groups;
		let i = this;
		if (t && t.j) return i.j[e] = t, t;
		let a = t, o, s = i.go(e);
		return s ? (o = new Kf(), Object.assign(o.j, s.j), o.jr.push.apply(o.jr, s.jr), o.jd = s.jd, o.t = s.t) : o = new Kf(), a && (r && (o.t && typeof o.t == "string" ? Wf(a, Object.assign(Gf(o.t, r), n), r) : n && Wf(a, n, r)), o.t = a), i.j[e] = o, o;
	}
};
var P = (e, t, n, r, i) => e.ta(t, n, r, i), F = (e, t, n, r, i) => e.tr(t, n, r, i), qf = (e, t, n, r, i) => e.ts(t, n, r, i), I = (e, t, n, r, i) => e.tt(t, n, r, i), Jf = "WORD", Yf = "UWORD", Xf = "ASCIINUMERICAL", Zf = "ALPHANUMERICAL", Qf = "LOCALHOST", $f = "TLD", ep = "UTLD", tp = "SCHEME", np = "SLASH_SCHEME", rp = "NUM", ip = "WS", ap = "NL", op = "OPENBRACE", sp = "CLOSEBRACE", cp = "OPENBRACKET", lp = "CLOSEBRACKET", up = "OPENPAREN", dp = "CLOSEPAREN", fp = "OPENANGLEBRACKET", pp = "CLOSEANGLEBRACKET", mp = "FULLWIDTHLEFTPAREN", hp = "FULLWIDTHRIGHTPAREN", gp = "LEFTCORNERBRACKET", _p = "RIGHTCORNERBRACKET", vp = "LEFTWHITECORNERBRACKET", yp = "RIGHTWHITECORNERBRACKET", bp = "FULLWIDTHLESSTHAN", xp = "FULLWIDTHGREATERTHAN", Sp = "AMPERSAND", Cp = "APOSTROPHE", wp = "ASTERISK", Tp = "AT", Ep = "BACKSLASH", Dp = "BACKTICK", Op = "CARET", kp = "COLON", Ap = "COMMA", jp = "DOLLAR", Mp = "DOT", Np = "EQUALS", Pp = "EXCLAMATION", Fp = "HYPHEN", Ip = "PERCENT", Lp = "PIPE", Rp = "PLUS", zp = "POUND", Bp = "QUERY", Vp = "QUOTE", Hp = "FULLWIDTHMIDDLEDOT", Up = "SEMI", Wp = "SLASH", Gp = "TILDE", Kp = "UNDERSCORE", qp = "EMOJI", Jp = "SYM", Yp = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ALPHANUMERICAL: Zf,
	AMPERSAND: Sp,
	APOSTROPHE: Cp,
	ASCIINUMERICAL: Xf,
	ASTERISK: wp,
	AT: Tp,
	BACKSLASH: Ep,
	BACKTICK: Dp,
	CARET: Op,
	CLOSEANGLEBRACKET: pp,
	CLOSEBRACE: sp,
	CLOSEBRACKET: lp,
	CLOSEPAREN: dp,
	COLON: kp,
	COMMA: Ap,
	DOLLAR: jp,
	DOT: Mp,
	EMOJI: qp,
	EQUALS: Np,
	EXCLAMATION: Pp,
	FULLWIDTHGREATERTHAN: xp,
	FULLWIDTHLEFTPAREN: mp,
	FULLWIDTHLESSTHAN: bp,
	FULLWIDTHMIDDLEDOT: Hp,
	FULLWIDTHRIGHTPAREN: hp,
	HYPHEN: Fp,
	LEFTCORNERBRACKET: gp,
	LEFTWHITECORNERBRACKET: vp,
	LOCALHOST: Qf,
	NL: ap,
	NUM: rp,
	OPENANGLEBRACKET: fp,
	OPENBRACE: op,
	OPENBRACKET: cp,
	OPENPAREN: up,
	PERCENT: Ip,
	PIPE: Lp,
	PLUS: Rp,
	POUND: zp,
	QUERY: Bp,
	QUOTE: Vp,
	RIGHTCORNERBRACKET: _p,
	RIGHTWHITECORNERBRACKET: yp,
	SCHEME: tp,
	SEMI: Up,
	SLASH: Wp,
	SLASH_SCHEME: np,
	SYM: Jp,
	TILDE: Gp,
	TLD: $f,
	UNDERSCORE: Kp,
	UTLD: ep,
	UWORD: Yf,
	WORD: Jf,
	WS: ip
}), Xp = /[a-z]/, Zp = /\p{L}/u, Qp = /\p{Emoji}/u, $p = /\d/, em = /\s/, tm = "\r", nm = "\n", rm = "️", im = "‍", am = "￼", om = null, sm = null;
function cm(e = []) {
	let t = {};
	Kf.groups = t;
	let n = new Kf();
	om ??= fm(jf), sm ??= fm(Mf), I(n, "'", Cp), I(n, "{", op), I(n, "}", sp), I(n, "[", cp), I(n, "]", lp), I(n, "(", up), I(n, ")", dp), I(n, "<", fp), I(n, ">", pp), I(n, "（", mp), I(n, "）", hp), I(n, "「", gp), I(n, "」", _p), I(n, "『", vp), I(n, "』", yp), I(n, "＜", bp), I(n, "＞", xp), I(n, "&", Sp), I(n, "*", wp), I(n, "@", Tp), I(n, "`", Dp), I(n, "^", Op), I(n, ":", kp), I(n, ",", Ap), I(n, "$", jp), I(n, ".", Mp), I(n, "=", Np), I(n, "!", Pp), I(n, "-", Fp), I(n, "%", Ip), I(n, "|", Lp), I(n, "+", Rp), I(n, "#", zp), I(n, "?", Bp), I(n, "\"", Vp), I(n, "/", Wp), I(n, ";", Up), I(n, "~", Gp), I(n, "_", Kp), I(n, "\\", Ep), I(n, "・", Hp);
	let r = F(n, $p, rp, { [Nf]: !0 });
	F(r, $p, r);
	let i = F(r, Xp, Xf, { [If]: !0 }), a = F(r, Zp, Zf, { [Lf]: !0 }), o = F(n, Xp, Jf, { [Pf]: !0 });
	F(o, $p, i), F(o, Xp, o), F(i, $p, i), F(i, Xp, i);
	let s = F(n, Zp, Yf, { [Ff]: !0 });
	F(s, Xp), F(s, $p, a), F(s, Zp, s), F(a, $p, a), F(a, Xp), F(a, Zp, a);
	let c = I(n, nm, ap, { [Hf]: !0 }), l = I(n, tm, ip, { [Hf]: !0 }), u = F(n, em, ip, { [Hf]: !0 });
	I(n, am, u), I(l, nm, c), I(l, am, u), F(l, em, u), I(u, tm), I(u, nm), F(u, em, u), I(u, am, u);
	let d = F(n, Qp, qp, { [zf]: !0 });
	I(d, "#"), F(d, Qp, d), I(d, rm, d);
	let f = I(d, im);
	I(f, "#"), F(f, Qp, d);
	let p = [[Xp, o], [$p, i]], m = [
		[Xp, null],
		[Zp, s],
		[$p, a]
	];
	for (let e = 0; e < om.length; e++) dm(n, om[e], $f, Jf, p);
	for (let e = 0; e < sm.length; e++) dm(n, sm[e], ep, Yf, m);
	Wf($f, {
		tld: !0,
		ascii: !0
	}, t), Wf(ep, {
		utld: !0,
		alpha: !0
	}, t), dm(n, "file", tp, Jf, p), dm(n, "mailto", tp, Jf, p), dm(n, "http", np, Jf, p), dm(n, "https", np, Jf, p), dm(n, "ftp", np, Jf, p), dm(n, "ftps", np, Jf, p), Wf(tp, {
		scheme: !0,
		ascii: !0
	}, t), Wf(np, {
		slashscheme: !0,
		ascii: !0
	}, t), e = e.sort((e, t) => e[0] > t[0] ? 1 : -1);
	for (let t = 0; t < e.length; t++) {
		let r = e[t][0], i = e[t][1] ? { [Bf]: !0 } : { [Vf]: !0 };
		r.indexOf("-") >= 0 ? i[Rf] = !0 : Xp.test(r) ? $p.test(r) ? i[If] = !0 : i[Pf] = !0 : i[Nf] = !0, qf(n, r, r, i);
	}
	return qf(n, "localhost", Qf, { ascii: !0 }), n.jd = new Kf(Jp), {
		start: n,
		tokens: Object.assign({ groups: t }, Yp)
	};
}
function lm(e, t) {
	let n = um(t.replace(/[A-Z]/g, (e) => e.toLowerCase())), r = n.length, i = [], a = 0, o = 0;
	for (; o < r;) {
		let s = e, c = null, l = 0, u = null, d = -1, f = -1;
		for (; o < r && (c = s.go(n[o]));) s = c, s.accepts() ? (d = 0, f = 0, u = s) : d >= 0 && (d += n[o].length, f++), l += n[o].length, a += n[o].length, o++;
		a -= d, o -= f, l -= d, i.push({
			t: u.t,
			v: t.slice(a - l, a),
			s: a - l,
			e: a
		});
	}
	return i;
}
function um(e) {
	let t = [], n = e.length, r = 0;
	for (; r < n;) {
		let i = e.charCodeAt(r), a, o = i < 55296 || i > 56319 || r + 1 === n || (a = e.charCodeAt(r + 1)) < 56320 || a > 57343 ? e[r] : e.slice(r, r + 2);
		t.push(o), r += o.length;
	}
	return t;
}
function dm(e, t, n, r, i) {
	let a, o = t.length;
	for (let n = 0; n < o - 1; n++) {
		let o = t[n];
		e.j[o] ? a = e.j[o] : (a = new Kf(r), a.jr = i.slice(), e.j[o] = a), e = a;
	}
	return a = new Kf(n), a.jr = i.slice(), e.j[t[o - 1]] = a, a;
}
function fm(e) {
	let t = [], n = [], r = 0;
	for (; r < e.length;) {
		let i = 0;
		for (; "0123456789".indexOf(e[r + i]) >= 0;) i++;
		if (i > 0) {
			t.push(n.join(""));
			for (let t = parseInt(e.substring(r, r + i), 10); t > 0; t--) n.pop();
			r += i;
		} else n.push(e[r]), r++;
	}
	return t;
}
var pm = {
	defaultProtocol: "http",
	events: null,
	format: hm,
	formatHref: hm,
	nl2br: !1,
	tagName: "a",
	target: null,
	rel: null,
	validate: !0,
	truncate: Infinity,
	className: null,
	attributes: null,
	ignoreTags: [],
	render: null
};
function mm(e, t = null) {
	let n = Object.assign({}, pm);
	e && (n = Object.assign(n, e instanceof mm ? e.o : e));
	let r = n.ignoreTags, i = [];
	for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
	this.o = n, t && (this.defaultRender = t), this.ignoreTags = i;
}
mm.prototype = {
	o: pm,
	ignoreTags: [],
	defaultRender(e) {
		return e;
	},
	check(e) {
		return this.get("validate", e.toString(), e);
	},
	get(e, t, n) {
		let r = t != null, i = this.o[e];
		return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : pm[e], typeof i == "function" && r && (i = i(t, n))) : typeof i == "function" && r && (i = i(t, n.t, n)), i);
	},
	getObj(e, t, n) {
		let r = this.o[e];
		return typeof r == "function" && t != null && (r = r(t, n.t, n)), r;
	},
	render(e) {
		let t = e.render(this);
		return (this.get("render", null, e) || this.defaultRender)(t, e.t, e);
	}
};
function hm(e) {
	return e;
}
function gm(e, t) {
	this.t = "token", this.v = e, this.tk = t;
}
gm.prototype = {
	isLink: !1,
	toString() {
		return this.v;
	},
	toHref(e) {
		return this.toString();
	},
	toFormattedString(e) {
		let t = this.toString(), n = e.get("truncate", t, this), r = e.get("format", t, this);
		return n && r.length > n ? r.substring(0, n) + "…" : r;
	},
	toFormattedHref(e) {
		return e.get("formatHref", this.toHref(e.get("defaultProtocol")), this);
	},
	startIndex() {
		return this.tk[0].s;
	},
	endIndex() {
		return this.tk[this.tk.length - 1].e;
	},
	toObject(e = pm.defaultProtocol) {
		return {
			type: this.t,
			value: this.toString(),
			isLink: this.isLink,
			href: this.toHref(e),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},
	toFormattedObject(e) {
		return {
			type: this.t,
			value: this.toFormattedString(e),
			isLink: this.isLink,
			href: this.toFormattedHref(e),
			start: this.startIndex(),
			end: this.endIndex()
		};
	},
	validate(e) {
		return e.get("validate", this.toString(), this);
	},
	render(e) {
		let t = this, n = this.toHref(e.get("defaultProtocol")), r = e.get("formatHref", n, this), i = e.get("tagName", n, t), a = this.toFormattedString(e), o = {}, s = e.get("className", n, t), c = e.get("target", n, t), l = e.get("rel", n, t), u = e.getObj("attributes", n, t), d = e.getObj("events", n, t);
		return o.href = r, s && (o.class = s), c && (o.target = c), l && (o.rel = l), u && Object.assign(o, u), {
			tagName: i,
			attributes: o,
			content: a,
			eventListeners: d
		};
	}
};
function _m(e, t) {
	class n extends gm {
		constructor(t, n) {
			super(t, n), this.t = e;
		}
	}
	for (let e in t) n.prototype[e] = t[e];
	return n.t = e, n;
}
var vm = _m("email", {
	isLink: !0,
	toHref() {
		return "mailto:" + this.toString();
	}
}), ym = _m("text"), bm = _m("nl"), xm = _m("url", {
	isLink: !0,
	toHref(e = pm.defaultProtocol) {
		return this.hasProtocol() ? this.v : `${e}://${this.v}`;
	},
	hasProtocol() {
		let e = this.tk;
		return e.length >= 2 && e[0].t !== Qf && e[1].t === kp;
	}
}), Sm = (e) => new Kf(e);
function Cm({ groups: e }) {
	let t = e.domain.concat([
		Sp,
		wp,
		Tp,
		Ep,
		Dp,
		Op,
		jp,
		Np,
		Fp,
		rp,
		Ip,
		Lp,
		Rp,
		zp,
		Wp,
		Jp,
		Gp,
		Kp
	]), n = [
		Cp,
		kp,
		Ap,
		Mp,
		Pp,
		Ip,
		Bp,
		Vp,
		Up,
		fp,
		pp,
		op,
		sp,
		lp,
		cp,
		up,
		dp,
		mp,
		hp,
		gp,
		_p,
		vp,
		yp,
		bp,
		xp
	], r = [
		Sp,
		Cp,
		wp,
		Ep,
		Dp,
		Op,
		jp,
		Np,
		Fp,
		op,
		sp,
		Ip,
		Lp,
		Rp,
		zp,
		Bp,
		Wp,
		Jp,
		Gp,
		Kp
	], i = Sm(), a = I(i, Gp);
	P(a, r, a), P(a, e.domain, a);
	let o = Sm(), s = Sm(), c = Sm();
	P(i, e.domain, o), P(i, e.scheme, s), P(i, e.slashscheme, c), P(o, r, a), P(o, e.domain, o);
	let l = I(o, Tp);
	I(a, Tp, l), I(s, Tp, l), I(c, Tp, l);
	let u = I(a, Mp);
	P(u, r, a), P(u, e.domain, a);
	let d = Sm();
	P(l, e.domain, d), P(d, e.domain, d);
	let f = I(d, Mp);
	P(f, e.domain, d);
	let p = Sm(vm);
	P(f, e.tld, p), P(f, e.utld, p), I(l, Qf, p);
	let m = I(d, Fp);
	I(m, Fp, m), P(m, e.domain, d), P(p, e.domain, d), I(p, Mp, f), I(p, Fp, m);
	let h = I(o, Fp), g = I(o, Mp);
	I(h, Fp, h), P(h, e.domain, o), P(g, r, a), P(g, e.domain, o);
	let _ = Sm(xm);
	P(g, e.tld, _), P(g, e.utld, _), P(_, e.domain, o), P(_, r, a), I(_, Mp, g), I(_, Fp, h), I(_, Tp, l);
	let v = I(_, kp), y = Sm(xm);
	P(v, e.numeric, y);
	let b = Sm(xm), x = Sm();
	P(b, t, b), P(b, n, x), P(x, t, b), P(x, n, x), I(_, Wp, b), I(y, Wp, b);
	let S = I(s, kp), ee = I(I(I(c, kp), Wp), Wp);
	P(s, e.domain, o), I(s, Mp, g), I(s, Fp, h), P(c, e.domain, o), I(c, Mp, g), I(c, Fp, h), P(S, e.domain, b), I(S, Wp, b), I(S, Bp, b), P(ee, e.domain, b), P(ee, t, b), I(ee, Wp, b);
	let te = [
		[op, sp],
		[cp, lp],
		[up, dp],
		[fp, pp],
		[mp, hp],
		[gp, _p],
		[vp, yp],
		[bp, xp]
	];
	for (let e = 0; e < te.length; e++) {
		let [r, i] = te[e], a = I(b, r);
		I(x, r, a);
		let o = Sm(xm);
		P(a, t, o);
		let s = Sm();
		P(a, n, s), I(a, i, b), P(o, t, o), P(o, n, s), P(s, t, o), P(s, n, s), I(o, i, b), I(s, i, b);
	}
	return I(i, Qf, _), I(i, ap, bm), {
		start: i,
		tokens: Yp
	};
}
function wm(e, t, n) {
	let r = n.length, i = 0, a = [], o = [];
	for (; i < r;) {
		let s = e, c = null, l = null, u = 0, d = null, f = -1;
		for (; i < r && !(c = s.go(n[i].t));) o.push(n[i++]);
		for (; i < r && (l = c || s.go(n[i].t));) c = null, s = l, s.accepts() ? (f = 0, d = s) : f >= 0 && f++, i++, u++;
		if (f < 0) i -= u, i < r && (o.push(n[i]), i++);
		else {
			o.length > 0 && (a.push(Tm(ym, t, o)), o = []), i -= f, u -= f;
			let e = d.t, r = n.slice(i - u, i);
			a.push(Tm(e, t, r));
		}
	}
	return o.length > 0 && a.push(Tm(ym, t, o)), a;
}
function Tm(e, t, n) {
	let r = n[0].s, i = n[n.length - 1].e;
	return new e(t.slice(r, i), n);
}
var Em = typeof console < "u" && console && console.warn || (() => {}), Dm = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", L = {
	scanner: null,
	parser: null,
	tokenQueue: [],
	pluginQueue: [],
	customSchemes: [],
	initialized: !1
};
function Om() {
	return Kf.groups = {}, L.scanner = null, L.parser = null, L.tokenQueue = [], L.pluginQueue = [], L.customSchemes = [], L.initialized = !1, L;
}
function km(e, t = !1) {
	if (L.initialized && Em(`linkifyjs: already initialized - will not register custom scheme "${e}" ${Dm}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e)) throw Error("linkifyjs: incorrect scheme format.\n1. Must only contain digits, lowercase ASCII letters or \"-\"\n2. Cannot start or end with \"-\"\n3. \"-\" cannot repeat");
	L.customSchemes.push([e, t]);
}
function Am() {
	L.scanner = cm(L.customSchemes);
	for (let e = 0; e < L.tokenQueue.length; e++) L.tokenQueue[e][1]({ scanner: L.scanner });
	L.parser = Cm(L.scanner.tokens);
	for (let e = 0; e < L.pluginQueue.length; e++) L.pluginQueue[e][1]({
		scanner: L.scanner,
		parser: L.parser
	});
	return L.initialized = !0, L;
}
function jm(e) {
	return L.initialized || Am(), wm(L.parser.start, e, lm(L.scanner.start, e));
}
jm.scan = lm;
function Mm(e, t = null, n = null) {
	if (t && typeof t == "object") {
		if (n) throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
		n = t, t = null;
	}
	let r = new mm(n), i = jm(e), a = [];
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		n.isLink && (!t || n.t === t) && r.check(n) && a.push(n.toFormattedObject(r));
	}
	return a;
}
//#endregion
//#region node_modules/@tiptap/extension-link/dist/index.js
var Nm = "[\0- \xA0 ᠎ -\u2029 　]", Pm = new RegExp(Nm), Fm = RegExp(`${Nm}$`), Im = new RegExp(Nm, "g");
function Lm(e) {
	return e.length === 1 ? e[0].isLink : e.length === 3 && e[1].isLink ? ["()", "[]"].includes(e[0].value + e[2].value) : !1;
}
function Rm(e) {
	return new E({
		key: new D("autolink"),
		appendTransaction: (t, n, r) => {
			let i = t.some((e) => e.docChanged) && !n.doc.eq(r.doc), a = t.some((e) => e.getMeta("preventAutolink"));
			if (!i || a) return;
			let { tr: o } = r;
			if (lu(Nl(n.doc, [...t])).forEach(({ newRange: t }) => {
				let n = Pl(r.doc, t, (e) => e.isTextblock), i, a;
				if (n.length > 1) i = n[0], a = r.doc.textBetween(i.pos, i.pos + i.node.nodeSize, void 0, " ");
				else if (n.length) {
					let e = r.doc.textBetween(t.from, t.to, " ", " ");
					if (!Fm.test(e)) return;
					i = n[0], a = r.doc.textBetween(i.pos, t.to, void 0, " ");
				}
				if (i && a) {
					let t = a.split(Pm).filter(Boolean);
					if (t.length <= 0) return !1;
					let n = t[t.length - 1], s = i.pos + a.lastIndexOf(n);
					if (!n) return !1;
					let c = jm(n).map((t) => t.toObject(e.defaultProtocol));
					if (!Lm(c)) return !1;
					c.filter((e) => e.isLink).map((e) => ({
						...e,
						from: s + e.start + 1,
						to: s + e.end + 1
					})).filter((e) => !r.schema.marks.code || !r.doc.rangeHasMark(e.from, e.to, r.schema.marks.code)).filter((t) => e.validate(t.value)).filter((t) => e.shouldAutoLink(t.value)).forEach((t) => {
						du(t.from, t.to, r.doc).some((t) => t.mark.type === e.type) || o.addMark(t.from, t.to, e.type.create({ href: t.href }));
					});
				}
			}), o.steps.length) return o;
		}
	});
}
function zm(e) {
	return new E({
		key: new D("handleClickLink"),
		props: { handleClick: (t, n, r) => {
			if (r.button !== 0 || !t.editable) return !1;
			let i = null;
			if (r.target instanceof HTMLAnchorElement) i = r.target;
			else {
				let t = r.target;
				if (!t) return !1;
				let n = e.editor.view.dom;
				i = t.closest("a"), i && !n.contains(i) && (i = null);
			}
			if (!i) return !1;
			let a = !1;
			if (e.enableClickSelection && (a = e.editor.commands.extendMarkRange(e.type.name)), e.openOnClick) {
				let n = ou(t.state, e.type.name), r = i.href ?? n.href, o = i.target ?? n.target;
				r && (window.open(r, o), a = !0);
			}
			return a;
		} }
	});
}
var Bm = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/, Vm = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;
function Hm(e, t) {
	let n = 0;
	for (let r = t - 1; r >= 0 && e[r] === "\\"; --r) n += 1;
	return n % 2 == 1;
}
function Um(e, t) {
	let n = 0, r = 0;
	for (; r < t;) {
		if (e[r] !== "`") {
			r += 1;
			continue;
		}
		if (n === 0 && Hm(e, r)) {
			r += 1;
			continue;
		}
		let i = 0;
		for (; r < t && e[r] === "`";) i += 1, r += 1;
		n === 0 ? n = i : i === n && (n = 0);
	}
	return n > 0;
}
function Wm(e, t, n) {
	let [, r, i] = t;
	return (t.index ? e[t.index - 1] : void 0) === "!" || Hm(e, t.index ?? 0) || Um(e, t.index ?? 0) ? !1 : !!r.trim() && n(i);
}
function Gm(e) {
	let [t, n, r, , i, a, o] = e, s = i ?? a ?? o;
	return {
		index: e.index ?? 0,
		text: t,
		replaceWith: n,
		data: {
			href: r,
			title: s || null,
			markdown: !0
		}
	};
}
function Km(e, t) {
	return e.index < t.index + t.text.length && t.index < e.index + e.text.length;
}
function qm(e) {
	return {
		href: e.data?.href,
		title: e.data?.title ?? null
	};
}
function Jm(e) {
	let t = Zd({
		find: (t) => {
			let n = Bm.exec(t);
			return !n || !Wm(t, n, e.isAllowedHref) ? null : Gm(n);
		},
		type: e.type,
		getAttributes: qm
	});
	return new wd({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function Ym(e) {
	let t = af({
		find: (t) => {
			let n = [];
			for (let r of t.matchAll(Vm)) Wm(t, r, e.isAllowedHref) && n.push(Gm(r));
			let r = (e.findPlainUrls?.call(e, t) ?? []).filter((e) => !n.some((t) => Km(t, e)));
			return [...n, ...r];
		},
		type: e.type,
		getAttributes: qm
	});
	return new Ad({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.match.data?.markdown && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function Xm(e) {
	return new E({
		key: new D("handlePasteLink"),
		props: { handlePaste: (t, n, r) => {
			let { shouldAutoLink: i } = e, { state: a } = t, { selection: o } = a, { empty: s } = o;
			if (s) return !1;
			let c = "";
			r.content.forEach((e) => {
				c += e.textContent;
			});
			let l = Mm(c, { defaultProtocol: e.defaultProtocol }).find((e) => e.isLink && e.value === c);
			return !c || !l || i !== void 0 && !i(l.value) ? !1 : e.editor.commands.setMark(e.type, { href: l.href });
		} }
	});
}
function Zm(e, t) {
	let n = [
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
	return t && t.forEach((e) => {
		let t = typeof e == "string" ? e : e.scheme;
		t && n.push(t);
	}), !e || e.replace(Im, "").match(RegExp(`^(?:(?:${n.map((e) => e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`, "i"));
}
var Qm = kd.create({
	name: "link",
	priority: 1e3,
	keepOnSplit: !1,
	exitable: !0,
	onCreate() {
		this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")), this.options.protocols.forEach((e) => {
			if (typeof e == "string") {
				km(e);
				return;
			}
			km(e.scheme, e.optionalSlashes);
		});
	},
	onDestroy() {
		Om();
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
			autolink: !0,
			protocols: [],
			defaultProtocol: "http",
			HTMLAttributes: {
				target: "_blank",
				rel: "noopener noreferrer nofollow",
				class: null
			},
			isAllowedUri: (e, t) => !!Zm(e, t.protocols),
			validate: (e) => !!e,
			shouldAutoLink: (e) => {
				let t = /^[a-z][a-z0-9+.-]*:\/\//i.test(e), n = /^[a-z][a-z0-9+.-]*:/i.test(e);
				if (t || n && !e.includes("@")) return !0;
				let r = (e.includes("@") ? e.split("@").pop() : e).split(/[/?#:]/)[0];
				return !(/^\d{1,3}(\.\d{1,3}){3}$/.test(r) || !/\./.test(r));
			}
		};
	},
	addAttributes() {
		return {
			href: {
				default: null,
				parseHTML(e) {
					return e.getAttribute("href");
				}
			},
			target: { default: this.options.HTMLAttributes.target ?? null },
			rel: { default: this.options.HTMLAttributes.rel ?? null },
			class: { default: this.options.HTMLAttributes.class ?? null },
			title: { default: null }
		};
	},
	parseHTML() {
		return [{
			tag: "a[href]",
			getAttrs: (e) => {
				let t = e.getAttribute("href");
				return !t || !this.options.isAllowedUri(t, {
					defaultValidate: (e) => !!Zm(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : null;
			}
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return this.options.isAllowedUri(e.href, {
			defaultValidate: (e) => !!Zm(e, this.options.protocols),
			protocols: this.options.protocols,
			defaultProtocol: this.options.defaultProtocol
		}) ? [
			"a",
			M(this.options.HTMLAttributes, e),
			0
		] : [
			"a",
			M(this.options.HTMLAttributes, {
				...e,
				href: ""
			}),
			0
		];
	},
	markdownTokenName: "link",
	parseMarkdown: (e, t) => t.applyMark("link", t.parseInline(e.tokens || []), {
		href: e.href,
		title: e.title || null
	}),
	renderMarkdown: (e, t) => {
		let n = e.attrs?.href ?? "", r = e.attrs?.title ?? "", i = t.renderChildren(e);
		return r ? `[${i}](${n} "${r}")` : `[${i}](${n})`;
	},
	addCommands() {
		return {
			setLink: (e) => ({ chain: t }) => {
				let { href: n } = e;
				return this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!Zm(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? t().setMark(this.name, e).setMeta("preventAutolink", !0).run() : !1;
			},
			toggleLink: (e) => ({ chain: t }) => {
				let { href: n } = e || {};
				return n && !this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!Zm(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : t().toggleMark(this.name, e, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run();
			},
			unsetLink: () => ({ chain: e }) => e().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
		};
	},
	addInputRules() {
		return this.options.markdownLinks ? [Jm({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!Zm(e, this.options.protocols),
				protocols: this.options.protocols,
				defaultProtocol: this.options.defaultProtocol
			})
		})] : [];
	},
	addPasteRules() {
		let e = (e) => {
			let t = [];
			if (e) {
				let { protocols: n, defaultProtocol: r } = this.options;
				Mm(e).filter((e) => e.isLink && this.options.isAllowedUri(e.value, {
					defaultValidate: (e) => !!Zm(e, n),
					protocols: n,
					defaultProtocol: r
				})).forEach((e) => {
					this.options.shouldAutoLink(e.value) && t.push({
						text: e.value,
						data: { href: e.href },
						index: e.start
					});
				});
			}
			return t;
		};
		return this.options.markdownLinks ? [Ym({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!Zm(e, this.options.protocols),
				protocols: this.options.protocols,
				defaultProtocol: this.options.defaultProtocol
			}),
			findPlainUrls: e
		})] : [af({
			find: e,
			type: this.type,
			getAttributes: (e) => ({ href: e.data?.href })
		})];
	},
	addProseMirrorPlugins() {
		let e = [], { protocols: t, defaultProtocol: n } = this.options;
		return this.options.autolink && e.push(Rm({
			type: this.type,
			defaultProtocol: this.options.defaultProtocol,
			validate: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!Zm(e, t),
				protocols: t,
				defaultProtocol: n
			}),
			shouldAutoLink: this.options.shouldAutoLink
		})), e.push(zm({
			type: this.type,
			editor: this.editor,
			openOnClick: this.options.openOnClick === "whenNotEditable" || this.options.openOnClick,
			enableClickSelection: this.options.enableClickSelection
		})), this.options.linkOnPaste && e.push(Xm({
			editor: this.editor,
			defaultProtocol: this.options.defaultProtocol,
			type: this.type,
			shouldAutoLink: this.options.shouldAutoLink
		})), e;
	}
}), $m = Qm, eh = Object.defineProperty, th = (e, t) => {
	for (var n in t) eh(e, n, {
		get: t[n],
		enumerable: !0
	});
}, nh = "listItem", rh = "textStyle", ih = /^\s*([-+*])\s$/, ah = rf.create({
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
	renderHTML({ HTMLAttributes: e }) {
		return [
			"ul",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => e.type !== "list" || e.ordered ? [] : {
		type: "bulletList",
		content: e.items ? t.parseChildren(e.items) : []
	},
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleBulletList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(nh, this.editor.getAttributes(rh)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-8": () => this.editor.commands.toggleBulletList() };
	},
	addInputRules() {
		let e = ef({
			find: ih,
			type: this.type
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (e = ef({
			find: ih,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: () => this.editor.getAttributes(rh),
			editor: this.editor
		})), [e];
	}
}), oh = (e, t, n) => {
	let { selection: r } = e;
	if (!r.empty) return null;
	let { $from: i } = r;
	if (!i.parent.isTextblock || i.parentOffset !== i.parent.content.size) return null;
	let a = -1;
	for (let e = i.depth; e > 0; --e) if (i.node(e).type.name === t) {
		a = e;
		break;
	}
	if (a < 0) return null;
	let o = i.node(a), s = i.index(a);
	if (s + 1 >= o.childCount) return null;
	let c = o.child(s + 1);
	if (!n.includes(c.type.name)) return null;
	let l = e.schema.nodes[t], u = !1;
	if (c.forEach((e) => {
		e.type === l && e.childCount > 1 && (u = !0);
	}), !u) return null;
	let d = e.doc.resolve(i.after()).nodeAfter;
	if (!d || !n.includes(d.type.name)) return null;
	let f = [];
	return d.forEach((e) => {
		f.push(e);
	}), f.length === 0 ? null : {
		listItemDepth: a,
		nestedList: d,
		nestedListPos: i.after(),
		insertPos: i.after(a),
		items: f
	};
}, sh = (e, t, n, r) => {
	let i = oh(e, n, r);
	if (!i) return !1;
	let { selection: o } = e, { nestedList: s, nestedListPos: c, insertPos: l, items: u } = i, d = e.tr;
	d.delete(c, c + s.nodeSize);
	let f = d.mapping.map(l);
	return d.insert(f, a.from(u)), d.setSelection(o.map(d.doc, d.mapping)), t && t(d), !0;
}, ch = (e, t, n) => sh(e.state, e.view.dispatch, t, n), lh = (e, t) => N.create({
	name: `${e}BranchingDeleteKeymap`,
	priority: 101,
	addKeyboardShortcuts() {
		let n = () => ch(this.editor, e, t);
		return {
			Delete: n,
			"Mod-Delete": n
		};
	}
}), uh = [
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
], dh = "abcdefghijklmnopqrstuvwxyz", fh = String.raw`\d+|[ivxlcdmIVXLCDM]+|${"[a-zA-Z]{1,2}"}`;
function ph(e) {
	let t = e, n = "";
	for (let [e, r] of uh) for (; t >= e;) n += r, t -= e;
	return n;
}
function mh(e) {
	return ph(e).toUpperCase();
}
function hh(e) {
	let t = e.toLowerCase(), n = 0, r = 0;
	for (; n < t.length;) {
		let e = !1;
		for (let [i, a] of uh) if (t.startsWith(a, n)) {
			r += i, n += a.length, e = !0;
			break;
		}
		if (!e) return 0;
	}
	return r;
}
function gh(e) {
	if (!/^[ivxlcdmIVXLCDM]+$/.test(e)) return !1;
	let t = hh(e);
	return t <= 0 ? !1 : (e === e.toLowerCase() ? ph(t) : mh(t)) === e;
}
function _h(e) {
	let t = e.toLowerCase();
	if (t.length === 1) return t.charCodeAt(0) - 97 + 1;
	if (t.length === 2) {
		let e = t.charCodeAt(0) - 97, n = t.charCodeAt(1) - 97;
		return (e + 1) * 26 + n + 1;
	}
	return 0;
}
function vh(e) {
	if (e <= 26) return dh[e - 1];
	let t = Math.floor((e - 1) / 26) - 1, n = (e - 1) % 26;
	return t < 0 ? dh[n] : dh[t] + dh[n];
}
function yh(e) {
	if (!(!e || /^\d+$/.test(e))) {
		if (gh(e)) return e === e.toLowerCase() ? "i" : "I";
		if (/^[a-z]{1,2}$/.test(e)) return "a";
		if (/^[A-Z]{1,2}$/.test(e)) return "A";
	}
}
function bh(e) {
	if (/^\d+$/.test(e)) return parseInt(e, 10);
	let t = yh(e);
	if (t === "i" || t === "I") return hh(e);
	if (t === "a" || t === "A") {
		let t = _h(e);
		return t > 0 ? t : 1;
	}
	let n = parseInt(e, 10);
	return Number.isNaN(n) ? 1 : n;
}
function xh(e, t) {
	if (e === "numeric") return String(t);
	switch (e) {
		case "a": return vh(t);
		case "A": return vh(t).toUpperCase();
		case "i": return ph(t);
		case "I": return mh(t);
		default: return String(t);
	}
}
function Sh(e) {
	if (e.length === 0) return !1;
	let t = yh(e[0]) ?? "numeric", n = bh(e[0]);
	if (n < 1) return !1;
	for (let r = 0; r < e.length; r++) {
		let i = xh(t, n + r);
		if (e[r] !== i) return !1;
	}
	return !0;
}
function Ch(e) {
	return {
		type: yh(e),
		start: bh(e)
	};
}
function wh(e) {
	let { type: t, start: n } = Ch(e), r = {};
	return t && (r.type = t), n !== 1 && (r.start = n), r;
}
function Th(e, t, n = ". ") {
	let r = t + 1;
	if (!e || e === "1") return `${r}${n}`;
	switch (e) {
		case "a": return `${vh(r)}${n}`;
		case "A": return `${vh(r).toUpperCase()}${n}`;
		case "i": return `${ph(r)}${n}`;
		case "I": return `${mh(r)}${n}`;
		default: return `${r}${n}`;
	}
}
function Eh(e) {
	let t = e.tokens?.[0];
	return !!(e.text && e.tokens?.length === 1 && t?.type === "list" && t.ordered && t.raw === e.text);
}
function Dh(e, t) {
	return t.tokenizeInline ? t.parseInline(t.tokenizeInline(e)) : t.parseInline([{
		type: "text",
		raw: e,
		text: e
	}]);
}
var Oh = rf.create({
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
		return [{ tag: "li" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"li",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list_item",
	parseMarkdown: (e, t) => {
		if (e.type !== "list_item") return [];
		let n = t.parseBlockChildren ?? t.parseChildren, r = [];
		if (e.tokens && e.tokens.length > 0) {
			if (Eh(e)) return {
				type: "listItem",
				content: [{
					type: "paragraph",
					content: Dh(e.text || "", t)
				}]
			};
			if (e.tokens.some((e) => e.type === "paragraph")) r = n(e.tokens);
			else {
				let i = e.tokens[0];
				if (i && i.type === "text" && i.tokens && i.tokens.length > 0) {
					if (r = [{
						type: "paragraph",
						content: t.parseInline(i.tokens)
					}], e.tokens.length > 1) {
						let t = n(e.tokens.slice(1));
						r.push(...t);
					}
				} else r = n(e.tokens);
			}
		}
		return r.length === 0 && (r = [{
			type: "paragraph",
			content: []
		}]), {
			type: "listItem",
			content: r
		};
	},
	renderMarkdown: (e, t, n) => yd(e, t, (e) => {
		if (e.parentType === "bulletList") return "- ";
		if (e.parentType === "orderedList") {
			let t = e.meta?.parentAttrs?.start || 1, n = e.meta?.parentAttrs?.type;
			return Th(n, t - 1 + (e.index || 0), ". ");
		}
		return "- ";
	}, n),
	addExtensions() {
		return [lh(this.name, [this.options.bulletListTypeName, this.options.orderedListTypeName])];
	},
	addKeyboardShortcuts() {
		return {
			Enter: () => this.editor.commands.splitListItem(this.name),
			Tab: () => this.editor.commands.sinkListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
	}
});
th({}, {
	findListItemPos: () => kh,
	getNextListDepth: () => Ah,
	handleBackspace: () => Mh,
	handleDelete: () => Fh,
	hasListBefore: () => jh,
	hasListItemAfter: () => Ih,
	hasListItemBefore: () => Lh,
	listItemHasSubList: () => Rh,
	nextListIsDeeper: () => Nh,
	nextListIsHigher: () => Ph
});
var kh = (e, t) => {
	let { $from: n } = t.selection, r = k(e, t.schema), i = null, a = n.depth, o = n.pos, s = null;
	for (; a > 0 && s === null;) i = n.node(a), i.type === r ? s = a : (--a, --o);
	return s === null ? null : {
		$pos: t.doc.resolve(o),
		depth: s
	};
}, Ah = (e, t) => {
	let n = kh(e, t);
	if (!n) return !1;
	let [, r] = fu(t, e, n.$pos.pos + 4);
	return r;
}, jh = (e, t, n) => {
	let { $anchor: r } = e.selection, i = Math.max(0, r.pos - 2), a = e.doc.resolve(i).node();
	return !(!a || !n.includes(a.type.name));
}, Mh = (e, t, n) => {
	if (e.commands.undoInputRule()) return !0;
	if (e.state.selection.from !== e.state.selection.to) return !1;
	if (!hl(e.state, t) && jh(e.state, t, n)) {
		let { $anchor: n } = e.state.selection, r = e.state.doc.resolve(n.before() - 1), i = [];
		r.node().descendants((e, n) => {
			e.type.name === t && i.push({
				node: e,
				pos: n
			});
		});
		let a = i.at(-1);
		if (!a) return !1;
		let o = e.state.doc.resolve(r.start() + a.pos + 1);
		return e.chain().cut({
			from: n.start() - 1,
			to: n.end() + 1
		}, o.end()).joinForward().run();
	}
	return !hl(e.state, t) || !yu(e.state) ? !1 : e.chain().liftListItem(t).run();
}, Nh = (e, t) => {
	let n = Ah(e, t), r = kh(e, t);
	return !r || !n ? !1 : n > r.depth;
}, Ph = (e, t) => {
	let n = Ah(e, t), r = kh(e, t);
	return !r || !n ? !1 : n < r.depth;
}, Fh = (e, t) => {
	if (!hl(e.state, t) || !vu(e.state, t)) return !1;
	let { selection: n } = e.state, { $from: r, $to: i } = n;
	return !n.empty && r.sameParent(i) ? !1 : Nh(t, e.state) ? e.chain().focus(e.state.selection.from + 4).lift(t).joinBackward().run() : Ph(t, e.state) ? e.chain().joinForward().joinBackward().run() : e.commands.joinItemForward();
}, Ih = (e, t) => {
	let { $anchor: n } = t.selection, r = t.doc.resolve(n.pos - n.parentOffset - 2);
	return !(r.index() === r.parent.childCount - 1 || r.nodeAfter?.type.name !== e);
}, Lh = (e, t) => {
	let { $anchor: n } = t.selection, r = t.doc.resolve(n.pos - 2);
	return !(r.index() === 0 || r.nodeBefore?.type.name !== e);
}, Rh = (e, t, n) => {
	if (!n) return !1;
	let r = k(e, t.schema), i = !1;
	return n.descendants((e) => {
		e.type === r && (i = !0);
	}), i;
}, zh = N.create({
	name: "listKeymap",
	addOptions() {
		return { listTypes: [{
			itemName: "listItem",
			wrapperNames: ["bulletList", "orderedList"]
		}, {
			itemName: "taskItem",
			wrapperNames: ["taskList"]
		}] };
	},
	addKeyboardShortcuts() {
		return {
			Delete: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && Fh(e, n) && (t = !0);
				}), t;
			},
			"Mod-Delete": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && Fh(e, n) && (t = !0);
				}), t;
			},
			Backspace: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && Mh(e, n, r) && (t = !0);
				}), t;
			},
			"Mod-Backspace": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && Mh(e, n, r) && (t = !0);
				}), t;
			}
		};
	}
}), Bh = RegExp(`^(\\s*)(${fh})([.)])\\s+(.*)$`), Vh = /^\s/, Hh = {
	heading: /^#{1,6}(?:\s|$)/,
	bulletItem: /^[-+*]\s+/,
	codeFence: /^(?:```|~~~)/,
	thematicBreak: /^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/
};
function Uh(e) {
	return Bh.test(e.trimStart());
}
function Wh(e) {
	let t = e.trimStart();
	return Hh.bulletItem.test(t) || Uh(t) || Hh.heading.test(t) || Hh.thematicBreak.test(t) && !t.startsWith("-") || /^>\s?/.test(t) || Hh.codeFence.test(t);
}
function Gh(e) {
	return Object.values(Hh).some((t) => t.test(e));
}
function Kh(e) {
	let t = [], n = [], r = !1;
	return e.forEach((e) => {
		if (r) {
			n.push(e);
			return;
		}
		if (e.trim() === "") {
			r = !0, n.push(e);
			return;
		}
		if (t.length > 0 && Wh(e)) {
			r = !0, n.push(e);
			return;
		}
		t.push(e);
	}), {
		paragraphLines: t,
		blockLines: n
	};
}
function qh(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n], a = i.match(Bh);
		if (!a) break;
		let [, o, s, c, l] = a, u = o.length, d = parseInt(s, 10), f = isNaN(d) ? yh(s) : void 0, p = isNaN(d) ? bh(s) : d, m = [l], h = n + 1, g = [i], _ = !1;
		for (; h < e.length;) {
			let t = e[h];
			if (t.match(Bh)) break;
			if (t.trim() === "") g.push(t), m.push(""), _ = !0, h += 1;
			else if (t.match(Vh)) {
				let e = t.length - t.trimStart().length, n = u + s.length + 1;
				g.push(t), m.push(t.slice(Math.min(e, n))), h += 1;
			} else {
				if (_ || Gh(t)) break;
				g.push(t), m.push(t), h += 1;
			}
		}
		t.push({
			indent: u,
			number: p,
			type: f,
			content: m.join("\n").trim(),
			contentLines: m,
			raw: g.join("\n")
		}), r = h, n = h;
	}
	return [t, r];
}
var Jh = RegExp(`^(${fh})([.)])\\s+(.+)$`);
function Yh(e) {
	let t = e.split("\n").filter((e) => e.trim().length > 0);
	if (t.length === 0) return null;
	let n = [];
	for (let e of t) {
		let t = e.trim().match(Jh);
		if (!t) return null;
		n.push({
			marker: t[1],
			content: t[3]
		});
	}
	return Sh(n.map((e) => e.marker)) ? {
		type: "orderedList",
		attrs: wh(n[0].marker),
		content: n.map((e) => ({
			type: "listItem",
			content: [{
				type: "paragraph",
				content: [{
					type: "text",
					text: e.content
				}]
			}]
		}))
	} : null;
}
function Xh(e, t, n) {
	let r = [], i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a.indent === t) {
			let { paragraphLines: o, blockLines: s } = Kh(a.contentLines), c = o.join("\n").trim(), l = [];
			c && l.push({
				type: "paragraph",
				raw: c,
				tokens: n.inlineTokens(c)
			});
			let u = s.join("\n").trim();
			if (u) {
				let e = n.blockTokens(u);
				l.push(...e);
			}
			let d = i + 1, f = [];
			for (; d < e.length && e[d].indent > t;) f.push(e[d]), d += 1;
			if (f.length > 0) {
				let e = Xh(f, Math.min(...f.map((e) => e.indent)), n);
				l.push({
					type: "list",
					ordered: !0,
					start: f[0].number,
					typeMarker: f[0].type,
					items: e,
					raw: f.map((e) => e.raw).join("\n")
				});
			}
			r.push({
				type: "list_item",
				raw: a.raw,
				tokens: l
			}), i = d;
		} else i += 1;
	}
	return r;
}
function Zh(e, t) {
	return e.map((e) => {
		if (e.type !== "list_item") return t.parseChildren([e])[0];
		let n = [];
		return e.tokens && e.tokens.length > 0 && e.tokens.forEach((e) => {
			if (e.type === "paragraph" || e.type === "list" || e.type === "blockquote" || e.type === "code") n.push(...t.parseChildren([e]));
			else if (e.type === "text" && e.tokens) {
				let r = t.parseChildren([e]);
				n.push({
					type: "paragraph",
					content: r
				});
			} else {
				let r = t.parseChildren([e]);
				r.length > 0 && n.push(...r);
			}
		}), {
			type: "listItem",
			content: n
		};
	});
}
var Qh = "listItem", $h = "textStyle", eg = /^(\d+)\.\s$/;
function tg(e) {
	let t = e.match(/list-style-type\s*:\s*([^;]+)/i);
	if (!t) return null;
	switch (t[1].trim().toLowerCase()) {
		case "upper-roman": return "I";
		case "lower-roman": return "i";
		case "upper-alpha":
		case "upper-latin": return "A";
		case "lower-alpha":
		case "lower-latin": return "a";
		default: return null;
	}
}
var ng = rf.create({
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
				parseHTML: (e) => e.hasAttribute("start") ? parseInt(e.getAttribute("start") || "", 10) : 1
			},
			type: {
				default: null,
				parseHTML: (e) => {
					let t = e.getAttribute("type");
					if (t) return t;
					let n = e.getAttribute("style");
					if (n) {
						let e = tg(n);
						if (e) return e;
					}
					let r = e.querySelector("li");
					if (r) {
						let e = r.getAttribute("style");
						if (e) {
							let t = tg(e);
							if (t) return t;
						}
					}
					return null;
				}
			}
		};
	},
	parseHTML() {
		return [{ tag: "ol" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		let { start: t, type: n, ...r } = e, i = M(this.options.HTMLAttributes, r);
		return t !== 1 && (i.start = t), n && n !== "1" && (i.type = n), [
			"ol",
			i,
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => {
		if (e.type !== "list" || !e.ordered) return [];
		let n = e.start || 1, r = e.typeMarker, i = e.items ? Zh(e.items, t) : [], a = {};
		return n !== 1 && (a.start = n), r && (a.type = r), Object.keys(a).length > 0 ? {
			type: "orderedList",
			attrs: a,
			content: i
		} : {
			type: "orderedList",
			content: i
		};
	},
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownTokenizer: {
		name: "orderedList",
		level: "block",
		start: () => -1,
		tokenize: (e, t, n) => {
			let r = e.split("\n"), [i, a] = qh(r);
			if (i.length === 0) return;
			let o = Xh(i, i[0].indent, n);
			return o.length === 0 ? void 0 : {
				type: "list",
				ordered: !0,
				start: i[0]?.number || 1,
				typeMarker: i[0]?.type,
				items: o,
				raw: r.slice(0, a).join("\n")
			};
		}
	},
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleOrderedList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Qh, this.editor.getAttributes($h)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-7": () => this.editor.commands.toggleOrderedList() };
	},
	addProseMirrorPlugins() {
		return [new E({ props: { handlePaste: (e, t) => {
			if ((t.clipboardData?.getData("text/html"))?.trim()) return !1;
			let n = t.clipboardData?.getData("text/plain");
			if (!n) return !1;
			let r = Yh(n);
			if (!r) return !1;
			try {
				let t = e.state.schema.nodeFromJSON(r), n = e.state.tr.replaceSelectionWith(t);
				return e.dispatch(n), !0;
			} catch {
				return !1;
			}
		} } })];
	},
	addInputRules() {
		let e = (e, t) => (!t.attrs.type || t.attrs.type === "1") && t.childCount + t.attrs.start === +e[1], t = ef({
			find: eg,
			type: this.type,
			getAttributes: (e) => ({ start: +e[1] }),
			joinPredicate: e
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (t = ef({
			find: eg,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: (e) => ({
				start: +e[1],
				...this.editor.getAttributes($h)
			}),
			joinPredicate: e,
			editor: this.editor
		})), [t];
	}
}), rg = /^\s*(\[([( |x])?\])\s$/, ig = rf.create({
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
		return { checked: {
			default: !1,
			keepOnSplit: !1,
			parseHTML: (e) => {
				let t = e.getAttribute("data-checked");
				return t === "" || t === "true";
			},
			renderHTML: (e) => ({ "data-checked": e.checked })
		} };
	},
	parseHTML() {
		return [{
			tag: `li[data-type="${this.name}"]`,
			priority: 51
		}];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		return [
			"li",
			M(this.options.HTMLAttributes, t, { "data-type": this.name }),
			[
				"label",
				["input", {
					type: "checkbox",
					checked: e.attrs.checked ? "checked" : null
				}],
				["span"]
			],
			["div", 0]
		];
	},
	parseMarkdown: (e, t) => {
		let n = [];
		if (e.tokens && e.tokens.length > 0 ? n.push(t.createNode("paragraph", {}, t.parseInline(e.tokens))) : e.text ? n.push(t.createNode("paragraph", {}, [t.createNode("text", { text: e.text })])) : n.push(t.createNode("paragraph", {}, [])), e.nestedTokens && e.nestedTokens.length > 0) {
			let r = t.parseChildren(e.nestedTokens);
			n.push(...r);
		}
		return t.createNode("taskItem", { checked: e.checked || !1 }, n);
	},
	renderMarkdown: (e, t) => yd(e, t, `- [${e.attrs?.checked ? "x" : " "}] `),
	addExtensions() {
		return this.options.nested ? [lh(this.name, [this.options.taskListTypeName])] : [];
	},
	addKeyboardShortcuts() {
		let e = {
			Enter: () => this.editor.commands.splitListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
		return this.options.nested ? {
			...e,
			Tab: () => this.editor.commands.sinkListItem(this.name)
		} : e;
	},
	addNodeView() {
		return ({ node: e, HTMLAttributes: t, getPos: n, editor: r }) => {
			let i = document.createElement("li"), a = document.createElement("label"), o = document.createElement("span"), s = document.createElement("input"), c = document.createElement("div"), l = (e) => {
				var t;
				s.ariaLabel = ((t = this.options.a11y)?.checkboxLabel)?.call(t, e, s.checked) || `Task item checkbox for ${e.textContent || "empty task item"}`;
			};
			l(e), a.contentEditable = "false", s.type = "checkbox", s.addEventListener("mousedown", (e) => e.preventDefault()), s.addEventListener("change", (t) => {
				if (!r.isEditable && !this.options.onReadOnlyChecked) {
					s.checked = !s.checked;
					return;
				}
				let { checked: i } = t.target;
				r.isEditable && typeof n == "function" && r.chain().focus(void 0, { scrollIntoView: !1 }).command(({ tr: e }) => {
					let t = n();
					if (typeof t != "number") return !1;
					let r = e.doc.nodeAt(t);
					return e.setNodeMarkup(t, void 0, {
						...r?.attrs,
						checked: i
					}), !0;
				}).run(), !r.isEditable && this.options.onReadOnlyChecked && (this.options.onReadOnlyChecked(e, i) || (s.checked = !s.checked));
			}), Object.entries(this.options.HTMLAttributes).forEach(([e, t]) => {
				i.setAttribute(e, t);
			}), i.dataset.checked = e.attrs.checked, s.checked = e.attrs.checked, a.append(s, o), i.append(a, c), Object.entries(t).forEach(([e, t]) => {
				i.setAttribute(e, t);
			});
			let u = new Set(Object.keys(t));
			return {
				dom: i,
				contentDOM: c,
				update: (e) => {
					if (e.type !== this.type) return !1;
					i.dataset.checked = e.attrs.checked, s.checked = e.attrs.checked, l(e);
					let t = r.extensionManager.attributes, n = Gl(e, t), a = new Set(Object.keys(n)), o = this.options.HTMLAttributes;
					return u.forEach((e) => {
						a.has(e) || (e in o ? i.setAttribute(e, o[e]) : i.removeAttribute(e));
					}), Object.entries(n).forEach(([e, t]) => {
						t == null ? e in o ? i.setAttribute(e, o[e]) : i.removeAttribute(e) : i.setAttribute(e, t);
					}), u = a, !0;
				}
			};
		};
	},
	addInputRules() {
		return [ef({
			find: rg,
			type: this.type,
			getAttributes: (e) => ({ checked: e[e.length - 1] === "x" })
		})];
	}
}), ag = rf.create({
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
		return [{
			tag: `ul[data-type="${this.name}"]`,
			priority: 51
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"ul",
			M(this.options.HTMLAttributes, e, { "data-type": this.name }),
			0
		];
	},
	parseMarkdown: (e, t) => t.createNode("taskList", {}, t.parseChildren(e.items || [])),
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n") : "",
	markdownTokenizer: {
		name: "taskList",
		level: "block",
		start(e) {
			let t = e.match(/^\s*[-+*]\s+\[([ xX])\]\s+/)?.index;
			return t === void 0 ? -1 : t;
		},
		tokenize(e, t, n) {
			let r = (e) => {
				let t = vd(e, {
					itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
					extractItemData: (e) => ({
						indentLevel: e[1].length,
						mainContent: e[4],
						checked: e[3].toLowerCase() === "x"
					}),
					createToken: (e, t) => ({
						type: "taskItem",
						raw: "",
						mainContent: e.mainContent,
						indentLevel: e.indentLevel,
						checked: e.checked,
						text: e.mainContent,
						tokens: n.inlineTokens(e.mainContent),
						nestedTokens: t
					}),
					customNestedParser: r
				}, n);
				if (t) {
					let r = {
						type: "taskList",
						raw: t.raw,
						items: t.items
					}, i = e.slice(t.raw.length);
					return i.trim() ? [r, ...n.blockTokens(i)] : [r];
				}
				return n.blockTokens(e);
			}, i = vd(e, {
				itemPattern: /^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,
				extractItemData: (e) => ({
					indentLevel: e[1].length,
					mainContent: e[4],
					checked: e[3].toLowerCase() === "x"
				}),
				createToken: (e, t) => ({
					type: "taskItem",
					raw: "",
					mainContent: e.mainContent,
					indentLevel: e.indentLevel,
					checked: e.checked,
					text: e.mainContent,
					tokens: n.inlineTokens(e.mainContent),
					nestedTokens: t
				}),
				customNestedParser: r
			}, n);
			if (i) return {
				type: "taskList",
				raw: i.raw,
				items: i.items
			};
		}
	},
	markdownOptions: { indentsContent: !0 },
	addCommands() {
		return { toggleTaskList: () => ({ commands: e }) => e.toggleList(this.name, this.options.itemTypeName) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-9": () => this.editor.commands.toggleTaskList() };
	}
});
N.create({
	name: "listKit",
	addExtensions() {
		let e = [];
		return this.options.bulletList !== !1 && e.push(ah.configure(this.options.bulletList)), this.options.listItem !== !1 && e.push(Oh.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(zh.configure(this.options.listKeymap)), this.options.orderedList !== !1 && e.push(ng.configure(this.options.orderedList)), this.options.taskItem !== !1 && e.push(ig.configure(this.options.taskItem)), this.options.taskList !== !1 && e.push(ag.configure(this.options.taskList)), e;
	}
});
//#endregion
//#region node_modules/@tiptap/extension-paragraph/dist/index.js
var og = "&nbsp;", sg = "\xA0", cg = rf.create({
	name: "paragraph",
	priority: 1e3,
	addOptions() {
		return { HTMLAttributes: {} };
	},
	group: "block",
	content: "inline*",
	parseHTML() {
		return [{ tag: "p" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"p",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown: (e, t) => {
		let n = e.tokens || [];
		if (n.length === 1 && n[0].type === "image") return t.parseChildren([n[0]]);
		let r = t.parseInline(n);
		return n.length === 1 && n[0].type === "text" && (n[0].raw === og || n[0].text === og || n[0].raw === sg || n[0].text === sg) && r.length === 1 && r[0].type === "text" && (r[0].text === og || r[0].text === sg) ? t.createNode("paragraph", void 0, []) : t.createNode("paragraph", void 0, r);
	},
	renderMarkdown: (e, t, n) => {
		if (!e) return "";
		let r = Array.isArray(e.content) ? e.content : [];
		if (r.length === 0) {
			let e = Array.isArray(n?.previousNode?.content) ? n.previousNode.content : [];
			return n?.previousNode?.type === "paragraph" && e.length === 0 ? og : "";
		}
		return t.renderChildren(r);
	},
	addCommands() {
		return { setParagraph: () => ({ commands: e }) => e.setNode(this.name) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
	}
}), lg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, ug = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, dg = kd.create({
	name: "strike",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [
			{ tag: "s" },
			{ tag: "del" },
			{ tag: "strike" },
			{
				style: "text-decoration",
				consuming: !1,
				getAttrs: (e) => e.includes("line-through") ? {} : !1
			}
		];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"s",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "del",
	parseMarkdown: (e, t) => t.applyMark("strike", t.parseInline(e.tokens || [])),
	renderMarkdown: (e, t) => `~~${t.renderChildren(e)}~~`,
	addCommands() {
		return {
			setStrike: () => ({ commands: e }) => e.setMark(this.name),
			toggleStrike: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetStrike: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-s": () => this.editor.commands.toggleStrike() };
	},
	addInputRules() {
		return [Zd({
			find: lg,
			type: this.type
		})];
	},
	addPasteRules() {
		return [af({
			find: ug,
			type: this.type
		})];
	}
}), fg = rf.create({
	name: "text",
	group: "inline",
	parseMarkdown: (e) => ({
		type: "text",
		text: e.text || ""
	}),
	renderMarkdown: (e) => e.text || ""
}), pg = kd.create({
	name: "underline",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	parseHTML() {
		return [{ tag: "u" }, {
			style: "text-decoration",
			consuming: !1,
			getAttrs: (e) => e.includes("underline") ? {} : !1
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"u",
			M(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown(e, t) {
		return t.applyMark(this.name || "underline", t.parseInline(e.tokens || []));
	},
	renderMarkdown(e, t) {
		return `++${t.renderChildren(e)}++`;
	},
	markdownTokenizer: {
		name: "underline",
		level: "inline",
		start(e) {
			return e.indexOf("++");
		},
		tokenize(e, t, n) {
			let r = /^(\+\+)([\s\S]+?)(\+\+)/.exec(e);
			if (!r) return;
			let i = r[2].trim();
			return {
				type: "underline",
				raw: r[0],
				text: i,
				tokens: n.inlineTokens(i)
			};
		}
	},
	addCommands() {
		return {
			setUnderline: () => ({ commands: e }) => e.setMark(this.name),
			toggleUnderline: () => ({ commands: e }) => e.toggleMark(this.name),
			unsetUnderline: () => ({ commands: e }) => e.unsetMark(this.name)
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-u": () => this.editor.commands.toggleUnderline(),
			"Mod-U": () => this.editor.commands.toggleUnderline()
		};
	}
}), mg = pg;
//#endregion
//#region node_modules/prosemirror-dropcursor/dist/index.js
function hg(e = {}) {
	return new E({ view(t) {
		return new gg(t, e);
	} });
}
var gg = class {
	constructor(e, t) {
		this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.lastDragEvent = null, this.width = t.width ?? 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = [
			"dragover",
			"dragend",
			"drop",
			"dragleave"
		].map((t) => {
			let n = (e) => {
				this[t](e);
			};
			return e.dom.addEventListener(t, n), {
				name: t,
				handler: n
			};
		});
	}
	destroy() {
		this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
	}
	update(e, t) {
		if (this.cursorPos != null && t.doc != e.state.doc) if (this.lastDragEvent) {
			let e = this.computeTarget(this.lastDragEvent);
			e == this.cursorPos ? this.updateOverlay() : this.setCursor(e);
		} else this.updateOverlay();
	}
	setCursor(e) {
		e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
	}
	updateOverlay() {
		let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, n, r = this.editorView.dom, i = r.getBoundingClientRect(), a = i.width / r.offsetWidth, o = i.height / r.offsetHeight;
		if (t) {
			let t = e.nodeBefore, r = e.nodeAfter;
			if (t || r) {
				let e = this.editorView.nodeDOM(this.cursorPos - (t ? t.nodeSize : 0));
				if (e) {
					let i = e.getBoundingClientRect(), a = t ? i.bottom : i.top;
					t && r && (a = (a + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2);
					let s = this.width / 2 * o;
					n = {
						left: i.left,
						right: i.right,
						top: a - s,
						bottom: a + s
					};
				}
			}
		}
		if (!n) {
			let e = this.editorView.coordsAtPos(this.cursorPos), t = this.width / 2 * a;
			n = {
				left: e.left - t,
				right: e.left + t,
				top: e.top,
				bottom: e.bottom
			};
		}
		let s = this.editorView.dom.offsetParent;
		this.element || (this.element = s.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
		let c, l;
		if (!s || s == document.body && getComputedStyle(s).position == "static") c = -pageXOffset, l = -pageYOffset;
		else {
			let e = s.getBoundingClientRect(), t = e.width / s.offsetWidth, n = e.height / s.offsetHeight;
			c = e.left - s.scrollLeft * t, l = e.top - s.scrollTop * n;
		}
		this.element.style.left = (n.left - c) / a + "px", this.element.style.top = (n.top - l) / o + "px", this.element.style.width = (n.right - n.left) / a + "px", this.element.style.height = (n.bottom - n.top) / o + "px";
	}
	scheduleRemoval(e) {
		clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
	}
	computeTarget(e) {
		let t = this.editorView.posAtCoords({
			left: e.clientX,
			top: e.clientY
		}), n = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), r = n && n.type.spec.disableDropCursor, i = typeof r == "function" ? r(this.editorView, t, e) : r;
		if (!t || i) return null;
		let a = t.pos;
		if (this.editorView.dragging && this.editorView.dragging.slice) {
			let e = Xt(this.editorView.state.doc, a, this.editorView.dragging.slice);
			e != null && (a = e);
		}
		return a;
	}
	dragover(e) {
		if (!this.editorView.editable) return;
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
}, _g = class e extends C {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : C.near(r);
	}
	content() {
		return d.empty;
	}
	eq(t) {
		return t instanceof e && t.head == this.head;
	}
	toJSON() {
		return {
			type: "gapcursor",
			pos: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for GapCursor.fromJSON");
		return new e(t.resolve(n.pos));
	}
	getBookmark() {
		return new vg(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !bg(e) || !xg(e)) return !1;
		let n = t.type.spec.allowGapCursor;
		if (n != null) return n;
		let r = t.contentMatchAt(e.index()).defaultType;
		return r && r.isTextblock;
	}
	static findGapCursorFrom(t, n, r = !1) {
		search: for (;;) {
			if (!r && e.valid(t)) return t;
			let i = t.pos, a = null;
			for (let r = t.depth;; r--) {
				let o = t.node(r);
				if (n > 0 ? t.indexAfter(r) < o.childCount : t.index(r) > 0) {
					a = o.child(n > 0 ? t.indexAfter(r) : t.index(r) - 1);
					break;
				} else if (r == 0) return null;
				i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			for (;;) {
				let o = n > 0 ? a.firstChild : a.lastChild;
				if (!o) {
					if (a.isAtom && !a.isText && !T.isSelectable(a)) {
						t = t.doc.resolve(i + a.nodeSize * n), r = !1;
						continue search;
					}
					break;
				}
				a = o, i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			return null;
		}
	}
};
_g.prototype.visible = !1, _g.findFrom = _g.findGapCursorFrom, C.jsonID("gapcursor", _g);
var vg = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return _g.valid(t) ? new _g(t) : C.near(t);
	}
};
function yg(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function bg(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
			continue;
		}
		for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || yg(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function xg(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
			continue;
		}
		for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || yg(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Sg() {
	return new E({ props: {
		decorations: Dg,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && _g.valid(n) ? new _g(n) : null;
		},
		handleClick: Tg,
		handleKeyDown: Cg,
		handleDOMEvents: { beforeinput: Eg }
	} });
}
var Cg = fc({
	ArrowLeft: wg("horiz", -1),
	ArrowRight: wg("horiz", 1),
	ArrowUp: wg("vert", -1),
	ArrowDown: wg("vert", 1)
});
function wg(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof w) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = _g.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new _g(c))), !0) : !1;
	};
}
function Tg(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!_g.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && T.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new _g(r))), !0);
}
function Eg(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof _g)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = a.empty;
	for (let e = r.length - 1; e >= 0; e--) i = a.from(r[e].createAndFill(null, i));
	let o = e.state.tr.replace(n.pos, n.pos, new d(i, 0, 0));
	return o.setSelection(w.near(o.doc.resolve(n.pos + 1))), e.dispatch(o), !1;
}
function Dg(e) {
	if (!(e.selection instanceof _g)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", O.create(e.doc, [us.widget(e.selection.head, t, { key: "gapcursor" })]);
}
//#endregion
//#region node_modules/rope-sequence/dist/index.js
var Og = 200, R = function() {};
R.prototype.append = function(e) {
	return e.length ? (e = R.from(e), !this.length && e || e.length < Og && this.leafAppend(e) || this.length < Og && e.leafPrepend(this) || this.appendInner(e)) : this;
}, R.prototype.prepend = function(e) {
	return e.length ? R.from(e).append(this) : this;
}, R.prototype.appendInner = function(e) {
	return new Ag(this, e);
}, R.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? R.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, R.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, R.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, R.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, R.from = function(e) {
	return e instanceof R ? e : e && e.length ? new kg(e) : R.empty;
};
var kg = /* @__PURE__ */ function(e) {
	function t(t) {
		e.call(this), this.values = t;
	}
	e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
	var n = {
		length: { configurable: !0 },
		depth: { configurable: !0 }
	};
	return t.prototype.flatten = function() {
		return this.values;
	}, t.prototype.sliceInner = function(e, n) {
		return e == 0 && n == this.length ? this : new t(this.values.slice(e, n));
	}, t.prototype.getInner = function(e) {
		return this.values[e];
	}, t.prototype.forEachInner = function(e, t, n, r) {
		for (var i = t; i < n; i++) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		for (var i = t - 1; i >= n; i--) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.leafAppend = function(e) {
		if (this.length + e.length <= Og) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= Og) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(R);
R.empty = new kg([]);
var Ag = /* @__PURE__ */ function(e) {
	function t(t, n) {
		e.call(this), this.left = t, this.right = n, this.length = t.length + n.length, this.depth = Math.max(t.depth, n.depth) + 1;
	}
	return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.flatten = function() {
		return this.left.flatten().concat(this.right.flatten());
	}, t.prototype.getInner = function(e) {
		return e < this.left.length ? this.left.get(e) : this.right.get(e - this.left.length);
	}, t.prototype.forEachInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t < i && this.left.forEachInner(e, t, Math.min(n, i), r) === !1 || n > i && this.right.forEachInner(e, Math.max(t - i, 0), Math.min(this.length, n) - i, r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t > i && this.right.forEachInvertedInner(e, t - i, Math.max(n, i) - i, r + i) === !1 || n < i && this.left.forEachInvertedInner(e, Math.min(t, i), n, r) === !1) return !1;
	}, t.prototype.sliceInner = function(e, t) {
		if (e == 0 && t == this.length) return this;
		var n = this.left.length;
		return t <= n ? this.left.slice(e, t) : e >= n ? this.right.slice(e - n, t - n) : this.left.slice(e, n).append(this.right.slice(0, t - n));
	}, t.prototype.leafAppend = function(e) {
		var n = this.right.leafAppend(e);
		if (n) return new t(this.left, n);
	}, t.prototype.leafPrepend = function(e) {
		var n = this.left.leafPrepend(e);
		if (n) return new t(n, this.right);
	}, t.prototype.appendInner = function(e) {
		return this.left.depth >= Math.max(this.right.depth, e.depth) + 1 ? new t(this.left, new t(this.right, e)) : new t(this, e);
	}, t;
}(R), jg = 500, Mg = class e {
	constructor(e, t) {
		this.items = e, this.eventCount = t;
	}
	popEvent(t, n) {
		if (this.eventCount == 0) return null;
		let r = this.items.length;
		for (;; r--) if (this.items.get(r - 1).selection) {
			--r;
			break;
		}
		let i, a;
		n && (i = this.remapping(r, this.items.length), a = i.maps.length);
		let o = t.tr, s, c, l = [], u = [];
		return this.items.forEach((t, n) => {
			if (!t.step) {
				i || (i = this.remapping(r, n + 1), a = i.maps.length), a--, u.push(t);
				return;
			}
			if (i) {
				u.push(new Pg(t.map));
				let e = t.step.map(i.slice(a)), n;
				e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new Pg(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
			} else o.maybeStep(t.step);
			if (t.selection) return s = i ? t.selection.map(i.slice(a)) : t.selection, c = new e(this.items.slice(0, r).append(u.reverse().concat(l)), this.eventCount - 1), !1;
		}, this.items.length, 0), {
			remaining: c,
			transform: o,
			selection: s
		};
	}
	addTransform(t, n, r, i) {
		let a = [], o = this.eventCount, s = this.items, c = !i && s.length ? s.get(s.length - 1) : null;
		for (let e = 0; e < t.steps.length; e++) {
			let r = t.steps[e].invert(t.docs[e]), l = new Pg(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > Ig && (s = Ng(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new mt();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new Pg(e))), this.eventCount);
	}
	rebased(t, n) {
		if (!this.eventCount) return this;
		let r = [], i = Math.max(0, this.items.length - n), a = t.mapping, o = t.steps.length, s = this.eventCount;
		this.items.forEach((e) => {
			e.selection && s--;
		}, i);
		let c = n;
		this.items.forEach((e) => {
			let n = a.getMirror(--c);
			if (n == null) return;
			o = Math.min(o, n);
			let i = a.maps[n];
			if (e.step) {
				let o = t.steps[n].invert(t.docs[n]), l = e.selection && e.selection.map(a.slice(c + 1, n));
				l && s++, r.push(new Pg(i, o, l));
			} else r.push(new Pg(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new Pg(a.maps[e]));
		let u = this.items.slice(0, i).append(l).append(r), d = new e(u, s);
		return d.emptyItemCount() > jg && (d = d.compress(this.items.length - r.length)), d;
	}
	emptyItemCount() {
		let e = 0;
		return this.items.forEach((t) => {
			t.step || e++;
		}), e;
	}
	compress(t = this.items.length) {
		let n = this.remapping(0, t), r = n.maps.length, i = [], a = 0;
		return this.items.forEach((e, o) => {
			if (o >= t) i.push(e), e.selection && a++;
			else if (e.step) {
				let t = e.step.map(n.slice(r)), o = t && t.getMap();
				if (r--, o && n.appendMap(o, r), t) {
					let s = e.selection && e.selection.map(n.slice(r));
					s && a++;
					let c = new Pg(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(R.from(i.reverse()), a);
	}
};
Mg.empty = new Mg(R.empty, 0);
function Ng(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var Pg = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, Fg = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, Ig = 20;
function Lg(e, t, n, r) {
	let i = n.getMeta(Gg), a;
	if (i) return i.historyState;
	n.getMeta(Kg) && (e = new Fg(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(Gg)) return o.getMeta(Gg).redo ? new Fg(e.done.addTransform(n, void 0, r, Wg(t)), e.undone, zg(n.mapping.maps), e.prevTime, e.prevComposition) : new Fg(e.done, e.undone.addTransform(n, void 0, r, Wg(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !Rg(n, e.prevRanges)), s = o ? Bg(e.prevRanges, n.mapping) : zg(n.mapping.maps);
		return new Fg(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, Wg(t)), Mg.empty, s, n.time, i ?? e.prevComposition);
	} else if (a = n.getMeta("rebased")) return new Fg(e.done.rebased(n, a), e.undone.rebased(n, a), Bg(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
	else return new Fg(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), Bg(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function Rg(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function zg(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function Bg(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function Vg(e, t, n) {
	let r = Wg(t), i = Gg.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new Fg(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(Gg, {
		redo: n,
		historyState: c
	});
}
var Hg = !1, Ug = null;
function Wg(e) {
	let t = e.plugins;
	if (Ug != t) {
		Hg = !1, Ug = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			Hg = !0;
			break;
		}
	}
	return Hg;
}
var Gg = new D("history"), Kg = new D("closeHistory");
function qg(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new E({
		key: Gg,
		state: {
			init() {
				return new Fg(Mg.empty, Mg.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return Lg(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? Yg : n == "historyRedo" ? Xg : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function Jg(e, t) {
	return (n, r) => {
		let i = Gg.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = Vg(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var Yg = Jg(!1, !0), Xg = Jg(!0, !0);
N.create({
	name: "characterCount",
	addOptions() {
		return {
			limit: null,
			autoTrim: !0,
			mode: "textSize",
			textCounter: (e) => e.length,
			wordCounter: (e) => e.split(" ").filter((e) => e !== "").length
		};
	},
	addStorage() {
		return {
			characters: () => 0,
			words: () => 0
		};
	},
	onBeforeCreate() {
		this.storage.characters = (e) => {
			let t = e?.node || this.editor.state.doc;
			if ((e?.mode || this.options.mode) === "textSize") {
				let e = t.textBetween(0, t.content.size, void 0, " ");
				return this.options.textCounter(e);
			}
			return t.nodeSize;
		}, this.storage.words = (e) => {
			let t = e?.node || this.editor.state.doc, n = t.textBetween(0, t.content.size, " ", " ");
			return this.options.wordCounter(n);
		};
	},
	addProseMirrorPlugins() {
		let e = !1;
		return [new E({
			key: new D("characterCount"),
			appendTransaction: (t, n, r) => {
				if (e) return;
				let i = this.options.limit, a = this.options.autoTrim;
				if (i == null || i === 0 || a === !1) {
					e = !0;
					return;
				}
				let o = this.storage.characters({ node: r.doc });
				if (o > i) {
					let t = o - i;
					console.warn(`[CharacterCount] Initial content exceeded limit of ${i} characters. Content was automatically trimmed.`);
					let n = r.tr.deleteRange(0, t);
					return e = !0, n;
				}
				e = !0;
			},
			filterTransaction: (e, t) => {
				let n = this.options.limit;
				if (!e.docChanged || n === 0 || n == null) return !0;
				let r = this.storage.characters({ node: t.doc }), i = this.storage.characters({ node: e.doc });
				if (i <= n || r > n && i > n && i <= r) return !0;
				if (r > n && i > n && i > r || !e.getMeta("paste")) return !1;
				let a = e.selection.$head.pos, o = a - (i - n), s = a;
				return e.deleteRange(o, s), !(this.storage.characters({ node: e.doc }) > n);
			}
		})];
	}
});
var Zg = N.create({
	name: "dropCursor",
	addOptions() {
		return {
			color: "currentColor",
			width: 1,
			class: void 0
		};
	},
	addProseMirrorPlugins() {
		return [hg(this.options)];
	}
});
N.create({
	name: "focus",
	addOptions() {
		return {
			className: "has-focus",
			mode: "all"
		};
	},
	addProseMirrorPlugins() {
		return [new E({
			key: new D("focus"),
			props: { decorations: ({ doc: e, selection: t }) => {
				let { isEditable: n, isFocused: r } = this.editor, { anchor: i } = t, a = [];
				if (!n || !r) return O.create(e, []);
				let o = 0;
				this.options.mode === "deepest" && e.descendants((e, t) => {
					if (!e.isText) {
						if (!(i >= t && i <= t + e.nodeSize - 1)) return !1;
						o += 1;
					}
				});
				let s = 0;
				return e.descendants((e, t) => {
					if (e.isText || !(i >= t && i <= t + e.nodeSize - 1)) return !1;
					if (s += 1, this.options.mode === "deepest" && o - s > 0 || this.options.mode === "shallowest" && s > 1) return this.options.mode === "deepest";
					a.push(us.node(t, t + e.nodeSize, { class: this.options.className }));
				}), O.create(e, a);
			} }
		})];
	}
});
var Qg = N.create({
	name: "gapCursor",
	addProseMirrorPlugins() {
		return [Sg()];
	},
	extendNodeSchema(e) {
		return { allowGapCursor: j(A(e, "allowGapCursor", {
			name: e.name,
			options: e.options,
			storage: e.storage
		})) ?? null };
	}
}), $g = "placeholder", e_ = new D("tiptap__placeholder");
function t_(e) {
	let { editor: t, placeholder: n, dataAttribute: r, pos: i, node: a, isEmptyDoc: o, hasAnchor: s, classes: { emptyNode: c, emptyEditor: l } } = e, u = [c];
	return o && u.push(l), us.node(i, i + a.nodeSize, {
		class: u.join(" "),
		[r]: typeof n == "function" ? n({
			editor: t,
			node: a,
			pos: i,
			hasAnchor: s
		}) : n
	});
}
function n_(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function r_({ editor: e, options: t, dataAttribute: n, doc: r, selection: i, from: a, to: o }) {
	let { anchor: s } = i, c = [], l = e.isEmpty;
	return r.nodesBetween(a, o, (r, i) => {
		let a = s >= i && s <= i + r.nodeSize, o = !r.isLeaf && Su(r);
		return r.type.isTextblock && (a || !t.showOnlyCurrent) && o && c.push(t_({
			editor: e,
			isEmptyDoc: l,
			dataAttribute: n,
			hasAnchor: a,
			placeholder: t.placeholder,
			classes: {
				emptyEditor: t.emptyEditorClass,
				emptyNode: n_(t.emptyNodeClass, {
					editor: e,
					node: r,
					pos: i,
					hasAnchor: a
				})
			},
			node: r,
			pos: i
		})), t.includeChildren;
	}), c;
}
function i_({ editor: e, options: t, dataAttribute: n, doc: r, selection: i }) {
	if (!(e.isEditable || !t.showOnlyWhenEditable)) return null;
	let { anchor: a } = i, o = [], s = e.isEmpty;
	if (t.showOnlyCurrent && !t.includeChildren) {
		let i = r.resolve(a), c = i.depth > 0 ? i.node(1) : i.nodeAfter, l = i.depth > 0 ? i.before(1) : a;
		if (c && c.type.isTextblock && Su(c)) {
			let r = a >= l && a <= l + c.nodeSize;
			o.push(t_({
				editor: e,
				isEmptyDoc: s,
				dataAttribute: n,
				hasAnchor: r,
				placeholder: t.placeholder,
				classes: {
					emptyEditor: t.emptyEditorClass,
					emptyNode: n_(t.emptyNodeClass, {
						editor: e,
						node: c,
						pos: l,
						hasAnchor: r
					})
				},
				node: c,
				pos: l
			}));
		}
	} else o.push(...r_({
		editor: e,
		options: t,
		dataAttribute: n,
		doc: r,
		selection: i,
		from: 0,
		to: r.content.size
	}));
	return O.create(r, o);
}
function a_(e, t) {
	let n = e.resolve(t);
	if (n.depth === 0) {
		let e = n.nodeAfter ?? n.nodeBefore;
		if (!e) return {
			from: t,
			to: t
		};
		let r = n.nodeAfter ? t : t - e.nodeSize;
		return {
			from: r,
			to: r + e.nodeSize
		};
	}
	let r = n.before(1);
	return {
		from: r,
		to: r + n.node(1).nodeSize
	};
}
function o_(e, t) {
	return {
		from: Math.max(0, t.from - 1),
		to: Math.min(e.content.size, t.to - 1)
	};
}
function s_(e, t, n) {
	let r = [];
	return e.forEach((e, i) => {
		let a = i, o = a + e.nodeSize, s = a + 1, c = o + 1;
		s < n && c > t && r.push({
			from: a,
			to: o
		});
	}), r;
}
function c_(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e.from - t.from), n = [{ ...t[0] }];
	for (let e = 1; e < t.length; e += 1) {
		let r = n[n.length - 1], i = t[e];
		i.from <= r.to ? r.to = Math.max(r.to, i.to) : n.push({ ...i });
	}
	return n;
}
function l_(e, t) {
	let n = s_(e, t.from, t.to);
	return n.push(o_(e, a_(e, t.from))), t.to > t.from ? n.push(o_(e, a_(e, Math.min(t.to, e.content.size + 1) - 1))) : t.from < e.content.size + 1 && n.push(o_(e, a_(e, Math.min(t.from + 1, e.content.size)))), n;
}
function u_(e, t, n) {
	let r = [];
	if (e.docChanged) {
		let t = lu(e);
		for (let e of t) r.push(...l_(n.doc, e.newRange));
	}
	return e.selectionSet && (r.push(o_(n.doc, a_(n.doc, e.mapping.map(t.selection.anchor)))), r.push(o_(n.doc, a_(n.doc, n.selection.anchor)))), c_(r);
}
function d_(e, t, n) {
	let r = Math.max(0, Math.min(e, n.content.size));
	return {
		from: r,
		to: Math.max(r, Math.min(t, n.content.size))
	};
}
function f_({ decorations: e, ranges: t, editor: n, options: r, dataAttribute: i, doc: a, selection: o }) {
	let s = e;
	for (let e of t) {
		let { from: t, to: c } = d_(e.from, e.to, a), l = s.find(t, c).filter((e) => e.from >= t && e.to <= c);
		l.length && (s = s.remove(l));
		let u = r_({
			editor: n,
			options: r,
			dataAttribute: i,
			doc: a,
			selection: o,
			from: t,
			to: c
		});
		u.length && (s = s.add(a, u));
	}
	return s;
}
function p_({ editor: e, options: t, dataAttribute: n }) {
	return {
		init(r, i) {
			return i_({
				editor: e,
				options: t,
				dataAttribute: n,
				doc: i.doc,
				selection: i.selection
			}) ?? O.empty;
		},
		apply(r, i, a, o) {
			return !r.docChanged && !r.selectionSet ? i : f_({
				decorations: i.map(r.mapping, r.doc),
				ranges: u_(r, a, o),
				editor: e,
				options: t,
				dataAttribute: n,
				doc: o.doc,
				selection: o.selection
			});
		}
	};
}
function m_(e) {
	return e.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
function h_({ editor: e, options: t }) {
	let n = t.dataAttribute ? `data-${m_(t.dataAttribute)}` : `data-${$g}`, r = t.showOnlyCurrent && !t.includeChildren;
	return new E({
		key: e_,
		...r ? {} : { state: p_({
			editor: e,
			options: t,
			dataAttribute: n
		}) },
		props: { decorations: r ? ({ doc: r, selection: i }) => i_({
			editor: e,
			options: t,
			dataAttribute: n,
			doc: r,
			selection: i
		}) : (n) => t.showOnlyWhenEditable && !e.isEditable ? O.empty : e_.getState(n) ?? O.empty }
	});
}
var g_ = N.create({
	name: "placeholder",
	addOptions() {
		return {
			emptyEditorClass: "is-editor-empty",
			emptyNodeClass: "is-empty",
			dataAttribute: $g,
			placeholder: "Write something …",
			showOnlyWhenEditable: !0,
			showOnlyCurrent: !0,
			includeChildren: !1
		};
	},
	addProseMirrorPlugins() {
		return [h_({
			editor: this.editor,
			options: this.options
		})];
	}
});
function __(e, t) {
	return !e.selection.empty && !Cu(e.selection) && t.isEditable;
}
function v_(e, t) {
	return __(e, t) && !t.isFocused && !t.view.dragging;
}
function y_() {
	window.getSelection()?.removeAllRanges();
}
function b_(e) {
	e.focus();
}
N.create({
	name: "selection",
	addOptions() {
		return { className: "selection" };
	},
	addProseMirrorPlugins() {
		let { editor: e, options: t } = this;
		return [new E({
			key: new D("selection"),
			props: {
				decorations(n) {
					return v_(n, e) ? O.create(n.doc, [us.inline(n.selection.from, n.selection.to, { class: t.className })]) : null;
				},
				handleDOMEvents: {
					blur(t) {
						return __(t.state, e) && y_(), !1;
					},
					focus(t) {
						return __(t.state, e) && requestAnimationFrame(() => {
							!e.isDestroyed && t.hasFocus() && b_(t);
						}), !1;
					}
				}
			}
		})];
	}
});
function x_({ types: e, node: t }) {
	return t && Array.isArray(e) && e.includes(t.type) || t?.type === e;
}
var S_ = N.create({
	name: "trailingNode",
	addOptions() {
		return {
			node: void 0,
			notAfter: []
		};
	},
	addProseMirrorPlugins() {
		let e = new D(this.name), t = this.options.node || this.editor.schema.topNodeType.contentMatch.defaultType?.name || "paragraph", n = Object.entries(this.editor.schema.nodes).map(([, e]) => e).filter((e) => (this.options.notAfter || []).concat(t).includes(e.name));
		return [new E({
			key: e,
			appendTransaction: (n, r, i) => {
				let { doc: a, tr: o, schema: s } = i, c = e.getState(i), l = a.content.size, u = s.nodes[t];
				if (!n.some((e) => e.getMeta("skipTrailingNode")) && c) return o.insert(l, u.create());
			},
			state: {
				init: (e, t) => {
					let r = t.tr.doc.lastChild;
					return !x_({
						node: r,
						types: n
					});
				},
				apply: (e, t) => {
					if (!e.docChanged || e.getMeta("__uniqueIDTransaction")) return t;
					let r = e.doc.lastChild;
					return !x_({
						node: r,
						types: n
					});
				}
			}
		})];
	}
}), C_ = N.create({
	name: "undoRedo",
	addOptions() {
		return {
			depth: 100,
			newGroupDelay: 500
		};
	},
	addCommands() {
		return {
			undo: () => ({ state: e, dispatch: t }) => Yg(e, t),
			redo: () => ({ state: e, dispatch: t }) => Xg(e, t)
		};
	},
	addProseMirrorPlugins() {
		return [qg(this.options)];
	},
	addKeyboardShortcuts() {
		return {
			"Mod-z": () => this.editor.commands.undo(),
			"Shift-Mod-z": () => this.editor.commands.redo(),
			"Mod-y": () => this.editor.commands.redo(),
			"Mod-я": () => this.editor.commands.undo(),
			"Shift-Mod-я": () => this.editor.commands.redo()
		};
	}
}), w_ = N.create({
	name: "starterKit",
	addExtensions() {
		let e = [];
		return this.options.bold !== !1 && e.push(mf.configure(this.options.bold)), this.options.blockquote !== !1 && e.push(lf.configure(this.options.blockquote)), this.options.bulletList !== !1 && e.push(ah.configure(this.options.bulletList)), this.options.code !== !1 && e.push(_f.configure(this.options.code)), this.options.codeBlock !== !1 && e.push(xf.configure(this.options.codeBlock)), this.options.document !== !1 && e.push(Sf.configure(this.options.document)), this.options.dropcursor !== !1 && e.push(Zg.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && e.push(Qg.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && e.push(Cf.configure(this.options.hardBreak)), this.options.heading !== !1 && e.push(wf.configure(this.options.heading)), this.options.undoRedo !== !1 && e.push(C_.configure(this.options.undoRedo)), this.options.horizontalRule !== !1 && e.push(Tf.configure(this.options.horizontalRule)), this.options.italic !== !1 && e.push(Af.configure(this.options.italic)), this.options.listItem !== !1 && e.push(Oh.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(zh.configure(this.options?.listKeymap)), this.options.link !== !1 && e.push(Qm.configure(this.options?.link)), this.options.orderedList !== !1 && e.push(ng.configure(this.options.orderedList)), this.options.paragraph !== !1 && e.push(cg.configure(this.options.paragraph)), this.options.strike !== !1 && e.push(dg.configure(this.options.strike)), this.options.text !== !1 && e.push(fg.configure(this.options.text)), this.options.underline !== !1 && e.push(pg.configure(this.options?.underline)), this.options.trailingNode !== !1 && e.push(S_.configure(this.options?.trailingNode)), e;
	}
}), T_ = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/, E_ = rf.create({
	name: "image",
	addOptions() {
		return {
			inline: !1,
			allowBase64: !1,
			HTMLAttributes: {},
			resize: !1
		};
	},
	inline() {
		return this.options.inline;
	},
	group() {
		return this.options.inline ? "inline" : "block";
	},
	draggable: !0,
	addAttributes() {
		return {
			src: { default: null },
			alt: { default: null },
			title: { default: null },
			width: { default: null },
			height: { default: null }
		};
	},
	parseHTML() {
		return [{ tag: this.options.allowBase64 ? "img[src]" : "img[src]:not([src^=\"data:\"])" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["img", M(this.options.HTMLAttributes, e)];
	},
	parseMarkdown: (e, t) => t.createNode("image", {
		src: e.href,
		title: e.title,
		alt: e.text
	}),
	renderMarkdown: (e) => {
		let t = e.attrs?.src ?? "", n = e.attrs?.alt ?? "", r = e.attrs?.title ?? "";
		return r ? `![${n}](${t} "${r}")` : `![${n}](${t})`;
	},
	addNodeView() {
		if (!this.options.resize || !this.options.resize.enabled || typeof document > "u") return null;
		let { directions: e, minWidth: t, minHeight: n, alwaysPreserveAspectRatio: r } = this.options.resize, i = /* @__PURE__ */ new Set([
			"src",
			"width",
			"height"
		]);
		return ({ node: a, getPos: o, HTMLAttributes: s, editor: c }) => {
			let l = document.createElement("img");
			l.draggable = !1;
			let u = M(this.options.HTMLAttributes, s);
			Object.entries(u).forEach(([e, t]) => {
				if (t != null) switch (e) {
					case "src":
					case "width":
					case "height": break;
					default:
						l.setAttribute(e, t);
						break;
				}
			}), u.src !== null && (l.src = u.src);
			let d = { ...s }, f = (e) => {
				if (typeof e == "string" && e !== "") {
					l.getAttribute("src") !== e && (l.src = e);
					return;
				}
				l.hasAttribute("src") && l.removeAttribute("src"), l.src !== "" && (l.src = "");
			};
			f(s.src);
			let p = new nf({
				element: l,
				editor: c,
				node: a,
				getPos: o,
				onResize: (e, t) => {
					l.style.width = `${e}px`, l.style.height = `${t}px`;
				},
				onCommit: (e, t) => {
					let n = o();
					n !== void 0 && this.editor.chain().setNodeSelection(n).updateAttributes(this.name, {
						width: e,
						height: t
					}).run();
				},
				onUpdate: (e) => {
					if (e.type !== a.type) return !1;
					let t = Gl(e, c.extensionManager.attributes.filter((t) => t.type === e.type.name));
					return Object.keys(d).forEach((e) => {
						!i.has(e) && !(e in t) && l.removeAttribute(e);
					}), Object.entries(t).forEach(([e, t]) => {
						i.has(e) || (t == null ? l.removeAttribute(e) : l.setAttribute(e, t));
					}), f(t.src), d = t, !0;
				},
				options: {
					directions: e,
					min: {
						width: t,
						height: n
					},
					preserveAspectRatio: r === !0
				}
			}), m = p.dom;
			return m.style.visibility = "hidden", m.style.pointerEvents = "none", l.onload = () => {
				m.style.visibility = "", m.style.pointerEvents = "";
			}, p;
		};
	},
	addCommands() {
		return { setImage: (e) => ({ commands: t }) => t.insertContent({
			type: this.name,
			attrs: e
		}) };
	},
	addInputRules() {
		return [Qd({
			find: T_,
			type: this.type,
			getAttributes: (e) => {
				let [, , t, n, r] = e;
				return {
					src: n,
					alt: t,
					title: r
				};
			}
		})];
	}
}), D_ = ag, O_ = ig;
//#endregion
//#region node_modules/marked/lib/marked.esm.js
function k_() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var A_ = k_();
function j_(e) {
	A_ = e;
}
var M_ = { exec: () => null };
function z(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(P_.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var N_ = (() => {
	try {
		return !!/* @__PURE__ */ RegExp("(?<=1)(?<!1)");
	} catch {
		return !1;
	}
})(), P_ = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
	hrRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
	fencesBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
	headingBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
	htmlBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"),
	blockquoteBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}>`)
}, F_ = /^(?:[ \t]*(?:\n|$))+/, I_ = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, L_ = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, R_ = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, z_ = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, B_ = / {0,3}(?:[*+-]|\d{1,9}[.)])/, V_ = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, H_ = z(V_).replace(/bull/g, B_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), U_ = z(V_).replace(/bull/g, B_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), W_ = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, G_ = /^[^\n]+/, K_ = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, q_ = z(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", K_).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), J_ = z(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, B_).getRegex(), Y_ = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", X_ = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Z_ = z("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", X_).replace("tag", Y_).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Q_ = z(W_).replace("hr", R_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Y_).getRegex(), $_ = {
	blockquote: z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Q_).getRegex(),
	code: I_,
	def: q_,
	fences: L_,
	heading: z_,
	hr: R_,
	html: Z_,
	lheading: H_,
	list: J_,
	newline: F_,
	paragraph: Q_,
	table: M_,
	text: G_
}, ev = z("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", R_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Y_).getRegex(), tv = {
	...$_,
	lheading: U_,
	table: ev,
	paragraph: z(W_).replace("hr", R_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ev).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Y_).getRegex()
}, nv = {
	...$_,
	html: z("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", X_).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: M_,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: z(W_).replace("hr", R_).replace("heading", " *#{1,6} *[^\n]").replace("lheading", H_).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, rv = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, iv = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, av = /^( {2,}|\\)\n(?!\s*$)/, ov = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, sv = /[\p{P}\p{S}]/u, cv = /[\s\p{P}\p{S}]/u, lv = /[^\s\p{P}\p{S}]/u, uv = z(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, cv).getRegex(), dv = /(?!~)[\p{P}\p{S}]/u, fv = /(?!~)[\s\p{P}\p{S}]/u, pv = /(?:[^\s\p{P}\p{S}]|~)/u, mv = z(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", N_ ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), hv = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, gv = z(hv, "u").replace(/punct/g, sv).getRegex(), _v = z(hv, "u").replace(/punct/g, dv).getRegex(), vv = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", yv = z(vv, "gu").replace(/notPunctSpace/g, lv).replace(/punctSpace/g, cv).replace(/punct/g, sv).getRegex(), bv = z(vv, "gu").replace(/notPunctSpace/g, pv).replace(/punctSpace/g, fv).replace(/punct/g, dv).getRegex(), xv = z("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, lv).replace(/punctSpace/g, cv).replace(/punct/g, sv).getRegex(), Sv = z(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, sv).getRegex(), Cv = z("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, lv).replace(/punctSpace/g, cv).replace(/punct/g, sv).getRegex(), wv = z(/\\(punct)/, "gu").replace(/punct/g, sv).getRegex(), Tv = z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ev = z(X_).replace("(?:-->|$)", "-->").getRegex(), Dv = z("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ev).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Ov = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, kv = z(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Ov).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Av = z(/^!?\[(label)\]\[(ref)\]/).replace("label", Ov).replace("ref", K_).getRegex(), jv = z(/^!?\[(ref)\](?:\[\])?/).replace("ref", K_).getRegex(), Mv = z("reflink|nolink(?!\\()", "g").replace("reflink", Av).replace("nolink", jv).getRegex(), Nv = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Pv = {
	_backpedal: M_,
	anyPunctuation: wv,
	autolink: Tv,
	blockSkip: mv,
	br: av,
	code: iv,
	del: M_,
	delLDelim: M_,
	delRDelim: M_,
	emStrongLDelim: gv,
	emStrongRDelimAst: yv,
	emStrongRDelimUnd: xv,
	escape: rv,
	link: kv,
	nolink: jv,
	punctuation: uv,
	reflink: Av,
	reflinkSearch: Mv,
	tag: Dv,
	text: ov,
	url: M_
}, Fv = {
	...Pv,
	link: z(/^!?\[(label)\]\((.*?)\)/).replace("label", Ov).getRegex(),
	reflink: z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Ov).getRegex()
}, Iv = {
	...Pv,
	emStrongRDelimAst: bv,
	emStrongLDelim: _v,
	delLDelim: Sv,
	delRDelim: Cv,
	url: z(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Nv).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: z(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Nv).getRegex()
}, Lv = {
	...Iv,
	br: z(av).replace("{2,}", "*").getRegex(),
	text: z(Iv.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Rv = {
	normal: $_,
	gfm: tv,
	pedantic: nv
}, zv = {
	normal: Pv,
	gfm: Iv,
	breaks: Lv,
	pedantic: Fv
}, Bv = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, Vv = (e) => Bv[e];
function Hv(e, t) {
	if (t) {
		if (P_.escapeTest.test(e)) return e.replace(P_.escapeReplace, Vv);
	} else if (P_.escapeTestNoEncode.test(e)) return e.replace(P_.escapeReplaceNoEncode, Vv);
	return e;
}
function Uv(e) {
	try {
		e = encodeURI(e).replace(P_.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Wv(e, t) {
	let n = e.replace(P_.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(P_.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
	else for (; n.length < t;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(P_.slashPipe, "|");
	return n;
}
function Gv(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function Kv(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function qv(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function Jv(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1");
	r.state.inLink = !0;
	let c = {
		type: e[0].charAt(0) === "!" ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: r.inlineTokens(s)
	};
	return r.state.inLink = !1, c;
}
function Yv(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return r.length >= i.length ? e.slice(i.length) : e;
	}).join("\n");
}
var Xv = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || A_;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = t[0].replace(this.rules.other.codeRemoveIndent, "");
			return {
				type: "code",
				raw: t[0],
				codeBlockStyle: "indented",
				text: this.options.pedantic ? e : Gv(e, "\n")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = Yv(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = Gv(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: t[0],
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: Gv(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = Gv(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o;
				for (o = 0; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.blockquote(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - t.raw.length) + o.raw, r = r.substring(0, r.length - t.text.length) + o.text;
					break;
				} else if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = qv(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
				if (this.options.pedantic ? (d = 2, s = c.trimStart()) : u ? d = t[1].length + 1 : (d = c.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, s = c.slice(d), d += t[1].length), u && this.rules.other.blankLine.test(l) && (r += l + "\n", e = e.substring(l.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(d), n = this.rules.other.hrRegex(d), i = this.rules.other.fencesBeginRegex(d), a = this.rules.other.headingBeginRegex(d), o = this.rules.other.htmlBeginRegex(d), f = this.rules.other.blockquoteBeginRegex(d);
					for (; e;) {
						let p = e.split("\n", 1)[0], m;
						if (l = p, this.options.pedantic ? (l = l.replace(this.rules.other.listReplaceNesting, "  "), m = l) : m = l.replace(this.rules.other.tabCharGlobal, "    "), i.test(l) || a.test(l) || o.test(l) || f.test(l) || t.test(l) || n.test(l)) break;
						if (m.search(this.rules.other.nonSpaceChar) >= d || !l.trim()) s += "\n" + m.slice(d);
						else {
							if (u || c.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(c) || a.test(c) || n.test(c)) break;
							s += "\n" + l;
						}
						u = !l.trim(), r += p + "\n", e = e.substring(p.length + 1), c = m.slice(d);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0)), i.items.push({
					type: "list_item",
					raw: r,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e of i.items) {
				if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), e.task) {
					if (e.text = e.text.replace(this.rules.other.listReplaceTask, ""), e.tokens[0]?.type === "text" || e.tokens[0]?.type === "paragraph") {
						e.tokens[0].raw = e.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), e.tokens[0].text = e.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
						for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
							this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
							break;
						}
					}
					let t = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (t) {
						let n = {
							type: "checkbox",
							raw: t[0] + " ",
							checked: t[0] !== "[ ]"
						};
						e.checked = n.checked, i.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = n.raw + e.tokens[0].raw, e.tokens[0].text = n.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(n)) : e.tokens.unshift({
							type: "paragraph",
							raw: n.raw,
							text: n.raw,
							tokens: [n]
						}) : e.tokens.unshift(n);
					}
				}
				if (!i.loose) {
					let t = e.tokens.filter((e) => e.type === "space");
					i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
				}
			}
			if (i.loose) for (let e of i.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) return {
			type: "html",
			block: !0,
			raw: t[0],
			pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
			text: t[0]
		};
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: t[0],
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = Wv(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: t[0],
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(Wv(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: t[0],
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let e = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(e)) {
				if (!this.rules.other.endAngleBracket.test(e)) return;
				let t = Gv(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = Kv(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let n = t[2], r = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(n);
				e && (n = e[1], r = e[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), Jv(t, {
				href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let e = t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!e) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return Jv(n, e, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (c.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = c.exec(t)) !== null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
				if (a = [...i].length, r[3] || r[4]) {
					o += a;
					continue;
				} else if ((r[5] || r[6]) && n % 3 && !((n + a) % 3)) {
					s += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o + s);
				let t = [...r[0]][0].length, c = e.slice(0, n + r.index + t + a);
				if (Math.min(n, a) % 2) {
					let e = c.slice(1, -1);
					return {
						type: "em",
						raw: c,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = c.slice(2, -2);
				return {
					type: "strong",
					raw: c,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim;
			for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) !== null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: t[0],
				escaped: e
			};
		}
	}
}, Zv = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || A_, this.options.tokenizer = this.options.tokenizer || new Xv(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let t = {
			other: P_,
			block: Rv.normal,
			inline: zv.normal
		};
		this.options.pedantic ? (t.block = Rv.pedantic, t.inline = zv.pedantic) : this.options.gfm && (t.block = Rv.gfm, this.options.breaks ? t.inline = zv.breaks : t.inline = zv.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Rv,
			inline: zv
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(P_.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(P_.tabCharGlobal, "    ").replace(P_.spaceLine, "")); e;) {
			let r;
			if (this.options.extensions?.block?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.space(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(r);
				continue;
			}
			if (r = this.tokenizer.code(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.fences(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.heading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.hr(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.blockquote(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.list(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.html(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.def(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
					href: r.href,
					title: r.title
				}, t.push(r));
				continue;
			}
			if (r = this.tokenizer.table(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.lheading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startBlock) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (this.state.top && (r = this.tokenizer.paragraph(i))) {
				let a = t.at(-1);
				n && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith("\n") ? "" : "\n") + r.raw, a.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
				continue;
			}
			if (r = this.tokenizer.text(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e, r = null;
		if (this.tokens.links) {
			let e = Object.keys(this.tokens.links);
			if (e.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) !== null;) e.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
		}
		for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) !== null;) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		let i;
		for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) !== null;) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let a = !1, o = "";
		for (; e;) {
			a || (o = ""), a = !1;
			let r;
			if (this.options.extensions?.inline?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.escape(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.tag(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.link(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.type === "text" && n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.emStrong(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.codespan(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.br(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.del(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.autolink(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (!this.state.inLink && (r = this.tokenizer.url(e))) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startInline) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (r = this.tokenizer.inlineText(i)) {
				e = e.substring(r.raw.length), r.raw.slice(-1) !== "_" && (o = r.raw.slice(-1)), a = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return t;
	}
}, Qv = class {
	options;
	parser;
	constructor(e) {
		this.options = e || A_;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(P_.notSpaceStart)?.[0], i = e.replace(P_.endingNewline, "") + "\n";
		return r ? "<pre><code class=\"language-" + Hv(r) + "\">" + (n ? i : Hv(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : Hv(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${Hv(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let r = this.parser.parseInline(n), i = Uv(e);
		if (i === null) return r;
		e = i;
		let a = "<a href=\"" + e + "\"";
		return t && (a += " title=\"" + Hv(t) + "\""), a += ">" + r + "</a>", a;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Uv(e);
		if (i === null) return Hv(n);
		e = i;
		let a = `<img src="${e}" alt="${Hv(n)}"`;
		return t && (a += ` title="${Hv(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Hv(e.text);
	}
}, $v = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, ey = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || A_, this.options.renderer = this.options.renderer || new Qv(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $v();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, ty = class {
	options;
	block;
	constructor(e) {
		this.options = e || A_;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer(e = this.block) {
		return e ? Zv.lex : Zv.lexInline;
	}
	provideParser(e = this.block) {
		return e ? ey.parse : ey.parseInline;
	}
}, ny = new class {
	defaults = k_();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = ey;
	Renderer = Qv;
	TextRenderer = $v;
	Lexer = Zv;
	Tokenizer = Xv;
	Hooks = ty;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(Infinity);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new Qv(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new Xv(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new ty();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					ty.passThroughHooks.has(n) ? t[r] = (e) => {
						if (this.defaults.async && ty.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : t[r] = (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return Zv.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return ey.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Zv.lex : Zv.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? ey.parse : ey.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? Zv.lex : Zv.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? ey.parse : ey.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + Hv(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function B(e, t) {
	return ny.parse(e, t);
}
B.options = B.setOptions = function(e) {
	return ny.setOptions(e), B.defaults = ny.defaults, j_(B.defaults), B;
}, B.getDefaults = k_, B.defaults = A_, B.use = function(...e) {
	return ny.use(...e), B.defaults = ny.defaults, j_(B.defaults), B;
}, B.walkTokens = function(e, t) {
	return ny.walkTokens(e, t);
}, B.parseInline = ny.parseInline, B.Parser = ey, B.parser = ey.parse, B.Renderer = Qv, B.TextRenderer = $v, B.Lexer = Zv, B.lexer = Zv.lex, B.Tokenizer = Xv, B.Hooks = ty, B.parse = B, B.options, B.setOptions, B.use, B.walkTokens, B.parseInline, ey.parse, Zv.lex;
//#endregion
//#region node_modules/@tiptap/markdown/dist/index.js
var ry = /\n[^\S\n]*(?:\n[^\S\n]*)+$/;
function iy(e) {
	return e.flatMap((t, n) => {
		if (t.type === "space" || e[n + 1]?.type === "space") return [t];
		let r = (t.raw || "").match(ry);
		return r ? [{
			...t,
			raw: (t.raw || "").slice(0, -r[0].length)
		}, {
			type: "space",
			raw: r[0]
		}] : [t];
	});
}
function ay(e, t) {
	let n = t.split("\n").flatMap((e) => [e, ""]).map((t) => `${e}${t}`).join("\n");
	return n.slice(0, n.length - 1);
}
function oy(e, t) {
	let n = [];
	return Array.from(e.entries()).forEach(([e, r]) => {
		if (!t) {
			n.push(e);
			return;
		}
		(t.marks || []).find((t) => t.type === e && nd(t.attrs, r.attrs)) || n.push(e);
	}), n;
}
function sy(e, t) {
	let n = [];
	return Array.from(t.entries()).forEach(([t, r]) => {
		let i = e.get(t);
		(!i || !nd(i.attrs, r.attrs)) && n.push({
			type: t,
			mark: r
		});
	}), n;
}
function cy(e, t, n, r) {
	let i = !n, a = n && (!n.marks || n.marks.length === 0), o = n && n.marks && !r(t, new Map(n.marks.map((e) => [e.type, e]))), s = [];
	return (i || a || o) && (n && n.marks ? Array.from(e.entries()).reverse().forEach(([e, t]) => {
		n.marks.find((n) => n.type === e && nd(n.attrs, t.attrs)) || s.push(e);
	}) : (i || a) && s.push(...Array.from(e.keys()).reverse())), s;
}
function ly(e, t) {
	let n = "";
	return Array.from(e.keys()).reverse().forEach((r) => {
		let i = t(r, e.get(r));
		i && (n = i + n);
	}), e.clear(), n;
}
function uy(e, t, n) {
	let r = "";
	return Array.from(e.entries()).forEach(([e, i]) => {
		let a = n(e, i);
		a && (r += a), t.set(e, i);
	}), r;
}
function dy(e) {
	let t = (e.raw || e.text || "").match(/^(\s*)[-+*]\s+\[([ xX])\]\s+/);
	return t ? {
		isTask: !0,
		checked: t[2].toLowerCase() === "x",
		indentLevel: t[1].length
	} : {
		isTask: !1,
		indentLevel: 0
	};
}
function fy(e, t) {
	return typeof e == "string" ? t : "json";
}
var py = /* @__PURE__ */ new Set(/* @__PURE__ */ "a.abbr.address.area.article.aside.audio.b.base.bdi.bdo.blockquote.body.br.button.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.iframe.img.input.ins.kbd.label.legend.li.link.main.map.mark.menu.meta.meter.nav.noscript.object.ol.optgroup.option.output.p.param.picture.pre.progress.q.rp.rt.ruby.s.samp.script.search.section.select.slot.small.source.span.strong.style.sub.summary.sup.svg.circle.clippath.defs.ellipse.foreignobject.g.image.line.lineargradient.mask.path.polygon.polyline.radialgradient.rect.stop.switch.symbol.textpath.tspan.use.table.tbody.td.template.textarea.tfoot.th.thead.time.title.tr.track.u.ul.var.video.wbr".split(".")), my = /<\/?([a-zA-Z][\w-]*)/g;
function hy(e) {
	let t = [], n;
	for (; (n = my.exec(e)) !== null;) t.push(n[1].toLowerCase());
	return t;
}
function gy(e) {
	let t = e.toLowerCase();
	return !t.includes("-") && !py.has(t);
}
function _y(e, t) {
	return hy(e).some((e) => gy(e) ? !t.has(e) : !1);
}
var vy = class {
	constructor(e) {
		this.activeParseLexer = null, this.extensionRanks = /* @__PURE__ */ new Map(), this.baseExtensions = [], this.extensions = [], this.codeTypes = /* @__PURE__ */ new Set(), this.schemaParseDomTagsCache = null, this.lastParseResult = null, this.markedInstance = e?.marked ?? B, this.indentStyle = e?.indentation?.style ?? "space", this.indentSize = e?.indentation?.size ?? 2, this.baseExtensions = e?.extensions || [], e?.markedOptions && typeof this.markedInstance.setOptions == "function" && this.markedInstance.setOptions(e.markedOptions), this.registry = /* @__PURE__ */ new Map(), this.nodeTypeRegistry = /* @__PURE__ */ new Map(), e?.extensions && (this.baseExtensions = e.extensions, Ql(Ll(e.extensions)).forEach((e) => this.registerExtension(e)));
	}
	get instance() {
		return this.markedInstance;
	}
	get indentCharacter() {
		return this.indentStyle === "space" ? " " : "	";
	}
	get indentString() {
		return this.indentCharacter.repeat(this.indentSize);
	}
	hasMarked() {
		return !!this.markedInstance;
	}
	registerExtension(e) {
		this.extensions.push(e);
		let t = j(A(e, "code")), n = e.name;
		t && this.codeTypes.add(n), this.extensionRanks.has(n) || this.extensionRanks.set(n, this.extensionRanks.size);
		let r = A(e, "markdownTokenName") || n, i = A(e, "parseMarkdown"), a = A(e, "renderMarkdown"), o = A(e, "markdownTokenizer"), s = A(e, "markdownOptions") ?? null, c = {
			tokenName: r,
			nodeName: n,
			parseMarkdown: i,
			renderMarkdown: a,
			isIndenting: s?.indentsContent ?? !1,
			htmlReopen: s?.htmlReopen,
			tokenizer: o
		};
		if (r && i) {
			let e = this.registry.get(r) || [];
			e.push(c), this.registry.set(r, e);
		}
		if (a) {
			let e = this.nodeTypeRegistry.get(n) || [];
			e.push(c), this.nodeTypeRegistry.set(n, e);
		}
		o && this.hasMarked() && this.registerTokenizer(o);
	}
	createLexer() {
		return new this.markedInstance.Lexer(this.markedInstance.defaults);
	}
	createTokenizerHelpers(e) {
		return {
			inlineTokens: (t) => e.inlineTokens(t),
			blockTokens: (t) => e.blockTokens(t)
		};
	}
	tokenizeInline(e) {
		return (this.activeParseLexer ?? this.createLexer()).inlineTokens(e);
	}
	registerTokenizer(e) {
		if (!this.hasMarked()) return;
		let { name: t, start: n, level: r = "inline", tokenize: i } = e, a = this.createTokenizerHelpers.bind(this), o = this.createLexer.bind(this), s;
		s = n ? typeof n == "function" ? n : (e) => e.indexOf(n) : (e) => {
			let t = i(e, [], this.createTokenizerHelpers(this.createLexer()));
			return t && t.raw ? e.indexOf(t.raw) : -1;
		};
		let c = {
			name: t,
			level: r,
			start: s,
			tokenizer(e, n) {
				let r = this.lexer ? a(this.lexer) : a(o()), s = i(e, n, r);
				if (s && s.type) return {
					...s,
					type: s.type || t,
					raw: s.raw || "",
					tokens: s.tokens || []
				};
			},
			childTokens: []
		};
		this.markedInstance.use({ extensions: [c] });
	}
	getHandlersForToken(e) {
		try {
			return this.registry.get(e) || [];
		} catch {
			return [];
		}
	}
	getHandlerForToken(e) {
		let t = this.getHandlersForToken(e);
		if (t.length > 0) return t[0];
		let n = this.getHandlersForNodeType(e);
		return n.length > 0 ? n[0] : void 0;
	}
	getHandlersForNodeType(e) {
		try {
			return this.nodeTypeRegistry.get(e) || [];
		} catch {
			return [];
		}
	}
	serialize(e) {
		if (!e) return "";
		let t = this.renderNodes(e, e);
		return this.isEmptyOutput(t) ? "" : t;
	}
	isEmptyOutput(e) {
		return !e || e.trim() === "" || e.replace(/&nbsp;/g, "").replace(/\u00A0/g, "").trim() === "";
	}
	parse(e) {
		if (!this.hasMarked()) throw Error("No marked instance available for parsing");
		let t = this.activeParseLexer, n = this.createLexer();
		this.activeParseLexer = n;
		try {
			let t = n.lex(e);
			return {
				type: "doc",
				content: this.parseTokens(t, !0)
			};
		} finally {
			this.activeParseLexer = t;
		}
	}
	parseTokens(e, t = !1) {
		let n = t ? iy(e) : e, r = n.reduce((e, t, n) => (t.type !== "space" && e.push(n), e), []), i = -1, a = 0;
		return n.flatMap((e, n) => {
			for (; a < r.length && r[a] < n;) i = r[a], a += 1;
			if (t && e.type === "space") {
				let t = r[a] ?? -1;
				return this.createImplicitEmptyParagraphsFromSpace(e, i, t);
			}
			let o = this.parseToken(e, t);
			return o === null ? [] : Array.isArray(o) ? o : [o];
		});
	}
	createImplicitEmptyParagraphsFromSpace(e, t, n) {
		let r = this.countParagraphSeparators(e.raw || "");
		if (r === 0) return [];
		let i = Math.max(r - +!(t === -1 || n === -1), 0);
		return Array.from({ length: i }, () => ({
			type: "paragraph",
			content: []
		}));
	}
	countParagraphSeparators(e) {
		return (e.replace(/\r\n/g, "\n").match(/\n\n/g) || []).length;
	}
	parseToken(e, t = !1) {
		if (!e.type) return null;
		if (e.type === "list") return this.parseListToken(e);
		let n = this.getHandlersForToken(e.type), r = this.createParseHelpers();
		if (n.find((t) => {
			if (!t.parseMarkdown) return !1;
			let n = t.parseMarkdown(e, r), i = this.normalizeParseResult(n);
			return i && (!Array.isArray(i) || i.length > 0) ? (this.lastParseResult = i, !0) : !1;
		}) && this.lastParseResult) {
			let e = this.lastParseResult;
			return this.lastParseResult = null, e;
		}
		return this.parseFallbackToken(e, t);
	}
	parseListToken(e) {
		if (!e.items || e.items.length === 0) return this.parseTokenWithHandlers(e);
		let t = e.items.some((e) => dy(e).isTask), n = e.items.some((e) => !dy(e).isTask);
		if (!t || !n || this.getHandlersForToken("taskList").length === 0) return this.parseTokenWithHandlers(e);
		let r = [], i = [], a = null;
		for (let t = 0; t < e.items.length; t += 1) {
			let n = e.items[t], { isTask: o, checked: s, indentLevel: c } = dy(n), l = n;
			if (o) {
				let e = (n.raw || n.text || "").split("\n"), t = e[0].match(/^\s*[-+*]\s+\[([ xX])\]\s+(.*)$/), r = t ? t[2] : "", i = [];
				if (e.length > 1 && e.slice(1).join("\n").trim()) {
					let t = e.slice(1), n = t.filter((e) => e.trim());
					if (n.length > 0) {
						let e = Math.min(...n.map((e) => e.length - e.trimStart().length)), r = t.map((t) => t.trim() ? t.slice(e) : "").join("\n").trim();
						r && (i = this.markedInstance.lexer(`${r}
`));
					}
				}
				l = {
					type: "taskItem",
					raw: "",
					mainContent: r,
					indentLevel: c,
					checked: s ?? !1,
					text: r,
					tokens: this.tokenizeInline(r),
					nestedTokens: i
				};
			}
			let u = o ? "taskList" : "list";
			a === u ? i.push(l) : (i.length > 0 && r.push({
				type: a,
				items: i
			}), i = [l], a = u);
		}
		i.length > 0 && r.push({
			type: a,
			items: i
		});
		let o = [];
		for (let t = 0; t < r.length; t += 1) {
			let n = r[t], i = {
				...e,
				type: n.type,
				items: n.items
			}, a = this.parseToken(i);
			a && (Array.isArray(a) ? o.push(...a) : o.push(a));
		}
		return o.length > 0 ? o : null;
	}
	parseTokenWithHandlers(e) {
		if (!e.type) return null;
		let t = this.getHandlersForToken(e.type), n = this.createParseHelpers();
		if (t.find((t) => {
			if (!t.parseMarkdown) return !1;
			let r = t.parseMarkdown(e, n), i = this.normalizeParseResult(r);
			return i && (!Array.isArray(i) || i.length > 0) ? (this.lastParseResult = i, !0) : !1;
		}) && this.lastParseResult) {
			let e = this.lastParseResult;
			return this.lastParseResult = null, e;
		}
		return this.parseFallbackToken(e);
	}
	createParseHelpers() {
		return {
			parseInline: (e) => this.parseInlineTokens(e),
			tokenizeInline: (e) => this.tokenizeInline(e),
			parseChildren: (e) => this.parseTokens(e),
			parseBlockChildren: (e) => this.parseTokens(e, !0),
			createTextNode: (e, t) => ({
				type: "text",
				text: e,
				marks: t || void 0
			}),
			createNode: (e, t, n) => {
				let r = {
					type: e,
					attrs: t || void 0,
					content: n || void 0
				};
				return (!t || Object.keys(t).length === 0) && delete r.attrs, r;
			},
			applyMark: (e, t, n) => ({
				mark: e,
				content: t,
				attrs: n && Object.keys(n).length > 0 ? n : void 0
			})
		};
	}
	escapeRegex(e) {
		return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	parseInlineTokens(e) {
		let t = [];
		for (let n = 0; n < e.length; n += 1) {
			let r = e[n];
			if (r.type === "text") t.push({
				type: "text",
				text: ad(r.text || "")
			});
			else if (r.type === "escape") t.push({
				type: "text",
				text: r.text || ""
			});
			else if (r.type === "html") {
				let i = (r.raw ?? r.text ?? "").toString(), a = /^<\/[\s]*[\w-]+/i.test(i), o = i.match(/^<[\s]*([\w-]+)(\s|>|\/|$)/i);
				if (!a && o && !/\/>$/.test(i)) {
					let r = o[1], a = this.escapeRegex(r), s = RegExp(`^<\\/\\s*${a}\\b`, "i"), c = -1, l = [i];
					for (let t = n + 1; t < e.length; t += 1) {
						let n = e[t], r = (n.raw ?? n.text ?? "").toString();
						if (l.push(r), n.type === "html" && s.test(r)) {
							c = t;
							break;
						}
					}
					if (c !== -1) {
						let e = l.join(""), r = {
							type: "html",
							raw: e,
							text: e,
							block: !1
						}, i = this.parseHTMLToken(r);
						if (i) {
							let e = this.normalizeParseResult(i);
							Array.isArray(e) ? t.push(...e) : e && t.push(e);
						}
						n = c;
						continue;
					}
				}
				let s = this.parseHTMLToken(r);
				if (s) {
					let e = this.normalizeParseResult(s);
					Array.isArray(e) ? t.push(...e) : e && t.push(e);
				}
			} else if (r.type) {
				let e = this.getHandlerForToken(r.type);
				if (e && e.parseMarkdown) {
					let n = this.createParseHelpers(), i = e.parseMarkdown(r, n);
					if (this.isMarkResult(i)) {
						let e = this.applyMarkToContent(i.mark, i.content, i.attrs);
						t.push(...e);
					} else {
						let e = this.normalizeParseResult(i);
						Array.isArray(e) ? t.push(...e) : e && t.push(e);
					}
				} else r.tokens && t.push(...this.parseInlineTokens(r.tokens));
			}
		}
		for (let e = t.length - 1; e > 0; --e) {
			let n = t[e], r = t[e - 1];
			n.type === "text" && r.type === "text" && xd(n.marks || [], r.marks || []) && (r.text = (r.text || "") + (n.text || ""), t.splice(e, 1));
		}
		return t;
	}
	applyMarkToContent(e, t, n) {
		return t.map((t) => {
			if (t.type === "text") {
				let r = t.marks || [], i = n ? {
					type: e,
					attrs: n
				} : { type: e };
				return {
					...t,
					marks: [...r, i]
				};
			}
			return {
				...t,
				content: t.content ? this.applyMarkToContent(e, t.content, n) : void 0
			};
		});
	}
	isMarkResult(e) {
		return e && typeof e == "object" && "mark" in e;
	}
	normalizeParseResult(e) {
		return e ? this.isMarkResult(e) ? e.content : e : null;
	}
	parseFallbackToken(e, t = !1) {
		switch (e.type) {
			case "paragraph": return {
				type: "paragraph",
				content: e.tokens ? this.parseInlineTokens(e.tokens) : []
			};
			case "heading": return {
				type: "heading",
				attrs: { level: e.depth || 1 },
				content: e.tokens ? this.parseInlineTokens(e.tokens) : []
			};
			case "text": return {
				type: "text",
				text: ad(e.text || "")
			};
			case "html": return this.parseHTMLToken(e);
			case "escape": return {
				type: "text",
				text: e.text || ""
			};
			case "space": return null;
			default: return e.tokens ? this.parseTokens(e.tokens, t) : null;
		}
	}
	parseHTMLToken(e) {
		let t = e.text || e.raw || "";
		if (!t.trim()) return null;
		if (this.isUnrecognizedHtml(t) || typeof window > "u" || window.DOMParser === void 0) return this.htmlAsLiteralText(t, !!e.block);
		try {
			let n = tu(t, this.baseExtensions);
			return n.type === "doc" && n.content ? e.block ? n.content : n.content.length === 1 && n.content[0].type === "paragraph" && n.content[0].content ? n.content[0].content : n.content : n;
		} catch (e) {
			throw Error(`Failed to parse HTML in markdown: ${e}`);
		}
	}
	isUnrecognizedHtml(e) {
		return _y(e, this.getSchemaParseDomTags());
	}
	getSchemaParseDomTags() {
		if (this.schemaParseDomTagsCache) return this.schemaParseDomTagsCache;
		let e = /* @__PURE__ */ new Set();
		try {
			let t = eu(this.baseExtensions), n = (t) => {
				let n = t?.parseDOM;
				Array.isArray(n) && n.forEach((t) => {
					if (typeof t?.tag == "string") {
						let n = t.tag.match(/^[a-zA-Z][\w-]*/);
						n && e.add(n[0].toLowerCase());
					}
				});
			};
			Object.values(t.nodes).forEach((e) => n(e.spec)), Object.values(t.marks).forEach((e) => n(e.spec));
		} catch {}
		return this.schemaParseDomTagsCache = e, e;
	}
	htmlAsLiteralText(e, t) {
		let n = e.replace(/\s+$/, "");
		return n ? t ? {
			type: "paragraph",
			content: [{
				type: "text",
				text: n
			}]
		} : {
			type: "text",
			text: n
		} : null;
	}
	encodeTextForMarkdown(e, t, n) {
		return n?.type != null && this.codeTypes.has(n.type) || (t.marks || []).some((e) => this.codeTypes.has(typeof e == "string" ? e : e.type)) ? e : this.escapeMarkdownSyntax(od(e));
	}
	escapeMarkdownSyntax(e) {
		return e.replace(/([\\`*_[\]~])/g, "\\$1");
	}
	renderNodeToMarkdown(e, t, n = 0, r = 0, i = {}) {
		if (e.type === "text") return this.encodeTextForMarkdown(e.text || "", e, t);
		if (!e.type) return "";
		let a = this.getHandlerForToken(e.type);
		if (!a) return "";
		let o = Array.isArray(t?.content) && n > 0 ? t.content[n - 1] : void 0, s = {
			renderChildren: (t, i) => {
				let o = a.isIndenting ? r + 1 : r;
				return !Array.isArray(t) && t.content ? this.renderNodes(t.content, e, i || "", n, o) : this.renderNodes(t, e, i || "", n, o);
			},
			renderChild: (t, n) => {
				let i = a.isIndenting ? r + 1 : r;
				return this.renderNodeToMarkdown(t, e, n, i);
			},
			indent: (e) => this.indentString + e,
			wrapInBlock: ay
		}, c = {
			index: n,
			level: r,
			parentType: t?.type,
			previousNode: o,
			meta: {
				parentAttrs: t?.attrs,
				...i
			}
		};
		return a.renderMarkdown?.call(a, e, s, c) || "";
	}
	renderNodes(e, t, n = "", r = 0, i = 0) {
		return Array.isArray(e) ? this.renderNodesWithMarkBoundaries(e, t, n, i) : e.type ? this.renderNodeToMarkdown(e, t, r, i) : "";
	}
	renderNodesWithMarkBoundaries(e, t, n = "", r = 0) {
		let i = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
		return e.forEach((n, c) => {
			let l = c < e.length - 1 ? e[c + 1] : null;
			if (n.type) if (n.type === "text") {
				let e = this.encodeTextForMarkdown(n.text || "", n, t), r = new Map((n.marks || []).map((e) => [e.type, e])), c = this.getMarksToOpenForSerialization(a, r, l), u = oy(r, l), d = u.filter((e) => a.has(e)), f = d.length > 0 && c.length > 0, p = "";
				if (u.length > 0 && !f) {
					let t = e.match(/(\s+)$/);
					t && (p = t[1], e = e.slice(0, -p.length));
				}
				f || u.slice().reverse().forEach((t) => {
					if (!a.has(t)) return;
					let n = r.get(t), i = this.getMarkClosing(t, n, s.get(t));
					i && (e += i), a.has(t) && (a.delete(t), s.delete(t));
				});
				let m = "";
				if (c.length > 0) {
					let t = e.match(/^(\s+)/);
					t && (m = t[1], e = e.slice(m.length));
				}
				c.forEach(({ type: t, mark: n }) => {
					let r = o.has(t) ? "html" : "markdown", i = this.getMarkOpening(t, n, r);
					i && (e = i + e), s.set(t, r), o.delete(t);
				}), f || c.slice().reverse().forEach(({ type: e, mark: t }) => {
					a.set(e, t);
				}), e = m + e;
				let h;
				if (f) {
					let e = new Set((l?.marks || []).map((e) => e.type));
					c.forEach(({ type: t }) => {
						e.has(t) && this.getHtmlReopenTags(t) && o.add(t);
					});
					let t = Array.from(a.keys()), n = d.slice().sort((e, n) => t.indexOf(n) - t.indexOf(e));
					h = [...c.map((e) => e.type), ...n];
				} else h = cy(a, r, l, this.markSetsEqual.bind(this));
				let g = "";
				if (h.length > 0) {
					let t = e.match(/(\s+)$/);
					t && (g = t[1], e = e.slice(0, -g.length));
				}
				h.forEach((t) => {
					let n = a.get(t) ?? r.get(t), i = this.getMarkClosing(t, n, s.get(t));
					i && (e += i), a.delete(t), s.delete(t);
				}), e += g, e += p, i.push(e);
			} else {
				let e = new Set((n.marks || []).map((e) => e.type)), o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
				a.forEach((t, n) => {
					e.has(n) && (o.set(n, t), l.set(n, s.get(n) ?? "markdown"));
				});
				let u = ly(a, (e, t) => this.getMarkClosing(e, t, s.get(e)));
				s.clear();
				let d = this.renderNodeToMarkdown(n, t, c, r), f = n.type === "hardBreak" ? "" : uy(o, a, (e, t) => {
					let n = l.get(e) ?? "markdown";
					return s.set(e, n), this.getMarkOpening(e, t, n);
				});
				i.push(u + d + f);
			}
		}), i.join(n);
	}
	getMarkOpening(e, t, n = "markdown") {
		if (n === "html") return this.getHtmlReopenTags(e)?.open || "";
		let r = this.getHandlersForNodeType(e), i = r.length > 0 ? r[0] : void 0;
		if (!i || !i.renderMarkdown) return "";
		let a = "__TIPTAP_MARKDOWN_PLACEHOLDER__", o = {
			type: e,
			attrs: t.attrs || {},
			content: [{
				type: "text",
				text: a
			}]
		};
		try {
			let e = i.renderMarkdown(o, {
				renderChildren: () => a,
				renderChild: () => a,
				indent: (e) => e,
				wrapInBlock: (e, t) => e + t
			}, {
				index: 0,
				level: 0,
				parentType: "text",
				meta: {}
			}), t = e.indexOf(a);
			return t >= 0 ? e.substring(0, t) : "";
		} catch (t) {
			throw Error(`Failed to get mark opening for ${e}: ${t}`);
		}
	}
	getMarkClosing(e, t, n = "markdown") {
		if (n === "html") return this.getHtmlReopenTags(e)?.close || "";
		let r = this.getHandlersForNodeType(e), i = r.length > 0 ? r[0] : void 0;
		if (!i || !i.renderMarkdown) return "";
		let a = "__TIPTAP_MARKDOWN_PLACEHOLDER__", o = {
			type: e,
			attrs: t.attrs || {},
			content: [{
				type: "text",
				text: a
			}]
		};
		try {
			let e = i.renderMarkdown(o, {
				renderChildren: () => a,
				renderChild: () => a,
				indent: (e) => e,
				wrapInBlock: (e, t) => e + t
			}, {
				index: 0,
				level: 0,
				parentType: "text",
				meta: {}
			}), t = e.indexOf(a), n = t + 33;
			return t >= 0 ? e.substring(n) : "";
		} catch (t) {
			throw Error(`Failed to get mark closing for ${e}: ${t}`);
		}
	}
	getHtmlReopenTags(e) {
		let t = this.getHandlersForNodeType(e);
		return (t.length > 0 ? t[0] : void 0)?.htmlReopen;
	}
	markSetsEqual(e, t) {
		return e.size === t.size && Array.from(e.entries()).every(([e, n]) => {
			let r = t.get(e);
			return r && nd(n.attrs, r.attrs);
		});
	}
	getMarksToOpenForSerialization(e, t, n) {
		let r = sy(e, t);
		if (r.length <= 1) return r;
		let i = n?.marks || [], a = (e, t) => i.some((n) => n.type === e && nd(n.attrs, t)), o = (e, t) => {
			let n = this.extensionRanks.get(e.type) ?? 2 ** 53 - 1, r = this.extensionRanks.get(t.type) ?? 2 ** 53 - 1;
			return n === r ? e.type.localeCompare(t.type) : r - n;
		}, s = r.filter((e) => !a(e.type, e.mark.attrs)).sort(o), c = r.filter((e) => a(e.type, e.mark.attrs)).sort(o);
		return [...s, ...c];
	}
}, yy = N.create({
	name: "markdown",
	addOptions() {
		return {
			indentation: {
				style: "space",
				size: 2
			},
			marked: void 0,
			markedOptions: {}
		};
	},
	addCommands() {
		return {
			setContent: (e, t) => {
				if (!t?.contentType || fy(e, t?.contentType) !== "markdown" || !this.editor.markdown) return _c.setContent(e, t);
				let n = this.editor.markdown.parse(e);
				return _c.setContent(n, t);
			},
			insertContent: (e, t) => {
				if (!t?.contentType || fy(e, t?.contentType) !== "markdown" || !this.editor.markdown) return _c.insertContent(e, t);
				let n = this.editor.markdown.parse(e);
				return _c.insertContent(n, t);
			},
			insertContentAt: (e, t, n) => {
				if (!n?.contentType || fy(t, n?.contentType) !== "markdown" || !this.editor.markdown) return _c.insertContentAt(e, t, n);
				let r = this.editor.markdown.parse(t);
				return _c.insertContentAt(e, r, n);
			}
		};
	},
	addStorage() {
		return { manager: new vy({
			indentation: this.options.indentation,
			marked: this.options.marked,
			markedOptions: this.options.markedOptions,
			extensions: []
		}) };
	},
	onBeforeCreate() {
		if (this.editor.markdown) {
			console.error("[tiptap][markdown]: There is already a `markdown` property on the editor instance. This might lead to unexpected behavior.");
			return;
		}
		if (this.storage.manager = new vy({
			indentation: this.options.indentation,
			marked: this.options.marked,
			markedOptions: this.options.markedOptions,
			extensions: this.editor.extensionManager.baseExtensions
		}), this.editor.markdown = this.storage.manager, this.editor.getMarkdown = () => this.storage.manager.serialize(this.editor.getJSON()), !this.editor.options.contentType || fy(this.editor.options.content, this.editor.options.contentType) !== "markdown") return;
		if (!this.editor.markdown) throw Error("[tiptap][markdown]: The `contentType` option is set to \"markdown\", but the Markdown extension is not added to the editor. Please add the Markdown extension to use this feature.");
		if (this.editor.options.content === void 0 || typeof this.editor.options.content != "string") throw Error("[tiptap][markdown]: The `contentType` option is set to \"markdown\", but the initial content is not a string. Please provide the initial content as a markdown string.");
		let e = this.editor.markdown.parse(this.editor.options.content);
		e.content?.length && (this.editor.options.content = e);
	}
}), by = g_, xy = Math.min, Sy = Math.max, Cy = Math.round, wy = (e) => ({
	x: e,
	y: e
});
function Ty(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Ey(e) {
	return e.split("-")[0];
}
function Dy(e) {
	return e.split("-")[1];
}
function Oy(e) {
	return e === "x" ? "y" : "x";
}
function ky(e) {
	return e === "y" ? "height" : "width";
}
function Ay(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function jy(e) {
	return Oy(Ay(e));
}
function My(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function Ny(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : My(e);
}
function Py(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
//#endregion
//#region node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function Fy(e, t, n) {
	let { reference: r, floating: i } = e, a = Ay(t), o = jy(t), s = ky(o), c = Ey(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	let m = Dy(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Iy(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = Ty(t, e), p = Ny(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Py(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = Py(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var Ly = 50, Ry = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Iy
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Fy(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < Ly && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Fy(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
};
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function zy() {
	return typeof window < "u";
}
function By(e) {
	return Uy(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Vy(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Hy(e) {
	return ((Uy(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Uy(e) {
	return zy() ? e instanceof Node || e instanceof Vy(e).Node : !1;
}
function Wy(e) {
	return zy() ? e instanceof Element || e instanceof Vy(e).Element : !1;
}
function Gy(e) {
	return zy() ? e instanceof HTMLElement || e instanceof Vy(e).HTMLElement : !1;
}
function Ky(e) {
	return !zy() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Vy(e).ShadowRoot;
}
function qy(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = ib(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function Jy(e) {
	return /^(table|td|th)$/.test(By(e));
}
function Yy(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var Xy = /transform|translate|scale|rotate|perspective|filter/, Zy = /paint|layout|strict|content/, Qy = (e) => !!e && e !== "none", $y;
function eb(e) {
	let t = Wy(e) ? ib(e) : e;
	return Qy(t.transform) || Qy(t.translate) || Qy(t.scale) || Qy(t.rotate) || Qy(t.perspective) || !nb() && (Qy(t.backdropFilter) || Qy(t.filter)) || Xy.test(t.willChange || "") || Zy.test(t.contain || "");
}
function tb(e) {
	let t = ob(e);
	for (; Gy(t) && !rb(t);) {
		if (eb(t)) return t;
		if (Yy(t)) return null;
		t = ob(t);
	}
	return null;
}
function nb() {
	return $y ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), $y;
}
function rb(e) {
	return /^(html|body|#document)$/.test(By(e));
}
function ib(e) {
	return Vy(e).getComputedStyle(e);
}
function ab(e) {
	return Wy(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function ob(e) {
	if (By(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || Ky(e) && e.host || Hy(e);
	return Ky(t) ? t.host : t;
}
function sb(e) {
	let t = ob(e);
	return rb(t) ? (e.ownerDocument || e).body : Gy(t) && qy(t) ? t : sb(t);
}
function cb(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = sb(e), i = r === e.ownerDocument?.body, a = Vy(r);
	if (i) {
		let e = lb(a);
		return t.concat(a, a.visualViewport || [], qy(r) ? r : [], e && n ? cb(e) : []);
	} else return t.concat(r, cb(r, [], n));
}
function lb(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function ub(e) {
	let t = ib(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = Gy(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = Cy(n) !== a || Cy(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function db(e) {
	return Wy(e) ? e : e.contextElement;
}
function fb(e) {
	let t = db(e);
	if (!Gy(t)) return wy(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = ub(t), o = (a ? Cy(n.width) : n.width) / r, s = (a ? Cy(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var pb = /*#__PURE__*/ wy(0);
function mb(e) {
	let t = Vy(e);
	return !nb() || !t.visualViewport ? pb : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function hb(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === Vy(e);
}
function gb(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = db(e), o = wy(1);
	t && (r ? Wy(r) && (o = fb(r)) : o = fb(e));
	let s = hb(a, n, r) ? mb(a) : wy(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = Vy(a), t = Wy(r) ? Vy(r) : r, n = e, i = lb(n);
		for (; i && t !== n;) {
			let e = fb(i), t = i.getBoundingClientRect(), r = ib(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = Vy(i), i = lb(n);
		}
	}
	return Py({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function _b(e, t) {
	let n = ab(e).scrollLeft;
	return t ? t.left + n : gb(Hy(e)).left + n;
}
function vb(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - _b(e, n),
		y: n.top + t.scrollTop
	};
}
function yb(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Hy(r), s = t ? Yy(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = wy(1), u = wy(0), d = Gy(r);
	if ((d || !a) && ((By(r) !== "body" || qy(o)) && (c = ab(r)), d)) {
		let e = gb(r);
		l = fb(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? vb(o, c) : wy(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function bb(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function xb(e) {
	let t = ab(e), n = e.ownerDocument.body, r = Sy(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Sy(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + _b(e), o = -t.scrollTop;
	return ib(n).direction === "rtl" && (a += Sy(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var Sb = 25;
function Cb(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = Vy(e), a = Hy(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !nb() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (_b(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Sb && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function wb(e, t) {
	let n = gb(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = fb(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Tb(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Cb(e, n, t);
	else if (t === "document") r = xb(Hy(e));
	else if (Wy(t)) r = wb(t, n);
	else {
		let n = mb(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Py(r);
}
function Eb(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = cb(e, [], !1).filter((e) => Wy(e) && By(e) !== "body"), i = null, a = ib(e).position === "fixed", o = a ? ob(e) : e;
	for (; Wy(o) && !rb(o);) {
		let e = ib(o), t = eb(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = ob(o);
	}
	return t.set(e, r), r;
}
function Db(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? Yy(t) ? [] : Eb(t, this._c) : [].concat(n), r], o = Tb(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Tb(t, a[e], i);
		s = Sy(n.top, s), c = xy(n.right, c), l = xy(n.bottom, l), u = Sy(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Ob(e) {
	let { width: t, height: n } = ub(e);
	return {
		width: t,
		height: n
	};
}
function kb(e, t, n) {
	let r = Gy(t), i = Hy(t), a = n === "fixed", o = gb(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = wy(0);
	if ((r || !a) && ((By(t) !== "body" || qy(i)) && (s = ab(t)), r)) {
		let e = gb(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = _b(i));
	let l = i && !r && !a ? vb(i, s) : wy(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Ab(e) {
	return ib(e).position === "static";
}
function jb(e, t) {
	if (!Gy(e) || ib(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Hy(e) === n && (n = n.ownerDocument.body), n;
}
function Mb(e, t) {
	let n = Vy(e);
	if (Yy(e)) return n;
	if (!Gy(e)) {
		let t = ob(e);
		for (; t && !rb(t);) {
			if (Wy(t) && !Ab(t)) return t;
			t = ob(t);
		}
		return n;
	}
	let r = jb(e, t);
	for (; r && Jy(r) && Ab(r);) r = jb(r, t);
	return r && rb(r) && Ab(r) && !eb(r) ? n : r || tb(e) || n;
}
var Nb = async function(e) {
	let t = this.getOffsetParent || Mb, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: kb(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Pb(e) {
	return ib(e).direction === "rtl";
}
var Fb = {
	convertOffsetParentRelativeRectToViewportRelativeRect: yb,
	getDocumentElement: Hy,
	getClippingRect: Db,
	getOffsetParent: Mb,
	getElementRects: Nb,
	getClientRects: bb,
	getDimensions: Ob,
	getScale: fb,
	isElement: Wy,
	isRTL: Pb
}, Ib = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Fb,
		...i.platform,
		_c: r
	};
	return Ry(e, t, {
		...i,
		platform: a
	});
}, Lb = () => /* @__PURE__ */ new Map(), Rb = (e) => {
	let t = Lb();
	return e.forEach((e, n) => {
		t.set(n, e);
	}), t;
}, zb = (e, t, n) => {
	let r = e.get(t);
	return r === void 0 && e.set(t, r = n()), r;
}, Bb = (e, t) => {
	let n = [];
	for (let [r, i] of e) n.push(t(i, r));
	return n;
}, Vb = (e, t) => {
	for (let [n, r] of e) if (t(r, n)) return !0;
	return !1;
}, Hb = () => /* @__PURE__ */ new Set(), Ub = (e) => e[e.length - 1], Wb = (e, t) => {
	for (let n = 0; n < t.length; n++) e.push(t[n]);
}, Gb = Array.from, Kb = (e, t) => {
	for (let n = 0; n < e.length; n++) if (!t(e[n], n, e)) return !1;
	return !0;
}, qb = (e, t) => {
	for (let n = 0; n < e.length; n++) if (t(e[n], n, e)) return !0;
	return !1;
}, Jb = (e, t) => {
	let n = Array(e);
	for (let r = 0; r < e; r++) n[r] = t(r, n);
	return n;
}, Yb = Array.isArray, Xb = class {
	constructor() {
		this._observers = Lb();
	}
	on(e, t) {
		return zb(this._observers, e, Hb).add(t), t;
	}
	once(e, t) {
		let n = (...r) => {
			this.off(e, n), t(...r);
		};
		this.on(e, n);
	}
	off(e, t) {
		let n = this._observers.get(e);
		n !== void 0 && (n.delete(t), n.size === 0 && this._observers.delete(e));
	}
	emit(e, t) {
		return Gb((this._observers.get(e) || Lb()).values()).forEach((e) => e(...t));
	}
	destroy() {
		this._observers = Lb();
	}
}, Zb = Math.floor, Qb = Math.abs, $b = (e, t) => e < t ? e : t, ex = (e, t) => e > t ? e : t;
Number.isNaN;
var tx = (e) => e === 0 ? 1 / e < 0 : e < 0, nx = 1 << 17, rx = 1 << 18, ix = 1 << 19, ax = 1 << 20, ox = 1 << 21, sx = 1 << 22, cx = 1 << 23, lx = 1 << 24, ux = 1 << 25, dx = 1 << 26, fx = 1 << 27, px = 1 << 28, mx = 1 << 29;
nx - 1, rx - 1, ix - 1, ax - 1, ox - 1, sx - 1, cx - 1, lx - 1, ux - 1, dx - 1, fx - 1, px - 1, mx - 1;
var hx = 2 ** 53 - 1, gx = -(2 ** 53 - 1), _x = Number.isInteger || ((e) => typeof e == "number" && isFinite(e) && Zb(e) === e);
Number.isNaN, Number.parseInt;
//#endregion
//#region node_modules/lib0/string.js
var vx = String.fromCharCode;
String.fromCodePoint, vx(65535);
var yx = (e) => e.toLowerCase(), bx = /^\s*/g, xx = (e) => e.replace(bx, ""), Sx = /([A-Z])/g, Cx = (e, t) => xx(e.replace(Sx, (e) => `${t}${yx(e)}`)), wx = (e) => {
	let t = unescape(encodeURIComponent(e)), n = t.length, r = new Uint8Array(n);
	for (let e = 0; e < n; e++) r[e] = t.codePointAt(e);
	return r;
}, Tx = typeof TextEncoder < "u" ? new TextEncoder() : null, Ex = Tx ? (e) => Tx.encode(e) : wx, Dx = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", {
	fatal: !0,
	ignoreBOM: !0
});
/* c8 ignore start */
Dx && Dx.decode(/* @__PURE__ */ new Uint8Array()).length === 1 && (Dx = null);
/* c8 ignore next */
var Ox = (e, t) => Jb(t, () => e).join(""), kx = class {
	constructor() {
		this.cpos = 0, this.cbuf = /* @__PURE__ */ new Uint8Array(100), this.bufs = [];
	}
}, Ax = () => new kx(), jx = (e) => {
	let t = Ax();
	return e(t), Nx(t);
}, Mx = (e) => {
	let t = e.cpos;
	for (let n = 0; n < e.bufs.length; n++) t += e.bufs[n].length;
	return t;
}, Nx = (e) => {
	let t = new Uint8Array(Mx(e)), n = 0;
	for (let r = 0; r < e.bufs.length; r++) {
		let i = e.bufs[r];
		t.set(i, n), n += i.length;
	}
	return t.set(new Uint8Array(e.cbuf.buffer, 0, e.cpos), n), t;
}, Px = (e, t) => {
	let n = e.cbuf.length;
	n - e.cpos < t && (e.bufs.push(new Uint8Array(e.cbuf.buffer, 0, e.cpos)), e.cbuf = new Uint8Array(ex(n, t) * 2), e.cpos = 0);
}, V = (e, t) => {
	let n = e.cbuf.length;
	e.cpos === n && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(n * 2), e.cpos = 0), e.cbuf[e.cpos++] = t;
}, Fx = V, H = (e, t) => {
	for (; t > 127;) V(e, 128 | 127 & t), t = Zb(t / 128);
	V(e, 127 & t);
}, Ix = (e, t) => {
	let n = tx(t);
	for (n && (t = -t), V(e, (t > 63 ? 128 : 0) | (n ? 64 : 0) | 63 & t), t = Zb(t / 64); t > 0;) V(e, (t > 127 ? 128 : 0) | 127 & t), t = Zb(t / 128);
}, Lx = /* @__PURE__ */ new Uint8Array(3e4), Rx = Lx.length / 3, zx = Tx && Tx.encodeInto ? (e, t) => {
	if (t.length < Rx) {
		/* c8 ignore next */
		let n = Tx.encodeInto(t, Lx).written || 0;
		H(e, n);
		for (let t = 0; t < n; t++) V(e, Lx[t]);
	} else Vx(e, Ex(t));
} : (e, t) => {
	let n = unescape(encodeURIComponent(t)), r = n.length;
	H(e, r);
	for (let t = 0; t < r; t++) V(e, n.codePointAt(t));
}, Bx = (e, t) => {
	let n = e.cbuf.length, r = e.cpos, i = $b(n - r, t.length), a = t.length - i;
	e.cbuf.set(t.subarray(0, i), r), e.cpos += i, a > 0 && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(ex(n * 2, a)), e.cbuf.set(t.subarray(i)), e.cpos = a);
}, Vx = (e, t) => {
	H(e, t.byteLength), Bx(e, t);
}, Hx = (e, t) => {
	Px(e, t);
	let n = new DataView(e.cbuf.buffer, e.cpos, t);
	return e.cpos += t, n;
}, Ux = (e, t) => Hx(e, 4).setFloat32(0, t, !1), Wx = (e, t) => Hx(e, 8).setFloat64(0, t, !1), Gx = (e, t) => Hx(e, 8).setBigInt64(0, t, !1), Kx = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4)), qx = (e) => (Kx.setFloat32(0, e), Kx.getFloat32(0) === e), Jx = (e, t) => {
	switch (typeof t) {
		case "string":
			V(e, 119), zx(e, t);
			break;
		case "number":
			_x(t) && Qb(t) <= 2147483647 ? (V(e, 125), Ix(e, t)) : qx(t) ? (V(e, 124), Ux(e, t)) : (V(e, 123), Wx(e, t));
			break;
		case "bigint":
			V(e, 122), Gx(e, t);
			break;
		case "object":
			if (t === null) V(e, 126);
			else if (Yb(t)) {
				V(e, 117), H(e, t.length);
				for (let n = 0; n < t.length; n++) Jx(e, t[n]);
			} else if (t instanceof Uint8Array) V(e, 116), Vx(e, t);
			else {
				V(e, 118);
				let n = Object.keys(t);
				H(e, n.length);
				for (let r = 0; r < n.length; r++) {
					let i = n[r];
					zx(e, i), Jx(e, t[i]);
				}
			}
			break;
		case "boolean":
			V(e, t ? 120 : 121);
			break;
		default: V(e, 127);
	}
}, Yx = class extends kx {
	constructor(e) {
		super(), this.w = e, this.s = null, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (this.count > 0 && H(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
	}
}, Xx = (e) => {
	e.count > 0 && (Ix(e.encoder, e.count === 1 ? e.s : -e.s), e.count > 1 && H(e.encoder, e.count - 2));
}, Zx = class {
	constructor() {
		this.encoder = new kx(), this.s = 0, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (Xx(this), this.count = 1, this.s = e);
	}
	toUint8Array() {
		return Xx(this), Nx(this.encoder);
	}
}, Qx = (e) => {
	if (e.count > 0) {
		let t = e.diff * 2 + (e.count === 1 ? 0 : 1);
		Ix(e.encoder, t), e.count > 1 && H(e.encoder, e.count - 2);
	}
}, $x = class {
	constructor() {
		this.encoder = new kx(), this.s = 0, this.count = 0, this.diff = 0;
	}
	write(e) {
		this.diff === e - this.s ? (this.s = e, this.count++) : (Qx(this), this.count = 1, this.diff = e - this.s, this.s = e);
	}
	toUint8Array() {
		return Qx(this), Nx(this.encoder);
	}
}, eS = class {
	constructor() {
		this.sarr = [], this.s = "", this.lensE = new Zx();
	}
	write(e) {
		this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
	}
	toUint8Array() {
		let e = new kx();
		return this.sarr.push(this.s), this.s = "", zx(e, this.sarr.join("")), Bx(e, this.lensE.toUint8Array()), Nx(e);
	}
}, tS = (e) => Error(e), nS = () => {
	throw tS("Method unimplemented");
}, rS = () => {
	throw tS("Unexpected case");
}, iS = tS("Unexpected end of array"), aS = tS("Integer out of Range"), oS = class {
	constructor(e) {
		this.arr = e, this.pos = 0;
	}
}, sS = (e) => new oS(e), cS = (e) => e.pos !== e.arr.length, lS = (e, t) => {
	let n = new Uint8Array(e.arr.buffer, e.pos + e.arr.byteOffset, t);
	return e.pos += t, n;
}, uS = (e) => lS(e, U(e)), dS = (e) => e.arr[e.pos++], U = (e) => {
	let t = 0, n = 1, r = e.arr.length;
	for (; e.pos < r;) {
		let r = e.arr[e.pos++];
		if (t += (r & 127) * n, n *= 128, r < 128) return t;
		/* c8 ignore start */
		if (t > hx) throw aS;
	}
	throw iS;
}, fS = (e) => {
	let t = e.arr[e.pos++], n = t & 63, r = 64, i = (t & 64) > 0 ? -1 : 1;
	if (!(t & 128)) return i * n;
	let a = e.arr.length;
	for (; e.pos < a;) {
		if (t = e.arr[e.pos++], n += (t & 127) * r, r *= 128, t < 128) return i * n;
		/* c8 ignore start */
		if (n > hx) throw aS;
	}
	throw iS;
}, pS = Dx ? (e) => Dx.decode(uS(e)) : (e) => {
	let t = U(e);
	if (t === 0) return "";
	{
		let n = String.fromCodePoint(dS(e));
		if (--t < 100) for (; t--;) n += String.fromCodePoint(dS(e));
		else for (; t > 0;) {
			let r = t < 1e4 ? t : 1e4, i = e.arr.subarray(e.pos, e.pos + r);
			e.pos += r, n += String.fromCodePoint.apply(null, i), t -= r;
		}
		return decodeURIComponent(escape(n));
	}
}, mS = (e, t) => {
	let n = new DataView(e.arr.buffer, e.arr.byteOffset + e.pos, t);
	return e.pos += t, n;
}, hS = [
	(e) => void 0,
	(e) => null,
	fS,
	(e) => mS(e, 4).getFloat32(0, !1),
	(e) => mS(e, 8).getFloat64(0, !1),
	(e) => mS(e, 8).getBigInt64(0, !1),
	(e) => !1,
	(e) => !0,
	pS,
	(e) => {
		let t = U(e), n = {};
		for (let r = 0; r < t; r++) {
			let t = pS(e);
			n[t] = gS(e);
		}
		return n;
	},
	(e) => {
		let t = U(e), n = [];
		for (let r = 0; r < t; r++) n.push(gS(e));
		return n;
	},
	uS
], gS = (e) => hS[127 - dS(e)](e), _S = class extends oS {
	constructor(e, t) {
		super(e), this.reader = t, this.s = null, this.count = 0;
	}
	read() {
		return this.count === 0 && (this.s = this.reader(this), cS(this) ? this.count = U(this) + 1 : this.count = -1), this.count--, this.s;
	}
}, vS = class extends oS {
	constructor(e) {
		super(e), this.s = 0, this.count = 0;
	}
	read() {
		if (this.count === 0) {
			this.s = fS(this);
			let e = tx(this.s);
			this.count = 1, e && (this.s = -this.s, this.count = U(this) + 2);
		}
		return this.count--, this.s;
	}
}, yS = class extends oS {
	constructor(e) {
		super(e), this.s = 0, this.count = 0, this.diff = 0;
	}
	read() {
		if (this.count === 0) {
			let e = fS(this), t = e & 1;
			this.diff = Zb(e / 2), this.count = 1, t && (this.count = U(this) + 2);
		}
		return this.s += this.diff, this.count--, this.s;
	}
}, bS = class {
	constructor(e) {
		this.decoder = new vS(e), this.str = pS(this.decoder), this.spos = 0;
	}
	read() {
		let e = this.spos + this.decoder.read(), t = this.str.slice(this.spos, e);
		return this.spos = e, t;
	}
};
crypto.subtle;
var xS = crypto.getRandomValues.bind(crypto), SS = Math.random, CS = () => xS(/* @__PURE__ */ new Uint32Array(1))[0], wS = (e) => e[Zb(SS() * e.length)], TS = "10000000-1000-4000-8000-100000000000", ES = () => TS.replace(/[018]/g, (e) => (e ^ CS() & 15 >> e / 4).toString(16)), DS = Date.now, OS = (e) => new Promise(e);
Promise.all.bind(Promise);
var kS = (e) => e === void 0 ? null : e, AS = new class {
	constructor() {
		this.map = /* @__PURE__ */ new Map();
	}
	setItem(e, t) {
		this.map.set(e, t);
	}
	getItem(e) {
		return this.map.get(e);
	}
}();
/* c8 ignore start */
try {
	typeof localStorage < "u" && localStorage && (AS = localStorage);
} catch {}
/* c8 ignore stop */
/* c8 ignore next */
var jS = AS, MS = Symbol("Equality"), NS = (e, t) => e === t || !!e?.[MS]?.(t) || !1, PS = (e) => typeof e == "object", FS = Object.assign, IS = Object.keys, LS = (e, t) => {
	for (let n in e) t(e[n], n);
}, RS = (e) => IS(e).length, zS = (e) => {
	for (let t in e) return !1;
	return !0;
}, BS = (e, t) => {
	for (let n in e) if (!t(e[n], n)) return !1;
	return !0;
}, VS = (e, t) => Object.prototype.hasOwnProperty.call(e, t), HS = (e, t) => e === t || RS(e) === RS(t) && BS(e, (e, n) => (e !== void 0 || VS(t, n)) && NS(t[n], e)), US = Object.freeze, WS = (e) => {
	for (let t in e) {
		let n = e[t];
		(typeof n == "object" || typeof n == "function") && WS(e[t]);
	}
	return US(e);
}, GS = (e, t, n = 0) => {
	try {
		for (; n < e.length; n++) e[n](...t);
	} finally {
		n < e.length && GS(e, t, n + 1);
	}
}, KS = (e, t) => {
	if (e === t) return !0;
	if (e == null || t == null || e.constructor !== t.constructor && (e.constructor || Object) !== (t.constructor || Object)) return !1;
	if (e[MS] != null) return e[MS](t);
	switch (e.constructor) {
		case ArrayBuffer: e = new Uint8Array(e), t = new Uint8Array(t);
		case Uint8Array:
			if (e.byteLength !== t.byteLength) return !1;
			for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
			break;
		case Set:
			if (e.size !== t.size) return !1;
			for (let n of e) if (!t.has(n)) return !1;
			break;
		case Map:
			if (e.size !== t.size) return !1;
			for (let n of e.keys()) if (!t.has(n) || !KS(e.get(n), t.get(n))) return !1;
			break;
		case void 0:
		case Object:
			if (RS(e) !== RS(t)) return !1;
			for (let n in e) if (!VS(e, n) || !KS(e[n], t[n])) return !1;
			break;
		case Array:
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; n++) if (!KS(e[n], t[n])) return !1;
			break;
		default: return !1;
	}
	return !0;
}, qS = (e, t) => t.includes(e), JS = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", YS = typeof window < "u" && typeof document < "u" && !JS;
typeof navigator < "u" && /Mac/.test(navigator.platform);
var XS, ZS = [], QS = () => {
	if (XS === void 0) if (JS) {
		XS = Lb();
		let e = process.argv, t = null;
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			r[0] === "-" ? (t !== null && XS.set(t, ""), t = r) : t === null ? ZS.push(r) : (XS.set(t, r), t = null);
		}
		t !== null && XS.set(t, "");
	} else typeof location == "object" ? (XS = Lb(), (location.search || "?").slice(1).split("&").forEach((e) => {
		if (e.length !== 0) {
			let [t, n] = e.split("=");
			XS.set(`--${Cx(t, "-")}`, n), XS.set(`-${Cx(t, "-")}`, n);
		}
	})) : XS = Lb();
	return XS;
}, $S = (e) => QS().has(e), eC = (e) => kS(JS ? process.env[e.toUpperCase().replaceAll("-", "_")] : jS.getItem(e)), tC = (e) => $S("--" + e) || eC(e) !== null, nC = tC("production"), rC = JS && qS(process.env.FORCE_COLOR, [
	"true",
	"1",
	"2"
]) || !$S("--no-colors") && !tC("no-color") && (!JS || process.stdout.isTTY) && (!JS || $S("--color") || eC("COLORTERM") !== null || (eC("TERM") || "").includes("color")), iC = YS ? (e) => {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += vx(e[n]);
	return btoa(t);
} : (e) => Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString("base64"), aC = (e) => jx((t) => Jx(t, e)), oC = class {
	constructor(e, t) {
		this.left = e, this.right = t;
	}
}, sC = (e, t) => new oC(e, t), cC = (e) => e.next() >= .5, lC = (e, t, n) => Zb(e.next() * (n + 1 - t) + t), uC = (e, t, n) => Zb(e.next() * (n + 1 - t) + t), dC = (e, t, n) => uC(e, t, n), fC = (e) => vx(dC(e, 97, 122)), pC = (e, t = 0, n = 20) => {
	let r = dC(e, t, n), i = "";
	for (let t = 0; t < r; t++) i += fC(e);
	return i;
}, mC = (e, t) => t[dC(e, 0, t.length - 1)], hC = Symbol("0schema"), gC = class {
	constructor() {
		this._rerrs = [];
	}
	extend(e, t, n, r = null) {
		this._rerrs.push({
			path: e,
			expected: t,
			has: n,
			message: r
		});
	}
	toString() {
		let e = [];
		for (let t = this._rerrs.length - 1; t > 0; t--) {
			let n = this._rerrs[t];
			/* c8 ignore next */
			e.push(Ox(" ", (this._rerrs.length - t) * 2) + `${n.path == null ? "" : `[${n.path}] `}${n.has} doesn't match ${n.expected}. ${n.message}`);
		}
		return e.join("\n");
	}
}, _C = (e, t) => e === t ? !0 : e == null || t == null || e.constructor !== t.constructor ? !1 : e[MS] ? NS(e, t) : Yb(e) ? Kb(e, (e) => qb(t, (t) => _C(e, t))) : PS(e) ? BS(e, (e, n) => _C(e, t[n])) : !1, vC = class {
	static _dilutes = !1;
	extends(e) {
		let [t, n] = [this.shape, e.shape];
		return this.constructor._dilutes && ([n, t] = [t, n]), _C(t, n);
	}
	equals(e) {
		return this.constructor === e.constructor && KS(this.shape, e.shape);
	}
	[hC]() {
		return !0;
	}
	[MS](e) {
		return this.equals(e);
	}
	validate(e) {
		return this.check(e);
	}
	/* c8 ignore start */
	check(e, t) {
		nS();
	}
	/* c8 ignore stop */
	get nullable() {
		return YC(this, uw);
	}
	get optional() {
		return new DC(this);
	}
	cast(e) {
		return mw(e, this), e;
	}
	expect(e) {
		return mw(e, this), e;
	}
}, yC = class extends vC {
	constructor(e, t) {
		super(), this.shape = e, this._c = t;
	}
	check(e, t = void 0) {
		let n = e?.constructor === this.shape && (this._c == null || this._c(e));
		return !n && t?.extend(null, this.shape.name, e?.constructor.name, e?.constructor === this.shape ? "Check failed" : "Constructor match failed"), n;
	}
}, W = (e, t = null) => new yC(e, t);
W(yC);
var bC = class extends vC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = this.shape(e);
		return !n && t?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), n;
	}
}, G = (e) => new bC(e);
W(bC);
var xC = class extends vC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = this.shape.some((t) => t === e);
		return !n && t?.extend(null, this.shape.join(" | "), e.toString()), n;
	}
}, SC = (...e) => new xC(e), CC = W(xC), wC = RegExp.escape || ((e) => e.replace(/[().|&,$^[\]]/g, (e) => "\\" + e)), TC = (e) => {
	if (aw.check(e)) return [wC(e)];
	if (CC.check(e)) return e.shape.map((e) => e + "");
	if (iw.check(e)) return ["[+-]?\\d+.?\\d*"];
	if (ow.check(e)) return [".*"];
	if (XC.check(e)) return e.shape.map(TC).flat(1);
	/* c8 ignore next 2 */
	rS();
};
W(class extends vC {
	constructor(e) {
		super(), this.shape = e, this._r = RegExp("^" + e.map(TC).map((e) => `(${e.join("|")})`).join("") + "$");
	}
	check(e, t) {
		let n = this._r.exec(e) != null;
		return !n && t?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), n;
	}
});
var EC = Symbol("optional"), DC = class extends vC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = e === void 0 || this.shape.check(e);
		return !n && t?.extend(null, "undefined (optional)", "()"), n;
	}
	get [EC]() {
		return !0;
	}
}, OC = W(DC), kC = class extends vC {
	check(e, t) {
		return t?.extend(null, "never", typeof e), !1;
	}
};
new kC(), W(kC);
var AC = class e extends vC {
	constructor(e, t = !1) {
		super(), this.shape = e, this._isPartial = t;
	}
	static _dilutes = !0;
	get partial() {
		return new e(this.shape, !0);
	}
	check(e, t) {
		return e == null ? (t?.extend(null, "object", "null"), !1) : BS(this.shape, (n, r) => {
			let i = this._isPartial && !VS(e, r) || n.check(e[r], t);
			return !i && t?.extend(r.toString(), n.toString(), typeof e[r], "Object property does not match"), i;
		});
	}
}, jC = (e) => new AC(e), MC = W(AC), NC = G((e) => e != null && (e.constructor === Object || e.constructor == null)), PC = class extends vC {
	constructor(e, t) {
		super(), this.shape = {
			keys: e,
			values: t
		};
	}
	check(e, t) {
		return e != null && BS(e, (n, r) => {
			let i = this.shape.keys.check(r, t);
			return !i && t?.extend(r + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(n, t);
		});
	}
}, FC = (e, t) => new PC(e, t), IC = W(PC), LC = class extends vC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		return e != null && BS(this.shape, (n, r) => {
			let i = n.check(e[r], t);
			return !i && t?.extend(r.toString(), "Tuple", typeof n), i;
		});
	}
}, RC = (...e) => new LC(e);
W(LC);
var zC = class extends vC {
	constructor(e) {
		super(), this.shape = e.length === 1 ? e[0] : new JC(e);
	}
	check(e, t) {
		let n = Yb(e) && Kb(e, (e) => this.shape.check(e));
		return !n && t?.extend(null, "Array", ""), n;
	}
}, BC = (...e) => new zC(e), VC = W(zC), HC = G((e) => Yb(e)), UC = class extends vC {
	constructor(e, t) {
		super(), this.shape = e, this._c = t;
	}
	check(e, t) {
		let n = e instanceof this.shape && (this._c == null || this._c(e));
		return !n && t?.extend(null, this.shape.name, e?.constructor.name), n;
	}
}, WC = (e, t = null) => new UC(e, t);
W(UC);
var GC = WC(vC), KC = W(class extends vC {
	constructor(e) {
		super(), this.len = e.length - 1, this.args = RC(...e.slice(-1)), this.res = e[this.len];
	}
	check(e, t) {
		let n = e.constructor === Function && e.length <= this.len;
		return !n && t?.extend(null, "function", typeof e), n;
	}
}), qC = G((e) => typeof e == "function");
W(class extends vC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = Kb(this.shape, (n) => n.check(e, t));
		return !n && t?.extend(null, "Intersectinon", typeof e), n;
	}
}, (e) => e.shape.length > 0);
var JC = class extends vC {
	static _dilutes = !0;
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = qb(this.shape, (n) => n.check(e, t));
		return t?.extend(null, "Union", typeof e), n;
	}
}, YC = (...e) => e.findIndex((e) => XC.check(e)) >= 0 ? YC(...e.map((e) => pw(e)).map((e) => XC.check(e) ? e.shape : [e]).flat(1)) : e.length === 1 ? e[0] : new JC(e), XC = W(JC), ZC = () => !0, QC = G(ZC), $C = W(bC, (e) => e.shape === ZC), ew = G((e) => typeof e == "bigint"), tw = G((e) => e === ew), nw = G((e) => typeof e == "symbol");
G((e) => e === nw);
var rw = G((e) => typeof e == "number"), iw = G((e) => e === rw), aw = G((e) => typeof e == "string"), ow = G((e) => e === aw), sw = G((e) => typeof e == "boolean"), cw = G((e) => e === sw), lw = SC(void 0);
W(xC, (e) => e.shape.length === 1 && e.shape[0] === void 0), SC(void 0);
var uw = SC(null), dw = W(xC, (e) => e.shape.length === 1 && e.shape[0] === null);
W(Uint8Array), W(yC, (e) => e.shape === Uint8Array);
var fw = YC(rw, aw, uw, lw, ew, sw, nw);
(() => {
	let e = BC(QC), t = FC(aw, QC), n = YC(rw, aw, uw, sw, e, t);
	return e.shape = n, t.shape.values = n, n;
})();
var pw = (e) => {
	if (GC.check(e)) return e;
	if (NC.check(e)) {
		let t = {};
		for (let n in e) t[n] = pw(e[n]);
		return jC(t);
	} else if (HC.check(e)) return YC(...e.map(pw));
	else if (fw.check(e)) return SC(e);
	else if (qC.check(e)) return W(e);
	/* c8 ignore next */
	rS();
}, mw = nC ? () => {} : (e, t) => {
	let n = new gC();
	if (!t.check(e, n)) throw tS(`Expected value to be of type ${t.constructor.name}.\n${n.toString()}`);
}, hw = class {
	constructor(e) {
		this.patterns = [], this.$state = e;
	}
	if(e, t) {
		return this.patterns.push({
			if: pw(e),
			h: t
		}), this;
	}
	else(e) {
		return this.if(QC, e);
	}
	done() {
		return (e, t) => {
			for (let n = 0; n < this.patterns.length; n++) {
				let r = this.patterns[n];
				if (r.if.check(e)) return r.h(e, t);
			}
			throw tS("Unhandled pattern");
		};
	}
}, gw = ((e) => new hw(e))(QC).if(iw, (e, t) => lC(t, gx, hx)).if(ow, (e, t) => pC(t)).if(cw, (e, t) => cC(t)).if(tw, (e, t) => BigInt(lC(t, gx, hx))).if(XC, (e, t) => _w(t, mC(t, e.shape))).if(MC, (e, t) => {
	let n = {};
	for (let r in e.shape) {
		let i = e.shape[r];
		if (OC.check(i)) {
			if (cC(t)) continue;
			i = i.shape;
		}
		n[r] = gw(i, t);
	}
	return n;
}).if(VC, (e, t) => {
	let n = [], r = uC(t, 0, 42);
	for (let i = 0; i < r; i++) n.push(_w(t, e.shape));
	return n;
}).if(CC, (e, t) => mC(t, e.shape)).if(dw, (e, t) => null).if(KC, (e, t) => {
	let n = _w(t, e.res);
	return () => n;
}).if($C, (e, t) => _w(t, mC(t, [
	rw,
	aw,
	uw,
	lw,
	ew,
	sw,
	BC(rw),
	FC(YC("a", "b", "c"), rw)
]))).if(IC, (e, t) => {
	let n = {}, r = lC(t, 0, 3);
	for (let i = 0; i < r; i++) {
		let r = _w(t, e.shape.keys);
		n[r] = _w(t, e.shape.values);
	}
	return n;
}).done(), _w = (e, t) => gw(pw(t), e), vw = typeof document < "u" ? document : {};
G((e) => e.nodeType === Cw), typeof DOMParser < "u" && new DOMParser(), G((e) => e.nodeType === bw), G((e) => e.nodeType === xw);
var yw = (e) => Bb(e, (e, t) => `${t}:${e};`).join(""), bw = vw.ELEMENT_NODE, xw = vw.TEXT_NODE;
vw.CDATA_SECTION_NODE, vw.COMMENT_NODE;
var Sw = vw.DOCUMENT_NODE;
vw.DOCUMENT_TYPE_NODE;
var Cw = vw.DOCUMENT_FRAGMENT_NODE;
G((e) => e.nodeType === Sw);
/* c8 ignore stop */
//#endregion
//#region node_modules/lib0/json.js
var ww = ((e) => class {
	constructor(e) {
		this._ = e;
	}
	destroy() {
		e(this._);
	}
})(clearTimeout), Tw = (e, t) => new ww(setTimeout(t, e)), Ew = Symbol, Dw = Ew(), Ow = Ew(), kw = Ew(), Aw = Ew(), jw = Ew(), Mw = Ew(), Nw = Ew(), Pw = Ew(), Fw = Ew(), Iw = (e) => {
	e.length === 1 && e[0]?.constructor === Function && (e = e[0]());
	let t = [], n = [], r = 0;
	for (; r < e.length; r++) {
		let n = e[r];
		if (n === void 0) break;
		if (n.constructor === String || n.constructor === Number) t.push(n);
		else if (n.constructor === Object) break;
	}
	for (r > 0 && n.push(t.join("")); r < e.length; r++) {
		let t = e[r];
		t instanceof Symbol || n.push(t);
	}
	return n;
};
DS();
var Lw = {
	[Dw]: sC("font-weight", "bold"),
	[Ow]: sC("font-weight", "normal"),
	[kw]: sC("color", "blue"),
	[jw]: sC("color", "green"),
	[Aw]: sC("color", "grey"),
	[Mw]: sC("color", "red"),
	[Nw]: sC("color", "purple"),
	[Pw]: sC("color", "orange"),
	[Fw]: sC("color", "black")
}, Rw = rC ? (e) => {
	e.length === 1 && e[0]?.constructor === Function && (e = e[0]());
	let t = [], n = [], r = Lb(), i = [], a = 0;
	for (; a < e.length; a++) {
		let i = e[a], o = Lw[i];
		if (o !== void 0) r.set(o.left, o.right);
		else {
			if (i === void 0) break;
			if (i.constructor === String || i.constructor === Number) {
				let e = yw(r);
				a > 0 || e.length > 0 ? (t.push("%c" + i), n.push(e)) : t.push(i);
			} else break;
		}
	}
	for (a > 0 && (i = n, i.unshift(t.join(""))); a < e.length; a++) {
		let t = e[a];
		t instanceof Symbol || i.push(t);
	}
	return i;
} : Iw, zw = (...e) => {
	/* c8 ignore next */
	console.log(...Rw(e)), Vw.forEach((t) => t.print(e));
}, Bw = (...e) => {
	console.warn(...Rw(e)), e.unshift(Pw), Vw.forEach((t) => t.print(e));
}, Vw = Hb(), Hw = (e) => ({
	[Symbol.iterator]() {
		return this;
	},
	next: e
}), Uw = (e, t) => Hw(() => {
	let n;
	do
		n = e.next();
	while (!n.done && !t(n.value));
	return n;
}), Ww = (e, t) => Hw(() => {
	let { done: n, value: r } = e.next();
	return {
		done: n,
		value: n ? void 0 : t(r)
	};
}), Gw = class {
	constructor(e, t) {
		this.clock = e, this.len = t;
	}
}, Kw = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map();
	}
}, qw = (e, t, n) => t.clients.forEach((t, r) => {
	let i = e.doc.store.clients.get(r);
	if (i != null) {
		let r = i[i.length - 1], a = r.id.clock + r.length;
		for (let r = 0, o = t[r]; r < t.length && o.clock < a; o = t[++r]) YT(e, i, o.clock, o.len, n);
	}
}), Jw = (e, t) => {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = Zb((n + r) / 2), a = e[i], o = a.clock;
		if (o <= t) {
			if (t < o + a.len) return i;
			n = i + 1;
		} else r = i - 1;
	}
	return null;
}, Yw = (e, t) => {
	let n = e.clients.get(t.client);
	return n !== void 0 && Jw(n, t.clock) !== null;
}, Xw = (e) => {
	e.clients.forEach((e) => {
		e.sort((e, t) => e.clock - t.clock);
		let t, n;
		for (t = 1, n = 1; t < e.length; t++) {
			let r = e[n - 1], i = e[t];
			r.clock + r.len >= i.clock ? e[n - 1] = new Gw(r.clock, ex(r.len, i.clock + i.len - r.clock)) : (n < t && (e[n] = i), n++);
		}
		e.length = n;
	});
}, Zw = (e) => {
	let t = new Kw();
	for (let n = 0; n < e.length; n++) e[n].clients.forEach((r, i) => {
		if (!t.clients.has(i)) {
			let a = r.slice();
			for (let t = n + 1; t < e.length; t++) Wb(a, e[t].clients.get(i) || []);
			t.clients.set(i, a);
		}
	});
	return Xw(t), t;
}, Qw = (e, t, n, r) => {
	zb(e.clients, t, () => []).push(new Gw(n, r));
}, $w = () => new Kw(), eT = (e) => {
	let t = $w();
	return e.clients.forEach((e, n) => {
		let r = [];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (n.deleted) {
				let i = n.id.clock, a = n.length;
				if (t + 1 < e.length) for (let n = e[t + 1]; t + 1 < e.length && n.deleted; n = e[++t + 1]) a += n.length;
				r.push(new Gw(i, a));
			}
		}
		r.length > 0 && t.clients.set(n, r);
	}), t;
}, tT = (e, t) => {
	H(e.restEncoder, t.clients.size), Gb(t.clients.entries()).sort((e, t) => t[0] - e[0]).forEach(([t, n]) => {
		e.resetDsCurVal(), H(e.restEncoder, t);
		let r = n.length;
		H(e.restEncoder, r);
		for (let t = 0; t < r; t++) {
			let r = n[t];
			e.writeDsClock(r.clock), e.writeDsLen(r.len);
		}
	});
}, nT = (e) => {
	let t = new Kw(), n = U(e.restDecoder);
	for (let r = 0; r < n; r++) {
		e.resetDsCurVal();
		let n = U(e.restDecoder), r = U(e.restDecoder);
		if (r > 0) {
			let i = zb(t.clients, n, () => []);
			for (let t = 0; t < r; t++) i.push(new Gw(e.readDsClock(), e.readDsLen()));
		}
	}
	return t;
}, rT = (e, t, n) => {
	let r = new Kw(), i = U(e.restDecoder);
	for (let a = 0; a < i; a++) {
		e.resetDsCurVal();
		let i = U(e.restDecoder), a = U(e.restDecoder), o = n.clients.get(i) || [], s = q(n, i);
		for (let n = 0; n < a; n++) {
			let n = e.readDsClock(), a = n + e.readDsLen();
			if (n < s) {
				s < a && Qw(r, i, s, a - s);
				let e = UT(o, n), c = o[e];
				for (!c.deleted && c.id.clock < n && (o.splice(e + 1, 0, aO(t, c, n - c.id.clock)), e++); e < o.length && (c = o[e++], c.id.clock < a);) c.deleted || (a < c.id.clock + c.length && o.splice(e, 0, aO(t, c, a - c.id.clock)), c.delete(t));
			} else Qw(r, i, n, a - n);
		}
	}
	if (r.clients.size > 0) {
		let e = new dT();
		return H(e.restEncoder, 0), tT(e, r), e.toUint8Array();
	}
	return null;
}, iT = CS, aT = class e extends Xb {
	constructor({ guid: e = ES(), collectionid: t = null, gc: n = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: a = !1, shouldLoad: o = !0 } = {}) {
		super(), this.gc = n, this.gcFilter = r, this.clientID = iT(), this.guid = e, this.collectionid = t, this.share = /* @__PURE__ */ new Map(), this.store = new BT(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = o, this.autoLoad = a, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = OS((e) => {
			this.on("load", () => {
				this.isLoaded = !0, e(this);
			});
		});
		let s = () => OS((e) => {
			let t = (n) => {
				(n === void 0 || n === !0) && (this.off("sync", t), e());
			};
			this.on("sync", t);
		});
		this.on("sync", (e) => {
			e === !1 && this.isSynced && (this.whenSynced = s()), this.isSynced = e === void 0 || e === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
		}), this.whenSynced = s();
	}
	load() {
		let e = this._item;
		e !== null && !this.shouldLoad && J(e.parent.doc, (e) => {
			e.subdocsLoaded.add(this);
		}, null, !0), this.shouldLoad = !0;
	}
	getSubdocs() {
		return this.subdocs;
	}
	getSubdocGuids() {
		return new Set(Gb(this.subdocs).map((e) => e.guid));
	}
	transact(e, t = null) {
		return J(this, e, t);
	}
	get(e, t = Y) {
		let n = zb(this.share, e, () => {
			let e = new t();
			return e._integrate(this, null), e;
		}), r = n.constructor;
		if (t !== Y && r !== t) if (r === Y) {
			let r = new t();
			r._map = n._map, n._map.forEach((e) => {
				for (; e !== null; e = e.left) e.parent = r;
			}), r._start = n._start;
			for (let e = r._start; e !== null; e = e.right) e.parent = r;
			return r._length = n._length, this.share.set(e, r), r._integrate(this, null), r;
		} else throw Error(`Type with the name ${e} has already been defined with a different constructor`);
		return n;
	}
	getArray(e = "") {
		return this.get(e, JE);
	}
	getText(e = "") {
		return this.get(e, hD);
	}
	getMap(e = "") {
		return this.get(e, ZE);
	}
	getXmlElement(e = "") {
		return this.get(e, bD);
	}
	getXmlFragment(e = "") {
		return this.get(e, vD);
	}
	toJSON() {
		let e = {};
		return this.share.forEach((t, n) => {
			e[n] = t.toJSON();
		}), e;
	}
	destroy() {
		this.isDestroyed = !0, Gb(this.subdocs).forEach((e) => e.destroy());
		let t = this._item;
		if (t !== null) {
			this._item = null;
			let n = t.content;
			n.doc = new e({
				guid: this.guid,
				...n.opts,
				shouldLoad: !1
			}), n.doc._item = t, J(t.parent.doc, (e) => {
				let r = n.doc;
				t.deleted || e.subdocsAdded.add(r), e.subdocsRemoved.add(this);
			}, null, !0);
		}
		this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
	}
}, oT = class {
	constructor(e) {
		this.dsCurrVal = 0, this.restDecoder = e;
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	readDsClock() {
		return this.dsCurrVal += U(this.restDecoder), this.dsCurrVal;
	}
	readDsLen() {
		let e = U(this.restDecoder) + 1;
		return this.dsCurrVal += e, e;
	}
}, sT = class extends oT {
	constructor(e) {
		super(e), this.keys = [], U(e), this.keyClockDecoder = new yS(uS(e)), this.clientDecoder = new vS(uS(e)), this.leftClockDecoder = new yS(uS(e)), this.rightClockDecoder = new yS(uS(e)), this.infoDecoder = new _S(uS(e), dS), this.stringDecoder = new bS(uS(e)), this.parentInfoDecoder = new _S(uS(e), dS), this.typeRefDecoder = new vS(uS(e)), this.lenDecoder = new vS(uS(e));
	}
	readLeftID() {
		return new wT(this.clientDecoder.read(), this.leftClockDecoder.read());
	}
	readRightID() {
		return new wT(this.clientDecoder.read(), this.rightClockDecoder.read());
	}
	readClient() {
		return this.clientDecoder.read();
	}
	readInfo() {
		return this.infoDecoder.read();
	}
	readString() {
		return this.stringDecoder.read();
	}
	readParentInfo() {
		return this.parentInfoDecoder.read() === 1;
	}
	readTypeRef() {
		return this.typeRefDecoder.read();
	}
	readLen() {
		return this.lenDecoder.read();
	}
	readAny() {
		return gS(this.restDecoder);
	}
	readBuf() {
		return uS(this.restDecoder);
	}
	readJSON() {
		return gS(this.restDecoder);
	}
	readKey() {
		let e = this.keyClockDecoder.read();
		if (e < this.keys.length) return this.keys[e];
		{
			let e = this.stringDecoder.read();
			return this.keys.push(e), e;
		}
	}
}, cT = class {
	constructor() {
		this.restEncoder = Ax();
	}
	toUint8Array() {
		return Nx(this.restEncoder);
	}
	resetDsCurVal() {}
	writeDsClock(e) {
		H(this.restEncoder, e);
	}
	writeDsLen(e) {
		H(this.restEncoder, e);
	}
}, lT = class extends cT {
	writeLeftID(e) {
		H(this.restEncoder, e.client), H(this.restEncoder, e.clock);
	}
	writeRightID(e) {
		H(this.restEncoder, e.client), H(this.restEncoder, e.clock);
	}
	writeClient(e) {
		H(this.restEncoder, e);
	}
	writeInfo(e) {
		Fx(this.restEncoder, e);
	}
	writeString(e) {
		zx(this.restEncoder, e);
	}
	writeParentInfo(e) {
		H(this.restEncoder, +!!e);
	}
	writeTypeRef(e) {
		H(this.restEncoder, e);
	}
	writeLen(e) {
		H(this.restEncoder, e);
	}
	writeAny(e) {
		Jx(this.restEncoder, e);
	}
	writeBuf(e) {
		Vx(this.restEncoder, e);
	}
	writeJSON(e) {
		zx(this.restEncoder, JSON.stringify(e));
	}
	writeKey(e) {
		zx(this.restEncoder, e);
	}
}, uT = class {
	constructor() {
		this.restEncoder = Ax(), this.dsCurrVal = 0;
	}
	toUint8Array() {
		return Nx(this.restEncoder);
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	writeDsClock(e) {
		let t = e - this.dsCurrVal;
		this.dsCurrVal = e, H(this.restEncoder, t);
	}
	writeDsLen(e) {
		e === 0 && rS(), H(this.restEncoder, e - 1), this.dsCurrVal += e;
	}
}, dT = class extends uT {
	constructor() {
		super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new $x(), this.clientEncoder = new Zx(), this.leftClockEncoder = new $x(), this.rightClockEncoder = new $x(), this.infoEncoder = new Yx(Fx), this.stringEncoder = new eS(), this.parentInfoEncoder = new Yx(Fx), this.typeRefEncoder = new Zx(), this.lenEncoder = new Zx();
	}
	toUint8Array() {
		let e = Ax();
		return H(e, 0), Vx(e, this.keyClockEncoder.toUint8Array()), Vx(e, this.clientEncoder.toUint8Array()), Vx(e, this.leftClockEncoder.toUint8Array()), Vx(e, this.rightClockEncoder.toUint8Array()), Vx(e, Nx(this.infoEncoder)), Vx(e, this.stringEncoder.toUint8Array()), Vx(e, Nx(this.parentInfoEncoder)), Vx(e, this.typeRefEncoder.toUint8Array()), Vx(e, this.lenEncoder.toUint8Array()), Bx(e, Nx(this.restEncoder)), Nx(e);
	}
	writeLeftID(e) {
		this.clientEncoder.write(e.client), this.leftClockEncoder.write(e.clock);
	}
	writeRightID(e) {
		this.clientEncoder.write(e.client), this.rightClockEncoder.write(e.clock);
	}
	writeClient(e) {
		this.clientEncoder.write(e);
	}
	writeInfo(e) {
		this.infoEncoder.write(e);
	}
	writeString(e) {
		this.stringEncoder.write(e);
	}
	writeParentInfo(e) {
		this.parentInfoEncoder.write(+!!e);
	}
	writeTypeRef(e) {
		this.typeRefEncoder.write(e);
	}
	writeLen(e) {
		this.lenEncoder.write(e);
	}
	writeAny(e) {
		Jx(this.restEncoder, e);
	}
	writeBuf(e) {
		Vx(this.restEncoder, e);
	}
	writeJSON(e) {
		Jx(this.restEncoder, e);
	}
	writeKey(e) {
		let t = this.keyMap.get(e);
		t === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(t);
	}
}, fT = (e, t, n, r) => {
	r = ex(r, t[0].id.clock);
	let i = UT(t, r);
	H(e.restEncoder, t.length - i), e.writeClient(n), H(e.restEncoder, r);
	let a = t[i];
	a.write(e, r - a.id.clock);
	for (let n = i + 1; n < t.length; n++) t[n].write(e, 0);
}, pT = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	n.forEach((e, n) => {
		q(t, n) > e && r.set(n, e);
	}), VT(t).forEach((e, t) => {
		n.has(t) || r.set(t, 0);
	}), H(e.restEncoder, r.size), Gb(r.entries()).sort((e, t) => t[0] - e[0]).forEach(([n, r]) => {
		fT(e, t.clients.get(n), n, r);
	});
}, mT = (e, t) => {
	let n = Lb(), r = U(e.restDecoder);
	for (let i = 0; i < r; i++) {
		let r = U(e.restDecoder), i = Array(r), a = e.readClient(), o = U(e.restDecoder);
		n.set(a, {
			i: 0,
			refs: i
		});
		for (let n = 0; n < r; n++) {
			let r = e.readInfo();
			switch (31 & r) {
				case 0: {
					let t = e.readLen();
					i[n] = new kD(K(a, o), t), o += t;
					break;
				}
				case 10: {
					let t = U(e.restDecoder);
					i[n] = new dO(K(a, o), t), o += t;
					break;
				}
				default: {
					let s = (r & 192) == 0, c = new Z(K(a, o), null, (r & 128) == 128 ? e.readLeftID() : null, null, (r & 64) == 64 ? e.readRightID() : null, s ? e.readParentInfo() ? t.get(e.readString()) : e.readLeftID() : null, s && (r & 32) == 32 ? e.readString() : null, cO(e, r));
					i[n] = c, o += c.length;
				}
			}
		}
	}
	return n;
}, hT = (e, t, n) => {
	let r = [], i = Gb(n.keys()).sort((e, t) => e - t);
	if (i.length === 0) return null;
	let a = () => {
		if (i.length === 0) return null;
		let e = n.get(i[i.length - 1]);
		for (; e.refs.length === e.i;) if (i.pop(), i.length > 0) e = n.get(i[i.length - 1]);
		else return null;
		return e;
	}, o = a();
	if (o === null) return null;
	let s = new BT(), c = /* @__PURE__ */ new Map(), l = (e, t) => {
		let n = c.get(e);
		(n == null || n > t) && c.set(e, t);
	}, u = o.refs[o.i++], d = /* @__PURE__ */ new Map(), f = () => {
		for (let e of r) {
			let t = e.id.client, r = n.get(t);
			r ? (r.i--, s.clients.set(t, r.refs.slice(r.i)), n.delete(t), r.i = 0, r.refs = []) : s.clients.set(t, [e]), i = i.filter((e) => e !== t);
		}
		r.length = 0;
	};
	for (;;) {
		if (u.constructor !== dO) {
			let i = zb(d, u.id.client, () => q(t, u.id.client)) - u.id.clock;
			if (i < 0) r.push(u), l(u.id.client, u.id.clock - 1), f();
			else {
				let a = u.getMissing(e, t);
				if (a !== null) {
					r.push(u);
					let e = n.get(a) || {
						refs: [],
						i: 0
					};
					if (e.refs.length === e.i) l(a, q(t, a)), f();
					else {
						u = e.refs[e.i++];
						continue;
					}
				} else (i === 0 || i < u.length) && (u.integrate(e, i), d.set(u.id.client, u.id.clock + u.length));
			}
		}
		if (r.length > 0) u = r.pop();
		else if (o !== null && o.i < o.refs.length) u = o.refs[o.i++];
		else {
			if (o = a(), o === null) break;
			u = o.refs[o.i++];
		}
	}
	if (s.clients.size > 0) {
		let e = new dT();
		return pT(e, s, /* @__PURE__ */ new Map()), H(e.restEncoder, 0), {
			missing: c,
			update: e.toUint8Array()
		};
	}
	return null;
}, gT = (e, t) => pT(e, t.doc.store, t.beforeState), _T = (e, t, n, r = new sT(e)) => J(t, (e) => {
	e.local = !1;
	let t = !1, n = e.doc, i = n.store, a = hT(e, i, mT(r, n)), o = i.pendingStructs;
	if (o) {
		for (let [e, n] of o.missing) if (n < q(i, e)) {
			t = !0;
			break;
		}
		if (a) {
			for (let [e, t] of a.missing) {
				let n = o.missing.get(e);
				(n == null || n > t) && o.missing.set(e, t);
			}
			o.update = dE([o.update, a.update]);
		}
	} else i.pendingStructs = a;
	let s = rT(r, e, i);
	if (i.pendingDs) {
		let t = new sT(sS(i.pendingDs));
		U(t.restDecoder);
		let n = rT(t, e, i);
		s && n ? i.pendingDs = dE([s, n]) : i.pendingDs = s || n;
	} else i.pendingDs = s;
	if (t) {
		let t = i.pendingStructs.update;
		i.pendingStructs = null, vT(e.doc, t);
	}
}, n, !1), vT = (e, t, n, r = sT) => {
	let i = sS(t);
	_T(i, e, n, new r(i));
}, yT = class {
	constructor() {
		this.l = [];
	}
}, bT = () => new yT(), xT = (e, t) => e.l.push(t), ST = (e, t) => {
	let n = e.l, r = n.length;
	e.l = n.filter((e) => t !== e), r === e.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, CT = (e, t, n) => GS(e.l, [t, n]), wT = class {
	constructor(e, t) {
		this.client = e, this.clock = t;
	}
}, TT = (e, t) => e === t || e !== null && t !== null && e.client === t.client && e.clock === t.clock, K = (e, t) => new wT(e, t), ET = (e) => {
	for (let [t, n] of e.doc.share.entries()) if (n === e) return t;
	throw rS();
}, DT = (e, t) => {
	for (; t !== null;) {
		if (t.parent === e) return !0;
		t = t.parent._item;
	}
	return !1;
}, OT = class {
	constructor(e, t, n, r = 0) {
		this.type = e, this.tname = t, this.item = n, this.assoc = r;
	}
}, kT = class {
	constructor(e, t, n = 0) {
		this.type = e, this.index = t, this.assoc = n;
	}
}, AT = (e, t, n = 0) => new kT(e, t, n), jT = (e, t, n) => {
	let r = null, i = null;
	return e._item === null ? i = ET(e) : r = K(e._item.id.client, e._item.id.clock), new OT(r, i, t, n);
}, MT = (e, t, n = 0) => {
	let r = e._start;
	if (n < 0) {
		if (t === 0) return jT(e, null, n);
		t--;
	}
	for (; r !== null;) {
		if (!r.deleted && r.countable) {
			if (r.length > t) return jT(e, K(r.id.client, r.id.clock + t), n);
			t -= r.length;
		}
		if (r.right === null && n < 0) return jT(e, r.lastId, n);
		r = r.right;
	}
	return jT(e, null, n);
}, NT = (e, t) => {
	let n = WT(e, t);
	return {
		item: n,
		diff: t.clock - n.id.clock
	};
}, PT = (e, t, n = !0) => {
	let r = t.store, i = e.item, a = e.type, o = e.tname, s = e.assoc, c = null, l = 0;
	if (i !== null) {
		if (q(r, i.client) <= i.clock) return null;
		let e = n ? rO(r, i) : NT(r, i), t = e.item;
		if (!(t instanceof Z)) return null;
		if (c = t.parent, c._item === null || !c._item.deleted) {
			l = t.deleted || !t.countable ? 0 : e.diff + (s >= 0 ? 0 : 1);
			let n = t.left;
			for (; n !== null;) !n.deleted && n.countable && (l += n.length), n = n.left;
		}
	} else {
		if (o !== null) c = t.get(o);
		else if (a !== null) {
			if (q(r, a.client) <= a.clock) return null;
			let { item: e } = n ? rO(r, a) : { item: WT(r, a) };
			if (e instanceof Z && e.content instanceof tO) c = e.content.type;
			else return null;
		} else throw rS();
		l = s >= 0 ? c._length : 0;
	}
	return AT(c, l, e.assoc);
}, FT = class {
	constructor(e, t) {
		this.ds = e, this.sv = t;
	}
}, IT = (e, t) => new FT(e, t);
IT($w(), /* @__PURE__ */ new Map());
var LT = (e) => IT(eT(e.store), VT(e.store)), RT = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && (t.sv.get(e.id.client) || 0) > e.id.clock && !Yw(t.ds, e.id), zT = (e, t) => {
	let n = zb(e.meta, zT, Hb), r = e.doc.store;
	n.has(t) || (t.sv.forEach((t, n) => {
		t < q(r, n) && KT(e, K(n, t));
	}), qw(e, t.ds, (e) => {}), n.add(t));
}, BT = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
	}
}, VT = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.clients.forEach((e, n) => {
		let r = e[e.length - 1];
		t.set(n, r.id.clock + r.length);
	}), t;
}, q = (e, t) => {
	let n = e.clients.get(t);
	if (n === void 0) return 0;
	let r = n[n.length - 1];
	return r.id.clock + r.length;
}, HT = (e, t) => {
	let n = e.clients.get(t.id.client);
	if (n === void 0) n = [], e.clients.set(t.id.client, n);
	else {
		let e = n[n.length - 1];
		if (e.id.clock + e.length !== t.id.clock) throw rS();
	}
	n.push(t);
}, UT = (e, t) => {
	let n = 0, r = e.length - 1, i = e[r], a = i.id.clock;
	if (a === t) return r;
	let o = Zb(t / (a + i.length - 1) * r);
	for (; n <= r;) {
		if (i = e[o], a = i.id.clock, a <= t) {
			if (t < a + i.length) return o;
			n = o + 1;
		} else r = o - 1;
		o = Zb((n + r) / 2);
	}
	throw rS();
}, WT = (e, t) => {
	let n = e.clients.get(t.client);
	return n[UT(n, t.clock)];
}, GT = (e, t, n) => {
	let r = UT(t, n), i = t[r];
	return i.id.clock < n && i instanceof Z ? (t.splice(r + 1, 0, aO(e, i, n - i.id.clock)), r + 1) : r;
}, KT = (e, t) => {
	let n = e.doc.store.clients.get(t.client);
	return n[GT(e, n, t.clock)];
}, qT = (e, t, n) => {
	let r = t.clients.get(n.client), i = UT(r, n.clock), a = r[i];
	return n.clock !== a.id.clock + a.length - 1 && a.constructor !== kD && r.splice(i + 1, 0, aO(e, a, n.clock - a.id.clock + 1)), a;
}, JT = (e, t, n) => {
	let r = e.clients.get(t.id.client);
	r[UT(r, t.id.clock)] = n;
}, YT = (e, t, n, r, i) => {
	if (r === 0) return;
	let a = n + r, o = GT(e, t, n), s;
	do
		s = t[o++], a < s.id.clock + s.length && GT(e, t, a), i(s);
	while (o < t.length && t[o].id.clock < a);
}, XT = class {
	constructor(e, t, n) {
		this.doc = e, this.deleteSet = new Kw(), this.beforeState = VT(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = t, this.meta = /* @__PURE__ */ new Map(), this.local = n, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
	}
}, ZT = (e, t) => t.deleteSet.clients.size === 0 && !Vb(t.afterState, (e, n) => t.beforeState.get(n) !== e) ? !1 : (Xw(t.deleteSet), gT(e, t), tT(e, t.deleteSet), !0), QT = (e, t, n) => {
	let r = t._item;
	(r === null || r.id.clock < (e.beforeState.get(r.id.client) || 0) && !r.deleted) && zb(e.changed, t, Hb).add(n);
}, $T = (e, t) => {
	let n = e[t], r = e[t - 1], i = t;
	for (; i > 0; n = r, r = e[--i - 1]) {
		if (r.deleted === n.deleted && r.constructor === n.constructor && r.mergeWith(n)) {
			n instanceof Z && n.parentSub !== null && n.parent._map.get(n.parentSub) === n && n.parent._map.set(n.parentSub, r);
			continue;
		}
		break;
	}
	let a = t - i;
	return a && e.splice(t + 1 - a, a), a;
}, eE = (e, t, n) => {
	for (let [r, i] of e.clients.entries()) {
		let e = t.clients.get(r);
		for (let r = i.length - 1; r >= 0; r--) {
			let a = i[r], o = a.clock + a.len;
			for (let r = UT(e, a.clock), i = e[r]; r < e.length && i.id.clock < o; i = e[++r]) {
				let i = e[r];
				if (a.clock + a.len <= i.id.clock) break;
				i instanceof Z && i.deleted && !i.keep && n(i) && i.gc(t, !1);
			}
		}
	}
}, tE = (e, t) => {
	e.clients.forEach((e, n) => {
		let r = t.clients.get(n);
		for (let t = e.length - 1; t >= 0; t--) {
			let n = e[t], i = $b(r.length - 1, 1 + UT(r, n.clock + n.len - 1));
			for (let e = i, t = r[e]; e > 0 && t.id.clock >= n.clock; t = r[e]) e -= 1 + $T(r, e);
		}
	});
}, nE = (e, t) => {
	if (t < e.length) {
		let n = e[t], r = n.doc, i = r.store, a = n.deleteSet, o = n._mergeStructs;
		try {
			Xw(a), n.afterState = VT(n.doc.store), r.emit("beforeObserverCalls", [n, r]);
			let e = [];
			n.changed.forEach((t, r) => e.push(() => {
				(r._item === null || !r._item.deleted) && r._callObserver(n, t);
			})), e.push(() => {
				n.changedParentTypes.forEach((t, r) => {
					r._dEH.l.length > 0 && (r._item === null || !r._item.deleted) && (t = t.filter((e) => e.target._item === null || !e.target._item.deleted), t.forEach((e) => {
						e.currentTarget = r, e._path = null;
					}), t.sort((e, t) => e.path.length - t.path.length), e.push(() => {
						CT(r._dEH, t, n);
					}));
				}), e.push(() => r.emit("afterTransaction", [n, r])), e.push(() => {
					n._needFormattingCleanup && fD(n);
				});
			}), GS(e, []);
		} finally {
			r.gc && eE(a, i, r.gcFilter), tE(a, i), n.afterState.forEach((e, t) => {
				let r = n.beforeState.get(t) || 0;
				if (r !== e) {
					let e = i.clients.get(t), n = ex(UT(e, r), 1);
					for (let t = e.length - 1; t >= n;) t -= 1 + $T(e, t);
				}
			});
			for (let e = o.length - 1; e >= 0; e--) {
				let { client: t, clock: n } = o[e].id, r = i.clients.get(t), a = UT(r, n);
				a + 1 < r.length && $T(r, a + 1) > 1 || a > 0 && $T(r, a);
			}
			if (!n.local && n.afterState.get(r.clientID) !== n.beforeState.get(r.clientID) && (zw(Pw, Dw, "[yjs] ", Ow, Mw, "Changed the client-id because another client seems to be using it."), r.clientID = iT()), r.emit("afterTransactionCleanup", [n, r]), r._observers.has("update")) {
				let e = new lT();
				ZT(e, n) && r.emit("update", [
					e.toUint8Array(),
					n.origin,
					r,
					n
				]);
			}
			if (r._observers.has("updateV2")) {
				let e = new dT();
				ZT(e, n) && r.emit("updateV2", [
					e.toUint8Array(),
					n.origin,
					r,
					n
				]);
			}
			let { subdocsAdded: s, subdocsLoaded: c, subdocsRemoved: l } = n;
			(s.size > 0 || l.size > 0 || c.size > 0) && (s.forEach((e) => {
				e.clientID = r.clientID, e.collectionid ??= r.collectionid, r.subdocs.add(e);
			}), l.forEach((e) => r.subdocs.delete(e)), r.emit("subdocs", [
				{
					loaded: c,
					added: s,
					removed: l
				},
				r,
				n
			]), l.forEach((e) => e.destroy())), e.length <= t + 1 ? (r._transactionCleanups = [], r.emit("afterAllTransactions", [r, e])) : nE(e, t + 1);
		}
	}
}, J = (e, t, n = null, r = !0) => {
	let i = e._transactionCleanups, a = !1, o = null;
	e._transaction === null && (a = !0, e._transaction = new XT(e, n, r), i.push(e._transaction), i.length === 1 && e.emit("beforeAllTransactions", [e]), e.emit("beforeTransaction", [e._transaction, e]));
	try {
		o = t(e._transaction);
	} finally {
		if (a) {
			let t = e._transaction === i[0];
			e._transaction = null, t && nE(i, 0);
		}
	}
	return o;
}, rE = class {
	constructor(e, t) {
		this.insertions = t, this.deletions = e, this.meta = /* @__PURE__ */ new Map();
	}
}, iE = (e, t, n) => {
	qw(e, n.deletions, (n) => {
		n instanceof Z && t.scope.some((t) => t === e.doc || DT(t, n)) && iO(n, !1);
	});
}, aE = (e, t, n) => {
	let r = null, i = e.doc, a = e.scope;
	J(i, (n) => {
		for (; t.length > 0 && e.currStackItem === null;) {
			let r = i.store, o = t.pop(), s = /* @__PURE__ */ new Set(), c = [], l = !1;
			qw(n, o.insertions, (e) => {
				if (e instanceof Z) {
					if (e.redone !== null) {
						let { item: t, diff: i } = rO(r, e.id);
						i > 0 && (t = KT(n, K(t.id.client, t.id.clock + i))), e = t;
					}
					!e.deleted && a.some((t) => t === n.doc || DT(t, e)) && c.push(e);
				}
			}), qw(n, o.deletions, (e) => {
				e instanceof Z && a.some((t) => t === n.doc || DT(t, e)) && !Yw(o.insertions, e.id) && s.add(e);
			}), s.forEach((t) => {
				l = sO(n, t, s, o.insertions, e.ignoreRemoteMapChanges, e) !== null || l;
			});
			for (let t = c.length - 1; t >= 0; t--) {
				let r = c[t];
				e.deleteFilter(r) && (r.delete(n), l = !0);
			}
			e.currStackItem = l ? o : null;
		}
		n.changed.forEach((e, t) => {
			e.has(null) && t._searchMarker && (t._searchMarker.length = 0);
		}), r = n;
	}, e);
	let o = e.currStackItem;
	if (o != null) {
		let t = r.changedParentTypes;
		e.emit("stack-item-popped", [{
			stackItem: o,
			type: n,
			changedParentTypes: t,
			origin: e
		}, e]), e.currStackItem = null;
	}
	return o;
}, oE = class extends Xb {
	constructor(e, { captureTimeout: t = 500, captureTransaction: n = (e) => !0, deleteFilter: r = () => !0, trackedOrigins: i = /* @__PURE__ */ new Set([null]), ignoreRemoteMapChanges: a = !1, doc: o = Yb(e) ? e[0].doc : e instanceof aT ? e : e.doc } = {}) {
		super(), this.scope = [], this.doc = o, this.addToScope(e), this.deleteFilter = r, i.add(this), this.trackedOrigins = i, this.captureTransaction = n, this.undoStack = [], this.redoStack = [], this.undoing = !1, this.redoing = !1, this.currStackItem = null, this.lastChange = 0, this.ignoreRemoteMapChanges = a, this.captureTimeout = t, this.afterTransactionHandler = (e) => {
			if (!this.captureTransaction(e) || !this.scope.some((t) => e.changedParentTypes.has(t) || t === this.doc) || !this.trackedOrigins.has(e.origin) && (!e.origin || !this.trackedOrigins.has(e.origin.constructor))) return;
			let t = this.undoing, n = this.redoing, r = t ? this.redoStack : this.undoStack;
			t ? this.stopCapturing() : n || this.clear(!1, !0);
			let i = new Kw();
			e.afterState.forEach((t, n) => {
				let r = e.beforeState.get(n) || 0, a = t - r;
				a > 0 && Qw(i, n, r, a);
			});
			let a = DS(), o = !1;
			if (this.lastChange > 0 && a - this.lastChange < this.captureTimeout && r.length > 0 && !t && !n) {
				let t = r[r.length - 1];
				t.deletions = Zw([t.deletions, e.deleteSet]), t.insertions = Zw([t.insertions, i]);
			} else r.push(new rE(e.deleteSet, i)), o = !0;
			!t && !n && (this.lastChange = a), qw(e, e.deleteSet, (t) => {
				t instanceof Z && this.scope.some((n) => n === e.doc || DT(n, t)) && iO(t, !0);
			});
			let s = [{
				stackItem: r[r.length - 1],
				origin: e.origin,
				type: t ? "redo" : "undo",
				changedParentTypes: e.changedParentTypes
			}, this];
			o ? this.emit("stack-item-added", s) : this.emit("stack-item-updated", s);
		}, this.doc.on("afterTransaction", this.afterTransactionHandler), this.doc.on("destroy", () => {
			this.destroy();
		});
	}
	addToScope(e) {
		let t = new Set(this.scope);
		e = Yb(e) ? e : [e], e.forEach((e) => {
			t.has(e) || (t.add(e), (e instanceof Y ? e.doc !== this.doc : e !== this.doc) && Bw("[yjs#509] Not same Y.Doc"), this.scope.push(e));
		});
	}
	addTrackedOrigin(e) {
		this.trackedOrigins.add(e);
	}
	removeTrackedOrigin(e) {
		this.trackedOrigins.delete(e);
	}
	clear(e = !0, t = !0) {
		(e && this.canUndo() || t && this.canRedo()) && this.doc.transact((n) => {
			e && (this.undoStack.forEach((e) => iE(n, this, e)), this.undoStack = []), t && (this.redoStack.forEach((e) => iE(n, this, e)), this.redoStack = []), this.emit("stack-cleared", [{
				undoStackCleared: e,
				redoStackCleared: t
			}]);
		});
	}
	stopCapturing() {
		this.lastChange = 0;
	}
	undo() {
		this.undoing = !0;
		let e;
		try {
			e = aE(this, this.undoStack, "undo");
		} finally {
			this.undoing = !1;
		}
		return e;
	}
	redo() {
		this.redoing = !0;
		let e;
		try {
			e = aE(this, this.redoStack, "redo");
		} finally {
			this.redoing = !1;
		}
		return e;
	}
	canUndo() {
		return this.undoStack.length > 0;
	}
	canRedo() {
		return this.redoStack.length > 0;
	}
	destroy() {
		this.trackedOrigins.delete(this), this.doc.off("afterTransaction", this.afterTransactionHandler), super.destroy();
	}
};
function* sE(e) {
	let t = U(e.restDecoder);
	for (let n = 0; n < t; n++) {
		let t = U(e.restDecoder), n = e.readClient(), r = U(e.restDecoder);
		for (let i = 0; i < t; i++) {
			let t = e.readInfo();
			if (t === 10) {
				let t = U(e.restDecoder);
				yield new dO(K(n, r), t), r += t;
			} else if (31 & t) {
				let i = (t & 192) == 0, a = new Z(K(n, r), null, (t & 128) == 128 ? e.readLeftID() : null, null, (t & 64) == 64 ? e.readRightID() : null, i ? e.readParentInfo() ? e.readString() : e.readLeftID() : null, i && (t & 32) == 32 ? e.readString() : null, cO(e, t));
				yield a, r += a.length;
			} else {
				let t = e.readLen();
				yield new kD(K(n, r), t), r += t;
			}
		}
	}
}
var cE = class {
	constructor(e, t) {
		this.gen = sE(e), this.curr = null, this.done = !1, this.filterSkips = t, this.next();
	}
	next() {
		do
			this.curr = this.gen.next().value || null;
		while (this.filterSkips && this.curr !== null && this.curr.constructor === dO);
		return this.curr;
	}
}, lE = class {
	constructor(e) {
		this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
	}
}, uE = (e, t) => {
	if (e.constructor === kD) {
		let { client: n, clock: r } = e.id;
		return new kD(K(n, r + t), e.length - t);
	} else if (e.constructor === dO) {
		let { client: n, clock: r } = e.id;
		return new dO(K(n, r + t), e.length - t);
	} else {
		let n = e, { client: r, clock: i } = n.id;
		return new Z(K(r, i + t), null, K(r, i + t - 1), null, n.rightOrigin, n.parent, n.parentSub, n.content.splice(t));
	}
}, dE = (e, t = sT, n = dT) => {
	if (e.length === 1) return e[0];
	let r = e.map((e) => new t(sS(e))), i = r.map((e) => new cE(e, !0)), a = null, o = new n(), s = new lE(o);
	for (; i = i.filter((e) => e.curr !== null), i.sort((e, t) => {
		if (e.curr.id.client === t.curr.id.client) {
			let n = e.curr.id.clock - t.curr.id.clock;
			return n === 0 ? e.curr.constructor === t.curr.constructor ? 0 : e.curr.constructor === dO ? 1 : -1 : n;
		} else return t.curr.id.client - e.curr.id.client;
	}), i.length !== 0;) {
		let e = i[0], t = e.curr.id.client;
		if (a !== null) {
			let n = e.curr, r = !1;
			for (; n !== null && n.id.clock + n.length <= a.struct.id.clock + a.struct.length && n.id.client >= a.struct.id.client;) n = e.next(), r = !0;
			if (n === null || n.id.client !== t || r && n.id.clock > a.struct.id.clock + a.struct.length) continue;
			if (t !== a.struct.id.client) pE(s, a.struct, a.offset), a = {
				struct: n,
				offset: 0
			}, e.next();
			else if (a.struct.id.clock + a.struct.length < n.id.clock) if (a.struct.constructor === dO) a.struct.length = n.id.clock + n.length - a.struct.id.clock;
			else {
				pE(s, a.struct, a.offset);
				let e = n.id.clock - a.struct.id.clock - a.struct.length;
				a = {
					struct: new dO(K(t, a.struct.id.clock + a.struct.length), e),
					offset: 0
				};
			}
			else {
				let t = a.struct.id.clock + a.struct.length - n.id.clock;
				t > 0 && (a.struct.constructor === dO ? a.struct.length -= t : n = uE(n, t)), a.struct.mergeWith(n) || (pE(s, a.struct, a.offset), a = {
					struct: n,
					offset: 0
				}, e.next());
			}
		} else a = {
			struct: e.curr,
			offset: 0
		}, e.next();
		for (let n = e.curr; n !== null && n.id.client === t && n.id.clock === a.struct.id.clock + a.struct.length && n.constructor !== dO; n = e.next()) pE(s, a.struct, a.offset), a = {
			struct: n,
			offset: 0
		};
	}
	return a !== null && (pE(s, a.struct, a.offset), a = null), mE(s), tT(o, Zw(r.map((e) => nT(e)))), o.toUint8Array();
}, fE = (e) => {
	e.written > 0 && (e.clientStructs.push({
		written: e.written,
		restEncoder: Nx(e.encoder.restEncoder)
	}), e.encoder.restEncoder = Ax(), e.written = 0);
}, pE = (e, t, n) => {
	e.written > 0 && e.currClient !== t.id.client && fE(e), e.written === 0 && (e.currClient = t.id.client, e.encoder.writeClient(t.id.client), H(e.encoder.restEncoder, t.id.clock + n)), t.write(e.encoder, n), e.written++;
}, mE = (e) => {
	fE(e);
	let t = e.encoder.restEncoder;
	H(t, e.clientStructs.length);
	for (let n = 0; n < e.clientStructs.length; n++) {
		let r = e.clientStructs[n];
		H(t, r.written), Bx(t, r.restEncoder);
	}
}, hE = "You must not compute changes after the event-handler fired.", gE = class {
	constructor(e, t) {
		this.target = e, this.currentTarget = e, this.transaction = t, this._changes = null, this._keys = null, this._delta = null, this._path = null;
	}
	get path() {
		return this._path ||= _E(this.currentTarget, this.target);
	}
	deletes(e) {
		return Yw(this.transaction.deleteSet, e.id);
	}
	get keys() {
		if (this._keys === null) {
			if (this.transaction.doc._transactionCleanups.length === 0) throw tS(hE);
			let e = /* @__PURE__ */ new Map(), t = this.target;
			this.transaction.changed.get(t).forEach((n) => {
				if (n !== null) {
					let r = t._map.get(n), i, a;
					if (this.adds(r)) {
						let e = r.left;
						for (; e !== null && this.adds(e);) e = e.left;
						if (this.deletes(r)) if (e !== null && this.deletes(e)) i = "delete", a = Ub(e.content.getContent());
						else return;
						else e !== null && this.deletes(e) ? (i = "update", a = Ub(e.content.getContent())) : (i = "add", a = void 0);
					} else if (this.deletes(r)) i = "delete", a = Ub(r.content.getContent());
					else return;
					e.set(n, {
						action: i,
						oldValue: a
					});
				}
			}), this._keys = e;
		}
		return this._keys;
	}
	get delta() {
		return this.changes.delta;
	}
	adds(e) {
		return e.id.clock >= (this.transaction.beforeState.get(e.id.client) || 0);
	}
	get changes() {
		let e = this._changes;
		if (e === null) {
			if (this.transaction.doc._transactionCleanups.length === 0) throw tS(hE);
			let t = this.target, n = Hb(), r = Hb(), i = [];
			if (e = {
				added: n,
				deleted: r,
				delta: i,
				keys: this.keys
			}, this.transaction.changed.get(t).has(null)) {
				let e = null, a = () => {
					e && i.push(e);
				};
				for (let i = t._start; i !== null; i = i.right) i.deleted ? this.deletes(i) && !this.adds(i) && ((e === null || e.delete === void 0) && (a(), e = { delete: 0 }), e.delete += i.length, r.add(i)) : this.adds(i) ? ((e === null || e.insert === void 0) && (a(), e = { insert: [] }), e.insert = e.insert.concat(i.content.getContent()), n.add(i)) : ((e === null || e.retain === void 0) && (a(), e = { retain: 0 }), e.retain += i.length);
				e !== null && e.retain === void 0 && a();
			}
			this._changes = e;
		}
		return e;
	}
}, _E = (e, t) => {
	let n = [];
	for (; t._item !== null && t !== e;) {
		if (t._item.parentSub !== null) n.unshift(t._item.parentSub);
		else {
			let e = 0, r = t._item.parent._start;
			for (; r !== t._item && r !== null;) !r.deleted && r.countable && (e += r.length), r = r.right;
			n.unshift(e);
		}
		t = t._item.parent;
	}
	return n;
}, vE = () => {
	Bw("Invalid access: Add Yjs type to a document before reading data.");
}, yE = 80, bE = 0, xE = class {
	constructor(e, t) {
		e.marker = !0, this.p = e, this.index = t, this.timestamp = bE++;
	}
}, SE = (e) => {
	e.timestamp = bE++;
}, CE = (e, t, n) => {
	e.p.marker = !1, e.p = t, t.marker = !0, e.index = n, e.timestamp = bE++;
}, wE = (e, t, n) => {
	if (e.length >= yE) {
		let r = e.reduce((e, t) => e.timestamp < t.timestamp ? e : t);
		return CE(r, t, n), r;
	} else {
		let r = new xE(t, n);
		return e.push(r), r;
	}
}, TE = (e, t) => {
	if (e._start === null || t === 0 || e._searchMarker === null) return null;
	let n = e._searchMarker.length === 0 ? null : e._searchMarker.reduce((e, n) => Qb(t - e.index) < Qb(t - n.index) ? e : n), r = e._start, i = 0;
	for (n !== null && (r = n.p, i = n.index, SE(n)); r.right !== null && i < t;) {
		if (!r.deleted && r.countable) {
			if (t < i + r.length) break;
			i += r.length;
		}
		r = r.right;
	}
	for (; r.left !== null && i > t;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	for (; r.left !== null && r.left.id.client === r.id.client && r.left.id.clock + r.left.length === r.id.clock;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	return n !== null && Qb(n.index - i) < r.parent.length / yE ? (CE(n, r, i), n) : wE(e._searchMarker, r, i);
}, EE = (e, t, n) => {
	for (let r = e.length - 1; r >= 0; r--) {
		let i = e[r];
		if (n > 0) {
			let t = i.p;
			for (t.marker = !1; t && (t.deleted || !t.countable);) t = t.left, t && !t.deleted && t.countable && (i.index -= t.length);
			if (t === null || t.marker === !0) {
				e.splice(r, 1);
				continue;
			}
			i.p = t, t.marker = !0;
		}
		(t < i.index || n > 0 && t === i.index) && (i.index = ex(t, i.index + n));
	}
}, DE = (e, t, n) => {
	let r = e, i = t.changedParentTypes;
	for (; zb(i, e, () => []).push(n), e._item !== null;) e = e._item.parent;
	CT(r._eH, n, t);
}, Y = class {
	constructor() {
		this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = bT(), this._dEH = bT(), this._searchMarker = null;
	}
	get parent() {
		return this._item ? this._item.parent : null;
	}
	_integrate(e, t) {
		this.doc = e, this._item = t;
	}
	_copy() {
		throw nS();
	}
	clone() {
		throw nS();
	}
	_write(e) {}
	get _first() {
		let e = this._start;
		for (; e !== null && e.deleted;) e = e.right;
		return e;
	}
	_callObserver(e, t) {
		!e.local && this._searchMarker && (this._searchMarker.length = 0);
	}
	observe(e) {
		xT(this._eH, e);
	}
	observeDeep(e) {
		xT(this._dEH, e);
	}
	unobserve(e) {
		ST(this._eH, e);
	}
	unobserveDeep(e) {
		ST(this._dEH, e);
	}
	toJSON() {}
}, OE = (e, t, n) => {
	e.doc ?? vE(), t < 0 && (t = e._length + t), n < 0 && (n = e._length + n);
	let r = n - t, i = [], a = e._start;
	for (; a !== null && r > 0;) {
		if (a.countable && !a.deleted) {
			let e = a.content.getContent();
			if (e.length <= t) t -= e.length;
			else {
				for (let n = t; n < e.length && r > 0; n++) i.push(e[n]), r--;
				t = 0;
			}
		}
		a = a.right;
	}
	return i;
}, kE = (e) => {
	e.doc ?? vE();
	let t = [], n = e._start;
	for (; n !== null;) {
		if (n.countable && !n.deleted) {
			let e = n.content.getContent();
			for (let n = 0; n < e.length; n++) t.push(e[n]);
		}
		n = n.right;
	}
	return t;
}, AE = (e, t) => {
	let n = [], r = e._start;
	for (; r !== null;) {
		if (r.countable && RT(r, t)) {
			let e = r.content.getContent();
			for (let t = 0; t < e.length; t++) n.push(e[t]);
		}
		r = r.right;
	}
	return n;
}, jE = (e, t) => {
	let n = 0, r = e._start;
	for (e.doc ?? vE(); r !== null;) {
		if (r.countable && !r.deleted) {
			let i = r.content.getContent();
			for (let r = 0; r < i.length; r++) t(i[r], n++, e);
		}
		r = r.right;
	}
}, ME = (e, t) => {
	let n = [];
	return jE(e, (r, i) => {
		n.push(t(r, i, e));
	}), n;
}, NE = (e) => {
	let t = e._start, n = null, r = 0;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next: () => {
			if (n === null) {
				for (; t !== null && t.deleted;) t = t.right;
				if (t === null) return {
					done: !0,
					value: void 0
				};
				n = t.content.getContent(), r = 0, t = t.right;
			}
			let e = n[r++];
			return n.length <= r && (n = null), {
				done: !1,
				value: e
			};
		}
	};
}, PE = (e, t) => {
	e.doc ?? vE();
	let n = TE(e, t), r = e._start;
	for (n !== null && (r = n.p, t -= n.index); r !== null; r = r.right) if (!r.deleted && r.countable) {
		if (t < r.length) return r.content.getContent()[t];
		t -= r.length;
	}
}, FE = (e, t, n, r) => {
	let i = n, a = e.doc, o = a.clientID, s = a.store, c = n === null ? t._start : n.right, l = [], u = () => {
		l.length > 0 && (i = new Z(K(o, q(s, o)), i, i && i.lastId, c, c && c.id, t, null, new UD(l)), i.integrate(e, 0), l = []);
	};
	r.forEach((n) => {
		if (n === null) l.push(n);
		else switch (n.constructor) {
			case Number:
			case Object:
			case Boolean:
			case Array:
			case String:
				l.push(n);
				break;
			default: switch (u(), n.constructor) {
				case Uint8Array:
				case ArrayBuffer:
					i = new Z(K(o, q(s, o)), i, i && i.lastId, c, c && c.id, t, null, new AD(new Uint8Array(n))), i.integrate(e, 0);
					break;
				case aT:
					i = new Z(K(o, q(s, o)), i, i && i.lastId, c, c && c.id, t, null, new FD(n)), i.integrate(e, 0);
					break;
				default: if (n instanceof Y) i = new Z(K(o, q(s, o)), i, i && i.lastId, c, c && c.id, t, null, new tO(n)), i.integrate(e, 0);
				else throw Error("Unexpected content type in insert operation");
			}
		}
	}), u();
}, IE = () => tS("Length exceeded!"), LE = (e, t, n, r) => {
	if (n > t._length) throw IE();
	if (n === 0) return t._searchMarker && EE(t._searchMarker, n, r.length), FE(e, t, null, r);
	let i = n, a = TE(t, n), o = t._start;
	for (a !== null && (o = a.p, n -= a.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right) if (!o.deleted && o.countable) {
		if (n <= o.length) {
			n < o.length && KT(e, K(o.id.client, o.id.clock + n));
			break;
		}
		n -= o.length;
	}
	return t._searchMarker && EE(t._searchMarker, i, r.length), FE(e, t, o, r);
}, RE = (e, t, n) => {
	let r = (t._searchMarker || []).reduce((e, t) => t.index > e.index ? t : e, {
		index: 0,
		p: t._start
	}).p;
	if (r) for (; r.right;) r = r.right;
	return FE(e, t, r, n);
}, zE = (e, t, n, r) => {
	if (r === 0) return;
	let i = n, a = r, o = TE(t, n), s = t._start;
	for (o !== null && (s = o.p, n -= o.index); s !== null && n > 0; s = s.right) !s.deleted && s.countable && (n < s.length && KT(e, K(s.id.client, s.id.clock + n)), n -= s.length);
	for (; r > 0 && s !== null;) s.deleted || (r < s.length && KT(e, K(s.id.client, s.id.clock + r)), s.delete(e), r -= s.length), s = s.right;
	if (r > 0) throw IE();
	t._searchMarker && EE(t._searchMarker, i, -a + r);
}, BE = (e, t, n) => {
	let r = t._map.get(n);
	r !== void 0 && r.delete(e);
}, VE = (e, t, n, r) => {
	let i = t._map.get(n) || null, a = e.doc, o = a.clientID, s;
	if (r == null) s = new UD([r]);
	else switch (r.constructor) {
		case Number:
		case Object:
		case Boolean:
		case Array:
		case String:
		case Date:
		case BigInt:
			s = new UD([r]);
			break;
		case Uint8Array:
			s = new AD(r);
			break;
		case aT:
			s = new FD(r);
			break;
		default: if (r instanceof Y) s = new tO(r);
		else throw Error("Unexpected content type");
	}
	new Z(K(o, q(a.store, o)), i, i && i.lastId, null, null, t, n, s).integrate(e, 0);
}, HE = (e, t) => {
	e.doc ?? vE();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, UE = (e) => {
	let t = {};
	return e.doc ?? vE(), e._map.forEach((e, n) => {
		e.deleted || (t[n] = e.content.getContent()[e.length - 1]);
	}), t;
}, WE = (e, t) => {
	e.doc ?? vE();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted;
}, GE = (e, t) => {
	let n = {};
	return e._map.forEach((e, r) => {
		let i = e;
		for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0));) i = i.left;
		i !== null && RT(i, t) && (n[r] = i.content.getContent()[i.length - 1]);
	}), n;
}, KE = (e) => (e.doc ?? vE(), Uw(e._map.entries(), (e) => !e[1].deleted)), qE = class extends gE {}, JE = class e extends Y {
	constructor() {
		super(), this._prelimContent = [], this._searchMarker = [];
	}
	static from(t) {
		let n = new e();
		return n.push(t), n;
	}
	_integrate(e, t) {
		super._integrate(e, t), this.insert(0, this._prelimContent), this._prelimContent = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.insert(0, this.toArray().map((e) => e instanceof Y ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? vE(), this._length;
	}
	_callObserver(e, t) {
		super._callObserver(e, t), DE(this, e, new qE(this, e));
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : J(this.doc, (n) => {
			LE(n, this, e, t);
		});
	}
	push(e) {
		this.doc === null ? this._prelimContent.push(...e) : J(this.doc, (t) => {
			RE(t, this, e);
		});
	}
	unshift(e) {
		this.insert(0, e);
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : J(this.doc, (n) => {
			zE(n, this, e, t);
		});
	}
	get(e) {
		return PE(this, e);
	}
	toArray() {
		return kE(this);
	}
	slice(e = 0, t = this.length) {
		return OE(this, e, t);
	}
	toJSON() {
		return this.map((e) => e instanceof Y ? e.toJSON() : e);
	}
	map(e) {
		return ME(this, e);
	}
	forEach(e) {
		jE(this, e);
	}
	[Symbol.iterator]() {
		return NE(this);
	}
	_write(e) {
		e.writeTypeRef(JD);
	}
}, YE = (e) => new JE(), XE = class extends gE {
	constructor(e, t, n) {
		super(e, t), this.keysChanged = n;
	}
}, ZE = class e extends Y {
	constructor(e) {
		super(), this._prelimContent = null, e === void 0 ? this._prelimContent = /* @__PURE__ */ new Map() : this._prelimContent = new Map(e);
	}
	_integrate(e, t) {
		super._integrate(e, t), this._prelimContent.forEach((e, t) => {
			this.set(t, e);
		}), this._prelimContent = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return this.forEach((e, n) => {
			t.set(n, e instanceof Y ? e.clone() : e);
		}), t;
	}
	_callObserver(e, t) {
		DE(this, e, new XE(this, e, t));
	}
	toJSON() {
		this.doc ?? vE();
		let e = {};
		return this._map.forEach((t, n) => {
			if (!t.deleted) {
				let r = t.content.getContent()[t.length - 1];
				e[n] = r instanceof Y ? r.toJSON() : r;
			}
		}), e;
	}
	get size() {
		return [...KE(this)].length;
	}
	keys() {
		return Ww(KE(this), (e) => e[0]);
	}
	values() {
		return Ww(KE(this), (e) => e[1].content.getContent()[e[1].length - 1]);
	}
	entries() {
		return Ww(KE(this), (e) => [e[0], e[1].content.getContent()[e[1].length - 1]]);
	}
	forEach(e) {
		this.doc ?? vE(), this._map.forEach((t, n) => {
			t.deleted || e(t.content.getContent()[t.length - 1], n, this);
		});
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	delete(e) {
		this.doc === null ? this._prelimContent.delete(e) : J(this.doc, (t) => {
			BE(t, this, e);
		});
	}
	set(e, t) {
		return this.doc === null ? this._prelimContent.set(e, t) : J(this.doc, (n) => {
			VE(n, this, e, t);
		}), t;
	}
	get(e) {
		return HE(this, e);
	}
	has(e) {
		return WE(this, e);
	}
	clear() {
		this.doc === null ? this._prelimContent.clear() : J(this.doc, (e) => {
			this.forEach(function(t, n, r) {
				BE(e, r, n);
			});
		});
	}
	_write(e) {
		e.writeTypeRef(YD);
	}
}, QE = (e) => new ZE(), $E = (e, t) => e === t || typeof e == "object" && typeof t == "object" && e && t && HS(e, t), eD = class {
	constructor(e, t, n, r) {
		this.left = e, this.right = t, this.index = n, this.currentAttributes = r;
	}
	forward() {
		switch (this.right === null && rS(), this.right.content.constructor) {
			case X:
				this.right.deleted || iD(this.currentAttributes, this.right.content);
				break;
			default:
				this.right.deleted || (this.index += this.right.length);
				break;
		}
		this.left = this.right, this.right = this.right.right;
	}
}, tD = (e, t, n) => {
	for (; t.right !== null && n > 0;) {
		switch (t.right.content.constructor) {
			case X:
				t.right.deleted || iD(t.currentAttributes, t.right.content);
				break;
			default:
				t.right.deleted || (n < t.right.length && KT(e, K(t.right.id.client, t.right.id.clock + n)), t.index += t.right.length, n -= t.right.length);
				break;
		}
		t.left = t.right, t.right = t.right.right;
	}
	return t;
}, nD = (e, t, n, r) => {
	let i = /* @__PURE__ */ new Map(), a = r ? TE(t, n) : null;
	return a ? tD(e, new eD(a.p.left, a.p, a.index, i), n - a.index) : tD(e, new eD(null, t._start, 0, i), n);
}, rD = (e, t, n, r) => {
	for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === X && $E(r.get(n.right.content.key), n.right.content.value));) n.right.deleted || r.delete(n.right.content.key), n.forward();
	let i = e.doc, a = i.clientID;
	r.forEach((r, o) => {
		let s = n.left, c = n.right, l = new Z(K(a, q(i.store, a)), s, s && s.lastId, c, c && c.id, t, null, new X(o, r));
		l.integrate(e, 0), n.right = l, n.forward();
	});
}, iD = (e, t) => {
	let { key: n, value: r } = t;
	r === null ? e.delete(n) : e.set(n, r);
}, aD = (e, t) => {
	for (; e.right !== null && (e.right.deleted || e.right.content.constructor === X && $E(t[e.right.content.key] ?? null, e.right.content.value));) e.forward();
}, oD = (e, t, n, r) => {
	let i = e.doc, a = i.clientID, o = /* @__PURE__ */ new Map();
	for (let s in r) {
		let c = r[s], l = n.currentAttributes.get(s) ?? null;
		if (!$E(l, c)) {
			o.set(s, l);
			let { left: r, right: u } = n;
			n.right = new Z(K(a, q(i.store, a)), r, r && r.lastId, u, u && u.id, t, null, new X(s, c)), n.right.integrate(e, 0), n.forward();
		}
	}
	return o;
}, sD = (e, t, n, r, i) => {
	n.currentAttributes.forEach((e, t) => {
		i[t] === void 0 && (i[t] = null);
	});
	let a = e.doc, o = a.clientID;
	aD(n, i);
	let s = oD(e, t, n, i), c = r.constructor === String ? new GD(r) : r instanceof Y ? new tO(r) : new LD(r), { left: l, right: u, index: d } = n;
	t._searchMarker && EE(t._searchMarker, n.index, c.getLength()), u = new Z(K(o, q(a.store, o)), l, l && l.lastId, u, u && u.id, t, null, c), u.integrate(e, 0), n.right = u, n.index = d, n.forward(), rD(e, t, n, s);
}, cD = (e, t, n, r, i) => {
	let a = e.doc, o = a.clientID;
	aD(n, i);
	let s = oD(e, t, n, i);
	iterationLoop: for (; n.right !== null && (r > 0 || s.size > 0 && (n.right.deleted || n.right.content.constructor === X));) {
		if (!n.right.deleted) switch (n.right.content.constructor) {
			case X: {
				let { key: t, value: a } = n.right.content, o = i[t];
				if (o !== void 0) {
					if ($E(o, a)) s.delete(t);
					else {
						if (r === 0) break iterationLoop;
						s.set(t, a);
					}
					n.right.delete(e);
				} else n.currentAttributes.set(t, a);
				break;
			}
			default:
				r < n.right.length && KT(e, K(n.right.id.client, n.right.id.clock + r)), r -= n.right.length;
				break;
		}
		n.forward();
	}
	if (r > 0) {
		let i = "";
		for (; r > 0; r--) i += "\n";
		n.right = new Z(K(o, q(a.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, t, null, new GD(i)), n.right.integrate(e, 0), n.forward();
	}
	rD(e, t, n, s);
}, lD = (e, t, n, r, i) => {
	let a = t, o = Lb();
	for (; a && (!a.countable || a.deleted);) {
		if (!a.deleted && a.content.constructor === X) {
			let e = a.content;
			o.set(e.key, e);
		}
		a = a.right;
	}
	let s = 0, c = !1;
	for (; t !== a;) {
		if (n === t && (c = !0), !t.deleted) {
			let n = t.content;
			switch (n.constructor) {
				case X: {
					let { key: a, value: l } = n, u = r.get(a) ?? null;
					(o.get(a) !== n || u === l) && (t.delete(e), s++, !c && (i.get(a) ?? null) === l && u !== l && (u === null ? i.delete(a) : i.set(a, u))), !c && !t.deleted && iD(i, n);
					break;
				}
			}
		}
		t = t.right;
	}
	return s;
}, uD = (e, t) => {
	for (; t && t.right && (t.right.deleted || !t.right.countable);) t = t.right;
	let n = /* @__PURE__ */ new Set();
	for (; t && (t.deleted || !t.countable);) {
		if (!t.deleted && t.content.constructor === X) {
			let r = t.content.key;
			n.has(r) ? t.delete(e) : n.add(r);
		}
		t = t.left;
	}
}, dD = (e) => {
	let t = 0;
	return J(e.doc, (n) => {
		let r = e._start, i = e._start, a = Lb(), o = Rb(a);
		for (; i;) {
			if (i.deleted === !1) switch (i.content.constructor) {
				case X:
					iD(o, i.content);
					break;
				default:
					t += lD(n, r, i, a, o), a = Rb(o), r = i;
					break;
			}
			i = i.right;
		}
	}), t;
}, fD = (e) => {
	let t = /* @__PURE__ */ new Set(), n = e.doc;
	for (let [r, i] of e.afterState.entries()) {
		let a = e.beforeState.get(r) || 0;
		i !== a && YT(e, n.store.clients.get(r), a, i, (e) => {
			!e.deleted && e.content.constructor === X && e.constructor !== kD && t.add(e.parent);
		});
	}
	J(n, (n) => {
		qw(e, e.deleteSet, (e) => {
			if (e instanceof kD || !e.parent._hasFormatting || t.has(e.parent)) return;
			let r = e.parent;
			e.content.constructor === X ? t.add(r) : uD(n, e);
		});
		for (let e of t) dD(e);
	});
}, pD = (e, t, n) => {
	let r = n, i = Rb(t.currentAttributes), a = t.right;
	for (; n > 0 && t.right !== null;) {
		if (t.right.deleted === !1) switch (t.right.content.constructor) {
			case tO:
			case LD:
			case GD:
				n < t.right.length && KT(e, K(t.right.id.client, t.right.id.clock + n)), n -= t.right.length, t.right.delete(e);
				break;
		}
		t.forward();
	}
	a && lD(e, a, t.right, i, t.currentAttributes);
	let o = (t.left || t.right).parent;
	return o._searchMarker && EE(o._searchMarker, t.index, -r + n), t;
}, mD = class extends gE {
	constructor(e, t, n) {
		super(e, t), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), n.forEach((e) => {
			e === null ? this.childListChanged = !0 : this.keysChanged.add(e);
		});
	}
	get changes() {
		if (this._changes === null) {
			let e = {
				keys: this.keys,
				delta: this.delta,
				added: /* @__PURE__ */ new Set(),
				deleted: /* @__PURE__ */ new Set()
			};
			this._changes = e;
		}
		return this._changes;
	}
	get delta() {
		if (this._delta === null) {
			let e = this.target.doc, t = [];
			J(e, (e) => {
				let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = this.target._start, a = null, o = {}, s = "", c = 0, l = 0, u = () => {
					if (a !== null) {
						let e = null;
						switch (a) {
							case "delete":
								l > 0 && (e = { delete: l }), l = 0;
								break;
							case "insert":
								(typeof s == "object" || s.length > 0) && (e = { insert: s }, n.size > 0 && (e.attributes = {}, n.forEach((t, n) => {
									t !== null && (e.attributes[n] = t);
								}))), s = "";
								break;
							case "retain":
								c > 0 && (e = { retain: c }, zS(o) || (e.attributes = FS({}, o))), c = 0;
								break;
						}
						e && t.push(e), a = null;
					}
				};
				for (; i !== null;) {
					switch (i.content.constructor) {
						case tO:
						case LD:
							this.adds(i) ? this.deletes(i) || (u(), a = "insert", s = i.content.getContent()[0], u()) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += 1) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += 1);
							break;
						case GD:
							this.adds(i) ? this.deletes(i) || (a !== "insert" && (u(), a = "insert"), s += i.content.str) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += i.length) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += i.length);
							break;
						case X: {
							let { key: t, value: s } = i.content;
							if (this.adds(i)) this.deletes(i) || ($E(n.get(t) ?? null, s) ? s !== null && i.delete(e) : (a === "retain" && u(), $E(s, r.get(t) ?? null) ? delete o[t] : o[t] = s));
							else if (this.deletes(i)) {
								r.set(t, s);
								let e = n.get(t) ?? null;
								$E(e, s) || (a === "retain" && u(), o[t] = e);
							} else if (!i.deleted) {
								r.set(t, s);
								let n = o[t];
								n !== void 0 && ($E(n, s) ? n !== null && i.delete(e) : (a === "retain" && u(), s === null ? delete o[t] : o[t] = s));
							}
							i.deleted || (a === "insert" && u(), iD(n, i.content));
							break;
						}
					}
					i = i.right;
				}
				for (u(); t.length > 0;) {
					let e = t[t.length - 1];
					if (e.retain !== void 0 && e.attributes === void 0) t.pop();
					else break;
				}
			}), this._delta = t;
		}
		return this._delta;
	}
}, hD = class e extends Y {
	constructor(e) {
		super(), this._pending = e === void 0 ? [] : [() => this.insert(0, e)], this._searchMarker = [], this._hasFormatting = !1;
	}
	get length() {
		return this.doc ?? vE(), this._length;
	}
	_integrate(e, t) {
		super._integrate(e, t);
		try {
			this._pending.forEach((e) => e());
		} catch (e) {
			console.error(e);
		}
		this._pending = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.applyDelta(this.toDelta()), t;
	}
	_callObserver(e, t) {
		super._callObserver(e, t);
		let n = new mD(this, e, t);
		DE(this, e, n), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
	}
	toString() {
		this.doc ?? vE();
		let e = "", t = this._start;
		for (; t !== null;) !t.deleted && t.countable && t.content.constructor === GD && (e += t.content.str), t = t.right;
		return e;
	}
	toJSON() {
		return this.toString();
	}
	applyDelta(e, { sanitize: t = !0 } = {}) {
		this.doc === null ? this._pending.push(() => this.applyDelta(e)) : J(this.doc, (n) => {
			let r = new eD(null, this._start, 0, /* @__PURE__ */ new Map());
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				if (a.insert !== void 0) {
					let o = !t && typeof a.insert == "string" && i === e.length - 1 && r.right === null && a.insert.slice(-1) === "\n" ? a.insert.slice(0, -1) : a.insert;
					(typeof o != "string" || o.length > 0) && sD(n, this, r, o, a.attributes || {});
				} else a.retain === void 0 ? a.delete !== void 0 && pD(n, r, a.delete) : cD(n, this, r, a.retain, a.attributes || {});
			}
		});
	}
	toDelta(e, t, n) {
		this.doc ?? vE();
		let r = [], i = /* @__PURE__ */ new Map(), a = this.doc, o = "", s = this._start;
		function c() {
			if (o.length > 0) {
				let e = {}, t = !1;
				i.forEach((n, r) => {
					t = !0, e[r] = n;
				});
				let n = { insert: o };
				t && (n.attributes = e), r.push(n), o = "";
			}
		}
		let l = () => {
			for (; s !== null;) {
				if (RT(s, e) || t !== void 0 && RT(s, t)) switch (s.content.constructor) {
					case GD: {
						let r = i.get("ychange");
						e !== void 0 && !RT(s, e) ? (r === void 0 || r.user !== s.id.client || r.type !== "removed") && (c(), i.set("ychange", n ? n("removed", s.id) : { type: "removed" })) : t !== void 0 && !RT(s, t) ? (r === void 0 || r.user !== s.id.client || r.type !== "added") && (c(), i.set("ychange", n ? n("added", s.id) : { type: "added" })) : r !== void 0 && (c(), i.delete("ychange")), o += s.content.str;
						break;
					}
					case tO:
					case LD: {
						c();
						let e = { insert: s.content.getContent()[0] };
						if (i.size > 0) {
							let t = {};
							e.attributes = t, i.forEach((e, n) => {
								t[n] = e;
							});
						}
						r.push(e);
						break;
					}
					case X:
						RT(s, e) && (c(), iD(i, s.content));
						break;
				}
				s = s.right;
			}
			c();
		};
		return e || t ? J(a, (n) => {
			e && zT(n, e), t && zT(n, t), l();
		}, "cleanup") : l(), r;
	}
	insert(e, t, n) {
		if (t.length <= 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.insert(e, t, n)) : J(r, (r) => {
			let i = nD(r, this, e, !n);
			n || (n = {}, i.currentAttributes.forEach((e, t) => {
				n[t] = e;
			})), sD(r, this, i, t, n);
		});
	}
	insertEmbed(e, t, n) {
		let r = this.doc;
		r === null ? this._pending.push(() => this.insertEmbed(e, t, n || {})) : J(r, (r) => {
			let i = nD(r, this, e, !n);
			sD(r, this, i, t, n || {});
		});
	}
	delete(e, t) {
		if (t === 0) return;
		let n = this.doc;
		n === null ? this._pending.push(() => this.delete(e, t)) : J(n, (n) => {
			pD(n, nD(n, this, e, !0), t);
		});
	}
	format(e, t, n) {
		if (t === 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.format(e, t, n)) : J(r, (r) => {
			let i = nD(r, this, e, !1);
			i.right !== null && cD(r, this, i, t, n);
		});
	}
	removeAttribute(e) {
		this.doc === null ? this._pending.push(() => this.removeAttribute(e)) : J(this.doc, (t) => {
			BE(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._pending.push(() => this.setAttribute(e, t)) : J(this.doc, (n) => {
			VE(n, this, e, t);
		});
	}
	getAttribute(e) {
		return HE(this, e);
	}
	getAttributes() {
		return UE(this);
	}
	_write(e) {
		e.writeTypeRef(XD);
	}
}, gD = (e) => new hD(), _D = class {
	constructor(e, t = () => !0) {
		this._filter = t, this._root = e, this._currentNode = e._start, this._firstCall = !0, e.doc ?? vE();
	}
	[Symbol.iterator]() {
		return this;
	}
	next() {
		let e = this._currentNode, t = e && e.content && e.content.type;
		if (e !== null && (!this._firstCall || e.deleted || !this._filter(t))) do
			if (t = e.content.type, !e.deleted && (t.constructor === bD || t.constructor === vD) && t._start !== null) e = t._start;
			else for (; e !== null;) {
				let t = e.next;
				if (t !== null) {
					e = t;
					break;
				} else e = e.parent === this._root ? null : e.parent._item;
			}
		while (e !== null && (e.deleted || !this._filter(e.content.type)));
		return this._firstCall = !1, e === null ? {
			value: void 0,
			done: !0
		} : (this._currentNode = e, {
			value: e.content.type,
			done: !1
		});
	}
}, vD = class e extends Y {
	constructor() {
		super(), this._prelimContent = [];
	}
	get firstChild() {
		let e = this._first;
		return e ? e.content.getContent()[0] : null;
	}
	_integrate(e, t) {
		super._integrate(e, t), this.insert(0, this._prelimContent), this._prelimContent = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.insert(0, this.toArray().map((e) => e instanceof Y ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? vE(), this._prelimContent === null ? this._length : this._prelimContent.length;
	}
	createTreeWalker(e) {
		return new _D(this, e);
	}
	querySelector(e) {
		e = e.toUpperCase();
		let t = new _D(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e).next();
		return t.done ? null : t.value;
	}
	querySelectorAll(e) {
		return e = e.toUpperCase(), Gb(new _D(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e));
	}
	_callObserver(e, t) {
		DE(this, e, new SD(this, t, e));
	}
	toString() {
		return ME(this, (e) => e.toString()).join("");
	}
	toJSON() {
		return this.toString();
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createDocumentFragment();
		return n !== void 0 && n._createAssociation(r, this), jE(this, (i) => {
			r.insertBefore(i.toDOM(e, t, n), null);
		}), r;
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : J(this.doc, (n) => {
			LE(n, this, e, t);
		});
	}
	insertAfter(e, t) {
		if (this.doc !== null) J(this.doc, (n) => {
			let r = e && e instanceof Y ? e._item : e;
			FE(n, this, r, t);
		});
		else {
			let n = this._prelimContent, r = e === null ? 0 : n.findIndex((t) => t === e) + 1;
			if (r === 0 && e !== null) throw tS("Reference item not found");
			n.splice(r, 0, ...t);
		}
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : J(this.doc, (n) => {
			zE(n, this, e, t);
		});
	}
	toArray() {
		return kE(this);
	}
	push(e) {
		this.insert(this.length, e);
	}
	unshift(e) {
		this.insert(0, e);
	}
	get(e) {
		return PE(this, e);
	}
	slice(e = 0, t = this.length) {
		return OE(this, e, t);
	}
	forEach(e) {
		jE(this, e);
	}
	_write(e) {
		e.writeTypeRef(QD);
	}
}, yD = (e) => new vD(), bD = class e extends vD {
	constructor(e = "UNDEFINED") {
		super(), this.nodeName = e, this._prelimAttrs = /* @__PURE__ */ new Map();
	}
	get nextSibling() {
		let e = this._item ? this._item.next : null;
		return e ? e.content.type : null;
	}
	get prevSibling() {
		let e = this._item ? this._item.prev : null;
		return e ? e.content.type : null;
	}
	_integrate(e, t) {
		super._integrate(e, t), this._prelimAttrs.forEach((e, t) => {
			this.setAttribute(t, e);
		}), this._prelimAttrs = null;
	}
	_copy() {
		return new e(this.nodeName);
	}
	clone() {
		let t = new e(this.nodeName);
		return LS(this.getAttributes(), (e, n) => {
			t.setAttribute(n, e);
		}), t.insert(0, this.toArray().map((e) => e instanceof Y ? e.clone() : e)), t;
	}
	toString() {
		let e = this.getAttributes(), t = [], n = [];
		for (let t in e) n.push(t);
		n.sort();
		let r = n.length;
		for (let i = 0; i < r; i++) {
			let r = n[i];
			t.push(r + "=\"" + e[r] + "\"");
		}
		let i = this.nodeName.toLocaleLowerCase();
		return `<${i}${t.length > 0 ? " " + t.join(" ") : ""}>${super.toString()}</${i}>`;
	}
	removeAttribute(e) {
		this.doc === null ? this._prelimAttrs.delete(e) : J(this.doc, (t) => {
			BE(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._prelimAttrs.set(e, t) : J(this.doc, (n) => {
			VE(n, this, e, t);
		});
	}
	getAttribute(e) {
		return HE(this, e);
	}
	hasAttribute(e) {
		return WE(this, e);
	}
	getAttributes(e) {
		return e ? GE(this, e) : UE(this);
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createElement(this.nodeName), i = this.getAttributes();
		for (let e in i) {
			let t = i[e];
			typeof t == "string" && r.setAttribute(e, t);
		}
		return jE(this, (i) => {
			r.appendChild(i.toDOM(e, t, n));
		}), n !== void 0 && n._createAssociation(r, this), r;
	}
	_write(e) {
		e.writeTypeRef(ZD), e.writeKey(this.nodeName);
	}
}, xD = (e) => new bD(e.readKey()), SD = class extends gE {
	constructor(e, t, n) {
		super(e, n), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), t.forEach((e) => {
			e === null ? this.childListChanged = !0 : this.attributesChanged.add(e);
		});
	}
}, CD = class e extends ZE {
	constructor(e) {
		super(), this.hookName = e;
	}
	_copy() {
		return new e(this.hookName);
	}
	clone() {
		let t = new e(this.hookName);
		return this.forEach((e, n) => {
			t.set(n, e);
		}), t;
	}
	toDOM(e = document, t = {}, n) {
		let r = t[this.hookName], i;
		return i = r === void 0 ? document.createElement(this.hookName) : r.createDom(this), i.setAttribute("data-yjs-hook", this.hookName), n !== void 0 && n._createAssociation(i, this), i;
	}
	_write(e) {
		e.writeTypeRef($D), e.writeKey(this.hookName);
	}
}, wD = (e) => new CD(e.readKey()), TD = class e extends hD {
	get nextSibling() {
		let e = this._item ? this._item.next : null;
		return e ? e.content.type : null;
	}
	get prevSibling() {
		let e = this._item ? this._item.prev : null;
		return e ? e.content.type : null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.applyDelta(this.toDelta()), t;
	}
	toDOM(e = document, t, n) {
		let r = e.createTextNode(this.toString());
		return n !== void 0 && n._createAssociation(r, this), r;
	}
	toString() {
		return this.toDelta().map((e) => {
			let t = [];
			for (let n in e.attributes) {
				let r = [];
				for (let t in e.attributes[n]) r.push({
					key: t,
					value: e.attributes[n][t]
				});
				r.sort((e, t) => e.key < t.key ? -1 : 1), t.push({
					nodeName: n,
					attrs: r
				});
			}
			t.sort((e, t) => e.nodeName < t.nodeName ? -1 : 1);
			let n = "";
			for (let e = 0; e < t.length; e++) {
				let r = t[e];
				n += `<${r.nodeName}`;
				for (let e = 0; e < r.attrs.length; e++) {
					let t = r.attrs[e];
					n += ` ${t.key}="${t.value}"`;
				}
				n += ">";
			}
			n += e.insert;
			for (let e = t.length - 1; e >= 0; e--) n += `</${t[e].nodeName}>`;
			return n;
		}).join("");
	}
	toJSON() {
		return this.toString();
	}
	_write(e) {
		e.writeTypeRef(eO);
	}
}, ED = (e) => new TD(), DD = class {
	constructor(e, t) {
		this.id = e, this.length = t;
	}
	get deleted() {
		throw nS();
	}
	mergeWith(e) {
		return !1;
	}
	write(e, t, n) {
		throw nS();
	}
	integrate(e, t) {
		throw nS();
	}
}, OD = 0, kD = class extends DD {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor ? (this.length += e.length, !0) : !1;
	}
	integrate(e, t) {
		t > 0 && (this.id.clock += t, this.length -= t), HT(e.doc.store, this);
	}
	write(e, t) {
		e.writeInfo(OD), e.writeLen(this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, AD = class e {
	constructor(e) {
		this.content = e;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.content];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.content);
	}
	splice(e) {
		throw nS();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeBuf(this.content);
	}
	getRef() {
		return 3;
	}
}, jD = (e) => new AD(e.readBuf()), MD = class e {
	constructor(e) {
		this.len = e;
	}
	getLength() {
		return this.len;
	}
	getContent() {
		return [];
	}
	isCountable() {
		return !1;
	}
	copy() {
		return new e(this.len);
	}
	splice(t) {
		let n = new e(this.len - t);
		return this.len = t, n;
	}
	mergeWith(e) {
		return this.len += e.len, !0;
	}
	integrate(e, t) {
		Qw(e.deleteSet, t.id.client, t.id.clock, this.len), t.markDeleted();
	}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeLen(this.len - t);
	}
	getRef() {
		return 1;
	}
}, ND = (e) => new MD(e.readLen()), PD = (e, t) => new aT({
	guid: e,
	...t,
	shouldLoad: t.shouldLoad || t.autoLoad || !1
}), FD = class e {
	constructor(e) {
		e._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = e;
		let t = {};
		this.opts = t, e.gc || (t.gc = !1), e.autoLoad && (t.autoLoad = !0), e.meta !== null && (t.meta = e.meta);
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.doc];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(PD(this.doc.guid, this.opts));
	}
	splice(e) {
		throw nS();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {
		this.doc._item = t, e.subdocsAdded.add(this.doc), this.doc.shouldLoad && e.subdocsLoaded.add(this.doc);
	}
	delete(e) {
		e.subdocsAdded.has(this.doc) ? e.subdocsAdded.delete(this.doc) : e.subdocsRemoved.add(this.doc);
	}
	gc(e) {}
	write(e, t) {
		e.writeString(this.doc.guid), e.writeAny(this.opts);
	}
	getRef() {
		return 9;
	}
}, ID = (e) => new FD(PD(e.readString(), e.readAny())), LD = class e {
	constructor(e) {
		this.embed = e;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.embed];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.embed);
	}
	splice(e) {
		throw nS();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeJSON(this.embed);
	}
	getRef() {
		return 5;
	}
}, RD = (e) => new LD(e.readJSON()), X = class e {
	constructor(e, t) {
		this.key = e, this.value = t;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [];
	}
	isCountable() {
		return !1;
	}
	copy() {
		return new e(this.key, this.value);
	}
	splice(e) {
		throw nS();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {
		let n = t.parent;
		n._searchMarker = null, n._hasFormatting = !0;
	}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeKey(this.key), e.writeJSON(this.value);
	}
	getRef() {
		return 6;
	}
}, zD = (e) => new X(e.readKey(), e.readJSON()), BD = class e {
	constructor(e) {
		this.arr = e;
	}
	getLength() {
		return this.arr.length;
	}
	getContent() {
		return this.arr;
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.arr);
	}
	splice(t) {
		let n = new e(this.arr.slice(t));
		return this.arr = this.arr.slice(0, t), n;
	}
	mergeWith(e) {
		return this.arr = this.arr.concat(e.arr), !0;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		let n = this.arr.length;
		e.writeLen(n - t);
		for (let r = t; r < n; r++) {
			let t = this.arr[r];
			e.writeString(t === void 0 ? "undefined" : JSON.stringify(t));
		}
	}
	getRef() {
		return 2;
	}
}, VD = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) {
		let t = e.readString();
		t === "undefined" ? n.push(void 0) : n.push(JSON.parse(t));
	}
	return new BD(n);
}, HD = eC("node_env") === "development", UD = class e {
	constructor(e) {
		this.arr = e, HD && WS(e);
	}
	getLength() {
		return this.arr.length;
	}
	getContent() {
		return this.arr;
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.arr);
	}
	splice(t) {
		let n = new e(this.arr.slice(t));
		return this.arr = this.arr.slice(0, t), n;
	}
	mergeWith(e) {
		return this.arr = this.arr.concat(e.arr), !0;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		let n = this.arr.length;
		e.writeLen(n - t);
		for (let r = t; r < n; r++) {
			let t = this.arr[r];
			e.writeAny(t);
		}
	}
	getRef() {
		return 8;
	}
}, WD = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) n.push(e.readAny());
	return new UD(n);
}, GD = class e {
	constructor(e) {
		this.str = e;
	}
	getLength() {
		return this.str.length;
	}
	getContent() {
		return this.str.split("");
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.str);
	}
	splice(t) {
		let n = new e(this.str.slice(t));
		this.str = this.str.slice(0, t);
		let r = this.str.charCodeAt(t - 1);
		return r >= 55296 && r <= 56319 && (this.str = this.str.slice(0, t - 1) + "�", n.str = "�" + n.str.slice(1)), n;
	}
	mergeWith(e) {
		return this.str += e.str, !0;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeString(t === 0 ? this.str : this.str.slice(t));
	}
	getRef() {
		return 4;
	}
}, KD = (e) => new GD(e.readString()), qD = [
	YE,
	QE,
	gD,
	xD,
	yD,
	wD,
	ED
], JD = 0, YD = 1, XD = 2, ZD = 3, QD = 4, $D = 5, eO = 6, tO = class e {
	constructor(e) {
		this.type = e;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.type];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.type._copy());
	}
	splice(e) {
		throw nS();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {
		this.type._integrate(e.doc, t);
	}
	delete(e) {
		let t = this.type._start;
		for (; t !== null;) t.deleted ? t.id.clock < (e.beforeState.get(t.id.client) || 0) && e._mergeStructs.push(t) : t.delete(e), t = t.right;
		this.type._map.forEach((t) => {
			t.deleted ? t.id.clock < (e.beforeState.get(t.id.client) || 0) && e._mergeStructs.push(t) : t.delete(e);
		}), e.changed.delete(this.type);
	}
	gc(e) {
		let t = this.type._start;
		for (; t !== null;) t.gc(e, !0), t = t.right;
		this.type._start = null, this.type._map.forEach((t) => {
			for (; t !== null;) t.gc(e, !0), t = t.left;
		}), this.type._map = /* @__PURE__ */ new Map();
	}
	write(e, t) {
		this.type._write(e);
	}
	getRef() {
		return 7;
	}
}, nO = (e) => new tO(qD[e.readTypeRef()](e)), rO = (e, t) => {
	let n = t, r = 0, i;
	do
		r > 0 && (n = K(n.client, n.clock + r)), i = WT(e, n), r = n.clock - i.id.clock, n = i.redone;
	while (n !== null && i instanceof Z);
	return {
		item: i,
		diff: r
	};
}, iO = (e, t) => {
	for (; e !== null && e.keep !== t;) e.keep = t, e = e.parent._item;
}, aO = (e, t, n) => {
	let { client: r, clock: i } = t.id, a = new Z(K(r, i + n), t, K(r, i + n - 1), t.right, t.rightOrigin, t.parent, t.parentSub, t.content.splice(n));
	return t.deleted && a.markDeleted(), t.keep && (a.keep = !0), t.redone !== null && (a.redone = K(t.redone.client, t.redone.clock + n)), t.right = a, a.right !== null && (a.right.left = a), e._mergeStructs.push(a), a.parentSub !== null && a.right === null && a.parent._map.set(a.parentSub, a), t.length = n, a;
}, oO = (e, t) => qb(e, (e) => Yw(e.deletions, t)), sO = (e, t, n, r, i, a) => {
	let o = e.doc, s = o.store, c = o.clientID, l = t.redone;
	if (l !== null) return KT(e, l);
	let u = t.parent._item, d = null, f;
	if (u !== null && u.deleted === !0) {
		if (u.redone === null && (!n.has(u) || sO(e, u, n, r, i, a) === null)) return null;
		for (; u.redone !== null;) u = KT(e, u.redone);
	}
	let p = u === null ? t.parent : u.content.type;
	if (t.parentSub === null) {
		for (d = t.left, f = t; d !== null;) {
			let t = d;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : KT(e, t.redone);
			if (t !== null && t.parent._item === u) {
				d = t;
				break;
			}
			d = d.left;
		}
		for (; f !== null;) {
			let t = f;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : KT(e, t.redone);
			if (t !== null && t.parent._item === u) {
				f = t;
				break;
			}
			f = f.right;
		}
	} else {
		if (f = null, t.right && !i) {
			for (d = t; d !== null && d.right !== null && (d.right.redone || Yw(r, d.right.id) || oO(a.undoStack, d.right.id) || oO(a.redoStack, d.right.id));) for (d = d.right; d.redone;) d = KT(e, d.redone);
			if (d && d.right !== null) return null;
		} else d = p._map.get(t.parentSub) || null;
		d !== null && d.parent._item !== u && (d = p._map.get(t.parentSub) || null);
	}
	let m = K(c, q(s, c)), h = new Z(m, d, d && d.lastId, f, f && f.id, p, t.parentSub, t.content.copy());
	return t.redone = m, iO(h, !0), h.integrate(e, 0), h;
}, Z = class e extends DD {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, s.getLength()), this.origin = n, this.left = t, this.right = r, this.rightOrigin = i, this.parent = a, this.parentSub = o, this.redone = null, this.content = s, this.info = this.content.isCountable() ? 2 : 0;
	}
	set marker(e) {
		(this.info & 8) > 0 !== e && (this.info ^= 8);
	}
	get marker() {
		return (this.info & 8) > 0;
	}
	get keep() {
		return (this.info & 1) > 0;
	}
	set keep(e) {
		this.keep !== e && (this.info ^= 1);
	}
	get countable() {
		return (this.info & 2) > 0;
	}
	get deleted() {
		return (this.info & 4) > 0;
	}
	set deleted(e) {
		this.deleted !== e && (this.info ^= 4);
	}
	markDeleted() {
		this.info |= 4;
	}
	getMissing(t, n) {
		if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= q(n, this.origin.client)) return this.origin.client;
		if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= q(n, this.rightOrigin.client)) return this.rightOrigin.client;
		if (this.parent && this.parent.constructor === wT && this.id.client !== this.parent.client && this.parent.clock >= q(n, this.parent.client)) return this.parent.client;
		if (this.origin &&= (this.left = qT(t, n, this.origin), this.left.lastId), this.rightOrigin &&= (this.right = KT(t, this.rightOrigin), this.right.id), this.left && this.left.constructor === kD || this.right && this.right.constructor === kD) this.parent = null;
		else if (!this.parent) this.left && this.left.constructor === e ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === e && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
		else if (this.parent.constructor === wT) {
			let e = WT(n, this.parent);
			e.constructor === kD ? this.parent = null : this.parent = e.content.type;
		}
		return null;
	}
	integrate(e, t) {
		if (t > 0 && (this.id.clock += t, this.left = qT(e, e.doc.store, K(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(t), this.length -= t), this.parent) {
			if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
				let t = this.left, n;
				if (t !== null) n = t.right;
				else if (this.parentSub !== null) for (n = this.parent._map.get(this.parentSub) || null; n !== null && n.left !== null;) n = n.left;
				else n = this.parent._start;
				let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
				for (; n !== null && n !== this.right;) {
					if (i.add(n), r.add(n), TT(this.origin, n.origin)) {
						if (n.id.client < this.id.client) t = n, r.clear();
						else if (TT(this.rightOrigin, n.rightOrigin)) break;
					} else if (n.origin !== null && i.has(WT(e.doc.store, n.origin))) r.has(WT(e.doc.store, n.origin)) || (t = n, r.clear());
					else break;
					n = n.right;
				}
				this.left = t;
			}
			if (this.left !== null) {
				let e = this.left.right;
				this.right = e, this.left.right = this;
			} else {
				let e;
				if (this.parentSub !== null) for (e = this.parent._map.get(this.parentSub) || null; e !== null && e.left !== null;) e = e.left;
				else e = this.parent._start, this.parent._start = this;
				this.right = e;
			}
			this.right === null ? this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)) : this.right.left = this, this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), HT(e.doc.store, this), this.content.integrate(e, this), QT(e, this.parent, this.parentSub), (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
		} else new kD(this.id, this.length).integrate(e, 0);
	}
	get next() {
		let e = this.right;
		for (; e !== null && e.deleted;) e = e.right;
		return e;
	}
	get prev() {
		let e = this.left;
		for (; e !== null && e.deleted;) e = e.left;
		return e;
	}
	get lastId() {
		return this.length === 1 ? this.id : K(this.id.client, this.id.clock + this.length - 1);
	}
	mergeWith(e) {
		if (this.constructor === e.constructor && TT(e.origin, this.lastId) && this.right === e && TT(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
			let t = this.parent._searchMarker;
			return t && t.forEach((t) => {
				t.p === e && (t.p = this, !this.deleted && this.countable && (t.index -= this.length));
			}), e.keep && (this.keep = !0), this.right = e.right, this.right !== null && (this.right.left = this), this.length += e.length, !0;
		}
		return !1;
	}
	delete(e) {
		if (!this.deleted) {
			let t = this.parent;
			this.countable && this.parentSub === null && (t._length -= this.length), this.markDeleted(), Qw(e.deleteSet, this.id.client, this.id.clock, this.length), QT(e, t, this.parentSub), this.content.delete(e);
		}
	}
	gc(e, t) {
		if (!this.deleted) throw rS();
		this.content.gc(e), t ? JT(e, this, new kD(this.id, this.length)) : this.content = new MD(this.length);
	}
	write(e, t) {
		let n = t > 0 ? K(this.id.client, this.id.clock + t - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, a = this.content.getRef() & 31 | (n === null ? 0 : 128) | (r === null ? 0 : 64) | (i === null ? 0 : 32);
		if (e.writeInfo(a), n !== null && e.writeLeftID(n), r !== null && e.writeRightID(r), n === null && r === null) {
			let t = this.parent;
			if (t._item !== void 0) {
				let n = t._item;
				if (n === null) {
					let n = ET(t);
					e.writeParentInfo(!0), e.writeString(n);
				} else e.writeParentInfo(!1), e.writeLeftID(n.id);
			} else t.constructor === String ? (e.writeParentInfo(!0), e.writeString(t)) : t.constructor === wT ? (e.writeParentInfo(!1), e.writeLeftID(t)) : rS();
			i !== null && e.writeString(i);
		}
		this.content.write(e, t);
	}
}, cO = (e, t) => lO[t & 31](e), lO = [
	() => {
		rS();
	},
	ND,
	VD,
	jD,
	KD,
	RD,
	zD,
	nO,
	WD,
	ID,
	() => {
		rS();
	}
], uO = 10, dO = class extends DD {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor ? (this.length += e.length, !0) : !1;
	}
	integrate(e, t) {
		rS();
	}
	write(e, t) {
		e.writeInfo(uO), H(e.restEncoder, this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, fO = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}, pO = "__ $YJS$ __";
fO[pO] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438"), fO[pO] = !0;
//#endregion
//#region node_modules/y-protocols/awareness.js
var mO = () => {
	let e = !0;
	return (t, n) => {
		if (e) {
			e = !1;
			try {
				t();
			} finally {
				e = !0;
			}
		} else n !== void 0 && n();
	};
}, hO = /[\uD800-\uDBFF]/, gO = /[\uDC00-\uDFFF]/, _O = (e, t) => {
	let n = 0, r = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	for (n > 0 && hO.test(e[n - 1]) && n--; r + n < e.length && r + n < t.length && e[e.length - r - 1] === t[t.length - r - 1];) r++;
	return r > 0 && gO.test(e[e.length - r]) && r--, {
		index: n,
		remove: e.length - n - r,
		insert: t.slice(n, t.length - r)
	};
}, vO = (e, t) => e >>> t | e << 32 - t, yO = (e) => vO(e, 2) ^ vO(e, 13) ^ vO(e, 22), bO = (e) => vO(e, 6) ^ vO(e, 11) ^ vO(e, 25), xO = (e) => vO(e, 7) ^ vO(e, 18) ^ e >>> 3, SO = (e) => vO(e, 17) ^ vO(e, 19) ^ e >>> 10, CO = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), wO = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), TO = class {
	constructor() {
		let e = /* @__PURE__ */ new ArrayBuffer(320);
		this._H = new Uint32Array(e, 0, 8), this._H.set(wO), this._W = new Uint32Array(e, 64, 64);
	}
	_updateHash() {
		let e = this._H, t = this._W;
		for (let e = 16; e < 64; e++) t[e] = SO(t[e - 2]) + t[e - 7] + xO(t[e - 15]) + t[e - 16];
		let n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], c = e[6], l = e[7];
		for (let e = 0, u, d; e < 64; e++) u = l + bO(o) + (o & s ^ ~o & c) + CO[e] + t[e] >>> 0, d = yO(n) + (n & r ^ n & i ^ r & i) >>> 0, l = c, c = s, s = o, o = a + u >>> 0, a = i, i = r, r = n, n = u + d >>> 0;
		e[0] += n, e[1] += r, e[2] += i, e[3] += a, e[4] += o, e[5] += s, e[6] += c, e[7] += l;
	}
	digest(e) {
		let t = 0;
		for (; t + 56 <= e.length;) {
			let n = 0;
			for (; n < 16 && t + 3 < e.length; n++) this._W[n] = e[t++] << 24 | e[t++] << 16 | e[t++] << 8 | e[t++];
			if (t % 64 != 0) {
				for (this._W.fill(0, n, 16); t < e.length;) this._W[n] |= e[t] << (3 - t % 4) * 8, t++;
				this._W[n] |= 128 << (3 - t % 4) * 8;
			}
			this._updateHash();
		}
		let n = t % 64 != 0;
		this._W.fill(0, 0, 16);
		let r = 0;
		for (; t < e.length; r++) for (let n = 3; n >= 0 && t < e.length; n--) this._W[r] |= e[t++] << n * 8;
		n || (this._W[r - (t % 4 == 0 ? 0 : 1)] |= 128 << (3 - t % 4) * 8), this._W[14] = e.byteLength / mx, this._W[15] = e.byteLength * 8, this._updateHash();
		let i = /* @__PURE__ */ new Uint8Array(32);
		for (let e = 0; e < this._H.length; e++) for (let t = 0; t < 4; t++) i[e * 4 + t] = this._H[e] >>> (3 - t) * 8;
		return i;
	}
}, EO = (e) => new TO().digest(e), Q = new D("y-sync"), DO = new D("y-undo");
new D("yjs-cursor");
var OO = (e) => {
	for (let t = 6; t < e.length; t++) e[t % 6] = e[t % 6] ^ e[t];
	return e.slice(0, 6);
}, kO = (e) => iC(OO(EO(aC(e)))), AO = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && t.sv.get(e.id.client) > e.id.clock && !Yw(t.ds, e.id), jO = [{
	light: "#ecd44433",
	dark: "#ecd444"
}], MO = (e, t, n) => {
	if (!e.has(n)) {
		if (e.size < t.length) {
			let n = Hb();
			e.forEach((e) => n.add(e)), t = t.filter((e) => !n.has(e));
		}
		e.set(n, wS(t));
	}
	return e.get(n);
}, NO = (e, { colors: t = jO, colorMapping: n = /* @__PURE__ */ new Map(), permanentUserData: r = null, onFirstRender: i = () => {}, mapping: a } = {}) => {
	let o = !1, s = new zO(e, a), c = new E({
		props: { editable: (e) => {
			let t = Q.getState(e);
			return t.snapshot == null && t.prevSnapshot == null;
		} },
		key: Q,
		state: {
			init: (i, a) => ({
				type: e,
				doc: e.doc,
				binding: s,
				snapshot: null,
				prevSnapshot: null,
				isChangeOrigin: !1,
				isUndoRedoOperation: !1,
				addToHistory: !0,
				colors: t,
				colorMapping: n,
				permanentUserData: r
			}),
			apply: (e, t) => {
				let n = e.getMeta(Q);
				if (n !== void 0) {
					t = Object.assign({}, t);
					for (let e in n) t[e] = n[e];
				}
				return t.addToHistory = e.getMeta("addToHistory") !== !1, t.isChangeOrigin = n !== void 0 && !!n.isChangeOrigin, t.isUndoRedoOperation = n !== void 0 && !!n.isChangeOrigin && !!n.isUndoRedoOperation, s.prosemirrorView !== null && n !== void 0 && (n.snapshot != null || n.prevSnapshot != null) && Tw(0, () => {
					s.prosemirrorView != null && (n.restore == null ? s._renderSnapshot(n.snapshot, n.prevSnapshot, t) : (s._renderSnapshot(n.snapshot, n.snapshot, t), delete t.restore, delete t.snapshot, delete t.prevSnapshot, s.mux(() => {
						s._prosemirrorChanged(s.prosemirrorView.state.doc);
					})));
				}), t;
			}
		},
		view: (e) => (s.initView(e), a ?? s._forceRerender(), i(), {
			update: () => {
				let t = c.getState(e.state);
				if (t.snapshot == null && t.prevSnapshot == null && (o || e.state.doc.content.findDiffStart(e.state.doc.type.createAndFill().content) !== null)) {
					if (o = !0, t.addToHistory === !1 && !t.isChangeOrigin) {
						let t = DO.getState(e.state), n = t && t.undoManager;
						n && n.stopCapturing();
					}
					s.mux(() => {
						t.doc.transact((n) => {
							n.meta.set("addToHistory", t.addToHistory), s._prosemirrorChanged(e.state.doc);
						}, Q);
					});
				}
			},
			destroy: () => {
				s.destroy();
			}
		})
	});
	return c;
}, PO = (e, t, n, r) => {
	if (n == null || !(r === null || n > 1 && r <= 1 || yk(t, e, n, r))) return r;
	let i = vk(t, e, n);
	return i === null ? r : i;
}, FO = (e, t, n, r) => {
	if (t !== null && t.anchor !== null && t.head !== null) if (t.type === "all") e.setSelection(new Cn(e.doc));
	else if (t.type === "node") {
		let r = mk(n.doc, n.type, t.anchor, n.mapping);
		r !== null && e.setSelection(IO(e, r));
	} else if (t.type === "nodeRange") {
		let r = LO(e, mk(n.doc, n.type, t.anchor, n.mapping), mk(n.doc, n.type, t.head, n.mapping), t.depth);
		r !== null && e.setSelection(r);
	} else {
		let i = mk(n.doc, n.type, t.anchor, n.mapping), a = mk(n.doc, n.type, t.head, n.mapping);
		r != null && (i = PO(e.doc, r, t.absAnchor, i), a = PO(e.doc, r, t.absHead, a)), i === null && (i = a), a === null && (a = i), i !== null && a !== null && e.setSelection(w.between(e.doc.resolve(i), e.doc.resolve(a)));
	}
}, IO = (e, t) => {
	let n = e.doc.resolve(t);
	return n.nodeAfter ? T.create(e.doc, t) : w.near(n);
}, LO = (e, t, n, r) => {
	if (t === null || n === null) return null;
	let i = Math.min(Math.max(t, 0), e.doc.content.size), a = Math.min(Math.max(n, 0), e.doc.content.size);
	try {
		let t = C.fromJSON(e.doc, {
			type: "nodeRange",
			anchor: i,
			head: a,
			depth: r
		});
		return t.ranges.length ? t : w.near(e.doc.resolve(i));
	} catch {
		return w.near(e.doc.resolve(i));
	}
}, RO = (e, t) => {
	let n = t.selection.jsonID;
	return {
		type: n,
		depth: n === "nodeRange" ? t.selection.depth : void 0,
		anchor: dk(t.selection.anchor, e.type, e.mapping),
		head: dk(t.selection.head, e.type, e.mapping),
		absAnchor: t.selection.anchor,
		absHead: t.selection.head
	};
}, zO = class {
	constructor(e, t = /* @__PURE__ */ new Map()) {
		this.type = e, this.prosemirrorView = null, this.mux = mO(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
			this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = RO(this, this.prosemirrorView.state));
		}, this.afterAllTransactions = () => {
			this.beforeTransactionSelection = null;
		}, this._domSelectionInView = null;
	}
	get _tr() {
		return this.prosemirrorView.state.tr.setMeta("addToHistory", !1);
	}
	_isLocalCursorInView() {
		return this.prosemirrorView.hasFocus() ? (YS && this._domSelectionInView === null && (Tw(0, () => {
			this._domSelectionInView = null;
		}), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
	}
	_isDomSelectionInView() {
		let e = this.prosemirrorView._root.getSelection();
		if (e == null || e.anchorNode == null) return !1;
		let t = this.prosemirrorView._root.createRange();
		t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
		let n = t.getBoundingClientRect(), r = vw.documentElement;
		return n.bottom >= 0 && n.right >= 0 && n.left <= (window.innerWidth || r.clientWidth || 0) && n.top <= (window.innerHeight || r.clientHeight || 0);
	}
	renderSnapshot(e, t) {
		t ||= IT($w(), /* @__PURE__ */ new Map()), this.prosemirrorView.dispatch(this._tr.setMeta(Q, {
			snapshot: e,
			prevSnapshot: t
		}));
	}
	unrenderSnapshot() {
		this.mapping.clear(), this.mux(() => {
			let e = this.type.toArray().map((e) => VO(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), t = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new d(a.from(e), 0, 0));
			t.setMeta(Q, {
				snapshot: null,
				prevSnapshot: null
			}), this.prosemirrorView.dispatch(t);
		});
	}
	_forceRerender() {
		this.mapping.clear(), this.mux(() => {
			let e = this.beforeTransactionSelection === null ? this.prosemirrorView.state.selection : null, t = this.type.toArray().map((e) => VO(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), n = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new d(a.from(t), 0, 0));
			if (e) {
				let t = $b(ex(e.anchor, 0), n.doc.content.size), r = $b(ex(e.head, 0), n.doc.content.size);
				n.setSelection(w.create(n.doc, t, r));
			}
			this.prosemirrorView.dispatch(n.setMeta(Q, {
				isChangeOrigin: !0,
				binding: this
			}));
		});
	}
	_renderSnapshot(e, t, n) {
		let r = this.doc, i = this.type;
		if (e ||= LT(this.doc), e instanceof Uint8Array || t instanceof Uint8Array) if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && rS(), r = new aT({ gc: !1 }), vT(r, t), t = LT(r), vT(r, e), e = LT(r), i._item === null) {
			let e = Array.from(this.doc.share.keys()).find((e) => this.doc.share.get(e) === this.type);
			i = r.getXmlFragment(e);
		} else {
			let e = r.store.clients.get(i._item.id.client) ?? [];
			i = e[UT(e, i._item.id.clock)].content.type;
		}
		this.mapping.clear(), this.mux(() => {
			r.transact((r) => {
				let o = n.permanentUserData;
				o && o.dss.forEach((e) => {
					qw(r, e, (e) => {});
				});
				let s = (e, t) => {
					let r = e === "added" ? o.getUserByClientId(t.client) : o.getUserByDeletedId(t);
					return {
						user: r,
						type: e,
						color: MO(n.colorMapping, n.colors, r)
					};
				}, c = AE(i, new FT(t.ds, e.sv)).map((n) => !n._item.deleted || AO(n._item, e) || AO(n._item, t) ? VO(n, this.prosemirrorView.state.schema, {
					mapping: /* @__PURE__ */ new Map(),
					isOMark: /* @__PURE__ */ new Map()
				}, e, t, s) : null).filter((e) => e !== null), l = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new d(a.from(c), 0, 0));
				this.prosemirrorView.dispatch(l.setMeta(Q, { isChangeOrigin: !0 }));
			}, Q);
		});
	}
	_typeChanged(e, t) {
		if (this.prosemirrorView == null) return;
		let n = Q.getState(this.prosemirrorView.state);
		if (e.length === 0 || n.snapshot != null || n.prevSnapshot != null) {
			this.renderSnapshot(n.snapshot, n.prevSnapshot);
			return;
		}
		this.mux(() => {
			let e = (e, t) => this.mapping.delete(t);
			qw(t, t.deleteSet, (e) => {
				if (e.constructor === Z) {
					let t = e.content.type;
					t && this.mapping.delete(t);
				}
			}), t.changed.forEach(e), t.changedParentTypes.forEach(e), this.mapping.clear();
			let n = this.type.toArray().map((e) => BO(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), r = this.prosemirrorView.state.doc, i = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new d(a.from(n), 0, 0));
			FO(i, this.beforeTransactionSelection, this, r), i = i.setMeta(Q, {
				isChangeOrigin: !0,
				isUndoRedoOperation: t.origin instanceof oE
			}), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && i.scrollIntoView(), this.prosemirrorView.dispatch(i);
		});
	}
	_prosemirrorChanged(e) {
		this.doc.transact(() => {
			ak(this.doc, this.type, e, this), this.beforeTransactionSelection = RO(this, this.prosemirrorView.state);
		}, Q);
	}
	initView(e) {
		this.prosemirrorView != null && this.destroy(), this.prosemirrorView = e, this.doc.on("beforeAllTransactions", this.beforeAllTransactions), this.doc.on("afterAllTransactions", this.afterAllTransactions), this.type.observeDeep(this._observeFunction);
	}
	destroy() {
		this.prosemirrorView != null && (this.prosemirrorView = null, this.type.unobserveDeep(this._observeFunction), this.doc.off("beforeAllTransactions", this.beforeAllTransactions), this.doc.off("afterAllTransactions", this.afterAllTransactions));
	}
}, BO = (e, t, n, r, i, a) => {
	let o = n.mapping.get(e);
	if (o === void 0) {
		if (e instanceof bD) return VO(e, t, n, r, i, a);
		throw nS();
	}
	return o;
}, VO = (e, t, n, r, i, a) => {
	let o = [], s = (e) => {
		if (e instanceof bD) {
			let s = BO(e, t, n, r, i, a);
			s !== null && o.push(s);
		} else {
			let s = e._item.right?.content?.type;
			s instanceof hD && !s._item.deleted && s._item.id.client === s.doc.clientID && (e.applyDelta([{ retain: e.length }, ...s.toDelta()]), s.doc.transact((e) => {
				s._item.delete(e);
			}));
			let c = HO(e, t, n, r, i, a);
			c !== null && c.forEach((e) => {
				e !== null && o.push(e);
			});
		}
	};
	r === void 0 || i === void 0 ? e.toArray().forEach(s) : AE(e, new FT(i.ds, r.sv)).forEach(s);
	try {
		let s = e.getAttributes(r);
		r !== void 0 && (AO(e._item, r) ? AO(e._item, i) || (s.ychange = a ? a("added", e._item.id) : { type: "added" }) : s.ychange = a ? a("removed", e._item.id) : { type: "removed" });
		let c = t.node(e.nodeName, s, o);
		return n.mapping.set(e, c), c;
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, Q), n.mapping.delete(e), null;
	}
}, HO = (e, t, n, r, i, a) => {
	let o = [], s = e.toDelta(r, i, a);
	try {
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			o.push(t.text(n.insert, rk(n.attributes, t)));
		}
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, Q), null;
	}
	return o;
}, UO = (e, t) => {
	let n = new TD(), r = e.map((e) => ({
		insert: e.text,
		attributes: ik(e.marks, t)
	}));
	return n.applyDelta(r), t.mapping.set(n, e), n;
}, WO = (e, t) => {
	let n = new bD(e.type.name);
	for (let t in e.attrs) {
		let r = e.attrs[t];
		r !== null && t !== "ychange" && n.setAttribute(t, r);
	}
	return n.insert(0, JO(e).map((e) => GO(e, t))), t.mapping.set(n, e), n;
}, GO = (e, t) => e instanceof Array ? UO(e, t) : WO(e, t), KO = (e) => typeof e == "object" && !!e, qO = (e, t) => {
	let n = Object.keys(e).filter((t) => e[t] !== null), r = n.length === Object.keys(t).filter((e) => t[e] !== null).length;
	for (let i = 0; i < n.length && r; i++) {
		let a = n[i], o = e[a], s = t[a];
		r = a === "ychange" || o === s || KO(o) && KO(s) && qO(o, s);
	}
	return r;
}, JO = (e) => {
	let t = e.content.content, n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (r.isText) {
			let r = [];
			for (let n = t[e]; e < t.length && n.isText; n = t[++e]) r.push(n);
			e--, n.push(r);
		} else n.push(r);
	}
	return n;
}, YO = (e, t) => {
	let n = e.toDelta();
	return n.length === t.length && n.every((e, n) => e.insert === t[n].text && IS(e.attributes || {}).length === t[n].marks.length && BS(e.attributes, (e, r) => {
		let i = nk(r), a = t[n].marks;
		return a.find((e) => e.type.name === i) ? qO(e, a.find((e) => e.type.name === i)?.attrs) : !1;
	}));
}, XO = (e, t) => {
	if (e instanceof bD && !(t instanceof Array) && ok(e, t)) {
		let n = JO(t);
		return e._length === n.length && qO(e.getAttributes(), t.attrs) && e.toArray().every((e, t) => XO(e, n[t]));
	}
	return e instanceof TD && t instanceof Array && YO(e, t);
}, ZO = (e, t) => e === t || e instanceof Array && t instanceof Array && e.length === t.length && e.every((e, n) => t[n] === e), QO = (e, t, n) => {
	let r = e.toArray(), i = JO(t), a = i.length, o = r.length, s = $b(o, a), c = 0, l = 0, u = !1;
	for (; c < s; c++) {
		let e = r[c], t = i[c];
		if (ZO(n.mapping.get(e), t)) u = !0;
		else if (!XO(e, t)) break;
	}
	for (; c + l < s; l++) {
		let e = r[o - l - 1], t = i[a - l - 1];
		if (ZO(n.mapping.get(e), t)) u = !0;
		else if (!XO(e, t)) break;
	}
	return {
		equalityFactor: c + l,
		foundMappedChild: u
	};
}, $O = (e) => {
	let t = "", n = e._start, r = {};
	for (; n !== null;) n.deleted || (n.countable && n.content instanceof GD ? t += n.content.str : n.content instanceof X && (r[n.content.key] = null)), n = n.right;
	return {
		str: t,
		nAttrs: r
	};
}, ek = (e, t, n) => {
	n.mapping.set(e, t);
	let { nAttrs: r, str: i } = $O(e), a = t.map((e) => ({
		insert: e.text,
		attributes: Object.assign({}, r, ik(e.marks, n))
	})), { insert: o, remove: s, index: c } = _O(i, a.map((e) => e.insert).join(""));
	e.delete(c, s), e.insert(c, o), e.applyDelta(a.map((e) => ({
		retain: e.insert.length,
		attributes: e.attributes
	})));
}, tk = /(.*)(--[a-zA-Z0-9+/=]{8})$/, nk = (e) => tk.exec(e)?.[1] ?? e, rk = (e, t) => {
	let n = [];
	for (let r in e) n.push(t.mark(nk(r), e[r]));
	return n;
}, ik = (e, t) => {
	let n = {};
	return e.forEach((e) => {
		if (e.type.name !== "ychange") {
			let r = zb(t.isOMark, e.type, () => !e.type.excludes(e.type));
			n[r ? `${e.type.name}--${kO(e.toJSON())}` : e.type.name] = e.attrs;
		}
	}), n;
}, ak = (e, t, n, r) => {
	if (t instanceof bD && t.nodeName !== n.type.name) throw Error("node name mismatch!");
	if (r.mapping.set(t, n), t instanceof bD) {
		let e = t.getAttributes(), r = n.attrs;
		for (let n in r) r[n] === null ? t.removeAttribute(n) : e[n] !== r[n] && n !== "ychange" && t.setAttribute(n, r[n]);
		for (let n in e) r[n] === void 0 && t.removeAttribute(n);
	}
	let i = JO(n), a = i.length, o = t.toArray(), s = o.length, c = $b(a, s), l = 0, u = 0;
	for (; l < c; l++) {
		let e = o[l], t = i[l];
		if (!ZO(r.mapping.get(e), t)) if (XO(e, t)) r.mapping.set(e, t);
		else break;
	}
	for (; u + l + 1 < c; u++) {
		let e = o[s - u - 1], t = i[a - u - 1];
		if (!ZO(r.mapping.get(e), t)) if (XO(e, t)) r.mapping.set(e, t);
		else break;
	}
	e.transact(() => {
		for (; s - l - u > 0 && a - l - u > 0;) {
			let n = o[l], c = i[l], d = o[s - u - 1], f = i[a - u - 1];
			if (n instanceof TD && c instanceof Array) YO(n, c) || ek(n, c, r), l += 1;
			else {
				let i = n instanceof bD && ok(n, c), a = d instanceof bD && ok(d, f);
				if (i && a) {
					let e = QO(n, c, r), t = QO(d, f, r);
					e.foundMappedChild && !t.foundMappedChild ? a = !1 : !e.foundMappedChild && t.foundMappedChild || e.equalityFactor < t.equalityFactor ? i = !1 : a = !1;
				}
				i ? (ak(e, n, c, r), l += 1) : a ? (ak(e, d, f, r), u += 1) : (r.mapping.delete(t.get(l)), t.delete(l, 1), t.insert(l, [GO(c, r)]), l += 1);
			}
		}
		let n = s - l - u;
		if (s === 1 && a === 0 && o[0] instanceof TD ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : n > 0 && (t.slice(l, l + n).forEach((e) => r.mapping.delete(e)), t.delete(l, n)), l + u < a) {
			let e = [];
			for (let t = l; t < a - u; t++) e.push(GO(i[t], r));
			t.insert(l, e);
		}
	}, Q);
}, ok = (e, t) => !(t instanceof Array) && e.nodeName === t.type.name, sk = null, ck = class {
	constructor(e, t, n) {
		this.view = e, this.key = t, this.value = n;
	}
	apply() {
		let e = Q.getState(this.view.state);
		if (e && e.binding && !e.binding.isDestroyed) {
			let e = this.view.state.tr;
			e.setMeta(this.key, this.value), this.view.dispatch(e);
		}
	}
}, lk = class e {
	constructor(e = []) {
		this.entries = e;
	}
	getFirst() {
		return this.entries[0];
	}
	dequeueFirst() {
		return this.entries.shift();
	}
	isEmpty() {
		return this.entries.length === 0;
	}
	static fromViewsToUpdate() {
		let t = sk;
		sk = null;
		let n = [];
		return t.forEach((e, t) => {
			e.forEach((e, r) => {
				n.push(new ck(t, r, e));
			});
		}), new e(n);
	}
}, uk = (e = lk.fromViewsToUpdate(), t = !1) => {
	let n = !0;
	for (; !e.isEmpty();) {
		let r = e.getFirst();
		try {
			r.apply();
		} catch (r) {
			if (r instanceof RangeError) {
				t && n && e.dequeueFirst(), e.isEmpty() || Tw(0, () => uk(e, !0));
				return;
			}
			throw r;
		}
		n = !1, e.dequeueFirst();
	}
}, dk = (e, t, n) => {
	if (e === 0) return MT(t, 0, -1);
	let r = t._first === null ? null : t._first.content.type;
	for (; r !== null && t !== r;) {
		if (r instanceof TD) {
			if (r._length >= e) return MT(r, e, -1);
			if (e -= r._length, r._item !== null && r._item.next !== null) r = r._item.next.content.type;
			else {
				do
					r = r._item === null ? null : r._item.parent, e--;
				while (r !== t && r !== null && r._item !== null && r._item.next === null);
				r !== null && r !== t && (r = r._item === null ? null : r._item.next.content.type);
			}
		} else {
			let i = (n.get(r) || { nodeSize: 0 }).nodeSize;
			if (r._first !== null && e < i) r = r._first.content.type, e--;
			else {
				if (e === 1 && r._length === 0 && i > 1) return new OT(r._item === null ? null : r._item.id, r._item === null ? ET(r) : null, null);
				if (e -= i, r._item !== null && r._item.next !== null) r = r._item.next.content.type;
				else {
					if (e === 0) return r = r._item === null ? r : r._item.parent, new OT(r._item === null ? null : r._item.id, r._item === null ? ET(r) : null, null);
					do
						r = r._item.parent, e--;
					while (r !== t && r._item.next === null);
					r !== t && (r = r._item.next.content.type);
				}
			}
		}
		if (r === null) throw rS();
		if (e === 0 && r.constructor !== TD && r !== t) return pk(r._item.parent, r._item);
	}
	return MT(t, t._length, -1);
}, fk = (e, t, n) => {
	if (n === null) return !1;
	let r = PT(t, e);
	return r !== null && r.type instanceof TD && t.item !== null && n <= 1;
}, pk = (e, t) => {
	let n = null, r = null;
	return e._item === null ? r = ET(e) : n = K(e._item.id.client, e._item.id.clock), new OT(n, r, t.id);
}, mk = (e, t, n, r) => {
	let i = PT(n, e);
	if (i === null || i.type !== t && !DT(t, i.type._item)) return null;
	let a = i.type, o = 0;
	if (a.constructor === TD) o = i.index;
	else if (a._item === null || !a._item.deleted) {
		let e = a._first, t = 0;
		for (; t < a._length && t < i.index && e !== null;) {
			if (!e.deleted) {
				let n = e.content.type;
				if (t++, n instanceof TD) o += n._length;
				else {
					let e = r.get(n);
					if (e == null) return null;
					o += e.nodeSize;
				}
			}
			e = e.right;
		}
		o += 1;
	}
	for (; a !== t && a._item !== null;) {
		let e = a._item.parent;
		if (e._item === null || !e._item.deleted) {
			o += 1;
			let t = e._first;
			for (; t !== null;) {
				let e = t.content.type;
				if (e === a) break;
				if (!t.deleted) if (e instanceof TD) o += e._length;
				else {
					let t = r.get(e);
					if (t == null) return null;
					o += t.nodeSize;
				}
				t = t.right;
			}
		}
		a = e;
	}
	let s = o - 1;
	return fk(e, n, s) ? null : s;
}, hk = (e, t) => {
	if (e === t) return !0;
	let n = Object.keys(e);
	return n.length === Object.keys(t).length && n.every((n) => e[n] === t[n]);
}, gk = (e) => {
	let t = e.type.spec.attrs || {};
	return Object.keys(e.attrs).some((n) => {
		let r = t[n];
		return r == null || !Object.prototype.hasOwnProperty.call(r, "default") || r.default !== e.attrs[n];
	});
}, _k = (e, t, n) => {
	let r = t + 1, i = n;
	for (let t = 1; t < e.depth; t++) {
		let n = e.index(t);
		if (n >= i.childCount) return null;
		for (let e = 0; e < n; e++) r += i.child(e).nodeSize;
		if (r += 1, i = i.child(n), i.type !== e.node(t + 1).type) return null;
	}
	return i.isTextblock ? r + Math.min(e.parentOffset, i.content.size) : null;
}, vk = (e, t, n) => {
	let r = 0, i = 0;
	for (; i < e.childCount; i++) {
		let t = e.child(i);
		if (r + t.nodeSize > n) break;
		r += t.nodeSize;
	}
	if (i >= e.childCount) return null;
	let a = e.child(i), o = e.resolve(n), s = (e, t) => {
		if (o.depth === 0) {
			let i = e + (n - r), a = e + 1, o = e + t.nodeSize - 1;
			return Math.max(a, Math.min(i, o));
		}
		return _k(o, e, t);
	}, c = (n, r = !1) => {
		let a = 0;
		for (let t = 0; t <= i; t++) n(e.child(t)) && a++;
		let o = 0, c = -1, l = null, u = 0;
		for (let e = 0; e < t.childCount; e++) {
			let r = t.child(e);
			n(r) && (o++, o === a && (c = u, l = r)), u += r.nodeSize;
		}
		return l === null || r && (a !== 1 || o !== 1) ? null : s(c, l);
	}, l = (e) => e.type === a.type && hk(e.attrs, a.attrs), u = a.textContent, d = c((e) => l(e) && e.textContent === u);
	if (d !== null) return d;
	let f = c((e) => e.type === a.type && e.textContent === u);
	if (f !== null) return f;
	if (gk(a)) {
		let e = c(l, !0);
		if (e !== null) return e;
	}
	return c((e) => l(e) && u !== "" && e.textContent !== "" && (u.startsWith(e.textContent) || e.textContent.startsWith(u)), !0);
}, yk = (e, t, n, r) => {
	if (r === null) return !1;
	let i = e.resolve(n), a = t.resolve(r);
	if (!i.parent.isTextblock) return !1;
	if (!a.parent.isTextblock || i.parent.textContent !== a.parent.textContent || i.parentOffset !== 0 && a.parentOffset === 0) return !0;
	let o = i.parentOffset === 0 && a.parentOffset === 0, s = i.parentOffset !== a.parentOffset || i.parent.type !== a.parent.type || !hk(i.parent.attrs, a.parent.attrs);
	if (o || s) {
		let i = vk(e, t, n);
		return i !== null && i !== r;
	}
	return !1;
}, bk = (e) => {
	let t = DO.getState(e).undoManager;
	if (t != null) return t.undo(), !0;
}, xk = (e) => {
	let t = DO.getState(e).undoManager;
	if (t != null) return t.redo(), !0;
}, Sk = /* @__PURE__ */ new Set(["paragraph"]), Ck = (e, t) => !(e instanceof Z) || !(e.content instanceof tO) || !(e.content.type instanceof hD || e.content.type instanceof bD && t.has(e.content.type.nodeName)) || e.content.type._length === 0, wk = ({ protectedNodes: e = Sk, trackedOrigins: t = [], undoManager: n = null } = {}) => new E({
	key: DO,
	state: {
		init: (r, i) => {
			let a = Q.getState(i), o = n;
			if (!o) {
				let n = a.doc, r = new Set(n ? n._observers.get("destroy") : []);
				o = new oE(a.type, {
					trackedOrigins: new Set([Q].concat(t)),
					deleteFilter: (t) => Ck(t, e),
					captureTransaction: (e) => e.meta.get("addToHistory") !== !1
				});
				let i = n ? n._observers.get("destroy") : /* @__PURE__ */ new Set();
				o._yTiptapDocDestroyListeners = Array.from(i || []).filter((e) => !r.has(e));
			}
			return {
				undoManager: o,
				prevSel: null,
				hasUndoOps: o.undoStack.length > 0,
				hasRedoOps: o.redoStack.length > 0
			};
		},
		apply: (e, t, n, r) => {
			let i = Q.getState(r).binding, a = t.undoManager, o = a.undoStack.length > 0, s = a.redoStack.length > 0;
			return i ? {
				undoManager: a,
				prevSel: RO(i, n),
				hasUndoOps: o,
				hasRedoOps: s
			} : o !== t.hasUndoOps || s !== t.hasRedoOps ? Object.assign({}, t, {
				hasUndoOps: a.undoStack.length > 0,
				hasRedoOps: a.redoStack.length > 0
			}) : t;
		}
	},
	view: (e) => {
		let t = Q.getState(e.state), n = DO.getState(e.state).undoManager;
		return n.on("stack-item-added", ({ stackItem: n }) => {
			let r = t.binding;
			r && n.meta.set(r, DO.getState(e.state).prevSel);
		}), n.on("stack-item-popped", ({ stackItem: e }) => {
			let n = t.binding;
			n && (n.beforeTransactionSelection = e.meta.get(n) || n.beforeTransactionSelection);
		}), { destroy: () => {
			n.destroy();
			let e = n._yTiptapDocDestroyListeners;
			e && n.doc && (e.forEach((e) => n.doc.off("destroy", e)), n._yTiptapDocDestroyListeners = null);
		} };
	}
});
//#endregion
//#region node_modules/@tiptap/extension-collaboration/dist/index.js
function Tk(e) {
	return !!e.getMeta(Q);
}
function Ek(e, t) {
	let n = Q.getState(e);
	return mk(n.doc, n.type, t, n.binding.mapping) || 0;
}
function Dk(e, t) {
	let n = Q.getState(e);
	return dk(t, n.type, n.binding.mapping);
}
var Ok = class e extends wu {
	constructor(e, t) {
		super(e), this.yRelativePosition = t;
	}
	static fromJSON(t) {
		return new e(t.position, t.yRelativePosition);
	}
	toJSON() {
		return {
			position: this.position,
			yRelativePosition: this.yRelativePosition
		};
	}
};
function kk(e, t) {
	return new Ok(e, Dk(t, e));
}
function Ak(e, t, n) {
	let r = e instanceof Ok ? e.yRelativePosition : null;
	if (Tk(t) && r) return {
		position: new Ok(Ek(n, r), r),
		mapResult: null
	};
	let i = Tu(e, t), a = i.position.position;
	return {
		position: new Ok(a, r ?? Dk(n, a)),
		mapResult: i.mapResult
	};
}
N.create({
	name: "collaboration",
	priority: 1e3,
	addOptions() {
		return {
			document: null,
			field: "default",
			fragment: null,
			provider: null
		};
	},
	addStorage() {
		return { isDisabled: !1 };
	},
	onCreate() {
		this.editor.extensionManager.extensions.find((e) => e.name === "undoRedo") && console.warn("[tiptap warn]: \"@tiptap/extension-collaboration\" comes with its own history support and is not compatible with \"@tiptap/extension-undo-redo\".");
	},
	onBeforeCreate() {
		this.editor.utils.getUpdatedPosition = (e, t) => Ak(e, t, this.editor.state), this.editor.utils.createMappablePosition = (e) => kk(e, this.editor.state);
	},
	addCommands() {
		return {
			undo: () => ({ tr: e, state: t, dispatch: n }) => (e.setMeta("preventDispatch", !0), DO.getState(t).undoManager.undoStack.length === 0 ? !1 : !n || bk(t)),
			redo: () => ({ tr: e, state: t, dispatch: n }) => (e.setMeta("preventDispatch", !0), DO.getState(t).undoManager.redoStack.length === 0 ? !1 : !n || xk(t))
		};
	},
	addKeyboardShortcuts() {
		return {
			"Mod-z": () => this.editor.commands.undo(),
			"Mod-y": () => this.editor.commands.redo(),
			"Shift-Mod-z": () => this.editor.commands.redo()
		};
	},
	addProseMirrorPlugins() {
		let e = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), t = wk(this.options.yUndoOptions), n = t.spec.view;
		return t.spec.view = (e) => {
			let { undoManager: t } = DO.getState(e.state);
			t.restore &&= (t.restore(), () => {});
			let r = n ? n(e) : void 0;
			return { destroy: () => {
				let e = t.trackedOrigins.has(t), n = t._observers;
				t.restore = () => {
					e && t.trackedOrigins.add(t), t.doc.on("afterTransaction", t.afterTransactionHandler), t._observers = n;
				}, r?.destroy && r.destroy();
			} };
		}, [
			NO(e, {
				...this.options.ySyncOptions,
				onFirstRender: this.options.onFirstRender
			}),
			t,
			this.editor.options.enableContentCheck && new E({
				key: new D("filterInvalidContent"),
				filterTransaction: (t) => {
					if (!Tk(t)) return !0;
					if (this.storage.isDisabled) return !1;
					if (!t.docChanged) return !0;
					try {
						return t.doc.check(), !0;
					} catch (t) {
						return this.storage.isDisabled = !0, this.editor.emit("contentError", {
							error: t,
							editor: this.editor,
							disableCollaboration: () => {
								e.doc?.destroy();
							}
						}), !0;
					}
				}
			})
		].filter(Boolean);
	}
});
//#endregion
//#region node_modules/@tiptap/extension-node-range/dist/index.js
function jk(e) {
	if (!e.length) return O.empty;
	let t = [], n = e[0].$from.node(0);
	return e.forEach((e) => {
		let n = e.$from.pos, r = e.$from.nodeAfter;
		r && t.push(us.node(n, n + r.nodeSize, { class: "ProseMirror-selectednoderange" }));
	}), O.create(n, t);
}
function Mk(e, t, n) {
	let r = n.isText || n.isAtom ? 0 : 1;
	return {
		start: e + r,
		end: e + t - r
	};
}
function Nk(e, t, n, r = {}) {
	let i = [], a = e.node(0), { extendOnBoundaryOverlap: o = !0 } = r;
	typeof n == "number" && n >= 0 || (n = e.sameParent(t) ? Math.max(0, e.sharedDepth(t.pos) - 1) : e.sharedDepth(t.pos));
	let s = new ae(e, t, n), c = s.depth === 0 ? 0 : a.resolve(s.start).posAtIndex(0);
	return s.parent.forEach((n, r) => {
		let l = c + r, u = l + n.nodeSize, d = Mk(l, n.nodeSize, n), f = o ? t.pos >= d.start && e.pos <= d.end : t.pos > d.start && e.pos < d.end;
		if (l < s.start || l >= s.end || !f) return;
		let p = new vn(a.resolve(l), a.resolve(u));
		i.push(p);
	}), i;
}
var Pk = class e {
	constructor(e, t, n) {
		this.anchor = e, this.head = t, this.depth = n ?? 0;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head), this.depth);
	}
	resolve(e) {
		return new Fk(e.resolve(this.anchor), e.resolve(this.head), this.depth);
	}
}, Fk = class e extends C {
	constructor(e, t, n, r = 1) {
		let { doc: i } = e, a = e === t, o = e.pos === i.content.size && t.pos === i.content.size, s = a && !o ? i.resolve(t.pos + (r > 0 ? 1 : -1)) : t, c = a && o ? i.resolve(e.pos - (r > 0 ? 1 : -1)) : e, l = Nk(c.min(s), c.max(s), n), u = s.pos >= e.pos ? l[0].$from : l[l.length - 1].$to, d = s.pos >= e.pos ? l[l.length - 1].$to : l[0].$from;
		super(u, d, l), this.depth = n;
	}
	get $to() {
		return this.ranges[this.ranges.length - 1].$to;
	}
	eq(t) {
		return t instanceof e && t.$from.pos === this.$from.pos && t.$to.pos === this.$to.pos;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.anchor)), i = t.resolve(n.map(this.head));
		return new e(r, i, this.depth);
	}
	toJSON() {
		return {
			type: "nodeRange",
			anchor: this.anchor,
			head: this.head,
			depth: this.depth
		};
	}
	get isForwards() {
		return this.head >= this.anchor;
	}
	get isBackwards() {
		return !this.isForwards;
	}
	extendBackwards() {
		let { doc: t } = this.$from;
		if (this.isForwards && this.ranges.length > 1) {
			let t = this.ranges.slice(0, -1), n = t[0].$from, r = t[t.length - 1].$to;
			return new e(n, r, this.depth);
		}
		let n = this.ranges[0], r = t.resolve(Math.max(0, n.$from.pos - 1));
		return new e(this.$anchor, r, this.depth);
	}
	extendForwards() {
		let { doc: t } = this.$from;
		if (this.isBackwards && this.ranges.length > 1) {
			let t = this.ranges.slice(1), n = t[0].$from, r = t[t.length - 1].$to;
			return new e(r, n, this.depth);
		}
		let n = this.ranges[this.ranges.length - 1], r = t.resolve(Math.min(t.content.size, n.$to.pos + 1));
		return new e(this.$anchor, r, this.depth);
	}
	static fromJSON(t, n) {
		return new e(t.resolve(n.anchor), t.resolve(n.head), n.depth);
	}
	static create(e, t, n, r, i = 1) {
		return new this(e.resolve(t), e.resolve(n), r, i);
	}
	getBookmark() {
		return new Pk(this.anchor, this.head, this.depth);
	}
};
Fk.prototype.visible = !1;
try {
	C.jsonID("nodeRange", Fk);
} catch {}
function Ik(e) {
	return e instanceof Fk;
}
N.create({
	name: "nodeRange",
	addOptions() {
		return {
			depth: void 0,
			key: "Mod"
		};
	},
	addKeyboardShortcuts() {
		return {
			"Shift-ArrowUp": ({ editor: e }) => {
				let { depth: t } = this.options, { view: n, state: r } = e, { doc: i, selection: a, tr: o } = r, { anchor: s, head: c } = a;
				if (!Ik(a)) {
					let e = Fk.create(i, s, c, t, -1);
					return o.setSelection(e), n.dispatch(o), !0;
				}
				let l = a.extendBackwards();
				return o.setSelection(l), n.dispatch(o), !0;
			},
			"Shift-ArrowDown": ({ editor: e }) => {
				let { depth: t } = this.options, { view: n, state: r } = e, { doc: i, selection: a, tr: o } = r, { anchor: s, head: c } = a;
				if (!Ik(a)) {
					let e = Fk.create(i, s, c, t);
					return o.setSelection(e), n.dispatch(o), !0;
				}
				let l = a.extendForwards();
				return o.setSelection(l), n.dispatch(o), !0;
			},
			"Mod-a": ({ editor: e }) => {
				let { depth: t } = this.options, { view: n, state: r } = e, { doc: i, tr: a } = r, o = Fk.create(i, 0, i.content.size, t);
				return a.setSelection(o), n.dispatch(a), !0;
			}
		};
	},
	onSelectionUpdate() {
		let { selection: e } = this.editor.state;
		Ik(e) && this.editor.view.dom.classList.add("ProseMirror-noderangeselection");
	},
	addProseMirrorPlugins() {
		let e = !1, t = !1;
		return [new E({
			key: new D("nodeRange"),
			props: {
				attributes: () => e ? { class: "ProseMirror-noderangeselection" } : { class: "" },
				handleDOMEvents: { mousedown: (e, n) => {
					let { key: r } = this.options, i = /Mac/.test(navigator.platform), a = !!n.shiftKey, o = !!n.ctrlKey, s = !!n.altKey, c = !!n.metaKey;
					return (r == null || r === "Shift" && a || r === "Control" && o || r === "Alt" && s || r === "Meta" && c || r === "Mod" && (i ? c : o)) && (t = !0), t && document.addEventListener("mouseup", () => {
						t = !1;
						let { state: n } = e, { doc: r, selection: i, tr: a } = n, { $anchor: o, $head: s } = i;
						if (o.sameParent(s)) return;
						let c = Fk.create(r, o.pos, s.pos, this.options.depth);
						a.setSelection(c), e.dispatch(a);
					}, { once: !0 }), !1;
				} },
				decorations: (n) => {
					let { selection: r } = n, i = Ik(r);
					if (e = !1, !t) return i ? (e = !0, jk(r.ranges)) : null;
					let { $from: a, $to: o } = r;
					if (!i && a.sameParent(o)) return null;
					let s = Nk(a, o, this.options.depth);
					return s.length ? (e = !0, jk(s)) : null;
				}
			}
		})];
	}
});
//#endregion
//#region node_modules/@tiptap/extension-drag-handle/dist/index.js
function Lk(e, t) {
	let n = getComputedStyle(e);
	if (t) return t.map((e) => e.trim()).filter((e) => e.length > 0).map((e) => `${e}:${n.getPropertyValue(e)};`).join("");
	let r = "";
	for (let e = 0; e < n.length; e += 1) r += `${n[e]}:${n.getPropertyValue(n[e])};`;
	return r;
}
function Rk(e, t) {
	let n = e.cloneNode(!0), r = [e, ...Array.from(e.getElementsByTagName("*"))], i = [n, ...Array.from(n.getElementsByTagName("*"))];
	return r.forEach((e, n) => {
		i[n].style.cssText = Lk(e, t);
	}), n;
}
var zk = [
	{
		id: "listItemFirstChild",
		evaluate: ({ parent: e, isFirst: t }) => t && e && ["listItem", "taskItem"].includes(e.type.name) ? 1e3 : 0
	},
	{
		id: "listWrapperDeprioritize",
		evaluate: ({ node: e }) => {
			let t = ["listItem", "taskItem"], n = e.firstChild;
			return n && t.includes(n.type.name) ? 1e3 : 0;
		}
	},
	{
		id: "tableStructure",
		evaluate: ({ node: e, parent: t }) => [
			"tableRow",
			"tableCell",
			"tableHeader"
		].includes(e.type.name) || t && t.type.name === "tableHeader" ? 1e3 : 0
	},
	{
		id: "inlineContent",
		evaluate: ({ node: e }) => e.isInline || e.isText ? 1e3 : 0
	}
], Bk = {
	edges: ["left", "top"],
	threshold: 12,
	strength: 500
};
function Vk(e) {
	return e === void 0 || e === "left" ? { ...Bk } : e === "right" ? {
		edges: ["right", "top"],
		threshold: 12,
		strength: 500
	} : e === "both" ? {
		edges: [
			"left",
			"right",
			"top"
		],
		threshold: 12,
		strength: 500
	} : e === "none" ? {
		edges: [],
		threshold: 0,
		strength: 0
	} : {
		...Bk,
		...e
	};
}
function Hk(e, t, n) {
	if (n.edges.length === 0) return !1;
	let r = t.getBoundingClientRect(), { threshold: i, edges: a } = n;
	return a.some((t) => t === "left" ? e.x - r.left < i : t === "right" ? r.right - e.x < i : t === "top" ? e.y - r.top < i : t === "bottom" && r.bottom - e.y < i);
}
function Uk(e, t, n, r) {
	return !t || n.edges.length === 0 ? 0 : Hk(e, t, n) ? n.strength * r : 0;
}
var Wk = 1e3;
function Gk(e, t, n, r) {
	let i = Wk, a = !1;
	if (t.every((t) => {
		let n = t.evaluate(e);
		return i -= n, i <= 0 ? (a = !0, !1) : !0;
	}), a) return -1;
	let o = e.view.nodeDOM(e.pos);
	return i -= Uk(r, o, n, e.depth), i <= 0 ? -1 : i;
}
function Kk(e, t, n) {
	return Array.from({ length: t }, (e, n) => t - 1 - n).some((t) => n.includes(e.node(t).type.name));
}
function qk(e, t, n) {
	if (!Number.isFinite(t.x) || !Number.isFinite(t.y)) return null;
	let r = e.posAtCoords({
		left: t.x,
		top: t.y
	});
	if (!r) return null;
	let { doc: i } = e.state, a = i.resolve(r.pos), o = [];
	n.defaultRules && o.push(...zk), o.push(...n.rules);
	let s = Array.from({ length: a.depth }, (e, t) => a.depth - t).map((r) => {
		let i = a.node(r), s = a.before(r);
		if (n.allowedContainers && r > 0 && !Kk(a, r, n.allowedContainers)) return null;
		let c = r > 0 ? a.node(r - 1) : null, l = r > 0 ? a.index(r - 1) : 0, u = c ? c.childCount : 1, d = Gk({
			node: i,
			pos: s,
			depth: r,
			parent: c,
			index: l,
			isFirst: l === 0,
			isLast: l === u - 1,
			$pos: a,
			view: e
		}, o, n.edgeDetection, t);
		return d < 0 ? null : {
			node: i,
			pos: s,
			depth: r,
			score: d,
			dom: e.nodeDOM(s)
		};
	}).filter((e) => e !== null), c = a.nodeAfter;
	if (c && c.isAtom && !c.isInline) {
		let i = r.pos, l = a.depth + 1, u = a.parent, d = a.index(), f = u.childCount, p = !0;
		if (n.allowedContainers && (p = Kk(a, l, n.allowedContainers)), p) {
			let r = Gk({
				node: c,
				pos: i,
				depth: l,
				parent: u,
				index: d,
				isFirst: d === 0,
				isLast: d === f - 1,
				$pos: a,
				view: e
			}, o, n.edgeDetection, t);
			if (r >= 0) {
				let t = e.nodeDOM(i);
				t && s.push({
					node: c,
					pos: i,
					depth: l,
					score: r,
					dom: t
				});
			}
		}
	}
	if (s.length === 0) return null;
	s.sort((e, t) => t.score === e.score ? t.depth - e.depth : t.score - e.score);
	let l = s[0];
	return l.dom ? {
		node: l.node,
		pos: l.pos,
		dom: l.dom
	} : null;
}
function Jk(e, t) {
	let n = e;
	for (; n?.parentElement && n.parentElement !== t.dom;) n = n.parentElement;
	if (n?.parentElement === t.dom && n.pmViewDesc?.node) return n;
}
function Yk(e) {
	return Number.isFinite(e.top) && Number.isFinite(e.bottom) && Number.isFinite(e.left) && Number.isFinite(e.right) && e.width > 0 && e.height > 0;
}
function Xk(e, t) {
	let n = t === "first" ? e.firstElementChild : e.lastElementChild;
	for (; n;) {
		let e = n.getBoundingClientRect();
		if (Yk(e)) return e;
		n = t === "first" ? n.nextElementSibling : n.previousElementSibling;
	}
	return null;
}
function Zk(e, t, n, r = 5) {
	if (!Number.isFinite(t) || !Number.isFinite(n)) return null;
	let i = e.dom, a = Xk(i, "first"), o = Xk(i, "last");
	if (!a || !o) return null;
	let s = Math.min(Math.max(a.top + r, n), o.bottom - r), c = .5, l = Math.abs(a.left - o.left) < c, u = Math.abs(a.right - o.right) < c, d = a;
	l && u && (d = a);
	let f = Math.min(Math.max(d.left + r, t), d.right - r);
	return !Number.isFinite(f) || !Number.isFinite(s) ? null : {
		x: f,
		y: s
	};
}
var Qk = (e) => {
	let { x: t, y: n, editor: r, nestedOptions: i } = e, { view: a, state: o } = r, s = Zk(a, t, n, 5);
	if (!s) return {
		resultElement: null,
		resultNode: null,
		pos: null
	};
	let { x: c, y: l } = s;
	if (i?.enabled) {
		let e = qk(a, {
			x: c,
			y: l
		}, i);
		return e ? {
			resultElement: e.dom,
			resultNode: e.node,
			pos: e.pos
		} : {
			resultElement: null,
			resultNode: null,
			pos: null
		};
	}
	let u = a.root.elementsFromPoint(c, l), d;
	if (Array.prototype.some.call(u, (e) => {
		if (!a.dom.contains(e)) return !1;
		let t = Jk(e, a);
		return t ? (d = t, !0) : !1;
	}), !d) {
		let e = a.posAtCoords({
			left: c,
			top: l
		});
		if (e) {
			let t = o.doc.resolve(e.pos), n = Math.min(t.depth, 1), r = n > 0 ? t.before(n) : t.pos, i = o.doc.nodeAt(r);
			if (i) {
				let e = a.nodeDOM(r);
				return {
					resultElement: e instanceof HTMLElement ? e : null,
					resultNode: i,
					pos: r
				};
			}
		}
		return {
			resultElement: null,
			resultNode: null,
			pos: null
		};
	}
	let f;
	try {
		f = a.posAtDOM(d, 0);
	} catch {
		return {
			resultElement: null,
			resultNode: null,
			pos: null
		};
	}
	let p = o.doc.nodeAt(f);
	if (!p) {
		let e = o.doc.resolve(f), t = e.parent;
		return {
			resultElement: d,
			resultNode: t,
			pos: e.start()
		};
	}
	return {
		resultElement: d,
		resultNode: p,
		pos: f
	};
};
function $k(e, t) {
	let n = e.nodeDOM(t);
	if (n instanceof Element && n !== e.dom) return n;
	let { node: r, offset: i } = e.domAtPos(t), a = r.childNodes[i];
	return a instanceof Element ? a : r instanceof Element ? r : r.nodeType === Node.TEXT_NODE && r.parentElement ? r.parentElement : null;
}
function eA(e, t) {
	let n = $k(e, t);
	return (n ? getComputedStyle(n).direction : getComputedStyle(e.dom).direction) || "ltr";
}
function tA(e) {
	e.parentNode?.removeChild(e);
}
function nA(e, t) {
	return e === "rtl" ? t : 0;
}
function rA(e) {
	return !e || !e.some((e) => {
		let t = e.trim().toLowerCase();
		return t === "margin" || t.startsWith("margin-");
	});
}
function iA(e, t, n, r) {
	let { doc: i } = t.view.state;
	if (n?.enabled && r?.node && r.pos >= 0) {
		let e = r.pos, t = r.pos + r.node.nodeSize;
		return [{
			$from: i.resolve(e),
			$to: i.resolve(t)
		}];
	}
	let a = Qk({
		editor: t,
		x: e.clientX,
		y: e.clientY,
		direction: "right",
		nestedOptions: n
	});
	if (!a.resultNode || a.pos === null) return [];
	let o = a.resultNode.isText || a.resultNode.isAtom ? 0 : -1;
	return Nk(i.resolve(a.pos), i.resolve(a.pos + a.resultNode.nodeSize + o), 0, { extendOnBoundaryOverlap: !1 });
}
function aA(e, t, n, r, i) {
	let { view: a } = t;
	if (!e.dataTransfer) return;
	let { empty: o, $from: s, $to: c } = a.state.selection, l = iA(e, t, n, r), u = Nk(s, c, 0, { extendOnBoundaryOverlap: !1 }), d = u.some((e) => l.find((t) => t.$from === e.$from && t.$to === e.$to)), f = o || !d ? l : u;
	if (!f.length) return;
	let { tr: p } = a.state, m = document.createElement("div"), h = f[0].$from.pos, g = f[f.length - 1].$to.pos, _ = eA(a, h);
	m.setAttribute("dir", _);
	let v = n?.enabled && r?.node, y = f.length === 1, b, x;
	v && y ? (b = a.state.doc.slice(h, g), x = T.create(a.state.doc, h)) : (x = Fk.create(a.state.doc, h, g), b = x.content());
	let S = rA(i);
	f.forEach((e) => {
		let t = $k(a, e.$from.pos);
		if (!t) return;
		let n = Rk(t, i);
		S && (n.style.margin = "0"), m.append(n);
	}), m.style.position = "absolute", m.style.top = "-10000px", document.body.append(m), e.dataTransfer.clearData();
	let ee = nA(_, m.getBoundingClientRect().width);
	e.dataTransfer.setDragImage(m, ee, 0);
	let te = !1, ne = () => {
		te || (te = !0, tA(m), document.removeEventListener("drop", ne), document.removeEventListener("dragend", ne));
	}, re = x instanceof T ? x : void 0;
	a.dragging = {
		slice: b,
		move: !0,
		node: re
	}, p.setSelection(x), a.dispatch(p), document.addEventListener("drop", ne), document.addEventListener("dragend", ne);
}
var oA = (e, t) => {
	let n = e.resolve(t), { depth: r } = n;
	return r === 0 ? t : n.pos - n.parentOffset - 1;
}, sA = (e, t) => {
	let n = e.nodeAt(t), r = e.resolve(t), { depth: i } = r, a = n;
	for (; i > 0;) {
		let e = r.node(i);
		--i, i === 0 && (a = e);
	}
	return a;
};
function cA(e, t, n) {
	if (!t.docChanged) return e;
	if (n.isChangeOrigin && e.relativeAnchorPos != null) {
		let t = n.getAbsolutePos(e.relativeAnchorPos);
		return !Number.isFinite(t) || t <= 0 ? null : {
			...e,
			anchorPos: t
		};
	}
	let r = t.mapping.mapResult(e.anchorPos, 1);
	return r.deleted ? null : {
		...e,
		anchorPos: r.pos
	};
}
function lA(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i += 1) r += e.child(i).nodeSize;
	return r;
}
function uA(e) {
	return Ik(e) ? {
		anchorPos: e.from,
		nodeCount: e.ranges.length,
		depth: e.depth ?? 0
	} : null;
}
function dA(e, t, n, r) {
	let i = e.resolve(t), a = i.node(r), o = i.index(r);
	o >= a.childCount && (o = Math.max(0, a.childCount - n));
	let s = Math.min(n, a.childCount - o);
	if (s <= 0) return null;
	let c = i.start(r) + lA(a, 0, o);
	return {
		anchor: c,
		head: c + lA(a, o, o + s),
		count: s
	};
}
function fA(e, t, n, r) {
	try {
		let i = dA(e, t, n, r);
		if (!i) return null;
		let a = Fk.create(e, i.anchor, i.head, r);
		return a.ranges.length === n ? a : null;
	} catch {
		return null;
	}
}
var pA = (e, t) => {
	let n = Q.getState(e);
	return n ? dk(t, n.type, n.binding.mapping) : null;
}, mA = (e, t) => {
	let n = Q.getState(e);
	return n ? mk(n.doc, n.type, t, n.binding.mapping) || 0 : -1;
}, hA = (e, t) => {
	let n = t;
	for (; n?.parentNode && n.parentNode !== e.dom;) n = n.parentNode;
	return n;
}, gA = new D("dragHandle"), _A = ({ pluginKey: e = gA, element: t, editor: n, computePositionConfig: r, getReferencedVirtualElement: i, onNodeChange: a, onElementDragStart: o, onElementDragEnd: s, nestedOptions: c, dragImageProperties: l }) => {
	let u = document.createElement("div"), d = !1, f = null, p = -1, m, h = null, g = null, _ = null, v = null;
	function y() {
		_ = null, v = null;
	}
	function b(e, t) {
		v &&= cA(v, e, {
			isChangeOrigin: Tk(e),
			getAbsolutePos: (e) => mA(t, e)
		});
	}
	function x(e) {
		if (!v) return null;
		let t = fA(e.doc, v.anchorPos, v.nodeCount, v.depth);
		return t ? (y(), e.tr.setSelection(t)) : (v = null, _ = null, null);
	}
	function S() {
		t && (t.style.visibility = "hidden", t.style.pointerEvents = "none");
	}
	function ee() {
		if (t) {
			if (!n.isEditable) {
				S();
				return;
			}
			t.style.visibility = "", t.style.pointerEvents = "auto";
		}
	}
	function te(e) {
		Ib(i?.() || { getBoundingClientRect: () => e.getBoundingClientRect() }, t, r).then((e) => {
			Object.assign(t.style, {
				position: e.strategy,
				left: `${e.x}px`,
				top: `${e.y}px`
			});
		});
	}
	function ne(e) {
		o?.(e), aA(e, n, c, {
			node: f,
			pos: p
		}, l), _ = uA(n.state.selection), t && (t.dataset.dragging = "true"), setTimeout(() => {
			t && (t.style.pointerEvents = "none");
		}, 0);
	}
	function re(e) {
		s?.(e), _ = null, S(), t && (t.style.pointerEvents = "auto", t.dataset.dragging = "false");
	}
	function ie(e) {
		if (!e.target || !n.view.dom.contains(e.target)) return;
		if (sd()) {
			let e = n.view.dom;
			requestAnimationFrame(() => {
				e.isContentEditable && (e.contentEditable = "false", e.contentEditable = "true");
			});
		}
		if (!_ || n.view.state.selection.empty) return;
		let t = n.state.selection.from, r = pA(n.state, t);
		v = {
			..._,
			anchorPos: t,
			relativeAnchorPos: r ?? void 0
		}, n.view.dispatch(n.state.tr.setMeta("addToHistory", !1));
	}
	function ae() {
		t.removeEventListener("dragstart", ne), t.removeEventListener("dragend", re), document.removeEventListener("drop", ie), h && (cancelAnimationFrame(h), h = null, g = null), y();
	}
	return u.appendChild(t), {
		unbind() {
			ae();
		},
		plugin: new E({
			key: typeof e == "string" ? new D(e) : e,
			state: {
				init() {
					return { locked: !1 };
				},
				apply(e, r, i, o) {
					b(e, o);
					let s = e.getMeta("lockDragHandle"), c = e.getMeta("hideDragHandle");
					if (s !== void 0 && (d = s), c) return S(), d = !1, f = null, p = -1, a?.({
						editor: n,
						node: null,
						pos: -1
					}), r;
					if (e.docChanged && p !== -1 && t) if (Tk(e)) {
						let e = mA(o, m);
						e !== p && (p = e);
					} else {
						let t = e.mapping.map(p);
						t !== p && (p = t, m = pA(o, p));
					}
					return r;
				}
			},
			appendTransaction(e, t, n) {
				return x(n);
			},
			view: (e) => (t.draggable = !0, t.style.pointerEvents = "auto", t.dataset.dragging = "false", n.view.dom.parentElement?.appendChild(u), u.style.pointerEvents = "none", u.style.position = "absolute", u.style.top = "0", u.style.left = "0", u.style.zIndex = "10", t.addEventListener("dragstart", ne), t.addEventListener("dragend", re), document.addEventListener("drop", ie), {
				update(r, i) {
					if (!t) return;
					if (!n.isEditable) {
						S();
						return;
					}
					if (d ? t.draggable = !1 : t.draggable = !0, e.state.doc.eq(i.doc) || p === -1) return;
					let o = e.nodeDOM(p);
					if (o = hA(e, o), o === e.dom || o?.nodeType !== 1) return;
					let s = e.posAtDOM(o, 0), c = sA(n.state.doc, s), l = oA(n.state.doc, s);
					f = c, p = l, m = pA(e.state, p), a?.({
						editor: n,
						node: f,
						pos: p
					}), te(o);
				},
				destroy() {
					ae(), t && tA(u);
				}
			}),
			props: { handleDOMEvents: {
				keydown(e) {
					return !t || d ? !1 : e.hasFocus() ? (S(), f = null, p = -1, a?.({
						editor: n,
						node: null,
						pos: -1
					}), !1) : !1;
				},
				mouseleave(e, t) {
					return d || t.target && !u.contains(t.relatedTarget) && (S(), f = null, p = -1, a?.({
						editor: n,
						node: null,
						pos: -1
					})), !1;
				},
				mousemove(e, r) {
					return !t || d || (g = {
						x: r.clientX,
						y: r.clientY
					}, h) || (h = requestAnimationFrame(() => {
						if (h = null, !g) return;
						let { x: t, y: r } = g;
						g = null;
						let i = Qk({
							x: t,
							y: r,
							direction: "right",
							editor: n,
							nestedOptions: c
						});
						if (!i.resultElement) return;
						let o = i.resultElement, s = i.resultNode, l = i.pos;
						if (!c?.enabled) {
							if (o = hA(e, o), o === e.dom || o?.nodeType !== 1) return;
							let t = e.posAtDOM(o, 0);
							s = sA(n.state.doc, t), l = oA(n.state.doc, t);
						}
						s !== f && (f = s, p = l ?? -1, m = pA(e.state, p), a?.({
							editor: n,
							node: f,
							pos: p
						}), te(o), ee());
					})), !1;
				}
			} }
		})
	};
};
function vA(e) {
	return e === !1 || e === void 0 ? {
		enabled: !1,
		rules: [],
		defaultRules: !0,
		allowedContainers: void 0,
		edgeDetection: Vk("none")
	} : e === !0 ? {
		enabled: !0,
		rules: [],
		defaultRules: !0,
		allowedContainers: void 0,
		edgeDetection: Vk("left")
	} : {
		enabled: !0,
		rules: e.rules ?? [],
		defaultRules: e.defaultRules ?? !0,
		allowedContainers: e.allowedContainers,
		edgeDetection: Vk(e.edgeDetection)
	};
}
var yA = {
	placement: "left-start",
	strategy: "absolute"
}, bA = N.create({
	name: "dragHandle",
	addOptions() {
		return {
			render() {
				let e = document.createElement("div");
				return e.classList.add("drag-handle"), e;
			},
			computePositionConfig: {},
			locked: !1,
			onNodeChange: () => null,
			onElementDragStart: void 0,
			onElementDragEnd: void 0,
			nested: !1,
			dragImageProperties: void 0
		};
	},
	addCommands() {
		return {
			lockDragHandle: () => ({ editor: e }) => (this.options.locked = !0, e.commands.setMeta("lockDragHandle", this.options.locked)),
			unlockDragHandle: () => ({ editor: e }) => (this.options.locked = !1, e.commands.setMeta("lockDragHandle", this.options.locked)),
			toggleDragHandle: () => ({ editor: e }) => (this.options.locked = !this.options.locked, e.commands.setMeta("lockDragHandle", this.options.locked))
		};
	},
	addProseMirrorPlugins() {
		let e = this.options.render(), t = vA(this.options.nested);
		return [_A({
			computePositionConfig: {
				...yA,
				...this.options.computePositionConfig
			},
			getReferencedVirtualElement: this.options.getReferencedVirtualElement,
			element: e,
			editor: this.editor,
			onNodeChange: this.options.onNodeChange,
			onElementDragStart: this.options.onElementDragStart,
			onElementDragEnd: this.options.onElementDragEnd,
			nestedOptions: t,
			dragImageProperties: this.options.dragImageProperties
		}).plugin];
	}
}), xA = [
	{
		title: "Text",
		desc: "Plain paragraph",
		icon: "Aa",
		run: (e) => e.chain().focus().clearNodes().setParagraph().run()
	},
	{
		title: "Heading 1",
		desc: "Large heading",
		icon: "H1",
		run: (e) => e.chain().focus().clearNodes().toggleHeading({ level: 1 }).run()
	},
	{
		title: "Heading 2",
		desc: "Medium heading",
		icon: "H2",
		run: (e) => e.chain().focus().clearNodes().toggleHeading({ level: 2 }).run()
	},
	{
		title: "Heading 3",
		desc: "Small heading",
		icon: "H3",
		run: (e) => e.chain().focus().clearNodes().toggleHeading({ level: 3 }).run()
	},
	{
		title: "Bullet List",
		desc: "Unordered items",
		icon: "•",
		run: (e) => e.chain().focus().clearNodes().toggleBulletList().run()
	},
	{
		title: "Numbered List",
		desc: "Ordered items",
		icon: "1.",
		run: (e) => e.chain().focus().clearNodes().toggleOrderedList().run()
	},
	{
		title: "Task List",
		desc: "Checklist",
		icon: "☑",
		run: (e) => e.chain().focus().clearNodes().toggleTaskList().run()
	},
	{
		title: "Quote",
		desc: "Blockquote",
		icon: "\"",
		run: (e) => e.chain().focus().clearNodes().toggleBlockquote().run()
	},
	{
		title: "Code Block",
		desc: "Code fence",
		icon: "</>",
		run: (e) => e.chain().focus().clearNodes().toggleCodeBlock().run()
	},
	{
		title: "Divider",
		desc: "Horizontal rule",
		icon: "—",
		run: (e) => e.chain().focus().setHorizontalRule().run()
	},
	{
		title: "Image",
		desc: "Upload an image",
		icon: "🖼️",
		run: (e) => {
			zA(e);
		}
	},
	{
		title: "Callout",
		desc: "Colored callout",
		icon: "📌",
		run: (e) => e.chain().focus().clearNodes().setCallout().run()
	}
], SA = rf.create({
	name: "callout",
	content: "block+",
	group: "block",
	defining: !0,
	addAttributes() {
		return { type: { default: "info" } };
	},
	parseHTML() {
		return [{ tag: "div[data-callout]" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		let t = e.type || "info", n = {
			info: "ℹ️",
			warning: "⚠️",
			success: "✅",
			error: "❌"
		}[t] || "📌";
		return [
			"div",
			{
				"data-callout": "",
				"data-type": t,
				class: "callout callout--" + t
			},
			[
				"div",
				{ class: "callout-icon" },
				n
			],
			[
				"div",
				{ class: "callout-content" },
				0
			]
		];
	},
	addCommands() {
		return { setCallout: (e = {}) => ({ commands: t }) => t.wrapIn(this.name, e) };
	},
	addInputRules() {
		return [{
			find: /^> \[!(\w+)\]\s$/,
			handler: ({ range: e, match: t }) => (t[1], e.from + e.text.length)
		}];
	}
}), CA = null;
function wA() {
	return CA || (CA = document.createElement("input"), CA.type = "file", CA.accept = "image/*", CA.style.cssText = "display:none", document.body.appendChild(CA), CA);
}
async function TA(e) {
	let t = new FormData();
	t.append("file", e);
	try {
		let e = await fetch("/api/upload", {
			method: "POST",
			body: t
		});
		if (!e.ok) throw Error("Upload failed");
		return (await e.json()).url;
	} catch (e) {
		return console.error("Upload error:", e), null;
	}
}
var $ = null, EA = !1, DA = 0, OA = -1, kA = "", AA = null;
function jA(e, t) {
	let n = e.resolve(t);
	if (!n) return "";
	try {
		return e.textBetween(n.start(), t);
	} catch {
		return "";
	}
}
function MA() {
	let e = $?.querySelector(".slash-item.active");
	e && e.scrollIntoView({ block: "nearest" });
}
function NA() {
	if (!$) return;
	let e = kA.toLowerCase(), t = xA.filter((t) => t.title.toLowerCase().includes(e) || t.desc.toLowerCase().includes(e));
	$.innerHTML = t.map((e, t) => `<button class="slash-item${t === DA ? " active" : ""}" data-idx="${t}"><span class="slash-icon">${e.icon}</span><span class="slash-text"><strong>${e.title}</strong><span class="slash-desc">${e.desc}</span></span></button>`).join(""), $.querySelectorAll(".slash-item").forEach((e) => {
		let t = parseInt(e.dataset.idx, 10);
		isNaN(t) || (e.onclick = (e) => {
			e.stopPropagation(), DA = t, LA();
		}, e.onmouseenter = () => {
			DA = t, NA();
		});
	}), MA();
}
function PA() {
	$ && ($.style.display = "none", $.innerHTML = ""), EA = !1, OA = -1, kA = "", AA = null;
}
function FA(e) {
	AA = e;
	let { view: t, state: n } = e, { from: r } = n.selection;
	OA = n.doc.resolve(r).start(), $ || ($ = document.createElement("div"), $.className = "slash-menu", $.style.cssText = "position:fixed;z-index:100000;", document.body.appendChild($));
	let i = t.coordsAtPos(r);
	$.style.left = Math.max(0, i.left) + "px", $.style.top = i.bottom + 4 + "px", $.style.display = "block", DA = 0, kA = "", EA = !0, NA();
}
function IA(e) {
	if (!e) return;
	let { doc: t, selection: n } = e.state, { $from: r } = n;
	if (r.parent.type.name === "codeBlock") {
		EA && PA();
		return;
	}
	if (!e.isFocused) return;
	let i = r.pos, a = jA(t, i);
	if (a === "/" && !EA) {
		FA(e);
		return;
	}
	if (EA) if (a.startsWith("/")) {
		let e = a.slice(1);
		e !== kA && (kA = e, DA = 0, NA());
	} else PA();
}
function LA() {
	if (!EA || !$) return;
	let e = xA.filter((e) => e.title.toLowerCase().includes(kA) || e.desc.toLowerCase().includes(kA))[DA];
	if (!e) {
		PA();
		return;
	}
	let t = AA;
	if (!t) {
		PA();
		return;
	}
	let { view: n } = t, r = n.state.selection.from, i = OA;
	PA();
	try {
		n.dispatch(n.state.tr.delete(i, r)), e.run(t), t.commands.focus();
	} catch (e) {
		console.error("runSlashItem error:", e);
	}
}
var RA = /* @__PURE__ */ new Map();
function zA(e) {
	let t = wA();
	t.onchange = async () => {
		let n = t.files?.[0];
		if (!n) return;
		let r = await TA(n);
		r && e.chain().focus().setImage({ src: r }).run(), t.value = "";
	}, t.click();
}
function BA() {
	return (e, t) => {
		if (!EA) return !1;
		let n = xA.filter((e) => e.title.toLowerCase().includes(kA) || e.desc.toLowerCase().includes(kA));
		if (!n.length && ![
			"ArrowDown",
			"ArrowUp",
			"Enter",
			"Tab",
			"Escape"
		].includes(t.key)) return !1;
		switch (t.key) {
			case "ArrowDown": return n.length ? (t.preventDefault(), DA = (DA + 1) % n.length, NA(), !0) : !0;
			case "ArrowUp": return n.length ? (t.preventDefault(), DA = (DA - 1 + n.length) % n.length, NA(), !0) : !0;
			case "Enter":
			case "Tab": return t.preventDefault(), LA(), !0;
			case "Escape": return t.preventDefault(), PA(), !0;
			default: return !1;
		}
	};
}
function VA(e, t, ...n) {
	if (e) try {
		e.invokeMethodAsync(t, ...n).catch(() => {});
	} catch {}
}
function HA(e, t, n, r) {
	UA(e);
	let i = document.getElementById(e);
	if (!i) return null;
	let a = {
		dotNetRef: n,
		blockId: r,
		firstUpdate: !0,
		editor: null,
		listeners: []
	}, o = new Xd({
		element: i,
		extensions: [
			w_.configure({
				codeBlock: !0,
				heading: { levels: [
					1,
					2,
					3
				] }
			}),
			mg,
			$m.configure({
				openOnClick: !0,
				autolink: !1,
				HTMLAttributes: { class: "wiki-link" }
			}),
			E_.configure({
				inline: !1,
				allowBase64: !0,
				HTMLAttributes: { class: "editor-image" }
			}),
			D_,
			O_.configure({ nested: !0 }),
			by.configure({ placeholder: "Type '/' for commands…" }),
			yy.configure({ html: !1 }),
			bA.configure({
				nested: !0,
				render() {
					let e = document.createElement("div");
					return e.classList.add("drag-handle"), e.innerHTML = "⠿", e.title = "Drag to reorder", e;
				}
			}),
			SA
		],
		content: t || "",
		contentType: "markdown",
		editorProps: {
			attributes: {
				class: "tiptap-editor",
				"data-block-id": r
			},
			handleKeyDown: BA(),
			handlePaste(e, t) {
				let n = t.clipboardData?.files;
				if (n && n[0]?.type.startsWith("image/")) return t.preventDefault(), TA(n[0]).then((t) => {
					t && e.dispatch(e.state.tr.replaceSelectionWith(e.state.schema.nodes.image.create(null, { src: t })));
				}), !0;
				let r = t.clipboardData?.getData("text/plain");
				return r && /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(r.trim()) ? (t.preventDefault(), e.dispatch(e.state.tr.replaceSelectionWith(e.state.schema.nodes.image.create(null, { src: r.trim() }))), !0) : !1;
			},
			handleDrop(e, t) {
				let n = t.dataTransfer?.files;
				if (n && n[0]?.type.startsWith("image/")) {
					t.preventDefault();
					let r = e.posAtCoords({
						left: t.clientX,
						top: t.clientY
					});
					return r && TA(n[0]).then((t) => {
						t && e.dispatch(e.state.tr.insert(r.pos, e.state.schema.nodes.image.create(null, { src: t })));
					}), !0;
				}
				return !1;
			}
		},
		onUpdate: ({ editor: e }) => {
			if (a.firstUpdate) {
				a.firstUpdate = !1;
				return;
			}
			VA(a.dotNetRef, "OnMarkdownChanged", a.blockId, e.getMarkdown()), IA(e);
		},
		onSelectionUpdate: ({ editor: e }) => {
			EA && IA(e);
		},
		onFocus: () => VA(a.dotNetRef, "OnFocus", a.blockId),
		onBlur: () => {
			EA && PA(), VA(a.dotNetRef, "OnBlur", a.blockId);
		}
	});
	a.editor = o;
	let s = document.getElementById("btn-upload-image");
	if (s) {
		let t = wA();
		t.onchange = async () => {
			let n = t.files?.[0];
			if (!n) return;
			let r = RA.get(e)?.editor;
			if (!r) return;
			let i = await TA(n);
			i && r.chain().focus().setImage({ src: i }).run(), t.value = "";
		}, s.onclick = () => t.click();
	}
	let c = function(e) {
		EA && $ && !$.contains(e.target) && !i.contains(e.target) && PA();
	};
	return document.addEventListener("mousedown", c), a.listeners.push({
		type: "mousedown",
		handler: c
	}), RA.set(e, a), o;
}
function UA(e) {
	let t = RA.get(e);
	t && (t.listeners.forEach((e) => document.removeEventListener(e.type, e.handler)), t.listeners = [], t.dotNetRef = null, t.editor &&= (t.editor.destroy(), null), RA.delete(e));
}
function WA(e) {
	return RA.get(e)?.editor?.getMarkdown() ?? "";
}
function GA(e, t) {
	RA.get(e)?.editor?.commands.setContent(t, !1, "markdown");
}
function KA(e, t) {
	RA.get(e)?.editor?.setEditable(t);
}
function qA(e) {
	RA.get(e)?.editor?.commands.focus();
}
function JA(e) {
	RA.get(e)?.editor?.commands.blur();
}
window.initTipTap = HA, window.destroyTipTap = UA, window.getTipTapMarkdown = WA, window.setTipTapContent = GA, window.setTipTapEditable = KA, window.focusTipTap = qA, window.blurTipTap = JA;
//#endregion
export { JA as blurEditor, HA as createEditor, UA as destroyEditor, qA as focusEditor, WA as getMarkdown, GA as setContent, KA as setEditable };
