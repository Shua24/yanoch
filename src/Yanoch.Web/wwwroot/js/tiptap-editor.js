//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n));
//#endregion
//#region node_modules/orderedmap/dist/index.js
function l(e) {
	this.content = e;
}
l.prototype = {
	constructor: l,
	find: function(e) {
		for (var t = 0; t < this.content.length; t += 2) if (this.content[t] === e) return t;
		return -1;
	},
	get: function(e) {
		var t = this.find(e);
		return t == -1 ? void 0 : this.content[t + 1];
	},
	update: function(e, t, n) {
		var r = n && n != e ? this.remove(n) : this, i = r.find(e), a = r.content.slice();
		return i == -1 ? a.push(n || e, t) : (a[i + 1] = t, n && (a[i] = n)), new l(a);
	},
	remove: function(e) {
		var t = this.find(e);
		if (t == -1) return this;
		var n = this.content.slice();
		return n.splice(t, 2), new l(n);
	},
	addToStart: function(e, t) {
		return new l([e, t].concat(this.remove(e).content));
	},
	addToEnd: function(e, t) {
		var n = this.remove(e).content.slice();
		return n.push(e, t), new l(n);
	},
	addBefore: function(e, t, n) {
		var r = this.remove(t), i = r.content.slice(), a = r.find(e);
		return i.splice(a == -1 ? i.length : a, 0, t, n), new l(i);
	},
	forEach: function(e) {
		for (var t = 0; t < this.content.length; t += 2) e(this.content[t], this.content[t + 1]);
	},
	prepend: function(e) {
		return e = l.from(e), e.size ? new l(e.content.concat(this.subtract(e).content)) : this;
	},
	append: function(e) {
		return e = l.from(e), e.size ? new l(this.subtract(e).content.concat(e.content)) : this;
	},
	subtract: function(e) {
		var t = this;
		e = l.from(e);
		for (var n = 0; n < e.content.length; n += 2) t = t.remove(e.content[n]);
		return t;
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
}, l.from = function(e) {
	if (e instanceof l) return e;
	var t = [];
	if (e) for (var n in e) t.push(n, e[n]);
	return new l(t);
};
//#endregion
//#region node_modules/prosemirror-model/dist/index.js
function u(e, t, n) {
	for (let r = 0;; r++) {
		if (r == e.childCount || r == t.childCount) return e.childCount == t.childCount ? null : n;
		let i = e.child(r), a = t.child(r);
		if (i == a) {
			n += i.nodeSize;
			continue;
		}
		if (!i.sameMarkup(a)) return n;
		if (i.isText && i.text != a.text) {
			let e = i.text, t = a.text, r = 0;
			for (; e[r] == t[r]; r++) n++;
			return r && r < e.length && r < t.length && p(e.charCodeAt(r - 1)) && f(e.charCodeAt(r)) && n--, n;
		}
		if (i.content.size || a.content.size) {
			let e = u(i.content, a.content, n + 1);
			if (e != null) return e;
		}
		n += i.nodeSize;
	}
}
function d(e, t, n, r) {
	for (let i = e.childCount, a = t.childCount;;) {
		if (i == 0 || a == 0) return i == a ? null : {
			a: n,
			b: r
		};
		let o = e.child(--i), s = t.child(--a), c = o.nodeSize;
		if (o == s) {
			n -= c, r -= c;
			continue;
		}
		if (!o.sameMarkup(s)) return {
			a: n,
			b: r
		};
		if (o.isText && o.text != s.text) {
			let e = o.text, t = s.text, i = e.length, a = t.length;
			for (; i > 0 && a > 0 && e[i - 1] == t[a - 1];) i--, a--, n--, r--;
			return i && a && i < e.length && p(e.charCodeAt(i - 1)) && f(e.charCodeAt(i)) && (n++, r++), {
				a: n,
				b: r
			};
		}
		if (o.content.size || s.content.size) {
			let e = d(o.content, s.content, n - 1, r - 1);
			if (e) return e;
		}
		n -= c, r -= c;
	}
}
function f(e) {
	return e >= 56320 && e < 57344;
}
function p(e) {
	return e >= 55296 && e < 56320;
}
var m = class e {
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
	findDiffStart(e, t = 0) {
		return u(this, e, t);
	}
	findDiffEnd(e, t = this.size, n = e.size) {
		return d(this, e, t, n);
	}
	findIndex(e) {
		if (e == 0) return g(0, e);
		if (e == this.size) return g(this.content.length, e);
		if (e > this.size || e < 0) throw RangeError(`Position ${e} outside of fragment (${this})`);
		for (let t = 0, n = 0;; t++) {
			let r = this.child(t), i = n + r.nodeSize;
			if (i >= e) return i == e ? g(t + 1, i) : g(t, n);
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
m.empty = new m([], 0);
var h = {
	index: 0,
	offset: 0
};
function g(e, t) {
	return h.index = e, h.offset = t, h;
}
function _(e, t) {
	if (e === t) return !0;
	if (!(e && typeof e == "object") || !(t && typeof t == "object")) return !1;
	let n = Array.isArray(e);
	if (Array.isArray(t) != n) return !1;
	if (n) {
		if (e.length != t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!_(e[n], t[n])) return !1;
	} else {
		for (let n in e) if (!(n in t) || !_(e[n], t[n])) return !1;
		for (let n in t) if (!(n in e)) return !1;
	}
	return !0;
}
var v = class e {
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
		return this == e || this.type == e.type && _(this.attrs, e.attrs);
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
v.none = [];
var y = class extends Error {}, b = class e {
	constructor(e, t, n) {
		this.content = e, this.openStart = t, this.openEnd = n;
	}
	get size() {
		return this.content.size - this.openStart - this.openEnd;
	}
	insertAt(t, n) {
		let r = S(this.content, t + this.openStart, n, this.openStart + 1, this.openEnd + 1);
		return r && new e(r, this.openStart, this.openEnd);
	}
	removeBetween(t, n) {
		return new e(x(this.content, t + this.openStart, n + this.openStart), this.openStart, this.openEnd);
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
		return new e(m.fromJSON(t, n.content), r, i);
	}
	static maxOpen(t, n = !0) {
		let r = 0, i = 0;
		for (let e = t.firstChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.firstChild) r++;
		for (let e = t.lastChild; e && !e.isLeaf && (n || !e.type.spec.isolating); e = e.lastChild) i++;
		return new e(t, r, i);
	}
};
b.empty = new b(m.empty, 0, 0);
function x(e, t, n) {
	let { index: r, offset: i } = e.findIndex(t), a = e.maybeChild(r), { index: o, offset: s } = e.findIndex(n);
	if (i == t || a.isText) {
		if (s != n && !e.child(o).isText) throw RangeError("Removing non-flat range");
		return e.cut(0, t).append(e.cut(n));
	}
	if (r != o) throw RangeError("Removing non-flat range");
	return e.replaceChild(r, a.copy(x(a.content, t - i - 1, n - i - 1)));
}
function S(e, t, n, r, i, a) {
	let { index: o, offset: s } = e.findIndex(t), c = e.maybeChild(o);
	if (s == t || c.isText) return a && r <= 0 && i <= 0 && !a.canReplace(o, o, n) ? null : e.cut(0, t).append(n).append(e.cut(t));
	let l = S(c.content, t - s - 1, n, o == 0 ? r - 1 : 0, o == e.childCount - 1 ? i - 1 : 0, c);
	return l && e.replaceChild(o, c.copy(l));
}
function ee(e, t, n) {
	if (n.openStart > e.depth) throw new y("Inserted content deeper than insertion position");
	if (e.depth - n.openStart != t.depth - n.openEnd) throw new y("Inconsistent open depths");
	return te(e, t, n, 0);
}
function te(e, t, n, r) {
	let i = e.index(r), a = e.node(r);
	if (i == t.index(r) && r < e.depth - n.openStart) {
		let o = te(e, t, n, r + 1);
		return a.copy(a.content.replaceChild(i, o));
	} else if (!n.content.size) return ie(a, ae(e, t, r));
	else if (!n.openStart && !n.openEnd && e.depth == r && t.depth == r) {
		let r = e.parent, i = r.content;
		return ie(r, i.cut(0, e.parentOffset).append(n.content).append(i.cut(t.parentOffset)));
	} else {
		let { start: i, end: o } = E(n, e);
		return ie(a, T(e, i, o, t, r));
	}
}
function C(e, t) {
	if (!t.type.compatibleContent(e.type)) throw new y("Cannot join " + t.type.name + " onto " + e.type.name);
}
function ne(e, t, n) {
	let r = e.node(n);
	return C(r, t.node(n)), r;
}
function w(e, t) {
	let n = t.length - 1;
	n >= 0 && e.isText && e.sameMarkup(t[n]) ? t[n] = e.withText(t[n].text + e.text) : t.push(e);
}
function re(e, t, n, r) {
	let i = (t || e).node(n), a = 0, o = t ? t.index(n) : i.childCount;
	e && (a = e.index(n), e.depth > n ? a++ : e.textOffset && (w(e.nodeAfter, r), a++));
	for (let e = a; e < o; e++) w(i.child(e), r);
	t && t.depth == n && t.textOffset && w(t.nodeBefore, r);
}
function ie(e, t) {
	if (!e.type.validContent(t)) throw new y("Invalid content for node " + e.type.name);
	return e.copy(t);
}
function T(e, t, n, r, i) {
	let a = e.depth > i && ne(e, t, i + 1), o = r.depth > i && ne(n, r, i + 1), s = [];
	return re(null, e, i, s), a && o && t.index(i) == n.index(i) ? (C(a, o), w(ie(a, T(e, t, n, r, i + 1)), s)) : (a && w(ie(a, ae(e, t, i + 1)), s), re(t, n, i, s), o && w(ie(o, ae(n, r, i + 1)), s)), re(r, null, i, s), new m(s);
}
function ae(e, t, n) {
	let r = [];
	return re(null, e, n, r), e.depth > n && w(ie(ne(e, t, n + 1), ae(e, t, n + 1)), r), re(t, null, n, r), new m(r);
}
function E(e, t) {
	let n = t.depth - e.openStart, r = t.node(n).copy(e.content);
	for (let e = n - 1; e >= 0; e--) r = t.node(e).copy(m.from(r));
	return {
		start: r.resolveNoCache(e.openStart + n),
		end: r.resolveNoCache(r.content.size - e.openEnd - n)
	};
}
var oe = class e {
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
		if (e.content.size == 0) return v.none;
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
		for (let n = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); n >= 0; n--) if (e.pos <= this.end(n) && (!t || t(this.node(n)))) return new le(this, e, n);
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
		let r = ce.get(t);
		if (r) for (let e = 0; e < r.elts.length; e++) {
			let t = r.elts[e];
			if (t.pos == n) return t;
		}
		else ce.set(t, r = new D());
		let i = r.elts[r.i] = e.resolve(t, n);
		return r.i = (r.i + 1) % se, i;
	}
}, D = class {
	constructor() {
		this.elts = [], this.i = 0;
	}
}, se = 12, ce = /* @__PURE__ */ new WeakMap(), le = class {
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
}, ue = Object.create(null), de = class e {
	constructor(e, t, n, r = v.none) {
		this.type = e, this.attrs = t, this.marks = r, this.content = n || m.empty;
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
		return this.type == e && _(this.attrs, t || e.defaultAttrs || ue) && v.sameSet(this.marks, n || v.none);
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
		if (e == t) return b.empty;
		let r = this.resolve(e), i = this.resolve(t), a = n ? 0 : r.sharedDepth(t), o = r.start(a);
		return new b(r.node(a).content.cut(r.pos - o, i.pos - o), r.depth - a, i.depth - a);
	}
	replace(e, t, n) {
		return ee(this.resolve(e), this.resolve(t), n);
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
		return oe.resolveCached(this, e);
	}
	resolveNoCache(e) {
		return oe.resolve(this, e);
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
		return this.content.size && (e += "(" + this.content.toStringInner() + ")"), pe(this.marks, e);
	}
	contentMatchAt(e) {
		let t = this.type.contentMatch.matchFragment(this.content, 0, e);
		if (!t) throw Error("Called contentMatchAt on a node with invalid content");
		return t;
	}
	canReplace(e, t, n = m.empty, r = 0, i = n.childCount) {
		let a = this.contentMatchAt(e).matchFragment(n, r, i), o = a && a.matchFragment(this.content, t);
		if (!o || !o.validEnd) return !1;
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
		let e = v.none;
		for (let t = 0; t < this.marks.length; t++) {
			let n = this.marks[t];
			n.type.checkAttrs(n.attrs), e = n.addToSet(e);
		}
		if (!v.sameSet(e, this.marks)) throw RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((e) => e.type.name)}`);
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
		let r = m.fromJSON(e, t.content), i = e.nodeType(t.type).create(t.attrs, r, n);
		return i.type.checkAttrs(i.attrs), i;
	}
};
de.prototype.text = void 0;
var fe = class e extends de {
	constructor(e, t, n, r) {
		if (super(e, t, null, r), !n) throw RangeError("Empty text nodes are not allowed");
		this.text = n;
	}
	toString() {
		return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : pe(this.marks, JSON.stringify(this.text));
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
function pe(e, t) {
	for (let n = e.length - 1; n >= 0; n--) t = e[n].type.name + "(" + t + ")";
	return t;
}
var me = class e {
	constructor(e) {
		this.validEnd = e, this.next = [], this.wrapCache = [];
	}
	static parse(t, n) {
		let r = new he(t, n);
		if (r.next == null) return e.empty;
		let i = ge(r);
		r.next && r.err("Unexpected trailing text");
		let a = Ee(Ce(i));
		return De(a, r), a;
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
		function i(a, o) {
			let s = a.matchFragment(e, n);
			if (s && (!t || s.validEnd)) return m.from(o.map((e) => e.createAndFill()));
			for (let e = 0; e < a.next.length; e++) {
				let { type: t, next: n } = a.next[e];
				if (!(t.isText || t.hasRequiredAttrs()) && r.indexOf(n) == -1) {
					r.push(n);
					let e = i(n, o.concat(t));
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
me.empty = new me(!0);
var he = class {
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
function ge(e) {
	let t = [];
	do
		t.push(_e(e));
	while (e.eat("|"));
	return t.length == 1 ? t[0] : {
		type: "choice",
		exprs: t
	};
}
function _e(e) {
	let t = [];
	do
		t.push(ve(e));
	while (e.next && e.next != ")" && e.next != "|");
	return t.length == 1 ? t[0] : {
		type: "seq",
		exprs: t
	};
}
function ve(e) {
	let t = Se(e);
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
	else if (e.eat("{")) t = be(e, t);
	else break;
	return t;
}
function ye(e) {
	/\D/.test(e.next) && e.err("Expected number, got '" + e.next + "'");
	let t = Number(e.next);
	return e.pos++, t;
}
function be(e, t) {
	let n = ye(e), r = n;
	return e.eat(",") && (r = e.next == "}" ? -1 : ye(e)), e.eat("}") || e.err("Unclosed braced range"), {
		type: "range",
		min: n,
		max: r,
		expr: t
	};
}
function xe(e, t) {
	let n = e.nodeTypes, r = n[t];
	if (r) return [r];
	let i = [];
	for (let e in n) {
		let r = n[e];
		r.isInGroup(t) && i.push(r);
	}
	return i.length == 0 && e.err("No node type or group '" + t + "' found"), i;
}
function Se(e) {
	if (e.eat("(")) {
		let t = ge(e);
		return e.eat(")") || e.err("Missing closing paren"), t;
	} else if (/\W/.test(e.next)) e.err("Unexpected token '" + e.next + "'");
	else {
		let t = xe(e, e.next).map((t) => (e.inline == null ? e.inline = t.isInline : e.inline != t.isInline && e.err("Mixing inline and block content"), {
			type: "name",
			value: t
		}));
		return e.pos++, t.length == 1 ? t[0] : {
			type: "choice",
			exprs: t
		};
	}
}
function Ce(e) {
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
function we(e, t) {
	return t - e;
}
function Te(e, t) {
	let n = [];
	return r(t), n.sort(we);
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
function Ee(e) {
	let t = Object.create(null);
	return n(Te(e, 0));
	function n(r) {
		let i = [];
		r.forEach((t) => {
			e[t].forEach(({ term: t, to: n }) => {
				if (!t) return;
				let r;
				for (let e = 0; e < i.length; e++) i[e][0] == t && (r = i[e][1]);
				Te(e, n).forEach((e) => {
					r || i.push([t, r = []]), r.indexOf(e) == -1 && r.push(e);
				});
			});
		});
		let a = t[r.join(",")] = new me(r.indexOf(e.length - 1) > -1);
		for (let e = 0; e < i.length; e++) {
			let r = i[e][1].sort(we);
			a.next.push({
				type: i[e][0],
				next: t[r.join(",")] || n(r)
			});
		}
		return a;
	}
}
function De(e, t) {
	for (let n = 0, r = [e]; n < r.length; n++) {
		let e = r[n], i = !e.validEnd, a = [];
		for (let t = 0; t < e.next.length; t++) {
			let { type: n, next: o } = e.next[t];
			a.push(n.name), i && !(n.isText || n.hasRequiredAttrs()) && (i = !1), r.indexOf(o) == -1 && r.push(o);
		}
		i && t.err("Only non-generatable nodes (" + a.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
	}
}
function Oe(e) {
	let t = Object.create(null);
	for (let n in e) {
		let r = e[n];
		if (!r.hasDefault) return null;
		t[n] = r.default;
	}
	return t;
}
function ke(e, t) {
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
function Ae(e, t, n, r) {
	for (let i in t) if (!(i in e)) throw RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);
	for (let n in e) e[n].validate && e[n].validate(t[n]);
}
function je(e, t) {
	let n = Object.create(null);
	if (t) for (let r in t) n[r] = new Pe(e, r, t[r]);
	return n;
}
var Me = class e {
	constructor(e, t, n) {
		this.name = e, this.schema = t, this.spec = n, this.markSet = null, this.groups = n.group ? n.group.split(" ") : [], this.attrs = je(e, n.attrs), this.defaultAttrs = Oe(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(n.inline || e == "text"), this.isText = e == "text";
	}
	get isInline() {
		return !this.isBlock;
	}
	get isTextblock() {
		return this.isBlock && this.inlineContent;
	}
	get isLeaf() {
		return this.contentMatch == me.empty;
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
		return !e && this.defaultAttrs ? this.defaultAttrs : ke(this.attrs, e);
	}
	create(e = null, t, n) {
		if (this.isText) throw Error("NodeType.create can't construct text nodes");
		return new de(this, this.computeAttrs(e), m.from(t), v.setFrom(n));
	}
	createChecked(e = null, t, n) {
		return t = m.from(t), this.checkContent(t), new de(this, this.computeAttrs(e), t, v.setFrom(n));
	}
	createAndFill(e = null, t, n) {
		if (e = this.computeAttrs(e), t = m.from(t), t.size) {
			let e = this.contentMatch.fillBefore(t);
			if (!e) return null;
			t = e.append(t);
		}
		let r = this.contentMatch.matchFragment(t), i = r && r.fillBefore(m.empty, !0);
		return i ? new de(this, e, t.append(i), v.setFrom(n)) : null;
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
		Ae(this.attrs, e, "node", this.name);
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
		return t ? t.length ? t : v.none : e;
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
function Ne(e, t, n) {
	let r = n.split("|");
	return (n) => {
		let i = n === null ? "null" : typeof n;
		if (r.indexOf(i) < 0) throw RangeError(`Expected value of type ${r} for attribute ${t} on type ${e}, got ${i}`);
	};
}
var Pe = class {
	constructor(e, t, n) {
		this.hasDefault = Object.prototype.hasOwnProperty.call(n, "default"), this.default = n.default, this.validate = typeof n.validate == "string" ? Ne(e, t, n.validate) : n.validate;
	}
	get isRequired() {
		return !this.hasDefault;
	}
}, Fe = class e {
	constructor(e, t, n, r) {
		this.name = e, this.rank = t, this.schema = n, this.spec = r, this.attrs = je(e, r.attrs), this.excluded = null;
		let i = Oe(this.attrs);
		this.instance = i ? new v(this, i) : null;
	}
	create(e = null) {
		return !e && this.instance ? this.instance : new v(this, ke(this.attrs, e));
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
		Ae(this.attrs, e, "mark", this.name);
	}
	excludes(e) {
		return this.excluded.indexOf(e) > -1;
	}
}, Ie = class {
	constructor(e) {
		this.linebreakReplacement = null, this.cached = Object.create(null);
		let t = this.spec = {};
		for (let n in e) t[n] = e[n];
		t.nodes = l.from(e.nodes), t.marks = l.from(e.marks || {}), this.nodes = Me.compile(this.spec.nodes, this), this.marks = Fe.compile(this.spec.marks, this);
		let n = Object.create(null);
		for (let e in this.nodes) {
			if (e in this.marks) throw RangeError(e + " can not be both a node and a mark");
			let t = this.nodes[e], r = t.spec.content || "", i = t.spec.marks;
			if (t.contentMatch = n[r] || (n[r] = me.parse(r, this.nodes)), t.inlineContent = t.contentMatch.inlineContent, t.spec.linebreakReplacement) {
				if (this.linebreakReplacement) throw RangeError("Multiple linebreak nodes defined");
				if (!t.isInline || !t.isLeaf) throw RangeError("Linebreak replacement nodes must be inline leaf nodes");
				this.linebreakReplacement = t;
			}
			t.markSet = i == "_" ? null : i ? Le(this, i.split(" ")) : i == "" || !t.inlineContent ? [] : null;
		}
		for (let e in this.marks) {
			let t = this.marks[e], n = t.spec.excludes;
			t.excluded = n == null ? [t] : n == "" ? [] : Le(this, n.split(" "));
		}
		this.nodeFromJSON = (e) => de.fromJSON(this, e), this.markFromJSON = (e) => v.fromJSON(this, e), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = Object.create(null);
	}
	node(e, t = null, n, r) {
		if (typeof e == "string") e = this.nodeType(e);
		else if (!(e instanceof Me)) throw RangeError("Invalid node type: " + e);
		else if (e.schema != this) throw RangeError("Node type from different schema used (" + e.name + ")");
		return e.createChecked(t, n, r);
	}
	text(e, t) {
		let n = this.nodes.text;
		return new fe(n, n.defaultAttrs, e, v.setFrom(t));
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
function Le(e, t) {
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
function Re(e) {
	return e.tag != null;
}
function ze(e) {
	return e.style != null;
}
var Be = class e {
	constructor(e, t) {
		this.schema = e, this.rules = t, this.tags = [], this.styles = [];
		let n = this.matchedStyles = [];
		t.forEach((e) => {
			if (Re(e)) this.tags.push(e);
			else if (ze(e)) {
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
		let n = new Ye(this, t, !1);
		return n.addAll(e, v.none, t.from, t.to), n.finish();
	}
	parseSlice(e, t = {}) {
		let n = new Ye(this, t, !0);
		return n.addAll(e, v.none, t.from, t.to), b.maxOpen(n.finish());
	}
	matchTag(e, t, n) {
		for (let r = n ? this.tags.indexOf(n) + 1 : 0; r < this.tags.length; r++) {
			let n = this.tags[r];
			if (Ze(e, n.tag) && (n.namespace === void 0 || e.namespaceURI == n.namespace) && (!n.context || t.matchesContext(n.context))) {
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
				n(e = Qe(e)), e.mark || e.ignore || e.clearMark || (e.mark = t);
			});
		}
		for (let t in e.nodes) {
			let r = e.nodes[t].spec.parseDOM;
			r && r.forEach((e) => {
				n(e = Qe(e)), e.node || e.ignore || e.mark || (e.node = t);
			});
		}
		return t;
	}
	static fromSchema(t) {
		return t.cached.domParser || (t.cached.domParser = new e(t, e.schemaRules(t)));
	}
}, Ve = {
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
}, He = {
	head: !0,
	noscript: !0,
	object: !0,
	script: !0,
	style: !0,
	title: !0
}, Ue = {
	ol: !0,
	ul: !0
}, We = 1, Ge = 2, Ke = 4;
function qe(e, t, n) {
	return t == null ? e && e.whitespace == "pre" ? We | Ge : n & ~Ke : (t ? We : 0) | (t === "full" ? Ge : 0);
}
var Je = class {
	constructor(e, t, n, r, i, a) {
		this.type = e, this.attrs = t, this.marks = n, this.solid = r, this.options = a, this.content = [], this.activeMarks = v.none, this.match = i || (a & Ke ? null : e.contentMatch);
	}
	findWrapping(e) {
		if (!this.match) {
			if (!this.type) return [];
			let t = this.type.contentMatch.fillBefore(m.from(e));
			if (t) this.match = this.type.contentMatch.matchFragment(t);
			else {
				let t = this.type.contentMatch, n;
				return (n = t.findWrapping(e.type)) ? (this.match = t, n) : null;
			}
		}
		return this.match.findWrapping(e.type);
	}
	finish(e) {
		if (!(this.options & We)) {
			let e = this.content[this.content.length - 1], t;
			if (e && e.isText && (t = /[ \t\r\n\u000c]+$/.exec(e.text))) {
				let n = e;
				e.text.length == t[0].length ? this.content.pop() : this.content[this.content.length - 1] = n.withText(n.text.slice(0, n.text.length - t[0].length));
			}
		}
		let t = m.from(this.content);
		return !e && this.match && (t = t.append(this.match.fillBefore(m.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
	}
	inlineContext(e) {
		return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Ve.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
	}
}, Ye = class {
	constructor(e, t, n) {
		this.parser = e, this.options = t, this.isOpen = n, this.open = 0, this.localPreserveWS = !1;
		let r = t.topNode, i, a = qe(null, t.preserveWhitespace, 0) | (n ? Ke : 0);
		i = r ? new Je(r.type, r.attrs, v.none, !0, t.topMatch || r.type.contentMatch, a) : n ? new Je(null, null, v.none, !0, null, a) : new Je(e.schema.topNodeType, null, v.none, !0, null, a), this.nodes = [i], this.find = t.findPositions, this.needsBlock = !1;
	}
	get top() {
		return this.nodes[this.open];
	}
	addDOM(e, t) {
		e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
	}
	addTextNode(e, t) {
		let n = e.nodeValue, r = this.top, i = r.options & Ge ? "full" : this.localPreserveWS || (r.options & We) > 0, { schema: a } = this.parser;
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
		Ue.hasOwnProperty(a) && this.parser.normalizeLists && Xe(e);
		let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, n));
		out: if (s ? s.ignore : He.hasOwnProperty(a)) this.findInside(e), this.ignoreFallback(e, t);
		else if (!s || s.skip || s.closeParent) {
			s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
			let n, r = this.needsBlock;
			if (Ve.hasOwnProperty(a)) i.content.length && i.content[0].isInline && this.open && (this.open--, i = this.top), n = !0, i.type || (this.needsBlock = !0);
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
			let n = v.none;
			for (let i of r.concat(e.marks)) (t.type ? t.type.allowsMarkType(i.type) : $e(i.type, e.type)) && (n = i.addToSet(n));
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
		let o = qe(e, i, a.options);
		a.options & Ke && a.content.length == 0 && (o |= Ke);
		let s = v.none;
		return n = n.filter((t) => (a.type ? a.type.allowsMarkType(t.type) : $e(t.type, e)) ? (s = t.addToSet(s), !1) : !0), this.nodes.push(new Je(e, t, s, r, null, o)), this.open++, n;
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
			this.localPreserveWS && (this.nodes[t].options |= We);
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
function Xe(e) {
	for (let t = e.firstChild, n = null; t; t = t.nextSibling) {
		let e = t.nodeType == 1 ? t.nodeName.toLowerCase() : null;
		e && Ue.hasOwnProperty(e) && n ? (n.appendChild(t), t = n) : e == "li" ? n = t : e && (n = null);
	}
}
function Ze(e, t) {
	return (e.matches || e.msMatchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector).call(e, t);
}
function Qe(e) {
	let t = {};
	for (let n in e) t[n] = e[n];
	return t;
}
function $e(e, t) {
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
var et = class e {
	constructor(e, t) {
		this.nodes = e, this.marks = t;
	}
	serializeFragment(e, t = {}, n) {
		n ||= nt(t).createDocumentFragment();
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
		if (e.isText) return nt(t).createTextNode(e.text);
		let { dom: n, contentDOM: r } = ot(nt(t), this.nodes[e.type.name](e), null, e.attrs);
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
		return r && ot(nt(n), r(e, t), null, e.attrs);
	}
	static renderSpec(e, t, n = null, r) {
		return typeof t == "string" ? { dom: e.createTextNode(t) } : ot(e, t, n, r);
	}
	static fromSchema(t) {
		return t.cached.domSerializer || (t.cached.domSerializer = new e(this.nodesFromSchema(t), this.marksFromSchema(t)));
	}
	static nodesFromSchema(e) {
		let t = tt(e.nodes);
		return t.text ||= (e) => e.text, t;
	}
	static marksFromSchema(e) {
		return tt(e.marks);
	}
};
function tt(e) {
	let t = {};
	for (let n in e) {
		let r = e[n].spec.toDOM;
		r && (t[n] = r);
	}
	return t;
}
function nt(e) {
	return e.document || window.document;
}
var rt = /* @__PURE__ */ new WeakMap();
function it(e) {
	let t = rt.get(e);
	return t === void 0 && rt.set(e, t = at(e)), t;
}
function at(e) {
	let t = null;
	function n(e) {
		if (e && typeof e == "object") if (Array.isArray(e)) if (typeof e[0] == "string") t ||= [], t.push(e);
		else for (let t = 0; t < e.length; t++) n(e[t]);
		else for (let t in e) n(e[t]);
	}
	return n(e), t;
}
function ot(e, t, n, r) {
	if (t.nodeType == 1) return { dom: t };
	if (t.dom && t.dom.nodeType == 1) return t;
	let i = t[0], a;
	if (typeof i != "string") throw RangeError("Invalid array passed to renderSpec");
	if (r && (a = it(r)) && a.indexOf(t) > -1) throw RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
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
			let { dom: t, contentDOM: i } = ot(e, a, n, r);
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
var st = 65535, ct = 2 ** 16;
function lt(e, t) {
	return e + t * ct;
}
function ut(e) {
	return e & st;
}
function dt(e) {
	return (e - (e & st)) / ct;
}
var ft = 1, pt = 2, mt = 4, ht = 8, gt = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & ht) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & (ft | mt)) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & (pt | mt)) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & mt) > 0;
	}
}, _t = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = ut(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + dt(e);
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
				let d = e == (t < 0 ? s : u) ? null : lt(o / 3, e - s), f = e == s ? pt : e == u ? ft : mt;
				return (t < 0 ? e != s : e != u) && (f |= ht), new gt(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new gt(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = ut(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
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
_t.empty = new _t([]);
var vt = class e {
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
		return n ? e : new gt(e, r, null);
	}
}, yt = Object.create(null), bt = class {
	getMap() {
		return _t.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = yt[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in yt) throw RangeError("Duplicate use of step JSON ID " + e);
		return yt[e] = t, t.prototype.jsonID = e, t;
	}
}, xt = class e {
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
			if (t instanceof y) return e.fail(t.message);
			throw t;
		}
	}
};
function St(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(St(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return m.fromArray(r);
}
var Ct = class e extends bt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new b(St(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return xt.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new wt(this.from, this.to, this.mark);
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
bt.jsonID("addMark", Ct);
var wt = class e extends bt {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new b(St(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return xt.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new Ct(this.from, this.to, this.mark);
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
bt.jsonID("removeMark", wt);
var Tt = class e extends bt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return xt.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return xt.fromReplace(e, this.pos, this.pos + 1, new b(m.from(n), 0, +!t.isLeaf));
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
		return new Et(this.pos, this.mark);
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
bt.jsonID("addNodeMark", Tt);
var Et = class e extends bt {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return xt.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return xt.fromReplace(e, this.pos, this.pos + 1, new b(m.from(n), 0, +!t.isLeaf));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new Tt(this.pos, this.mark);
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
bt.jsonID("removeNodeMark", Et);
var Dt = class e extends bt {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && kt(e, this.from, this.to) ? xt.fail("Structure replace would overwrite content") : xt.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new _t([
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
			let n = this.slice.size + t.slice.size == 0 ? b.empty : new b(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		} else if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? b.empty : new b(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
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
		return new e(n.from, n.to, b.fromJSON(t, n.slice), !!n.structure);
	}
};
Dt.MAP_BIAS = 1, bt.jsonID("replace", Dt);
var Ot = class e extends bt {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (kt(e, this.from, this.gapFrom) || kt(e, this.gapTo, this.to))) return xt.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return xt.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? xt.fromReplace(e, this.from, this.to, n) : xt.fail("Content does not fit in gap");
	}
	getMap() {
		return new _t([
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
		return new e(n.from, n.to, n.gapFrom, n.gapTo, b.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
bt.jsonID("replaceAround", Ot);
function kt(e, t, n) {
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
function At(e, t, n, r) {
	let i = [], a = [], o, s;
	e.doc.nodesBetween(t, n, (e, c, l) => {
		if (!e.isInline) return;
		let u = e.marks;
		if (!r.isInSet(u) && l.type.allowsMarkType(r.type)) {
			let l = Math.max(c, t), d = Math.min(c + e.nodeSize, n), f = r.addToSet(u);
			for (let e = 0; e < u.length; e++) u[e].isInSet(f) || (o && o.to == l && o.mark.eq(u[e]) ? o.to = d : i.push(o = new wt(l, d, u[e])));
			s && s.to == l ? s.to = d : a.push(s = new Ct(l, d, r));
		}
	}), i.forEach((t) => e.step(t)), a.forEach((t) => e.step(t));
}
function jt(e, t, n, r) {
	let i = [], a = 0;
	e.doc.nodesBetween(t, n, (e, o) => {
		if (!e.isInline) return;
		a++;
		let s = null;
		if (r instanceof Fe) {
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
	}), i.forEach((t) => e.step(new wt(t.from, t.to, t.style)));
}
function Mt(e, t, n, r = n.contentMatch, i = !0) {
	let a = e.doc.nodeAt(t), o = [], s = t + 1;
	for (let t = 0; t < a.childCount; t++) {
		let c = a.child(t), l = s + c.nodeSize, u = r.matchType(c.type);
		if (!u) o.push(new Dt(s, l, b.empty));
		else {
			r = u;
			for (let t = 0; t < c.marks.length; t++) n.allowsMarkType(c.marks[t].type) || e.step(new wt(s, l, c.marks[t]));
			if (i && c.isText && n.whitespace != "pre") {
				let e, t = /\r?\n|\r/g, r;
				for (; e = t.exec(c.text);) r ||= new b(m.from(n.schema.text(" ", n.allowedMarks(c.marks))), 0, 0), o.push(new Dt(s + e.index, s + e.index + e[0].length, r));
			}
		}
		s = l;
	}
	if (!r.validEnd) {
		let t = r.fillBefore(m.empty, !0);
		e.replace(s, s, new b(t, 0, 0));
	}
	for (let t = o.length - 1; t >= 0; t--) e.step(o[t]);
}
function Nt(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function Pt(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !Nt(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function Ft(e, t, n) {
	let { $from: r, $to: i, depth: a } = t, o = r.before(a + 1), s = i.after(a + 1), c = o, l = s, u = m.empty, d = 0;
	for (let e = a, t = !1; e > n; e--) t || r.index(e) > 0 ? (t = !0, u = m.from(r.node(e).copy(u)), d++) : c--;
	let f = m.empty, p = 0;
	for (let e = a, t = !1; e > n; e--) t || i.after(e + 1) < i.end(e) ? (t = !0, f = m.from(i.node(e).copy(f)), p++) : l++;
	e.step(new Ot(c, l, o, s, new b(u.append(f), d, p), u.size - d, !0));
}
function It(e, t, n = null, r = e) {
	let i = Rt(e, t), a = i && zt(r, t);
	return a ? i.map(Lt).concat({
		type: t,
		attrs: n
	}).concat(a.map(Lt)) : null;
}
function Lt(e) {
	return {
		type: e,
		attrs: null
	};
}
function Rt(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.contentMatchAt(r).findWrapping(t);
	if (!a) return null;
	let o = a.length ? a[0] : t;
	return n.canReplaceWith(r, i, o) ? a : null;
}
function zt(e, t) {
	let { parent: n, startIndex: r, endIndex: i } = e, a = n.child(r), o = t.contentMatch.findWrapping(a.type);
	if (!o) return null;
	let s = (o.length ? o[o.length - 1] : t).contentMatch;
	for (let e = r; s && e < i; e++) s = s.matchType(n.child(e).type);
	return !s || !s.validEnd ? null : o;
}
function Bt(e, t, n) {
	let r = m.empty;
	for (let e = n.length - 1; e >= 0; e--) {
		if (r.size) {
			let t = n[e].type.contentMatch.matchFragment(r);
			if (!t || !t.validEnd) throw RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
		}
		r = m.from(n[e].type.create(n[e].attrs, r));
	}
	let i = t.start, a = t.end;
	e.step(new Ot(i, a, i, a, new b(r, 0, 0), n.length, !0));
}
function Vt(e, t, n, r, i) {
	if (!r.isTextblock) throw RangeError("Type given to setBlockType should be a textblock");
	let a = e.steps.length;
	e.doc.nodesBetween(t, n, (t, n) => {
		let o = typeof i == "function" ? i(t) : i;
		if (t.isTextblock && !t.hasMarkup(r, o) && Wt(e.doc, e.mapping.slice(a).map(n), r)) {
			let i = null;
			if (r.schema.linebreakReplacement) {
				let e = r.whitespace == "pre", t = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
				e && !t ? i = !1 : !e && t && (i = !0);
			}
			i === !1 && Ut(e, t, n, a), Mt(e, e.mapping.slice(a).map(n, 1), r, void 0, i === null);
			let s = e.mapping.slice(a), c = s.map(n, 1), l = s.map(n + t.nodeSize, 1);
			return e.step(new Ot(c, l, c + 1, l - 1, new b(m.from(r.create(o, null, t.marks)), 0, 0), 1, !0)), i === !0 && Ht(e, t, n, a), !1;
		}
	});
}
function Ht(e, t, n, r) {
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
function Ut(e, t, n, r) {
	t.forEach((i, a) => {
		if (i.type == i.type.schema.linebreakReplacement) {
			let i = e.mapping.slice(r).map(n + 1 + a);
			e.replaceWith(i, i + 1, t.type.schema.text("\n"));
		}
	});
}
function Wt(e, t, n) {
	let r = e.resolve(t), i = r.index();
	return r.parent.canReplaceWith(i, i + 1, n);
}
function Gt(e, t, n, r, i) {
	let a = e.doc.nodeAt(t);
	if (!a) throw RangeError("No node at given position");
	n ||= a.type;
	let o = n.create(r, null, i || a.marks);
	if (a.isLeaf) return e.replaceWith(t, t + a.nodeSize, o);
	if (!n.validContent(a.content)) throw RangeError("Invalid content for node type " + n.name);
	e.step(new Ot(t, t + a.nodeSize, t + 1, t + a.nodeSize - 1, new b(m.from(o), 0, 0), 1, !0));
}
function Kt(e, t, n = 1, r) {
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
function qt(e, t, n = 1, r) {
	let i = e.doc.resolve(t), a = m.empty, o = m.empty;
	for (let e = i.depth, t = i.depth - n, s = n - 1; e > t; e--, s--) {
		a = m.from(i.node(e).copy(a));
		let t = r && r[s];
		o = m.from(t ? t.type.create(t.attrs, o) : i.node(e).copy(o));
	}
	e.step(new Dt(t, t, new b(a.append(o), n, n), !0));
}
function Jt(e, t) {
	let n = e.resolve(t), r = n.index();
	return Xt(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function Yt(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function Xt(e, t) {
	return !!(e && t && !e.isLeaf && Yt(e, t));
}
function Zt(e, t, n = -1) {
	let r = e.resolve(t);
	for (let e = r.depth;; e--) {
		let i, a, o = r.index(e);
		if (e == r.depth ? (i = r.nodeBefore, a = r.nodeAfter) : n > 0 ? (i = r.node(e + 1), o++, a = r.node(e).maybeChild(o)) : (i = r.node(e).maybeChild(o - 1), a = r.node(e + 1)), i && !i.isTextblock && Xt(i, a) && r.node(e).canReplace(o, o + 1)) return t;
		if (e == 0) break;
		t = n < 0 ? r.before(e) : r.after(e);
	}
}
function Qt(e, t, n) {
	let r = null, { linebreakReplacement: i } = e.doc.type.schema, a = e.doc.resolve(t - n), o = a.node().type;
	if (i && o.inlineContent) {
		let e = o.whitespace == "pre", t = !!o.contentMatch.matchType(i);
		e && !t ? r = !1 : !e && t && (r = !0);
	}
	let s = e.steps.length;
	if (r === !1) {
		let r = e.doc.resolve(t + n);
		Ut(e, r.node(), r.before(), s);
	}
	o.inlineContent && Mt(e, t + n - 1, o, a.node().contentMatchAt(a.index()), r == null);
	let c = e.mapping.slice(s), l = c.map(t - n);
	if (e.step(new Dt(l, c.map(t + n, -1), b.empty, !0)), r === !0) {
		let t = e.doc.resolve(l);
		Ht(e, t.node(), t.before(), e.steps.length);
	}
	return e;
}
function $t(e, t, n) {
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
function en(e, t, n) {
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
function tn(e, t, n = t, r = b.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return nn(i, a, r) ? new Dt(t, n, r) : new rn(i, a, r).fit();
}
function nn(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var rn = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = m.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = m.from(e.node(t).copy(this.placed));
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
		let s = new b(i, a, o);
		return e > -1 ? new Ot(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new Dt(n.pos, r.pos, s) : null;
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
			n ? (r = sn(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(m.from(i), !1)) : r && a.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: c
				};
				if (t == 2 && i && (s = o.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: s
				};
				if (r && o.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = sn(e, t);
		return !r.childCount || r.firstChild.isLeaf ? !1 : (this.unplaced = new b(e, t + 1, Math.max(n, r.size + t >= e.size - n ? t + 1 : 0)), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = sn(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new b(an(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new b(an(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let a = this.unplaced, o = n ? n.content : a.content, s = a.openStart - e, c = 0, l = [], { match: u, type: d } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) l.push(r.child(e));
			u = u.matchFragment(r);
		}
		let f = o.size + e - (a.content.size - a.openEnd);
		for (; c < o.childCount;) {
			let e = o.child(c), t = u.matchType(e.type);
			if (!t) break;
			c++, (c > 1 || s == 0 || e.content.size) && (u = t, l.push(cn(e.mark(d.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? f : -1)));
		}
		let p = c == o.childCount;
		p || (f = -1), this.placed = on(this.placed, t, m.from(l)), this.frontier[t].match = u, p && f < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < f; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = p ? e == 0 ? b.empty : new b(an(a.content, e - 1, 1), e - 1, f < 0 ? a.openEnd : e - 1) : new b(an(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !ln(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = ln(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = ln(e, n, r, t, !0);
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
		t.fit.childCount && (this.placed = on(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = on(this.placed, this.depth, m.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(m.empty, !0);
		e.childCount && (this.placed = on(this.placed, this.frontier.length, e));
	}
};
function an(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(an(e.firstChild.content, t - 1, n)));
}
function on(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(on(e.lastChild.content, t - 1, n)));
}
function sn(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function cn(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, cn(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(m.empty, !0)))), e.copy(r);
}
function ln(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !un(n, a.content, o) ? s : null;
}
function un(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
function dn(e) {
	return e.spec.defining || e.spec.definingForContent;
}
function fn(e, t, n, r) {
	if (!r.size) return e.deleteRange(t, n);
	let i = e.doc.resolve(t), a = e.doc.resolve(n);
	if (nn(i, a, r)) return e.step(new Dt(t, n, r));
	let o = gn(i, a);
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
		let t = l[e], n = dn(t.type);
		if (n && !t.sameMarkup(i.node(Math.abs(s) - 1))) u = e;
		else if (n || !t.type.isTextblock) break;
	}
	for (let t = r.openStart; t >= 0; t--) {
		let s = (t + u + 1) % (r.openStart + 1), d = l[s];
		if (d) for (let t = 0; t < o.length; t++) {
			let l = o[(t + c) % o.length], u = !0;
			l < 0 && (u = !1, l = -l);
			let f = i.node(l - 1), p = i.index(l - 1);
			if (f.canReplaceWith(p, p, d.type, d.marks)) return e.replace(i.before(l), u ? a.after(l) : n, new b(pn(r.content, 0, r.openStart, s), s, r.openEnd));
		}
	}
	let d = e.steps.length;
	for (let s = o.length - 1; s >= 0 && (e.replace(t, n, r), !(e.steps.length > d)); s--) {
		let e = o[s];
		e < 0 || (t = i.before(e), n = a.after(e));
	}
}
function pn(e, t, n, r, i) {
	if (t < n) {
		let i = e.firstChild;
		e = e.replaceChild(0, i.copy(pn(i.content, t + 1, n, r, i)));
	}
	if (t > r) {
		let t = i.contentMatchAt(0), n = t.fillBefore(e).append(e);
		e = n.append(t.matchFragment(n).fillBefore(m.empty, !0));
	}
	return e;
}
function mn(e, t, n, r) {
	if (!r.isInline && t == n && e.doc.resolve(t).parent.content.size) {
		let i = $t(e.doc, t, r.type);
		i != null && (t = n = i);
	}
	e.replaceRange(t, n, new b(m.from(r), 0, 0));
}
function hn(e, t, n) {
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
	let a = gn(r, i);
	for (let t = 0; t < a.length; t++) {
		let n = a[t], o = t == a.length - 1;
		if (o && n == 0 || r.node(n).type.contentMatch.validEnd) return e.delete(r.start(n), i.end(n));
		if (n > 0 && (o || r.node(n - 1).canReplace(r.index(n - 1), i.indexAfter(n - 1)))) return e.delete(r.before(n), i.after(n));
	}
	for (let a = 1; a <= r.depth && a <= i.depth; a++) if (t - r.start(a) == r.depth - a && n > r.end(a) && i.end(a) - n != i.depth - a && r.start(a - 1) == i.start(a - 1) && r.node(a - 1).canReplace(r.index(a - 1), i.index(a - 1))) return e.delete(r.before(a), n);
	e.delete(t, n);
}
function gn(e, t) {
	let n = [], r = Math.min(e.depth, t.depth);
	for (let i = r; i >= 0; i--) {
		let r = e.start(i);
		if (r < e.pos - (e.depth - i) || t.end(i) > t.pos + (t.depth - i) || e.node(i).type.spec.isolating || t.node(i).type.spec.isolating) break;
		(r == t.start(i) || i == e.depth && i == t.depth && e.parent.inlineContent && t.parent.inlineContent && i && t.start(i - 1) == r - 1) && n.push(i);
	}
	return n;
}
var _n = class e extends bt {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return xt.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return xt.fromReplace(e, this.pos, this.pos + 1, new b(m.from(r), 0, +!t.isLeaf));
	}
	getMap() {
		return _t.empty;
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
bt.jsonID("attr", _n);
var vn = class e extends bt {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return xt.ok(n);
	}
	getMap() {
		return _t.empty;
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
bt.jsonID("docAttr", vn);
var yn = class extends Error {};
yn = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, yn.prototype = Object.create(Error.prototype), yn.prototype.constructor = yn, yn.prototype.name = "TransformError";
var bn = class {
	constructor(e) {
		this.doc = e, this.steps = [], this.docs = [], this.mapping = new vt();
	}
	get before() {
		return this.docs.length ? this.docs[0] : this.doc;
	}
	step(e) {
		let t = this.maybeStep(e);
		if (t.failed) throw new yn(t.failed);
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
	replace(e, t = e, n = b.empty) {
		let r = tn(this.doc, e, t, n);
		return r && this.step(r), this;
	}
	replaceWith(e, t, n) {
		return this.replace(e, t, new b(m.from(n), 0, 0));
	}
	delete(e, t) {
		return this.replace(e, t, b.empty);
	}
	insert(e, t) {
		return this.replaceWith(e, e, t);
	}
	replaceRange(e, t, n) {
		return fn(this, e, t, n), this;
	}
	replaceRangeWith(e, t, n) {
		return mn(this, e, t, n), this;
	}
	deleteRange(e, t) {
		return hn(this, e, t), this;
	}
	lift(e, t) {
		return Ft(this, e, t), this;
	}
	join(e, t = 1) {
		return Qt(this, e, t), this;
	}
	wrap(e, t) {
		return Bt(this, e, t), this;
	}
	setBlockType(e, t = e, n, r = null) {
		return Vt(this, e, t, n, r), this;
	}
	setNodeMarkup(e, t, n = null, r) {
		return Gt(this, e, t, n, r), this;
	}
	setNodeAttribute(e, t, n) {
		return this.step(new _n(e, t, n)), this;
	}
	setDocAttribute(e, t) {
		return this.step(new vn(e, t)), this;
	}
	addNodeMark(e, t) {
		return this.step(new Tt(e, t)), this;
	}
	removeNodeMark(e, t) {
		let n = this.doc.nodeAt(e);
		if (!n) throw RangeError("No node at position " + e);
		if (t instanceof v) t.isInSet(n.marks) && this.step(new Et(e, t));
		else {
			let r = n.marks, i, a = [];
			for (; i = t.isInSet(r);) a.push(new Et(e, i)), r = i.removeFromSet(r);
			for (let e = a.length - 1; e >= 0; e--) this.step(a[e]);
		}
		return this;
	}
	split(e, t = 1, n) {
		return qt(this, e, t, n), this;
	}
	addMark(e, t, n) {
		return At(this, e, t, n), this;
	}
	removeMark(e, t, n) {
		return jt(this, e, t, n), this;
	}
	clearIncompatible(e, t, n) {
		return Mt(this, e, t, n), this;
	}
}, xn = Object.create(null), O = class {
	constructor(e, t, n) {
		this.$anchor = e, this.$head = t, this.ranges = n || [new Sn(e.min(t), e.max(t))];
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
	replace(e, t = b.empty) {
		let n = t.content.lastChild, r = null;
		for (let e = 0; e < t.openEnd; e++) r = n, n = n.lastChild;
		let i = e.steps.length, a = this.ranges;
		for (let o = 0; o < a.length; o++) {
			let { $from: s, $to: c } = a[o], l = e.mapping.slice(i);
			e.replaceRange(l.map(s.pos), l.map(c.pos), o ? b.empty : t), o == 0 && An(e, i, (n ? n.isInline : r && r.isTextblock) ? -1 : 1);
		}
	}
	replaceWith(e, t) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n), c = s.map(a.pos), l = s.map(o.pos);
			i ? e.deleteRange(c, l) : (e.replaceRangeWith(c, l, t), An(e, n, t.isInline ? -1 : 1));
		}
	}
	static findFrom(e, t, n = !1) {
		let r = e.parent.inlineContent ? new k(e) : kn(e.node(0), e.parent, e.pos, e.index(), t, n);
		if (r) return r;
		for (let r = e.depth - 1; r >= 0; r--) {
			let i = t < 0 ? kn(e.node(0), e.node(r), e.before(r + 1), e.index(r), t, n) : kn(e.node(0), e.node(r), e.after(r + 1), e.index(r) + 1, t, n);
			if (i) return i;
		}
		return null;
	}
	static near(e, t = 1) {
		return this.findFrom(e, t) || this.findFrom(e, -t) || new Dn(e.node(0));
	}
	static atStart(e) {
		return kn(e, e, 0, 0, 1) || new Dn(e);
	}
	static atEnd(e) {
		return kn(e, e, e.content.size, e.childCount, -1) || new Dn(e);
	}
	static fromJSON(e, t) {
		if (!t || !t.type) throw RangeError("Invalid input for Selection.fromJSON");
		let n = xn[t.type];
		if (!n) throw RangeError(`No selection type ${t.type} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in xn) throw RangeError("Duplicate use of selection JSON ID " + e);
		return xn[e] = t, t.prototype.jsonID = e, t;
	}
	getBookmark() {
		return k.between(this.$anchor, this.$head).getBookmark();
	}
};
O.prototype.visible = !0;
var Sn = class {
	constructor(e, t) {
		this.$from = e, this.$to = t;
	}
}, Cn = !1;
function wn(e) {
	!Cn && !e.parent.inlineContent && (Cn = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + e.parent.type.name + ")"));
}
var k = class e extends O {
	constructor(e, t = e) {
		wn(e), wn(t), super(e, t);
	}
	get $cursor() {
		return this.$anchor.pos == this.$head.pos ? this.$head : null;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		if (!r.parent.inlineContent) return O.near(r);
		let i = t.resolve(n.map(this.anchor));
		return new e(i.parent.inlineContent ? i : r, r);
	}
	replace(e, t = b.empty) {
		if (super.replace(e, t), t == b.empty) {
			let t = this.$from.marksAcross(this.$to);
			t && e.ensureMarks(t);
		}
	}
	eq(t) {
		return t instanceof e && t.anchor == this.anchor && t.head == this.head;
	}
	getBookmark() {
		return new Tn(this.anchor, this.head);
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
			let e = O.findFrom(n, r, !0) || O.findFrom(n, -r, !0);
			if (e) n = e.$head;
			else return O.near(n, r);
		}
		return t.parent.inlineContent || (i == 0 ? t = n : (t = (O.findFrom(t, -r, !0) || O.findFrom(t, r, !0)).$anchor, t.pos < n.pos != i < 0 && (t = n))), new e(t, n);
	}
};
O.jsonID("text", k);
var Tn = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		return k.between(e.resolve(this.anchor), e.resolve(this.head));
	}
}, A = class e extends O {
	constructor(e) {
		let t = e.nodeAfter, n = e.node(0).resolve(e.pos + t.nodeSize);
		super(e, n), this.node = t;
	}
	map(t, n) {
		let { deleted: r, pos: i } = n.mapResult(this.anchor), a = t.resolve(i);
		return r ? O.near(a) : new e(a);
	}
	content() {
		return new b(m.from(this.node), 0, 0);
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
		return new En(this.anchor);
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
A.prototype.visible = !1, O.jsonID("node", A);
var En = class e {
	constructor(e) {
		this.anchor = e;
	}
	map(t) {
		let { deleted: n, pos: r } = t.mapResult(this.anchor);
		return n ? new Tn(r, r) : new e(r);
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = t.nodeAfter;
		return n && A.isSelectable(n) ? new A(t) : O.near(t);
	}
}, Dn = class e extends O {
	constructor(e) {
		super(e.resolve(0), e.resolve(e.content.size));
	}
	replace(e, t = b.empty) {
		if (t == b.empty) {
			e.delete(0, e.doc.content.size);
			let t = O.atStart(e.doc);
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
		return On;
	}
};
O.jsonID("all", Dn);
var On = {
	map() {
		return this;
	},
	resolve(e) {
		return new Dn(e);
	}
};
function kn(e, t, n, r, i, a = !1) {
	if (t.inlineContent) return k.create(e, n);
	for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < t.childCount : o >= 0; o += i) {
		let r = t.child(o);
		if (!r.isAtom) {
			let t = kn(e, r, n + i, i < 0 ? r.childCount : 0, i, a);
			if (t) return t;
		} else if (!a && A.isSelectable(r)) return A.create(e, n - (i < 0 ? r.nodeSize : 0));
		n += r.nodeSize * i;
	}
	return null;
}
function An(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Dt || i instanceof Ot)) return;
	let a = e.mapping.maps[r], o;
	a.forEach((e, t, n, r) => {
		o ??= r;
	}), e.setSelection(O.near(e.doc.resolve(o), n));
}
var jn = 1, Mn = 2, Nn = 4, Pn = class extends bn {
	constructor(e) {
		super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
	}
	get selection() {
		return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
	}
	setSelection(e) {
		if (e.$from.doc != this.doc) throw RangeError("Selection passed to setSelection must point at the current document");
		return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | jn) & ~Mn, this.storedMarks = null, this;
	}
	get selectionSet() {
		return (this.updated & jn) > 0;
	}
	setStoredMarks(e) {
		return this.storedMarks = e, this.updated |= Mn, this;
	}
	ensureMarks(e) {
		return v.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
	}
	addStoredMark(e) {
		return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
	}
	removeStoredMark(e) {
		return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
	}
	get storedMarksSet() {
		return (this.updated & Mn) > 0;
	}
	addStep(e, t) {
		super.addStep(e, t), this.updated &= ~Mn, this.storedMarks = null;
	}
	setTime(e) {
		return this.time = e, this;
	}
	replaceSelection(e) {
		return this.selection.replace(this, e), this;
	}
	replaceSelectionWith(e, t = !0) {
		let n = this.selection;
		return t && (e = e.mark(this.storedMarks || (n.empty ? n.$from.marks() : n.$from.marksAcross(n.$to) || v.none))), n.replaceWith(this, e), this;
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
			return this.replaceRangeWith(t, n, r.text(e, i)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(O.near(this.selection.$to)), this;
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
		return this.updated |= Nn, this;
	}
	get scrolledIntoView() {
		return (this.updated & Nn) > 0;
	}
};
function Fn(e, t) {
	return !t || !e ? e : e.bind(t);
}
var In = class {
	constructor(e, t, n) {
		this.name = e, this.init = Fn(t.init, n), this.apply = Fn(t.apply, n);
	}
}, Ln = [
	new In("doc", {
		init(e) {
			return e.doc || e.schema.topNodeType.createAndFill();
		},
		apply(e) {
			return e.doc;
		}
	}),
	new In("selection", {
		init(e, t) {
			return e.selection || O.atStart(t.doc);
		},
		apply(e) {
			return e.selection;
		}
	}),
	new In("storedMarks", {
		init(e) {
			return e.storedMarks || null;
		},
		apply(e, t, n, r) {
			return r.selection.$cursor ? e.storedMarks : null;
		}
	}),
	new In("scrollToSelection", {
		init() {
			return 0;
		},
		apply(e, t) {
			return e.scrolledIntoView ? t + 1 : t;
		}
	})
], Rn = class {
	constructor(e, t) {
		this.schema = e, this.plugins = [], this.pluginsByKey = Object.create(null), this.fields = Ln.slice(), t && t.forEach((e) => {
			if (this.pluginsByKey[e.key]) throw RangeError("Adding different instances of a keyed plugin (" + e.key + ")");
			this.plugins.push(e), this.pluginsByKey[e.key] = e, e.spec.state && this.fields.push(new In(e.key, e.spec.state, e));
		});
	}
}, zn = class e {
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
		return new Pn(this);
	}
	static create(t) {
		let n = new Rn(t.doc ? t.doc.type.schema : t.schema, t.plugins), r = new e(n);
		for (let e = 0; e < n.fields.length; e++) r[n.fields[e].name] = n.fields[e].init(t, r);
		return r;
	}
	reconfigure(t) {
		let n = new Rn(this.schema, t.plugins), r = n.fields, i = new e(n);
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
		let i = new Rn(t.schema, t.plugins), a = new e(i);
		return i.fields.forEach((e) => {
			if (e.name == "doc") a.doc = de.fromJSON(t.schema, n.doc);
			else if (e.name == "selection") a.selection = O.fromJSON(a.doc, n.selection);
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
function Bn(e, t, n) {
	for (let r in e) {
		let i = e[r];
		i instanceof Function ? i = i.bind(t) : r == "handleDOMEvents" && (i = Bn(i, t, {})), n[r] = i;
	}
	return n;
}
var j = class {
	constructor(e) {
		this.spec = e, this.props = {}, e.props && Bn(e.props, this, this.props), this.key = e.key ? e.key.key : Hn("plugin");
	}
	getState(e) {
		return e[this.key];
	}
}, Vn = Object.create(null);
function Hn(e) {
	return e in Vn ? e + "$" + ++Vn[e] : (Vn[e] = 0, e + "$");
}
var M = class {
	constructor(e = "key") {
		this.key = Hn(e);
	}
	get(e) {
		return e.config.pluginsByKey[this.key];
	}
	getState(e) {
		return e[this.key];
	}
}, Un = (e, t) => e.selection.empty ? !1 : (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function Wn(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var Gn = (e, t, n) => {
	let r = Wn(e, n);
	if (!r) return !1;
	let i = Zn(r);
	if (!i) {
		let n = r.blockRange(), i = n && Pt(n);
		return i == null ? !1 : (t && t(e.tr.lift(n, i).scrollIntoView()), !0);
	}
	let a = i.nodeBefore;
	if (hr(e, i, t, -1)) return !0;
	if (r.parent.content.size == 0 && (Yn(a, "end") || A.isSelectable(a))) for (let n = r.depth;; n--) {
		let o = tn(e.doc, r.before(n), r.after(n), b.empty);
		if (o && o.slice.size < o.to - o.from) {
			if (t) {
				let n = e.tr.step(o);
				n.setSelection(Yn(a, "end") ? O.findFrom(n.doc.resolve(n.mapping.map(i.pos, -1)), -1) : A.create(n.doc, i.pos - a.nodeSize)), t(n.scrollIntoView());
			}
			return !0;
		}
		if (n == 1 || r.node(n - 1).childCount > 1) break;
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos - a.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Kn = (e, t, n) => {
	let r = Wn(e, n);
	if (!r) return !1;
	let i = Zn(r);
	return i ? Jn(e, i, t) : !1;
}, qn = (e, t, n) => {
	let r = Qn(e, n);
	if (!r) return !1;
	let i = tr(r);
	return i ? Jn(e, i, t) : !1;
};
function Jn(e, t, n) {
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
	let s = tn(e.doc, i, o, b.empty);
	if (!s || s.from != i || s instanceof Dt && s.slice.size >= o - i) return !1;
	if (n) {
		let t = e.tr.step(s);
		t.setSelection(k.create(t.doc, i)), n(t.scrollIntoView());
	}
	return !0;
}
function Yn(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var Xn = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("backward", e) : r.parentOffset > 0) return !1;
		a = Zn(r);
	}
	let o = a && a.nodeBefore;
	return !o || !A.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(A.create(e.doc, a.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Zn(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function Qn(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var $n = (e, t, n) => {
	let r = Qn(e, n);
	if (!r) return !1;
	let i = tr(r);
	if (!i) return !1;
	let a = i.nodeAfter;
	if (hr(e, i, t, 1)) return !0;
	if (r.parent.content.size == 0 && (Yn(a, "start") || A.isSelectable(a))) {
		let n = tn(e.doc, r.before(), r.after(), b.empty);
		if (n && n.slice.size < n.to - n.from) {
			if (t) {
				let r = e.tr.step(n);
				r.setSelection(Yn(a, "start") ? O.findFrom(r.doc.resolve(r.mapping.map(i.pos)), 1) : A.create(r.doc, r.mapping.map(i.pos))), t(r.scrollIntoView());
			}
			return !0;
		}
	}
	return a.isAtom && i.depth == r.depth - 1 ? (t && t(e.tr.delete(i.pos, i.pos + a.nodeSize).scrollIntoView()), !0) : !1;
}, er = (e, t, n) => {
	let { $head: r, empty: i } = e.selection, a = r;
	if (!i) return !1;
	if (r.parent.isTextblock) {
		if (n ? !n.endOfTextblock("forward", e) : r.parentOffset < r.parent.content.size) return !1;
		a = tr(r);
	}
	let o = a && a.nodeAfter;
	return !o || !A.isSelectable(o) ? !1 : (t && t(e.tr.setSelection(A.create(e.doc, a.pos)).scrollIntoView()), !0);
};
function tr(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var nr = (e, t) => {
	let n = e.selection, r = n instanceof A, i;
	if (r) {
		if (n.node.isTextblock || !Jt(e.doc, n.from)) return !1;
		i = n.from;
	} else if (i = Zt(e.doc, n.from, -1), i == null) return !1;
	if (t) {
		let n = e.tr.join(i);
		r && n.setSelection(A.create(n.doc, i - e.doc.resolve(i).nodeBefore.nodeSize)), t(n.scrollIntoView());
	}
	return !0;
}, rr = (e, t) => {
	let n = e.selection, r;
	if (n instanceof A) {
		if (n.node.isTextblock || !Jt(e.doc, n.to)) return !1;
		r = n.to;
	} else if (r = Zt(e.doc, n.to, 1), r == null) return !1;
	return t && t(e.tr.join(r).scrollIntoView()), !0;
}, ir = (e, t) => {
	let { $from: n, $to: r } = e.selection, i = n.blockRange(r), a = i && Pt(i);
	return a == null ? !1 : (t && t(e.tr.lift(i, a).scrollIntoView()), !0);
}, ar = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function or(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var sr = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), a = n.indexAfter(-1), o = or(i.contentMatchAt(a));
	if (!o || !i.canReplaceWith(a, a, o)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, o.createAndFill());
		i.setSelection(O.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, cr = (e, t) => {
	let n = e.selection, { $from: r, $to: i } = n;
	if (n instanceof Dn || r.parent.inlineContent || i.parent.inlineContent) return !1;
	let a = or(i.parent.contentMatchAt(i.indexAfter()));
	if (!a || !a.isTextblock) return !1;
	if (t) {
		let n = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = e.tr.insert(n, a.createAndFill());
		o.setSelection(k.create(o.doc, n + 1)), t(o.scrollIntoView());
	}
	return !0;
}, lr = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (Kt(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && Pt(r);
	return i == null ? !1 : (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function ur(e) {
	return (t, n) => {
		let { $from: r, $to: i } = t.selection;
		if (t.selection instanceof A && t.selection.node.isBlock) return !r.parentOffset || !Kt(t.doc, r.pos) ? !1 : (n && n(t.tr.split(r.pos).scrollIntoView()), !0);
		if (!r.depth) return !1;
		let a = [], o, s, c = !1, l = !1;
		for (let t = r.depth;; t--) if (r.node(t).isBlock) {
			c = r.end(t) == r.pos + (r.depth - t), l = r.start(t) == r.pos - (r.depth - t), s = or(r.node(t - 1).contentMatchAt(r.indexAfter(t - 1)));
			let n = e && e(i.parent, c, r);
			a.unshift(n || (c && s ? { type: s } : null)), o = t;
			break;
		} else {
			if (t == 1) return !1;
			a.unshift(null);
		}
		let u = t.tr;
		(t.selection instanceof k || t.selection instanceof Dn) && u.deleteSelection();
		let d = u.mapping.map(r.pos), f = Kt(u.doc, d, a.length, a);
		if (f ||= (a[0] = s ? { type: s } : null, Kt(u.doc, d, a.length, a)), !f) return !1;
		if (u.split(d, a.length, a), !c && l && r.node(o).type != s) {
			let e = u.mapping.map(r.before(o)), t = u.doc.resolve(e);
			s && r.node(o - 1).canReplaceWith(t.index(), t.index() + 1, s) && u.setNodeMarkup(u.mapping.map(r.before(o)), s);
		}
		return n && n(u.scrollIntoView()), !0;
	};
}
var dr = ur(), fr = (e, t) => {
	let { $from: n, to: r } = e.selection, i, a = n.sharedDepth(r);
	return a == 0 ? !1 : (i = n.before(a), t && t(e.tr.setSelection(A.create(e.doc, i))), !0);
}, pr = (e, t) => (t && t(e.tr.setSelection(new Dn(e.doc))), !0);
function mr(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || Jt(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function hr(e, t, n, r) {
	let i = t.nodeBefore, a = t.nodeAfter, o, s, c = i.type.spec.isolating || a.type.spec.isolating;
	if (!c && mr(e, t, n)) return !0;
	let l = !c && t.parent.canReplace(t.index(), t.index() + 1);
	if (l && (o = (s = i.contentMatchAt(i.childCount)).findWrapping(a.type)) && s.matchType(o[0] || a.type).validEnd) {
		if (n) {
			let r = t.pos + a.nodeSize, s = m.empty;
			for (let e = o.length - 1; e >= 0; e--) s = m.from(o[e].create(null, s));
			s = m.from(i.copy(s));
			let c = e.tr.step(new Ot(t.pos - 1, r, t.pos, r, new b(s, 1, 0), o.length, !0)), l = c.doc.resolve(r + 2 * o.length);
			l.nodeAfter && l.nodeAfter.type == i.type && Jt(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let u = a.type.spec.isolating || r > 0 && c ? null : O.findFrom(t, 1), d = u && u.$from.blockRange(u.$to), f = d && Pt(d);
	if (f != null && f >= t.depth) return n && n(e.tr.lift(d, f).scrollIntoView()), !0;
	if (l && Yn(a, "start", !0) && Yn(i, "end")) {
		let r = i, o = [];
		for (; o.push(r), !r.isTextblock;) r = r.lastChild;
		let s = a, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = m.empty;
				for (let e = o.length - 1; e >= 0; e--) r = m.from(o[e].copy(r));
				n(e.tr.step(new Ot(t.pos - o.length, t.pos + a.nodeSize, t.pos + c, t.pos + a.nodeSize - c, new b(r, o.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function gr(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(k.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var _r = gr(-1), vr = gr(1);
function yr(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a), s = o && It(o, e, t);
		return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
	};
}
function br(e, t = null) {
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
function xr(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var Sr = xr(Un, Gn, Xn), Cr = xr(Un, $n, er), wr = {
	Enter: xr(ar, cr, lr, dr),
	"Mod-Enter": sr,
	Backspace: Sr,
	"Mod-Backspace": Sr,
	"Shift-Backspace": Sr,
	Delete: Cr,
	"Mod-Delete": Cr,
	"Mod-a": pr
}, Tr = {
	"Ctrl-h": wr.Backspace,
	"Alt-Backspace": wr["Mod-Backspace"],
	"Ctrl-d": wr.Delete,
	"Ctrl-Alt-Backspace": wr["Mod-Delete"],
	"Alt-Delete": wr["Mod-Delete"],
	"Alt-d": wr["Mod-Delete"],
	"Ctrl-a": _r,
	"Ctrl-e": vr
};
for (let e in wr) Tr[e] = wr[e];
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform();
function Er(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return Dr(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function Dr(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new le(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new le(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = It(a, n, r, t);
	return s ? (e && Or(e, t, s, i, n), !0) : !1;
}
function Or(e, t, n, r, i) {
	let a = m.empty;
	for (let e = n.length - 1; e >= 0; e--) a = m.from(n[e].type.create(n[e].attrs, a));
	e.step(new Ot(t.start - (r ? 2 : 0), t.end, t.start, t.end, new b(a, 0, 0), n.length, !0));
	let o = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (o = e + 1);
	let s = n.length - o, c = t.start + n.length - (r ? 2 : 0), l = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && Kt(e.doc, c, s) && (e.split(c, s), c += 2 * s), c += l.child(n).nodeSize;
	return e;
}
function kr(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		return a ? n ? r.node(a.depth - 1).type == e ? Ar(t, n, e, a) : jr(t, n, a) : !0 : !1;
	};
}
function Ar(e, t, n, r) {
	let i = e.tr, a = r.end, o = r.$to.end(r.depth);
	a < o && (i.step(new Ot(a - 1, o, a, o, new b(m.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new le(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
	let s = Pt(r);
	if (s == null) return !1;
	i.lift(r, s);
	let c = i.doc.resolve(i.mapping.map(a, -1) - 1);
	return Jt(i.doc, c.pos) && c.nodeBefore.type == c.nodeAfter.type && i.join(c.pos), t(i.scrollIntoView()), !0;
}
function jr(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let a = r.doc.resolve(n.start), o = a.nodeAfter;
	if (r.mapping.map(n.end) != n.start + a.nodeAfter.nodeSize) return !1;
	let s = n.startIndex == 0, c = n.endIndex == i.childCount, l = a.node(-1), u = a.index(-1);
	if (!l.canReplace(u + +!s, u + 1, o.content.append(c ? m.empty : m.from(i)))) return !1;
	let d = a.pos, f = d + o.nodeSize;
	return r.step(new Ot(d - +!!s, f + +!!c, d + 1, f - 1, new b((s ? m.empty : m.from(i.copy(m.empty))).append(c ? m.empty : m.from(i.copy(m.empty))), +!s, +!c), +!s)), t(r.scrollIntoView()), !0;
}
function Mr(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && t.firstChild.type == e);
		if (!a) return !1;
		let o = a.startIndex;
		if (o == 0) return !1;
		let s = a.parent, c = s.child(o - 1);
		if (c.type != e) return !1;
		if (n) {
			let r = c.lastChild && c.lastChild.type == s.type, i = m.from(r ? e.create() : null), o = new b(m.from(e.create(null, m.from(s.type.create(null, i)))), r ? 3 : 1, 0), l = a.start, u = a.end;
			n(t.tr.step(new Ot(l - (r ? 3 : 1), u, l, u, o, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
//#endregion
//#region node_modules/prosemirror-view/dist/index.js
var Nr = function(e) {
	for (var t = 0;; t++) if (e = e.previousSibling, !e) return t;
}, Pr = function(e) {
	let t = e.assignedSlot || e.parentNode;
	return t && t.nodeType == 11 ? t.host : t;
}, Fr = null, Ir = function(e, t, n) {
	let r = Fr ||= document.createRange();
	return r.setEnd(e, n ?? e.nodeValue.length), r.setStart(e, t || 0), r;
}, Lr = function() {
	Fr = null;
}, Rr = function(e, t, n, r) {
	return n && (Br(e, t, n, r, -1) || Br(e, t, n, r, 1));
}, zr = /^(img|br|input|textarea|hr)$/i;
function Br(e, t, n, r, i) {
	for (;;) {
		if (e == n && t == r) return !0;
		if (t == (i < 0 ? 0 : Vr(e))) {
			let n = e.parentNode;
			if (!n || n.nodeType != 1 || Gr(e) || zr.test(e.nodeName) || e.contentEditable == "false") return !1;
			t = Nr(e) + (i < 0 ? 0 : 1), e = n;
		} else if (e.nodeType == 1) {
			let n = e.childNodes[t + (i < 0 ? -1 : 0)];
			if (n.nodeType == 1 && n.contentEditable == "false") if (n.pmViewDesc?.ignoreForSelection) t += i;
			else return !1;
			else e = n, t = i < 0 ? Vr(e) : 0;
		} else return !1;
	}
}
function Vr(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Hr(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t) return e;
		if (e.nodeType == 1 && t > 0) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t - 1], t = Vr(e);
		} else if (e.parentNode && !Gr(e)) t = Nr(e), e = e.parentNode;
		else return null;
	}
}
function Ur(e, t) {
	for (;;) {
		if (e.nodeType == 3 && t < e.nodeValue.length) return e;
		if (e.nodeType == 1 && t < e.childNodes.length) {
			if (e.contentEditable == "false") return null;
			e = e.childNodes[t], t = 0;
		} else if (e.parentNode && !Gr(e)) t = Nr(e) + 1, e = e.parentNode;
		else return null;
	}
}
function Wr(e, t, n) {
	for (let r = t == 0, i = t == Vr(e); r || i;) {
		if (e == n) return !0;
		let t = Nr(e);
		if (e = e.parentNode, !e) return !1;
		r &&= t == 0, i &&= t == Vr(e);
	}
}
function Gr(e) {
	let t;
	for (let n = e; n && !(t = n.pmViewDesc); n = n.parentNode);
	return t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e);
}
var Kr = function(e) {
	return e.focusNode && Rr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset);
};
function qr(e, t) {
	let n = document.createEvent("Event");
	return n.initEvent("keydown", !0, !0), n.keyCode = e, n.key = n.code = t, n;
}
function Jr(e) {
	let t = e.activeElement;
	for (; t && t.shadowRoot;) t = t.shadowRoot.activeElement;
	return t;
}
function Yr(e, t, n) {
	if (e.caretPositionFromPoint) try {
		let r = e.caretPositionFromPoint(t, n);
		if (r) return {
			node: r.offsetNode,
			offset: Math.min(Vr(r.offsetNode), r.offset)
		};
	} catch {}
	if (e.caretRangeFromPoint) {
		let r = e.caretRangeFromPoint(t, n);
		if (r) return {
			node: r.startContainer,
			offset: Math.min(Vr(r.startContainer), r.startOffset)
		};
	}
}
var Xr = typeof navigator < "u" ? navigator : null, Zr = typeof document < "u" ? document : null, Qr = Xr && Xr.userAgent || "", $r = /Edge\/(\d+)/.exec(Qr), ei = /MSIE \d/.exec(Qr), ti = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Qr), ni = !!(ei || ti || $r), ri = ei ? document.documentMode : ti ? +ti[1] : $r ? +$r[1] : 0, ii = !ni && /gecko\/(\d+)/i.test(Qr);
ii && +(/Firefox\/(\d+)/.exec(Qr) || [0, 0])[1];
var ai = !ni && /Chrome\/(\d+)/.exec(Qr), oi = !!ai, si = ai ? +ai[1] : 0, ci = !ni && !!Xr && /Apple Computer/.test(Xr.vendor), li = ci && (/Mobile\/\w+/.test(Qr) || !!Xr && Xr.maxTouchPoints > 2), ui = li || (Xr ? /Mac/.test(Xr.platform) : !1), di = Xr ? /Win/.test(Xr.platform) : !1, fi = /Android \d/.test(Qr), pi = !!Zr && "webkitFontSmoothing" in Zr.documentElement.style, mi = pi ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function hi(e) {
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
function gi(e, t) {
	return typeof e == "number" ? e : e[t];
}
function _i(e) {
	let t = e.getBoundingClientRect(), n = t.width / e.offsetWidth || 1, r = t.height / e.offsetHeight || 1;
	return {
		left: t.left,
		right: t.left + e.clientWidth * n,
		top: t.top,
		bottom: t.top + e.clientHeight * r
	};
}
function vi(e, t, n) {
	if (!Ni(t) && t.left == 0) return;
	let r = e.someProp("scrollThreshold") || 0, i = e.someProp("scrollMargin") || 5, a = e.dom.ownerDocument;
	for (let o = n || e.dom; o;) {
		if (o.nodeType != 1) {
			o = Pr(o);
			continue;
		}
		let e = o, n = e == a.body, s = n ? hi(a) : _i(e), c = 0, l = 0;
		if (t.top < s.top + gi(r, "top") ? l = -(s.top - t.top + gi(i, "top")) : t.bottom > s.bottom - gi(r, "bottom") && (l = t.bottom - t.top > s.bottom - s.top ? t.top + gi(i, "top") - s.top : t.bottom - s.bottom + gi(i, "bottom")), t.left < s.left + gi(r, "left") ? c = -(s.left - t.left + gi(i, "left")) : t.right > s.right - gi(r, "right") && (c = t.right - s.right + gi(i, "right")), c || l) if (n) a.defaultView.scrollBy(c, l);
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
		o = u == "absolute" ? o.offsetParent : Pr(o);
	}
}
function yi(e) {
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
		stack: bi(e.dom)
	};
}
function bi(e) {
	let t = [], n = e.ownerDocument;
	for (let r = e; r && (t.push({
		dom: r,
		top: r.scrollTop,
		left: r.scrollLeft
	}), e != n); r = Pr(r));
	return t;
}
function xi({ refDOM: e, refTop: t, stack: n }) {
	let r = e ? e.getBoundingClientRect().top : 0;
	Si(n, r == 0 ? 0 : r - t);
}
function Si(e, t) {
	for (let n = 0; n < e.length; n++) {
		let { dom: r, top: i, left: a } = e[n];
		r.scrollTop != i + t && (r.scrollTop = i + t), r.scrollLeft != a && (r.scrollLeft = a);
	}
}
var Ci = null;
function wi(e) {
	if (e.setActive) return e.setActive();
	if (Ci) return e.focus(Ci);
	let t = bi(e);
	e.focus(Ci == null ? { get preventScroll() {
		return Ci = { preventScroll: !0 }, !0;
	} } : void 0), Ci || (Ci = !1, Si(t, 0));
}
function Ti(e, t) {
	let n, r = 2e8, i, a = 0, o = t.top, s = t.top, c, l;
	for (let u = e.firstChild, d = 0; u; u = u.nextSibling, d++) {
		let e;
		if (u.nodeType == 1) e = u.getClientRects();
		else if (u.nodeType == 3) e = Ir(u).getClientRects();
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
	return !n && c && (n = c, i = l, r = 0), n && n.nodeType == 3 ? Ei(n, i) : !n || r && n.nodeType == 1 ? {
		node: e,
		offset: a
	} : Ti(n, i);
}
function Ei(e, t) {
	let n = e.nodeValue.length, r = document.createRange(), i;
	for (let a = 0; a < n; a++) {
		r.setEnd(e, a + 1), r.setStart(e, a);
		let n = Pi(r, 1);
		if (n.top != n.bottom && Di(t, n)) {
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
function Di(e, t) {
	return e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1;
}
function Oi(e, t) {
	let n = e.parentNode;
	return n && /^li$/i.test(n.nodeName) && t.left < e.getBoundingClientRect().left ? n : e;
}
function ki(e, t, n) {
	let { node: r, offset: i } = Ti(t, n), a = -1;
	if (r.nodeType == 1 && !r.firstChild) {
		let e = r.getBoundingClientRect();
		a = e.left != e.right && n.left > (e.left + e.right) / 2 ? 1 : -1;
	}
	return e.docView.posFromDOM(r, i, a);
}
function Ai(e, t, n, r) {
	let i = -1;
	for (let n = t, a = !1; n != e.dom;) {
		let t = e.docView.nearestDesc(n, !0), o;
		if (!t) return null;
		if (t.dom.nodeType == 1 && (t.node.isBlock && t.parent || !t.contentDOM) && ((o = t.dom.getBoundingClientRect()).width || o.height) && (t.node.isBlock && t.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(t.dom.nodeName) && (!a && o.left > r.left || o.top > r.top ? i = t.posBefore : (!a && o.right < r.left || o.bottom < r.top) && (i = t.posAfter), a = !0), !t.contentDOM && i < 0 && !t.node.isText)) return (t.node.isBlock ? r.top < (o.top + o.bottom) / 2 : r.left < (o.left + o.right) / 2) ? t.posBefore : t.posAfter;
		n = t.dom.parentNode;
	}
	return i > -1 ? i : e.docView.posFromDOM(t, n, -1);
}
function ji(e, t, n) {
	let r = e.childNodes.length;
	if (r && n.top < n.bottom) for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (t.top - n.top) / (n.bottom - n.top)) - 2)), a = i;;) {
		let n = e.childNodes[a];
		if (n.nodeType == 1) {
			let e = n.getClientRects();
			for (let r = 0; r < e.length; r++) {
				let i = e[r];
				if (Di(t, i)) return ji(n, t, i);
			}
		}
		if ((a = (a + 1) % r) == i) break;
	}
	return e;
}
function Mi(e, t) {
	let n = e.dom.ownerDocument, r, i = 0, a = Yr(n, t.left, t.top);
	a && ({node: r, offset: i} = a);
	let o = (e.root.elementFromPoint ? e.root : n).elementFromPoint(t.left, t.top), s;
	if (!o || !e.dom.contains(o.nodeType == 1 ? o : o.parentNode)) {
		let n = e.dom.getBoundingClientRect();
		if (!Di(t, n) || (o = ji(e.dom, t, n), !o)) return null;
	}
	if (ci) for (let e = o; r && e; e = Pr(e)) e.draggable && (r = void 0);
	if (o = Oi(o, t), r) {
		if (ii && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
			let e = r.childNodes[i], n;
			e.nodeName == "IMG" && (n = e.getBoundingClientRect()).right <= t.left && n.bottom > t.top && i++;
		}
		let n;
		pi && i && r.nodeType == 1 && (n = r.childNodes[i - 1]).nodeType == 1 && n.contentEditable == "false" && n.getBoundingClientRect().top >= t.top && i--, r == e.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && t.top > r.lastChild.getBoundingClientRect().bottom ? s = e.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = Ai(e, r, i, t));
	}
	s ??= ki(e, o, t);
	let c = e.docView.nearestDesc(o, !0);
	return {
		pos: s,
		inside: c ? c.posAtStart - c.border : -1
	};
}
function Ni(e) {
	return e.top < e.bottom || e.left < e.right;
}
function Pi(e, t) {
	let n = e.getClientRects();
	if (n.length) {
		let e = n[t < 0 ? 0 : n.length - 1];
		if (Ni(e)) return e;
	}
	return Array.prototype.find.call(n, Ni) || e.getBoundingClientRect();
}
var Fi = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Ii(e, t, n) {
	let { node: r, offset: i, atom: a } = e.docView.domFromPos(t, n < 0 ? -1 : 1), o = pi || ii;
	if (r.nodeType == 3) if (o && (Fi.test(r.nodeValue) || (n < 0 ? !i : i == r.nodeValue.length))) {
		let e = Pi(Ir(r, i, i), n);
		if (ii && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
			let t = Pi(Ir(r, i - 1, i - 1), -1);
			if (t.top == e.top) {
				let n = Pi(Ir(r, i, i + 1), -1);
				if (n.top != e.top) return Li(n, n.left < t.left);
			}
		}
		return e;
	} else {
		let e = i, t = i, a = n < 0 ? 1 : -1;
		return n < 0 && !i ? (t++, a = -1) : n >= 0 && i == r.nodeValue.length ? (e--, a = 1) : n < 0 ? e-- : t++, Li(Pi(Ir(r, e, t), a), a < 0);
	}
	if (!e.state.doc.resolve(t - (a || 0)).parent.inlineContent) {
		if (a == null && i && (n < 0 || i == Vr(r))) {
			let e = r.childNodes[i - 1];
			if (e.nodeType == 1) return Ri(e.getBoundingClientRect(), !1);
		}
		if (a == null && i < Vr(r)) {
			let e = r.childNodes[i];
			if (e.nodeType == 1) return Ri(e.getBoundingClientRect(), !0);
		}
		return Ri(r.getBoundingClientRect(), n >= 0);
	}
	if (a == null && i && (n < 0 || i == Vr(r))) {
		let e = r.childNodes[i - 1], t = e.nodeType == 3 ? Ir(e, Vr(e) - +!o) : e.nodeType == 1 && (e.nodeName != "BR" || !e.nextSibling) ? e : null;
		if (t) return Li(Pi(t, 1), !1);
	}
	if (a == null && i < Vr(r)) {
		let e = r.childNodes[i];
		for (; e.pmViewDesc && e.pmViewDesc.ignoreForCoords;) e = e.nextSibling;
		let t = e ? e.nodeType == 3 ? Ir(e, 0, +!o) : e.nodeType == 1 ? e : null : null;
		if (t) return Li(Pi(t, -1), !0);
	}
	return Li(Pi(r.nodeType == 3 ? Ir(r) : r, -n), n >= 0);
}
function Li(e, t) {
	if (e.width == 0) return e;
	let n = t ? e.left : e.right;
	return {
		top: e.top,
		bottom: e.bottom,
		left: n,
		right: n
	};
}
function Ri(e, t) {
	if (e.height == 0) return e;
	let n = t ? e.top : e.bottom;
	return {
		top: n,
		bottom: n,
		left: e.left,
		right: e.right
	};
}
function zi(e, t, n) {
	let r = e.state, i = e.root.activeElement;
	r != t && e.updateState(t), i != e.dom && e.focus();
	try {
		return n();
	} finally {
		r != t && e.updateState(r), i != e.dom && i && i.focus();
	}
}
function Bi(e, t, n) {
	let r = t.selection, i = n == "up" ? r.$from : r.$to;
	return zi(e, t, () => {
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
		let r = Ii(e, i.pos, 1);
		for (let e = t.firstChild; e; e = e.nextSibling) {
			let t;
			if (e.nodeType == 1) t = e.getClientRects();
			else if (e.nodeType == 3) t = Ir(e, 0, e.nodeValue.length).getClientRects();
			else continue;
			for (let e = 0; e < t.length; e++) {
				let i = t[e];
				if (i.bottom > i.top + 1 && (n == "up" ? r.top - i.top > (i.bottom - r.top) * 2 : i.bottom - r.bottom > (r.bottom - i.top) * 2)) return !1;
			}
		}
		return !0;
	});
}
var Vi = /[\u0590-\u08ac]/;
function Hi(e, t, n) {
	let { $head: r } = t.selection;
	if (!r.parent.isTextblock) return !1;
	let i = r.parentOffset, a = !i, o = i == r.parent.content.size, s = e.domSelection();
	return s ? !Vi.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? a : o : zi(e, t, () => {
		let { focusNode: t, focusOffset: i, anchorNode: a, anchorOffset: o } = e.domSelectionRange(), c = s.caretBidiLevel;
		s.modify("move", n, "character");
		let l = r.depth ? e.docView.domAfterPos(r.before()) : e.dom, { focusNode: u, focusOffset: d } = e.domSelectionRange(), f = u && !l.contains(u.nodeType == 1 ? u : u.parentNode) || t == u && i == d;
		try {
			s.collapse(a, o), t && (t != a || i != o) && s.extend && s.extend(t, i);
		} catch {}
		return c != null && (s.caretBidiLevel = c), f;
	}) : r.pos == r.start() || r.pos == r.end();
}
var Ui = null, Wi = null, Gi = !1;
function Ki(e, t, n) {
	return Ui == t && Wi == n ? Gi : (Ui = t, Wi = n, Gi = n == "up" || n == "down" ? Bi(e, t, n) : Hi(e, t, n));
}
var qi = 0, Ji = 1, Yi = 2, Xi = 3, Zi = class {
	constructor(e, t, n, r) {
		this.parent = e, this.children = t, this.dom = n, this.contentDOM = r, this.dirty = qi, n.pmViewDesc = this;
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
		if (e == this.dom && this.contentDOM) r = t > Nr(this.contentDOM);
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
			if (a > e || i instanceof ia) {
				r = e - t;
				break;
			}
			t = a;
		}
		if (r) return this.children[n].domFromPos(r - this.children[n].border, t);
		for (let e; n && !(e = this.children[n - 1]).size && e instanceof Qi && e.side >= 0; n--);
		if (t <= 0) {
			let e, r = !0;
			for (; e = n ? this.children[n - 1] : null, !(!e || e.dom.parentNode == this.contentDOM); n--, r = !1);
			return e && t && r && !e.border && !e.domAtom ? e.domFromPos(e.size, t) : {
				node: this.contentDOM,
				offset: e ? Nr(e.dom) + 1 : 0
			};
		} else {
			let e, r = !0;
			for (; e = n < this.children.length ? this.children[n] : null, !(!e || e.dom.parentNode == this.contentDOM); n++, r = !1);
			return e && r && !e.border && !e.domAtom ? e.domFromPos(0, t) : {
				node: this.contentDOM,
				offset: e ? Nr(e.dom) : this.contentDOM.childNodes.length
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
						r = Nr(n.dom) + 1;
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
						i = Nr(n.dom);
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
		if ((ii || ci) && e == t) {
			let { node: e, offset: t } = o;
			if (e.nodeType == 3) {
				if (u = !!(t && e.nodeValue[t - 1] == "\n"), u && t == e.nodeValue.length) for (let t = e, n; t; t = t.parentNode) {
					if (n = t.nextSibling) {
						n.nodeName == "BR" && (o = s = {
							node: n.parentNode,
							offset: Nr(n) + 1
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
		if (ii && l.focusNode && l.focusNode != s.node && l.focusNode.nodeType == 1) {
			let e = l.focusNode.childNodes[l.focusOffset];
			e && e.contentEditable == "false" && (r = !0);
		}
		if (!(r || u && ci) && Rr(o.node, o.offset, l.anchorNode, l.anchorOffset) && Rr(s.node, s.offset, l.focusNode, l.focusOffset)) return;
		let d = !1;
		if ((c.extend || e == t) && !(u && ii)) {
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
					this.dirty = e == n || t == a ? Yi : Ji, e == r && t == o && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Xi : i.markDirty(e - r, t - r);
					return;
				} else i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? Yi : Xi;
			}
			n = a;
		}
		this.dirty = Yi;
	}
	markParentsDirty() {
		let e = 1;
		for (let t = this.parent; t; t = t.parent, e++) {
			let n = e == 1 ? Yi : Ji;
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
}, Qi = class extends Zi {
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
		return this.dirty == qi && e.type.eq(this.widget.type);
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
}, $i = class extends Zi {
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
}, ea = class e extends Zi {
	constructor(e, t, n, r, i) {
		super(e, [], n, r), this.mark = t, this.spec = i;
	}
	static create(t, n, r, i) {
		let a = i.nodeViews[n.type.name], o = a && a(n, i, r);
		return (!o || !o.dom) && (o = et.renderSpec(document, n.type.spec.toDOM(n, r), null, n.attrs)), new e(t, n, o.dom, o.contentDOM || o.dom, o);
	}
	parseRule() {
		return this.dirty & Xi || this.mark.type.spec.reparseInView ? null : {
			mark: this.mark.type.name,
			attrs: this.mark.attrs,
			contentElement: this.contentDOM
		};
	}
	matchesMark(e) {
		return this.dirty != Xi && this.mark.eq(e);
	}
	markDirty(e, t) {
		if (super.markDirty(e, t), this.dirty != qi) {
			let e = this.parent;
			for (; !e.node;) e = e.parent;
			e.dirty < this.dirty && (e.dirty = this.dirty), this.dirty = qi;
		}
	}
	slice(t, n, r) {
		let i = e.create(this.parent, this.mark, !0, r), a = this.children, o = this.size;
		n < o && (a = xa(a, n, o, r)), t > 0 && (a = xa(a, 0, t, r));
		for (let e = 0; e < a.length; e++) a[e].parent = i;
		return i.children = a, i;
	}
	ignoreMutation(e) {
		return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
	}
	destroy() {
		this.spec.destroy && this.spec.destroy(), super.destroy();
	}
}, ta = class e extends Zi {
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
			let e = et.renderSpec(document, n.type.spec.toDOM(n), null, n.attrs);
			({dom: u, contentDOM: d} = e);
		}
		!d && !n.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), n.type.spec.draggable && (u.draggable = !0));
		let f = u;
		return u = fa(u, r, n), l ? c = new aa(t, n, r, i, u, d || null, f, l) : n.isText ? new ra(t, n, r, i, u, f) : new e(t, n, r, i, u, d || null, f);
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
				n ? t.contentElement = n : t.getContent = () => m.empty;
			}
		}
		return t;
	}
	matchesNode(e, t, n) {
		return this.dirty == qi && e.eq(this.node) && pa(t, this.outerDeco) && n.eq(this.innerDeco);
	}
	get size() {
		return this.node.nodeSize;
	}
	get border() {
		return +!this.node.isLeaf;
	}
	updateChildren(e, t) {
		let n = this.node.inlineContent, r = t, i = e.composing ? this.localCompositionInfo(e, t) : null, a = i && i.pos > -1 ? i : null, o = i && i.pos < 0, s = new ha(this, a && a.node, e);
		va(this.node, this.innerDeco, (t, i, a) => {
			t.spec.marks ? s.syncToMarks(t.spec.marks, n, e, i) : t.type.side >= 0 && !a && s.syncToMarks(i == this.node.childCount ? v.none : this.node.child(i).marks, n, e, i), s.placeWidget(t, e, r);
		}, (t, a, c, l) => {
			s.syncToMarks(t.marks, n, e, l);
			let u;
			s.findNodeMatch(t, a, c, l) || o && e.state.selection.from > r && e.state.selection.to < r + t.nodeSize && (u = s.findIndexWithChild(i.node)) > -1 && s.updateNodeAt(t, a, c, u, e) || s.updateNextNode(t, a, c, e, l, r) || s.addNode(t, a, c, e, r), r += t.nodeSize;
		}), s.syncToMarks([], n, e, 0), this.node.isTextblock && s.addTextblockHacks(), s.destroyRest(), (s.changed || this.dirty == Yi) && (a && this.protectLocalComposition(e, a), oa(this.contentDOM, this.children, e), li && ya(this.dom));
	}
	localCompositionInfo(e, t) {
		let { from: n, to: r } = e.state.selection;
		if (!(e.state.selection instanceof k) || n < t || r > t + this.node.content.size) return null;
		let i = e.input.compositionNode;
		if (!i || !this.dom.contains(i.parentNode)) return null;
		if (this.node.inlineContent) {
			let e = i.nodeValue, a = ba(this.node.content, e, n - t, r - t);
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
		let a = new $i(this, i, t, r);
		e.input.compositionNodes.push(a), this.children = xa(this.children, n, n + r.length, e, a);
	}
	update(e, t, n, r) {
		return this.dirty == Xi || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, n, r), !0);
	}
	updateInner(e, t, n, r) {
		this.updateOuterDeco(t), this.node = e, this.innerDeco = n, this.contentDOM && this.updateChildren(r, this.posAtStart), this.dirty = qi;
	}
	updateOuterDeco(e) {
		if (pa(e, this.outerDeco)) return;
		let t = this.nodeDOM.nodeType != 1, n = this.dom;
		this.dom = ua(this.dom, this.nodeDOM, la(this.outerDeco, this.node, t), la(e, this.node, t)), this.dom != n && (n.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function na(e, t, n, r, i) {
	fa(r, t, e);
	let a = new ta(void 0, e, t, n, r, r, r);
	return a.contentDOM && a.updateChildren(i, 0), a;
}
var ra = class e extends ta {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i, null, a);
	}
	parseRule() {
		let e = this.nodeDOM.parentNode;
		for (; e && e != this.dom && !e.pmIsDeco;) e = e.parentNode;
		return { skip: e || !0 };
	}
	update(e, t, n, r) {
		return this.dirty == Xi || this.dirty != qi && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != qi || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, r.trackWrites == this.nodeDOM && (r.trackWrites = null)), this.node = e, this.dirty = qi, !0);
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
		super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Xi);
	}
	get domAtom() {
		return !1;
	}
	isText(e) {
		return this.node.text == e;
	}
}, ia = class extends Zi {
	parseRule() {
		return { ignore: !0 };
	}
	matchesHack(e) {
		return this.dirty == qi && this.dom.nodeName == e;
	}
	get domAtom() {
		return !0;
	}
	get ignoreForCoords() {
		return this.dom.nodeName == "IMG";
	}
}, aa = class extends ta {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, t, n, r, i, a, o), this.spec = s;
	}
	update(e, t, n, r) {
		if (this.dirty == Xi) return !1;
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
function oa(e, t, n) {
	let r = e.firstChild, i = !1;
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = o.dom;
		if (s.parentNode == e) {
			for (; s != r;) r = ma(r), i = !0;
			r = r.nextSibling;
		} else i = !0, e.insertBefore(s, r);
		if (o instanceof ea) {
			let t = r ? r.previousSibling : e.lastChild;
			oa(o.contentDOM, o.children, n), r = t ? t.nextSibling : e.firstChild;
		}
	}
	for (; r;) r = ma(r), i = !0;
	i && n.trackWrites == e && (n.trackWrites = null);
}
var sa = function(e) {
	e && (this.nodeName = e);
};
sa.prototype = Object.create(null);
var ca = [new sa()];
function la(e, t, n) {
	if (e.length == 0) return ca;
	let r = n ? ca[0] : new sa(), i = [r];
	for (let a = 0; a < e.length; a++) {
		let o = e[a].type.attrs;
		if (o) {
			o.nodeName && i.push(r = new sa(o.nodeName));
			for (let e in o) {
				let a = o[e];
				a != null && (n && i.length == 1 && i.push(r = new sa(t.isInline ? "span" : "div")), e == "class" ? r.class = (r.class ? r.class + " " : "") + a : e == "style" ? r.style = (r.style ? r.style + ";" : "") + a : e != "nodeName" && (r[e] = a));
			}
		}
	}
	return i;
}
function ua(e, t, n, r) {
	if (n == ca && r == ca) return t;
	let i = t;
	for (let t = 0; t < r.length; t++) {
		let a = r[t], o = n[t];
		if (t) {
			let t;
			o && o.nodeName == a.nodeName && i != e && (t = i.parentNode) && t.nodeName.toLowerCase() == a.nodeName ? i = t : (t = document.createElement(a.nodeName), t.pmIsDeco = !0, t.appendChild(i), o = ca[0], i = t);
		}
		da(i, o || ca[0], a);
	}
	return i;
}
function da(e, t, n) {
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
function fa(e, t, n) {
	return ua(e, e, ca, la(t, n, e.nodeType != 1));
}
function pa(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!e[n].type.eq(t[n].type)) return !1;
	return !0;
}
function ma(e) {
	let t = e.nextSibling;
	return e.parentNode.removeChild(e), t;
}
var ha = class {
	constructor(e, t, n) {
		this.lock = t, this.view = n, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = ga(e.node.content, e);
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
		for (; i < a;) this.destroyRest(), this.top.dirty = qi, this.index = this.stack.pop(), this.top = this.stack.pop(), a--;
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
				t instanceof ea && t.dirty != Xi && t.mark.type == e[a].type && t.spec.update && !this.isLocked(t.dom) && t.spec.update(e[a]) && (t.mark = e[a], i = this.index, this.changed = !0);
			}
			if (i > -1) i > this.index && (this.changed = !0, this.destroyBetween(this.index, i)), this.top = this.top.children[this.index];
			else {
				let r = ea.create(this.top, e[a], t, n);
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
		return a.dirty == Xi && a.dom == a.contentDOM && (a.dirty = Yi), a.update(e, t, n, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1;
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
			if (s instanceof ta) {
				let c = this.preMatch.matched.get(s);
				if (c != null && c != i) return !1;
				let l = s.dom, u, d = this.isLocked(l) && !(e.isText && s.node && s.node.isText && s.nodeDOM.nodeValue == e.text && s.dirty != Xi && pa(t, s.outerDeco));
				if (!d && s.update(e, t, n, r)) return this.destroyBetween(this.index, o), s.dom != l && (this.changed = !0), this.index++, !0;
				if (!d && (u = this.recreateWrapper(s, e, t, n, r, a))) return this.destroyBetween(this.index, o), this.top.children[this.index] = u, u.contentDOM && (u.dirty = Yi, u.updateChildren(r, a + 1), u.dirty = qi), this.changed = !0, this.index++, !0;
				break;
			}
		}
		return !1;
	}
	recreateWrapper(e, t, n, r, i, a) {
		if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !pa(n, e.outerDeco) || !r.eq(e.innerDeco)) return null;
		let o = ta.create(this.top, t, n, r, i, a);
		if (o.contentDOM) {
			o.children = e.children, e.children = [];
			for (let e of o.children) e.parent = o;
		}
		return e.destroy(), o;
	}
	addNode(e, t, n, r, i) {
		let a = ta.create(this.top, e, t, n, r, i);
		a.contentDOM && a.updateChildren(r, i + 1), this.top.children.splice(this.index++, 0, a), this.changed = !0;
	}
	placeWidget(e, t, n) {
		let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
		if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
		else {
			let r = new Qi(this.top, e, t, n);
			this.top.children.splice(this.index++, 0, r), this.changed = !0;
		}
	}
	addTextblockHacks() {
		let e = this.top.children[this.index - 1], t = this.top;
		for (; e instanceof ea;) t = e, e = t.children[t.children.length - 1];
		(!e || !(e instanceof ra) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((ci || oi) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
	}
	addHackNode(e, t) {
		if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e)) this.index++;
		else {
			let n = document.createElement(e);
			e == "IMG" && (n.className = "ProseMirror-separator", n.alt = ""), e == "BR" && (n.className = "ProseMirror-trailingBreak");
			let r = new ia(this.top, [], n, null);
			t == this.top ? t.children.splice(this.index++, 0, r) : t.children.push(r), this.changed = !0;
		}
	}
	isLocked(e) {
		return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
	}
};
function ga(e, t) {
	let n = t, r = n.children.length, i = e.childCount, a = /* @__PURE__ */ new Map(), o = [];
	outer: for (; i > 0;) {
		let s;
		for (;;) if (r) {
			let e = n.children[r - 1];
			if (e instanceof ea) n = e, r = e.children.length;
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
function _a(e, t) {
	return e.type.side - t.type.side;
}
function va(e, t, n, r) {
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
			d.sort(_a);
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
function ya(e) {
	if (e.nodeName == "UL" || e.nodeName == "OL") {
		let t = e.style.cssText;
		e.style.cssText = t + "; list-style: square !important", window.getComputedStyle(e).listStyle, e.style.cssText = t;
	}
}
function ba(e, t, n, r) {
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
function xa(e, t, n, r, i) {
	let a = [];
	for (let o = 0, s = 0; o < e.length; o++) {
		let c = e[o], l = s, u = s += c.size;
		l >= n || u <= t ? a.push(c) : (l < t && a.push(c.slice(0, t - l, r)), i &&= (a.push(i), void 0), u > n && a.push(c.slice(n - l, c.size, r)));
	}
	return a;
}
function Sa(e, t = null) {
	let n = e.domSelectionRange(), r = e.state.doc;
	if (!n.focusNode) return null;
	let i = e.docView.nearestDesc(n.focusNode), a = i && i.size == 0, o = e.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
	if (o < 0) return null;
	let s = r.resolve(o), c, l;
	if (Kr(n)) {
		for (c = o; i && !i.node;) i = i.parent;
		let e = i.node;
		if (i && e.isAtom && A.isSelectable(e) && i.parent && !(e.isInline && Wr(n.focusNode, n.focusOffset, i.dom))) {
			let e = i.posBefore;
			l = new A(o == e ? s : r.resolve(e));
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
		l = Na(e, u, s, n);
	}
	return l;
}
function Ca(e) {
	return e.editable ? e.hasFocus() : Fa(e) && document.activeElement && document.activeElement.contains(e.dom);
}
function wa(e, t = !1) {
	let n = e.state.selection;
	if (ja(e, n), !Ca(e)) return;
	let r = e.input.mouseDown;
	if (!t && oi && r) {
		let t = e.domSelectionRange(), n = e.domObserver.currentSelection;
		if (t.anchorNode && n.anchorNode && Rr(t.anchorNode, t.anchorOffset, n.anchorNode, n.anchorOffset) && r.delaySelUpdate()) {
			e.domObserver.setCurSelection();
			return;
		}
	}
	if (e.domObserver.disconnectSelection(), e.cursorWrapper) Aa(e);
	else {
		let { anchor: r, head: i } = n, a, o;
		Ta && !(n instanceof k) && (n.$from.parent.inlineContent || (a = Ea(e, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = Ea(e, n.to))), e.docView.setSelection(r, i, e, t), Ta && (a && Oa(a), o && Oa(o)), n.visible ? e.dom.classList.remove("ProseMirror-hideselection") : (e.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && ka(e));
	}
	e.domObserver.setCurSelection(), e.domObserver.connectSelection();
}
var Ta = ci || oi && si < 63;
function Ea(e, t) {
	let { node: n, offset: r } = e.docView.domFromPos(t, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, a = r ? n.childNodes[r - 1] : null;
	if (ci && i && i.contentEditable == "false") return Da(i);
	if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
		if (i) return Da(i);
		if (a) return Da(a);
	}
}
function Da(e) {
	return e.contentEditable = "true", ci && e.draggable && (e.draggable = !1, e.wasDraggable = !0), e;
}
function Oa(e) {
	e.contentEditable = "false", e.wasDraggable &&= (e.draggable = !0, null);
}
function ka(e) {
	let t = e.dom.ownerDocument;
	t.removeEventListener("selectionchange", e.input.hideSelectionGuard);
	let n = e.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
	t.addEventListener("selectionchange", e.input.hideSelectionGuard = () => {
		(n.anchorNode != r || n.anchorOffset != i) && (t.removeEventListener("selectionchange", e.input.hideSelectionGuard), setTimeout(() => {
			(!Ca(e) || e.state.selection.visible) && e.dom.classList.remove("ProseMirror-hideselection");
		}, 20));
	});
}
function Aa(e) {
	let t = e.domSelection();
	if (!t) return;
	let n = e.cursorWrapper.dom, r = n.nodeName == "IMG";
	r ? t.collapse(n.parentNode, Nr(n) + 1) : t.collapse(n, 0), !r && !e.state.selection.visible && ni && ri <= 11 && (n.disabled = !0, n.disabled = !1);
}
function ja(e, t) {
	if (t instanceof A) {
		let n = e.docView.descAt(t.from);
		n != e.lastSelectedViewDesc && (Ma(e), n && n.selectNode(), e.lastSelectedViewDesc = n);
	} else Ma(e);
}
function Ma(e) {
	e.lastSelectedViewDesc &&= (e.lastSelectedViewDesc.parent && e.lastSelectedViewDesc.deselectNode(), void 0);
}
function Na(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || k.between(t, n, r);
}
function Pa(e) {
	return e.editable && !e.hasFocus() ? !1 : Fa(e);
}
function Fa(e) {
	let t = e.domSelectionRange();
	if (!t.anchorNode) return !1;
	try {
		return e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode));
	} catch {
		return !1;
	}
}
function Ia(e) {
	let t = e.docView.domFromPos(e.state.selection.anchor, 0), n = e.domSelectionRange();
	return Rr(t.node, t.offset, n.anchorNode, n.anchorOffset);
}
function La(e, t) {
	let { $anchor: n, $head: r } = e.selection, i = t > 0 ? n.max(r) : n.min(r), a = i.parent.inlineContent ? i.depth ? e.doc.resolve(t > 0 ? i.after() : i.before()) : null : i;
	return a && O.findFrom(a, t);
}
function Ra(e, t) {
	return e.dispatch(e.state.tr.setSelection(t).scrollIntoView()), !0;
}
function za(e, t, n) {
	let r = e.state.selection;
	if (r instanceof k) {
		if (n.indexOf("s") > -1) {
			let { $head: n } = r, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter;
			if (!i || i.isText || !i.isLeaf) return !1;
			let a = e.state.doc.resolve(n.pos + i.nodeSize * (t < 0 ? -1 : 1));
			return Ra(e, new k(r.$anchor, a));
		} else if (!r.empty) return !1;
		else if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
			let n = La(e.state, t);
			return n && n instanceof A ? Ra(e, n) : !1;
		} else if (!(ui && n.indexOf("m") > -1)) {
			let n = r.$head, i = n.textOffset ? null : t < 0 ? n.nodeBefore : n.nodeAfter, a;
			if (!i || i.isText) return !1;
			let o = t < 0 ? n.pos - i.nodeSize : n.pos;
			return i.isAtom || (a = e.docView.descAt(o)) && !a.contentDOM ? A.isSelectable(i) ? Ra(e, new A(t < 0 ? e.state.doc.resolve(n.pos - i.nodeSize) : n)) : pi ? Ra(e, new k(e.state.doc.resolve(t < 0 ? o : o + i.nodeSize))) : !1 : !1;
		}
	} else if (r instanceof A && r.node.isInline) return Ra(e, new k(t > 0 ? r.$to : r.$from));
	else {
		let n = La(e.state, t);
		return n ? Ra(e, n) : !1;
	}
}
function Ba(e) {
	return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
}
function Va(e, t) {
	let n = e.pmViewDesc;
	return n && n.size == 0 && (t < 0 || e.nextSibling || e.nodeName != "BR");
}
function Ha(e, t) {
	return t < 0 ? Ua(e) : Wa(e);
}
function Ua(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i, a, o = !1;
	for (ii && n.nodeType == 1 && r < Ba(n) && Va(n.childNodes[r], -1) && (o = !0);;) if (r > 0) {
		if (n.nodeType != 1) break;
		{
			let e = n.childNodes[r - 1];
			if (Va(e, -1)) i = n, a = --r;
			else if (e.nodeType == 3) n = e, r = n.nodeValue.length;
			else break;
		}
	} else if (Ga(n)) break;
	else {
		let t = n.previousSibling;
		for (; t && Va(t, -1);) i = n.parentNode, a = Nr(t), t = t.previousSibling;
		if (t) n = t, r = Ba(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = 0;
		}
	}
	o ? Ja(e, n, r) : i && Ja(e, i, a);
}
function Wa(e) {
	let t = e.domSelectionRange(), n = t.focusNode, r = t.focusOffset;
	if (!n) return;
	let i = Ba(n), a, o;
	for (;;) if (r < i) {
		if (n.nodeType != 1) break;
		let e = n.childNodes[r];
		if (Va(e, 1)) a = n, o = ++r;
		else break;
	} else if (Ga(n)) break;
	else {
		let t = n.nextSibling;
		for (; t && Va(t, 1);) a = t.parentNode, o = Nr(t) + 1, t = t.nextSibling;
		if (t) n = t, r = 0, i = Ba(n);
		else {
			if (n = n.parentNode, n == e.dom) break;
			r = i = 0;
		}
	}
	a && Ja(e, a, o);
}
function Ga(e) {
	let t = e.pmViewDesc;
	return t && t.node && t.node.isBlock;
}
function Ka(e, t) {
	for (; e && t == e.childNodes.length && !Gr(e);) t = Nr(e) + 1, e = e.parentNode;
	for (; e && t < e.childNodes.length;) {
		let n = e.childNodes[t];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = 0;
	}
}
function qa(e, t) {
	for (; e && !t && !Gr(e);) t = Nr(e), e = e.parentNode;
	for (; e && t;) {
		let n = e.childNodes[t - 1];
		if (n.nodeType == 3) return n;
		if (n.nodeType == 1 && n.contentEditable == "false") break;
		e = n, t = e.childNodes.length;
	}
}
function Ja(e, t, n) {
	if (t.nodeType != 3) {
		let e, r;
		(r = Ka(t, n)) ? (t = r, n = 0) : (e = qa(t, n)) && (t = e, n = e.nodeValue.length);
	}
	let r = e.domSelection();
	if (!r) return;
	if (Kr(r)) {
		let e = document.createRange();
		e.setEnd(t, n), e.setStart(t, n), r.removeAllRanges(), r.addRange(e);
	} else r.extend && r.extend(t, n);
	e.domObserver.setCurSelection();
	let { state: i } = e;
	setTimeout(() => {
		e.state == i && wa(e);
	}, 50);
}
function Ya(e, t) {
	let n = e.state.doc.resolve(t);
	if (!(oi || di) && n.parent.inlineContent) {
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
function Xa(e, t, n) {
	let r = e.state.selection;
	if (r instanceof k && !r.empty || n.indexOf("s") > -1 || ui && n.indexOf("m") > -1) return !1;
	let { $from: i, $to: a } = r;
	if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
		let n = La(e.state, t);
		if (n && n instanceof A) return Ra(e, n);
	}
	if (!i.parent.inlineContent) {
		let n = t < 0 ? i : a, o = r instanceof Dn ? O.near(n, t) : O.findFrom(n, t);
		return o ? Ra(e, o) : !1;
	}
	return !1;
}
function Za(e, t) {
	if (!(e.state.selection instanceof k)) return !0;
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
function Qa(e, t, n) {
	e.domObserver.stop(), t.contentEditable = n, e.domObserver.start();
}
function $a(e) {
	if (!ci || e.state.selection.$head.parentOffset > 0) return !1;
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (t && t.nodeType == 1 && n == 0 && t.firstChild && t.firstChild.contentEditable == "false") {
		let n = t.firstChild;
		Qa(e, n, "true"), setTimeout(() => Qa(e, n, "false"), 20);
	}
	return !1;
}
function eo(e) {
	let t = "";
	return e.ctrlKey && (t += "c"), e.metaKey && (t += "m"), e.altKey && (t += "a"), e.shiftKey && (t += "s"), t;
}
function to(e, t) {
	let n = t.keyCode, r = eo(t);
	if (n == 8 || ui && n == 72 && r == "c") return Za(e, -1) || Ha(e, -1);
	if (n == 46 && !t.shiftKey || ui && n == 68 && r == "c") return Za(e, 1) || Ha(e, 1);
	if (n == 13 || n == 27) return !0;
	if (n == 37 || ui && n == 66 && r == "c") {
		let t = n == 37 ? Ya(e, e.state.selection.from) == "ltr" ? -1 : 1 : -1;
		return za(e, t, r) || Ha(e, t);
	} else if (n == 39 || ui && n == 70 && r == "c") {
		let t = n == 39 ? Ya(e, e.state.selection.from) == "ltr" ? 1 : -1 : 1;
		return za(e, t, r) || Ha(e, t);
	} else if (n == 38 || ui && n == 80 && r == "c") return Xa(e, -1, r) || Ha(e, -1);
	else if (n == 40 || ui && n == 78 && r == "c") return $a(e) || Xa(e, 1, r) || Ha(e, 1);
	else if (r == (ui ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90)) return !0;
	return !1;
}
function no(e, t) {
	e.someProp("transformCopied", (n) => {
		t = n(t, e);
	});
	let n = [], { content: r, openStart: i, openEnd: a } = t;
	for (; i > 1 && a > 1 && r.childCount == 1 && r.firstChild.childCount == 1;) {
		i--, a--;
		let e = r.firstChild;
		n.push(e.type.name, e.attrs == e.type.defaultAttrs ? null : e.attrs), r = e.content;
	}
	let o = e.someProp("clipboardSerializer") || et.fromSchema(e.state.schema), s = po(), c = s.createElement("div");
	c.appendChild(o.serializeFragment(r, { document: s }));
	let l = c.firstChild, u, d = 0;
	for (; l && l.nodeType == 1 && (u = fo[l.nodeName.toLowerCase()]);) {
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
function ro(e, t, n, r, i) {
	let a = i.parent.type.spec.code, o, s;
	if (!n && !t) return null;
	let c = !!t && (r || a || !n);
	if (c) {
		if (e.someProp("transformPastedText", (n) => {
			t = n(t, a || r, e);
		}), a) return s = new b(m.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0), e.someProp("transformPasted", (t) => {
			s = t(s, e, !0);
		}), s;
		let n = e.someProp("clipboardTextParser", (n) => n(t, i, r, e));
		if (n) s = n;
		else {
			let n = i.marks(), { schema: r } = e.state, a = et.fromSchema(r);
			o = document.createElement("div"), t.split(/(?:\r\n?|\n)+/).forEach((e) => {
				let t = o.appendChild(document.createElement("p"));
				e && t.appendChild(a.serializeNode(r.text(e, n)));
			});
		}
	} else e.someProp("transformPastedHTML", (t) => {
		n = t(n, e);
	}), o = go(n), pi && _o(o);
	let l = o && o.querySelector("[data-pm-slice]"), u = l && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(l.getAttribute("data-pm-slice") || "");
	if (u && u[3]) for (let e = +u[3]; e > 0; e--) {
		let e = o.firstChild;
		for (; e && e.nodeType != 1;) e = e.nextSibling;
		if (!e) break;
		o = e;
	}
	if (s ||= (e.someProp("clipboardParser") || e.someProp("domParser") || Be.fromSchema(e.state.schema)).parseSlice(o, {
		preserveWhitespace: !!(c || u),
		context: i,
		ruleFromNode(e) {
			return e.nodeName == "BR" && !e.nextSibling && e.parentNode && !io.test(e.parentNode.nodeName) ? { ignore: !0 } : null;
		}
	}), u) s = vo(uo(s, +u[1], +u[2]), u[4]);
	else if (s = b.maxOpen(ao(s.content, i), !0), s.openStart || s.openEnd) {
		let e = 0, t = 0;
		for (let t = s.content.firstChild; e < s.openStart && !t.type.spec.isolating; e++, t = t.firstChild);
		for (let e = s.content.lastChild; t < s.openEnd && !e.type.spec.isolating; t++, e = e.lastChild);
		s = uo(s, e, t);
	}
	return e.someProp("transformPasted", (t) => {
		s = t(s, e, c);
	}), s;
}
var io = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function ao(e, t) {
	if (e.childCount < 2) return e;
	for (let n = t.depth; n >= 0; n--) {
		let r = t.node(n).contentMatchAt(t.index(n)), i, a = [];
		if (e.forEach((e) => {
			if (!a) return;
			let t = r.findWrapping(e.type), n;
			if (!t) return a = null;
			if (n = a.length && i.length && so(t, i, e, a[a.length - 1], 0)) a[a.length - 1] = n;
			else {
				a.length && (a[a.length - 1] = co(a[a.length - 1], i.length));
				let n = oo(e, t);
				a.push(n), r = r.matchType(n.type), i = t;
			}
		}), a) return m.from(a);
	}
	return e;
}
function oo(e, t, n = 0) {
	for (let r = t.length - 1; r >= n; r--) e = t[r].create(null, m.from(e));
	return e;
}
function so(e, t, n, r, i) {
	if (i < e.length && i < t.length && e[i] == t[i]) {
		let a = so(e, t, n, r.lastChild, i + 1);
		if (a) return r.copy(r.content.replaceChild(r.childCount - 1, a));
		if (r.contentMatchAt(r.childCount).matchType(i == e.length - 1 ? n.type : e[i + 1])) return r.copy(r.content.append(m.from(oo(n, e, i + 1))));
	}
}
function co(e, t) {
	if (t == 0) return e;
	let n = e.content.replaceChild(e.childCount - 1, co(e.lastChild, t - 1)), r = e.contentMatchAt(e.childCount).fillBefore(m.empty, !0);
	return e.copy(n.append(r));
}
function lo(e, t, n, r, i, a) {
	let o = t < 0 ? e.firstChild : e.lastChild, s = o.content;
	return e.childCount > 1 && (a = 0), i < r - 1 && (s = lo(s, t, n, r, i + 1, a)), i >= n && (s = t < 0 ? o.contentMatchAt(0).fillBefore(s, a <= i).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(m.empty, !0))), e.replaceChild(t < 0 ? 0 : e.childCount - 1, o.copy(s));
}
function uo(e, t, n) {
	return t < e.openStart && (e = new b(lo(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd)), n < e.openEnd && (e = new b(lo(e.content, 1, n, e.openEnd, 0, 0), e.openStart, n)), e;
}
var fo = {
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
function po() {
	return document.implementation.createHTMLDocument("title");
}
var mo = null;
function ho(e) {
	let t = window.trustedTypes;
	return t ? (mo ||= t.defaultPolicy || t.createPolicy("ProseMirrorClipboard", { createHTML: (e) => e }), mo.createHTML(e)) : e;
}
function go(e) {
	let t = /^(\s*<meta [^>]*>)*/.exec(e);
	t && (e = e.slice(t[0].length));
	let n = po(), r = n.body, i = /<([a-z][^>\s]+)/i.exec(e), a;
	if ((a = i && fo[i[1].toLowerCase()]) && (e = a.map((e) => "<" + e + ">").join("") + e + a.map((e) => "</" + e + ">").reverse().join("")), r.innerHTML = ho(e), a) for (let e = 0; e < a.length; e++) r = r.querySelector(a[e]) || r;
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
function _o(e) {
	let t = e.querySelectorAll(oi ? "span:not([class]):not([style])" : "span.Apple-converted-space");
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), r);
	}
}
function vo(e, t) {
	if (!e.size) return e;
	let n = e.content.firstChild.type.schema, r;
	try {
		r = JSON.parse(t);
	} catch {
		return e;
	}
	let { content: i, openStart: a, openEnd: o } = e;
	for (let e = r.length - 2; e >= 0; e -= 2) {
		let t = n.nodes[r[e]];
		if (!t || t.hasRequiredAttrs()) break;
		i = m.from(t.create(r[e + 1], i)), a++, o++;
	}
	return new b(i, a, o);
}
var yo = {}, bo = {}, xo = {
	touchstart: !0,
	touchmove: !0
}, So = class {
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
function Co(e) {
	for (let t in yo) {
		let n = yo[t];
		e.dom.addEventListener(t, e.input.eventHandlers[t] = (t) => {
			Oo(e, t) && !Do(e, t) && (e.editable || !(t.type in bo)) && n(e, t);
		}, xo[t] ? { passive: !0 } : void 0);
	}
	ci && e.dom.addEventListener("input", () => null), Eo(e);
}
function wo(e, t) {
	e.input.lastSelectionOrigin = t, e.input.lastSelectionTime = Date.now();
}
function To(e) {
	e.input.mouseDown && e.input.mouseDown.done(), e.domObserver.stop();
	for (let t in e.input.eventHandlers) e.dom.removeEventListener(t, e.input.eventHandlers[t]);
	clearTimeout(e.input.composingTimeout), clearTimeout(e.input.lastIOSEnterFallbackTimeout);
}
function Eo(e) {
	e.someProp("handleDOMEvents", (t) => {
		for (let n in t) e.input.eventHandlers[n] || e.dom.addEventListener(n, e.input.eventHandlers[n] = (t) => Do(e, t));
	});
}
function Do(e, t) {
	return e.someProp("handleDOMEvents", (n) => {
		let r = n[t.type];
		return r ? r(e, t) || t.defaultPrevented : !1;
	});
}
function Oo(e, t) {
	if (!t.bubbles) return !0;
	if (t.defaultPrevented) return !1;
	for (let n = t.target; n != e.dom; n = n.parentNode) if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(t)) return !1;
	return !0;
}
function ko(e, t) {
	!Do(e, t) && yo[t.type] && (e.editable || !(t.type in bo)) && yo[t.type](e, t);
}
bo.keydown = (e, t) => {
	let n = t;
	if (e.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Ko(e) && (e.input.lastKeyCode = n.keyCode, e.input.lastKeyCodeTime = Date.now(), !(fi && oi && n.keyCode == 13))) if (n.keyCode != 229 && e.domObserver.forceFlush(), li && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
		let t = Date.now();
		e.input.lastIOSEnter = t, e.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
			e.input.lastIOSEnter == t && (e.someProp("handleKeyDown", (t) => t(e, qr(13, "Enter"))), e.input.lastIOSEnter = 0);
		}, 200);
	} else e.someProp("handleKeyDown", (t) => t(e, n)) || to(e, n) ? n.preventDefault() : wo(e, "key");
}, bo.keyup = (e, t) => {
	t.keyCode == 16 && (e.input.shiftKey = !1);
}, bo.keypress = (e, t) => {
	let n = t;
	if (Ko(e) || !n.charCode || n.ctrlKey && !n.altKey || ui && n.metaKey) return;
	if (e.someProp("handleKeyPress", (t) => t(e, n))) {
		n.preventDefault();
		return;
	}
	let r = e.state.selection;
	if (!(r instanceof k) || !r.$from.sameParent(r.$to)) {
		let t = String.fromCharCode(n.charCode), i = () => e.state.tr.insertText(t).scrollIntoView();
		!/[\r\n]/.test(t) && !e.someProp("handleTextInput", (n) => n(e, r.$from.pos, r.$to.pos, t, i)) && e.dispatch(i()), n.preventDefault();
	}
};
function Ao(e) {
	return {
		left: e.clientX,
		top: e.clientY
	};
}
function jo(e, t) {
	let n = t.x - e.clientX, r = t.y - e.clientY;
	return n * n + r * r < 100;
}
function Mo(e, t, n, r, i) {
	if (r == -1) return !1;
	let a = e.state.doc.resolve(r);
	for (let r = a.depth + 1; r > 0; r--) if (e.someProp(t, (t) => r > a.depth ? t(e, n, a.nodeAfter, a.before(r), i, !0) : t(e, n, a.node(r), a.before(r), i, !1))) return !0;
	return !1;
}
function No(e, t, n) {
	if (e.focused || e.focus(), e.state.selection.eq(t)) return;
	let r = e.state.tr.setSelection(t);
	n == "pointer" && r.setMeta("pointer", !0), e.dispatch(r);
}
function Po(e, t) {
	if (t == -1) return !1;
	let n = e.state.doc.resolve(t), r = n.nodeAfter;
	return r && r.isAtom && A.isSelectable(r) ? (No(e, new A(n), "pointer"), !0) : !1;
}
function Fo(e, t) {
	if (t == -1) return !1;
	let n = e.state.selection, r, i;
	n instanceof A && (r = n.node);
	let a = e.state.doc.resolve(t);
	for (let e = a.depth + 1; e > 0; e--) {
		let t = e > a.depth ? a.nodeAfter : a.node(e);
		if (A.isSelectable(t)) {
			i = r && n.$from.depth > 0 && e >= n.$from.depth && a.before(n.$from.depth + 1) == n.$from.pos ? a.before(n.$from.depth) : a.before(e);
			break;
		}
	}
	return i == null ? !1 : (No(e, A.create(e.state.doc, i), "pointer"), !0);
}
function Io(e, t, n, r, i) {
	return Mo(e, "handleClickOn", t, n, r) || e.someProp("handleClick", (n) => n(e, t, r)) || (i ? Fo(e, n) : Po(e, n));
}
function Lo(e, t, n, r) {
	return Mo(e, "handleDoubleClickOn", t, n, r) || e.someProp("handleDoubleClick", (n) => n(e, t, r));
}
function Ro(e, t, n, r) {
	return Mo(e, "handleTripleClickOn", t, n, r) || e.someProp("handleTripleClick", (n) => n(e, t, r)) || zo(e, n, r);
}
function zo(e, t, n) {
	if (n.button != 0) return !1;
	let r = Bo(e, t, !0), i = e.state.doc;
	return r ? (No(e, r, "pointer"), r instanceof k && i.eq(e.state.doc) && (e.input.mouseDown = new Go(e, r)), !0) : !1;
}
function Bo(e, t, n) {
	let r = e.state.doc;
	if (t == -1) return r.inlineContent ? k.create(r, 0, r.content.size) : null;
	let i = r.resolve(t);
	for (let e = i.depth + 1; e > 0; e--) {
		let t = e > i.depth ? i.nodeAfter : i.node(e), a = i.before(e);
		if (t.inlineContent) return k.create(r, a + 1, a + 1 + t.content.size);
		if (n && A.isSelectable(t)) return A.create(r, a);
	}
	return null;
}
function Vo(e) {
	return Qo(e);
}
var Ho = ui ? "metaKey" : "ctrlKey";
yo.mousedown = (e, t) => {
	let n = t;
	e.input.shiftKey = n.shiftKey;
	let r = Vo(e), i = Date.now(), a = "singleClick";
	i - e.input.lastClick.time < 500 && jo(n, e.input.lastClick) && !n[Ho] && e.input.lastClick.button == n.button && (e.input.lastClick.type == "singleClick" ? a = "doubleClick" : e.input.lastClick.type == "doubleClick" && (a = "tripleClick")), e.input.lastClick = {
		time: i,
		x: n.clientX,
		y: n.clientY,
		type: a,
		button: n.button
	}, e.input.mouseDown && e.input.mouseDown.done();
	let o = e.posAtCoords(Ao(n));
	o && (a == "singleClick" ? e.input.mouseDown = new Wo(e, o, n, !!r) : (a == "doubleClick" ? Lo : Ro)(e, o.pos, o.inside, n) ? n.preventDefault() : wo(e, "pointer"));
};
var Uo = class {
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
}, Wo = class extends Uo {
	constructor(e, t, n, r) {
		super(e), this.pos = t, this.event = n, this.flushed = r, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!n[Ho], this.allowDefault = n.shiftKey;
		let i, a;
		if (t.inside > -1) i = e.state.doc.nodeAt(t.inside), a = t.inside;
		else {
			let n = e.state.doc.resolve(t.pos);
			i = n.parent, a = n.depth ? n.before() : 0;
		}
		let o = r ? null : n.target, s = o ? e.docView.nearestDesc(o, !0) : null;
		this.target = s && s.nodeDOM.nodeType == 1 ? s.nodeDOM : null;
		let { selection: c } = e.state;
		n.button == 0 && (i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof A && c.from <= a && c.to > a) && (this.mightDrag = {
			node: i,
			pos: a,
			addAttr: !!(this.target && !this.target.draggable),
			setUneditable: !!(this.target && ii && !this.target.hasAttribute("contentEditable"))
		}), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
			this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
		}, 20), this.view.domObserver.start()), wo(e, "pointer");
	}
	done() {
		super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
			this.view.isDestroyed || wa(this.view);
		});
	}
	up(e) {
		if (this.done(), !this.view.dom.contains(e.target)) return;
		let t = this.pos;
		this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Ao(e))), this.updateAllowDefault(e), this.allowDefault || !t ? wo(this.view, "pointer") : Io(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || ci && this.mightDrag && !this.mightDrag.node.isAtom || oi && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (No(this.view, O.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : wo(this.view, "pointer");
	}
	move(e) {
		this.updateAllowDefault(e), wo(this.view, "pointer"), super.move(e);
	}
	updateAllowDefault(e) {
		!this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
	}
	delaySelUpdate() {
		return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
	}
}, Go = class extends Uo {
	constructor(e, t) {
		super(e), this.startSelection = t, this.startDoc = e.state.doc;
	}
	move(e) {
		if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
			this.done();
			return;
		}
		e.preventDefault(), wo(this.view, "pointer");
		let t = this.view.posAtCoords(Ao(e)), n = t && Bo(this.view, t.inside, !1);
		if (!n) return;
		let { doc: r } = this.view.state, i = this.startSelection, [a, o] = n.from < i.from ? [i.to, n.from] : [i.from, n.to];
		No(this.view, k.create(r, a, o), "pointer");
	}
};
yo.touchstart = (e) => {
	e.input.lastTouch = Date.now(), Vo(e), wo(e, "pointer");
}, yo.touchmove = (e) => {
	e.input.lastTouch = Date.now(), wo(e, "pointer");
}, yo.contextmenu = (e) => Vo(e);
function Ko(e, t) {
	return e.composing ? !0 : ci && Math.abs(Date.now() - e.input.compositionEndedAt) < 500 ? (e.input.compositionEndedAt = -2e8, !0) : !1;
}
var qo = fi ? 5e3 : -1;
bo.compositionstart = bo.compositionupdate = (e) => {
	if (!e.composing) {
		e.domObserver.flush();
		let { state: t } = e, n = t.selection.$to;
		if (t.selection instanceof k && (t.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((e) => e.type.spec.inclusive === !1) || oi && di && Jo(e))) e.markCursor = e.state.storedMarks || n.marks(), Qo(e, !0), e.markCursor = null;
		else if (Qo(e, !t.selection.empty), ii && t.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
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
	Yo(e, qo);
};
function Jo(e) {
	let { focusNode: t, focusOffset: n } = e.domSelectionRange();
	if (!t || t.nodeType != 1 || n >= t.childNodes.length) return !1;
	let r = t.childNodes[n];
	return r.nodeType == 1 && r.contentEditable == "false";
}
bo.compositionend = (e, t) => {
	e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now(), e.input.compositionPendingChanges = e.domObserver.pendingRecords().length ? e.input.compositionID : 0, e.input.compositionNode = null, e.input.badSafariComposition ? e.domObserver.forceFlush() : e.input.compositionPendingChanges && Promise.resolve().then(() => e.domObserver.flush()), e.input.compositionID++, Yo(e, 20));
};
function Yo(e, t) {
	clearTimeout(e.input.composingTimeout), t > -1 && (e.input.composingTimeout = setTimeout(() => Qo(e), t));
}
function Xo(e) {
	for (e.composing && (e.input.composing = !1, e.input.compositionEndedAt = Date.now()); e.input.compositionNodes.length > 0;) e.input.compositionNodes.pop().markParentsDirty();
}
function Zo(e) {
	let t = e.domSelectionRange();
	if (!t.focusNode) return null;
	let n = Hr(t.focusNode, t.focusOffset), r = Ur(t.focusNode, t.focusOffset);
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
function Qo(e, t = !1) {
	if (!(fi && e.domObserver.flushingSoon >= 0)) {
		if (e.domObserver.forceFlush(), Xo(e), t || e.docView && e.docView.dirty) {
			let n = Sa(e), r = e.state.selection;
			return n && !n.eq(r) ? e.dispatch(e.state.tr.setSelection(n)) : (e.markCursor || t) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? e.dispatch(e.state.tr.deleteSelection()) : e.updateState(e.state), !0;
		}
		return !1;
	}
}
function $o(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.dom.parentNode.appendChild(document.createElement("div"));
	n.appendChild(t), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
	let r = getSelection(), i = document.createRange();
	i.selectNodeContents(t), e.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
		n.parentNode && n.parentNode.removeChild(n), e.focus();
	}, 50);
}
var es = ni && ri < 15 || li && mi < 604;
yo.copy = bo.cut = (e, t) => {
	let n = t, r = e.state.selection, i = n.type == "cut";
	if (r.empty) return;
	let a = es ? null : n.clipboardData, { dom: o, text: s } = no(e, r.content());
	a ? (n.preventDefault(), a.clearData(), a.setData("text/html", o.innerHTML), a.setData("text/plain", s)) : $o(e, o), i && e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function ts(e) {
	return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
}
function ns(e, t) {
	if (!e.dom.parentNode) return;
	let n = e.input.shiftKey || e.state.selection.$from.parent.type.spec.code, r = e.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
	n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
	let i = e.input.shiftKey && e.input.lastKeyCode != 45;
	setTimeout(() => {
		e.focus(), r.parentNode && r.parentNode.removeChild(r), n ? rs(e, r.value, null, i, t) : rs(e, r.textContent, r.innerHTML, i, t);
	}, 50);
}
function rs(e, t, n, r, i) {
	let a = ro(e, t, n, r, e.state.selection.$from);
	if (e.someProp("handlePaste", (t) => t(e, i, a || b.empty))) return !0;
	if (!a) return !1;
	let o = ts(a), s = o ? e.state.tr.replaceSelectionWith(o, r) : e.state.tr.replaceSelection(a);
	return e.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function is(e) {
	let t = e.getData("text/plain") || e.getData("Text");
	if (t) return t;
	let n = e.getData("text/uri-list");
	return n ? n.replace(/\r?\n/g, " ") : "";
}
bo.paste = (e, t) => {
	let n = t;
	if (e.composing && !fi) return;
	let r = es ? null : n.clipboardData, i = e.input.shiftKey && e.input.lastKeyCode != 45;
	r && rs(e, is(r), r.getData("text/html"), i, n) ? n.preventDefault() : ns(e, n);
};
var as = class {
	constructor(e, t, n) {
		this.slice = e, this.move = t, this.node = n;
	}
}, ss = ui ? "altKey" : "ctrlKey";
function cs(e, t) {
	let n;
	return e.someProp("dragCopies", (e) => {
		n ||= e(t);
	}), n == null ? !t[ss] : !n;
}
yo.dragstart = (e, t) => {
	let n = t, r = e.input.mouseDown;
	if (r && r.done(), !n.dataTransfer) return;
	let i = e.state.selection, a = i.empty ? null : e.posAtCoords(Ao(n)), o;
	if (!(a && a.pos >= i.from && a.pos <= (i instanceof A ? i.to - 1 : i.to))) {
		if (r && r.mightDrag) o = A.create(e.state.doc, r.mightDrag.pos);
		else if (n.target && n.target.nodeType == 1) {
			let t = e.docView.nearestDesc(n.target, !0);
			t && t.node.type.spec.draggable && t != e.docView && (o = A.create(e.state.doc, t.posBefore));
		}
	}
	let { dom: s, text: c, slice: l } = no(e, (o || e.state.selection).content());
	(!n.dataTransfer.files.length || !oi || si > 120) && n.dataTransfer.clearData(), n.dataTransfer.setData(es ? "Text" : "text/html", s.innerHTML), n.dataTransfer.effectAllowed = "copyMove", es || n.dataTransfer.setData("text/plain", c), e.dragging = new as(l, cs(e, n), o);
}, yo.dragend = (e) => {
	let t = e.dragging;
	window.setTimeout(() => {
		e.dragging == t && (e.dragging = null);
	}, 50);
}, bo.dragover = bo.dragenter = (e, t) => t.preventDefault(), bo.drop = (e, t) => {
	try {
		ls(e, t, e.dragging);
	} finally {
		e.dragging = null;
	}
};
function ls(e, t, n) {
	if (!t.dataTransfer) return;
	let r = e.posAtCoords(Ao(t));
	if (!r) return;
	let i = e.state.doc.resolve(r.pos), a = n && n.slice;
	a ? e.someProp("transformPasted", (t) => {
		a = t(a, e, !1);
	}) : a = ro(e, is(t.dataTransfer), es ? null : t.dataTransfer.getData("text/html"), !1, i);
	let o = !!(n && cs(e, t));
	if (e.someProp("handleDrop", (n) => n(e, t, a || b.empty, o))) {
		t.preventDefault();
		return;
	}
	if (!a) return;
	t.preventDefault();
	let s = a ? en(e.state.doc, i.pos, a) : i.pos;
	s ??= i.pos;
	let c = e.state.tr;
	if (o) {
		let { node: e } = n;
		e ? e.replace(c) : c.deleteSelection();
	}
	let l = c.mapping.map(s), u = a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1, d = c.doc;
	if (u ? c.replaceRangeWith(l, l, a.content.firstChild) : c.replaceRange(l, l, a), c.doc.eq(d)) return;
	let f = c.doc.resolve(l);
	if (u && A.isSelectable(a.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(a.content.firstChild)) c.setSelection(new A(f));
	else {
		let t = c.mapping.map(s);
		c.mapping.maps[c.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), c.setSelection(Na(e, f, c.doc.resolve(t)));
	}
	e.focus(), e.dispatch(c.setMeta("uiEvent", "drop"));
}
yo.focus = (e) => {
	e.input.lastFocus = Date.now(), e.focused || (e.domObserver.stop(), e.dom.classList.add("ProseMirror-focused"), e.domObserver.start(), e.focused = !0, setTimeout(() => {
		e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.domSelectionRange()) && wa(e);
	}, 20));
}, yo.blur = (e, t) => {
	let n = t;
	e.focused &&= (e.domObserver.stop(), e.dom.classList.remove("ProseMirror-focused"), e.domObserver.start(), n.relatedTarget && e.dom.contains(n.relatedTarget) && e.domObserver.currentSelection.clear(), !1);
}, yo.beforeinput = (e, t) => {
	if (fi && t.inputType == "deleteContentBackward") {
		e.domObserver.flushSoon();
		let { domChangeCount: t } = e.input;
		setTimeout(() => {
			if (e.input.domChangeCount != t || (e.dom.blur(), e.focus(), e.someProp("handleKeyDown", (t) => t(e, qr(8, "Backspace"))))) return;
			let { $cursor: n } = e.state.selection;
			n && n.pos > 0 && e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
		}, 50);
	}
};
for (let e in bo) yo[e] = bo[e];
function us(e, t) {
	if (e == t) return !0;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (!(n in e)) return !1;
	return !0;
}
var ds = class e {
	constructor(e, t) {
		this.toDOM = e, this.spec = t || gs, this.side = this.spec.side || 0;
	}
	map(e, t, n, r) {
		let { pos: i, deleted: a } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
		return a ? null : new ms(i - n, i - n, this);
	}
	valid() {
		return !0;
	}
	eq(t) {
		return this == t || t instanceof e && (this.spec.key && this.spec.key == t.spec.key || this.toDOM == t.toDOM && us(this.spec, t.spec));
	}
	destroy(e) {
		this.spec.destroy && this.spec.destroy(e);
	}
}, fs = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || gs;
	}
	map(e, t, n, r) {
		let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - n, a = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - n;
		return i >= a ? null : new ms(i, a, this);
	}
	valid(e, t) {
		return t.from < t.to;
	}
	eq(t) {
		return this == t || t instanceof e && us(this.attrs, t.attrs) && us(this.spec, t.spec);
	}
	static is(t) {
		return t.type instanceof e;
	}
	destroy() {}
}, ps = class e {
	constructor(e, t) {
		this.attrs = e, this.spec = t || gs;
	}
	map(e, t, n, r) {
		let i = e.mapResult(t.from + r, 1);
		if (i.deleted) return null;
		let a = e.mapResult(t.to + r, -1);
		return a.deleted || a.pos <= i.pos ? null : new ms(i.pos - n, a.pos - n, this);
	}
	valid(e, t) {
		let { index: n, offset: r } = e.content.findIndex(t.from), i;
		return r == t.from && !(i = e.child(n)).isText && r + i.nodeSize == t.to;
	}
	eq(t) {
		return this == t || t instanceof e && us(this.attrs, t.attrs) && us(this.spec, t.spec);
	}
	destroy() {}
}, ms = class e {
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
		return new e(t, t, new ds(n, r));
	}
	static inline(t, n, r, i) {
		return new e(t, n, new fs(r, i));
	}
	static node(t, n, r, i) {
		return new e(t, n, new ps(r, i));
	}
	get spec() {
		return this.type.spec;
	}
	get inline() {
		return this.type instanceof fs;
	}
	get widget() {
		return this.type instanceof ds;
	}
}, hs = [], gs = {}, N = class e {
	constructor(e, t) {
		this.local = e.length ? e : hs, this.children = t.length ? t : hs;
	}
	static create(e, t) {
		return t.length ? ws(t, e, 0, gs) : _s;
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
		return this == _s || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, n || gs);
	}
	mapInner(t, n, r, i, a) {
		let o;
		for (let e = 0; e < this.local.length; e++) {
			let s = this.local[e].map(t, r, i);
			s && s.type.valid(n, s) ? (o ||= []).push(s) : a.onRemove && a.onRemove(this.local[e].spec);
		}
		return this.children.length ? ys(this.children, o || [], t, n, r, i, a) : o ? new e(o.sort(Ts), hs) : _s;
	}
	add(t, n) {
		return n.length ? this == _s ? e.create(t, n) : this.addInner(t, n, 0) : this;
	}
	addInner(t, n, r) {
		let i, a = 0;
		t.forEach((e, t) => {
			let o = t + r, s;
			if (s = Ss(n, e, o)) {
				for (i ||= this.children.slice(); a < i.length && i[a] < t;) a += 3;
				i[a] == t ? i[a + 2] = i[a + 2].addInner(e, s, o + 1) : i.splice(a, 0, t, t + e.nodeSize, ws(s, e, o + 1, gs)), a += 3;
			}
		});
		let o = bs(a ? Cs(n) : n, -r);
		for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || o.splice(e--, 1);
		return new e(o.length ? this.local.concat(o).sort(Ts) : this.local, i || this.children);
	}
	remove(e) {
		return e.length == 0 || this == _s ? this : this.removeInner(e, 0);
	}
	removeInner(t, n) {
		let r = this.children, i = this.local;
		for (let e = 0; e < r.length; e += 3) {
			let i, a = r[e] + n, o = r[e + 1] + n;
			for (let e = 0, n; e < t.length; e++) (n = t[e]) && n.from > a && n.to < o && (t[e] = null, (i ||= []).push(n));
			if (!i) continue;
			r == this.children && (r = this.children.slice());
			let s = r[e + 2].removeInner(i, a + 1);
			s == _s ? (r.splice(e, 3), e -= 3) : r[e + 2] = s;
		}
		if (i.length) {
			for (let e = 0, r; e < t.length; e++) if (r = t[e]) for (let e = 0; e < i.length; e++) i[e].eq(r, n) && (i == this.local && (i = this.local.slice()), i.splice(e--, 1));
		}
		return r == this.children && i == this.local ? this : i.length || r.length ? new e(i, r) : _s;
	}
	forChild(t, n) {
		if (this == _s) return this;
		if (n.isLeaf) return e.empty;
		let r, i;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] >= t) {
			this.children[e] == t && (r = this.children[e + 2]);
			break;
		}
		let a = t + 1, o = a + n.content.size;
		for (let e = 0; e < this.local.length; e++) {
			let t = this.local[e];
			if (t.from < o && t.to > a && t.type instanceof fs) {
				let e = Math.max(a, t.from) - a, n = Math.min(o, t.to) - a;
				e < n && (i ||= []).push(t.copy(e, n));
			}
		}
		if (i) {
			let t = new e(i.sort(Ts), hs);
			return r ? new vs([t, r]) : t;
		}
		return r || _s;
	}
	eq(t) {
		if (this == t) return !0;
		if (!(t instanceof e) || this.local.length != t.local.length || this.children.length != t.children.length) return !1;
		for (let e = 0; e < this.local.length; e++) if (!this.local[e].eq(t.local[e])) return !1;
		for (let e = 0; e < this.children.length; e += 3) if (this.children[e] != t.children[e] || this.children[e + 1] != t.children[e + 1] || !this.children[e + 2].eq(t.children[e + 2])) return !1;
		return !0;
	}
	locals(e) {
		return Es(this.localsInner(e));
	}
	localsInner(e) {
		if (this == _s) return hs;
		if (e.inlineContent || !this.local.some(fs.is)) return this.local;
		let t = [];
		for (let e = 0; e < this.local.length; e++) this.local[e].type instanceof fs || t.push(this.local[e]);
		return t;
	}
	forEachSet(e) {
		e(this);
	}
};
N.empty = new N([], []), N.removeOverlap = Es;
var _s = N.empty, vs = class e {
	constructor(e) {
		this.members = e;
	}
	map(t, n) {
		let r = this.members.map((e) => e.map(t, n, gs));
		return e.from(r);
	}
	forChild(t, n) {
		if (n.isLeaf) return N.empty;
		let r = [];
		for (let i = 0; i < this.members.length; i++) {
			let a = this.members[i].forChild(t, n);
			a != _s && (a instanceof e ? r = r.concat(a.members) : r.push(a));
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
		return t ? Es(n ? t : t.sort(Ts)) : hs;
	}
	static from(t) {
		switch (t.length) {
			case 0: return _s;
			case 1: return t[0];
			default: return new e(t.every((e) => e instanceof N) ? t : t.reduce((e, t) => e.concat(t instanceof N ? t : t.members), []));
		}
	}
	forEachSet(e) {
		for (let t = 0; t < this.members.length; t++) this.members[t].forEachSet(e);
	}
};
function ys(e, t, n, r, i, a, o) {
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
			r == _s ? (s[t + 1] = -2, c = !0) : (s[t] = u, s[t + 1] = d, s[t + 2] = r);
		} else c = !0;
	}
	if (c) {
		let c = ws(xs(s, e, t, n, i, a, o), r, 0, o);
		t = c.local;
		for (let e = 0; e < s.length; e += 3) s[e + 1] < 0 && (s.splice(e, 3), e -= 3);
		for (let e = 0, t = 0; e < c.children.length; e += 3) {
			let n = c.children[e];
			for (; t < s.length && s[t] < n;) t += 3;
			s.splice(t, 0, c.children[e], c.children[e + 1], c.children[e + 2]);
		}
	}
	return new N(t.sort(Ts), s);
}
function bs(e, t) {
	if (!t || !e.length) return e;
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n.push(new ms(i.from + t, i.to + t, i.type));
	}
	return n;
}
function xs(e, t, n, r, i, a, o) {
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
function Ss(e, t, n) {
	if (t.isLeaf) return null;
	let r = n + t.nodeSize, i = null;
	for (let t = 0, a; t < e.length; t++) (a = e[t]) && a.from > n && a.to < r && ((i ||= []).push(a), e[t] = null);
	return i;
}
function Cs(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) e[n] != null && t.push(e[n]);
	return t;
}
function ws(e, t, n, r) {
	let i = [], a = !1;
	t.forEach((t, o) => {
		let s = Ss(e, t, o + n);
		if (s) {
			a = !0;
			let e = ws(s, t, n + o + 1, r);
			e != _s && i.push(o, o + t.nodeSize, e);
		}
	});
	let o = bs(a ? Cs(e) : e, -n).sort(Ts);
	for (let e = 0; e < o.length; e++) o[e].type.valid(t, o[e]) || (r.onRemove && r.onRemove(o[e].spec), o.splice(e--, 1));
	return o.length || i.length ? new N(o, i) : _s;
}
function Ts(e, t) {
	return e.from - t.from || e.to - t.to;
}
function Es(e) {
	let t = e;
	for (let n = 0; n < t.length - 1; n++) {
		let r = t[n];
		if (r.from != r.to) for (let i = n + 1; i < t.length; i++) {
			let a = t[i];
			if (a.from == r.from) {
				a.to != r.to && (t == e && (t = e.slice()), t[i] = a.copy(a.from, r.to), Ds(t, i + 1, a.copy(r.to, a.to)));
				continue;
			} else {
				a.from < r.to && (t == e && (t = e.slice()), t[n] = r.copy(r.from, a.from), Ds(t, i, r.copy(a.from, r.to)));
				break;
			}
		}
	}
	return t;
}
function Ds(e, t, n) {
	for (; t < e.length && Ts(n, e[t]) > 0;) t++;
	e.splice(t, 0, n);
}
function Os(e) {
	let t = [];
	return e.someProp("decorations", (n) => {
		let r = n(e.state);
		r && r != _s && t.push(r);
	}), e.cursorWrapper && t.push(N.create(e.state.doc, [e.cursorWrapper.deco])), vs.from(t);
}
var ks = {
	childList: !0,
	characterData: !0,
	characterDataOldValue: !0,
	attributes: !0,
	attributeOldValue: !0,
	subtree: !0
}, As = ni && ri <= 11, js = class {
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
}, Ms = class {
	constructor(e, t) {
		this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new js(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((t) => {
			for (let e = 0; e < t.length; e++) this.queue.push(t[e]);
			ni && ri <= 11 && t.some((e) => e.type == "childList" && e.removedNodes.length || e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length) ? this.flushSoon() : ci && e.composing && t.some((e) => e.type == "childList" && e.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
		}), As && (this.onCharData = (e) => {
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
		this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, ks)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
		if (Pa(this.view)) {
			if (this.suppressingSelectionUpdates) return wa(this.view);
			if (ni && ri <= 11 && !this.view.state.selection.empty) {
				let e = this.view.domSelectionRange();
				if (e.focusNode && Rr(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)) return this.flushSoon();
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
		for (let n = e.focusNode; n; n = Pr(n)) t.add(n);
		for (let r = e.anchorNode; r; r = Pr(r)) if (t.has(r)) {
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
		let n = e.domSelectionRange(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(n) && Pa(e) && !this.ignoreSelectionChange(n), i = -1, a = -1, o = !1, s = [];
		if (e.editable) for (let e = 0; e < t.length; e++) {
			let n = this.registerMutation(t[e], s);
			n && (i = i < 0 ? n.from : Math.min(n.from, i), a = a < 0 ? n.to : Math.max(n.to, a), n.typeOver && (o = !0));
		}
		if (s.some((e) => e.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || oi && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((e) => e.type == "childList" && e.removedNodes.length))) {
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
		} else if (ii && s.length) {
			let t = s.filter((e) => e.nodeName == "BR");
			if (t.length == 2) {
				let [e, n] = t;
				e.parentNode && e.parentNode.parentNode == n.parentNode ? n.remove() : e.remove();
			} else {
				let { focusNode: n } = this.currentSelection;
				for (let r of t) {
					let t = r.parentNode;
					t && t.nodeName == "LI" && (!n || Rs(e, n) != t) && r.remove();
				}
			}
		}
		let c = null;
		i < 0 && r && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Kr(n) && (c = Sa(e)) && c.eq(O.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, wa(e), this.currentSelection.set(n), e.scrollToSelection()) : (i > -1 || r) && (i > -1 && (e.docView.markDirty(i, a), Fs(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, zs(e, s)), this.handleDOMChange(i, a, o, s), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(n) || wa(e), this.currentSelection.set(n));
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
			if (ni && ri <= 11 && e.addedNodes.length) for (let t = 0; t < e.addedNodes.length; t++) {
				let { previousSibling: n, nextSibling: a } = e.addedNodes[t];
				(!n || Array.prototype.indexOf.call(e.addedNodes, n) < 0) && (r = n), (!a || Array.prototype.indexOf.call(e.addedNodes, a) < 0) && (i = a);
			}
			let a = r && r.parentNode == e.target ? Nr(r) + 1 : 0, o = n.localPosFromDOM(e.target, a, -1), s = i && i.parentNode == e.target ? Nr(i) : e.target.childNodes.length;
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
}, Ns = /* @__PURE__ */ new WeakMap(), Ps = !1;
function Fs(e) {
	if (!Ns.has(e) && (Ns.set(e, null), [
		"normal",
		"nowrap",
		"pre-line"
	].indexOf(getComputedStyle(e.dom).whiteSpace) !== -1)) {
		if (e.requiresGeckoHackNode = ii, Ps) return;
		console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Ps = !0;
	}
}
function Is(e, t) {
	let n = t.startContainer, r = t.startOffset, i = t.endContainer, a = t.endOffset, o = e.domAtPos(e.state.selection.anchor);
	return Rr(o.node, o.offset, i, a) && ([n, r, i, a] = [
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
function Ls(e, t) {
	if (t.getComposedRanges) {
		let n = t.getComposedRanges(e.root)[0];
		if (n) return Is(e, n);
	}
	let n;
	function r(e) {
		e.preventDefault(), e.stopImmediatePropagation(), n = e.getTargetRanges()[0];
	}
	return e.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), e.dom.removeEventListener("beforeinput", r, !0), n ? Is(e, n) : null;
}
function Rs(e, t) {
	for (let n = t.parentNode; n && n != e.dom; n = n.parentNode) {
		let t = e.docView.nearestDesc(n, !0);
		if (t && t.node.isBlock) return n;
	}
	return null;
}
function zs(e, t) {
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
function Bs(e, t, n, r) {
	let { node: i, fromOffset: a, toOffset: o, from: s, to: c } = e.docView.parseRange(t, n), l = e.domSelectionRange(), u, d = l.anchorNode;
	if (d && e.dom.contains(d.nodeType == 1 ? d : d.parentNode) && (u = [{
		node: d,
		offset: l.anchorOffset
	}], Kr(l) || u.push({
		node: l.focusNode,
		offset: l.focusOffset
	})), oi && e.input.lastKeyCode === 8) for (let e = o; e > a; e--) {
		let t = i.childNodes[e - 1], n = t.pmViewDesc;
		if (t.nodeName == "BR" && !n) {
			o = e;
			break;
		}
		if (!n || n.size) break;
	}
	let f = e.state.doc, p = e.someProp("domParser") || Be.fromSchema(e.state.schema), m = f.resolve(s), h = null, g = p.parse(i, {
		topNode: m.parent,
		topMatch: m.parent.contentMatchAt(m.index()),
		topOpen: !0,
		from: a,
		to: o,
		preserveWhitespace: m.parent.type.whitespace != "pre" || "full",
		findPositions: u,
		ruleFromNode: Vs(r),
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
var Vs = (e) => (t) => {
	let n = t.pmViewDesc;
	if (n) return n.parseRule(e);
	if (t.nodeName == "BR" && t.parentNode) {
		if (ci && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
			let e = document.createElement("div");
			return e.appendChild(document.createElement("li")), { skip: e };
		} else if (t.parentNode.lastChild == t || ci && /^(tr|table)$/i.test(t.parentNode.nodeName)) return { ignore: !0 };
	} else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder")) return { ignore: !0 };
	return null;
}, Hs = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Us(e, t, n, r, i) {
	let a = e.input.compositionPendingChanges || (e.composing ? e.input.compositionID : 0);
	if (e.input.compositionPendingChanges = 0, t < 0) {
		let t = e.input.lastSelectionTime > Date.now() - 50 ? e.input.lastSelectionOrigin : null, n = Sa(e, t);
		if (n && !e.state.selection.eq(n)) {
			if (oi && fi && e.input.lastKeyCode === 13 && Date.now() - 100 < e.input.lastKeyCodeTime && e.someProp("handleKeyDown", (t) => t(e, qr(13, "Enter")))) return;
			let r = e.state.tr.setSelection(n);
			t == "pointer" ? r.setMeta("pointer", !0) : t == "key" && r.scrollIntoView(), a && r.setMeta("composition", a), e.dispatch(r);
		}
		return;
	}
	let o = e.state.doc.resolve(t), s = o.sharedDepth(n);
	t = o.before(s + 1), n = e.state.doc.resolve(n).after(s + 1);
	let c = e.state.selection, l = Bs(e, t, n, i), u = e.state.doc, d = u.slice(l.from, l.to), f, p;
	e.input.lastKeyCode === 8 && Date.now() - 100 < e.input.lastKeyCodeTime ? (f = e.state.selection.to, p = "end") : (f = e.state.selection.from, p = "start"), e.input.lastKeyCode = null;
	let m = Js(d.content, l.doc.content, l.from, f, p);
	if (m && e.input.domChangeCount++, (li && e.input.lastIOSEnter > Date.now() - 225 || fi) && i.some((e) => e.nodeType == 1 && !Hs.test(e.nodeName)) && (!m || m.endA >= m.endB) && e.someProp("handleKeyDown", (t) => t(e, qr(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (!m) if (r && c instanceof k && !c.empty && c.$head.sameParent(c.$anchor) && !e.composing && !(l.sel && l.sel.anchor != l.sel.head)) m = {
		start: c.from,
		endA: c.to,
		endB: c.to
	};
	else {
		if (l.sel) {
			let t = Ws(e, e.state.doc, l.sel);
			if (t && !t.eq(e.state.selection)) {
				let n = e.state.tr.setSelection(t);
				a && n.setMeta("composition", a), e.dispatch(n);
			}
		}
		return;
	}
	e.state.selection.from < e.state.selection.to && m.start == m.endB && e.state.selection instanceof k && (m.start > e.state.selection.from && m.start <= e.state.selection.from + 2 && e.state.selection.from >= l.from ? m.start = e.state.selection.from : m.endA < e.state.selection.to && m.endA >= e.state.selection.to - 2 && e.state.selection.to <= l.to && (m.endB += e.state.selection.to - m.endA, m.endA = e.state.selection.to)), ni && ri <= 11 && m.endB == m.start + 1 && m.endA == m.start && m.start > l.from && l.doc.textBetween(m.start - l.from - 1, m.start - l.from + 1) == " \xA0" && (m.start--, m.endA--, m.endB--);
	let h = l.doc.resolveNoCache(m.start - l.from), g = l.doc.resolveNoCache(m.endB - l.from), _ = u.resolve(m.start), v = h.sameParent(g) && h.parent.inlineContent && _.end() >= m.endA;
	if ((li && e.input.lastIOSEnter > Date.now() - 225 && (!v || i.some((e) => e.nodeName == "DIV" || e.nodeName == "P")) || !v && h.pos < l.doc.content.size && (!h.sameParent(g) || !h.parent.inlineContent) && h.pos < g.pos && !/\S/.test(l.doc.textBetween(h.pos, g.pos, "", ""))) && e.someProp("handleKeyDown", (t) => t(e, qr(13, "Enter")))) {
		e.input.lastIOSEnter = 0;
		return;
	}
	if (e.state.selection.anchor > m.start && Ks(u, m.start, m.endA, h, g) && e.someProp("handleKeyDown", (t) => t(e, qr(8, "Backspace")))) {
		fi && oi && e.domObserver.suppressSelectionUpdates();
		return;
	}
	oi && m.endB == m.start && (e.input.lastChromeDelete = Date.now()), fi && !v && h.start() != g.start() && g.parentOffset == 0 && h.depth == g.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == m.endA && (m.endB -= 2, g = l.doc.resolveNoCache(m.endB - l.from), setTimeout(() => {
		e.someProp("handleKeyDown", function(t) {
			return t(e, qr(13, "Enter"));
		});
	}, 20));
	let y = m.start, b = m.endA, x = (t) => {
		let n = t || e.state.tr.replace(y, b, l.doc.slice(m.start - l.from, m.endB - l.from));
		if (l.sel) {
			let t = Ws(e, n.doc, l.sel);
			t && !(oi && e.composing && t.empty && (m.start != m.endB || e.input.lastChromeDelete < Date.now() - 100) && (t.head == y || t.head == n.mapping.map(b) - 1) || ni && t.empty && t.head == y) && n.setSelection(t);
		}
		return a && n.setMeta("composition", a), n.scrollIntoView();
	}, S;
	if (v) if (h.pos == g.pos) {
		ni && ri <= 11 && h.parentOffset == 0 && (e.domObserver.suppressSelectionUpdates(), setTimeout(() => wa(e), 20));
		let t = x(e.state.tr.delete(y, b)), n = u.resolve(m.start).marksAcross(u.resolve(m.endA));
		n && t.ensureMarks(n), e.dispatch(t);
	} else if (m.endA == m.endB && (S = Gs(h.parent.content.cut(h.parentOffset, g.parentOffset), _.parent.content.cut(_.parentOffset, m.endA - _.start())))) {
		let t = x(e.state.tr);
		S.type == "add" ? t.addMark(y, b, S.mark) : t.removeMark(y, b, S.mark), e.dispatch(t);
	} else if (h.parent.child(h.index()).isText && h.index() == g.index() - +!g.textOffset) {
		let t = h.parent.textBetween(h.parentOffset, g.parentOffset), n = () => x(e.state.tr.insertText(t, y, b));
		e.someProp("handleTextInput", (r) => r(e, y, b, t, n)) || e.dispatch(n());
	} else e.dispatch(x());
	else e.dispatch(x());
}
function Ws(e, t, n) {
	return Math.max(n.anchor, n.head) > t.content.size ? null : Na(e, t.resolve(n.anchor), t.resolve(n.head));
}
function Gs(e, t) {
	let n = e.firstChild.marks, r = t.firstChild.marks, i = n, a = r, o, s, c;
	for (let e = 0; e < r.length; e++) i = r[e].removeFromSet(i);
	for (let e = 0; e < n.length; e++) a = n[e].removeFromSet(a);
	if (i.length == 1 && a.length == 0) s = i[0], o = "add", c = (e) => e.mark(s.addToSet(e.marks));
	else if (i.length == 0 && a.length == 1) s = a[0], o = "remove", c = (e) => e.mark(s.removeFromSet(e.marks));
	else return null;
	let l = [];
	for (let e = 0; e < t.childCount; e++) l.push(c(t.child(e)));
	if (m.from(l).eq(e)) return {
		mark: s,
		type: o
	};
}
function Ks(e, t, n, r, i) {
	if (n - t <= i.pos - r.pos || qs(r, !0, !1) < i.pos) return !1;
	let a = e.resolve(t);
	if (!r.parent.isTextblock) {
		let e = a.nodeAfter;
		return e != null && n == t + e.nodeSize;
	}
	if (a.parentOffset < a.parent.content.size || !a.parent.isTextblock) return !1;
	let o = e.resolve(qs(a, !0, !0));
	return !o.parent.isTextblock || o.pos > n || qs(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function qs(e, t, n) {
	let r = e.depth, i = t ? e.end() : e.pos;
	for (; r > 0 && (t || e.indexAfter(r) == e.node(r).childCount);) r--, i++, t = !1;
	if (n) {
		let t = e.node(r).maybeChild(e.indexAfter(r));
		for (; t && !t.isLeaf;) t = t.firstChild, i++;
	}
	return i;
}
function Js(e, t, n, r, i) {
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
var Ys = class {
	constructor(e, t) {
		this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new So(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(nc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Qs(this), Zs(this), this.nodeViews = ec(this), this.docView = na(this.state.doc, Xs(this), Os(this), this.dom, this), this.domObserver = new Ms(this, (e, t, n, r) => Us(this, e, t, n, r)), this.domObserver.start(), Co(this), this.updatePluginViews();
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
		e.handleDOMEvents != this._props.handleDOMEvents && Eo(this);
		let t = this._props;
		this._props = e, e.plugins && (e.plugins.forEach(nc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
		e.storedMarks && this.composing && (Xo(this), i = !0), this.state = e;
		let a = n.plugins != e.plugins || this._props.plugins != t.plugins;
		if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
			let e = ec(this);
			tc(e, this.nodeViews) && (this.nodeViews = e, r = !0);
		}
		(a || t.handleDOMEvents != this._props.handleDOMEvents) && Eo(this), this.editable = Qs(this), Zs(this);
		let o = Os(this), s = Xs(this), c = n.plugins != e.plugins && !n.doc.eq(e.doc) ? "reset" : e.scrollToSelection > n.scrollToSelection ? "to selection" : "preserve", l = r || !this.docView.matchesNode(e.doc, s, o);
		(l || !e.selection.eq(n.selection)) && (i = !0);
		let u = c == "preserve" && i && this.dom.style.overflowAnchor == null && yi(this);
		if (i) {
			this.domObserver.stop();
			let t = l && (ni || oi) && !this.composing && !n.selection.empty && !e.selection.empty && $s(n.selection, e.selection);
			if (l) {
				let n = oi ? this.trackWrites = this.domSelectionRange().focusNode : null;
				this.composing && (this.input.compositionNode = Zo(this)), (r || !this.docView.update(e.doc, s, o, this)) && (this.docView.updateOuterDeco(s), this.docView.destroy(), this.docView = na(e.doc, s, o, this.dom, this)), n && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (t = !0);
			}
			let i = this.input.mouseDown;
			t || !(i && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Ia(this) && i.delaySelUpdate()) ? wa(this, t) : (ja(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
		}
		this.updatePluginViews(n), this.dragging?.node && !n.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, n), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : u && xi(u);
	}
	scrollToSelection() {
		let e = this.domSelectionRange().focusNode;
		if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode)) && !this.someProp("handleScrollToSelection", (e) => e(this))) if (this.state.selection instanceof A) {
			let t = this.docView.domAfterPos(this.state.selection.from);
			t.nodeType == 1 && vi(this, t.getBoundingClientRect(), e);
		} else vi(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
		this.dragging = new as(e.slice, e.move, r < 0 ? void 0 : A.create(this.state.doc, r));
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
		if (ni) {
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
		this.domObserver.stop(), this.editable && wi(this.dom), wa(this), this.domObserver.start();
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
		return Mi(this, e);
	}
	coordsAtPos(e, t = 1) {
		return Ii(this, e, t);
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
		return Ki(this, t || this.state, e);
	}
	pasteHTML(e, t) {
		return rs(this, "", e, !1, t || new ClipboardEvent("paste"));
	}
	pasteText(e, t) {
		return rs(this, e, null, !0, t || new ClipboardEvent("paste"));
	}
	serializeForClipboard(e) {
		return no(this, e);
	}
	destroy() {
		this.docView && (To(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Os(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Lr());
	}
	get isDestroyed() {
		return this.docView == null;
	}
	dispatchEvent(e) {
		return ko(this, e);
	}
	domSelectionRange() {
		let e = this.domSelection();
		return e ? ci && this.root.nodeType === 11 && Jr(this.dom.ownerDocument) == this.dom && Ls(this, e) || e : {
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
Ys.prototype.dispatch = function(e) {
	let t = this._props.dispatchTransaction;
	t ? t.call(this, e) : this.updateState(this.state.apply(e));
};
function Xs(e) {
	let t = Object.create(null);
	return t.class = "ProseMirror", t.contenteditable = String(e.editable), e.someProp("attributes", (n) => {
		if (typeof n == "function" && (n = n(e.state)), n) for (let e in n) e == "class" ? t.class += " " + n[e] : e == "style" ? t.style = (t.style ? t.style + ";" : "") + n[e] : !t[e] && e != "contenteditable" && e != "nodeName" && (t[e] = String(n[e]));
	}), t.translate ||= "no", [ms.node(0, e.state.doc.content.size, t)];
}
function Zs(e) {
	if (e.markCursor) {
		let t = document.createElement("img");
		t.className = "ProseMirror-separator", t.setAttribute("mark-placeholder", "true"), t.setAttribute("alt", ""), e.cursorWrapper = {
			dom: t,
			deco: ms.widget(e.state.selection.from, t, {
				raw: !0,
				marks: e.markCursor
			})
		};
	} else e.cursorWrapper = null;
}
function Qs(e) {
	return !e.someProp("editable", (t) => t(e.state) === !1);
}
function $s(e, t) {
	let n = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
	return e.$anchor.start(n) != t.$anchor.start(n);
}
function ec(e) {
	let t = Object.create(null);
	function n(e) {
		for (let n in e) Object.prototype.hasOwnProperty.call(t, n) || (t[n] = e[n]);
	}
	return e.someProp("nodeViews", n), e.someProp("markViews", n), t;
}
function tc(e, t) {
	let n = 0, r = 0;
	for (let r in e) {
		if (e[r] != t[r]) return !0;
		n++;
	}
	for (let e in t) r++;
	return n != r;
}
function nc(e) {
	if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
}
for (var rc = {
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
}, ic = {
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
}, ac = typeof navigator < "u" && /Mac/.test(navigator.platform), oc = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), sc = 0; sc < 10; sc++) rc[48 + sc] = rc[96 + sc] = String(sc);
for (var sc = 1; sc <= 24; sc++) rc[sc + 111] = "F" + sc;
for (var sc = 65; sc <= 90; sc++) rc[sc] = String.fromCharCode(sc + 32), ic[sc] = String.fromCharCode(sc);
for (var cc in rc) ic.hasOwnProperty(cc) || (ic[cc] = rc[cc]);
function lc(e) {
	var t = !(ac && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || oc && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? ic : rc)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
//#endregion
//#region node_modules/prosemirror-keymap/dist/index.js
var uc = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), dc = typeof navigator < "u" && /Win/.test(navigator.platform);
function fc(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) uc ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function pc(e) {
	let t = Object.create(null);
	for (let n in e) t[fc(n)] = e[n];
	return t;
}
function mc(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function hc(e) {
	return new j({ props: { handleKeyDown: gc(e) } });
}
function gc(e) {
	let t = pc(e);
	return function(e, n) {
		let r = lc(n), i, a = t[mc(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[mc(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(dc && n.ctrlKey && n.altKey) && (i = rc[n.keyCode]) && i != r) {
				let r = t[mc(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
//#endregion
//#region node_modules/@tiptap/core/dist/index.js
var _c = Object.defineProperty, vc = (e, t) => {
	for (var n in t) _c(e, n, {
		get: t[n],
		enumerable: !0
	});
};
function yc(e) {
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
var bc = class {
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
			state: yc({
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
}, xc = {};
vc(xc, {
	blur: () => Sc,
	clearContent: () => Cc,
	clearNodes: () => wc,
	command: () => Tc,
	createParagraphNear: () => Ec,
	cut: () => Dc,
	deleteCurrentNode: () => Oc,
	deleteNode: () => Ac,
	deleteRange: () => jc,
	deleteSelection: () => Fc,
	enter: () => Ic,
	exitCode: () => Lc,
	extendMarkRange: () => Wc,
	first: () => Gc,
	focus: () => Qc,
	forEach: () => $c,
	insertContent: () => el,
	insertContentAt: () => ol,
	insertDefaultBlock: () => cl,
	joinBackward: () => dl,
	joinDown: () => ul,
	joinForward: () => fl,
	joinItemBackward: () => pl,
	joinItemForward: () => ml,
	joinTextblockBackward: () => hl,
	joinTextblockForward: () => gl,
	joinUp: () => ll,
	keyboardShortcut: () => yl,
	lift: () => xl,
	liftEmptyBlock: () => Sl,
	liftListItem: () => Cl,
	newlineInCode: () => wl,
	resetAttributes: () => Dl,
	scrollIntoView: () => Ol,
	selectAll: () => kl,
	selectNodeBackward: () => Al,
	selectNodeForward: () => jl,
	selectParentNode: () => Ml,
	selectTextblockEnd: () => Nl,
	selectTextblockStart: () => Pl,
	setContent: () => Il,
	setMark: () => Pu,
	setMeta: () => Fu,
	setNode: () => Iu,
	setNodeSelection: () => Lu,
	setTextDirection: () => Ru,
	setTextSelection: () => zu,
	sinkListItem: () => Bu,
	splitBlock: () => Hu,
	splitListItem: () => Uu,
	toggleList: () => Yu,
	toggleMark: () => Xu,
	toggleNode: () => Zu,
	toggleWrap: () => Qu,
	undoInputRule: () => $u,
	unsetAllMarks: () => ed,
	unsetMark: () => td,
	unsetTextDirection: () => nd,
	updateAttributes: () => rd,
	wrapIn: () => id,
	wrapInList: () => ad
});
var Sc = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
	e.isDestroyed || (t.dom.blur(), (window == null ? void 0 : window.getSelection())?.removeAllRanges());
}), !0), Cc = (e = !0) => ({ commands: t }) => t.setContent("", { emitUpdate: e }), wc = () => ({ state: e, tr: t, dispatch: n }) => {
	let { selection: r } = t, { ranges: i } = r;
	return n && i.forEach(({ $from: n, $to: r }) => {
		e.doc.nodesBetween(n.pos, r.pos, (e, n) => {
			if (e.type.isText) return;
			let { doc: r, mapping: i } = t, a = r.resolve(i.map(n)), o = r.resolve(i.map(n + e.nodeSize)), s = a.blockRange(o);
			if (!s) return;
			let c = Pt(s);
			if (e.type.isTextblock) {
				let { defaultType: e } = a.parent.contentMatchAt(a.index());
				t.setNodeMarkup(s.start, e);
			}
			(c || c === 0) && t.lift(s, c);
		});
	}), !0;
}, Tc = (e) => (t) => e(t), Ec = () => ({ state: e, dispatch: t }) => cr(e, t), Dc = (e, t) => ({ editor: n, tr: r }) => {
	let { state: i } = n, a = i.doc.slice(e.from, e.to);
	r.deleteRange(e.from, e.to);
	let o = r.mapping.map(t);
	return r.insert(o, a.content), r.setSelection(new k(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Oc = () => ({ tr: e, dispatch: t }) => {
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
function kc(e, t) {
	if (typeof e == "string") {
		if (!t.nodes[e]) throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
		return t.nodes[e];
	}
	return e;
}
var Ac = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let i = kc(e, n.schema), a = t.selection.$anchor;
	for (let e = a.depth; e > 0; --e) if (a.node(e).type === i) {
		if (r) {
			let n = a.before(e), r = a.after(e);
			t.delete(n, r).scrollIntoView();
		}
		return !0;
	}
	return !1;
}, jc = (e) => ({ tr: t, dispatch: n }) => {
	let { from: r, to: i } = e;
	return n && t.delete(r, i), !0;
}, Mc = (e) => e.content ? /^text(\*|\+)/.test(e.content) : !1, Nc = (e, t, n) => {
	if (!e.parent.isInline || n === "left" && e.pos > e.start() || n === "right" && e.pos < e.end()) return e.pos;
	let r = t.nodes[e.parent.type.name].spec;
	return Mc(r) ? n === "left" ? e.start() - 1 : e.end() + 1 : e.pos;
}, Pc = (e, t, n) => ({
	from: Nc(e, n, "left"),
	to: Nc(t, n, "right")
}), Fc = () => ({ state: e, dispatch: t }) => {
	if (e.selection.empty) return !1;
	if (t) {
		let n = e.tr, { ranges: r } = e.selection, i = n.steps.length;
		r.forEach((t) => {
			let r = n.mapping.slice(i), { from: a, to: o } = Pc(n.doc.resolve(r.map(t.$from.pos)), n.doc.resolve(r.map(t.$to.pos)), e.schema);
			n.deleteRange(a, o);
		}), n.selection.empty || n.setSelection(k.near(n.doc.resolve(n.selection.from))), n.scrollIntoView(), t(n);
	}
	return !0;
}, Ic = () => ({ commands: e }) => e.keyboardShortcut("Enter"), Lc = () => ({ state: e, dispatch: t }) => sr(e, t);
function Rc(e) {
	return Object.prototype.toString.call(e) === "[object RegExp]";
}
function zc(e, t, n = { strict: !0 }) {
	let r = Object.keys(t);
	return !r.length || r.every((r) => n.strict ? t[r] === e[r] : Rc(t[r]) ? t[r].test(e[r]) : t[r] === e[r]);
}
function Bc(e, t, n = {}) {
	return e.find((e) => e.type === t && zc(Object.fromEntries(Object.keys(n).map((t) => [t, e.attrs[t]])), n));
}
function Vc(e, t, n = {}) {
	return !!Bc(e, t, n);
}
function Hc(e, t, n) {
	if (!e || !t) return;
	let r = e.parent.childAfter(e.parentOffset);
	if ((!r.node || !r.node.marks.some((e) => e.type === t)) && (r = e.parent.childBefore(e.parentOffset)), !r.node || !r.node.marks.some((e) => e.type === t)) return;
	if (!n) {
		let e = r.node.marks.find((e) => e.type === t);
		e && (n = e.attrs);
	}
	if (!Bc([...r.node.marks], t, n)) return;
	let i = r.index, a = e.start() + r.offset, o = i + 1, s = a + r.node.nodeSize;
	for (; i > 0 && Vc([...e.parent.child(i - 1).marks], t, n);) --i, a -= e.parent.child(i).nodeSize;
	for (; o < e.parent.childCount && Vc([...e.parent.child(o).marks], t, n);) s += e.parent.child(o).nodeSize, o += 1;
	return {
		from: a,
		to: s
	};
}
function Uc(e, t) {
	if (typeof e == "string") {
		if (!t.marks[e]) throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
		return t.marks[e];
	}
	return e;
}
var Wc = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = Uc(e, r.schema), { doc: o, selection: s } = n, { $from: c, from: l, to: u } = s;
	if (i) {
		let e = Hc(c, a, t);
		if (e && e.from <= l && e.to >= u) {
			let t = k.create(o, e.from, e.to);
			n.setSelection(t);
		}
	}
	return !0;
}, Gc = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	for (let e = 0; e < n.length; e += 1) if (n[e](t)) return !0;
	return !1;
};
function Kc(e) {
	return e instanceof k;
}
function qc(e = 0, t = 0, n = 0) {
	return Math.min(Math.max(e, t), n);
}
function Jc(e, t = null) {
	if (!t) return null;
	let n = O.atStart(e), r = O.atEnd(e);
	if (t === "start" || t === !0) return n;
	if (t === "end") return r;
	let i = n.from, a = r.to;
	return t === "all" ? k.create(e, qc(0, i, a), qc(e.content.size, i, a)) : k.create(e, qc(t, i, a), qc(t, i, a));
}
function Yc() {
	return ["Android"].includes(navigator.platform) || /android/i.test(navigator.userAgent);
}
function Xc() {
	return [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod"
	].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function Zc() {
	return typeof navigator < "u" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
var Qc = (e = null, t = {}) => ({ editor: n, view: r, tr: i, dispatch: a }) => {
	t = {
		scrollIntoView: !0,
		...t
	};
	let o = () => {
		(Xc() || Yc()) && r.dom.focus(), Zc() && !Xc() && !Yc() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
			n.isDestroyed || (r.focus(), t?.scrollIntoView && n.commands.scrollIntoView());
		});
	};
	try {
		if (r.hasFocus() && e === null || e === !1) return !0;
	} catch {
		return !1;
	}
	if (a && e === null && !Kc(n.state.selection)) return o(), !0;
	let s = Jc(i.doc, e) || n.state.selection, c = n.state.selection.eq(s);
	return a && (c || i.setSelection(s), c && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, $c = (e, t) => (n) => e.every((e, r) => t(e, {
	...n,
	index: r
})), el = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({
	from: n.selection.from,
	to: n.selection.to
}, e, t), tl = (e) => {
	let t = e.childNodes;
	for (let n = t.length - 1; n >= 0; --n) {
		let r = t[n];
		r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && tl(r);
	}
	return e;
};
function nl(e) {
	if (typeof window > "u") throw Error("[tiptap error]: there is no window object available, so this function cannot be used");
	let t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
	return tl(n);
}
function rl(e, t, n) {
	if (e instanceof de || e instanceof m) return e;
	n = {
		slice: !0,
		parseOptions: {},
		...n
	};
	let r = typeof e == "object" && !!e, i = typeof e == "string";
	if (r) try {
		if (Array.isArray(e) && e.length > 0) return m.fromArray(e.map((e) => t.nodeFromJSON(e)));
		let r = t.nodeFromJSON(e);
		return n.errorOnInvalidContent && r.check(), r;
	} catch (r) {
		if (n.errorOnInvalidContent) throw Error("[tiptap error]: Invalid JSON content", { cause: r });
		return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", r), rl("", t, n);
	}
	if (i) {
		if (n.errorOnInvalidContent) {
			let r = !1, i = "", a = new Ie({
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
			if (n.slice ? Be.fromSchema(a).parseSlice(nl(e), n.parseOptions) : Be.fromSchema(a).parse(nl(e), n.parseOptions), n.errorOnInvalidContent && r) throw Error("[tiptap error]: Invalid HTML content", { cause: /* @__PURE__ */ Error(`Invalid element found: ${i}`) });
		}
		let r = Be.fromSchema(t);
		return n.slice ? r.parseSlice(nl(e), n.parseOptions).content : r.parse(nl(e), n.parseOptions);
	}
	return rl("", t, n);
}
function il(e, t, n) {
	let r = e.steps.length - 1;
	if (r < t) return;
	let i = e.steps[r];
	if (!(i instanceof Dt || i instanceof Ot)) return;
	let a = e.mapping.maps[r], o = 0;
	a.forEach((e, t, n, r) => {
		o === 0 && (o = r);
	}), e.setSelection(O.near(e.doc.resolve(o), n));
}
var al = (e) => !("type" in e), ol = (e, t, n) => ({ tr: r, dispatch: i, editor: a }) => {
	if (i) {
		n = {
			parseOptions: a.options.parseOptions,
			updateSelection: !0,
			applyInputRules: !1,
			applyPasteRules: !1,
			...n
		};
		let i, o = (e) => {
			a.emit("contentError", {
				editor: a,
				error: e,
				disableCollaboration: () => {
					"collaboration" in a.storage && typeof a.storage.collaboration == "object" && a.storage.collaboration && (a.storage.collaboration.isDisabled = !0);
				}
			});
		}, s = {
			preserveWhitespace: "full",
			...n.parseOptions
		};
		if (!n.errorOnInvalidContent && !a.options.enableContentCheck && a.options.emitContentError) try {
			rl(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: !0
			});
		} catch (e) {
			o(e);
		}
		try {
			i = rl(t, a.schema, {
				parseOptions: s,
				errorOnInvalidContent: n.errorOnInvalidContent ?? a.options.enableContentCheck
			});
		} catch (e) {
			return o(e), !1;
		}
		let { from: c, to: l } = typeof e == "number" ? {
			from: e,
			to: e
		} : {
			from: e.from,
			to: e.to
		}, u = !0, d = !0;
		if ((al(i) ? i : [i]).forEach((e) => {
			e.check(), u = u ? e.isText && e.marks.length === 0 : !1, d = d ? e.isBlock : !1;
		}), c === l && d) {
			let { parent: e } = r.doc.resolve(c);
			e.isTextblock && !e.type.spec.code && !e.childCount && (--c, l += 1);
		}
		let f;
		if (u) {
			if (Array.isArray(t)) f = t.map((e) => e.text || "").join("");
			else if (t instanceof m) {
				let e = "";
				t.forEach((t) => {
					t.text && (e += t.text);
				}), f = e;
			} else f = typeof t == "object" && t && t.text ? t.text : t;
			r.insertText(f, c, l);
		} else {
			f = i;
			let e = r.doc.resolve(c), t = e.node(), n = e.parentOffset === 0, a = t.isText || t.isTextblock, o = t.content.size > 0;
			n && a && o && d && (c = Math.max(0, c - 1)), r.replaceWith(c, l, f);
		}
		n.updateSelection && il(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", {
			from: c,
			text: f
		}), n.applyPasteRules && r.setMeta("applyPasteRules", {
			from: c,
			text: f
		});
	}
	return !0;
};
function sl(e) {
	for (let t = 0; t < e.edgeCount; t += 1) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var cl = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
	let { pos: i, attrs: a, content: o, updateSelection: s = !0 } = e, c;
	c = typeof i == "number" ? t.doc.resolve(i) : i || t.selection.$from;
	let l = sl(c.parent.contentMatchAt(c.index()));
	if (!l) return !1;
	let u = Object.keys(l.spec.attrs || {}), d = a ? Object.fromEntries(Object.entries(a).filter(([e]) => u.includes(e))) : {}, f;
	if (o) {
		let e = rl(o, r.schema);
		f = l.createAndFill(d, e);
	} else f = l.createAndFill(d);
	return f ? (n && (t.insert(c.pos, f), s && il(t, t.steps.length - 1, -1)), !0) : !1;
}, ll = () => ({ state: e, dispatch: t }) => nr(e, t), ul = () => ({ state: e, dispatch: t }) => rr(e, t), dl = () => ({ state: e, dispatch: t }) => Gn(e, t), fl = () => ({ state: e, dispatch: t }) => $n(e, t), pl = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = Zt(e.doc, e.selection.$from.pos, -1);
		return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, ml = () => ({ state: e, dispatch: t, tr: n }) => {
	try {
		let r = Zt(e.doc, e.selection.$from.pos, 1);
		return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
	} catch {
		return !1;
	}
}, hl = () => ({ state: e, dispatch: t }) => Kn(e, t), gl = () => ({ state: e, dispatch: t }) => qn(e, t);
function _l() {
	return typeof navigator < "u" && /Mac/.test(navigator.platform);
}
function vl(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n === "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e += 1) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) Xc() || _l() ? o = !0 : i = !0;
		else throw Error(`Unrecognized modifier name: ${n}`);
	}
	return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), a && (n = `Shift-${n}`), n;
}
var yl = (e) => ({ editor: t, view: n, tr: r, dispatch: i }) => {
	let a = vl(e).split(/-(?!$)/), o = a.find((e) => ![
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
function bl(e, t, n = {}) {
	let { from: r, to: i, empty: a } = e.selection, o = t ? kc(t, e.schema) : null, s = [];
	e.doc.nodesBetween(r, i, (e, t) => {
		if (e.isText) return;
		let n = Math.max(r, t), a = Math.min(i, t + e.nodeSize);
		s.push({
			node: e,
			from: n,
			to: a
		});
	});
	let c = i - r, l = s.filter((e) => !o || o.name === e.node.type.name).filter((e) => zc(e.node.attrs, n, { strict: !1 }));
	return a ? !!l.length : l.reduce((e, t) => e + t.to - t.from, 0) >= c;
}
var xl = (e, t = {}) => ({ state: n, dispatch: r }) => bl(n, kc(e, n.schema), t) ? ir(n, r) : !1, Sl = () => ({ state: e, dispatch: t }) => lr(e, t), Cl = (e) => ({ state: t, dispatch: n }) => kr(kc(e, t.schema))(t, n), wl = () => ({ state: e, dispatch: t }) => ar(e, t);
function Tl(e, t) {
	return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function El(e, t) {
	let n = typeof t == "string" ? [t] : t;
	return Object.keys(e).reduce((t, r) => (n.includes(r) || (t[r] = e[r]), t), {});
}
var Dl = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Tl(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = kc(e, r.schema)), s === "mark" && (o = Uc(e, r.schema));
	let c = !1;
	return n.selection.ranges.forEach((e) => {
		r.doc.nodesBetween(e.$from.pos, e.$to.pos, (e, r) => {
			a && a === e.type && (c = !0, i && n.setNodeMarkup(r, void 0, El(e.attrs, t))), o && e.marks.length && e.marks.forEach((a) => {
				o === a.type && (c = !0, i && n.addMark(r, r + e.nodeSize, o.create(El(a.attrs, t))));
			});
		});
	}), c;
}, Ol = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), kl = () => ({ tr: e, dispatch: t }) => {
	if (t) {
		let t = new Dn(e.doc);
		e.setSelection(t);
	}
	return !0;
}, Al = () => ({ state: e, dispatch: t }) => Xn(e, t), jl = () => ({ state: e, dispatch: t }) => er(e, t), Ml = () => ({ state: e, dispatch: t }) => fr(e, t), Nl = () => ({ state: e, dispatch: t }) => vr(e, t), Pl = () => ({ state: e, dispatch: t }) => _r(e, t);
function Fl(e, t, n = {}, r = {}) {
	return rl(e, t, {
		slice: !1,
		parseOptions: n,
		errorOnInvalidContent: r.errorOnInvalidContent
	});
}
var Il = (e, { errorOnInvalidContent: t, emitUpdate: n = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: a, dispatch: o, commands: s }) => {
	let { doc: c } = a;
	if (r.preserveWhitespace !== "full") {
		let s = Fl(e, i.schema, r, { errorOnInvalidContent: t ?? i.options.enableContentCheck });
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
function Ll(e, t) {
	let n = Uc(t, e.schema), { from: r, to: i, empty: a } = e.selection, o = [];
	a ? (e.storedMarks && o.push(...e.storedMarks), o.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, i, (e) => {
		o.push(...e.marks);
	});
	let s = o.find((e) => e.type.name === n.name);
	return s ? { ...s.attrs } : {};
}
function Rl(e, t) {
	let n = new bn(e);
	return t.forEach((e) => {
		e.steps.forEach((e) => {
			n.step(e);
		});
	}), n;
}
function zl(e, t, n) {
	let r = [];
	return e.nodesBetween(t.from, t.to, (e, t) => {
		n(e) && r.push({
			node: e,
			pos: t
		});
	}), r;
}
function Bl(e, t) {
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
function Vl(e) {
	return (t) => Bl(t.$from, e);
}
function P(e, t, n) {
	return e.config[t] === void 0 && e.parent ? P(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
		...n,
		parent: e.parent ? P(e.parent, t, n) : null
	}) : e.config[t];
}
function Hl(e) {
	return e.map((e) => {
		let t = P(e, "addExtensions", {
			name: e.name,
			options: e.options,
			storage: e.storage
		});
		return t ? [e, ...Hl(t())] : e;
	}).flat(10);
}
function Ul(e, t) {
	let n = et.fromSchema(t).serializeFragment(e), r = document.implementation.createHTMLDocument().createElement("div");
	return r.appendChild(n), r.innerHTML;
}
function Wl(e) {
	return typeof e == "function";
}
function F(e, t = void 0, ...n) {
	return Wl(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function Gl(e = {}) {
	return Object.keys(e).length === 0 && e.constructor === Object;
}
function Kl(e) {
	return {
		baseExtensions: e.filter((e) => e.type === "extension"),
		nodeExtensions: e.filter((e) => e.type === "node"),
		markExtensions: e.filter((e) => e.type === "mark")
	};
}
function ql(e) {
	let t = [], { nodeExtensions: n, markExtensions: r } = Kl(e), i = [...n, ...r], a = {
		default: null,
		validate: void 0,
		rendered: !0,
		renderHTML: null,
		parseHTML: null,
		keepOnSplit: !0,
		isRequired: !1
	}, o = n.filter((e) => e.name !== "text").map((e) => e.name), s = r.map((e) => e.name), c = [...o, ...s];
	return e.forEach((e) => {
		let n = P(e, "addGlobalAttributes", {
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
		let n = P(e, "addAttributes", {
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
function Jl(e) {
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
function Yl(e) {
	let t = [], n = Jl(e || ""), r = n.length;
	for (let e = 0; e < r; e += 1) {
		let r = n[e], i = r.indexOf(":");
		if (i === -1) continue;
		let a = r.slice(0, i).trim(), o = r.slice(i + 1).trim();
		a && o && t.push([a, o]);
	}
	return t;
}
function I(...e) {
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
				let r = new Map([...Yl(n[e]), ...Yl(t)]);
				n[e] = Array.from(r.entries()).map(([e, t]) => `${e}: ${t}`).join("; ");
			} else n[e] = t;
		}), n;
	}, {});
}
function Xl(e, t) {
	return t.filter((t) => t.type === e.type.name).filter((e) => e.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(e.attrs) || {} : { [t.name]: e.attrs[t.name] }).reduce((e, t) => I(e, t), {});
}
function Zl(e) {
	return typeof e == "string" ? e.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(e) : e === "true" || e !== "false" && e : e;
}
function Ql(e, t) {
	return "style" in e ? e : {
		...e,
		getAttrs: (n) => {
			let r = e.getAttrs ? e.getAttrs(n) : e.attrs;
			if (r === !1) return !1;
			let i = t.reduce((e, t) => {
				let r = t.attribute.parseHTML ? t.attribute.parseHTML(n) : Zl(n.getAttribute(t.name));
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
function $l(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e === "attrs" && Gl(t) ? !1 : t != null));
}
function eu(e) {
	let t = {};
	return !e?.attribute?.isRequired && "default" in (e?.attribute || {}) && (t.default = e.attribute.default), e?.attribute?.validate !== void 0 && (t.validate = e.attribute.validate), [e.name, t];
}
function tu(e, t) {
	let n = ql(e), { nodeExtensions: r, markExtensions: i } = Kl(e), a = r.find((e) => P(e, "topNode"))?.name;
	return new Ie({
		topNode: a,
		nodes: Object.fromEntries(r.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = $l({
				...e.reduce((e, t) => {
					let n = P(t, "extendNodeSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				content: F(P(r, "content", a)),
				marks: F(P(r, "marks", a)),
				group: F(P(r, "group", a)),
				inline: F(P(r, "inline", a)),
				atom: F(P(r, "atom", a)),
				selectable: F(P(r, "selectable", a)),
				draggable: F(P(r, "draggable", a)),
				code: F(P(r, "code", a)),
				whitespace: F(P(r, "whitespace", a)),
				linebreakReplacement: F(P(r, "linebreakReplacement", a)),
				defining: F(P(r, "defining", a)),
				isolating: F(P(r, "isolating", a)),
				attrs: Object.fromEntries(i.map(eu))
			}), s = F(P(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => Ql(e, i)));
			let c = P(r, "renderHTML", a);
			c && (o.toDOM = (e) => c({
				node: e,
				HTMLAttributes: Xl(e, i)
			}));
			let l = P(r, "renderText", a);
			return l && (o.toText = l), [r.name, o];
		})),
		marks: Object.fromEntries(i.map((r) => {
			let i = n.filter((e) => e.type === r.name), a = {
				name: r.name,
				options: r.options,
				storage: r.storage,
				editor: t
			}, o = $l({
				...e.reduce((e, t) => {
					let n = P(t, "extendMarkSchema", a);
					return {
						...e,
						...n ? n(r) : {}
					};
				}, {}),
				inclusive: F(P(r, "inclusive", a)),
				excludes: F(P(r, "excludes", a)),
				group: F(P(r, "group", a)),
				spanning: F(P(r, "spanning", a)),
				code: F(P(r, "code", a)),
				attrs: Object.fromEntries(i.map(eu))
			}), s = F(P(r, "parseHTML", a));
			s && (o.parseDOM = s.map((e) => Ql(e, i)));
			let c = P(r, "renderHTML", a);
			return c && (o.toDOM = (e) => c({
				mark: e,
				HTMLAttributes: Xl(e, i)
			})), [r.name, o];
		}))
	});
}
function nu(e) {
	let t = e.filter((t, n) => e.indexOf(t) !== n);
	return Array.from(new Set(t));
}
function ru(e) {
	return e.sort((e, t) => {
		let n = P(e, "priority") || 100, r = P(t, "priority") || 100;
		return n > r ? -1 : +(n < r);
	});
}
function iu(e) {
	let t = ru(Hl(e)), n = nu(t.map((e) => e.name));
	return n.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${n.map((e) => `'${e}'`).join(", ")}]. This can lead to issues.`), t;
}
function au(e, t) {
	return tu(iu(e), t);
}
function ou(e, t) {
	let n = au(t), r = nl(e);
	return Be.fromSchema(n).parse(r).toJSON();
}
function su(e, t, n) {
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
function cu(e, t) {
	return su(e, {
		from: 0,
		to: e.content.size
	}, t);
}
function lu(e) {
	return Object.fromEntries(Object.entries(e.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
function uu(e, t) {
	let n = kc(t, e.schema), { from: r, to: i } = e.selection, a = [];
	e.doc.nodesBetween(r, i, (e) => {
		a.push(e);
	});
	let o = a.reverse().find((e) => e.type.name === n.name);
	return o ? { ...o.attrs } : {};
}
function du(e, t) {
	let n = Tl(typeof t == "string" ? t : t.name, e.schema);
	return n === "node" ? uu(e, t) : n === "mark" ? Ll(e, t) : {};
}
function fu(e, t = JSON.stringify) {
	let n = {};
	return e.filter((e) => {
		let r = t(e);
		return Object.prototype.hasOwnProperty.call(n, r) ? !1 : n[r] = !0;
	});
}
function pu(e) {
	let t = fu(e);
	return t.length === 1 ? t : t.filter((e, n) => !t.filter((e, t) => t !== n).some((t) => e.oldRange.from >= t.oldRange.from && e.oldRange.to <= t.oldRange.to && e.newRange.from >= t.newRange.from && e.newRange.to <= t.newRange.to));
}
function mu(e) {
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
	}), pu(r);
}
function hu(e, t = 0) {
	let n = +(e.type !== e.type.schema.topNodeType), r = t, i = r + e.nodeSize, a = e.marks.map((e) => {
		let t = { type: e.type.name };
		return Object.keys(e.attrs).length && (t.attrs = { ...e.attrs }), t;
	}), o = { ...e.attrs }, s = {
		type: e.type.name,
		from: r,
		to: i
	};
	return Object.keys(o).length && (s.attrs = o), a.length && (s.marks = a), e.content.childCount && (s.content = [], e.forEach((e, r) => {
		s.content?.push(hu(e, t + r + n));
	})), e.text && (s.text = e.text), s;
}
function gu(e, t, n) {
	let r = [];
	return e === t ? n.resolve(e).marks().forEach((t) => {
		let i = Hc(n.resolve(e), t.type);
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
var _u = (e, t, n, r = 20) => {
	let i = e.doc.resolve(n), a = r, o = null;
	for (; a > 0 && o === null;) {
		let e = i.node(a);
		e?.type.name === t ? o = e : --a;
	}
	return [o, a];
};
function vu(e, t) {
	return t.nodes[e] || t.marks[e] || null;
}
function yu(e, t, n) {
	return Object.fromEntries(Object.entries(n).filter(([n]) => {
		let r = e.find((e) => e.type === t && e.name === n);
		return r ? r.attribute.keepOnSplit : !1;
	}));
}
var bu = (e, t = 500) => {
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
function xu(e, t, n = {}) {
	let { empty: r, ranges: i } = e.selection, a = t ? Uc(t, e.schema) : null;
	if (r) return !!(e.storedMarks || e.selection.$from.marks()).filter((e) => !a || a.name === e.type.name).find((e) => zc(e.attrs, n, { strict: !1 }));
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
	let c = s.filter((e) => !a || a.name === e.mark.type.name).filter((e) => zc(e.mark.attrs, n, { strict: !1 })).reduce((e, t) => e + t.to - t.from, 0), l = s.filter((e) => !a || e.mark.type !== a && e.mark.type.excludes(a)).reduce((e, t) => e + t.to - t.from, 0);
	return (c > 0 ? c + l : c) >= o;
}
function Su(e, t, n = {}) {
	if (!t) return bl(e, null, n) || xu(e, null, n);
	let r = Tl(t, e.schema);
	return r === "node" ? bl(e, t, n) : r === "mark" && xu(e, t, n);
}
var Cu = (e, t) => {
	let { $from: n, $to: r, $anchor: i } = e.selection;
	if (t) {
		let n = Vl((e) => e.type.name === t)(e.selection);
		if (!n) return !1;
		let r = e.doc.resolve(n.pos + 1);
		return i.pos + 1 === r.end();
	}
	return !(r.parentOffset < r.parent.nodeSize - 2 || n.pos !== r.pos);
}, wu = (e) => {
	let { $from: t, $to: n } = e.selection;
	return !(t.parentOffset > 0 || t.pos !== n.pos);
};
function Tu(e, t) {
	return Array.isArray(t) ? t.some((t) => (typeof t == "string" ? t : t.name) === e.name) : t;
}
function Eu(e, t) {
	let { nodeExtensions: n } = Kl(t), r = n.find((t) => t.name === e);
	if (!r) return !1;
	let i = F(P(r, "group", {
		name: r.name,
		options: r.options,
		storage: r.storage
	}));
	return typeof i == "string" && i.split(" ").includes("list");
}
function Du(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
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
			r !== !1 && (Du(e, {
				ignoreWhitespace: n,
				checkChildren: t
			}) || (r = !1));
		}), r;
	}
	return !1;
}
function Ou(e) {
	return e instanceof A;
}
var ku = class e {
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
function Au(e, t) {
	let n = t.mapping.mapResult(e.position);
	return {
		position: new ku(n.pos),
		mapResult: n
	};
}
function ju(e) {
	return new ku(e);
}
function Mu({ json: e, validMarks: t, validNodes: n, options: r, rewrittenContent: i = [] }) {
	return e.marks && Array.isArray(e.marks) && (e.marks = e.marks.filter((e) => {
		if (e == null) return !1;
		let n = typeof e == "string" ? e : e.type;
		return t.has(n) ? !0 : (i.push({
			original: JSON.parse(JSON.stringify(e)),
			unsupported: n
		}), !1);
	})), e.content && Array.isArray(e.content) && (e.content = e.content.map((e) => e == null ? null : Mu({
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
function Nu(e, t, n) {
	let { selection: r } = t, i = null;
	if (Kc(r) && (i = r.$cursor), i) {
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
var Pu = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = n, { empty: o, ranges: s } = a, c = Uc(e, r.schema);
	if (i) if (o) {
		let e = Ll(r, c);
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
	return Nu(r, n, c);
}, Fu = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), Iu = (e, t = {}) => ({ state: n, dispatch: r, chain: i }) => {
	let a = kc(e, n.schema), o;
	return n.selection.$anchor.sameParent(n.selection.$head) && (o = n.selection.$anchor.parent.attrs), a.isTextblock ? i().command(({ commands: e }) => br(a, {
		...o,
		...t
	})(n) ? !0 : e.clearNodes()).command(({ state: e }) => br(a, {
		...o,
		...t
	})(e, r)).run() : (console.warn("[tiptap warn]: Currently \"setNode()\" only supports text block nodes."), !1);
}, Lu = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, r = qc(e, 0, n.content.size), i = A.create(n, r);
		t.setSelection(i);
	}
	return !0;
}, Ru = (e, t) => ({ tr: n, state: r, dispatch: i }) => {
	let { selection: a } = r, o, s;
	return typeof t == "number" ? (o = t, s = t) : t && "from" in t && "to" in t ? (o = t.from, s = t.to) : (o = a.from, s = a.to), i && n.doc.nodesBetween(o, s, (t, r) => {
		t.isText || n.setNodeMarkup(r, void 0, {
			...t.attrs,
			dir: e
		});
	}), !0;
}, zu = (e) => ({ tr: t, dispatch: n }) => {
	if (n) {
		let { doc: n } = t, { from: r, to: i } = typeof e == "number" ? {
			from: e,
			to: e
		} : e, a = k.atStart(n).from, o = k.atEnd(n).to, s = qc(r, a, o), c = qc(i, a, o), l = k.create(n, s, c);
		t.setSelection(l);
	}
	return !0;
}, Bu = (e) => ({ state: t, dispatch: n }) => Mr(kc(e, t.schema))(t, n);
function Vu(e, t) {
	let n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
	if (n) {
		let r = n.filter((e) => t?.includes(e.type.name));
		e.tr.ensureMarks(r);
	}
}
var Hu = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: i }) => {
	let { selection: a, doc: o } = t, { $from: s, $to: c } = a, l = i.extensionManager.attributes, u = yu(l, s.node().type.name, s.node().attrs);
	if (a instanceof A && a.node.isBlock) return !s.parentOffset || !Kt(o, s.pos) ? !1 : (r && (e && Vu(n, i.extensionManager.splittableMarks), t.split(s.pos).scrollIntoView()), !0);
	if (!s.parent.isBlock) return !1;
	let d = c.parentOffset === c.parent.content.size, f = s.depth === 0 ? void 0 : sl(s.node(-1).contentMatchAt(s.indexAfter(-1))), p = d && f ? [{
		type: f,
		attrs: u
	}] : void 0, m = Kt(t.doc, t.mapping.map(s.pos), 1, p);
	if (!p && !m && Kt(t.doc, t.mapping.map(s.pos), 1, f ? [{ type: f }] : void 0) && (m = !0, p = f ? [{
		type: f,
		attrs: u
	}] : void 0), r) {
		if (m && (a instanceof k && t.deleteSelection(), t.split(t.mapping.map(s.pos), 1, p), f && !d && !s.parentOffset && s.parent.type !== f)) {
			let e = t.mapping.map(s.before()), n = t.doc.resolve(e);
			s.node(-1).canReplaceWith(n.index(), n.index() + 1, f) && t.setNodeMarkup(t.mapping.map(s.before()), f);
		}
		e && Vu(n, i.extensionManager.splittableMarks), t.scrollIntoView();
	}
	return m;
}, Uu = (e, t = {}) => ({ tr: n, state: r, dispatch: i, editor: a }) => {
	let o = kc(e, r.schema), { $from: s, $to: c } = r.selection, l = r.selection.node;
	if (l && l.isBlock || s.depth < 2 || !s.sameParent(c)) return !1;
	let u = s.node(-1);
	if (u.type !== o) return !1;
	let d = a.extensionManager.attributes;
	if (s.parent.content.size === 0 && s.node(-1).childCount === s.indexAfter(-1)) {
		if (s.depth === 2 || s.node(-3).type !== o || s.index(-2) !== s.node(-2).childCount - 1) return !1;
		if (i) {
			let e = m.empty, r = s.index(-1) ? 1 : s.index(-2) ? 2 : 3;
			for (let t = s.depth - r; t >= s.depth - 3; --t) e = m.from(s.node(t).copy(e));
			let i = s.indexAfter(-1) < s.node(-2).childCount ? 1 : s.indexAfter(-2) < s.node(-3).childCount ? 2 : 3, a = {
				...yu(d, s.node().type.name, s.node().attrs),
				...t
			}, c = o.contentMatch.defaultType?.createAndFill(a) || void 0;
			e = e.append(m.from(o.createAndFill(null, c) || void 0));
			let l = s.before(s.depth - (r - 1));
			n.replace(l, s.after(-i), new b(e, 4 - r, 0));
			let u = -1;
			n.doc.nodesBetween(l, n.doc.content.size, (e, t) => {
				if (u > -1) return !1;
				e.isTextblock && e.content.size === 0 && (u = t + 1);
			}), u > -1 && n.setSelection(k.near(n.doc.resolve(u))), n.scrollIntoView();
		}
		return !0;
	}
	let f = c.pos === s.end() ? u.contentMatchAt(0).defaultType : null, p = {
		...yu(d, u.type.name, u.attrs),
		...t
	}, h = {
		...yu(d, s.node().type.name, s.node().attrs),
		...t
	};
	n.delete(s.pos, c.pos);
	let g = f ? [{
		type: o,
		attrs: p
	}, {
		type: f,
		attrs: h
	}] : [{
		type: o,
		attrs: p
	}];
	if (!Kt(n.doc, s.pos, 2)) return !1;
	if (i) {
		let { selection: e, storedMarks: t } = r, { splittableMarks: o } = a.extensionManager, c = t || e.$to.parentOffset && e.$from.marks();
		if (n.split(s.pos, 2, g).scrollIntoView(), !c || !i) return !0;
		let l = c.filter((e) => o.includes(e.type.name));
		n.ensureMarks(l);
	}
	return !0;
};
function Wu(e) {
	return !e || e === "1" ? null : e;
}
function Gu(e, t) {
	return Wu(e) === Wu(t);
}
var Ku = (e, t) => {
	let n = Vl((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Jt(e.doc, n.pos)) || !Gu(n.node.attrs.type, i?.attrs.type) || e.join(n.pos), !0;
}, qu = (e, t) => {
	let n = Vl((e) => e.type === t)(e.selection);
	if (!n) return !0;
	let r = e.doc.resolve(n.start).after(n.depth);
	if (r === void 0) return !0;
	let i = e.doc.nodeAt(r);
	return !(n.node.type === i?.type && Jt(e.doc, r)) || !Gu(n.node.attrs.type, i?.attrs.type) || e.join(r), !0;
};
function Ju(e) {
	let t = e.doc, n = t.firstChild;
	if (!n) return null;
	let r = t.resolve(1), i = t.resolve(n.nodeSize - 1);
	return k.between(r, i);
}
var Yu = (e, t, n, r = {}) => ({ editor: i, tr: a, state: o, dispatch: s, chain: c, commands: l, can: u }) => {
	let { extensions: d, splittableMarks: f } = i.extensionManager, p = kc(e, o.schema), m = kc(t, o.schema), { selection: h, storedMarks: g } = o, { $from: _, $to: v } = h, y = _.blockRange(v), b = g || h.$to.parentOffset && h.$from.marks();
	if (!y) return !1;
	let x = Vl((e) => Eu(e.type.name, d))(h), S = h.from === 0 && h.to === o.doc.content.size, ee = o.doc.content.content, te = ee.length === 1 ? ee[0] : null, C = S && te && Eu(te.type.name, d) ? {
		node: te,
		pos: 0,
		depth: 0
	} : null, ne = x ?? C, w = !!x && y.depth >= 1 && y.depth - x.depth <= 1, re = !!C;
	if ((w || re) && ne) {
		if (ne.node.type === p) return S && re ? c().command(({ tr: e, dispatch: t }) => {
			let n = Ju(e);
			return n ? (e.setSelection(n), t && t(e), !0) : !1;
		}).liftListItem(m).run() : l.liftListItem(m);
		if (Eu(ne.node.type.name, d) && p.validContent(ne.node.content)) return c().command(() => (a.setNodeMarkup(ne.pos, p), !0)).command(() => Ku(a, p)).command(() => qu(a, p)).run();
	}
	return !n || !b || !s ? c().command(() => u().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => Ku(a, p)).command(() => qu(a, p)).run() : c().command(() => {
		let e = u().wrapInList(p, r), t = b.filter((e) => f.includes(e.type.name));
		return a.ensureMarks(t), e ? !0 : l.clearNodes();
	}).wrapInList(p, r).command(() => Ku(a, p)).command(() => qu(a, p)).run();
}, Xu = (e, t = {}, n = {}) => ({ state: r, commands: i }) => {
	let { extendEmptyMarkRange: a = !1 } = n, o = Uc(e, r.schema);
	return xu(r, o, t) ? i.unsetMark(o, { extendEmptyMarkRange: a }) : i.setMark(o, t);
}, Zu = (e, t, n = {}) => ({ state: r, commands: i }) => {
	let a = kc(e, r.schema), o = kc(t, r.schema), s = bl(r, a, n), c;
	return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), s ? i.setNode(o, c) : i.setNode(a, {
		...c,
		...n
	});
}, Qu = (e, t = {}) => ({ state: n, commands: r }) => {
	let i = kc(e, n.schema);
	return bl(n, i, t) ? r.lift(i) : r.wrapIn(i, t);
}, $u = () => ({ state: e, dispatch: t }) => {
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
}, ed = (e = {}) => ({ tr: t, dispatch: n, editor: r }) => {
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
}, td = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let { extendEmptyMarkRange: a = !1 } = t, { selection: o } = n, s = Uc(e, r.schema), { $from: c, empty: l, ranges: u } = o;
	if (!i) return !0;
	if (l && a) {
		let { from: e, to: t } = o, r = c.marks().find((e) => e.type === s)?.attrs, i = Hc(c, s, r);
		i && (e = i.from, t = i.to), n.removeMark(e, t, s);
	} else u.forEach((e) => {
		n.removeMark(e.$from.pos, e.$to.pos, s);
	});
	return n.removeStoredMark(s), !0;
}, nd = (e) => ({ tr: t, state: n, dispatch: r }) => {
	let { selection: i } = n, a, o;
	return typeof e == "number" ? (a = e, o = e) : e && "from" in e && "to" in e ? (a = e.from, o = e.to) : (a = i.from, o = i.to), r && t.doc.nodesBetween(a, o, (e, n) => {
		if (e.isText) return;
		let r = { ...e.attrs };
		delete r.dir, t.setNodeMarkup(n, void 0, r);
	}), !0;
}, rd = (e, t = {}) => ({ tr: n, state: r, dispatch: i }) => {
	let a = null, o = null, s = Tl(typeof e == "string" ? e : e.name, r.schema);
	if (!s) return !1;
	s === "node" && (a = kc(e, r.schema)), s === "mark" && (o = Uc(e, r.schema));
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
}, id = (e, t = {}) => ({ state: n, dispatch: r }) => yr(kc(e, n.schema), t)(n, r), ad = (e, t = {}) => ({ state: n, dispatch: r }) => Er(kc(e, n.schema), t)(n, r), od = class {
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
function sd(e, t) {
	if (e === t) return !0;
	if (!e || !t) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	return n.length === r.length && n.every((n) => Object.prototype.hasOwnProperty.call(t, n) && Object.is(e[n], t[n]));
}
function cd(e, t) {
	let { selection: n } = e, { $from: r } = n;
	if (n instanceof A) {
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
function ld(e, t, n) {
	let r = document.querySelector(`style[data-tiptap-style${n ? `-${n}` : ""}]`);
	if (r !== null) return r;
	let i = document.createElement("style");
	return t && i.setAttribute("nonce", t), i.setAttribute(`data-tiptap-style${n ? `-${n}` : ""}`, ""), i.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(i), i;
}
function ud(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
}
function dd(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function fd() {
	return typeof navigator < "u" && /Firefox/.test(navigator.userAgent);
}
function pd(e) {
	return typeof e == "number";
}
function md(e) {
	return Object.prototype.toString.call(e).slice(8, -1);
}
function hd(e) {
	return md(e) === "Object" && e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
vc({}, {
	createAtomBlockMarkdownSpec: () => vd,
	createBlockMarkdownSpec: () => yd,
	createInlineMarkdownSpec: () => Sd,
	parseAttributes: () => gd,
	parseIndentedBlocks: () => Cd,
	renderNestedMarkdownContent: () => wd,
	serializeAttributes: () => _d
});
function gd(e) {
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
function _d(e) {
	if (!e || Object.keys(e).length === 0) return "";
	let t = [];
	return e.class && String(e.class).split(/\s+/).filter(Boolean).forEach((e) => t.push(`.${e}`)), e.id && t.push(`#${e.id}`), Object.entries(e).forEach(([e, n]) => {
		e === "class" || e === "id" || (n === !0 ? t.push(e) : n !== !1 && n != null && t.push(`${e}="${String(n)}"`));
	}), t.join(" ");
}
function vd(e) {
	let { nodeName: t, name: n, parseAttributes: r = gd, serializeAttributes: i = _d, defaultAttributes: a = {}, requiredAttributes: o = [], allowedAttributes: s } = e, c = n || t, l = (e) => {
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
function yd(e) {
	let { nodeName: t, name: n, getContent: r, parseAttributes: i = gd, serializeAttributes: a = _d, defaultAttributes: o = {}, content: s = "block", allowedAttributes: c } = e, l = n || t, u = (e) => {
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
function bd(e) {
	if (!e.trim()) return {};
	let t = {}, n = /(\w+)=(?:"([^"]*)"|'([^']*)')/g, r = n.exec(e);
	for (; r !== null;) {
		let [, i, a, o] = r;
		t[i] = a || o, r = n.exec(e);
	}
	return t;
}
function xd(e) {
	return Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function Sd(e) {
	let { nodeName: t, name: n, getContent: r, parseAttributes: i = bd, serializeAttributes: a = xd, defaultAttributes: o = {}, selfClosing: s = !1, allowedAttributes: c } = e, l = n || t, u = (e) => {
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
function Cd(e, t, n) {
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
function wd(e, t, n, r) {
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
function Td(e) {
	return typeof e.type == "string" ? e.type : e.type.name;
}
function Ed(e, t) {
	if (e.length !== t.length) return !1;
	let n = Array.from({ length: t.length }, () => !1);
	return e.every((e) => {
		let r = Td(e), i = t.findIndex((t, i) => !n[i] && r === Td(t) && sd(e.attrs, t.attrs));
		return i === -1 ? !1 : (n[i] = !0, !0);
	});
}
function Dd(e, t) {
	let n = { ...e };
	return hd(e) && hd(t) && Object.keys(t).forEach((r) => {
		hd(t[r]) && hd(e[r]) ? n[r] = Dd(e[r], t[r]) : n[r] = t[r];
	}), n;
}
function Od(e, t, n = {}) {
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
var kd = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler, this.undoable = e.undoable ?? !0;
	}
}, Ad = (e, t) => {
	if (Rc(t)) return t.exec(e);
	let n = t(e);
	if (!n) return null;
	let r = [n.text];
	return r.index = n.index, r.input = e, r.data = n.data, n.replaceWith && (n.text.includes(n.replaceWith) || console.warn("[tiptap warn]: \"inputRuleMatch.replaceWith\" must be part of \"inputRuleMatch.text\"."), r.push(n.replaceWith)), r;
};
function jd(e) {
	let { editor: t, from: n, to: r, text: i, rules: a, plugin: o } = e, { view: s } = t;
	if (s.composing) return !1;
	let c = s.state.doc.resolve(n);
	if (c.parent.type.spec.code || (c.nodeBefore || c.nodeAfter)?.marks.find((e) => e.type.spec.code)) return !1;
	let l = !1, u = bu(c) + i;
	return a.forEach((e) => {
		if (l) return;
		let a = Ad(u, e.find);
		if (!a) return;
		let d = a[0].length - i.length;
		if (d > 0) {
			let e = c.parentOffset - d;
			if (e < 0 || c.parent.textBetween(e, c.parentOffset) !== a[0].slice(0, d)) return;
		}
		let f = s.state.tr, p = yc({
			state: s.state,
			transaction: f
		}), m = {
			from: n - (a[0].length - i.length),
			to: r
		}, { commands: h, chain: g, can: _ } = new bc({
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
function Md(e) {
	let { editor: t, rules: n } = e, r = new j({
		state: {
			init() {
				return null;
			},
			apply(e, i, a) {
				let o = e.getMeta(r);
				if (o) return o;
				let s = e.getMeta("applyInputRules");
				return s && setTimeout(() => {
					let { text: e } = s;
					e = typeof e == "string" ? e : Ul(m.from(e), a.schema);
					let { from: i } = s, o = i + e.length;
					jd({
						editor: t,
						from: i,
						to: o,
						text: e,
						rules: n,
						plugin: r
					});
				}), e.selectionSet || e.docChanged ? null : i;
			}
		},
		props: {
			handleTextInput(e, i, a, o) {
				return jd({
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
				i && jd({
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
				return a ? jd({
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
var Nd = class {
	constructor(e = {}) {
		this.type = "extendable", this.parent = null, this.child = null, this.name = "", this.config = { name: this.name }, this.config = {
			...this.config,
			...e
		}, this.name = this.config.name;
	}
	get options() {
		return { ...F(P(this, "addOptions", { name: this.name })) };
	}
	get storage() {
		return { ...F(P(this, "addStorage", {
			name: this.name,
			options: this.options
		})) };
	}
	configure(e = {}) {
		let t = this.extend({
			...this.config,
			addOptions: () => Dd(this.options, e)
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
}, Pd = class e extends Nd {
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
}, Fd = class {
	constructor(e) {
		this.find = e.find, this.handler = e.handler;
	}
}, Id = (e, t, n) => {
	if (Rc(t)) return [...e.matchAll(t)];
	let r = t(e, n);
	return r ? r.map((t) => {
		let n = [t.text];
		return n.index = t.index, n.input = e, n.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn("[tiptap warn]: \"pasteRuleMatch.replaceWith\" must be part of \"pasteRuleMatch.text\"."), n.push(t.replaceWith)), n;
	}) : [];
};
function Ld(e) {
	let { editor: t, state: n, from: r, to: i, rule: a, pasteEvent: o, dropEvent: s } = e, { commands: c, chain: l, can: u } = new bc({
		editor: t,
		state: n
	}), d = [];
	return n.doc.nodesBetween(r, i, (e, t) => {
		if (e.type?.spec?.code || !(e.isText || e.isTextblock || e.isInline)) return;
		let f = e.content?.size ?? e.nodeSize ?? 0, p = Math.max(r, t), m = Math.min(i, t + f);
		p >= m || Id(e.isText ? e.text || "" : e.textBetween(p - t, m - t, void 0, "￼"), a.find, o).forEach((e) => {
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
var Rd = null, zd = (e) => {
	let t = new ClipboardEvent("paste", { clipboardData: new DataTransfer() });
	return t.clipboardData?.setData("text/html", e), t;
};
function Bd(e) {
	let { editor: t, rules: n } = e, r = null, i = !1, a = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, s;
	try {
		s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
	} catch {
		s = null;
	}
	let c = ({ state: e, from: n, to: r, rule: i, pasteEvt: a }) => {
		let c = e.tr, l = yc({
			state: e,
			transaction: c
		});
		if (!(!Ld({
			editor: t,
			state: l,
			from: Math.max(n - 1, 0),
			to: r.b - 1,
			rule: i,
			pasteEvent: a,
			dropEvent: s
		}) || !c.steps.length)) {
			try {
				s = typeof DragEvent < "u" ? new DragEvent("drop") : null;
			} catch {
				s = null;
			}
			return o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, c;
		}
	};
	return n.map((e) => new j({
		view(e) {
			let n = (n) => {
				r = e.dom.parentElement?.contains(n.target) ? e.dom.parentElement : null, r && (Rd = t);
			}, i = () => {
				Rd &&= null;
			};
			return window.addEventListener("dragstart", n), window.addEventListener("dragend", i), { destroy() {
				window.removeEventListener("dragstart", n), window.removeEventListener("dragend", i);
			} };
		},
		props: { handleDOMEvents: {
			drop: (e, t) => {
				if (a = r === e.dom.parentElement, s = t, !a) {
					let e = Rd;
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
				return o = t, i = !!n?.includes("data-pm-slice"), !1;
			}
		} },
		appendTransaction: (t, n, r) => {
			let s = t[0], l = s.getMeta("uiEvent") === "paste" && !i, u = s.getMeta("uiEvent") === "drop" && !a, d = s.getMeta("applyPasteRules"), f = !!d;
			if (!l && !u && !f) return;
			if (f) {
				let { text: t } = d;
				t = typeof t == "string" ? t : Ul(m.from(t), r.schema);
				let { from: n } = d, i = n + t.length, a = zd(t);
				return c({
					rule: e,
					state: r,
					from: n,
					to: { b: i },
					pasteEvt: a
				});
			}
			let p = n.doc.content.findDiffStart(r.doc.content), h = n.doc.content.findDiffEnd(r.doc.content);
			if (!(!pd(p) || !h || p === h.b)) return c({
				rule: e,
				state: r,
				from: p,
				to: h,
				pasteEvt: o
			});
		}
	}));
}
var Vd = class {
	constructor(e, t) {
		this.splittableMarks = [], this.nonClearableMarks = [], this.editor = t, this.baseExtensions = e, this.extensions = iu(e), this.schema = tu(this.extensions, t), this.setupExtensions();
	}
	get commands() {
		return this.extensions.reduce((e, t) => {
			let n = P(t, "addCommands", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: this.editor,
				type: vu(t.name, this.schema)
			});
			return n ? {
				...e,
				...n()
			} : e;
		}, {});
	}
	get plugins() {
		let { editor: e } = this;
		return ru([...this.extensions].reverse()).flatMap((t) => {
			let n = {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: vu(t.name, this.schema)
			}, r = [], i = P(t, "addKeyboardShortcuts", n), a = {};
			if (t.type === "mark" && P(t, "exitable", n) && (a.ArrowRight = () => Pd.handleExit({
				editor: e,
				mark: t
			})), i) {
				let t = Object.fromEntries(Object.entries(i()).map(([t, n]) => [t, () => n({ editor: e })]));
				a = {
					...a,
					...t
				};
			}
			let o = hc(a);
			r.push(o);
			let s = P(t, "addInputRules", n);
			if (Tu(t, e.options.enableInputRules) && s) {
				let t = s();
				if (t && t.length) {
					let n = Md({
						editor: e,
						rules: t
					}), i = Array.isArray(n) ? n : [n];
					r.push(...i);
				}
			}
			let c = P(t, "addPasteRules", n);
			if (Tu(t, e.options.enablePasteRules) && c) {
				let t = c();
				if (t && t.length) {
					let n = Bd({
						editor: e,
						rules: t
					});
					r.push(...n);
				}
			}
			let l = P(t, "addProseMirrorPlugins", n);
			if (l) {
				let e = l();
				r.push(...e);
			}
			return r;
		});
	}
	get attributes() {
		return ql(this.extensions);
	}
	get nodeViews() {
		let { editor: e } = this, { nodeExtensions: t } = Kl(this.extensions);
		return Object.fromEntries(t.filter((e) => !!P(e, "addNodeView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = P(t, "addNodeView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: kc(t.name, this.schema)
			});
			if (!r) return [];
			let i = r();
			return i ? [t.name, (r, a, o, s, c) => {
				let l = Xl(r, n);
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
		return ru([...this.extensions].reverse()).reduceRight((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: vu(n.name, this.schema)
			}, i = P(n, "dispatchTransaction", r);
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
		return ru([...this.extensions]).reduce((e, n) => {
			let r = {
				name: n.name,
				options: n.options,
				storage: this.editor.extensionStorage[n.name],
				editor: t,
				type: vu(n.name, this.schema)
			}, i = P(n, "transformPastedHTML", r);
			return i ? (t, n) => {
				let a = e(t, n);
				return i.call(r, a);
			} : e;
		}, e || ((e) => e));
	}
	get markViews() {
		let { editor: e } = this, { markExtensions: t } = Kl(this.extensions);
		return Object.fromEntries(t.filter((e) => !!P(e, "addMarkView")).map((t) => {
			let n = this.attributes.filter((e) => e.type === t.name), r = P(t, "addMarkView", {
				name: t.name,
				options: t.options,
				storage: this.editor.extensionStorage[t.name],
				editor: e,
				type: Uc(t.name, this.schema)
			});
			return r ? [t.name, (i, a, o) => {
				let s = Xl(i, n);
				return r()({
					mark: i,
					view: a,
					inline: o,
					editor: e,
					extension: t,
					HTMLAttributes: s,
					updateAttributes: (t) => {
						Od(i, e, t);
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
				type: vu(e.name, this.schema)
			};
			e.type === "mark" && ((F(P(e, "keepOnSplit", t)) ?? !0) && this.splittableMarks.push(e.name), (F(P(e, "clearable", t)) ?? !0) || this.nonClearableMarks.push(e.name));
			let n = P(e, "onBeforeCreate", t), r = P(e, "onCreate", t), i = P(e, "onUpdate", t), a = P(e, "onSelectionUpdate", t), o = P(e, "onTransaction", t), s = P(e, "onFocus", t), c = P(e, "onBlur", t), l = P(e, "onDestroy", t);
			n && this.editor.on("beforeCreate", n), r && this.editor.on("create", r), i && this.editor.on("update", i), a && this.editor.on("selectionUpdate", a), o && this.editor.on("transaction", o), s && this.editor.on("focus", s), c && this.editor.on("blur", c), l && this.editor.on("destroy", l);
		});
	}
};
Vd.resolve = iu, Vd.sort = ru, Vd.flatten = Hl, vc({}, {
	ClipboardTextSerializer: () => Hd,
	Commands: () => Ud,
	Delete: () => Wd,
	Drop: () => Gd,
	Editable: () => Kd,
	FocusEvents: () => Jd,
	Keymap: () => Yd,
	Paste: () => Xd,
	Tabindex: () => Zd,
	TextDirection: () => Qd,
	focusEventsPluginKey: () => qd
});
var L = class e extends Nd {
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
}, Hd = L.create({
	name: "clipboardTextSerializer",
	addOptions() {
		return { blockSeparator: void 0 };
	},
	addProseMirrorPlugins() {
		return [new j({
			key: new M("clipboardTextSerializer"),
			props: { clipboardTextSerializer: () => {
				let { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: i } = t, a = lu(n), { blockSeparator: o } = this.options, s = {
					...o === void 0 ? {} : { blockSeparator: o },
					textSerializers: a
				};
				return [...i.ranges].sort((e, t) => e.$from.pos - t.$from.pos).map(({ $from: e, $to: t }) => su(r, {
					from: e.pos,
					to: t.pos
				}, s)).join(o ?? "\n\n");
			} }
		})];
	}
}), Ud = L.create({
	name: "commands",
	addCommands() {
		return { ...xc };
	}
}), Wd = L.create({
	name: "delete",
	onUpdate({ transaction: e, appendedTransactions: t }) {
		let n = () => {
			var n;
			if (((n = this.editor.options.coreExtensionOptions?.delete)?.filterTransaction)?.call(n, e) ?? e.getMeta("y-sync$")) return;
			let r = Rl(e.before, [e, ...t]);
			mu(r).forEach((t) => {
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
				if (t instanceof wt) {
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
}), Gd = L.create({
	name: "drop",
	addProseMirrorPlugins() {
		return [new j({
			key: new M("tiptapDrop"),
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
}), Kd = L.create({
	name: "editable",
	addProseMirrorPlugins() {
		return [new j({
			key: new M("editable"),
			props: { editable: () => this.editor.options.editable }
		})];
	}
}), qd = new M("focusEvents"), Jd = L.create({
	name: "focusEvents",
	addProseMirrorPlugins() {
		let { editor: e } = this;
		return [new j({
			key: qd,
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
}), Yd = L.create({
	name: "keymap",
	addKeyboardShortcuts() {
		let e = () => this.editor.commands.first(({ commands: e }) => [
			() => e.undoInputRule(),
			() => e.command(({ tr: t }) => {
				let { selection: n, doc: r } = t, { empty: i, $anchor: a } = n, { pos: o, parent: s } = a, c = a.parent.isTextblock && o > 0 ? t.doc.resolve(o - 1) : a, l = c.parent.type.spec.isolating, u = a.pos - a.parentOffset, d = l && c.parent.childCount === 1 ? u === a.pos : O.atStart(r).from === o;
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
		return Xc() || _l() ? i : r;
	},
	addProseMirrorPlugins() {
		return [new j({
			key: new M("clearDocument"),
			appendTransaction: (e, t, n) => {
				if (e.some((e) => e.getMeta("composition"))) return;
				let r = e.some((e) => e.docChanged) && !t.doc.eq(n.doc), i = e.some((e) => e.getMeta("preventClearDocument"));
				if (!r || i) return;
				let { empty: a, from: o, to: s } = t.selection, c = O.atStart(t.doc).from, l = O.atEnd(t.doc).to;
				if (a || !(o === c && s === l) || !Du(n.doc)) return;
				let u = n.tr, d = yc({
					state: n,
					transaction: u
				}), { commands: f } = new bc({
					editor: this.editor,
					state: d
				});
				if (f.clearNodes(), u.steps.length) return u;
			}
		})];
	}
}), Xd = L.create({
	name: "paste",
	addProseMirrorPlugins() {
		return [new j({
			key: new M("tiptapPaste"),
			props: { handlePaste: (e, t, n) => {
				this.editor.emit("paste", {
					editor: this.editor,
					event: t,
					slice: n
				});
			} }
		})];
	}
}), Zd = L.create({
	name: "tabindex",
	addOptions() {
		return { value: void 0 };
	},
	addProseMirrorPlugins() {
		return [new j({
			key: new M("tabindex"),
			props: { attributes: () => !this.editor.isEditable && this.options.value === void 0 ? {} : { tabindex: this.options.value ?? "0" } }
		})];
	}
}), Qd = L.create({
	name: "textDirection",
	addOptions() {
		return { direction: void 0 };
	},
	addGlobalAttributes() {
		if (!this.options.direction) return [];
		let { nodeExtensions: e } = Kl(this.extensions);
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
		return [new j({
			key: new M("textDirection"),
			props: { attributes: () => {
				let e = this.options.direction;
				return e ? { dir: e } : {};
			} }
		})];
	}
}), $d = class e {
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
}, ef = ".ProseMirror {\n  position: relative;\n}\n\n.ProseMirror {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  white-space: break-spaces;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n  font-feature-settings: \"liga\" 0; /* the above doesn't seem to work in Edge */\n}\n\n.ProseMirror [contenteditable=\"false\"] {\n  white-space: normal;\n}\n\n.ProseMirror [contenteditable=\"false\"] [contenteditable=\"true\"] {\n  white-space: pre-wrap;\n}\n\n.ProseMirror pre {\n  white-space: pre-wrap;\n}\n\nimg.ProseMirror-separator {\n  display: inline !important;\n  border: none !important;\n  margin: 0 !important;\n  width: 0 !important;\n  height: 0 !important;\n}\n\n.ProseMirror-gapcursor {\n  display: none;\n  pointer-events: none;\n  position: absolute;\n  margin: 0;\n}\n\n.ProseMirror-gapcursor:after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: -2px;\n  width: 20px;\n  border-top: 1px solid black;\n  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n}\n\n@keyframes ProseMirror-cursor-blink {\n  to {\n    visibility: hidden;\n  }\n}\n\n.ProseMirror-hideselection *::selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection *::-moz-selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection * {\n  caret-color: transparent;\n}\n\n.ProseMirror-focused .ProseMirror-gapcursor {\n  display: block;\n}", tf = class extends od {
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
			getUpdatedPosition: Au,
			createMappablePosition: ju
		}, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: e, slice: t, moved: n }) => this.options.onDrop(e, t, n)), this.on("paste", ({ event: e, slice: t }) => this.options.onPaste(e, t)), this.on("delete", this.options.onDelete);
		let t = this.createDoc();
		if (!this.editorState) {
			let e = Jc(t, this.options.autofocus);
			this.editorState = zn.create({
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
		this.options.injectCSS && typeof document < "u" && (this.css = ld(ef, this.options.injectNonce));
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
		let n = Wl(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], r = this.state.reconfigure({ plugins: n });
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
			Kd,
			Hd.configure({ blockSeparator: this.options.coreExtensionOptions?.clipboardTextSerializer?.blockSeparator }),
			Ud,
			Jd,
			Yd,
			Zd.configure({ value: this.options.coreExtensionOptions?.tabindex?.value }),
			Gd,
			Xd,
			Wd,
			Qd.configure({ direction: this.options.textDirection })
		].filter((e) => typeof this.options.enableCoreExtensions != "object" || this.options.enableCoreExtensions[e.name] !== !1) : [], ...this.options.extensions].filter((e) => [
			"extension",
			"node",
			"mark"
		].includes(e?.type));
		this.extensionManager = new Vd(e, this);
	}
	createCommandManager() {
		this.commandManager = new bc({ editor: this });
	}
	createSchema() {
		this.schema = this.extensionManager.schema;
	}
	createDoc() {
		let e;
		try {
			e = Fl(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: this.options.enableContentCheck });
		} catch (e) {
			if (!(e instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(e.message)) throw e;
			let t = Fl(this.options.content, this.schema, this.options.parseOptions, { errorOnInvalidContent: !1 });
			return this.editorState = zn.create({
				doc: t,
				schema: this.schema,
				selection: Jc(t, this.options.autofocus) || void 0
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
		this.editorView = new Ys(e, {
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
		return du(this.state, e);
	}
	isActive(e, t) {
		let n = typeof e == "string" ? e : null, r = typeof e == "string" ? t : e;
		return Su(this.state, n, r);
	}
	getJSON() {
		return this.state.doc.toJSON();
	}
	getHTML() {
		return Ul(this.state.doc.content, this.schema);
	}
	getText(e) {
		let { blockSeparator: t = "\n\n", textSerializers: n = {} } = e || {};
		return cu(this.state.doc, {
			blockSeparator: t,
			textSerializers: {
				...lu(this.schema),
				...n
			}
		});
	}
	get isEmpty() {
		return Du(this.state.doc);
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
		return new $d(t, this, !1, n);
	}
	get $doc() {
		return this.$pos(0);
	}
};
function nf(e) {
	return new kd({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = F(e.getAttributes, void 0, r);
			if (i === !1 || i === null) return null;
			let { tr: a } = t, o = r[r.length - 1], s = r[0];
			if (o) {
				let r = s.search(/\S/), c = n.from + s.indexOf(o), l = c + o.length;
				if (gu(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > c).length) return null;
				l < n.to && a.delete(l, n.to), c > n.from && a.delete(n.from + r, c);
				let u = n.from + r + o.length;
				a.addMark(n.from + r, u, e.type.create(i || {})), a.removeStoredMark(e.type);
			}
		},
		undoable: e.undoable
	});
}
function rf(e) {
	return new kd({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = F(e.getAttributes, void 0, r) || {}, { tr: a } = t, o = n.from, s = n.to, c = e.type.create(i);
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
function af(e) {
	return new kd({
		find: e.find,
		handler: ({ state: t, range: n, match: r }) => {
			let i = t.doc.resolve(n.from), a = F(e.getAttributes, void 0, r) || {};
			if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), e.type)) return null;
			t.tr.delete(n.from, n.to).setBlockType(n.from, n.from, e.type, a);
		},
		undoable: e.undoable
	});
}
function of(e) {
	return new kd({
		find: e.find,
		handler: ({ state: t, range: n, match: r, chain: i }) => {
			let a = F(e.getAttributes, void 0, r) || {}, o = t.tr.delete(n.from, n.to), s = o.doc.resolve(n.from).blockRange(), c = s && It(s, e.type, a);
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
			l && l.type === e.type && Jt(o.doc, n.from - 1) && (!e.joinPredicate || e.joinPredicate(r, l)) && o.join(n.from - 1);
		},
		undoable: e.undoable
	});
}
var sf = (e) => "touches" in e, cf = class {
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
		e.preventDefault(), e.stopPropagation(), this.isResizing = !0, this.activeHandle = t, sf(e) ? (this.startX = e.touches[0].clientX, this.startY = e.touches[0].clientY) : (this.startX = e.clientX, this.startY = e.clientY), this.startWidth = this.element.offsetWidth, this.startHeight = this.element.offsetHeight, this.startWidth > 0 && this.startHeight > 0 && (this.aspectRatio = this.startWidth / this.startHeight), this.getPos(), this.container.dataset.resizeState = "true", this.classNames.resizing && this.container.classList.add(this.classNames.resizing), document.addEventListener("mousemove", this.handleMouseMove), document.addEventListener("touchmove", this.handleTouchMove), document.addEventListener("mouseup", this.handleMouseUp), document.addEventListener("keydown", this.handleKeyDown), document.addEventListener("keyup", this.handleKeyUp);
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
}, R = class e extends Nd {
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
function lf(e) {
	return new Fd({
		find: e.find,
		handler: ({ state: t, range: n, match: r, pasteEvent: i }) => {
			let a = F(e.getAttributes, void 0, r, i);
			if (a === !1 || a === null) return null;
			let { tr: o } = t, s = r[r.length - 1], c = r[0], l = n.to;
			if (s) {
				let i = c.search(/\S/), u = n.from + c.indexOf(s), d = u + s.length;
				if (gu(n.from, n.to, t.doc).filter((t) => t.mark.type.excluded.find((n) => n === e.type && n !== t.mark.type)).filter((e) => e.to > u).length) return null;
				d < n.to && o.delete(d, n.to), u > n.from && o.delete(n.from + i, u), l = n.from + i + s.length, o.addMark(n.from + i, l, e.type.create(a || {})), r.index !== void 0 && r.input !== void 0 && r.index + r[0].length >= r.input.length || o.removeStoredMark(e.type);
			}
		}
	});
}
var uf = (e, t) => {
	if (e === "slot") return 0;
	if (e instanceof Function) return e(t);
	let { children: n, ...r } = t ?? {};
	if (e === "svg") throw Error("SVG elements are not supported in the JSX syntax, use the array syntax instead");
	return [
		e,
		r,
		n
	];
}, df = (e, t) => {
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
	return f.delete(u, a.after()).insert(d, a.parent.content), f.setSelection(k.create(f.doc, d)), r.dispatch(f.scrollIntoView()), !0;
}, ff = /^\s*>\s$/, pf = R.create({
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
		return /* @__PURE__ */ uf("blockquote", {
			...I(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ uf("slot", {})
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
			Backspace: () => df(this.editor, this.type)
		};
	},
	addInputRules() {
		return [of({
			find: ff,
			type: this.type
		})];
	}
}), mf = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/, hf = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g, gf = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/, _f = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g, vf = Pd.create({
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
		return /* @__PURE__ */ uf("strong", {
			...I(this.options.HTMLAttributes, e),
			children: /* @__PURE__ */ uf("slot", {})
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
		return [nf({
			find: mf,
			type: this.type
		}), nf({
			find: gf,
			type: this.type
		})];
	},
	addPasteRules() {
		return [lf({
			find: hf,
			type: this.type
		}), lf({
			find: _f,
			type: this.type
		})];
	}
}), yf = (e) => {
	let t = /`([^`]+)`(?!`)$/.exec(e);
	return !t || t.index > 0 && e[t.index - 1] === "`" ? null : {
		index: t.index,
		text: t[0],
		replaceWith: t[1]
	};
}, bf = (e) => {
	let t = /`([^`]+)`(?!`)/g, n = [], r;
	for (; (r = t.exec(e)) !== null;) r.index > 0 && e[r.index - 1] === "`" || n.push({
		index: r.index,
		text: r[0],
		replaceWith: r[1]
	});
	return n;
}, xf = Pd.create({
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
			I(this.options.HTMLAttributes, e),
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
		return [nf({
			find: yf,
			type: this.type
		})];
	},
	addPasteRules() {
		return [lf({
			find: bf,
			type: this.type
		})];
	}
}), Sf = 4, Cf = /^```([a-z]+)?[\s\n]$/, wf = /^~~~([a-z]+)?[\s\n]$/, Tf = R.create({
	name: "codeBlock",
	addOptions() {
		return {
			languageClassPrefix: "language-",
			exitOnTripleEnter: !0,
			exitOnArrowDown: !0,
			exitOnArrowUp: !0,
			defaultLanguage: null,
			enableTabIndentation: !1,
			tabSize: Sf,
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
			I(this.options.HTMLAttributes, t),
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
				let t = this.options.tabSize ?? Sf, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
				if (i.parent.type !== this.type) return !1;
				let o = " ".repeat(t);
				return a ? e.commands.insertContent(o) : e.commands.command(({ tr: e }) => {
					let { from: t, to: i } = r, a = n.doc.textBetween(t, i, "\n", "\n").split("\n").map((e) => o + e).join("\n");
					return e.replaceWith(t, i, n.schema.text(a)), !0;
				});
			},
			"Shift-Tab": ({ editor: e }) => {
				if (!this.options.enableTabIndentation) return !1;
				let t = this.options.tabSize ?? Sf, { state: n } = e, { selection: r } = n, { $from: i, empty: a } = r;
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
					return e.delete(p, p + f), r - p <= f && e.setSelection(k.create(e.doc, p)), !0;
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
				return o === void 0 ? !1 : r.nodeAt(o) ? e.commands.command(({ tr: e }) => (e.setSelection(O.near(r.resolve(o))), !0)) : e.commands.exitCode();
			}
		};
	},
	addInputRules() {
		return [af({
			find: Cf,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		}), af({
			find: wf,
			type: this.type,
			getAttributes: (e) => ({ language: e[1] })
		})];
	},
	addProseMirrorPlugins() {
		return [new j({
			key: new M("codeBlockVSCodeHandler"),
			props: { handlePaste: (e, t) => {
				if (!t.clipboardData || this.editor.isActive(this.type.name)) return !1;
				let n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), i = (r ? JSON.parse(r) : void 0)?.mode;
				if (!n || !i) return !1;
				let { tr: a, schema: o } = e.state, s = o.text(n.replace(/\r\n?/g, "\n"));
				return a.replaceSelectionWith(this.type.create({ language: i }, s)), a.selection.$from.parent.type !== this.type && a.setSelection(k.near(a.doc.resolve(Math.max(0, a.selection.from - 2)))), a.setMeta("paste", !0), e.dispatch(a), !0;
			} }
		})];
	}
}), Ef = R.create({
	name: "doc",
	topNode: !0,
	content: "block+",
	renderMarkdown: (e, t) => e.content ? t.renderChildren(e.content, "\n\n") : ""
}), Df = R.create({
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
		return ["br", I(this.options.HTMLAttributes, e)];
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
}), Of = R.create({
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
			I(this.options.HTMLAttributes, t),
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
		return this.options.levels.map((e) => af({
			find: RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),
			type: this.type,
			getAttributes: { level: e }
		}));
	}
}), kf = R.create({
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
		return ["hr", I(this.options.HTMLAttributes, e)];
	},
	markdownTokenName: "hr",
	parseMarkdown: (e, t) => t.createNode("horizontalRule"),
	renderMarkdown: () => "---",
	addCommands() {
		return { setHorizontalRule: () => ({ chain: e, state: t }) => {
			if (!cd(t, t.schema.nodes[this.name])) return !1;
			let { selection: n } = t, { $to: r } = n, i = e();
			return Ou(n) ? i.insertContentAt(r.pos, { type: this.name }) : i.insertContent({ type: this.name }), i.command(({ state: e, tr: t, dispatch: n }) => {
				if (n) {
					let { $to: n } = t.selection, r = n.end();
					if (n.nodeAfter) n.nodeAfter.isTextblock ? t.setSelection(k.create(t.doc, n.pos + 1)) : n.nodeAfter.isBlock ? t.setSelection(A.create(t.doc, n.pos)) : t.setSelection(k.create(t.doc, n.pos));
					else {
						let i = (e.schema.nodes[this.options.nextNodeType] || n.parent.type.contentMatch.defaultType)?.create();
						i && (t.insert(r, i), t.setSelection(k.create(t.doc, r + 1)));
					}
					t.scrollIntoView();
				}
				return !0;
			}).run();
		} };
	},
	addInputRules() {
		return [rf({
			find: /^(?:---|—-|___\s|\*\*\*\s)$/,
			type: this.type
		})];
	}
}), Af = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/, jf = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g, Mf = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/, Nf = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g, Pf = Pd.create({
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
			I(this.options.HTMLAttributes, e),
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
		return [nf({
			find: Af,
			type: this.type
		}), nf({
			find: Mf,
			type: this.type
		})];
	},
	addPasteRules() {
		return [lf({
			find: jf,
			type: this.type
		}), lf({
			find: Nf,
			type: this.type
		})];
	}
}), Ff = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", If = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Lf = "numeric", Rf = "ascii", zf = "alpha", Bf = "asciinumeric", Vf = "alphanumeric", Hf = "domain", Uf = "emoji", Wf = "scheme", Gf = "slashscheme", Kf = "whitespace";
function qf(e, t) {
	return e in t || (t[e] = []), t[e];
}
function Jf(e, t, n) {
	t[Lf] && (t[Bf] = !0, t[Vf] = !0), t[Rf] && (t[Bf] = !0, t[zf] = !0), t[Bf] && (t[Vf] = !0), t[zf] && (t[Vf] = !0), t[Vf] && (t[Hf] = !0), t[Uf] && (t[Hf] = !0);
	for (let r in t) {
		let t = qf(r, n);
		t.indexOf(e) < 0 && t.push(e);
	}
}
function Yf(e, t) {
	let n = {};
	for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
	return n;
}
function Xf(e = null) {
	this.j = {}, this.jr = [], this.jd = null, this.t = e;
}
Xf.groups = {}, Xf.prototype = {
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
		r ||= Xf.groups;
		let i;
		return t && t.j ? i = t : (i = new Xf(t), n && r && Jf(t, n, r)), this.jr.push([e, i]), i;
	},
	ts(e, t, n, r) {
		let i = this, a = e.length;
		if (!a) return i;
		for (let t = 0; t < a - 1; t++) i = i.tt(e[t]);
		return i.tt(e[a - 1], t, n, r);
	},
	tt(e, t, n, r) {
		r ||= Xf.groups;
		let i = this;
		if (t && t.j) return i.j[e] = t, t;
		let a = t, o, s = i.go(e);
		return s ? (o = new Xf(), Object.assign(o.j, s.j), o.jr.push.apply(o.jr, s.jr), o.jd = s.jd, o.t = s.t) : o = new Xf(), a && (r && (o.t && typeof o.t == "string" ? Jf(a, Object.assign(Yf(o.t, r), n), r) : n && Jf(a, n, r)), o.t = a), i.j[e] = o, o;
	}
};
var z = (e, t, n, r, i) => e.ta(t, n, r, i), B = (e, t, n, r, i) => e.tr(t, n, r, i), Zf = (e, t, n, r, i) => e.ts(t, n, r, i), V = (e, t, n, r, i) => e.tt(t, n, r, i), Qf = "WORD", $f = "UWORD", ep = "ASCIINUMERICAL", tp = "ALPHANUMERICAL", np = "LOCALHOST", rp = "TLD", ip = "UTLD", ap = "SCHEME", op = "SLASH_SCHEME", sp = "NUM", cp = "WS", lp = "NL", up = "OPENBRACE", dp = "CLOSEBRACE", fp = "OPENBRACKET", pp = "CLOSEBRACKET", mp = "OPENPAREN", hp = "CLOSEPAREN", gp = "OPENANGLEBRACKET", _p = "CLOSEANGLEBRACKET", vp = "FULLWIDTHLEFTPAREN", yp = "FULLWIDTHRIGHTPAREN", bp = "LEFTCORNERBRACKET", xp = "RIGHTCORNERBRACKET", Sp = "LEFTWHITECORNERBRACKET", Cp = "RIGHTWHITECORNERBRACKET", wp = "FULLWIDTHLESSTHAN", Tp = "FULLWIDTHGREATERTHAN", Ep = "AMPERSAND", Dp = "APOSTROPHE", Op = "ASTERISK", kp = "AT", Ap = "BACKSLASH", jp = "BACKTICK", Mp = "CARET", Np = "COLON", Pp = "COMMA", Fp = "DOLLAR", Ip = "DOT", Lp = "EQUALS", Rp = "EXCLAMATION", zp = "HYPHEN", Bp = "PERCENT", Vp = "PIPE", Hp = "PLUS", Up = "POUND", Wp = "QUERY", Gp = "QUOTE", Kp = "FULLWIDTHMIDDLEDOT", qp = "SEMI", Jp = "SLASH", Yp = "TILDE", Xp = "UNDERSCORE", Zp = "EMOJI", Qp = "SYM", $p = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ALPHANUMERICAL: tp,
	AMPERSAND: Ep,
	APOSTROPHE: Dp,
	ASCIINUMERICAL: ep,
	ASTERISK: Op,
	AT: kp,
	BACKSLASH: Ap,
	BACKTICK: jp,
	CARET: Mp,
	CLOSEANGLEBRACKET: _p,
	CLOSEBRACE: dp,
	CLOSEBRACKET: pp,
	CLOSEPAREN: hp,
	COLON: Np,
	COMMA: Pp,
	DOLLAR: Fp,
	DOT: Ip,
	EMOJI: Zp,
	EQUALS: Lp,
	EXCLAMATION: Rp,
	FULLWIDTHGREATERTHAN: Tp,
	FULLWIDTHLEFTPAREN: vp,
	FULLWIDTHLESSTHAN: wp,
	FULLWIDTHMIDDLEDOT: Kp,
	FULLWIDTHRIGHTPAREN: yp,
	HYPHEN: zp,
	LEFTCORNERBRACKET: bp,
	LEFTWHITECORNERBRACKET: Sp,
	LOCALHOST: np,
	NL: lp,
	NUM: sp,
	OPENANGLEBRACKET: gp,
	OPENBRACE: up,
	OPENBRACKET: fp,
	OPENPAREN: mp,
	PERCENT: Bp,
	PIPE: Vp,
	PLUS: Hp,
	POUND: Up,
	QUERY: Wp,
	QUOTE: Gp,
	RIGHTCORNERBRACKET: xp,
	RIGHTWHITECORNERBRACKET: Cp,
	SCHEME: ap,
	SEMI: qp,
	SLASH: Jp,
	SLASH_SCHEME: op,
	SYM: Qp,
	TILDE: Yp,
	TLD: rp,
	UNDERSCORE: Xp,
	UTLD: ip,
	UWORD: $f,
	WORD: Qf,
	WS: cp
}), em = /[a-z]/, tm = /\p{L}/u, nm = /\p{Emoji}/u, rm = /\d/, im = /\s/, am = "\r", om = "\n", sm = "️", cm = "‍", lm = "￼", um = null, dm = null;
function fm(e = []) {
	let t = {};
	Xf.groups = t;
	let n = new Xf();
	um ??= gm(Ff), dm ??= gm(If), V(n, "'", Dp), V(n, "{", up), V(n, "}", dp), V(n, "[", fp), V(n, "]", pp), V(n, "(", mp), V(n, ")", hp), V(n, "<", gp), V(n, ">", _p), V(n, "（", vp), V(n, "）", yp), V(n, "「", bp), V(n, "」", xp), V(n, "『", Sp), V(n, "』", Cp), V(n, "＜", wp), V(n, "＞", Tp), V(n, "&", Ep), V(n, "*", Op), V(n, "@", kp), V(n, "`", jp), V(n, "^", Mp), V(n, ":", Np), V(n, ",", Pp), V(n, "$", Fp), V(n, ".", Ip), V(n, "=", Lp), V(n, "!", Rp), V(n, "-", zp), V(n, "%", Bp), V(n, "|", Vp), V(n, "+", Hp), V(n, "#", Up), V(n, "?", Wp), V(n, "\"", Gp), V(n, "/", Jp), V(n, ";", qp), V(n, "~", Yp), V(n, "_", Xp), V(n, "\\", Ap), V(n, "・", Kp);
	let r = B(n, rm, sp, { [Lf]: !0 });
	B(r, rm, r);
	let i = B(r, em, ep, { [Bf]: !0 }), a = B(r, tm, tp, { [Vf]: !0 }), o = B(n, em, Qf, { [Rf]: !0 });
	B(o, rm, i), B(o, em, o), B(i, rm, i), B(i, em, i);
	let s = B(n, tm, $f, { [zf]: !0 });
	B(s, em), B(s, rm, a), B(s, tm, s), B(a, rm, a), B(a, em), B(a, tm, a);
	let c = V(n, om, lp, { [Kf]: !0 }), l = V(n, am, cp, { [Kf]: !0 }), u = B(n, im, cp, { [Kf]: !0 });
	V(n, lm, u), V(l, om, c), V(l, lm, u), B(l, im, u), V(u, am), V(u, om), B(u, im, u), V(u, lm, u);
	let d = B(n, nm, Zp, { [Uf]: !0 });
	V(d, "#"), B(d, nm, d), V(d, sm, d);
	let f = V(d, cm);
	V(f, "#"), B(f, nm, d);
	let p = [[em, o], [rm, i]], m = [
		[em, null],
		[tm, s],
		[rm, a]
	];
	for (let e = 0; e < um.length; e++) hm(n, um[e], rp, Qf, p);
	for (let e = 0; e < dm.length; e++) hm(n, dm[e], ip, $f, m);
	Jf(rp, {
		tld: !0,
		ascii: !0
	}, t), Jf(ip, {
		utld: !0,
		alpha: !0
	}, t), hm(n, "file", ap, Qf, p), hm(n, "mailto", ap, Qf, p), hm(n, "http", op, Qf, p), hm(n, "https", op, Qf, p), hm(n, "ftp", op, Qf, p), hm(n, "ftps", op, Qf, p), Jf(ap, {
		scheme: !0,
		ascii: !0
	}, t), Jf(op, {
		slashscheme: !0,
		ascii: !0
	}, t), e = e.sort((e, t) => e[0] > t[0] ? 1 : -1);
	for (let t = 0; t < e.length; t++) {
		let r = e[t][0], i = e[t][1] ? { [Wf]: !0 } : { [Gf]: !0 };
		r.indexOf("-") >= 0 ? i[Hf] = !0 : em.test(r) ? rm.test(r) ? i[Bf] = !0 : i[Rf] = !0 : i[Lf] = !0, Zf(n, r, r, i);
	}
	return Zf(n, "localhost", np, { ascii: !0 }), n.jd = new Xf(Qp), {
		start: n,
		tokens: Object.assign({ groups: t }, $p)
	};
}
function pm(e, t) {
	let n = mm(t.replace(/[A-Z]/g, (e) => e.toLowerCase())), r = n.length, i = [], a = 0, o = 0;
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
function mm(e) {
	let t = [], n = e.length, r = 0;
	for (; r < n;) {
		let i = e.charCodeAt(r), a, o = i < 55296 || i > 56319 || r + 1 === n || (a = e.charCodeAt(r + 1)) < 56320 || a > 57343 ? e[r] : e.slice(r, r + 2);
		t.push(o), r += o.length;
	}
	return t;
}
function hm(e, t, n, r, i) {
	let a, o = t.length;
	for (let n = 0; n < o - 1; n++) {
		let o = t[n];
		e.j[o] ? a = e.j[o] : (a = new Xf(r), a.jr = i.slice(), e.j[o] = a), e = a;
	}
	return a = new Xf(n), a.jr = i.slice(), e.j[t[o - 1]] = a, a;
}
function gm(e) {
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
var _m = {
	defaultProtocol: "http",
	events: null,
	format: ym,
	formatHref: ym,
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
function vm(e, t = null) {
	let n = Object.assign({}, _m);
	e && (n = Object.assign(n, e instanceof vm ? e.o : e));
	let r = n.ignoreTags, i = [];
	for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
	this.o = n, t && (this.defaultRender = t), this.ignoreTags = i;
}
vm.prototype = {
	o: _m,
	ignoreTags: [],
	defaultRender(e) {
		return e;
	},
	check(e) {
		return this.get("validate", e.toString(), e);
	},
	get(e, t, n) {
		let r = t != null, i = this.o[e];
		return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : _m[e], typeof i == "function" && r && (i = i(t, n))) : typeof i == "function" && r && (i = i(t, n.t, n)), i);
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
function ym(e) {
	return e;
}
function bm(e, t) {
	this.t = "token", this.v = e, this.tk = t;
}
bm.prototype = {
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
	toObject(e = _m.defaultProtocol) {
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
function xm(e, t) {
	class n extends bm {
		constructor(t, n) {
			super(t, n), this.t = e;
		}
	}
	for (let e in t) n.prototype[e] = t[e];
	return n.t = e, n;
}
var Sm = xm("email", {
	isLink: !0,
	toHref() {
		return "mailto:" + this.toString();
	}
}), Cm = xm("text"), wm = xm("nl"), Tm = xm("url", {
	isLink: !0,
	toHref(e = _m.defaultProtocol) {
		return this.hasProtocol() ? this.v : `${e}://${this.v}`;
	},
	hasProtocol() {
		let e = this.tk;
		return e.length >= 2 && e[0].t !== np && e[1].t === Np;
	}
}), Em = (e) => new Xf(e);
function Dm({ groups: e }) {
	let t = e.domain.concat([
		Ep,
		Op,
		kp,
		Ap,
		jp,
		Mp,
		Fp,
		Lp,
		zp,
		sp,
		Bp,
		Vp,
		Hp,
		Up,
		Jp,
		Qp,
		Yp,
		Xp
	]), n = [
		Dp,
		Np,
		Pp,
		Ip,
		Rp,
		Bp,
		Wp,
		Gp,
		qp,
		gp,
		_p,
		up,
		dp,
		pp,
		fp,
		mp,
		hp,
		vp,
		yp,
		bp,
		xp,
		Sp,
		Cp,
		wp,
		Tp
	], r = [
		Ep,
		Dp,
		Op,
		Ap,
		jp,
		Mp,
		Fp,
		Lp,
		zp,
		up,
		dp,
		Bp,
		Vp,
		Hp,
		Up,
		Wp,
		Jp,
		Qp,
		Yp,
		Xp
	], i = Em(), a = V(i, Yp);
	z(a, r, a), z(a, e.domain, a);
	let o = Em(), s = Em(), c = Em();
	z(i, e.domain, o), z(i, e.scheme, s), z(i, e.slashscheme, c), z(o, r, a), z(o, e.domain, o);
	let l = V(o, kp);
	V(a, kp, l), V(s, kp, l), V(c, kp, l);
	let u = V(a, Ip);
	z(u, r, a), z(u, e.domain, a);
	let d = Em();
	z(l, e.domain, d), z(d, e.domain, d);
	let f = V(d, Ip);
	z(f, e.domain, d);
	let p = Em(Sm);
	z(f, e.tld, p), z(f, e.utld, p), V(l, np, p);
	let m = V(d, zp);
	V(m, zp, m), z(m, e.domain, d), z(p, e.domain, d), V(p, Ip, f), V(p, zp, m);
	let h = V(o, zp), g = V(o, Ip);
	V(h, zp, h), z(h, e.domain, o), z(g, r, a), z(g, e.domain, o);
	let _ = Em(Tm);
	z(g, e.tld, _), z(g, e.utld, _), z(_, e.domain, o), z(_, r, a), V(_, Ip, g), V(_, zp, h), V(_, kp, l);
	let v = V(_, Np), y = Em(Tm);
	z(v, e.numeric, y);
	let b = Em(Tm), x = Em();
	z(b, t, b), z(b, n, x), z(x, t, b), z(x, n, x), V(_, Jp, b), V(y, Jp, b);
	let S = V(s, Np), ee = V(V(V(c, Np), Jp), Jp);
	z(s, e.domain, o), V(s, Ip, g), V(s, zp, h), z(c, e.domain, o), V(c, Ip, g), V(c, zp, h), z(S, e.domain, b), V(S, Jp, b), V(S, Wp, b), z(ee, e.domain, b), z(ee, t, b), V(ee, Jp, b);
	let te = [
		[up, dp],
		[fp, pp],
		[mp, hp],
		[gp, _p],
		[vp, yp],
		[bp, xp],
		[Sp, Cp],
		[wp, Tp]
	];
	for (let e = 0; e < te.length; e++) {
		let [r, i] = te[e], a = V(b, r);
		V(x, r, a);
		let o = Em(Tm);
		z(a, t, o);
		let s = Em();
		z(a, n, s), V(a, i, b), z(o, t, o), z(o, n, s), z(s, t, o), z(s, n, s), V(o, i, b), V(s, i, b);
	}
	return V(i, np, _), V(i, lp, wm), {
		start: i,
		tokens: $p
	};
}
function Om(e, t, n) {
	let r = n.length, i = 0, a = [], o = [];
	for (; i < r;) {
		let s = e, c = null, l = null, u = 0, d = null, f = -1;
		for (; i < r && !(c = s.go(n[i].t));) o.push(n[i++]);
		for (; i < r && (l = c || s.go(n[i].t));) c = null, s = l, s.accepts() ? (f = 0, d = s) : f >= 0 && f++, i++, u++;
		if (f < 0) i -= u, i < r && (o.push(n[i]), i++);
		else {
			o.length > 0 && (a.push(km(Cm, t, o)), o = []), i -= f, u -= f;
			let e = d.t, r = n.slice(i - u, i);
			a.push(km(e, t, r));
		}
	}
	return o.length > 0 && a.push(km(Cm, t, o)), a;
}
function km(e, t, n) {
	let r = n[0].s, i = n[n.length - 1].e;
	return new e(t.slice(r, i), n);
}
var Am = typeof console < "u" && console && console.warn || (() => {}), jm = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", H = {
	scanner: null,
	parser: null,
	tokenQueue: [],
	pluginQueue: [],
	customSchemes: [],
	initialized: !1
};
function Mm() {
	return Xf.groups = {}, H.scanner = null, H.parser = null, H.tokenQueue = [], H.pluginQueue = [], H.customSchemes = [], H.initialized = !1, H;
}
function Nm(e, t = !1) {
	if (H.initialized && Am(`linkifyjs: already initialized - will not register custom scheme "${e}" ${jm}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e)) throw Error("linkifyjs: incorrect scheme format.\n1. Must only contain digits, lowercase ASCII letters or \"-\"\n2. Cannot start or end with \"-\"\n3. \"-\" cannot repeat");
	H.customSchemes.push([e, t]);
}
function Pm() {
	H.scanner = fm(H.customSchemes);
	for (let e = 0; e < H.tokenQueue.length; e++) H.tokenQueue[e][1]({ scanner: H.scanner });
	H.parser = Dm(H.scanner.tokens);
	for (let e = 0; e < H.pluginQueue.length; e++) H.pluginQueue[e][1]({
		scanner: H.scanner,
		parser: H.parser
	});
	return H.initialized = !0, H;
}
function Fm(e) {
	return H.initialized || Pm(), Om(H.parser.start, e, pm(H.scanner.start, e));
}
Fm.scan = pm;
function Im(e, t = null, n = null) {
	if (t && typeof t == "object") {
		if (n) throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
		n = t, t = null;
	}
	let r = new vm(n), i = Fm(e), a = [];
	for (let e = 0; e < i.length; e++) {
		let n = i[e];
		n.isLink && (!t || n.t === t) && r.check(n) && a.push(n.toFormattedObject(r));
	}
	return a;
}
//#endregion
//#region node_modules/@tiptap/extension-link/dist/index.js
var Lm = "[\0- \xA0 ᠎ -\u2029 　]", Rm = new RegExp(Lm), zm = RegExp(`${Lm}$`), Bm = new RegExp(Lm, "g");
function Vm(e) {
	return e.length === 1 ? e[0].isLink : e.length === 3 && e[1].isLink ? ["()", "[]"].includes(e[0].value + e[2].value) : !1;
}
function Hm(e) {
	return new j({
		key: new M("autolink"),
		appendTransaction: (t, n, r) => {
			let i = t.some((e) => e.docChanged) && !n.doc.eq(r.doc), a = t.some((e) => e.getMeta("preventAutolink"));
			if (!i || a) return;
			let { tr: o } = r;
			if (mu(Rl(n.doc, [...t])).forEach(({ newRange: t }) => {
				let n = zl(r.doc, t, (e) => e.isTextblock), i, a;
				if (n.length > 1) i = n[0], a = r.doc.textBetween(i.pos, i.pos + i.node.nodeSize, void 0, " ");
				else if (n.length) {
					let e = r.doc.textBetween(t.from, t.to, " ", " ");
					if (!zm.test(e)) return;
					i = n[0], a = r.doc.textBetween(i.pos, t.to, void 0, " ");
				}
				if (i && a) {
					let t = a.split(Rm).filter(Boolean);
					if (t.length <= 0) return !1;
					let n = t[t.length - 1], s = i.pos + a.lastIndexOf(n);
					if (!n) return !1;
					let c = Fm(n).map((t) => t.toObject(e.defaultProtocol));
					if (!Vm(c)) return !1;
					c.filter((e) => e.isLink).map((e) => ({
						...e,
						from: s + e.start + 1,
						to: s + e.end + 1
					})).filter((e) => !r.schema.marks.code || !r.doc.rangeHasMark(e.from, e.to, r.schema.marks.code)).filter((t) => e.validate(t.value)).filter((t) => e.shouldAutoLink(t.value)).forEach((t) => {
						gu(t.from, t.to, r.doc).some((t) => t.mark.type === e.type) || o.addMark(t.from, t.to, e.type.create({ href: t.href }));
					});
				}
			}), o.steps.length) return o;
		}
	});
}
function Um(e) {
	return new j({
		key: new M("handleClickLink"),
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
				let n = du(t.state, e.type.name), r = i.href ?? n.href, o = i.target ?? n.target;
				r && (window.open(r, o), a = !0);
			}
			return a;
		} }
	});
}
var Wm = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/, Gm = /\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;
function Km(e, t) {
	let n = 0;
	for (let r = t - 1; r >= 0 && e[r] === "\\"; --r) n += 1;
	return n % 2 == 1;
}
function qm(e, t) {
	let n = 0, r = 0;
	for (; r < t;) {
		if (e[r] !== "`") {
			r += 1;
			continue;
		}
		if (n === 0 && Km(e, r)) {
			r += 1;
			continue;
		}
		let i = 0;
		for (; r < t && e[r] === "`";) i += 1, r += 1;
		n === 0 ? n = i : i === n && (n = 0);
	}
	return n > 0;
}
function Jm(e, t, n) {
	let [, r, i] = t;
	return (t.index ? e[t.index - 1] : void 0) === "!" || Km(e, t.index ?? 0) || qm(e, t.index ?? 0) ? !1 : !!r.trim() && n(i);
}
function Ym(e) {
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
function Xm(e, t) {
	return e.index < t.index + t.text.length && t.index < e.index + e.text.length;
}
function Zm(e) {
	return {
		href: e.data?.href,
		title: e.data?.title ?? null
	};
}
function Qm(e) {
	let t = nf({
		find: (t) => {
			let n = Wm.exec(t);
			return !n || !Jm(t, n, e.isAllowedHref) ? null : Ym(n);
		},
		type: e.type,
		getAttributes: Zm
	});
	return new kd({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function $m(e) {
	let t = lf({
		find: (t) => {
			let n = [];
			for (let r of t.matchAll(Gm)) Jm(t, r, e.isAllowedHref) && n.push(Ym(r));
			let r = (e.findPlainUrls?.call(e, t) ?? []).filter((e) => !n.some((t) => Xm(t, e)));
			return [...n, ...r];
		},
		type: e.type,
		getAttributes: Zm
	});
	return new Fd({
		find: t.find,
		handler: (e) => {
			let n = t.handler(e);
			return n !== null && e.state.tr.steps.length && e.match.data?.markdown && e.state.tr.setMeta("preventAutolink", !0), n;
		}
	});
}
function eh(e) {
	return new j({
		key: new M("handlePasteLink"),
		props: { handlePaste: (t, n, r) => {
			let { shouldAutoLink: i } = e, { state: a } = t, { selection: o } = a, { empty: s } = o;
			if (s) return !1;
			let c = "";
			r.content.forEach((e) => {
				c += e.textContent;
			});
			let l = Im(c, { defaultProtocol: e.defaultProtocol }).find((e) => e.isLink && e.value === c);
			return !c || !l || i !== void 0 && !i(l.value) ? !1 : e.editor.commands.setMark(e.type, { href: l.href });
		} }
	});
}
function th(e, t) {
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
	}), !e || e.replace(Bm, "").match(RegExp(`^(?:(?:${n.map((e) => e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`, "i"));
}
var nh = Pd.create({
	name: "link",
	priority: 1e3,
	keepOnSplit: !1,
	exitable: !0,
	onCreate() {
		this.options.validate && !this.options.shouldAutoLink && (this.options.shouldAutoLink = this.options.validate, console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")), this.options.protocols.forEach((e) => {
			if (typeof e == "string") {
				Nm(e);
				return;
			}
			Nm(e.scheme, e.optionalSlashes);
		});
	},
	onDestroy() {
		Mm();
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
			isAllowedUri: (e, t) => !!th(e, t.protocols),
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
					defaultValidate: (e) => !!th(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : null;
			}
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return this.options.isAllowedUri(e.href, {
			defaultValidate: (e) => !!th(e, this.options.protocols),
			protocols: this.options.protocols,
			defaultProtocol: this.options.defaultProtocol
		}) ? [
			"a",
			I(this.options.HTMLAttributes, e),
			0
		] : [
			"a",
			I(this.options.HTMLAttributes, {
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
					defaultValidate: (e) => !!th(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? t().setMark(this.name, e).setMeta("preventAutolink", !0).run() : !1;
			},
			toggleLink: (e) => ({ chain: t }) => {
				let { href: n } = e || {};
				return n && !this.options.isAllowedUri(n, {
					defaultValidate: (e) => !!th(e, this.options.protocols),
					protocols: this.options.protocols,
					defaultProtocol: this.options.defaultProtocol
				}) ? !1 : t().toggleMark(this.name, e, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run();
			},
			unsetLink: () => ({ chain: e }) => e().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
		};
	},
	addInputRules() {
		return this.options.markdownLinks ? [Qm({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!th(e, this.options.protocols),
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
				Im(e).filter((e) => e.isLink && this.options.isAllowedUri(e.value, {
					defaultValidate: (e) => !!th(e, n),
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
		return this.options.markdownLinks ? [$m({
			type: this.type,
			isAllowedHref: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!th(e, this.options.protocols),
				protocols: this.options.protocols,
				defaultProtocol: this.options.defaultProtocol
			}),
			findPlainUrls: e
		})] : [lf({
			find: e,
			type: this.type,
			getAttributes: (e) => ({ href: e.data?.href })
		})];
	},
	addProseMirrorPlugins() {
		let e = [], { protocols: t, defaultProtocol: n } = this.options;
		return this.options.autolink && e.push(Hm({
			type: this.type,
			defaultProtocol: this.options.defaultProtocol,
			validate: (e) => this.options.isAllowedUri(e, {
				defaultValidate: (e) => !!th(e, t),
				protocols: t,
				defaultProtocol: n
			}),
			shouldAutoLink: this.options.shouldAutoLink
		})), e.push(Um({
			type: this.type,
			editor: this.editor,
			openOnClick: this.options.openOnClick === "whenNotEditable" || this.options.openOnClick,
			enableClickSelection: this.options.enableClickSelection
		})), this.options.linkOnPaste && e.push(eh({
			editor: this.editor,
			defaultProtocol: this.options.defaultProtocol,
			type: this.type,
			shouldAutoLink: this.options.shouldAutoLink
		})), e;
	}
}), rh = nh, ih = Object.defineProperty, ah = (e, t) => {
	for (var n in t) ih(e, n, {
		get: t[n],
		enumerable: !0
	});
}, oh = "listItem", sh = "textStyle", ch = /^\s*([-+*])\s$/, lh = R.create({
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
			I(this.options.HTMLAttributes, e),
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
		return { toggleBulletList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(oh, this.editor.getAttributes(sh)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-8": () => this.editor.commands.toggleBulletList() };
	},
	addInputRules() {
		let e = of({
			find: ch,
			type: this.type
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (e = of({
			find: ch,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: () => this.editor.getAttributes(sh),
			editor: this.editor
		})), [e];
	}
}), uh = (e, t, n) => {
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
}, dh = (e, t, n, r) => {
	let i = uh(e, n, r);
	if (!i) return !1;
	let { selection: a } = e, { nestedList: o, nestedListPos: s, insertPos: c, items: l } = i, u = e.tr;
	u.delete(s, s + o.nodeSize);
	let d = u.mapping.map(c);
	return u.insert(d, m.from(l)), u.setSelection(a.map(u.doc, u.mapping)), t && t(u), !0;
}, fh = (e, t, n) => dh(e.state, e.view.dispatch, t, n), ph = (e, t) => L.create({
	name: `${e}BranchingDeleteKeymap`,
	priority: 101,
	addKeyboardShortcuts() {
		let n = () => fh(this.editor, e, t);
		return {
			Delete: n,
			"Mod-Delete": n
		};
	}
}), mh = [
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
], hh = "abcdefghijklmnopqrstuvwxyz", gh = String.raw`\d+|[ivxlcdmIVXLCDM]+|${"[a-zA-Z]{1,2}"}`;
function _h(e) {
	let t = e, n = "";
	for (let [e, r] of mh) for (; t >= e;) n += r, t -= e;
	return n;
}
function vh(e) {
	return _h(e).toUpperCase();
}
function yh(e) {
	let t = e.toLowerCase(), n = 0, r = 0;
	for (; n < t.length;) {
		let e = !1;
		for (let [i, a] of mh) if (t.startsWith(a, n)) {
			r += i, n += a.length, e = !0;
			break;
		}
		if (!e) return 0;
	}
	return r;
}
function bh(e) {
	if (!/^[ivxlcdmIVXLCDM]+$/.test(e)) return !1;
	let t = yh(e);
	return t <= 0 ? !1 : (e === e.toLowerCase() ? _h(t) : vh(t)) === e;
}
function xh(e) {
	let t = e.toLowerCase();
	if (t.length === 1) return t.charCodeAt(0) - 97 + 1;
	if (t.length === 2) {
		let e = t.charCodeAt(0) - 97, n = t.charCodeAt(1) - 97;
		return (e + 1) * 26 + n + 1;
	}
	return 0;
}
function Sh(e) {
	if (e <= 26) return hh[e - 1];
	let t = Math.floor((e - 1) / 26) - 1, n = (e - 1) % 26;
	return t < 0 ? hh[n] : hh[t] + hh[n];
}
function Ch(e) {
	if (!(!e || /^\d+$/.test(e))) {
		if (bh(e)) return e === e.toLowerCase() ? "i" : "I";
		if (/^[a-z]{1,2}$/.test(e)) return "a";
		if (/^[A-Z]{1,2}$/.test(e)) return "A";
	}
}
function wh(e) {
	if (/^\d+$/.test(e)) return parseInt(e, 10);
	let t = Ch(e);
	if (t === "i" || t === "I") return yh(e);
	if (t === "a" || t === "A") {
		let t = xh(e);
		return t > 0 ? t : 1;
	}
	let n = parseInt(e, 10);
	return Number.isNaN(n) ? 1 : n;
}
function Th(e, t) {
	if (e === "numeric") return String(t);
	switch (e) {
		case "a": return Sh(t);
		case "A": return Sh(t).toUpperCase();
		case "i": return _h(t);
		case "I": return vh(t);
		default: return String(t);
	}
}
function Eh(e) {
	if (e.length === 0) return !1;
	let t = Ch(e[0]) ?? "numeric", n = wh(e[0]);
	if (n < 1) return !1;
	for (let r = 0; r < e.length; r++) {
		let i = Th(t, n + r);
		if (e[r] !== i) return !1;
	}
	return !0;
}
function Dh(e) {
	return {
		type: Ch(e),
		start: wh(e)
	};
}
function Oh(e) {
	let { type: t, start: n } = Dh(e), r = {};
	return t && (r.type = t), n !== 1 && (r.start = n), r;
}
function kh(e, t, n = ". ") {
	let r = t + 1;
	if (!e || e === "1") return `${r}${n}`;
	switch (e) {
		case "a": return `${Sh(r)}${n}`;
		case "A": return `${Sh(r).toUpperCase()}${n}`;
		case "i": return `${_h(r)}${n}`;
		case "I": return `${vh(r)}${n}`;
		default: return `${r}${n}`;
	}
}
function Ah(e) {
	let t = e.tokens?.[0];
	return !!(e.text && e.tokens?.length === 1 && t?.type === "list" && t.ordered && t.raw === e.text);
}
function jh(e, t) {
	return t.tokenizeInline ? t.parseInline(t.tokenizeInline(e)) : t.parseInline([{
		type: "text",
		raw: e,
		text: e
	}]);
}
var Mh = R.create({
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
			I(this.options.HTMLAttributes, e),
			0
		];
	},
	markdownTokenName: "list_item",
	parseMarkdown: (e, t) => {
		if (e.type !== "list_item") return [];
		let n = t.parseBlockChildren ?? t.parseChildren, r = [];
		if (e.tokens && e.tokens.length > 0) {
			if (Ah(e)) return {
				type: "listItem",
				content: [{
					type: "paragraph",
					content: jh(e.text || "", t)
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
	renderMarkdown: (e, t, n) => wd(e, t, (e) => {
		if (e.parentType === "bulletList") return "- ";
		if (e.parentType === "orderedList") {
			let t = e.meta?.parentAttrs?.start || 1, n = e.meta?.parentAttrs?.type;
			return kh(n, t - 1 + (e.index || 0), ". ");
		}
		return "- ";
	}, n),
	addExtensions() {
		return [ph(this.name, [this.options.bulletListTypeName, this.options.orderedListTypeName])];
	},
	addKeyboardShortcuts() {
		return {
			Enter: () => this.editor.commands.splitListItem(this.name),
			Tab: () => this.editor.commands.sinkListItem(this.name),
			"Shift-Tab": () => this.editor.commands.liftListItem(this.name)
		};
	}
});
ah({}, {
	findListItemPos: () => Nh,
	getNextListDepth: () => Ph,
	handleBackspace: () => Ih,
	handleDelete: () => zh,
	hasListBefore: () => Fh,
	hasListItemAfter: () => Bh,
	hasListItemBefore: () => Vh,
	listItemHasSubList: () => Hh,
	nextListIsDeeper: () => Lh,
	nextListIsHigher: () => Rh
});
var Nh = (e, t) => {
	let { $from: n } = t.selection, r = kc(e, t.schema), i = null, a = n.depth, o = n.pos, s = null;
	for (; a > 0 && s === null;) i = n.node(a), i.type === r ? s = a : (--a, --o);
	return s === null ? null : {
		$pos: t.doc.resolve(o),
		depth: s
	};
}, Ph = (e, t) => {
	let n = Nh(e, t);
	if (!n) return !1;
	let [, r] = _u(t, e, n.$pos.pos + 4);
	return r;
}, Fh = (e, t, n) => {
	let { $anchor: r } = e.selection, i = Math.max(0, r.pos - 2), a = e.doc.resolve(i).node();
	return !(!a || !n.includes(a.type.name));
}, Ih = (e, t, n) => {
	if (e.commands.undoInputRule()) return !0;
	if (e.state.selection.from !== e.state.selection.to) return !1;
	if (!bl(e.state, t) && Fh(e.state, t, n)) {
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
	return !bl(e.state, t) || !wu(e.state) ? !1 : e.chain().liftListItem(t).run();
}, Lh = (e, t) => {
	let n = Ph(e, t), r = Nh(e, t);
	return !r || !n ? !1 : n > r.depth;
}, Rh = (e, t) => {
	let n = Ph(e, t), r = Nh(e, t);
	return !r || !n ? !1 : n < r.depth;
}, zh = (e, t) => {
	if (!bl(e.state, t) || !Cu(e.state, t)) return !1;
	let { selection: n } = e.state, { $from: r, $to: i } = n;
	return !n.empty && r.sameParent(i) ? !1 : Lh(t, e.state) ? e.chain().focus(e.state.selection.from + 4).lift(t).joinBackward().run() : Rh(t, e.state) ? e.chain().joinForward().joinBackward().run() : e.commands.joinItemForward();
}, Bh = (e, t) => {
	let { $anchor: n } = t.selection, r = t.doc.resolve(n.pos - n.parentOffset - 2);
	return !(r.index() === r.parent.childCount - 1 || r.nodeAfter?.type.name !== e);
}, Vh = (e, t) => {
	let { $anchor: n } = t.selection, r = t.doc.resolve(n.pos - 2);
	return !(r.index() === 0 || r.nodeBefore?.type.name !== e);
}, Hh = (e, t, n) => {
	if (!n) return !1;
	let r = kc(e, t.schema), i = !1;
	return n.descendants((e) => {
		e.type === r && (i = !0);
	}), i;
}, Uh = L.create({
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
					e.state.schema.nodes[n] !== void 0 && zh(e, n) && (t = !0);
				}), t;
			},
			"Mod-Delete": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n }) => {
					e.state.schema.nodes[n] !== void 0 && zh(e, n) && (t = !0);
				}), t;
			},
			Backspace: ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && Ih(e, n, r) && (t = !0);
				}), t;
			},
			"Mod-Backspace": ({ editor: e }) => {
				let t = !1;
				return this.options.listTypes.forEach(({ itemName: n, wrapperNames: r }) => {
					e.state.schema.nodes[n] !== void 0 && Ih(e, n, r) && (t = !0);
				}), t;
			}
		};
	}
}), Wh = RegExp(`^(\\s*)(${gh})([.)])\\s+(.*)$`), Gh = /^\s/, Kh = {
	heading: /^#{1,6}(?:\s|$)/,
	bulletItem: /^[-+*]\s+/,
	codeFence: /^(?:```|~~~)/,
	thematicBreak: /^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/
};
function qh(e) {
	return Wh.test(e.trimStart());
}
function Jh(e) {
	let t = e.trimStart();
	return Kh.bulletItem.test(t) || qh(t) || Kh.heading.test(t) || Kh.thematicBreak.test(t) && !t.startsWith("-") || /^>\s?/.test(t) || Kh.codeFence.test(t);
}
function Yh(e) {
	return Object.values(Kh).some((t) => t.test(e));
}
function Xh(e) {
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
		if (t.length > 0 && Jh(e)) {
			r = !0, n.push(e);
			return;
		}
		t.push(e);
	}), {
		paragraphLines: t,
		blockLines: n
	};
}
function Zh(e) {
	let t = [], n = 0, r = 0;
	for (; n < e.length;) {
		let i = e[n], a = i.match(Wh);
		if (!a) break;
		let [, o, s, c, l] = a, u = o.length, d = parseInt(s, 10), f = isNaN(d) ? Ch(s) : void 0, p = isNaN(d) ? wh(s) : d, m = [l], h = n + 1, g = [i], _ = !1;
		for (; h < e.length;) {
			let t = e[h];
			if (t.match(Wh)) break;
			if (t.trim() === "") g.push(t), m.push(""), _ = !0, h += 1;
			else if (t.match(Gh)) {
				let e = t.length - t.trimStart().length, n = u + s.length + 1;
				g.push(t), m.push(t.slice(Math.min(e, n))), h += 1;
			} else {
				if (_ || Yh(t)) break;
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
var Qh = RegExp(`^(${gh})([.)])\\s+(.+)$`);
function $h(e) {
	let t = e.split("\n").filter((e) => e.trim().length > 0);
	if (t.length === 0) return null;
	let n = [];
	for (let e of t) {
		let t = e.trim().match(Qh);
		if (!t) return null;
		n.push({
			marker: t[1],
			content: t[3]
		});
	}
	return Eh(n.map((e) => e.marker)) ? {
		type: "orderedList",
		attrs: Oh(n[0].marker),
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
function eg(e, t, n) {
	let r = [], i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a.indent === t) {
			let { paragraphLines: o, blockLines: s } = Xh(a.contentLines), c = o.join("\n").trim(), l = [];
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
				let e = eg(f, Math.min(...f.map((e) => e.indent)), n);
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
function tg(e, t) {
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
var ng = "listItem", rg = "textStyle", ig = /^(\d+)\.\s$/;
function ag(e) {
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
var og = R.create({
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
						let e = ag(n);
						if (e) return e;
					}
					let r = e.querySelector("li");
					if (r) {
						let e = r.getAttribute("style");
						if (e) {
							let t = ag(e);
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
		let { start: t, type: n, ...r } = e, i = I(this.options.HTMLAttributes, r);
		return t !== 1 && (i.start = t), n && n !== "1" && (i.type = n), [
			"ol",
			i,
			0
		];
	},
	markdownTokenName: "list",
	parseMarkdown: (e, t) => {
		if (e.type !== "list" || !e.ordered) return [];
		let n = e.start || 1, r = e.typeMarker, i = e.items ? tg(e.items, t) : [], a = {};
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
			let r = e.split("\n"), [i, a] = Zh(r);
			if (i.length === 0) return;
			let o = eg(i, i[0].indent, n);
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
		return { toggleOrderedList: () => ({ commands: e, chain: t }) => this.options.keepAttributes ? t().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(ng, this.editor.getAttributes(rg)).run() : e.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Shift-7": () => this.editor.commands.toggleOrderedList() };
	},
	addProseMirrorPlugins() {
		return [new j({ props: { handlePaste: (e, t) => {
			if ((t.clipboardData?.getData("text/html"))?.trim()) return !1;
			let n = t.clipboardData?.getData("text/plain");
			if (!n) return !1;
			let r = $h(n);
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
		let e = (e, t) => (!t.attrs.type || t.attrs.type === "1") && t.childCount + t.attrs.start === +e[1], t = of({
			find: ig,
			type: this.type,
			getAttributes: (e) => ({ start: +e[1] }),
			joinPredicate: e
		});
		return (this.options.keepMarks || this.options.keepAttributes) && (t = of({
			find: ig,
			type: this.type,
			keepMarks: this.options.keepMarks,
			keepAttributes: this.options.keepAttributes,
			getAttributes: (e) => ({
				start: +e[1],
				...this.editor.getAttributes(rg)
			}),
			joinPredicate: e,
			editor: this.editor
		})), [t];
	}
}), sg = /^\s*(\[([( |x])?\])\s$/, cg = R.create({
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
			I(this.options.HTMLAttributes, t, { "data-type": this.name }),
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
	renderMarkdown: (e, t) => wd(e, t, `- [${e.attrs?.checked ? "x" : " "}] `),
	addExtensions() {
		return this.options.nested ? [ph(this.name, [this.options.taskListTypeName])] : [];
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
					let t = r.extensionManager.attributes, n = Xl(e, t), a = new Set(Object.keys(n)), o = this.options.HTMLAttributes;
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
		return [of({
			find: sg,
			type: this.type,
			getAttributes: (e) => ({ checked: e[e.length - 1] === "x" })
		})];
	}
}), lg = R.create({
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
			I(this.options.HTMLAttributes, e, { "data-type": this.name }),
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
				let t = Cd(e, {
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
			}, i = Cd(e, {
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
L.create({
	name: "listKit",
	addExtensions() {
		let e = [];
		return this.options.bulletList !== !1 && e.push(lh.configure(this.options.bulletList)), this.options.listItem !== !1 && e.push(Mh.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(Uh.configure(this.options.listKeymap)), this.options.orderedList !== !1 && e.push(og.configure(this.options.orderedList)), this.options.taskItem !== !1 && e.push(cg.configure(this.options.taskItem)), this.options.taskList !== !1 && e.push(lg.configure(this.options.taskList)), e;
	}
});
//#endregion
//#region node_modules/@tiptap/extension-paragraph/dist/index.js
var ug = "&nbsp;", dg = "\xA0", fg = R.create({
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
			I(this.options.HTMLAttributes, e),
			0
		];
	},
	parseMarkdown: (e, t) => {
		let n = e.tokens || [];
		if (n.length === 1 && n[0].type === "image") return t.parseChildren([n[0]]);
		let r = t.parseInline(n);
		return n.length === 1 && n[0].type === "text" && (n[0].raw === ug || n[0].text === ug || n[0].raw === dg || n[0].text === dg) && r.length === 1 && r[0].type === "text" && (r[0].text === ug || r[0].text === dg) ? t.createNode("paragraph", void 0, []) : t.createNode("paragraph", void 0, r);
	},
	renderMarkdown: (e, t, n) => {
		if (!e) return "";
		let r = Array.isArray(e.content) ? e.content : [];
		if (r.length === 0) {
			let e = Array.isArray(n?.previousNode?.content) ? n.previousNode.content : [];
			return n?.previousNode?.type === "paragraph" && e.length === 0 ? ug : "";
		}
		return t.renderChildren(r);
	},
	addCommands() {
		return { setParagraph: () => ({ commands: e }) => e.setNode(this.name) };
	},
	addKeyboardShortcuts() {
		return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
	}
}), pg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/, mg = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g, hg = Pd.create({
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
			I(this.options.HTMLAttributes, e),
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
		return [nf({
			find: pg,
			type: this.type
		})];
	},
	addPasteRules() {
		return [lf({
			find: mg,
			type: this.type
		})];
	}
}), gg = R.create({
	name: "text",
	group: "inline",
	parseMarkdown: (e) => ({
		type: "text",
		text: e.text || ""
	}),
	renderMarkdown: (e) => e.text || ""
}), _g = Pd.create({
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
			I(this.options.HTMLAttributes, e),
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
}), vg = _g;
//#endregion
//#region node_modules/prosemirror-dropcursor/dist/index.js
function yg(e = {}) {
	return new j({ view(t) {
		return new bg(t, e);
	} });
}
var bg = class {
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
			let e = en(this.editorView.state.doc, a, this.editorView.dragging.slice);
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
}, xg = class e extends O {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : O.near(r);
	}
	content() {
		return b.empty;
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
		return new Sg(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !wg(e) || !Tg(e)) return !1;
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
					if (a.isAtom && !a.isText && !A.isSelectable(a)) {
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
xg.prototype.visible = !1, xg.findFrom = xg.findGapCursorFrom, O.jsonID("gapcursor", xg);
var Sg = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return xg.valid(t) ? new xg(t) : O.near(t);
	}
};
function Cg(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function wg(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
			continue;
		}
		for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || Cg(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Tg(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
			continue;
		}
		for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || Cg(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Eg() {
	return new j({ props: {
		decorations: jg,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && xg.valid(n) ? new xg(n) : null;
		},
		handleClick: kg,
		handleKeyDown: Dg,
		handleDOMEvents: { beforeinput: Ag }
	} });
}
var Dg = gc({
	ArrowLeft: Og("horiz", -1),
	ArrowRight: Og("horiz", 1),
	ArrowUp: Og("vert", -1),
	ArrowDown: Og("vert", 1)
});
function Og(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof k) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = xg.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new xg(c))), !0) : !1;
	};
}
function kg(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!xg.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && A.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new xg(r))), !0);
}
function Ag(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof xg)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = m.empty;
	for (let e = r.length - 1; e >= 0; e--) i = m.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new b(i, 0, 0));
	return a.setSelection(k.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function jg(e) {
	if (!(e.selection instanceof xg)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", N.create(e.doc, [ms.widget(e.selection.head, t, { key: "gapcursor" })]);
}
//#endregion
//#region node_modules/rope-sequence/dist/index.js
var Mg = 200, Ng = function() {};
Ng.prototype.append = function(e) {
	return e.length ? (e = Ng.from(e), !this.length && e || e.length < Mg && this.leafAppend(e) || this.length < Mg && e.leafPrepend(this) || this.appendInner(e)) : this;
}, Ng.prototype.prepend = function(e) {
	return e.length ? Ng.from(e).append(this) : this;
}, Ng.prototype.appendInner = function(e) {
	return new Fg(this, e);
}, Ng.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? Ng.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, Ng.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, Ng.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, Ng.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, Ng.from = function(e) {
	return e instanceof Ng ? e : e && e.length ? new Pg(e) : Ng.empty;
};
var Pg = /* @__PURE__ */ function(e) {
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
		if (this.length + e.length <= Mg) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= Mg) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(Ng);
Ng.empty = new Pg([]);
var Fg = /* @__PURE__ */ function(e) {
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
}(Ng), Ig = 500, Lg = class e {
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
				u.push(new zg(t.map));
				let e = t.step.map(i.slice(a)), n;
				e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new zg(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
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
			let r = t.steps[e].invert(t.docs[e]), l = new zg(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > Vg && (s = Rg(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new vt();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new zg(e))), this.eventCount);
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
				l && s++, r.push(new zg(i, o, l));
			} else r.push(new zg(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new zg(a.maps[e]));
		let u = this.items.slice(0, i).append(l).append(r), d = new e(u, s);
		return d.emptyItemCount() > Ig && (d = d.compress(this.items.length - r.length)), d;
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
					let c = new zg(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(Ng.from(i.reverse()), a);
	}
};
Lg.empty = new Lg(Ng.empty, 0);
function Rg(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var zg = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, Bg = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, Vg = 20;
function Hg(e, t, n, r) {
	let i = n.getMeta(Xg), a;
	if (i) return i.historyState;
	n.getMeta(Zg) && (e = new Bg(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(Xg)) return o.getMeta(Xg).redo ? new Bg(e.done.addTransform(n, void 0, r, Yg(t)), e.undone, Wg(n.mapping.maps), e.prevTime, e.prevComposition) : new Bg(e.done, e.undone.addTransform(n, void 0, r, Yg(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !Ug(n, e.prevRanges)), s = o ? Gg(e.prevRanges, n.mapping) : Wg(n.mapping.maps);
		return new Bg(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, Yg(t)), Lg.empty, s, n.time, i ?? e.prevComposition);
	} else if (a = n.getMeta("rebased")) return new Bg(e.done.rebased(n, a), e.undone.rebased(n, a), Gg(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
	else return new Bg(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), Gg(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function Ug(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function Wg(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function Gg(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function Kg(e, t, n) {
	let r = Yg(t), i = Xg.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new Bg(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(Xg, {
		redo: n,
		historyState: c
	});
}
var qg = !1, Jg = null;
function Yg(e) {
	let t = e.plugins;
	if (Jg != t) {
		qg = !1, Jg = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			qg = !0;
			break;
		}
	}
	return qg;
}
var Xg = new M("history"), Zg = new M("closeHistory");
function Qg(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new j({
		key: Xg,
		state: {
			init() {
				return new Bg(Lg.empty, Lg.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return Hg(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? e_ : n == "historyRedo" ? t_ : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function $g(e, t) {
	return (n, r) => {
		let i = Xg.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = Kg(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var e_ = $g(!1, !0), t_ = $g(!0, !0);
L.create({
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
		return [new j({
			key: new M("characterCount"),
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
var n_ = L.create({
	name: "dropCursor",
	addOptions() {
		return {
			color: "currentColor",
			width: 1,
			class: void 0
		};
	},
	addProseMirrorPlugins() {
		return [yg(this.options)];
	}
});
L.create({
	name: "focus",
	addOptions() {
		return {
			className: "has-focus",
			mode: "all"
		};
	},
	addProseMirrorPlugins() {
		return [new j({
			key: new M("focus"),
			props: { decorations: ({ doc: e, selection: t }) => {
				let { isEditable: n, isFocused: r } = this.editor, { anchor: i } = t, a = [];
				if (!n || !r) return N.create(e, []);
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
					a.push(ms.node(t, t + e.nodeSize, { class: this.options.className }));
				}), N.create(e, a);
			} }
		})];
	}
});
var r_ = L.create({
	name: "gapCursor",
	addProseMirrorPlugins() {
		return [Eg()];
	},
	extendNodeSchema(e) {
		return { allowGapCursor: F(P(e, "allowGapCursor", {
			name: e.name,
			options: e.options,
			storage: e.storage
		})) ?? null };
	}
}), i_ = "placeholder", a_ = new M("tiptap__placeholder");
function o_(e) {
	let { editor: t, placeholder: n, dataAttribute: r, pos: i, node: a, isEmptyDoc: o, hasAnchor: s, classes: { emptyNode: c, emptyEditor: l } } = e, u = [c];
	return o && u.push(l), ms.node(i, i + a.nodeSize, {
		class: u.join(" "),
		[r]: typeof n == "function" ? n({
			editor: t,
			node: a,
			pos: i,
			hasAnchor: s
		}) : n
	});
}
function s_(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function c_({ editor: e, options: t, dataAttribute: n, doc: r, selection: i, from: a, to: o }) {
	let { anchor: s } = i, c = [], l = e.isEmpty;
	return r.nodesBetween(a, o, (r, i) => {
		let a = s >= i && s <= i + r.nodeSize, o = !r.isLeaf && Du(r);
		return r.type.isTextblock && (a || !t.showOnlyCurrent) && o && c.push(o_({
			editor: e,
			isEmptyDoc: l,
			dataAttribute: n,
			hasAnchor: a,
			placeholder: t.placeholder,
			classes: {
				emptyEditor: t.emptyEditorClass,
				emptyNode: s_(t.emptyNodeClass, {
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
function l_({ editor: e, options: t, dataAttribute: n, doc: r, selection: i }) {
	if (!(e.isEditable || !t.showOnlyWhenEditable)) return null;
	let { anchor: a } = i, o = [], s = e.isEmpty;
	if (t.showOnlyCurrent && !t.includeChildren) {
		let i = r.resolve(a), c = i.depth > 0 ? i.node(1) : i.nodeAfter, l = i.depth > 0 ? i.before(1) : a;
		if (c && c.type.isTextblock && Du(c)) {
			let r = a >= l && a <= l + c.nodeSize;
			o.push(o_({
				editor: e,
				isEmptyDoc: s,
				dataAttribute: n,
				hasAnchor: r,
				placeholder: t.placeholder,
				classes: {
					emptyEditor: t.emptyEditorClass,
					emptyNode: s_(t.emptyNodeClass, {
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
	} else o.push(...c_({
		editor: e,
		options: t,
		dataAttribute: n,
		doc: r,
		selection: i,
		from: 0,
		to: r.content.size
	}));
	return N.create(r, o);
}
function u_(e, t) {
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
function d_(e, t) {
	return {
		from: Math.max(0, t.from - 1),
		to: Math.min(e.content.size, t.to - 1)
	};
}
function f_(e, t, n) {
	let r = [];
	return e.forEach((e, i) => {
		let a = i, o = a + e.nodeSize, s = a + 1, c = o + 1;
		s < n && c > t && r.push({
			from: a,
			to: o
		});
	}), r;
}
function p_(e) {
	if (e.length === 0) return [];
	let t = [...e].sort((e, t) => e.from - t.from), n = [{ ...t[0] }];
	for (let e = 1; e < t.length; e += 1) {
		let r = n[n.length - 1], i = t[e];
		i.from <= r.to ? r.to = Math.max(r.to, i.to) : n.push({ ...i });
	}
	return n;
}
function m_(e, t) {
	let n = f_(e, t.from, t.to);
	return n.push(d_(e, u_(e, t.from))), t.to > t.from ? n.push(d_(e, u_(e, Math.min(t.to, e.content.size + 1) - 1))) : t.from < e.content.size + 1 && n.push(d_(e, u_(e, Math.min(t.from + 1, e.content.size)))), n;
}
function h_(e, t, n) {
	let r = [];
	if (e.docChanged) {
		let t = mu(e);
		for (let e of t) r.push(...m_(n.doc, e.newRange));
	}
	return e.selectionSet && (r.push(d_(n.doc, u_(n.doc, e.mapping.map(t.selection.anchor)))), r.push(d_(n.doc, u_(n.doc, n.selection.anchor)))), p_(r);
}
function g_(e, t, n) {
	let r = Math.max(0, Math.min(e, n.content.size));
	return {
		from: r,
		to: Math.max(r, Math.min(t, n.content.size))
	};
}
function __({ decorations: e, ranges: t, editor: n, options: r, dataAttribute: i, doc: a, selection: o }) {
	let s = e;
	for (let e of t) {
		let { from: t, to: c } = g_(e.from, e.to, a), l = s.find(t, c).filter((e) => e.from >= t && e.to <= c);
		l.length && (s = s.remove(l));
		let u = c_({
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
function v_({ editor: e, options: t, dataAttribute: n }) {
	return {
		init(r, i) {
			return l_({
				editor: e,
				options: t,
				dataAttribute: n,
				doc: i.doc,
				selection: i.selection
			}) ?? N.empty;
		},
		apply(r, i, a, o) {
			return !r.docChanged && !r.selectionSet ? i : __({
				decorations: i.map(r.mapping, r.doc),
				ranges: h_(r, a, o),
				editor: e,
				options: t,
				dataAttribute: n,
				doc: o.doc,
				selection: o.selection
			});
		}
	};
}
function y_(e) {
	return e.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
function b_({ editor: e, options: t }) {
	let n = t.dataAttribute ? `data-${y_(t.dataAttribute)}` : `data-${i_}`, r = t.showOnlyCurrent && !t.includeChildren;
	return new j({
		key: a_,
		...r ? {} : { state: v_({
			editor: e,
			options: t,
			dataAttribute: n
		}) },
		props: { decorations: r ? ({ doc: r, selection: i }) => l_({
			editor: e,
			options: t,
			dataAttribute: n,
			doc: r,
			selection: i
		}) : (n) => t.showOnlyWhenEditable && !e.isEditable ? N.empty : a_.getState(n) ?? N.empty }
	});
}
var x_ = L.create({
	name: "placeholder",
	addOptions() {
		return {
			emptyEditorClass: "is-editor-empty",
			emptyNodeClass: "is-empty",
			dataAttribute: i_,
			placeholder: "Write something …",
			showOnlyWhenEditable: !0,
			showOnlyCurrent: !0,
			includeChildren: !1
		};
	},
	addProseMirrorPlugins() {
		return [b_({
			editor: this.editor,
			options: this.options
		})];
	}
});
function S_(e, t) {
	return !e.selection.empty && !Ou(e.selection) && t.isEditable;
}
function C_(e, t) {
	return S_(e, t) && !t.isFocused && !t.view.dragging;
}
function w_() {
	window.getSelection()?.removeAllRanges();
}
function T_(e) {
	e.focus();
}
L.create({
	name: "selection",
	addOptions() {
		return { className: "selection" };
	},
	addProseMirrorPlugins() {
		let { editor: e, options: t } = this;
		return [new j({
			key: new M("selection"),
			props: {
				decorations(n) {
					return C_(n, e) ? N.create(n.doc, [ms.inline(n.selection.from, n.selection.to, { class: t.className })]) : null;
				},
				handleDOMEvents: {
					blur(t) {
						return S_(t.state, e) && w_(), !1;
					},
					focus(t) {
						return S_(t.state, e) && requestAnimationFrame(() => {
							!e.isDestroyed && t.hasFocus() && T_(t);
						}), !1;
					}
				}
			}
		})];
	}
});
function E_({ types: e, node: t }) {
	return t && Array.isArray(e) && e.includes(t.type) || t?.type === e;
}
var D_ = L.create({
	name: "trailingNode",
	addOptions() {
		return {
			node: void 0,
			notAfter: []
		};
	},
	addProseMirrorPlugins() {
		let e = new M(this.name), t = this.options.node || this.editor.schema.topNodeType.contentMatch.defaultType?.name || "paragraph", n = Object.entries(this.editor.schema.nodes).map(([, e]) => e).filter((e) => (this.options.notAfter || []).concat(t).includes(e.name));
		return [new j({
			key: e,
			appendTransaction: (n, r, i) => {
				let { doc: a, tr: o, schema: s } = i, c = e.getState(i), l = a.content.size, u = s.nodes[t];
				if (!n.some((e) => e.getMeta("skipTrailingNode")) && c) return o.insert(l, u.create());
			},
			state: {
				init: (e, t) => {
					let r = t.tr.doc.lastChild;
					return !E_({
						node: r,
						types: n
					});
				},
				apply: (e, t) => {
					if (!e.docChanged || e.getMeta("__uniqueIDTransaction")) return t;
					let r = e.doc.lastChild;
					return !E_({
						node: r,
						types: n
					});
				}
			}
		})];
	}
}), O_ = L.create({
	name: "undoRedo",
	addOptions() {
		return {
			depth: 100,
			newGroupDelay: 500
		};
	},
	addCommands() {
		return {
			undo: () => ({ state: e, dispatch: t }) => e_(e, t),
			redo: () => ({ state: e, dispatch: t }) => t_(e, t)
		};
	},
	addProseMirrorPlugins() {
		return [Qg(this.options)];
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
}), k_ = L.create({
	name: "starterKit",
	addExtensions() {
		let e = [];
		return this.options.bold !== !1 && e.push(vf.configure(this.options.bold)), this.options.blockquote !== !1 && e.push(pf.configure(this.options.blockquote)), this.options.bulletList !== !1 && e.push(lh.configure(this.options.bulletList)), this.options.code !== !1 && e.push(xf.configure(this.options.code)), this.options.codeBlock !== !1 && e.push(Tf.configure(this.options.codeBlock)), this.options.document !== !1 && e.push(Ef.configure(this.options.document)), this.options.dropcursor !== !1 && e.push(n_.configure(this.options.dropcursor)), this.options.gapcursor !== !1 && e.push(r_.configure(this.options.gapcursor)), this.options.hardBreak !== !1 && e.push(Df.configure(this.options.hardBreak)), this.options.heading !== !1 && e.push(Of.configure(this.options.heading)), this.options.undoRedo !== !1 && e.push(O_.configure(this.options.undoRedo)), this.options.horizontalRule !== !1 && e.push(kf.configure(this.options.horizontalRule)), this.options.italic !== !1 && e.push(Pf.configure(this.options.italic)), this.options.listItem !== !1 && e.push(Mh.configure(this.options.listItem)), this.options.listKeymap !== !1 && e.push(Uh.configure(this.options?.listKeymap)), this.options.link !== !1 && e.push(nh.configure(this.options?.link)), this.options.orderedList !== !1 && e.push(og.configure(this.options.orderedList)), this.options.paragraph !== !1 && e.push(fg.configure(this.options.paragraph)), this.options.strike !== !1 && e.push(hg.configure(this.options.strike)), this.options.text !== !1 && e.push(gg.configure(this.options.text)), this.options.underline !== !1 && e.push(_g.configure(this.options?.underline)), this.options.trailingNode !== !1 && e.push(D_.configure(this.options?.trailingNode)), e;
	}
}), A_ = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/, j_ = R.create({
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
		return ["img", I(this.options.HTMLAttributes, e)];
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
			let u = I(this.options.HTMLAttributes, s);
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
			let p = new cf({
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
					let t = Xl(e, c.extensionManager.attributes.filter((t) => t.type === e.type.name));
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
		return [rf({
			find: A_,
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
}), M_ = lg, N_ = cg;
//#endregion
//#region node_modules/marked/lib/marked.esm.js
function P_() {
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
var F_ = P_();
function I_(e) {
	F_ = e;
}
var L_ = { exec: () => null };
function U(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(z_.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var R_ = (() => {
	try {
		return !!/* @__PURE__ */ RegExp("(?<=1)(?<!1)");
	} catch {
		return !1;
	}
})(), z_ = {
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
}, B_ = /^(?:[ \t]*(?:\n|$))+/, V_ = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, H_ = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, U_ = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, W_ = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, G_ = / {0,3}(?:[*+-]|\d{1,9}[.)])/, K_ = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, q_ = U(K_).replace(/bull/g, G_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), J_ = U(K_).replace(/bull/g, G_).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Y_ = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, X_ = /^[^\n]+/, Z_ = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Q_ = U(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Z_).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), $_ = U(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, G_).getRegex(), ev = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", tv = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, nv = U("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", tv).replace("tag", ev).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), rv = U(Y_).replace("hr", U_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ev).getRegex(), iv = {
	blockquote: U(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", rv).getRegex(),
	code: V_,
	def: Q_,
	fences: H_,
	heading: W_,
	hr: U_,
	html: nv,
	lheading: q_,
	list: $_,
	newline: B_,
	paragraph: rv,
	table: L_,
	text: X_
}, av = U("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", U_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ev).getRegex(), ov = {
	...iv,
	lheading: J_,
	table: av,
	paragraph: U(Y_).replace("hr", U_).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", av).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ev).getRegex()
}, sv = {
	...iv,
	html: U("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", tv).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: L_,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: U(Y_).replace("hr", U_).replace("heading", " *#{1,6} *[^\n]").replace("lheading", q_).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cv = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, lv = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, uv = /^( {2,}|\\)\n(?!\s*$)/, dv = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, fv = /[\p{P}\p{S}]/u, pv = /[\s\p{P}\p{S}]/u, mv = /[^\s\p{P}\p{S}]/u, hv = U(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, pv).getRegex(), gv = /(?!~)[\p{P}\p{S}]/u, _v = /(?!~)[\s\p{P}\p{S}]/u, vv = /(?:[^\s\p{P}\p{S}]|~)/u, yv = U(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", R_ ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), bv = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, xv = U(bv, "u").replace(/punct/g, fv).getRegex(), Sv = U(bv, "u").replace(/punct/g, gv).getRegex(), Cv = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", wv = U(Cv, "gu").replace(/notPunctSpace/g, mv).replace(/punctSpace/g, pv).replace(/punct/g, fv).getRegex(), Tv = U(Cv, "gu").replace(/notPunctSpace/g, vv).replace(/punctSpace/g, _v).replace(/punct/g, gv).getRegex(), Ev = U("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, mv).replace(/punctSpace/g, pv).replace(/punct/g, fv).getRegex(), Dv = U(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, fv).getRegex(), Ov = U("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, mv).replace(/punctSpace/g, pv).replace(/punct/g, fv).getRegex(), kv = U(/\\(punct)/, "gu").replace(/punct/g, fv).getRegex(), Av = U(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), jv = U(tv).replace("(?:-->|$)", "-->").getRegex(), Mv = U("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", jv).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Nv = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, Pv = U(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Nv).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Fv = U(/^!?\[(label)\]\[(ref)\]/).replace("label", Nv).replace("ref", Z_).getRegex(), Iv = U(/^!?\[(ref)\](?:\[\])?/).replace("ref", Z_).getRegex(), Lv = U("reflink|nolink(?!\\()", "g").replace("reflink", Fv).replace("nolink", Iv).getRegex(), Rv = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, zv = {
	_backpedal: L_,
	anyPunctuation: kv,
	autolink: Av,
	blockSkip: yv,
	br: uv,
	code: lv,
	del: L_,
	delLDelim: L_,
	delRDelim: L_,
	emStrongLDelim: xv,
	emStrongRDelimAst: wv,
	emStrongRDelimUnd: Ev,
	escape: cv,
	link: Pv,
	nolink: Iv,
	punctuation: hv,
	reflink: Fv,
	reflinkSearch: Lv,
	tag: Mv,
	text: dv,
	url: L_
}, Bv = {
	...zv,
	link: U(/^!?\[(label)\]\((.*?)\)/).replace("label", Nv).getRegex(),
	reflink: U(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Nv).getRegex()
}, Vv = {
	...zv,
	emStrongRDelimAst: Tv,
	emStrongLDelim: Sv,
	delLDelim: Dv,
	delRDelim: Ov,
	url: U(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Rv).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: U(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Rv).getRegex()
}, Hv = {
	...Vv,
	br: U(uv).replace("{2,}", "*").getRegex(),
	text: U(Vv.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Uv = {
	normal: iv,
	gfm: ov,
	pedantic: sv
}, Wv = {
	normal: zv,
	gfm: Vv,
	breaks: Hv,
	pedantic: Bv
}, Gv = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, Kv = (e) => Gv[e];
function qv(e, t) {
	if (t) {
		if (z_.escapeTest.test(e)) return e.replace(z_.escapeReplace, Kv);
	} else if (z_.escapeTestNoEncode.test(e)) return e.replace(z_.escapeReplaceNoEncode, Kv);
	return e;
}
function Jv(e) {
	try {
		e = encodeURI(e).replace(z_.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Yv(e, t) {
	let n = e.replace(z_.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(z_.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
	else for (; n.length < t;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(z_.slashPipe, "|");
	return n;
}
function Xv(e, t, n) {
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
function Zv(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Qv(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function $v(e, t, n, r, i) {
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
function ey(e, t, n) {
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
var ty = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || F_;
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
				text: this.options.pedantic ? e : Xv(e, "\n")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = ey(e, t[3] || "", this.rules);
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
				let t = Xv(e, "#");
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
			raw: Xv(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = Xv(t[0], "\n").split("\n"), n = "", r = "", i = [];
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
				let c = Qv(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
		let n = Yv(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
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
			for (let e of i) a.rows.push(Yv(e, a.header.length).map((e, t) => ({
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
				let t = Xv(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = Zv(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), $v(t, {
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
			return $v(n, e, n[0], this.lexer, this.rules);
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
}, ny = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || F_, this.options.tokenizer = this.options.tokenizer || new ty(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let t = {
			other: z_,
			block: Uv.normal,
			inline: Wv.normal
		};
		this.options.pedantic ? (t.block = Uv.pedantic, t.inline = Wv.pedantic) : this.options.gfm && (t.block = Uv.gfm, this.options.breaks ? t.inline = Wv.breaks : t.inline = Wv.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Uv,
			inline: Wv
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(z_.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(z_.tabCharGlobal, "    ").replace(z_.spaceLine, "")); e;) {
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
}, ry = class {
	options;
	parser;
	constructor(e) {
		this.options = e || F_;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(z_.notSpaceStart)?.[0], i = e.replace(z_.endingNewline, "") + "\n";
		return r ? "<pre><code class=\"language-" + qv(r) + "\">" + (n ? i : qv(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : qv(i, !0)) + "</code></pre>\n";
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
		return `<code>${qv(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let r = this.parser.parseInline(n), i = Jv(e);
		if (i === null) return r;
		e = i;
		let a = "<a href=\"" + e + "\"";
		return t && (a += " title=\"" + qv(t) + "\""), a += ">" + r + "</a>", a;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Jv(e);
		if (i === null) return qv(n);
		e = i;
		let a = `<img src="${e}" alt="${qv(n)}"`;
		return t && (a += ` title="${qv(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : qv(e.text);
	}
}, iy = class {
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
}, ay = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || F_, this.options.renderer = this.options.renderer || new ry(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new iy();
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
}, oy = class {
	options;
	block;
	constructor(e) {
		this.options = e || F_;
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
		return e ? ny.lex : ny.lexInline;
	}
	provideParser(e = this.block) {
		return e ? ay.parse : ay.parseInline;
	}
}, sy = new class {
	defaults = P_();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = ay;
	Renderer = ry;
	TextRenderer = iy;
	Lexer = ny;
	Tokenizer = ty;
	Hooks = oy;
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
				let t = this.defaults.renderer || new ry(this.defaults);
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
				let t = this.defaults.tokenizer || new ty(this.defaults);
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
				let t = this.defaults.hooks || new oy();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					oy.passThroughHooks.has(n) ? t[r] = (e) => {
						if (this.defaults.async && oy.passThroughHooksRespectAsync.has(n)) return (async () => {
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
		return ny.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return ay.parse(e, t ?? this.defaults);
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
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? ny.lex : ny.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? ay.parse : ay.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? ny.lex : ny.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? ay.parse : ay.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + qv(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function W(e, t) {
	return sy.parse(e, t);
}
W.options = W.setOptions = function(e) {
	return sy.setOptions(e), W.defaults = sy.defaults, I_(W.defaults), W;
}, W.getDefaults = P_, W.defaults = F_, W.use = function(...e) {
	return sy.use(...e), W.defaults = sy.defaults, I_(W.defaults), W;
}, W.walkTokens = function(e, t) {
	return sy.walkTokens(e, t);
}, W.parseInline = sy.parseInline, W.Parser = ay, W.parser = ay.parse, W.Renderer = ry, W.TextRenderer = iy, W.Lexer = ny, W.lexer = ny.lex, W.Tokenizer = ty, W.Hooks = oy, W.parse = W, W.options, W.setOptions, W.use, W.walkTokens, W.parseInline, ay.parse, ny.lex;
//#endregion
//#region node_modules/@tiptap/markdown/dist/index.js
var cy = /\n[^\S\n]*(?:\n[^\S\n]*)+$/;
function ly(e) {
	return e.flatMap((t, n) => {
		if (t.type === "space" || e[n + 1]?.type === "space") return [t];
		let r = (t.raw || "").match(cy);
		return r ? [{
			...t,
			raw: (t.raw || "").slice(0, -r[0].length)
		}, {
			type: "space",
			raw: r[0]
		}] : [t];
	});
}
function uy(e, t) {
	let n = t.split("\n").flatMap((e) => [e, ""]).map((t) => `${e}${t}`).join("\n");
	return n.slice(0, n.length - 1);
}
function dy(e, t) {
	let n = [];
	return Array.from(e.entries()).forEach(([e, r]) => {
		if (!t) {
			n.push(e);
			return;
		}
		(t.marks || []).find((t) => t.type === e && sd(t.attrs, r.attrs)) || n.push(e);
	}), n;
}
function fy(e, t) {
	let n = [];
	return Array.from(t.entries()).forEach(([t, r]) => {
		let i = e.get(t);
		(!i || !sd(i.attrs, r.attrs)) && n.push({
			type: t,
			mark: r
		});
	}), n;
}
function py(e, t, n, r) {
	let i = !n, a = n && (!n.marks || n.marks.length === 0), o = n && n.marks && !r(t, new Map(n.marks.map((e) => [e.type, e]))), s = [];
	return (i || a || o) && (n && n.marks ? Array.from(e.entries()).reverse().forEach(([e, t]) => {
		n.marks.find((n) => n.type === e && sd(n.attrs, t.attrs)) || s.push(e);
	}) : (i || a) && s.push(...Array.from(e.keys()).reverse())), s;
}
function my(e, t) {
	let n = "";
	return Array.from(e.keys()).reverse().forEach((r) => {
		let i = t(r, e.get(r));
		i && (n = i + n);
	}), e.clear(), n;
}
function hy(e, t, n) {
	let r = "";
	return Array.from(e.entries()).forEach(([e, i]) => {
		let a = n(e, i);
		a && (r += a), t.set(e, i);
	}), r;
}
function gy(e) {
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
function _y(e, t) {
	return typeof e == "string" ? t : "json";
}
var vy = /* @__PURE__ */ new Set(/* @__PURE__ */ "a.abbr.address.area.article.aside.audio.b.base.bdi.bdo.blockquote.body.br.button.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.iframe.img.input.ins.kbd.label.legend.li.link.main.map.mark.menu.meta.meter.nav.noscript.object.ol.optgroup.option.output.p.param.picture.pre.progress.q.rp.rt.ruby.s.samp.script.search.section.select.slot.small.source.span.strong.style.sub.summary.sup.svg.circle.clippath.defs.ellipse.foreignobject.g.image.line.lineargradient.mask.path.polygon.polyline.radialgradient.rect.stop.switch.symbol.textpath.tspan.use.table.tbody.td.template.textarea.tfoot.th.thead.time.title.tr.track.u.ul.var.video.wbr".split(".")), yy = /<\/?([a-zA-Z][\w-]*)/g;
function by(e) {
	let t = [], n;
	for (; (n = yy.exec(e)) !== null;) t.push(n[1].toLowerCase());
	return t;
}
function xy(e) {
	let t = e.toLowerCase();
	return !t.includes("-") && !vy.has(t);
}
function Sy(e, t) {
	return by(e).some((e) => xy(e) ? !t.has(e) : !1);
}
var Cy = class {
	constructor(e) {
		this.activeParseLexer = null, this.extensionRanks = /* @__PURE__ */ new Map(), this.baseExtensions = [], this.extensions = [], this.codeTypes = /* @__PURE__ */ new Set(), this.schemaParseDomTagsCache = null, this.lastParseResult = null, this.markedInstance = e?.marked ?? W, this.indentStyle = e?.indentation?.style ?? "space", this.indentSize = e?.indentation?.size ?? 2, this.baseExtensions = e?.extensions || [], e?.markedOptions && typeof this.markedInstance.setOptions == "function" && this.markedInstance.setOptions(e.markedOptions), this.registry = /* @__PURE__ */ new Map(), this.nodeTypeRegistry = /* @__PURE__ */ new Map(), e?.extensions && (this.baseExtensions = e.extensions, ru(Hl(e.extensions)).forEach((e) => this.registerExtension(e)));
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
		let t = F(P(e, "code")), n = e.name;
		t && this.codeTypes.add(n), this.extensionRanks.has(n) || this.extensionRanks.set(n, this.extensionRanks.size);
		let r = P(e, "markdownTokenName") || n, i = P(e, "parseMarkdown"), a = P(e, "renderMarkdown"), o = P(e, "markdownTokenizer"), s = P(e, "markdownOptions") ?? null, c = {
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
		let n = t ? ly(e) : e, r = n.reduce((e, t, n) => (t.type !== "space" && e.push(n), e), []), i = -1, a = 0;
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
		let t = e.items.some((e) => gy(e).isTask), n = e.items.some((e) => !gy(e).isTask);
		if (!t || !n || this.getHandlersForToken("taskList").length === 0) return this.parseTokenWithHandlers(e);
		let r = [], i = [], a = null;
		for (let t = 0; t < e.items.length; t += 1) {
			let n = e.items[t], { isTask: o, checked: s, indentLevel: c } = gy(n), l = n;
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
				text: ud(r.text || "")
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
			n.type === "text" && r.type === "text" && Ed(n.marks || [], r.marks || []) && (r.text = (r.text || "") + (n.text || ""), t.splice(e, 1));
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
				text: ud(e.text || "")
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
			let n = ou(t, this.baseExtensions);
			return n.type === "doc" && n.content ? e.block ? n.content : n.content.length === 1 && n.content[0].type === "paragraph" && n.content[0].content ? n.content[0].content : n.content : n;
		} catch (e) {
			throw Error(`Failed to parse HTML in markdown: ${e}`);
		}
	}
	isUnrecognizedHtml(e) {
		return Sy(e, this.getSchemaParseDomTags());
	}
	getSchemaParseDomTags() {
		if (this.schemaParseDomTagsCache) return this.schemaParseDomTagsCache;
		let e = /* @__PURE__ */ new Set();
		try {
			let t = au(this.baseExtensions), n = (t) => {
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
		return n?.type != null && this.codeTypes.has(n.type) || (t.marks || []).some((e) => this.codeTypes.has(typeof e == "string" ? e : e.type)) ? e : this.escapeMarkdownSyntax(dd(e));
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
			wrapInBlock: uy
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
				let e = this.encodeTextForMarkdown(n.text || "", n, t), r = new Map((n.marks || []).map((e) => [e.type, e])), c = this.getMarksToOpenForSerialization(a, r, l), u = dy(r, l), d = u.filter((e) => a.has(e)), f = d.length > 0 && c.length > 0, p = "";
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
				} else h = py(a, r, l, this.markSetsEqual.bind(this));
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
				let u = my(a, (e, t) => this.getMarkClosing(e, t, s.get(e)));
				s.clear();
				let d = this.renderNodeToMarkdown(n, t, c, r), f = n.type === "hardBreak" ? "" : hy(o, a, (e, t) => {
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
			return r && sd(n.attrs, r.attrs);
		});
	}
	getMarksToOpenForSerialization(e, t, n) {
		let r = fy(e, t);
		if (r.length <= 1) return r;
		let i = n?.marks || [], a = (e, t) => i.some((n) => n.type === e && sd(n.attrs, t)), o = (e, t) => {
			let n = this.extensionRanks.get(e.type) ?? 2 ** 53 - 1, r = this.extensionRanks.get(t.type) ?? 2 ** 53 - 1;
			return n === r ? e.type.localeCompare(t.type) : r - n;
		}, s = r.filter((e) => !a(e.type, e.mark.attrs)).sort(o), c = r.filter((e) => a(e.type, e.mark.attrs)).sort(o);
		return [...s, ...c];
	}
}, wy = L.create({
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
				if (!t?.contentType || _y(e, t?.contentType) !== "markdown" || !this.editor.markdown) return xc.setContent(e, t);
				let n = this.editor.markdown.parse(e);
				return xc.setContent(n, t);
			},
			insertContent: (e, t) => {
				if (!t?.contentType || _y(e, t?.contentType) !== "markdown" || !this.editor.markdown) return xc.insertContent(e, t);
				let n = this.editor.markdown.parse(e);
				return xc.insertContent(n, t);
			},
			insertContentAt: (e, t, n) => {
				if (!n?.contentType || _y(t, n?.contentType) !== "markdown" || !this.editor.markdown) return xc.insertContentAt(e, t, n);
				let r = this.editor.markdown.parse(t);
				return xc.insertContentAt(e, r, n);
			}
		};
	},
	addStorage() {
		return { manager: new Cy({
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
		if (this.storage.manager = new Cy({
			indentation: this.options.indentation,
			marked: this.options.marked,
			markedOptions: this.options.markedOptions,
			extensions: this.editor.extensionManager.baseExtensions
		}), this.editor.markdown = this.storage.manager, this.editor.getMarkdown = () => this.storage.manager.serialize(this.editor.getJSON()), !this.editor.options.contentType || _y(this.editor.options.content, this.editor.options.contentType) !== "markdown") return;
		if (!this.editor.markdown) throw Error("[tiptap][markdown]: The `contentType` option is set to \"markdown\", but the Markdown extension is not added to the editor. Please add the Markdown extension to use this feature.");
		if (this.editor.options.content === void 0 || typeof this.editor.options.content != "string") throw Error("[tiptap][markdown]: The `contentType` option is set to \"markdown\", but the initial content is not a string. Please provide the initial content as a markdown string.");
		let e = this.editor.markdown.parse(this.editor.options.content);
		e.content?.length && (this.editor.options.content = e);
	}
}), Ty = x_, Ey = r_, Dy = Math.min, Oy = Math.max, ky = Math.round, Ay = (e) => ({
	x: e,
	y: e
});
function jy(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function My(e) {
	return e.split("-")[0];
}
function Ny(e) {
	return e.split("-")[1];
}
function Py(e) {
	return e === "x" ? "y" : "x";
}
function Fy(e) {
	return e === "y" ? "height" : "width";
}
function Iy(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function Ly(e) {
	return Py(Iy(e));
}
function Ry(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function zy(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Ry(e);
}
function By(e) {
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
function Vy(e, t, n) {
	let { reference: r, floating: i } = e, a = Iy(t), o = Ly(t), s = Fy(o), c = My(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
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
	let m = Ny(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Hy(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = jy(t, e), p = zy(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = By(await i.getClippingRect({
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
	}, y = By(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
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
var Uy = 50, Wy = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Hy
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Vy(l, r, c), f = r, p = 0, m = {};
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
		}, x && p < Uy && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Vy(l, f, c)), n = -1);
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
function Gy() {
	return typeof window < "u";
}
function Ky(e) {
	return Yy(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function qy(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Jy(e) {
	return ((Yy(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Yy(e) {
	return Gy() ? e instanceof Node || e instanceof qy(e).Node : !1;
}
function Xy(e) {
	return Gy() ? e instanceof Element || e instanceof qy(e).Element : !1;
}
function Zy(e) {
	return Gy() ? e instanceof HTMLElement || e instanceof qy(e).HTMLElement : !1;
}
function Qy(e) {
	return !Gy() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof qy(e).ShadowRoot;
}
function $y(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = ub(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function eb(e) {
	return /^(table|td|th)$/.test(Ky(e));
}
function tb(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var nb = /transform|translate|scale|rotate|perspective|filter/, rb = /paint|layout|strict|content/, ib = (e) => !!e && e !== "none", ab;
function ob(e) {
	let t = Xy(e) ? ub(e) : e;
	return ib(t.transform) || ib(t.translate) || ib(t.scale) || ib(t.rotate) || ib(t.perspective) || !cb() && (ib(t.backdropFilter) || ib(t.filter)) || nb.test(t.willChange || "") || rb.test(t.contain || "");
}
function sb(e) {
	let t = fb(e);
	for (; Zy(t) && !lb(t);) {
		if (ob(t)) return t;
		if (tb(t)) return null;
		t = fb(t);
	}
	return null;
}
function cb() {
	return ab ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), ab;
}
function lb(e) {
	return /^(html|body|#document)$/.test(Ky(e));
}
function ub(e) {
	return qy(e).getComputedStyle(e);
}
function db(e) {
	return Xy(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function fb(e) {
	if (Ky(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || Qy(e) && e.host || Jy(e);
	return Qy(t) ? t.host : t;
}
function pb(e) {
	let t = fb(e);
	return lb(t) ? (e.ownerDocument || e).body : Zy(t) && $y(t) ? t : pb(t);
}
function mb(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = pb(e), i = r === e.ownerDocument?.body, a = qy(r);
	if (i) {
		let e = hb(a);
		return t.concat(a, a.visualViewport || [], $y(r) ? r : [], e && n ? mb(e) : []);
	} else return t.concat(r, mb(r, [], n));
}
function hb(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function gb(e) {
	let t = ub(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = Zy(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = ky(n) !== a || ky(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function _b(e) {
	return Xy(e) ? e : e.contextElement;
}
function vb(e) {
	let t = _b(e);
	if (!Zy(t)) return Ay(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = gb(t), o = (a ? ky(n.width) : n.width) / r, s = (a ? ky(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var yb = /*#__PURE__*/ Ay(0);
function bb(e) {
	let t = qy(e);
	return !cb() || !t.visualViewport ? yb : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function xb(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === qy(e);
}
function Sb(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = _b(e), o = Ay(1);
	t && (r ? Xy(r) && (o = vb(r)) : o = vb(e));
	let s = xb(a, n, r) ? bb(a) : Ay(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = qy(a), t = Xy(r) ? qy(r) : r, n = e, i = hb(n);
		for (; i && t !== n;) {
			let e = vb(i), t = i.getBoundingClientRect(), r = ub(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = qy(i), i = hb(n);
		}
	}
	return By({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Cb(e, t) {
	let n = db(e).scrollLeft;
	return t ? t.left + n : Sb(Jy(e)).left + n;
}
function wb(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Cb(e, n),
		y: n.top + t.scrollTop
	};
}
function Tb(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Jy(r), s = t ? tb(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = Ay(1), u = Ay(0), d = Zy(r);
	if ((d || !a) && ((Ky(r) !== "body" || $y(o)) && (c = db(r)), d)) {
		let e = Sb(r);
		l = vb(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? wb(o, c) : Ay(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Eb(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Db(e) {
	let t = db(e), n = e.ownerDocument.body, r = Oy(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Oy(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + Cb(e), o = -t.scrollTop;
	return ub(n).direction === "rtl" && (a += Oy(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var Ob = 25;
function kb(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = qy(e), a = Jy(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !cb() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (Cb(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Ob && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Ab(e, t) {
	let n = Sb(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = vb(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function jb(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = kb(e, n, t);
	else if (t === "document") r = Db(Jy(e));
	else if (Xy(t)) r = Ab(t, n);
	else {
		let n = bb(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return By(r);
}
function Mb(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = mb(e, [], !1).filter((e) => Xy(e) && Ky(e) !== "body"), i = null, a = ub(e).position === "fixed", o = a ? fb(e) : e;
	for (; Xy(o) && !lb(o);) {
		let e = ub(o), t = ob(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = fb(o);
	}
	return t.set(e, r), r;
}
function Nb(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? tb(t) ? [] : Mb(t, this._c) : [].concat(n), r], o = jb(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = jb(t, a[e], i);
		s = Oy(n.top, s), c = Dy(n.right, c), l = Dy(n.bottom, l), u = Oy(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Pb(e) {
	let { width: t, height: n } = gb(e);
	return {
		width: t,
		height: n
	};
}
function Fb(e, t, n) {
	let r = Zy(t), i = Jy(t), a = n === "fixed", o = Sb(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = Ay(0);
	if ((r || !a) && ((Ky(t) !== "body" || $y(i)) && (s = db(t)), r)) {
		let e = Sb(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = Cb(i));
	let l = i && !r && !a ? wb(i, s) : Ay(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Ib(e) {
	return ub(e).position === "static";
}
function Lb(e, t) {
	if (!Zy(e) || ub(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Jy(e) === n && (n = n.ownerDocument.body), n;
}
function Rb(e, t) {
	let n = qy(e);
	if (tb(e)) return n;
	if (!Zy(e)) {
		let t = fb(e);
		for (; t && !lb(t);) {
			if (Xy(t) && !Ib(t)) return t;
			t = fb(t);
		}
		return n;
	}
	let r = Lb(e, t);
	for (; r && eb(r) && Ib(r);) r = Lb(r, t);
	return r && lb(r) && Ib(r) && !ob(r) ? n : r || sb(e) || n;
}
var zb = async function(e) {
	let t = this.getOffsetParent || Rb, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Fb(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Bb(e) {
	return ub(e).direction === "rtl";
}
var Vb = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Tb,
	getDocumentElement: Jy,
	getClippingRect: Nb,
	getOffsetParent: Rb,
	getElementRects: zb,
	getClientRects: Eb,
	getDimensions: Pb,
	getScale: vb,
	isElement: Xy,
	isRTL: Bb
}, Hb = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Vb,
		...i.platform,
		_c: r
	};
	return Wy(e, t, {
		...i,
		platform: a
	});
}, Ub = () => /* @__PURE__ */ new Map(), Wb = (e) => {
	let t = Ub();
	return e.forEach((e, n) => {
		t.set(n, e);
	}), t;
}, Gb = (e, t, n) => {
	let r = e.get(t);
	return r === void 0 && e.set(t, r = n()), r;
}, Kb = (e, t) => {
	let n = [];
	for (let [r, i] of e) n.push(t(i, r));
	return n;
}, qb = (e, t) => {
	for (let [n, r] of e) if (t(r, n)) return !0;
	return !1;
}, Jb = () => /* @__PURE__ */ new Set(), Yb = (e) => e[e.length - 1], Xb = (e, t) => {
	for (let n = 0; n < t.length; n++) e.push(t[n]);
}, Zb = Array.from, Qb = (e, t) => {
	for (let n = 0; n < e.length; n++) if (!t(e[n], n, e)) return !1;
	return !0;
}, $b = (e, t) => {
	for (let n = 0; n < e.length; n++) if (t(e[n], n, e)) return !0;
	return !1;
}, ex = (e, t) => {
	let n = Array(e);
	for (let r = 0; r < e; r++) n[r] = t(r, n);
	return n;
}, tx = Array.isArray, nx = class {
	constructor() {
		this._observers = Ub();
	}
	on(e, t) {
		return Gb(this._observers, e, Jb).add(t), t;
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
		return Zb((this._observers.get(e) || Ub()).values()).forEach((e) => e(...t));
	}
	destroy() {
		this._observers = Ub();
	}
}, rx = Math.floor, ix = Math.abs, ax = (e, t) => e < t ? e : t, ox = (e, t) => e > t ? e : t;
Number.isNaN;
var sx = (e) => e === 0 ? 1 / e < 0 : e < 0, cx = 1 << 17, lx = 1 << 18, ux = 1 << 19, dx = 1 << 20, fx = 1 << 21, px = 1 << 22, mx = 1 << 23, hx = 1 << 24, gx = 1 << 25, _x = 1 << 26, vx = 1 << 27, yx = 1 << 28, bx = 1 << 29;
cx - 1, lx - 1, ux - 1, dx - 1, fx - 1, px - 1, mx - 1, hx - 1, gx - 1, _x - 1, vx - 1, yx - 1, bx - 1;
var xx = 2 ** 53 - 1, Sx = -(2 ** 53 - 1), Cx = Number.isInteger || ((e) => typeof e == "number" && isFinite(e) && rx(e) === e);
Number.isNaN, Number.parseInt;
//#endregion
//#region node_modules/lib0/string.js
var wx = String.fromCharCode;
String.fromCodePoint, wx(65535);
var Tx = (e) => e.toLowerCase(), Ex = /^\s*/g, Dx = (e) => e.replace(Ex, ""), Ox = /([A-Z])/g, kx = (e, t) => Dx(e.replace(Ox, (e) => `${t}${Tx(e)}`)), Ax = (e) => {
	let t = unescape(encodeURIComponent(e)), n = t.length, r = new Uint8Array(n);
	for (let e = 0; e < n; e++) r[e] = t.codePointAt(e);
	return r;
}, jx = typeof TextEncoder < "u" ? new TextEncoder() : null, Mx = jx ? (e) => jx.encode(e) : Ax, Nx = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", {
	fatal: !0,
	ignoreBOM: !0
});
/* c8 ignore start */
Nx && Nx.decode(/* @__PURE__ */ new Uint8Array()).length === 1 && (Nx = null);
/* c8 ignore next */
var Px = (e, t) => ex(t, () => e).join(""), Fx = class {
	constructor() {
		this.cpos = 0, this.cbuf = /* @__PURE__ */ new Uint8Array(100), this.bufs = [];
	}
}, Ix = () => new Fx(), Lx = (e) => {
	let t = Ix();
	return e(t), zx(t);
}, Rx = (e) => {
	let t = e.cpos;
	for (let n = 0; n < e.bufs.length; n++) t += e.bufs[n].length;
	return t;
}, zx = (e) => {
	let t = new Uint8Array(Rx(e)), n = 0;
	for (let r = 0; r < e.bufs.length; r++) {
		let i = e.bufs[r];
		t.set(i, n), n += i.length;
	}
	return t.set(new Uint8Array(e.cbuf.buffer, 0, e.cpos), n), t;
}, Bx = (e, t) => {
	let n = e.cbuf.length;
	n - e.cpos < t && (e.bufs.push(new Uint8Array(e.cbuf.buffer, 0, e.cpos)), e.cbuf = new Uint8Array(ox(n, t) * 2), e.cpos = 0);
}, Vx = (e, t) => {
	let n = e.cbuf.length;
	e.cpos === n && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(n * 2), e.cpos = 0), e.cbuf[e.cpos++] = t;
}, Hx = Vx, G = (e, t) => {
	for (; t > 127;) Vx(e, 128 | 127 & t), t = rx(t / 128);
	Vx(e, 127 & t);
}, Ux = (e, t) => {
	let n = sx(t);
	for (n && (t = -t), Vx(e, (t > 63 ? 128 : 0) | (n ? 64 : 0) | 63 & t), t = rx(t / 64); t > 0;) Vx(e, (t > 127 ? 128 : 0) | 127 & t), t = rx(t / 128);
}, Wx = /* @__PURE__ */ new Uint8Array(3e4), Gx = Wx.length / 3, Kx = jx && jx.encodeInto ? (e, t) => {
	if (t.length < Gx) {
		/* c8 ignore next */
		let n = jx.encodeInto(t, Wx).written || 0;
		G(e, n);
		for (let t = 0; t < n; t++) Vx(e, Wx[t]);
	} else Jx(e, Mx(t));
} : (e, t) => {
	let n = unescape(encodeURIComponent(t)), r = n.length;
	G(e, r);
	for (let t = 0; t < r; t++) Vx(e, n.codePointAt(t));
}, qx = (e, t) => {
	let n = e.cbuf.length, r = e.cpos, i = ax(n - r, t.length), a = t.length - i;
	e.cbuf.set(t.subarray(0, i), r), e.cpos += i, a > 0 && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(ox(n * 2, a)), e.cbuf.set(t.subarray(i)), e.cpos = a);
}, Jx = (e, t) => {
	G(e, t.byteLength), qx(e, t);
}, Yx = (e, t) => {
	Bx(e, t);
	let n = new DataView(e.cbuf.buffer, e.cpos, t);
	return e.cpos += t, n;
}, Xx = (e, t) => Yx(e, 4).setFloat32(0, t, !1), Zx = (e, t) => Yx(e, 8).setFloat64(0, t, !1), Qx = (e, t) => Yx(e, 8).setBigInt64(0, t, !1), $x = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4)), eS = (e) => ($x.setFloat32(0, e), $x.getFloat32(0) === e), tS = (e, t) => {
	switch (typeof t) {
		case "string":
			Vx(e, 119), Kx(e, t);
			break;
		case "number":
			Cx(t) && ix(t) <= 2147483647 ? (Vx(e, 125), Ux(e, t)) : eS(t) ? (Vx(e, 124), Xx(e, t)) : (Vx(e, 123), Zx(e, t));
			break;
		case "bigint":
			Vx(e, 122), Qx(e, t);
			break;
		case "object":
			if (t === null) Vx(e, 126);
			else if (tx(t)) {
				Vx(e, 117), G(e, t.length);
				for (let n = 0; n < t.length; n++) tS(e, t[n]);
			} else if (t instanceof Uint8Array) Vx(e, 116), Jx(e, t);
			else {
				Vx(e, 118);
				let n = Object.keys(t);
				G(e, n.length);
				for (let r = 0; r < n.length; r++) {
					let i = n[r];
					Kx(e, i), tS(e, t[i]);
				}
			}
			break;
		case "boolean":
			Vx(e, t ? 120 : 121);
			break;
		default: Vx(e, 127);
	}
}, nS = class extends Fx {
	constructor(e) {
		super(), this.w = e, this.s = null, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (this.count > 0 && G(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
	}
}, rS = (e) => {
	e.count > 0 && (Ux(e.encoder, e.count === 1 ? e.s : -e.s), e.count > 1 && G(e.encoder, e.count - 2));
}, iS = class {
	constructor() {
		this.encoder = new Fx(), this.s = 0, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (rS(this), this.count = 1, this.s = e);
	}
	toUint8Array() {
		return rS(this), zx(this.encoder);
	}
}, aS = (e) => {
	if (e.count > 0) {
		let t = e.diff * 2 + (e.count === 1 ? 0 : 1);
		Ux(e.encoder, t), e.count > 1 && G(e.encoder, e.count - 2);
	}
}, oS = class {
	constructor() {
		this.encoder = new Fx(), this.s = 0, this.count = 0, this.diff = 0;
	}
	write(e) {
		this.diff === e - this.s ? (this.s = e, this.count++) : (aS(this), this.count = 1, this.diff = e - this.s, this.s = e);
	}
	toUint8Array() {
		return aS(this), zx(this.encoder);
	}
}, sS = class {
	constructor() {
		this.sarr = [], this.s = "", this.lensE = new iS();
	}
	write(e) {
		this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
	}
	toUint8Array() {
		let e = new Fx();
		return this.sarr.push(this.s), this.s = "", Kx(e, this.sarr.join("")), qx(e, this.lensE.toUint8Array()), zx(e);
	}
}, cS = (e) => Error(e), lS = () => {
	throw cS("Method unimplemented");
}, uS = () => {
	throw cS("Unexpected case");
}, dS = cS("Unexpected end of array"), fS = cS("Integer out of Range"), pS = class {
	constructor(e) {
		this.arr = e, this.pos = 0;
	}
}, mS = (e) => new pS(e), hS = (e) => e.pos !== e.arr.length, gS = (e, t) => {
	let n = new Uint8Array(e.arr.buffer, e.pos + e.arr.byteOffset, t);
	return e.pos += t, n;
}, _S = (e) => gS(e, K(e)), vS = (e) => e.arr[e.pos++], K = (e) => {
	let t = 0, n = 1, r = e.arr.length;
	for (; e.pos < r;) {
		let r = e.arr[e.pos++];
		if (t += (r & 127) * n, n *= 128, r < 128) return t;
		/* c8 ignore start */
		if (t > xx) throw fS;
	}
	throw dS;
}, yS = (e) => {
	let t = e.arr[e.pos++], n = t & 63, r = 64, i = (t & 64) > 0 ? -1 : 1;
	if (!(t & 128)) return i * n;
	let a = e.arr.length;
	for (; e.pos < a;) {
		if (t = e.arr[e.pos++], n += (t & 127) * r, r *= 128, t < 128) return i * n;
		/* c8 ignore start */
		if (n > xx) throw fS;
	}
	throw dS;
}, bS = Nx ? (e) => Nx.decode(_S(e)) : (e) => {
	let t = K(e);
	if (t === 0) return "";
	{
		let n = String.fromCodePoint(vS(e));
		if (--t < 100) for (; t--;) n += String.fromCodePoint(vS(e));
		else for (; t > 0;) {
			let r = t < 1e4 ? t : 1e4, i = e.arr.subarray(e.pos, e.pos + r);
			e.pos += r, n += String.fromCodePoint.apply(null, i), t -= r;
		}
		return decodeURIComponent(escape(n));
	}
}, xS = (e, t) => {
	let n = new DataView(e.arr.buffer, e.arr.byteOffset + e.pos, t);
	return e.pos += t, n;
}, SS = [
	(e) => void 0,
	(e) => null,
	yS,
	(e) => xS(e, 4).getFloat32(0, !1),
	(e) => xS(e, 8).getFloat64(0, !1),
	(e) => xS(e, 8).getBigInt64(0, !1),
	(e) => !1,
	(e) => !0,
	bS,
	(e) => {
		let t = K(e), n = {};
		for (let r = 0; r < t; r++) {
			let t = bS(e);
			n[t] = CS(e);
		}
		return n;
	},
	(e) => {
		let t = K(e), n = [];
		for (let r = 0; r < t; r++) n.push(CS(e));
		return n;
	},
	_S
], CS = (e) => SS[127 - vS(e)](e), wS = class extends pS {
	constructor(e, t) {
		super(e), this.reader = t, this.s = null, this.count = 0;
	}
	read() {
		return this.count === 0 && (this.s = this.reader(this), hS(this) ? this.count = K(this) + 1 : this.count = -1), this.count--, this.s;
	}
}, TS = class extends pS {
	constructor(e) {
		super(e), this.s = 0, this.count = 0;
	}
	read() {
		if (this.count === 0) {
			this.s = yS(this);
			let e = sx(this.s);
			this.count = 1, e && (this.s = -this.s, this.count = K(this) + 2);
		}
		return this.count--, this.s;
	}
}, ES = class extends pS {
	constructor(e) {
		super(e), this.s = 0, this.count = 0, this.diff = 0;
	}
	read() {
		if (this.count === 0) {
			let e = yS(this), t = e & 1;
			this.diff = rx(e / 2), this.count = 1, t && (this.count = K(this) + 2);
		}
		return this.s += this.diff, this.count--, this.s;
	}
}, DS = class {
	constructor(e) {
		this.decoder = new TS(e), this.str = bS(this.decoder), this.spos = 0;
	}
	read() {
		let e = this.spos + this.decoder.read(), t = this.str.slice(this.spos, e);
		return this.spos = e, t;
	}
};
crypto.subtle;
var OS = crypto.getRandomValues.bind(crypto), kS = Math.random, AS = () => OS(/* @__PURE__ */ new Uint32Array(1))[0], jS = (e) => e[rx(kS() * e.length)], MS = "10000000-1000-4000-8000-100000000000", NS = () => MS.replace(/[018]/g, (e) => (e ^ AS() & 15 >> e / 4).toString(16)), PS = Date.now, FS = (e) => new Promise(e);
Promise.all.bind(Promise);
var IS = (e) => e === void 0 ? null : e, LS = new class {
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
	typeof localStorage < "u" && localStorage && (LS = localStorage);
} catch {}
/* c8 ignore stop */
/* c8 ignore next */
var RS = LS, zS = Symbol("Equality"), BS = (e, t) => e === t || !!e?.[zS]?.(t) || !1, VS = (e) => typeof e == "object", HS = Object.assign, US = Object.keys, WS = (e, t) => {
	for (let n in e) t(e[n], n);
}, GS = (e) => US(e).length, KS = (e) => {
	for (let t in e) return !1;
	return !0;
}, qS = (e, t) => {
	for (let n in e) if (!t(e[n], n)) return !1;
	return !0;
}, JS = (e, t) => Object.prototype.hasOwnProperty.call(e, t), YS = (e, t) => e === t || GS(e) === GS(t) && qS(e, (e, n) => (e !== void 0 || JS(t, n)) && BS(t[n], e)), XS = Object.freeze, ZS = (e) => {
	for (let t in e) {
		let n = e[t];
		(typeof n == "object" || typeof n == "function") && ZS(e[t]);
	}
	return XS(e);
}, QS = (e, t, n = 0) => {
	try {
		for (; n < e.length; n++) e[n](...t);
	} finally {
		n < e.length && QS(e, t, n + 1);
	}
}, $S = (e, t) => {
	if (e === t) return !0;
	if (e == null || t == null || e.constructor !== t.constructor && (e.constructor || Object) !== (t.constructor || Object)) return !1;
	if (e[zS] != null) return e[zS](t);
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
			for (let n of e.keys()) if (!t.has(n) || !$S(e.get(n), t.get(n))) return !1;
			break;
		case void 0:
		case Object:
			if (GS(e) !== GS(t)) return !1;
			for (let n in e) if (!JS(e, n) || !$S(e[n], t[n])) return !1;
			break;
		case Array:
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; n++) if (!$S(e[n], t[n])) return !1;
			break;
		default: return !1;
	}
	return !0;
}, eC = (e, t) => t.includes(e), tC = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", nC = typeof window < "u" && typeof document < "u" && !tC;
typeof navigator < "u" && /Mac/.test(navigator.platform);
var rC, iC = [], aC = () => {
	if (rC === void 0) if (tC) {
		rC = Ub();
		let e = process.argv, t = null;
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			r[0] === "-" ? (t !== null && rC.set(t, ""), t = r) : t === null ? iC.push(r) : (rC.set(t, r), t = null);
		}
		t !== null && rC.set(t, "");
	} else typeof location == "object" ? (rC = Ub(), (location.search || "?").slice(1).split("&").forEach((e) => {
		if (e.length !== 0) {
			let [t, n] = e.split("=");
			rC.set(`--${kx(t, "-")}`, n), rC.set(`-${kx(t, "-")}`, n);
		}
	})) : rC = Ub();
	return rC;
}, oC = (e) => aC().has(e), sC = (e) => IS(tC ? process.env[e.toUpperCase().replaceAll("-", "_")] : RS.getItem(e)), cC = (e) => oC("--" + e) || sC(e) !== null, lC = cC("production"), uC = tC && eC(process.env.FORCE_COLOR, [
	"true",
	"1",
	"2"
]) || !oC("--no-colors") && !cC("no-color") && (!tC || process.stdout.isTTY) && (!tC || oC("--color") || sC("COLORTERM") !== null || (sC("TERM") || "").includes("color")), dC = nC ? (e) => {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += wx(e[n]);
	return btoa(t);
} : (e) => Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString("base64"), fC = (e) => Lx((t) => tS(t, e)), pC = class {
	constructor(e, t) {
		this.left = e, this.right = t;
	}
}, mC = (e, t) => new pC(e, t), hC = (e) => e.next() >= .5, gC = (e, t, n) => rx(e.next() * (n + 1 - t) + t), _C = (e, t, n) => rx(e.next() * (n + 1 - t) + t), vC = (e, t, n) => _C(e, t, n), yC = (e) => wx(vC(e, 97, 122)), bC = (e, t = 0, n = 20) => {
	let r = vC(e, t, n), i = "";
	for (let t = 0; t < r; t++) i += yC(e);
	return i;
}, xC = (e, t) => t[vC(e, 0, t.length - 1)], SC = Symbol("0schema"), CC = class {
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
			e.push(Px(" ", (this._rerrs.length - t) * 2) + `${n.path == null ? "" : `[${n.path}] `}${n.has} doesn't match ${n.expected}. ${n.message}`);
		}
		return e.join("\n");
	}
}, wC = (e, t) => e === t ? !0 : e == null || t == null || e.constructor !== t.constructor ? !1 : e[zS] ? BS(e, t) : tx(e) ? Qb(e, (e) => $b(t, (t) => wC(e, t))) : VS(e) ? qS(e, (e, n) => wC(e, t[n])) : !1, TC = class {
	static _dilutes = !1;
	extends(e) {
		let [t, n] = [this.shape, e.shape];
		return this.constructor._dilutes && ([n, t] = [t, n]), wC(t, n);
	}
	equals(e) {
		return this.constructor === e.constructor && $S(this.shape, e.shape);
	}
	[SC]() {
		return !0;
	}
	[zS](e) {
		return this.equals(e);
	}
	validate(e) {
		return this.check(e);
	}
	/* c8 ignore start */
	check(e, t) {
		lS();
	}
	/* c8 ignore stop */
	get nullable() {
		return iw(this, yw);
	}
	get optional() {
		return new IC(this);
	}
	cast(e) {
		return Cw(e, this), e;
	}
	expect(e) {
		return Cw(e, this), e;
	}
}, EC = class extends TC {
	constructor(e, t) {
		super(), this.shape = e, this._c = t;
	}
	check(e, t = void 0) {
		let n = e?.constructor === this.shape && (this._c == null || this._c(e));
		return !n && t?.extend(null, this.shape.name, e?.constructor.name, e?.constructor === this.shape ? "Check failed" : "Constructor match failed"), n;
	}
}, DC = (e, t = null) => new EC(e, t);
DC(EC);
var OC = class extends TC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = this.shape(e);
		return !n && t?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), n;
	}
}, kC = (e) => new OC(e);
DC(OC);
var AC = class extends TC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = this.shape.some((t) => t === e);
		return !n && t?.extend(null, this.shape.join(" | "), e.toString()), n;
	}
}, jC = (...e) => new AC(e), MC = DC(AC), NC = RegExp.escape || ((e) => e.replace(/[().|&,$^[\]]/g, (e) => "\\" + e)), PC = (e) => {
	if (mw.check(e)) return [NC(e)];
	if (MC.check(e)) return e.shape.map((e) => e + "");
	if (pw.check(e)) return ["[+-]?\\d+.?\\d*"];
	if (hw.check(e)) return [".*"];
	if (aw.check(e)) return e.shape.map(PC).flat(1);
	/* c8 ignore next 2 */
	uS();
};
DC(class extends TC {
	constructor(e) {
		super(), this.shape = e, this._r = RegExp("^" + e.map(PC).map((e) => `(${e.join("|")})`).join("") + "$");
	}
	check(e, t) {
		let n = this._r.exec(e) != null;
		return !n && t?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), n;
	}
});
var FC = Symbol("optional"), IC = class extends TC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = e === void 0 || this.shape.check(e);
		return !n && t?.extend(null, "undefined (optional)", "()"), n;
	}
	get [FC]() {
		return !0;
	}
}, LC = DC(IC), RC = class extends TC {
	check(e, t) {
		return t?.extend(null, "never", typeof e), !1;
	}
};
new RC(), DC(RC);
var zC = class e extends TC {
	constructor(e, t = !1) {
		super(), this.shape = e, this._isPartial = t;
	}
	static _dilutes = !0;
	get partial() {
		return new e(this.shape, !0);
	}
	check(e, t) {
		return e == null ? (t?.extend(null, "object", "null"), !1) : qS(this.shape, (n, r) => {
			let i = this._isPartial && !JS(e, r) || n.check(e[r], t);
			return !i && t?.extend(r.toString(), n.toString(), typeof e[r], "Object property does not match"), i;
		});
	}
}, BC = (e) => new zC(e), VC = DC(zC), HC = kC((e) => e != null && (e.constructor === Object || e.constructor == null)), UC = class extends TC {
	constructor(e, t) {
		super(), this.shape = {
			keys: e,
			values: t
		};
	}
	check(e, t) {
		return e != null && qS(e, (n, r) => {
			let i = this.shape.keys.check(r, t);
			return !i && t?.extend(r + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(n, t);
		});
	}
}, WC = (e, t) => new UC(e, t), GC = DC(UC), KC = class extends TC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		return e != null && qS(this.shape, (n, r) => {
			let i = n.check(e[r], t);
			return !i && t?.extend(r.toString(), "Tuple", typeof n), i;
		});
	}
}, qC = (...e) => new KC(e);
DC(KC);
var JC = class extends TC {
	constructor(e) {
		super(), this.shape = e.length === 1 ? e[0] : new rw(e);
	}
	check(e, t) {
		let n = tx(e) && Qb(e, (e) => this.shape.check(e));
		return !n && t?.extend(null, "Array", ""), n;
	}
}, YC = (...e) => new JC(e), XC = DC(JC), ZC = kC((e) => tx(e)), QC = class extends TC {
	constructor(e, t) {
		super(), this.shape = e, this._c = t;
	}
	check(e, t) {
		let n = e instanceof this.shape && (this._c == null || this._c(e));
		return !n && t?.extend(null, this.shape.name, e?.constructor.name), n;
	}
}, $C = (e, t = null) => new QC(e, t);
DC(QC);
var ew = $C(TC), tw = DC(class extends TC {
	constructor(e) {
		super(), this.len = e.length - 1, this.args = qC(...e.slice(-1)), this.res = e[this.len];
	}
	check(e, t) {
		let n = e.constructor === Function && e.length <= this.len;
		return !n && t?.extend(null, "function", typeof e), n;
	}
}), nw = kC((e) => typeof e == "function");
DC(class extends TC {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = Qb(this.shape, (n) => n.check(e, t));
		return !n && t?.extend(null, "Intersectinon", typeof e), n;
	}
}, (e) => e.shape.length > 0);
var rw = class extends TC {
	static _dilutes = !0;
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = $b(this.shape, (n) => n.check(e, t));
		return t?.extend(null, "Union", typeof e), n;
	}
}, iw = (...e) => e.findIndex((e) => aw.check(e)) >= 0 ? iw(...e.map((e) => Sw(e)).map((e) => aw.check(e) ? e.shape : [e]).flat(1)) : e.length === 1 ? e[0] : new rw(e), aw = DC(rw), ow = () => !0, sw = kC(ow), cw = DC(OC, (e) => e.shape === ow), lw = kC((e) => typeof e == "bigint"), uw = kC((e) => e === lw), dw = kC((e) => typeof e == "symbol");
kC((e) => e === dw);
var fw = kC((e) => typeof e == "number"), pw = kC((e) => e === fw), mw = kC((e) => typeof e == "string"), hw = kC((e) => e === mw), gw = kC((e) => typeof e == "boolean"), _w = kC((e) => e === gw), vw = jC(void 0);
DC(AC, (e) => e.shape.length === 1 && e.shape[0] === void 0), jC(void 0);
var yw = jC(null), bw = DC(AC, (e) => e.shape.length === 1 && e.shape[0] === null);
DC(Uint8Array), DC(EC, (e) => e.shape === Uint8Array);
var xw = iw(fw, mw, yw, vw, lw, gw, dw);
(() => {
	let e = YC(sw), t = WC(mw, sw), n = iw(fw, mw, yw, gw, e, t);
	return e.shape = n, t.shape.values = n, n;
})();
var Sw = (e) => {
	if (ew.check(e)) return e;
	if (HC.check(e)) {
		let t = {};
		for (let n in e) t[n] = Sw(e[n]);
		return BC(t);
	} else if (ZC.check(e)) return iw(...e.map(Sw));
	else if (xw.check(e)) return jC(e);
	else if (nw.check(e)) return DC(e);
	/* c8 ignore next */
	uS();
}, Cw = lC ? () => {} : (e, t) => {
	let n = new CC();
	if (!t.check(e, n)) throw cS(`Expected value to be of type ${t.constructor.name}.\n${n.toString()}`);
}, ww = class {
	constructor(e) {
		this.patterns = [], this.$state = e;
	}
	if(e, t) {
		return this.patterns.push({
			if: Sw(e),
			h: t
		}), this;
	}
	else(e) {
		return this.if(sw, e);
	}
	done() {
		return (e, t) => {
			for (let n = 0; n < this.patterns.length; n++) {
				let r = this.patterns[n];
				if (r.if.check(e)) return r.h(e, t);
			}
			throw cS("Unhandled pattern");
		};
	}
}, Tw = ((e) => new ww(e))(sw).if(pw, (e, t) => gC(t, Sx, xx)).if(hw, (e, t) => bC(t)).if(_w, (e, t) => hC(t)).if(uw, (e, t) => BigInt(gC(t, Sx, xx))).if(aw, (e, t) => Ew(t, xC(t, e.shape))).if(VC, (e, t) => {
	let n = {};
	for (let r in e.shape) {
		let i = e.shape[r];
		if (LC.check(i)) {
			if (hC(t)) continue;
			i = i.shape;
		}
		n[r] = Tw(i, t);
	}
	return n;
}).if(XC, (e, t) => {
	let n = [], r = _C(t, 0, 42);
	for (let i = 0; i < r; i++) n.push(Ew(t, e.shape));
	return n;
}).if(MC, (e, t) => xC(t, e.shape)).if(bw, (e, t) => null).if(tw, (e, t) => {
	let n = Ew(t, e.res);
	return () => n;
}).if(cw, (e, t) => Ew(t, xC(t, [
	fw,
	mw,
	yw,
	vw,
	lw,
	gw,
	YC(fw),
	WC(iw("a", "b", "c"), fw)
]))).if(GC, (e, t) => {
	let n = {}, r = gC(t, 0, 3);
	for (let i = 0; i < r; i++) {
		let r = Ew(t, e.shape.keys);
		n[r] = Ew(t, e.shape.values);
	}
	return n;
}).done(), Ew = (e, t) => Tw(Sw(t), e), Dw = typeof document < "u" ? document : {};
kC((e) => e.nodeType === Mw), typeof DOMParser < "u" && new DOMParser(), kC((e) => e.nodeType === kw), kC((e) => e.nodeType === Aw);
var Ow = (e) => Kb(e, (e, t) => `${t}:${e};`).join(""), kw = Dw.ELEMENT_NODE, Aw = Dw.TEXT_NODE;
Dw.CDATA_SECTION_NODE, Dw.COMMENT_NODE;
var jw = Dw.DOCUMENT_NODE;
Dw.DOCUMENT_TYPE_NODE;
var Mw = Dw.DOCUMENT_FRAGMENT_NODE;
kC((e) => e.nodeType === jw);
/* c8 ignore stop */
//#endregion
//#region node_modules/lib0/json.js
var Nw = ((e) => class {
	constructor(e) {
		this._ = e;
	}
	destroy() {
		e(this._);
	}
})(clearTimeout), Pw = (e, t) => new Nw(setTimeout(t, e)), Fw = Symbol, Iw = Fw(), Lw = Fw(), Rw = Fw(), zw = Fw(), Bw = Fw(), Vw = Fw(), Hw = Fw(), Uw = Fw(), Ww = Fw(), Gw = (e) => {
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
PS();
var Kw = {
	[Iw]: mC("font-weight", "bold"),
	[Lw]: mC("font-weight", "normal"),
	[Rw]: mC("color", "blue"),
	[Bw]: mC("color", "green"),
	[zw]: mC("color", "grey"),
	[Vw]: mC("color", "red"),
	[Hw]: mC("color", "purple"),
	[Uw]: mC("color", "orange"),
	[Ww]: mC("color", "black")
}, qw = uC ? (e) => {
	e.length === 1 && e[0]?.constructor === Function && (e = e[0]());
	let t = [], n = [], r = Ub(), i = [], a = 0;
	for (; a < e.length; a++) {
		let i = e[a], o = Kw[i];
		if (o !== void 0) r.set(o.left, o.right);
		else {
			if (i === void 0) break;
			if (i.constructor === String || i.constructor === Number) {
				let e = Ow(r);
				a > 0 || e.length > 0 ? (t.push("%c" + i), n.push(e)) : t.push(i);
			} else break;
		}
	}
	for (a > 0 && (i = n, i.unshift(t.join(""))); a < e.length; a++) {
		let t = e[a];
		t instanceof Symbol || i.push(t);
	}
	return i;
} : Gw, Jw = (...e) => {
	/* c8 ignore next */
	console.log(...qw(e)), Xw.forEach((t) => t.print(e));
}, Yw = (...e) => {
	console.warn(...qw(e)), e.unshift(Uw), Xw.forEach((t) => t.print(e));
}, Xw = Jb(), Zw = (e) => ({
	[Symbol.iterator]() {
		return this;
	},
	next: e
}), Qw = (e, t) => Zw(() => {
	let n;
	do
		n = e.next();
	while (!n.done && !t(n.value));
	return n;
}), $w = (e, t) => Zw(() => {
	let { done: n, value: r } = e.next();
	return {
		done: n,
		value: n ? void 0 : t(r)
	};
}), eT = class {
	constructor(e, t) {
		this.clock = e, this.len = t;
	}
}, tT = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map();
	}
}, nT = (e, t, n) => t.clients.forEach((t, r) => {
	let i = e.doc.store.clients.get(r);
	if (i != null) {
		let r = i[i.length - 1], a = r.id.clock + r.length;
		for (let r = 0, o = t[r]; r < t.length && o.clock < a; o = t[++r]) aE(e, i, o.clock, o.len, n);
	}
}), rT = (e, t) => {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = rx((n + r) / 2), a = e[i], o = a.clock;
		if (o <= t) {
			if (t < o + a.len) return i;
			n = i + 1;
		} else r = i - 1;
	}
	return null;
}, iT = (e, t) => {
	let n = e.clients.get(t.client);
	return n !== void 0 && rT(n, t.clock) !== null;
}, aT = (e) => {
	e.clients.forEach((e) => {
		e.sort((e, t) => e.clock - t.clock);
		let t, n;
		for (t = 1, n = 1; t < e.length; t++) {
			let r = e[n - 1], i = e[t];
			r.clock + r.len >= i.clock ? e[n - 1] = new eT(r.clock, ox(r.len, i.clock + i.len - r.clock)) : (n < t && (e[n] = i), n++);
		}
		e.length = n;
	});
}, oT = (e) => {
	let t = new tT();
	for (let n = 0; n < e.length; n++) e[n].clients.forEach((r, i) => {
		if (!t.clients.has(i)) {
			let a = r.slice();
			for (let t = n + 1; t < e.length; t++) Xb(a, e[t].clients.get(i) || []);
			t.clients.set(i, a);
		}
	});
	return aT(t), t;
}, sT = (e, t, n, r) => {
	Gb(e.clients, t, () => []).push(new eT(n, r));
}, cT = () => new tT(), lT = (e) => {
	let t = cT();
	return e.clients.forEach((e, n) => {
		let r = [];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (n.deleted) {
				let i = n.id.clock, a = n.length;
				if (t + 1 < e.length) for (let n = e[t + 1]; t + 1 < e.length && n.deleted; n = e[++t + 1]) a += n.length;
				r.push(new eT(i, a));
			}
		}
		r.length > 0 && t.clients.set(n, r);
	}), t;
}, uT = (e, t) => {
	G(e.restEncoder, t.clients.size), Zb(t.clients.entries()).sort((e, t) => t[0] - e[0]).forEach(([t, n]) => {
		e.resetDsCurVal(), G(e.restEncoder, t);
		let r = n.length;
		G(e.restEncoder, r);
		for (let t = 0; t < r; t++) {
			let r = n[t];
			e.writeDsClock(r.clock), e.writeDsLen(r.len);
		}
	});
}, dT = (e) => {
	let t = new tT(), n = K(e.restDecoder);
	for (let r = 0; r < n; r++) {
		e.resetDsCurVal();
		let n = K(e.restDecoder), r = K(e.restDecoder);
		if (r > 0) {
			let i = Gb(t.clients, n, () => []);
			for (let t = 0; t < r; t++) i.push(new eT(e.readDsClock(), e.readDsLen()));
		}
	}
	return t;
}, fT = (e, t, n) => {
	let r = new tT(), i = K(e.restDecoder);
	for (let a = 0; a < i; a++) {
		e.resetDsCurVal();
		let i = K(e.restDecoder), a = K(e.restDecoder), o = n.clients.get(i) || [], s = ZT(n, i);
		for (let n = 0; n < a; n++) {
			let n = e.readDsClock(), a = n + e.readDsLen();
			if (n < s) {
				s < a && sT(r, i, s, a - s);
				let e = $T(o, n), c = o[e];
				for (!c.deleted && c.id.clock < n && (o.splice(e + 1, 0, _O(t, c, n - c.id.clock)), e++); e < o.length && (c = o[e++], c.id.clock < a);) c.deleted || (a < c.id.clock + c.length && o.splice(e, 0, _O(t, c, a - c.id.clock)), c.delete(t));
			} else sT(r, i, n, a - n);
		}
	}
	if (r.clients.size > 0) {
		let e = new bT();
		return G(e.restEncoder, 0), uT(e, r), e.toUint8Array();
	}
	return null;
}, pT = AS, mT = class e extends nx {
	constructor({ guid: e = NS(), collectionid: t = null, gc: n = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: a = !1, shouldLoad: o = !0 } = {}) {
		super(), this.gc = n, this.gcFilter = r, this.clientID = pT(), this.guid = e, this.collectionid = t, this.share = /* @__PURE__ */ new Map(), this.store = new YT(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = o, this.autoLoad = a, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = FS((e) => {
			this.on("load", () => {
				this.isLoaded = !0, e(this);
			});
		});
		let s = () => FS((e) => {
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
		return new Set(Zb(this.subdocs).map((e) => e.guid));
	}
	transact(e, t = null) {
		return J(this, e, t);
	}
	get(e, t = RE) {
		let n = Gb(this.share, e, () => {
			let e = new t();
			return e._integrate(this, null), e;
		}), r = n.constructor;
		if (t !== RE && r !== t) if (r === RE) {
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
		return this.get(e, aD);
	}
	getText(e = "") {
		return this.get(e, ED);
	}
	getMap(e = "") {
		return this.get(e, cD);
	}
	getXmlElement(e = "") {
		return this.get(e, jD);
	}
	getXmlFragment(e = "") {
		return this.get(e, kD);
	}
	toJSON() {
		let e = {};
		return this.share.forEach((t, n) => {
			e[n] = t.toJSON();
		}), e;
	}
	destroy() {
		this.isDestroyed = !0, Zb(this.subdocs).forEach((e) => e.destroy());
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
}, hT = class {
	constructor(e) {
		this.dsCurrVal = 0, this.restDecoder = e;
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	readDsClock() {
		return this.dsCurrVal += K(this.restDecoder), this.dsCurrVal;
	}
	readDsLen() {
		let e = K(this.restDecoder) + 1;
		return this.dsCurrVal += e, e;
	}
}, gT = class extends hT {
	constructor(e) {
		super(e), this.keys = [], K(e), this.keyClockDecoder = new ES(_S(e)), this.clientDecoder = new TS(_S(e)), this.leftClockDecoder = new ES(_S(e)), this.rightClockDecoder = new ES(_S(e)), this.infoDecoder = new wS(_S(e), vS), this.stringDecoder = new DS(_S(e)), this.parentInfoDecoder = new wS(_S(e), vS), this.typeRefDecoder = new TS(_S(e)), this.lenDecoder = new TS(_S(e));
	}
	readLeftID() {
		return new NT(this.clientDecoder.read(), this.leftClockDecoder.read());
	}
	readRightID() {
		return new NT(this.clientDecoder.read(), this.rightClockDecoder.read());
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
		return CS(this.restDecoder);
	}
	readBuf() {
		return _S(this.restDecoder);
	}
	readJSON() {
		return CS(this.restDecoder);
	}
	readKey() {
		let e = this.keyClockDecoder.read();
		if (e < this.keys.length) return this.keys[e];
		{
			let e = this.stringDecoder.read();
			return this.keys.push(e), e;
		}
	}
}, _T = class {
	constructor() {
		this.restEncoder = Ix();
	}
	toUint8Array() {
		return zx(this.restEncoder);
	}
	resetDsCurVal() {}
	writeDsClock(e) {
		G(this.restEncoder, e);
	}
	writeDsLen(e) {
		G(this.restEncoder, e);
	}
}, vT = class extends _T {
	writeLeftID(e) {
		G(this.restEncoder, e.client), G(this.restEncoder, e.clock);
	}
	writeRightID(e) {
		G(this.restEncoder, e.client), G(this.restEncoder, e.clock);
	}
	writeClient(e) {
		G(this.restEncoder, e);
	}
	writeInfo(e) {
		Hx(this.restEncoder, e);
	}
	writeString(e) {
		Kx(this.restEncoder, e);
	}
	writeParentInfo(e) {
		G(this.restEncoder, +!!e);
	}
	writeTypeRef(e) {
		G(this.restEncoder, e);
	}
	writeLen(e) {
		G(this.restEncoder, e);
	}
	writeAny(e) {
		tS(this.restEncoder, e);
	}
	writeBuf(e) {
		Jx(this.restEncoder, e);
	}
	writeJSON(e) {
		Kx(this.restEncoder, JSON.stringify(e));
	}
	writeKey(e) {
		Kx(this.restEncoder, e);
	}
}, yT = class {
	constructor() {
		this.restEncoder = Ix(), this.dsCurrVal = 0;
	}
	toUint8Array() {
		return zx(this.restEncoder);
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	writeDsClock(e) {
		let t = e - this.dsCurrVal;
		this.dsCurrVal = e, G(this.restEncoder, t);
	}
	writeDsLen(e) {
		e === 0 && uS(), G(this.restEncoder, e - 1), this.dsCurrVal += e;
	}
}, bT = class extends yT {
	constructor() {
		super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new oS(), this.clientEncoder = new iS(), this.leftClockEncoder = new oS(), this.rightClockEncoder = new oS(), this.infoEncoder = new nS(Hx), this.stringEncoder = new sS(), this.parentInfoEncoder = new nS(Hx), this.typeRefEncoder = new iS(), this.lenEncoder = new iS();
	}
	toUint8Array() {
		let e = Ix();
		return G(e, 0), Jx(e, this.keyClockEncoder.toUint8Array()), Jx(e, this.clientEncoder.toUint8Array()), Jx(e, this.leftClockEncoder.toUint8Array()), Jx(e, this.rightClockEncoder.toUint8Array()), Jx(e, zx(this.infoEncoder)), Jx(e, this.stringEncoder.toUint8Array()), Jx(e, zx(this.parentInfoEncoder)), Jx(e, this.typeRefEncoder.toUint8Array()), Jx(e, this.lenEncoder.toUint8Array()), qx(e, zx(this.restEncoder)), zx(e);
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
		tS(this.restEncoder, e);
	}
	writeBuf(e) {
		Jx(this.restEncoder, e);
	}
	writeJSON(e) {
		tS(this.restEncoder, e);
	}
	writeKey(e) {
		let t = this.keyMap.get(e);
		t === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(t);
	}
}, xT = (e, t, n, r) => {
	r = ox(r, t[0].id.clock);
	let i = $T(t, r);
	G(e.restEncoder, t.length - i), e.writeClient(n), G(e.restEncoder, r);
	let a = t[i];
	a.write(e, r - a.id.clock);
	for (let n = i + 1; n < t.length; n++) t[n].write(e, 0);
}, ST = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	n.forEach((e, n) => {
		ZT(t, n) > e && r.set(n, e);
	}), XT(t).forEach((e, t) => {
		n.has(t) || r.set(t, 0);
	}), G(e.restEncoder, r.size), Zb(r.entries()).sort((e, t) => t[0] - e[0]).forEach(([n, r]) => {
		xT(e, t.clients.get(n), n, r);
	});
}, CT = (e, t) => {
	let n = Ub(), r = K(e.restDecoder);
	for (let i = 0; i < r; i++) {
		let r = K(e.restDecoder), i = Array(r), a = e.readClient(), o = K(e.restDecoder);
		n.set(a, {
			i: 0,
			refs: i
		});
		for (let n = 0; n < r; n++) {
			let r = e.readInfo();
			switch (31 & r) {
				case 0: {
					let t = e.readLen();
					i[n] = new BD(q(a, o), t), o += t;
					break;
				}
				case 10: {
					let t = K(e.restDecoder);
					i[n] = new CO(q(a, o), t), o += t;
					break;
				}
				default: {
					let s = (r & 192) == 0, c = new Y(q(a, o), null, (r & 128) == 128 ? e.readLeftID() : null, null, (r & 64) == 64 ? e.readRightID() : null, s ? e.readParentInfo() ? t.get(e.readString()) : e.readLeftID() : null, s && (r & 32) == 32 ? e.readString() : null, bO(e, r));
					i[n] = c, o += c.length;
				}
			}
		}
	}
	return n;
}, wT = (e, t, n) => {
	let r = [], i = Zb(n.keys()).sort((e, t) => e - t);
	if (i.length === 0) return null;
	let a = () => {
		if (i.length === 0) return null;
		let e = n.get(i[i.length - 1]);
		for (; e.refs.length === e.i;) if (i.pop(), i.length > 0) e = n.get(i[i.length - 1]);
		else return null;
		return e;
	}, o = a();
	if (o === null) return null;
	let s = new YT(), c = /* @__PURE__ */ new Map(), l = (e, t) => {
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
		if (u.constructor !== CO) {
			let i = Gb(d, u.id.client, () => ZT(t, u.id.client)) - u.id.clock;
			if (i < 0) r.push(u), l(u.id.client, u.id.clock - 1), f();
			else {
				let a = u.getMissing(e, t);
				if (a !== null) {
					r.push(u);
					let e = n.get(a) || {
						refs: [],
						i: 0
					};
					if (e.refs.length === e.i) l(a, ZT(t, a)), f();
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
		let e = new bT();
		return ST(e, s, /* @__PURE__ */ new Map()), G(e.restEncoder, 0), {
			missing: c,
			update: e.toUint8Array()
		};
	}
	return null;
}, TT = (e, t) => ST(e, t.doc.store, t.beforeState), ET = (e, t, n, r = new gT(e)) => J(t, (e) => {
	e.local = !1;
	let t = !1, n = e.doc, i = n.store, a = wT(e, i, CT(r, n)), o = i.pendingStructs;
	if (o) {
		for (let [e, n] of o.missing) if (n < ZT(i, e)) {
			t = !0;
			break;
		}
		if (a) {
			for (let [e, t] of a.missing) {
				let n = o.missing.get(e);
				(n == null || n > t) && o.missing.set(e, t);
			}
			o.update = xE([o.update, a.update]);
		}
	} else i.pendingStructs = a;
	let s = fT(r, e, i);
	if (i.pendingDs) {
		let t = new gT(mS(i.pendingDs));
		K(t.restDecoder);
		let n = fT(t, e, i);
		s && n ? i.pendingDs = xE([s, n]) : i.pendingDs = s || n;
	} else i.pendingDs = s;
	if (t) {
		let t = i.pendingStructs.update;
		i.pendingStructs = null, DT(e.doc, t);
	}
}, n, !1), DT = (e, t, n, r = gT) => {
	let i = mS(t);
	ET(i, e, n, new r(i));
}, OT = class {
	constructor() {
		this.l = [];
	}
}, kT = () => new OT(), AT = (e, t) => e.l.push(t), jT = (e, t) => {
	let n = e.l, r = n.length;
	e.l = n.filter((e) => t !== e), r === e.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, MT = (e, t, n) => QS(e.l, [t, n]), NT = class {
	constructor(e, t) {
		this.client = e, this.clock = t;
	}
}, PT = (e, t) => e === t || e !== null && t !== null && e.client === t.client && e.clock === t.clock, q = (e, t) => new NT(e, t), FT = (e) => {
	for (let [t, n] of e.doc.share.entries()) if (n === e) return t;
	throw uS();
}, IT = (e, t) => {
	for (; t !== null;) {
		if (t.parent === e) return !0;
		t = t.parent._item;
	}
	return !1;
}, LT = class {
	constructor(e, t, n, r = 0) {
		this.type = e, this.tname = t, this.item = n, this.assoc = r;
	}
}, RT = class {
	constructor(e, t, n = 0) {
		this.type = e, this.index = t, this.assoc = n;
	}
}, zT = (e, t, n = 0) => new RT(e, t, n), BT = (e, t, n) => {
	let r = null, i = null;
	return e._item === null ? i = FT(e) : r = q(e._item.id.client, e._item.id.clock), new LT(r, i, t, n);
}, VT = (e, t, n = 0) => {
	let r = e._start;
	if (n < 0) {
		if (t === 0) return BT(e, null, n);
		t--;
	}
	for (; r !== null;) {
		if (!r.deleted && r.countable) {
			if (r.length > t) return BT(e, q(r.id.client, r.id.clock + t), n);
			t -= r.length;
		}
		if (r.right === null && n < 0) return BT(e, r.lastId, n);
		r = r.right;
	}
	return BT(e, null, n);
}, HT = (e, t) => {
	let n = eE(e, t);
	return {
		item: n,
		diff: t.clock - n.id.clock
	};
}, UT = (e, t, n = !0) => {
	let r = t.store, i = e.item, a = e.type, o = e.tname, s = e.assoc, c = null, l = 0;
	if (i !== null) {
		if (ZT(r, i.client) <= i.clock) return null;
		let e = n ? hO(r, i) : HT(r, i), t = e.item;
		if (!(t instanceof Y)) return null;
		if (c = t.parent, c._item === null || !c._item.deleted) {
			l = t.deleted || !t.countable ? 0 : e.diff + (s >= 0 ? 0 : 1);
			let n = t.left;
			for (; n !== null;) !n.deleted && n.countable && (l += n.length), n = n.left;
		}
	} else {
		if (o !== null) c = t.get(o);
		else if (a !== null) {
			if (ZT(r, a.client) <= a.clock) return null;
			let { item: e } = n ? hO(r, a) : { item: eE(r, a) };
			if (e instanceof Y && e.content instanceof pO) c = e.content.type;
			else return null;
		} else throw uS();
		l = s >= 0 ? c._length : 0;
	}
	return zT(c, l, e.assoc);
}, WT = class {
	constructor(e, t) {
		this.ds = e, this.sv = t;
	}
}, GT = (e, t) => new WT(e, t);
GT(cT(), /* @__PURE__ */ new Map());
var KT = (e) => GT(lT(e.store), XT(e.store)), qT = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && (t.sv.get(e.id.client) || 0) > e.id.clock && !iT(t.ds, e.id), JT = (e, t) => {
	let n = Gb(e.meta, JT, Jb), r = e.doc.store;
	n.has(t) || (t.sv.forEach((t, n) => {
		t < ZT(r, n) && nE(e, q(n, t));
	}), nT(e, t.ds, (e) => {}), n.add(t));
}, YT = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
	}
}, XT = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.clients.forEach((e, n) => {
		let r = e[e.length - 1];
		t.set(n, r.id.clock + r.length);
	}), t;
}, ZT = (e, t) => {
	let n = e.clients.get(t);
	if (n === void 0) return 0;
	let r = n[n.length - 1];
	return r.id.clock + r.length;
}, QT = (e, t) => {
	let n = e.clients.get(t.id.client);
	if (n === void 0) n = [], e.clients.set(t.id.client, n);
	else {
		let e = n[n.length - 1];
		if (e.id.clock + e.length !== t.id.clock) throw uS();
	}
	n.push(t);
}, $T = (e, t) => {
	let n = 0, r = e.length - 1, i = e[r], a = i.id.clock;
	if (a === t) return r;
	let o = rx(t / (a + i.length - 1) * r);
	for (; n <= r;) {
		if (i = e[o], a = i.id.clock, a <= t) {
			if (t < a + i.length) return o;
			n = o + 1;
		} else r = o - 1;
		o = rx((n + r) / 2);
	}
	throw uS();
}, eE = (e, t) => {
	let n = e.clients.get(t.client);
	return n[$T(n, t.clock)];
}, tE = (e, t, n) => {
	let r = $T(t, n), i = t[r];
	return i.id.clock < n && i instanceof Y ? (t.splice(r + 1, 0, _O(e, i, n - i.id.clock)), r + 1) : r;
}, nE = (e, t) => {
	let n = e.doc.store.clients.get(t.client);
	return n[tE(e, n, t.clock)];
}, rE = (e, t, n) => {
	let r = t.clients.get(n.client), i = $T(r, n.clock), a = r[i];
	return n.clock !== a.id.clock + a.length - 1 && a.constructor !== BD && r.splice(i + 1, 0, _O(e, a, n.clock - a.id.clock + 1)), a;
}, iE = (e, t, n) => {
	let r = e.clients.get(t.id.client);
	r[$T(r, t.id.clock)] = n;
}, aE = (e, t, n, r, i) => {
	if (r === 0) return;
	let a = n + r, o = tE(e, t, n), s;
	do
		s = t[o++], a < s.id.clock + s.length && tE(e, t, a), i(s);
	while (o < t.length && t[o].id.clock < a);
}, oE = class {
	constructor(e, t, n) {
		this.doc = e, this.deleteSet = new tT(), this.beforeState = XT(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = t, this.meta = /* @__PURE__ */ new Map(), this.local = n, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
	}
}, sE = (e, t) => t.deleteSet.clients.size === 0 && !qb(t.afterState, (e, n) => t.beforeState.get(n) !== e) ? !1 : (aT(t.deleteSet), TT(e, t), uT(e, t.deleteSet), !0), cE = (e, t, n) => {
	let r = t._item;
	(r === null || r.id.clock < (e.beforeState.get(r.id.client) || 0) && !r.deleted) && Gb(e.changed, t, Jb).add(n);
}, lE = (e, t) => {
	let n = e[t], r = e[t - 1], i = t;
	for (; i > 0; n = r, r = e[--i - 1]) {
		if (r.deleted === n.deleted && r.constructor === n.constructor && r.mergeWith(n)) {
			n instanceof Y && n.parentSub !== null && n.parent._map.get(n.parentSub) === n && n.parent._map.set(n.parentSub, r);
			continue;
		}
		break;
	}
	let a = t - i;
	return a && e.splice(t + 1 - a, a), a;
}, uE = (e, t, n) => {
	for (let [r, i] of e.clients.entries()) {
		let e = t.clients.get(r);
		for (let r = i.length - 1; r >= 0; r--) {
			let a = i[r], o = a.clock + a.len;
			for (let r = $T(e, a.clock), i = e[r]; r < e.length && i.id.clock < o; i = e[++r]) {
				let i = e[r];
				if (a.clock + a.len <= i.id.clock) break;
				i instanceof Y && i.deleted && !i.keep && n(i) && i.gc(t, !1);
			}
		}
	}
}, dE = (e, t) => {
	e.clients.forEach((e, n) => {
		let r = t.clients.get(n);
		for (let t = e.length - 1; t >= 0; t--) {
			let n = e[t], i = ax(r.length - 1, 1 + $T(r, n.clock + n.len - 1));
			for (let e = i, t = r[e]; e > 0 && t.id.clock >= n.clock; t = r[e]) e -= 1 + lE(r, e);
		}
	});
}, fE = (e, t) => {
	if (t < e.length) {
		let n = e[t], r = n.doc, i = r.store, a = n.deleteSet, o = n._mergeStructs;
		try {
			aT(a), n.afterState = XT(n.doc.store), r.emit("beforeObserverCalls", [n, r]);
			let e = [];
			n.changed.forEach((t, r) => e.push(() => {
				(r._item === null || !r._item.deleted) && r._callObserver(n, t);
			})), e.push(() => {
				n.changedParentTypes.forEach((t, r) => {
					r._dEH.l.length > 0 && (r._item === null || !r._item.deleted) && (t = t.filter((e) => e.target._item === null || !e.target._item.deleted), t.forEach((e) => {
						e.currentTarget = r, e._path = null;
					}), t.sort((e, t) => e.path.length - t.path.length), e.push(() => {
						MT(r._dEH, t, n);
					}));
				}), e.push(() => r.emit("afterTransaction", [n, r])), e.push(() => {
					n._needFormattingCleanup && CD(n);
				});
			}), QS(e, []);
		} finally {
			r.gc && uE(a, i, r.gcFilter), dE(a, i), n.afterState.forEach((e, t) => {
				let r = n.beforeState.get(t) || 0;
				if (r !== e) {
					let e = i.clients.get(t), n = ox($T(e, r), 1);
					for (let t = e.length - 1; t >= n;) t -= 1 + lE(e, t);
				}
			});
			for (let e = o.length - 1; e >= 0; e--) {
				let { client: t, clock: n } = o[e].id, r = i.clients.get(t), a = $T(r, n);
				a + 1 < r.length && lE(r, a + 1) > 1 || a > 0 && lE(r, a);
			}
			if (!n.local && n.afterState.get(r.clientID) !== n.beforeState.get(r.clientID) && (Jw(Uw, Iw, "[yjs] ", Lw, Vw, "Changed the client-id because another client seems to be using it."), r.clientID = pT()), r.emit("afterTransactionCleanup", [n, r]), r._observers.has("update")) {
				let e = new vT();
				sE(e, n) && r.emit("update", [
					e.toUint8Array(),
					n.origin,
					r,
					n
				]);
			}
			if (r._observers.has("updateV2")) {
				let e = new bT();
				sE(e, n) && r.emit("updateV2", [
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
			]), l.forEach((e) => e.destroy())), e.length <= t + 1 ? (r._transactionCleanups = [], r.emit("afterAllTransactions", [r, e])) : fE(e, t + 1);
		}
	}
}, J = (e, t, n = null, r = !0) => {
	let i = e._transactionCleanups, a = !1, o = null;
	e._transaction === null && (a = !0, e._transaction = new oE(e, n, r), i.push(e._transaction), i.length === 1 && e.emit("beforeAllTransactions", [e]), e.emit("beforeTransaction", [e._transaction, e]));
	try {
		o = t(e._transaction);
	} finally {
		if (a) {
			let t = e._transaction === i[0];
			e._transaction = null, t && fE(i, 0);
		}
	}
	return o;
}, pE = class {
	constructor(e, t) {
		this.insertions = t, this.deletions = e, this.meta = /* @__PURE__ */ new Map();
	}
}, mE = (e, t, n) => {
	nT(e, n.deletions, (n) => {
		n instanceof Y && t.scope.some((t) => t === e.doc || IT(t, n)) && gO(n, !1);
	});
}, hE = (e, t, n) => {
	let r = null, i = e.doc, a = e.scope;
	J(i, (n) => {
		for (; t.length > 0 && e.currStackItem === null;) {
			let r = i.store, o = t.pop(), s = /* @__PURE__ */ new Set(), c = [], l = !1;
			nT(n, o.insertions, (e) => {
				if (e instanceof Y) {
					if (e.redone !== null) {
						let { item: t, diff: i } = hO(r, e.id);
						i > 0 && (t = nE(n, q(t.id.client, t.id.clock + i))), e = t;
					}
					!e.deleted && a.some((t) => t === n.doc || IT(t, e)) && c.push(e);
				}
			}), nT(n, o.deletions, (e) => {
				e instanceof Y && a.some((t) => t === n.doc || IT(t, e)) && !iT(o.insertions, e.id) && s.add(e);
			}), s.forEach((t) => {
				l = yO(n, t, s, o.insertions, e.ignoreRemoteMapChanges, e) !== null || l;
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
}, gE = class extends nx {
	constructor(e, { captureTimeout: t = 500, captureTransaction: n = (e) => !0, deleteFilter: r = () => !0, trackedOrigins: i = /* @__PURE__ */ new Set([null]), ignoreRemoteMapChanges: a = !1, doc: o = tx(e) ? e[0].doc : e instanceof mT ? e : e.doc } = {}) {
		super(), this.scope = [], this.doc = o, this.addToScope(e), this.deleteFilter = r, i.add(this), this.trackedOrigins = i, this.captureTransaction = n, this.undoStack = [], this.redoStack = [], this.undoing = !1, this.redoing = !1, this.currStackItem = null, this.lastChange = 0, this.ignoreRemoteMapChanges = a, this.captureTimeout = t, this.afterTransactionHandler = (e) => {
			if (!this.captureTransaction(e) || !this.scope.some((t) => e.changedParentTypes.has(t) || t === this.doc) || !this.trackedOrigins.has(e.origin) && (!e.origin || !this.trackedOrigins.has(e.origin.constructor))) return;
			let t = this.undoing, n = this.redoing, r = t ? this.redoStack : this.undoStack;
			t ? this.stopCapturing() : n || this.clear(!1, !0);
			let i = new tT();
			e.afterState.forEach((t, n) => {
				let r = e.beforeState.get(n) || 0, a = t - r;
				a > 0 && sT(i, n, r, a);
			});
			let a = PS(), o = !1;
			if (this.lastChange > 0 && a - this.lastChange < this.captureTimeout && r.length > 0 && !t && !n) {
				let t = r[r.length - 1];
				t.deletions = oT([t.deletions, e.deleteSet]), t.insertions = oT([t.insertions, i]);
			} else r.push(new pE(e.deleteSet, i)), o = !0;
			!t && !n && (this.lastChange = a), nT(e, e.deleteSet, (t) => {
				t instanceof Y && this.scope.some((n) => n === e.doc || IT(n, t)) && gO(t, !0);
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
		e = tx(e) ? e : [e], e.forEach((e) => {
			t.has(e) || (t.add(e), (e instanceof RE ? e.doc !== this.doc : e !== this.doc) && Yw("[yjs#509] Not same Y.Doc"), this.scope.push(e));
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
			e && (this.undoStack.forEach((e) => mE(n, this, e)), this.undoStack = []), t && (this.redoStack.forEach((e) => mE(n, this, e)), this.redoStack = []), this.emit("stack-cleared", [{
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
			e = hE(this, this.undoStack, "undo");
		} finally {
			this.undoing = !1;
		}
		return e;
	}
	redo() {
		this.redoing = !0;
		let e;
		try {
			e = hE(this, this.redoStack, "redo");
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
function* _E(e) {
	let t = K(e.restDecoder);
	for (let n = 0; n < t; n++) {
		let t = K(e.restDecoder), n = e.readClient(), r = K(e.restDecoder);
		for (let i = 0; i < t; i++) {
			let t = e.readInfo();
			if (t === 10) {
				let t = K(e.restDecoder);
				yield new CO(q(n, r), t), r += t;
			} else if (31 & t) {
				let i = (t & 192) == 0, a = new Y(q(n, r), null, (t & 128) == 128 ? e.readLeftID() : null, null, (t & 64) == 64 ? e.readRightID() : null, i ? e.readParentInfo() ? e.readString() : e.readLeftID() : null, i && (t & 32) == 32 ? e.readString() : null, bO(e, t));
				yield a, r += a.length;
			} else {
				let t = e.readLen();
				yield new BD(q(n, r), t), r += t;
			}
		}
	}
}
var vE = class {
	constructor(e, t) {
		this.gen = _E(e), this.curr = null, this.done = !1, this.filterSkips = t, this.next();
	}
	next() {
		do
			this.curr = this.gen.next().value || null;
		while (this.filterSkips && this.curr !== null && this.curr.constructor === CO);
		return this.curr;
	}
}, yE = class {
	constructor(e) {
		this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
	}
}, bE = (e, t) => {
	if (e.constructor === BD) {
		let { client: n, clock: r } = e.id;
		return new BD(q(n, r + t), e.length - t);
	} else if (e.constructor === CO) {
		let { client: n, clock: r } = e.id;
		return new CO(q(n, r + t), e.length - t);
	} else {
		let n = e, { client: r, clock: i } = n.id;
		return new Y(q(r, i + t), null, q(r, i + t - 1), null, n.rightOrigin, n.parent, n.parentSub, n.content.splice(t));
	}
}, xE = (e, t = gT, n = bT) => {
	if (e.length === 1) return e[0];
	let r = e.map((e) => new t(mS(e))), i = r.map((e) => new vE(e, !0)), a = null, o = new n(), s = new yE(o);
	for (; i = i.filter((e) => e.curr !== null), i.sort((e, t) => {
		if (e.curr.id.client === t.curr.id.client) {
			let n = e.curr.id.clock - t.curr.id.clock;
			return n === 0 ? e.curr.constructor === t.curr.constructor ? 0 : e.curr.constructor === CO ? 1 : -1 : n;
		} else return t.curr.id.client - e.curr.id.client;
	}), i.length !== 0;) {
		let e = i[0], t = e.curr.id.client;
		if (a !== null) {
			let n = e.curr, r = !1;
			for (; n !== null && n.id.clock + n.length <= a.struct.id.clock + a.struct.length && n.id.client >= a.struct.id.client;) n = e.next(), r = !0;
			if (n === null || n.id.client !== t || r && n.id.clock > a.struct.id.clock + a.struct.length) continue;
			if (t !== a.struct.id.client) CE(s, a.struct, a.offset), a = {
				struct: n,
				offset: 0
			}, e.next();
			else if (a.struct.id.clock + a.struct.length < n.id.clock) if (a.struct.constructor === CO) a.struct.length = n.id.clock + n.length - a.struct.id.clock;
			else {
				CE(s, a.struct, a.offset);
				let e = n.id.clock - a.struct.id.clock - a.struct.length;
				a = {
					struct: new CO(q(t, a.struct.id.clock + a.struct.length), e),
					offset: 0
				};
			}
			else {
				let t = a.struct.id.clock + a.struct.length - n.id.clock;
				t > 0 && (a.struct.constructor === CO ? a.struct.length -= t : n = bE(n, t)), a.struct.mergeWith(n) || (CE(s, a.struct, a.offset), a = {
					struct: n,
					offset: 0
				}, e.next());
			}
		} else a = {
			struct: e.curr,
			offset: 0
		}, e.next();
		for (let n = e.curr; n !== null && n.id.client === t && n.id.clock === a.struct.id.clock + a.struct.length && n.constructor !== CO; n = e.next()) CE(s, a.struct, a.offset), a = {
			struct: n,
			offset: 0
		};
	}
	return a !== null && (CE(s, a.struct, a.offset), a = null), wE(s), uT(o, oT(r.map((e) => dT(e)))), o.toUint8Array();
}, SE = (e) => {
	e.written > 0 && (e.clientStructs.push({
		written: e.written,
		restEncoder: zx(e.encoder.restEncoder)
	}), e.encoder.restEncoder = Ix(), e.written = 0);
}, CE = (e, t, n) => {
	e.written > 0 && e.currClient !== t.id.client && SE(e), e.written === 0 && (e.currClient = t.id.client, e.encoder.writeClient(t.id.client), G(e.encoder.restEncoder, t.id.clock + n)), t.write(e.encoder, n), e.written++;
}, wE = (e) => {
	SE(e);
	let t = e.encoder.restEncoder;
	G(t, e.clientStructs.length);
	for (let n = 0; n < e.clientStructs.length; n++) {
		let r = e.clientStructs[n];
		G(t, r.written), qx(t, r.restEncoder);
	}
}, TE = "You must not compute changes after the event-handler fired.", EE = class {
	constructor(e, t) {
		this.target = e, this.currentTarget = e, this.transaction = t, this._changes = null, this._keys = null, this._delta = null, this._path = null;
	}
	get path() {
		return this._path ||= DE(this.currentTarget, this.target);
	}
	deletes(e) {
		return iT(this.transaction.deleteSet, e.id);
	}
	get keys() {
		if (this._keys === null) {
			if (this.transaction.doc._transactionCleanups.length === 0) throw cS(TE);
			let e = /* @__PURE__ */ new Map(), t = this.target;
			this.transaction.changed.get(t).forEach((n) => {
				if (n !== null) {
					let r = t._map.get(n), i, a;
					if (this.adds(r)) {
						let e = r.left;
						for (; e !== null && this.adds(e);) e = e.left;
						if (this.deletes(r)) if (e !== null && this.deletes(e)) i = "delete", a = Yb(e.content.getContent());
						else return;
						else e !== null && this.deletes(e) ? (i = "update", a = Yb(e.content.getContent())) : (i = "add", a = void 0);
					} else if (this.deletes(r)) i = "delete", a = Yb(r.content.getContent());
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
			if (this.transaction.doc._transactionCleanups.length === 0) throw cS(TE);
			let t = this.target, n = Jb(), r = Jb(), i = [];
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
}, DE = (e, t) => {
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
}, OE = () => {
	Yw("Invalid access: Add Yjs type to a document before reading data.");
}, kE = 80, AE = 0, jE = class {
	constructor(e, t) {
		e.marker = !0, this.p = e, this.index = t, this.timestamp = AE++;
	}
}, ME = (e) => {
	e.timestamp = AE++;
}, NE = (e, t, n) => {
	e.p.marker = !1, e.p = t, t.marker = !0, e.index = n, e.timestamp = AE++;
}, PE = (e, t, n) => {
	if (e.length >= kE) {
		let r = e.reduce((e, t) => e.timestamp < t.timestamp ? e : t);
		return NE(r, t, n), r;
	} else {
		let r = new jE(t, n);
		return e.push(r), r;
	}
}, FE = (e, t) => {
	if (e._start === null || t === 0 || e._searchMarker === null) return null;
	let n = e._searchMarker.length === 0 ? null : e._searchMarker.reduce((e, n) => ix(t - e.index) < ix(t - n.index) ? e : n), r = e._start, i = 0;
	for (n !== null && (r = n.p, i = n.index, ME(n)); r.right !== null && i < t;) {
		if (!r.deleted && r.countable) {
			if (t < i + r.length) break;
			i += r.length;
		}
		r = r.right;
	}
	for (; r.left !== null && i > t;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	for (; r.left !== null && r.left.id.client === r.id.client && r.left.id.clock + r.left.length === r.id.clock;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	return n !== null && ix(n.index - i) < r.parent.length / kE ? (NE(n, r, i), n) : PE(e._searchMarker, r, i);
}, IE = (e, t, n) => {
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
		(t < i.index || n > 0 && t === i.index) && (i.index = ox(t, i.index + n));
	}
}, LE = (e, t, n) => {
	let r = e, i = t.changedParentTypes;
	for (; Gb(i, e, () => []).push(n), e._item !== null;) e = e._item.parent;
	MT(r._eH, n, t);
}, RE = class {
	constructor() {
		this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = kT(), this._dEH = kT(), this._searchMarker = null;
	}
	get parent() {
		return this._item ? this._item.parent : null;
	}
	_integrate(e, t) {
		this.doc = e, this._item = t;
	}
	_copy() {
		throw lS();
	}
	clone() {
		throw lS();
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
		AT(this._eH, e);
	}
	observeDeep(e) {
		AT(this._dEH, e);
	}
	unobserve(e) {
		jT(this._eH, e);
	}
	unobserveDeep(e) {
		jT(this._dEH, e);
	}
	toJSON() {}
}, zE = (e, t, n) => {
	e.doc ?? OE(), t < 0 && (t = e._length + t), n < 0 && (n = e._length + n);
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
}, BE = (e) => {
	e.doc ?? OE();
	let t = [], n = e._start;
	for (; n !== null;) {
		if (n.countable && !n.deleted) {
			let e = n.content.getContent();
			for (let n = 0; n < e.length; n++) t.push(e[n]);
		}
		n = n.right;
	}
	return t;
}, VE = (e, t) => {
	let n = [], r = e._start;
	for (; r !== null;) {
		if (r.countable && qT(r, t)) {
			let e = r.content.getContent();
			for (let t = 0; t < e.length; t++) n.push(e[t]);
		}
		r = r.right;
	}
	return n;
}, HE = (e, t) => {
	let n = 0, r = e._start;
	for (e.doc ?? OE(); r !== null;) {
		if (r.countable && !r.deleted) {
			let i = r.content.getContent();
			for (let r = 0; r < i.length; r++) t(i[r], n++, e);
		}
		r = r.right;
	}
}, UE = (e, t) => {
	let n = [];
	return HE(e, (r, i) => {
		n.push(t(r, i, e));
	}), n;
}, WE = (e) => {
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
}, GE = (e, t) => {
	e.doc ?? OE();
	let n = FE(e, t), r = e._start;
	for (n !== null && (r = n.p, t -= n.index); r !== null; r = r.right) if (!r.deleted && r.countable) {
		if (t < r.length) return r.content.getContent()[t];
		t -= r.length;
	}
}, KE = (e, t, n, r) => {
	let i = n, a = e.doc, o = a.clientID, s = a.store, c = n === null ? t._start : n.right, l = [], u = () => {
		l.length > 0 && (i = new Y(q(o, ZT(s, o)), i, i && i.lastId, c, c && c.id, t, null, new tO(l)), i.integrate(e, 0), l = []);
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
					i = new Y(q(o, ZT(s, o)), i, i && i.lastId, c, c && c.id, t, null, new VD(new Uint8Array(n))), i.integrate(e, 0);
					break;
				case mT:
					i = new Y(q(o, ZT(s, o)), i, i && i.lastId, c, c && c.id, t, null, new KD(n)), i.integrate(e, 0);
					break;
				default: if (n instanceof RE) i = new Y(q(o, ZT(s, o)), i, i && i.lastId, c, c && c.id, t, null, new pO(n)), i.integrate(e, 0);
				else throw Error("Unexpected content type in insert operation");
			}
		}
	}), u();
}, qE = () => cS("Length exceeded!"), JE = (e, t, n, r) => {
	if (n > t._length) throw qE();
	if (n === 0) return t._searchMarker && IE(t._searchMarker, n, r.length), KE(e, t, null, r);
	let i = n, a = FE(t, n), o = t._start;
	for (a !== null && (o = a.p, n -= a.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right) if (!o.deleted && o.countable) {
		if (n <= o.length) {
			n < o.length && nE(e, q(o.id.client, o.id.clock + n));
			break;
		}
		n -= o.length;
	}
	return t._searchMarker && IE(t._searchMarker, i, r.length), KE(e, t, o, r);
}, YE = (e, t, n) => {
	let r = (t._searchMarker || []).reduce((e, t) => t.index > e.index ? t : e, {
		index: 0,
		p: t._start
	}).p;
	if (r) for (; r.right;) r = r.right;
	return KE(e, t, r, n);
}, XE = (e, t, n, r) => {
	if (r === 0) return;
	let i = n, a = r, o = FE(t, n), s = t._start;
	for (o !== null && (s = o.p, n -= o.index); s !== null && n > 0; s = s.right) !s.deleted && s.countable && (n < s.length && nE(e, q(s.id.client, s.id.clock + n)), n -= s.length);
	for (; r > 0 && s !== null;) s.deleted || (r < s.length && nE(e, q(s.id.client, s.id.clock + r)), s.delete(e), r -= s.length), s = s.right;
	if (r > 0) throw qE();
	t._searchMarker && IE(t._searchMarker, i, -a + r);
}, ZE = (e, t, n) => {
	let r = t._map.get(n);
	r !== void 0 && r.delete(e);
}, QE = (e, t, n, r) => {
	let i = t._map.get(n) || null, a = e.doc, o = a.clientID, s;
	if (r == null) s = new tO([r]);
	else switch (r.constructor) {
		case Number:
		case Object:
		case Boolean:
		case Array:
		case String:
		case Date:
		case BigInt:
			s = new tO([r]);
			break;
		case Uint8Array:
			s = new VD(r);
			break;
		case mT:
			s = new KD(r);
			break;
		default: if (r instanceof RE) s = new pO(r);
		else throw Error("Unexpected content type");
	}
	new Y(q(o, ZT(a.store, o)), i, i && i.lastId, null, null, t, n, s).integrate(e, 0);
}, $E = (e, t) => {
	e.doc ?? OE();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, eD = (e) => {
	let t = {};
	return e.doc ?? OE(), e._map.forEach((e, n) => {
		e.deleted || (t[n] = e.content.getContent()[e.length - 1]);
	}), t;
}, tD = (e, t) => {
	e.doc ?? OE();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted;
}, nD = (e, t) => {
	let n = {};
	return e._map.forEach((e, r) => {
		let i = e;
		for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0));) i = i.left;
		i !== null && qT(i, t) && (n[r] = i.content.getContent()[i.length - 1]);
	}), n;
}, rD = (e) => (e.doc ?? OE(), Qw(e._map.entries(), (e) => !e[1].deleted)), iD = class extends EE {}, aD = class e extends RE {
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
		return t.insert(0, this.toArray().map((e) => e instanceof RE ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? OE(), this._length;
	}
	_callObserver(e, t) {
		super._callObserver(e, t), LE(this, e, new iD(this, e));
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : J(this.doc, (n) => {
			JE(n, this, e, t);
		});
	}
	push(e) {
		this.doc === null ? this._prelimContent.push(...e) : J(this.doc, (t) => {
			YE(t, this, e);
		});
	}
	unshift(e) {
		this.insert(0, e);
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : J(this.doc, (n) => {
			XE(n, this, e, t);
		});
	}
	get(e) {
		return GE(this, e);
	}
	toArray() {
		return BE(this);
	}
	slice(e = 0, t = this.length) {
		return zE(this, e, t);
	}
	toJSON() {
		return this.map((e) => e instanceof RE ? e.toJSON() : e);
	}
	map(e) {
		return UE(this, e);
	}
	forEach(e) {
		HE(this, e);
	}
	[Symbol.iterator]() {
		return WE(this);
	}
	_write(e) {
		e.writeTypeRef(oO);
	}
}, oD = (e) => new aD(), sD = class extends EE {
	constructor(e, t, n) {
		super(e, t), this.keysChanged = n;
	}
}, cD = class e extends RE {
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
			t.set(n, e instanceof RE ? e.clone() : e);
		}), t;
	}
	_callObserver(e, t) {
		LE(this, e, new sD(this, e, t));
	}
	toJSON() {
		this.doc ?? OE();
		let e = {};
		return this._map.forEach((t, n) => {
			if (!t.deleted) {
				let r = t.content.getContent()[t.length - 1];
				e[n] = r instanceof RE ? r.toJSON() : r;
			}
		}), e;
	}
	get size() {
		return [...rD(this)].length;
	}
	keys() {
		return $w(rD(this), (e) => e[0]);
	}
	values() {
		return $w(rD(this), (e) => e[1].content.getContent()[e[1].length - 1]);
	}
	entries() {
		return $w(rD(this), (e) => [e[0], e[1].content.getContent()[e[1].length - 1]]);
	}
	forEach(e) {
		this.doc ?? OE(), this._map.forEach((t, n) => {
			t.deleted || e(t.content.getContent()[t.length - 1], n, this);
		});
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	delete(e) {
		this.doc === null ? this._prelimContent.delete(e) : J(this.doc, (t) => {
			ZE(t, this, e);
		});
	}
	set(e, t) {
		return this.doc === null ? this._prelimContent.set(e, t) : J(this.doc, (n) => {
			QE(n, this, e, t);
		}), t;
	}
	get(e) {
		return $E(this, e);
	}
	has(e) {
		return tD(this, e);
	}
	clear() {
		this.doc === null ? this._prelimContent.clear() : J(this.doc, (e) => {
			this.forEach(function(t, n, r) {
				ZE(e, r, n);
			});
		});
	}
	_write(e) {
		e.writeTypeRef(sO);
	}
}, lD = (e) => new cD(), uD = (e, t) => e === t || typeof e == "object" && typeof t == "object" && e && t && YS(e, t), dD = class {
	constructor(e, t, n, r) {
		this.left = e, this.right = t, this.index = n, this.currentAttributes = r;
	}
	forward() {
		switch (this.right === null && uS(), this.right.content.constructor) {
			case XD:
				this.right.deleted || hD(this.currentAttributes, this.right.content);
				break;
			default:
				this.right.deleted || (this.index += this.right.length);
				break;
		}
		this.left = this.right, this.right = this.right.right;
	}
}, fD = (e, t, n) => {
	for (; t.right !== null && n > 0;) {
		switch (t.right.content.constructor) {
			case XD:
				t.right.deleted || hD(t.currentAttributes, t.right.content);
				break;
			default:
				t.right.deleted || (n < t.right.length && nE(e, q(t.right.id.client, t.right.id.clock + n)), t.index += t.right.length, n -= t.right.length);
				break;
		}
		t.left = t.right, t.right = t.right.right;
	}
	return t;
}, pD = (e, t, n, r) => {
	let i = /* @__PURE__ */ new Map(), a = r ? FE(t, n) : null;
	return a ? fD(e, new dD(a.p.left, a.p, a.index, i), n - a.index) : fD(e, new dD(null, t._start, 0, i), n);
}, mD = (e, t, n, r) => {
	for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === XD && uD(r.get(n.right.content.key), n.right.content.value));) n.right.deleted || r.delete(n.right.content.key), n.forward();
	let i = e.doc, a = i.clientID;
	r.forEach((r, o) => {
		let s = n.left, c = n.right, l = new Y(q(a, ZT(i.store, a)), s, s && s.lastId, c, c && c.id, t, null, new XD(o, r));
		l.integrate(e, 0), n.right = l, n.forward();
	});
}, hD = (e, t) => {
	let { key: n, value: r } = t;
	r === null ? e.delete(n) : e.set(n, r);
}, gD = (e, t) => {
	for (; e.right !== null && (e.right.deleted || e.right.content.constructor === XD && uD(t[e.right.content.key] ?? null, e.right.content.value));) e.forward();
}, _D = (e, t, n, r) => {
	let i = e.doc, a = i.clientID, o = /* @__PURE__ */ new Map();
	for (let s in r) {
		let c = r[s], l = n.currentAttributes.get(s) ?? null;
		if (!uD(l, c)) {
			o.set(s, l);
			let { left: r, right: u } = n;
			n.right = new Y(q(a, ZT(i.store, a)), r, r && r.lastId, u, u && u.id, t, null, new XD(s, c)), n.right.integrate(e, 0), n.forward();
		}
	}
	return o;
}, vD = (e, t, n, r, i) => {
	n.currentAttributes.forEach((e, t) => {
		i[t] === void 0 && (i[t] = null);
	});
	let a = e.doc, o = a.clientID;
	gD(n, i);
	let s = _D(e, t, n, i), c = r.constructor === String ? new rO(r) : r instanceof RE ? new pO(r) : new JD(r), { left: l, right: u, index: d } = n;
	t._searchMarker && IE(t._searchMarker, n.index, c.getLength()), u = new Y(q(o, ZT(a.store, o)), l, l && l.lastId, u, u && u.id, t, null, c), u.integrate(e, 0), n.right = u, n.index = d, n.forward(), mD(e, t, n, s);
}, yD = (e, t, n, r, i) => {
	let a = e.doc, o = a.clientID;
	gD(n, i);
	let s = _D(e, t, n, i);
	iterationLoop: for (; n.right !== null && (r > 0 || s.size > 0 && (n.right.deleted || n.right.content.constructor === XD));) {
		if (!n.right.deleted) switch (n.right.content.constructor) {
			case XD: {
				let { key: t, value: a } = n.right.content, o = i[t];
				if (o !== void 0) {
					if (uD(o, a)) s.delete(t);
					else {
						if (r === 0) break iterationLoop;
						s.set(t, a);
					}
					n.right.delete(e);
				} else n.currentAttributes.set(t, a);
				break;
			}
			default:
				r < n.right.length && nE(e, q(n.right.id.client, n.right.id.clock + r)), r -= n.right.length;
				break;
		}
		n.forward();
	}
	if (r > 0) {
		let i = "";
		for (; r > 0; r--) i += "\n";
		n.right = new Y(q(o, ZT(a.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, t, null, new rO(i)), n.right.integrate(e, 0), n.forward();
	}
	mD(e, t, n, s);
}, bD = (e, t, n, r, i) => {
	let a = t, o = Ub();
	for (; a && (!a.countable || a.deleted);) {
		if (!a.deleted && a.content.constructor === XD) {
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
				case XD: {
					let { key: a, value: l } = n, u = r.get(a) ?? null;
					(o.get(a) !== n || u === l) && (t.delete(e), s++, !c && (i.get(a) ?? null) === l && u !== l && (u === null ? i.delete(a) : i.set(a, u))), !c && !t.deleted && hD(i, n);
					break;
				}
			}
		}
		t = t.right;
	}
	return s;
}, xD = (e, t) => {
	for (; t && t.right && (t.right.deleted || !t.right.countable);) t = t.right;
	let n = /* @__PURE__ */ new Set();
	for (; t && (t.deleted || !t.countable);) {
		if (!t.deleted && t.content.constructor === XD) {
			let r = t.content.key;
			n.has(r) ? t.delete(e) : n.add(r);
		}
		t = t.left;
	}
}, SD = (e) => {
	let t = 0;
	return J(e.doc, (n) => {
		let r = e._start, i = e._start, a = Ub(), o = Wb(a);
		for (; i;) {
			if (i.deleted === !1) switch (i.content.constructor) {
				case XD:
					hD(o, i.content);
					break;
				default:
					t += bD(n, r, i, a, o), a = Wb(o), r = i;
					break;
			}
			i = i.right;
		}
	}), t;
}, CD = (e) => {
	let t = /* @__PURE__ */ new Set(), n = e.doc;
	for (let [r, i] of e.afterState.entries()) {
		let a = e.beforeState.get(r) || 0;
		i !== a && aE(e, n.store.clients.get(r), a, i, (e) => {
			!e.deleted && e.content.constructor === XD && e.constructor !== BD && t.add(e.parent);
		});
	}
	J(n, (n) => {
		nT(e, e.deleteSet, (e) => {
			if (e instanceof BD || !e.parent._hasFormatting || t.has(e.parent)) return;
			let r = e.parent;
			e.content.constructor === XD ? t.add(r) : xD(n, e);
		});
		for (let e of t) SD(e);
	});
}, wD = (e, t, n) => {
	let r = n, i = Wb(t.currentAttributes), a = t.right;
	for (; n > 0 && t.right !== null;) {
		if (t.right.deleted === !1) switch (t.right.content.constructor) {
			case pO:
			case JD:
			case rO:
				n < t.right.length && nE(e, q(t.right.id.client, t.right.id.clock + n)), n -= t.right.length, t.right.delete(e);
				break;
		}
		t.forward();
	}
	a && bD(e, a, t.right, i, t.currentAttributes);
	let o = (t.left || t.right).parent;
	return o._searchMarker && IE(o._searchMarker, t.index, -r + n), t;
}, TD = class extends EE {
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
								c > 0 && (e = { retain: c }, KS(o) || (e.attributes = HS({}, o))), c = 0;
								break;
						}
						e && t.push(e), a = null;
					}
				};
				for (; i !== null;) {
					switch (i.content.constructor) {
						case pO:
						case JD:
							this.adds(i) ? this.deletes(i) || (u(), a = "insert", s = i.content.getContent()[0], u()) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += 1) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += 1);
							break;
						case rO:
							this.adds(i) ? this.deletes(i) || (a !== "insert" && (u(), a = "insert"), s += i.content.str) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += i.length) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += i.length);
							break;
						case XD: {
							let { key: t, value: s } = i.content;
							if (this.adds(i)) this.deletes(i) || (uD(n.get(t) ?? null, s) ? s !== null && i.delete(e) : (a === "retain" && u(), uD(s, r.get(t) ?? null) ? delete o[t] : o[t] = s));
							else if (this.deletes(i)) {
								r.set(t, s);
								let e = n.get(t) ?? null;
								uD(e, s) || (a === "retain" && u(), o[t] = e);
							} else if (!i.deleted) {
								r.set(t, s);
								let n = o[t];
								n !== void 0 && (uD(n, s) ? n !== null && i.delete(e) : (a === "retain" && u(), s === null ? delete o[t] : o[t] = s));
							}
							i.deleted || (a === "insert" && u(), hD(n, i.content));
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
}, ED = class e extends RE {
	constructor(e) {
		super(), this._pending = e === void 0 ? [] : [() => this.insert(0, e)], this._searchMarker = [], this._hasFormatting = !1;
	}
	get length() {
		return this.doc ?? OE(), this._length;
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
		let n = new TD(this, e, t);
		LE(this, e, n), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
	}
	toString() {
		this.doc ?? OE();
		let e = "", t = this._start;
		for (; t !== null;) !t.deleted && t.countable && t.content.constructor === rO && (e += t.content.str), t = t.right;
		return e;
	}
	toJSON() {
		return this.toString();
	}
	applyDelta(e, { sanitize: t = !0 } = {}) {
		this.doc === null ? this._pending.push(() => this.applyDelta(e)) : J(this.doc, (n) => {
			let r = new dD(null, this._start, 0, /* @__PURE__ */ new Map());
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				if (a.insert !== void 0) {
					let o = !t && typeof a.insert == "string" && i === e.length - 1 && r.right === null && a.insert.slice(-1) === "\n" ? a.insert.slice(0, -1) : a.insert;
					(typeof o != "string" || o.length > 0) && vD(n, this, r, o, a.attributes || {});
				} else a.retain === void 0 ? a.delete !== void 0 && wD(n, r, a.delete) : yD(n, this, r, a.retain, a.attributes || {});
			}
		});
	}
	toDelta(e, t, n) {
		this.doc ?? OE();
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
				if (qT(s, e) || t !== void 0 && qT(s, t)) switch (s.content.constructor) {
					case rO: {
						let r = i.get("ychange");
						e !== void 0 && !qT(s, e) ? (r === void 0 || r.user !== s.id.client || r.type !== "removed") && (c(), i.set("ychange", n ? n("removed", s.id) : { type: "removed" })) : t !== void 0 && !qT(s, t) ? (r === void 0 || r.user !== s.id.client || r.type !== "added") && (c(), i.set("ychange", n ? n("added", s.id) : { type: "added" })) : r !== void 0 && (c(), i.delete("ychange")), o += s.content.str;
						break;
					}
					case pO:
					case JD: {
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
					case XD:
						qT(s, e) && (c(), hD(i, s.content));
						break;
				}
				s = s.right;
			}
			c();
		};
		return e || t ? J(a, (n) => {
			e && JT(n, e), t && JT(n, t), l();
		}, "cleanup") : l(), r;
	}
	insert(e, t, n) {
		if (t.length <= 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.insert(e, t, n)) : J(r, (r) => {
			let i = pD(r, this, e, !n);
			n || (n = {}, i.currentAttributes.forEach((e, t) => {
				n[t] = e;
			})), vD(r, this, i, t, n);
		});
	}
	insertEmbed(e, t, n) {
		let r = this.doc;
		r === null ? this._pending.push(() => this.insertEmbed(e, t, n || {})) : J(r, (r) => {
			let i = pD(r, this, e, !n);
			vD(r, this, i, t, n || {});
		});
	}
	delete(e, t) {
		if (t === 0) return;
		let n = this.doc;
		n === null ? this._pending.push(() => this.delete(e, t)) : J(n, (n) => {
			wD(n, pD(n, this, e, !0), t);
		});
	}
	format(e, t, n) {
		if (t === 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.format(e, t, n)) : J(r, (r) => {
			let i = pD(r, this, e, !1);
			i.right !== null && yD(r, this, i, t, n);
		});
	}
	removeAttribute(e) {
		this.doc === null ? this._pending.push(() => this.removeAttribute(e)) : J(this.doc, (t) => {
			ZE(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._pending.push(() => this.setAttribute(e, t)) : J(this.doc, (n) => {
			QE(n, this, e, t);
		});
	}
	getAttribute(e) {
		return $E(this, e);
	}
	getAttributes() {
		return eD(this);
	}
	_write(e) {
		e.writeTypeRef(cO);
	}
}, DD = (e) => new ED(), OD = class {
	constructor(e, t = () => !0) {
		this._filter = t, this._root = e, this._currentNode = e._start, this._firstCall = !0, e.doc ?? OE();
	}
	[Symbol.iterator]() {
		return this;
	}
	next() {
		let e = this._currentNode, t = e && e.content && e.content.type;
		if (e !== null && (!this._firstCall || e.deleted || !this._filter(t))) do
			if (t = e.content.type, !e.deleted && (t.constructor === jD || t.constructor === kD) && t._start !== null) e = t._start;
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
}, kD = class e extends RE {
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
		return t.insert(0, this.toArray().map((e) => e instanceof RE ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? OE(), this._prelimContent === null ? this._length : this._prelimContent.length;
	}
	createTreeWalker(e) {
		return new OD(this, e);
	}
	querySelector(e) {
		e = e.toUpperCase();
		let t = new OD(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e).next();
		return t.done ? null : t.value;
	}
	querySelectorAll(e) {
		return e = e.toUpperCase(), Zb(new OD(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e));
	}
	_callObserver(e, t) {
		LE(this, e, new ND(this, t, e));
	}
	toString() {
		return UE(this, (e) => e.toString()).join("");
	}
	toJSON() {
		return this.toString();
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createDocumentFragment();
		return n !== void 0 && n._createAssociation(r, this), HE(this, (i) => {
			r.insertBefore(i.toDOM(e, t, n), null);
		}), r;
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : J(this.doc, (n) => {
			JE(n, this, e, t);
		});
	}
	insertAfter(e, t) {
		if (this.doc !== null) J(this.doc, (n) => {
			let r = e && e instanceof RE ? e._item : e;
			KE(n, this, r, t);
		});
		else {
			let n = this._prelimContent, r = e === null ? 0 : n.findIndex((t) => t === e) + 1;
			if (r === 0 && e !== null) throw cS("Reference item not found");
			n.splice(r, 0, ...t);
		}
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : J(this.doc, (n) => {
			XE(n, this, e, t);
		});
	}
	toArray() {
		return BE(this);
	}
	push(e) {
		this.insert(this.length, e);
	}
	unshift(e) {
		this.insert(0, e);
	}
	get(e) {
		return GE(this, e);
	}
	slice(e = 0, t = this.length) {
		return zE(this, e, t);
	}
	forEach(e) {
		HE(this, e);
	}
	_write(e) {
		e.writeTypeRef(uO);
	}
}, AD = (e) => new kD(), jD = class e extends kD {
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
		return WS(this.getAttributes(), (e, n) => {
			t.setAttribute(n, e);
		}), t.insert(0, this.toArray().map((e) => e instanceof RE ? e.clone() : e)), t;
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
			ZE(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._prelimAttrs.set(e, t) : J(this.doc, (n) => {
			QE(n, this, e, t);
		});
	}
	getAttribute(e) {
		return $E(this, e);
	}
	hasAttribute(e) {
		return tD(this, e);
	}
	getAttributes(e) {
		return e ? nD(this, e) : eD(this);
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createElement(this.nodeName), i = this.getAttributes();
		for (let e in i) {
			let t = i[e];
			typeof t == "string" && r.setAttribute(e, t);
		}
		return HE(this, (i) => {
			r.appendChild(i.toDOM(e, t, n));
		}), n !== void 0 && n._createAssociation(r, this), r;
	}
	_write(e) {
		e.writeTypeRef(lO), e.writeKey(this.nodeName);
	}
}, MD = (e) => new jD(e.readKey()), ND = class extends EE {
	constructor(e, t, n) {
		super(e, n), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), t.forEach((e) => {
			e === null ? this.childListChanged = !0 : this.attributesChanged.add(e);
		});
	}
}, PD = class e extends cD {
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
		e.writeTypeRef(dO), e.writeKey(this.hookName);
	}
}, FD = (e) => new PD(e.readKey()), ID = class e extends ED {
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
		e.writeTypeRef(fO);
	}
}, LD = (e) => new ID(), RD = class {
	constructor(e, t) {
		this.id = e, this.length = t;
	}
	get deleted() {
		throw lS();
	}
	mergeWith(e) {
		return !1;
	}
	write(e, t, n) {
		throw lS();
	}
	integrate(e, t) {
		throw lS();
	}
}, zD = 0, BD = class extends RD {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor ? (this.length += e.length, !0) : !1;
	}
	integrate(e, t) {
		t > 0 && (this.id.clock += t, this.length -= t), QT(e.doc.store, this);
	}
	write(e, t) {
		e.writeInfo(zD), e.writeLen(this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, VD = class e {
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
		throw lS();
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
}, HD = (e) => new VD(e.readBuf()), UD = class e {
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
		sT(e.deleteSet, t.id.client, t.id.clock, this.len), t.markDeleted();
	}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeLen(this.len - t);
	}
	getRef() {
		return 1;
	}
}, WD = (e) => new UD(e.readLen()), GD = (e, t) => new mT({
	guid: e,
	...t,
	shouldLoad: t.shouldLoad || t.autoLoad || !1
}), KD = class e {
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
		return new e(GD(this.doc.guid, this.opts));
	}
	splice(e) {
		throw lS();
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
}, qD = (e) => new KD(GD(e.readString(), e.readAny())), JD = class e {
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
		throw lS();
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
}, YD = (e) => new JD(e.readJSON()), XD = class e {
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
		throw lS();
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
}, ZD = (e) => new XD(e.readKey(), e.readJSON()), QD = class e {
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
}, $D = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) {
		let t = e.readString();
		t === "undefined" ? n.push(void 0) : n.push(JSON.parse(t));
	}
	return new QD(n);
}, eO = sC("node_env") === "development", tO = class e {
	constructor(e) {
		this.arr = e, eO && ZS(e);
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
}, nO = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) n.push(e.readAny());
	return new tO(n);
}, rO = class e {
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
}, iO = (e) => new rO(e.readString()), aO = [
	oD,
	lD,
	DD,
	MD,
	AD,
	FD,
	LD
], oO = 0, sO = 1, cO = 2, lO = 3, uO = 4, dO = 5, fO = 6, pO = class e {
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
		throw lS();
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
}, mO = (e) => new pO(aO[e.readTypeRef()](e)), hO = (e, t) => {
	let n = t, r = 0, i;
	do
		r > 0 && (n = q(n.client, n.clock + r)), i = eE(e, n), r = n.clock - i.id.clock, n = i.redone;
	while (n !== null && i instanceof Y);
	return {
		item: i,
		diff: r
	};
}, gO = (e, t) => {
	for (; e !== null && e.keep !== t;) e.keep = t, e = e.parent._item;
}, _O = (e, t, n) => {
	let { client: r, clock: i } = t.id, a = new Y(q(r, i + n), t, q(r, i + n - 1), t.right, t.rightOrigin, t.parent, t.parentSub, t.content.splice(n));
	return t.deleted && a.markDeleted(), t.keep && (a.keep = !0), t.redone !== null && (a.redone = q(t.redone.client, t.redone.clock + n)), t.right = a, a.right !== null && (a.right.left = a), e._mergeStructs.push(a), a.parentSub !== null && a.right === null && a.parent._map.set(a.parentSub, a), t.length = n, a;
}, vO = (e, t) => $b(e, (e) => iT(e.deletions, t)), yO = (e, t, n, r, i, a) => {
	let o = e.doc, s = o.store, c = o.clientID, l = t.redone;
	if (l !== null) return nE(e, l);
	let u = t.parent._item, d = null, f;
	if (u !== null && u.deleted === !0) {
		if (u.redone === null && (!n.has(u) || yO(e, u, n, r, i, a) === null)) return null;
		for (; u.redone !== null;) u = nE(e, u.redone);
	}
	let p = u === null ? t.parent : u.content.type;
	if (t.parentSub === null) {
		for (d = t.left, f = t; d !== null;) {
			let t = d;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : nE(e, t.redone);
			if (t !== null && t.parent._item === u) {
				d = t;
				break;
			}
			d = d.left;
		}
		for (; f !== null;) {
			let t = f;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : nE(e, t.redone);
			if (t !== null && t.parent._item === u) {
				f = t;
				break;
			}
			f = f.right;
		}
	} else {
		if (f = null, t.right && !i) {
			for (d = t; d !== null && d.right !== null && (d.right.redone || iT(r, d.right.id) || vO(a.undoStack, d.right.id) || vO(a.redoStack, d.right.id));) for (d = d.right; d.redone;) d = nE(e, d.redone);
			if (d && d.right !== null) return null;
		} else d = p._map.get(t.parentSub) || null;
		d !== null && d.parent._item !== u && (d = p._map.get(t.parentSub) || null);
	}
	let m = q(c, ZT(s, c)), h = new Y(m, d, d && d.lastId, f, f && f.id, p, t.parentSub, t.content.copy());
	return t.redone = m, gO(h, !0), h.integrate(e, 0), h;
}, Y = class e extends RD {
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
		if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= ZT(n, this.origin.client)) return this.origin.client;
		if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= ZT(n, this.rightOrigin.client)) return this.rightOrigin.client;
		if (this.parent && this.parent.constructor === NT && this.id.client !== this.parent.client && this.parent.clock >= ZT(n, this.parent.client)) return this.parent.client;
		if (this.origin &&= (this.left = rE(t, n, this.origin), this.left.lastId), this.rightOrigin &&= (this.right = nE(t, this.rightOrigin), this.right.id), this.left && this.left.constructor === BD || this.right && this.right.constructor === BD) this.parent = null;
		else if (!this.parent) this.left && this.left.constructor === e ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === e && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
		else if (this.parent.constructor === NT) {
			let e = eE(n, this.parent);
			e.constructor === BD ? this.parent = null : this.parent = e.content.type;
		}
		return null;
	}
	integrate(e, t) {
		if (t > 0 && (this.id.clock += t, this.left = rE(e, e.doc.store, q(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(t), this.length -= t), this.parent) {
			if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
				let t = this.left, n;
				if (t !== null) n = t.right;
				else if (this.parentSub !== null) for (n = this.parent._map.get(this.parentSub) || null; n !== null && n.left !== null;) n = n.left;
				else n = this.parent._start;
				let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
				for (; n !== null && n !== this.right;) {
					if (i.add(n), r.add(n), PT(this.origin, n.origin)) {
						if (n.id.client < this.id.client) t = n, r.clear();
						else if (PT(this.rightOrigin, n.rightOrigin)) break;
					} else if (n.origin !== null && i.has(eE(e.doc.store, n.origin))) r.has(eE(e.doc.store, n.origin)) || (t = n, r.clear());
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
			this.right === null ? this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)) : this.right.left = this, this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), QT(e.doc.store, this), this.content.integrate(e, this), cE(e, this.parent, this.parentSub), (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
		} else new BD(this.id, this.length).integrate(e, 0);
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
		return this.length === 1 ? this.id : q(this.id.client, this.id.clock + this.length - 1);
	}
	mergeWith(e) {
		if (this.constructor === e.constructor && PT(e.origin, this.lastId) && this.right === e && PT(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
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
			this.countable && this.parentSub === null && (t._length -= this.length), this.markDeleted(), sT(e.deleteSet, this.id.client, this.id.clock, this.length), cE(e, t, this.parentSub), this.content.delete(e);
		}
	}
	gc(e, t) {
		if (!this.deleted) throw uS();
		this.content.gc(e), t ? iE(e, this, new BD(this.id, this.length)) : this.content = new UD(this.length);
	}
	write(e, t) {
		let n = t > 0 ? q(this.id.client, this.id.clock + t - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, a = this.content.getRef() & 31 | (n === null ? 0 : 128) | (r === null ? 0 : 64) | (i === null ? 0 : 32);
		if (e.writeInfo(a), n !== null && e.writeLeftID(n), r !== null && e.writeRightID(r), n === null && r === null) {
			let t = this.parent;
			if (t._item !== void 0) {
				let n = t._item;
				if (n === null) {
					let n = FT(t);
					e.writeParentInfo(!0), e.writeString(n);
				} else e.writeParentInfo(!1), e.writeLeftID(n.id);
			} else t.constructor === String ? (e.writeParentInfo(!0), e.writeString(t)) : t.constructor === NT ? (e.writeParentInfo(!1), e.writeLeftID(t)) : uS();
			i !== null && e.writeString(i);
		}
		this.content.write(e, t);
	}
}, bO = (e, t) => xO[t & 31](e), xO = [
	() => {
		uS();
	},
	WD,
	$D,
	HD,
	iO,
	YD,
	ZD,
	mO,
	nO,
	qD,
	() => {
		uS();
	}
], SO = 10, CO = class extends RD {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor ? (this.length += e.length, !0) : !1;
	}
	integrate(e, t) {
		uS();
	}
	write(e, t) {
		e.writeInfo(SO), G(e.restEncoder, this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, wO = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}, TO = "__ $YJS$ __";
wO[TO] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438"), wO[TO] = !0;
//#endregion
//#region node_modules/y-protocols/awareness.js
var EO = () => {
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
}, DO = /[\uD800-\uDBFF]/, OO = /[\uDC00-\uDFFF]/, kO = (e, t) => {
	let n = 0, r = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	for (n > 0 && DO.test(e[n - 1]) && n--; r + n < e.length && r + n < t.length && e[e.length - r - 1] === t[t.length - r - 1];) r++;
	return r > 0 && OO.test(e[e.length - r]) && r--, {
		index: n,
		remove: e.length - n - r,
		insert: t.slice(n, t.length - r)
	};
}, AO = (e, t) => e >>> t | e << 32 - t, jO = (e) => AO(e, 2) ^ AO(e, 13) ^ AO(e, 22), MO = (e) => AO(e, 6) ^ AO(e, 11) ^ AO(e, 25), NO = (e) => AO(e, 7) ^ AO(e, 18) ^ e >>> 3, PO = (e) => AO(e, 17) ^ AO(e, 19) ^ e >>> 10, FO = new Uint32Array([
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
]), IO = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), LO = class {
	constructor() {
		let e = /* @__PURE__ */ new ArrayBuffer(320);
		this._H = new Uint32Array(e, 0, 8), this._H.set(IO), this._W = new Uint32Array(e, 64, 64);
	}
	_updateHash() {
		let e = this._H, t = this._W;
		for (let e = 16; e < 64; e++) t[e] = PO(t[e - 2]) + t[e - 7] + NO(t[e - 15]) + t[e - 16];
		let n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], c = e[6], l = e[7];
		for (let e = 0, u, d; e < 64; e++) u = l + MO(o) + (o & s ^ ~o & c) + FO[e] + t[e] >>> 0, d = jO(n) + (n & r ^ n & i ^ r & i) >>> 0, l = c, c = s, s = o, o = a + u >>> 0, a = i, i = r, r = n, n = u + d >>> 0;
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
		n || (this._W[r - (t % 4 == 0 ? 0 : 1)] |= 128 << (3 - t % 4) * 8), this._W[14] = e.byteLength / bx, this._W[15] = e.byteLength * 8, this._updateHash();
		let i = /* @__PURE__ */ new Uint8Array(32);
		for (let e = 0; e < this._H.length; e++) for (let t = 0; t < 4; t++) i[e * 4 + t] = this._H[e] >>> (3 - t) * 8;
		return i;
	}
}, RO = (e) => new LO().digest(e), X = new M("y-sync"), zO = new M("y-undo");
new M("yjs-cursor");
var BO = (e) => {
	for (let t = 6; t < e.length; t++) e[t % 6] = e[t % 6] ^ e[t];
	return e.slice(0, 6);
}, VO = (e) => dC(BO(RO(fC(e)))), HO = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && t.sv.get(e.id.client) > e.id.clock && !iT(t.ds, e.id), UO = [{
	light: "#ecd44433",
	dark: "#ecd444"
}], WO = (e, t, n) => {
	if (!e.has(n)) {
		if (e.size < t.length) {
			let n = Jb();
			e.forEach((e) => n.add(e)), t = t.filter((e) => !n.has(e));
		}
		e.set(n, jS(t));
	}
	return e.get(n);
}, GO = (e, { colors: t = UO, colorMapping: n = /* @__PURE__ */ new Map(), permanentUserData: r = null, onFirstRender: i = () => {}, mapping: a } = {}) => {
	let o = !1, s = new ZO(e, a), c = new j({
		props: { editable: (e) => {
			let t = X.getState(e);
			return t.snapshot == null && t.prevSnapshot == null;
		} },
		key: X,
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
				let n = e.getMeta(X);
				if (n !== void 0) {
					t = Object.assign({}, t);
					for (let e in n) t[e] = n[e];
				}
				return t.addToHistory = e.getMeta("addToHistory") !== !1, t.isChangeOrigin = n !== void 0 && !!n.isChangeOrigin, t.isUndoRedoOperation = n !== void 0 && !!n.isChangeOrigin && !!n.isUndoRedoOperation, s.prosemirrorView !== null && n !== void 0 && (n.snapshot != null || n.prevSnapshot != null) && Pw(0, () => {
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
						let t = zO.getState(e.state), n = t && t.undoManager;
						n && n.stopCapturing();
					}
					s.mux(() => {
						t.doc.transact((n) => {
							n.meta.set("addToHistory", t.addToHistory), s._prosemirrorChanged(e.state.doc);
						}, X);
					});
				}
			},
			destroy: () => {
				s.destroy();
			}
		})
	});
	return c;
}, KO = (e, t, n, r) => {
	if (n == null || !(r === null || n > 1 && r <= 1 || jk(t, e, n, r))) return r;
	let i = Ak(t, e, n);
	return i === null ? r : i;
}, qO = (e, t, n, r) => {
	if (t !== null && t.anchor !== null && t.head !== null) if (t.type === "all") e.setSelection(new Dn(e.doc));
	else if (t.type === "node") {
		let r = Ek(n.doc, n.type, t.anchor, n.mapping);
		r !== null && e.setSelection(JO(e, r));
	} else if (t.type === "nodeRange") {
		let r = YO(e, Ek(n.doc, n.type, t.anchor, n.mapping), Ek(n.doc, n.type, t.head, n.mapping), t.depth);
		r !== null && e.setSelection(r);
	} else {
		let i = Ek(n.doc, n.type, t.anchor, n.mapping), a = Ek(n.doc, n.type, t.head, n.mapping);
		r != null && (i = KO(e.doc, r, t.absAnchor, i), a = KO(e.doc, r, t.absHead, a)), i === null && (i = a), a === null && (a = i), i !== null && a !== null && e.setSelection(k.between(e.doc.resolve(i), e.doc.resolve(a)));
	}
}, JO = (e, t) => {
	let n = e.doc.resolve(t);
	return n.nodeAfter ? A.create(e.doc, t) : k.near(n);
}, YO = (e, t, n, r) => {
	if (t === null || n === null) return null;
	let i = Math.min(Math.max(t, 0), e.doc.content.size), a = Math.min(Math.max(n, 0), e.doc.content.size);
	try {
		let t = O.fromJSON(e.doc, {
			type: "nodeRange",
			anchor: i,
			head: a,
			depth: r
		});
		return t.ranges.length ? t : k.near(e.doc.resolve(i));
	} catch {
		return k.near(e.doc.resolve(i));
	}
}, XO = (e, t) => {
	let n = t.selection.jsonID;
	return {
		type: n,
		depth: n === "nodeRange" ? t.selection.depth : void 0,
		anchor: Ck(t.selection.anchor, e.type, e.mapping),
		head: Ck(t.selection.head, e.type, e.mapping),
		absAnchor: t.selection.anchor,
		absHead: t.selection.head
	};
}, ZO = class {
	constructor(e, t = /* @__PURE__ */ new Map()) {
		this.type = e, this.prosemirrorView = null, this.mux = EO(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
			this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = XO(this, this.prosemirrorView.state));
		}, this.afterAllTransactions = () => {
			this.beforeTransactionSelection = null;
		}, this._domSelectionInView = null;
	}
	get _tr() {
		return this.prosemirrorView.state.tr.setMeta("addToHistory", !1);
	}
	_isLocalCursorInView() {
		return this.prosemirrorView.hasFocus() ? (nC && this._domSelectionInView === null && (Pw(0, () => {
			this._domSelectionInView = null;
		}), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
	}
	_isDomSelectionInView() {
		let e = this.prosemirrorView._root.getSelection();
		if (e == null || e.anchorNode == null) return !1;
		let t = this.prosemirrorView._root.createRange();
		t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
		let n = t.getBoundingClientRect(), r = Dw.documentElement;
		return n.bottom >= 0 && n.right >= 0 && n.left <= (window.innerWidth || r.clientWidth || 0) && n.top <= (window.innerHeight || r.clientHeight || 0);
	}
	renderSnapshot(e, t) {
		t ||= GT(cT(), /* @__PURE__ */ new Map()), this.prosemirrorView.dispatch(this._tr.setMeta(X, {
			snapshot: e,
			prevSnapshot: t
		}));
	}
	unrenderSnapshot() {
		this.mapping.clear(), this.mux(() => {
			let e = this.type.toArray().map((e) => $O(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), t = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new b(m.from(e), 0, 0));
			t.setMeta(X, {
				snapshot: null,
				prevSnapshot: null
			}), this.prosemirrorView.dispatch(t);
		});
	}
	_forceRerender() {
		this.mapping.clear(), this.mux(() => {
			let e = this.beforeTransactionSelection === null ? this.prosemirrorView.state.selection : null, t = this.type.toArray().map((e) => $O(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), n = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new b(m.from(t), 0, 0));
			if (e) {
				let t = ax(ox(e.anchor, 0), n.doc.content.size), r = ax(ox(e.head, 0), n.doc.content.size);
				n.setSelection(k.create(n.doc, t, r));
			}
			this.prosemirrorView.dispatch(n.setMeta(X, {
				isChangeOrigin: !0,
				binding: this
			}));
		});
	}
	_renderSnapshot(e, t, n) {
		let r = this.doc, i = this.type;
		if (e ||= KT(this.doc), e instanceof Uint8Array || t instanceof Uint8Array) if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && uS(), r = new mT({ gc: !1 }), DT(r, t), t = KT(r), DT(r, e), e = KT(r), i._item === null) {
			let e = Array.from(this.doc.share.keys()).find((e) => this.doc.share.get(e) === this.type);
			i = r.getXmlFragment(e);
		} else {
			let e = r.store.clients.get(i._item.id.client) ?? [];
			i = e[$T(e, i._item.id.clock)].content.type;
		}
		this.mapping.clear(), this.mux(() => {
			r.transact((r) => {
				let a = n.permanentUserData;
				a && a.dss.forEach((e) => {
					nT(r, e, (e) => {});
				});
				let o = (e, t) => {
					let r = e === "added" ? a.getUserByClientId(t.client) : a.getUserByDeletedId(t);
					return {
						user: r,
						type: e,
						color: WO(n.colorMapping, n.colors, r)
					};
				}, s = VE(i, new WT(t.ds, e.sv)).map((n) => !n._item.deleted || HO(n._item, e) || HO(n._item, t) ? $O(n, this.prosemirrorView.state.schema, {
					mapping: /* @__PURE__ */ new Map(),
					isOMark: /* @__PURE__ */ new Map()
				}, e, t, o) : null).filter((e) => e !== null), c = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new b(m.from(s), 0, 0));
				this.prosemirrorView.dispatch(c.setMeta(X, { isChangeOrigin: !0 }));
			}, X);
		});
	}
	_typeChanged(e, t) {
		if (this.prosemirrorView == null) return;
		let n = X.getState(this.prosemirrorView.state);
		if (e.length === 0 || n.snapshot != null || n.prevSnapshot != null) {
			this.renderSnapshot(n.snapshot, n.prevSnapshot);
			return;
		}
		this.mux(() => {
			let e = (e, t) => this.mapping.delete(t);
			nT(t, t.deleteSet, (e) => {
				if (e.constructor === Y) {
					let t = e.content.type;
					t && this.mapping.delete(t);
				}
			}), t.changed.forEach(e), t.changedParentTypes.forEach(e), this.mapping.clear();
			let n = this.type.toArray().map((e) => QO(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), r = this.prosemirrorView.state.doc, i = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new b(m.from(n), 0, 0));
			qO(i, this.beforeTransactionSelection, this, r), i = i.setMeta(X, {
				isChangeOrigin: !0,
				isUndoRedoOperation: t.origin instanceof gE
			}), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && i.scrollIntoView(), this.prosemirrorView.dispatch(i);
		});
	}
	_prosemirrorChanged(e) {
		this.doc.transact(() => {
			_k(this.doc, this.type, e, this), this.beforeTransactionSelection = XO(this, this.prosemirrorView.state);
		}, X);
	}
	initView(e) {
		this.prosemirrorView != null && this.destroy(), this.prosemirrorView = e, this.doc.on("beforeAllTransactions", this.beforeAllTransactions), this.doc.on("afterAllTransactions", this.afterAllTransactions), this.type.observeDeep(this._observeFunction);
	}
	destroy() {
		this.prosemirrorView != null && (this.prosemirrorView = null, this.type.unobserveDeep(this._observeFunction), this.doc.off("beforeAllTransactions", this.beforeAllTransactions), this.doc.off("afterAllTransactions", this.afterAllTransactions));
	}
}, QO = (e, t, n, r, i, a) => {
	let o = n.mapping.get(e);
	if (o === void 0) {
		if (e instanceof jD) return $O(e, t, n, r, i, a);
		throw lS();
	}
	return o;
}, $O = (e, t, n, r, i, a) => {
	let o = [], s = (e) => {
		if (e instanceof jD) {
			let s = QO(e, t, n, r, i, a);
			s !== null && o.push(s);
		} else {
			let s = e._item.right?.content?.type;
			s instanceof ED && !s._item.deleted && s._item.id.client === s.doc.clientID && (e.applyDelta([{ retain: e.length }, ...s.toDelta()]), s.doc.transact((e) => {
				s._item.delete(e);
			}));
			let c = ek(e, t, n, r, i, a);
			c !== null && c.forEach((e) => {
				e !== null && o.push(e);
			});
		}
	};
	r === void 0 || i === void 0 ? e.toArray().forEach(s) : VE(e, new WT(i.ds, r.sv)).forEach(s);
	try {
		let s = e.getAttributes(r);
		r !== void 0 && (HO(e._item, r) ? HO(e._item, i) || (s.ychange = a ? a("added", e._item.id) : { type: "added" }) : s.ychange = a ? a("removed", e._item.id) : { type: "removed" });
		let c = t.node(e.nodeName, s, o);
		return n.mapping.set(e, c), c;
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, X), n.mapping.delete(e), null;
	}
}, ek = (e, t, n, r, i, a) => {
	let o = [], s = e.toDelta(r, i, a);
	try {
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			o.push(t.text(n.insert, hk(n.attributes, t)));
		}
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, X), null;
	}
	return o;
}, tk = (e, t) => {
	let n = new ID(), r = e.map((e) => ({
		insert: e.text,
		attributes: gk(e.marks, t)
	}));
	return n.applyDelta(r), t.mapping.set(n, e), n;
}, nk = (e, t) => {
	let n = new jD(e.type.name);
	for (let t in e.attrs) {
		let r = e.attrs[t];
		r !== null && t !== "ychange" && n.setAttribute(t, r);
	}
	return n.insert(0, ok(e).map((e) => rk(e, t))), t.mapping.set(n, e), n;
}, rk = (e, t) => e instanceof Array ? tk(e, t) : nk(e, t), ik = (e) => typeof e == "object" && !!e, ak = (e, t) => {
	let n = Object.keys(e).filter((t) => e[t] !== null), r = n.length === Object.keys(t).filter((e) => t[e] !== null).length;
	for (let i = 0; i < n.length && r; i++) {
		let a = n[i], o = e[a], s = t[a];
		r = a === "ychange" || o === s || ik(o) && ik(s) && ak(o, s);
	}
	return r;
}, ok = (e) => {
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
}, sk = (e, t) => {
	let n = e.toDelta();
	return n.length === t.length && n.every((e, n) => e.insert === t[n].text && US(e.attributes || {}).length === t[n].marks.length && qS(e.attributes, (e, r) => {
		let i = mk(r), a = t[n].marks;
		return a.find((e) => e.type.name === i) ? ak(e, a.find((e) => e.type.name === i)?.attrs) : !1;
	}));
}, ck = (e, t) => {
	if (e instanceof jD && !(t instanceof Array) && vk(e, t)) {
		let n = ok(t);
		return e._length === n.length && ak(e.getAttributes(), t.attrs) && e.toArray().every((e, t) => ck(e, n[t]));
	}
	return e instanceof ID && t instanceof Array && sk(e, t);
}, lk = (e, t) => e === t || e instanceof Array && t instanceof Array && e.length === t.length && e.every((e, n) => t[n] === e), uk = (e, t, n) => {
	let r = e.toArray(), i = ok(t), a = i.length, o = r.length, s = ax(o, a), c = 0, l = 0, u = !1;
	for (; c < s; c++) {
		let e = r[c], t = i[c];
		if (lk(n.mapping.get(e), t)) u = !0;
		else if (!ck(e, t)) break;
	}
	for (; c + l < s; l++) {
		let e = r[o - l - 1], t = i[a - l - 1];
		if (lk(n.mapping.get(e), t)) u = !0;
		else if (!ck(e, t)) break;
	}
	return {
		equalityFactor: c + l,
		foundMappedChild: u
	};
}, dk = (e) => {
	let t = "", n = e._start, r = {};
	for (; n !== null;) n.deleted || (n.countable && n.content instanceof rO ? t += n.content.str : n.content instanceof XD && (r[n.content.key] = null)), n = n.right;
	return {
		str: t,
		nAttrs: r
	};
}, fk = (e, t, n) => {
	n.mapping.set(e, t);
	let { nAttrs: r, str: i } = dk(e), a = t.map((e) => ({
		insert: e.text,
		attributes: Object.assign({}, r, gk(e.marks, n))
	})), { insert: o, remove: s, index: c } = kO(i, a.map((e) => e.insert).join(""));
	e.delete(c, s), e.insert(c, o), e.applyDelta(a.map((e) => ({
		retain: e.insert.length,
		attributes: e.attributes
	})));
}, pk = /(.*)(--[a-zA-Z0-9+/=]{8})$/, mk = (e) => pk.exec(e)?.[1] ?? e, hk = (e, t) => {
	let n = [];
	for (let r in e) n.push(t.mark(mk(r), e[r]));
	return n;
}, gk = (e, t) => {
	let n = {};
	return e.forEach((e) => {
		if (e.type.name !== "ychange") {
			let r = Gb(t.isOMark, e.type, () => !e.type.excludes(e.type));
			n[r ? `${e.type.name}--${VO(e.toJSON())}` : e.type.name] = e.attrs;
		}
	}), n;
}, _k = (e, t, n, r) => {
	if (t instanceof jD && t.nodeName !== n.type.name) throw Error("node name mismatch!");
	if (r.mapping.set(t, n), t instanceof jD) {
		let e = t.getAttributes(), r = n.attrs;
		for (let n in r) r[n] === null ? t.removeAttribute(n) : e[n] !== r[n] && n !== "ychange" && t.setAttribute(n, r[n]);
		for (let n in e) r[n] === void 0 && t.removeAttribute(n);
	}
	let i = ok(n), a = i.length, o = t.toArray(), s = o.length, c = ax(a, s), l = 0, u = 0;
	for (; l < c; l++) {
		let e = o[l], t = i[l];
		if (!lk(r.mapping.get(e), t)) if (ck(e, t)) r.mapping.set(e, t);
		else break;
	}
	for (; u + l + 1 < c; u++) {
		let e = o[s - u - 1], t = i[a - u - 1];
		if (!lk(r.mapping.get(e), t)) if (ck(e, t)) r.mapping.set(e, t);
		else break;
	}
	e.transact(() => {
		for (; s - l - u > 0 && a - l - u > 0;) {
			let n = o[l], c = i[l], d = o[s - u - 1], f = i[a - u - 1];
			if (n instanceof ID && c instanceof Array) sk(n, c) || fk(n, c, r), l += 1;
			else {
				let i = n instanceof jD && vk(n, c), a = d instanceof jD && vk(d, f);
				if (i && a) {
					let e = uk(n, c, r), t = uk(d, f, r);
					e.foundMappedChild && !t.foundMappedChild ? a = !1 : !e.foundMappedChild && t.foundMappedChild || e.equalityFactor < t.equalityFactor ? i = !1 : a = !1;
				}
				i ? (_k(e, n, c, r), l += 1) : a ? (_k(e, d, f, r), u += 1) : (r.mapping.delete(t.get(l)), t.delete(l, 1), t.insert(l, [rk(c, r)]), l += 1);
			}
		}
		let n = s - l - u;
		if (s === 1 && a === 0 && o[0] instanceof ID ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : n > 0 && (t.slice(l, l + n).forEach((e) => r.mapping.delete(e)), t.delete(l, n)), l + u < a) {
			let e = [];
			for (let t = l; t < a - u; t++) e.push(rk(i[t], r));
			t.insert(l, e);
		}
	}, X);
}, vk = (e, t) => !(t instanceof Array) && e.nodeName === t.type.name, yk = null, bk = class {
	constructor(e, t, n) {
		this.view = e, this.key = t, this.value = n;
	}
	apply() {
		let e = X.getState(this.view.state);
		if (e && e.binding && !e.binding.isDestroyed) {
			let e = this.view.state.tr;
			e.setMeta(this.key, this.value), this.view.dispatch(e);
		}
	}
}, xk = class e {
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
		let t = yk;
		yk = null;
		let n = [];
		return t.forEach((e, t) => {
			e.forEach((e, r) => {
				n.push(new bk(t, r, e));
			});
		}), new e(n);
	}
}, Sk = (e = xk.fromViewsToUpdate(), t = !1) => {
	let n = !0;
	for (; !e.isEmpty();) {
		let r = e.getFirst();
		try {
			r.apply();
		} catch (r) {
			if (r instanceof RangeError) {
				t && n && e.dequeueFirst(), e.isEmpty() || Pw(0, () => Sk(e, !0));
				return;
			}
			throw r;
		}
		n = !1, e.dequeueFirst();
	}
}, Ck = (e, t, n) => {
	if (e === 0) return VT(t, 0, -1);
	let r = t._first === null ? null : t._first.content.type;
	for (; r !== null && t !== r;) {
		if (r instanceof ID) {
			if (r._length >= e) return VT(r, e, -1);
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
				if (e === 1 && r._length === 0 && i > 1) return new LT(r._item === null ? null : r._item.id, r._item === null ? FT(r) : null, null);
				if (e -= i, r._item !== null && r._item.next !== null) r = r._item.next.content.type;
				else {
					if (e === 0) return r = r._item === null ? r : r._item.parent, new LT(r._item === null ? null : r._item.id, r._item === null ? FT(r) : null, null);
					do
						r = r._item.parent, e--;
					while (r !== t && r._item.next === null);
					r !== t && (r = r._item.next.content.type);
				}
			}
		}
		if (r === null) throw uS();
		if (e === 0 && r.constructor !== ID && r !== t) return Tk(r._item.parent, r._item);
	}
	return VT(t, t._length, -1);
}, wk = (e, t, n) => {
	if (n === null) return !1;
	let r = UT(t, e);
	return r !== null && r.type instanceof ID && t.item !== null && n <= 1;
}, Tk = (e, t) => {
	let n = null, r = null;
	return e._item === null ? r = FT(e) : n = q(e._item.id.client, e._item.id.clock), new LT(n, r, t.id);
}, Ek = (e, t, n, r) => {
	let i = UT(n, e);
	if (i === null || i.type !== t && !IT(t, i.type._item)) return null;
	let a = i.type, o = 0;
	if (a.constructor === ID) o = i.index;
	else if (a._item === null || !a._item.deleted) {
		let e = a._first, t = 0;
		for (; t < a._length && t < i.index && e !== null;) {
			if (!e.deleted) {
				let n = e.content.type;
				if (t++, n instanceof ID) o += n._length;
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
				if (!t.deleted) if (e instanceof ID) o += e._length;
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
	return wk(e, n, s) ? null : s;
}, Dk = (e, t) => {
	if (e === t) return !0;
	let n = Object.keys(e);
	return n.length === Object.keys(t).length && n.every((n) => e[n] === t[n]);
}, Ok = (e) => {
	let t = e.type.spec.attrs || {};
	return Object.keys(e.attrs).some((n) => {
		let r = t[n];
		return r == null || !Object.prototype.hasOwnProperty.call(r, "default") || r.default !== e.attrs[n];
	});
}, kk = (e, t, n) => {
	let r = t + 1, i = n;
	for (let t = 1; t < e.depth; t++) {
		let n = e.index(t);
		if (n >= i.childCount) return null;
		for (let e = 0; e < n; e++) r += i.child(e).nodeSize;
		if (r += 1, i = i.child(n), i.type !== e.node(t + 1).type) return null;
	}
	return i.isTextblock ? r + Math.min(e.parentOffset, i.content.size) : null;
}, Ak = (e, t, n) => {
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
		return kk(o, e, t);
	}, c = (n, r = !1) => {
		let a = 0;
		for (let t = 0; t <= i; t++) n(e.child(t)) && a++;
		let o = 0, c = -1, l = null, u = 0;
		for (let e = 0; e < t.childCount; e++) {
			let r = t.child(e);
			n(r) && (o++, o === a && (c = u, l = r)), u += r.nodeSize;
		}
		return l === null || r && (a !== 1 || o !== 1) ? null : s(c, l);
	}, l = (e) => e.type === a.type && Dk(e.attrs, a.attrs), u = a.textContent, d = c((e) => l(e) && e.textContent === u);
	if (d !== null) return d;
	let f = c((e) => e.type === a.type && e.textContent === u);
	if (f !== null) return f;
	if (Ok(a)) {
		let e = c(l, !0);
		if (e !== null) return e;
	}
	return c((e) => l(e) && u !== "" && e.textContent !== "" && (u.startsWith(e.textContent) || e.textContent.startsWith(u)), !0);
}, jk = (e, t, n, r) => {
	if (r === null) return !1;
	let i = e.resolve(n), a = t.resolve(r);
	if (!i.parent.isTextblock) return !1;
	if (!a.parent.isTextblock || i.parent.textContent !== a.parent.textContent || i.parentOffset !== 0 && a.parentOffset === 0) return !0;
	let o = i.parentOffset === 0 && a.parentOffset === 0, s = i.parentOffset !== a.parentOffset || i.parent.type !== a.parent.type || !Dk(i.parent.attrs, a.parent.attrs);
	if (o || s) {
		let i = Ak(e, t, n);
		return i !== null && i !== r;
	}
	return !1;
}, Mk = (e) => {
	let t = zO.getState(e).undoManager;
	if (t != null) return t.undo(), !0;
}, Nk = (e) => {
	let t = zO.getState(e).undoManager;
	if (t != null) return t.redo(), !0;
}, Pk = /* @__PURE__ */ new Set(["paragraph"]), Fk = (e, t) => !(e instanceof Y) || !(e.content instanceof pO) || !(e.content.type instanceof ED || e.content.type instanceof jD && t.has(e.content.type.nodeName)) || e.content.type._length === 0, Ik = ({ protectedNodes: e = Pk, trackedOrigins: t = [], undoManager: n = null } = {}) => new j({
	key: zO,
	state: {
		init: (r, i) => {
			let a = X.getState(i), o = n;
			if (!o) {
				let n = a.doc, r = new Set(n ? n._observers.get("destroy") : []);
				o = new gE(a.type, {
					trackedOrigins: new Set([X].concat(t)),
					deleteFilter: (t) => Fk(t, e),
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
			let i = X.getState(r).binding, a = t.undoManager, o = a.undoStack.length > 0, s = a.redoStack.length > 0;
			return i ? {
				undoManager: a,
				prevSel: XO(i, n),
				hasUndoOps: o,
				hasRedoOps: s
			} : o !== t.hasUndoOps || s !== t.hasRedoOps ? Object.assign({}, t, {
				hasUndoOps: a.undoStack.length > 0,
				hasRedoOps: a.redoStack.length > 0
			}) : t;
		}
	},
	view: (e) => {
		let t = X.getState(e.state), n = zO.getState(e.state).undoManager;
		return n.on("stack-item-added", ({ stackItem: n }) => {
			let r = t.binding;
			r && n.meta.set(r, zO.getState(e.state).prevSel);
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
function Lk(e) {
	return !!e.getMeta(X);
}
function Rk(e, t) {
	let n = X.getState(e);
	return Ek(n.doc, n.type, t, n.binding.mapping) || 0;
}
function zk(e, t) {
	let n = X.getState(e);
	return Ck(t, n.type, n.binding.mapping);
}
var Bk = class e extends ku {
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
function Vk(e, t) {
	return new Bk(e, zk(t, e));
}
function Hk(e, t, n) {
	let r = e instanceof Bk ? e.yRelativePosition : null;
	if (Lk(t) && r) return {
		position: new Bk(Rk(n, r), r),
		mapResult: null
	};
	let i = Au(e, t), a = i.position.position;
	return {
		position: new Bk(a, r ?? zk(n, a)),
		mapResult: i.mapResult
	};
}
L.create({
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
		this.editor.utils.getUpdatedPosition = (e, t) => Hk(e, t, this.editor.state), this.editor.utils.createMappablePosition = (e) => Vk(e, this.editor.state);
	},
	addCommands() {
		return {
			undo: () => ({ tr: e, state: t, dispatch: n }) => (e.setMeta("preventDispatch", !0), zO.getState(t).undoManager.undoStack.length === 0 ? !1 : !n || Mk(t)),
			redo: () => ({ tr: e, state: t, dispatch: n }) => (e.setMeta("preventDispatch", !0), zO.getState(t).undoManager.redoStack.length === 0 ? !1 : !n || Nk(t))
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
		let e = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), t = Ik(this.options.yUndoOptions), n = t.spec.view;
		return t.spec.view = (e) => {
			let { undoManager: t } = zO.getState(e.state);
			t.restore &&= (t.restore(), () => {});
			let r = n ? n(e) : void 0;
			return { destroy: () => {
				let e = t.trackedOrigins.has(t), n = t._observers;
				t.restore = () => {
					e && t.trackedOrigins.add(t), t.doc.on("afterTransaction", t.afterTransactionHandler), t._observers = n;
				}, r?.destroy && r.destroy();
			} };
		}, [
			GO(e, {
				...this.options.ySyncOptions,
				onFirstRender: this.options.onFirstRender
			}),
			t,
			this.editor.options.enableContentCheck && new j({
				key: new M("filterInvalidContent"),
				filterTransaction: (t) => {
					if (!Lk(t)) return !0;
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
function Uk(e) {
	if (!e.length) return N.empty;
	let t = [], n = e[0].$from.node(0);
	return e.forEach((e) => {
		let n = e.$from.pos, r = e.$from.nodeAfter;
		r && t.push(ms.node(n, n + r.nodeSize, { class: "ProseMirror-selectednoderange" }));
	}), N.create(n, t);
}
function Wk(e, t, n) {
	let r = n.isText || n.isAtom ? 0 : 1;
	return {
		start: e + r,
		end: e + t - r
	};
}
function Gk(e, t, n, r = {}) {
	let i = [], a = e.node(0), { extendOnBoundaryOverlap: o = !0 } = r;
	typeof n == "number" && n >= 0 || (n = e.sameParent(t) ? Math.max(0, e.sharedDepth(t.pos) - 1) : e.sharedDepth(t.pos));
	let s = new le(e, t, n), c = s.depth === 0 ? 0 : a.resolve(s.start).posAtIndex(0);
	return s.parent.forEach((n, r) => {
		let l = c + r, u = l + n.nodeSize, d = Wk(l, n.nodeSize, n), f = o ? t.pos >= d.start && e.pos <= d.end : t.pos > d.start && e.pos < d.end;
		if (l < s.start || l >= s.end || !f) return;
		let p = new Sn(a.resolve(l), a.resolve(u));
		i.push(p);
	}), i;
}
var Kk = class e {
	constructor(e, t, n) {
		this.anchor = e, this.head = t, this.depth = n ?? 0;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head), this.depth);
	}
	resolve(e) {
		return new qk(e.resolve(this.anchor), e.resolve(this.head), this.depth);
	}
}, qk = class e extends O {
	constructor(e, t, n, r = 1) {
		let { doc: i } = e, a = e === t, o = e.pos === i.content.size && t.pos === i.content.size, s = a && !o ? i.resolve(t.pos + (r > 0 ? 1 : -1)) : t, c = a && o ? i.resolve(e.pos - (r > 0 ? 1 : -1)) : e, l = Gk(c.min(s), c.max(s), n), u = s.pos >= e.pos ? l[0].$from : l[l.length - 1].$to, d = s.pos >= e.pos ? l[l.length - 1].$to : l[0].$from;
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
		return new Kk(this.anchor, this.head, this.depth);
	}
};
qk.prototype.visible = !1;
try {
	O.jsonID("nodeRange", qk);
} catch {}
function Jk(e) {
	return e instanceof qk;
}
L.create({
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
				if (!Jk(a)) {
					let e = qk.create(i, s, c, t, -1);
					return o.setSelection(e), n.dispatch(o), !0;
				}
				let l = a.extendBackwards();
				return o.setSelection(l), n.dispatch(o), !0;
			},
			"Shift-ArrowDown": ({ editor: e }) => {
				let { depth: t } = this.options, { view: n, state: r } = e, { doc: i, selection: a, tr: o } = r, { anchor: s, head: c } = a;
				if (!Jk(a)) {
					let e = qk.create(i, s, c, t);
					return o.setSelection(e), n.dispatch(o), !0;
				}
				let l = a.extendForwards();
				return o.setSelection(l), n.dispatch(o), !0;
			},
			"Mod-a": ({ editor: e }) => {
				let { depth: t } = this.options, { view: n, state: r } = e, { doc: i, tr: a } = r, o = qk.create(i, 0, i.content.size, t);
				return a.setSelection(o), n.dispatch(a), !0;
			}
		};
	},
	onSelectionUpdate() {
		let { selection: e } = this.editor.state;
		Jk(e) && this.editor.view.dom.classList.add("ProseMirror-noderangeselection");
	},
	addProseMirrorPlugins() {
		let e = !1, t = !1;
		return [new j({
			key: new M("nodeRange"),
			props: {
				attributes: () => e ? { class: "ProseMirror-noderangeselection" } : { class: "" },
				handleDOMEvents: { mousedown: (e, n) => {
					let { key: r } = this.options, i = /Mac/.test(navigator.platform), a = !!n.shiftKey, o = !!n.ctrlKey, s = !!n.altKey, c = !!n.metaKey;
					return (r == null || r === "Shift" && a || r === "Control" && o || r === "Alt" && s || r === "Meta" && c || r === "Mod" && (i ? c : o)) && (t = !0), t && document.addEventListener("mouseup", () => {
						t = !1;
						let { state: n } = e, { doc: r, selection: i, tr: a } = n, { $anchor: o, $head: s } = i;
						if (o.sameParent(s)) return;
						let c = qk.create(r, o.pos, s.pos, this.options.depth);
						a.setSelection(c), e.dispatch(a);
					}, { once: !0 }), !1;
				} },
				decorations: (n) => {
					let { selection: r } = n, i = Jk(r);
					if (e = !1, !t) return i ? (e = !0, Uk(r.ranges)) : null;
					let { $from: a, $to: o } = r;
					if (!i && a.sameParent(o)) return null;
					let s = Gk(a, o, this.options.depth);
					return s.length ? (e = !0, Uk(s)) : null;
				}
			}
		})];
	}
});
//#endregion
//#region node_modules/@tiptap/extension-drag-handle/dist/index.js
function Yk(e, t) {
	let n = getComputedStyle(e);
	if (t) return t.map((e) => e.trim()).filter((e) => e.length > 0).map((e) => `${e}:${n.getPropertyValue(e)};`).join("");
	let r = "";
	for (let e = 0; e < n.length; e += 1) r += `${n[e]}:${n.getPropertyValue(n[e])};`;
	return r;
}
function Xk(e, t) {
	let n = e.cloneNode(!0), r = [e, ...Array.from(e.getElementsByTagName("*"))], i = [n, ...Array.from(n.getElementsByTagName("*"))];
	return r.forEach((e, n) => {
		i[n].style.cssText = Yk(e, t);
	}), n;
}
var Zk = [
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
], Qk = {
	edges: ["left", "top"],
	threshold: 12,
	strength: 500
};
function $k(e) {
	return e === void 0 || e === "left" ? { ...Qk } : e === "right" ? {
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
		...Qk,
		...e
	};
}
function eA(e, t, n) {
	if (n.edges.length === 0) return !1;
	let r = t.getBoundingClientRect(), { threshold: i, edges: a } = n;
	return a.some((t) => t === "left" ? e.x - r.left < i : t === "right" ? r.right - e.x < i : t === "top" ? e.y - r.top < i : t === "bottom" && r.bottom - e.y < i);
}
function tA(e, t, n, r) {
	return !t || n.edges.length === 0 ? 0 : eA(e, t, n) ? n.strength * r : 0;
}
var nA = 1e3;
function rA(e, t, n, r) {
	let i = nA, a = !1;
	if (t.every((t) => {
		let n = t.evaluate(e);
		return i -= n, i <= 0 ? (a = !0, !1) : !0;
	}), a) return -1;
	let o = e.view.nodeDOM(e.pos);
	return i -= tA(r, o, n, e.depth), i <= 0 ? -1 : i;
}
function iA(e, t, n) {
	return Array.from({ length: t }, (e, n) => t - 1 - n).some((t) => n.includes(e.node(t).type.name));
}
function aA(e, t, n) {
	if (!Number.isFinite(t.x) || !Number.isFinite(t.y)) return null;
	let r = e.posAtCoords({
		left: t.x,
		top: t.y
	});
	if (!r) return null;
	let { doc: i } = e.state, a = i.resolve(r.pos), o = [];
	n.defaultRules && o.push(...Zk), o.push(...n.rules);
	let s = Array.from({ length: a.depth }, (e, t) => a.depth - t).map((r) => {
		let i = a.node(r), s = a.before(r);
		if (n.allowedContainers && r > 0 && !iA(a, r, n.allowedContainers)) return null;
		let c = r > 0 ? a.node(r - 1) : null, l = r > 0 ? a.index(r - 1) : 0, u = c ? c.childCount : 1, d = rA({
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
		if (n.allowedContainers && (p = iA(a, l, n.allowedContainers)), p) {
			let r = rA({
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
function oA(e, t) {
	let n = e;
	for (; n?.parentElement && n.parentElement !== t.dom;) n = n.parentElement;
	if (n?.parentElement === t.dom && n.pmViewDesc?.node) return n;
}
function sA(e) {
	return Number.isFinite(e.top) && Number.isFinite(e.bottom) && Number.isFinite(e.left) && Number.isFinite(e.right) && e.width > 0 && e.height > 0;
}
function cA(e, t) {
	let n = t === "first" ? e.firstElementChild : e.lastElementChild;
	for (; n;) {
		let e = n.getBoundingClientRect();
		if (sA(e)) return e;
		n = t === "first" ? n.nextElementSibling : n.previousElementSibling;
	}
	return null;
}
function lA(e, t, n, r = 5) {
	if (!Number.isFinite(t) || !Number.isFinite(n)) return null;
	let i = e.dom, a = cA(i, "first"), o = cA(i, "last");
	if (!a || !o) return null;
	let s = Math.min(Math.max(a.top + r, n), o.bottom - r), c = .5, l = Math.abs(a.left - o.left) < c, u = Math.abs(a.right - o.right) < c, d = a;
	l && u && (d = a);
	let f = Math.min(Math.max(d.left + r, t), d.right - r);
	return !Number.isFinite(f) || !Number.isFinite(s) ? null : {
		x: f,
		y: s
	};
}
var uA = (e) => {
	let { x: t, y: n, editor: r, nestedOptions: i } = e, { view: a, state: o } = r, s = lA(a, t, n, 5);
	if (!s) return {
		resultElement: null,
		resultNode: null,
		pos: null
	};
	let { x: c, y: l } = s;
	if (i?.enabled) {
		let e = aA(a, {
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
		let t = oA(e, a);
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
function dA(e, t) {
	let n = e.nodeDOM(t);
	if (n instanceof Element && n !== e.dom) return n;
	let { node: r, offset: i } = e.domAtPos(t), a = r.childNodes[i];
	return a instanceof Element ? a : r instanceof Element ? r : r.nodeType === Node.TEXT_NODE && r.parentElement ? r.parentElement : null;
}
function fA(e, t) {
	let n = dA(e, t);
	return (n ? getComputedStyle(n).direction : getComputedStyle(e.dom).direction) || "ltr";
}
function pA(e) {
	e.parentNode?.removeChild(e);
}
function mA(e, t) {
	return e === "rtl" ? t : 0;
}
function hA(e) {
	return !e || !e.some((e) => {
		let t = e.trim().toLowerCase();
		return t === "margin" || t.startsWith("margin-");
	});
}
function gA(e, t, n, r) {
	let { doc: i } = t.view.state;
	if (n?.enabled && r?.node && r.pos >= 0) {
		let e = r.pos, t = r.pos + r.node.nodeSize;
		return [{
			$from: i.resolve(e),
			$to: i.resolve(t)
		}];
	}
	let a = uA({
		editor: t,
		x: e.clientX,
		y: e.clientY,
		direction: "right",
		nestedOptions: n
	});
	if (!a.resultNode || a.pos === null) return [];
	let o = a.resultNode.isText || a.resultNode.isAtom ? 0 : -1;
	return Gk(i.resolve(a.pos), i.resolve(a.pos + a.resultNode.nodeSize + o), 0, { extendOnBoundaryOverlap: !1 });
}
function _A(e, t, n, r, i) {
	let { view: a } = t;
	if (!e.dataTransfer) return;
	let { empty: o, $from: s, $to: c } = a.state.selection, l = gA(e, t, n, r), u = Gk(s, c, 0, { extendOnBoundaryOverlap: !1 }), d = u.some((e) => l.find((t) => t.$from === e.$from && t.$to === e.$to)), f = o || !d ? l : u;
	if (!f.length) return;
	let { tr: p } = a.state, m = document.createElement("div"), h = f[0].$from.pos, g = f[f.length - 1].$to.pos, _ = fA(a, h);
	m.setAttribute("dir", _);
	let v = n?.enabled && r?.node, y = f.length === 1, b, x;
	v && y ? (b = a.state.doc.slice(h, g), x = A.create(a.state.doc, h)) : (x = qk.create(a.state.doc, h, g), b = x.content());
	let S = hA(i);
	f.forEach((e) => {
		let t = dA(a, e.$from.pos);
		if (!t) return;
		let n = Xk(t, i);
		S && (n.style.margin = "0"), m.append(n);
	}), m.style.position = "absolute", m.style.top = "-10000px", document.body.append(m), e.dataTransfer.clearData();
	let ee = mA(_, m.getBoundingClientRect().width);
	e.dataTransfer.setDragImage(m, ee, 0);
	let te = !1, C = () => {
		te || (te = !0, pA(m), document.removeEventListener("drop", C), document.removeEventListener("dragend", C));
	}, ne = x instanceof A ? x : void 0;
	a.dragging = {
		slice: b,
		move: !0,
		node: ne
	}, p.setSelection(x), a.dispatch(p), document.addEventListener("drop", C), document.addEventListener("dragend", C);
}
var vA = (e, t) => {
	let n = e.resolve(t), { depth: r } = n;
	return r === 0 ? t : n.pos - n.parentOffset - 1;
}, yA = (e, t) => {
	let n = e.nodeAt(t), r = e.resolve(t), { depth: i } = r, a = n;
	for (; i > 0;) {
		let e = r.node(i);
		--i, i === 0 && (a = e);
	}
	return a;
};
function bA(e, t, n) {
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
function xA(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i += 1) r += e.child(i).nodeSize;
	return r;
}
function SA(e) {
	return Jk(e) ? {
		anchorPos: e.from,
		nodeCount: e.ranges.length,
		depth: e.depth ?? 0
	} : null;
}
function CA(e, t, n, r) {
	let i = e.resolve(t), a = i.node(r), o = i.index(r);
	o >= a.childCount && (o = Math.max(0, a.childCount - n));
	let s = Math.min(n, a.childCount - o);
	if (s <= 0) return null;
	let c = i.start(r) + xA(a, 0, o);
	return {
		anchor: c,
		head: c + xA(a, o, o + s),
		count: s
	};
}
function wA(e, t, n, r) {
	try {
		let i = CA(e, t, n, r);
		if (!i) return null;
		let a = qk.create(e, i.anchor, i.head, r);
		return a.ranges.length === n ? a : null;
	} catch {
		return null;
	}
}
var TA = (e, t) => {
	let n = X.getState(e);
	return n ? Ck(t, n.type, n.binding.mapping) : null;
}, EA = (e, t) => {
	let n = X.getState(e);
	return n ? Ek(n.doc, n.type, t, n.binding.mapping) || 0 : -1;
}, DA = (e, t) => {
	let n = t;
	for (; n?.parentNode && n.parentNode !== e.dom;) n = n.parentNode;
	return n;
}, OA = new M("dragHandle"), kA = ({ pluginKey: e = OA, element: t, editor: n, computePositionConfig: r, getReferencedVirtualElement: i, onNodeChange: a, onElementDragStart: o, onElementDragEnd: s, nestedOptions: c, dragImageProperties: l }) => {
	let u = document.createElement("div"), d = !1, f = null, p = -1, m, h = null, g = null, _ = null, v = null;
	function y() {
		_ = null, v = null;
	}
	function b(e, t) {
		v &&= bA(v, e, {
			isChangeOrigin: Lk(e),
			getAbsolutePos: (e) => EA(t, e)
		});
	}
	function x(e) {
		if (!v) return null;
		let t = wA(e.doc, v.anchorPos, v.nodeCount, v.depth);
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
		Hb(i?.() || { getBoundingClientRect: () => e.getBoundingClientRect() }, t, r).then((e) => {
			Object.assign(t.style, {
				position: e.strategy,
				left: `${e.x}px`,
				top: `${e.y}px`
			});
		});
	}
	function C(e) {
		o?.(e), _A(e, n, c, {
			node: f,
			pos: p
		}, l), _ = SA(n.state.selection), t && (t.dataset.dragging = "true"), setTimeout(() => {
			t && (t.style.pointerEvents = "none");
		}, 0);
	}
	function ne(e) {
		s?.(e), _ = null, S(), t && (t.style.pointerEvents = "auto", t.dataset.dragging = "false");
	}
	function w(e) {
		if (!e.target || !n.view.dom.contains(e.target)) return;
		if (fd()) {
			let e = n.view.dom;
			requestAnimationFrame(() => {
				e.isContentEditable && (e.contentEditable = "false", e.contentEditable = "true");
			});
		}
		if (!_ || n.view.state.selection.empty) return;
		let t = n.state.selection.from, r = TA(n.state, t);
		v = {
			..._,
			anchorPos: t,
			relativeAnchorPos: r ?? void 0
		}, n.view.dispatch(n.state.tr.setMeta("addToHistory", !1));
	}
	function re() {
		t.removeEventListener("dragstart", C), t.removeEventListener("dragend", ne), document.removeEventListener("drop", w), h && (cancelAnimationFrame(h), h = null, g = null), y();
	}
	return u.appendChild(t), {
		unbind() {
			re();
		},
		plugin: new j({
			key: typeof e == "string" ? new M(e) : e,
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
					if (e.docChanged && p !== -1 && t) if (Lk(e)) {
						let e = EA(o, m);
						e !== p && (p = e);
					} else {
						let t = e.mapping.map(p);
						t !== p && (p = t, m = TA(o, p));
					}
					return r;
				}
			},
			appendTransaction(e, t, n) {
				return x(n);
			},
			view: (e) => (t.draggable = !0, t.style.pointerEvents = "auto", t.dataset.dragging = "false", n.view.dom.parentElement?.appendChild(u), u.style.pointerEvents = "none", u.style.position = "absolute", u.style.top = "0", u.style.left = "0", u.style.zIndex = "10", t.addEventListener("dragstart", C), t.addEventListener("dragend", ne), document.addEventListener("drop", w), {
				update(r, i) {
					if (!t) return;
					if (!n.isEditable) {
						S();
						return;
					}
					if (d ? t.draggable = !1 : t.draggable = !0, e.state.doc.eq(i.doc) || p === -1) return;
					let o = e.nodeDOM(p);
					if (o = DA(e, o), o === e.dom || o?.nodeType !== 1) return;
					let s = e.posAtDOM(o, 0), c = yA(n.state.doc, s), l = vA(n.state.doc, s);
					f = c, p = l, m = TA(e.state, p), a?.({
						editor: n,
						node: f,
						pos: p
					}), te(o);
				},
				destroy() {
					re(), t && pA(u);
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
						let i = uA({
							x: t,
							y: r,
							direction: "right",
							editor: n,
							nestedOptions: c
						});
						if (!i.resultElement) return;
						let o = i.resultElement, s = i.resultNode, l = i.pos;
						if (!c?.enabled) {
							if (o = DA(e, o), o === e.dom || o?.nodeType !== 1) return;
							let t = e.posAtDOM(o, 0);
							s = yA(n.state.doc, t), l = vA(n.state.doc, t);
						}
						s !== f && (f = s, p = l ?? -1, m = TA(e.state, p), a?.({
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
function AA(e) {
	return e === !1 || e === void 0 ? {
		enabled: !1,
		rules: [],
		defaultRules: !0,
		allowedContainers: void 0,
		edgeDetection: $k("none")
	} : e === !0 ? {
		enabled: !0,
		rules: [],
		defaultRules: !0,
		allowedContainers: void 0,
		edgeDetection: $k("left")
	} : {
		enabled: !0,
		rules: e.rules ?? [],
		defaultRules: e.defaultRules ?? !0,
		allowedContainers: e.allowedContainers,
		edgeDetection: $k(e.edgeDetection)
	};
}
var jA = {
	placement: "left-start",
	strategy: "absolute"
}, MA = L.create({
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
		let e = this.options.render(), t = AA(this.options.nested);
		return [kA({
			computePositionConfig: {
				...jA,
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
}), NA, PA;
if (typeof WeakMap < "u") {
	let e = /* @__PURE__ */ new WeakMap();
	NA = (t) => e.get(t), PA = (t, n) => (e.set(t, n), n);
} else {
	let e = [], t = 0;
	NA = (t) => {
		for (let n = 0; n < e.length; n += 2) if (e[n] == t) return e[n + 1];
	}, PA = (n, r) => (t == 10 && (t = 0), e[t++] = n, e[t++] = r);
}
var Z = class {
	constructor(e, t, n, r) {
		this.width = e, this.height = t, this.map = n, this.problems = r;
	}
	findCell(e) {
		for (let t = 0; t < this.map.length; t++) {
			let n = this.map[t];
			if (n != e) continue;
			let r = t % this.width, i = t / this.width | 0, a = r + 1, o = i + 1;
			for (let e = 1; a < this.width && this.map[t + e] == n; e++) a++;
			for (let e = 1; o < this.height && this.map[t + this.width * e] == n; e++) o++;
			return {
				left: r,
				top: i,
				right: a,
				bottom: o
			};
		}
		throw RangeError(`No cell with offset ${e} found`);
	}
	colCount(e) {
		for (let t = 0; t < this.map.length; t++) if (this.map[t] == e) return t % this.width;
		throw RangeError(`No cell with offset ${e} found`);
	}
	nextCell(e, t, n) {
		let { left: r, right: i, top: a, bottom: o } = this.findCell(e);
		return t == "horiz" ? (n < 0 ? r == 0 : i == this.width) ? null : this.map[a * this.width + (n < 0 ? r - 1 : i)] : (n < 0 ? a == 0 : o == this.height) ? null : this.map[r + this.width * (n < 0 ? a - 1 : o)];
	}
	rectBetween(e, t) {
		let { left: n, right: r, top: i, bottom: a } = this.findCell(e), { left: o, right: s, top: c, bottom: l } = this.findCell(t);
		return {
			left: Math.min(n, o),
			top: Math.min(i, c),
			right: Math.max(r, s),
			bottom: Math.max(a, l)
		};
	}
	cellsInRect(e) {
		let t = [], n = {};
		for (let r = e.top; r < e.bottom; r++) for (let i = e.left; i < e.right; i++) {
			let a = r * this.width + i, o = this.map[a];
			n[o] || (n[o] = !0, !(i == e.left && i && this.map[a - 1] == o || r == e.top && r && this.map[a - this.width] == o) && t.push(o));
		}
		return t;
	}
	positionAt(e, t, n) {
		for (let r = 0, i = 0;; r++) {
			let a = i + n.child(r).nodeSize;
			if (r == e) {
				let n = t + e * this.width, r = (e + 1) * this.width;
				for (; n < r && this.map[n] < i;) n++;
				return n == r ? a - 1 : this.map[n];
			}
			i = a;
		}
	}
	static get(e) {
		return NA(e) || PA(e, FA(e));
	}
};
function FA(e) {
	if (e.type.spec.tableRole != "table") throw RangeError("Not a table node: " + e.type.name);
	let t = IA(e), n = e.childCount, r = [], i = 0, a = null, o = [];
	for (let e = 0, i = t * n; e < i; e++) r[e] = 0;
	for (let s = 0, c = 0; s < n; s++) {
		let l = e.child(s);
		c++;
		for (let e = 0;; e++) {
			for (; i < r.length && r[i] != 0;) i++;
			if (e == l.childCount) break;
			let u = l.child(e), { colspan: d, rowspan: f, colwidth: p } = u.attrs;
			for (let e = 0; e < f; e++) {
				if (e + s >= n) {
					(a ||= []).push({
						type: "overlong_rowspan",
						pos: c,
						n: f - e
					});
					break;
				}
				let l = i + e * t;
				for (let e = 0; e < d; e++) {
					r[l + e] == 0 ? r[l + e] = c : (a ||= []).push({
						type: "collision",
						row: s,
						pos: c,
						n: d - e
					});
					let n = p && p[e];
					if (n) {
						let r = (l + e) % t * 2, i = o[r];
						i == null || i != n && o[r + 1] == 1 ? (o[r] = n, o[r + 1] = 1) : i == n && o[r + 1]++;
					}
				}
			}
			i += d, c += u.nodeSize;
		}
		let u = (s + 1) * t, d = 0;
		for (; i < u;) r[i++] == 0 && d++;
		d && (a ||= []).push({
			type: "missing",
			row: s,
			n: d
		}), c++;
	}
	(t === 0 || n === 0) && (a ||= []).push({ type: "zero_sized" });
	let s = new Z(t, n, r, a), c = !1;
	for (let e = 0; !c && e < o.length; e += 2) o[e] != null && o[e + 1] < n && (c = !0);
	return c && LA(s, o, e), s;
}
function IA(e) {
	let t = -1, n = !1;
	for (let r = 0; r < e.childCount; r++) {
		let i = e.child(r), a = 0;
		if (n) for (let t = 0; t < r; t++) {
			let n = e.child(t);
			for (let e = 0; e < n.childCount; e++) {
				let i = n.child(e);
				t + i.attrs.rowspan > r && (a += i.attrs.colspan);
			}
		}
		for (let e = 0; e < i.childCount; e++) {
			let t = i.child(e);
			a += t.attrs.colspan, t.attrs.rowspan > 1 && (n = !0);
		}
		t == -1 ? t = a : t != a && (t = Math.max(t, a));
	}
	return t;
}
function LA(e, t, n) {
	e.problems ||= [];
	let r = {};
	for (let i = 0; i < e.map.length; i++) {
		let a = e.map[i];
		if (r[a]) continue;
		r[a] = !0;
		let o = n.nodeAt(a);
		if (!o) throw RangeError(`No cell with offset ${a} found`);
		let s = null, c = o.attrs;
		for (let n = 0; n < c.colspan; n++) {
			let r = t[(i + n) % e.width * 2];
			r != null && (!c.colwidth || c.colwidth[n] != r) && ((s ||= RA(c))[n] = r);
		}
		s && e.problems.unshift({
			type: "colwidth mismatch",
			pos: a,
			colwidth: s
		});
	}
}
function RA(e) {
	if (e.colwidth) return e.colwidth.slice();
	let t = [];
	for (let n = 0; n < e.colspan; n++) t.push(0);
	return t;
}
function zA(e) {
	let t = e.cached.tableNodeTypes;
	if (!t) {
		t = e.cached.tableNodeTypes = {};
		for (let n in e.nodes) {
			let r = e.nodes[n], i = r.spec.tableRole;
			i && (t[i] = r);
		}
	}
	return t;
}
var BA = new M("selectingCells");
function VA(e) {
	for (let t = e.depth - 1; t > 0; t--) if (e.node(t).type.spec.tableRole == "row") return e.node(0).resolve(e.before(t + 1));
	return null;
}
function HA(e) {
	for (let t = e.depth; t > 0; t--) {
		let n = e.node(t).type.spec.tableRole;
		if (n === "cell" || n === "header_cell") return e.node(t);
	}
	return null;
}
function UA(e) {
	let t = e.selection.$head;
	for (let e = t.depth; e > 0; e--) if (t.node(e).type.spec.tableRole == "row") return !0;
	return !1;
}
function WA(e) {
	let t = e.selection;
	if ("$anchorCell" in t && t.$anchorCell) return t.$anchorCell.pos > t.$headCell.pos ? t.$anchorCell : t.$headCell;
	if ("node" in t && t.node && t.node.type.spec.tableRole == "cell") return t.$anchor;
	let n = VA(t.$head) || GA(t.$head);
	if (n) return n;
	throw RangeError(`No cell found around position ${t.head}`);
}
function GA(e) {
	for (let t = e.nodeAfter, n = e.pos; t; t = t.firstChild, n++) {
		let r = t.type.spec.tableRole;
		if (r == "cell" || r == "header_cell") return e.doc.resolve(n);
	}
	for (let t = e.nodeBefore, n = e.pos; t; t = t.lastChild, n--) {
		let r = t.type.spec.tableRole;
		if (r == "cell" || r == "header_cell") return e.doc.resolve(n - t.nodeSize);
	}
}
function KA(e) {
	return e.parent.type.spec.tableRole == "row" && !!e.nodeAfter;
}
function qA(e) {
	return e.node(0).resolve(e.pos + e.nodeAfter.nodeSize);
}
function JA(e, t) {
	return e.depth == t.depth && e.pos >= t.start(-1) && e.pos <= t.end(-1);
}
function YA(e, t, n) {
	let r = e.node(-1), i = Z.get(r), a = e.start(-1), o = i.nextCell(e.pos - a, t, n);
	return o == null ? null : e.node(0).resolve(a + o);
}
function XA(e, t, n = 1) {
	let r = {
		...e,
		colspan: e.colspan - n
	};
	return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(t, n), r.colwidth.some((e) => e > 0) || (r.colwidth = null)), r;
}
function ZA(e, t, n = 1) {
	let r = {
		...e,
		colspan: e.colspan + n
	};
	if (r.colwidth) {
		r.colwidth = r.colwidth.slice();
		for (let e = 0; e < n; e++) r.colwidth.splice(t, 0, 0);
	}
	return r;
}
function QA(e, t, n) {
	let r = zA(t.type.schema).header_cell;
	for (let i = 0; i < e.height; i++) if (t.nodeAt(e.map[n + i * e.width]).type != r) return !1;
	return !0;
}
var Q = class e extends O {
	constructor(e, t = e) {
		let n = e.node(-1), r = Z.get(n), i = e.start(-1), a = r.rectBetween(e.pos - i, t.pos - i), o = e.node(0), s = r.cellsInRect(a).filter((e) => e != t.pos - i);
		s.unshift(t.pos - i);
		let c = s.map((e) => {
			let t = n.nodeAt(e);
			if (!t) throw RangeError(`No cell with offset ${e} found`);
			let r = i + e + 1;
			return new Sn(o.resolve(r), o.resolve(r + t.content.size));
		});
		super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = t;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.$anchorCell.pos)), i = t.resolve(n.map(this.$headCell.pos));
		if (KA(r) && KA(i) && JA(r, i)) {
			let t = this.$anchorCell.node(-1) != r.node(-1);
			return t && this.isRowSelection() ? e.rowSelection(r, i) : t && this.isColSelection() ? e.colSelection(r, i) : new e(r, i);
		}
		return k.between(r, i);
	}
	content() {
		let e = this.$anchorCell.node(-1), t = Z.get(e), n = this.$anchorCell.start(-1), r = t.rectBetween(this.$anchorCell.pos - n, this.$headCell.pos - n), i = {}, a = [];
		for (let n = r.top; n < r.bottom; n++) {
			let o = [];
			for (let a = n * t.width + r.left, s = r.left; s < r.right; s++, a++) {
				let n = t.map[a];
				if (i[n]) continue;
				i[n] = !0;
				let s = t.findCell(n), c = e.nodeAt(n);
				if (!c) throw RangeError(`No cell with offset ${n} found`);
				let l = r.left - s.left, u = s.right - r.right;
				if (l > 0 || u > 0) {
					let e = c.attrs;
					if (l > 0 && (e = XA(e, 0, l)), u > 0 && (e = XA(e, e.colspan - u, u)), s.left < r.left) {
						if (c = c.type.createAndFill(e), !c) throw RangeError(`Could not create cell with attrs ${JSON.stringify(e)}`);
					} else c = c.type.create(e, c.content);
				}
				if (s.top < r.top || s.bottom > r.bottom) {
					let e = {
						...c.attrs,
						rowspan: Math.min(s.bottom, r.bottom) - Math.max(s.top, r.top)
					};
					c = s.top < r.top ? c.type.createAndFill(e) : c.type.create(e, c.content);
				}
				o.push(c);
			}
			a.push(e.child(n).copy(m.from(o)));
		}
		let o = this.isColSelection() && this.isRowSelection() ? e : a;
		return new b(m.from(o), 1, 1);
	}
	replace(e, t = b.empty) {
		let n = e.steps.length, r = this.ranges;
		for (let i = 0; i < r.length; i++) {
			let { $from: a, $to: o } = r[i], s = e.mapping.slice(n);
			e.replace(s.map(a.pos), s.map(o.pos), i ? b.empty : t);
		}
		let i = O.findFrom(e.doc.resolve(e.mapping.slice(n).map(this.to)), -1);
		i && e.setSelection(i);
	}
	replaceWith(e, t) {
		this.replace(e, new b(m.from(t), 0, 0));
	}
	forEachCell(e) {
		let t = this.$anchorCell.node(-1), n = Z.get(t), r = this.$anchorCell.start(-1), i = n.cellsInRect(n.rectBetween(this.$anchorCell.pos - r, this.$headCell.pos - r));
		for (let n = 0; n < i.length; n++) e(t.nodeAt(i[n]), r + i[n]);
	}
	isColSelection() {
		let e = this.$anchorCell.index(-1), t = this.$headCell.index(-1);
		if (Math.min(e, t) > 0) return !1;
		let n = e + this.$anchorCell.nodeAfter.attrs.rowspan, r = t + this.$headCell.nodeAfter.attrs.rowspan;
		return Math.max(n, r) == this.$headCell.node(-1).childCount;
	}
	static colSelection(t, n = t) {
		let r = t.node(-1), i = Z.get(r), a = t.start(-1), o = i.findCell(t.pos - a), s = i.findCell(n.pos - a), c = t.node(0);
		return o.top <= s.top ? (o.top > 0 && (t = c.resolve(a + i.map[o.left])), s.bottom < i.height && (n = c.resolve(a + i.map[i.width * (i.height - 1) + s.right - 1]))) : (s.top > 0 && (n = c.resolve(a + i.map[s.left])), o.bottom < i.height && (t = c.resolve(a + i.map[i.width * (i.height - 1) + o.right - 1]))), new e(t, n);
	}
	isRowSelection() {
		let e = this.$anchorCell.node(-1), t = Z.get(e), n = this.$anchorCell.start(-1), r = t.colCount(this.$anchorCell.pos - n), i = t.colCount(this.$headCell.pos - n);
		if (Math.min(r, i) > 0) return !1;
		let a = r + this.$anchorCell.nodeAfter.attrs.colspan, o = i + this.$headCell.nodeAfter.attrs.colspan;
		return Math.max(a, o) == t.width;
	}
	eq(t) {
		return t instanceof e && t.$anchorCell.pos == this.$anchorCell.pos && t.$headCell.pos == this.$headCell.pos;
	}
	static rowSelection(t, n = t) {
		let r = t.node(-1), i = Z.get(r), a = t.start(-1), o = i.findCell(t.pos - a), s = i.findCell(n.pos - a), c = t.node(0);
		return o.left <= s.left ? (o.left > 0 && (t = c.resolve(a + i.map[o.top * i.width])), s.right < i.width && (n = c.resolve(a + i.map[i.width * (s.top + 1) - 1]))) : (s.left > 0 && (n = c.resolve(a + i.map[s.top * i.width])), o.right < i.width && (t = c.resolve(a + i.map[i.width * (o.top + 1) - 1]))), new e(t, n);
	}
	toJSON() {
		return {
			type: "cell",
			anchor: this.$anchorCell.pos,
			head: this.$headCell.pos
		};
	}
	static fromJSON(t, n) {
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(t, n, r = n) {
		return new e(t.resolve(n), t.resolve(r));
	}
	getBookmark() {
		return new $A(this.$anchorCell.pos, this.$headCell.pos);
	}
};
Q.prototype.visible = !1, O.jsonID("cell", Q);
var $A = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = e.resolve(this.head);
		return t.parent.type.spec.tableRole == "row" && n.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && n.index() < n.parent.childCount && JA(t, n) ? new Q(t, n) : O.near(n, 1);
	}
};
function ej(e) {
	if (!(e.selection instanceof Q)) return null;
	let t = [];
	return e.selection.forEachCell((e, n) => {
		t.push(ms.node(n, n + e.nodeSize, { class: "selectedCell" }));
	}), N.create(e.doc, t);
}
function tj({ $from: e, $to: t }) {
	if (e.pos == t.pos || e.pos < t.pos - 6) return !1;
	let n = e.pos, r = t.pos, i = e.depth;
	for (; i >= 0 && !(e.after(i + 1) < e.end(i)); i--, n++);
	for (let e = t.depth; e >= 0 && !(t.before(e + 1) > t.start(e)); e--, r--);
	return n == r && /row|table/.test(e.node(i).type.spec.tableRole);
}
function nj({ $from: e, $to: t }) {
	let n, r;
	for (let t = e.depth; t > 0; t--) {
		let r = e.node(t);
		if (r.type.spec.tableRole === "cell" || r.type.spec.tableRole === "header_cell") {
			n = r;
			break;
		}
	}
	for (let e = t.depth; e > 0; e--) {
		let n = t.node(e);
		if (n.type.spec.tableRole === "cell" || n.type.spec.tableRole === "header_cell") {
			r = n;
			break;
		}
	}
	return n !== r && t.parentOffset === 0;
}
function rj(e, t, n) {
	let r = (t || e).selection, i = (t || e).doc, a, o;
	if (r instanceof A && (o = r.node.type.spec.tableRole)) {
		if (o == "cell" || o == "header_cell") a = Q.create(i, r.from);
		else if (o == "row") {
			let e = i.resolve(r.from + 1);
			a = Q.rowSelection(e, e);
		} else if (!n) {
			let e = Z.get(r.node), t = r.from + 1, n = t + e.map[e.width * e.height - 1];
			a = Q.create(i, t + 1, n);
		}
	} else r instanceof k && tj(r) ? a = k.create(i, r.from) : r instanceof k && nj(r) && (a = k.create(i, r.$from.start(), r.$from.end()));
	return a && (t ||= e.tr).setSelection(a), t;
}
var ij = new M("fix-tables");
function aj(e, t, n, r) {
	let i = e.childCount, a = t.childCount;
	outer: for (let o = 0, s = 0; o < a; o++) {
		let a = t.child(o);
		for (let t = s, r = Math.min(i, o + 3); t < r; t++) if (e.child(t) == a) {
			s = t + 1, n += a.nodeSize;
			continue outer;
		}
		r(a, n), s < i && e.child(s).sameMarkup(a) ? aj(e.child(s), a, n + 1, r) : a.nodesBetween(0, a.content.size, r, n + 1), n += a.nodeSize;
	}
}
function oj(e, t) {
	let n, r = (t, r) => {
		t.type.spec.tableRole == "table" && (n = sj(e, t, r, n));
	};
	return t ? t.doc != e.doc && aj(t.doc, e.doc, 0, r) : e.doc.descendants(r), n;
}
function sj(e, t, n, r) {
	let i = Z.get(t);
	if (!i.problems) return r;
	r ||= e.tr;
	let a = [];
	for (let e = 0; e < i.height; e++) a.push(0);
	for (let e = 0; e < i.problems.length; e++) {
		let o = i.problems[e];
		if (o.type == "collision") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			let i = e.attrs;
			for (let e = 0; e < i.rowspan; e++) a[o.row + e] += o.n;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, XA(i, i.colspan - o.n, o.n));
		} else if (o.type == "missing") a[o.row] += o.n;
		else if (o.type == "overlong_rowspan") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, {
				...e.attrs,
				rowspan: e.attrs.rowspan - o.n
			});
		} else if (o.type == "colwidth mismatch") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, {
				...e.attrs,
				colwidth: o.colwidth
			});
		} else if (o.type == "zero_sized") {
			let e = r.mapping.map(n);
			r.delete(e, e + t.nodeSize);
		}
	}
	let o, s;
	for (let e = 0; e < a.length; e++) a[e] && (o ??= e, s = e);
	for (let c = 0, l = n + 1; c < i.height; c++) {
		let n = t.child(c), i = l + n.nodeSize, u = a[c];
		if (u > 0) {
			let t = "cell";
			n.firstChild && (t = n.firstChild.type.spec.tableRole);
			let a = [];
			for (let n = 0; n < u; n++) {
				let n = zA(e.schema)[t].createAndFill();
				n && a.push(n);
			}
			let d = (c == 0 || o == c - 1) && s == c ? l + 1 : i - 1;
			r.insert(r.mapping.map(d), a);
		}
		l = i;
	}
	return r.setMeta(ij, { fixTables: !0 });
}
function cj(e) {
	let t = e.selection, n = WA(e), r = n.node(-1), i = n.start(-1), a = Z.get(r);
	return {
		...t instanceof Q ? a.rectBetween(t.$anchorCell.pos - i, t.$headCell.pos - i) : a.findCell(n.pos - i),
		tableStart: i,
		map: a,
		table: r
	};
}
function lj(e, { map: t, tableStart: n, table: r }, i) {
	let a = i > 0 ? -1 : 0;
	QA(t, r, i + a) && (a = i == 0 || i == t.width ? null : 0);
	for (let o = 0; o < t.height; o++) {
		let s = o * t.width + i;
		if (i > 0 && i < t.width && t.map[s - 1] == t.map[s]) {
			let a = t.map[s], c = r.nodeAt(a);
			e.setNodeMarkup(e.mapping.map(n + a), null, ZA(c.attrs, i - t.colCount(a))), o += c.attrs.rowspan - 1;
		} else {
			let c = a == null ? zA(r.type.schema).cell : r.nodeAt(t.map[s + a]).type, l = t.positionAt(o, i, r);
			e.insert(e.mapping.map(n + l), c.createAndFill());
		}
	}
	return e;
}
function uj(e, t) {
	if (!UA(e)) return !1;
	if (t) {
		let n = cj(e);
		t(lj(e.tr, n, n.left));
	}
	return !0;
}
function dj(e, t) {
	if (!UA(e)) return !1;
	if (t) {
		let n = cj(e);
		t(lj(e.tr, n, n.right));
	}
	return !0;
}
function fj(e, { map: t, table: n, tableStart: r }, i) {
	let a = e.mapping.maps.length;
	for (let o = 0; o < t.height;) {
		let s = o * t.width + i, c = t.map[s], l = n.nodeAt(c), u = l.attrs;
		if (i > 0 && t.map[s - 1] == c || i < t.width - 1 && t.map[s + 1] == c) e.setNodeMarkup(e.mapping.slice(a).map(r + c), null, XA(u, i - t.colCount(c)));
		else {
			let t = e.mapping.slice(a).map(r + c);
			e.delete(t, t + l.nodeSize);
		}
		o += u.rowspan;
	}
}
function pj(e, t) {
	if (!UA(e)) return !1;
	if (t) {
		let n = cj(e), r = e.tr;
		if (n.left == 0 && n.right == n.map.width) return !1;
		for (let e = n.right - 1; fj(r, n, e), e != n.left; e--) {
			let e = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
			if (!e) throw RangeError("No table found");
			n.table = e, n.map = Z.get(e);
		}
		t(r);
	}
	return !0;
}
function mj(e, t, n) {
	let r = zA(t.type.schema).header_cell;
	for (let i = 0; i < e.width; i++) if (t.nodeAt(e.map[i + n * e.width])?.type != r) return !1;
	return !0;
}
function hj(e, { map: t, tableStart: n, table: r }, i) {
	let a = n;
	for (let e = 0; e < i; e++) a += r.child(e).nodeSize;
	let o = [], s = i > 0 ? -1 : 0;
	mj(t, r, i + s) && (s = i == 0 || i == t.height ? null : 0);
	for (let a = 0, c = t.width * i; a < t.width; a++, c++) if (i > 0 && i < t.height && t.map[c] == t.map[c - t.width]) {
		let i = t.map[c], o = r.nodeAt(i).attrs;
		e.setNodeMarkup(n + i, null, {
			...o,
			rowspan: o.rowspan + 1
		}), a += o.colspan - 1;
	} else {
		let e = (s == null ? zA(r.type.schema).cell : r.nodeAt(t.map[c + s * t.width])?.type)?.createAndFill();
		e && o.push(e);
	}
	return e.insert(a, zA(r.type.schema).row.create(null, o)), e;
}
function gj(e, t) {
	if (!UA(e)) return !1;
	if (t) {
		let n = cj(e);
		t(hj(e.tr, n, n.top));
	}
	return !0;
}
function _j(e, t) {
	if (!UA(e)) return !1;
	if (t) {
		let n = cj(e);
		t(hj(e.tr, n, n.bottom));
	}
	return !0;
}
function vj(e, { map: t, table: n, tableStart: r }, i) {
	let a = 0;
	for (let e = 0; e < i; e++) a += n.child(e).nodeSize;
	let o = a + n.child(i).nodeSize, s = e.mapping.maps.length;
	e.delete(a + r, o + r);
	let c = /* @__PURE__ */ new Set();
	for (let a = 0, o = i * t.width; a < t.width; a++, o++) {
		let l = t.map[o];
		if (!c.has(l)) {
			if (c.add(l), i > 0 && l == t.map[o - t.width]) {
				let t = n.nodeAt(l).attrs;
				e.setNodeMarkup(e.mapping.slice(s).map(l + r), null, {
					...t,
					rowspan: t.rowspan - 1
				}), a += t.colspan - 1;
			} else if (i < t.height && l == t.map[o + t.width]) {
				let o = n.nodeAt(l), c = o.attrs, u = o.type.create({
					...c,
					rowspan: o.attrs.rowspan - 1
				}, o.content), d = t.positionAt(i + 1, a, n);
				e.insert(e.mapping.slice(s).map(r + d), u), a += c.colspan - 1;
			}
		}
	}
}
function yj(e, t) {
	if (!UA(e)) return !1;
	if (t) {
		let n = cj(e), r = e.tr;
		if (n.top == 0 && n.bottom == n.map.height) return !1;
		for (let e = n.bottom - 1; vj(r, n, e), e != n.top; e--) {
			let e = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
			if (!e) throw RangeError("No table found");
			n.table = e, n.map = Z.get(n.table);
		}
		t(r);
	}
	return !0;
}
function bj(e) {
	let t = e.content;
	return t.childCount == 1 && t.child(0).isTextblock && t.child(0).childCount == 0;
}
function xj({ width: e, height: t, map: n }, r) {
	let i = r.top * e + r.left, a = i, o = (r.bottom - 1) * e + r.left, s = i + (r.right - r.left - 1);
	for (let t = r.top; t < r.bottom; t++) {
		if (r.left > 0 && n[a] == n[a - 1] || r.right < e && n[s] == n[s + 1]) return !0;
		a += e, s += e;
	}
	for (let a = r.left; a < r.right; a++) {
		if (r.top > 0 && n[i] == n[i - e] || r.bottom < t && n[o] == n[o + e]) return !0;
		i++, o++;
	}
	return !1;
}
function Sj(e, t) {
	let n = e.selection;
	if (!(n instanceof Q) || n.$anchorCell.pos == n.$headCell.pos) return !1;
	let r = cj(e), { map: i } = r;
	if (xj(i, r)) return !1;
	if (t) {
		let n = e.tr, a = {}, o = m.empty, s, c;
		for (let e = r.top; e < r.bottom; e++) for (let t = r.left; t < r.right; t++) {
			let l = i.map[e * i.width + t], u = r.table.nodeAt(l);
			if (!(a[l] || !u)) if (a[l] = !0, s == null) s = l, c = u;
			else {
				bj(u) || (o = o.append(u.content));
				let e = n.mapping.map(l + r.tableStart);
				n.delete(e, e + u.nodeSize);
			}
		}
		if (s == null || c == null) return !0;
		if (n.setNodeMarkup(s + r.tableStart, null, {
			...ZA(c.attrs, c.attrs.colspan, r.right - r.left - c.attrs.colspan),
			rowspan: r.bottom - r.top
		}), o.size > 0) {
			let e = s + 1 + c.content.size, t = bj(c) ? s + 1 : e;
			n.replaceWith(t + r.tableStart, e + r.tableStart, o);
		}
		n.setSelection(new Q(n.doc.resolve(s + r.tableStart))), t(n);
	}
	return !0;
}
function Cj(e, t) {
	let n = zA(e.schema);
	return wj(({ node: e }) => n[e.type.spec.tableRole])(e, t);
}
function wj(e) {
	return (t, n) => {
		let r = t.selection, i, a;
		if (r instanceof Q) {
			if (r.$anchorCell.pos != r.$headCell.pos) return !1;
			i = r.$anchorCell.nodeAfter, a = r.$anchorCell.pos;
		} else {
			if (i = HA(r.$from), !i) return !1;
			a = VA(r.$from)?.pos;
		}
		if (i == null || a == null || i.attrs.colspan == 1 && i.attrs.rowspan == 1) return !1;
		if (n) {
			let o = i.attrs, s = [], c = o.colwidth;
			o.rowspan > 1 && (o = {
				...o,
				rowspan: 1
			}), o.colspan > 1 && (o = {
				...o,
				colspan: 1
			});
			let l = cj(t), u = t.tr;
			for (let e = 0; e < l.right - l.left; e++) s.push(c ? {
				...o,
				colwidth: c && c[e] ? [c[e]] : null
			} : o);
			let d;
			for (let t = l.top; t < l.bottom; t++) {
				let n = l.map.positionAt(t, l.left, l.table);
				t == l.top && (n += i.nodeSize);
				for (let r = l.left, a = 0; r < l.right; r++, a++) r == l.left && t == l.top || u.insert(d = u.mapping.map(n + l.tableStart, 1), e({
					node: i,
					row: t,
					col: r
				}).createAndFill(s[a]));
			}
			u.setNodeMarkup(a, e({
				node: i,
				row: l.top,
				col: l.left
			}), s[0]), r instanceof Q && u.setSelection(new Q(u.doc.resolve(r.$anchorCell.pos), d ? u.doc.resolve(d) : void 0)), n(u);
		}
		return !0;
	};
}
function Tj(e, t) {
	return function(n, r) {
		if (!UA(n)) return !1;
		let i = WA(n);
		if (i.nodeAfter.attrs[e] === t) return !1;
		if (r) {
			let a = n.tr;
			n.selection instanceof Q ? n.selection.forEachCell((n, r) => {
				n.attrs[e] !== t && a.setNodeMarkup(r, null, {
					...n.attrs,
					[e]: t
				});
			}) : a.setNodeMarkup(i.pos, null, {
				...i.nodeAfter.attrs,
				[e]: t
			}), r(a);
		}
		return !0;
	};
}
function Ej(e) {
	return function(t, n) {
		if (!UA(t)) return !1;
		if (n) {
			let r = zA(t.schema), i = cj(t), a = t.tr, o = i.map.cellsInRect(e == "column" ? {
				left: i.left,
				top: 0,
				right: i.right,
				bottom: i.map.height
			} : e == "row" ? {
				left: 0,
				top: i.top,
				right: i.map.width,
				bottom: i.bottom
			} : i), s = o.map((e) => i.table.nodeAt(e));
			for (let e = 0; e < o.length; e++) s[e].type == r.header_cell && a.setNodeMarkup(i.tableStart + o[e], r.cell, s[e].attrs);
			if (a.steps.length === 0) for (let e = 0; e < o.length; e++) a.setNodeMarkup(i.tableStart + o[e], r.header_cell, s[e].attrs);
			n(a);
		}
		return !0;
	};
}
function Dj(e, t, n) {
	let r = t.map.cellsInRect({
		left: 0,
		top: 0,
		right: e == "row" ? t.map.width : 1,
		bottom: e == "column" ? t.map.height : 1
	});
	for (let e = 0; e < r.length; e++) {
		let i = t.table.nodeAt(r[e]);
		if (i && i.type !== n.header_cell) return !1;
	}
	return !0;
}
function Oj(e, t) {
	return t ||= { useDeprecatedLogic: !1 }, t.useDeprecatedLogic ? Ej(e) : function(t, n) {
		if (!UA(t)) return !1;
		if (n) {
			let r = zA(t.schema), i = cj(t), a = t.tr, o = Dj("row", i, r), s = Dj("column", i, r), c = (e === "column" ? o : e === "row" && s) ? 1 : 0, l = e == "column" ? {
				left: 0,
				top: c,
				right: 1,
				bottom: i.map.height
			} : e == "row" ? {
				left: c,
				top: 0,
				right: i.map.width,
				bottom: 1
			} : i, u = e == "column" ? s ? r.cell : r.header_cell : e == "row" ? o ? r.cell : r.header_cell : r.cell;
			i.map.cellsInRect(l).forEach((e) => {
				let t = e + i.tableStart, n = a.doc.nodeAt(t);
				n && a.setNodeMarkup(t, u, n.attrs);
			}), n(a);
		}
		return !0;
	};
}
Oj("row", { useDeprecatedLogic: !0 }), Oj("column", { useDeprecatedLogic: !0 });
var kj = Oj("cell", { useDeprecatedLogic: !0 });
function Aj(e, t) {
	if (t < 0) {
		let t = e.nodeBefore;
		if (t) return e.pos - t.nodeSize;
		for (let t = e.index(-1) - 1, n = e.before(); t >= 0; t--) {
			let r = e.node(-1).child(t), i = r.lastChild;
			if (i) return n - 1 - i.nodeSize;
			n -= r.nodeSize;
		}
	} else {
		if (e.index() < e.parent.childCount - 1) return e.pos + e.nodeAfter.nodeSize;
		let t = e.node(-1);
		for (let n = e.indexAfter(-1), r = e.after(); n < t.childCount; n++) {
			let e = t.child(n);
			if (e.childCount) return r + 1;
			r += e.nodeSize;
		}
	}
	return null;
}
function jj(e) {
	return function(t, n) {
		if (!UA(t)) return !1;
		let r = Aj(WA(t), e);
		if (r == null) return !1;
		if (n) {
			let e = t.doc.resolve(r);
			n(t.tr.setSelection(k.between(e, qA(e))).scrollIntoView());
		}
		return !0;
	};
}
function Mj(e, t) {
	let n = e.selection.$anchor;
	for (let r = n.depth; r > 0; r--) if (n.node(r).type.spec.tableRole == "table") return t && t(e.tr.delete(n.before(r), n.after(r)).scrollIntoView()), !0;
	return !1;
}
function Nj(e, t) {
	let n = e.selection;
	if (!(n instanceof Q)) return !1;
	if (t) {
		let r = e.tr, i = zA(e.schema).cell.createAndFill().content;
		n.forEachCell((e, t) => {
			e.content.eq(i) || r.replace(r.mapping.map(t + 1), r.mapping.map(t + e.nodeSize - 1), new b(i, 0, 0));
		}), r.docChanged && t(r);
	}
	return !0;
}
function Pj(e) {
	if (e.size === 0) return null;
	let { content: t, openStart: n, openEnd: r } = e;
	for (; t.childCount == 1 && (n > 0 && r > 0 || t.child(0).type.spec.tableRole == "table");) n--, r--, t = t.child(0).content;
	let i = t.child(0), a = i.type.spec.tableRole, o = i.type.schema, s = [];
	if (a == "row") for (let e = 0; e < t.childCount; e++) {
		let i = t.child(e).content, a = e ? 0 : Math.max(0, n - 1), c = e < t.childCount - 1 ? 0 : Math.max(0, r - 1);
		(a || c) && (i = Ij(zA(o).row, new b(i, a, c)).content), s.push(i);
	}
	else if (a == "cell" || a == "header_cell") s.push(n || r ? Ij(zA(o).row, new b(t, n, r)).content : t);
	else return null;
	return Fj(o, s);
}
function Fj(e, t) {
	let n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		for (let t = r.childCount - 1; t >= 0; t--) {
			let { rowspan: i, colspan: a } = r.child(t).attrs;
			for (let t = e; t < e + i; t++) n[t] = (n[t] || 0) + a;
		}
	}
	let r = 0;
	for (let e = 0; e < n.length; e++) r = Math.max(r, n[e]);
	for (let i = 0; i < n.length; i++) if (i >= t.length && t.push(m.empty), n[i] < r) {
		let a = zA(e).cell.createAndFill(), o = [];
		for (let e = n[i]; e < r; e++) o.push(a);
		t[i] = t[i].append(m.from(o));
	}
	return {
		height: t.length,
		width: r,
		rows: t
	};
}
function Ij(e, t) {
	let n = e.createAndFill();
	return new bn(n).replace(0, n.content.size, t).doc;
}
function Lj({ width: e, height: t, rows: n }, r, i) {
	if (e != r) {
		let t = [], i = [];
		for (let e = 0; e < n.length; e++) {
			let a = n[e], o = [];
			for (let n = t[e] || 0, i = 0; n < r; i++) {
				let s = a.child(i % a.childCount);
				n + s.attrs.colspan > r && (s = s.type.createChecked(XA(s.attrs, s.attrs.colspan, n + s.attrs.colspan - r), s.content)), o.push(s), n += s.attrs.colspan;
				for (let n = 1; n < s.attrs.rowspan; n++) t[e + n] = (t[e + n] || 0) + s.attrs.colspan;
			}
			i.push(m.from(o));
		}
		n = i, e = r;
	}
	if (t != i) {
		let e = [];
		for (let r = 0, a = 0; r < i; r++, a++) {
			let o = [], s = n[a % t];
			for (let e = 0; e < s.childCount; e++) {
				let t = s.child(e);
				r + t.attrs.rowspan > i && (t = t.type.create({
					...t.attrs,
					rowspan: Math.max(1, i - t.attrs.rowspan)
				}, t.content)), o.push(t);
			}
			e.push(m.from(o));
		}
		n = e, t = i;
	}
	return {
		width: e,
		height: t,
		rows: n
	};
}
function Rj(e, t, n, r, i, a, o) {
	let s = e.doc.type.schema, c = zA(s), l, u;
	if (i > t.width) for (let a = 0, s = 0; a < t.height; a++) {
		let d = n.child(a);
		s += d.nodeSize;
		let f = [], p;
		p = d.lastChild == null || d.lastChild.type == c.cell ? l ||= c.cell.createAndFill() : u ||= c.header_cell.createAndFill();
		for (let e = t.width; e < i; e++) f.push(p);
		e.insert(e.mapping.slice(o).map(s - 1 + r), f);
	}
	if (a > t.height) {
		let s = [];
		for (let e = 0, r = (t.height - 1) * t.width; e < Math.max(t.width, i); e++) {
			let i = e >= t.width ? !1 : n.nodeAt(t.map[r + e]).type == c.header_cell;
			s.push(i ? u ||= c.header_cell.createAndFill() : l ||= c.cell.createAndFill());
		}
		let d = c.row.create(null, m.from(s)), f = [];
		for (let e = t.height; e < a; e++) f.push(d);
		e.insert(e.mapping.slice(o).map(r + n.nodeSize - 2), f);
	}
	return !!(l || u);
}
function zj(e, t, n, r, i, a, o, s) {
	if (o == 0 || o == t.height) return !1;
	let c = !1;
	for (let l = i; l < a; l++) {
		let i = o * t.width + l, a = t.map[i];
		if (t.map[i - t.width] == a) {
			c = !0;
			let i = n.nodeAt(a), { top: u, left: d } = t.findCell(a);
			e.setNodeMarkup(e.mapping.slice(s).map(a + r), null, {
				...i.attrs,
				rowspan: o - u
			}), e.insert(e.mapping.slice(s).map(t.positionAt(o, d, n)), i.type.createAndFill({
				...i.attrs,
				rowspan: u + i.attrs.rowspan - o
			})), l += i.attrs.colspan - 1;
		}
	}
	return c;
}
function Bj(e, t, n, r, i, a, o, s) {
	if (o == 0 || o == t.width) return !1;
	let c = !1;
	for (let l = i; l < a; l++) {
		let i = l * t.width + o, a = t.map[i];
		if (t.map[i - 1] == a) {
			c = !0;
			let i = n.nodeAt(a), u = t.colCount(a), d = e.mapping.slice(s).map(a + r);
			e.setNodeMarkup(d, null, XA(i.attrs, o - u, i.attrs.colspan - (o - u))), e.insert(d + i.nodeSize, i.type.createAndFill(XA(i.attrs, 0, o - u))), l += i.attrs.rowspan - 1;
		}
	}
	return c;
}
function Vj(e, t, n, r, i) {
	let a = n ? e.doc.nodeAt(n - 1) : e.doc;
	if (!a) throw Error("No table found");
	let o = Z.get(a), { top: s, left: c } = r, l = c + i.width, u = s + i.height, d = e.tr, f = 0;
	function p() {
		if (a = n ? d.doc.nodeAt(n - 1) : d.doc, !a) throw Error("No table found");
		o = Z.get(a), f = d.mapping.maps.length;
	}
	Rj(d, o, a, n, l, u, f) && p(), zj(d, o, a, n, c, l, s, f) && p(), zj(d, o, a, n, c, l, u, f) && p(), Bj(d, o, a, n, s, u, c, f) && p(), Bj(d, o, a, n, s, u, l, f) && p();
	for (let e = s; e < u; e++) {
		let t = o.positionAt(e, c, a), r = o.positionAt(e, l, a);
		d.replace(d.mapping.slice(f).map(t + n), d.mapping.slice(f).map(r + n), new b(i.rows[e - s], 0, 0));
	}
	p(), d.setSelection(new Q(d.doc.resolve(n + o.positionAt(s, c, a)), d.doc.resolve(n + o.positionAt(u - 1, l - 1, a)))), t(d);
}
var Hj = gc({
	ArrowLeft: Wj("horiz", -1),
	ArrowRight: Wj("horiz", 1),
	ArrowUp: Wj("vert", -1),
	ArrowDown: Wj("vert", 1),
	"Shift-ArrowLeft": Gj("horiz", -1),
	"Shift-ArrowRight": Gj("horiz", 1),
	"Shift-ArrowUp": Gj("vert", -1),
	"Shift-ArrowDown": Gj("vert", 1),
	Backspace: Nj,
	"Mod-Backspace": Nj,
	Delete: Nj,
	"Mod-Delete": Nj
});
function Uj(e, t, n) {
	return n.eq(e.selection) ? !1 : (t && t(e.tr.setSelection(n).scrollIntoView()), !0);
}
function Wj(e, t) {
	return (n, r, i) => {
		if (!i) return !1;
		let a = n.selection;
		if (a instanceof Q) return Uj(n, r, O.near(a.$headCell, t));
		if (e != "horiz" && !a.empty) return !1;
		let o = Yj(i, e, t);
		if (o == null) return !1;
		if (e == "horiz") return Uj(n, r, O.near(n.doc.resolve(a.head + t), t));
		{
			let i = n.doc.resolve(o), a = YA(i, e, t), s;
			return s = a ? O.near(a, 1) : t < 0 ? O.near(n.doc.resolve(i.before(-1)), -1) : O.near(n.doc.resolve(i.after(-1)), 1), Uj(n, r, s);
		}
	};
}
function Gj(e, t) {
	return (n, r, i) => {
		if (!i) return !1;
		let a = n.selection, o;
		if (a instanceof Q) o = a;
		else {
			let r = Yj(i, e, t);
			if (r == null) return !1;
			o = new Q(n.doc.resolve(r));
		}
		let s = YA(o.$headCell, e, t);
		return s ? Uj(n, r, new Q(o.$anchorCell, s)) : !1;
	};
}
function Kj(e, t) {
	let n = e.state.doc, r = VA(n.resolve(t));
	return r ? (e.dispatch(e.state.tr.setSelection(new Q(r))), !0) : !1;
}
function qj(e, t, n) {
	if (!UA(e.state)) return !1;
	let r = Pj(n), i = e.state.selection;
	if (i instanceof Q) {
		r ||= {
			width: 1,
			height: 1,
			rows: [m.from(Ij(zA(e.state.schema).cell, n))]
		};
		let t = i.$anchorCell.node(-1), a = i.$anchorCell.start(-1), o = Z.get(t).rectBetween(i.$anchorCell.pos - a, i.$headCell.pos - a);
		return r = Lj(r, o.right - o.left, o.bottom - o.top), Vj(e.state, e.dispatch, a, o, r), !0;
	} else if (r) {
		let t = WA(e.state), n = t.start(-1);
		return Vj(e.state, e.dispatch, n, Z.get(t.node(-1)).findCell(t.pos - n), r), !0;
	} else return !1;
}
function Jj(e, t) {
	if (t.button != 0 || t.ctrlKey || t.metaKey) return;
	let n = Xj(e, t.target), r;
	if (t.shiftKey && e.state.selection instanceof Q) i(e.state.selection.$anchorCell, t), t.preventDefault();
	else if (t.shiftKey && n && (r = VA(e.state.selection.$anchor)) != null && Zj(e, t)?.pos != r.pos) i(r, t), t.preventDefault();
	else if (!n) return;
	function i(t, n) {
		let r = Zj(e, n), i = BA.getState(e.state) == null;
		if (!r || !JA(t, r)) if (i) r = t;
		else return;
		let a = new Q(t, r);
		if (i || !e.state.selection.eq(a)) {
			let n = e.state.tr.setSelection(a);
			i && n.setMeta(BA, t.pos), e.dispatch(n);
		}
	}
	function a() {
		e.root.removeEventListener("mouseup", a), e.root.removeEventListener("dragstart", a), e.root.removeEventListener("mousemove", o), BA.getState(e.state) != null && e.dispatch(e.state.tr.setMeta(BA, -1));
	}
	function o(r) {
		let o = r, s = BA.getState(e.state), c;
		if (s != null) c = e.state.doc.resolve(s);
		else if (Xj(e, o.target) != n && (c = Zj(e, t), !c)) return a();
		c && i(c, o);
	}
	e.root.addEventListener("mouseup", a), e.root.addEventListener("dragstart", a), e.root.addEventListener("mousemove", o);
}
function Yj(e, t, n) {
	if (!(e.state.selection instanceof k)) return null;
	let { $head: r } = e.state.selection;
	for (let i = r.depth - 1; i >= 0; i--) {
		let a = r.node(i);
		if ((n < 0 ? r.index(i) : r.indexAfter(i)) != (n < 0 ? 0 : a.childCount)) return null;
		if (a.type.spec.tableRole == "cell" || a.type.spec.tableRole == "header_cell") {
			let a = r.before(i), o = t == "vert" ? n > 0 ? "down" : "up" : n > 0 ? "right" : "left";
			return e.endOfTextblock(o) ? a : null;
		}
	}
	return null;
}
function Xj(e, t) {
	for (; t && t != e.dom; t = t.parentNode) if (t.nodeName == "TD" || t.nodeName == "TH") return t;
	return null;
}
function Zj(e, t) {
	let n = e.posAtCoords({
		left: t.clientX,
		top: t.clientY
	});
	if (!n) return null;
	let { inside: r, pos: i } = n;
	return r >= 0 && VA(e.state.doc.resolve(r)) || VA(e.state.doc.resolve(i));
}
var Qj = class {
	constructor(e, t) {
		this.node = e, this.defaultCellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.table.style.setProperty("--default-cell-min-width", `${t}px`), this.colgroup = this.table.appendChild(document.createElement("colgroup")), $j(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
	}
	update(e) {
		return e.type == this.node.type ? (this.node = e, $j(e, this.colgroup, this.table, this.defaultCellMinWidth), !0) : !1;
	}
	ignoreMutation(e) {
		return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
	}
};
function $j(e, t, n, r, i, a) {
	let o = 0, s = !0, c = t.firstChild, l = e.firstChild;
	if (l) {
		for (let e = 0, n = 0; e < l.childCount; e++) {
			let { colspan: u, colwidth: d } = l.child(e).attrs;
			for (let e = 0; e < u; e++, n++) {
				let l = i == n ? a : d && d[e], u = l ? l + "px" : "";
				if (o += l || r, l || (s = !1), c) c.style.width != u && (c.style.width = u), c = c.nextSibling;
				else {
					let e = document.createElement("col");
					e.style.width = u, t.appendChild(e);
				}
			}
		}
		for (; c;) {
			var u;
			let e = c.nextSibling;
			(u = c.parentNode) == null || u.removeChild(c), c = e;
		}
		s ? (n.style.width = o + "px", n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = o + "px");
	}
}
var eM = new M("tableColumnResizing");
function tM({ handleWidth: e = 5, cellMinWidth: t = 25, defaultCellMinWidth: n = 100, View: r = Qj, lastColumnResizable: i = !0 } = {}) {
	let a = new j({
		key: eM,
		state: {
			init(e, t) {
				var i;
				let o = (i = a.spec) == null || (i = i.props) == null ? void 0 : i.nodeViews, s = zA(t.schema).table.name;
				return r && o && (o[s] = (e, t) => new r(e, n, t)), new nM(-1, !1);
			},
			apply(e, t) {
				return t.apply(e);
			}
		},
		props: {
			attributes: (e) => {
				let t = eM.getState(e);
				return t && t.activeHandle > -1 ? { class: "resize-cursor" } : {};
			},
			handleDOMEvents: {
				mousemove: (t, n) => {
					rM(t, n, e, i);
				},
				mouseleave: (e) => {
					iM(e);
				},
				mousedown: (e, r) => {
					aM(e, r, t, n);
				}
			},
			decorations: (e) => {
				let t = eM.getState(e);
				if (t && t.activeHandle > -1) return mM(e, t.activeHandle);
			},
			nodeViews: {}
		}
	});
	return a;
}
var nM = class e {
	constructor(e, t) {
		this.activeHandle = e, this.dragging = t;
	}
	apply(t) {
		let n = this, r = t.getMeta(eM);
		if (r && r.setHandle != null) return new e(r.setHandle, !1);
		if (r && r.setDragging !== void 0) return new e(n.activeHandle, r.setDragging);
		if (n.activeHandle > -1 && t.docChanged) {
			let r = t.mapping.map(n.activeHandle, -1);
			return KA(t.doc.resolve(r)) || (r = -1), new e(r, n.dragging);
		}
		return n;
	}
};
function rM(e, t, n, r) {
	if (!e.editable) return;
	let i = eM.getState(e.state);
	if (i && !i.dragging) {
		let a = sM(t.target), o = -1;
		if (a) {
			let { left: r, right: i } = a.getBoundingClientRect();
			t.clientX - r <= n ? o = cM(e, t, "left", n) : i - t.clientX <= n && (o = cM(e, t, "right", n));
		}
		if (o != i.activeHandle) {
			if (!r && o !== -1) {
				let t = e.state.doc.resolve(o), n = t.node(-1), r = Z.get(n), i = t.start(-1);
				if (r.colCount(t.pos - i) + t.nodeAfter.attrs.colspan - 1 == r.width - 1) return;
			}
			uM(e, o);
		}
	}
}
function iM(e) {
	if (!e.editable) return;
	let t = eM.getState(e.state);
	t && t.activeHandle > -1 && !t.dragging && uM(e, -1);
}
function aM(e, t, n, r) {
	if (!e.editable) return !1;
	let i = e.dom.ownerDocument.defaultView ?? window, a = eM.getState(e.state);
	if (!a || a.activeHandle == -1 || a.dragging) return !1;
	let o = e.state.doc.nodeAt(a.activeHandle), s = oM(e, a.activeHandle, o.attrs);
	e.dispatch(e.state.tr.setMeta(eM, { setDragging: {
		startX: t.clientX,
		startWidth: s
	} }));
	function c(t) {
		i.removeEventListener("mouseup", c), i.removeEventListener("mousemove", l);
		let r = eM.getState(e.state);
		r?.dragging && (dM(e, r.activeHandle, lM(r.dragging, t, n)), e.dispatch(e.state.tr.setMeta(eM, { setDragging: null })));
	}
	function l(t) {
		if (!t.which) return c(t);
		let i = eM.getState(e.state);
		if (i && i.dragging) {
			let a = lM(i.dragging, t, n);
			fM(e, i.activeHandle, a, r);
		}
	}
	return fM(e, a.activeHandle, s, r), i.addEventListener("mouseup", c), i.addEventListener("mousemove", l), t.preventDefault(), !0;
}
function oM(e, t, { colspan: n, colwidth: r }) {
	let i = r && r[r.length - 1];
	if (i) return i;
	let a = e.domAtPos(t), o = a.node.childNodes[a.offset].offsetWidth, s = n;
	if (r) for (let e = 0; e < n; e++) r[e] && (o -= r[e], s--);
	return o / s;
}
function sM(e) {
	for (; e && e.nodeName != "TD" && e.nodeName != "TH";) e = e.classList && e.classList.contains("ProseMirror") ? null : e.parentNode;
	return e;
}
function cM(e, t, n, r) {
	let i = n == "right" ? -r : r, a = e.posAtCoords({
		left: t.clientX + i,
		top: t.clientY
	});
	if (!a) return -1;
	let { pos: o } = a, s = VA(e.state.doc.resolve(o));
	if (!s) return -1;
	if (n == "right") return s.pos;
	let c = Z.get(s.node(-1)), l = s.start(-1), u = c.map.indexOf(s.pos - l);
	return u % c.width == 0 ? -1 : l + c.map[u - 1];
}
function lM(e, t, n) {
	let r = t.clientX - e.startX;
	return Math.max(n, e.startWidth + r);
}
function uM(e, t) {
	e.dispatch(e.state.tr.setMeta(eM, { setHandle: t }));
}
function dM(e, t, n) {
	let r = e.state.doc.resolve(t), i = r.node(-1), a = Z.get(i), o = r.start(-1), s = a.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, c = e.state.tr;
	for (let e = 0; e < a.height; e++) {
		let t = e * a.width + s;
		if (e && a.map[t] == a.map[t - a.width]) continue;
		let r = a.map[t], l = i.nodeAt(r).attrs, u = l.colspan == 1 ? 0 : s - a.colCount(r);
		if (l.colwidth && l.colwidth[u] == n) continue;
		let d = l.colwidth ? l.colwidth.slice() : pM(l.colspan);
		d[u] = n, c.setNodeMarkup(o + r, null, {
			...l,
			colwidth: d
		});
	}
	c.docChanged && e.dispatch(c);
}
function fM(e, t, n, r) {
	let i = e.state.doc.resolve(t), a = i.node(-1), o = i.start(-1), s = Z.get(a).colCount(i.pos - o) + i.nodeAfter.attrs.colspan - 1, c = e.domAtPos(i.start(-1)).node;
	for (; c && c.nodeName != "TABLE";) c = c.parentNode;
	c && $j(a, c.firstChild, c, r, s, n);
}
function pM(e) {
	return Array(e).fill(0);
}
function mM(e, t) {
	let n = [], r = e.doc.resolve(t), i = r.node(-1);
	if (!i) return N.empty;
	let a = Z.get(i), o = r.start(-1), s = a.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1;
	for (let t = 0; t < a.height; t++) {
		let r = s + t * a.width;
		if ((s == a.width - 1 || a.map[r] != a.map[r + 1]) && (t == 0 || a.map[r] != a.map[r - a.width])) {
			let t = a.map[r], s = o + t + i.nodeAt(t).nodeSize - 1, c = document.createElement("div");
			c.className = "column-resize-handle", eM.getState(e)?.dragging && n.push(ms.node(o + t, o + t + i.nodeAt(t).nodeSize, { class: "column-resize-dragging" })), n.push(ms.widget(s, c));
		}
	}
	return N.create(e.doc, n);
}
function hM({ allowTableNodeSelection: e = !1 } = {}) {
	return new j({
		key: BA,
		state: {
			init() {
				return null;
			},
			apply(e, t) {
				let n = e.getMeta(BA);
				if (n != null) return n == -1 ? null : n;
				if (t == null || !e.docChanged) return t;
				let { deleted: r, pos: i } = e.mapping.mapResult(t);
				return r ? null : i;
			}
		},
		props: {
			decorations: ej,
			handleDOMEvents: { mousedown: Jj },
			createSelectionBetween(e) {
				return BA.getState(e.state) == null ? null : e.state.selection;
			},
			handleTripleClick: Kj,
			handleKeyDown: Hj,
			handlePaste: qj
		},
		appendTransaction(t, n, r) {
			return rj(r, oj(r, n), e);
		}
	});
}
//#endregion
//#region node_modules/@tiptap/extension-table/dist/index.js
function gM(e) {
	return e === "left" || e === "right" || e === "center" ? e : null;
}
function _M(e) {
	let t = (e.style.textAlign || "").trim().toLowerCase(), n = (e.getAttribute("align") || "").trim().toLowerCase();
	return gM(t || n);
}
function vM(e) {
	return gM(e?.align);
}
function yM() {
	return {
		default: null,
		parseHTML: (e) => _M(e),
		renderHTML: (e) => e.align ? { style: `text-align: ${e.align}` } : {}
	};
}
function bM(e) {
	let t = e.parentElement, n = e.closest("table");
	if (!t || !n) return null;
	let r = Array.from(t.children).indexOf(e), i = n.querySelectorAll("colgroup > col")[r]?.getAttribute("width");
	return i ? [parseInt(i, 10)] : null;
}
function xM(e) {
	let t = e.getAttribute("colwidth");
	return t ? t.split(",").map((e) => parseInt(e, 10)) : bM(e);
}
var SM = /[ \t\r\n\f]+/g;
function CM(e) {
	return e.children.length > 0 ? !1 : (e.textContent ?? "").replace(SM, "") === "";
}
function wM(e) {
	let t = e.createAndFill();
	if (!t) throw Error(`[tiptap error]: "${e.name}" has no default content to backfill.`);
	return t.content;
}
var TM = R.create({
	name: "tableCell",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	content: "block+",
	addAttributes() {
		return {
			colspan: { default: 1 },
			rowspan: { default: 1 },
			colwidth: {
				default: null,
				parseHTML: xM
			},
			align: yM()
		};
	},
	tableRole: "cell",
	isolating: !0,
	parseHTML() {
		return [{
			tag: "td",
			getAttrs: (e) => CM(e) ? {} : !1,
			getContent: (e, t) => wM(t.nodes[this.name])
		}, { tag: "td" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"td",
			I(this.options.HTMLAttributes, e),
			0
		];
	}
}), EM = R.create({
	name: "tableHeader",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	content: "block+",
	addAttributes() {
		return {
			colspan: { default: 1 },
			rowspan: { default: 1 },
			colwidth: {
				default: null,
				parseHTML: xM
			},
			align: yM()
		};
	},
	tableRole: "header_cell",
	isolating: !0,
	parseHTML() {
		return [{
			tag: "th",
			getAttrs: (e) => CM(e) ? {} : !1,
			getContent: (e, t) => wM(t.nodes[this.name])
		}, { tag: "th" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"th",
			I(this.options.HTMLAttributes, e),
			0
		];
	}
}), DM = R.create({
	name: "tableRow",
	addOptions() {
		return { HTMLAttributes: {} };
	},
	content: "(tableCell | tableHeader)*",
	tableRole: "row",
	parseHTML() {
		return [{ tag: "tr" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		return [
			"tr",
			I(this.options.HTMLAttributes, e),
			0
		];
	}
});
function OM(e, t) {
	return t ? ["width", `${Math.max(t, e)}px`] : ["min-width", `${e}px`];
}
function kM(e, t, n, r, i, a) {
	let o = 0, s = !0, c = t.firstChild, l = e.firstChild;
	if (l !== null) for (let e = 0, n = 0; e < l.childCount; e += 1) {
		let { colspan: u, colwidth: d } = l.child(e).attrs;
		for (let e = 0; e < u; e += 1, n += 1) {
			let l = i === n ? a : d && d[e], u = l ? `${l}px` : "";
			if (o += l || r, l || (s = !1), c) {
				if (c.style.width !== u) {
					let [e, t] = OM(r, l);
					c.style.setProperty(e, t);
				}
				c = c.nextSibling;
			} else {
				let e = document.createElement("col"), [n, i] = OM(r, l);
				e.style.setProperty(n, i), t.appendChild(e);
			}
		}
	}
	for (; c;) {
		let e = c.nextSibling;
		c.parentNode?.removeChild(c), c = e;
	}
	let u = e.attrs.style && typeof e.attrs.style == "string" && /\bwidth\s*:/i.test(e.attrs.style);
	s && !u ? (n.style.width = `${o}px`, n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = `${o}px`);
}
var AM = class {
	constructor(e, t, n, r = {}) {
		this.node = e, this.cellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table"));
		for (let [e, t] of Object.entries(r)) t != null && (e === "style" ? this.table.style.cssText = String(t) : this.table.setAttribute(e, String(t)));
		e.attrs.style && (this.table.style.cssText = e.attrs.style), this.colgroup = this.table.appendChild(document.createElement("colgroup")), kM(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
	}
	update(e) {
		return e.type === this.node.type ? (this.node = e, kM(e, this.colgroup, this.table, this.cellMinWidth), !0) : !1;
	}
	ignoreMutation(e) {
		let t = e.target, n = this.dom.contains(t), r = this.contentDOM.contains(t);
		return !!(n && !r && (e.type === "attributes" || e.type === "childList" || e.type === "characterData"));
	}
};
function jM(e, t, n, r) {
	let i = 0, a = !0, o = [], s = e.firstChild;
	if (!s) return {};
	for (let e = 0, c = 0; e < s.childCount; e += 1) {
		let { colspan: l, colwidth: u } = s.child(e).attrs;
		for (let e = 0; e < l; e += 1, c += 1) {
			let s = n === c ? r : u && u[e];
			i += s || t, s || (a = !1);
			let [l, d] = OM(t, s);
			o.push(["col", { style: `${l}: ${d}` }]);
		}
	}
	let c = a ? `${i}px` : "", l = a ? "" : `${i}px`;
	return {
		colgroup: [
			"colgroup",
			{},
			...o
		],
		tableWidth: c,
		tableMinWidth: l
	};
}
function MM(e, t) {
	return t ? e.createChecked(null, t) : e.createAndFill();
}
function NM(e) {
	if (e.cached.tableNodeTypes) return e.cached.tableNodeTypes;
	let t = {};
	return Object.keys(e.nodes).forEach((n) => {
		let r = e.nodes[n];
		r.spec.tableRole && (t[r.spec.tableRole] = r);
	}), e.cached.tableNodeTypes = t, t;
}
function PM(e, t, n, r, i) {
	let a = NM(e), o = [], s = [];
	for (let e = 0; e < n; e += 1) {
		let e = MM(a.cell, i);
		if (e && s.push(e), r) {
			let e = MM(a.header_cell, i);
			e && o.push(e);
		}
	}
	let c = [];
	for (let e = 0; e < t; e += 1) c.push(a.row.createChecked(null, r && e === 0 ? o : s));
	return a.table.createChecked(null, c);
}
function FM(e) {
	return e instanceof Q;
}
var IM = ({ editor: e }) => {
	let { selection: t } = e.state;
	if (!FM(t)) return !1;
	let n = 0;
	return Bl(t.ranges[0].$from, (e) => e.type.name === "table")?.node.descendants((e) => {
		if (e.type.name === "table") return !1;
		["tableCell", "tableHeader"].includes(e.type.name) && (n += 1);
	}), n === t.ranges.length ? (e.commands.deleteTable(), !0) : !1;
};
function LM(e) {
	let t = "", n = 0;
	for (; n < e.length;) {
		if (e[n] === "\\" && n + 1 < e.length) {
			t += e[n] + e[n + 1], n += 2;
			continue;
		}
		if (e[n] !== "`") {
			t += e[n++];
			continue;
		}
		let r = 0;
		for (; n + r < e.length && e[n + r] === "`";) r += 1;
		let i = n + r, a = !1;
		for (; i < e.length;) {
			if (e[i] !== "`") {
				i += 1;
				continue;
			}
			let o = 0;
			for (; i + o < e.length && e[i + o] === "`";) o += 1;
			if (o === r) {
				let o = e.slice(n + r, i);
				t += e.slice(n, n + r) + o.replace(/(?<!\\)\|/g, "\\|") + e.slice(i, i + r), n = i + r, a = !0;
				break;
			}
			i += o;
		}
		a || (t += e.slice(n, n + r), n += r);
	}
	return t;
}
function RM(e) {
	return e.split("\n").map((e) => !e.includes("|") || !e.includes("`") ? e : LM(e)).join("\n");
}
function zM(e) {
	return (e || "").replace(/\s+/g, " ").trim();
}
function BM(e, t, n = {}) {
	let r = n.cellLineSeparator ?? "";
	if (!e || !e.content || e.content.length === 0) return "";
	let i = [];
	e.content.forEach((e) => {
		let n = [];
		e.content && e.content.forEach((e) => {
			let i = "";
			i = e.content && Array.isArray(e.content) && e.content.length > 1 ? e.content.map((e) => t.renderChildren(e)).join(r) : e.content ? t.renderChildren(e.content) : "";
			let a = zM(i.split(r).join("\n").replace(/[ \t]*\r?\n[ \t]*/g, "<br>")), o = e.type === "tableHeader", s = vM(e.attrs);
			n.push({
				text: a,
				isHeader: o,
				align: s
			});
		}), i.push(n);
	});
	let a = i.reduce((e, t) => Math.max(e, t.length), 0);
	if (a === 0) return "";
	let o = Array.from({ length: a }).fill(0);
	i.forEach((e) => {
		for (let t = 0; t < a; t += 1) {
			let n = (e[t]?.text || "").length;
			n > o[t] && (o[t] = n), o[t] < 3 && (o[t] = 3);
		}
	});
	let s = (e, t) => e + " ".repeat(Math.max(0, t - e.length)), c = i[0], l = c.some((e) => e.isHeader), u = Array.from({ length: a }).fill(null);
	i.forEach((e) => {
		for (let t = 0; t < a; t += 1) !u[t] && e[t]?.align && (u[t] = e[t].align);
	});
	let d = "\n", f = Array.from({ length: a }).map((e, t) => l && c[t] && c[t].text || "");
	return d += `| ${f.map((e, t) => s(e, o[t])).join(" | ")} |
`, d += `| ${o.map((e, t) => {
		let n = Math.max(3, e), r = u[t];
		return r === "left" ? `:${"-".repeat(n)}` : r === "right" ? `${"-".repeat(n)}:` : r === "center" ? `:${"-".repeat(n)}:` : "-".repeat(n);
	}).join(" | ")} |
`, (l ? i.slice(1) : i).forEach((e) => {
		d += `| ${Array.from({ length: a }).fill(0).map((t, n) => s(e[n] && e[n].text || "", o[n])).join(" | ")} |
`;
	}), d;
}
var VM = BM, HM = R.create({
	name: "table",
	addOptions() {
		return {
			HTMLAttributes: {},
			resizable: !1,
			renderWrapper: !1,
			handleWidth: 5,
			cellMinWidth: 25,
			View: AM,
			lastColumnResizable: !0,
			allowTableNodeSelection: !1
		};
	},
	content: "tableRow+",
	tableRole: "table",
	isolating: !0,
	group: "block",
	parseHTML() {
		return [{ tag: "table" }];
	},
	renderHTML({ node: e, HTMLAttributes: t }) {
		let { colgroup: n, tableWidth: r, tableMinWidth: i } = jM(e, this.options.cellMinWidth), a = t.style;
		function o() {
			return a || (r ? `width: ${r}` : `min-width: ${i}`);
		}
		let s = [
			"table",
			I(this.options.HTMLAttributes, t, { style: o() }),
			n,
			["tbody", 0]
		];
		return this.options.renderWrapper ? [
			"div",
			{ class: "tableWrapper" },
			s
		] : s;
	},
	parseMarkdown: (e, t) => {
		let n = [], r = Array.isArray(e.align) ? e.align : [];
		if (e.header) {
			let i = [];
			e.header.forEach((e, n) => {
				let a = gM(r[n] ?? e.align), o = a ? { align: a } : {};
				i.push(t.createNode("tableHeader", o, [{
					type: "paragraph",
					content: t.parseInline(e.tokens)
				}]));
			}), n.push(t.createNode("tableRow", {}, i));
		}
		return e.rows && e.rows.forEach((e) => {
			let i = [];
			e.forEach((e, n) => {
				let a = gM(r[n] ?? e.align), o = a ? { align: a } : {};
				i.push(t.createNode("tableCell", o, [{
					type: "paragraph",
					content: t.parseInline(e.tokens)
				}]));
			}), n.push(t.createNode("tableRow", {}, i));
		}), t.createNode("table", void 0, n);
	},
	renderMarkdown: (e, t) => VM(e, t),
	markdownTokenizer: {
		name: "table",
		level: "block",
		start: (e) => {
			let t = e.split("\n");
			if (t.length < 2) return -1;
			let n = t[1];
			return !/^[ \t|:]*-[ \t|:-]*$/.test(n) || !n.includes("|") ? -1 : t[0].includes("|") ? 0 : -1;
		},
		tokenize(e, t, n) {
			let r = e.indexOf("\n\n"), i = r >= 0 ? e.slice(0, r) : e, a = i.split("\n");
			if (a.length < 2) return;
			let o = a[1];
			if (!/^[ \t|:]*-[ \t|:-]*$/.test(o) || !o.includes("|")) return;
			let s = RM(i);
			if (s === i) return;
			let c = n.blockTokens(s)[0];
			if (c?.type !== "table" || !c.raw) return;
			let l = c.raw.split("\n").length, u = e.split("\n").slice(0, l).join("\n");
			return {
				...c,
				raw: u
			};
		}
	},
	addCommands() {
		return {
			insertTable: ({ rows: e = 3, cols: t = 3, withHeaderRow: n = !0 } = {}) => ({ tr: r, dispatch: i, editor: a }) => {
				let o = PM(a.schema, e, t, n);
				if (i) {
					let e = r.selection.from + 1;
					r.replaceSelectionWith(o).scrollIntoView().setSelection(k.near(r.doc.resolve(e)));
				}
				return !0;
			},
			addColumnBefore: () => ({ state: e, dispatch: t }) => uj(e, t),
			addColumnAfter: () => ({ state: e, dispatch: t }) => dj(e, t),
			deleteColumn: () => ({ state: e, dispatch: t }) => pj(e, t),
			addRowBefore: () => ({ state: e, dispatch: t }) => gj(e, t),
			addRowAfter: () => ({ state: e, dispatch: t }) => _j(e, t),
			deleteRow: () => ({ state: e, dispatch: t }) => yj(e, t),
			deleteTable: () => ({ state: e, dispatch: t }) => Mj(e, t),
			mergeCells: () => ({ state: e, dispatch: t }) => Sj(e, t),
			splitCell: () => ({ state: e, dispatch: t }) => Cj(e, t),
			toggleHeaderColumn: () => ({ state: e, dispatch: t }) => Oj("column")(e, t),
			toggleHeaderRow: () => ({ state: e, dispatch: t }) => Oj("row")(e, t),
			toggleHeaderCell: () => ({ state: e, dispatch: t }) => kj(e, t),
			mergeOrSplit: () => ({ state: e, dispatch: t }) => Sj(e, t) ? !0 : Cj(e, t),
			setCellAttribute: (e, t) => ({ state: n, dispatch: r }) => Tj(e, t)(n, r),
			goToNextCell: () => ({ state: e, dispatch: t }) => jj(1)(e, t),
			goToPreviousCell: () => ({ state: e, dispatch: t }) => jj(-1)(e, t),
			fixTables: () => ({ state: e, dispatch: t }) => (t && oj(e), !0),
			setCellSelection: (e) => ({ tr: t, dispatch: n }) => {
				if (n) {
					let n = Q.create(t.doc, e.anchorCell, e.headCell);
					t.setSelection(n);
				}
				return !0;
			}
		};
	},
	addKeyboardShortcuts() {
		return {
			Tab: () => this.editor.commands.goToNextCell() ? !0 : this.editor.can().addRowAfter() ? this.editor.chain().addRowAfter().goToNextCell().run() : !1,
			"Shift-Tab": () => this.editor.commands.goToPreviousCell(),
			Backspace: IM,
			"Mod-Backspace": IM,
			Delete: IM,
			"Mod-Delete": IM
		};
	},
	addProseMirrorPlugins() {
		return [...this.options.resizable && this.editor.isEditable ? [tM({
			handleWidth: this.options.handleWidth,
			cellMinWidth: this.options.cellMinWidth,
			defaultCellMinWidth: this.options.cellMinWidth,
			View: this.options.View,
			lastColumnResizable: this.options.lastColumnResizable
		})] : [], hM({ allowTableNodeSelection: this.options.allowTableNodeSelection })];
	},
	addNodeView() {
		let e = this.options.resizable && this.editor.isEditable, t = this.options.View;
		return e || !t ? null : ({ node: e, view: n, HTMLAttributes: r }) => {
			let i = I(this.options.HTMLAttributes, r);
			return new t(e, this.options.cellMinWidth, n, i);
		};
	},
	extendNodeSchema(e) {
		return { tableRole: F(P(e, "tableRole", {
			name: e.name,
			options: e.options,
			storage: e.storage
		})) };
	}
});
L.create({
	name: "tableKit",
	addExtensions() {
		let e = [];
		return this.options.table !== !1 && e.push(HM.configure(this.options.table)), this.options.tableCell !== !1 && e.push(TM.configure(this.options.tableCell)), this.options.tableHeader !== !1 && e.push(EM.configure(this.options.tableHeader)), this.options.tableRow !== !1 && e.push(DM.configure(this.options.tableRow)), e;
	}
});
//#endregion
//#region node_modules/@tiptap/extension-table-row/dist/index.js
var UM = DM, WM = TM, GM = EM, KM = /* @__PURE__ */ new Map();
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/utils.js
function qM(e, t, n, r, i) {
	let { state: a, view: o } = e, s = o.posAtDOM(t, 0);
	if (s == null) return;
	let c = a.doc.resolve(s), l = c.depth;
	for (; l >= 0 && c.node(l).type.name !== n;) l--;
	if (l < 0) return;
	let u = c.node(l);
	o.dispatch(a.tr.setNodeMarkup(c.before(l), null, {
		...u.attrs,
		[r]: i
	}).scrollIntoView());
}
function JM(e, t, n, r) {
	qM(e, t, "callout", n, r);
}
function YM(e) {
	return Array.from(KM.values()).find((t) => t.editor?.view?.dom?.contains(e))?.editor || null;
}
function XM(e, t, ...n) {
	if (e) try {
		e.invokeMethodAsync(t, ...n).catch(() => {});
	} catch {}
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/image.js
var ZM = null;
function QM() {
	return ZM || (ZM = document.createElement("input"), ZM.type = "file", ZM.accept = "image/*", ZM.style.cssText = "display:none", document.body.appendChild(ZM), ZM);
}
async function $M(e) {
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
function eN(e) {
	let t = QM();
	t.onchange = async () => {
		let n = t.files?.[0];
		if (!n) return;
		let r = await $M(n);
		r && e.chain().focus().setImage({ src: r }).run(), t.value = "";
	}, t.click();
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/subpages.js
async function tN(e, t) {
	try {
		let n = await fetch(`/api/pages/children/${t}`, { credentials: "same-origin" });
		if (!n.ok) return;
		let r = await n.json();
		if (!r || !r.length) return;
		let { schema: i } = e.state, a = r.filter((e) => e && e.id).map((e) => i.nodes.pageReference.create({
			pageId: e.id,
			title: e.title || "Untitled",
			icon: e.icon || "📄"
		}));
		if (!a.length) return;
		let o = e.state.doc.content.size, s = e.state.tr.replaceWith(o, o, a);
		s.setMeta("subpageInject", !0), e.view.dispatch(s);
	} catch (e) {
		console.error("Failed to load subpages:", e);
	}
}
var nN = /* @__PURE__ */ new Map();
function rN(e, t) {
	nN.has(e) && clearTimeout(nN.get(e)), nN.set(e, setTimeout(async () => {
		nN.delete(e);
		try {
			let n = await fetch(`/api/pages/${e}/reorder-subpages`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pageIds: t }),
				credentials: "same-origin"
			});
			if (!n.ok) {
				let t = await n.text().catch(() => "(no body)");
				console.warn(`Reorder rejected (${n.status}) for page ${e}:`, t);
			}
		} catch (t) {
			console.error("Reorder network error for page", e, ":", t);
		}
	}, 600));
}
function iN(e) {
	let t = [];
	return e.state.doc.descendants((e) => {
		e.type.name === "pageReference" && e.attrs.pageId && t.push(e.attrs.pageId);
	}), t;
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/save-system.js
var aN = null, oN = 500;
function sN(e, t) {
	e._dirty = !0, e._pendingMarkdown = t, aN ||= setTimeout(lN, oN);
}
function cN(e) {
	e._dirty = !1, e._pendingMarkdown = null, aN &&= (clearTimeout(aN), null);
}
async function lN() {
	aN = null;
	let e = [...KM.values()].filter((e) => e._dirty && e.dotNetRef && e.editor);
	e.length && await Promise.all(e.map((e) => uN(e)));
}
async function uN(e) {
	if (!e._dirty || !e.dotNetRef || !e.editor) return;
	let t = e._pendingMarkdown ?? e.editor.getMarkdown();
	try {
		await e.dotNetRef.invokeMethodAsync("OnMarkdownChanged", e.blockId, t), cN(e);
	} catch {}
}
function dN(e, t) {
	sN(e, t);
}
function fN() {
	[...KM.values()].some((e) => e._dirty) || (aN &&= (clearTimeout(aN), null));
}
function pN() {
	let e = async () => {
		let e = [...KM.values()].filter((e) => e._dirty && e.dotNetRef && e.editor);
		if (e.length) for (let t of e) {
			let e = t._pendingMarkdown ?? t.editor.getMarkdown();
			try {
				let n = new Blob([JSON.stringify({ content: e })], { type: "application/json" });
				await navigator.sendBeacon(`/api/pages/${t.blockId}/content`, n), cN(t);
			} catch {}
		}
	};
	window.addEventListener("beforeunload", e), window.addEventListener("pagehide", e);
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/callout-config.js
var mN = [
	{
		id: "info",
		icon: "💡",
		label: "Info",
		color: "#2383e2"
	},
	{
		id: "warning",
		icon: "⚠️",
		label: "Warning",
		color: "#e5484d"
	},
	{
		id: "success",
		icon: "✅",
		label: "Success",
		color: "#2ea043"
	},
	{
		id: "error",
		icon: "❌",
		label: "Error",
		color: "#e5484d"
	},
	{
		id: "gray",
		icon: "⚪",
		label: "Gray",
		color: "#9b9b9b"
	},
	{
		id: "brown",
		icon: "🟤",
		label: "Brown",
		color: "#a07850"
	},
	{
		id: "orange",
		icon: "🟠",
		label: "Orange",
		color: "#ffa500"
	},
	{
		id: "yellow",
		icon: "🟡",
		label: "Yellow",
		color: "#ffd200"
	},
	{
		id: "green",
		icon: "🟢",
		label: "Green",
		color: "#00c864"
	},
	{
		id: "blue",
		icon: "🔵",
		label: "Blue",
		color: "#2383e2"
	},
	{
		id: "purple",
		icon: "🟣",
		label: "Purple",
		color: "#a050c8"
	},
	{
		id: "pink",
		icon: "🩷",
		label: "Pink",
		color: "#dc50a0"
	},
	{
		id: "red",
		icon: "🔴",
		label: "Red",
		color: "#e5484d"
	}
], hN = Object.fromEntries(mN.map((e) => [e.id, e])), gN = /* @__PURE__ */ "💡.ℹ️.❓.🔥.⭐.🎯.📌.📎.✏️.📖.❤️.💚.💙.💜.🧡.🖤.🤍.💛.💗.🤎.✅.❌.⚠️.🚀.📝.🔒.🔓.👀.💪.🧠.🎨.🎵.📷.🔧.⚙️.🔗.📊.📁.🏠.🌍.☀️.🌙.☁️.🌈.💧.🌱.🌸.🍀.🎉.🔴".split("."), $ = null, _N = null, vN = null;
function yN() {
	$ && ($.style.display = "none", $.innerHTML = ""), _N = null, vN = null;
}
function bN(e, t) {
	if (!YM(t)) return;
	let n = t.getAttribute("data-icon") || "";
	$ || ($ = document.createElement("div"), $.className = "callout-menu", document.body.appendChild($));
	let r = e.getBoundingClientRect();
	$.style.cssText = "position:fixed;z-index:100000;display:block;left:" + Math.max(0, r.left) + "px;top:" + (r.bottom + 4) + "px;max-height:260px;overflow-y:auto;width:280px;", _N = "icon", vN = t, $.innerHTML = "<div class=\"callout-menu-grid\">" + gN.map((e) => "<button class=\"callout-menu-item" + (e === n ? " active" : "") + "\" data-value=\"" + e + "\">" + e + "</button>").join("") + "</div>", $.querySelectorAll(".callout-menu-item").forEach((e) => {
		e.onclick = () => {
			let n = e.dataset.value, r = YM(t);
			r && JM(r, t, "icon", n), yN();
		};
	});
}
function xN(e, t) {
	if (!YM(t)) return;
	let n = t.getAttribute("data-type") || "info";
	$ || ($ = document.createElement("div"), $.className = "callout-menu", document.body.appendChild($));
	let r = e.getBoundingClientRect();
	$.style.cssText = "position:fixed;z-index:100000;display:block;left:" + Math.max(0, r.left) + "px;top:" + (r.bottom + 4) + "px;", _N = "color", vN = t, $.innerHTML = "<div class=\"callout-menu-grid callout-menu-colors\">" + mN.map((e) => "<button class=\"callout-menu-color" + (e.id === n ? " active" : "") + "\" data-value=\"" + e.id + "\" title=\"" + e.label + "\"><span class=\"callout-swatch\" style=\"background:" + e.color + "\"></span><span class=\"callout-label\">" + e.label + "</span></button>").join("") + "</div>", $.querySelectorAll(".callout-menu-color").forEach((e) => {
		e.onclick = () => {
			let n = e.dataset.value, r = YM(t);
			r && JM(r, t, "type", n), yN();
		};
	});
}
function SN() {
	document.addEventListener("click", function(e) {
		let t = e.target.closest("[data-callout-icon]");
		if (t) {
			e.preventDefault();
			let n = t.closest("[data-callout]");
			if (!n) return;
			if (_N === "icon" && vN === n && $?.style.display !== "none") {
				yN();
				return;
			}
			yN(), bN(t, n);
			return;
		}
		let n = e.target.closest("[data-callout-color]");
		if (n) {
			e.preventDefault();
			let t = n.closest("[data-callout]");
			if (!t) return;
			if (_N === "color" && vN === t && $?.style.display !== "none") {
				yN();
				return;
			}
			yN(), xN(n, t);
			return;
		}
		_N && $ && !$.contains(e.target) && yN();
	});
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/slash-menu.js
var CN = [
	{
		title: "Text",
		desc: "Plain paragraph",
		icon: "Aa",
		md: "",
		run: (e) => e.chain().focus().clearNodes().setParagraph().run()
	},
	{
		title: "Heading 1",
		desc: "Large heading",
		icon: "H1",
		md: "#",
		run: (e) => e.chain().focus().clearNodes().toggleHeading({ level: 1 }).run()
	},
	{
		title: "Heading 2",
		desc: "Medium heading",
		icon: "H2",
		md: "##",
		run: (e) => e.chain().focus().clearNodes().toggleHeading({ level: 2 }).run()
	},
	{
		title: "Heading 3",
		desc: "Small heading",
		icon: "H3",
		md: "###",
		run: (e) => e.chain().focus().clearNodes().toggleHeading({ level: 3 }).run()
	},
	{
		title: "Bullet List",
		desc: "Unordered items",
		icon: "•",
		md: "- ",
		run: (e) => e.chain().focus().clearNodes().toggleBulletList().run()
	},
	{
		title: "Numbered List",
		desc: "Ordered items",
		icon: "1.",
		md: "1. ",
		run: (e) => e.chain().focus().clearNodes().toggleOrderedList().run()
	},
	{
		title: "Task List",
		desc: "Checklist",
		icon: "☑",
		md: "[ ]",
		run: (e) => e.chain().focus().clearNodes().toggleTaskList().run()
	},
	{
		title: "Quote",
		desc: "Blockquote",
		icon: "\"",
		md: "> ",
		run: (e) => e.chain().focus().clearNodes().toggleBlockquote().run()
	},
	{
		title: "Code Block",
		desc: "Code fence",
		icon: "</>",
		md: "```",
		run: (e) => e.chain().focus().clearNodes().toggleCodeBlock().run()
	},
	{
		title: "Divider",
		desc: "Horizontal rule",
		icon: "—",
		md: "---",
		run: (e) => e.chain().focus().setHorizontalRule().run()
	},
	{
		title: "Image",
		desc: "Upload an image",
		icon: "🖼️",
		md: "",
		run: (e) => {
			eN(e);
		}
	},
	{
		title: "Table",
		desc: "Insert a 3×3 table",
		icon: "⊞",
		md: "",
		run: (e) => e.chain().focus().insertTable({
			rows: 3,
			cols: 3,
			withHeaderRow: !0
		}).run()
	},
	{
		title: "Callout",
		desc: "Colored callout box",
		icon: "📌",
		md: "",
		run: (e) => e.chain().focus().clearNodes().setCallout().run()
	},
	{
		title: "Toggle",
		desc: "Insert collapsible section",
		icon: "▶",
		md: "",
		run: (e) => {
			let { $from: t } = e.state.selection, n = !1;
			for (let e = t.depth; e > 0; e--) if (t.node(e).type.spec.defining) {
				n = !0;
				break;
			}
			n ? e.chain().insertContent({
				type: "toggle",
				attrs: {},
				content: [{ type: "paragraph" }]
			}).run() : e.chain().focus().clearNodes().setToggle().run();
		}
	},
	{
		title: "Subpage",
		desc: "Create a child page",
		icon: "📄",
		md: "",
		run: async (e) => {
			let t = Array.from(KM.values()).find((t) => t.editor === e);
			if (t && t.dotNetRef) try {
				let n = await t.dotNetRef.invokeMethodAsync("CreateSubpage", t.blockId);
				n && n.id && e.chain().focus().insertContent({
					type: "pageReference",
					attrs: {
						pageId: n.id,
						title: n.title,
						icon: n.icon || "📄"
					}
				}).run();
			} catch (e) {
				console.error("CreateSubpage error:", e);
			}
		}
	},
	{
		title: "To Do List",
		desc: "Interactive checklist table",
		icon: "✓",
		md: "",
		run: (e) => {
			e.chain().focus().insertContent({
				type: "todoList",
				attrs: { rows: [
					{
						checked: !1,
						task: "",
						deadline: ""
					},
					{
						checked: !1,
						task: "",
						deadline: ""
					},
					{
						checked: !1,
						task: "",
						deadline: ""
					}
				] }
			}).run();
		}
	}
], wN = null, TN = !1, EN = 0, DN = -1, ON = "", kN = null;
function AN(e, t) {
	let n = e.resolve(t);
	if (!n) return "";
	try {
		return e.textBetween(n.start(), t);
	} catch {
		return "";
	}
}
function jN(e) {
	let t = e?.querySelector(".active");
	t && t.scrollIntoView({ block: "nearest" });
}
function MN() {
	if (!wN) return;
	let e = ON.toLowerCase(), t = CN.filter((t) => t.title.toLowerCase().includes(e) || t.desc.toLowerCase().includes(e));
	wN.innerHTML = t.map((e, t) => `<button class="slash-item${t === EN ? " active" : ""}" data-idx="${t}"><span class="slash-icon">${e.icon}</span><span class="slash-text"><strong>${e.title}</strong><span class="slash-desc">${e.desc}</span></span>` + (e.md ? `<span class="slash-md">${e.md}</span>` : "") + "</button>").join(""), wN.querySelectorAll(".slash-item").forEach((e) => {
		let t = parseInt(e.dataset.idx, 10);
		isNaN(t) || (e.onclick = (e) => {
			e.stopPropagation(), EN = t, IN();
		}, e.onmouseenter = () => {
			EN = t, MN();
		});
	}), jN(wN);
}
function NN() {
	wN && (wN.style.display = "none", wN.innerHTML = ""), TN = !1, DN = -1, ON = "", kN = null;
}
function PN(e) {
	kN = e;
	let { view: t, state: n } = e, { from: r } = n.selection;
	DN = n.doc.resolve(r).start(), wN || (wN = document.createElement("div"), wN.className = "slash-menu", wN.style.cssText = "position:fixed;z-index:100000;", document.body.appendChild(wN));
	let i = t.coordsAtPos(r);
	wN.style.left = Math.max(0, i.left) + "px", wN.style.top = i.bottom + 4 + "px", wN.style.display = "block", EN = 0, ON = "", TN = !0, MN();
}
function FN(e) {
	if (!e) return;
	let { doc: t, selection: n } = e.state, { $from: r } = n;
	if (r.parent.type.name === "codeBlock") {
		TN && NN();
		return;
	}
	if (!e.isFocused) return;
	let i = r.pos, a = AN(t, i);
	if (a === "/" && !TN) {
		PN(e);
		return;
	}
	if (TN) if (a.startsWith("/")) {
		let e = a.slice(1);
		e !== ON && (ON = e, EN = 0, MN());
	} else NN();
}
function IN() {
	if (!TN || !wN) return;
	let e = CN.filter((e) => e.title.toLowerCase().includes(ON) || e.desc.toLowerCase().includes(ON))[EN];
	if (!e) {
		NN();
		return;
	}
	let t = kN;
	if (!t) {
		NN();
		return;
	}
	let { view: n } = t, r = n.state.selection.from, i = DN;
	NN();
	try {
		n.dispatch(n.state.tr.delete(i, r)), e.run(t), t.commands.focus();
	} catch (e) {
		console.error("runSlashItem error:", e);
	}
}
function LN(e) {
	if (!TN) return !1;
	let t = CN.filter((e) => e.title.toLowerCase().includes(ON) || e.desc.toLowerCase().includes(ON));
	if (!t.length && ![
		"ArrowDown",
		"ArrowUp",
		"Enter",
		"Tab",
		"Escape"
	].includes(e.key)) return !1;
	switch (e.key) {
		case "ArrowDown": return t.length ? (e.preventDefault(), EN = (EN + 1) % t.length, MN(), !0) : !0;
		case "ArrowUp": return t.length ? (e.preventDefault(), EN = (EN - 1 + t.length) % t.length, MN(), !0) : !0;
		case "Enter":
		case "Tab": return e.preventDefault(), IN(), !0;
		case "Escape": return e.preventDefault(), NN(), !0;
		default: return !1;
	}
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/wiki-menu.js
var RN = null, zN = !1, BN = -1, VN = "", HN = 0, UN = [], WN = null, GN = null;
function KN(e) {
	let t = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	};
	return String(e).replace(/[&<>"']/g, (e) => t[e]);
}
function qN(e) {
	let t = e?.querySelector(".active");
	t && t.scrollIntoView({ block: "nearest" });
}
function JN() {
	if (!RN) return;
	let e = VN.toLowerCase(), t = UN.filter((t) => t.title.toLowerCase().includes(e) || t.snippet && t.snippet.toLowerCase().includes(e));
	if (!t.length) {
		RN.style.display = "none";
		return;
	}
	RN.innerHTML = t.map((e, t) => `<button class="wiki-item${t === HN ? " active" : ""}" data-idx="${t}"><span class="wiki-icon">${KN(e.icon || "📄")}</span><span class="wiki-text"><strong>${KN(e.title)}</strong></span></button>`).join(""), RN.querySelectorAll(".wiki-item").forEach((e) => {
		let t = parseInt(e.dataset.idx, 10);
		isNaN(t) || (e.onclick = (e) => {
			e.stopPropagation(), HN = t, QN();
		}, e.onmouseenter = () => {
			HN = t, JN();
		});
	}), RN.style.display = "block", qN(RN);
}
function YN() {
	RN && (RN.style.display = "none", RN.innerHTML = ""), zN = !1, BN = -1, VN = "", HN = 0, UN = [], WN = null, GN &&= (clearTimeout(GN), null);
}
function XN(e, t) {
	WN = e, BN = t, VN = "", HN = 0, UN = [], RN || (RN = document.createElement("div"), RN.className = "wiki-menu", RN.style.cssText = "position:fixed;z-index:100000;max-height:240px;overflow-y:auto;", document.body.appendChild(RN));
	let { view: n } = e, r = n.coordsAtPos(t);
	RN.style.left = Math.max(0, r.left) + "px", RN.style.top = r.bottom + 4 + "px", zN = !0, ZN("");
}
function ZN(e) {
	GN && clearTimeout(GN), GN = setTimeout(async () => {
		GN = null;
		try {
			let t = await fetch("/api/search?q=" + encodeURIComponent(e), { credentials: "same-origin" });
			if (!t.ok) return;
			let n = await t.json();
			if (!zN) return;
			UN = n.pages && Array.isArray(n.pages) ? n.pages : [], JN();
		} catch {
			zN && YN();
		}
	}, 200);
}
function QN() {
	if (!zN || !RN || !WN) return;
	let e = VN.toLowerCase(), t = UN.filter((t) => t.title.toLowerCase().includes(e) || t.snippet && t.snippet.toLowerCase().includes(e))[HN];
	if (!t) {
		YN();
		return;
	}
	let n = WN;
	YN();
	try {
		let { view: e } = n, { schema: r } = e.state, i = `/page/${t.id}`, a = r.marks.link.create({ href: i }), o = r.text(t.title, [a]);
		e.dispatch(e.state.tr.replaceWith(Math.max(0, BN - 2), e.state.selection.from, o)), n.commands.focus();
	} catch {}
}
function $N(e) {
	if (!e || !e.isFocused) return;
	let { doc: t, selection: n } = e.state, { $from: r } = n;
	if (r.parent.type.name === "codeBlock") {
		zN && YN();
		return;
	}
	let i = r.pos, a = Math.max(0, i - 100), o = t.textBetween(a, i), s = o.lastIndexOf("[[");
	if (s !== -1) {
		let t = o.slice(s + 2);
		if (t.indexOf("]]") === -1) {
			let n = t, r = a + s;
			zN || XN(e, r + 2), n !== VN && (VN = n, HN = 0, ZN(n));
			return;
		}
	}
	if (zN) if (BN > 0) {
		let e = t.textBetween(Math.max(0, BN - 2), Math.min(t.content.size, BN + 50));
		if (!e.startsWith("[[") || e.includes("]]")) {
			YN();
			return;
		}
		if (i < BN) {
			YN();
			return;
		}
	} else YN();
}
function eP(e) {
	if (!zN || !RN || RN.style.display === "none") return !1;
	let t = VN.toLowerCase(), n = UN.filter((e) => e.title.toLowerCase().includes(t) || e.snippet && e.snippet.toLowerCase().includes(t));
	switch (e.key) {
		case "ArrowDown": return n.length ? (e.preventDefault(), HN = (HN + 1) % n.length, JN(), !0) : !0;
		case "ArrowUp": return n.length ? (e.preventDefault(), HN = (HN - 1 + n.length) % n.length, JN(), !0) : !0;
		case "Enter":
		case "Tab": return e.preventDefault(), QN(), !0;
		case "Escape": return e.preventDefault(), YN(), !0;
	}
	return !1;
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/table-menu.js
function tP(e) {
	let t = KM.get(e);
	t && t.tableMenuEl && (t.tableMenuEl.remove(), t.tableMenuEl = null);
}
function nP(e, t) {
	let n = KM.get(t);
	if (!n) return;
	let { state: r, view: i } = e, { selection: a } = r;
	if (!(r.schema.nodes.table && e.isActive("table"))) {
		tP(t);
		return;
	}
	let o = null;
	try {
		o = i.nodeDOM(a.$from.before(a.$from.depth));
	} catch {}
	if (!o || !o.closest) {
		let e = window.getSelection()?.anchorNode;
		e && (o = e.closest ? e.closest("td, th") : e.parentElement?.closest("td, th"));
	}
	if (!o) {
		tP(t);
		return;
	}
	if (!n.tableMenuEl) {
		let t = document.createElement("div");
		t.className = "table-bubble-menu", t.style.cssText = "position:fixed;z-index:99999;display:flex;gap:4px;padding:4px;background:var(--card-bg, #ffffff);border:1px solid var(--border, rgba(0,0,0,0.12));border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.1);", t.innerHTML = "\n      <button class=\"table-menu-btn\" data-action=\"addRowAfter\" title=\"Add Row Below\">➕ Row</button>\n      <button class=\"table-menu-btn\" data-action=\"deleteRow\" title=\"Delete Row\">❌ Row</button>\n      <button class=\"table-menu-btn\" data-action=\"addColumnAfter\" title=\"Add Column Right\">➕ Col</button>\n      <button class=\"table-menu-btn\" data-action=\"deleteColumn\" title=\"Delete Column\">❌ Col</button>\n      <button class=\"table-menu-btn table-menu-btn-danger\" data-action=\"deleteTable\" title=\"Delete Table\">🗑️ Table</button>\n    ", t.addEventListener("mousedown", (e) => e.preventDefault()), t.querySelectorAll(".table-menu-btn").forEach((t) => {
			t.onclick = (n) => {
				n.preventDefault();
				let r = t.dataset.action;
				r && e.commands[r] && e.chain().focus()[r]().run();
			};
		}), document.body.appendChild(t), n.tableMenuEl = t;
	}
	let s = o.getBoundingClientRect(), c = n.tableMenuEl.getBoundingClientRect(), l = s.top - c.height - 8, u = s.left + s.width / 2 - c.width / 2;
	n.tableMenuEl.style.top = Math.max(8, l) + "px", n.tableMenuEl.style.left = Math.max(8, u) + "px";
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/callout-node.js
var rP = yd({
	nodeName: "callout",
	name: "callout",
	content: "block",
	defaultAttributes: { type: "info" },
	allowedAttributes: ["type", "icon"]
}), iP = R.create({
	name: "callout",
	content: "block+",
	group: "block",
	defining: !0,
	addAttributes() {
		return {
			type: { default: "info" },
			icon: { default: "" }
		};
	},
	parseHTML() {
		return [{
			tag: "div[data-callout]",
			getAttrs: (e) => ({
				type: (e.getAttribute("data-type") || "info").toLowerCase(),
				icon: e.getAttribute("data-icon") || ""
			})
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		let t = e.type || "info", n = (hN[t] || hN.info).icon, r = e.icon || n;
		return [
			"div",
			{
				"data-callout": "",
				"data-type": t,
				"data-icon": r,
				class: "callout callout--" + t
			},
			[
				"div",
				{
					class: "callout-side",
					contenteditable: "false"
				},
				[
					"button",
					{
						class: "callout-icon-btn",
						"data-callout-icon": "",
						type: "button"
					},
					r
				],
				[
					"button",
					{
						class: "callout-color-btn",
						"data-callout-color": "",
						type: "button"
					},
					[
						"span",
						{ class: "callout-color-dot" },
						""
					]
				]
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
	...rP
}), aP = yd({
	nodeName: "toggle",
	name: "toggle",
	content: "block",
	defaultAttributes: { collapsed: !1 },
	allowedAttributes: ["collapsed"]
}), oP = R.create({
	name: "toggle",
	content: "block+",
	group: "block",
	defining: !0,
	addAttributes() {
		return { collapsed: { default: !1 } };
	},
	parseHTML() {
		return [{
			tag: "div[data-toggle]",
			getAttrs: (e) => ({ collapsed: e.getAttribute("data-collapsed") === "true" })
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		let t = !!e.collapsed;
		return [
			"div",
			{
				"data-toggle": "",
				"data-collapsed": t ? "true" : "false",
				class: "toggle" + (t ? " collapsed" : "")
			},
			[
				"span",
				{
					class: "toggle-arrow",
					"data-toggle-arrow": "",
					contenteditable: "false"
				},
				"▶"
			],
			[
				"div",
				{ class: "toggle-inner" },
				0
			]
		];
	},
	addCommands() {
		return { setToggle: (e = {}) => ({ commands: t, state: n }) => {
			let { $from: r } = n.selection;
			for (let n = r.depth; n > 0; n--) if (r.node(n).type.spec.defining) return t.insertContent({
				type: "toggle",
				attrs: e,
				content: [{ type: "paragraph" }]
			});
			return t.wrapIn(this.name, e);
		} };
	},
	...aP
});
function sP(e) {
	let t = e.target.closest("[data-toggle-arrow]");
	if (!t) return;
	let n = t.closest("[data-toggle]");
	if (!n) return;
	let r = YM(n);
	r && qM(r, n, "toggle", "collapsed", n.getAttribute("data-collapsed") !== "true");
}
function cP() {
	document.addEventListener("click", function(e) {
		e.target.closest("[data-toggle-arrow]") && sP(e);
	});
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/page-ref-node.js
var lP = R.create({
	name: "pageReference",
	group: "block",
	atom: !0,
	selectable: !0,
	draggable: !1,
	addAttributes() {
		return {
			pageId: { default: "" },
			title: { default: "Untitled" },
			icon: { default: "📄" }
		};
	},
	parseHTML() {
		return [{ tag: "div[data-page-ref]" }];
	},
	renderHTML({ HTMLAttributes: e }) {
		let { pageId: t, title: n, icon: r } = e;
		return [
			"div",
			{
				"data-page-ref": t,
				class: "page-ref-block"
			},
			[
				"span",
				{ class: "page-ref-icon" },
				r || "📄"
			],
			[
				"span",
				{ class: "page-ref-title" },
				n || "Untitled"
			],
			[
				"span",
				{
					class: "page-ref-open",
					title: "Open page"
				},
				"↗"
			]
		];
	},
	renderMarkdown() {}
});
function uP() {
	document.addEventListener("click", function(e) {
		let t = e.target.closest(".page-ref-open");
		if (!t) return;
		e.preventDefault(), e.stopPropagation();
		let n = t.closest("[data-page-ref]");
		if (n) {
			let e = n.getAttribute("data-page-ref");
			e && (window.location.href = `/page/${e}`);
		}
	});
}
var dP = (/* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return e instanceof Map ? e.clear = e.delete = e.set = function() {
			throw Error("map is read-only");
		} : e instanceof Set && (e.add = e.clear = e.delete = function() {
			throw Error("set is read-only");
		}), Object.freeze(e), Object.getOwnPropertyNames(e).forEach((t) => {
			let r = e[t], i = typeof r;
			(i === "object" || i === "function") && !Object.isFrozen(r) && n(r);
		}), e;
	}
	var r = class {
		constructor(e) {
			e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function a(e, ...t) {
		let n = Object.create(null);
		for (let t in e) n[t] = e[t];
		return t.forEach(function(e) {
			for (let t in e) n[t] = e[t];
		}), n;
	}
	var o = "</span>", s = (e) => !!e.scope, c = (e, { prefix: t }) => {
		if (e.startsWith("language:")) return e.replace("language:", "language-");
		if (e.includes(".")) {
			let n = e.split(".");
			return [`${t}${n.shift()}`, ...n.map((e, t) => `${e}${"_".repeat(t + 1)}`)].join(" ");
		}
		return `${t}${e}`;
	}, l = class {
		constructor(e, t) {
			this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
		}
		addText(e) {
			this.buffer += i(e);
		}
		openNode(e) {
			if (!s(e)) return;
			let t = c(e.scope, { prefix: this.classPrefix });
			this.span(t);
		}
		closeNode(e) {
			s(e) && (this.buffer += o);
		}
		value() {
			return this.buffer;
		}
		span(e) {
			this.buffer += `<span class="${e}">`;
		}
	}, u = (e = {}) => {
		let t = { children: [] };
		return Object.assign(t, e), t;
	}, d = class e {
		constructor() {
			this.rootNode = u(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		add(e) {
			this.top.children.push(e);
		}
		openNode(e) {
			let t = u({ scope: e });
			this.add(t), this.stack.push(t);
		}
		closeNode() {
			if (this.stack.length > 1) return this.stack.pop();
		}
		closeAllNodes() {
			for (; this.closeNode(););
		}
		toJSON() {
			return JSON.stringify(this.rootNode, null, 4);
		}
		walk(e) {
			return this.constructor._walk(e, this.rootNode);
		}
		static _walk(e, t) {
			return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((t) => this._walk(e, t)), e.closeNode(t)), e;
		}
		static _collapse(t) {
			typeof t != "string" && t.children && (t.children.every((e) => typeof e == "string") ? t.children = [t.children.join("")] : t.children.forEach((t) => {
				e._collapse(t);
			}));
		}
	}, f = class extends d {
		constructor(e) {
			super(), this.options = e;
		}
		addText(e) {
			e !== "" && this.add(e);
		}
		startScope(e) {
			this.openNode(e);
		}
		endScope() {
			this.closeNode();
		}
		__addSublanguage(e, t) {
			let n = e.root;
			t && (n.scope = `language:${t}`), this.add(n);
		}
		toHTML() {
			return new l(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function p(e) {
		return e ? typeof e == "string" ? e : e.source : null;
	}
	function m(e) {
		return _("(?=", e, ")");
	}
	function h(e) {
		return _("(?:", e, ")*");
	}
	function g(e) {
		return _("(?:", e, ")?");
	}
	function _(...e) {
		return e.map((e) => p(e)).join("");
	}
	function v(e) {
		let t = e[e.length - 1];
		return typeof t == "object" && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
	}
	function y(...e) {
		return "(" + (v(e).capture ? "" : "?:") + e.map((e) => p(e)).join("|") + ")";
	}
	function b(e) {
		return RegExp(e.toString() + "|").exec("").length - 1;
	}
	function x(e, t) {
		let n = e && e.exec(t);
		return n && n.index === 0;
	}
	var S = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
	function ee(e, { joinWith: t }) {
		let n = 0;
		return e.map((e) => {
			n += 1;
			let t = n, r = p(e), i = "";
			for (; r.length > 0;) {
				let e = S.exec(r);
				if (!e) {
					i += r;
					break;
				}
				i += r.substring(0, e.index), r = r.substring(e.index + e[0].length), e[0][0] === "\\" && e[1] ? i += "\\" + String(Number(e[1]) + t) : (i += e[0], e[0] === "(" && n++);
			}
			return i;
		}).map((e) => `(${e})`).join(t);
	}
	var te = /\b\B/, C = "[a-zA-Z]\\w*", ne = "[a-zA-Z_]\\w*", w = "\\b\\d+(\\.\\d+)?", re = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ie = "\\b(0b[01]+)", T = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ae = (e = {}) => {
		let t = /^#![ ]*\//;
		return e.binary && (e.begin = _(t, /.*\b/, e.binary, /\b.*/)), a({
			scope: "meta",
			begin: t,
			end: /$/,
			relevance: 0,
			"on:begin": (e, t) => {
				e.index !== 0 && t.ignoreMatch();
			}
		}, e);
	}, E = {
		begin: "\\\\[\\s\\S]",
		relevance: 0
	}, oe = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\n",
		contains: [E]
	}, D = {
		scope: "string",
		begin: "\"",
		end: "\"",
		illegal: "\\n",
		contains: [E]
	}, se = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, ce = function(e, t, n = {}) {
		let r = a({
			scope: "comment",
			begin: e,
			end: t,
			contains: []
		}, n);
		r.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		let i = y("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return r.contains.push({ begin: _(/[ ]+/, "(", i, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), r;
	}, le = ce("//", "$"), ue = ce("/\\*", "\\*/"), de = ce("#", "$"), fe = {
		scope: "number",
		begin: w,
		relevance: 0
	}, pe = {
		scope: "number",
		begin: re,
		relevance: 0
	}, me = {
		scope: "number",
		begin: ie,
		relevance: 0
	}, he = {
		scope: "regexp",
		begin: /\/(?=[^/\n]*\/)/,
		end: /\/[gimuy]*/,
		contains: [E, {
			begin: /\[/,
			end: /\]/,
			relevance: 0,
			contains: [E]
		}]
	}, ge = {
		scope: "title",
		begin: C,
		relevance: 0
	}, _e = {
		scope: "title",
		begin: ne,
		relevance: 0
	}, ve = {
		begin: "\\.\\s*" + ne,
		relevance: 0
	}, ye = /*#__PURE__*/ Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: oe,
		BACKSLASH_ESCAPE: E,
		BINARY_NUMBER_MODE: me,
		BINARY_NUMBER_RE: ie,
		COMMENT: ce,
		C_BLOCK_COMMENT_MODE: ue,
		C_LINE_COMMENT_MODE: le,
		C_NUMBER_MODE: pe,
		C_NUMBER_RE: re,
		END_SAME_AS_BEGIN: function(e) {
			return Object.assign(e, {
				"on:begin": (e, t) => {
					t.data._beginMatch = e[1];
				},
				"on:end": (e, t) => {
					t.data._beginMatch !== e[1] && t.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: de,
		IDENT_RE: C,
		MATCH_NOTHING_RE: te,
		METHOD_GUARD: ve,
		NUMBER_MODE: fe,
		NUMBER_RE: w,
		PHRASAL_WORDS_MODE: se,
		QUOTE_STRING_MODE: D,
		REGEXP_MODE: he,
		RE_STARTERS_RE: T,
		SHEBANG: ae,
		TITLE_MODE: ge,
		UNDERSCORE_IDENT_RE: ne,
		UNDERSCORE_TITLE_MODE: _e
	});
	function be(e, t) {
		e.input[e.index - 1] === "." && t.ignoreMatch();
	}
	function xe(e, t) {
		e.className !== void 0 && (e.scope = e.className, delete e.className);
	}
	function Se(e, t) {
		t && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e.__beforeBegin = be, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords, e.relevance === void 0 && (e.relevance = 0));
	}
	function Ce(e, t) {
		Array.isArray(e.illegal) && (e.illegal = y(...e.illegal));
	}
	function we(e, t) {
		if (e.match) {
			if (e.begin || e.end) throw Error("begin & end are not supported with match");
			e.begin = e.match, delete e.match;
		}
	}
	function Te(e, t) {
		e.relevance === void 0 && (e.relevance = 1);
	}
	var Ee = (e, t) => {
		if (!e.beforeMatch) return;
		if (e.starts) throw Error("beforeMatch cannot be used with starts");
		let n = Object.assign({}, e);
		Object.keys(e).forEach((t) => {
			delete e[t];
		}), e.keywords = n.keywords, e.begin = _(n.beforeMatch, m(n.begin)), e.starts = {
			relevance: 0,
			contains: [Object.assign(n, { endsParent: !0 })]
		}, e.relevance = 0, delete n.beforeMatch;
	}, De = [
		"of",
		"and",
		"for",
		"in",
		"not",
		"or",
		"if",
		"then",
		"parent",
		"list",
		"value"
	], Oe = "keyword";
	function ke(e, t, n = Oe) {
		let r = Object.create(null);
		return typeof e == "string" ? i(n, e.split(" ")) : Array.isArray(e) ? i(n, e) : Object.keys(e).forEach(function(n) {
			Object.assign(r, ke(e[n], t, n));
		}), r;
		function i(e, n) {
			t && (n = n.map((e) => e.toLowerCase())), n.forEach(function(t) {
				let n = t.split("|");
				r[n[0]] = [e, Ae(n[0], n[1])];
			});
		}
	}
	function Ae(e, t) {
		return t ? Number(t) : +!je(e);
	}
	function je(e) {
		return De.includes(e.toLowerCase());
	}
	var Me = {}, Ne = (e) => {
		console.error(e);
	}, Pe = (e, ...t) => {
		console.log(`WARN: ${e}`, ...t);
	}, Fe = (e, t) => {
		Me[`${e}/${t}`] || (console.log(`Deprecated as of ${e}. ${t}`), Me[`${e}/${t}`] = !0);
	}, Ie = /* @__PURE__ */ Error();
	function Le(e, t, { key: n }) {
		let r = 0, i = e[n], a = {}, o = {};
		for (let e = 1; e <= t.length; e++) o[e + r] = i[e], a[e + r] = !0, r += b(t[e - 1]);
		e[n] = o, e[n]._emit = a, e[n]._multi = !0;
	}
	function Re(e) {
		if (Array.isArray(e.begin)) {
			if (e.skip || e.excludeBegin || e.returnBegin) throw Ne("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ie;
			if (typeof e.beginScope != "object" || e.beginScope === null) throw Ne("beginScope must be object"), Ie;
			Le(e, e.begin, { key: "beginScope" }), e.begin = ee(e.begin, { joinWith: "" });
		}
	}
	function ze(e) {
		if (Array.isArray(e.end)) {
			if (e.skip || e.excludeEnd || e.returnEnd) throw Ne("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ie;
			if (typeof e.endScope != "object" || e.endScope === null) throw Ne("endScope must be object"), Ie;
			Le(e, e.end, { key: "endScope" }), e.end = ee(e.end, { joinWith: "" });
		}
	}
	function Be(e) {
		e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope, delete e.scope);
	}
	function Ve(e) {
		Be(e), typeof e.beginScope == "string" && (e.beginScope = { _wrap: e.beginScope }), typeof e.endScope == "string" && (e.endScope = { _wrap: e.endScope }), Re(e), ze(e);
	}
	function He(e) {
		function t(t, n) {
			return new RegExp(p(t), "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (n ? "g" : ""));
		}
		class n {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(e, t) {
				t.position = this.position++, this.matchIndexes[this.matchAt] = t, this.regexes.push([t, e]), this.matchAt += b(e) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				let e = this.regexes.map((e) => e[1]);
				this.matcherRe = t(ee(e, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			exec(e) {
				this.matcherRe.lastIndex = this.lastIndex;
				let t = this.matcherRe.exec(e);
				if (!t) return null;
				let n = t.findIndex((e, t) => t > 0 && e !== void 0), r = this.matchIndexes[n];
				return t.splice(0, n), Object.assign(t, r);
			}
		}
		class r {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(e) {
				if (this.multiRegexes[e]) return this.multiRegexes[e];
				let t = new n();
				return this.rules.slice(e).forEach(([e, n]) => t.addRule(e, n)), t.compile(), this.multiRegexes[e] = t, t;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(e, t) {
				this.rules.push([e, t]), t.type === "begin" && this.count++;
			}
			exec(e) {
				let t = this.getMatcher(this.regexIndex);
				t.lastIndex = this.lastIndex;
				let n = t.exec(e);
				if (this.resumingScanAtSamePosition() && !(n && n.index === this.lastIndex)) {
					let t = this.getMatcher(0);
					t.lastIndex = this.lastIndex + 1, n = t.exec(e);
				}
				return n && (this.regexIndex += n.position + 1, this.regexIndex === this.count && this.considerAll()), n;
			}
		}
		function i(e) {
			let t = new r();
			return e.contains.forEach((e) => t.addRule(e.begin, {
				rule: e,
				type: "begin"
			})), e.terminatorEnd && t.addRule(e.terminatorEnd, { type: "end" }), e.illegal && t.addRule(e.illegal, { type: "illegal" }), t;
		}
		function o(n, r) {
			let a = n;
			if (n.isCompiled) return a;
			[
				xe,
				we,
				Ve,
				Ee
			].forEach((e) => e(n, r)), e.compilerExtensions.forEach((e) => e(n, r)), n.__beforeBegin = null, [
				Se,
				Ce,
				Te
			].forEach((e) => e(n, r)), n.isCompiled = !0;
			let s = null;
			return typeof n.keywords == "object" && n.keywords.$pattern && (n.keywords = Object.assign({}, n.keywords), s = n.keywords.$pattern, delete n.keywords.$pattern), s ||= /\w+/, n.keywords &&= ke(n.keywords, e.case_insensitive), a.keywordPatternRe = t(s, !0), r && (n.begin ||= /\B|\b/, a.beginRe = t(a.begin), !n.end && !n.endsWithParent && (n.end = /\B|\b/), n.end && (a.endRe = t(a.end)), a.terminatorEnd = p(a.end) || "", n.endsWithParent && r.terminatorEnd && (a.terminatorEnd += (n.end ? "|" : "") + r.terminatorEnd)), n.illegal && (a.illegalRe = t(n.illegal)), n.contains ||= [], n.contains = [].concat(...n.contains.map(function(e) {
				return We(e === "self" ? n : e);
			})), n.contains.forEach(function(e) {
				o(e, a);
			}), n.starts && o(n.starts, r), a.matcher = i(a), a;
		}
		if (e.compilerExtensions ||= [], e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
		return e.classNameAliases = a(e.classNameAliases || {}), o(e);
	}
	function Ue(e) {
		return e ? e.endsWithParent || Ue(e.starts) : !1;
	}
	function We(e) {
		return e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map(function(t) {
			return a(e, { variants: null }, t);
		})), e.cachedVariants ? e.cachedVariants : Ue(e) ? a(e, { starts: e.starts ? a(e.starts) : null }) : Object.isFrozen(e) ? a(e) : e;
	}
	var Ge = "11.11.1", Ke = class extends Error {
		constructor(e, t) {
			super(e), this.name = "HTMLInjectionError", this.html = t;
		}
	}, qe = i, Je = a, Ye = Symbol("nomatch"), Xe = 7, Ze = function(e) {
		let t = Object.create(null), i = Object.create(null), a = [], o = !0, s = "Could not find the language '{}', did you forget to load/include a language module?", c = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		}, l = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			__emitter: f
		};
		function u(e) {
			return l.noHighlightRe.test(e);
		}
		function d(e) {
			let t = e.className + " ";
			t += e.parentNode ? e.parentNode.className : "";
			let n = l.languageDetectRe.exec(t);
			if (n) {
				let t = oe(n[1]);
				return t || (Pe(s.replace("{}", n[1])), Pe("Falling back to no-highlight mode for this block.", e)), t ? n[1] : "no-highlight";
			}
			return t.split(/\s+/).find((e) => u(e) || oe(e));
		}
		function p(e, t, n) {
			let r = "", i = "";
			typeof t == "object" ? (r = e, n = t.ignoreIllegals, i = t.language) : (Fe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Fe("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), i = e, r = t), n === void 0 && (n = !0);
			let a = {
				code: r,
				language: i
			};
			de("before:highlight", a);
			let o = a.result ? a.result : v(a.language, a.code, n);
			return o.code = a.code, de("after:highlight", o), o;
		}
		function v(e, n, i, a) {
			let c = Object.create(null);
			function u(e, t) {
				return e.keywords[t];
			}
			function d() {
				if (!T.keywords) {
					E.addText(D);
					return;
				}
				let e = 0;
				T.keywordPatternRe.lastIndex = 0;
				let t = T.keywordPatternRe.exec(D), n = "";
				for (; t;) {
					n += D.substring(e, t.index);
					let r = w.case_insensitive ? t[0].toLowerCase() : t[0], i = u(T, r);
					if (i) {
						let [e, a] = i;
						if (E.addText(n), n = "", c[r] = (c[r] || 0) + 1, c[r] <= Xe && (se += a), e.startsWith("_")) n += t[0];
						else {
							let n = w.classNameAliases[e] || e;
							m(t[0], n);
						}
					} else n += t[0];
					e = T.keywordPatternRe.lastIndex, t = T.keywordPatternRe.exec(D);
				}
				n += D.substring(e), E.addText(n);
			}
			function f() {
				if (D === "") return;
				let e = null;
				if (typeof T.subLanguage == "string") {
					if (!t[T.subLanguage]) {
						E.addText(D);
						return;
					}
					e = v(T.subLanguage, D, !0, ae[T.subLanguage]), ae[T.subLanguage] = e._top;
				} else e = S(D, T.subLanguage.length ? T.subLanguage : null);
				T.relevance > 0 && (se += e.relevance), E.__addSublanguage(e._emitter, e.language);
			}
			function p() {
				T.subLanguage == null ? d() : f(), D = "";
			}
			function m(e, t) {
				e !== "" && (E.startScope(t), E.addText(e), E.endScope());
			}
			function h(e, t) {
				let n = 1, r = t.length - 1;
				for (; n <= r;) {
					if (!e._emit[n]) {
						n++;
						continue;
					}
					let r = w.classNameAliases[e[n]] || e[n], i = t[n];
					r ? m(i, r) : (D = i, d(), D = ""), n++;
				}
			}
			function g(e, t) {
				return e.scope && typeof e.scope == "string" && E.openNode(w.classNameAliases[e.scope] || e.scope), e.beginScope && (e.beginScope._wrap ? (m(D, w.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap), D = "") : e.beginScope._multi && (h(e.beginScope, t), D = "")), T = Object.create(e, { parent: { value: T } }), T;
			}
			function _(e, t, n) {
				let i = x(e.endRe, n);
				if (i) {
					if (e["on:end"]) {
						let n = new r(e);
						e["on:end"](t, n), n.isMatchIgnored && (i = !1);
					}
					if (i) {
						for (; e.endsParent && e.parent;) e = e.parent;
						return e;
					}
				}
				if (e.endsWithParent) return _(e.parent, t, n);
			}
			function y(e) {
				return T.matcher.regexIndex === 0 ? (D += e[0], 1) : (ue = !0, 0);
			}
			function b(e) {
				let t = e[0], n = e.rule, i = new r(n), a = [n.__beforeBegin, n["on:begin"]];
				for (let n of a) if (n && (n(e, i), i.isMatchIgnored)) return y(t);
				return n.skip ? D += t : (n.excludeBegin && (D += t), p(), !n.returnBegin && !n.excludeBegin && (D = t)), g(n, e), n.returnBegin ? 0 : t.length;
			}
			function ee(e) {
				let t = e[0], r = n.substring(e.index), i = _(T, e, r);
				if (!i) return Ye;
				let a = T;
				T.endScope && T.endScope._wrap ? (p(), m(t, T.endScope._wrap)) : T.endScope && T.endScope._multi ? (p(), h(T.endScope, e)) : a.skip ? D += t : (a.returnEnd || a.excludeEnd || (D += t), p(), a.excludeEnd && (D = t));
				do
					T.scope && E.closeNode(), !T.skip && !T.subLanguage && (se += T.relevance), T = T.parent;
				while (T !== i.parent);
				return i.starts && g(i.starts, e), a.returnEnd ? 0 : t.length;
			}
			function te() {
				let e = [];
				for (let t = T; t !== w; t = t.parent) t.scope && e.unshift(t.scope);
				e.forEach((e) => E.openNode(e));
			}
			let C = {};
			function ne(t, r) {
				let a = r && r[0];
				if (D += t, a == null) return p(), 0;
				if (C.type === "begin" && r.type === "end" && C.index === r.index && a === "") {
					if (D += n.slice(r.index, r.index + 1), !o) {
						let t = /* @__PURE__ */ Error(`0 width match regex (${e})`);
						throw t.languageName = e, t.badRule = C.rule, t;
					}
					return 1;
				}
				if (C = r, r.type === "begin") return b(r);
				if (r.type === "illegal" && !i) {
					let e = /* @__PURE__ */ Error("Illegal lexeme \"" + a + "\" for mode \"" + (T.scope || "<unnamed>") + "\"");
					throw e.mode = T, e;
				} else if (r.type === "end") {
					let e = ee(r);
					if (e !== Ye) return e;
				}
				if (r.type === "illegal" && a === "") return D += "\n", 1;
				if (le > 1e5 && le > r.index * 3) throw /* @__PURE__ */ Error("potential infinite loop, way more iterations than matches");
				return D += a, a.length;
			}
			let w = oe(e);
			if (!w) throw Ne(s.replace("{}", e)), Error("Unknown language: \"" + e + "\"");
			let re = He(w), ie = "", T = a || re, ae = {}, E = new l.__emitter(l);
			te();
			let D = "", se = 0, ce = 0, le = 0, ue = !1;
			try {
				if (w.__emitTokens) w.__emitTokens(n, E);
				else {
					for (T.matcher.considerAll();;) {
						le++, ue ? ue = !1 : T.matcher.considerAll(), T.matcher.lastIndex = ce;
						let e = T.matcher.exec(n);
						if (!e) break;
						let t = ne(n.substring(ce, e.index), e);
						ce = e.index + t;
					}
					ne(n.substring(ce));
				}
				return E.finalize(), ie = E.toHTML(), {
					language: e,
					value: ie,
					relevance: se,
					illegal: !1,
					_emitter: E,
					_top: T
				};
			} catch (t) {
				if (t.message && t.message.includes("Illegal")) return {
					language: e,
					value: qe(n),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: t.message,
						index: ce,
						context: n.slice(ce - 100, ce + 100),
						mode: t.mode,
						resultSoFar: ie
					},
					_emitter: E
				};
				if (o) return {
					language: e,
					value: qe(n),
					illegal: !1,
					relevance: 0,
					errorRaised: t,
					_emitter: E,
					_top: T
				};
				throw t;
			}
		}
		function b(e) {
			let t = {
				value: qe(e),
				illegal: !1,
				relevance: 0,
				_top: c,
				_emitter: new l.__emitter(l)
			};
			return t._emitter.addText(e), t;
		}
		function S(e, n) {
			n = n || l.languages || Object.keys(t);
			let r = b(e), i = n.filter(oe).filter(se).map((t) => v(t, e, !1));
			i.unshift(r);
			let [a, o] = i.sort((e, t) => {
				if (e.relevance !== t.relevance) return t.relevance - e.relevance;
				if (e.language && t.language) {
					if (oe(e.language).supersetOf === t.language) return 1;
					if (oe(t.language).supersetOf === e.language) return -1;
				}
				return 0;
			}), s = a;
			return s.secondBest = o, s;
		}
		function ee(e, t, n) {
			let r = t && i[t] || n;
			e.classList.add("hljs"), e.classList.add(`language-${r}`);
		}
		function te(e) {
			let t = null, n = d(e);
			if (u(n)) return;
			if (de("before:highlightElement", {
				el: e,
				language: n
			}), e.dataset.highlighted) {
				console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e);
				return;
			}
			if (e.children.length > 0 && (l.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e)), l.throwUnescapedHTML)) throw new Ke("One of your code blocks includes unescaped HTML.", e.innerHTML);
			t = e;
			let r = t.textContent, i = n ? p(r, {
				language: n,
				ignoreIllegals: !0
			}) : S(r);
			e.innerHTML = i.value, e.dataset.highlighted = "yes", ee(e, n, i.language), e.result = {
				language: i.language,
				re: i.relevance,
				relevance: i.relevance
			}, i.secondBest && (e.secondBest = {
				language: i.secondBest.language,
				relevance: i.secondBest.relevance
			}), de("after:highlightElement", {
				el: e,
				result: i,
				text: r
			});
		}
		function C(e) {
			l = Je(l, e);
		}
		let ne = () => {
			ie(), Fe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
		};
		function w() {
			ie(), Fe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
		}
		let re = !1;
		function ie() {
			function e() {
				ie();
			}
			if (document.readyState === "loading") {
				re || window.addEventListener("DOMContentLoaded", e, !1), re = !0;
				return;
			}
			document.querySelectorAll(l.cssSelector).forEach(te);
		}
		function T(n, r) {
			let i = null;
			try {
				i = r(e);
			} catch (e) {
				if (Ne("Language definition for '{}' could not be registered.".replace("{}", n)), o) Ne(e);
				else throw e;
				i = c;
			}
			i.name ||= n, t[n] = i, i.rawDefinition = r.bind(null, e), i.aliases && D(i.aliases, { languageName: n });
		}
		function ae(e) {
			delete t[e];
			for (let t of Object.keys(i)) i[t] === e && delete i[t];
		}
		function E() {
			return Object.keys(t);
		}
		function oe(e) {
			return e = (e || "").toLowerCase(), t[e] || t[i[e]];
		}
		function D(e, { languageName: t }) {
			typeof e == "string" && (e = [e]), e.forEach((e) => {
				i[e.toLowerCase()] = t;
			});
		}
		function se(e) {
			let t = oe(e);
			return t && !t.disableAutodetect;
		}
		function ce(e) {
			e["before:highlightBlock"] && !e["before:highlightElement"] && (e["before:highlightElement"] = (t) => {
				e["before:highlightBlock"](Object.assign({ block: t.el }, t));
			}), e["after:highlightBlock"] && !e["after:highlightElement"] && (e["after:highlightElement"] = (t) => {
				e["after:highlightBlock"](Object.assign({ block: t.el }, t));
			});
		}
		function le(e) {
			ce(e), a.push(e);
		}
		function ue(e) {
			let t = a.indexOf(e);
			t !== -1 && a.splice(t, 1);
		}
		function de(e, t) {
			let n = e;
			a.forEach(function(e) {
				e[n] && e[n](t);
			});
		}
		function fe(e) {
			return Fe("10.7.0", "highlightBlock will be removed entirely in v12.0"), Fe("10.7.0", "Please use highlightElement now."), te(e);
		}
		Object.assign(e, {
			highlight: p,
			highlightAuto: S,
			highlightAll: ie,
			highlightElement: te,
			highlightBlock: fe,
			configure: C,
			initHighlighting: ne,
			initHighlightingOnLoad: w,
			registerLanguage: T,
			unregisterLanguage: ae,
			listLanguages: E,
			getLanguage: oe,
			registerAliases: D,
			autoDetection: se,
			inherit: Je,
			addPlugin: le,
			removePlugin: ue
		}), e.debugMode = function() {
			o = !1;
		}, e.safeMode = function() {
			o = !0;
		}, e.versionString = Ge, e.regex = {
			concat: _,
			lookahead: m,
			either: y,
			optional: g,
			anyNumberOfTimes: h
		};
		for (let e in ye) typeof ye[e] == "object" && n(ye[e]);
		return Object.assign(e, ye), e;
	}, Qe = Ze({});
	Qe.newInstance = () => Ze({}), t.exports = Qe, Qe.HighlightJS = Qe, Qe.default = Qe;
})))())).default, fP = "[A-Za-z$_][0-9A-Za-z$_]*", pP = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), mP = [
	"true",
	"false",
	"null",
	"undefined",
	"NaN",
	"Infinity"
], hP = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), gP = [
	"Error",
	"EvalError",
	"InternalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError"
], _P = [
	"setInterval",
	"setTimeout",
	"clearInterval",
	"clearTimeout",
	"require",
	"exports",
	"eval",
	"isFinite",
	"isNaN",
	"parseFloat",
	"parseInt",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"escape",
	"unescape"
], vP = [
	"arguments",
	"this",
	"super",
	"console",
	"window",
	"document",
	"localStorage",
	"sessionStorage",
	"module",
	"global"
], yP = [].concat(_P, hP, gP);
function bP(e) {
	let t = e.regex, n = (e, { after: t }) => {
		let n = "</" + e[0].slice(1);
		return e.input.indexOf(n, t) !== -1;
	}, r = fP, i = {
		begin: "<>",
		end: "</>"
	}, a = /<[A-Za-z0-9\\._:-]+\s*\/>/, o = {
		begin: /<[A-Za-z0-9\\._:-]+/,
		end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
		isTrulyOpeningTag: (e, t) => {
			let r = e[0].length + e.index, i = e.input[r];
			if (i === "<" || i === ",") {
				t.ignoreMatch();
				return;
			}
			i === ">" && (n(e, { after: r }) || t.ignoreMatch());
			let a, o = e.input.substring(r);
			if (a = o.match(/^\s*=/)) {
				t.ignoreMatch();
				return;
			}
			if ((a = o.match(/^\s+extends\s+/)) && a.index === 0) {
				t.ignoreMatch();
				return;
			}
		}
	}, s = {
		$pattern: fP,
		keyword: pP,
		literal: mP,
		built_in: yP,
		"variable.language": vP
	}, c = "[0-9](_?[0-9])*", l = `\\.(${c})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", d = {
		className: "number",
		variants: [
			{ begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b` },
			{ begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
			{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
			{ begin: "\\b0[0-7]+n?\\b" }
		],
		relevance: 0
	}, f = {
		className: "subst",
		begin: "\\$\\{",
		end: "\\}",
		keywords: s,
		contains: []
	}, p = {
		begin: ".?html`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, f],
			subLanguage: "xml"
		}
	}, m = {
		begin: ".?css`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, f],
			subLanguage: "css"
		}
	}, h = {
		begin: ".?gql`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, f],
			subLanguage: "graphql"
		}
	}, g = {
		className: "string",
		begin: "`",
		end: "`",
		contains: [e.BACKSLASH_ESCAPE, f]
	}, _ = {
		className: "comment",
		variants: [
			e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
				relevance: 0,
				contains: [{
					begin: "(?=@[A-Za-z]+)",
					relevance: 0,
					contains: [
						{
							className: "doctag",
							begin: "@[A-Za-z]+"
						},
						{
							className: "type",
							begin: "\\{",
							end: "\\}",
							excludeEnd: !0,
							excludeBegin: !0,
							relevance: 0
						},
						{
							className: "variable",
							begin: r + "(?=\\s*(-)|$)",
							endsParent: !0,
							relevance: 0
						},
						{
							begin: /(?=[^\n])\s/,
							relevance: 0
						}
					]
				}]
			}),
			e.C_BLOCK_COMMENT_MODE,
			e.C_LINE_COMMENT_MODE
		]
	}, v = [
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE,
		p,
		m,
		h,
		g,
		{ match: /\$\d+/ },
		d
	];
	f.contains = v.concat({
		begin: /\{/,
		end: /\}/,
		keywords: s,
		contains: ["self"].concat(v)
	});
	let y = [].concat(_, f.contains), b = y.concat([{
		begin: /(\s*)\(/,
		end: /\)/,
		keywords: s,
		contains: ["self"].concat(y)
	}]), x = {
		className: "params",
		begin: /(\s*)\(/,
		end: /\)/,
		excludeBegin: !0,
		excludeEnd: !0,
		keywords: s,
		contains: b
	}, S = { variants: [{
		match: [
			/class/,
			/\s+/,
			r,
			/\s+/,
			/extends/,
			/\s+/,
			t.concat(r, "(", t.concat(/\./, r), ")*")
		],
		scope: {
			1: "keyword",
			3: "title.class",
			5: "keyword",
			7: "title.class.inherited"
		}
	}, {
		match: [
			/class/,
			/\s+/,
			r
		],
		scope: {
			1: "keyword",
			3: "title.class"
		}
	}] }, ee = {
		relevance: 0,
		match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
		className: "title.class",
		keywords: { _: [...hP, ...gP] }
	}, te = {
		label: "use_strict",
		className: "meta",
		relevance: 10,
		begin: /^\s*['"]use (strict|asm)['"]/
	}, C = {
		variants: [{ match: [
			/function/,
			/\s+/,
			r,
			/(?=\s*\()/
		] }, { match: [/function/, /\s*(?=\()/] }],
		className: {
			1: "keyword",
			3: "title.function"
		},
		label: "func.def",
		contains: [x],
		illegal: /%/
	}, ne = {
		relevance: 0,
		match: /\b[A-Z][A-Z_0-9]+\b/,
		className: "variable.constant"
	};
	function w(e) {
		return t.concat("(?!", e.join("|"), ")");
	}
	let re = {
		match: t.concat(/\b/, w([
			..._P,
			"super",
			"import"
		].map((e) => `${e}\\s*\\(`)), r, t.lookahead(/\s*\(/)),
		className: "title.function",
		relevance: 0
	}, ie = {
		begin: t.concat(/\./, t.lookahead(t.concat(r, /(?![0-9A-Za-z$_(])/))),
		end: r,
		excludeBegin: !0,
		keywords: "prototype",
		className: "property",
		relevance: 0
	}, T = {
		match: [
			/get|set/,
			/\s+/,
			r,
			/(?=\()/
		],
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [{ begin: /\(\)/ }, x]
	}, ae = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", E = {
		match: [
			/const|var|let/,
			/\s+/,
			r,
			/\s*/,
			/=\s*/,
			/(async\s*)?/,
			t.lookahead(ae)
		],
		keywords: "async",
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [x]
	};
	return {
		name: "JavaScript",
		aliases: [
			"js",
			"jsx",
			"mjs",
			"cjs"
		],
		keywords: s,
		exports: {
			PARAMS_CONTAINS: b,
			CLASS_REFERENCE: ee
		},
		illegal: /#(?![$_A-z])/,
		contains: [
			e.SHEBANG({
				label: "shebang",
				binary: "node",
				relevance: 5
			}),
			te,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			p,
			m,
			h,
			g,
			_,
			{ match: /\$\d+/ },
			d,
			ee,
			{
				scope: "attr",
				match: r + t.lookahead(":"),
				relevance: 0
			},
			E,
			{
				begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
				keywords: "return throw case",
				relevance: 0,
				contains: [
					_,
					e.REGEXP_MODE,
					{
						className: "function",
						begin: ae,
						returnBegin: !0,
						end: "\\s*=>",
						contains: [{
							className: "params",
							variants: [
								{
									begin: e.UNDERSCORE_IDENT_RE,
									relevance: 0
								},
								{
									className: null,
									begin: /\(\s*\)/,
									skip: !0
								},
								{
									begin: /(\s*)\(/,
									end: /\)/,
									excludeBegin: !0,
									excludeEnd: !0,
									keywords: s,
									contains: b
								}
							]
						}]
					},
					{
						begin: /,/,
						relevance: 0
					},
					{
						match: /\s+/,
						relevance: 0
					},
					{
						variants: [
							{
								begin: i.begin,
								end: i.end
							},
							{ match: a },
							{
								begin: o.begin,
								"on:begin": o.isTrulyOpeningTag,
								end: o.end
							}
						],
						subLanguage: "xml",
						contains: [{
							begin: o.begin,
							end: o.end,
							skip: !0,
							contains: ["self"]
						}]
					}
				]
			},
			C,
			{ beginKeywords: "while if switch catch for" },
			{
				begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
				returnBegin: !0,
				label: "func.def",
				contains: [x, e.inherit(e.TITLE_MODE, {
					begin: r,
					className: "title.function"
				})]
			},
			{
				match: /\.\.\./,
				relevance: 0
			},
			ie,
			{
				match: "\\$" + r,
				relevance: 0
			},
			{
				match: [/\bconstructor(?=\s*\()/],
				className: { 1: "title.function" },
				contains: [x]
			},
			re,
			ne,
			S,
			T,
			{ match: /\$[(.]/ }
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/typescript.js
var xP = "[A-Za-z$_][0-9A-Za-z$_]*", SP = /* @__PURE__ */ "as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using".split("."), CP = [
	"true",
	"false",
	"null",
	"undefined",
	"NaN",
	"Infinity"
], wP = /* @__PURE__ */ "Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly".split("."), TP = [
	"Error",
	"EvalError",
	"InternalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError"
], EP = [
	"setInterval",
	"setTimeout",
	"clearInterval",
	"clearTimeout",
	"require",
	"exports",
	"eval",
	"isFinite",
	"isNaN",
	"parseFloat",
	"parseInt",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"escape",
	"unescape"
], DP = [
	"arguments",
	"this",
	"super",
	"console",
	"window",
	"document",
	"localStorage",
	"sessionStorage",
	"module",
	"global"
], OP = [].concat(EP, wP, TP);
function kP(e) {
	let t = e.regex, n = (e, { after: t }) => {
		let n = "</" + e[0].slice(1);
		return e.input.indexOf(n, t) !== -1;
	}, r = xP, i = {
		begin: "<>",
		end: "</>"
	}, a = /<[A-Za-z0-9\\._:-]+\s*\/>/, o = {
		begin: /<[A-Za-z0-9\\._:-]+/,
		end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
		isTrulyOpeningTag: (e, t) => {
			let r = e[0].length + e.index, i = e.input[r];
			if (i === "<" || i === ",") {
				t.ignoreMatch();
				return;
			}
			i === ">" && (n(e, { after: r }) || t.ignoreMatch());
			let a, o = e.input.substring(r);
			if (a = o.match(/^\s*=/)) {
				t.ignoreMatch();
				return;
			}
			if ((a = o.match(/^\s+extends\s+/)) && a.index === 0) {
				t.ignoreMatch();
				return;
			}
		}
	}, s = {
		$pattern: xP,
		keyword: SP,
		literal: CP,
		built_in: OP,
		"variable.language": DP
	}, c = "[0-9](_?[0-9])*", l = `\\.(${c})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", d = {
		className: "number",
		variants: [
			{ begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b` },
			{ begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
			{ begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
			{ begin: "\\b0[0-7]+n?\\b" }
		],
		relevance: 0
	}, f = {
		className: "subst",
		begin: "\\$\\{",
		end: "\\}",
		keywords: s,
		contains: []
	}, p = {
		begin: ".?html`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, f],
			subLanguage: "xml"
		}
	}, m = {
		begin: ".?css`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, f],
			subLanguage: "css"
		}
	}, h = {
		begin: ".?gql`",
		end: "",
		starts: {
			end: "`",
			returnEnd: !1,
			contains: [e.BACKSLASH_ESCAPE, f],
			subLanguage: "graphql"
		}
	}, g = {
		className: "string",
		begin: "`",
		end: "`",
		contains: [e.BACKSLASH_ESCAPE, f]
	}, _ = {
		className: "comment",
		variants: [
			e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
				relevance: 0,
				contains: [{
					begin: "(?=@[A-Za-z]+)",
					relevance: 0,
					contains: [
						{
							className: "doctag",
							begin: "@[A-Za-z]+"
						},
						{
							className: "type",
							begin: "\\{",
							end: "\\}",
							excludeEnd: !0,
							excludeBegin: !0,
							relevance: 0
						},
						{
							className: "variable",
							begin: r + "(?=\\s*(-)|$)",
							endsParent: !0,
							relevance: 0
						},
						{
							begin: /(?=[^\n])\s/,
							relevance: 0
						}
					]
				}]
			}),
			e.C_BLOCK_COMMENT_MODE,
			e.C_LINE_COMMENT_MODE
		]
	}, v = [
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE,
		p,
		m,
		h,
		g,
		{ match: /\$\d+/ },
		d
	];
	f.contains = v.concat({
		begin: /\{/,
		end: /\}/,
		keywords: s,
		contains: ["self"].concat(v)
	});
	let y = [].concat(_, f.contains), b = y.concat([{
		begin: /(\s*)\(/,
		end: /\)/,
		keywords: s,
		contains: ["self"].concat(y)
	}]), x = {
		className: "params",
		begin: /(\s*)\(/,
		end: /\)/,
		excludeBegin: !0,
		excludeEnd: !0,
		keywords: s,
		contains: b
	}, S = { variants: [{
		match: [
			/class/,
			/\s+/,
			r,
			/\s+/,
			/extends/,
			/\s+/,
			t.concat(r, "(", t.concat(/\./, r), ")*")
		],
		scope: {
			1: "keyword",
			3: "title.class",
			5: "keyword",
			7: "title.class.inherited"
		}
	}, {
		match: [
			/class/,
			/\s+/,
			r
		],
		scope: {
			1: "keyword",
			3: "title.class"
		}
	}] }, ee = {
		relevance: 0,
		match: t.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
		className: "title.class",
		keywords: { _: [...wP, ...TP] }
	}, te = {
		label: "use_strict",
		className: "meta",
		relevance: 10,
		begin: /^\s*['"]use (strict|asm)['"]/
	}, C = {
		variants: [{ match: [
			/function/,
			/\s+/,
			r,
			/(?=\s*\()/
		] }, { match: [/function/, /\s*(?=\()/] }],
		className: {
			1: "keyword",
			3: "title.function"
		},
		label: "func.def",
		contains: [x],
		illegal: /%/
	}, ne = {
		relevance: 0,
		match: /\b[A-Z][A-Z_0-9]+\b/,
		className: "variable.constant"
	};
	function w(e) {
		return t.concat("(?!", e.join("|"), ")");
	}
	let re = {
		match: t.concat(/\b/, w([
			...EP,
			"super",
			"import"
		].map((e) => `${e}\\s*\\(`)), r, t.lookahead(/\s*\(/)),
		className: "title.function",
		relevance: 0
	}, ie = {
		begin: t.concat(/\./, t.lookahead(t.concat(r, /(?![0-9A-Za-z$_(])/))),
		end: r,
		excludeBegin: !0,
		keywords: "prototype",
		className: "property",
		relevance: 0
	}, T = {
		match: [
			/get|set/,
			/\s+/,
			r,
			/(?=\()/
		],
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [{ begin: /\(\)/ }, x]
	}, ae = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", E = {
		match: [
			/const|var|let/,
			/\s+/,
			r,
			/\s*/,
			/=\s*/,
			/(async\s*)?/,
			t.lookahead(ae)
		],
		keywords: "async",
		className: {
			1: "keyword",
			3: "title.function"
		},
		contains: [x]
	};
	return {
		name: "JavaScript",
		aliases: [
			"js",
			"jsx",
			"mjs",
			"cjs"
		],
		keywords: s,
		exports: {
			PARAMS_CONTAINS: b,
			CLASS_REFERENCE: ee
		},
		illegal: /#(?![$_A-z])/,
		contains: [
			e.SHEBANG({
				label: "shebang",
				binary: "node",
				relevance: 5
			}),
			te,
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			p,
			m,
			h,
			g,
			_,
			{ match: /\$\d+/ },
			d,
			ee,
			{
				scope: "attr",
				match: r + t.lookahead(":"),
				relevance: 0
			},
			E,
			{
				begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
				keywords: "return throw case",
				relevance: 0,
				contains: [
					_,
					e.REGEXP_MODE,
					{
						className: "function",
						begin: ae,
						returnBegin: !0,
						end: "\\s*=>",
						contains: [{
							className: "params",
							variants: [
								{
									begin: e.UNDERSCORE_IDENT_RE,
									relevance: 0
								},
								{
									className: null,
									begin: /\(\s*\)/,
									skip: !0
								},
								{
									begin: /(\s*)\(/,
									end: /\)/,
									excludeBegin: !0,
									excludeEnd: !0,
									keywords: s,
									contains: b
								}
							]
						}]
					},
					{
						begin: /,/,
						relevance: 0
					},
					{
						match: /\s+/,
						relevance: 0
					},
					{
						variants: [
							{
								begin: i.begin,
								end: i.end
							},
							{ match: a },
							{
								begin: o.begin,
								"on:begin": o.isTrulyOpeningTag,
								end: o.end
							}
						],
						subLanguage: "xml",
						contains: [{
							begin: o.begin,
							end: o.end,
							skip: !0,
							contains: ["self"]
						}]
					}
				]
			},
			C,
			{ beginKeywords: "while if switch catch for" },
			{
				begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
				returnBegin: !0,
				label: "func.def",
				contains: [x, e.inherit(e.TITLE_MODE, {
					begin: r,
					className: "title.function"
				})]
			},
			{
				match: /\.\.\./,
				relevance: 0
			},
			ie,
			{
				match: "\\$" + r,
				relevance: 0
			},
			{
				match: [/\bconstructor(?=\s*\()/],
				className: { 1: "title.function" },
				contains: [x]
			},
			re,
			ne,
			S,
			T,
			{ match: /\$[(.]/ }
		]
	};
}
function AP(e) {
	let t = e.regex, n = kP(e), r = xP, i = [
		"any",
		"void",
		"number",
		"boolean",
		"string",
		"object",
		"never",
		"symbol",
		"bigint",
		"unknown"
	], a = {
		begin: [
			/namespace/,
			/\s+/,
			e.IDENT_RE
		],
		beginScope: {
			1: "keyword",
			3: "title.class"
		}
	}, o = {
		beginKeywords: "interface",
		end: /\{/,
		excludeEnd: !0,
		keywords: {
			keyword: "interface extends",
			built_in: i
		},
		contains: [n.exports.CLASS_REFERENCE]
	}, s = {
		className: "meta",
		relevance: 10,
		begin: /^\s*['"]use strict['"]/
	}, c = {
		$pattern: xP,
		keyword: SP.concat([
			"type",
			"interface",
			"public",
			"private",
			"protected",
			"implements",
			"declare",
			"abstract",
			"readonly",
			"enum",
			"override",
			"satisfies"
		]),
		literal: CP,
		built_in: OP.concat(i),
		"variable.language": DP
	}, l = {
		className: "meta",
		begin: "@" + r
	}, u = (e, t, n) => {
		let r = e.contains.findIndex((e) => e.label === t);
		if (r === -1) throw Error("can not find mode to replace");
		e.contains.splice(r, 1, n);
	};
	Object.assign(n.keywords, c), n.exports.PARAMS_CONTAINS.push(l);
	let d = n.contains.find((e) => e.scope === "attr"), f = Object.assign({}, d, { match: t.concat(r, t.lookahead(/\s*\?:/)) });
	n.exports.PARAMS_CONTAINS.push([
		n.exports.CLASS_REFERENCE,
		d,
		f
	]), n.contains = n.contains.concat([
		l,
		a,
		o,
		f
	]), u(n, "shebang", e.SHEBANG()), u(n, "use_strict", s);
	let p = n.contains.find((e) => e.label === "func.def");
	return p.relevance = 0, Object.assign(n, {
		name: "TypeScript",
		aliases: [
			"ts",
			"tsx",
			"mts",
			"cts"
		]
	}), n;
}
//#endregion
//#region node_modules/highlight.js/es/languages/python.js
function jP(e) {
	let t = e.regex, n = /[\p{XID_Start}_]\p{XID_Continue}*/u, r = /* @__PURE__ */ "and.as.assert.async.await.break.case.class.continue.def.del.elif.else.except.finally.for.from.global.if.import.in.is.lambda.match.nonlocal|10.not.or.pass.raise.return.try.while.with.yield".split("."), i = {
		$pattern: /[A-Za-z]\w+|__\w+__/,
		keyword: r,
		built_in: /* @__PURE__ */ "__import__.abs.all.any.ascii.bin.bool.breakpoint.bytearray.bytes.callable.chr.classmethod.compile.complex.delattr.dict.dir.divmod.enumerate.eval.exec.filter.float.format.frozenset.getattr.globals.hasattr.hash.help.hex.id.input.int.isinstance.issubclass.iter.len.list.locals.map.max.memoryview.min.next.object.oct.open.ord.pow.print.property.range.repr.reversed.round.set.setattr.slice.sorted.staticmethod.str.sum.super.tuple.type.vars.zip".split("."),
		literal: [
			"__debug__",
			"Ellipsis",
			"False",
			"None",
			"NotImplemented",
			"True"
		],
		type: [
			"Any",
			"Callable",
			"Coroutine",
			"Dict",
			"List",
			"Literal",
			"Generic",
			"Optional",
			"Sequence",
			"Set",
			"Tuple",
			"Type",
			"Union"
		]
	}, a = {
		className: "meta",
		begin: /^(>>>|\.\.\.) /
	}, o = {
		className: "subst",
		begin: /\{/,
		end: /\}/,
		keywords: i,
		illegal: /#/
	}, s = {
		begin: /\{\{/,
		relevance: 0
	}, c = {
		className: "string",
		contains: [e.BACKSLASH_ESCAPE],
		variants: [
			{
				begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
				end: /'''/,
				contains: [e.BACKSLASH_ESCAPE, a],
				relevance: 10
			},
			{
				begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
				end: /"""/,
				contains: [e.BACKSLASH_ESCAPE, a],
				relevance: 10
			},
			{
				begin: /([fF][rR]|[rR][fF]|[fF])'''/,
				end: /'''/,
				contains: [
					e.BACKSLASH_ESCAPE,
					a,
					s,
					o
				]
			},
			{
				begin: /([fF][rR]|[rR][fF]|[fF])"""/,
				end: /"""/,
				contains: [
					e.BACKSLASH_ESCAPE,
					a,
					s,
					o
				]
			},
			{
				begin: /([uU]|[rR])'/,
				end: /'/,
				relevance: 10
			},
			{
				begin: /([uU]|[rR])"/,
				end: /"/,
				relevance: 10
			},
			{
				begin: /([bB]|[bB][rR]|[rR][bB])'/,
				end: /'/
			},
			{
				begin: /([bB]|[bB][rR]|[rR][bB])"/,
				end: /"/
			},
			{
				begin: /([fF][rR]|[rR][fF]|[fF])'/,
				end: /'/,
				contains: [
					e.BACKSLASH_ESCAPE,
					s,
					o
				]
			},
			{
				begin: /([fF][rR]|[rR][fF]|[fF])"/,
				end: /"/,
				contains: [
					e.BACKSLASH_ESCAPE,
					s,
					o
				]
			},
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE
		]
	}, l = "[0-9](_?[0-9])*", u = `(\\b(${l}))?\\.(${l})|\\b(${l})\\.`, d = `\\b|${r.join("|")}`, f = {
		className: "number",
		relevance: 0,
		variants: [
			{ begin: `(\\b(${l})|(${u}))[eE][+-]?(${l})[jJ]?(?=${d})` },
			{ begin: `(${u})[jJ]?` },
			{ begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})` },
			{ begin: `\\b0[bB](_?[01])+[lL]?(?=${d})` },
			{ begin: `\\b0[oO](_?[0-7])+[lL]?(?=${d})` },
			{ begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})` },
			{ begin: `\\b(${l})[jJ](?=${d})` }
		]
	}, p = {
		className: "comment",
		begin: t.lookahead(/# type:/),
		end: /$/,
		keywords: i,
		contains: [{ begin: /# type:/ }, {
			begin: /#/,
			end: /\b\B/,
			endsWithParent: !0
		}]
	}, m = {
		className: "params",
		variants: [{
			className: "",
			begin: /\(\s*\)/,
			skip: !0
		}, {
			begin: /\(/,
			end: /\)/,
			excludeBegin: !0,
			excludeEnd: !0,
			keywords: i,
			contains: [
				"self",
				a,
				f,
				c,
				e.HASH_COMMENT_MODE
			]
		}]
	};
	return o.contains = [
		c,
		f,
		a
	], {
		name: "Python",
		aliases: [
			"py",
			"gyp",
			"ipython"
		],
		unicodeRegex: !0,
		keywords: i,
		illegal: /(<\/|\?)|=>/,
		contains: [
			a,
			f,
			{
				scope: "variable.language",
				match: /\bself\b/
			},
			{
				beginKeywords: "if",
				relevance: 0
			},
			{
				match: /\bor\b/,
				scope: "keyword"
			},
			c,
			p,
			e.HASH_COMMENT_MODE,
			{
				match: [
					/\bdef/,
					/\s+/,
					n
				],
				scope: {
					1: "keyword",
					3: "title.function"
				},
				contains: [m]
			},
			{
				variants: [{ match: [
					/\bclass/,
					/\s+/,
					n,
					/\s*/,
					/\(\s*/,
					n,
					/\s*\)/
				] }, { match: [
					/\bclass/,
					/\s+/,
					n
				] }],
				scope: {
					1: "keyword",
					3: "title.class",
					6: "title.class.inherited"
				}
			},
			{
				className: "meta",
				begin: /^[\t ]*@/,
				end: /(?=#)|$/,
				contains: [
					f,
					m,
					c
				]
			}
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/java.js
var MP = "[0-9](_*[0-9])*", NP = `\\.(${MP})`, PP = "[0-9a-fA-F](_*[0-9a-fA-F])*", FP = {
	className: "number",
	variants: [
		{ begin: `(\\b(${MP})((${NP})|\\.)?|(${NP}))[eE][+-]?(${MP})[fFdD]?\\b` },
		{ begin: `\\b(${MP})((${NP})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
		{ begin: `(${NP})[fFdD]?\\b` },
		{ begin: `\\b(${MP})[fFdD]\\b` },
		{ begin: `\\b0[xX]((${PP})\\.?|(${PP})?\\.(${PP}))[pP][+-]?(${MP})[fFdD]?\\b` },
		{ begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
		{ begin: `\\b0[xX](${PP})[lL]?\\b` },
		{ begin: "\\b0(_*[0-7])*[lL]?\\b" },
		{ begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
	],
	relevance: 0
};
function IP(e, t, n) {
	return n === -1 ? "" : e.replace(t, (r) => IP(e, t, n - 1));
}
function LP(e) {
	let t = e.regex, n = "[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*", r = n + IP("(?:<[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*~~~(?:\\s*,\\s*[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*~~~)*>)?", /~~~/g, 2), i = {
		keyword: /* @__PURE__ */ "synchronized.abstract.private.var.static.if.const .for.while.strictfp.finally.protected.import.native.final.void.enum.else.break.transient.catch.instanceof.volatile.case.assert.package.default.public.try.switch.continue.throws.protected.public.private.module.requires.exports.do.sealed.yield.permits.goto.when".split("."),
		literal: [
			"false",
			"true",
			"null"
		],
		type: [
			"char",
			"boolean",
			"long",
			"float",
			"int",
			"byte",
			"short",
			"double"
		],
		built_in: ["super", "this"]
	}, a = {
		className: "meta",
		begin: "@[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",
		contains: [{
			begin: /\(/,
			end: /\)/,
			contains: ["self"]
		}]
	}, o = {
		className: "params",
		begin: /\(/,
		end: /\)/,
		keywords: i,
		relevance: 0,
		contains: [e.C_BLOCK_COMMENT_MODE],
		endsParent: !0
	};
	return {
		name: "Java",
		aliases: ["jsp"],
		keywords: i,
		illegal: /<\/|#/,
		contains: [
			e.COMMENT("/\\*\\*", "\\*/", {
				relevance: 0,
				contains: [{
					begin: /\w+@/,
					relevance: 0
				}, {
					className: "doctag",
					begin: "@[A-Za-z]+"
				}]
			}),
			{
				begin: /import java\.[a-z]+\./,
				keywords: "import",
				relevance: 2
			},
			e.C_LINE_COMMENT_MODE,
			e.C_BLOCK_COMMENT_MODE,
			{
				begin: /"""/,
				end: /"""/,
				className: "string",
				contains: [e.BACKSLASH_ESCAPE]
			},
			e.APOS_STRING_MODE,
			e.QUOTE_STRING_MODE,
			{
				match: [
					/\b(?:class|interface|enum|extends|implements|new)/,
					/\s+/,
					n
				],
				className: {
					1: "keyword",
					3: "title.class"
				}
			},
			{
				match: /non-sealed/,
				scope: "keyword"
			},
			{
				begin: [
					t.concat(/(?!else)/, n),
					/\s+/,
					n,
					/\s+/,
					/=(?!=)/
				],
				className: {
					1: "type",
					3: "variable",
					5: "operator"
				}
			},
			{
				begin: [
					/record/,
					/\s+/,
					n
				],
				className: {
					1: "keyword",
					3: "title.class"
				},
				contains: [
					o,
					e.C_LINE_COMMENT_MODE,
					e.C_BLOCK_COMMENT_MODE
				]
			},
			{
				beginKeywords: "new throw return else",
				relevance: 0
			},
			{
				begin: [
					"(?:" + r + "\\s+)",
					e.UNDERSCORE_IDENT_RE,
					/\s*(?=\()/
				],
				className: { 2: "title.function" },
				keywords: i,
				contains: [
					{
						className: "params",
						begin: /\(/,
						end: /\)/,
						keywords: i,
						relevance: 0,
						contains: [
							a,
							e.APOS_STRING_MODE,
							e.QUOTE_STRING_MODE,
							FP,
							e.C_BLOCK_COMMENT_MODE
						]
					},
					e.C_LINE_COMMENT_MODE,
					e.C_BLOCK_COMMENT_MODE
				]
			},
			FP,
			a
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/csharp.js
function RP(e) {
	let t = [
		"bool",
		"byte",
		"char",
		"decimal",
		"delegate",
		"double",
		"dynamic",
		"enum",
		"float",
		"int",
		"long",
		"nint",
		"nuint",
		"object",
		"sbyte",
		"short",
		"string",
		"ulong",
		"uint",
		"ushort"
	], n = [
		"public",
		"private",
		"protected",
		"static",
		"internal",
		"protected",
		"abstract",
		"async",
		"extern",
		"override",
		"unsafe",
		"virtual",
		"new",
		"sealed",
		"partial"
	], r = [
		"default",
		"false",
		"null",
		"true"
	], i = /* @__PURE__ */ "abstract.as.base.break.case.catch.class.const.continue.do.else.event.explicit.extern.finally.fixed.for.foreach.goto.if.implicit.in.interface.internal.is.lock.namespace.new.operator.out.override.params.private.protected.public.readonly.record.ref.return.scoped.sealed.sizeof.stackalloc.static.struct.switch.this.throw.try.typeof.unchecked.unsafe.using.virtual.void.volatile.while".split("."), a = /* @__PURE__ */ "add.alias.and.ascending.args.async.await.by.descending.dynamic.equals.file.from.get.global.group.init.into.join.let.nameof.not.notnull.on.or.orderby.partial.record.remove.required.scoped.select.set.unmanaged.value|0.var.when.where.with.yield".split("."), o = {
		keyword: i.concat(a),
		built_in: t,
		literal: r
	}, s = e.inherit(e.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" }), c = {
		className: "number",
		variants: [
			{ begin: "\\b(0b[01']+)" },
			{ begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)" },
			{ begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)" }
		],
		relevance: 0
	}, l = {
		className: "string",
		begin: /"""("*)(?!")(.|\n)*?"""\1/,
		relevance: 1
	}, u = {
		className: "string",
		begin: "@\"",
		end: "\"",
		contains: [{ begin: "\"\"" }]
	}, d = e.inherit(u, { illegal: /\n/ }), f = {
		className: "subst",
		begin: /\{/,
		end: /\}/,
		keywords: o
	}, p = e.inherit(f, { illegal: /\n/ }), m = {
		className: "string",
		begin: /\$"/,
		end: "\"",
		illegal: /\n/,
		contains: [
			{ begin: /\{\{/ },
			{ begin: /\}\}/ },
			e.BACKSLASH_ESCAPE,
			p
		]
	}, h = {
		className: "string",
		begin: /\$@"/,
		end: "\"",
		contains: [
			{ begin: /\{\{/ },
			{ begin: /\}\}/ },
			{ begin: "\"\"" },
			f
		]
	}, g = e.inherit(h, {
		illegal: /\n/,
		contains: [
			{ begin: /\{\{/ },
			{ begin: /\}\}/ },
			{ begin: "\"\"" },
			p
		]
	});
	f.contains = [
		h,
		m,
		u,
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE,
		c,
		e.C_BLOCK_COMMENT_MODE
	], p.contains = [
		g,
		m,
		d,
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE,
		c,
		e.inherit(e.C_BLOCK_COMMENT_MODE, { illegal: /\n/ })
	];
	let _ = { variants: [
		l,
		h,
		m,
		u,
		e.APOS_STRING_MODE,
		e.QUOTE_STRING_MODE
	] }, v = {
		begin: "<",
		end: ">",
		contains: [{ beginKeywords: "in out" }, s]
	}, y = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?", b = {
		begin: "@" + e.IDENT_RE,
		relevance: 0
	};
	return {
		name: "C#",
		aliases: ["cs", "c#"],
		keywords: o,
		illegal: /::/,
		contains: [
			e.COMMENT("///", "$", {
				returnBegin: !0,
				contains: [{
					className: "doctag",
					variants: [
						{
							begin: "///",
							relevance: 0
						},
						{ begin: "<!--|-->" },
						{
							begin: "</?",
							end: ">"
						}
					]
				}]
			}),
			e.C_LINE_COMMENT_MODE,
			e.C_BLOCK_COMMENT_MODE,
			{
				className: "meta",
				begin: "#",
				end: "$",
				keywords: { keyword: "if else elif endif define undef warning error line region endregion pragma checksum" }
			},
			_,
			c,
			{
				beginKeywords: "class interface",
				relevance: 0,
				end: /[{;=]/,
				illegal: /[^\s:,]/,
				contains: [
					{ beginKeywords: "where class" },
					s,
					v,
					e.C_LINE_COMMENT_MODE,
					e.C_BLOCK_COMMENT_MODE
				]
			},
			{
				beginKeywords: "namespace",
				relevance: 0,
				end: /[{;=]/,
				illegal: /[^\s:]/,
				contains: [
					s,
					e.C_LINE_COMMENT_MODE,
					e.C_BLOCK_COMMENT_MODE
				]
			},
			{
				beginKeywords: "record",
				relevance: 0,
				end: /[{;=]/,
				illegal: /[^\s:]/,
				contains: [
					s,
					v,
					e.C_LINE_COMMENT_MODE,
					e.C_BLOCK_COMMENT_MODE
				]
			},
			{
				className: "meta",
				begin: "^\\s*\\[(?=[\\w])",
				excludeBegin: !0,
				end: "\\]",
				excludeEnd: !0,
				contains: [{
					className: "string",
					begin: /"/,
					end: /"/
				}]
			},
			{
				beginKeywords: "new return throw await else",
				relevance: 0
			},
			{
				className: "function",
				begin: "(" + y + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
				returnBegin: !0,
				end: /\s*[{;=]/,
				excludeEnd: !0,
				keywords: o,
				contains: [
					{
						beginKeywords: n.join(" "),
						relevance: 0
					},
					{
						begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
						returnBegin: !0,
						contains: [e.TITLE_MODE, v],
						relevance: 0
					},
					{ match: /\(\)/ },
					{
						className: "params",
						begin: /\(/,
						end: /\)/,
						excludeBegin: !0,
						excludeEnd: !0,
						keywords: o,
						relevance: 0,
						contains: [
							_,
							c,
							e.C_BLOCK_COMMENT_MODE
						]
					},
					e.C_LINE_COMMENT_MODE,
					e.C_BLOCK_COMMENT_MODE
				]
			},
			b
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/cpp.js
function zP(e) {
	let t = e.regex, n = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }), r = "[a-zA-Z_]\\w*::", i = "(?!struct)(decltype\\(auto\\)|" + t.optional(r) + "[a-zA-Z_]\\w*" + t.optional("<[^<>]+>") + ")", a = {
		className: "type",
		begin: "\\b[a-z\\d_]*_t\\b"
	}, o = {
		className: "string",
		variants: [
			{
				begin: "(u8?|U|L)?\"",
				end: "\"",
				illegal: "\\n",
				contains: [e.BACKSLASH_ESCAPE]
			},
			{
				begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
				end: "'",
				illegal: "."
			},
			e.END_SAME_AS_BEGIN({
				begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
				end: /\)([^()\\ ]{0,16})"/
			})
		]
	}, s = {
		className: "number",
		variants: [{ begin: "[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)" }, { begin: "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)" }],
		relevance: 0
	}, c = {
		className: "meta",
		begin: /#\s*[a-z]+\b/,
		end: /$/,
		keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include" },
		contains: [
			{
				begin: /\\\n/,
				relevance: 0
			},
			e.inherit(o, { className: "string" }),
			{
				className: "string",
				begin: /<.*?>/
			},
			n,
			e.C_BLOCK_COMMENT_MODE
		]
	}, l = {
		className: "title",
		begin: t.optional(r) + e.IDENT_RE,
		relevance: 0
	}, u = t.optional(r) + e.IDENT_RE + "\\s*\\(", d = /* @__PURE__ */ "alignas.alignof.and.and_eq.asm.atomic_cancel.atomic_commit.atomic_noexcept.auto.bitand.bitor.break.case.catch.class.co_await.co_return.co_yield.compl.concept.const_cast|10.consteval.constexpr.constinit.continue.decltype.default.delete.do.dynamic_cast|10.else.enum.explicit.export.extern.false.final.for.friend.goto.if.import.inline.module.mutable.namespace.new.noexcept.not.not_eq.nullptr.operator.or.or_eq.override.private.protected.public.reflexpr.register.reinterpret_cast|10.requires.return.sizeof.static_assert.static_cast|10.struct.switch.synchronized.template.this.thread_local.throw.transaction_safe.transaction_safe_dynamic.true.try.typedef.typeid.typename.union.using.virtual.volatile.while.xor.xor_eq".split("."), f = [
		"bool",
		"char",
		"char16_t",
		"char32_t",
		"char8_t",
		"double",
		"float",
		"int",
		"long",
		"short",
		"void",
		"wchar_t",
		"unsigned",
		"signed",
		"const",
		"static"
	], p = /* @__PURE__ */ "any.auto_ptr.barrier.binary_semaphore.bitset.complex.condition_variable.condition_variable_any.counting_semaphore.deque.false_type.flat_map.flat_set.future.imaginary.initializer_list.istringstream.jthread.latch.lock_guard.multimap.multiset.mutex.optional.ostringstream.packaged_task.pair.promise.priority_queue.queue.recursive_mutex.recursive_timed_mutex.scoped_lock.set.shared_future.shared_lock.shared_mutex.shared_timed_mutex.shared_ptr.stack.string_view.stringstream.timed_mutex.thread.true_type.tuple.unique_lock.unique_ptr.unordered_map.unordered_multimap.unordered_multiset.unordered_set.variant.vector.weak_ptr.wstring.wstring_view".split("."), m = /* @__PURE__ */ "abort.abs.acos.apply.as_const.asin.atan.atan2.calloc.ceil.cerr.cin.clog.cos.cosh.cout.declval.endl.exchange.exit.exp.fabs.floor.fmod.forward.fprintf.fputs.free.frexp.fscanf.future.invoke.isalnum.isalpha.iscntrl.isdigit.isgraph.islower.isprint.ispunct.isspace.isupper.isxdigit.labs.launder.ldexp.log.log10.make_pair.make_shared.make_shared_for_overwrite.make_tuple.make_unique.malloc.memchr.memcmp.memcpy.memset.modf.move.pow.printf.putchar.puts.realloc.scanf.sin.sinh.snprintf.sprintf.sqrt.sscanf.std.stderr.stdin.stdout.strcat.strchr.strcmp.strcpy.strcspn.strlen.strncat.strncmp.strncpy.strpbrk.strrchr.strspn.strstr.swap.tan.tanh.terminate.to_underlying.tolower.toupper.vfprintf.visit.vprintf.vsprintf".split("."), h = {
		type: f,
		keyword: d,
		literal: [
			"NULL",
			"false",
			"nullopt",
			"nullptr",
			"true"
		],
		built_in: ["_Pragma"],
		_type_hints: p
	}, g = {
		className: "function.dispatch",
		relevance: 0,
		keywords: { _hint: m },
		begin: t.concat(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!switch)/, /(?!while)/, e.IDENT_RE, t.lookahead(/(<[^<>]+>|)\s*\(/))
	}, _ = [
		g,
		c,
		a,
		n,
		e.C_BLOCK_COMMENT_MODE,
		s,
		o
	], v = {
		variants: [
			{
				begin: /=/,
				end: /;/
			},
			{
				begin: /\(/,
				end: /\)/
			},
			{
				beginKeywords: "new throw return else",
				end: /;/
			}
		],
		keywords: h,
		contains: _.concat([{
			begin: /\(/,
			end: /\)/,
			keywords: h,
			contains: _.concat(["self"]),
			relevance: 0
		}]),
		relevance: 0
	}, y = {
		className: "function",
		begin: "(" + i + "[\\*&\\s]+)+" + u,
		returnBegin: !0,
		end: /[{;=]/,
		excludeEnd: !0,
		keywords: h,
		illegal: /[^\w\s\*&:<>.]/,
		contains: [
			{
				begin: "decltype\\(auto\\)",
				keywords: h,
				relevance: 0
			},
			{
				begin: u,
				returnBegin: !0,
				contains: [l],
				relevance: 0
			},
			{
				begin: /::/,
				relevance: 0
			},
			{
				begin: /:/,
				endsWithParent: !0,
				contains: [o, s]
			},
			{
				relevance: 0,
				match: /,/
			},
			{
				className: "params",
				begin: /\(/,
				end: /\)/,
				keywords: h,
				relevance: 0,
				contains: [
					n,
					e.C_BLOCK_COMMENT_MODE,
					o,
					s,
					a,
					{
						begin: /\(/,
						end: /\)/,
						keywords: h,
						relevance: 0,
						contains: [
							"self",
							n,
							e.C_BLOCK_COMMENT_MODE,
							o,
							s,
							a
						]
					}
				]
			},
			a,
			n,
			e.C_BLOCK_COMMENT_MODE,
			c
		]
	};
	return {
		name: "C++",
		aliases: [
			"cc",
			"c++",
			"h++",
			"hpp",
			"hh",
			"hxx",
			"cxx"
		],
		keywords: h,
		illegal: "</",
		classNameAliases: { "function.dispatch": "built_in" },
		contains: [].concat(v, y, g, _, [
			c,
			{
				begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",
				end: ">",
				keywords: h,
				contains: ["self", a]
			},
			{
				begin: e.IDENT_RE + "::",
				keywords: h
			},
			{
				match: [
					/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
					/\s+/,
					/\w+/
				],
				className: {
					1: "keyword",
					3: "title.class"
				}
			}
		])
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/css.js
var BP = (e) => ({
	IMPORTANT: {
		scope: "meta",
		begin: "!important"
	},
	BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
	HEXCOLOR: {
		scope: "number",
		begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
	},
	FUNCTION_DISPATCH: {
		className: "built_in",
		begin: /[\w-]+(?=\()/
	},
	ATTRIBUTE_SELECTOR_MODE: {
		scope: "selector-attr",
		begin: /\[/,
		end: /\]/,
		illegal: "$",
		contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
	},
	CSS_NUMBER_MODE: {
		scope: "number",
		begin: e.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
		relevance: 0
	},
	CSS_VARIABLE: {
		className: "attr",
		begin: /--[A-Za-z_][A-Za-z0-9_-]*/
	}
}), VP = /* @__PURE__ */ "a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video".split("."), HP = /* @__PURE__ */ "defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath".split("."), UP = [...VP, ...HP], WP = (/* @__PURE__ */ "any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height".split(".")).sort().reverse(), GP = (/* @__PURE__ */ "active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where".split(".")).sort().reverse(), KP = [
	"after",
	"backdrop",
	"before",
	"cue",
	"cue-region",
	"first-letter",
	"first-line",
	"grammar-error",
	"marker",
	"part",
	"placeholder",
	"selection",
	"slotted",
	"spelling-error"
].sort().reverse(), qP = (/* @__PURE__ */ "accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom".split(".")).sort().reverse();
function JP(e) {
	let t = e.regex, n = BP(e), r = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, i = /@-?\w[\w]*(-\w+)*/, a = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
	return {
		name: "CSS",
		case_insensitive: !0,
		illegal: /[=|'\$]/,
		keywords: { keyframePosition: "from to" },
		classNameAliases: { keyframePosition: "selector-tag" },
		contains: [
			n.BLOCK_COMMENT,
			r,
			n.CSS_NUMBER_MODE,
			{
				className: "selector-id",
				begin: /#[A-Za-z0-9_-]+/,
				relevance: 0
			},
			{
				className: "selector-class",
				begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
				relevance: 0
			},
			n.ATTRIBUTE_SELECTOR_MODE,
			{
				className: "selector-pseudo",
				variants: [{ begin: ":(" + GP.join("|") + ")" }, { begin: ":(:)?(" + KP.join("|") + ")" }]
			},
			n.CSS_VARIABLE,
			{
				className: "attribute",
				begin: "\\b(" + qP.join("|") + ")\\b"
			},
			{
				begin: /:/,
				end: /[;}{]/,
				contains: [
					n.BLOCK_COMMENT,
					n.HEXCOLOR,
					n.IMPORTANT,
					n.CSS_NUMBER_MODE,
					...a,
					{
						begin: /(url|data-uri)\(/,
						end: /\)/,
						relevance: 0,
						keywords: { built_in: "url data-uri" },
						contains: [...a, {
							className: "string",
							begin: /[^)]/,
							endsWithParent: !0,
							excludeEnd: !0
						}]
					},
					n.FUNCTION_DISPATCH
				]
			},
			{
				begin: t.lookahead(/@/),
				end: "[{;]",
				relevance: 0,
				illegal: /:/,
				contains: [{
					className: "keyword",
					begin: i
				}, {
					begin: /\s/,
					endsWithParent: !0,
					excludeEnd: !0,
					relevance: 0,
					keywords: {
						$pattern: /[a-z-]+/,
						keyword: "and or not only",
						attribute: WP.join(" ")
					},
					contains: [
						{
							begin: /[a-z-]+(?=:)/,
							className: "attribute"
						},
						...a,
						n.CSS_NUMBER_MODE
					]
				}]
			},
			{
				className: "selector-tag",
				begin: "\\b(" + UP.join("|") + ")\\b"
			}
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/xml.js
function YP(e) {
	let t = e.regex, n = t.concat(/[\p{L}_]/u, t.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, i = {
		className: "symbol",
		begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
	}, a = {
		begin: /\s/,
		contains: [{
			className: "keyword",
			begin: /#?[a-z_][a-z1-9_-]+/,
			illegal: /\n/
		}]
	}, o = e.inherit(a, {
		begin: /\(/,
		end: /\)/
	}), s = e.inherit(e.APOS_STRING_MODE, { className: "string" }), c = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }), l = {
		endsWithParent: !0,
		illegal: /</,
		relevance: 0,
		contains: [{
			className: "attr",
			begin: r,
			relevance: 0
		}, {
			begin: /=\s*/,
			relevance: 0,
			contains: [{
				className: "string",
				endsParent: !0,
				variants: [
					{
						begin: /"/,
						end: /"/,
						contains: [i]
					},
					{
						begin: /'/,
						end: /'/,
						contains: [i]
					},
					{ begin: /[^\s"'=<>`]+/ }
				]
			}]
		}]
	};
	return {
		name: "HTML, XML",
		aliases: [
			"html",
			"xhtml",
			"rss",
			"atom",
			"xjb",
			"xsd",
			"xsl",
			"plist",
			"wsf",
			"svg"
		],
		case_insensitive: !0,
		unicodeRegex: !0,
		contains: [
			{
				className: "meta",
				begin: /<![a-z]/,
				end: />/,
				relevance: 10,
				contains: [
					a,
					c,
					s,
					o,
					{
						begin: /\[/,
						end: /\]/,
						contains: [{
							className: "meta",
							begin: /<![a-z]/,
							end: />/,
							contains: [
								a,
								o,
								c,
								s
							]
						}]
					}
				]
			},
			e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
			{
				begin: /<!\[CDATA\[/,
				end: /\]\]>/,
				relevance: 10
			},
			i,
			{
				className: "meta",
				end: /\?>/,
				variants: [{
					begin: /<\?xml/,
					relevance: 10,
					contains: [c]
				}, { begin: /<\?[a-z][a-z0-9]+/ }]
			},
			{
				className: "tag",
				begin: /<style(?=\s|>)/,
				end: />/,
				keywords: { name: "style" },
				contains: [l],
				starts: {
					end: /<\/style>/,
					returnEnd: !0,
					subLanguage: ["css", "xml"]
				}
			},
			{
				className: "tag",
				begin: /<script(?=\s|>)/,
				end: />/,
				keywords: { name: "script" },
				contains: [l],
				starts: {
					end: /<\/script>/,
					returnEnd: !0,
					subLanguage: [
						"javascript",
						"handlebars",
						"xml"
					]
				}
			},
			{
				className: "tag",
				begin: /<>|<\/>/
			},
			{
				className: "tag",
				begin: t.concat(/</, t.lookahead(t.concat(n, t.either(/\/>/, />/, /\s/)))),
				end: /\/?>/,
				contains: [{
					className: "name",
					begin: n,
					relevance: 0,
					starts: l
				}]
			},
			{
				className: "tag",
				begin: t.concat(/<\//, t.lookahead(t.concat(n, />/))),
				contains: [{
					className: "name",
					begin: n,
					relevance: 0
				}, {
					begin: />/,
					relevance: 0,
					endsParent: !0
				}]
			}
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/json.js
function XP(e) {
	let t = {
		className: "attr",
		begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
		relevance: 1.01
	}, n = {
		match: /[{}[\],:]/,
		className: "punctuation",
		relevance: 0
	}, r = [
		"true",
		"false",
		"null"
	], i = {
		scope: "literal",
		beginKeywords: r.join(" ")
	};
	return {
		name: "JSON",
		aliases: ["jsonc"],
		keywords: { literal: r },
		contains: [
			t,
			n,
			e.QUOTE_STRING_MODE,
			i,
			e.C_NUMBER_MODE,
			e.C_LINE_COMMENT_MODE,
			e.C_BLOCK_COMMENT_MODE
		],
		illegal: "\\S"
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/bash.js
function ZP(e) {
	let t = e.regex, n = {}, r = {
		begin: /\$\{/,
		end: /\}/,
		contains: ["self", {
			begin: /:-/,
			contains: [n]
		}]
	};
	Object.assign(n, {
		className: "variable",
		variants: [{ begin: t.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])") }, r]
	});
	let i = {
		className: "subst",
		begin: /\$\(/,
		end: /\)/,
		contains: [e.BACKSLASH_ESCAPE]
	}, a = e.inherit(e.COMMENT(), {
		match: [/(^|\s)/, /#.*$/],
		scope: { 2: "comment" }
	}), o = {
		begin: /<<-?\s*(?=\w+)/,
		starts: { contains: [e.END_SAME_AS_BEGIN({
			begin: /(\w+)/,
			end: /(\w+)/,
			className: "string"
		})] }
	}, s = {
		className: "string",
		begin: /"/,
		end: /"/,
		contains: [
			e.BACKSLASH_ESCAPE,
			n,
			i
		]
	};
	i.contains.push(s);
	let c = { match: /\\"/ }, l = {
		className: "string",
		begin: /'/,
		end: /'/
	}, u = { match: /\\'/ }, d = {
		begin: /\$?\(\(/,
		end: /\)\)/,
		contains: [
			{
				begin: /\d+#[0-9a-f]+/,
				className: "number"
			},
			e.NUMBER_MODE,
			n
		]
	}, f = e.SHEBANG({
		binary: `(${[
			"fish",
			"bash",
			"zsh",
			"sh",
			"csh",
			"ksh",
			"tcsh",
			"dash",
			"scsh"
		].join("|")})`,
		relevance: 10
	}), p = {
		className: "function",
		begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
		returnBegin: !0,
		contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
		relevance: 0
	}, m = [
		"if",
		"then",
		"else",
		"elif",
		"fi",
		"time",
		"for",
		"while",
		"until",
		"in",
		"do",
		"done",
		"case",
		"esac",
		"coproc",
		"function",
		"select"
	], h = ["true", "false"], g = { match: /(\/[a-z._-]+)+/ }, _ = [
		"break",
		"cd",
		"continue",
		"eval",
		"exec",
		"exit",
		"export",
		"getopts",
		"hash",
		"pwd",
		"readonly",
		"return",
		"shift",
		"test",
		"times",
		"trap",
		"umask",
		"unset"
	], v = [
		"alias",
		"bind",
		"builtin",
		"caller",
		"command",
		"declare",
		"echo",
		"enable",
		"help",
		"let",
		"local",
		"logout",
		"mapfile",
		"printf",
		"read",
		"readarray",
		"source",
		"sudo",
		"type",
		"typeset",
		"ulimit",
		"unalias"
	], y = /* @__PURE__ */ "autoload.bg.bindkey.bye.cap.chdir.clone.comparguments.compcall.compctl.compdescribe.compfiles.compgroups.compquote.comptags.comptry.compvalues.dirs.disable.disown.echotc.echoti.emulate.fc.fg.float.functions.getcap.getln.history.integer.jobs.kill.limit.log.noglob.popd.print.pushd.pushln.rehash.sched.setcap.setopt.stat.suspend.ttyctl.unfunction.unhash.unlimit.unsetopt.vared.wait.whence.where.which.zcompile.zformat.zftp.zle.zmodload.zparseopts.zprof.zpty.zregexparse.zsocket.zstyle.ztcp".split("."), b = /* @__PURE__ */ "chcon.chgrp.chown.chmod.cp.dd.df.dir.dircolors.ln.ls.mkdir.mkfifo.mknod.mktemp.mv.realpath.rm.rmdir.shred.sync.touch.truncate.vdir.b2sum.base32.base64.cat.cksum.comm.csplit.cut.expand.fmt.fold.head.join.md5sum.nl.numfmt.od.paste.ptx.pr.sha1sum.sha224sum.sha256sum.sha384sum.sha512sum.shuf.sort.split.sum.tac.tail.tr.tsort.unexpand.uniq.wc.arch.basename.chroot.date.dirname.du.echo.env.expr.factor.groups.hostid.id.link.logname.nice.nohup.nproc.pathchk.pinky.printenv.printf.pwd.readlink.runcon.seq.sleep.stat.stdbuf.stty.tee.test.timeout.tty.uname.unlink.uptime.users.who.whoami.yes".split(".");
	return {
		name: "Bash",
		aliases: ["sh", "zsh"],
		keywords: {
			$pattern: /\b[a-z][a-z0-9._-]+\b/,
			keyword: m,
			literal: h,
			built_in: [
				..._,
				...v,
				"set",
				"shopt",
				...y,
				...b
			]
		},
		contains: [
			f,
			e.SHEBANG(),
			p,
			d,
			a,
			o,
			g,
			s,
			c,
			l,
			u,
			n
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/sql.js
function QP(e) {
	let t = e.regex, n = e.COMMENT("--", "$"), r = {
		scope: "string",
		variants: [{
			begin: /'/,
			end: /'/,
			contains: [{ match: /''/ }]
		}]
	}, i = {
		begin: /"/,
		end: /"/,
		contains: [{ match: /""/ }]
	}, a = [
		"true",
		"false",
		"unknown"
	], o = [
		"double precision",
		"large object",
		"with timezone",
		"without timezone"
	], s = /* @__PURE__ */ "bigint.binary.blob.boolean.char.character.clob.date.dec.decfloat.decimal.float.int.integer.interval.nchar.nclob.national.numeric.real.row.smallint.time.timestamp.varchar.varying.varbinary".split("."), c = [
		"add",
		"asc",
		"collation",
		"desc",
		"final",
		"first",
		"last",
		"view"
	], l = /* @__PURE__ */ "abs.acos.all.allocate.alter.and.any.are.array.array_agg.array_max_cardinality.as.asensitive.asin.asymmetric.at.atan.atomic.authorization.avg.begin.begin_frame.begin_partition.between.bigint.binary.blob.boolean.both.by.call.called.cardinality.cascaded.case.cast.ceil.ceiling.char.char_length.character.character_length.check.classifier.clob.close.coalesce.collate.collect.column.commit.condition.connect.constraint.contains.convert.copy.corr.corresponding.cos.cosh.count.covar_pop.covar_samp.create.cross.cube.cume_dist.current.current_catalog.current_date.current_default_transform_group.current_path.current_role.current_row.current_schema.current_time.current_timestamp.current_path.current_role.current_transform_group_for_type.current_user.cursor.cycle.date.day.deallocate.dec.decimal.decfloat.declare.default.define.delete.dense_rank.deref.describe.deterministic.disconnect.distinct.double.drop.dynamic.each.element.else.empty.end.end_frame.end_partition.end-exec.equals.escape.every.except.exec.execute.exists.exp.external.extract.false.fetch.filter.first_value.float.floor.for.foreign.frame_row.free.from.full.function.fusion.get.global.grant.group.grouping.groups.having.hold.hour.identity.in.indicator.initial.inner.inout.insensitive.insert.int.integer.intersect.intersection.interval.into.is.join.json_array.json_arrayagg.json_exists.json_object.json_objectagg.json_query.json_table.json_table_primitive.json_value.lag.language.large.last_value.lateral.lead.leading.left.like.like_regex.listagg.ln.local.localtime.localtimestamp.log.log10.lower.match.match_number.match_recognize.matches.max.member.merge.method.min.minute.mod.modifies.module.month.multiset.national.natural.nchar.nclob.new.no.none.normalize.not.nth_value.ntile.null.nullif.numeric.octet_length.occurrences_regex.of.offset.old.omit.on.one.only.open.or.order.out.outer.over.overlaps.overlay.parameter.partition.pattern.per.percent.percent_rank.percentile_cont.percentile_disc.period.portion.position.position_regex.power.precedes.precision.prepare.primary.procedure.ptf.range.rank.reads.real.recursive.ref.references.referencing.regr_avgx.regr_avgy.regr_count.regr_intercept.regr_r2.regr_slope.regr_sxx.regr_sxy.regr_syy.release.result.return.returns.revoke.right.rollback.rollup.row.row_number.rows.running.savepoint.scope.scroll.search.second.seek.select.sensitive.session_user.set.show.similar.sin.sinh.skip.smallint.some.specific.specifictype.sql.sqlexception.sqlstate.sqlwarning.sqrt.start.static.stddev_pop.stddev_samp.submultiset.subset.substring.substring_regex.succeeds.sum.symmetric.system.system_time.system_user.table.tablesample.tan.tanh.then.time.timestamp.timezone_hour.timezone_minute.to.trailing.translate.translate_regex.translation.treat.trigger.trim.trim_array.true.truncate.uescape.union.unique.unknown.unnest.update.upper.user.using.value.values.value_of.var_pop.var_samp.varbinary.varchar.varying.versioning.when.whenever.where.width_bucket.window.with.within.without.year".split("."), u = /* @__PURE__ */ "abs.acos.array_agg.asin.atan.avg.cast.ceil.ceiling.coalesce.corr.cos.cosh.count.covar_pop.covar_samp.cume_dist.dense_rank.deref.element.exp.extract.first_value.floor.json_array.json_arrayagg.json_exists.json_object.json_objectagg.json_query.json_table.json_table_primitive.json_value.lag.last_value.lead.listagg.ln.log.log10.lower.max.min.mod.nth_value.ntile.nullif.percent_rank.percentile_cont.percentile_disc.position.position_regex.power.rank.regr_avgx.regr_avgy.regr_count.regr_intercept.regr_r2.regr_slope.regr_sxx.regr_sxy.regr_syy.row_number.sin.sinh.sqrt.stddev_pop.stddev_samp.substring.substring_regex.sum.tan.tanh.translate.translate_regex.treat.trim.trim_array.unnest.upper.value_of.var_pop.var_samp.width_bucket".split("."), d = [
		"current_catalog",
		"current_date",
		"current_default_transform_group",
		"current_path",
		"current_role",
		"current_schema",
		"current_transform_group_for_type",
		"current_user",
		"session_user",
		"system_time",
		"system_user",
		"current_time",
		"localtime",
		"current_timestamp",
		"localtimestamp"
	], f = [
		"create table",
		"insert into",
		"primary key",
		"foreign key",
		"not null",
		"alter table",
		"add constraint",
		"grouping sets",
		"on overflow",
		"character set",
		"respect nulls",
		"ignore nulls",
		"nulls first",
		"nulls last",
		"depth first",
		"breadth first"
	], p = u, m = [...l, ...c].filter((e) => !u.includes(e)), h = {
		scope: "variable",
		match: /@[a-z0-9][a-z0-9_]*/
	}, g = {
		scope: "operator",
		match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
		relevance: 0
	}, _ = {
		match: t.concat(/\b/, t.either(...p), /\s*\(/),
		relevance: 0,
		keywords: { built_in: p }
	};
	function v(e) {
		return t.concat(/\b/, t.either(...e.map((e) => e.replace(/\s+/, "\\s+"))), /\b/);
	}
	let y = {
		scope: "keyword",
		match: v(f),
		relevance: 0
	};
	function b(e, { exceptions: t, when: n } = {}) {
		let r = n;
		return t ||= [], e.map((e) => e.match(/\|\d+$/) || t.includes(e) ? e : r(e) ? `${e}|0` : e);
	}
	return {
		name: "SQL",
		case_insensitive: !0,
		illegal: /[{}]|<\//,
		keywords: {
			$pattern: /\b[\w\.]+/,
			keyword: b(m, { when: (e) => e.length < 3 }),
			literal: a,
			type: s,
			built_in: d
		},
		contains: [
			{
				scope: "type",
				match: v(o)
			},
			y,
			_,
			h,
			r,
			i,
			e.C_NUMBER_MODE,
			e.C_BLOCK_COMMENT_MODE,
			n,
			g
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/yaml.js
function $P(e) {
	let t = "true false yes no null", n = {
		className: "attr",
		variants: [
			{ begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
			{ begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/ },
			{ begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/ }
		]
	}, r = {
		className: "template-variable",
		variants: [{
			begin: /\{\{/,
			end: /\}\}/
		}, {
			begin: /%\{/,
			end: /\}/
		}]
	}, i = {
		className: "string",
		relevance: 0,
		begin: /'/,
		end: /'/,
		contains: [{
			match: /''/,
			scope: "char.escape",
			relevance: 0
		}]
	}, a = {
		className: "string",
		relevance: 0,
		variants: [{
			begin: /"/,
			end: /"/
		}, { begin: /\S+/ }],
		contains: [e.BACKSLASH_ESCAPE, r]
	}, o = e.inherit(a, { variants: [
		{
			begin: /'/,
			end: /'/,
			contains: [{
				begin: /''/,
				relevance: 0
			}]
		},
		{
			begin: /"/,
			end: /"/
		},
		{ begin: /[^\s,{}[\]]+/ }
	] }), s = {
		className: "number",
		begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
	}, c = {
		end: ",",
		endsWithParent: !0,
		excludeEnd: !0,
		keywords: t,
		relevance: 0
	}, l = {
		begin: /\{/,
		end: /\}/,
		contains: [c],
		illegal: "\\n",
		relevance: 0
	}, u = {
		begin: "\\[",
		end: "\\]",
		contains: [c],
		illegal: "\\n",
		relevance: 0
	}, d = [
		n,
		{
			className: "meta",
			begin: "^---\\s*$",
			relevance: 10
		},
		{
			className: "string",
			begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
		},
		{
			begin: "<%[%=-]?",
			end: "[%-]?%>",
			subLanguage: "ruby",
			excludeBegin: !0,
			excludeEnd: !0,
			relevance: 0
		},
		{
			className: "type",
			begin: "!\\w+![\\w#;/?:@&=+$,.~*'()[\\]]+"
		},
		{
			className: "type",
			begin: "!<[\\w#;/?:@&=+$,.~*'()[\\]]+>"
		},
		{
			className: "type",
			begin: "![\\w#;/?:@&=+$,.~*'()[\\]]+"
		},
		{
			className: "type",
			begin: "!![\\w#;/?:@&=+$,.~*'()[\\]]+"
		},
		{
			className: "meta",
			begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
		},
		{
			className: "meta",
			begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
		},
		{
			className: "bullet",
			begin: "-(?=[ ]|$)",
			relevance: 0
		},
		e.HASH_COMMENT_MODE,
		{
			beginKeywords: t,
			keywords: { literal: t }
		},
		s,
		{
			className: "number",
			begin: e.C_NUMBER_RE + "\\b",
			relevance: 0
		},
		l,
		u,
		i,
		a
	], f = [...d];
	return f.pop(), f.push(o), c.contains = f, {
		name: "YAML",
		case_insensitive: !0,
		aliases: ["yml"],
		contains: d
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/markdown.js
function eF(e) {
	let t = e.regex, n = {
		begin: /<\/?[A-Za-z_]/,
		end: ">",
		subLanguage: "xml",
		relevance: 0
	}, r = {
		begin: "^[-\\*]{3,}",
		end: "$"
	}, i = {
		className: "code",
		variants: [
			{ begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
			{ begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
			{
				begin: "```",
				end: "```+[ ]*$"
			},
			{
				begin: "~~~",
				end: "~~~+[ ]*$"
			},
			{ begin: "`.+?`" },
			{
				begin: "(?=^( {4}|\\t))",
				contains: [{
					begin: "^( {4}|\\t)",
					end: "(\\n)$"
				}],
				relevance: 0
			}
		]
	}, a = {
		className: "bullet",
		begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
		end: "\\s+",
		excludeEnd: !0
	}, o = {
		begin: /^\[[^\n]+\]:/,
		returnBegin: !0,
		contains: [{
			className: "symbol",
			begin: /\[/,
			end: /\]/,
			excludeBegin: !0,
			excludeEnd: !0
		}, {
			className: "link",
			begin: /:\s*/,
			end: /$/,
			excludeBegin: !0
		}]
	}, s = {
		variants: [
			{
				begin: /\[.+?\]\[.*?\]/,
				relevance: 0
			},
			{
				begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
				relevance: 2
			},
			{
				begin: t.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
				relevance: 2
			},
			{
				begin: /\[.+?\]\([./?&#].*?\)/,
				relevance: 1
			},
			{
				begin: /\[.*?\]\(.*?\)/,
				relevance: 0
			}
		],
		returnBegin: !0,
		contains: [
			{ match: /\[(?=\])/ },
			{
				className: "string",
				relevance: 0,
				begin: "\\[",
				end: "\\]",
				excludeBegin: !0,
				returnEnd: !0
			},
			{
				className: "link",
				relevance: 0,
				begin: "\\]\\(",
				end: "\\)",
				excludeBegin: !0,
				excludeEnd: !0
			},
			{
				className: "symbol",
				relevance: 0,
				begin: "\\]\\[",
				end: "\\]",
				excludeBegin: !0,
				excludeEnd: !0
			}
		]
	}, c = {
		className: "strong",
		contains: [],
		variants: [{
			begin: /_{2}(?!\s)/,
			end: /_{2}/
		}, {
			begin: /\*{2}(?!\s)/,
			end: /\*{2}/
		}]
	}, l = {
		className: "emphasis",
		contains: [],
		variants: [{
			begin: /\*(?![*\s])/,
			end: /\*/
		}, {
			begin: /_(?![_\s])/,
			end: /_/,
			relevance: 0
		}]
	}, u = e.inherit(c, { contains: [] }), d = e.inherit(l, { contains: [] });
	c.contains.push(d), l.contains.push(u);
	let f = [n, s];
	return [
		c,
		l,
		u,
		d
	].forEach((e) => {
		e.contains = e.contains.concat(f);
	}), f = f.concat(c, l), {
		name: "Markdown",
		aliases: [
			"md",
			"mkdown",
			"mkd"
		],
		contains: [
			{
				className: "section",
				variants: [{
					begin: "^#{1,6}",
					end: "$",
					contains: f
				}, {
					begin: "(?=^.+?\\n[=-]{2,}$)",
					contains: [{ begin: "^[=-]*$" }, {
						begin: "^",
						end: "\\n",
						contains: f
					}]
				}]
			},
			n,
			a,
			c,
			l,
			{
				className: "quote",
				begin: "^>\\s+",
				contains: f,
				end: "$"
			},
			i,
			r,
			s,
			o,
			{
				scope: "literal",
				match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
			}
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/diff.js
function tF(e) {
	let t = e.regex;
	return {
		name: "Diff",
		aliases: ["patch"],
		contains: [
			{
				className: "meta",
				relevance: 10,
				match: t.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/, /^\*\*\* +\d+,\d+ +\*\*\*\*$/, /^--- +\d+,\d+ +----$/)
			},
			{
				className: "comment",
				variants: [{
					begin: t.either(/Index: /, /^index/, /={3,}/, /^-{3}/, /^\*{3} /, /^\+{3}/, /^diff --git/),
					end: /$/
				}, { match: /^\*{15}$/ }]
			},
			{
				className: "addition",
				begin: /^\+/,
				end: /$/
			},
			{
				className: "deletion",
				begin: /^-/,
				end: /$/
			},
			{
				className: "addition",
				begin: /^!/,
				end: /$/
			}
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/go.js
function nF(e) {
	let t = {
		keyword: [
			"break",
			"case",
			"chan",
			"const",
			"continue",
			"default",
			"defer",
			"else",
			"fallthrough",
			"for",
			"func",
			"go",
			"goto",
			"if",
			"import",
			"interface",
			"map",
			"package",
			"range",
			"return",
			"select",
			"struct",
			"switch",
			"type",
			"var"
		],
		type: [
			"bool",
			"byte",
			"complex64",
			"complex128",
			"error",
			"float32",
			"float64",
			"int8",
			"int16",
			"int32",
			"int64",
			"string",
			"uint8",
			"uint16",
			"uint32",
			"uint64",
			"int",
			"uint",
			"uintptr",
			"rune"
		],
		literal: [
			"true",
			"false",
			"iota",
			"nil"
		],
		built_in: [
			"append",
			"cap",
			"close",
			"complex",
			"copy",
			"imag",
			"len",
			"make",
			"new",
			"panic",
			"print",
			"println",
			"real",
			"recover",
			"delete"
		]
	};
	return {
		name: "Go",
		aliases: ["golang"],
		keywords: t,
		illegal: "</",
		contains: [
			e.C_LINE_COMMENT_MODE,
			e.C_BLOCK_COMMENT_MODE,
			{
				className: "string",
				variants: [
					e.QUOTE_STRING_MODE,
					e.APOS_STRING_MODE,
					{
						begin: "`",
						end: "`"
					}
				]
			},
			{
				className: "number",
				variants: [
					{
						match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
						relevance: 0
					},
					{
						match: /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
						relevance: 0
					},
					{
						match: /-?\b0[oO](_?[0-7])*i?/,
						relevance: 0
					},
					{
						match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
						relevance: 0
					},
					{
						match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
						relevance: 0
					}
				]
			},
			{ begin: /:=/ },
			{
				className: "function",
				beginKeywords: "func",
				end: "\\s*(\\{|$)",
				excludeEnd: !0,
				contains: [e.TITLE_MODE, {
					className: "params",
					begin: /\(/,
					end: /\)/,
					endsParent: !0,
					keywords: t,
					illegal: /["']/
				}]
			}
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/rust.js
function rF(e) {
	let t = e.regex, n = /(r#)?/, r = t.concat(n, e.UNDERSCORE_IDENT_RE), i = t.concat(n, e.IDENT_RE), a = {
		className: "title.function.invoke",
		relevance: 0,
		begin: t.concat(/\b/, /(?!let|for|while|if|else|match\b)/, i, t.lookahead(/\s*\(/))
	}, o = /* @__PURE__ */ "abstract.as.async.await.become.box.break.const.continue.crate.do.dyn.else.enum.extern.false.final.fn.for.if.impl.in.let.loop.macro.match.mod.move.mut.override.priv.pub.ref.return.self.Self.static.struct.super.trait.true.try.type.typeof.union.unsafe.unsized.use.virtual.where.while.yield".split("."), s = [
		"true",
		"false",
		"Some",
		"None",
		"Ok",
		"Err"
	], c = /* @__PURE__ */ "drop .Copy.Send.Sized.Sync.Drop.Fn.FnMut.FnOnce.ToOwned.Clone.Debug.PartialEq.PartialOrd.Eq.Ord.AsRef.AsMut.Into.From.Default.Iterator.Extend.IntoIterator.DoubleEndedIterator.ExactSizeIterator.SliceConcatExt.ToString.assert!.assert_eq!.bitflags!.bytes!.cfg!.col!.concat!.concat_idents!.debug_assert!.debug_assert_eq!.env!.eprintln!.panic!.file!.format!.format_args!.include_bytes!.include_str!.line!.local_data_key!.module_path!.option_env!.print!.println!.select!.stringify!.try!.unimplemented!.unreachable!.vec!.write!.writeln!.macro_rules!.assert_ne!.debug_assert_ne!".split("."), l = [
		"i8",
		"i16",
		"i32",
		"i64",
		"i128",
		"isize",
		"u8",
		"u16",
		"u32",
		"u64",
		"u128",
		"usize",
		"f32",
		"f64",
		"str",
		"char",
		"bool",
		"Box",
		"Option",
		"Result",
		"String",
		"Vec"
	];
	return {
		name: "Rust",
		aliases: ["rs"],
		keywords: {
			$pattern: e.IDENT_RE + "!?",
			type: l,
			keyword: o,
			literal: s,
			built_in: c
		},
		illegal: "</",
		contains: [
			e.C_LINE_COMMENT_MODE,
			e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
			e.inherit(e.QUOTE_STRING_MODE, {
				begin: /b?"/,
				illegal: null
			}),
			{
				className: "symbol",
				begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/
			},
			{
				scope: "string",
				variants: [{ begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ }, {
					begin: /b?'/,
					end: /'/,
					contains: [{
						scope: "char.escape",
						match: /\\('|\w|x\w{2}|u\w{4}|U\w{8})/
					}]
				}]
			},
			{
				className: "number",
				variants: [
					{ begin: "\\b0b([01_]+)([ui](8|16|32|64|128|size)|f(32|64))?" },
					{ begin: "\\b0o([0-7_]+)([ui](8|16|32|64|128|size)|f(32|64))?" },
					{ begin: "\\b0x([A-Fa-f0-9_]+)([ui](8|16|32|64|128|size)|f(32|64))?" },
					{ begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)([ui](8|16|32|64|128|size)|f(32|64))?" }
				],
				relevance: 0
			},
			{
				begin: [
					/fn/,
					/\s+/,
					r
				],
				className: {
					1: "keyword",
					3: "title.function"
				}
			},
			{
				className: "meta",
				begin: "#!?\\[",
				end: "\\]",
				contains: [{
					className: "string",
					begin: /"/,
					end: /"/,
					contains: [e.BACKSLASH_ESCAPE]
				}]
			},
			{
				begin: [
					/let/,
					/\s+/,
					/(?:mut\s+)?/,
					r
				],
				className: {
					1: "keyword",
					3: "keyword",
					4: "variable"
				}
			},
			{
				begin: [
					/for/,
					/\s+/,
					r,
					/\s+/,
					/in/
				],
				className: {
					1: "keyword",
					3: "variable",
					5: "keyword"
				}
			},
			{
				begin: [
					/type/,
					/\s+/,
					r
				],
				className: {
					1: "keyword",
					3: "title.class"
				}
			},
			{
				begin: [
					/(?:trait|enum|struct|union|impl|for)/,
					/\s+/,
					r
				],
				className: {
					1: "keyword",
					3: "title.class"
				}
			},
			{
				begin: e.IDENT_RE + "::",
				keywords: {
					keyword: "Self",
					built_in: c,
					type: l
				}
			},
			{
				className: "punctuation",
				begin: "->"
			},
			a
		]
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/ruby.js
function iF(e) {
	let t = e.regex, n = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)", r = t.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/), i = t.concat(r, /(::\w+)*/), a = {
		"variable.constant": [
			"__FILE__",
			"__LINE__",
			"__ENCODING__"
		],
		"variable.language": ["self", "super"],
		keyword: /* @__PURE__ */ "alias.and.begin.BEGIN.break.case.class.defined.do.else.elsif.end.END.ensure.for.if.in.module.next.not.or.redo.require.rescue.retry.return.then.undef.unless.until.when.while.yield.include.extend.prepend.public.private.protected.raise.throw".split("."),
		built_in: [
			"proc",
			"lambda",
			"attr_accessor",
			"attr_reader",
			"attr_writer",
			"define_method",
			"private_constant",
			"module_function"
		],
		literal: [
			"true",
			"false",
			"nil"
		]
	}, o = {
		className: "doctag",
		begin: "@[A-Za-z]+"
	}, s = {
		begin: "#<",
		end: ">"
	}, c = [
		e.COMMENT("#", "$", { contains: [o] }),
		e.COMMENT("^=begin", "^=end", {
			contains: [o],
			relevance: 10
		}),
		e.COMMENT("^__END__", e.MATCH_NOTHING_RE)
	], l = {
		className: "subst",
		begin: /#\{/,
		end: /\}/,
		keywords: a
	}, u = {
		className: "string",
		contains: [e.BACKSLASH_ESCAPE, l],
		variants: [
			{
				begin: /'/,
				end: /'/
			},
			{
				begin: /"/,
				end: /"/
			},
			{
				begin: /`/,
				end: /`/
			},
			{
				begin: /%[qQwWx]?\(/,
				end: /\)/
			},
			{
				begin: /%[qQwWx]?\[/,
				end: /\]/
			},
			{
				begin: /%[qQwWx]?\{/,
				end: /\}/
			},
			{
				begin: /%[qQwWx]?</,
				end: />/
			},
			{
				begin: /%[qQwWx]?\//,
				end: /\//
			},
			{
				begin: /%[qQwWx]?%/,
				end: /%/
			},
			{
				begin: /%[qQwWx]?-/,
				end: /-/
			},
			{
				begin: /%[qQwWx]?\|/,
				end: /\|/
			},
			{ begin: /\B\?(\\\d{1,3})/ },
			{ begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/ },
			{ begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
			{ begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/ },
			{ begin: /\B\?\\(c|C-)[\x20-\x7e]/ },
			{ begin: /\B\?\\?\S/ },
			{
				begin: t.concat(/<<[-~]?'?/, t.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
				contains: [e.END_SAME_AS_BEGIN({
					begin: /(\w+)/,
					end: /(\w+)/,
					contains: [e.BACKSLASH_ESCAPE, l]
				})]
			}
		]
	}, d = "[0-9](_?[0-9])*", f = {
		className: "number",
		relevance: 0,
		variants: [
			{ begin: `\\b([1-9](_?[0-9])*|0)(\\.(${d}))?([eE][+-]?(${d})|r)?i?\\b` },
			{ begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b" },
			{ begin: "\\b0(_?[0-7])+r?i?\\b" }
		]
	}, p = { variants: [{ match: /\(\)/ }, {
		className: "params",
		begin: /\(/,
		end: /(?=\))/,
		excludeBegin: !0,
		endsParent: !0,
		keywords: a
	}] }, m = [
		u,
		{
			variants: [{ match: [
				/class\s+/,
				i,
				/\s+<\s+/,
				i
			] }, { match: [/\b(class|module)\s+/, i] }],
			scope: {
				2: "title.class",
				4: "title.class.inherited"
			},
			keywords: a
		},
		{
			match: [/(include|extend)\s+/, i],
			scope: { 2: "title.class" },
			keywords: a
		},
		{
			relevance: 0,
			match: [i, /\.new[. (]/],
			scope: { 1: "title.class" }
		},
		{
			relevance: 0,
			match: /\b[A-Z][A-Z_0-9]+\b/,
			className: "variable.constant"
		},
		{
			relevance: 0,
			match: r,
			scope: "title.class"
		},
		{
			match: [
				/def/,
				/\s+/,
				n
			],
			scope: {
				1: "keyword",
				3: "title.function"
			},
			contains: [p]
		},
		{ begin: e.IDENT_RE + "::" },
		{
			className: "symbol",
			begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
			relevance: 0
		},
		{
			className: "symbol",
			begin: ":(?!\\s)",
			contains: [u, { begin: n }],
			relevance: 0
		},
		f,
		{
			className: "variable",
			begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
		},
		{
			className: "params",
			begin: /\|(?!=)/,
			end: /\|/,
			excludeBegin: !0,
			excludeEnd: !0,
			relevance: 0,
			keywords: a
		},
		{
			begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
			keywords: "unless",
			contains: [{
				className: "regexp",
				contains: [e.BACKSLASH_ESCAPE, l],
				illegal: /\n/,
				variants: [
					{
						begin: "/",
						end: "/[a-z]*"
					},
					{
						begin: /%r\{/,
						end: /\}[a-z]*/
					},
					{
						begin: "%r\\(",
						end: "\\)[a-z]*"
					},
					{
						begin: "%r!",
						end: "![a-z]*"
					},
					{
						begin: "%r\\[",
						end: "\\][a-z]*"
					}
				]
			}].concat(s, c),
			relevance: 0
		}
	].concat(s, c);
	l.contains = m, p.contains = m;
	let h = [{
		begin: /^\s*=>/,
		starts: {
			end: "$",
			contains: m
		}
	}, {
		className: "meta.prompt",
		begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
		starts: {
			end: "$",
			keywords: a,
			contains: m
		}
	}];
	return c.unshift(s), {
		name: "Ruby",
		aliases: [
			"rb",
			"gemspec",
			"podspec",
			"thor",
			"irb"
		],
		keywords: a,
		illegal: /\/\*/,
		contains: [e.SHEBANG({ binary: "ruby" })].concat(h, c, m)
	};
}
//#endregion
//#region node_modules/highlight.js/es/languages/php.js
function aF(e) {
	let t = e.regex, n = /(?![A-Za-z0-9])(?![$])/, r = t.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, n), i = t.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, n), a = t.concat(/[A-Z]+/, n), o = {
		scope: "variable",
		match: "\\$+" + r
	}, s = {
		scope: "meta",
		variants: [
			{
				begin: /<\?php/,
				relevance: 10
			},
			{ begin: /<\?=/ },
			{
				begin: /<\?/,
				relevance: .1
			},
			{ begin: /\?>/ }
		]
	}, c = {
		scope: "subst",
		variants: [{ begin: /\$\w+/ }, {
			begin: /\{\$/,
			end: /\}/
		}]
	}, l = e.inherit(e.APOS_STRING_MODE, { illegal: null }), u = e.inherit(e.QUOTE_STRING_MODE, {
		illegal: null,
		contains: e.QUOTE_STRING_MODE.contains.concat(c)
	}), d = {
		begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
		end: /[ \t]*(\w+)\b/,
		contains: e.QUOTE_STRING_MODE.contains.concat(c),
		"on:begin": (e, t) => {
			t.data._beginMatch = e[1] || e[2];
		},
		"on:end": (e, t) => {
			t.data._beginMatch !== e[1] && t.ignoreMatch();
		}
	}, f = e.END_SAME_AS_BEGIN({
		begin: /<<<[ \t]*'(\w+)'\n/,
		end: /[ \t]*(\w+)\b/
	}), p = "[ 	\n]", m = {
		scope: "string",
		variants: [
			u,
			l,
			d,
			f
		]
	}, h = {
		scope: "number",
		variants: [
			{ begin: "\\b0[bB][01]+(?:_[01]+)*\\b" },
			{ begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" },
			{ begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b" },
			{ begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?" }
		],
		relevance: 0
	}, g = [
		"false",
		"null",
		"true"
	], _ = /* @__PURE__ */ "__CLASS__.__DIR__.__FILE__.__FUNCTION__.__COMPILER_HALT_OFFSET__.__LINE__.__METHOD__.__NAMESPACE__.__TRAIT__.die.echo.exit.include.include_once.print.require.require_once.array.abstract.and.as.binary.bool.boolean.break.callable.case.catch.class.clone.const.continue.declare.default.do.double.else.elseif.empty.enddeclare.endfor.endforeach.endif.endswitch.endwhile.enum.eval.extends.final.finally.float.for.foreach.from.global.goto.if.implements.instanceof.insteadof.int.integer.interface.isset.iterable.list.match|0.mixed.new.never.object.or.private.protected.public.readonly.real.return.string.switch.throw.trait.try.unset.use.var.void.while.xor.yield".split("."), v = /* @__PURE__ */ "Error|0.AppendIterator.ArgumentCountError.ArithmeticError.ArrayIterator.ArrayObject.AssertionError.BadFunctionCallException.BadMethodCallException.CachingIterator.CallbackFilterIterator.CompileError.Countable.DirectoryIterator.DivisionByZeroError.DomainException.EmptyIterator.ErrorException.Exception.FilesystemIterator.FilterIterator.GlobIterator.InfiniteIterator.InvalidArgumentException.IteratorIterator.LengthException.LimitIterator.LogicException.MultipleIterator.NoRewindIterator.OutOfBoundsException.OutOfRangeException.OuterIterator.OverflowException.ParentIterator.ParseError.RangeException.RecursiveArrayIterator.RecursiveCachingIterator.RecursiveCallbackFilterIterator.RecursiveDirectoryIterator.RecursiveFilterIterator.RecursiveIterator.RecursiveIteratorIterator.RecursiveRegexIterator.RecursiveTreeIterator.RegexIterator.RuntimeException.SeekableIterator.SplDoublyLinkedList.SplFileInfo.SplFileObject.SplFixedArray.SplHeap.SplMaxHeap.SplMinHeap.SplObjectStorage.SplObserver.SplPriorityQueue.SplQueue.SplStack.SplSubject.SplTempFileObject.TypeError.UnderflowException.UnexpectedValueException.UnhandledMatchError.ArrayAccess.BackedEnum.Closure.Fiber.Generator.Iterator.IteratorAggregate.Serializable.Stringable.Throwable.Traversable.UnitEnum.WeakReference.WeakMap.Directory.__PHP_Incomplete_Class.parent.php_user_filter.self.static.stdClass".split("."), y = {
		keyword: _,
		literal: ((e) => {
			let t = [];
			return e.forEach((e) => {
				t.push(e), e.toLowerCase() === e ? t.push(e.toUpperCase()) : t.push(e.toLowerCase());
			}), t;
		})(g),
		built_in: v
	}, b = (e) => e.map((e) => e.replace(/\|\d+$/, "")), x = { variants: [{
		match: [
			/new/,
			t.concat(p, "+"),
			t.concat("(?!", b(v).join("\\b|"), "\\b)"),
			i
		],
		scope: {
			1: "keyword",
			4: "title.class"
		}
	}] }, S = t.concat(r, "\\b(?!\\()"), ee = { variants: [
		{
			match: [t.concat(/::/, t.lookahead(/(?!class\b)/)), S],
			scope: { 2: "variable.constant" }
		},
		{
			match: [/::/, /class/],
			scope: { 2: "variable.language" }
		},
		{
			match: [
				i,
				t.concat(/::/, t.lookahead(/(?!class\b)/)),
				S
			],
			scope: {
				1: "title.class",
				3: "variable.constant"
			}
		},
		{
			match: [i, t.concat("::", t.lookahead(/(?!class\b)/))],
			scope: { 1: "title.class" }
		},
		{
			match: [
				i,
				/::/,
				/class/
			],
			scope: {
				1: "title.class",
				3: "variable.language"
			}
		}
	] }, te = {
		scope: "attr",
		match: t.concat(r, t.lookahead(":"), t.lookahead(/(?!::)/))
	}, C = {
		relevance: 0,
		begin: /\(/,
		end: /\)/,
		keywords: y,
		contains: [
			te,
			o,
			ee,
			e.C_BLOCK_COMMENT_MODE,
			m,
			h,
			x
		]
	}, ne = {
		relevance: 0,
		match: [
			/\b/,
			t.concat("(?!fn\\b|function\\b|", b(_).join("\\b|"), "|", b(v).join("\\b|"), "\\b)"),
			r,
			t.concat(p, "*"),
			t.lookahead(/(?=\()/)
		],
		scope: { 3: "title.function.invoke" },
		contains: [C]
	};
	C.contains.push(ne);
	let w = [
		te,
		ee,
		e.C_BLOCK_COMMENT_MODE,
		m,
		h,
		x
	], re = {
		begin: t.concat(/#\[\s*\\?/, t.either(i, a)),
		beginScope: "meta",
		end: /]/,
		endScope: "meta",
		keywords: {
			literal: g,
			keyword: ["new", "array"]
		},
		contains: [
			{
				begin: /\[/,
				end: /]/,
				keywords: {
					literal: g,
					keyword: ["new", "array"]
				},
				contains: ["self", ...w]
			},
			...w,
			{
				scope: "meta",
				variants: [{ match: i }, { match: a }]
			}
		]
	};
	return {
		case_insensitive: !1,
		keywords: y,
		contains: [
			re,
			e.HASH_COMMENT_MODE,
			e.COMMENT("//", "$"),
			e.COMMENT("/\\*", "\\*/", { contains: [{
				scope: "doctag",
				match: "@[A-Za-z]+"
			}] }),
			{
				match: /__halt_compiler\(\);/,
				keywords: "__halt_compiler",
				starts: {
					scope: "comment",
					end: e.MATCH_NOTHING_RE,
					contains: [{
						match: /\?>/,
						scope: "meta",
						endsParent: !0
					}]
				}
			},
			s,
			{
				scope: "variable.language",
				match: /\$this\b/
			},
			o,
			ne,
			ee,
			{
				match: [
					/const/,
					/\s/,
					r
				],
				scope: {
					1: "keyword",
					3: "variable.constant"
				}
			},
			x,
			{
				scope: "function",
				relevance: 0,
				beginKeywords: "fn function",
				end: /[;{]/,
				excludeEnd: !0,
				illegal: "[$%\\[]",
				contains: [
					{ beginKeywords: "use" },
					e.UNDERSCORE_TITLE_MODE,
					{
						begin: "=>",
						endsParent: !0
					},
					{
						scope: "params",
						begin: "\\(",
						end: "\\)",
						excludeBegin: !0,
						excludeEnd: !0,
						keywords: y,
						contains: [
							"self",
							re,
							o,
							ee,
							e.C_BLOCK_COMMENT_MODE,
							m,
							h
						]
					}
				]
			},
			{
				scope: "class",
				variants: [{
					beginKeywords: "enum",
					illegal: /[($"]/
				}, {
					beginKeywords: "class interface trait",
					illegal: /[:($"]/
				}],
				relevance: 0,
				end: /\{/,
				excludeEnd: !0,
				contains: [{ beginKeywords: "extends implements" }, e.UNDERSCORE_TITLE_MODE]
			},
			{
				beginKeywords: "namespace",
				relevance: 0,
				end: ";",
				illegal: /[.']/,
				contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
			},
			{
				beginKeywords: "use",
				relevance: 0,
				end: ";",
				contains: [{
					match: /\b(as|const|function)\b/,
					scope: "keyword"
				}, e.UNDERSCORE_TITLE_MODE]
			},
			m,
			h
		]
	};
}
dP.registerLanguage("javascript", bP), dP.registerLanguage("typescript", AP), dP.registerLanguage("python", jP), dP.registerLanguage("java", LP), dP.registerLanguage("csharp", RP), dP.registerLanguage("cpp", zP), dP.registerLanguage("css", JP), dP.registerLanguage("html", YP), dP.registerLanguage("json", XP), dP.registerLanguage("bash", ZP), dP.registerLanguage("sql", QP), dP.registerLanguage("yaml", $P), dP.registerLanguage("markdown", eF), dP.registerLanguage("diff", tF), dP.registerLanguage("go", nF), dP.registerLanguage("rust", rF), dP.registerLanguage("ruby", iF), dP.registerLanguage("php", aF);
var oF = L.create({
	name: "codeBlockHighlight",
	addProseMirrorPlugins() {
		let e = new M("codeBlockHighlight");
		return [new j({
			key: e,
			state: {
				init(e, { doc: t }) {
					return sF(t);
				},
				apply(e, t) {
					return e.docChanged ? sF(e.doc) : t;
				}
			},
			props: { decorations(t) {
				return e.getState(t);
			} }
		})];
	}
});
function sF(e) {
	let t = [];
	return e.descendants((e, n) => {
		if (e.type.name !== "codeBlock") return;
		let r = e.textContent;
		if (!r) return;
		let i = e.attrs.language, a;
		try {
			a = i && dP.getLanguage(i) ? dP.highlight(r, { language: i }) : dP.highlightAuto(r);
		} catch {
			return;
		}
		let o = document.createElement("div");
		o.innerHTML = a.value;
		let s = [];
		function c(e, t) {
			for (let n of e.childNodes) n.nodeType === Node.TEXT_NODE ? n.textContent && s.push({
				len: n.textContent.length,
				cls: t
			}) : n.nodeType === Node.ELEMENT_NODE && c(n, t ? t + " " + n.className : n.className);
		}
		c(o, "");
		let l = 0;
		for (let { len: e, cls: r } of s) {
			if (e <= 0) continue;
			let i = n + 1 + l, a = i + e;
			r && t.push(ms.inline(i, a, { class: r })), l += e;
		}
	}), N.create(e, t);
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js
var cF = yd({
	nodeName: "todoList",
	name: "todoList",
	content: "",
	defaultAttributes: { rows: [] },
	allowedAttributes: ["rows"]
});
function lF(e) {
	return typeof e == "string" ? e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
}
function uF(e) {
	return `
    <div class="todo-filter">
      <button class="todo-filter-btn active" data-filter="all">All</button>
      <button class="todo-filter-btn" data-filter="done">Done</button>
      <button class="todo-filter-btn" data-filter="open">Not done</button>
    </div>
    <table class="todo-table">
      <thead><tr><th>Task</th><th>Deadline</th><th>Checklist</th></tr></thead>
      <tbody>${e.map((e) => `
    <tr>
      <td><input class="todo-task" type="text" value="${lF(e.task)}" placeholder="What needs doing?"></td>
      <td><input class="todo-deadline" type="text" value="${lF(e.deadline)}" placeholder="Due date"></td>
      <td class="todo-check-col"><input type="checkbox"${e.checked ? " checked" : ""}></td>
    </tr>
  `).join("")}</tbody>
    </table>
    <button class="todo-add-btn">+ Add item</button>
  `;
}
function dF(e) {
	return Array.from(KM.values()).find((t) => t.editor?.view?.dom?.contains(e))?.editor || null;
}
function fF(e) {
	let t = [];
	return e.querySelectorAll("tbody tr").forEach((e) => {
		t.push({
			checked: e.querySelector("input[type=\"checkbox\"]")?.checked || !1,
			task: e.querySelector(".todo-task")?.value || "",
			deadline: e.querySelector(".todo-deadline")?.value || ""
		});
	}), t;
}
function pF(e, t) {
	let n = dF(e);
	if (!n) return;
	let { state: r, view: i } = n, a = i.posAtDOM(e, 0);
	if (a == null) return;
	let o = r.doc.resolve(a), s = o.depth;
	for (; s >= 0 && o.node(s).type.name !== "todoList";) s--;
	s < 0 || i.dispatch(r.tr.setNodeMarkup(o.before(s), null, { rows: t }));
}
function mF(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var hF = mF((e) => {
	pF(e, fF(e));
}, 300), gF = R.create({
	name: "todoList",
	group: "block",
	atom: !0,
	draggable: !0,
	addAttributes() {
		return { rows: { default: [] } };
	},
	parseHTML() {
		return [{
			tag: "div[data-todo-list]",
			getAttrs: (e) => ({ rows: JSON.parse(e.getAttribute("data-rows") || "[]") })
		}];
	},
	renderHTML({ HTMLAttributes: e }) {
		return ["div", {
			"data-todo-list": "",
			"data-rows": JSON.stringify(e.rows || []),
			class: "todo-list"
		}];
	},
	addNodeView() {
		return ({ node: e }) => {
			let t = document.createElement("div");
			t.setAttribute("data-todo-list", ""), t.className = "todo-list", t.contentEditable = "false";
			function n() {
				t.setAttribute("data-rows", JSON.stringify(e.attrs.rows || []));
				let n = t.ownerDocument.activeElement, r = null;
				if (n && t.contains(n) && (r = {
					tag: n.tagName,
					cls: n.className,
					value: n.value,
					start: n.selectionStart,
					end: n.selectionEnd
				}), t.innerHTML = uF(e.attrs.rows || []), t.querySelectorAll(".todo-filter-btn").forEach((e) => {
					e.addEventListener("click", () => {
						t.querySelectorAll(".todo-filter-btn").forEach((e) => e.classList.remove("active")), e.classList.add("active");
						let n = e.dataset.filter;
						t.querySelectorAll("tbody tr").forEach((e) => {
							let t = e.querySelector("input[type=\"checkbox\"]")?.checked;
							e.style.display = n === "all" ? "" : n === "done" ? t ? "" : "none" : t ? "none" : "";
						});
					});
				}), r && r.tag === "INPUT") {
					let e = t.querySelectorAll("tbody input");
					for (let t of e) if (t.className === r.cls) {
						t.value = r.value, t.focus();
						try {
							t.selectionStart = r.start, t.selectionEnd = r.end;
						} catch {}
						break;
					}
				}
			}
			return n(), {
				dom: t,
				update(t) {
					return t.type.name === "todoList" ? (e = t, n(), !0) : !1;
				},
				ignoreMutation() {
					return !0;
				},
				stopEvent(e) {
					let t = e.target;
					return t.closest(".todo-add-btn") != null || t.closest(".todo-filter-btn") != null || t.closest("input") != null || t.closest("td") != null;
				}
			};
		};
	},
	...cF
});
function _F() {
	document.addEventListener("click", (e) => {
		let t = e.target.closest("[data-todo-list]");
		if (t) {
			if (e.target.closest(".todo-add-btn")) {
				e.preventDefault();
				let n = fF(t);
				n.push({
					checked: !1,
					task: "",
					deadline: ""
				}), pF(t, n);
				return;
			}
			if (e.target.matches("input[type=\"checkbox\"]")) {
				pF(t, fF(t));
				return;
			}
		}
	}), document.addEventListener("input", (e) => {
		let t = e.target.closest("[data-todo-list]");
		t && e.target.matches(".todo-task, .todo-deadline") && hF(t);
	});
}
//#endregion
//#region src/Yanoch.Web/wwwroot/js/tiptap/editor.js
function vF() {
	return (e, t) => !!(eP(t) || LN(t));
}
function yF(e, t, n, r) {
	bF(e);
	let i = document.getElementById(e);
	if (!i) return null;
	let a = {
		dotNetRef: n,
		blockId: r,
		firstUpdate: !0,
		editor: null,
		listeners: [],
		_lastSubpageOrder: "pending"
	}, o = new tf({
		element: i,
		extensions: [
			k_.configure({
				codeBlock: !0,
				heading: { levels: [
					1,
					2,
					3
				] }
			}),
			oF,
			vg,
			rh.configure({
				openOnClick: !0,
				autolink: !1,
				HTMLAttributes: { class: "wiki-link" }
			}),
			j_.configure({
				inline: !1,
				allowBase64: !0,
				HTMLAttributes: { class: "editor-image" }
			}),
			M_,
			N_.configure({ nested: !0 }),
			Ty.configure({ placeholder: "Type '/' for commands…" }),
			Ey,
			wy.configure({
				html: !0,
				transformCopiedText: !0,
				transformPastedText: !0
			}),
			MA.configure({
				nested: !1,
				render() {
					let e = document.createElement("div");
					return e.classList.add("drag-handle"), e.innerHTML = "⣿", e.title = "Drag to reorder", e;
				}
			}),
			HM.configure({ resizable: !0 }),
			UM,
			GM,
			WM,
			iP,
			oP,
			lP,
			gF
		],
		content: t || "",
		contentType: "markdown",
		editorProps: {
			attributes: {
				class: "tiptap-editor",
				"data-block-id": r
			},
			handleKeyDown: vF(),
			handlePaste(e, t) {
				let n = t.clipboardData?.files;
				if (n && n[0]?.type.startsWith("image/")) return t.preventDefault(), $M(n[0]).then((t) => {
					t && e.dispatch(e.state.tr.replaceSelectionWith(e.state.schema.nodes.image.create(null, { src: t })));
				}), !0;
				let r = t.clipboardData?.getData("text/plain");
				if (r && /^https?:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(r.trim())) return t.preventDefault(), e.dispatch(e.state.tr.replaceSelectionWith(e.state.schema.nodes.image.create(null, { src: r.trim() }))), !0;
				if (r && /^\|[^\n]+\n\|[\s:-]+\|/.test(r.trim())) {
					t.preventDefault();
					try {
						let n = W.parse(r.trim());
						e.pasteHTML(n, { event: t });
					} catch (e) {
						console.warn("table paste failed", e);
					}
					return !0;
				}
				return !1;
			},
			handleDrop(e, t) {
				let n = t.dataTransfer?.files;
				if (n && n[0]?.type.startsWith("image/")) {
					t.preventDefault();
					let r = e.posAtCoords({
						left: t.clientX,
						top: t.clientY
					});
					return r && $M(n[0]).then((t) => {
						t && e.dispatch(e.state.tr.insert(r.pos, e.state.schema.nodes.image.create(null, { src: t })));
					}), !0;
				}
				return !1;
			}
		},
		onCreate: ({ editor: e }) => {
			r && tN(e, r).then(() => {
				a._lastSubpageOrder = iN(e).join(",");
			});
		},
		onUpdate: ({ editor: t, transaction: n }) => {
			if (!n?.getMeta("subpageInject")) {
				if (a.firstUpdate) {
					a.firstUpdate = !1;
					return;
				}
				if (dN(a, t.getMarkdown()), FN(t), $N(t), nP(t, e), a.blockId && t.state.doc.childCount > 0) {
					let e = iN(t), n = e.join(",");
					a._lastSubpageOrder !== "pending" && e.length > 0 && n !== a._lastSubpageOrder && (a._lastSubpageOrder = n, rN(a.blockId, e));
				}
			}
		},
		onSelectionUpdate: ({ editor: t }) => {
			TN && FN(t), zN && $N(t), nP(t, e);
		},
		onFocus: () => XM(a.dotNetRef, "OnFocus", a.blockId),
		onBlur: () => {
			NN(), YN(), tP(e), XM(a.dotNetRef, "OnBlur", a.blockId);
		}
	});
	a.editor = o, a.tableMenuEl = null;
	let s = document.getElementById("btn-upload-image");
	if (s) {
		let t = QM();
		t.onchange = async () => {
			let n = t.files?.[0];
			if (!n) return;
			let r = KM.get(e)?.editor;
			if (!r) return;
			let i = await $M(n);
			i && r.chain().focus().setImage({ src: i }).run(), t.value = "";
		}, s.onclick = () => t.click();
	}
	let c = function(e) {
		if (_N !== void 0 && $ && !$.contains(e.target) && !e.target.closest("[data-callout-icon]") && !e.target.closest("[data-callout-color]")) {
			let t = e.target.closest("[data-callout]");
			(!t || t !== vN) && yN();
		}
		TN && wN && !wN.contains(e.target) && !i.contains(e.target) && NN(), zN && RN && !RN.contains(e.target) && !i.contains(e.target) && YN();
	};
	return document.addEventListener("mousedown", c), a.listeners.push({
		type: "mousedown",
		handler: c
	}), KM.set(e, a), o;
}
function bF(e) {
	let t = KM.get(e);
	t && (t._dirty = !1, t._pendingMarkdown = null, tP(e), t.listeners.forEach((e) => document.removeEventListener(e.type, e.handler)), t.listeners = [], t.dotNetRef = null, t.editor &&= (t.editor.destroy(), null), KM.delete(e), fN());
}
function xF(e) {
	return KM.get(e)?.editor?.getMarkdown() ?? "";
}
function SF(e, t) {
	KM.get(e)?.editor?.commands.setContent(t, !1, "markdown");
}
function CF(e, t) {
	KM.get(e)?.editor?.setEditable(t);
}
function wF(e) {
	KM.get(e)?.editor?.commands.focus();
}
function TF(e) {
	KM.get(e)?.editor?.commands.blur();
}
window.initTipTap = yF, window.destroyTipTap = bF, window.getTipTapMarkdown = xF, window.setTipTapContent = SF, window.setTipTapEditable = CF, window.focusTipTap = wF, window.blurTipTap = TF, SN(), cP(), uP(), _F(), pN();
//#endregion
export { TF as blurEditor, yF as createEditor, bF as destroyEditor, wF as focusEditor, xF as getMarkdown, SF as setContent, CF as setEditable };
