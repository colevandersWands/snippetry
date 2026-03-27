# Abstract Narrative Graph (ANG) Explorer

> Visualizing the human stories that live within code

## Vision

Code isn't just logic - it's a collection of human narratives, creative constraints, learning journeys, and conceptual explorations. The Abstract Narrative Graph protocol makes these overlapping stories visible and navigable.

## Architecture

### Hybrid Approach
- **D3.js**: Graph physics, spatial relationships, interactive forces
- **Component System**: Rich snippet rendering using abstract-snippet-tree patterns
- **ANG Protocol**: Cross-language narrative annotations within syntax

### Narrative Types
- **Variation Stories**: Multiple approaches to the same concept (`10-print.1.js` → `10-print.6.mjs`)
- **Constraint Stories**: Creative challenges (golf, dweets, 40-line limit)
- **Learning Stories**: Progressive complexity (🥚→🐔 progression)
- **Cross-Language Stories**: Same concept, different syntax (`.js` → `.py` → `.coem`)

### Link Types
- `forelink`: Prerequisites, setup
- `metalink`: Meta-commentary, analysis
- `aftlink`: Consequences, next steps
- `variation`: Alternative implementations
- `constraint`: Creative limitations
- `translation`: Cross-language equivalents

## Implementation Plan

1. **ANG Protocol**: Define annotation syntax within language comments
2. **Graph Engine**: D3-powered physics with narrative-aware layout algorithms
3. **Node Rendering**: Component-based snippet visualization
4. **Interactive Storytelling**: Path tracing through connected narratives
5. **Visual Language**: Color, size, motion that reflects narrative content

## Files

- `index.html`: Main exploration interface
- `ang-protocol.md`: Specification for narrative annotations
- `graph-engine.js`: D3-based visualization core
- `narrative-components.js`: Snippet rendering components
- `story-paths.js`: Interactive narrative navigation
- `visual-language.css`: Aesthetic system for narrative types