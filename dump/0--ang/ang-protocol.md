# Abstract Narrative Graph (ANG) Protocol

## Overview

The ANG protocol enables embedding narrative relationships within source code using language-native comment syntax. This creates a machine-readable graph of human stories that emerge around software development.

## Syntax

### Basic ANG Annotation
```javascript
// ANG: narrative-type.concept.relationship -> target-file.ext
```

### Examples

```javascript
// ANG: exploration.recursion.infinite -> turtles-all-the-way-down.01.js
(function turtle() { turtle() })();

// ANG: constraint.golf.challenge -> cat-detector.golf.js  
// ANG: variation.implementation.readable -> cat-detector.be.js
let input = prompt('"cat" please');

// ANG: learning.progression.next -> 10-print.2.js
// tags: variation, beginner
const HEIGHT = 25;
const WIDTH = 50;
```

### Narrative Types

#### `exploration`
Conceptual investigations, experiments, "what if" questions
- `exploration.recursion.infinite`: Infinite recursion patterns
- `exploration.constraint.creative`: Creative limitations as catalysts
- `exploration.language.boundary`: Testing language limits

#### `variation` 
Multiple approaches to the same problem
- `variation.implementation.golf`: Code golf version
- `variation.implementation.readable`: Readable version  
- `variation.language.python`: Python translation
- `variation.strategy.recursive`: Recursive approach

#### `learning`
Educational progressions and scaffolding
- `learning.progression.next`: Next step in learning
- `learning.prerequisite.concept`: Required prior knowledge
- `learning.difficulty.advanced`: Advanced topic marker

#### `constraint`
Creative limitations and challenges
- `constraint.size.golf`: Character/line limits
- `constraint.time.dweet`: 60fps animation constraints
- `constraint.feature.je-js`: Language subset limitations

#### `translation`
Cross-language/medium expressions
- `translation.language.python`: Same concept, different syntax
- `translation.medium.visual`: Code to visual representation
- `translation.format.literate`: Literate programming version

### Relationship Types

- `->`: Points to related concept
- `<->`: Bidirectional relationship  
- `<-`: Inverse relationship
- `~>`: Suggests or inspires
- `!>`: Contrasts with or challenges

## Integration with Existing Link Types

ANG annotations complement existing snippetry link types:
- `forelinks`: Becomes `learning.prerequisite.concept`
- `metalinks`: Becomes `exploration.meta.analysis`  
- `aftlinks`: Becomes `learning.progression.next`

## Visual Encoding

### Node Styling
- **Size**: Based on narrative complexity (number of ANG relationships)
- **Color**: By primary narrative type
  - Exploration: Blue gradients
  - Variation: Green families
  - Learning: Orange progression
  - Constraint: Red intensity
  - Translation: Purple bridges

### Edge Styling  
- **Thickness**: Relationship strength (frequency of interaction)
- **Style**: Relationship type
  - `->`: Solid arrow
  - `<->`: Double arrow
  - `~>`: Dashed suggestion
  - `!>`: Bold contrast

### Layout Algorithms
- **Exploration clusters**: Organic, branching layouts
- **Variation chains**: Linear progressions
- **Learning paths**: Hierarchical trees
- **Constraint networks**: Tight, compressed layouts

## Implementation Notes

### Parser Design
1. Extract ANG annotations from comments
2. Parse narrative type and relationship
3. Resolve file references
4. Build narrative graph structure
5. Integrate with existing link data

### Component Integration  
- Extend abstract-snippet-tree components with narrative context
- Add ANG navigation to snippet headers
- Implement narrative path highlighting
- Create narrative type indicators

### Performance Considerations
- Lazy-load narrative subgraphs
- Cache parsed ANG relationships
- Optimize for real-time exploration
- Support incremental updates

## Future Extensions

### Temporal Narratives
```javascript
// ANG: evolution.refactor.v2 -> cat-detector.draft-2.js
// ANG: timeline.2024-01.experiment -> new-feature-exploration.js
```

### Collaborative Narratives  
```javascript
// ANG: authorship.collaborative.claude -> cat-detector.coAIthored.js
// ANG: perspective.pedagogical.instructor -> teaching-version.js
```

### Cross-Repository Narratives
```javascript
// ANG: inspiration.external.source -> https://github.com/user/repo/file.js
// ANG: reference.academic.paper -> doi:10.1000/citation
```