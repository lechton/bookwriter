## 1 — Prototype: own first, then inherited
@tags Objects, Lookup, Inheritance

**Q. You never added publish to piece, so where does piece.publish() come from?**

**Answer.** Every object carries a hidden link to another object called its prototype. When you read a property, JavaScript looks on the object itself first; if the property is not there, it follows that hidden link up to the prototype and uses whatever it finds. `publish` was never put on `piece`, so the lookup walks up to `Article.prototype` and finds it there.

**Why it works.** A property stored directly on the object is an own property, returned at once. A property found by walking up the chain is inherited. There is only one shared copy of `publish` on `Article.prototype`, but every instance can reach it, so a million `Article` objects share one method instead of each carrying its own.

```js title="examples/Article.js"
class Article {
  publish() { return "published"; }   // on Article.prototype
}
const piece = new Article();           // a new instance
piece.headline = "Markets rally";      // an own property
console.log(piece.headline);           // "Markets rally" — own
console.log(piece.publish());          // "published" — inherited
console.log(piece.author);             // undefined — not on the chain
```

<div class="dg" style="display:flex; flex-direction:column; align-items:center; padding:32px 16px 20px; background:#fff; position:relative;">
<span style="position:absolute; top:-12px; left:16px; background:#000; color:#fff; font-size:7.5pt; font-weight:800; padding:2px 8px; letter-spacing:0.1em; text-transform:uppercase;">The Lookup Walks Up</span>
<div style="border:3px solid #000; background:#fef08a; padding:10px 18px; font-family:var(--mono); font-weight:800; font-size:11pt; box-shadow:4px 4px 0 0 #000; text-align:center; z-index:2;">
piece<br/><span style="font-family:var(--sans); font-size:8pt; font-weight:600; color:#4b5563;">own: headline = "Markets rally"</span>
</div>
<div style="font-size:16pt; font-weight:900; line-height:1; margin:6px 0; z-index:2;">↑</div>
<div style="border:3px solid #000; background:#bfdbfe; padding:10px 18px; font-family:var(--mono); font-weight:800; font-size:11pt; box-shadow:4px 4px 0 0 #000; text-align:center; z-index:2;">
Article.prototype<br/><span style="font-family:var(--sans); font-size:8pt; font-weight:600; color:#4b5563;">inherited: publish()</span>
</div>
<div style="font-size:16pt; font-weight:900; line-height:1; margin:6px 0; z-index:2;">↑</div>
<div style="border:3px dashed #9ca3af; background:#f3f4f6; padding:8px 16px; font-family:var(--mono); font-weight:700; font-size:10pt; color:#4b5563; text-align:center; z-index:2;">
Object.prototype<br/><span style="font-family:var(--sans); font-size:7.5pt; font-weight:600;">built-in methods</span>
</div>
<div style="font-size:14pt; font-weight:900; line-height:1; margin:4px 0; color:#9ca3af; z-index:2;">↑</div>
<div style="font-family:var(--mono); font-weight:800; font-size:10pt; background:#fff; border:2px dashed #9ca3af; padding:4px 12px; color:#9ca3af; z-index:2;">null → undefined</div>
</div>

> **Summary.** A read checks own properties first, then walks up the prototype chain until it finds a match or hits `null`. Today a read only *finds* a value; the next idea turns a read into something that can *run* code.
