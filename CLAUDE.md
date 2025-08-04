# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Snippetry

40(ish) lines at a time. Because nothing stands a-lone.

## Commands (or: How to Tend Your Garden)

```bash
npm run host:dev    # where snippets come alive (and auto-reloads keep you sane)
npm run gather      # harvest the garden (may need updating)
npm run bundle      # squeeze it all together, nice and tight
npm run publish     # gather + bundle = ready to ship
npm run draft       # open study-lenses for when you need training wheels

# The emoji workshop (direct access):
node "gather/☝️.js" # open the $nippetry workshop - pure emoji processing
```

Server runs on :4567 (that's one more than :4566).

## Architecture (or: How the Sausage Gets Linked)

### The Flow

1. **Snippets live** in `/snippets/` - wild and free, any language they please
2. **Workshop processes** everything through emoji-only methods (seriously)
3. **Bundle squeezes** the frontend into tiny packages
4. **API serves** from memory (because disk is so last season)
5. **Snips float** between snippets like punctuation in a run-on sentence

### The $nippetry Workshop (or: Snippetry Processing Gone Wild)

- **💭.js** - The central brain (just a thought bubble, but it thinks big)
- **☝️.js** - The orchestrator (points the way to emoji enlightenment)
- **✂️.js, 🧵.js, 🪡.js** - Tailoring tools (cutting, threading, stitching)
- **🗄️/** - Language interpreters (🟨 for JS, 🐍 for Python, etc.)
- **Secret utilities** - 🔮, 🧙, 🕵️ (for when things get mysterious)

### The Constraint

- 40 lines: somewhere between a haiku and a short story
- Small enough to hold in your head
- Big enough to do something interesting
- Just right for a snippet (hence the name, get it?)

## File Patterns (or: Name Games)

- `something.js` - a regular snippet
- `something.draft.js` - still working on it (draft = not raft)
- `something.sandbox.js` - playground edition
- `something.js.docs.md` - when code needs explaining
- `something.dweet.js` - code golf, but make it tweet-sized

## The Secret Sauce

### Everything Links

- Imports, inspirations, variations, remixes
- The gather process finds them all
- Tags are optional, connections are inevitable
- Lost? Check `mijn-kat.txt` - it catches everything

### Snips Are Special

- They live in `/snips.txt`, separated by `-snip-`
- They appear randomly between snippets in the UI
- Like fortune cookies, but less crunchy

### Key Files to Meet

- `turtles-all-the-way-down.*` - recursive humor in 16+ flavors
- `garden.txt` - where the metaphor grows
- `mijn-kat.txt` - the default 404 handler (purr-fect)
- `be.*` - same message, many languages (it's very multi-lingual)
- `cat-detector.*` - because every codebase needs one

## Development Tips (or: How Not to Break Things)

### Adding Snippets

1. Drop a file in `/snippets/`
2. Keep it under 40(ish) lines (ish doing heavy lifting)
3. Run `node "gather/☝️.js"` to process through the emoji workshop
4. Optional: add frontmatter tags if you're feeling organized
5. Watch for emoji magic in the console output (✂️, 🧵, 🎨, etc.)

### Frontend Changes

1. Edit files in `/public/src/`
2. Run `npm run bundle` (or let `host:dev` do it)
3. State lives in the URL - no localStorage surprises
4. Follow the existing patterns (they're there for a reason)

### API Notes

- Everything is pre-generated JSON
- No database, just files all the way down
- `/api/snippets/filename.ext` returns raw content
- `/api/*` returns `mijn-kat.txt` when confused

### Workshop Secrets (or: Emoji Debugging for the Brave)

- The workshop has hidden utilities: `$nippetry['🔮']['👁️']()` for state inspection
- Magic scissors: `$nippetry['✂️']['🎭']()` for dramatic cuts
- Web whisperer: `$nippetry['🧵']['🕷️']()` reveals connection secrets
- All methods are emoji-only (no exceptions, no escape)
- Turtle snippets get special theatrical treatment (10% random chance for others)

## Philosophy (or: Why 40?)

It's not about limitation, it's about focus. A snippet should be:

- Complete enough to run
- Small enough to understand
- Connected enough to inspire

Like this README - just about 40(ish) sections of documentation. (Okay, that's a stretch,
but you get the idea.)

## In Conclusion

Go explore. Read some snippets. Write some snippets. Find the patterns. Make new ones. Try
the emoji workshop (if you dare). And remember: when in doubt, check the cat.

_P.S. The gather process now runs entirely on emoji methods. This is not a joke._
