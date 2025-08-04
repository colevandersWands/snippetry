# `.docs.` Feature

## Overview

A system for associating documentation with snippets through filename conventions and
metalinks.

## Implementation

### File Convention

```
snippet.js          -> Source snippet
snippet.js.docs.md  -> MD docs for snippet.js
snippet.03.js.md.docs.html -> HTML docs for snippet.03.js.md
snippet.coem.docs.js.md    -> MD docs with embedded JS for snippet.coem
```

### Technical Details

- Docs files are automatically metalinked to their source
- Display titles include source links: `[snippet.js].docs.md`
- Tags added:
  - Source files tagged as `documentee`
  - Docs files tagged as `documenter`

### Code Changes

- `/gather/snippets/process-docs.js` - Main docs processing
- `/gather/snippets/index.js` - Pipeline integration
- `/public/src/abstract-snippet-tree/components/` - Frontend rendering

## Future Considerations

- Support for more documentation formats
- Enhanced preview rendering
- Documentation completeness checking
- Automated doc generation helpers

## Related

- Session: [2024-03-19 First Implementation](../sessions/2024-03-19-docs-feature.md)
- Pattern: [Documentation Patterns](../patterns/documentation.md)

† tags: AIthored, feature-spec, documentation, cursor-sessions
