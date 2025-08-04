---
tags:
  - metappet
---

# Cweet

> Cweeting is a challenge to see what awesomeness you can create when limited to only 140
> characters of javascript and a console. Give it a go!

Cweets are wrapped in a function named `v` that's called a reasonable number of times per
second, clearing the console between each call:

```js
function v(t) {
  // 140 characters or less
}
```

You can use these variables:

- `t`: elapsed time in seconds.
- `c`: an alias to the global console object.
- `l`: `console.log`
- `S`: Math.sin
- `C`: Math.cos
- `T`: Math.tan
- `R`: Generates rgba-strings, ex.: R(255, 255, 255, 0.5)

<!-- see: dweet.md, projector.mjs -->
<!-- tags: coAIthored -->
